const _db = require('../../db').getDb();
const SuperRentError = require('../../util/SuperRentError');
const moment = require('moment');

const validateReturn = async (req, res, next) => {
    const rentId = req.body.rentId;
    let results = await _db.query(`SELECT * from rents WHERE rentId = "${rentId}";`);
    results = JSON.parse(JSON.stringify(results));
    const rent = results[0][0];
    if (moment(rent.fromDate).isAfter(req.body.date.split('T')[0]))
        throw new SuperRentError({
            message: `The start date of the rent is ${rent.fromDate.split('T')[0]} 
                      and you want to return on ${req.body.date.split('T')[0]}. 
                      Are you crazy???`,
            statusCode: 500
        });
    else return next();
};

module.exports = validateReturn;
