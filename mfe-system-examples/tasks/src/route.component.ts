import { Router } from "@vaadin/router";
import { LitElement } from "lit";
import { getRouter } from "./router";

export class RouteComponent extends LitElement {
  protected router: Router;

  constructor() {
    super();
    this.router = getRouter();
  }
}
