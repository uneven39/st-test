// const path = require('path');
// const webpack = require('webpack');
const webpack = require('webpack');
const ExtractTextPlugin	= require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        vendor: './assets/js/vendor.js',
        index: './assets/js/index.js'
    },
    output: {
        path: __dirname + '/web/assets',
        filename: 'js/[name].js'
    },
    module: {
        rules: [
            // Scripts:
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            // Styles:
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true
                            }
                        },
                        'resolve-url-loader',
                        'sass-loader?sourceMap'
                    ]
                })
            },
            // Fonts:
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                loader: 'file-loader',
                options: {
                    name: './fonts/[name].[ext]'
                }
            },
        ]
    },
    plugins: [
        // Separate css files
        new ExtractTextPlugin('./css/styles.css', {
            filename:  (getPath) => {
                return getPath('css/[name].css').replace('css/js', 'css');
            },
            allChunks: true
        }),
        // Compress js
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                screw_ie8: true
            },
            output: {
                comments: false,
            }
        }),
        // Provide jquery (for bootstrap)
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            jquery: 'jquery',
            _: 'underscore'
        })
    ]
};