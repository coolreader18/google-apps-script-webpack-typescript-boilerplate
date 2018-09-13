const tapName = "GASWebpackPlugin";
const webpack = require("webpack");

/** @type webpack.Plugin */
const gasPlugin = {
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
      console.log(compilation.entries[0].resource);
      Object.assign(
        compilation.assets,
        {
          "Code.js": makeAsset(
            compilation.entries[0].buildMeta.providedExports
              .map(exp => `function ${exp}(){}`)
              .join("")
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
};

const makeAsset = text => ({
  source: () => text,
  size: () => text.length
});

module.exports = gasPlugin;
