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
  console.log(args.mode === "production" ? "Production build" : "Development build");

  const firebase = !!env.firebase;

  let outputPath = path.resolve(__dirname, "dist");

  if (firebase) {
    console.log("Firebase build");
    outputPath = path.resolve(__dirname, "../firebase/public")
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
        name: "MFESHostApplication",
        shared: {
          "@vaadin/router": {
            requiredVersion: deps["@vaadin/router"],
            strictVersion: false,
          },
        },
      }),
      new HtmlWebpackPlugin({
        title: "Micro-Frontend Solution",
        template: path.resolve(__dirname, "./index.html"),
      }),

      new CopyPlugin({
        patterns: [
          {
            from: "public",
            to: ".",
            globOptions: {
              ignore:
                args.mode === "production"
                  ? ["**/environment.json", "**/applications.json"]
                  : ["**/environment.template.json"],
            },
          },
        ],
      }),
    ],
  });
}
