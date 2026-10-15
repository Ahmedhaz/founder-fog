// End-to-end: plays full two-year games in English and Arabic, for both starts, in a real browser.
//   node owner/tests/play.mjs [screenshot-dir]
// Uses playwright (or playwright-core). Browser: PLAYWRIGHT_BROWSERS_PATH (e.g. /opt/pw-browsers),
// or CHROME_PATH pointing at an installed Chrome/Chromium.
// Checks: no console errors, no horizontal scroll at 390px, no request leaves the device at all,
// the smart option is locked below 70 energy and open at 70+, echoes name their month, the "open"
// start shows the fit-out months and opening day, the fog shows below 40 energy, a player who never
// rests ends up in bed, no {placeholder} is left on screen, the game is saved, and every picture
// in img/ is precached by the service worker.
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

const failures = [];
function check(cond, msg) { if (!cond) failures.push(msg); return cond; }

// Every picture must be in the service worker's list, or the game breaks offline.
const sw = fs.readFileSync(path.join(ROOT, "owner/sw.js"), "utf8");
for (const f of fs.readdirSync(path.join(ROOT, "owner/img"))) check(sw.includes(`'./img/${f}'`), `sw.js does not precache img/${f}`);

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".webp": "image/webp", ".png": "image/png", ".webmanifest": "application/manifest+json", ".json": "application/json", ".ttf": "font/ttf" };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname));
  const f = fs.existsSync(p) && fs.statSync(p).isDirectory() ? path.join(p, "index.html") : p;
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream" });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const BASE = `http://127.0.0.1:${server.address().port}/owner/`;

const launch = process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {};
const browser = await pw.chromium.launch(launch);
const results = [];

