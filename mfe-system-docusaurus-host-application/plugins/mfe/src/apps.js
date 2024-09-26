import { useState, useEffect } from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
// import { MFE, MFEAuth } from "./mfe-component";
import { MFE } from "./mfe-component";
import { importRemote } from "./import-remote";

async function getApplications(basepath, applicationsEndpoint) {
  // loading mfes configuration from config.json file.
  // it could come from an API call as well.
  // the config.json file can be build in the server side reading from env variables.
  const response = await fetch(applicationsEndpoint);
  let applications = await response.json();

  applications = applications.filter((app) => app.id !== "shell");

  return applications.map((mfe) => {
    const baseUrl = basepath.replace(/\/$/, "") + mfe.route;
    mfe.singleSpa = {
      name: mfe.name,
      app: () =>
        importRemote(
          mfe.remote.url,
          mfe.remote.scope,
          mfe.remote.module,
          mfe.remote.type
        ),
      activeWhen: (location) => {
        const pathname = location.pathname.replace(basepath, "") || "/";
        if (mfe.route === "/") return pathname === "/";
        return pathname.startsWith(mfe.route);
        // return new RegExp(mfe.activeWhen).test(pathname);
      },
      customProps: {
        applications,
        baseUrl: baseUrl,
        appConfig: mfe,
      },
    };
    return mfe;
  });
}

/**
 * React component that will render the micro-frontends
 * @param {*} param0
 * @returns
 */
export default function Apps({ mfeConfig }) {
  // const { basepath, applicationsEndpoint, authRequired } = mfeConfig;
  const { basepath, applicationsEndpoint } = mfeConfig;

  const { siteConfig } = useDocusaurusContext();
  const [applications, setApplications] = useState([]);
  useEffect(() => {
    getApplications(basepath, applicationsEndpoint).then((apps) => {
      setApplications(apps);
    });
  }, []);
  // const mfeComponent = authRequired ? (
  // 	<MFEAuth applications={applications}></MFEAuth>
  // ) : (
  // 	<MFE applications={applications}></MFE>
  // );
  const mfeComponent = <MFE applications={applications}></MFE>;
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      {mfeComponent}
    </Layout>
  );
}
