const _db = require('../../db').getDb();

const updateRent = async (req, res, next) => {
    // prepare query
    const rentId = req.params.id;
    const { vehicleLicence, driversLicence } = req.body;
    const fromDate = req.body.fromDate.split('T')[0];
    const toDate = req.body.toDate.split('T')[0];
    const confNum = req.body.confNum;
    const query = confNum
        ? `
            UPDATE rents
            SET vehicleLicence = "${vehicleLicence}", 
                driversLicence = "${driversLicence}",
                fromDate = STR_TO_DATE("${fromDate}", "%Y-%m-%d"),
                toDate = STR_TO_DATE("${toDate}", "%Y-%m-%d"),
                confNum = "${confNum}"
                WHERE rentId = '${rentId}';
        `
        : `
            UPDATE rents
            SET vehicleLicence = "${vehicleLicence}", 
                driversLicence = "${driversLicence}",
                fromDate = STR_TO_DATE("${fromDate}", "%Y-%m-%d"),
                toDate = STR_TO_DATE("${toDate}", "%Y-%m-%d"),
                confNum = NULL
                WHERE rentId = '${rentId}';
        `;

    // send query
    await _db.query(query);
    let results = await _db.query(`SELECT * FROM rents WHERE rentId = '${rentId}';`);

    // prepare response
    results = JSON.parse(JSON.stringify(results));
    const updatedRent = results[0][0];
    updatedRent.id = updatedRent.rentId;

    // send response
    res.status(200)
        .set({
            'X-Total-Count': 1,
            'Access-Control-Expose-Headers': ['X-Total-Count']
        })
        .json(updatedRent);
};

module.exports = updateRent;
