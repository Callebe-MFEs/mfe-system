import React, { useState, useEffect } from "react";
import { usePluginData } from "@docusaurus/useGlobalData";

import DropdownNavbarItem from "@theme-original/NavbarItem/DropdownNavbarItem";
import type DropdownNavbarItemType from "@theme/NavbarItem/DropdownNavbarItem";
import type { WrapperProps } from "@docusaurus/types";

type Props = WrapperProps<typeof DropdownNavbarItemType>;

async function getApplications(basepath, applicationsEndpoint) {
  // loading mfes configuration from config.json file.
  // it could come from an API call as well.
  // the config.json file can be build in the server side reading from env variables.
  const response = await fetch(applicationsEndpoint);
  const applications = await response.json();

  /*
  { to: "/my-apps", label: "Home MFE" },
            { to: "/my-apps/tasks", label: "Tasks MFE" },
  */
  return applications
    .filter((app) => app.id !== "shell")
    .map((app) => ({
      to: `${basepath}${app.route}`,
      label: app.label,
    }));
}

export default function MFEDropdownNavbarItem({
  ...props
}: Props): JSX.Element {
  const data: any = usePluginData("mfes-plugin");
  const [items, setItems] = useState([]);

  useEffect(() => {
    getApplications(data.basepath, data.applicationsEndpoint).then((apps) =>
      setItems(apps)
    );
  }, []);

  props.items = items;

  return <DropdownNavbarItem {...props} />;
}
