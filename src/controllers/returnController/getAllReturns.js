const _db = require('../../db').getDb();

const getAllReturns = async (req, res, next) => {
    // prepare query
    let query = 'SELECT * FROM returns';

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
    let returns = results[0];
    returns = returns.map(ret => {
        ret.id = ret.rentId;
        return ret;
    });

    results = await _db.query('SELECT COUNT(*) FROM returns');
    results = JSON.parse(JSON.stringify(results));
    const numReturns = results[0][0]['COUNT(*)'];

    // send response
    res.status(200)
        .set({
            'X-Total-Count': numReturns,
            'Access-Control-Expose-Headers': ['X-Total-Count']
        })
        .json(returns);
};

module.exports = getAllReturns;
