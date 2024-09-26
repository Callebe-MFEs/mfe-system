import express, { Request, Response, Application } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { attachControllers, Container, ERROR_MIDDLEWARE } from "@decorators/express";
import { RootContainer } from "@decorators/di";
import { apiDocumentation } from "./doc/apidoc";
import { ApplicationsController } from "./applications/applications.controller";
import { databaseConnect } from "./database";
import { HttpErrorMiddleware } from "./middlewares/http-error.middleware";

Container.setParent(RootContainer);

const createApplication = async (log_format: string): Application => {
  // adding error middleware
  RootContainer.provide([{ provide: ERROR_MIDDLEWARE, useClass: HttpErrorMiddleware }]);

  // loading database connection
  await databaseConnect(RootContainer);

  const app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use(morgan(log_format));

  app.use(
    cors({
      credentials: true,
      allowedHeaders: ["content-type", "origin", "authorization", "accept", "x-requested-with"],
      exposedHeaders: [],
    }),
  );

  function ready(req: Request, res: Response) {
    res.json({ ready: true });
  }

  app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Up and running!" });
  });

  app.get("/-/ready", ready);
  app.get("/-/healthz", ready);
  app.get("/documentation/json", (req: Request, res: Response) => {
    const url = `${req.protocol}://${req.hostname}`;
    (apiDocumentation.info.contact as any).url = url;
    res.json(apiDocumentation);
  });
  app.use("/documentation", swaggerUi.serve, swaggerUi.setup(apiDocumentation));

  attachControllers(app, [ApplicationsController]);

  return app;
};

export default createApplication;