async function play({ lang, start, seed, mode = "sensible", shots = false }) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: lang === "ar" ? "ar-EG" : "en-US" });
  const page = await ctx.newPage();
  const tag = `${lang}/${start}/${mode}`;
  const errors = [], external = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("request", (r) => { if (new URL(r.url()).hostname !== "127.0.0.1") external.push(r.url()); });

  const snap = async (name) => {
    if (!shots || !SHOTS) return;
    await page.waitForTimeout(500); // let pop-in animations finish
    await page.screenshot({ path: path.join(SHOTS, `${lang}-${name}.png`) });
  };
  const noHScroll = async (where) => {
    const w = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
    check(w.sw <= w.iw, `${tag}: horizontal scroll on ${where} (${w.sw} > ${w.iw})`);
  };
  const noPlaceholders = async (where) => {
    const t = await page.evaluate(() => document.getElementById("app").innerText);
    check(!/\{\w\}/.test(t), `${tag}: a {placeholder} is left on ${where}`);
  };
  const state = () => page.evaluate(() => JSON.parse(JSON.stringify(window.__owner.state)));

  await page.goto(`${BASE}?lang=${lang}&seed=${seed}&nosw${shots ? "" : "&fast"}`);
  await page.evaluate(() => document.fonts.ready);
  check((await page.getAttribute("html", "dir")) === (lang === "ar" ? "rtl" : "ltr"), `${tag}: wrong dir`);
  await snap("01-home"); await noHScroll("home");
  if (shots) {
    await page.click('[data-act="how"]'); await snap("02-howto"); await noHScroll("how to play"); await page.click('[data-act="home"]');
    await page.click('[data-act="about"]'); await snap("03-about"); await noHScroll("about"); await page.click('[data-act="home"]');
  }
  await page.click('[data-act="new"]');
  await page.fill("#nm", lang === "ar" ? "سما" : "Sam");
  await page.click(`[data-start="${start}"]`);
  await page.click('[data-goal="safety"]');
  await snap("04-setup"); await noHScroll("setup"); await noPlaceholders("setup");
  await page.click('[data-act="start"]');

  const seen = { doorLocked: 0, doorOpen: 0, echoes: 0, prepPlans: 0, opening: 0, sick: 0, fog: 0, dilemmas: 0, crunch: 0, forcedDoor: false, forcedFog: false };
  const shot = new Set();
  for (let step = 0; step < 1200; step++) {
    if (await page.$(".endscr")) break;
    const s = await state();
    if (s.energy < 40 && (await page.$("body.fog"))) seen.fog++;

    if (await page.$('[data-act="ok"]')) {
      const c = s.queue[0];
      if (c && c.type === "echo") {
        seen.echoes++;
        const txt = await page.textContent(".because");
        check(txt.includes(String(c.from)), `${tag}: echo card doesn't name month ${c.from}: "${txt}"`);
        check(c.from < s.month || s.phase === "finalCards", `${tag}: echo from month ${c.from} shown in month ${s.month}`);
        if (!shot.has("echo")) { shot.add("echo"); await snap("10-echo"); await noHScroll("echo"); }
      }
      if (c && c.type === "opening") { seen.opening++; check(s.month === s.openAt, `${tag}: opening card in month ${s.month}, opens ${s.openAt}`); if (!shot.has("opening")) { shot.add("opening"); await snap("06-opening"); } }
      if (c && c.type === "sick") { seen.sick++; if (!shot.has("sick")) { shot.add("sick"); await snap("11-sick"); await noHScroll("sick"); } }
      await noPlaceholders("a card");
      await page.click('[data-act="ok"]');
      continue;
    }
    if (await page.$('[data-act="open"]')) {
      if (await page.$(".plan.prep")) {
        seen.prepPlans++;
        check(s.month < s.openAt, `${tag}: fit-out plan shown in month ${s.month}, opens ${s.openAt}`);
        await page.click(`[data-focus-k="${s.fitPushed ? "presell" : "fitout"}"]`);
        if (!shot.has("prep")) { shot.add("prep"); await snap("05-prep"); await noHScroll("fit-out plan"); await noPlaceholders("fit-out plan"); }
      } else {
        let f;
        if (mode === "overwork") f = "market";
        else if (s.energy < 50) f = "rest";
        else if (s.ar > 3000) f = "collect";
        else if (s.month % 3 === 0) f = "systems";
        else f = s.month % 2 ? "market" : "train";
        await page.click(`[data-focus-k="${f}"]`);
        // grow the team once the estimate runs past what it can do
        const info = await page.evaluate(() => ({ g: window.__owner.engine.guess(window.__owner.state, { price: 1, focus: "market" }), cap: window.__owner.engine.capacity(window.__owner.state, window.__owner.state.staff, 0) }));
        if (info.g > info.cap * 1.08 && s.staff < 6) await page.click('[data-st="1"]');
        if (!shot.has("plan")) {
          shot.add("plan"); await snap("07-plan"); await noHScroll("plan"); await noPlaceholders("plan");
          if (shots) { await page.click('.mini [data-act="theme"]'); await snap("07b-plan-dark"); await page.click('.mini [data-act="theme"]'); await page.click(`[data-focus-k="${f}"]`); }
        }
        if (!seen.forcedFog) {
          // Push energy under the fog line and re-render: the numbers must blur.
          seen.forcedFog = true;
          const e0 = s.energy;
          await page.evaluate(() => { window.__owner.state.energy = 30; });
          await page.click('.mini [data-act="lang"]'); await page.click('.mini [data-act="lang"]');
          check(!!(await page.$("body.fog")), `${tag}: no fog at energy 30`);
          check(!!(await page.$(".fog-warn")), `${tag}: no fog warning at energy 30`);
          if (!shot.has("fog")) { shot.add("fog"); await snap("07c-fog"); }
          await page.evaluate((v) => { window.__owner.state.energy = v; }, e0);
          await page.click('.mini [data-act="lang"]'); await page.click('.mini [data-act="lang"]');
          check(e0 >= 40 ? !(await page.$("body.fog")) : true, `${tag}: fog stayed at energy ${e0}`);
          await page.click(`[data-focus-k="${f}"]`);
        }
      }
      await page.click('[data-act="open"]');
      if (!shot.has("work") && !(await page.$(".plan.prep"))) { shot.add("work"); await page.waitForTimeout(1500); await snap("08-month"); }
      continue;
    }
    if (await page.$('[data-act="skip"]')) { await page.click('[data-act="skip"]').catch(() => {}); continue; }
    if (await page.$(".results")) {
      if (!shot.has("results") && !s.last.prep) { shot.add("results"); await snap("09-results"); await noHScroll("results"); await noPlaceholders("results"); }
      if (await page.$("[data-draw]")) {
        if (!shot.has("draw")) { shot.add("draw"); await snap("09b-draw"); }
        await page.click(mode === "overwork" ? '[data-draw="keep"]' : s.energy < 60 ? '[data-draw="small"]' : '[data-draw="keep"]');
      } else await page.click('[data-act="next"]');
      continue;
    }
    if (await page.$("[data-opt]")) {
      seen.dilemmas++;
      const d = await page.evaluate(() => window.__owner.state.pending);
      if (d && d.startsWith("k_")) seen.crunch++;
      const door = await page.$('[data-opt="C"]');
      if (door) {
        const disabled = await door.isDisabled();
        const canOpen = await page.evaluate(() => { const o = window.__owner; return o.engine.canOpen(o.state, o.engine.findDilemma(o.state.pending), "C"); });
        check(disabled === !canOpen, `${tag}: door disabled=${disabled} at energy ${s.energy}`);
        if (s.energy < 70) check(disabled, `${tag}: door open at energy ${s.energy}`);
        disabled ? seen.doorLocked++ : seen.doorOpen++;
        if (!seen.forcedDoor) {
          // Push energy across the boundary and re-render (language toggle twice).
          seen.forcedDoor = true;
          for (const [e, wantLocked] of [[69, true], [70, false]]) {
            await page.evaluate((v) => { window.__owner.state.energy = v; }, e);
            await page.click('.mini [data-act="lang"]'); await page.click('.mini [data-act="lang"]');
            const locked = await (await page.$('[data-opt="C"]')).isDisabled();
            const cashOk = await page.evaluate(() => { const o = window.__owner, d = o.engine.findDilemma(o.state.pending); return !(d.C.fx.cash < 0 && o.state.cash + d.C.fx.cash < -6000); });
            check(locked === (wantLocked || !cashOk), `${tag}: at energy ${e} the door should be ${wantLocked ? "locked" : "open"}`);
            if (!shot.has("door" + e)) { shot.add("door" + e); await snap(e === 69 ? "12a-door-locked" : "12b-door-open"); await noHScroll("dilemma"); await noPlaceholders("dilemma"); }
          }
          await page.evaluate((v) => { window.__owner.state.energy = v; }, s.energy);
          await page.click('.mini [data-act="lang"]'); await page.click('.mini [data-act="lang"]');
        }
      } else if (!shot.has("dilemma")) { shot.add("dilemma"); await snap("12-dilemma"); await noHScroll("dilemma"); }
      const opts = await page.$$("[data-opt]:not([disabled])");
      await opts[step % opts.length].click();
      if (!shot.has("idea")) { shot.add("idea"); await snap("12c-salah-note"); await noHScroll("idea"); }
      continue;
    }
    if (await page.$('[data-act="next"]')) { await page.click('[data-act="next"]'); continue; }
    await page.waitForTimeout(100);
  }

  const done = !!(await page.$(".endscr"));
  check(done, `${tag}: did not reach the end`);
  const s = await state();
  check(s.over ? s.overMonth <= 24 : s.month === 24, `${tag}: ended in month ${s.month} (${s.over || "two years"})`);
  if (done) {
    await snap("13-end"); await noHScroll("end"); await noPlaceholders("end");
    const stars = await page.$$eval(".skill", (els) => els.map((e) => e.dataset.skill + ":" + e.dataset.stars));
    check(stars.length === 5, `${tag}: report has ${stars.length} skills`);
    if (shots) { await page.click('[data-act="stickers"]'); await snap("14-notebook"); await noHScroll("notebook"); }
  }
  if (start === "open") {
    check(seen.prepPlans >= 2, `${tag}: saw ${seen.prepPlans} fit-out months, want 2 or more`);
    check(seen.opening === 1, `${tag}: saw opening day ${seen.opening} times`);
  } else check(seen.prepPlans === 0 && seen.opening === 0, `${tag}: a takeover shouldn't show fit-out (${seen.prepPlans}) or opening day (${seen.opening})`);
  if (mode === "overwork") check(seen.sick >= 1 || s.over === "burnout", `${tag}: never resting should end in bed at least once`);
  // Saved game survives a reload.
  const saved = await page.evaluate(() => localStorage.getItem("owner.v1.game"));
  check(!!saved && saved.includes(lang === "ar" ? "سما" : "Sam"), `${tag}: game not saved to localStorage`);

  check(errors.length === 0, `${tag}: console errors: ${errors.join(" | ")}`);
  check(external.length === 0, `${tag}: requests left the device: ${external.join(", ")}`);
  const rep = await page.evaluate(() => window.__owner.engine.report(window.__owner.state));
  results.push({ run: tag, end: s.over || "24 months", goal: s.goalDone ? "reached" : "not yet", cash: rep.cash, dilemmas: seen.dilemmas, crunch: seen.crunch, echoes: seen.echoes,
                 door: `${seen.doorLocked} locked / ${seen.doorOpen} open`, sick: seen.sick, fogScreens: seen.fog, errors: errors.length });
  await ctx.close();
}

