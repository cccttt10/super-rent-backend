const express = require('express');
const reportController = require('../controllers/reportController/');

const router = express.Router();

router.get('/rents/:date', reportController.reportDailyRents);

module.exports = router;
