import { Commands, Context, Route, Router } from "@vaadin/router";
import { Application, ShellApplication } from "../application";
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

  private routes: Route[] | undefined = undefined;
  async getApplicationsRoutes(router: Router, baseURL: string = "/"): Promise<Route[]> {
    baseURL.endsWith("/") && (baseURL = baseURL.slice(0, -1));
    if (!this.routes) {
      // Fetch the applications configuration
      const applications = await this.getApplications();

      // Generate the routes for each application
      this.routes = applications
        .filter((app) => !!app.route) // ignore applications without a route
        .map((application) => {
          const $baseURL = `${baseURL}${application.route}`;
          return {
            path: application.route,
            /**
             * The action method is called whenever the route is activated.
             * If the action method does not return a component, the router proceed with processing children paths.
             * If the action method returns a component, the router renders the component as the route content.
             */
            action: async (_context: Context, commands: Commands) => {
              try {
                const module = await remote().get(application.module);
                if (typeof module.getComponent !== "function") return;
                const tag = module.getComponent($baseURL, application, router);
                if (tag) return commands.component(tag);
              } catch (_error) {
                console.error(`Error loading component for ${application.id} Module`);
              }
            },
            /**
             * Children routes are processed when the parent route is activated.
             * If the MFE application does not provide a component in the action method, the router will process the children routes.
             */
            children: async () => {
              let children = [];
              try {
                const module = await remote().get(application.module);

                if (
                  typeof module.getComponent === "function" &&
                  module.getComponent($baseURL, application, router)
                )
                  return children;

                if (typeof module.getRoutes === "function") {
                  children = module.getRoutes($baseURL, application, router) || [];
                }

                return children;
              } catch (_error) {
                console.error(`Error loading routes for ${application.id} Module`);
                return [];
              }
            },
          };
        });
    }

    return this.routes;
  }
}
