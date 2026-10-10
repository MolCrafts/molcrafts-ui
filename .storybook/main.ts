import { mergeRsbuildConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import tailwindcss from "@tailwindcss/postcss";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "storybook-react-rsbuild";

const config: StorybookConfig = {
  framework: "storybook-react-rsbuild",
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-themes"],
  staticDirs: ["../public"],
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
  rsbuildFinal: (config) =>
    mergeRsbuildConfig(config, {
      plugins: [pluginReact()],
      resolve: {
        alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) },
      },
      tools: {
        postcss: { postcssOptions: { plugins: [tailwindcss()] } },
      },
    }),
};

export default config;
