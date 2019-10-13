const _db = require('../db').getDb();
const dataHandler = require('../util/dataHandler');

exports.getAllVehicles = async (req, res, next) => {
    let results = await _db.query(`SELECT * FROM vehicle`);
    results = JSON.parse(JSON.stringify(results));
    let vehicles = results[0];
    const totalCount = vehicles.length;
    if (req.query._start && req.query._end)
        vehicles = dataHandler.paginate(vehicles, req);
    if (req.query._sort && req.query._order)
        vehicles = dataHandler.sort(vehicles, req);
    res
        .status(200)
        .set({
            'X-Total-Count': totalCount,
            'Access-Control-Expose-Headers': [ 'X-Total-Count' ]
        })
        .json(vehicles);
};

exports.getVehicle = async (req, res, next) => {
    let results = await _db.query(
        `SELECT * FROM vehicle where id = "${req.params.id}";`
    );
    results = JSON.parse(JSON.stringify(results));
    const vehicle = results[0][0];
    res
        .status(200)
        .set({
            'X-Total-Count': 1,
            'Access-Control-Expose-Headers': [ 'X-Total-Count' ]
        })
        .json(vehicle);
};
