const mongoose = require('mongoose');
const { MONGO_URI } = require('../config/secrets');
const FileModel = require('../model/fileModel');
const {
  cleanupExpiredFiles,
  removeLegacyTtlIndex,
  startFileCleanupTask,
} = require('../services/fileCleanupService');

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    await removeLegacyTtlIndex();
    await FileModel.syncIndexes();
    await cleanupExpiredFiles();
    startFileCleanupTask();
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
