import { Application, ShellApplication, SingleSPAApplication } from "./mfe/application";
import { ApplicationsService } from "./services/applications.service";
import { ConfigurationService } from "./services/configuration.service";
import { NoShellElementTag } from "./components/no-shell";
import singleSPABootstrap from "./mfe/bootstrap";

export * from "./components/no-shell";

export const bootstrapPromise = (async () => {
  const config = await fetch("/environment.json").then((res) => res.json());
  ConfigurationService.instance.setConfiguration(config);

  const shell = await ApplicationsService.instance.loadShellScriptsAndStyles();
  const applications = await ApplicationsService.instance.getApplications();
  const shellComponent = await getShellComponent(shell, applications);

  prepareTemplate(applications, shellComponent);
  const mfeConfig = mfeConfigurations(applications);

  singleSPABootstrap(mfeConfig);
})();

async function getShellComponent(
  shell: ShellApplication,
  applications: Array<Application>,
): Promise<string> {
  try {
    if (shell?.module) {
      const module = await ApplicationsService.instance.getApplication(shell);
      if (typeof module.getComponent === "function") {
        const tag = module.getComponent("/", shell, applications);
        if (tag) return tag;
      }
    }
  } catch (_error) {
    console.error("Error loading Shell Module");
  }
  return NoShellElementTag;
}

function prepareTemplate(applications: Array<Application>, shellComponent: string) {
  const shellElement = document.createElement(shellComponent);
  (shellElement as any).usePushState = true;

  for (const app of applications) {
    const div = document.createElement("div");
    div.id = `single-spa-application:${app.name}`;
    div.classList.add("mfe");
    app.data?.placement && (div.slot = app.data.placement);
    shellElement.appendChild(div);
  }

  document.body.appendChild(shellElement);
}

function mfeConfigurations(applications: Array<Application>): Array<SingleSPAApplication> {
  return applications.map((app) => ({
    name: app.name,

    // load the MFE application. It returns a promise, and is only called the first time the MFE is activated.
    app: () => ApplicationsService.instance.getApplication(app),

    // method that returns true when the MFE should be activated.
    // it is called every time the location changes.
    // it maches the location.pathname with the app.activeWhen regex.
    activeWhen: (location) => {
      if (app.route === "/") {
        return new RegExp(`^/$`).test(location.pathname);
      }
      return (location.pathname as string).startsWith(app.route);
    },

    // customProps is an object that is passed to the MFE application, along with the lifecycle methods.
    // for this example, we are passing the applications array and the baseUrl of the MFE.
    customProps: {
      applications,
      baseUrl: app.route,
      appConfig: app,
    },
  }));
}
