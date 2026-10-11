import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// The release branch has run `changeset pre enter <channel>` and `changeset version`.
// Verify that state: every distributable package at the planned version with a
// changelog entry, Changesets in pre mode on the planned channel, applications untouched.
const root = fileURLToPath(new URL("../", import.meta.url));
const read = async path => JSON.parse(await readFile(join(root, path), "utf8"));
const plan = await read("release/plan.json");
const { target, channel } = plan.firstRelease;
const pre = await read(".changeset/pre.json");
assert.equal(pre.mode, "pre", "Changesets must be in pre mode for a prerelease");
assert.equal(pre.tag, channel, `Changesets pre tag must be ${channel}`);
assert.ok(target.includes(`-${channel}.`), `${target} is not a ${channel} prerelease`);
const report = [];
const output = join(root, "release-artifacts/changelogs");
await mkdir(output, { recursive: true });
for (const pkg of plan.packages) {
  const manifest = await read(join(pkg.directory, "package.json"));
  assert.equal(manifest.name, pkg.name);
  assert.equal(manifest.version, target, `${pkg.name} is ${manifest.version}, not ${target}`);
  assert.notEqual(manifest.private, true, `${pkg.name} must be publishable`);
  const changelog = await readFile(join(root, pkg.directory, "CHANGELOG.md"), "utf8");
  assert.ok(changelog.includes(`## ${target}`), `${pkg.name} CHANGELOG has no ${target} entry`);
  await writeFile(join(output, `${pkg.name.slice(1).replace("/", "-")}.md`), changelog);
  report.push({ name: manifest.name, target: manifest.version, dependencies: manifest.dependencies ?? {} });
}
for (const dir of ["", "apps/storybook", "tests/consumer/app"]) {
  const manifest = await read(join(dir, "package.json"));
  assert.equal(manifest.private, true, `${manifest.name} must stay private`);
  if (dir) assert.equal(manifest.version, "0.0.1", "Applications must not get release versions");
}
await writeFile(join(root, "release-artifacts/version-plan.json"), JSON.stringify({ mode: "release-candidate", channel, packages: report }, null, 2) + "\n");
console.log(`Verified ${plan.packages.length} packages at ${target} on the ${channel} channel, with changelogs; applications untouched.`);
