const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[contenthash].js',
        publicPath: '',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    compilerOptions: {
                        whitespace: 'condense'
                    }
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'images/',
                    esModule: false,
                    publicPath: '../images'
                }
            },
            {
                test: /\.(mp3|wav|ogg|flac|aac)$/i,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'audio/',
                    publicPath: '../audio'
                }
            },
            {
                test: /\.(mp4|webm|ogg|mov)$/i,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'assets/',
                    publicPath: '../assets'
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html',
            inject: true
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'public',
                    to: '',
                    globOptions: {
                        ignore: ['**/index.html', '**/node_modules/**']
                    }
                },
                {
                    from: 'public/src/data',
                    to: 'src/data',
                    globOptions: {
                        ignore: ['**/node_modules/**']
                    }
                }
            ]
        })
    ],
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            'assets': path.resolve(__dirname, 'src/assets')
        }
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 8083,
        hot: true,
        open: true,
        historyApiFallback: true,
        proxy: [
            {
                context: ['/api'],
                target: 'http://localhost:3000',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/api'
                }
            }
        ]
    }
}; 