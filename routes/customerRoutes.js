const express = require('express');
const customerController = require('../controllers/customerController');

const router = express.Router();

router.route('/').get(customerController.getAllCustomers);
router.route('/:id').get(customerController.getCustomer);

module.exports = router;