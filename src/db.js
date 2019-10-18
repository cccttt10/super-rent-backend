const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const log = require('./util/log');
let _db;

exports.initDb = async () => {
    dotenv.config({ path: './config.env' });
    if (_db) {
        log.error('DB already connected! Do not reconnect!');
        throw new Error('DB already connected! Do not reconnect!');
    } else {
        // eslint-disable-next-line require-atomic-updates
        _db = await mysql.createConnection({
            host: process.env.DATABASE_IP,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            multipleStatements: true
        });
        await _db.query(`USE superRentDatabase;`);
        log.success('👌 DB connected');
    }
};

exports.getDb = () => {
    if (!_db) {
        log.error('DB not connected! Connect first!');
        throw new Error('DB not connected! Connect first!');
    } else return _db;
};
