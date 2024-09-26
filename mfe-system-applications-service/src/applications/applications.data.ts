import { Application, ShellApplication } from "./application";

import { InjectionToken } from "@decorators/di";

export const ApplicationsDataImpl = new InjectionToken("ApplicationsData");

export interface ApplicationsData {
  addApplication(
    application: Application | ShellApplication,
  ): Promise<Application | ShellApplication>;

  listApplications(): Promise<(Application | ShellApplication)[]>;

  replaceApplications(
    applications: (Application | ShellApplication)[],
  ): Promise<(Application | ShellApplication)[]>;

  findApplication(id: string): Promise<Application | ShellApplication | null>;

  find(query: any): Promise<Application | ShellApplication | null>;

  replaceApplication(
    application: Application | ShellApplication,
  ): Promise<Application | ShellApplication>;

  deleteApplication(id: string): Promise<void>;
}
