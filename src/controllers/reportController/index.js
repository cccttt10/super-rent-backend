const tryAsync = require('../../util/tryAsync');
const reportDailyRents = tryAsync(require('./reportDailyRents'));
const reportDailyReturns = tryAsync(require('./reportDailyReturns'));

module.exports = { reportDailyRents, reportDailyReturns };
