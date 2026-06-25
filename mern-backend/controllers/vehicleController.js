const Vehicle = require('../models/Vehicle');

exports.registerVehicle = async (req, res) => {
  try {
    const { rcNumber, make, model, year, fuelType, permitScope } = req.body;
    
    const vehicle = await Vehicle.create({
      rcNumber: rcNumber.toUpperCase(),
      owner: req.user._id,
      make,
      model,
      year,
      fuelType,
      permitScope,
      pucExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year from now
      insuranceExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    });

    res.status(201).json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user._id });
    res.json(vehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('owner', 'fullName email');
    res.json(vehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.uploadVehicleDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { docType } = req.body;
    if (!['RC', 'Insurance', 'PUC', 'Other'].includes(docType)) {
      return res.status(400).json({ message: 'Invalid document type' });
    }

    const vehicle = await Vehicle.findOne({ _id: req.params.id, owner: req.user._id });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found or unauthorized' });
    }

    const newDoc = {
      docType,
      fileName: req.file.filename,
      url: `/uploads/${req.file.filename}`
    };

    vehicle.documents.push(newDoc);
    await vehicle.save();

    res.status(201).json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found or unauthorized' });
    }
    res.json({ message: 'Vehicle removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateVehiclePuc = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ rcNumber: req.params.rc.toUpperCase() });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    const now = new Date();
    vehicle.pucExpiry = new Date(now.setMonth(now.getMonth() + 6));
    await vehicle.save();
    res.json({ message: 'Certificate generated and PUC extended successfully', vehicle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
