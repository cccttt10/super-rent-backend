const _db = require('../../db').getDb();
const log = require('../../util/log');

const getAllVehicles = async (req, res, next) => {
    // prepare query
    let query =
        'SELECT * FROM vehicles as V INNER JOIN vehicleTypes USING (vehicleTypeName)';

    // prepare query: filtering based on city, vehicle type, to / from dates
    const city = req.query.city ? req.query.city : null;
    const vehicleTypeName = req.query.vehicleTypeName
        ? req.query.vehicleTypeName
        : null;
    const fromDate = req.query.fromDate ? req.query.fromDate : null;
    const toDate = req.query.toDate ? req.query.toDate : null;
    query += ` 
        WHERE V.city <> "just a placeholder"
               ${city !== null ? ` AND V.city = "${city}"` : ''}
               ${
                   vehicleTypeName !== null
                       ? ` AND V.vehicleTypeName = "${vehicleTypeName}"`
                       : ''
               }
               ${
                   fromDate !== null && toDate !== null
                       ? ` AND V.status <> "maintenance"
                                                            AND V.vehicleLicence NOT IN 
                                                                                 (SELECT R.vehicleLicence from rents as R 
                                                                                 WHERE "${fromDate}" < R.toDate 
                                                                                       AND "${toDate}" > R.fromDate)`
                       : ''
               }
    `;

    log.info(query);

    // prepare query: sorting
    if (req.query._sort && req.query._order) {
        const sort = req.query._sort === 'id' ? 'vehicleLicence' : req.query._sort;
        const order = req.query._order;
        query += ` ORDER BY ${sort} ${order}`;
    }

    // prepare query: pagination
    if (req.query._start && req.query._end) {
        const start = req.query._start;
        const end = req.query._end;
        const numRows = end - start;
        query += ` LIMIT ${start}, ${numRows}`;
    }

    // send query
    let results = await _db.query(query);

    // prepare response
    results = JSON.parse(JSON.stringify(results));
    let vehicles = results[0];
    // const totalCount = vehicles.length;
    vehicles = vehicles.map(vehicle => {
        vehicle.id = vehicle.vehicleLicence;
        return vehicle;
    });

    results = await _db.query('SELECT COUNT(*) FROM vehicles');
    results = JSON.parse(JSON.stringify(results));
    const numVehicles = results[0][0]['COUNT(*)'];

    // send response
    res.status(200)
        .set({
            'X-Total-Count': numVehicles,
            'Access-Control-Expose-Headers': ['X-Total-Count']
        })
        .json(vehicles);
};

module.exports = getAllVehicles;
