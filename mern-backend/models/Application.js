const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  appId: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['New Registration', 'Ownership Transfer', 'PUC Renewal', 'Commercial Permit', 'Insurance Renewal'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  details: {
    type: mongoose.Schema.Types.Mixed, // flexible for different types
  },
  actionBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // RTO Officer who acted
  },
  remarks: String,
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
