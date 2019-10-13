const express = require('express');
const app = express();
const cors = require('cors');
const customerRoutes = require('./routes/customerRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');

app.use(cors()); // Allow cross origin access
app.use(express.json()); // Body parser
app.use('/customers', customerRoutes);
app.use('/vehicles', vehicleRoutes);

module.exports = app;
