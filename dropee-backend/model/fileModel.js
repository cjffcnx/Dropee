const mongoose = require('mongoose');

const FILE_TTL_MS = 15 * 24 * 60 * 60 * 1000;

const fileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    storageId: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    ipAddress: { type: String },
    size: { type: Number, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String },
    createdAt: { type: Date, default: Date.now },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + FILE_TTL_MS),
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('File', fileSchema);
