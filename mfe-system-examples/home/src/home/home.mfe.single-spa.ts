export * from "./home";

const template = (props) => {
  console.log("Home APP: template", props);
  const homeComponent = document.createElement("home-app");
  return homeComponent;
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
