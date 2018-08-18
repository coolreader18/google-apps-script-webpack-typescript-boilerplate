const ts = require("typescript");

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
          if (!filename.match(/\.data\.html$/)) return;
          const source = compilation.assets[filename].source();
          const newSource = `<?${JSON.stringify(source)}?>`;
          compilation.assets[filename] = makeAsset(newSource);
        });
      });
      Object.assign(
        compilation.assets,
        {
          "Code.js": makeAsset(
            [...this.entryExports].map(exp => `function ${exp}(){}`).join("")
          )
        },
        process.env.CLASP_SCRIPT_ID && {
          ".clasp.json": makeAsset(
            JSON.stringify({
              scriptId: process.env.CLASP_SCRIPT_ID
            })
          )
        }
      );
    });
  }
  transformer(context) {
    const statementHandler = statement => {
      const token = statement.getFirstToken();
      if (token && token.kind === ts.SyntaxKind.ExportKeyword) {
        statement
          .getChildAt(1)
          .getChildAt(1)
          .getChildren()
          .filter(cur => ts.isVariableDeclaration(cur))
          .forEach(child => {
            this.entryExports.add(child.name.escapedText);
          });
      }
    };
    const fileHandler = sourceFile => {
      if (sourceFile.fileName === __entryFile) {
        ts.visitEachChild(sourceFile, statementHandler, context);
      }
      return sourceFile;
    };
    return node => ts.visitNode(node, fileHandler);
  }
};

const makeAsset = text => ({
  source: () => text,
  size: () => text.length
});
