const tryAsync = require('../../util/tryAsync');
const getAllReservations = tryAsync(require('./getAllReservations'));
const getReservation = tryAsync(require('./getReservation'));
const updateReservation = tryAsync(require('./updateReservation'));
const deleteReservation = tryAsync(require('./deleteReservation'));
const createReservation = tryAsync(require('./createReservation'));

module.exports = {
    getAllReservations,
    getReservation,
    updateReservation,
    deleteReservation,
    createReservation
};
