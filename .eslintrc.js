// prettier-ignore
module.exports = {
    'extends': ['eslint:recommended'],
    'env': {
        'node': true,
        'es6': true
    },
    'parserOptions': {
        'ecmaVersion': 8
    },
    'overrides': [
        {
            'files': ['src/util/log.js'],
            'rules': {
                'no-console': 'off'
            }
        }
    ],
    'rules': {
        'require-atomic-updates': 'off',
        'no-var': 'error',
        'require-await': 'error',
        'no-trailing-spaces': 'error',
        'eqeqeq': 'error',
        'no-console': 'error',
        'camelcase': 'error',
        'no-unused-vars': [
            'error', 
            { 'argsIgnorePattern': 'next' }
        ]
    }
};
