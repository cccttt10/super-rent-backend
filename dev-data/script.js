const fs = require('fs');
const mysql = require('mysql');
const dotenv = require('dotenv');
const log = require('../util/log');
const queryHandler = require('../util/queryHandler');

dotenv.config({ path: './config.env' });

const connection = mysql.createConnection({
    host: process.env.DATABASE_IP,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD
});

const connect = () => {
    connection.connect(err => {
        if (err) throw err;
        else log.success('👌 database connection successful!');
    });

    connection.query(
        `
           USE super_rent
        `,
        queryHandler.defaultCallBack
    );

    connection.query(
        `
            SELECT DATABASE()
        `,
        queryHandler.defaultCallBack
    );
};

const importData = () => {
    const customers = JSON.parse(
        fs.readFileSync('./dev-data/data/customers.json', 'utf8')
    );

    connection.query(
        `    
            CREATE TABLE customer(
            uuid VARCHAR(255) PRIMARY KEY,
            phone VARCHAR(255) UNIQUE,
            name VARCHAR(255),
            address VARCHAR(255),
            driversLicence INT UNIQUE,
            isClubMember BOOLEAN,
            points INT,
            fees DOUBLE)
        `,
        queryHandler.defaultCallBack
    );

    for (const customer of customers) {
        const {
            uuid,
            phone,
            name,
            address,
            driversLicence,
            isClubMember,
            points,
            fees
        } = customer;
        connection.query(
            `
                INSERT INTO customer(uuid, phone, name, address, driversLicence, isClubMember, points, fees)
                VALUES("${uuid}", "${phone}", "${name}", "${address}", 
                    ${driversLicence}, ${isClubMember}, ${points}, ${fees})
            `,
            queryHandler.defaultCallBack
        );
    }
};

const deleteData = () => {
    connection.query(
        `    
            DROP TABLE customer
        `,
        queryHandler.defaultCallBack
    );
};

connect();

if (process.argv[2] === '--import') {
    importData();
}
else if (process.argv[2] === '--delete') {
    deleteData();
}

process.exit(1);