const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const pretty = require('pretty');


const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';
const path = require('path');
const outputFolder = process.env.NODE_ENV === 'preview' ? 'docs/' : process.env.NODE_ENV === 'localpreview' ? 'preview/' : 'dist/';
const isDev = mode === 'development';
const isProd = process.env.NODE_ENV === 'production';
const repoName = 'svelte-webpack-template';

const copyWebpack =
    new CopyWebpackPlugin([{
        from: '-/',
        context: 'src',
        to: '-/'
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

const prerenderSPA =
    new PrerenderSPAPlugin({
        // Required - The path to the webpack-outputted app to prerender.
        staticDir: path.join(__dirname, '/' + outputFolder),
        // Required - Routes to render.
        routes: ['/'],
        renderer: new PrerenderSPAPlugin.PuppeteerRenderer({
            injectProperty: 'IS_PRERENDERING',
            inject: true,
            renderAfterTime: 1000,
            //renderAfterDocumentEvent: 'all-views-ready',
            headless: false
        }),
        postProcess: function(renderedRoute) {
            renderedRoute.html = pretty(renderedRoute.html);
            return renderedRoute;
        }
    });

const plugins = [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
        title: 'title title title',
        template: isProd ? './src/index.html' : './src/index-dev.html',
        inject: !isProd
    }),
    new MiniCssExtractPlugin({
        filename: '[name].css'
    })
];

if (!isProd) {
    plugins.push(copyWebpack);
}
if (!isDev) {
    plugins.push(prerenderSPA);
}

console.log(process.env.NODE_ENV);
console.log('isProd: ' + isProd);
module.exports = env => {
    return {
        entry: {
            bundle: ['./src/main.js']
        },
        resolve: {
            alias: {
                svelte: path.resolve('node_modules', 'svelte')
            },
            extensions: ['.mjs', '.js', '.svelte'],
            mainFields: ['svelte', 'browser', 'module', 'main']
        },
        output: {
            path: __dirname + '/' + outputFolder,
            filename: '[name].js',
            chunkFilename: '[name].[id].js'
        },
        module: {
            rules: [{
                    test: /\.svelte$/,
                    use: {
                        loader: 'svelte-loader',
                        options: {
                            emitCss: true,
                            hotReload: true,
                            hydratable: true
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        /**
                         * MiniCssExtractPlugin doesn't support HMR.
                         * For developing, use 'style-loader' instead.
                         * */
                        !isDev ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader'
                    ]
                }
            ]
        },
        mode,
        plugins,
        devtool: isDev ? 'source-map' : false // TO DO: WILL WANT SOURCE MAPS
    }
};