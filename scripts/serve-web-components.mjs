import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../packages/web-components/dist/", import.meta.url));
const fixture = new URL("../tests/web-components/fixture.html", import.meta.url);
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const relative = pathname === "/browser.js" ? "browser/browser.js" : pathname.slice(1);
    const file = path.resolve(root, relative);
    if (pathname !== "/" && !file.startsWith(root)) throw new Error("Invalid path");
    const data = await readFile(pathname === "/" ? fixture : file);
    response.writeHead(200, { "Content-Type": types[path.extname(pathname === "/" ? "index.html" : pathname)] ?? "application/octet-stream" });
    response.end(data);
  } catch {
    response.writeHead(404); response.end("Not found");
  }
}).listen(6010, "127.0.0.1");
