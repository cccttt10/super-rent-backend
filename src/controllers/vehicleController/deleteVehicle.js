const _db = require('../../db').getDb();

const deleteVehicle = async (req, res, next) => {
    // prepare & send query
    const vehicleLicence = req.params.id;
    await _db.query(
        `DELETE FROM vehicles WHERE vehicleLicence ='${vehicleLicence}'`
    );

    // send response
    res.status(204).json(null);
};

module.exports = deleteVehicle;
