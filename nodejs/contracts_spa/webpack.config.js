const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: './app.js',

    module: {
        rules: [
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.twig/, type: 'asset/resource' }
        ]
    },

    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index_bundle.js",
        publicPath: '',
        assetModuleFilename: (pathData) => {
            const filepath = path
                .dirname(pathData.filename)
                .split("/")
                .slice(1)
                .join("/");
            return `${filepath}/[name][ext][query]`;
        },
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: 'cdn.html'
        })
    ],

    externals: {
        twig: "Twig"
    },

    // devServer: {
    //     headers: {
    //         "Access-Control-Allow-Origin": "*",
    //         "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    //         "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    //     }
    // },

    mode: 'development'
};