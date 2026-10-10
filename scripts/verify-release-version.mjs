import assert from "node:assert/strict";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = fileURLToPath(new URL("../", import.meta.url));
const require = createRequire(join(root, "package.json"));
const cli = join(dirname(dirname(require.resolve("@changesets/cli"))), "bin.js");
const temp = await mkdtemp(join(tmpdir(), "molcrafts-version-rehearsal-"));
const plan = JSON.parse(await readFile(join(root, "release/plan.json"), "utf8"));
const workspaceDirs = [...plan.packages.map(pkg => pkg.directory), "apps/storybook", "tests/consumer/app"];
try {
  for (const file of ["package.json", "pnpm-workspace.yaml"]) await cp(join(root, file), join(temp, file));
  await cp(join(root, ".changeset"), join(temp, ".changeset"), { recursive: true });
  for (const dir of workspaceDirs) {
    await mkdir(join(temp, dir), { recursive: true });
    await cp(join(root, dir, "package.json"), join(temp, dir, "package.json"));
  }
  // Use the installed standard CLI, but only mutate a disposable workspace copy.
  for (const args of [["pre", "enter", plan.firstRelease.channel], ["version"]]) {
    execFileSync(process.execPath, [cli, ...args], { cwd: temp, stdio: "inherit" });
  }
  const report = [];
  const output = join(root, "release-artifacts/changelogs");
  await mkdir(output, { recursive: true });
  for (const pkg of plan.packages) {
    const manifest = JSON.parse(await readFile(join(temp, pkg.directory, "package.json"), "utf8"));
    assert.equal(manifest.version, plan.firstRelease.target);
    assert.equal(manifest.private, true);
    const changelog = await readFile(join(temp, pkg.directory, "CHANGELOG.md"), "utf8");
    assert.ok(changelog.includes(plan.firstRelease.target));
    await writeFile(join(output, `${pkg.name.slice(1).replace("/", "-")}.md`), changelog);
    report.push({ name: manifest.name, target: manifest.version, dependencies: manifest.dependencies ?? {} });
  }
  for (const dir of ["apps/storybook", "tests/consumer/app"]) {
    const before = JSON.parse(await readFile(join(root, dir, "package.json"), "utf8"));
    const after = JSON.parse(await readFile(join(temp, dir, "package.json"), "utf8"));
    assert.equal(after.version, before.version, "Applications must not get release versions");
    assert.equal(after.private, true);
  }
  await writeFile(join(root, "release-artifacts/version-plan.json"), JSON.stringify({ mode: "disposable-version-rehearsal", packages: report }, null, 2) + "\n");
  console.log("Changesets produced the planned alpha versions and changelogs without changing workspace versions or creating tags.");
} finally { await rm(temp, { recursive: true, force: true }); }
