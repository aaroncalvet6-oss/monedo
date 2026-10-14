// Serves the static export (out/) the way GitHub Pages does, so previews and e2e
// tests exercise the real deployment: files live under BASE_PATH, "/x" resolves to
// "x.html" or "x/index.html", unknown paths get 404.html with a 404 status, and text files
// are gzipped when the browser accepts it (Pages does the same, so Lighthouse measures the
// real transfer sizes).
// Usage: node scripts/serve-static.mjs [port]   (after `npm run build`)
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { createGzip } from "node:zlib";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

const BASE_PATH = "/monedo";
const ROOT = fileURLToPath(new URL("../out", import.meta.url));
const PORT = Number(process.argv[2] ?? process.env.PORT ?? 3100);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".webmanifest": "application/manifest+json",
};

async function isFile(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

async function resolve(urlPath) {
  const decoded = decodeURIComponent(urlPath);
  const safe = normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  const base = join(ROOT, safe);
  if (!base.startsWith(ROOT + sep) && base !== ROOT) return null;
  for (const candidate of [base, `${base}.html`, join(base, "index.html")]) {
    if (await isFile(candidate)) return candidate;
  }
  return null;
}

const COMPRESSIBLE = new Set([".html", ".js", ".css", ".json", ".txt", ".svg", ".xml"]);

function send(req, res, status, file) {
  const gzip =
    COMPRESSIBLE.has(extname(file)) && /\bgzip\b/.test(req.headers["accept-encoding"] ?? "");
  res.writeHead(status, {
    "content-type": TYPES[extname(file)] ?? "application/octet-stream",
    "cache-control": "no-cache",
    vary: "Accept-Encoding",
    ...(gzip ? { "content-encoding": "gzip" } : {}),
  });
  const stream = createReadStream(file);
  (gzip ? stream.pipe(createGzip()) : stream).pipe(res);
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? "/", "http://localhost");
  if (pathname === "/" || pathname === "") {
    res.writeHead(302, { location: `${BASE_PATH}/` }).end();
    return;
  }
  if (pathname !== BASE_PATH && !pathname.startsWith(`${BASE_PATH}/`)) {
    send(req, res, 404, join(ROOT, "404.html"));
    return;
  }
  // GitHub Pages redirects a directory without trailing slash to the slashed URL.
  const inner = pathname.slice(BASE_PATH.length) || "/";
  const file = await resolve(inner);
  if (file?.endsWith(`${sep}index.html`) && !pathname.endsWith("/")) {
    res.writeHead(301, { location: `${pathname}/` }).end();
    return;
  }
  if (file) send(req, res, 200, file);
  else send(req, res, 404, join(ROOT, "404.html"));
}).listen(PORT, () => {
  console.log(`Serving out/ at http://localhost:${PORT}${BASE_PATH}/`);
});
