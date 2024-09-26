export * from "./components/no-shell";
import { Commands, Context, Router } from "@vaadin/router";
import { NoShellElementTag } from "./components/no-shell";
import { ConfigurationService } from "./services/configuration.service";
import { ApplicationsService } from "./services/applications.service";

export const bootstrapPromise = (async () => {
  const config = await fetch("/environment.json").then((res) => res.json());
  ConfigurationService.instance.setConfiguration(config);

  const outlet = document.getElementById("outlet");
  const router = new Router(outlet);

  const shell = await ApplicationsService.instance.loadShellScriptsAndStyles();
  const appRoutes = await ApplicationsService.instance.getApplicationsRoutes(router);

  router.setRoutes([
    {
      path: `/`,
      action: async (_context: Context, commands: Commands) => {
        try {
          if (shell?.module) {
            const module = await ApplicationsService.instance.getApplication(shell);
            if (typeof module.getComponent === "function") {
              const applications = await ApplicationsService.instance.getApplications();
              const tag = module.getComponent("/", shell, applications);
              if (tag) return commands.component(tag);
            }
          }
        } catch (_error) {
          console.error("Error loading Shell Module");
        }
        return commands.component(NoShellElementTag);
      },
      children: appRoutes,
    },
    {
      path: "(.*)",
      redirect: "/",
    },
  ]);
})();

export default bootstrapPromise;