// The daily challenge must be the same year in English and Arabic: same day, same choices, same result.
// Choices here depend only on the game state (never on text), and dilemmas always take the last open option.
async function playDaily(lang, day) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: lang === "ar" ? "ar-EG" : "en-US" });
  await ctx.grantPermissions(["clipboard-read", "clipboard-write"], { origin: BASE.replace(/\/owner\/$/, "") });
  await ctx.addInitScript(() => { try { delete Navigator.prototype.share; } catch (e) { /* not there */ } });
  const page = await ctx.newPage();
  const tag = `${lang}/daily`;
  const errors = [], external = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("request", (r) => { if (new URL(r.url()).hostname !== "127.0.0.1") external.push(r.url()); });
  await page.goto(`${BASE}?lang=${lang}&day=${day}&fast&nosw`);
  await page.click('[data-act="daily"]');
  check(!(await page.$eval('[data-act="playdaily"]', (b) => b.disabled)), `${tag}: today's challenge is already marked played`);
  await page.click('[data-act="playdaily"]');
  await page.fill("#nm", lang === "ar" ? "سما" : "Sam");
  check(!(await page.$("[data-start]")), `${tag}: the daily setup shouldn't offer a choice of start`);
  await page.click('[data-act="start"]');
  for (let step = 0; step < 600; step++) {
    if (await page.$(".endscr")) break;
    const s = await page.evaluate(() => JSON.parse(JSON.stringify(window.__owner.state)));
    if (await page.$('[data-act="ok"]')) { await page.click('[data-act="ok"]'); continue; }
    if (await page.$('[data-act="open"]')) {
      if (await page.$(".plan.prep")) await page.click(`[data-focus-k="${s.fitPushed ? "presell" : "fitout"}"]`);
      else {
        const f = s.energy < 50 ? "rest" : s.ar > 3000 ? "collect" : s.month % 3 === 0 ? "systems" : s.month % 2 ? "market" : "train";
        await page.click(`[data-focus-k="${f}"]`);
        const info = await page.evaluate(() => ({ g: window.__owner.engine.guess(window.__owner.state, { price: 1, focus: "market" }), cap: window.__owner.engine.capacity(window.__owner.state, window.__owner.state.staff, 0) }));
        if (info.g > info.cap * 1.08 && s.staff < 6) await page.click('[data-st="1"]');
      }
      await page.click('[data-act="open"]');
      continue;
    }
    if (await page.$('[data-act="skip"]')) { await page.click('[data-act="skip"]').catch(() => {}); continue; }
    if (await page.$("[data-draw]")) { await page.click('[data-draw="keep"]'); continue; }
    if (await page.$("[data-opt]")) { const o = await page.$$("[data-opt]:not([disabled])"); await o[o.length - 1].click(); continue; }
    if (await page.$('[data-act="next"]')) { await page.click('[data-act="next"]'); continue; }
    await page.waitForTimeout(100);
  }
  check(!!(await page.$(".daily-end")), `${tag}: did not reach the daily's end screen`);
  const s = await page.evaluate(() => JSON.parse(JSON.stringify(window.__owner.state)));
  check(s.months === 12 && (s.over || s.month === 12), `${tag}: the daily should last 12 months, ended in month ${s.month}`);
  await noScroll(page, tag, "daily end");
  await page.click('[data-act="share"]');
  await page.waitForTimeout(300);
  const clip = await page.evaluate(() => navigator.clipboard.readText().catch(() => ""));
  check(clip.includes(day), `${tag}: the shared result doesn't name the day: "${clip}"`);
  check(await page.$eval(".copied", (e) => !e.hidden), `${tag}: no "copied" message after sharing`);
  // one try a day
  await page.click('[data-act="home2"]');
  await page.click('[data-act="daily"]');
  check(await page.$eval('[data-act="playdaily"]', (b) => b.disabled), `${tag}: today's challenge can be played twice`);
  check(errors.length === 0, `${tag}: console errors: ${errors.join(" | ")}`);
  check(external.length === 0, `${tag}: requests left the device: ${external.join(", ")}`);
  await ctx.close();
  return { cash: s.cash, month: s.month, over: s.over, used: s.used, log: s.log, profits: s.history.map((h) => h.profit), score: s.over ? 0 : Math.max(0, Math.round(s.cash)) };
}
async function noScroll(page, tag, where) {
  const w = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
  check(w.sw <= w.iw, `${tag}: horizontal scroll on ${where} (${w.sw} > ${w.iw})`);
}

