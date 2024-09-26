import { setApplications } from "./applications";

export * from "./shell.element";

export function getComponent(
  baseUrl: string = "/",
  shellConfig: any = {},
  applications: any[] = []
) {
  console.log("Shell MFE getComponent", baseUrl, shellConfig, applications);

  setApplications(applications);

  return "my-shell";
}
