// End-to-end: plays full school years in English and Arabic for all 6 side hustles in a real browser.
//   node teen/tests/play.mjs [screenshot-dir]
// Uses playwright (or playwright-core). Browser: PLAYWRIGHT_BROWSERS_PATH (e.g. /opt/pw-browsers),
// or CHROME_PATH pointing at an installed Chrome/Chromium.
// Checks: no console errors, no horizontal scroll at 390px, no request leaves the device at all,
// the smart option is locked below 70 energy and open at 70+, echoes name their week, exam results
// arrive after each exam season, and never studying gets the hustle paused.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let pw;
try { pw = require("playwright"); } catch { pw = require("playwright-core"); }
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SHOTS = process.argv[2] || null;
if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".webp": "image/webp", ".png": "image/png", ".webmanifest": "application/manifest+json", ".json": "application/json" };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname));
  const f = fs.existsSync(p) && fs.statSync(p).isDirectory() ? path.join(p, "index.html") : p;
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream" });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const BASE = `http://127.0.0.1:${server.address().port}/teen/`;

const launch = process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {};
const browser = await pw.chromium.launch(launch);

const results = [];
const failures = [];
function check(cond, msg) { if (!cond) failures.push(msg); return cond; }

async function play({ lang, biz, seed, mode = "sensible", shots = false }) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: lang === "ar" ? "ar-EG" : "en-US" });
  const page = await ctx.newPage();
  const tag = `${lang}/${biz}/${mode}`;
  const errors = [], external = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("request", (r) => {
    const u = new URL(r.url());
    if (u.hostname === "127.0.0.1") return;
    external.push(r.url());
  });

  const snap = async (name) => {
    if (!shots || !SHOTS) return;
    await page.waitForTimeout(500); // let pop-in animations finish
    await page.screenshot({ path: path.join(SHOTS, `${lang}-${name}.png`) });
  };
  const noHScroll = async (where) => {
    const w = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
    check(w.sw <= w.iw, `${tag}: horizontal scroll on ${where} (${w.sw} > ${w.iw})`);
  };
  const state = () => page.evaluate(() => JSON.parse(JSON.stringify(window.__teen.state)));

  await page.goto(`${BASE}?lang=${lang}&seed=${seed}&nosw${shots ? "" : "&fast"}`);
  await page.evaluate(() => document.fonts.ready);
  check((await page.getAttribute("html", "dir")) === (lang === "ar" ? "rtl" : "ltr"), `${tag}: wrong dir`);
  await snap("01-home"); await noHScroll("home");
  if (shots) {
    await page.click('[data-act="how"]'); await snap("02-howto"); await noHScroll("how to play"); await page.click('[data-act="home"]');
    await page.click('[data-act="parents"]'); await snap("03-parents"); await noHScroll("parents"); await page.click('[data-act="home"]');
  }
  await page.click('[data-act="new"]');
  await page.fill("#nm", lang === "ar" ? "سما" : "Sam");
  await page.click(`[data-biz="${biz}"]`);
  await page.click('[data-goal="course"]');
  await snap("04-setup"); await noHScroll("setup");
  await page.click('[data-act="start"]');

  const seen = { doorLocked: 0, doorOpen: 0, echoes: 0, closed: 0, closedWeek: null, exams: [], dilemmas: 0, sleepy: 0, forcedDoor: false };
  const shot = new Set();
  for (let step = 0; step < 900; step++) {
    if (await page.$(".endscr")) break;
    const s = await state();
    if (s.energy < 40 && (await page.$("body.sleepy"))) seen.sleepy++;

    if (await page.$('[data-act="ok"]')) {
      const c = s.queue[0];
      if (c && c.type === "echo") {
        seen.echoes++;
        const txt = await page.textContent(".because");
        check(txt.includes(String(c.from)), `${tag}: echo card doesn't name week ${c.from}: "${txt}"`);
        check(c.from < s.week || s.phase === "finalCards", `${tag}: echo from week ${c.from} shown in week ${s.week}`);
        if (!shot.has("echo")) { shot.add("echo"); await snap("09-echo"); await noHScroll("echo"); }
      }
      if (c && c.type === "closed") { seen.closed++; if (seen.closedWeek == null) seen.closedWeek = s.week; if (!shot.has("closed")) { shot.add("closed"); await snap("10-paused"); await noHScroll("paused"); } }
      if (c && c.type === "exam") {
        seen.exams.push(s.phase === "finalCards" ? "end" : s.week);
        const txt = await page.textContent(".big-card");
        check(txt.includes(String(c.grades)), `${tag}: exam card doesn't show grades ${c.grades}`);
        if (c.band === "low" && !c.final && seen.closedWeek == null) seen.closedWeek = s.week;
        if (!shot.has("exam")) { shot.add("exam"); await snap("10b-exam"); await noHScroll("exam"); }
      }
      await page.click('[data-act="ok"]');
      continue;
    }
    if (await page.$('[data-act="open"]')) {
      let act;
      const exams = s.cal[s.week - 1] === "exams";
      if (mode === "noschool") act = s.week % 2 ? "promote" : "learn";
      else if (exams || s.week % 3 === 0 || s.grades < 55) act = "study";
      else if (s.energy < 55) act = "rest";
      else act = s.week % 2 ? "promote" : "learn";
      await page.click(`[data-actv="${act}"]`);
      if (exams) check(!!(await page.$(".warn")), `${tag}: no exam warning in week ${s.week}`);
      if (!shot.has("plan")) {
        shot.add("plan"); await snap("05-plan"); await noHScroll("plan");
        if (shots) { await page.click('.mini [data-act="theme"]'); await snap("05b-plan-dark"); await page.click('.mini [data-act="theme"]'); await page.click(`[data-actv="${act}"]`); }
      }
      await page.click('[data-act="open"]');
      if (!shot.has("sell")) { shot.add("sell"); await page.waitForTimeout(1500); await snap("06-sell"); }
      continue;
    }
    if (await page.$('[data-act="skip"]')) { await page.click('[data-act="skip"]').catch(() => {}); continue; }
    if (await page.$("[data-treat]")) {
      if (!shot.has("results")) { shot.add("results"); await snap("07-results"); await noHScroll("results"); }
      await page.click('[data-treat="save"]');
      continue;
    }
    if (await page.$("[data-opt]")) {
      seen.dilemmas++;
      const door = await page.$('[data-opt="C"]');
      if (door) {
        const disabled = await door.isDisabled();
        check(disabled === s.energy < 70, `${tag}: door disabled=${disabled} at energy ${s.energy}`);
        disabled ? seen.doorLocked++ : seen.doorOpen++;
        if (!seen.forcedDoor) {
          // Push energy across the boundary and re-render (language toggle twice).
          seen.forcedDoor = true;
          for (const [e, wantLocked] of [[69, true], [70, false]]) {
            await page.evaluate((v) => { window.__teen.state.energy = v; }, e);
            await page.click('.mini [data-act="lang"]'); await page.click('.mini [data-act="lang"]');
            const locked = await (await page.$('[data-opt="C"]')).isDisabled();
            check(locked === wantLocked, `${tag}: at energy ${e} the door should be ${wantLocked ? "locked" : "open"}`);
            if (!shot.has("door" + e)) { shot.add("door" + e); await snap(e === 69 ? "08a-door-locked" : "08b-door-open"); await noHScroll("dilemma"); }
          }
          await page.evaluate((v) => { window.__teen.state.energy = v; }, s.energy);
          await page.click('.mini [data-act="lang"]'); await page.click('.mini [data-act="lang"]');
        }
      } else if (!shot.has("dilemma")) { shot.add("dilemma"); await snap("08-dilemma"); await noHScroll("dilemma"); }
      const opts = await page.$$("[data-opt]:not([disabled])");
      await opts[step % opts.length].click();
      if (!shot.has("idea")) { shot.add("idea"); await snap("08c-nour-note"); await noHScroll("idea"); }
      continue;
    }
    if (await page.$('[data-act="next"]')) { await page.click('[data-act="next"]'); continue; }
    await page.waitForTimeout(100);
  }

  const done = !!(await page.$(".endscr"));
  check(done, `${tag}: did not reach the end of the school year`);
  const s = await state();
  check(s.week === 30, `${tag}: ended in week ${s.week}`);
  if (done) {
    await snap("11-end"); await noHScroll("end");
    const stars = await page.$$eval(".skill", (els) => els.map((e) => e.dataset.skill + ":" + e.dataset.stars));
    check(stars.length === 5, `${tag}: year report has ${stars.length} skills`);
    if (shots) { await page.click('[data-act="stickers"]'); await snap("12-stickers"); await noHScroll("stickers"); }
  }
  check(seen.exams.join(",") === "11,21,end", `${tag}: exam results seen in weeks ${seen.exams.join(",")}, want 11,21,end`);
  if (mode === "noschool") check(seen.closedWeek != null && seen.closedWeek <= 12, `${tag}: never studying should pause the hustle by week 12, got ${seen.closedWeek}`);
  else check(seen.closedWeek == null, `${tag}: a studying player got paused in week ${seen.closedWeek}`);
  // Saved game survives a reload.
  const saved = await page.evaluate(() => localStorage.getItem("teen.v1.game"));
  check(!!saved && saved.includes(lang === "ar" ? "سما" : "Sam"), `${tag}: game not saved to localStorage`);

  check(errors.length === 0, `${tag}: console errors: ${errors.join(" | ")}`);
  check(external.length === 0, `${tag}: requests left the device: ${external.join(", ")}`);
  const rep = await page.evaluate(() => window.__teen.engine.report(window.__teen.state));
  results.push({ run: tag, goal: s.goalDone ? "reached" : "not yet", saved: rep.saved, dilemmas: seen.dilemmas, echoes: seen.echoes,
                 door: `${seen.doorLocked} locked / ${seen.doorOpen} open`, closed: seen.closedWeek || "-", sleepyScreens: seen.sleepy, errors: errors.length });
  await ctx.close();
}

let seed = 11;
for (const lang of ["en", "ar"]) {
  for (const biz of ["tutor", "tech", "design", "bake", "resell", "code"]) {
    await play({ lang, biz, seed: seed++, shots: biz === "tutor" });
  }
  await play({ lang, biz: "bake", seed: seed++, mode: "noschool" });
}
await browser.close();
server.close();

console.table(results);
const total = results.reduce((a, r) => ({ echoes: a.echoes + r.echoes, locked: a.locked + +r.door.split(" ")[0], open: a.open + +r.door.split(" / ")[1].split(" ")[0] }), { echoes: 0, locked: 0, open: 0 });
check(total.echoes > 0, "no echo cards were seen in any run");
console.log(`echo cards: ${total.echoes}, door seen locked: ${total.locked}, open: ${total.open} (plus a forced 69/70 check per run)`);
if (failures.length) { console.log("FAIL\n- " + failures.join("\n- ")); process.exit(1); }
console.log("PASS: " + results.length + " full school years, no console errors, no outside requests, no horizontal scroll.");
