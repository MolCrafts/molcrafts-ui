import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";

const root = new URL("../packages/web-components/", import.meta.url);
const pkg = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
const exports = Object.values(pkg.exports).flatMap(value => typeof value === "string" ? [value] : Object.values(value));
for (const file of exports) await access(new URL(file, root));
for (const name of ["index.js", "register.js", "components.js", "icons.js"]) {
  const file = new URL(`dist/${name}`, root);
  const source = await readFile(file, "utf8");
  for (const [, relative] of source.matchAll(/from\s+["'](\.\/.+?)["']/g)) await access(new URL(relative, file));
}
for (const name of ["theme.css"]) {
  const file = new URL(`dist/${name}`, root);
  const source = await readFile(file, "utf8");
  for (const [, relative] of source.matchAll(/@import\s+["'](.+?)["']/g)) await access(new URL(relative, file));
}
const manifest = JSON.parse(await readFile(new URL("dist/custom-elements.json", root), "utf8"));
const catalog = JSON.parse(await readFile(new URL("components.json", root), "utf8"));
assert.deepEqual(manifest.modules.flatMap(module => module.declarations.map(declaration => declaration.tagName)), catalog.components.map(component => component.tag));
assert.ok(!("react" in pkg.dependencies), "Native entry must not require React");
console.log("Verified package exports, relative modules, CSS imports, and Custom Elements Manifest.");
