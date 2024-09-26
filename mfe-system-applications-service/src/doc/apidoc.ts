import { ApplicationsAPISchemas, ApplicationsPaths } from "./applications";
import { checkSchemas, checkResponses, checkPaths } from "./checks";

export const apiDocumentation = {
  openapi: "3.1.0",
  info: {
    title: "Micro-Frontend Applications Service API",
    version: "0.0.1",
    summary:
      "Micro-Frontend Applications Service API exposes features to manage MFE registrations and discovery",
    description:
      "MFES Applications Service API exposes features to manage MFE registrations and discovery",
    contact: {
      name: "Callebe Gomes",
      email: "callebe.gomes@cnh.com",
    },
    license: {
      name: "Apache 2.0",
      url: "https://www.apache.org/licenses/LICENSE-2.0.html",
    },
  },
  paths: {
    ...checkPaths,
    ...ApplicationsPaths,
  },
  components: {
    schemas: {
      ...checkSchemas,
      ...ApplicationsAPISchemas,
    },
    responses: {
      ...checkResponses,
    },
  },
};
