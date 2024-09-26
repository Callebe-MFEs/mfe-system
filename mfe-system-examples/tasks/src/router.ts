import { Router } from "@vaadin/router";

let router: Router = undefined;

export function newRouter(outlet?: HTMLElement, options?: any) {
  router = new Router(outlet, options);
  return router;
}

export function getRouter() {
  return router;
}

export function setRouter(newRouter: Router) {
  router = newRouter;
}
