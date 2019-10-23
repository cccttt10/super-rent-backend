const tryAsync = require('../../util/tryAsync');
const getAllRents = require('./getAllRents');
const getRent = require('./getRent');
const updateRent = require('./updateRent');
const deleteRent = require('./deleteRent');
const createRent = require('./createRent');
const validateRent = tryAsync(require('./validateRent'));

module.exports = {
    getAllRents,
    getRent,
    updateRent,
    deleteRent,
    createRent,
    validateRent
};
