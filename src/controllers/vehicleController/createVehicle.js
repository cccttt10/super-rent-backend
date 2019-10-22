const _db = require('../../db').getDb();

const createVehicle = async (req, res, next) => {
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

module.exports = createVehicle;
