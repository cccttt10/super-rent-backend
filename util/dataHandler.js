exports.paginate = (data, req) => {
    const start = Number(req.query._start);
    const end = Number(req.query._end);
    return data.slice(start, end);
};
