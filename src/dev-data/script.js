const fs = require('fs');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const log = require('../util/log');

dotenv.config({ path: './config.env' });
let connection;

const connect = async () => {
    connection = await mysql.createConnection({
        host: process.env.DATABASE_IP,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        multipleStatements: true
    });
    await connection.query(`USE super_rent`);
    await connection.query(`SELECT DATABASE()`);
    log.success('👌 database connection successful!');
};

const importData = async () => {
    const customers = JSON.parse(
        fs.readFileSync('src/dev-data/data/customers.json', 'utf8')
    );
    await connection.query(
        `    
            CREATE TABLE customer(
            id VARCHAR(255) PRIMARY KEY,
            phone VARCHAR(255) UNIQUE,
            name VARCHAR(255),
            driversLicence INT UNIQUE,
            isClubMember BOOLEAN,
            points INT,
            fees DOUBLE)
        `
    );
    log.success('👌 created customer table!');

    let insertCustomersQuery = '';
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
        insertCustomersQuery += `
            INSERT INTO customer(id, phone, name, driversLicence, isClubMember, points, fees)
            VALUES("${id}", "${phone}", "${name}",
                ${driversLicence}, ${isClubMember}, ${points}, ${fees});
        `;
    }
    await connection.query(insertCustomersQuery);
    log.success('👌 imported customers data!');

    const vehicles = JSON.parse(
        fs.readFileSync('src/dev-data/data/vehicles.json', 'utf8')
    );
    await connection.query(
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
        `
    );
    log.success('👌 created vehicle table!');

    let insertVehiclesQuery = '';
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
        insertVehiclesQuery += `
            INSERT INTO vehicle(id, licence, make, model, year, color, odometer, status)
            VALUES("${id}", ${licence}, "${make}", "${model}", 
                ${year}, "${color}", ${odometer}, "${status}");
        `;
    }

    await connection.query(insertVehiclesQuery);
    log.success('👌 imported vehicles data!');
    log.success('👌 imported all data to database, done');
    process.exit(0);
};

const deleteData = async () => {
    await connection.query(`DROP TABLE IF EXISTS customer`);
    await connection.query(`DROP TABLE IF EXISTS vehicle`);
    log.success('👌 deleted all data from database, done');
    process.exit(0);
};

const main = async () => {
    try {
        await connect();
        if (process.argv[2] === '--import') {
            await importData();
        }
        else if (process.argv[2] === '--delete') {
            await deleteData();
        }
    } catch (err) {
        log.error(err);
        process.exit(1);
    }
};

main();
