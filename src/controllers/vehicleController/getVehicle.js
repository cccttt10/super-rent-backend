const _db = require('../../db').getDb();

const getVehicle = async (req, res, next) => {
    // prepare & send query
    const vehicleLicence = req.params.id;
    let results = await _db.query(
        `SELECT * FROM (vehicles INNER JOIN vehicleTypes USING (vehicleTypeName)) WHERE vehicleLicence = "${vehicleLicence}";`
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

module.exports = getVehicle;
