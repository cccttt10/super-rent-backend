const _db = require('../../db').getDb();
const SuperRentError = require('../../util/SuperRentError');

const createCustomer = async (req, res, next) => {
    // prepare query
    const { driversLicence, phone, name } = req.body;

    // check if driversLicence already exists
    let results = await _db.query(
        `SELECT COUNT(*) FROM customers WHERE driversLicence = "${driversLicence}";`
    );
    results = JSON.parse(JSON.stringify(results));
    const count = results[0][0]['COUNT(*)'];
    if (count > 0)
        throw new SuperRentError({
            message: `There is already a customer with driver's licence ${driversLicence} ❎`,
            statusCode: 500
        });

    // send query
    results = await _db.query(
        `
            INSERT INTO customers(driversLicence, phone, name)
            VALUES("${driversLicence}", "${phone}", "${name}");
        `
    );
    results = await _db.query(
        `SELECT * FROM customers WHERE driversLicence = "${driversLicence}";`
    );

    // prepare response
    results = JSON.parse(JSON.stringify(results));
    const createdCustomer = results[0][0];
    createdCustomer.id = createdCustomer.driversLicence;

    // send response
    res.status(201).json(createdCustomer);
};

module.exports = createCustomer;
