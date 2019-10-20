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

const createTables = async () => {
    const schemasString = fs.readFileSync('src/dev-data/createTables.sql', 'utf-8');
    const schemas = schemasString
        .split(';')
        .filter(schema => typeof schema === 'string' && schema.length > 0);
    for (const schema of schemas) {
        await connection.query(schema);
    }
    log.success('👌 created tables!');
};

const importVehicleTypes = async () => {
    const vehicleTypes = JSON.parse(
        fs.readFileSync('src/dev-data/data/vehicleTypes.json', 'utf8')
    );
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
};

const importCustomers = async () => {
    const customers = JSON.parse(
        fs.readFileSync('src/dev-data/data/customers.json', 'utf8')
    );
    let insertCustomersQuery = '';
    for (const customer of customers) {
        const { driversLicence, phone, name } = customer;
        insertCustomersQuery += `
            INSERT INTO customers(driversLicence, phone, name)
            VALUES("${driversLicence}", "${phone}", "${name}");
        `;
    }
    await connection.query(insertCustomersQuery);
    log.success('👌 imported customers data!');
};

const importVehicles = async () => {
    const vehicles = JSON.parse(
        fs.readFileSync('src/dev-data/data/vehicles.json', 'utf8')
    );
    let insertVehiclesQuery = '';
    for (const vehicle of vehicles) {
        const {
            licence,
            make,
            model,
            year,
            color,
            status,
            vehicleTypeName,
            location,
            city
        } = vehicle;
        insertVehiclesQuery += `
            INSERT INTO vehicles(licence, make, model, year, color, 
                                 status, vehicleTypeName, location, city)
            VALUES("${licence}", "${make}", "${model}", ${year}, "${color}", 
                  "${status}", "${vehicleTypeName}", "${location}", "${city}");
        `;
    }
    await connection.query(insertVehiclesQuery);
    log.success('👌 imported vehicles data!');
};

const importData = async () => {
    await createTables();
    await importVehicleTypes();
    await importCustomers();
    await importVehicles();
    log.success('👌 imported all data to database, done');
    process.exit(0);
};

const dropTables = async () => {
    const queriesString = fs.readFileSync('src/dev-data/dropTables.sql', 'utf-8');
    const queries = queriesString
        .split(';')
        .filter(query => typeof query === 'string' && query.length > 0);
    for (const query of queries) {
        await connection.query(query);
    }
    log.success('👌 dropped all tables and deleted all data!');
    process.exit(0);
};

const main = async () => {
    try {
        await connect();
        if (process.argv[2] === '--import') {
            await importData();
        } else if (process.argv[2] === '--delete') {
            await dropTables();
        }
    } catch (err) {
        log.error(err);
        process.exit(1);
    }
};

main();
