const express = require('express');
const customerController = require('../controllers/customerController');

const router = express.Router();

router.route('/').get(customerController.getAllCustomers);

module.exports = router;