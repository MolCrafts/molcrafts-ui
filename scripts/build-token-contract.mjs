import { readFile, writeFile } from "node:fs/promises";
import postcss from "postcss";
const root = new URL("../", import.meta.url);
const pkg = new URL("packages/tokens/", root);
const reference = JSON.parse(await readFile(new URL("reference.json", pkg), "utf8"));
const css = postcss.parse(await readFile(new URL("dist/runtime.css", pkg), "utf8"));
const modes = { light: new Map(), dark: new Map() };
css.walkRules(rule => {
  // Media-query overrides describe interaction/environment, not mode defaults.
  for (let parent = rule.parent; parent; parent = parent.parent) if (parent.type === "atrule") return;
  const dark = rule.selector.includes("data-mol-theme=dark") || rule.selector.includes(".dark");
  const applicable = dark ? ["dark"] : ["light", "dark"];
  rule.walkDecls(declaration => {
    if (!declaration.prop.startsWith("--")) return;
    for (const mode of applicable) modes[mode].set(declaration.prop, declaration.value);
  });
});
function category(name) {
  if (/^--(?:font|text)-/.test(name)) return "typography";
  if (/^--spacing/.test(name)) return "spacing / sizing";
  if (/^--radius/.test(name)) return "radius";
  if (/^--(?:focus|ring|border-width)/.test(name)) return "border / focus";
  if (/^--(?:motion|ease|default-transition)/.test(name)) return "motion";
  if (/^--(?:elevation|neutral-shadow)/.test(name)) return "elevation";
  if (/^--(?:status|success|warning|info|destructive)/.test(name)) return "status";
  return "semantic colors";
}
const tokens = [...modes.light].map(([name, light]) => ({ name, category: category(name), light, dark: modes.dark.get(name) ?? light }));
const contract = { version: 1, reference: reference.reference, tokens };
await writeFile(new URL("dist/contract.json", pkg), JSON.stringify(contract, null, 2) + "\n");
await writeFile(new URL("dist/index.js", pkg), `export const tokenContract = ${JSON.stringify(contract)};\n`);
const lines = ["# Design token catalog", "", "由 `pnpm build:tokens` 从实际 runtime CSS 生成。CSS Custom Properties 是运行时真源，", "catalog 仅描述默认值，不在运行时写入主题。产品定制、状态与升级规则见 [主题契约](theming.md)。", "", `固定 Fluent 参考：${reference.reference.package} ${reference.reference.version}；MolCrafts contract v1。`, "", "| Token | Role | Light | Dark |", "| --- | --- | --- | --- |"];
for (const token of tokens) lines.push(`| \`${token.name}\` | ${token.category} | \`${token.light}\` | \`${token.dark}\` |`);
lines.push("", "媒体查询中的 reduced-motion 与 forced-colors 覆盖见纯 CSS runtime；不得用 catalog 默认值覆盖环境偏好。", "");
await writeFile(new URL("docs/token-catalog.md", root), lines.join("\n"));
console.log(`Generated ${tokens.length} owned token definitions, metadata, and documentation.`);
