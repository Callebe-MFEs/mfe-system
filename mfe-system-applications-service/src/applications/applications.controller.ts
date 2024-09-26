import { Body, Controller, Delete, Get, Params, Post, Put, Res } from "@decorators/express";
import { Response } from "express";
import { ApplicationsService } from "./applications.service";
import { Application, ShellApplication } from "./application";

@Controller("/applications")
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Get("/")
  async ListApplications(@Res() res: Response) {
    const applications = await this.applicationsService.listApplications();
    res.json(applications);
  }

  @Post("/")
  async addApplication(@Res() res: Response, @Body() application: Application) {
    application = await this.applicationsService.addApplication(application);
    res.status(201).json(application);
  }

  @Put("/")
  async replaceApplications(@Res() res: Response, @Body() applications: Application[]) {
    applications = await this.applicationsService.replaceApplications(applications);
    res.json(applications);
  }

  @Post("/shell")
  async addShellApplication(@Res() res: Response, @Body() application: ShellApplication) {
    const app = await this.applicationsService.addShellApplication(application);
    res.json(app);
  }

  @Put("/:id")
  async updateApplication(
    @Res() res: Response,
    @Params("id") id: string,
    @Body() application: Application | ShellApplication,
  ) {
    const app = await this.applicationsService.updateApplication(id, application);
    res.json(app);
  }

  @Delete("/:id")
  async removeApplication(@Res() res: Response, @Params("id") id: string) {
    await this.applicationsService.removeApplication(id);
    res.status(203).send();
  }
}
