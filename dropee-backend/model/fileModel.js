const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    ipAddress: { type: String },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    originalName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// TTL index: auto-delete after 15 days
fileSchema.index({ createdAt: 1 }, { expireAfterSeconds: 15 * 24 * 60 * 60 });

module.exports = mongoose.model('File', fileSchema);
