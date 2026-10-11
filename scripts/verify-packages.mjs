import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { createRequire } from "node:module";

const root = new URL("../", import.meta.url);
for (const name of ["tokens", "ui"]) {
  const pkgRoot = new URL(`packages/${name}/`, root);
  const pkg = JSON.parse(await readFile(new URL("package.json", pkgRoot), "utf8"));
  // Distributable packages are publishable; the workspace root and applications stay private.
  assert.notEqual(pkg.private, true, `${pkg.name} must be publishable`);
  for (const entry of Object.values(pkg.exports)) {
    for (const path of typeof entry === "string" ? [entry] : Object.values(entry)) await access(new URL(path, pkgRoot));
  }
}
const tokens = JSON.parse(await readFile(new URL("packages/tokens/package.json", root), "utf8"));
assert.equal(Object.keys(tokens.dependencies ?? {}).length, 0);
const runtime = await readFile(new URL("packages/tokens/dist/runtime.css", root), "utf8");
assert.ok(!/@(?:import|theme|source)\b/.test(runtime), "Runtime tokens must be standalone plain CSS");
const css = await readFile(new URL("packages/ui/dist/styles.css", root), "utf8");
assert.ok(!/@(?:import|theme|source|apply)\b/.test(css), "Component CSS must be fully compiled");
assert.ok(css.includes(".h-control"), "Control geometry must ship in compiled CSS");
assert.ok(css.includes(".bg-primary"), "Semantic color utilities must ship in compiled CSS");
assert.ok(!/--(?:accent|link)(?:[-:])/.test(runtime), "Retired color aliases must not ship");
async function checkModules(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = new URL(entry.name + (entry.isDirectory() ? "/" : ""), dir);
    if (entry.isDirectory()) { await checkModules(file); continue; }
    if (!entry.name.endsWith(".js") && !entry.name.endsWith(".d.ts")) continue;
    const source = await readFile(file, "utf8");
    assert.ok(!source.includes('"@/'), "No source alias in artifacts");
    for (const [, relative] of source.matchAll(/(?:from\s*|import\s*)["'](\.{1,2}\/[^"']+)["']/g)) {
      if (entry.name.endsWith(".js")) await access(new URL(relative, file));
    }
  }
}
await checkModules(new URL("packages/ui/dist/", root));
const require = createRequire(new URL("packages/ui/package.json", root));
const react = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const ui = await import(new URL("packages/ui/dist/index.js", root));
assert.ok(renderToStaticMarkup(react.createElement(ui.Button, null, "Package SSR")).includes("Package SSR"));
console.log("Verified package exports, plain tokens, complete CSS, module closure and React SSR.");

const scopeHTML = renderToStaticMarkup(react.createElement(ui.ThemeScope, { theme: "dark" }, react.createElement(ui.Button, null, "Scoped SSR")));
assert.ok(scopeHTML.includes('data-mol-theme="dark"') && scopeHTML.includes("Scoped SSR"));
const metadata = await import(new URL("packages/tokens/dist/index.js", root));
assert.equal(metadata.tokenContract.reference.version, "9.2.2");
assert.ok(metadata.tokenContract.tokens.some(token => token.name === "--primary"));
assert.ok(!/--([a-z-]+):var\(--\1\)/.test(css), "Runtime foundation must not contain self-referential declarations");
console.log("Verified scoped SSR and framework-independent token metadata.");
await import("./verify-storybook-coverage.mjs");
