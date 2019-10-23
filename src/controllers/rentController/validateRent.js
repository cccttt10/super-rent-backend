const _db = require('../../db').getDb();
const SuperRentError = require('../../util/SuperRentError');

const validateRent = async (req, res, next) => {
    const vehicleLicence = req.body.vehicleLicence;
    const confNum = req.body.confNum;
    let results;

    if (req.method === 'PUT') {
        const rentId = req.params.id;
        results = await _db.query(`SELECT * from rents where rentId = "${rentId}"`);
        results = JSON.parse(JSON.stringify(results));
        const prevVehicleLicence = results[0][0].vehicleLicence;
        const prevConfNum = results[0][0].confNum;
        if (vehicleLicence !== prevVehicleLicence)
            await validateVehicleLicence(vehicleLicence);
        if (confNum !== prevConfNum) await validateConfNum(confNum);
        return next();
    } else if (req.method === 'POST') {
        await validateVehicleLicence(vehicleLicence);
        await validateConfNum(confNum);
        return next();
    }
};

const validateVehicleLicence = async vehicleLicence => {
    let results;
    results = await _db.query(
        `SELECT status from vehicles where vehicleLicence = "${vehicleLicence}";`
    );
    results = JSON.parse(JSON.stringify(results));
    const status = results[0][0].status;
    if (status !== 'available')
        throw new SuperRentError({
            message: `The vehicle you specified is currently ${status.toUpperCase()} ❎ Please rent an available vehicle instead`,
            statusCode: 500
        });
};

const validateConfNum = async confNum => {
    let results;
    results = await _db.query(
        `SELECT COUNT(*) FROM rents where confNum = "${confNum}"`
    );
    results = JSON.parse(JSON.stringify(results));
    const numRents = results[0][0]['COUNT(*)'];
    const isDuplicateRent = numRents > 0;
    if (isDuplicateRent)
        throw new SuperRentError({
            message: `Your already rented a vehicle for reservation # ${confNum} ❎`,
            statusCode: 500
        });
};

module.exports = validateRent;
