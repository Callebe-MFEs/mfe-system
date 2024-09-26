export * from "./app";
import "./index.css";

const baseHref = document.querySelector("base")?.getAttribute("href") || "/";

const myComponent = document.createElement("tasks-app");
myComponent.baseUrl = baseHref; // when running as standalone, use baseUrl instead of basepath

document.body.appendChild(myComponent);
