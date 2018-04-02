var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
  entry: './src/index.jsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist')
  },
  resolve: {
    extensions: ['.jsx', '.js']
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader'
      })
    }, {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react']
        }
      }
    }, {
      test: /\.(woff|svg|e0t|ttf)\??.*$/,
      loader: 'url-loader?limit=8192'
    }]
  },
  devtool: 'source-map',
  plugins: [
    // 清空dist文件夹
    new CleanWebpackPlugin('dist'),
    // 复制resource文件夹
    new CopyWebpackPlugin([
      {from: 'src/resource', to: 'resource' }
    ]),
    // 加入 html 模板任务
    new HtmlWebpackPlugin({
      // 模板文件
      template: 'src/index.html',
      // 打包后文件名称，会自动放到 output 指定的 dist 目录
      filename: 'index.html'
    }),
    new ExtractTextPlugin('style.css'),
    new UglifyJsPlugin()
  ]
}
