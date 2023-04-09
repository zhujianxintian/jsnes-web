// @ts-check
const postcss = require('postcss');
// postcssPresetEnv 中包含了 autoprefixer
const postcssPresetEnv = require('postcss-preset-env');

const config = {
    plugins: [
        'postcss-flexbugs-fixes',
        ['postcss-preset-env', { autoprefixer: { flexbox: 'no-2009' }, stage: 3 }],
        'postcss-normalize',
    ],
};

module.exports = config;
