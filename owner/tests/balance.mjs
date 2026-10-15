// Balance check: plays thousands of two-year games with the real engine, for both starts.
//   node owner/tests/balance.mjs [runs]
// Strategies:
//   sensible   fair price (premium once the team is nearly at its largest and still full), a team sized to Salah's estimate, rests when tired, chases payments when
//              a lot is owed, builds systems every third month, pays itself a modest salary when
//              there's room, takes a random option in dilemmas
//   spender    hires to the maximum, markets every month, pays itself the big salary whenever it can,
//              and picks the option that spends most
//   overwork   sensible, but never rests and never builds systems
//   nosystems  sensible, but never builds systems (the "month away" should be out of reach)
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
globalThis.OWNER = require("../content.js");
const E = require("../game.js");
const C = globalThis.OWNER;

const RUNS = Number(process.argv[2] || 300);
const PAGES = new Set(); // every playbook page any simulated game unlocked
const BIZ = Object.keys(C.businesses);
const STARTS = Object.keys(C.starts);

function focus(s, strat, b) {
  if (!E.isOpen(s)) {
    if (strat === "spender") return "presell";
    if (s.fitPushed === 0) return "fitout";
    return s.energy < 60 && strat !== "overwork" ? "rest" : "presell";
  }
  if (strat === "spender") return "market";
  if (strat !== "overwork" && s.energy < 50) return "rest";
  // a player who wants the month away builds systems every other month, otherwise every third
  if (strat === "sensible" && s.month % (s.goal === "freedom" ? 2 : 3) === 0) return "systems";
  if (s.ar > E.fixedCosts(s)) return "collect"; // more owed than a month of rent and running costs
  return s.month % 2 ? "market" : "train";
}

function staffFor(s, strat, plan, b) {
  if (strat === "spender") return b.maxStaff;
  const g = E.guess(s, plan);
  let n = s.staff;
  if (g > E.capacity(s, n, 0) * 1.08 && n < b.maxStaff) n++;
  else if (g < E.capacity(s, n - 1, 0) * 0.95 && n > b.minStaff) n--;
  return n;
}

function pickOption(s, d, strat) {
  const opts = ["A", "B", "C"].filter((k) => E.canOpen(s, d, k));
  if (strat === "spender") return opts.slice().sort((a, b) => ((d[a].fx.cash || 0) - (d[b].fx.cash || 0)))[0];
  return opts[Math.floor(E.rand(s) * opts.length)];
}

function play(biz, start, goal, seed, strat, daily) {
  const b = C.businesses[biz];
  const s = E.newGame({ name: "T", avatar: "man", biz, start, goal, seed, daily });
  E.beginMonth(s);
  let fogMonths = 0, guard = 0;
  while (s.phase !== "end" && guard++ < 60) {
    s.queue = [];
    const plan = { price: 1, focus: "" };
    plan.focus = focus(s, strat, b);
    // a careful owner raises the price when the team is full and there's no room to hire
    if (strat !== "spender" && E.isOpen(s) && s.staff >= b.maxStaff - 1 && E.guess(s, plan) > E.capacity(s, s.staff, 0) * 1.1) plan.price = 2;
    plan.staff = E.isOpen(s) ? staffFor(s, strat, plan, b) : s.staff;
    if (s.energy < E.FOG) fogMonths++;
    E.runMonth(s, plan);
    if (E.canDraw(s)) {
      if (strat === "spender") E.draw(s, s.cash >= C.draws.big.cash ? "big" : "small");
      else if (s.cash > E.monthlyFloor(s) * 2 && s.energy < 75) E.draw(s, "small");
    }
    const d = E.pickDilemma(s);
    if (d) E.choose(s, d, pickOption(s, d, strat));
    E.endMonth(s);
    if (s.phase === "finalCards") { s.queue = []; s.phase = "end"; }
  }
  const rep = E.report(s);
  s.pages.forEach((p) => PAGES.add(p));
  return { won: s.goalDone, over: s.over, cash: s.cash, profit: rep.profit, burnouts: s.burnouts, systems: s.systems, fogMonths, drawn: s.drawn, energy: rep.avgEnergy };
}

