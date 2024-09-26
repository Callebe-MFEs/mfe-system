import { registerApplication, start } from "single-spa";
import { SingleSPAApplication } from "./application";

const singleSPABootstrap = (applications: Array<SingleSPAApplication>): void => {
  applications.forEach((app) => {
    registerApplication(app);
  });
  start();
};

export { singleSPABootstrap as bootstrap };
export default singleSPABootstrap;
