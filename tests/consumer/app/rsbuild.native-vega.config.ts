import { writeFileSync } from "node:fs";
import { defineConfig, type Rspack } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  source: { entry: { index: "./src/native-vega.tsx" } },
  html: { template: "./index.html" },
  output: { distPath: { root: "dist-native-vega" } },
  tools: { rspack: (config) => {
    config.plugins ??= [];
    config.plugins.push({ apply(compiler: Rspack.Compiler) {
      compiler.hooks.done.tap("ChartDependencyBoundary", stats => {
        const modules: string[] = [];
        for (const module of stats.compilation.modules) modules.push(module.identifier());
        if (modules.some(name => /(?:vega-lite|design-vega-lite|vega-embed|molplot)/.test(name))) throw new Error("Native Vega consumer loaded a compiler, embed or editor");
        if (!modules.some(name => /vega(?:-view)?(?:@[^/]+)?\//.test(name))) throw new Error("Native Vega runtime was not bundled");
        writeFileSync("dist-native-vega/dependency-boundary.json", JSON.stringify({ compilerAbsent: true, modules }, null, 2));
      });
    } });
  } },
});
