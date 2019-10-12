class QueryHandler {
    defaultCallBack (err, res, fields) {
        if (err) throw err;
        else return res;
    }
}

module.exports = QueryHandler;