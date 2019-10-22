const _db = require('../../db').getDb();

const deleteCustomer = async (req, res, next) => {
    // prepare & send query
    const driversLicence = req.params.id;
    await _db.query(
        `DELETE FROM customers WHERE driversLicence ='${driversLicence}'`
    );

    // send response
    res.status(204).json(null);
};

module.exports = deleteCustomer;
