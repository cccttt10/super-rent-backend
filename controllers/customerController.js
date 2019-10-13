const _db = require('../db').getDb();
const log = require('../util/log');
const dataHandler = require('../util/dataHandler');

exports.getAllCustomers = (req, res, next) => {
    _db.query(
        `
            SELECT * FROM customer LIMIT 1000;
        `,
        (err, data) => {
            if (err) {
                log.error(err);
                next(err);
            }
            else {
                const totalCount = data.length;
                data = data.map(customer => {
                    if (customer.isClubMember === 0)
                        customer.isClubMember = 'no';
                    else if (customer.isClubMember === 1)
                        customer.isClubMember = 'yes';
                    return customer;
                });
                if (req.query._start && req.query._end)
                    data = dataHandler.paginate(data, req);
                res
                    .status(200)
                    .set({
                        'X-Total-Count': totalCount,
                        'Access-Control-Expose-Headers': [
                            'X-Total-Count'
                        ]
                    })
                    .json(data);
            }
        }
    );
};
