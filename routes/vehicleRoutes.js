const express = require('express');
const vehicleController = require('../controllers/vehicleController');

const router = express.Router();

router.route('/').get(vehicleController.getAllVehicles);

module.exports = router;
