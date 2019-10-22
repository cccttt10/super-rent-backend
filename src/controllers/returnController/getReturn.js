const _db = require('../../db').getDb();

const getReturn = async (req, res, next) => {
    // prepare & send query
    const rentId = req.params.id;
    let results = await _db.query(
        `SELECT * FROM returns where rentId = '${rentId}';`
    );

    // prepare response
    results = JSON.parse(JSON.stringify(results));
    const ret = results[0][0];
    ret.id = ret.rentId;

    // send response
    res.status(200)
        .set({
            'X-Total-Count': 1,
            'Access-Control-Expose-Headers': ['X-Total-Count']
        })
        .json(ret);
};

module.exports = getReturn;
