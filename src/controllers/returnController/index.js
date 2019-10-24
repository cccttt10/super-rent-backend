const tryAsync = require('../../util/tryAsync');
const getAllReturns = tryAsync(require('./getAllReturns'));
const getReturn = tryAsync(require('./getReturn'));
const deleteReturn = tryAsync(require('./deleteReturn'));
const createReturn = tryAsync(require('./createReturn'));
const validateReturn = tryAsync(require('./validateReturn'));

module.exports = {
    getAllReturns,
    getReturn,
    deleteReturn,
    createReturn,
    validateReturn
};
