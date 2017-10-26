const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/handler.js',
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
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: 'src/handler.js'
  },
};
