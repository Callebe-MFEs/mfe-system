export * from "./tasks-list";
export * from "./task-details";
export * from "./task-form";

export const routes = [
  { path: "/", component: "tasks-list" },
  { path: "/edit/:taskId?", component: "task-form" },
  { path: "/:taskId", component: "task-details" },
];
