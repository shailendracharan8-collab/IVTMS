const express = require('express');
const router = express.Router();
const { registerVehicle, getMyVehicles, getAllVehicles, uploadVehicleDocument, deleteVehicle, updateVehiclePuc } = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .post(protect, authorize('CITIZEN', 'ADMIN'), registerVehicle)
  .get(protect, authorize('ADMIN', 'RTO', 'INSPECTOR'), getAllVehicles);

router.get('/my', protect, getMyVehicles);
router.post('/:id/documents', protect, authorize('CITIZEN', 'ADMIN'), upload.single('document'), uploadVehicleDocument);
router.delete('/:id', protect, authorize('CITIZEN', 'ADMIN'), deleteVehicle);
router.put('/puc/:rc', protect, authorize('INSPECTOR', 'ADMIN'), updateVehiclePuc);

module.exports = router;
