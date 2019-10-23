const tryAsync = require('../../util/tryAsync');
const getAllCustomers = tryAsync(require('./getAllCustomers'));
const getCustomer = tryAsync(require('./getCustomer'));
const updateCustomer = tryAsync(require('./updateCustomer'));
const deleteCustomer = tryAsync(require('./deleteCustomer'));
const createCustomer = tryAsync(require('./createCustomer'));

module.exports = {
    getAllCustomers,
    getCustomer,
    updateCustomer,
    deleteCustomer,
    createCustomer
};
