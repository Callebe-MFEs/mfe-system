//webpack.dev.js
import path from "path";
import url from "url";
import { merge } from "webpack-merge";
import config from "./webpack.config.js";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default function (env, args) {
  return merge(config(env, args), {
    mode: "development",
    devServer: {
      static: [path.resolve(__dirname, "dist")],
      historyApiFallback: true,
      open: true,
      port: 8080,
      proxy: [
        {
          context: ["/api/applications"],
          target: "http://localhost:8080",
          pathRewrite: { "^/api/applications": "/applications.json" },
        },
        {
          context: ["/apps/shell"],
          target: "http://localhost:3000",
          pathRewrite: { "^/apps/shell": "" },
        },
        {
          context: ["/apps/messages"],
          target: "http://localhost:3001",
          pathRewrite: { "^/apps/messages": "" },
        },
        {
          context: ["/apps/home"],
          target: "http://localhost:3002",
          pathRewrite: { "^/apps/home": "" },
        },
        {
          context: ["/apps/tasks"],
          target: "http://localhost:3003",
          pathRewrite: { "^/apps/tasks": "" },
        },
        {
          context: ["/apps/applications"],
          target: "http://localhost:4200",
          pathRewrite: { "^/apps/applications": "" },
        },
      ],
    },
  });
}
