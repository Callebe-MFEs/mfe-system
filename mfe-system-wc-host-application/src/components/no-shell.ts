export * from "./about";

export class NoShellElement extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `:host { display: block; }`;
    this.shadowRoot?.appendChild(style);

    const about = document.createElement("mfes-about");

    const slot = document.createElement("slot");
    slot.appendChild(about);
    this.shadowRoot?.appendChild(slot);
  }
}

const NoShellElementTag = "mfes-no-shell";

// register web application;
customElements.get(NoShellElementTag) || customElements.define(NoShellElementTag, NoShellElement);

export { NoShellElementTag, NoShellElementTag as tagName };

declare global {
  interface HTMLElementTagNameMap {
    [NoShellElementTag]: NoShellElement;
  }
}
