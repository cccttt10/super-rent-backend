const express = require('express');
const app = express();
const customerRoutes = require('./routes/customerRoutes');

app.get('/', (req, res, next) => {
    console.log('hey');
});
app.use('/customers', customerRoutes);

module.exports = app;
