# Docusaurus Micro-Frontend System Host Application (mfe-system-docusaurus-host-application)

This project holds the source code for the Docusaurus Micro-Frontend System Host Application template.

It's goal is to implement a standardised and reusable static documentation site that also works as a Micro-Frontend Host Application that can receive Micro-Frontends just by adding configurations.

## How it Works

This project is the entry-point of the MFE system. It launches a docusaurus static web site that can load, manage and render MFEs.

It implements a docusaurus plugin under the `./plugins` folder that adds a special page. This special page uses Single SPA to render and manage MFEs.
This plugin also implements a special DropdownNavbarItem that loads the list of MFEs and add entries to the menu, so the user can navigate to the MFEs.

### Applications list configuration

When User navigates to an MFE, this project loads the applications list configuration and renders the proper MFE according to it.
This configuration can be stored in a json file, or it can come from a microservice.
It is compatible with the `mfes-applications-service` API, and we encorage the use of it.

### MFEs

The applications list configuration returns a list of MFEs.
Each MFE configuration provides a unique name, a route and a Module Federation remote configuration.
The Host app uses [Single SPA](https://single-spa.js.org/) library to manage the MFEs and orchestrate their activations

The MFE module has to implement the [Parcel interface](https://single-spa.js.org/docs/parcels-overview) to proper be integrated in the host app.
The Single SPA team provides many different interface libraries depending on the framework choosen by the micro-frontend application.

The host application will activate the MFEs whenever the current URL path starts with the `route` configuration for that MFE.

### Shell Application

Because Docusaurus works as the shell application, and shell application configuration provided is ignored

### Host Application configuration

The `docusaurus.config.ts` follows the docusaurus standard configuration. This template already has the changes to include the mfe plugin in it.

The `baseUrl` is the most important configuration here, it has to be set to the sub-path from where the application is going to be served from.

The `config\plugins\mfe.config.ts` file contains the mfe plugin configuration.

```TypeScript
export const mfeConfig = {
  mfe: {
    // optional configuration. equal to /apps if not set.
    // defines the MFE host page running Single SPA. Every MFE route becomes a sub-route of basepath
    basepath: "/my-apps",

    // optional configuration. equal to /applications if not set
    // url endpoint that provides the applications list configuration
    applicationsEndpoint: "/api/applications",
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
  // configure dev server proxy to simulate deployment when running locally.
  // used only during local development. ignored for build process
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

```

considering the docusaurus `baseUrl` configuration, the mfe plugin `basepath` configuration, and the MFE `route` configuration, the final MFE path will be `/<baseUrl>/<basepath>/<mfe-route>`. This is automatically rendered by docusaurus and the mfe plugin.

## Dev Quick start

Environment:

- node v20.12.2
- npm 10.5.0

Clone this repository and install dependencies

```bash
git clone git@github.com:Callebe-MFEs/mfe-system-docusaurus-host-application
cd mfe-system/mfe-system-docusaurus-host-application
npm install
npm start # it launches the application locally in development mode.
```

## Runnin locally

By runnin `npm start` you can launch the application locally in development mode.

To simulate a deployed environment, the `./config/plugins/mfe.config.ts` file, that contains the mfe plugin configuration, implements a proxy to route
backend calls and other MFEs assets request.
Since we are most likely developing and testing the Host Application only, we don't need the entire applications-service api access. For that reason, the proxy
routes the retrieval of the applications list to a static file located at `./static/applications.json`. This way, we can change this file to add, remove, and change MFEs while developing the Host Application.

## Build & Deployment

We can build the project by executing `npm run build` command in the project's root folder. It will bundle the source code and generate the `./dist` folder with all the assets ready to be deploied.

### Dockerfile

A `Dockerfile` is also provided to create a docker image with the application and a Nginx server to serve the static assets. This way, the docker image can be distributed and deployed in different environments.
