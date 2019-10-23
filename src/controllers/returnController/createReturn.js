const _db = require('../../db').getDb();
const log = require('../../util/log');
const moment = require('moment');
moment().format();
const SuperRentError = require('../../util/SuperRentError');

const createReturn = async (req, res, next) => {
    const rentId = req.body.rentId;
    const endDate = req.body.date.split('T')[0];

    // check if there's already a rent corresponding to the rentId
    let existingReturn = await _db.query(
        `SELECT * FROM returns WHERE rentId = "${rentId}"`
    );
    existingReturn = JSON.parse(JSON.stringify(existingReturn));
    existingReturn = existingReturn[0][0];
    if (existingReturn)
        return res
            .status(500)
            .send(
                new SuperRentError(
                    'This rent has already been returned! Duplicate return ❎'
                )
            );

    // calculate price
    // given rentId, get rent, then get vehicleLicence and fromDate of the rent
    let rent = await _db.query(`SELECT * FROM rents WHERE rentId = "${rentId}"`);
    rent = JSON.parse(JSON.stringify(rent));
    const vehicleLicence = rent[0][0].vehicleLicence;
    const fromDate = rent[0][0].fromDate.split('T')[0];
    const diffDays = moment(endDate).diff(moment(fromDate), 'days') + 1;

    // given vehicleLicence, get vehicle, then get vehicleType of the vehicle
    let vehicle = await _db.query(
        `SELECT * FROM vehicles WHERE vehicleLicence = "${vehicleLicence}"`
    );
    vehicle = JSON.parse(JSON.stringify(vehicle));
    const vehicleTypeName = vehicle[0][0].vehicleTypeName;
    let vehicleType = await _db.query(
        `SELECT * FROM vehicleTypes WHERE vehicleTypeName = "${vehicleTypeName}"`
    );
    vehicleType = JSON.parse(JSON.stringify(vehicleType));

    // given vehicleType, get dayRate of the type, and calculate price of the rent
    const dayRate = vehicleType[0][0].dayRate;
    const price = dayRate * diffDays;
    const returnMessage = `
        This ${vehicleTypeName.toLowerCase()} vehicle (daily rate ${dayRate})
        was rented for ${diffDays} days, from ${fromDate} to ${endDate}. 
        Total price = ${dayRate} * ${diffDays} = ${price}
    `;
    log.info(returnMessage);

    // send query
    let results = await _db.query(
        `
            INSERT INTO returns(rentId, date, price, returnMessage)
            VALUES("${rentId}", STR_TO_DATE("${endDate}", "%Y-%m-%d"), ${price}, "${returnMessage}");
        `
    );
    results = await _db.query(`SELECT * FROM returns where rentId = "${rentId}"`);

    results = JSON.parse(JSON.stringify(results));
    const createdReturn = results[0][0];
    createdReturn.id = createdReturn.rentId;

    // send response
    res.status(201).json(createdReturn);
};

module.exports = createReturn;
