const _db = require('../db').getDb();
const dataHandler = require('../util/dataHandler');

exports.getAllCustomers = async (req, res, next) => {
    let results = await _db.query(`SELECT * FROM customers;`);
    results = JSON.parse(JSON.stringify(results));
    let customers = results[0];
    const totalCount = customers.length;
    customers = customers.map(customer => {
        customer.id = customer.driversLicence;
        return customer;
    });
    if (req.query._start && req.query._end)
        customers = dataHandler.paginate(customers, req);
    if (req.query._sort && req.query._order)
        customers = dataHandler.sort(customers, req);
    res.status(200)
        .set({
            'X-Total-Count': totalCount,
            'Access-Control-Expose-Headers': ['X-Total-Count']
        })
        .json(customers);
};

exports.getCustomer = async (req, res, next) => {
    let results = await _db.query(
        `SELECT * FROM customers where driversLicence = '${req.params.id}';`
    );
    results = JSON.parse(JSON.stringify(results));
    const customer = results[0][0];
    customer.id = customer.driversLicence;
    res.status(200)
        .set({
            'X-Total-Count': 1,
            'Access-Control-Expose-Headers': ['X-Total-Count']
        })
        .json(customer);
};

exports.updateCustomer = async (req, res, next) => {
    const { id, driversLicence, phone, name } = req.body;
    await _db.query(
        `
            UPDATE customers
            SET driversLicence = "${driversLicence}", 
                phone = "${phone}",
                name = "${name}"
                WHERE driversLicence = '${id}';
        `
    );
    let results = await _db.query(
        `SELECT * FROM customers WHERE driversLicence = '${driversLicence}';`
    );
    results = JSON.parse(JSON.stringify(results));
    const updatedCustomer = results[0][0];
    updatedCustomer.id = updatedCustomer.driversLicence;
    res.status(200)
        .set({
            'X-Total-Count': 1,
            'Access-Control-Expose-Headers': ['X-Total-Count']
        })
        .json(updatedCustomer);
};

exports.deleteCustomer = async (req, res, next) => {
    const driversLicence = req.params.id;
    await _db.query(
        `DELETE FROM customers WHERE driversLicence ='${driversLicence}'`
    );
    res.status(204).json(null);
};

exports.createCustomer = async (req, res, next) => {
    const { driversLicence, phone, name } = req.body;
    let results = await _db.query(
        `
            INSERT INTO customers(driversLicence, phone, name)
            VALUES("${driversLicence}", "${phone}", "${name}");
        `
    );
    results = await _db.query(
        `SELECT * FROM customers WHERE driversLicence = '${driversLicence}';`
    );
    results = JSON.parse(JSON.stringify(results));
    const createdCustomer = results[0][0];
    createdCustomer.id = createdCustomer.driversLicence;
    res.status(201).json(createdCustomer);
};
