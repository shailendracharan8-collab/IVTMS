const Alert = require('../models/Alert');

exports.createAlert = async (req, res) => {
  try {
    const { citizenId, vehicleId, type, message } = req.body;
    const alert = await Alert.create({
      citizen: citizenId,
      vehicle: vehicleId,
      type,
      message,
    });
    res.status(201).json(alert);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getMyAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ citizen: req.user._id, isRead: false })
      .populate('vehicle', 'rcNumber make model')
      .sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const alert = await Alert.findOne({ _id: req.params.id, citizen: req.user._id });
    if (alert) {
      alert.isRead = true;
      await alert.save();
      res.json({ message: 'Alert marked as read' });
    } else {
      res.status(404).json({ message: 'Alert not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
