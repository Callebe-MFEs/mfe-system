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

  it('should display "No Shell configured" text', () => {
    const text = element.shadowRoot.querySelector("div").textContent;
    expect(text).toBe("No Shell configured");
  });
});
