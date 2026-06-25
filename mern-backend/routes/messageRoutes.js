const express = require('express');
const router = express.Router();
const { submitMessage, getMessages } = require('../controllers/messageController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', submitMessage);
router.get('/', protect, authorize('ADMIN'), getMessages);

module.exports = router;
