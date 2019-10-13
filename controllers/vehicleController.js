const _db = require('../db').getDb();
const log = require('../util/log');

exports.getAllVehicles = (req, res, next) => {
    _db.query(
        `
            SELECT * FROM vehicle LIMIT 1000;
        `,
        (err, data) => {
            if (err) {
                log.error(err);
                next(err);
            }
            else {
                res.status(200).json({
                    status: 'success',
                    numResults: data.length,
                    data
                });
            }
        }
    );
};
