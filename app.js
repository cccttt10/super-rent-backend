const express = require('express');
const app = express();
const customerRoutes = require('./routes/customerRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');

app.use('/customers', customerRoutes);
app.use('/vehicles', vehicleRoutes);

module.exports = app;
