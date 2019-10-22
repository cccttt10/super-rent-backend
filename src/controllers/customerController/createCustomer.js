const _db = require('../../db').getDb();

const createCustomer = async (req, res, next) => {
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

module.exports = createCustomer;
