import { defineConfig } from "@rslib/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  lib: [{ format: "esm", bundle: false, dts: true, outBase: "./src" }],
  source: { entry: { index: ["./src/**/*.ts", "./src/**/*.tsx", "./src/workflow/*.css"] } },
  output: { target: "web", distPath: { root: "dist" } },
});
