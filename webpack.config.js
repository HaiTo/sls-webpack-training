const path = require('path');
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: './handler.js',
  target: 'node',

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      }
    ]
  },
  externals: [
    nodeExternals(),
  ]
};
