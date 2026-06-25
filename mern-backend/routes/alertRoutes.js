const express = require('express');
const router = express.Router();
const { createAlert, getMyAlerts, markAsRead } = require('../controllers/alertController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('RTO', 'ADMIN'), createAlert);
router.get('/my', protect, authorize('CITIZEN'), getMyAlerts);
router.put('/:id/read', protect, authorize('CITIZEN'), markAsRead);

module.exports = router;
