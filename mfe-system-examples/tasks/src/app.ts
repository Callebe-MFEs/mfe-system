import { LitElement, PropertyValueMap, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import style from "./app.style.scss";
import { getRouter, newRouter } from "./router";

@customElement("tasks-app")
export class TasksAppComponent extends LitElement {
  static styles = [style];

  @property({ type: String })
  basepath: string = "/";

  @property({ type: String })
  baseUrl: string = "/";

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.firstUpdated(_changedProperties);
    const baseUrl = this.baseUrl + (this.baseUrl.endsWith("/") ? "" : "/");
    const router = newRouter(this.shadowRoot.querySelector("#outlet"), {
      baseUrl: baseUrl,
    });

    router.setRoutes([
      {
        path: `${this.basepath || "/"}`,
        children: () => import("./tasks").then((module) => module.routes),
      },
      {
        path: "(.*)",
        component: "div",
      },
    ]);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    getRouter().unsubscribe();
  }

  render() {
    return html`
      <div class="tasks-app">
        <div id="outlet"></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tasks-app": TasksAppComponent;
  }
}
