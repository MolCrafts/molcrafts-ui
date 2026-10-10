import { cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = new URL("../", import.meta.url);
const temp = await mkdtemp(join(tmpdir(), "molcrafts-consumer-"));
const run = (args, cwd) => execFileSync("pnpm", args, { cwd, stdio: "inherit" });
try {
  const packs = join(temp, "packs");
  await mkdir(packs);
  for (const name of ["tokens", "ui"]) run(["pack", "--pack-destination", packs], fileURLToPath(new URL(`packages/${name}/`, root)));
  const files = await readdir(packs);
  const tokenTar = join(packs, files.find(name => name.startsWith("molcrafts-tokens-")));
  const uiTar = join(packs, files.find(name => name.startsWith("molcrafts-ui-")));
  const fixture = new URL("tests/consumer/app/", root);
  await cp(new URL("src/", fixture), join(temp, "src"), { recursive: true });
  await cp(new URL("rsbuild.config.ts", fixture), join(temp, "rsbuild.config.ts"));
  await cp(new URL("index.html", fixture), join(temp, "index.html"));
  const manifest = JSON.parse(await readFile(new URL("package.json", fixture), "utf8"));
  manifest.dependencies["@molcrafts/ui"] = `file:${uiTar}`;
  manifest.dependencies["@molcrafts/tokens"] = `file:${tokenTar}`;
  manifest.packageManager = "pnpm@11.25.0";
  await writeFile(join(temp, "package.json"), JSON.stringify(manifest, null, 2));
  await writeFile(join(temp, "pnpm-workspace.yaml"), `packages: []\nallowBuilds:\n  esbuild: true\noverrides:\n  '@molcrafts/tokens': ${JSON.stringify(`file:${tokenTar}`)}\n`);
  run(["install", "--reporter", "append-only"], temp);
  run(["build"], temp);
  console.log("Independent Rsbuild consumer built from local tarballs without source access or Tailwind configuration.");
} finally {
  await rm(temp, { recursive: true, force: true });
}
