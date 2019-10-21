const _db = require('../db').getDb();
const uuid = require('uuid/v4');

exports.getAllReservations = async (req, res, next) => {
    // prepare query
    let query = 'SELECT * FROM reservations';

    // prepare query: sorting
    if (req.query._sort && req.query._order) {
        const sort = req.query._sort === 'id' ? 'confNum' : req.query._sort;
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
    let reservations = results[0];
    const totalCount = reservations.length;
    reservations = reservations.map(reservation => {
        reservation.id = reservation.confNum;
        return reservation;
    });

    // send response
    res.status(200)
        .set({
            'X-Total-Count': totalCount,
            'Access-Control-Expose-Headers': ['X-Total-Count']
        })
        .json(reservations);
};

exports.getReservation = async (req, res, next) => {
    // prepare & send query
    const confNum = req.params.id;
    let results = await _db.query(
        `SELECT * FROM reservations where confNum = '${confNum}';`
    );

    // prepare response
    results = JSON.parse(JSON.stringify(results));
    const reservation = results[0][0];
    reservation.id = reservation.confNum;

    // send response
    res.status(200)
        .set({
            'X-Total-Count': 1,
            'Access-Control-Expose-Headers': ['X-Total-Count']
        })
        .json(reservation);
};

exports.updateReservation = async (req, res, next) => {
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

exports.deleteReservation = async (req, res, next) => {
    // prepare & send query
    const confNum = req.params.id;
    await _db.query(`DELETE FROM reservations WHERE confNum ='${confNum}'`);

    // send response
    res.status(204).json(null);
};

exports.createReservation = async (req, res, next) => {
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
