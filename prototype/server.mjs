import { createReadStream } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "src");
const brandingRoot = fileURLToPath(new URL("../assets/branding/", import.meta.url));
const types = { ".css": "text/css; charset=utf-8", ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".png": "image/png" };

createServer((request, response) => {
  const requested = request.url === "/" ? "/index.html" : request.url;
  const cleanPath = requested.split("?")[0];
  const path = cleanPath === "/branding/omni-icon.png"
    ? join(brandingRoot, "omni-icon.png")
    : normalize(join(root, cleanPath));
  if (!path.startsWith(root) && !path.startsWith(brandingRoot)) return response.writeHead(403).end("Forbidden");
  const stream = createReadStream(path);
  stream.on("open", () => {
    const extension = extname(path);
    // The launcher is static.  Caching its assets avoids avoidable flash reads
    // when it is used as the development shell on low-end hardware.
    const cacheControl = extension === ".html" ? "no-cache" : "public, max-age=86400";
    response.writeHead(200, { "Cache-Control": cacheControl, "Content-Type": types[extension] ?? "application/octet-stream" });
    stream.pipe(response);
  });
  stream.on("error", () => response.writeHead(404).end("Not found"));
}).listen(4173, "127.0.0.1", () => console.log("SO Omni: http://127.0.0.1:4173"));
