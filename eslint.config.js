// @ts-check

export default [
    {
        ignores: ['node_modules/**', 'dist/**']
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module'
        },
        rules: {
            'semi': ['error', 'never'],
            'quotes': ['error', 'single'],
            'indent': ['error', 2],
            'no-unused-vars': 'warn'
        }
    }
]
