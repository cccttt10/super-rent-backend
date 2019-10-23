const tryAsync = require('../../util/tryAsync');
const getAllVehicles = tryAsync(require('./getAllVehicles'));
const getVehicle = tryAsync(require('./getVehicle'));
const updateVehicle = tryAsync(require('./updateVehicle'));
const deleteVehicle = tryAsync(require('./deleteVehicle'));
const createVehicle = tryAsync(require('./createVehicle'));
const updateVehicleAvailability = tryAsync(require('./updateVehicleAvailability'));

module.exports = {
    getAllVehicles,
    getVehicle,
    updateVehicle,
    deleteVehicle,
    createVehicle,
    updateVehicleAvailability
};
