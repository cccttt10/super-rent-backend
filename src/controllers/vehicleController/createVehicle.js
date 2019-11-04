const _db = require('../../db').getDb();
const SuperRentError = require('../../util/SuperRentError');

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

    // check if vehicleLicence already exists
    let results = await _db.query(
        `SELECT COUNT(*) FROM vehicles WHERE vehicleLicence = "${vehicleLicence}";`
    );
    results = JSON.parse(JSON.stringify(results));
    const count = results[0][0]['COUNT(*)'];
    if (count > 0)
        throw new SuperRentError({
            message: `There is already a vehicle with vehicle licence ${vehicleLicence} ❎`,
            statusCode: 500
        });

    // send query
    results = await _db.query(
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
