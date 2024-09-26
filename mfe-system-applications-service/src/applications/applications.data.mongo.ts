import { Inject, Injectable } from "@decorators/di";
import { Application, ShellApplication } from "./application";
import { APPLICATION_COLLECTION } from "../configuration";
import { Collection } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import { ApplicationsData } from "./applications.data";

@Injectable()
export class ApplicationsDataMongo implements ApplicationsData {
  constructor(
    @Inject(APPLICATION_COLLECTION)
    private collection: Collection<Application | ShellApplication>,
  ) {}

  async addApplication(
    application: Application | ShellApplication,
  ): Promise<Application | ShellApplication> {
    if (application.id !== "shell") {
      // adding regular application
      application.id = uuidv4();
      if (!application.order) {
        application.order = await this.lastOrder();
      } else {
        await this.increaseOrder(application.order);
      }
    } else {
      //adding a shell application
      application.order = 0;
    }

    await this.collection.insertOne(application);
    delete (application as any)._id;
    return application;
  }

  async listApplications(): Promise<(Application | ShellApplication)[]> {
    const applications = await this.collection.find().sort({ order: 1 }).toArray();
    applications.forEach((app: any) => {
      delete app._id;
    });
    return applications;
  }

  async replaceApplications(
    applications: (Application | ShellApplication)[],
  ): Promise<(Application | ShellApplication)[]> {
    applications.forEach((app) => {
      app.id = app.id === "shell" ? "shell" : uuidv4();
    });

    await this.collection.deleteMany({});
    await this.collection.insertMany(applications);
    return applications;
  }

  findApplication(id: string): Promise<Application | ShellApplication | null> {
    return this.find({ id });
  }

  async find(query: any): Promise<Application | ShellApplication | null> {
    const app = await this.collection.findOne(query);
    if (app) {
      delete (app as any)._id;
    }
    return app;
  }

  async replaceApplication(
    application: Application | ShellApplication,
  ): Promise<Application | ShellApplication> {
    await this.increaseOrder(application.order);
    await this.collection.replaceOne({ id: application.id }, application);
    return await this.findApplication(application.id);
  }

  async deleteApplication(id: string): Promise<void> {
    await this.collection.deleteOne({ id });
  }

  private async increaseOrder(start: number): Promise<void> {
    await this.collection.updateMany({ order: { $gte: start } }, { $inc: { order: 1 } });
  }

  private async lastOrder(): Promise<number> {
    const app = await this.collection.find({}).sort({ order: -1 }).limit(1).toArray();
    if (app && app[0]) return app[0].order + 1;
    return 1;
  }
}
