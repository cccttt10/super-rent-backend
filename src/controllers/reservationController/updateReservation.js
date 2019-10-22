const _db = require('../../db').getDb();

const updateReservation = async (req, res, next) => {
    // prepare query
    const confNum = req.params.id;
    const { vehicleTypeName, driversLicence } = req.body;
    const fromDate = req.body.fromDate.split('T')[0];
    const toDate = req.body.toDate.split('T')[0];

    // send query
    await _db.query(
        `
                UPDATE reservations
                SET vehicleTypeName = "${vehicleTypeName}", 
                    driversLicence = "${driversLicence}",
                    fromDate = STR_TO_DATE("${fromDate}", "%Y-%m-%d"),
                    toDate = STR_TO_DATE("${toDate}", "%Y-%m-%d")
                    WHERE confNum = '${confNum}';
            `
    );
    let results = await _db.query(
        `SELECT * FROM reservations WHERE confNum = '${confNum}';`
    );

    // prepare response
    results = JSON.parse(JSON.stringify(results));
    const updatedReservation = results[0][0];
    updatedReservation.id = updatedReservation.confNum;

    // send response
    res.status(200)
        .set({
            'X-Total-Count': 1,
            'Access-Control-Expose-Headers': ['X-Total-Count']
        })
        .json(updatedReservation);
};

module.exports = updateReservation;
