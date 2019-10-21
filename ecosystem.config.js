/* eslint-disable */
module.exports = {
    apps: [
        {
            name: 'super-rent-backend',
            script: 'src/index.js',
            exp_backoff_restart_delay: 1000,
            autorestart: true,
            watch: true,
            env: {
                NODE_ENV: 'development'
            },
            env_production: {
                NODE_ENV: 'production'
            }
        }
    ],

    deploy: {
        production: {
            user: 'node',
            host: '212.83.163.1',
            ref: 'origin/master',
            repo: 'git@github.com:repo.git',
            path: '/var/www/production',
            'post-deploy':
                'npm install && pm2 reload ecosystem.config.js --env production'
        }
    }
};
