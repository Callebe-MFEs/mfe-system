import "react";
import { createElement } from "react";
import ReactDOM from "react-dom/client";
import Root from "./root";

// base url to be used inside the react application if required
let $baseURL = "/";

class MessageElement extends HTMLElement {
  private app: ReactDOM.Root | undefined = undefined;
  constructor() {
    super();
  }

  connectedCallback() {
    this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `:host { display: flex; flex-direction: column; align-items: stretch; box-sizing: border-box; } ::slotted(*) { flex: 1 1 0; min-height: 0; min-width: 0;}`;
    this.shadowRoot?.appendChild(style);
    this.shadowRoot?.appendChild(document.createElement("slot"));

    console.log("mounting React Application using baseUrl: ", $baseURL);

    this.app = ReactDOM.createRoot(this);
    this.app.render(createElement(Root));
  }

  onAfterLeave() {
    this.app?.unmount();
    this.app = undefined;
  }
}

const TAG = "my-message-app";

// register web application;
customElements.get(TAG) || customElements.define(TAG, MessageElement);

function getComponent(baseURL: string = "/", appConfig: any = {}) {
  $baseURL = baseURL;
  console.log("Message APP: getComponent", baseURL, appConfig);
  return TAG;
}

export { MessageElement, getComponent, TAG };
export default TAG;

declare global {
  interface HTMLElementTagNameMap {
    [TAG]: MessageElement;
  }
}
