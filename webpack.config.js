const ExtWebpackPlugin = require('@sencha/ext-webpack-plugin');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const portfinder = require('portfinder');

module.exports = async function (env) {
  var browserprofile
  var watchprofile
  var buildenvironment = env.environment || process.env.npm_package_extbuild_defaultenvironment
  if (buildenvironment == 'production') {
    browserprofile = false
    watchprofile = 'no'
  }
  else {
    if (env.browser == undefined) {env.browser = 'yes'}
    browserprofile = env.browser || 'yes'
    watchprofile = env.watch || 'yes'
  }
  const isProd = buildenvironment === 'production'
  var buildprofile = env.profile || process.env.npm_package_extbuild_defaultprofile
  var buildenvironment = env.environment || process.env.npm_package_extbuild_defaultenvironment
  var buildverbose = env.verbose || process.env.npm_package_extbuild_defaultverbose
  if (buildprofile == 'all') { buildprofile = '' }
  if (env.treeshake == undefined) {env.treeshake = 'no'}
  var treeshake = env.treeshake ? env.treeshake : 'yes'
  var basehref = env.basehref || '/'
  var mode = isProd ? 'production': 'development'

  portfinder.basePort = (env && env.port) || 1962;
  return portfinder.getPortPromise().then(port => {
    const nodeEnv = env && env.prod ? 'production' : 'development'
    const isProd = nodeEnv === 'production'
    const plugins = [
      new HtmlWebpackPlugin({
        template: 'index.html',
        hash: true
      }), 
      new ExtWebpackPlugin({
        framework: 'extjs',
        port: port,
        emit: 'yes',
        browser: browserprofile,
        watch: watchprofile,
        profile: buildprofile, 
        environment: buildenvironment, 
        verbose: buildverbose,
        treeshake: treeshake
      })
    ]
    if (!isProd) {
      plugins.push(
        new webpack.HotModuleReplacementPlugin()
      )
    }
    return {
      mode: 'development',
      cache: true,
      devtool: isProd ? 'source-map' : 'cheap-module-source-map',
      context: path.join(__dirname, './'),
      entry: {
        'index': './app.js'
      },
      output: {
        path: path.resolve(__dirname, './'),
        filename: '[name].js'
      },
      module: {
        rules: [
          {
            test: /.js$/,
            exclude: /node_modules/
          }
        ]
      },
      plugins,
      devServer: {
        contentBase: './',
        historyApiFallback: true,
        host: '0.0.0.0',
        hot: false,
        port,
        disableHostCheck: false,
        compress: isProd,
        inline: !isProd,
        stats: {
          entrypoints: false,
          assets: false,
          children: false,
          chunks: false,
          hash: false,
          modules: false,
          publicPath: false,
          timings: false,
          version: false,
          warnings: false,
          colors: {
            green: '[32m'
          }
        }
      }
    }
  });
}
