import OriginalComponentTypes from "@theme-original/NavbarItem/ComponentTypes";
import MFEDropdownNavbarItem from "./MFEDropdownNavbarItem";

import DefaultNavbarItem from "@theme-original/NavbarItem/DefaultNavbarItem";
import DropdownNavbarItem from "@theme-original/NavbarItem/DropdownNavbarItem";
import LocaleDropdownNavbarItem from "@theme-original/NavbarItem/LocaleDropdownNavbarItem";
import SearchNavbarItem from "@theme-original/NavbarItem/SearchNavbarItem";
import HtmlNavbarItem from "@theme-original/NavbarItem/HtmlNavbarItem";
import DocNavbarItem from "@theme-original/NavbarItem/DocNavbarItem";
import DocSidebarNavbarItem from "@theme-original/NavbarItem/DocSidebarNavbarItem";
import DocsVersionNavbarItem from "@theme-original/NavbarItem/DocsVersionNavbarItem";
import DocsVersionDropdownNavbarItem from "@theme-original/NavbarItem/DocsVersionDropdownNavbarItem";

import type { ComponentTypesObject } from "@theme/NavbarItem/ComponentTypes";

const ComponentTypes: ComponentTypesObject = {
  default: DefaultNavbarItem,
  localeDropdown: LocaleDropdownNavbarItem,
  search: SearchNavbarItem,
  dropdown: DropdownNavbarItem,
  html: HtmlNavbarItem,
  doc: DocNavbarItem,
  docSidebar: DocSidebarNavbarItem,
  docsVersion: DocsVersionNavbarItem,
  docsVersionDropdown: DocsVersionDropdownNavbarItem,
  "custom-mfeDropdown": MFEDropdownNavbarItem,
};

export default ComponentTypes;
