if (!process.env.NODE_ENV) process.env.NODE_ENV = "production";
require("dotenv").load();

const GASWebpackPlugin = require("./gas-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const fs = require("fs");
const webpack = require("webpack");

const gasPlugin = new GASWebpackPlugin();
const babelLoader = {
  loader: "babel-loader",
  options: require("./babel.config")
};
const isDev = process.env.NODE_ENV !== "production";
const mode = isDev ? "development" : "production";
const ts = require("typescript");

const assetTypes = {
  data: "data.html",
  source: "js"
};
const resolveModuleParams = [
  path.resolve("./src/index"),
  {},
  ts.createCompilerHost({})
];
const assets = fs.readFileSync(path.join(__dirname, "assets.json"));
global.__entryFile = ts.resolveModuleName(
  Object.values(assets)[0].path,
  ...resolveModuleParams
).resolvedModule.resolvedFileName;

const config = {
  entry: Object.entries(assets)
    .map(([filename, { type, path }]) => {
      filename = `${filename}.${assetTypes[type]}`;
      const { resolvedFileName } = ts.resolveModuleName(
        path,
        ...resolveModuleParams
      ).resolvedModule;
      return [filename, resolvedFileName];
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
    }),
    new CopyWebpackPlugin(["src/appsscript.json"])
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
