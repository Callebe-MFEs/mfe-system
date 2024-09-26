const path = require("path");
module.exports = function preset(_context, opts = {}) {
  return {
    themes: [path.resolve(__dirname, "theme.js")],
    plugins: [[path.resolve(__dirname, "plugin.js"), opts.mfeConfig]],
  };
};
