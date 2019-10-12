require('./db').initDb();
const app = require('./app');
const log = require('./util/log');
const port = process.env.PORT || 3300;

app.listen(port, () => {
    log.success(`App running on port ${port}...`);
});
