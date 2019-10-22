const _db = require('../../db').getDb();

const getAllRents = async (req, res, next) => {
    let query = 'SELECT * FROM rents';

    // prepare query: filtering based on fromDate
    if (req.query.fromDate)
        query += ` WHERE fromDate = STR_TO_DATE("${req.query.fromDate}", "%Y-%m-%d")`;

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
    rents = rents.map(rent => {
        rent.id = rent.rentId;
        return rent;
    });

    results = await _db.query('SELECT COUNT(*) FROM rents');
    results = JSON.parse(JSON.stringify(results));
    const numRents = results[0][0]['COUNT(*)'];

    // send response
    res.status(200)
        .set({
            'X-Total-Count': numRents,
            'Access-Control-Expose-Headers': ['X-Total-Count']
        })
        .json(rents);
};

module.exports = getAllRents;
