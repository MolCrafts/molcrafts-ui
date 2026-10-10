import { readFile, writeFile } from "node:fs/promises";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";
const file = new URL("../packages/ui/src/styles.css", import.meta.url);
const output = new URL("../packages/ui/dist/styles.css", import.meta.url);
const result = await postcss([tailwindcss({ optimize: true })]).process(await readFile(file, "utf8"), { from: file.pathname, to: output.pathname });
await writeFile(output, result.css);
console.log("Built complete component CSS; consumers do not scan library source.");
