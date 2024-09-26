export * from "./home";

export const TAG = "home-app";

export function getComponent(baseURL: string = "/", appConfig: any = {}) {
  console.log("Home APP: getComponent", baseURL, appConfig);
  return TAG;
}

export default TAG;
