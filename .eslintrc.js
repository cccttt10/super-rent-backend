// prettier-ignore
module.exports = {
    "extends": ['eslint:recommended'],
    "env": {
        "node": true,
        "es6": true
    },
    "parserOptions": {
        "ecmaVersion": 8
    },
    "overrides": [
        {
            "files": ['src/util/log.js'],
            "rules": {
                'no-console': 'off'
            }
        }
    ],
    "rules": {
        'no-trailing-spaces': 'error',
        'eqeqeq': 'error',
        'no-console': 'warn',
        'camelcase': 'warn'
    }
};
