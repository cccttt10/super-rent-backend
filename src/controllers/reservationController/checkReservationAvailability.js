const _db = require('../../db').getDb();
const log = require('../../util/log');
const SuperRentError = require('../../util/SuperRentError');

const checkReservationAvailability = async (req, res, next) => {
    log.info('Checking if reservation is possible...');
    const fromDate = req.body.fromDate;
    const toDate = req.body.toDate;
    const vehicleTypeName = req.body.vehicleTypeName;
    const queryString = `
        SELECT V.vehicleLicence from vehicles as V 
        WHERE V.vehicleTypeName = "${vehicleTypeName}" 
              AND V.status <> "maintenance" 
              AND V.vehicleLicence NOT IN 
                                  (SELECT R.vehicleLicence from rents as R 
                                   WHERE "${fromDate}" < R.toDate 
                                         AND "${toDate}" > R.fromDate);
    `;
    let results = await _db.query(queryString);
    results = JSON.parse(JSON.stringify(results));
    log.info(`You want to reserve a ${vehicleTypeName} 
              between ${fromDate.split('T')[0]} 
              and ${toDate.split('T')[0]}.
              The following ${vehicleTypeName}s are available
              (i.e. not maintenance or rented) during this time range:`);
    // licences of available vehicles
    const availableVehicles = results[0].map(e => {
        log.info(e.vehicleLicence);
        return e.vehicleLicence;
    });
    if (availableVehicles.length === 0)
        throw new SuperRentError({
            message: `Sorry there are no available 
            ${vehicleTypeName.toLowerCase()} vehicles
            between ${fromDate.split('T')[0]} and ${toDate.split('T')[0]}`,
            statusCode: 500
        });
    return next();
};

module.exports = checkReservationAvailability;
