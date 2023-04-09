// @ts-check
const { ESLint } = require('eslint');

/**
 * @type {ESLint.ConfigData}
 */
const config = {
    root: true,
    // 指定环境的全局变量
    env: {
        // browser: true,
        // node: true,
        // 开启 es6 语法, 并启用 es6 全局变量, 如 Set
        es6: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        // 这里会启动 ecma 新语法, 但不会自动启用 ecma 的新全局变量
        ecmaVersion: 'latest',
        // 指定 js 导入的方式, 默认 script, module 指模块导入方式, 对于 ES6+ 的语法和用 import / export 的语法必须用 module
        sourceType: 'module',
        ecmaFeatures: {
            // 开启 jsx
            jsx: true,
        },
        // 额外添加的属性, 而且是有用的
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
    },
    plugins: [
        'eslint-plugin-import',
        'eslint-plugin-prettier',
        'eslint-plugin-react',
        'eslint-plugin-react-hooks',
        '@typescript-eslint/eslint-plugin',
    ],
    ignorePatterns: ['*.scss', '*.js'],
    settings: {
        react: {
            version: '18.0.15',
        },
        'import/resolver': {
            alias: {
                map: [['@', './src/']],
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier',
    ],
    rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        'react/jsx-filename-extension': [
            'warn',
            {
                extensions: ['.jsx', '.tsx'],
            },
        ],
        'react/prop-types': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': ['warn', {}],
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        'no-empty-pattern': 'off',
        'no-restricted-imports': 'off',
        '@typescript-eslint/no-restricted-imports': [
            'warn',
            {
                name: 'react-redux',
                importNames: ['useSelector', 'useDispatch'],
                message: 'Use typed hooks `useAppDispatch` and `useAppSelector` instead.',
            },
        ],
        '@typescript-eslint/ban-types': 'off',
    },
    overrides: [
        {
            files: ['*.test.tsx', '*.test.ts', '*.test.jsx', '*.test.js', 'style.scss'],
            rules: {
                '@typescript-eslint/no-unsafe-call': 'off',
                '@typescript-eslint/no-unsafe-member-access': 'off',
            },
        },
    ],
};

module.exports = config;
