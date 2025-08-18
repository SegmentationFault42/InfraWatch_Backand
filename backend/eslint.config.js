import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default [
    {
        ignores: ['node_modules', 'dist', 'prettier.config.cjs'],
    },
    {
        ...js.configs.recommended,
        rules: {},
    },
    {
        ...tseslint.configs.recommended,
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
    prettier,
];
