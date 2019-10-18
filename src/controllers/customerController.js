const _db = require('../db').getDb();
const dataHandler = require('../util/dataHandler');

exports.getAllCustomers = async (req, res, next) => {
    let results = await _db.query(`SELECT * FROM customers;`);
    results = JSON.parse(JSON.stringify(results));
    let customers = results[0];
    const totalCount = customers.length;
    customers = customers.map(customer => {
        if (customer.isClubMember === 0) customer.isClubMember = false;
        if (customer.isClubMember === 1) customer.isClubMember = true;
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
        `SELECT * FROM customers where id = '${req.params.id}';`
    );
    results = JSON.parse(JSON.stringify(results));
    const customer = results[0][0];
    if (customer.isClubMember === 0) customer.isClubMember = false;
    if (customer.isClubMember === 1) customer.isClubMember = true;
    res.status(200)
        .set({
            'X-Total-Count': 1,
            'Access-Control-Expose-Headers': ['X-Total-Count']
        })
        .json(customer);
};

exports.updateCustomer = async (req, res, next) => {
    const id = req.params.id;
    const { name, phone, driversLicence, points, fees } = req.body;
    let { isClubMember } = req.body;
    if (isClubMember === 'yes') isClubMember = true;
    else if (isClubMember === 'no') isClubMember = false;
    await _db.query(
        `
            UPDATE customers
            SET name = '${name}',
                phone = '${phone}',
                driversLicence = ${driversLicence},
                isClubMember = ${isClubMember},
                points = ${points},
                fees = ${fees}
                WHERE id = '${id}';
        `
    );
    let results = await _db.query(`SELECT * FROM customers WHERE id = '${id}';`);
    results = JSON.parse(JSON.stringify(results));
    const updatedCustomer = results[0][0];
    res.status(200)
        .set({
            'X-Total-Count': 1,
            'Access-Control-Expose-Headers': ['X-Total-Count']
        })
        .json(updatedCustomer);
};

exports.deleteCustomer = async (req, res, next) => {
    const id = req.params.id;
    await _db.query(`DELETE FROM customers WHERE id ='${id}'`);
    res.status(204).json(null);
};
