export type Remote = {
  url: string;
  scope: string;
  module: string;
  type?: "webpack" | "module"; // If not present, handle as if it was webpack
};

export type Contact = {
  name: string;
  email: string;
  phone?: string;
};

export type Support = {
  team: string;
  contacts?: Contact[];
};

export type Application = {
  id: string; // should be unique
  name: string; // should be unique
  label: string; // optional? how to translate if needed?
  order?: number;
  route?: string; // should be unique
  url: string;
  remote: Remote;
  support?: Support;
  data?: {
    [key: string]: any;
  };
};

export type ShellApplication = Application & {
  id: "shell";
  styles?: string[];
  scripts?: string[];
};
