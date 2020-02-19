const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


module.exports = {
  mode : 'development',
  entry : './src/index.js',
  output:{
    filename : 'js/e-market-app.js',
    path : path.resolve(__dirname,'dist')
  },
  devServer: {
    contentBase : path.join(__dirname,'dist'),
    port : 9000
  },
  module:{
    rules:[
      {
        test : /\.(c|sa|sc)ss$/,
        use : [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins:[
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template : './public/index.html'
    }),
    new MiniCssExtractPlugin({
      filename : 'css/[name].css',
      chunkFilename: '[id].css'
    })
  ]
}
