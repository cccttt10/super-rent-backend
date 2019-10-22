const express = require('express');
const rentController = require('../controllers/rentController/');

const router = express.Router();

router
    .route('/')
    .get(rentController.getAllRents)
    .post(rentController.createRent);
router
    .route('/:id')
    .get(rentController.getRent)
    .put(rentController.updateRent)
    .delete(rentController.deleteRent);

module.exports = router;
