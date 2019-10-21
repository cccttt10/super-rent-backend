const express = require('express');
const reservationController = require('../controllers/reservationController');

const router = express.Router();

router
    .route('/')
    .get(reservationController.getAllReservations)
    .post(reservationController.createReservation);
router
    .route('/:id')
    .get(reservationController.getReservation)
    .put(reservationController.updateReservation)
    .delete(reservationController.deleteReservation);

module.exports = router;
