const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { createSnippet, getSnippet } = require('../controller/codeController');

const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { status: 429, message: 'Too many requests. Please try again later.' },
});

router.post('/', createSnippet);
router.get('/:id', readLimiter, getSnippet);

module.exports = router;
