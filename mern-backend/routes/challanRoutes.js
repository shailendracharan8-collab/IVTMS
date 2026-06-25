const express = require('express');
const router = express.Router();
const { generateChallan, getChallans, getMyChallans, payChallan } = require('../controllers/challanController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, authorize('INSPECTOR', 'ADMIN'), generateChallan)
  .get(protect, authorize('ADMIN', 'RTO', 'INSPECTOR'), getChallans);

router.route('/my').get(protect, authorize('CITIZEN'), getMyChallans);
router.route('/:id/pay').put(protect, authorize('CITIZEN'), payChallan);

module.exports = router;
