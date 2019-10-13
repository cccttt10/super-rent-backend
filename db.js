const mysql = require('mysql');
const dotenv = require('dotenv');
const log = require('./util/log');
const queryHandler = require('./util/queryHandler');

let _db;

exports.initDb = () => {
    dotenv.config({ path: './config.env' });
    if (_db) {
        log.error(
            'Database connection is already established! Do not connect again!'
        );
        throw new Error(
            'Database connection is already established! Do not connect again!'
        );
    }
    else {
        _db = mysql.createConnection({
            host: process.env.DATABASE_IP,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            multipleStatements: true
        });
        _db.query(
            `
               USE super_rent
            `,
            queryHandler.defaultCallBack
        );
        log.success('👌 Database connection successful 👌');
    }
};

exports.getDb = () => {
    if (!_db) {
        log.error(
            'Failed to get database. Please connect to database first by calling initDb!'
        );
        throw new Error(
            'Failed to get database. Please connect to database first by calling initDb!'
        );
    }
    else return _db;
};
