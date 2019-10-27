const _db = require('../../db').getDb();
const log = require('../../util/log');
const moment = require('moment');

const reportDailyReturns = async (req, res, next) => {
    let results = await _db.query(`
        SELECT * FROM (SELECT DISTINCT city from vehicles) AS cities, 
                      (SELECT DISTINCT location from vehicles) AS locations 
                 ORDER BY city, location`);
    results = JSON.parse(JSON.stringify(results));
    let branches = results[0];

    let report = [];
    const date = moment().format('YYYY-MM-DD');
    for (const branch of branches) {
        let results = await _db.query(`
            SELECT * FROM rents as Ren, returns as Ret, vehicles as V 
            WHERE Ren.vehicleLicence = V.vehicleLicence AND
                  Ren.rentId = Ret.rentId AND
                  city = "${branch.city}" AND 
                  location = "${branch.location}" AND 
                  Ret.date = "${date}" 
            ORDER BY V.vehicleTypeName `);
        results = JSON.parse(JSON.stringify(results));
        const dailyReturns = results[0];
        if (dailyReturns.length > 0)
            report.push({ branch, dailyReturns: [...dailyReturns] });
    }
    log.info('====== PRINTING REPORT ======');
    log.info('====== PRINTING DISABLED FOR PERFORMANCE ======');
    // eslint-disable-next-line no-console
    // report.forEach(r => console.log(r));
    res.status(200)
        .set({
            'X-Total-Count': report.length,
            'Access-Control-Expose-Headers': ['X-Total-Count']
        })
        .json(report);
};

module.exports = reportDailyReturns;
