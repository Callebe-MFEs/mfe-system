import { html, render } from "lit";

export * from "./my-element";
export * from "./shell/shell.element";

render(
  html`
    <my-shell>
      <my-element>
        <h1>Vite + Lit</h1>
      </my-element>
    </my-shell>
  `,
  document.body
);
