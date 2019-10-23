const _db = require('../../db').getDb();

const validateRent = async (req, res, next) => {
    const vehicleLicence = req.body.vehicleLicence;
    const confNum = req.body.confNum;

    let results = await _db.query(
        `SELECT status from vehicles where vehicleLicence = "${vehicleLicence}";`
    );
    results = JSON.parse(JSON.stringify(results));
    const status = results[0][0].status;
    if (status !== 'available')
        return res.status(500).send({
            message: `The vehicle you specified is currently ${status.toUpperCase()} ❎ Please rent an available vehicle instead`
        });

    if (confNum) {
        results = await _db.query(
            `SELECT COUNT(*) FROM rents where confNum = "${confNum}"`
        );
        results = JSON.parse(JSON.stringify(results));
        const numRents = results[0][0]['COUNT(*)'];
        const isDuplicateRent = numRents > 0;
        if (isDuplicateRent)
            return res.status(500).send({
                message: `Your already rented a vehicle for reservation # ${confNum} ❎`
            });
    }

    return next();
};

module.exports = validateRent;
