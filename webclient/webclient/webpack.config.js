const path = require('path')
const webpack = require('webpack')
const common = require('./webpack.common')

const WEBCLIENT_PORT = process.env.PORT || 8090
const GATEWAY_HOST = process.env.GATEWAY_HOST || 'gateway'
const GATEWAY_PORT = process.env.GATEWAY_PORT || '8000'


console.log('\n\n')
console.log('process.env.PORT', process.env.PORT)
console.log('process.env.GATEWAY_URL', process.env.GATEWAY_URL)
console.log('process.env.GATEWAY_HOST', process.env.GATEWAY_HOST)
console.log('process.env.GATEWAY_PORT', process.env.GATEWAY_PORT)
console.log('\n\n')


const config = {
  mode: 'development',
  entry: {
    index: [
      path.resolve(__dirname, './src/index.js'),
    ],
  },
  output: common.output,
  module: {
    rules: common.rules,
  },
  plugins: common.plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
  ]),
  resolve: common.resolve,
  devServer: {
    historyApiFallback: true,
    inline: true,
    hot: true,
    host: '0.0.0.0',
    contentBase: path.resolve(__dirname, 'dist'),
    headers: { 'Access-Control-Allow-Origin': '*' },
    port: WEBCLIENT_PORT,
    public: 'localhost',
    proxy: {
      '/api': `http://${GATEWAY_HOST}:${GATEWAY_PORT}`,
      '/graphql': `http://${GATEWAY_HOST}:${GATEWAY_PORT}`,
      '/subscriptions':  {
        target: `ws://${GATEWAY_HOST}:${GATEWAY_PORT}`,
        secure: false,
        ws: true,
      },
      '/socket.io': {
        target: `ws://${GATEWAY_HOST}:${GATEWAY_PORT}`,
        secure: false,
        ws: true,
      },
    },
  },
  devtool: 'inline-source-map',
}


module.exports = config
