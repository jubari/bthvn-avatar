var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');

module.exports = {
  context: __dirname,
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./src/js/scripts.js",
  output: {
    path: __dirname + "/dist",
    filename: "avatar.min.js",
    libraryTarget: 'var',
    library: 'Avatar'
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
  module: {
    loaders: [
      {
        test: /\.css/,
        loaders: ['style', 'css'],
        include: __dirname + '/src/css'
      },
      {
        test: /\.png$/,
        loader: "url-loader?limit=10000000",
        include: __dirname + '/src/img'
      },
      {
        test: /\.jpg$/,
        loader: "file-loader",
        include: __dirname + '/src/img'
      }
    ],
  }
};