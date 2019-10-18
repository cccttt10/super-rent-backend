const express = require('express');
const app = express();
const cors = require('cors');
const customerRoutes = require('./routes/customerRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');

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

app.use(handleOptionsRequest);
app.use(cors()); // Allow cross origin access
app.use(express.json()); // Body parser
app.use('/customers', customerRoutes);
app.use('/vehicles', vehicleRoutes);

module.exports = app;
