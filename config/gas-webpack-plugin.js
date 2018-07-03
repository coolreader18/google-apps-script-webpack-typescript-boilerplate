const ts = require("typescript");
const webpack = require("webpack");
const path = require("path");

const tapName = "GASWebpackPlugin";

module.exports = class GASWebpackPlugin {
  constructor() {
    this.entryExports = new Set();
    this.transformer = this.transformer.bind(this);
  }
  apply(compiler) {
    compiler.hooks.emit.tap(tapName, compilation => {
      compilation.chunks.forEach(chunk => {
        chunk.files.forEach(filename => {
          const source = compilation.assets[filename].source();
          let funcs = "";
          this.entryExports.forEach(cur => {
            funcs += `function ${cur}(){}`;
          });
          const newSource = funcs + source;
          compilation.assets[filename] = {
            source: () => newSource,
            size: () => newSource.length
          };
        });
      });
    });
  }
  transformer(context) {
    const { entryExports } = this;
    return node =>
      ts.visitNode(node, sourceFile => {
        if (sourceFile.fileName === path.join(__dirname, "../src/index.ts")) {
          ts.visitEachChild(
            sourceFile,
            statement => {
              if (
                statement.getFirstToken().kind === ts.SyntaxKind.ExportKeyword
              ) {
                statement
                  .getChildAt(1)
                  .getChildAt(1)
                  .getChildren()
                  .filter(cur => ts.isVariableDeclaration(cur))
                  .forEach(child => {
                    entryExports.add(child.name.escapedText);
                  });
              }
            },
            context
          );
        }
        return sourceFile;
      });
  }
};
