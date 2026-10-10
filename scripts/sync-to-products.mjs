#!/usr/bin/env node
/**
 * Copy registry sources into sibling product apps (molexp / molvis / molhub).
 *
 * Usage (from molcrafts-ui root):
 *   node scripts/sync-to-products.mjs
 *
 * Expects sibling layout:
 *   molcrafts/
 *     molcrafts-ui/
 *     molexp/
 *     molvis/
 *     molhub/
 */

import { spawn } from "node:child_process";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const molcrafts = path.resolve(root, "..");
const srcUi = path.join(root, "src/components/ui");
const srcBlocks = path.join(root, "src/components/blocks");
const srcLib = path.join(root, "src/lib");
const srcStyles = path.join(root, "src/styles");

/** Full workbench set (molexp). */
const MOLEXP_UI = [
  "accordion",
  "alert-dialog",
  "badge",
  "button",
  "card",
  "checkbox",
  "code",
  "collapsible",
  "command",
  "context-menu",
  "dialog",
  "dropdown-menu",
  "empty-state",
  "input",
  "label",
  "number-field",
  "popover",
  "progress-spinner",
  "resizable",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "skeleton",
  "slider",
  "switch",
  "table",
  "tabs",
  "textarea",
  "tooltip",
];

/** molvis page — resizable stays page-owned (usePanelRef API). */
const MOLVIS_PAGE_UI = [
  "badge",
  "button",
  "checkbox",
  "code",
  "dialog",
  "dropdown-menu",
  "empty-state",
  "input",
  "label",
  "number-field",
  "popover",
  "scroll-area",
  "select",
  "separator",
  "slider",
  "switch",
  "tabs",
  "tooltip",
];

const PLUGIN_UI = ["button", "checkbox", "select"];

/**
 * molhub registry web — shared foundation only.
 * Product-owned: badge (BadgeTone domain vocabulary), input (search density),
 * tabs (line-default registry chrome). Everything else from the registry.
 */
const MOLHUB_UI = ["button", "code", "empty-state", "tooltip"];

async function copy(from, to) {
  await mkdir(path.dirname(to), { recursive: true });
  await copyFile(from, to);
  console.log("  →", path.relative(molcrafts, to));
}

async function write(to, content) {
  await mkdir(path.dirname(to), { recursive: true });
  await writeFile(to, content, "utf8");
  console.log("  →", path.relative(molcrafts, to));
}

/** Archetype density layers, vendored only where a product declares one. */
async function vendorDensity(productStylesDir, profile) {
  await copy(
    path.join(srcStyles, `density-${profile}.css`),
    path.join(productStylesDir, `density-${profile}.css`),
  );
}

async function vendorConstitution(productStylesDir) {
  await copy(
    path.join(srcStyles, "constitution-base.css"),
    path.join(productStylesDir, "constitution-base.css"),
  );
  await copy(
    path.join(srcStyles, "constitution-theme.css"),
    path.join(productStylesDir, "constitution-theme.css"),
  );
}

/**
 * Hand each product's copies to that product's own formatter.
 *
 * The three products do not share a Biome config — molhub is still on the 1.x
 * schema, molvis sets no line width — so one canonical formatting of the
 * registry cannot satisfy all of them. Without this the first check after every
 * sync reports import-order errors and reformats twenty files, which trains
 * people to ignore what sync did. The copy is the product's; so is its layout.
 */
function formatIn(cwd, paths) {
  return new Promise((resolve) => {
    const child = spawn("npx", ["biome", "check", "--write", ...paths], {
      cwd: path.join(molcrafts, cwd),
      stdio: "ignore",
      shell: false,
    });
    child.on("error", () => resolve(false));
    child.on("close", (code) => {
      console.log(`  formatted ${cwd}${code === 0 ? "" : ` (biome exit ${code})`}`);
      resolve(code === 0);
    });
  });
}

