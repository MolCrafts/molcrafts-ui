import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

// Intentionally no Tailwind plugin, source aliases, library scan or source imports.
export default defineConfig({
  plugins: [pluginReact()],
  source: { entry: { index: "./src/index.tsx", native: "./src/native.ts" } },
  html: { template: "./index.html", title: "MolCrafts built-package consumer" },
});
