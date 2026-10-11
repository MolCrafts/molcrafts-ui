import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "MolCrafts Design",
    colorPrimary: "#0f6cbd",
    colorSecondary: "#0f6cbd",
    appBg: "#fafafa",
    appContentBg: "#ffffff",
    appPreviewBg: "#fafafa",
    appBorderColor: "#e0e0e0",
    appBorderRadius: 4,
    appHoverBg: "#f5f5f5",
    textColor: "#242424",
    textMutedColor: "#616161",
    barTextColor: "#424242",
    barHoverColor: "#115ea3",
    barSelectedColor: "#0f6cbd",
    barBg: "#ffffff",
    buttonBg: "#ffffff",
    buttonBorder: "#d1d1d1",
    booleanBg: "#f5f5f5",
    booleanSelectedBg: "#ebf3fc",
    inputBg: "#ffffff",
    inputBorder: "#d1d1d1",
    inputTextColor: "#242424",
    inputBorderRadius: 4,
    fontBase: '"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif',
    fontCode: 'ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  }),
});
