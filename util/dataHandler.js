exports.paginate = (data, req) => {
    const start = Number(req.query._start);
    const end = Number(req.query._end);
    return data.slice(start, end);
};

exports.sort = (data, req) => {
    const order = req.query._order;
    const sortBy = req.query._sort;
    return data.sort((a, b) => {
        if (order === 'DESC') {
            return a[sortBy] > b[sortBy];
        }
        else if (order === 'ASC') {
            return a[sortBy] < b[sortBy];
        }
    });
};
