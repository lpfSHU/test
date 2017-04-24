/**
 * Created by lipengfei on 2017/4/23.
 */
let HtmlWebpackPlugin = require('html-webpack-plugin');
let path = require('path');
// console.log(path.resolve(__dirname, 'node_modules'))
// console.log(__dirname+'/node_modules')
module.exports = {
    entry: {
        main: "./js/main.js"
    },//入口文件
    output: {//打包输出的文件
        path: __dirname+'/dist/',
        filename: "js/[name].js"
        // filename: "js/[name]-[hash].js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                include: path.resolve(__dirname, 'js'),
                // include: __dirname+'./js/',
                exclude: path.resolve(__dirname, 'node_modules')
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader?importLoaders=1!postcss-loader",
                include: path.resolve(__dirname, 'css'),
                // include: __dirname+'./js/',
                exclude: path.resolve(__dirname, 'node_modules'),
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
            filename: 'first.html',
            inject: 'body',
            title: 'webpack is good-first',
            chunks: ['main'],
            minify: {
                // removeComments:true,
                // collapseWhitespace:true,
                // minifyCSS:true,
                // minifyJS:true

            },
        }),
        new HtmlWebpackPlugin({
            template: 'index.html',
            filename: 'second.html',
            inject: 'body',
            chunks: ['main'],
            title: 'webpack is good-second',
            minify: {
                // removeComments:true,
                // collapseWhitespace:true,
                // minifyCSS:true,
                // minifyJS:true
            },
        }),
    ]
};
