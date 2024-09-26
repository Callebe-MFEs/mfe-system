export type Remote = {
  url: string;
  scope: string;
  module: string;
  type?: "webpack" | "module";
};

export type Application = {
  id: string;
  name: string;
  label: string;
  route?: string;
  remote: Remote;
  module?: string;
  data?: {
    [key: string]: any;
  };
};

export type ShellApplication = Application & {
  id: "shell";
  styles: string[];
  scripts: string[];
};
