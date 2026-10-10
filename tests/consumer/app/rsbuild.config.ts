import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

// Intentionally no Tailwind plugin, source aliases, library scan or source imports.
export default defineConfig({
  plugins: [pluginReact()],
  html: { template: "./index.html", title: "MolCrafts built-package consumer" },
});
