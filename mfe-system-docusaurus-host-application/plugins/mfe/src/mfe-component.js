import { useEffect, useRef } from "react";
import { registerApplication, unregisterApplication } from "single-spa";
import { start } from "./start-single-spa";
// import { withAuthenticationRequired } from '@auth0/auth0-react';

import "./mfe-component.css";

export function MFE({ applications }) {
  const ref = useRef();
  useEffect(() => {
    const div = ref.current;

    div.innerHTML = applications
      .map(
        (app) =>
          `<div class="singleSpaMfe" id="single-spa-application:${app.name}"></div>`
      )
      .join("");

    // div.innerHTML = [
    //   "header",
    //   "sider",
    //   "fullpage",
    //   "content",
    //   "offlayout",
    //   "footer",
    // ]
    //   .map((tag) => {
    //     return `<${tag}>
    //   ${applications
    //     .filter(
    //       (app) =>
    //         app.placement === tag || (tag === "content" && !app.placement)
    //     )
    //     .map((app) => `<div id="single-spa-application:${app.name}"></div>`)
    //     .join("")}
    //   </${tag}>`;
    //   })
    //   .join("");

    applications.forEach((app) => {
      try {
        registerApplication(app.singleSpa);
      } catch (err) {
        console.log("Error registering app", app.name, err);
      }
    });

    start();

    return () => {
      applications.forEach((app) => {
        unregisterApplication(app.name);
      });
      div.innerHTML = "";
    };
  }, [applications]);

  return <div ref={ref} className="mfeWrapper"></div>;
}

// export const MFEAuth = withAuthenticationRequired(MFE);

export default MFE;
