export const RemoteSchema = {
  Remote: {
    type: "object",
    properties: {
      url: {
        type: "string",
        description: "Remote entry point javascript file URL",
      },
      scope: {
        type: "string",
        description:
          "Remote scope name, has to mach the Module Federation name that generated this remote",
      },
      module: {
        type: "string",
        description: "module name available inside the remote scope",
      },
      type: {
        type: "string",
        description:
          "remote type. If webpack, it is handled as a global var. if module, it is handled as a ES6 module",
        enum: ["webpack", "module"],
      },
    },
    required: ["url", "scope", "module"],
    example: {
      url: "/my-path/remoteEntry.js",
      scope: "myScope",
      module: "./myModule",
      type: "webpack",
    },
  },
};

export const ContactSchema = {
  Contact: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Contact's name",
      },
      email: {
        type: "string",
        description: "Contact's email",
      },
      phone: {
        type: "string",
        description: "Contact's phone number",
      },
    },
    required: ["name", "email"],
    example: {
      name: "Callebe Gomes",
      email: "callebe.gomes@cnh.com",
      phone: "+1 (555) 123 1234",
    },
  },
};

export const SupportSchema = {
  Support: {
    type: "object",
    properties: {
      team: {
        type: "string",
        description:
          "name of the team or area responsible for providing and maintain the application",
      },
      contacts: {
        type: "array",
        items: {
          type: "object",
          $ref: "#/components/schemas/Contact",
        },
      },
    },
    required: ["team"],
    example: {
      team: "Enterprise Architects",
      contacts: [
        {
          name: "Callebe Gomes",
          email: "callebe.gomes@cnh.com",
        },
      ],
    },
  },
};

export const ApplicationSchema = {
  Application: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "unique identify application",
      },
      name: {
        type: "string",
        description: "unique name application",
      },
      label: {
        type: "string",
        description: "Human readable application name",
      },
      order: {
        type: "number",
        description: "order in witch the application is returned in the applications list",
      },
      route: {
        type: "string",
        description: "path mapped to mount the application",
      },
      url: {
        type: "string",
        description: "URL to access the application as standalone and its assets",
      },
      remote: {
        type: "object",
        $ref: "#/components/schemas/Remote",
      },
      support: {
        type: "object",
        $ref: "#/components/schemas/Support",
      },
      data: {
        type: "object",
      },
    },
    required: ["name", "label", "remote", "url"],
    example: {
      id: "home",
      name: "home",
      label: "Home",
      route: "/",
      remote: {
        url: "/remoteEntry.js",
        scope: "myHomeApp",
        module: "./myHomeModule",
        type: "webpack",
      },
    },
  },
};

export const ShellApplicationSchema = {
  ShellApplication: {
    allOf: [
      {
        $ref: "#/components/schemas/Application",
      },
      {
        type: "object",
        properties: {
          id: {
            type: "string",
            enum: ["shell"],
            description: "Shell app must have id equals 'shell'.",
          },
          styles: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Stylesheets to be loaded by the shell application",
          },
          scripts: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Scripts to be loaded by the shell application",
          },
        },
        required: ["id"],
      },
    ],
    example: {
      id: "shell",
      name: "shell",
      label: "Shell",
      route: "/shell",
      remote: {
        url: "/remoteEntry.js",
        scope: "myShellApp",
        module: "./myShellModule",
        type: "webpack",
      },
      styles: ["/shell.css"],
      scripts: ["/shell.js"],
    },
  },
};

export const ApplicationsAPISchemas = {
  ...RemoteSchema,
  ...ContactSchema,
  ...SupportSchema,
  ...ApplicationSchema,
  ...ShellApplicationSchema,
};

export const ApplicationsPaths = {
  "/applications": {
    get: {
      tags: ["applications"],
      operationId: "getApplications",
      description: "list all applications available",
      responses: {
        "200": {
          description: "list of all applications returned",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  oneOf: [
                    {
                      $ref: "#/components/schemas/ShellApplication",
                    },
                    {
                      $ref: "#/components/schemas/Application",
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ["applications"],
      operationId: "addNewApplication",
      description: "add a new application",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Application",
            },
          },
        },
      },
      responses: {
        "200": {
          description: "new created application with filled unit ID",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Application",
              },
            },
          },
        },
      },
    },
    put: {
      tags: ["applications"],
      operationId: "replaceApplications",
      description: "replace all applications with the new list",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: {
                oneOf: [
                  {
                    $ref: "#/components/schemas/ShellApplication",
                  },
                  {
                    $ref: "#/components/schemas/Application",
                  },
                ],
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "list of all applications replaced",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  oneOf: [
                    {
                      $ref: "#/components/schemas/ShellApplication",
                    },
                    {
                      $ref: "#/components/schemas/Application",
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
  },
  "/applications/shell": {
    post: {
      tags: ["applications"],
      operationId: "addNewShellApplication",
      description: "add a new shell application",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ShellApplication",
            },
          },
        },
      },
      responses: {
        "200": {
          description: "new created shell application",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ShellApplication",
              },
            },
          },
        },
      },
    },
  },
  "/applications/{id}": {
    put: {
      tags: ["applications"],
      operationId: "updateApplication",
      description: "update specific application",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              oneOf: [
                {
                  $ref: "#/components/schemas/ShellApplication",
                },
                {
                  $ref: "#/components/schemas/Application",
                },
              ],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "application updated",
          content: {
            "application/json": {
              schema: {
                oneOf: [
                  {
                    $ref: "#/components/schemas/ShellApplication",
                  },
                  {
                    $ref: "#/components/schemas/Application",
                  },
                ],
              },
            },
          },
        },
      },
    },
    delete: {
      tags: ["applications"],
      operationId: "deleteApplication",
      description: "delete specific application from the list",
      responses: {
        "203": {
          description: "application deleted",
        },
      },
    },
    parameters: [
      {
        name: "id",
        in: "path",
        description: "Application Id to identify the application",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
};