async function main() {
  // ── molexp (apps/web — monorepo workbench; was molexp/ui) ──
  console.log("molexp/apps/web");
  const molexpUi = path.join(molcrafts, "molexp/apps/web/src/components/ui");
  for (const name of MOLEXP_UI) {
    await copy(path.join(srcUi, `${name}.tsx`), path.join(molexpUi, `${name}.tsx`));
  }
  await copy(
    path.join(srcLib, "utils.ts"),
    path.join(molcrafts, "molexp/apps/web/src/lib/utils.ts"),
  );
  await copy(
    path.join(srcBlocks, "content-section.tsx"),
    path.join(molcrafts, "molexp/apps/web/src/components/layout/ContentSection.tsx"),
  );
  await copy(
    path.join(srcBlocks, "page-header.tsx"),
    path.join(molcrafts, "molexp/apps/web/src/components/layout/PageHeader.tsx"),
  );
  await copy(
    path.join(srcBlocks, "explorer-shell.tsx"),
    path.join(molcrafts, "molexp/apps/web/src/components/layout/ExplorerShell.tsx"),
  );
  await copy(
    path.join(srcBlocks, "workbench-operation-state.tsx"),
    path.join(
      molcrafts,
      "molexp/apps/web/src/components/workbench/WorkbenchOperationState.tsx",
    ),
  );
  await copy(
    path.join(srcBlocks, "settings-shell.tsx"),
    path.join(molcrafts, "molexp/apps/web/src/components/settings/SettingsShell.tsx"),
  );
  await copy(
    path.join(srcBlocks, "settings-section.tsx"),
    path.join(molcrafts, "molexp/apps/web/src/components/settings/SettingsSection.tsx"),
  );
  await vendorConstitution(path.join(molcrafts, "molexp/apps/web/src/styles"));

  // ── molvis page ─────────────────────────────────────────
  console.log("molvis/page");
  const pageUi = path.join(molcrafts, "molvis/page/src/components/ui");
  for (const name of MOLVIS_PAGE_UI) {
    await copy(path.join(srcUi, `${name}.tsx`), path.join(pageUi, `${name}.tsx`));
  }
  await copy(path.join(srcLib, "utils.ts"), path.join(molcrafts, "molvis/page/src/lib/utils.ts"));
  await vendorConstitution(path.join(molcrafts, "molvis/page/src/styles"));
  const section = await readFile(path.join(srcBlocks, "settings-section.tsx"), "utf8");
  await write(path.join(molcrafts, "molvis/page/src/ui/layout/SettingsSection.tsx"), section);
  // Edge rail (bottom pull-up / future L-R). molvis already has usePointerDrag.
  let edgePanel = await readFile(path.join(srcBlocks, "edge-panel.tsx"), "utf8");
  edgePanel = edgePanel.replaceAll(
    'from "@/hooks/use-pointer-drag"',
    'from "@/hooks/usePointerDrag"',
  );
  await write(
    path.join(molcrafts, "molvis/page/src/components/viewer/EdgePanel.tsx"),
    edgePanel,
  );

  // ── molvis plugin ───────────────────────────────────────
  console.log("molvis/plugin");
  const pluginUi = path.join(molcrafts, "molvis/plugin/src/ui");
  for (const name of PLUGIN_UI) {
    let text = await readFile(path.join(srcUi, `${name}.tsx`), "utf8");
    text = text.replaceAll('from "@/lib/utils"', 'from "../utils"');
    await write(path.join(pluginUi, `${name}.tsx`), text);
  }
  let utils = await readFile(path.join(srcLib, "utils.ts"), "utf8");
  utils =
    "/**\n * Constitution-aware cn — synced from molcrafts-ui.\n * Keep in sync via: molcrafts-ui `npm run sync:products`.\n */\n" +
    utils;
  await write(path.join(molcrafts, "molvis/plugin/src/utils.ts"), utils);

  // ── molhub web ──────────────────────────────────────────
  console.log("molhub/apps/web");
  const hubUi = path.join(molcrafts, "molhub/apps/web/app/src/components/ui");
  for (const name of MOLHUB_UI) {
    await copy(path.join(srcUi, `${name}.tsx`), path.join(hubUi, `${name}.tsx`));
  }
  await copy(
    path.join(srcLib, "utils.ts"),
    path.join(molcrafts, "molhub/apps/web/app/src/lib/utils.ts"),
  );
  await vendorConstitution(path.join(molcrafts, "molhub/apps/web/app/src/styles"));
  // molhub is a registry site, not an instrument: it layers the site density
  // over the constitution and declares no geometry of its own.
  await vendorDensity(path.join(molcrafts, "molhub/apps/web/app/src/styles"), "site");

  console.log("formatting each product with its own config");
  await formatIn("molexp/apps/web", ["src/components", "src/lib/utils.ts"]);
  await formatIn("molvis", [
    "page/src/components/ui",
    "page/src/lib/utils.ts",
    "page/src/ui/layout/SettingsSection.tsx",
    "page/src/components/viewer/EdgePanel.tsx",
    "plugin/src/ui",
    "plugin/src/utils.ts",
  ]);
  await formatIn("molhub/apps/web", ["app/src/components/ui", "app/src/lib/utils.ts"]);

  console.log("done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
