/* eslint-disable */
module.exports = {
    apps: [
        {
            name: 'super-rent-backend',
            script: './src/index.js',
            exp_backoff_restart_delay: 1000,
            autorestart: true,
            watch: false,
            env: {
                NODE_ENV: 'development'
            },
            env_production: {
                NODE_ENV: 'production'
            }
        }
    ]
};
