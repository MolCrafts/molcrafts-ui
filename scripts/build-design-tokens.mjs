import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { webDarkTheme, webLightTheme } from "@fluentui/react-theme";

const root = new URL("../", import.meta.url);
const packageJson = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
const version = packageJson.devDependencies["@fluentui/react-theme"];
const reference = JSON.parse(await readFile(new URL("packages/tokens/reference.json", root), "utf8"));
if (reference.reference.version !== version) throw new Error("Review and update packages/tokens/reference.json before changing the Fluent reference version.");
const header = `/** Generated from @fluentui/react-theme ${version}. Run pnpm build:tokens. */\n`;

// Keep public MolCrafts names stable; values come from the released Fluent 2 web themes.
const roles = {
  background: "colorNeutralBackground2",
  foreground: "colorNeutralForeground1",
  surface: "colorNeutralBackground1",
  card: "colorNeutralBackground1",
  "card-foreground": "colorNeutralForeground1",
  popover: "colorNeutralBackground1",
  "popover-foreground": "colorNeutralForeground1",
  muted: "colorNeutralBackground3",
  "muted-foreground": "colorNeutralForeground2",
  "subtle-foreground": "colorNeutralForeground3",
  border: "colorNeutralStroke2",
  input: "colorNeutralStroke1",
  "input-bottom": "colorNeutralStrokeAccessible",
  "input-hover": "colorNeutralStroke1Hover",
  neutral: "colorNeutralBackground1",
  "neutral-foreground": "colorNeutralForeground1",
  interactive: "colorNeutralBackground1Hover",
  "interactive-pressed": "colorNeutralBackground1Pressed",
  "interactive-foreground": "colorNeutralForeground1",
  primary: "colorBrandBackground",
  "primary-hover": "colorBrandBackgroundHover",
  "primary-pressed": "colorBrandBackgroundPressed",
  "primary-foreground": "colorNeutralForegroundOnBrand",
  "primary-muted": "colorBrandBackground2",
  "primary-muted-foreground": "colorBrandForeground2",
  "primary-link": "colorBrandForegroundLink",
  "primary-link-hover": "colorBrandForegroundLinkHover",
  secondary: "colorPalettePurpleBorderActive",
  "secondary-muted": "colorPalettePurpleBackground2",
  "secondary-muted-foreground": "colorPalettePurpleForeground2",
  ring: "colorStrokeFocus2",
  "focus-inner": "colorStrokeFocus1",
  "disabled-background": "colorNeutralBackgroundDisabled",
  "disabled-foreground": "colorNeutralForegroundDisabled",
  "disabled-border": "colorNeutralStrokeDisabled",
  "tooltip-background": "colorNeutralBackgroundInverted",
  "tooltip-foreground": "colorNeutralForegroundInverted",
  "overlay-scrim": "colorBackgroundOverlay",
};

function themeBlock(selector, theme, scheme) {
  const lines = [`  color-scheme: ${scheme};`];
  for (const [role, source] of Object.entries(roles)) {
    if (!theme[source]) throw new Error(`Missing Fluent token ${source}`);
    lines.push(`  --${role}: ${theme[source]};`);
  }
  lines.push(
    `  --secondary-foreground: ${scheme === "light" ? "#ffffff" : "#000000"};`,
    `  --secondary-hover: color-mix(in srgb, var(--secondary), ${scheme === "light" ? "black" : "white"} 10%);`,
    `  --secondary-pressed: color-mix(in srgb, var(--secondary), ${scheme === "light" ? "black" : "white"} 20%);`,
  );
  return `${selector} {\n${lines.join("\n")}\n}\n`;
}

await writeFile(new URL("packages/tokens/src/fluent-theme.css", root), header + "\n" +
  themeBlock(":where(:root, :host), [data-mol-theme=light]", webLightTheme, "light") + "\n" +
  themeBlock(".dark, [data-mol-theme=dark]", webDarkTheme, "dark"));

