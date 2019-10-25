const express = require('express');
const reportController = require('../controllers/reportController/');

const router = express.Router();

router.get('/rents', reportController.reportDailyRents);

module.exports = router;
