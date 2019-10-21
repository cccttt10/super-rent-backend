const _db = require('../db').getDb();
const uuid = require('uuid/v4');

exports.getAllRents = async (req, res, next) => {
    // prepare query
    let query = 'SELECT * FROM rents';

    // prepare query: sorting
    if (req.query._sort && req.query._order) {
        const sort = req.query._sort === 'id' ? 'rentId' : req.query._sort;
        const order = req.query._order;
        query += ` ORDER BY ${sort} ${order}`;
    }

    // prepare query: pagination
    if (req.query._start && req.query._end) {
        const start = req.query._start;
        const end = req.query._end;
        const numRows = end - start;
        query += ` LIMIT ${start}, ${numRows}`;
    }

    // send query
    let results = await _db.query(query);

    // prepare response
    results = JSON.parse(JSON.stringify(results));
    let rents = results[0];
    const totalCount = rents.length;
    rents = rents.map(rent => {
        rent.id = rent.rentId;
        return rent;
    });

    // send response
    res.status(200)
        .set({
            'X-Total-Count': totalCount,
            'Access-Control-Expose-Headers': ['X-Total-Count']
        })
        .json(rents);
};

exports.getRent = async (req, res, next) => {
    // prepare & send query
    const rentId = req.params.id;
    let results = await _db.query(`SELECT * FROM rents where rentId = '${rentId}';`);

    // prepare response
    results = JSON.parse(JSON.stringify(results));
    const rent = results[0][0];
    rent.id = rent.rentId;

    // send response
    res.status(200)
        .set({
            'X-Total-Count': 1,
            'Access-Control-Expose-Headers': ['X-Total-Count']
        })
        .json(rent);
};

exports.updateRent = async (req, res, next) => {
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

exports.deleteRent = async (req, res, next) => {
    // prepare & send query
    const rentId = req.params.id;
    await _db.query(`DELETE FROM rents WHERE rentId ='${rentId}'`);

    // send response
    res.status(204).json(null);
};

exports.createRent = async (req, res, next) => {
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
