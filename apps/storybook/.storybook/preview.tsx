import { useEffect, type ReactNode } from "react";
import type { Decorator, Preview } from "storybook-react-rsbuild";
import "./preview.css";

type ThemeName = "light" | "dark";

function applyDocumentTheme(theme: ThemeName) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.setAttribute("data-mol-theme", theme);
}

/**
 * Story canvases theme the iframe document, because each story has its own document.
 * Docs pages render many stories in one document, so each example carries its own
 * theme root and must not repaint the shared `html`.
 */
function ThemeBoundary({
  theme,
  isolate,
  children,
}: {
  theme: ThemeName;
  isolate: boolean;
  children: ReactNode;
}) {
  useEffect(() => {
    if (isolate) return;
    applyDocumentTheme(theme);
  }, [isolate, theme]);

  if (isolate) {
    return (
      <div
        data-mol-theme={theme}
        className={theme === "dark" ? "dark bg-background text-foreground" : "bg-background text-foreground"}
      >
        {children}
      </div>
    );
  }

  if (typeof document !== "undefined") applyDocumentTheme(theme);
  return children;
}

const withIsolatedTheme: Decorator = (Story, context) => {
  const theme: ThemeName = context.globals.theme === "dark" ? "dark" : "light";
  return (
    <ThemeBoundary theme={theme} isolate={context.viewMode === "docs"}>
      <Story />
    </ThemeBoundary>
  );
};

const preview: Preview = {
  tags: ["autodocs"],
  initialGlobals: { theme: "light" },
  globalTypes: {
    theme: {
      description: "Light or dark theme",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", icon: "sun", title: "Light" },
          { value: "dark", icon: "moon", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    layout: "centered",
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    options: {
      storySort: {
        order: [
          "Foundations",
          ["Packages", "Constitution", "Product themes", "Theme scope"],
          "UI",
          "Blocks",
          "Web Components",
          ["Foundations", "Button", "Badge", "Checkbox", "Switch", "TextInput", "TextArea", "Label", "Field", "Divider", "Spinner", "Tab", "Tablist", "Tooltip"],
          "Charts",
          ["VegaView", "Plot types", ["Pairwise data", "Statistical distributions", "Gridded data"], "VegaLiteView"],
        ],
      },
    },
  },
  decorators: [withIsolatedTheme],
};

export default preview;
