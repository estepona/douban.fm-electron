const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
  {
    mode: 'production',
    entry: './src/app.ts',
    target: 'electron-main',
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: /src/,
          use: [{ loader: 'ts-loader' }],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.json', '.ts', '.tsx'],
    },
    output: {
      path: __dirname + '/dist',
      filename: 'app.js',
    },
    plugins: [
      new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('prod') }),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
    ],
  },
  {
    mode: 'production',
    entry: {
      main: './src/components/main/main_window.tsx',
    },
    target: 'electron-renderer',
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader',
        },
        {
          test: /\.css$/i,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'svg-url-loader',
              options: {
                limit: 10000,
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.json', '.ts', '.tsx', '.css'],
    },
    output: {
      path: __dirname + '/dist',
      filename: '[name].js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        chunks: 'main',
        template: './src/html/main.html',
        filename: 'main.html',
      }),
    ],
  },
];
