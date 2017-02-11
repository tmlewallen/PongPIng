var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');

module.exports = {
    context: __dirname + '/app',
    devtool: debug ? "inline-sourcemap" : null,
    entry: "./app.js",
    module : {
        loaders : [
            {
                test : /\.js?$/,
                exclude : /(node_modules)/,
                loader : 'babel-loader'
            }
        ]
    },
    output: {
        path: __dirname + "/dist",
        filename: "app.min.js"
    },
    plugins: debug ? [] : [
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
        ],
};
