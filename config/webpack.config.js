const GASWebpackPlugin = require("./gas-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

const gasPlugin = new GASWebpackPlugin();
const babelLoader = {
  loader: "babel-loader",
  options: require("./babel.config")
};
const isDev = process.env.NODE_ENV !== "production";
const mode = isDev ? "development" : "production";

const assetTypes = {
  data: "data.html",
  source: "js"
};
const assets = {
  client: { type: "data", path: "./src/client/index.tsx" },
  main: { type: "source", path: "./src/index.ts" }
};

const config = {
  entry: Object.entries(assets)
    .map(([filename, { type, path }]) => {
      filename = `${filename}.${assetTypes[type]}`;
      return [filename, path];
    })
    .reduce((obj, [key, val]) => ((obj[key] = val), obj), {}),
  output: {
    filename: "[name]",
    libraryTarget: "this",
    path: path.resolve("dist")
  },
  mode,
  plugins: [
    gasPlugin,
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(mode)
      }
    })
  ],
  resolve: {
    extensions: [".js", ".ts", ".tsx"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          babelLoader,
          {
            loader: "ts-loader",
            options: {
              getCustomTransformers: () => ({
                before: [gasPlugin.transformer]
              })
            }
          }
        ]
      },
      {
        test: /\.js$/,
        use: [babelLoader]
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      }
    ]
  },
  optimization: {
    minimize: false
  }
};

module.exports = config;
