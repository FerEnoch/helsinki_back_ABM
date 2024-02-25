/**
 * @file webpack.config.js
 * @author Amit Agarwal
 * @email amit@labnol.org
 *
 * Google Apps Script Starter Kit
 * https://github.com/labnol/apps-script-starter
 */

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const GasPlugin = require('gas-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

const getSrcPath = (filePath) => {
  const src = path.resolve(__dirname, 'src');
  return path.posix.join(src.replace(/\\/g, '/'), filePath);
};

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: false,
  context: __dirname,
  entry: getSrcPath('/index.js'),
  output: {
    filename: `code.js`,
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    extensions: ['.js'],
  },
  optimization: {
    minimize: process.env.NODE_ENV === 'production',
    minimizer: [
      new TerserPlugin({
        test: /\.js$/i,
        extractComments: false,
        terserOptions: {
          ecma: 2020,
          compress: false,
          mangle: {
            reserved: ['global'],
            keep_fnames: true, // Easier debugging in the browser
          },
          format: {
            comments: /@customfunction/i,
          },
        },
      }),
    ],
  },
  performance: {
    hints: false,
  },
  watchOptions: {
    ignored: ['**/dist', '**/node_modules', '**/test'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            cacheCompression: false,
            plugins: [['@babel/plugin-proposal-object-rest-spread', { loose: true, useBuiltIns: true }]],
          },
        },
      },
    ],
  },
  plugins: [
    new ESLintPlugin(),
    new webpack.ProgressPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: getSrcPath('**/*.html'),
          to: '[name][ext]',
          noErrorOnMissing: true,
        },
        {
          from: getSrcPath('../appsscript.json'),
          to: '[name][ext]',
        },
        // {
        //   from: getSrcPath('../functions/*.js'),
        //   to: '[name][ext]',
        //   noErrorOnMissing: true,
        //   info: { minimized: process.env.NODE_MODE === 'production' },
        // },
        {
          from: getSrcPath('../../node_modules/apps-script-oauth2/dist/OAuth2.gs'),
          to: 'OAuth2.js',
        },
      ],
    }),
    new GasPlugin({
      comments: false,
      source: 'digitalinspiration.com',
    }),
  ],
};
