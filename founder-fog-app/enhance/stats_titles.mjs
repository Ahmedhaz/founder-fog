// Prints {"<dilemma id>": ["English title", "Arabic title"], ...} for the stats
// page (founder-fog/stats.html), so its "Top decisions" table can show titles
// instead of ids. Reads the dilemma packs (content/dl_*.js and their .ar.json)
// and the engine's own events (content/engine_events.json, Arabic from ar.json).
// build.py runs it: node stats_titles.mjs > titles.json
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const C = path.join(HERE, "content");
const readJson = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : {});
const clean = (t) => String(t || "").replace(/^[\p{Extended_Pictographic}\uFE0F\u200D\s]+/u, "").trim(); // drop a leading emoji

const out = {};
for (const f of fs.readdirSync(C).filter((f) => /^dl_\w+\.js$/.test(f)).sort()) {
  const code = fs.readFileSync(path.join(C, f), "utf8");
  const name = (code.match(/const (DL_\w+)\s*=/) || [])[1];
  if (!name) continue;
  const list = new Function(code + "\nreturn " + name + ";")();
  const ar = readJson(path.join(C, f.replace(/\.js$/, ".ar.json")));
  for (const d of list) if (d && d.id) out[d.id] = [clean(d.title), clean(ar[d.title] || "")];
}

// engine events and the few built in to org.js / stories.js; their Arabic is in ar.json as "<module>|<English>"
const arAll = readJson(path.join(HERE, "ar.json"));
const arByText = {};
for (const [k, v] of Object.entries(arAll)) if (v && k.includes("|")) arByText[k.slice(k.indexOf("|") + 1)] = v;
const extra = { ORG_BOARD: "📋 Board meeting" };
for (const e of readJson(path.join(C, "engine_events.json"))) {
  const en = extra[e.id] || e.title;
  if (e.id && !out[e.id]) out[e.id] = [clean(en), clean(arByText[en] || "")];
}

process.stdout.write(JSON.stringify(out));
