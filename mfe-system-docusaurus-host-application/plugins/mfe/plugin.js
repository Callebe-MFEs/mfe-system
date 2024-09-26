const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");

let packageName = require(path.join(process.cwd(), "package.json")).name;

/**
 * read package name from package.json and convert it to PascalCase
 */
packageName = packageName
  .split("-")
  .map(
    (name, i) => (i > 0 && name.charAt(0).toUpperCase() + name.slice(1)) || name
  )
  .join("");

console.log("packageName", packageName);

module.exports = function (context, options) {
  return {
    name: "mfes-plugin",
    /**
     * Extend the Webpack configuration when running Docusaurus in client mode
     * it prepare the project to be a module federation host and load
     * micro-frontends from the remote
     */
    configureWebpack(currentConfig, isServer) {
      const config = {};
      if (!isServer) {
        config.plugins = [
          new ModuleFederationPlugin({
            name: packageName,
            // shared: ['react', 'react-dom', 'single-spa'],
          }),
        ];
        config.devServer = options.devServer || {};
      }
      return config;
    },

    /**
     * This hook is called after the site has been loaded
     *
     * It creates a new route for the micro-frontends that will be the entry point
     * for all the applications
     *
     * it expect two options:
     * - basepath: the base path for new route
     * - applicationsEndpoint: the endpoint to fetch the list of applications
     */
    async contentLoaded({ content, actions }) {
      const mfeConfig = {
        basepath: "/apps", // base path for the micro-frontend host app
        applicationsEndpoint: "/applications",
        // authRequired: false,
        ...(options.mfe || {}),
      };

      mfeConfig.basepath =
        (context.baseUrl.endsWith("/")
          ? context.baseUrl.substring(0, context.baseUrl.length - 1)
          : context.baseUrl) + mfeConfig.basepath;

      // save the configuration to be used in runtime
      const mfeConfigPath = await actions.createData(
        "mfe-config.json",
        JSON.stringify(mfeConfig)
      );

      actions.setGlobalData(mfeConfig);

      // add new route for the micro-frontends host
      actions.addRoute({
        path: `${mfeConfig.basepath}`,
        component: path.resolve(__dirname, "src/apps.js"),
        exact: false, // exact: false to match all the routes under /apps
        modules: {
          mfeConfig: mfeConfigPath, // inject the configuration to the component
        },
      });
    },

    /**
     * this hook is called after the site has been loaded.
     * it injects any script and/or styles that are needed by the micro-frontends
     */
    injectHtmlTags({ content }) {
      const headTags = (options.externals?.styles || [])
        .map((href) => ({
          tagName: "link",
          attributes: { href, rel: "stylesheet" },
        }))
        .concat(
          (options.externals?.scripts || []).map((src) => ({
            tagName: "script",
            attributes: { src },
          }))
        );

      return { headTags };
    },
  };
};
