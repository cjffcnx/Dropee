const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { getHistory } = require('../controller/historyController');

const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { status: 429, message: 'Too many requests. Please try again later.' },
});

router.get('/:userId', readLimiter, getHistory);

module.exports = router;
