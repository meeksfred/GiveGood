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
const CleanPlugin = require('clean-webpack-plugin'); // used to delete Build directory next time we build
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // makes the bundle.css

const production = process.env.NODE_ENV === 'production';

let plugins = [
  new ExtractTextPlugin({ filename: 'bundle.css'}),
  new HTMLPlugin({
    template: `${__dirname}/app/index.html`,
  }),
  new webpack.DefinePlugin({
    __API_URL__: JSON.stringify(process.env.API_URL),
    __TITLE__: JSON.stringify(process.env.TITLE),
    __DEBUG__: JSON.stringify(!production),
    __FACEBOOK_CLIENT_ID__: JSON.stringify(process.env.FACEBOOK_CLIENT_ID),
  }),
];

if (production) {
  plugins = plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
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
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.(woff|ttf|eot).*/,
        use: 'url-loader?limit=10000&name=font/[name].[ext]',
      },
      {
        test: /\.(jpg|jpeg|bmp|svg|tiff|gif|png)$/,
        use: 'url-loader?limit=10000&name=image/[hash].[ext]',
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader', options: { sourceMap: true },
          },
          {
            loader: 'resolve-url-loader',
          },
          {
            loader: 'sass-loader', options: {
              sourceMap: true,
              includePaths: [`${__dirname}/app/scss/lib`],
            },
          }],
        }),
      },
    ],
  },
};
