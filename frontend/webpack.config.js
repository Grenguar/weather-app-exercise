const webpack = require('webpack');
const fs = require('fs');

const TransferWebpackPlugin = require('transfer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.jsx',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    contentBase: 'src/public',
    historyApiFallback: true,
    port: 8000,
    host: '0.0.0.0',
    // https: {
    //   key: fs.readFileSync('/path/to/server.key'),
    //   cert: fs.readFileSync('/path/to/server.crt'),
    //   ca: fs.readFileSync('/path/to/ca.pem'),
    // },
  },
  devtool: 'eval',
  output: {
    filename: 'index.jsx',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: { presets: ['react', 'es2016'] },
        }],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: 'src/public/index.html' }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new TransferWebpackPlugin([
      { from: 'src/public' },
    ], '.'),
    new webpack.DefinePlugin({
      'process.env': {
        ENDPOINT: JSON.stringify(process.env.ENDPOINT || 'http://0.0.0.0:9000/api'),
        GEO_API_KEY: JSON.stringify(process.env.GEO_API_KEY || 'empty'),
      },
    }),
  ],
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
  },
};
