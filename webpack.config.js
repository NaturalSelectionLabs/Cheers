const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const zlib = require('zlib');
module.exports = (env, argv) => ({
    devtool: argv.mode === 'production' ? false : 'inline-cheap-module-source-map',
    entry: {
        index: './src/index.ts',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash:8].js',
        publicPath: '/',
        clean: true,
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
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    minChunks: 2,
                },
                ethersProjectGroup: {
                    test: /@ethersproject/,
                    chunks: 'initial',
                    name: 'ethersProjectGroup',
                    enforce: true,
                    priority: 5,
                    reuseExistingChunk: true,
                },
            },
        },
    },
    module: {
        strictExportPresence: true,
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    compilerOptions: {
                        isCustomElement: (tag) => tag === 'model-viewer',
                    },
                },
            },
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            appendTsSuffixTo: [/\.vue$/],
                            ignoreDiagnostics: [
                                2339, 2551, 2556, 2571, 2345, 2322, 2531, 2769, 2554, 2363, 2683, 2774, 2630, 2304,
                                2683, 2630, 2695,
                            ],
                        },
                    },
                    {
                        loader: 'js-conditional-compile-loader',
                        options: {
                            isDevelop: !argv.mode === 'production',
                            isNDevelop: argv.mode === 'production',
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: ['@babel/plugin-proposal-optional-chaining'],
                        },
                    },
                ],
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
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto',
            },
        ],
    },
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: 'disabled',
            generateStatsFile: argv.mode !== 'production', // only set true under develop enviorment
        }),
        new HtmlWebpackPlugin(
            argv.mode === 'production'
                ? {
                      chunks: ['index'],
                      filename: 'index.ejs',
                      hash: true,
                      template: '!!raw-loader!src/assets/server.ejs',
                  }
                : {
                      chunks: ['index'],
                      filename: 'index.html',
                      hash: true,
                      template: 'src/assets/index.ejs',
                  },
        ),
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
        new webpack.DefinePlugin({
            PAGE_ENV:
                process.env.PAGE_ENV === 'development' ? JSON.stringify('development') : JSON.stringify(argv.mode),
        }),
    ].concat(
        argv.mode === 'production'
            ? [
                  // prod only plugins
                  new CompressionWebpackPlugin({
                      filename: '[path][base].gz',
                      algorithm: 'gzip',
                      test: /\.(js|css|html|otf)$/,
                      threshold: 10240,
                      minRatio: 0.8,
                  }),
                  new CompressionWebpackPlugin({
                      filename: '[path][base].br',
                      algorithm: 'brotliCompress',
                      test: /\.(js|css|html|svg|otf)$/,
                      compressionOptions: {
                          params: {
                              [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
                          },
                      },
                      threshold: 10240,
                      minRatio: 0.8,
                  }),
              ]
            : [],
    ),
    experiments: {
        topLevelAwait: true,
    },
    devServer: {
        static: path.join(__dirname, 'dist'),
        compress: true,
        hot: true,
        historyApiFallback: true,
        allowedHosts: 'all',
    },
});
