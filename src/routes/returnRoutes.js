const express = require('express');
const returnController = require('../controllers/returnController');

const router = express.Router();

router
    .route('/')
    .get(returnController.getAllReturns)
    .post(returnController.createReturn);
router
    .route('/:id')
    .get(returnController.getReturn)
    .delete(returnController.deleteReturn);

module.exports = router;
