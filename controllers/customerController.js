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
                if (req.query._sort && req.query._order)
                    data = dataHandler.sort(data, req);
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

exports.getCustomer = (req, res, next) => {
    _db.query(
        `
            SELECT * FROM customer where id = "${req.params.id}";
        `,
        (err, data) => {
            if (err) {
                log.error(err);
                next(err);
            }
            else {
                const customer = data[0];
                console.log(data);
                if (customer.isClubMember === 0)
                    customer.isClubMember = 'no';
                else if (customer.isClubMember === 1)
                    customer.isClubMember = 'yes';
                res
                    .status(200)
                    .set({
                        'X-Total-Count': 1,
                        'Access-Control-Expose-Headers': [
                            'X-Total-Count'
                        ]
                    })
                    .json(customer);
            }
        }
    );
};

exports.updateCustomer = (req, res, next) => {
    const id = req.params.id;
    let {
        name,
        phone,
        driversLicence,
        isClubMember,
        points,
        fees
    } = req.body;
    if (isClubMember === 'yes') isClubMember = true;
    else if (isClubMember === 'no') isClubMember = false;
    _db.query(
        `
            UPDATE customer
            SET name = "${name}",
                phone = "${phone}",
                driversLicence = ${driversLicence},
                isClubMember = ${isClubMember},
                points = ${points},
                fees = ${fees}
                WHERE id = "${id}";
            SELECT * FROM customer WHERE id = "${id}";
            `,
        (err, results, fields) => {
            if (err) {
                log.error(err);
                next(err);
            }
            else {
                results = JSON.parse(JSON.stringify(results));
                const updatedCustomer = results[1][0];
                res
                    .status(200)
                    .set({
                        'X-Total-Count': 1,
                        'Access-Control-Expose-Headers': [
                            'X-Total-Count'
                        ]
                    })
                    .json(updatedCustomer);
            }
        }
    );
};
