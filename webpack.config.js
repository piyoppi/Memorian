module.exports = {
    entry: {
        script: './src/script.js',
        bg: './src/bg.js'
    },
    output: {filename: 'dist/[name].bundle.js'},
    module: {
        loaders: [{
            test: /\.jsx?$/, 
            exclude: /node_modules/,
            loader: 'babel-loader' 
        }]
    }
}