const typeScale = {
  micro: ["fontSizeBase100", "lineHeightBase100"],
  label: ["fontSizeBase200", "lineHeightBase200"],
  body: ["fontSizeBase300", "lineHeightBase300"],
  "body-lg": ["fontSizeBase400", "lineHeightBase400"],
  title: ["fontSizeBase500", "lineHeightBase500"],
  heading: ["fontSizeBase600", "lineHeightBase600"],
  display: ["fontSizeHero800", "lineHeightHero800"],
};
const foundation = [
  "  --spacing: 0.25rem;",
  "  --border-width-default: 1px;",
  "  --focus-width: 2px;",
  "  --focus-offset: 2px;",
  "  --font-weight-normal: 400;",
  "  --font-weight-semibold: 600;",
  `  --font-sans: ${webLightTheme.fontFamilyBase};`,
  `  --font-mono: ${webLightTheme.fontFamilyMonospace};`,
];
for (const [role, [size, height]] of Object.entries(typeScale)) {
  foundation.push(`  --text-${role}: ${webLightTheme[size]};`, `  --text-${role}--line-height: ${webLightTheme[height]};`);
}
for (const [role, source] of Object.entries({
  control: "borderRadiusMedium", panel: "borderRadiusXLarge", overlay: "borderRadiusXLarge",
  checkbox: "borderRadiusSmall",
})) foundation.push(`  --radius-${role}: ${webLightTheme[source]};`);

// Retain the 28px scientific-workbench compact size; Fluent medium/large use 32/40px.
for (const [role, value] of Object.entries({
  "control-compact": "1.75rem", control: "2rem", "control-comfortable": "2.5rem",
  "toolbar-compact": "2.5rem", toolbar: "2.75rem", statusbar: "1.75rem",
  "touch-target": "2.75rem", menu: "8rem", "dialog-sm": "24rem", "dialog-md": "30rem",
  "dialog-lg": "34rem", "dialog-scroll": "80vh", "overlay-viewport": "calc(100% - 2rem)",
})) foundation.push(`  --spacing-${role}: ${value};`);
foundation.push(`  --ease-standard: ${webLightTheme.curveEasyEase};`);
await writeFile(new URL("packages/tokens/src/constitution-theme.css", root), header +
  "/* Shared geometry only. Product brand mappings belong to the product theme. */\n@theme inline reference {\n" +
  foundation.map(line => { const name = line.trim().split(":")[0]; return `  ${name}: var(${name});`; }).join("\n") + "\n}\n");

await writeFile(new URL("packages/tokens/src/geometry.css", root), header + ":where(:root, :host), [data-mol-theme] {\n" + foundation.join("\n") + "\n}\n");

const shared = {
  "motion-fast": "durationFaster", "motion-base": "durationFast", "motion-slow": "durationNormal",
  "motion-ease": "curveEasyEase", "motion-enter": "curveDecelerateMid", "motion-exit": "curveAccelerateMid",
  "neutral-shadow-ambient": "colorNeutralShadowAmbient", "neutral-shadow-key": "colorNeutralShadowKey",
  "status-draft": "colorNeutralForeground3", "status-ready": "colorNeutralForeground2",
  "status-queued": "colorPaletteBlueForeground2", "status-running": "colorPaletteBlueBorderActive",
  "status-completed": "colorPaletteGreenBackground3", "status-failed": "colorPaletteRedBackground3",
  "status-failed-hover": "colorPaletteRedForeground1", "status-cancelled": "colorNeutralForeground3",
  "status-cached": "colorPalettePurpleForeground2", "status-warning": "colorPaletteYellowBackground3",
  "status-ready-foreground": "colorNeutralForeground2", "status-running-foreground": "colorPaletteBlueForeground2",
  "status-completed-foreground": "colorPaletteGreenForeground1", "status-failed-foreground": "colorPaletteRedForeground1",
  "status-warning-foreground": "colorPaletteYellowForeground1",
};
function sharedBlock(selector, theme) {
  return `${selector} {\n` + Object.entries(shared).flatMap(([role, source]) => {
    if (!theme[source]) throw new Error(`Missing Fluent token ${source}`);
    const value = role === "status-failed-hover" ? webLightTheme[source] : theme[source];
    return `  --${role}: ${value};`;
  }).join("\n") + "\n}\n";
}
await writeFile(new URL("packages/tokens/src/fluent-foundation.css", root), header + "\n" +
  sharedBlock(":where(:root, :host), [data-mol-theme=light]", webLightTheme) + "\n" +
  sharedBlock(".dark, [data-mol-theme=dark]", webDarkTheme));
console.log(`Generated Fluent 2 theme, foundation, and geometry in ${fileURLToPath(new URL("packages/tokens/src/", root))}`);
