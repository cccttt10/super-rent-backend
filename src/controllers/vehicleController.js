const _db = require('../db').getDb();
const log = require('../util/log');

exports.getAllVehicles = async (req, res, next) => {
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
    const totalCount = vehicles.length;
    vehicles = vehicles.map(vehicle => {
        vehicle.id = vehicle.vehicleLicence;
        return vehicle;
    });

    // send response
    res.status(200)
        .set({
            'X-Total-Count': totalCount,
            'Access-Control-Expose-Headers': ['X-Total-Count']
        })
        .json(vehicles);
};

exports.getVehicle = async (req, res, next) => {
    // prepare & send query
    const vehicleLicence = req.params.id;
    let results = await _db.query(
        `SELECT * FROM vehicles where vehicleLicence = "${vehicleLicence}";`
    );

    // prepare response
    results = JSON.parse(JSON.stringify(results));
    const vehicle = results[0][0];
    vehicle.id = vehicle.vehicleLicence;

    // send response
    res.status(200)
        .set({
            'X-Total-Count': 1,
            'Access-Control-Expose-Headers': ['X-Total-Count']
        })
        .json(vehicle);
};

exports.updateVehicle = async (req, res, next) => {
    // prepare query
    const prevvehicleLicence = req.params.id;
    const {
        vehicleLicence,
        make,
        model,
        year,
        color,
        status,
        vehicleTypeName,
        location,
        city
    } = req.body;

    // send query
    await _db.query(
        `
            UPDATE vehicles
            SET vehicleLicence = "${vehicleLicence}",
                make = "${make}",
                model = "${model}",
                year = ${year},
                color = "${color}",
                status = "${status}",
                vehicleTypeName = "${vehicleTypeName}",
                location = "${location}",
                city = "${city}"
                WHERE vehicleLicence = '${prevvehicleLicence}';
        `
    );
    let results = await _db.query(
        `SELECT * FROM vehicles WHERE vehicleLicence = '${vehicleLicence}';`
    );

    // prepare response
    results = JSON.parse(JSON.stringify(results));
    const updatedVehicle = results[0][0];
    updatedVehicle.id = updatedVehicle.vehicleLicence;

    // send response
    res.status(200)
        .set({
            'X-Total-Count': 1,
            'Access-Control-Expose-Headers': ['X-Total-Count']
        })
        .json(updatedVehicle);
};

exports.deleteVehicle = async (req, res, next) => {
    // prepare & send query
    const vehicleLicence = req.params.id;
    await _db.query(
        `DELETE FROM vehicles WHERE vehicleLicence ='${vehicleLicence}'`
    );

    // send response
    res.status(204).json(null);
};

exports.createVehicle = async (req, res, next) => {
    // prepare query
    const {
        vehicleLicence,
        make,
        model,
        year,
        color,
        status,
        vehicleTypeName,
        location,
        city
    } = req.body;

    // send query
    let results = await _db.query(
        `
            INSERT INTO vehicles(vehicleLicence, make, model, year, color, status, vehicleTypeName, location, city)
            VALUES(${vehicleLicence}, "${make}", "${model}", ${year}, "${color}", "${status}", "${vehicleTypeName}", "${location}", "${city}");
        `
    );
    results = await _db.query(
        `SELECT * FROM vehicles WHERE vehicleLicence = '${vehicleLicence}';`
    );

    // prepare response
    results = JSON.parse(JSON.stringify(results));
    const createdVehicle = results[0][0];
    createdVehicle.id = createdVehicle.vehicleLicence;

    // send response
    res.status(201).json(createdVehicle);
};
