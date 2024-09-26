import { Inject, Injectable } from "@decorators/di";
import { Application, ShellApplication } from "./application";

import { ApplicationsDataImpl, ApplicationsData } from "./applications.data";
import { ServiceError } from "../error";

@Injectable({ providedIn: "root" })
export class ApplicationsService {
  constructor(@Inject(ApplicationsDataImpl) private applicationsData: ApplicationsData) {}

  async getShellApplication(): Promise<ShellApplication> {
    const app = await this.applicationsData.findApplication("shell");
    return app as ShellApplication;
  }

  async listApplications(): Promise<Array<Application | ShellApplication>> {
    const applications = await this.applicationsData.listApplications();

    const shellIndex = applications.findIndex((app) => app.id === "shell");
    if (shellIndex >= 0) {
      applications.unshift(applications[shellIndex]);
      applications.splice(shellIndex + 1, 1);
    }

    return applications;
  }

  async replaceApplications(
    applications: Array<Application | ShellApplication>,
  ): Promise<Array<Application | ShellApplication>> {
    const shellIndex = applications.findIndex((app) => app.id === "shell");

    applications.sort((a, b) => a.order - b.order);

    if (shellIndex >= 0) {
      const shell = applications.splice(shellIndex, 1)[0];
      shell.order = 0;
      applications.unshift(shell);
    }

    applications.forEach((app, index) => {
      app.order = index;
    });

    return this.applicationsData.replaceApplications(applications);
  }

  async addApplication(application: Application | ShellApplication) {
    if (application.id === "shell" && (await this.getShellApplication())) {
      await this.removeApplication("shell");
    }

    if (await this.applicationsData.find({ name: application.name })) {
      throw new ServiceError("Application name duplicated", 409);
    }

    application = await this.applicationsData.addApplication(application);
    return application;
  }

  addShellApplication(application: ShellApplication) {
    application.id = "shell";
    return this.addApplication(application);
  }

  async updateApplication(id: string, application: Application | ShellApplication) {
    application.id = id;

    const existingNameApp = await this.applicationsData.find({ name: application.name });

    if (existingNameApp && existingNameApp.id !== application.id) {
      throw new ServiceError("Application name duplicated", 409);
    }

    const existingApp = await this.applicationsData.findApplication(application.id);
    if (!existingApp) {
      throw new ServiceError("Application not found", 404);
    }

    return await this.applicationsData.replaceApplication(application);
  }

  removeApplication(id: string): Promise<void> {
    return this.applicationsData.deleteApplication(id);
  }
}
