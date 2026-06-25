const Message = require('../models/Message');

exports.submitMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = await Message.create({ name, email, message });
    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
