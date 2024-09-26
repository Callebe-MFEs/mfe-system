import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

// add the `?inline` query parameter to the import to prevent the CSS from being extracted
import MyShellStyle from "./shell.element.scss?inline";
import { getApplications } from "./applications";

/**
 * An example element.
 *
 * @slot - This element has a slot
 */
@customElement("my-shell")
export class MyShell extends LitElement {
  static styles = unsafeCSS(MyShellStyle);

  @property({ type: Boolean }) usePushState = false;

  navigateTo(route: string, event: Event) {
    if (this.usePushState) {
      window.history.pushState({}, "", route);
      event.preventDefault();
    }
  }

  render() {
    const applications = getApplications().filter((app) => !!app.route);
    return html`
      <div class="header">
        Header Content
        <nav>
          ${applications.map(
            (app) =>
              html`<a
                href="${app.route}"
                @click="${(event: Event) => this.navigateTo(app.route, event)}"
                >${app.label}</a
              >`
          )}
        </nav>
      </div>
      <div class="content">
        <slot>Slot content</slot>
      </div>
      <div class="footer">Footer Content</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-shell": MyShell;
  }
}
