module.exports = {
    entry: {
        script: './src/script.js',
        bg: './src/bg.js',
        popup: './src/popup.js'
    },
    output: {filename: 'dist/js/[name].bundle.js'},
    module: {
        loaders: [
            {
                test: /\.jsx?$/, 
                exclude: /node_modules/,
                loader: 'babel-loader' 
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader'],
            },
        ]
    },
    node: {
        fs: "empty"
    }
}