const out = [];
for (const strat of ["sensible", "spender", "overwork", "nosystems"]) {
  for (const biz of BIZ) {
    for (const start of STARTS) {
      const row = { strat, biz, start };
      let closed = 0, burnedOut = 0, anyBurn = 0, cash = 0, profit = 0, sys = 0, fog = 0, drawn = 0, en = 0;
      for (const g of C.goals.filter((x) => !x.hidden)) {
        let wins = 0;
        for (let i = 0; i < RUNS; i++) {
          const r = play(biz, start, g.id, 1000 + i, strat);
          if (r.won) wins++;
          if (g.id === "safety") {
            if (r.over === "closed") closed++;
            if (r.over === "burnout") burnedOut++;
            if (r.burnouts > 0) anyBurn++;
            cash += r.cash; profit += r.profit; sys += r.systems; fog += r.fogMonths; drawn += r.drawn; en += r.energy;
          }
        }
        row[g.id] = Math.round((wins / RUNS) * 100) + "%";
      }
      row.closed = Math.round((closed / RUNS) * 100) + "%";
      row.burnout = Math.round((burnedOut / RUNS) * 100) + "%";
      row.anyBed = Math.round((anyBurn / RUNS) * 100) + "%";
      row.cash = Math.round(cash / RUNS);
      row.profit = Math.round(profit / RUNS);
      row.systems = Math.round(sys / RUNS);
      row.fogMo = +(fog / RUNS).toFixed(1);
      row.energy = Math.round(en / RUNS);
      row.paidSelf = Math.round(drawn / RUNS);
      out.push(row);
    }
  }
}
console.table(out);

const by = (st, biz, start) => out.find((r) => r.strat === st && r.biz === biz && r.start === start);
const pct = (v) => parseInt(v, 10);
let ok = true;
for (const biz of BIZ) for (const start of STARTS) {
  const sen = by("sensible", biz, start), sp = by("spender", biz, start), ow = by("overwork", biz, start), ns = by("nosystems", biz, start);
  const tag = `${biz}/${start}`;
  const checks = [
    [`${tag}: sensible usually builds the safety cushion (${sen.safety})`, pct(sen.safety) >= 50 && pct(sen.safety) <= 85],
    [`${tag}: a second branch is hard but possible for sensible (${sen.branch})`, pct(sen.branch) >= 5 && pct(sen.branch) <= 45],
    [`${tag}: the month away is reachable for sensible (${sen.freedom})`, pct(sen.freedom) >= 25],
    [`${tag}: sensible rarely closes (${sen.closed}) or ends up in bed (${sen.anyBed})`, pct(sen.closed) <= 10 && pct(sen.anyBed) <= 15],
    [`${tag}: the spender rarely lasts (closed ${sp.closed}, sold to rest ${sp.burnout}) or reaches the cushion (${sp.safety})`, pct(sp.closed) + pct(sp.burnout) >= 60 && pct(sp.safety) <= 15],
    [`${tag}: never resting means the fog and a month in bed (fog ${ow.fogMo} months, in bed ${ow.anyBed})`, ow.fogMo >= 4 && pct(ow.anyBed) >= 40],
    [`${tag}: without systems the month away is out of reach (${ns.freedom})`, pct(ns.freedom) <= 3],
  ];
  for (const [label, pass] of checks) { console.log((pass ? "PASS " : "FAIL ") + label); ok = ok && pass; }
}

// The daily challenge: 12 months on the day's seed. A careful player should usually still be open.
const days = [];
for (let i = 0; i < RUNS; i++) days.push(E.dailyInfo(new Date((20700 + i) * 864e5).toISOString().slice(0, 10)));
const dailyRows = [];
for (const strat of ["sensible", "spender"]) {
  for (const start of STARTS) {
    const scores = [];
    let open = 0;
    for (const d of days) {
      const r = play(d.biz, start, "daily", d.seed, strat, d);
      if (!r.over) open++;
      scores.push(r.over ? 0 : Math.max(0, r.cash));
    }
    scores.sort((a, b) => a - b);
    dailyRows.push({ strat, start, stillOpen: Math.round((open / RUNS) * 100) + "%", median: scores[Math.floor(RUNS / 2)], top10: scores[Math.floor(RUNS * 0.9)] });
  }
}
console.table(dailyRows);
for (const start of STARTS) {
  const sen = dailyRows.find((r) => r.strat === "sensible" && r.start === start), sp = dailyRows.find((r) => r.strat === "spender" && r.start === start);
  const checks = [
    [`daily ${start}: sensible is usually still open after 12 months (${sen.stillOpen})`, pct(sen.stillOpen) >= 85],
    [`daily ${start}: scores spread out (median ${sen.median}, top 10% ${sen.top10})`, sen.top10 > sen.median * 1.2],
    [`daily ${start}: sensible scores more than the spender (${sen.median} vs ${sp.median})`, sen.median > sp.median],
  ];
  for (const [label, pass] of checks) { console.log((pass ? "PASS " : "FAIL ") + label); ok = ok && pass; }
}

// Every playbook page must be reachable in real play.
const missing = E.PLAYBOOK.filter((p) => !PAGES.has(p.id)).map((p) => p.id);
console.log((missing.length ? "FAIL " : "PASS ") + `every playbook page is unlocked in some game (${PAGES.size} of ${E.PLAYBOOK.length})` + (missing.length ? ": missing " + missing.join(", ") : ""));
ok = ok && !missing.length;
process.exit(ok ? 0 : 1);
