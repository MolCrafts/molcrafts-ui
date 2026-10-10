import { defineConfig } from "@rslib/core";

export default defineConfig({
  lib: [
    {
      id: "package",
      format: "esm",
      bundle: false,
      dts: true,
      source: { entry: { index: "./src/index.ts", register: "./src/register.ts", components: "./src/components.ts", icons: "./src/icons.ts" } },
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
