const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: path.resolve(__dirname),
  devtool: 'source-map', // only for sentry
  entry: './index.ts',
  mode: 'production',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
    ],
  },
  output: {
    filename: 'electron.js',
    path: path.resolve(__dirname, '../public'),
  },
  plugins: [
    new webpack.DefinePlugin({
      __dirname: '__dirname',
      __filename: '__dirname',
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  target: 'electron-main',
};
