//webpack.spec.js
const path = require("path");
const { TsconfigPathsPlugin } = require("tsconfig-paths-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ["ts-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.ts$/,
        enforce: "post",
        use: [
          {
            loader: "coverage-istanbul-loader",
            options: { esModules: true },
          },
        ],
        exclude: /(node_modules|\.spec\.ts$)/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, "./tsconfig.json"),
      }),
    ],
  },
  stats: { warnings: false },
  performance: {
    hints: false,
  },
};
