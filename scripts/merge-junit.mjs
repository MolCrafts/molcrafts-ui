// Merge Playwright JUnit reports into one <testsuites> document, so the
// browser suites publish as a single `tests` record (molci snapshot --junit).
import { readFile, writeFile } from "node:fs/promises";

const [out, ...inputs] = process.argv.slice(2);
if (!out || inputs.length === 0) {
  console.error("usage: node scripts/merge-junit.mjs <out.xml> <in.xml>...");
  process.exit(2);
}
const suites = [];
for (const path of inputs) {
  const xml = await readFile(path, "utf8").catch(() => null);
  if (xml === null) {
    console.warn(`merge-junit: ${path} is missing; that suite did not report`);
    continue;
  }
  suites.push(...(xml.match(/<testsuite\b[\s\S]*?<\/testsuite>/g) ?? []));
}
await writeFile(out, `<?xml version="1.0" encoding="UTF-8"?>\n<testsuites>\n${suites.join("\n")}\n</testsuites>\n`);
console.log(`merge-junit: ${suites.length} suites from ${inputs.length} reports into ${out}`);
