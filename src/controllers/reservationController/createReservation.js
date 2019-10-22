const _db = require('../../db').getDb();
const uuid = require('uuid/v4');

const createReservation = async (req, res, next) => {
    // prepare query
    const confNum = uuid();
    const { vehicleTypeName, driversLicence } = req.body;
    const fromDate = req.body.fromDate.split('T')[0];
    const toDate = req.body.toDate.split('T')[0];

    // send query
    let results = await _db.query(
        `
            INSERT INTO reservations(confNum, vehicleTypeName, driversLicence, fromDate, toDate)
            VALUES("${confNum}", "${vehicleTypeName}", "${driversLicence}", 
                STR_TO_DATE("${fromDate}", "%Y-%m-%d"), STR_TO_DATE("${toDate}", "%Y-%m-%d"));
        `
    );
    results = await _db.query(
        `SELECT * FROM reservations WHERE confNum = '${confNum}';`
    );

    // prepare response
    results = JSON.parse(JSON.stringify(results));
    const createdReservation = results[0][0];
    createdReservation.id = createdReservation.confNum;

    // send response
    res.status(201).json(createdReservation);
};

module.exports = createReservation;
