const express = require('express');
const router = express.Router();
const upload = require('../services/multerConfig');
const { uploadFiles, getFilesByUserId } = require('../controller/fileController');
const rateLimit = require('express-rate-limit');

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { status: 429, message: 'Too many uploads. Please try again in 15 minutes.' },
});

const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { status: 429, message: 'Too many requests. Please try again later.' },
});

router.post('/sendFile', uploadLimiter, upload.array('files', 20), uploadFiles);
router.get('/:userId', readLimiter, getFilesByUserId);

module.exports = router;
