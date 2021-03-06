var path = require('path')
var webpack = require('webpack')

module.exports = {
    devtool: process.env.WEBPACK_DEVTOOL || 'source-map',

    entry: {
        back : './js/back.js',
        front : './js/front.js'
    },

    output: {
        path: path.join(__dirname, 'public'),
        filename: '[name].js'
    },

    resolve: {
        extensions: ['', '.js', '.jsx']
    },

    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel' }
        ]
    },

    plugins: [
        new webpack.NoErrorsPlugin()
    ]
}
