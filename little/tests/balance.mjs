// Balance check: plays thousands of summers with the real engine.
//   node little/tests/balance.mjs [runs]
// Strategies:
//   sensible  fair price, make about Grandpa's guess, rest when tired, study every 3rd week, no treats
//   spender   same plan, but spends every coin it won't need for next week's supplies, and picks the option that spends most
//   overwork  makes twice the guess and never rests (still studies, so the stand stays open)
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
globalThis.LITTLE = require("../content.js");
const E = require("../game.js");
const C = globalThis.LITTLE;

const RUNS = Number(process.argv[2] || 400);
const BIZ = Object.keys(C.businesses);

function activity(s, strat) {
  if (s.skipStudy >= 2) return "study";
  if (strat !== "overwork" && s.energy < 55) return "rest";
  return s.week % 2 ? "poster" : "practise";
}

function pickOption(s, d, strat) {
  const opts = ["A", "B"].concat(d.C && E.canOpen(s, d, "C") ? ["C"] : []);
  if (strat === "spender") {
    return opts.slice().sort((a, b) => ((d[a].fx.coins || 0) - (d[b].fx.coins || 0)))[0];
  }
  return opts[Math.floor(E.rand(s) * opts.length)];
}

function play(biz, goal, seed, strat) {
  const s = E.newGame({ name: "T", avatar: "girl", biz, goal, seed });
  E.beginWeek(s);
  let sleepyWeeks = 0, guard = 0;
  while (s.phase !== "end" && guard++ < 100) {
    if (s.closed) { s.queue = []; E.closeWeek(s); }
    else {
      s.queue = [];
      const plan = { price: 1, activity: activity(s, strat) };
      const g = E.guess(s, plan);
      plan.make = Math.max(0, (strat === "overwork" ? g * 2 : g) - s.stock);
      if (s.energy < E.SLEEPY) sleepyWeeks++;
      const r = E.sell(s, plan);
      if (strat === "spender" && r.profit > 0) {
        // Spend everything except what next week's supplies will cost.
        const keep = E.makeCost(s, g);
        while (s.coins - keep >= E.TREATS.small.coins) E.treat(s, s.coins - keep >= E.TREATS.big.coins ? "big" : "small");
      }
    }
    const d = E.pickDilemma(s);
    if (d) E.choose(s, d, pickOption(s, d, strat));
    E.endWeek(s);
    if (s.phase === "finalCards") { s.queue = []; s.phase = "end"; }
  }
  const rep = E.report(s);
  const sold = s.history.reduce((a, h) => a + (h.sold || 0), 0);
  return { won: s.goalDone, saved: rep.saved, sold, sleepyWeeks, avgEnergy: rep.avgEnergy };
}

const out = [];
for (const strat of ["sensible", "spender", "overwork"]) {
  for (const biz of BIZ) {
    const row = { strat, biz };
    let saved = 0, sold = 0, sleepy = 0, en = 0;
    for (const g of C.goals) {
      let wins = 0;
      for (let i = 0; i < RUNS; i++) {
        const r = play(biz, g.id, 1000 + i, strat);
        if (r.won) wins++;
        if (g.id === "gift") { saved += r.saved; sold += r.sold; sleepy += r.sleepyWeeks; en += r.avgEnergy; }
      }
      row[g.id + " " + g.coins] = Math.round((wins / RUNS) * 100) + "%";
    }
    row.saved = Math.round(saved / RUNS);
    row.sold = Math.round(sold / RUNS);
    row.sleepyWks = +(sleepy / RUNS).toFixed(1);
    row.avgEnergy = Math.round(en / RUNS);
    out.push(row);
  }
}
console.table(out);

// Pass/fail rules from the brief.
const by = (st, b) => out.find((r) => r.strat === st && r.biz === b);
const pct = (v) => parseInt(v, 10);
let ok = true;
for (const b of BIZ) {
  const sen = by("sensible", b), sp = by("spender", b), ow = by("overwork", b);
  const mid = C.goals.find((g) => g.id === "gift");
  const k = "gift " + mid.coins;
  const checks = [
    [`${b}: sensible usually reaches the mid goal (${sen[k]})`, pct(sen[k]) >= 60],
    [`${b}: spending everything never reaches it (${sp[k]})`, pct(sp[k]) === 0],
    [`${b}: overwork sells less than sensible (${ow.sold} vs ${sen.sold})`, ow.sold < sen.sold],
    [`${b}: overwork drains energy (${ow.avgEnergy} vs ${sen.avgEnergy}, sleepy weeks ${ow.sleepyWks})`, ow.avgEnergy < sen.avgEnergy - 15 && ow.sleepyWks >= 3],
  ];
  for (const [label, pass] of checks) { console.log((pass ? "PASS " : "FAIL ") + label); ok = ok && pass; }
}
process.exit(ok ? 0 : 1);
