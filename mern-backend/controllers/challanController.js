const Challan = require('../models/Challan');
const Vehicle = require('../models/Vehicle');

exports.generateChallan = async (req, res) => {
  try {
    const { rcNumber, reason, amount } = req.body;
    
    const vehicle = await Vehicle.findOne({ rcNumber: rcNumber.toUpperCase() });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found in database' });
    }

    const challanId = `CHL-${Math.floor(10000 + Math.random() * 90000)}`;

    const challan = await Challan.create({
      challanId,
      vehicle: vehicle._id,
      issuedBy: req.user._id,
      reason,
      amount,
    });

    res.status(201).json(challan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getChallans = async (req, res) => {
  try {
    const challans = await Challan.find().populate('vehicle', 'rcNumber').sort({ createdAt: -1 });
    res.json(challans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getMyChallans = async (req, res) => {
  try {
    const myVehicles = await Vehicle.find({ owner: req.user._id });
    const vehicleIds = myVehicles.map(v => v._id);
    
    const challans = await Challan.find({ vehicle: { $in: vehicleIds } }).populate('vehicle', 'rcNumber make model').sort({ createdAt: -1 });
    res.json(challans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.payChallan = async (req, res) => {
  try {
    const challan = await Challan.findById(req.params.id).populate('vehicle');
    
    if (!challan) {
      return res.status(404).json({ message: 'Challan not found' });
    }

    if (challan.vehicle.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    challan.status = 'Paid';
    await challan.save();

    res.json(challan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
