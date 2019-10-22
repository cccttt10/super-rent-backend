const _db = require('../../db').getDb();

const getCustomer = async (req, res, next) => {
    // prepare & send query
    const driversLicence = req.params.id;
    let results = await _db.query(
        `SELECT * FROM customers where driversLicence = '${driversLicence}';`
    );

    // prepare response
    results = JSON.parse(JSON.stringify(results));
    const customer = results[0][0];
    customer.id = customer.driversLicence;

    // send response
    res.status(200)
        .set({
            'X-Total-Count': 1,
            'Access-Control-Expose-Headers': ['X-Total-Count']
        })
        .json(customer);
};

module.exports = getCustomer;
