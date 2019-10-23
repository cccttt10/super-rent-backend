const express = require('express');
const rentController = require('../controllers/rentController/');

const router = express.Router();

router
    .route('/')
    .get(rentController.getAllRents)
    .post(rentController.validateRent, rentController.createRent);
router
    .route('/:id')
    .get(rentController.getRent)
    .put(rentController.validateRent, rentController.updateRent)
    .delete(rentController.deleteRent);

module.exports = router;
