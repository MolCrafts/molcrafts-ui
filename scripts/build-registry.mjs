#!/usr/bin/env node
/**
 * Minimal registry builder (v0).
 *
 * Emits public/r/{name}.json for each item in registry.json plus a flattened
 * public/r/registry.json catalog. Compatible enough for local `shadcn add`
 * experiments; can be replaced by `npx shadcn@latest build` when ready.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "r");

const registry = JSON.parse(await readFile(path.join(root, "registry.json"), "utf8"));

/**
 * The constitution ships through two doors — `tokens.css` for `shadcn add`,
 * `constitution-theme.css` for `sync:products` — so the same key is written
 * twice. They diverged once already (`--spacing-statusbar`, 28px vs 22px), and
 * a product then pinned the wrong value in a test. Fail the build instead.
 */
const GEOMETRY_KEY = /^\s*(--(?:text|radius|spacing|font|ease)[a-z0-9-]*)\s*:\s*([^;]+);/;

const geometryKeys = async (file) => {
  const text = await readFile(path.join(root, "src/styles", file), "utf8");
  const keys = new Map();
  for (const line of text.split("\n")) {
    const match = GEOMETRY_KEY.exec(line);
    if (match) keys.set(match[1], match[2].trim());
  }
  return keys;
};

const tokensKeys = await geometryKeys("tokens.css");
const themeKeys = await geometryKeys("constitution-theme.css");
const divergent = [...themeKeys].filter(
  ([key, value]) => tokensKeys.has(key) && tokensKeys.get(key) !== value,
);
if (divergent.length > 0) {
  console.error(
    "constitution divergence between tokens.css and constitution-theme.css:\n" +
      divergent
        .map(([key, value]) => `  ${key}: ${tokensKeys.get(key)} (tokens) vs ${value} (theme)`)
        .join("\n"),
  );
  process.exit(1);
}

/**
 * A block that imports `@/components/ui/x` but does not declare `x` installs as
 * a file with a broken import. Caught once on `explorer-shell` → `resizable`.
 */
const UI_IMPORT = /from\s+"@\/components\/ui\/([a-z-]+)"/g;
const missingDeps = [];
for (const item of registry.items ?? []) {
  const declared = new Set(item.registryDependencies ?? []);
  for (const f of item.files ?? []) {
    if (!f.path.endsWith(".tsx")) continue;
    const text = await readFile(path.join(root, f.path), "utf8");
    for (const [, dep] of text.matchAll(UI_IMPORT)) {
      if (item.name !== dep && !declared.has(dep)) missingDeps.push(`  ${item.name} → ${dep}`);
    }
  }
}
if (missingDeps.length > 0) {
  console.error("undeclared registryDependencies:\n" + [...new Set(missingDeps)].join("\n"));
  process.exit(1);
}

await mkdir(outDir, { recursive: true });

const built = [];

for (const item of registry.items ?? []) {
  const files = [];
  for (const f of item.files ?? []) {
    const abs = path.join(root, f.path);
    const content = await readFile(abs, "utf8");
    files.push({
      path: f.path,
      type: f.type ?? item.type,
      content,
    });
  }

  const payload = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    dependencies: item.dependencies ?? [],
    registryDependencies: item.registryDependencies ?? [],
    files,
  };

  const outPath = path.join(outDir, `${item.name}.json`);
  await writeFile(outPath, JSON.stringify(payload, null, 2) + "\n", "utf8");
  built.push({ name: item.name, type: item.type, title: item.title });
  console.log("wrote", path.relative(root, outPath));
}

const catalog = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: registry.name,
  homepage: registry.homepage,
  items: built.map((b) => ({
    name: b.name,
    type: b.type,
    title: b.title,
  })),
};

await writeFile(path.join(outDir, "registry.json"), JSON.stringify(catalog, null, 2) + "\n", "utf8");
console.log("wrote public/r/registry.json (", built.length, "items )");
