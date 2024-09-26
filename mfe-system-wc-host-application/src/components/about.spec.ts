export * from "./about";
import { AboutElementTag, AboutElement } from "./about";

describe("AboutElement", () => {
  let element: AboutElement = undefined;
  let spy: jasmine.Spy;
  let textSpy: jasmine.Spy;

  beforeEach(() => {
    textSpy = jasmine.createSpy("text").and.resolveTo("About");
    spy = spyOn(window, "fetch").and.resolveTo({ text: textSpy } as any);
    element = document.createElement(AboutElementTag) as AboutElement;
    document.body.appendChild(element);
  });

  it("should create", () => {
    expect(element).toBeInstanceOf(AboutElement);
  });

  it("should display about.html content", async () => {
    expect(spy).toHaveBeenCalledWith("/about.html");
    const response = await spy.calls.mostRecent().returnValue;
    await response.text();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(element.shadowRoot.querySelector("#about").innerHTML).toBe("About");
  });
});
