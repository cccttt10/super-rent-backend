if (process.env.NODE_ENV === 'production')
    // eslint-disable-next-line no-console
    console.log = () => {}; // suppress all logs in production

const db = require('./db');
(async () => {
    await db.initDb();
    const app = require('./app');
    const log = require('./util/log');
    const port = process.env.PORT || 3300;
    app.listen(port, () => {
        log.success(`App running on port ${port}...`);
    });
})();
