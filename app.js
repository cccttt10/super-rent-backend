const express = require('express');
const app = express();
const cors = require('cors');
const customerRoutes = require('./routes/customerRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');

app.use(cors());
app.use('/customers', customerRoutes);
app.use('/vehicles', vehicleRoutes);

module.exports = app;
