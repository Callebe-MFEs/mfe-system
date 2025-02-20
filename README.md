# Micro-Frontend System

This repository contains an Implementation of a Micro-Frontend System to be used as reference.

It contains three main parts: Applications Service, Application Management App, Host Application.

- Applications Service implements an API to manage the list of Micro-Frontend Applications.
  Each entry in the list represents an Application and holds data referent to how this application is loaded and integrated into the System.
- Application Management App is the frontend part that allows an administrator to manage the MFE Applications list.
- Host Application is the entry-point of the final System, where the end user is going to lend whenever he wants to interact with the system.

In this project we implemented three different flavors of Host Application: Singe-SPA host application, Docusaurus host application, Web Component host application.
All of them uses the Applications Service to retrieve the list of Applications, and use module federation to load them.

- Single-SPA host application uses the Single-SPA library to orchestrate the Micro-Frontends.
- Docusaurus host application also uses Single-SPA library to orchestrate the Micro-Frontends. Docusaurus provide a way to generate static content, and is ideal for documentation purpose. With Micro-Frontend support, we can embed other applications inside the Docusaurus final application.
- Web Component host application uses a simple router library that mounts web-components based on the router the user navigates to.

In this project we also implemented four examples of MFEs. One example of a Shell Component MFE, used to provide the basic layout, and three examples of MFEs implemented using React and Angular frameworks, and lit library.
All the MFEs are compatible with all the three host applications.

## Environment

Environment:

- node v22.13.0
- npm 10.9.2
- Docker (for local testing only)

## Running using Docker (local test)

All the projects can be placed in docker containers to be easly distributed and deployed.
The Single-SPA and Web Component host applications also provide a docker-compose.yml file to deploy everything in your local docker environment to simulate an actual deployment and test all the integration end-to-end.

steps to do so:

1. install dependencies for each project:

```bash
cd ./mfe-system-applications-mfe
npm install
```

repeat this step for all the other projects: mfe-system-applications-service, mfe-system-examples/home, mfe-system-examples/messages, mfe-system-examples/shell, mfe-system-examples/tasks, mfe-system-single-spa-host-application, mfe-system-web-component-host-application

2. build all the projects:

```bash
cd ./mfe-system-applications-mfe
npm run build
```

repeat this step for all the other projects: mfe-system-applications-service, mfe-system-examples/home, mfe-system-examples/messages, mfe-system-examples/shell, mfe-system-examples/tasks, mfe-system-single-spa-host-application, mfe-system-web-component-host-application

3. run docker compose for the host application you want to test:

```bash
cd ./mfe-system-single-spa-host-application
docker compose up --build
```

this will build all the docker containers and deploy them in your local docker environment.
once deployed, you can access the host application in here [http://localhost:8000](http://localhost:8000)

4. register all the applications

- access the Applications Management App here [http://localhost:8000/apps/applications](http://localhost:8000/apps/applications)
- click in "Replace Applications"
- copy json configuration from `./mfe-system-single-spa-host-application/public/applications.json` (or from the web component folder if testing web component host application)
- paste it in the data field.
- save it.

5. go back to root path [http://localhost:8000](http://localhost:8000)

you should see a System running with a top header and some links to the MFEs.
You can also navigate to the MFEs and test them.

you can also access the MFEs as stand-alone applications.

here are some urls to test:

- [http://localhost:8000](http://localhost:8000) - Root path - Host Application - System Entry point - after applications configuration is placed, it also access Home Application through the Host Application.
- [http://localhost:8000/messages/](http://localhost:8000/messages/) - Messages MFE example through the Host Application.
- [http://localhost:8000/tasks/](http://localhost:8000/tasks/) - Tasks MFE example through the Host Application.
- [http://localhost:8000/applications/](http://localhost:8000/applications/) - Applications Management app through the Host Application.
- [http://localhost:8000/apps/applications/](http://localhost:8000/apps/applications/) - Applications Management app standalone.
- [http://localhost:8000/apps/home/](http://localhost:8000/apps/home/) - Home MFE example standalone.
- [http://localhost:8000/apps/messages/](http://localhost:8000/apps/messages/) - Messages MFE example standalone.
- [http://localhost:8000/apps/tasks/](http://localhost:8000/apps/tasks/) - Tasks MFE example standalone.
- [http://localhost:8000/apps/shell/](http://localhost:8000/apps/shell/) - Shell MFE is served from here. You can access to test the Shell alone.
- [http://localhost:8000/api/applications/](http://localhost:8000/api/applications/) - Applications API
- [http://localhost:8000/api/documentation/](http://localhost:8000/api/documentation/) - API Swagger documentation

6. tear down after testing

```bash
CTRL + D
docker compose down
```

it will stop and remove the docker containers


## Running using Kubernetes

### Prerequisites

install traefik in kubernets cluster using helm chart

```bash
helm repo add traefik https://traefik.github.io/charts
helm repo update
helm install traefik-crds traefik/traefik-crds
helm install traefik traefik/traefik --skip-crds
```

Inside each project we have a folder called `k8s` that contains kubernets configuration files.
You can apply them to install 

# References

- [Traefik Helm installation](https://github.com/traefik/traefik-helm-chart/blob/master/README.md)