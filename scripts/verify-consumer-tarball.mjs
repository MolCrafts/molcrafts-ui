import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
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
  for (const name of ["tokens", "ui", "web-components", "vega", "vega-lite"]) run(["pack", "--pack-destination", packs], fileURLToPath(new URL(`packages/${name}/`, root)));
  const archives = {};
  for (const directory of ["tokens", "ui", "web-components", "vega", "vega-lite"]) {
    const pkg = JSON.parse(await readFile(new URL(`packages/${directory}/package.json`, root), "utf8"));
    archives[pkg.name] = join(packs, `${pkg.name.slice(1).replace("/", "-")}-${pkg.version}.tgz`);
  }

  const fixture = new URL("tests/consumer/app/", root);
  await cp(new URL("src/", fixture), join(temp, "src"), { recursive: true });
  await cp(new URL("rsbuild.config.ts", fixture), join(temp, "rsbuild.config.ts"));
  await cp(new URL("index.html", fixture), join(temp, "index.html"));
  const manifest = JSON.parse(await readFile(new URL("package.json", fixture), "utf8"));
  for (const [name, archive] of Object.entries(archives)) manifest.dependencies[name] = `file:${archive}`;
  manifest.packageManager = "pnpm@11.25.0";
  await writeFile(join(temp, "package.json"), JSON.stringify(manifest, null, 2));
  await writeFile(join(temp, "pnpm-workspace.yaml"), `packages: []\nallowBuilds:\n  esbuild: true\noverrides:\n${Object.entries(archives).map(([name, archive]) => `  '${name}': ${JSON.stringify(`file:${archive}`)}`).join("\n")}\n`);
  run(["install", "--reporter", "append-only"], temp);
  await writeFile(join(temp, "tsconfig.json"), JSON.stringify({ compilerOptions: { target: "ES2022", lib: ["ES2022", "DOM", "DOM.Iterable"], module: "ESNext", moduleResolution: "Bundler", jsx: "react-jsx", strict: true, skipLibCheck: true, noEmit: true }, include: ["src"] }));
  run(["exec", "tsc", "--noEmit"], temp);
  run(["build"], temp);
  console.log("Independent React and native Rsbuild consumers typechecked and built from five local tarballs without source access or Tailwind configuration.");
} finally {
  await rm(temp, { recursive: true, force: true });
}
