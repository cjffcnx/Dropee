const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { PORT } = require('./config/secrets');
const connectDB = require('./database/dbConfig');
const fileRoute = require('./route/fileRoute');
const codeRoute = require('./route/codeRoute');
const historyRoute = require('./route/historyRoute');
const { getFilesByUserId, downloadFile } = require('./controller/fileController');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set EJS as view engine for expired link page
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ensure uploads directory exists
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// API Routes
app.use('/api/v1/files', fileRoute);
app.use('/api/v1/code', codeRoute);
app.use('/api/v1/history', historyRoute);

// File download route
const downloadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Too many download requests. Please try again later.',
});
app.get('/download/:fileName', downloadLimiter, downloadFile);

// View shared files by userId (short URL)
const userIdLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { status: 429, message: 'Too many requests. Please try again later.' },
});
app.get('/:userId', (req, res, next) => {
  const { userId } = req.params;
  // Skip if this looks like a static file or API route
  if (userId.startsWith('api') || userId.includes('.')) {
    return next();
  }
  return userIdLimiter(req, res, () => getFilesByUserId(req, res));
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ status: 404, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ status: 500, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Dropee server running on http://localhost:${PORT}`);
});

module.exports = app;
