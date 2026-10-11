import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const failures = [];

async function read(path) {
  return readFile(new URL(path, root), "utf8");
}

async function walk(path, files = []) {
  for (const entry of await readdir(new URL(path, root), { withFileTypes: true })) {
    const child = `${path}/${entry.name}`;
    if (entry.isDirectory()) await walk(child, files);
    else if (entry.name.endsWith(".stories.tsx")) files.push(child);
  }
  return files;
}

function titleOf(source, file) {
  const match = source.match(/title:\s*"([^"]+)"/);
  if (!match) failures.push(`${file} has no title`);
  return match?.[1] ?? "";
}

const storySources = new Map();
for (const file of await walk("apps/storybook/src")) storySources.set(file, await read(file));

for (const group of ["ui", "blocks"]) {
  const directory = new URL(`packages/ui/src/components/${group}/`, root);
  const components = (await readdir(directory)).filter(name => name.endsWith(".tsx")).map(name => name.slice(0, -4));
  const prefix = group === "ui" ? "UI/" : "Blocks/";
  for (const name of components) {
    const file = `apps/storybook/src/components/${group}/${name}.stories.tsx`;
    const source = storySources.get(file);
    if (!source) {
      failures.push(`${name} has no Storybook entry at ${file}`);
      continue;
    }
    if (!source.includes('from "@molcrafts/design"')) failures.push(`${file} must import @molcrafts/design`);
    const title = titleOf(source, file);
    if (title && !title.startsWith(prefix)) failures.push(`${file} title ${title} must start with ${prefix}`);
  }
  for (const [file, source] of storySources) {
    if (!file.startsWith(`apps/storybook/src/components/${group}/`)) continue;
    const name = file.slice(file.lastIndexOf("/") + 1, -".stories.tsx".length);
    if (!components.includes(name)) failures.push(`${file} has no component module packages/ui/src/components/${group}/${name}.tsx`);
    if (!source.includes('from "@molcrafts/design"')) failures.push(`${file} must import @molcrafts/design`);
  }
}

const themeFile = "apps/storybook/src/theme/theme-scope.stories.tsx";
const theme = storySources.get(themeFile);
if (!theme || !theme.includes("ThemeScope") || !titleOf(theme, themeFile).startsWith("Foundations/")) {
  failures.push("ThemeScope needs Foundations/Theme scope in apps/storybook/src/theme/theme-scope.stories.tsx");
}

for (const [file, symbol, titlePrefix] of [
  ["apps/storybook/src/charts/vega.stories.tsx", "VegaView", "Charts/"],
  ["apps/storybook/src/charts/vega-lite.stories.tsx", "VegaLiteView", "Charts/"],
]) {
  const source = storySources.get(file);
  if (!source || !source.includes(symbol) || !titleOf(source, file).startsWith(titlePrefix)) {
    failures.push(`${symbol} needs a ${titlePrefix} story at ${file}`);
  }
}

const catalog = JSON.parse(await read("packages/web-components/components.json"));
const nativeStories = [...storySources].filter(([file]) => file.startsWith("apps/storybook/src/web-components/"));
const nativeTitles = new Map(nativeStories.map(([file, source]) => [titleOf(source, file), { file, source }]));
for (const component of catalog.components) {
  const title = `Web Components/${component.class}`;
  const story = nativeTitles.get(title);
  if (!story) {
    failures.push(`${component.tag} needs Storybook title ${title}`);
    continue;
  }
  if (!story.source.includes(component.tag)) failures.push(`${story.file} must render <${component.tag}>`);
  if (!story.source.includes("@molcrafts/design-web-components") && !story.source.includes("./native-canvas")) {
    failures.push(`${story.file} must use the public web-components runtime`);
  }
}
for (const [title, story] of nativeTitles) {
  const component = catalog.components.find(item => `Web Components/${item.class}` === title);
  if (!component) failures.push(`${story.file} title ${title} is not a managed web component`);
}
const overview = storySources.get("apps/storybook/src/stories/web-components.stories.tsx");
if (!overview || titleOf(overview, "apps/storybook/src/stories/web-components.stories.tsx") !== "Web Components/Foundations") {
  failures.push("Web Components/Foundations must stay the combined native review page");
}

assert.equal(failures.length, 0, failures.join("\n"));
const reactCount = [...storySources.keys()].filter(file => file.includes("/components/")).length;
console.log(`Storybook covers ${reactCount} React component stories, ThemeScope, 2 chart views, and ${catalog.components.length} web components.`);
