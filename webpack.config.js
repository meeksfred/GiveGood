'use strict';

const HTMLPlugin = require('html-webpack-plugin');

module.exports = {
  entry: `${__dirname}/app/entry.js`,
  output: {
    filename: 'bundle.js',
    path: require('path').resolve('build'),
  },
  plugins: [
    new HTMLPlugin(),
  ],
};
