const tryAsync = require('../../util/tryAsync');
const getAllReturns = tryAsync(require('./getAllReturns'));
const getReturn = tryAsync(require('./getReturn'));
const deleteReturn = tryAsync(require('./deleteReturn'));
const createReturn = tryAsync(require('./createReturn'));

module.exports = {
    getAllReturns,
    getReturn,
    deleteReturn,
    createReturn
};
