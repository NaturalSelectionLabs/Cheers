const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => ({
    devtool: argv.mode === 'production' ? false : 'inline-cheap-module-source-map',

    entry: {
        index: './src/index.ts',
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/',
    },

    resolve: {
        extensions: ['.js', '.less', '.ts'],
        alias: {
            '@': __dirname + '/src',
        },
        fallback: {
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify'),
            buffer: require.resolve('buffer/'),
            assert: require.resolve('assert/'),
            https: require.resolve('https-browserify'),
            http: require.resolve('stream-http'),
            os: require.resolve('os-browserify/browser'),
            url: false,
        },
    },

    module: {
        strictExportPresence: true,
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                },
                exclude: /node_modules/,
            },
            {
                test: /\.(postcss|css)$/,
                use: [
                    'vue-style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require('tailwindcss'),
                                    require('postcss-nested'),
                                    require('autoprefixer'),
                                    require('cssnano')({
                                        preset: 'default',
                                    }),
                                ],
                            },
                        },
                    },
                    // 'less-loader'
                ],
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto',
            },
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            chunks: ['index'],
            filename: 'index.html',
            title: 'RSS3 Page',
            favicon: 'public/favicon.ico',
            hash: true,
            template: 'src/assets/index.ejs',
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: 'public',
                    to: '',
                },
            ],
        }),
        new VueLoaderPlugin(),
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
    experiments: {
        topLevelAwait: true,
    },

    devServer: {
        static: path.join(__dirname, 'dist'),
        compress: true,
        hot: true,
        historyApiFallback: true,
    },

    optimization: {
        splitChunks: {
            chunks: 'all',
            maxSize: 20000,
        },
    },
});
