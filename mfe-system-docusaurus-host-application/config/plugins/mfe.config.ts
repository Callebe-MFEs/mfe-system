export const mfeConfig = {
  mfe: {
    basepath: "/my-apps", // optional configuration. equal to /apps if not set
    // authRequired: true,
    applicationsEndpoint: "/api/applications", // optional configuration. equal to /applications if not set
  },
  externals: {
    // add any script to be preloaded in the host application
    scripts: [
      // adding zone.js to the host application to support Angular MFEs
      "https://cdn.jsdelivr.net/npm/zone.js@0.10.3/dist/zone.min.js",
    ],
    // add any style to be preloaded in the host application
    styles: [],
  },
  // configure dev server proxy to simulate deployment when running locally
  devServer: {
    proxy: {
      "/apps/home": {
        target: "http://localhost:3002",
        pathRewrite: { "^/apps/home": "" },
      },
      "/apps/tasks": {
        target: "http://localhost:3003",
        pathRewrite: { "^/apps/tasks": "" },
      },
      "/apps/messages": {
        target: "http://localhost:3001",
        pathRewrite: { "^/apps/messages": "" },
      },
      "/api/applications": {
        target: "http://localhost:3000",
        pathRewrite: { "^/api/applications": "/doc/applications.json" },
      },
    },
  },
};
