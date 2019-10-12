const mysql = require('mysql');
const dotenv = require('dotenv');
const Log = require('./util/Log');
const log = new Log();

dotenv.config({ path: './config.env' });

const connection = mysql.createConnection({
    host: process.env.DATABASE_IP,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD
});

connection.connect(err => {
    if (err) throw err;
    else log.success('👌 database connection successful!');
});
