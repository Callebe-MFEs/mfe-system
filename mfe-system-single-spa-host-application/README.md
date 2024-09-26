# Micro-Frontend System Single SPA Host Application (mfe-system-single-spa-host-application)

This project holds the source code for the Micro-Frontend System Host Application implemented using the Single SPA library.

It's goal is to implement a standardised and reusable Micro-Frontend Host Application that can receive Micro-Frontends just by adding configurations.

## How it Works

This project is the entry-point of the MFE solution. It launches a minimal web application that loads, manages and renders MFEs.

### Applications list configuration

This project is initialized by the loading of the applications list configuration. This configuration can be stored in a json file, or it can come from a microservice.
It is compatible with the `mfe-system-applications-service` API, and we encorage the use of it.

### MFEs

The applications list configuration returns a list of MFEs.
Each MFE configuration provides a unique name, a route and a Module Federation remote configuration.
The Host app uses [Single SPA](https://single-spa.js.org/) library to manage the MFEs and orchestrate their activations

The MFE module has to implement the [Parcel interface](https://single-spa.js.org/docs/parcels-overview) to proper be integrated in the host app.
The Single SPA team provides many different interface libraries depending on the framework choosen by the micro-frontend application.

The host application will activate the MFEs whenever the current URL path starts with the `route` configuration for that MFE.

The exception is for any MFE mapped to the root (`/`) path. These MFES will be activated only with a exact match of the path, they will be deactivated when navigating to any sub-path;

### Shell Application

This project does not provide any component, styles, scripts and shell structure, but instead, it relies on a special MFE application called `shell`.
It expect to have a `shell` application as part of the applications configuration it retrieves.
The shell module has to implement the method `getComponent()` and return a web component to be rendered as the shell of the application and, in a slot, receive as content the rendering of the other MFEs.
The shell Web Component can also have named slots to receive MFE's in different places inside the shell. This host app will look for the "data.placement" field in the MFE configuration and use it as the slot attribute value for that MFE.
If no "data.placement" field is configured, the MFE will be placed in the main slot content.

The `shell` configuration can contain two special properties:

- styles: a list of css stylesheet assets to be loaded globally in the page.
- scripts: a list of javascript assets to be loaded globally in the page.

#### getComponent()

The `getComponent(baseURL: string, application: Application, applications: Array<Application>)` function receives two parameters:

- baseURL: The Url path where the Host Application is being served from;
- application: the application configuration itself
- applications: list of applications' configurations

With this three parameters, the application is able to proper load assets if required.

The `getComponent()` function has to return a string with a valid and registered Web Component name.

The host app will set a flag called `usePushState` to true in the Shell Web Component. When this flag is true, any navigation triggered by the shell needs to be handled by the `window.history.pushState` function.

## Quick start

## Running from Docker

When running from a docker container, the configuration can be provided by environment variables:

| variable         | required | example           |
| ---------------- | -------- | ----------------- |
| APPLICATIONS_API | yes      | /api/applications |
