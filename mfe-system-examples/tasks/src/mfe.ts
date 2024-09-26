import { Route, Router } from "@vaadin/router";
import { setRouter } from "./router";
import { routes as tasksRoutes } from "./tasks";

export * from "./mfe-component";

let routes: Route[] | undefined = undefined;

export function getRoutes(
  _baseURL: string = "/",
  _application: any,
  router: Router
) {
  setRouter(router);

  if (!routes) {
    routes = [
      {
        path: "/",
        component: "mfe-tasks",
        children: () => tasksRoutes,
      },
    ];
  }

  return routes;
}
