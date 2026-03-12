const path = require('path');
const fs = require('fs');
const FileModel = require('../model/fileModel');
const HistoryModel = require('../model/historyModel');
const { sendEmail } = require('../services/emailService');
const { sendSMS } = require('../services/smsService');
const { BASE_URL } = require('../config/secrets');

const uploadFiles = async (req, res) => {
  try {
    const { userId, email, phone } = req.body;

    if (!userId) {
      return res.status(400).json({ status: 400, message: 'userId is required' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ status: 400, message: 'No files uploaded' });
    }

    const ipAddress = req.ip || req.connection.remoteAddress;

    const savedFiles = await Promise.all(
      req.files.map(async (file) => {
        const newFile = new FileModel({
          name: file.filename,
          userId,
          ipAddress,
          path: file.path,
          size: file.size,
          originalName: file.originalname,
        });
        return await newFile.save();
      })
    );

    const downloadLinks = savedFiles.map(
      (f) => `${BASE_URL}/download/${f.name}`
    );

    const fileNames = savedFiles.map((f) => f.originalName);

    // Save to history
    await Promise.all(
      savedFiles.map((f) =>
        new HistoryModel({
          userId,
          type: 'file',
          refId: userId,
          title: f.originalName,
        }).save()
      )
    );

    // Send email if provided
    if (email) {
      try {
        await sendEmail(email, downloadLinks, fileNames);
      } catch (emailErr) {
        console.error('Email send failed:', emailErr.message);
      }
    }

    // Send SMS if provided
    if (phone) {
      try {
        const shareLink = `${BASE_URL}/${userId}`;
        await sendSMS(phone, shareLink);
      } catch (smsErr) {
        console.error('SMS send failed:', smsErr.message);
      }
    }

    return res.status(200).json({
      status: 200,
      userId,
      downloadLinks,
      fileNames,
      message: 'Files uploaded successfully',
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ status: 500, message: 'Internal server error' });
  }
};

const getFilesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const files = await FileModel.find({ userId }).sort({ createdAt: -1 });

    if (!files || files.length === 0) {
      return res.status(404).json({ status: 404, message: 'No files found for this user' });
    }

    const filesWithLinks = files.map((f) => ({
      _id: f._id,
      originalName: f.originalName,
      size: f.size,
      downloadLink: `${BASE_URL}/download/${f.name}`,
      createdAt: f.createdAt,
    }));

    return res.status(200).json({ status: 200, files: filesWithLinks });
  } catch (err) {
    console.error('Get files error:', err);
    return res.status(500).json({ status: 500, message: 'Internal server error' });
  }
};

const downloadFile = async (req, res) => {
  try {
    const { fileName } = req.params;
    const filePath = path.join(__dirname, '..', 'uploads', fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).render('linkExpired');
    }

    return res.download(filePath);
  } catch (err) {
    console.error('Download error:', err);
    return res.status(500).render('linkExpired');
  }
};

module.exports = { uploadFiles, getFilesByUserId, downloadFile };
