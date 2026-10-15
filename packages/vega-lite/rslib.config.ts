import { defineConfig } from "@rslib/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  lib: [
    {
      id: "package",
      format: "esm",
      bundle: false,
      dts: true,
      source: { entry: { index: "./src/index.tsx", element: "./src/element.ts" } },
      output: { target: "web", distPath: { root: "dist" } },
    },
    {
      id: "browser",
      format: "esm",
      bundle: true,
      source: { entry: { browser: "./src/browser.ts" } },
      output: {
        target: "web",
        autoExternal: false,
        distPath: { root: "dist/browser" },
      },
    },
  ],
});
