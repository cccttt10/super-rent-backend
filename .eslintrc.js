module.exports = {
    extends: ['eslint:recommended'],
    env: {
        node: true,
        es6: true
    },
    overrides: [
        {
            files: ['util/log.js'],
            rules: {
                'no-console': 'off'
            }
        }
    ],
    rules: {
        'no-trailing-spaces': 'error',
        'eqeqeq': 'error',
        'no-console': 'warn',
        'camelcase': 'warn'
    }
};
