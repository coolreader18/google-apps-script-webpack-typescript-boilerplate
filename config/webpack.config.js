const webpack = require("webpack");
const GASWebpackPlugin = require("./gas-webpack-plugin");
const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const gasPlugin = new GASWebpackPlugin();

const config = {
  entry: "./src/index.ts",
  output: {
    libraryTarget: "this",
    path: path.join(__dirname, "../dist")
  },
  plugins: [gasPlugin],
  resolve: {
    plugins: [new TsconfigPathsPlugin()]
  },
  module: {
    rules: [
      {
        test: /\.tsx?/,
        loader: "ts-loader",
        options: {
          getCustomTransformers: () => ({
            before: [gasPlugin.transformer]
          })
        }
      }
    ]
  }
};

module.exports = config;
