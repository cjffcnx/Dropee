const path = require('path');
const fs = require('fs');
const FileModel = require('../model/fileModel');
const HistoryModel = require('../model/historyModel');
const { sendEmail } = require('../services/emailService');
const { sendSMS } = require('../services/smsService');
const { cleanupExpiredFiles } = require('../services/fileCleanupService');
const {
  uploadFileFromDisk,
  deleteStoredFile,
  openDownloadStream,
} = require('../services/fileStorageService');
const { getBackendBaseUrl, getFrontendBaseUrl } = require('../utils/url');

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const removeTempFile = async (filePath) => {
  if (!filePath) {
    return;
  }

  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Failed to remove temp upload:', error.message);
    }
  }
};

const uploadFiles = async (req, res) => {
  try {
    const { userId, email, phone } = req.body;
    const shareTitle = req.body.shareTitle?.trim();

    if (!userId) {
      return res.status(400).json({ status: 400, message: 'userId is required' });
    }

    if (email && !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ status: 400, message: 'Invalid email address' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ status: 400, message: 'No files uploaded' });
    }

    const ipAddress = req.ip || req.connection.remoteAddress;
    await cleanupExpiredFiles();

    const savedFiles = await Promise.all(
      req.files.map(async (file) => {
        let storageId;

        try {
          const storedFile = await uploadFileFromDisk(file);
          storageId = storedFile.storageId;

          const newFile = new FileModel({
            name: file.filename,
            storageId,
            userId,
            ipAddress,
            size: file.size,
            originalName: file.originalname,
            mimeType: file.mimetype,
          });

          return await newFile.save();
        } catch (error) {
          if (storageId) {
            await deleteStoredFile(storageId).catch(() => { });
          }
          throw error;
        } finally {
          await removeTempFile(file.path);
        }
      })
    );

    const backendBaseUrl = getBackendBaseUrl(req);
    const frontendBaseUrl = getFrontendBaseUrl(req);

    const downloadLinks = savedFiles.map(
      (f) => `${backendBaseUrl}/download/${f.name}`
    );

    const fileNames = savedFiles.map((f) => f.originalName);

    // Save to history
    await Promise.all(
      savedFiles.map((f) =>
        new HistoryModel({
          userId,
          type: 'file',
          refId: userId,
          title: shareTitle ? `${shareTitle} • ${f.originalName}` : f.originalName,
        }).save()
      )
    );

    // Send email if provided
    if (email) {
      try {
        await sendEmail(email.trim(), downloadLinks, fileNames, shareTitle);
      } catch (emailErr) {
        console.error('Email send failed:', emailErr.message);
      }
    }

    // Send SMS if provided
    if (phone) {
      try {
        const shareLink = `${frontendBaseUrl}/${userId}`;
        await sendSMS(phone, shareLink, shareTitle);
      } catch (smsErr) {
        console.error('SMS send failed:', smsErr.message);
      }
    }

    return res.status(200).json({
      status: 200,
      userId,
      shareTitle,
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
    const files = await FileModel.find({
      userId,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });
    const backendBaseUrl = getBackendBaseUrl(req);

    if (!files || files.length === 0) {
      return res.status(404).json({ status: 404, message: 'No files found for this user' });
    }

    const filesWithLinks = files.map((f) => ({
      _id: f._id,
      originalName: f.originalName,
      size: f.size,
      downloadLink: `${backendBaseUrl}/download/${f.name}`,
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
    const file = await FileModel.findOne({
      name: fileName,
      expiresAt: { $gt: new Date() },
    });

    if (!file) {
      return res.status(404).render('linkExpired');
    }

    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.originalName)}"`);
    if (file.mimeType) {
      res.setHeader('Content-Type', file.mimeType);
    }

    const downloadStream = openDownloadStream(file.storageId);
    downloadStream.on('error', (error) => {
      console.error('Download stream error:', error.message);
      if (!res.headersSent) {
        return res.status(404).render('linkExpired');
      }
      res.end();
    });

    return downloadStream.pipe(res);
  } catch (err) {
    console.error('Download error:', err);
    return res.status(500).render('linkExpired');
  }
};

module.exports = { uploadFiles, getFilesByUserId, downloadFile };
