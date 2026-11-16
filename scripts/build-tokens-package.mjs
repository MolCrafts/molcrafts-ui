import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import postcss from "postcss";
import postcssImport from "postcss-import";
const pkg = new URL("../packages/tokens/", import.meta.url);
await mkdir(new URL("dist/", pkg), { recursive: true });
for (const name of ["tokens.css", "constitution-theme.css", "constitution-base.css", "fluent-theme.css", "fluent-foundation.css", "geometry.css"]) {
  await cp(new URL(`src/${name}`, pkg), new URL(`dist/${name}`, pkg));
}
const file = new URL("src/runtime.css", pkg);
const result = await postcss([postcssImport()]).process(await readFile(file, "utf8"), { from: file.pathname, to: new URL("dist/runtime.css", pkg).pathname });
await writeFile(new URL("dist/runtime.css", pkg), result.css);
await cp(new URL("src/index.d.ts", pkg), new URL("dist/index.d.ts", pkg));
await import("./build-token-contract.mjs");
console.log("Built standalone runtime tokens and optional Tailwind integration.");
