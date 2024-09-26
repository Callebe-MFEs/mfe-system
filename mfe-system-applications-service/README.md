# Micro-Frontend Applications Service

This projects implements a microservice to manage Micro-Frontend Applications registration.

Its intention is to serve as a backend service used by a Micro-Frontend Host Application to discover all the available Micro-Frontend Applications and their route mapping and configuration.

To prevent the need to update a configuration file and the re-deployment of the Host Application whenever the list of MFEs changes, this service decouples the Host Application from the other MFEs.
This way, the Host Application only knows about the MFEs that are registered in this service.

This simplyfies the onboarding and removal of MFEs.

## Applications Data Model

### Application

Application data model is the root of the data and contains the basic information to identify, name and route an MFE.

| field   | type                | required | default | description                                                                                                                                                                                                                                         | example                              |
| ------- | ------------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| id      | string/UUID         | NO       | NA      | unique identification generated and assigned to the application on its creation. Also used to delete an existing application                                                                                                                        | 7a3c2579-c91d-4724-93b3-2029610c1121 |
| name    | string              | YES      | NA      | unique identification of the application                                                                                                                                                                                                            | my-application                       |
| label   | string              | YES      | NA      | Human readable application name                                                                                                                                                                                                                     | My Application                       |
| route   | strubg              | NO       | NA      | url path where the application is supposed to be accessed from. The MFE orchestrator will use this value to define when an application is active and mount it on the DOM. Its format may vary depending on the orquestrator used to manage the MFEs | /my-application                      |
| remote  | [Remote](#remote)   | YES      | NA      | Module Federation configuration used by the orquestrator to dynamically load the MFE                                                                                                                                                                | -                                    |
| support | [Support](#support) | NO       | NA      | Support metadata. Holds team responsible for the application and contacs                                                                                                                                                                            | -                                    |
| data    | Object              | NO       | NA      | Free format JSON object to store any other meta-data information                                                                                                                                                                                    | -                                    |

### Remote

Remote data model holds the Module Federation information used to dinamically load an MFE.

| field  | type               | required | default | description                                            | example                    |
| ------ | ------------------ | -------- | ------- | ------------------------------------------------------ | -------------------------- |
| url    | string             | yes      | NA      | MFE entry point URL                                    | /apps/tasks/remoteEntry.js |
| scope  | string             | yes      | NA      | Module Federation scope exposed by the MFE entry point | myTasks                    |
| module | string             | yes      | NA      | JavaScript module name implemented in the MFE scope    | ./myTasks                  |
| type?  | "webpack"/"module" | no       | webpack | the type of Module Federation implementation used      | -                          |

### Support

Support data model holds information to identify team and contacts responsible for the MFE application.

| field    | type                       | required | default | description                                            | example            |
| -------- | -------------------------- | -------- | ------- | ------------------------------------------------------ | ------------------ |
| team     | string                     | yes      | NA      | Team's name responsible to support the MFE application | dealer portal team |
| contacts | Array<[Contact](#contact)> | no       | NA      | list of team's members' contacts                       | -                  |

### Contact

| field | type   | required | default | description            | example               |
| ----- | ------ | -------- | ------- | ---------------------- | --------------------- |
| name  | string | yes      | NA      | Contact's name         | Callebe Gomes         |
| email | string | Yes      | NA      | Contact's email        | callebe.gomes@cnh.com |
| phone | string | NO       | NA      | Contact's phone number | 555-555-5555          |

### Shell Application

If you use the mfes-host-application as Host Application, you have to define the Shell application. It is a special MFE application that defines the basic shell and common styles and components used across all the applications.

It has its own endpoint to add shell applications. There can be only a single shell application. When a new shell is added, the previous one is removed if it exists, and the new shell receives the special id 'shell'.

It has the same attributes as an [Application](#application) and the following extras.

| field   | type          | required | default | description                                                                                                | example |
| ------- | ------------- | -------- | ------- | ---------------------------------------------------------------------------------------------------------- | ------- |
| styles  | Array<string> | NO       | NA      | list of assets to be loaded as stylesheets. Application is only initialized after the load of these assets | -       |
| scripts | Array<string> | NO       | NA      | list of assets to be loaded as scripts. Application is only initialized after the load of these assets     | -       |

## Documentation Endpoints

- /documentation - Swagger web site documentation
- /documentation/json - openapi specification

## Configuration

| Env Var                                       | default                                     | required | description                                                                                        |
| --------------------------------------------- | ------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------- |
| PORT                                          | 3000                                        | yes      | TCP Port where the service will listen for HTTP request                                            |
| LOG_FORMAT                                    | dev                                         | yes      | uses [morgan](https://www.npmjs.com/package/morgan) library to log the http calls                  |
| STORAGE                                       | memory                                      | no       | Type of storage. It can be 'memory' or 'mongo'. If mongo. the env vars MONGODB\_\* become required |
| MONGODB_CONNECTION_STRING                     | mongodb://root:mfesR00tPass@localhost:27017 | no       | Mongo service connection string                                                                    |
| MONGODB_DATABASE_NAME                         | applications                                | no       | Mongo Database name                                                                                |
| MONGODB_DATABASE_APPLICATIONS_COLLECTION_NAME | applications                                | no       | Mongo Database collection name                                                                     |
