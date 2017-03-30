'use strict';

if (`${__dirname}/.env`) {
  require('dotenv').load({path: `${__dirname}/.env`});
}

if (process.env.NODE_ENV === 'testing') {
  require('./test/lib/test-env');
}

if (!process.env.API_URL || !process.env.NODE_ENV || !process.env.TITLE) {
  console.error('ERROR: ng-template requires .env file');
  process.exit(1);
}

const webpack = require('webpack');
const HTMLPlugin = require('html-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const production = process.env.NODE_ENV === 'production';

let plugins = [
  new ExtractTextPlugin('bundle.css'),
  new HTMLPlugin({
    template: `${__dirname}/app/index.html`,
  }),
  new webpack.DefinePlugin({
    __API_URL__: JSON.stringify(process.env.API_URL),
    __TITLE__: JSON.stringify(process.env.TITLE),
    __DEBUG__: JSON.stringify(!production),
  }),
];

if (production) {
  plugins = plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        warnings: false,
      },
    }),
    new CleanPlugin(),
  ]);
}

module.exports = {
  entry: `${__dirname}/app/entry.js`,
  devtool: production ? false : 'eval',
  plugins,
  output: {
    filename: 'bundle.js',
    path: require('path').resolve('build'),
  },
  sassLoader: {
    includePaths: [`${__dirname}/app/scss/lib`],
  },
  module: {
    
  }
};
