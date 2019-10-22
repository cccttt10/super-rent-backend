const _db = require('../../db').getDb();

const deleteReservation = async (req, res, next) => {
    // prepare & send query
    const confNum = req.params.id;
    await _db.query(`DELETE FROM reservations WHERE confNum ='${confNum}'`);

    // send response
    res.status(204).json(null);
};

module.exports = deleteReservation;
