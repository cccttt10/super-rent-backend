const _db = require('../../db').getDb();
const log = require('../../util/log');

const reportDailyRents = async (req, res, next) => {
    let results = await _db.query(`
        SELECT * FROM (SELECT DISTINCT city from vehicles) AS cities, 
                      (SELECT DISTINCT location from vehicles) AS locations 
                 ORDER BY city, location`);
    results = JSON.parse(JSON.stringify(results));
    let branches = results[0];

    let report = [];
    const date = req.params.date.split('T')[0];
    for (const branch of branches) {
        let results = await _db.query(`
            SELECT * FROM rents as R, vehicles as V 
            WHERE R.vehicleLicence = V.vehicleLicence AND 
                  city = "${branch.city}" AND 
                  location = "${branch.location}" AND 
                  fromDate = "${date}" 
            ORDER BY V.vehicleTypeName `);
        results = JSON.parse(JSON.stringify(results));
        const dailyRents = results[0];
        if (dailyRents.length > 0)
            report.push({ branch, dailyRents: [...dailyRents] });
    }
    log.info('====== PRINTING REPORT ======');
    // eslint-disable-next-line no-console
    report.forEach(r => console.log(r));
    res.status(200)
        .set({
            'X-Total-Count': report.length,
            'Access-Control-Expose-Headers': ['X-Total-Count']
        })
        .json(report);
};

module.exports = reportDailyRents;
