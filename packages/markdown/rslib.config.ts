import { pluginReact } from "@rsbuild/plugin-react";
import { defineConfig } from "@rslib/core";

export default defineConfig({
  plugins: [pluginReact()],
  lib: [{ format: "esm", bundle: false, dts: true, outBase: "./src" }],
  source: { entry: { index: ["./src/**/*.ts", "./src/**/*.tsx"] } },
  output: { target: "web", distPath: { root: "dist" } },
});
