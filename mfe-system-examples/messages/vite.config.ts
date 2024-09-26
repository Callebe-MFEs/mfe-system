import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import federation from "@originjs/vite-plugin-federation";

const VITE_PORT = +(process.env.VITE_PORT || 3001);

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "esnext",
  },
  plugins: [
    react(),
    federation({
      name: "messages",
      filename: "remoteEntry.js",
      exposes: {
        "./Messages": "./src/mfe.ts",
        "./MessagesSingleSpa": "./src/mfe.single-spa.ts",
      },
      shared: ["react", "react-dom"],
    }),
  ],
  server: {
    port: VITE_PORT,
  },
  preview: {
    port: VITE_PORT,
  },
});
