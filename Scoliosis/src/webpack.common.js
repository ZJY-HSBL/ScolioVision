const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: {
    app: './js/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: 'js/[name].[contenthash:8].js',
    publicPath: './'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: 'body',
      scriptLoading: 'defer'
    })
  ],
  resolve: {
    extensions: ['.js']
  },
  performance: {
    hints: false
  }
};
