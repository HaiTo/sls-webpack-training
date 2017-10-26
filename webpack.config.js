const path = require('path');
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: './handler.js',
  target: 'node',

  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      include: __dirname,
      exclude: /node_modules/,
    }]
  },
  externals: [
    nodeExternals(),
  ],
};
