const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const rules = [
  {
    test: /\.(js|jsx)$/,
    loader: 'babel-loader',
    exclude: [/node_modules/, /-test\.(js|jsx)/],
    query: {
      presets: ['@babel/preset-env'],
    },
  },
  {
    test: /\.(css|scss|less|sass)$/,
    loader: 'style-loader!css-loader!sass-loader',
    // options: {
    //   data: `$static-url: ${process.env.GATEWAY_URL}/static`,
    // },
  },
  {
    test: /\.(png|jpg|gif|svg)$/,
    loader: 'file-loader',
    options: {
      name: '[name].[ext]?[hash]',
    },
  },
  {
    test: /\.(json)$/,
    loader: 'json-loader',
    exclude: [/node_modules/],
  },
  {
    test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
    loader: 'file-loader',
  },
  {
    test: /\.mjs$/,
    include: /node_modules/,
    type: 'javascript/auto',
  },
]

const resolve = {
  extensions: ['.js', '.jsx', '.json', '.sass'].concat(
    ['.webpack.js', '.web.js', '.mjs'] /* Fix for graqphql packages used by apollo-boost */
  ),
  alias: {
    '@': path.resolve('src'),
    '~': path.resolve(__dirname, '../'),
  },
}

const plugins = [
  new webpack.NamedModulesPlugin(),
  new CleanWebpackPlugin(['dist']),
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, './src/index.html'),
    filename: 'index.html',
    hash: true,
    inject: true,
  }),
  new CopyWebpackPlugin([
    { from: './src/static/', to: path.resolve(__dirname, './dist/static/') },
    { from: './node_modules/qr-scanner/qr-scanner-worker.min.js', to: path.resolve(__dirname, './dist/static/') },
  ]),
  new ServiceWorkerWebpackPlugin({
    entry: path.resolve(__dirname, './src/constructors/sw/sw.js'),
  }),
  new webpack.DefinePlugin({
    'process.env.APOLLO_HTTP_URI': JSON.stringify(process.env.APOLLO_HTTP_URI || ''),
    'process.env.APOLLO_WEBSOCKET_URI': JSON.stringify(process.env.APOLLO_WEBSOCKET_URI || ''),
    'process.env.GATEWAY_URL': JSON.stringify(process.env.GATEWAY_URL || ''),
    'process.env.GATEWAY_HOST': JSON.stringify(process.env.GATEWAY_HOST || ''),
    'process.env.GATEWAY_PORT': JSON.stringify(process.env.GATEWAY_PORT || ''),
    'process.env.SERVICE_WORKER_APPLICATION_SERVER_KEY': JSON.stringify(process.env.SERVICE_WORKER_APPLICATION_SERVER_KEY || 'BHEa09WcrSPva3MOvSIXlsGRqEVlfjOvVrT-S5_T__9U9uImayVsaa7xfT8d0Cx_5A3hBIV5lB7fiCsMWdbS5mE'),
    'process.env.SOCKET_ADDRESS': JSON.stringify(process.env.SOCKET_ADDRESS || '/'),
    'process.env.WEB3_PROVIDER': JSON.stringify(process.env.WEB3_PROVIDER || ''),
    'process.env.PORT': JSON.stringify(process.env.PORT || 8090),
  }),
]


const output = {
  path: path.resolve(__dirname, 'dist'),
  filename: '[name].js',
  publicPath: '/',
  chunkFilename: '[name].[id].[hash].js',
}

module.exports = {
  rules,
  resolve,
  output,
  plugins,
}
