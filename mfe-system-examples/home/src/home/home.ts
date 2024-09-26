import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import style from "./home.style.scss";
import { template } from "./home.template";

@customElement("home-app")
export class HomeElement extends LitElement {
  static styles = [style];

  protected render() {
    return html`${template()}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "home-app": HomeElement;
  }
}
