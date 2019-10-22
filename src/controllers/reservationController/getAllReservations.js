const _db = require('../../db').getDb();

const getAllReservations = async (req, res, next) => {
    // prepare query
    let query = 'SELECT * FROM reservations';

    // filtering based on confNum, vehicleTypeName, driversLicence, fromDate, toDate
    let dateFilter = { fromDate: '1900-01-01', toDate: '2050-01-01' };
    if (req.query.fromDate) dateFilter.fromDate = req.query.fromDate.split('T')[0];
    if (req.query.toDate) dateFilter.toDate = req.query.toDate.split('T')[0];
    query += ` WHERE fromDate >= STR_TO_DATE("${dateFilter.fromDate}", "%Y-%m-%d") AND toDate <= STR_TO_DATE("${dateFilter.toDate}", "%Y-%m-%d")`;
    if (req.query.confNum) query += ` AND confNum = "${req.query.confNum}"`;
    if (req.query.driversLicence)
        query += ` AND driversLicence = "${req.query.driversLicence}"`;
    if (req.query.vehicleTypeName)
        query += ` AND vehicleTypeName = "${req.query.vehicleTypeName}"`;

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
    reservations = reservations.map(reservation => {
        reservation.id = reservation.confNum;
        return reservation;
    });

    results = await _db.query('SELECT COUNT(*) FROM reservations');
    results = JSON.parse(JSON.stringify(results));
    const numReservations = results[0][0]['COUNT(*)'];

    // send response
    res.status(200)
        .set({
            'X-Total-Count': numReservations,
            'Access-Control-Expose-Headers': ['X-Total-Count']
        })
        .json(reservations);
};

module.exports = getAllReservations;
