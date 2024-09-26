// karma.conf.js
// Karma configuration
const path = require("path");

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["webpack", "jasmine"],
    plugins: [
      "karma-jasmine",
      "karma-webpack",
      "karma-chrome-launcher",
      "karma-junit-reporter",
      "karma-html-reporter",
      "karma-json-reporter",
      "karma-coverage-istanbul-reporter",
    ],
    files: [`src/**/!(*.e2e).spec.ts`],
    preprocessors: {
      "**/*.ts": ["webpack"],
    },
    webpack: require(path.join(__dirname, "./webpack.spec.cjs")),
    coverageIstanbulReporter: {
      reports: ["html", "text-summary", "json-summary", "lcovonly"],
      dir: path.join(__dirname, `./reports/coverage`),
      combineBrowserReports: true,
      fixWebpackSourcePaths: true,
      "report-config": {
        "json-summary": {
          file: "coverage.json",
        },
      },
      thresholds: {
        emitWarning: false, // set to `true` to not fail the test command when thresholds are not met
        // thresholds for all files
        global: {
          statements: 80,
          branches: 70,
          functions: 80,
          lines: 80,
        },
      },
    },
    junitReporter: {
      outputDir: path.join(__dirname, `./reports`),
      useBrowserName: false,
      outputFile: "results.xml",
    },
    jsonReporter: {
      stdout: false,
      outputFile: path.join(__dirname, `./reports/results.json`),
    },
    htmlReporter: {
      outputDir: path.join(__dirname, `./reports`),
      namedFiles: true,
      reportName: "results",
    },
    reporters: ["progress", "junit", "html", "json", "coverage-istanbul"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["ChromeHeadless"],
    singleRun: true,
    concurrency: Infinity,
  });
};
