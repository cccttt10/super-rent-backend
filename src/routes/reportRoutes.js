const express = require('express');
const reportController = require('../controllers/reportController/');

const router = express.Router();

router.get('/rents', reportController.reportDailyRents);
router.get('/returns', reportController.reportDailyReturns);

module.exports = router;
