const tryAsync = require('../../util/tryAsync');
const getAllRents = tryAsync(require('./getAllRents'));
const getRent = tryAsync(require('./getRent'));
const updateRent = tryAsync(require('./updateRent'));
const deleteRent = tryAsync(require('./deleteRent'));
const createRent = tryAsync(require('./createRent'));
const validateRent = tryAsync(require('./validateRent'));

module.exports = {
    getAllRents,
    getRent,
    updateRent,
    deleteRent,
    createRent,
    validateRent
};
