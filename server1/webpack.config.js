const path = require('path')
  ;

const config = {
    entry: path.resolve(__dirname, 'client', 'client.js'),
    output: {
        path: path.resolve(__dirname, 'static'),
        filename: 'bundle.js'
    },
    module: {
        rules: [{
                test: /\.js[x]?$/,
                exclude: /(node_modules)/,
                use: 'babel-loader'
            }]
    }
}

module.exports = config;
