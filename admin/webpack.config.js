const path = require('path');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const MODE = process.env.NODE_ENV || "development";

module.exports = {
    mode: MODE,
    devtool: 'source-map',
    entry: path.join(__dirname, "./src/index.js"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: '[name].js'
    },
    resolve: {
        extensions: [".jsx", ".js"],
        modules: [path.resolve(__dirname, "node_modules")]
    },
    module: {
        rules: [
           {
                test: /\.scss$/,
                use: [
                    {loader: 'style-loader'},
                    {
                        loader: 'css-loader',
                        options: {url: true, sourceMap: true}
                    },
                    {
                        loader: 'postcss-loader', options: {
                            sourceMap: true,
                            config: {
                                path: 'postcss.config.js',
                            }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {sourceMap: true}
                    }
                ]
            },
            {test: /\.(png|jpg|gif)$/, use: ["file-loader?name=[name].[ext]"]}
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({filename: 'index.html', template: 'src/views/index.html'}),
        new CopyWebpackPlugin([{from: "./src/assets", to: "./assets/"}])
    ],
    devServer: {
        https: false,
        open: true
    }
};
