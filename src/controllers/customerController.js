const _db = require('../db').getDb();

exports.getAllCustomers = async (req, res, next) => {
    // prepare query
    let query = 'SELECT * FROM customers';

    // // prepare query: sorting
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
    const totalCount = customers.length;
    customers = customers.map(customer => {
        customer.id = customer.driversLicence;
        return customer;
    });

    // send response
    res.status(200)
        .set({
            'X-Total-Count': totalCount,
            'Access-Control-Expose-Headers': ['X-Total-Count']
        })
        .json(customers);
};

exports.getCustomer = async (req, res, next) => {
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

exports.updateCustomer = async (req, res, next) => {
    // prepare query
    const prevDriversLicence = req.params.id;
    const { driversLicence, phone, name } = req.body;

    // send query
    await _db.query(
        `
            UPDATE customers
            SET driversLicence = "${driversLicence}", 
                phone = "${phone}",
                name = "${name}"
                WHERE driversLicence = '${prevDriversLicence}';
        `
    );
    let results = await _db.query(
        `SELECT * FROM customers WHERE driversLicence = '${driversLicence}';`
    );

    // prepare response
    results = JSON.parse(JSON.stringify(results));
    const updatedCustomer = results[0][0];
    updatedCustomer.id = updatedCustomer.driversLicence;

    // send response
    res.status(200)
        .set({
            'X-Total-Count': 1,
            'Access-Control-Expose-Headers': ['X-Total-Count']
        })
        .json(updatedCustomer);
};

exports.deleteCustomer = async (req, res, next) => {
    // prepare & send query
    const driversLicence = req.params.id;
    await _db.query(
        `DELETE FROM customers WHERE driversLicence ='${driversLicence}'`
    );

    // send response
    res.status(204).json(null);
};

exports.createCustomer = async (req, res, next) => {
    // prepare query
    const { driversLicence, phone, name } = req.body;

    // send query
    let results = await _db.query(
        `
            INSERT INTO customers(driversLicence, phone, name)
            VALUES("${driversLicence}", "${phone}", "${name}");
        `
    );
    results = await _db.query(
        `SELECT * FROM customers WHERE driversLicence = '${driversLicence}';`
    );

    // prepare response
    results = JSON.parse(JSON.stringify(results));
    const createdCustomer = results[0][0];
    createdCustomer.id = createdCustomer.driversLicence;

    // send response
    res.status(201).json(createdCustomer);
};
