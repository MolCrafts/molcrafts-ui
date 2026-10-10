import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const root = new URL("../", import.meta.url);
const manifest = async name => JSON.parse(await readFile(new URL(`packages/${name}/package.json`, root), "utf8"));
for (const name of ["ui", "tokens"]) {
  const pkg = await manifest(name);
  for (const field of ["dependencies", "peerDependencies", "optionalDependencies"]) {
    assert.ok(!Object.keys(pkg[field] ?? {}).some(key => /vega|molplot/.test(key)), `${name} must not load plotting engines`);
  }
}
const runtime = await manifest("vega");
assert.ok(!Object.keys(runtime.dependencies).some(key => /vega-lite|vega-embed|molplot/.test(key)));
const lite = await manifest("vega-lite");
assert.ok(lite.dependencies["@molcrafts/design-vega"]);
assert.ok(!lite.dependencies["vega"] && !lite.dependencies["vega-embed"]);
const boundary = JSON.parse(await readFile(new URL("tests/consumer/app/dist-native-vega/dependency-boundary.json", root), "utf8"));
assert.equal(boundary.compilerAbsent, true);
await import(new URL("packages/vega/dist/index.js", root));
await import(new URL("packages/vega-lite/dist/index.js", root));
console.log("Core UI excludes plotting dependencies; native Vega build excludes the compiler/editor/embed; both adapters import under Node without DOM.");
