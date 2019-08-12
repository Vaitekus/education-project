const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");

const BUILD_PATH = path.join(__dirname, "dist");
const MODE = process.env.NODE_ENV || "development";

module.exports = {
    mode: MODE,
    devtool: 'source-map',
    entry: path.join(__dirname, "./src/index.js"),
    output: {
        filename: "./main.js",
        path: path.resolve(__dirname, BUILD_PATH),
        publicPath: ""
    },
    resolve: {
        extensions: [".jsx", ".js"],
        modules: [path.resolve(__dirname, "node_modules")]
    },
    module: {
        rules: [
            {
              test: /\.html$/,
              use: [
                {
                  loader: "html-loader",
                  options: { minimize: true }
                }
              ]
            },
            {
              test: /\.scss$/,               
              use: [
                {loader: 'style-loader',},
                { loader: MiniCssExtractPlugin.loader}, 
                { 
                  loader: 'css-loader', 
                  options: { url: true, sourceMap: true } 
                },
                { 
                  loader: 'sass-loader', 
                  options: { sourceMap: true } 
                }, 
                { 
                  loader: 'postcss-loader', options: {
                  sourceMap: true,
                  config:  {
                    path: 'postcss.config.js',
                  }
                  } 
                }                   
              ]
            },
            {test: /\.(png|jpg|gif|html)$/, use: ["file-loader?name=[name].[ext]"]}
        ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebPackPlugin({
        template: "./src/views/index.html",
        filename: "./index.html"
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css"
      }),
      new CopyWebpackPlugin([{from: "./src/assets", to: BUILD_PATH + "/assets/"}]),
      new ExtractTextPlugin("main.css", {options: {allChunks: true}})
    ],
    devServer: {
      contentBase: path.resolve(__dirname, "../src/views/"),
      compress: true,
      https: false,
      open: true,
      overlay: true,
      host: "127.0.0.1",
      port: 8080
    }
};
