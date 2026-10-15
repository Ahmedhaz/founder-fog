// The daily challenge must be the same game in English and Arabic.
//   node founder-fog/tests/daily.mjs
// Uses playwright (or playwright-core). Browser: PLAYWRIGHT_BROWSERS_PATH (e.g. /opt/pw-browsers),
// or CHROME_PATH pointing at an installed Chrome/Chromium.
// Starts today's daily from the title screen in both languages, plays it to week 26 with the same
// choices (always the first door) through the game's own engine, and checks that every draw matches:
// the dilemmas met and the week they came, the doors taken, and the cash at the end. "Dilemmas met"
// counts both the library cards (dl_) and the story-chain cards (ch_): a chain card is a dilemma too,
// so a day that opens with Omar or Tariq is not a failure.
// Also: no console or page errors, and nothing but the leaderboard read leaves the device (stubbed here).
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let pw;
try { pw = require("playwright"); } catch { pw = require("playwright-core"); }
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const AR = JSON.parse(fs.readFileSync(path.join(ROOT, "founder-fog-app/enhance/ar.json"), "utf8"));
const MIN_DILEMMAS = 2; // library or chain cards met by week 26
const LAST_WEEK = 26; // the daily's deadline

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".webmanifest": "application/manifest+json", ".json": "application/json", ".woff2": "font/woff2", ".ttf": "font/ttf" };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname));
  const f = fs.existsSync(p) && fs.statSync(p).isDirectory() ? path.join(p, "index.html") : p;
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream" });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
// a port in the URL is what switches the game's window.__ffTest hook on
const BASE = `http://127.0.0.1:${server.address().port}/founder-fog/`;

const launch = process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {};
const browser = await pw.chromium.launch(launch);
const failures = [];
function check(cond, msg) { if (!cond) failures.push(msg); return cond; }
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// the labels the test clicks, looked up the way the build translates them ("<module>|<English>")
function t(lang, en) {
  if (lang === "en") return en;
  const key = Object.keys(AR).find((k) => k.endsWith("|" + en) && AR[k]);
  if (!key) throw new Error(`no Arabic for "${en}"`);
  return AR[key].replace(/▸/g, "◂"); // the build mirrors the arrows for right-to-left
}

async function playDaily(lang) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: lang === "ar" ? "ar-EG" : "en-US" });
  const page = await ctx.newPage();
  const errors = [], external = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(String(e)));
  // the daily's leaderboard is the one request allowed out; it is answered here so the test is offline
  // (analytics never run on a local address). Anything else leaving the device is a failure.
  const LEADERBOARD = /supabase\.co\/rest\/v1\/ff_daily_scores\?/;
  page.on("request", (r) => { const u = new URL(r.url()); if (u.hostname !== "127.0.0.1" && !LEADERBOARD.test(r.url())) external.push(r.url()); });
  await page.route(/supabase\.co/, (r) => r.fulfill({ status: 200, contentType: "application/json", body: "[]" }));

  await page.goto(BASE + (lang === "ar" ? "ar.html" : ""), { waitUntil: "load" });
  await page.getByText(t(lang, "Daily"), { exact: true }).first().click();
  await page.getByText(t(lang, "Play today's challenge ▸")).click();
  // "Found <company> ▸", with the suggested company name already filled in
  await page.getByText(new RegExp("^" + esc(t(lang, "Found ")) + ".*[▸◂]$")).click();
  await page.waitForFunction(() => window.__ffTest && window.__ffTest.engine() && window.__ffTest.engine().state.daily && window.__ffTest.engine().state.week === 1, null, { timeout: 15000 });

  // play through the engine: the daily seeds every engine call, whichever screen made it
  const run = await page.evaluate((LAST) => {
    const e = window.__ffTest.engine(), s = e.state, log = [];
    for (let guard = 0; guard < 200 && s.week < LAST && !s.gameOver && !s.victory; guard++) {
      for (let k = 0; s.pendingEvent && k < 5; k++) {
        log.push({ week: s.week, id: s.pendingEvent.id, title: s.pendingEvent.title });
        e.resolveEventChoice("option_A");
      }
      e.advanceWeek();
    }
    window.__ffTest.sync();
    return {
      day: s.daily.day, n: s.daily.n, sector: s.sector && s.sector.id, mode: s.mode, week: s.week,
      cash: Math.round(s.cash), mrr: Math.round(s.monthlyRevenue), over: !!s.gameOver, victory: !!s.victory,
      seen: s.story.seen, door: s.story.door, log: log,
    };
  }, LAST_WEEK);
  await page.waitForTimeout(300);
  check(errors.length === 0, `${lang}: page errors: ${errors.join(" | ")}`);
  check(external.length === 0, `${lang}: requests left the device: ${external.join(", ")}`);
  await ctx.close();
  return run;
}

const runs = {};
for (const lang of ["en", "ar"]) runs[lang] = await playDaily(lang);
await browser.close();
server.close();

const cards = (run) => Object.keys(run.seen).filter((id) => /^(dl_|ch_)/.test(id)).sort();
for (const lang of ["en", "ar"]) {
  const r = runs[lang], met = cards(r);
  console.log(`${lang}: ${r.day} · ${r.sector} · ${r.mode} · week ${r.week}${r.over ? " (over)" : ""} · cash ${r.cash} · dilemmas ${met.length}: ${met.join(" ")}`);
  check(r.week >= LAST_WEEK || r.over, `${lang}: the run stopped at week ${r.week}`);
  check(met.length >= MIN_DILEMMAS, `${lang}: only ${met.length} dilemma(s) met by week ${r.week} (library and chain cards together): ${met.join(" ") || "none"}`);
}
// the English ids are the comparison: titles differ by language, so they are only for the log
const key = (r) => JSON.stringify({ day: r.day, n: r.n, sector: r.sector, mode: r.mode, week: r.week, cash: r.cash, mrr: r.mrr, over: r.over, victory: r.victory, seen: r.seen, door: r.door, log: r.log.map((x) => [x.week, x.id]) });
check(key(runs.en) === key(runs.ar), "EN and AR dailies diverged:\n  en " + key(runs.en) + "\n  ar " + key(runs.ar));

if (failures.length) {
  console.error("FAILED\n- " + failures.join("\n- "));
  process.exit(1);
}
console.log("OK: the daily is identical in English and Arabic");
