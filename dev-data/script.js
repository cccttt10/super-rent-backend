const fs = require('fs');
const mysql = require('mysql');
const dotenv = require('dotenv');
const log = require('../util/log');
const queryHandler = require('../util/queryHandler');

dotenv.config({ path: './config.env' });

const connection = mysql.createConnection({
    host: process.env.DATABASE_IP,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    multipleStatements: true
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
            id VARCHAR(255) PRIMARY KEY,
            phone VARCHAR(255) UNIQUE,
            name VARCHAR(255),
            driversLicence INT UNIQUE,
            isClubMember BOOLEAN,
            points INT,
            fees DOUBLE)
        `,
        queryHandler.defaultCallBack
    );

    for (const customer of customers) {
        const {
            id,
            phone,
            name,
            driversLicence,
            isClubMember,
            points,
            fees
        } = customer;
        connection.query(
            `
                INSERT INTO customer(id, phone, name, driversLicence, isClubMember, points, fees)
                VALUES("${id}", "${phone}", "${name}",
                    ${driversLicence}, ${isClubMember}, ${points}, ${fees})
            `,
            queryHandler.defaultCallBack
        );
    }

    const vehicles = JSON.parse(
        fs.readFileSync('./dev-data/data/vehicles.json', 'utf8')
    );

    connection.query(
        `    
            CREATE TABLE vehicle(
            id VARCHAR(255) PRIMARY KEY,
            licence INT UNIQUE,
            make VARCHAR(255),
            model VARCHAR(255),
            year INT,
            color VARCHAR(255),
            odometer INT,
            status ENUM("available for rent", "available for sale", "sold", "rented"))
        `,
        queryHandler.defaultCallBack
    );

    for (const vehicle of vehicles) {
        const {
            id,
            licence,
            make,
            model,
            year,
            color,
            odometer,
            status
        } = vehicle;
        connection.query(
            `
                INSERT INTO vehicle(id, licence, make, model, year, color, odometer, status)
                VALUES("${id}", ${licence}, "${make}", "${model}", 
                    ${year}, "${color}", ${odometer}, "${status}")
            `,
            queryHandler.defaultCallBack
        );
    }
};

const deleteData = () => {
    connection.query(
        `    
            DROP TABLE IF EXISTS customer
        `,
        queryHandler.defaultCallBack
    );

    connection.query(
        `    
            DROP TABLE IF EXISTS vehicle
        `,
        queryHandler.defaultCallBack
    );
};

connect();

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
