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
      port: 3002,
    },
  });
}
