import { readFile, writeFile } from "node:fs/promises";

// Snapshot of MolPlot's hand-edited presets. The UI package must not import MolPlot.
// Refresh only when molplot/presets/*.json changes: node scripts/check-scienceplots-preset.mjs --write
const sources = [
  ["molplot", new URL("../../molplot/presets/molplot.json", import.meta.url)],
  ["molplot-paper", new URL("../../molplot/presets/molplot-paper.json", import.meta.url)],
];
const output = new URL("../packages/vega/src/preset.generated.ts", import.meta.url);

async function loadPresets() {
  const presets = {};
  for (const [name, url] of sources) {
    const preset = JSON.parse(await readFile(url, "utf8"));
    if (preset.name !== name) throw new Error(`${url.pathname} name is ${preset.name}, expected ${name}`);
    presets[name] = preset;
  }
  return presets;
}

function render(presets) {
  return `// Generated from molplot/presets/molplot.json and molplot-paper.json
// by scripts/check-scienceplots-preset.mjs. Do not edit.
// Refresh: node scripts/check-scienceplots-preset.mjs --write

export const molplotPresets = ${JSON.stringify(presets, null, 2)} as const;
`;
}

const write = process.argv.includes("--write");
let presets;
try {
  presets = await loadPresets();
} catch (error) {
  if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
    console.log("scienceplots preset check skipped: molplot/presets is not beside this repo");
    process.exit(0);
  }
  throw error;
}
const next = render(presets);
if (write) {
  await writeFile(output, next);
  console.log(`wrote ${output.pathname}`);
} else {
  const current = await readFile(output, "utf8");
  if (current !== next) {
    console.error("scienceplots preset snapshot drifted from molplot/presets. Run: node scripts/check-scienceplots-preset.mjs --write");
    process.exit(1);
  }
  console.log("scienceplots preset snapshot matches molplot/presets");
}
