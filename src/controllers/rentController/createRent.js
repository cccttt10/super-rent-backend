const _db = require('../../db').getDb();
const uuid = require('uuid/v4');

const createRent = async (req, res, next) => {
    // prepare query
    const rentId = uuid();
    const { vehicleLicence, driversLicence } = req.body;
    const fromDate = req.body.fromDate.split('T')[0];
    const toDate = req.body.toDate.split('T')[0];
    const confNum = req.body.confNum;
    const query = confNum
        ? `
                INSERT INTO rents(rentId, vehicleLicence, driversLicence, fromDate, toDate, confNum)
                VALUES("${rentId}", "${vehicleLicence}", "${driversLicence}",
                        STR_TO_DATE("${fromDate}", "%Y-%m-%d"), STR_TO_DATE("${toDate}", "%Y-%m-%d"),
                        "${confNum}");
            `
        : `
                INSERT INTO rents(rentId, vehicleLicence, driversLicence, fromDate, toDate, confNum)
                VALUES("${rentId}", "${vehicleLicence}", "${driversLicence}",
                        STR_TO_DATE("${fromDate}", "%Y-%m-%d"), STR_TO_DATE("${toDate}", "%Y-%m-%d"),
                        NULL);
        `;

    // send query
    let results = await _db.query(query);
    results = await _db.query(`SELECT * FROM rents WHERE rentId = '${rentId}';`);

    // prepare response
    results = JSON.parse(JSON.stringify(results));
    const createdRent = results[0][0];
    createdRent.id = createdRent.rentId;

    // send response
    res.status(201).json(createdRent);
};

module.exports = createRent;
