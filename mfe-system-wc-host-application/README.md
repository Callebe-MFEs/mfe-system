# Micro-Frontend System Web Component Host Application (mfe-system-wc-host-application)

This project holds the source code for the Micro-Frontend System Web Component Host Application.

It's goal is to implement a standardised and reusable Micro-Frontend Host Application that can receive Micro-Frontends just by adding configurations.

## How it Works

This project is the entry-point of the MFE solution. It launches a minimal web application that load, manage and render MFEs.

### Applications list configuration

This project is initialized by the loading of the applications list configuration. This configuration can be stored in a json file, or it can come from a microservice.
It is compatible with the `mfe-system-applications-service` API, and we encorage the use of it.

### MFEs

The applications list configuration returns a list of MFEs.
Each MFE configuration must to provide a unique name, a route and a Module Federation remote configuration.
The Host app uses [@vaadin/router](https://github.com/vaadin/router) library to manage the routing system and render Web Components.

The MFE module has to implement either the `getComponent()` function or the `getRoutes()` function. If both are provided, the `getComponent()` function is used.

#### getComponent()

The `getComponent(baseURL: string, application: Application)` function receives two parameters:

- baseURL: The Url path where the Host Application is being served from;
- application: the application configuration itself

With this two parameters, the application is able to proper load assets if required and configure its own routing system if it has multiple pages.

The `getComponent()` function has to return a string with a valid and registered Web Component name to be rendered by the `@vaadin/router`.

The Web Component to be rendered will probably not be a generic Web Component, but instead, it will be a specialized Web Component that is implemented exclusively to handle the MFE feature.

#### getRoutes()

The `getRoutes(baseURL: string, application: Application)` function receives two parameters:

- baseURL: The Url path where the Host Application is being served from;
- application: the application configuration itself

With this two parameters, the application is able to proper load assets if required and configure its own routing system if it has multiple pages.

The `getRoutes()` function has to return a list of `@vaadin/route` routes, containing sub-routes for the MFE application. This is best suttable if the MFE is also composed by Web Components and uses the `@vaadin/route`.

From this point, any sub-route is responsibility of the MFE application to proper configure them.

### Shell Application

This project does not provide any component, styles, scripts and shell structure, but instead, it relies on a special MFE application called `shell`.
It expect to have a `shell` application as part of the applications configuration it retrieves.
The shell module has to implement the method `getComponent()` and return a web component to be rendered as the shell of the application and, in a slot, receive as content the rendering of the other MFEs.
The `getComponent()` method for the shell application receive an extra argument with the applications list configuration. With this information, the shell is able to render custom navigation menu to access the MFEs if required.

The `shell` configuration can contain two special properties:

- styles: a list of css stylesheet assets to be loaded globally in the page.
- scripts: a list of javascript assets to be loaded globally in the page.

## Dev Quick start

Environment:

- node v20.12.2
- npm 10.5.0

Clone this repository and install dependencies

```bash
git clone git@github.com:Callebe-MFEs/mfe-system.git
cd mfe-system/mfe-system-wc-host-application
npm install
npm start # it launches the application locally in development mode.
```

## Runnin locally

By runnin `npm start` you can launch the application locally in development mode. It opens the browser and access http://localhost:8080

To simulate a deployed environment, the webpack.dev.js file, that contains the webpack configuration for development mode, implements a proxy to route
backend calls and other MFEs assets request.
Since we are most likely developing and testing the Host Application only, we don't need the entire applications-service api access. For that reason, the proxy
routes the retrieval of the applications list to a static file located at `public/applications.json`. This way, we can change this file to add, remove, and change MFEs while developing the Host Application.

## Build & Deployment

We can build the project by executing `npm run build` command in the project's root folder. It will bundle the source code and generate the `./dist` folder with all the assets ready to be deploied.

The `./dist` folder will contain a file called `environment.tempalte.json` that needs to be replaced by a file named `environment.json` containing environment specific configuration. The template file contains placeholders like `${APPLICATIONS_API}`
that needs to be replaced by an actual value.

### Dockerfile

A `Dockerfile` is also provided to create a docker image with the application and a Nginx server to serve the static assets. This way, the docker image can be distributed and deployed in different environments.

The Dockerfile supports the dinamic configuration of the environment.template.json file, replacing the placeholders by the environment variables of the same name present in the environment.

When, compiling the Docker image, we don't need to replace the environment.template.json file, since it will be replaced by the Docker image instantiation process itself.

## Running from Docker

When running from a docker container, the configuration can be provided by environment variables:

| variable         | required | example           |
| ---------------- | -------- | ----------------- |
| APPLICATIONS_API | yes      | /api/applications |
