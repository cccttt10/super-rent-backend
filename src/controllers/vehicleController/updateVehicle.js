const _db = require('../../db').getDb();

const updateVehicle = async (req, res, next) => {
    // prepare query
    const prevVehicleLicence = req.params.id;
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
                WHERE vehicleLicence = '${prevVehicleLicence}';
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

module.exports = updateVehicle;
