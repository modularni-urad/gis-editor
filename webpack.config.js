require('dotenv').config()
const path = require('path')
const Webpack = require('webpack')
const { getIfUtils, removeEmpty } = require('webpack-config-utils')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const conf = new HtmlWebpackPlugin({
  url: process.env.API_URL || '/api',
  loginUrl: process.env.LOGIN_URL || '/login',
  version: '0.0.1',
  inject: false,
  template: './index.template.html'
})

module.exports = (env = {
  dev: true
}) => {
  const { ifProd } = getIfUtils(env)
  const babelOptions = {
    presets: ['stage-1', ['es2015', { 'modules': false }]],
    plugins: [
      'transform-object-rest-spread',
      'transform-decorators-legacy',
      'transform-class-properties'
    ]
  }

  const config = {
    devtool: env.prod ? false : (env.stg ? 'source-map' : 'inline-source-map'),
    entry: path.resolve('./src/main.js'),
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          options: babelOptions
        }
      ]
    },
    output: {
      path: path.join(__dirname, 'build'),
      filename: 'main.min.js'
    },
    plugins: removeEmpty([
      conf,
      new Webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: ifProd('"production"', '"development"')
        }
      }),
      new CleanWebpackPlugin(['build'], {
        root: path.resolve('./'),
        verbose: true,
        dry: false
      })
    ]),
    externals: {
      'axios': 'axios'
      // 'mobx': 'mobx',
      // // 'mobx-react': 'mobxReact',
      // 'react': 'React',
      // 'react-dom': 'ReactDOM'
    }
  }
  return config
}
