const express = require('express');
const router = express.Router();
const { submitApplication, getMyApplications, getAllApplications, updateApplicationStatus } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, authorize('CITIZEN'), submitApplication)
  .get(protect, authorize('ADMIN', 'RTO'), getAllApplications);

router.get('/my', protect, getMyApplications);

router.put('/:id/status', protect, authorize('ADMIN', 'RTO'), updateApplicationStatus);

module.exports = router;
