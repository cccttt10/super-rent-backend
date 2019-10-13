const _db = require('../db').getDb();
const log = require('../util/log');

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
                data = data.map(customer => {
                    if (customer.isClubMember === 0)
                        customer.isClubMember = 'no';
                    else if (customer.isClubMember === 1)
                        customer.isClubMember = 'yes';
                    return customer;
                });
                res
                    .status(200)
                    .set({
                        'X-Total-Count': data.length,
                        'Content-Range': `customers 0-${data.length}/${data.length}`,
                        'Access-Control-Expose-Headers': [
                            'Content-Range',
                            'X-Total-Count'
                        ]
                    })
                    .json(
                        data
                        // {
                        //     status: 'success',
                        //     total: data.length,
                        //     data
                        // }
                    );
            }
        }
    );
};
