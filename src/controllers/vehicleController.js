const _db = require('../db').getDb();
const dataHandler = require('../util/dataHandler');

exports.getAllVehicles = async (req, res, next) => {
    let results = await _db.query(`SELECT * FROM vehicles`);
    results = JSON.parse(JSON.stringify(results));
    let vehicles = results[0];
    const totalCount = vehicles.length;
    if (req.query._start && req.query._end)
        vehicles = dataHandler.paginate(vehicles, req);
    if (req.query._sort && req.query._order)
        vehicles = dataHandler.sort(vehicles, req);
    res.status(200)
        .set({
            'X-Total-Count': totalCount,
            'Access-Control-Expose-Headers': ['X-Total-Count']
        })
        .json(vehicles);
};

exports.getVehicle = async (req, res, next) => {
    let results = await _db.query(
        `SELECT * FROM vehicles where id = "${req.params.id}";`
    );
    results = JSON.parse(JSON.stringify(results));
    const vehicle = results[0][0];
    res.status(200)
        .set({
            'X-Total-Count': 1,
            'Access-Control-Expose-Headers': ['X-Total-Count']
        })
        .json(vehicle);
};

exports.updateVehicle = async (req, res, next) => {
    const id = req.params.id;
    const { licence, make, model, year, color, odometer, status } = req.body;

    await _db.query(
        `
            UPDATE vehicles
            SET licence = ${licence},
                make = '${make}',
                model = '${model}',
                year = ${year},
                color = '${color}',
                odometer = ${odometer},
                status = '${status}'
                WHERE id = '${id}';
        `
    );
    let results = await _db.query(`SELECT * FROM vehicles WHERE id = '${id}';`);
    results = JSON.parse(JSON.stringify(results));
    const updatedVehicle = results[0][0];
    res.status(200)
        .set({
            'X-Total-Count': 1,
            'Access-Control-Expose-Headers': ['X-Total-Count']
        })
        .json(updatedVehicle);
};

exports.deleteVehicle = async (req, res, next) => {
    const id = req.params.id;
    await _db.query(`DELETE FROM vehicles WHERE id ='${id}'`);
    res.status(204).json(null);
};
