const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateProfile, getAllUsers } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', protect, updateProfile);
router.get('/users', protect, authorize('ADMIN'), getAllUsers);

module.exports = router;
