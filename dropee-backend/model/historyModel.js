const mongoose = require('mongoose');

const historySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    type: { type: String, enum: ['file', 'code'], required: true },
    refId: { type: String, required: true },
    title: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('History', historySchema);
