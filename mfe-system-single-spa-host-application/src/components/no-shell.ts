export class NoShellElement extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `:host { display: block; height: 100%; min-height: 100%; } ::slotted(*) { min-height: 100vh; box-sizing: border-box; }`;
    this.shadowRoot?.appendChild(style);

    const div = document.createElement("div");
    div.textContent = "No Shell configured";

    const slot = document.createElement("slot");
    slot.appendChild(div);
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
