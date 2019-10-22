const _db = require('../../db').getDb();
const log = require('../../util/log');
const moment = require('moment');

// eslint-disable-next-line no-unused-vars
const updateVehicleAvailability = async (req, res, next) => {
    const today = moment().format('YYYY-MM-DD');
    let results = await _db.query(
        `SELECT * FROM rents where "${today}" >= fromDate AND "${today}" <= toDate`
    );
    results = JSON.parse(JSON.stringify(results));
    let rents = results[0];
    const rentedVehicles = rents.map(rent => rent.vehicleLicence);

    log.info('The following vehicles are rented (not available) today.');
    // eslint-disable-next-line no-console
    console.log(rentedVehicles);
    if (rentedVehicles.length === 0) return next();

    let updateAvailabilityQuery = '';
    for (const rentedVehicle of rentedVehicles) {
        updateAvailabilityQuery += `UPDATE vehicles SET status = "rented" where vehicleLicence = "${rentedVehicle}";`;
    }
    await _db.query(updateAvailabilityQuery);
    return next();
};

module.exports = updateVehicleAvailability;
