export type Remote = {
  url: string;
  scope: string;
  module: string;
  type?: 'webpack' | 'module'; // If not present, handle as if it was webpack
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
  id: 'shell';
  styles?: string[];
  scripts?: string[];
};

export type ContactForm = Contact & { phone: string };

export type ApplicationForm = Application &
  ShellApplication & {
    support: Support & {
      contacts: Array<ContactForm>;
    };
  };

export const emptyApplication: Application | ShellApplication = {
  id: '',
  name: '',
  label: '',
  route: '',
  url: '',
  order: 0,
  remote: {
    url: '',
    scope: '',
    module: '',
    type: 'webpack',
  },
  support: {
    team: '',
    contacts: [],
  },
};

export const emptyContact: ContactForm = {
  name: '',
  email: '',
  phone: '',
};

export const fillEmptyApplication = (
  app: Application | ShellApplication
): ApplicationForm => {
  return {
    ...JSON.parse(JSON.stringify(emptyApplication)),
    ...JSON.parse(JSON.stringify(app)),
  };
};
