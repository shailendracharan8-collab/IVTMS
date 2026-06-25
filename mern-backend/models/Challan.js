const mongoose = require('mongoose');

const challanSchema = new mongoose.Schema({
  challanId: {
    type: String,
    required: true,
    unique: true,
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Inspector who issued it
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Unpaid', 'Paid'],
    default: 'Unpaid',
  },
}, { timestamps: true });

module.exports = mongoose.model('Challan', challanSchema);
