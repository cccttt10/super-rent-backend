const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const customerRoutes = require('./routes/customerRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const rentRoutes = require('./routes/rentRoutes');
const returnRoutes = require('./routes/returnRoutes');
const reportRoutes = require('./routes/reportRoutes');
const updateVehicleAvailability = require('./controllers/vehicleController/updateVehicleAvailability');

const handleOptionsRequest = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Credentials': false,
            'Access-Control-Max-Age': '86400', // 24 hours
            'Access-Control-Allow-Headers':
                'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
        };
        res.set(headers);
        res.end();
    } else next();
};

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(handleOptionsRequest);
app.use(cors()); // Allow cross origin access
app.use(express.json()); // Body parser
app.use(updateVehicleAvailability);
app.use('/customers', customerRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/reservations', reservationRoutes);
app.use('/rents', rentRoutes);
app.use('/returns', returnRoutes);
app.use('/reports', reportRoutes);

module.exports = app;
