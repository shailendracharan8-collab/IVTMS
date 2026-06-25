const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ivtms_db')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const challanRoutes = require('./routes/challanRoutes');
const alertRoutes = require('./routes/alertRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/challans', challanRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
  res.send('IVTMS API is running');
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
