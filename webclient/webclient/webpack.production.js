const webpack = require('webpack')
const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const common = require('./webpack.common')

let plugins = common.plugins.concat([
  new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[id].css',
  }),
])

if (Boolean(process.env.ANALYZE_BUNDLE)) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  plugins = common.plugins.concat(new BundleAnalyzerPlugin())
}

const productionConfig = {
  mode: 'production',
  entry: {
    index: path.resolve(__dirname, './src/index.js'),
  },
  output: common.output,
  module: {
    rules: common.rules.concat([
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
    ]),
  },
  plugins,
  resolve: common.resolve,
  performance: {
    hints: false,
  },
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({}),
    ],
    usedExports: true,
    sideEffects: false,
  },
  devtool: 'nosources-source-map',
}

module.exports = productionConfig
