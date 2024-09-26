export class AboutElement extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `:host { display: block; }`;
    this.shadowRoot?.appendChild(style);

    fetch("/about.html")
      .then((response) => {
        return response.text();
      })
      .then((html) => {
        const div = document.createElement("div");
        div.setAttribute("id", "about");
        div.innerHTML = html;
        this.shadowRoot && this.shadowRoot.appendChild(div);
      });
  }
}

const AboutElementTag = "mfes-about";

// register web application;
customElements.get(AboutElementTag) || customElements.define(AboutElementTag, AboutElement);

export { AboutElementTag };

declare global {
  interface HTMLElementTagNameMap {
    [AboutElementTag]: AboutElement;
  }
}
