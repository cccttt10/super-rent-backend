const express = require('express');
const app = express();
const customerRoutes = require('./routes/customerRoutes');

app.use('/customers', customerRoutes);

module.exports = app;
