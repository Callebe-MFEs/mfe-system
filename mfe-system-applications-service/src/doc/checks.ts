export const checkSchemas = {
  Ready: {
    type: "object",
    properties: {
      ready: {
        type: "boolean",
        example: false,
      },
    },
  },
};

export const checkResponses = {
  Ready: {
    description: "Ready Response",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/Ready",
        },
      },
    },
  },
};

export const checkPaths = {
  "/-/healthz": {
    get: {
      tags: ["health"],
      summary: "Healthz",
      operationId: "healthzUsingGET",
      responses: {
        "200": {
          description: "OK",
          $ref: "#/components/responses/Ready",
        },
        "401": {
          description: "Unauthorized",
        },
        "403": {
          description: "Forbidden",
        },
        "404": {
          description: "Not Found",
        },
      },
      deprecated: false,
    },
  },
  "/-/ready": {
    get: {
      tags: ["health"],
      summary: "Ready",
      operationId: "readyUsingGET",
      responses: {
        "200": {
          description: "OK",
          $ref: "#/components/responses/Ready",
        },
        "401": {
          description: "Unauthorized",
        },
        "403": {
          description: "Forbidden",
        },
        "404": {
          description: "Not Found",
        },
      },
      deprecated: false,
    },
  },
};
