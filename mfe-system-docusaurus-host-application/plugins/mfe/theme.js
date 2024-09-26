const path = require("path");
module.exports = function preset(_context, opts = {}) {
  return {
    name: "mfeTheme",
    getPathsToWatch() {
      return [path.resolve(__dirname, "src/theme/**/*.{ts,tsx,css,scss}")];
    },
    getThemePath() {
      return path.resolve(__dirname, "src/theme");
    },
  };
};
