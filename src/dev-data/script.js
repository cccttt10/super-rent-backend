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
    await connection.query(`USE superRentDatabase`);
    await connection.query(`SELECT DATABASE()`);
    log.success('👌 database connection successful!');
};

const importVehicleTypes = async () => {
    const vehicleTypes = JSON.parse(
        fs.readFileSync('src/dev-data/data/vehicleTypes.json', 'utf8')
    );
    await connection.query(
        `
            CREATE TABLE vehicleTypes(
            vehicleTypeName VARCHAR(50) PRIMARY KEY,
            dayRate INT UNSIGNED NOT NULL);
        `
    );
    log.success('👌 created vehicleTypes table!');
    let insertVehicleTypesQuery = '';
    for (const vehicleType of vehicleTypes) {
        const { vehicleTypeName, dayRate } = vehicleType;
        insertVehicleTypesQuery += `
            INSERT INTO vehicleTypes(vehicleTypeName, dayRate)
            VALUES("${vehicleTypeName}", ${dayRate});
        `;
    }
    await connection.query(insertVehicleTypesQuery);
    log.success('👌 imported vehicleTypes data!');
}

const importCustomers = async () => {
    const customers = JSON.parse(
        fs.readFileSync('src/dev-data/data/customers.json', 'utf8')
    );
    await connection.query(
        `    
            CREATE TABLE customers(
            driversLicence VARCHAR(20) PRIMARY KEY,
            phone VARCHAR(50) NOT NULL,
            name VARCHAR(50) NOT NULL);
        `
    );
    log.success('👌 created customers table!');

    let insertCustomersQuery = '';
    for (const customer of customers) {
        const {
            driversLicence,
            phone,
            name,
        } = customer;
        insertCustomersQuery += `
            INSERT INTO customers(driversLicence, phone, name)
            VALUES("${driversLicence}", "${phone}", "${name}");
        `;
    }
    await connection.query(insertCustomersQuery);
    log.success('👌 imported customers data!');
}

const importVehicles = async () => {
    const vehicles = JSON.parse(
        fs.readFileSync('src/dev-data/data/vehicles.json', 'utf8')
    );
    await connection.query(
        `    
            CREATE TABLE vehicles(
            licence VARCHAR(50) PRIMARY KEY,
            make VARCHAR(50),
            model VARCHAR(50),
            year YEAR,
            color VARCHAR(50),
            status ENUM("rented", "maintenance", "available") NOT NULL,
            vehicleTypeName VARCHAR(50) NOT NULL,
            location VARCHAR(50) NOT NULL,
            city VARCHAR(50) NOT NULL,
            FOREIGN KEY (vehicleTypeName) REFERENCES vehicleTypes(vehicleTypeName));
        `
    );
    log.success('👌 created vehicles table!');

    let insertVehiclesQuery = '';
    for (const vehicle of vehicles) {
        const { licence, make, model, year, color, status, vehicleTypeName, location, city } = vehicle;
        insertVehiclesQuery += `
            INSERT INTO vehicles(licence, make, model, year, color, 
                                 status, vehicleTypeName, location, city)
            VALUES("${licence}", "${make}", "${model}", ${year}, "${color}", 
                  "${status}", "${vehicleTypeName}", "${location}", "${city}");
        `;
    }
    await connection.query(insertVehiclesQuery);
    log.success('👌 imported vehicles data!');
}

const importData = async () => {
    await importVehicleTypes();
    await importCustomers();
    await importVehicles();
    log.success('👌 imported all data to database, done');
    process.exit(0);
};

const deleteData = async () => {
    await connection.query(`DROP TABLE IF EXISTS vehicles`);
    await connection.query(`DROP TABLE IF EXISTS vehicleTypes`);
    await connection.query(`DROP TABLE IF EXISTS customers`);
    log.success('👌 deleted all data from database, done');
    process.exit(0);
};

const main = async () => {
    try {
        await connect();
        if (process.argv[2] === '--import') {
            await importData();
        } else if (process.argv[2] === '--delete') {
            await deleteData();
        }
    } catch (err) {
        log.error(err);
        process.exit(1);
    }
};

main();
