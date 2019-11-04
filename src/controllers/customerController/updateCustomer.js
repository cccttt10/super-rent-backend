const _db = require('../../db').getDb();
const SuperRentError = require('../../util/SuperRentError');

const updateCustomer = async (req, res, next) => {
    // prepare query
    const prevDriversLicence = req.params.id;
    const { driversLicence, phone, name } = req.body;

    let results;
    // check if driversLicence already exists
    if (prevDriversLicence !== driversLicence) {
        results = await _db.query(
            `SELECT COUNT(*) FROM customers WHERE driversLicence = "${driversLicence}";`
        );
        results = JSON.parse(JSON.stringify(results));
        const count = results[0][0]['COUNT(*)'];
        if (count > 0)
            throw new SuperRentError({
                message: `There is already a customer with driver's licence ${driversLicence} ❎`,
                statusCode: 500
            });
    }

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
    results = await _db.query(
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

module.exports = updateCustomer;
