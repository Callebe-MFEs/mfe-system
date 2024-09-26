export * from "./app";

const template = (props) => {
  const myComponent = document.createElement("tasks-app");
  myComponent.basepath = props.baseUrl; // when running as mfe, use basepath instead of baseUrl
  return myComponent;
};

const containerGetter = (props) => {
  const htmlId = `single-spa-application:${props.name}`;
  return document.getElementById(htmlId);
};

export const mount = async (props) => {
  const container = containerGetter(props);
  container.appendChild(template(props));
};

export const unmount = async (props) => {
  const container = containerGetter(props);
  container.innerHTML = "";
};

export const bootstrap = async (props) => {};
