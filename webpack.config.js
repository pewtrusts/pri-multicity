const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {sass} = require('svelte-preprocess-sass');
const TerserPlugin = require('terser-webpack-plugin');
const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';
const path = require('path');
const outputFolder = process.env.NODE_ENV === 'preview' ? 'github/' : process.env.NODE_ENV === 'localpreview' ? 'preview/' : 'dist/';
const isDev = mode === 'development';
const isProd = process.env.NODE_ENV === 'production';

const repoName = 'pri-multicity';
const publicPath = isProd ? '/~/media/data-visualizations/interactives/2019/multicity/updateNov2020/' : '';

console.log(sass);

const copyWebpack =
    new CopyWebpackPlugin([{
        from: '-/',
        context: 'src',
        to: '-/'
    }, {
        from: 'data/',
        context: 'src',
        to: 'data/'
    }, {
        from: 'assets/',
        context: 'src',
        to: 'assets/',
        ignore: ['Pew/css/**/*.*']
    }, {
        from: 'assets/Pew/css/',
        context: 'src',
        to: 'assets/Pew/css/',
        transform(content, path) {
            if (process.env.NODE_ENV === 'preview') {
                // this modifies the content of the files being copied; here making sure url('/...') is changed so that it will
                // work on gitHub pages where oublic path is /{repoName}/
                // also changes references to 'pew' to refer to 'Pew'
                return content.toString().replace(/url\("\/([^/])/g, 'url("/' + repoName + '/$1').replace(/\/pew\//g, '/Pew/');
            } else {
                return content.toString();
            }
        }
    }]);

const plugins = [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
        title: 'title title title',
        template: isProd ? './src/index.html' : './src/index-dev.html',
        inject: !isProd,
    }),
    new MiniCssExtractPlugin({
        filename: 'mm-styles.css'
    }),
    new webpack.DefinePlugin({
        'PUBLICPATH': '"' + publicPath + '"', // from https://webpack.js.org/plugins/define-plugin/: Note that because the plugin does a direct text replacement, the value given to it must include actual quotes inside of the string itself. Typically, this is done either with alternate quotes, such as '"production"', or by using JSON.stringify('production').
        'BUILDTYPE': '"' + process.env.NODE_ENV + '"', 
    }),
];

const svelteUse = [
    {
        loader: 'svelte-loader',
        options: {
            emitCss: true,
            hotReload: true,
            preprocess: {
                style: sass({}, {name: 'scss'})
            }

        }
    }
];

if (!isDev) {
    svelteUse.unshift({
        loader: 'babel-loader',
        options: {
            presets: ['@babel/preset-env']
        }
    });
}

const rules = [
    
    {
        test: /\.svelte$/,
        use: svelteUse
    },
    {
        test: /\.css$/,
        use: [
            /**
             * MiniCssExtractPlugin doesn't support HMR.
             * For developing, use 'style-loader' instead.
             * */
            !isDev ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
        ]
    },
    {
        test: /\.scss$/,
        use: [
            /**
             * MiniCssExtractPlugin doesn't support HMR.
             * For developing, use 'style-loader' instead.
             * */
            !isDev ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'sass-loader'
        ]
    },
    {
        test: /\.csv$/,
        loader: 'file-loader',
        options: {
            name: 'data/[name].[ext]?v=[hash:6]', 
        }
    },
    {
        test: /\.md$/,
        use: [
            {
                loader: 'html-loader'
            },
            {
                loader: 'markdown-loader',
                options: {
                    smartypants: true
                }
            }
        ]
    },
    {
        test: /overview\.html$/,
        use: 'html-loader'
    }
];

if (!isProd) {
    plugins.push(copyWebpack);
}
if (!isDev) {
    rules.unshift({
        test: /\.js$|\.mjs$/,
        use: [{
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env']
            }
        }]
    });
}
module.exports = env => {
    return {
        devtool: !isProd ? 'source-map' : false,
        entry: {
            index: ['./src/main.js']
        },
        mode,
        module: {
            rules
        },
        optimization: {
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            drop_console: true,
                        },
                    },
                })
            ]
        },
        output: {
            path: __dirname + '/' + outputFolder,
            filename: '[name].js?v=[hash:6]',
            chunkFilename: '[name].[id].js',
            publicPath
        },
        plugins,
        resolve: {
            alias: {
                svelte: path.resolve('node_modules', 'svelte'),
                "@Submodule": path.resolve('submodules')
            },
            extensions: ['.mjs', '.js', '.svelte', '.html'],
            mainFields: ['svelte', 'browser', 'module', 'main']
        },
    }
};