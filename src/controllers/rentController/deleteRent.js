const _db = require('../../db').getDb();

const deleteRent = async (req, res, next) => {
    // prepare & send query
    const rentId = req.params.id;
    await _db.query(`DELETE FROM rents WHERE rentId ='${rentId}'`);

    // send response
    res.status(204).json(null);
};

module.exports = deleteRent;
