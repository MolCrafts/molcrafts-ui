import assert from "node:assert/strict";
import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
assert.ok(process.argv[2], "Supply a consumer artifact destination");
const output = resolve(process.argv[2]);
const commit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
assert.equal(execFileSync("git", ["status", "--porcelain"], { cwd: root, encoding: "utf8" }).trim(), "", "Commit and validate the producer before exporting");
const report = JSON.parse(await readFile(join(root, "release-artifacts/report.json"), "utf8"));
assert.equal(report.gitCommit, commit); assert.equal(report.workingTreeDirty, false);
await mkdir(output, { recursive: true });
const names = new Set(["@molcrafts/design", "@molcrafts/design-tokens", "@molcrafts/design-vega", "@molcrafts/design-vega-lite"]);
const packages = [];
for (const pkg of report.packages.filter(pkg => names.has(pkg.name))) {
  const source = join(root, "release-artifacts", pkg.file);
  assert.equal(createHash("sha256").update(await readFile(source)).digest("hex"), pkg.sha256);
  await cp(source, join(output, pkg.file));
  packages.push({ name: pkg.name, version: pkg.version, file: pkg.file, sha256: pkg.sha256 });
}
assert.equal(packages.length, names.size);
await writeFile(join(output, "provenance.json"), JSON.stringify({ mode: "unpublished-fixed-package-artifacts", repository: "https://github.com/MolCrafts/molcrafts-ui", commit, packages }, null, 2) + "\n");
console.log(`Exported four immutable package artifacts at producer ${commit}. No publishing or downstream source mutation.`);
