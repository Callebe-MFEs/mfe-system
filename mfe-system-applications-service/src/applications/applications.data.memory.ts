import { Injectable } from "@decorators/di";
import { ApplicationsData } from "./applications.data";
import { Application, ShellApplication } from "./application";

import { v4 as uuidv4 } from "uuid";

@Injectable()
export class ApplicationsDataMemory implements ApplicationsData {
  private applications: Array<Application | ShellApplication> = [];

  addApplication(
    application: Application | ShellApplication,
  ): Promise<Application | ShellApplication> {
    if (application.id === "shell") {
      application.order = 0;
      this.applications.unshift(application);
      return Promise.resolve(application);
    }

    application.id = uuidv4();

    if (!application.order) {
      application.order = this.lastOrder();
      this.applications.push(application);
      return Promise.resolve(application);
    }

    const index = this.applications.findIndex((app) => app.order >= application.order);
    this.applications.splice(index, 0, application);
    this.increaseOrder(index + 1);

    return Promise.resolve(application);
  }

  listApplications(): Promise<(Application | ShellApplication)[]> {
    return Promise.resolve(this.applications);
  }

  replaceApplications(
    applications: (Application | ShellApplication)[],
  ): Promise<(Application | ShellApplication)[]> {
    applications.forEach((app) => {
      app.id = app.id === "shell" ? "shell" : uuidv4();
    });

    this.applications = applications;
    return Promise.resolve(this.applications);
  }

  findApplication(id: string): Promise<Application | ShellApplication | null> {
    return Promise.resolve(this.applications.find((app) => app.id === id));
  }

  find(query: any): Promise<Application | ShellApplication | null> {
    return Promise.resolve(this.applications.find((app) => app.name === query.name));
  }

  replaceApplication(
    application: Application | ShellApplication,
  ): Promise<Application | ShellApplication> {
    let index = this.applications.findIndex((app) => app.id === application.id);
    if (index >= 0) {
      if (this.applications[index].order === application.order) {
        this.applications[index] = application;
      } else {
        // cannot be zero. make it 1 if it is zero
        application.order = application.order || 1;

        // remove from the list since order has changed
        this.applications.splice(index, 1);

        // finde new index for the application.
        index = this.applications.findIndex((app) => app.order >= application.order);

        // insert it at new index
        this.applications.splice(index, 0, application);

        // increment order for remaining applications;
        this.increaseOrder(index + 1);
      }
    }
    return Promise.resolve(application);
  }

  deleteApplication(id: string): Promise<void> {
    const index = this.applications.findIndex((app) => app.id === id);
    if (index >= 0) this.applications.splice(index, 1);
    return Promise.resolve(null);
  }

  private increaseOrder(start: number) {
    for (let i = start; i < this.applications.length; i++) {
      this.applications[i].order++;
    }
  }

  private lastOrder(): number {
    const app = this.applications[this.applications.length - 1];
    if (app) return app.order + 1;
    return 1;
  }
}
