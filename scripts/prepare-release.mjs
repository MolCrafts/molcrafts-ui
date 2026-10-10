import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { tmpdir } from "node:os";

const root = fileURLToPath(new URL("../", import.meta.url));
const plan = JSON.parse(await readFile(join(root, "release/plan.json"), "utf8"));
const out = join(root, "release-artifacts");
await mkdir(out, { recursive: true });
const temporary = await mkdtemp(join(tmpdir(), "molcrafts-pack-audit-"));
for (const directory of ["", "apps/storybook", "tests/consumer/app"]) {
  assert.equal(JSON.parse(await readFile(join(root, directory, "package.json"), "utf8")).private, true, "Workspace and applications must remain private");
}
const report = { schemaVersion: 1, mode: "local-rehearsal-only", gitCommit: execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(), workingTreeDirty: Boolean(execFileSync("git", ["status", "--porcelain"], { cwd: root, encoding: "utf8" }).trim()), firstRelease: plan.firstRelease, npmPublisherAccess: "not-verified", remaining: plan.remaining, packages: [] };
try {
  for (const item of plan.packages) {
    const dir = join(root, item.directory);
    const manifest = JSON.parse(await readFile(join(dir, "package.json"), "utf8"));
    assert.equal(manifest.name, item.name);
    assert.equal(manifest.private, true, "Preparation must not enable publishing");
    assert.equal(manifest.license, "MIT");
    assert.equal(manifest.repository.directory, item.directory);
    assert.equal(manifest.publishConfig.access, "public");
    assert.ok(!manifest.scripts?.publish && !manifest.scripts?.postpublish, "No automatic publishing scripts");
    execFileSync("pnpm", ["pack", "--pack-destination", out], { cwd: dir, stdio: "inherit" });
    const filename = `${manifest.name.slice(1).replace("/", "-")}-${manifest.version}.tgz`;
    const tarball = join(out, filename);
    const entries = execFileSync("tar", ["-tzf", tarball], { encoding: "utf8" }).trim().split("\n");
    for (const entry of entries) {
      assert.ok(entry.startsWith("package/") && !entry.split("/").includes(".."), `Unexpected archive path: ${entry}`);
      assert.ok(/^package\/(?:dist\/|package\.json$|README\.md$|CHANGELOG\.md$|LICENSE$|NOTICE\.md$|THIRD_PARTY_NOTICES\.md$)/.test(entry), `Unintended release file: ${entry}`);
    }
    const unpack = join(temporary, item.name.replace("/", "-"));
    await mkdir(unpack);
    execFileSync("tar", ["-xzf", tarball, "-C", unpack]);
    const packed = JSON.parse(await readFile(join(unpack, "package/package.json"), "utf8"));
    assert.equal(packed.name, manifest.name);
    assert.equal(packed.version, manifest.version);
    for (const name of ["LICENSE", "NOTICE.md", "THIRD_PARTY_NOTICES.md"]) {
      const text = await readFile(join(unpack, "package", name), "utf8");
      assert.ok(text.length > 100, `Missing attribution: ${name}`);
      if (name === "LICENSE") assert.equal(text, await readFile(join(root, "LICENSE"), "utf8"));
    }
    for (const field of ["dependencies", "peerDependencies", "optionalDependencies"]) {
      for (const [name, version] of Object.entries(packed[field] ?? {})) {
        assert.ok(!/^(?:workspace:|file:|link:)/.test(version), `Unresolved packed dependency ${name}`);
        if (name.startsWith("@molcrafts/")) {
          assert.ok(plan.packages.some(p => p.name === name), `Retired dependency: ${name}`);
          assert.equal(version, manifest.version, "Fixed-version internal dependencies must pack to the same exact version");
        }
      }
    }
    for (const value of Object.values(packed.exports)) {
      for (const path of typeof value === "string" ? [value] : Object.values(value)) {
        assert.ok(entries.includes(`package/${path.replace(/^\.\//, "")}`), `Missing packed export: ${path}`);
      }
    }
    const bytes = await readFile(tarball);
    report.packages.push({ name: manifest.name, version: manifest.version, file: filename, bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex"), exports: packed.exports, dependencies: packed.dependencies ?? {}, files: entries });
  }
  assert.equal(new Set(report.packages.map(pkg => pkg.version)).size, 1, "All three packages must share the release version");
  // Remove obsolete local rehearsal archives so the report identifies the complete current set.
  const current = new Set(report.packages.map(pkg => pkg.file));
  for (const name of await readdir(out)) if (name.endsWith(".tgz") && !current.has(name)) await rm(join(out, name));
  await writeFile(join(out, "report.json"), JSON.stringify(report, null, 2) + "\n");
  console.log("Audited three private package archives, exports, dependency rewriting, licenses and checksums. Report: release-artifacts/report.json");
} finally { await rm(temporary, { recursive: true, force: true }); }
