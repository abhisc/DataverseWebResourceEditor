// webpack.config.js
const path = require('path');

module.exports = {
  mode: 'production', // or 'development' for unminified output
  entry: {
    editor: './src/editor.js',
    popup: './src/popup.js',
    background: './src/background.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    alias: {
      '@codemirror/state': path.resolve('./node_modules/@codemirror/state'),
    },
  },
  devtool: 'source-map',
};
