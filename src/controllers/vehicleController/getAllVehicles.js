const _db = require('../../db').getDb();
const log = require('../../util/log');

const getAllVehicles = async (req, res, next) => {
    // prepare query
    let query =
        'SELECT * FROM vehicles INNER JOIN vehicleTypes USING (vehicleTypeName)';

    // prepare query: filtering based on city and vehicle type
    if (req.query.city && !req.query.vehicleTypeName) {
        const city = req.query.city;
        query += ` WHERE city = "${city}"`;
    }

    if (!req.query.city && req.query.vehicleTypeName) {
        const vehicleTypeName = req.query.vehicleTypeName;
        query += ` WHERE vehicleTypeName = "${vehicleTypeName}"`;
    }

    if (req.query.city && req.query.vehicleTypeName) {
        const { city, vehicleTypeName } = req.query;
        query += ` WHERE city = "${city}" AND vehicleTypeName = "${vehicleTypeName}"`;
    }

    // TODO - filtering based on to and / or from dates
    if (req.query.fromDate && req.query.toDate) {
        // keep the substring before 'T'
        //  e.g. 2019-11-01T07%3A00%3A00.000Z ---> '2019-11-01'
        const from = req.query.fromDate.split('T')[0];
        const to = req.query.toDate.split('T')[0];
        log.info(`From: ${from}`);
        log.info(`To: ${to}`);
    }

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
    // log.info(`There are ${numVehicles} vehicles`);

    // send response
    res.status(200)
        .set({
            'X-Total-Count': numVehicles,
            'Access-Control-Expose-Headers': ['X-Total-Count']
        })
        .json(vehicles);
};

module.exports = getAllVehicles;
