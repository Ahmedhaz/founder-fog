// Copies the web game (../little) into www/ for the native app.
// Leaves out tests and the service worker, and swaps the Google Font for
// the bundled copy, so the app makes no network requests at all.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const app = path.resolve(here, "..");
const src = path.resolve(app, "../little");
const out = path.join(app, "www");
const SKIP = new Set(["tests", "README.md", "sw.js", "manifest.webmanifest"]);

fs.rmSync(out, { recursive: true, force: true });
fs.cpSync(src, out, { recursive: true, filter: (p) => !SKIP.has(path.relative(src, p).split(path.sep)[0]) });
fs.mkdirSync(path.join(out, "fonts"), { recursive: true });
fs.copyFileSync(path.join(app, "fonts/BalooBhaijaan2.ttf"), path.join(out, "fonts/BalooBhaijaan2.ttf"));

const indexPath = path.join(out, "index.html");
let html = fs.readFileSync(indexPath, "utf8");
const fontLinks = /\s*<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>\s*<link href="https:\/\/fonts\.googleapis\.com\/css2[^"]*" rel="stylesheet">/;
if (!fontLinks.test(html)) throw new Error("Google Font links not found in little/index.html");
html = html.replace(fontLinks, "\n<style>@font-face { font-family: \"Baloo Bhaijaan 2\"; src: url(fonts/BalooBhaijaan2.ttf) format(\"truetype\"); font-weight: 400 800; font-display: swap; }</style>");
html = html.replace(/\s*<link rel="manifest" href="manifest.webmanifest">/, "");
if (/https?:\/\//.test(html.replace(/<!--[\s\S]*?-->/g, ""))) throw new Error("index.html still references the network");
fs.writeFileSync(indexPath, html);
console.log("www ready:", fs.readdirSync(out).join(", "));
