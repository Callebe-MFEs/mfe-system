import { Injectable } from "@decorators/di";
import { ErrorMiddleware } from "@decorators/express";
import { ServiceError } from "../error";
import { Request } from "express";
import { Response } from "express";

@Injectable()
export class HttpErrorMiddleware implements ErrorMiddleware {
  public async use(error: ServiceError, req: Request, res: Response): Promise<void> {
    const status = (error.status >= 400 && error.status < 600 && error.status) || 500;
    if (error.status >= 400 && error.status < 600) {
      res.status(status).send(error.message || "An error occurred");
    }
  }
}
