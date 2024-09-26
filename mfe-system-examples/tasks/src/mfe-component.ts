import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import style from "./mfe-component.style.scss";

@customElement("mfe-tasks")
export class MFETasksComponent extends LitElement {
  static styles = [style];

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mfe-tasks": MFETasksComponent;
  }
}
