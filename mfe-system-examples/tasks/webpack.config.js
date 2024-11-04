//webpack.config.js
import path from "path";
import url from "url";
import common from "./webpack.common.js";
import { merge } from "webpack-merge";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import webpack from "webpack";
import packageJson from "./package.json" with { type: "json" };
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";

const { ModuleFederationPlugin } = webpack.container;
const deps = packageJson.dependencies;

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default function (env, args) {
  console.log(
    args.mode === "production" ? "Production build" : "Development build"
  );

  const firebase = !!env.firebase;
  let outputPath = path.resolve(__dirname, "dist");

  if (firebase) {
    console.log("Firebase build");
    outputPath = path.resolve(__dirname, "../../firebase/public/apps/tasks")
  }

  return merge(common, {
    entry: {
      main: path.resolve(__dirname, "src/index.ts"),
    },
    output: {
      filename: "index.js",
      path: outputPath,
      publicPath: "auto",
    },
    resolve: {
      plugins: [
        new TsconfigPathsPlugin({
          configFile: path.resolve(__dirname, "./tsconfig.json"),
        }),
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "tasks",
        filename: "remoteEntry.js",
        exposes: {
          "./Tasks": "./src/mfe.ts",
          "./TasksSingleSpa": "./src/mfe.single-spa.ts",
        },
      }),
      new HtmlWebpackPlugin({
        title: "Task App",
        template: path.resolve(__dirname, "./index.html"),
        base: args.mode === "production" ? "/apps/tasks/" : "/",
      }),

      new CopyPlugin({
        patterns: [
          {
            from: "public",
            to: ".",
          },
        ],
      }),
    ],
  });
}
