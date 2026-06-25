const Application = require('../models/Application');

exports.submitApplication = async (req, res) => {
  try {
    const { type, details } = req.body;
    
    // Generate unique APP id
    const appId = `APP-${Math.floor(10000 + Math.random() * 90000)}`;

    const application = await Application.create({
      appId,
      user: req.user._id,
      type,
      details,
    });

    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(apps);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const apps = await Application.find().populate('user', 'fullName').sort({ createdAt: -1 });
    res.json(apps);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    application.remarks = remarks;
    application.actionBy = req.user._id;

    await application.save();
    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
