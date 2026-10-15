// Content check: every text has English and Arabic, the numbers match, and every reference resolves.
//   node owner/tests/content.mjs
// Checks:
//   - every { en, ar } pair has both languages, and the Arabic has exactly the numbers the English has
//   - no {placeholder} in Arabic that the English doesn't have (and the other way round)
//   - every dilemma and every one of Salah's notes points at a playbook page that exists
//   - every playbook page is unlocked by at least one dilemma or note
//   - every picture named in the content exists in img/ and is precached by sw.js
//   - every trophy has text and a check, and every check has text
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const C = require(path.join(DIR, "content.js"));
const PB = require(path.join(DIR, "playbook.js"));
const sw = fs.readFileSync(path.join(DIR, "sw.js"), "utf8");
const errors = [];
let pairs = 0;

const numbers = (t) => (t.match(/\d[\d,.]*\d|\d/g) || []).map((n) => n.replace(/[.,]$/, "")).sort().join(" ");
const holes = (t) => (t.match(/\{\w\}/g) || []).sort().join(" ");
function walk(o, where) {
  if (Array.isArray(o)) return o.forEach((x, i) => walk(x, `${where}[${i}]`));
  if (!o || typeof o !== "object") return;
  // a text pair has string (or paragraph-list) values; a start's `ar` is a number (money owed)
  if (("en" in o || "ar" in o) && typeof o.ar !== "number") {
    if (Array.isArray(o.en) || Array.isArray(o.ar)) {
      if (!Array.isArray(o.en) || !Array.isArray(o.ar) || o.en.length !== o.ar.length) errors.push(`${where}: English and Arabic paragraph counts differ`);
      else o.en.forEach((p, i) => pair(p, o.ar[i], `${where}[${i}]`));
    } else pair(o.en, o.ar, where);
  }
  for (const [k, v] of Object.entries(o)) if (k !== "en" && k !== "ar") walk(v, `${where}.${k}`);
}
function pair(en, ar, where) {
  pairs++;
  if (typeof en !== "string" || !en.trim()) errors.push(`${where}: missing English`);
  if (typeof ar !== "string" || !ar.trim()) errors.push(`${where}: missing Arabic`);
  if (typeof en !== "string" || typeof ar !== "string") return;
  if (numbers(en) !== numbers(ar)) errors.push(`${where}: numbers differ\n    en: ${numbers(en)}\n    ar: ${numbers(ar)}`);
  if (holes(en) !== holes(ar)) errors.push(`${where}: placeholders differ (${holes(en)} / ${holes(ar)})`);
}
walk(C, "content");
walk(PB, "playbook");

const pageIds = new Set(PB.map((p) => p.id));
if (pageIds.size !== PB.length) errors.push("playbook: duplicate page ids");
const used = new Set();
for (const d of C.dilemmas) {
  if (!d.page) errors.push(`dilemma ${d.id}: no playbook page`);
  else if (!pageIds.has(d.page)) errors.push(`dilemma ${d.id}: unknown page "${d.page}"`);
  else used.add(d.page);
}
for (const [id, n] of Object.entries(C.ideas)) {
  if (n.page && !pageIds.has(n.page)) errors.push(`note ${id}: unknown page "${n.page}"`);
  if (n.page) used.add(n.page);
}
for (const id of pageIds) if (!used.has(id)) errors.push(`page ${id}: nothing unlocks it`);
for (const p of PB) if (!p.source) errors.push(`page ${p.id}: no source`);

const imgs = new Set();
const grab = (o) => { if (Array.isArray(o)) o.forEach(grab); else if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) k === "img" && typeof v === "string" ? imgs.add(v) : grab(v); };
grab(C); grab(PB);
C.avatars.forEach((a) => imgs.add(a));
for (const n of imgs) {
  if (!fs.existsSync(path.join(DIR, "img", n + ".webp"))) errors.push(`picture ${n}.webp is missing from img/`);
  if (!sw.includes(`'./img/${n}.webp'`)) errors.push(`picture ${n}.webp is not precached by sw.js`);
}
if (!sw.includes("'./playbook.js'")) errors.push("sw.js does not precache playbook.js");

// every trophy has text and a check in the engine, and the other way round
globalThis.OWNER = C;
const E = require(path.join(DIR, "game.js"));
const trIds = new Set(C.trophies.map((t) => t.id));
if (trIds.size !== C.trophies.length) errors.push("trophies: duplicate ids");
for (const id of trIds) if (!E.TROPHY_CHECKS[id]) errors.push(`trophy ${id}: no check in game.js`);
for (const id of Object.keys(E.TROPHY_CHECKS)) if (!trIds.has(id)) errors.push(`trophy check ${id}: no text in content.js`);

console.log(`${pairs} English/Arabic pairs, ${C.dilemmas.length} dilemmas, ${PB.length} playbook pages, ${C.trophies.length} trophies, ${imgs.size} pictures`);
if (errors.length) { console.log("FAIL\n- " + errors.join("\n- ")); process.exit(1); }
console.log("PASS: every text has both languages with the same numbers, and every page and picture resolves.");