const dailyRuns = [];
for (const day of ["2026-10-15", "2026-10-16"]) {
  const en = await playDaily("en", day), ar = await playDaily("ar", day);
  check(JSON.stringify(en) === JSON.stringify(ar), `daily ${day}: English and Arabic diverged\n  en ${JSON.stringify(en).slice(0, 300)}\n  ar ${JSON.stringify(ar).slice(0, 300)}`);
  dailyRuns.push({ day, en: en.score, ar: ar.score, dilemmas: en.log.length, end: en.over || "12 months" });
}
console.table(dailyRuns);

let seed = 11;
for (const lang of ["en", "ar"]) {
  await play({ lang, start: "open", seed: seed++, shots: true });
  await play({ lang, start: "takeover", seed: seed++ });
  await play({ lang, start: "takeover", seed: seed++, mode: "overwork" });
}
await browser.close();
server.close();

console.table(results);
const total = results.reduce((a, r) => ({ echoes: a.echoes + r.echoes, open: a.open + +r.door.split(" / ")[1].split(" ")[0] }), { echoes: 0, open: 0 });
check(total.echoes > 0, "no echo cards were seen in any run");
if (failures.length) { console.log("FAIL\n- " + failures.join("\n- ")); process.exit(1); }
console.log("PASS: " + results.length + " full games, no console errors, no outside requests, no horizontal scroll.");
