export * from "./no-shell";
import { NoShellElementTag, NoShellElement } from "./no-shell";

describe("NoShellElement", () => {
  let element: NoShellElement = undefined;

  beforeEach(() => {
    element = document.createElement(NoShellElementTag) as NoShellElement;
    document.body.appendChild(element);
  });

  it("should create", () => {
    expect(element).toBeInstanceOf(NoShellElement);
  });

  it("should display mfes-about component", () => {
    element.shadowRoot.querySelector("mfes-about");
    expect(element.shadowRoot.querySelector("mfes-about")).toBeDefined();
  });
});
