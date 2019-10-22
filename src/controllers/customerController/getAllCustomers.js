const _db = require('../../db').getDb();

const getAllCustomers = async (req, res, next) => {
    // prepare query
    let query = 'SELECT * FROM customers';

    // prepare query: sorting
    if (req.query._sort && req.query._order) {
        const sort = req.query._sort === 'id' ? 'driversLicence' : req.query._sort;
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
    let customers = results[0];
    customers = customers.map(customer => {
        customer.id = customer.driversLicence;
        return customer;
    });

    results = await _db.query('SELECT COUNT(*) FROM customers');
    results = JSON.parse(JSON.stringify(results));
    const numCustomers = results[0][0]['COUNT(*)'];

    // send response
    res.status(200)
        .set({
            'X-Total-Count': numCustomers,
            'Access-Control-Expose-Headers': ['X-Total-Count']
        })
        .json(customers);
};

module.exports = getAllCustomers;
