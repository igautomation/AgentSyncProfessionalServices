const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: {
      name: 'agentsyncTestFramework',
      type: 'umd',
      export: 'default',
    },
    globalObject: 'this',
  },
  target: 'node',
  externals: {
    '@playwright/test': '@playwright/test',
    'playwright': 'playwright',
    'playwright-core': 'playwright-core',
    'pg': 'pg',
    'mysql2': 'mysql2',
    'mysql2/promise': 'mysql2/promise',
    'sqlite3': 'sqlite3',
    'sqlite': 'sqlite',
    'mssql': 'mssql',
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif|ttf|css|html)$/i,
        use: ['ignore-loader'],
      },
    ],
  },
  resolve: {
    fallback: {
      fs: false,
      path: false,
      crypto: false,
    },
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        format: {
          comments: false,
        },
      },
      extractComments: false,
    })],
  },
};