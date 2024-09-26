import { Application, ShellApplication } from "../mfe/application";
import { remote } from "../mfe/remote";
import { ConfigurationService } from "./configuration.service";

export class ApplicationsService {
  private applications: Application[] | undefined = undefined;

  private static $instance: ApplicationsService;

  static get instance(): ApplicationsService {
    if (!this.$instance) {
      this.$instance = new ApplicationsService();
    }
    return this.$instance;
  }

  private constructor() {
    this.applications = undefined;
  }

  async getApplications(): Promise<Application[]> {
    if (this.applications) return this.applications.filter((app) => app.id !== "shell");

    const applications = await fetch(
      ConfigurationService.instance.getConfiguration().ApplicationsApi,
    )
      .then((res) => res.json())
      .catch(() => []);
    this.applications = (applications as Application[]) || [];

    for (const application of applications) {
      const config = application.remote;
      config && remote().register(config.url, config.scope, config.module, config.type);
      application.module = `${config.scope}/${config.module.replace(/^\.\//, "")}`;
    }

    return this.applications.filter((app) => app.id !== "shell");
  }

  getApplication(application: Application): Promise<any> {
    return remote().get(application.module);
  }

  async loadShellScriptsAndStyles(): Promise<ShellApplication | null> {
    await this.getApplications();
    const shell = this.applications.find((app) => app.id === "shell") as ShellApplication;

    const promises = [];

    if (shell) {
      for (const style of shell.styles || []) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = style;
        document.head.appendChild(link);
      }
      for (const script of shell.scripts || []) {
        promises.push(
          new Promise<void>((resolve) => {
            const scriptElement = document.createElement("script");
            scriptElement.src = script;
            scriptElement.onload = () => resolve();
            document.head.appendChild(scriptElement);
          }),
        );
      }
    }

    await Promise.all(promises);

    return shell;
  }
}
