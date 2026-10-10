import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "storybook-react-rsbuild";
import "./preview.css";

const preview: Preview = {
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    options: { storySort: { order: ["Foundations", "UI", "Blocks"] } },
  },
  decorators: [
    withThemeByClassName({
      themes: { light: "", dark: "dark" },
      defaultTheme: "light",
      parentSelector: "html",
    }),
  ],
};

export default preview;
