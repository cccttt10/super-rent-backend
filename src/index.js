if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line no-console
    console.log = () => {}; // suppress all logs in production
    require('@google-cloud/debug-agent').start();
}

const db = require('./db');
(async () => {
    await db.initDb();
    const app = require('./app');
    const log = require('./util/log');
    const port = process.env.NODE_ENV === 'development' ? 3300 : process.env.PORT;
    app.listen(port, () => {
        log.success(`App running on port ${port}...`);
    });
})();
