const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  rcNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  fuelType: {
    type: String,
    enum: ['Petrol', 'Diesel', 'EV', 'CNG', 'Hybrid'],
    required: true,
  },
  permitScope: {
    type: String,
    enum: ['State', 'All India'],
    default: 'State'
  },
  status: {
    type: String,
    enum: ['Active', 'Suspended', 'Stolen'],
    default: 'Active',
  },
  pucExpiry: {
    type: Date,
  },
  insuranceExpiry: {
    type: Date,
  },
  documents: [{
    docType: { type: String, enum: ['RC', 'Insurance', 'PUC', 'Other'] },
    fileName: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
