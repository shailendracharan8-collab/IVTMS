const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  citizen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  type: {
    type: String,
    enum: ['Insurance', 'PUC', 'Document', 'Other'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
