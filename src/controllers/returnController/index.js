const tryAsync = require('../../util/tryAsync');
const getAllReturns = require('./getAllReturns');
const getReturn = require('./getReturn');
const deleteReturn = require('./deleteReturn');
const createReturn = tryAsync(require('./createReturn'));

module.exports = {
    getAllReturns,
    getReturn,
    deleteReturn,
    createReturn
};
