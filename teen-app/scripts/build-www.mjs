// Copies the web game (../teen) into www/ for the native app.
// Leaves out tests, the service worker and the web manifest. The fonts and
// pictures are already bundled in teen/, so the app makes no network requests.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const app = path.resolve(here, "..");
const src = path.resolve(app, "../teen");
const out = path.join(app, "www");
const SKIP = new Set(["tests", "README.md", "sw.js", "manifest.webmanifest"]);

fs.rmSync(out, { recursive: true, force: true });
fs.cpSync(src, out, { recursive: true, filter: (p) => !SKIP.has(path.relative(src, p).split(path.sep)[0]) });
const indexPath = path.join(out, "index.html");
let html = fs.readFileSync(indexPath, "utf8");
html = html.replace(/\s*<link rel="manifest" href="manifest.webmanifest">/, "");
if (/https?:\/\//.test(html.replace(/<!--[\s\S]*?-->/g, ""))) throw new Error("index.html still references the network");
fs.writeFileSync(indexPath, html);
console.log("www ready:", fs.readdirSync(out).join(", "));
