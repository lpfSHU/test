/**
 * Created by lipengfei on 2017/4/23.
 */
module.exports = {
    entry: "./js/main.js",//入口文件
    output: {//打包输出的文件
        path: __dirname,
        filename: "dist/js/bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
            }
        ]
    }
};
