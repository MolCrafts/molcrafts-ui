import { readFile, readdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
async function locate(name, require) {
  let entry;
  try { entry = require.resolve(`${name}/package.json`); }
  catch { entry = require.resolve(name); }
  let dir = dirname(entry);
  while (true) {
    try {
      const manifest = JSON.parse(await readFile(join(dir, "package.json"), "utf8"));
      if (manifest.name === name) return { dir, manifest };
    } catch (error) { if (error.code !== "ENOENT") throw error; }
    const next = dirname(dir);
    if (next === dir) throw new Error(`Cannot locate ${name}`);
    dir = next;
  }
}
const rootRequire = createRequire(join(root, "package.json"));
const microsoftNotice = await readFile(join(root, "packages/tokens/NOTICE.md"), "utf8");
async function notices(names, require, recursive = false) {
  const found = new Map();
  async function visit(name, require) {
    if (name.startsWith("@molcrafts/")) return;
    const { dir, manifest } = await locate(name, require);
    const key = `${manifest.name}@${manifest.version}`;
    if (found.has(key)) return;
    found.set(key, { dir, manifest });
    if (recursive) for (const dependency of Object.keys(manifest.dependencies ?? {})) {
      await visit(dependency, createRequire(join(dir, "package.json")));
    }
  }
  for (const name of names) await visit(name, require);
  const sections = ["# Third-party notices", "", "Generated from installed, lockfile-pinned dependencies by `pnpm build:notices`.", "Dependency closure is conservative: a listed package may be tree-shaken from the browser bundle.", ""];
  for (const [key, { dir, manifest }] of [...found].sort(([a], [b]) => a.localeCompare(b))) {
    sections.push(`## ${key}`, "", `Declared license: ${manifest.license ?? "UNKNOWN"}.`, "");
    if (!manifest.license) throw new Error(`Missing upstream license: ${key}`);
    const files = (await readdir(dir)).filter(file => /^(?:licen[sc]e|notice|copyrightnotice)(?:[.-]|$)/i.test(file));
    if (!files.length) {
      if (!/^@(?:fluentui|microsoft)\//.test(manifest.name) || manifest.license !== "MIT") throw new Error(`Missing upstream license text: ${key}`);
      sections.push("Microsoft MIT terms retained in this package's NOTICE.md.", "", microsoftNotice.slice(microsoftNotice.indexOf("MIT License")), "");
    } else for (const file of files.sort()) sections.push(`### ${file}`, "", await readFile(join(dir, file), "utf8"), "");
  }
  return sections.join("\n");
}
const tokens = await notices(["@fluentui/react-theme"], rootRequire);
const ui = await notices(["@fluentui/react-theme", "tailwindcss"], rootRequire);
const nativeManifest = JSON.parse(await readFile(join(root, "packages/web-components/package.json"), "utf8"));
const native = await notices(Object.keys(nativeManifest.dependencies), createRequire(join(root, "packages/web-components/package.json")), true);
const icons = await notices(["@fluentui/svg-icons", "@fluentui/react-theme"], rootRequire);
for (const [directory, text] of [["tokens", tokens], ["ui", ui], ["web-components", `${native}\n${icons}`]]) {
  await writeFile(join(root, `packages/${directory}/THIRD_PARTY_NOTICES.md`), text.replace(/\r\n/g, "\n").replace(/[ \t]+$/gm, "").trimEnd() + "\n");
}
console.log("Generated license texts for embedded tokens, CSS, icons and native runtime dependencies.");

for (const directory of ["vega", "vega-lite"]) {
  const manifest = JSON.parse(await readFile(join(root, `packages/${directory}/package.json`), "utf8"));
  const text = await notices(Object.keys(manifest.dependencies), createRequire(join(root, `packages/${directory}/package.json`)), true);
  await writeFile(join(root, `packages/${directory}/THIRD_PARTY_NOTICES.md`), text.replace(/\r\n/g, "\n").replace(/[ \t]+$/gm, "").trimEnd() + "\n");
}
