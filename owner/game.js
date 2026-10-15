// صاحب المشروع · Business Owner
// Engine (pure functions, also runs in Node for balance tests) + UI.
// No network calls and no analytics. Progress is saved in localStorage on this device only.
(function (root) {
  "use strict";
  var C = root.OWNER || (typeof require === "function" ? require("./content.js") : null);
  var PLAYBOOK = root.OWNER_PLAYBOOK || (typeof require === "function" ? require("./playbook.js") : []);

  // ═══════════════════════════ Engine ═══════════════════════════
  var MONTHS = 24;              // two years, one turn a month
  var DAILY_MONTHS = 12;        // the daily challenge is one year
  var DOOR = 70;                // energy needed for the smart third option
  var FOG = 40;                 // below this, the numbers blur and tired mistakes happen
  var MAX_BURNOUTS = 2;         // the second month in bed ends the game
  var PRICE_F = [1.3, 1, 0.68]; // demand at a low, fair and premium price
  var SICK_REST = 45;           // energy back after a month in bed
  var PRESELL_ENERGY = -4;     // advance orders before opening: a month of capacity, at 90% of the fair price
  var DELAY_ODDS = 0.5;         // chance the fit-out slips if it was never pushed

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  // mulberry32: small seeded RNG kept inside the state so a game replays the same
  function rand(s) {
    var t = (s.rs = (s.rs + 0x6D2B79F5) >>> 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  function randInt(s, lo, hi) { return lo + Math.floor(rand(s) * (hi - lo + 1)); }

  function newGame(o) {
    var seed = (o.seed != null ? o.seed : Math.floor(Math.random() * 1e9)) >>> 0;
    var b = C.businesses[o.biz], st = b.start[o.start];
    var s = {
      v: 1, name: o.name, avatar: o.avatar, biz: o.biz, start: o.start, goal: o.goal,
      months: o.daily ? DAILY_MONTHS : MONTHS, daily: o.daily ? { day: o.daily.day, n: o.daily.n } : null,
      month: 1, cash: st.cash, energy: st.energy, rep: st.rep, quality: st.quality, systems: st.systems,
      staff: st.staff, ar: st.ar, loans: [], openAt: 1 + st.prep, presold: 0, fitPushed: 0, delayChecked: st.prep === 0,
      honestPlus: 0, honestMinus: 0, burnouts: 0, drawn: 0, goalDone: false, over: null,
      mods: [], echoes: [], used: [], history: [], ideasSeen: [], log: [], pages: [],
      phase: "start", queue: [], rs: seed, seed: seed,
    };
    if (st.loan) s.loans.push({ pay: st.loan.pay, left: Math.ceil(st.loan.bal / st.loan.pay) });
    // The calendar: January is busy, July and August are the summer, Ramadan comes once a year
    // and moves about 11 days earlier each year. The rest is mostly ordinary.
    var moy0 = randInt(s, 0, 11), r1 = randInt(s, 2, 11), r2 = r1 + 11;
    s.cal = [];
    for (var m = 1; m <= s.months; m++) {
      var moy = (moy0 + m - 1) % 12, r = rand(s);
      s.cal.push(m === r1 || m === r2 ? "ramadan" : moy === 0 ? "busy" : moy === 6 || moy === 7 ? "summer" : r < 0.72 ? "normal" : r < 0.86 ? "slow" : "busy");
    }
    return s;
  }

  // The daily challenge: the same business, start and luck for everyone on a given UTC day.
  // Every random number in a game comes from its seed, so the same choices give the same year
  // on every device and in both languages.
  function dailyInfo(dayStr) {
    var d = dayStr && /^\d{4}-\d{2}-\d{2}$/.test(dayStr) ? new Date(dayStr + "T00:00:00Z") : new Date();
    var n = Math.floor(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / 864e5);
    var bizIds = Object.keys(C.businesses), starts = Object.keys(C.starts);
    return { day: new Date(n * 864e5).toISOString().slice(0, 10), n: n, biz: bizIds[n % bizIds.length], start: starts[n % starts.length], seed: (n * 1009 + 7) >>> 0 };
  }
  function dailyScore(s) { return s.over ? 0 : Math.max(0, Math.round(s.cash)); }

  function biz(s) { return C.businesses[s.biz]; }
  function goalOf(s) { for (var i = 0; i < C.goals.length; i++) if (C.goals[i].id === s.goal) return C.goals[i]; return C.goals[0]; }
  function goalTarget(s) { var g = goalOf(s); return g.kind === "cash" ? biz(s).goals[g.id] : g.kind === "daily" ? s.months : g.target; }
  function isOpen(s) { return s.month >= s.openAt; }

  function modProduct(s, k) {
    var x = 1;
    s.mods.forEach(function (m) { if (m.k === k && m.start <= s.month && s.month <= m.end) x *= m.x; });
    return x;
  }
  function modSum(s, k) {
    var x = 0;
    s.mods.forEach(function (m) { if (m.k === k && m.start <= s.month && s.month <= m.end) x += m.x; });
    return x;
  }
  function addMods(s, list, start) {
    (list || []).forEach(function (m) { s.mods.push({ k: m.k, x: m.x, start: start, end: start + m.months - 1 }); });
  }

  function loanPay(s) { return s.loans.reduce(function (a, l) { return a + l.pay; }, 0); }
  function loanLeft(s) { return s.loans.reduce(function (a, l) { return a + l.pay * l.left; }, 0); }
  function capacity(s, staff, fresh) { return Math.round((staff - fresh) * biz(s).cap + fresh * biz(s).cap / 2); }
  function price(s, idx) { return Math.round(biz(s).prices[idx] * modProduct(s, "price")); }
  function fixedCosts(s) { var b = biz(s); return Math.round((b.rent + b.other) * modProduct(s, "cost")); }
  function salaries(s, staff) { return Math.round(staff * biz(s).salary * modProduct(s, "salary")); }
  // Everything that leaves every month whatever happens: rent, running costs, salaries, the loan.
  function monthlyFloor(s) { return fixedCosts(s) + (isOpen(s) ? salaries(s, s.staff) : 0) + loanPay(s); }

  // Sessions people would ask for, before the random wobble. Shown as Salah's estimate.
  function expectedDemand(s, plan) {
    if (!isOpen(s)) return 0;
    var b = biz(s), m = s.month - s.openAt;
    var gr = b.start[s.start].growth, growth = Math.min(gr[0] + gr[1] * m, gr[2]);
    var d = b.base * growth * PRICE_F[plan.price];
    d *= 0.65 + s.rep / 140;
    d *= 0.85 + s.quality / 330;
    d *= b.cal[s.cal[s.month - 1]];
    if (plan.focus === "market") d *= 1.25; else if (s.marketLast) d *= 1.08;
    if (s.energy < 20) d *= 0.85; else if (s.energy < FOG) d *= 0.93;
    d *= modProduct(s, "demand");
    return d;
  }
  function guess(s, plan) { return Math.max(0, Math.round(expectedDemand(s, plan))); }

  function addLoan(s, l) {
    if (!l) return;
    if (l.amount) s.cash += l.amount;
    if (!l.pay) return;
    var months = l.months || Math.ceil((l.amount * 1.1) / l.pay);
    s.loans.push({ pay: l.pay, left: months });
  }

  function applyFx(s, fx) {
    if (!fx) return;
    if (fx.cash) s.cash += fx.cash;
    if (fx.energy) s.energy = clamp(s.energy + fx.energy, 0, 100);
    if (fx.rep) s.rep = clamp(s.rep + fx.rep, 0, 100);
    if (fx.quality) s.quality = clamp(s.quality + fx.quality, 0, 100);
    if (fx.systems) s.systems = clamp(s.systems + fx.systems, 0, 100);
    if (fx.staff) s.staff = clamp(s.staff + fx.staff, biz(s).minStaff, biz(s).maxStaff);
    if (fx.ar) s.ar = Math.max(0, s.ar + fx.ar);
    if (fx.delay && !isOpen(s)) s.openAt += fx.delay;
    if (fx.loan) addLoan(s, fx.loan);
    if (fx.honest > 0) s.honestPlus += fx.honest;
    if (fx.honest < 0) s.honestMinus -= fx.honest;
  }

  // The playbook page each of Salah's notes or each dilemma unlocks.
  function pageOf(id) { var o = C.ideas[id] || findDilemma(id); return o && o.page ? o.page : null; }
  function findPage(id) { for (var i = 0; i < PLAYBOOK.length; i++) if (PLAYBOOK[i].id === id) return PLAYBOOK[i]; return null; }
  function seePage(s, id) { if (id && s.pages.indexOf(id) < 0) s.pages.push(id); }
  function seeIdea(s, id, out) {
    if (s.ideasSeen.indexOf(id) < 0) { s.ideasSeen.push(id); if (out) out.push(id); }
    seePage(s, pageOf(id));
  }

  // Start of a month: echoes that are due, opening day, and a month in bed if energy ran out.
  function beginMonth(s) {
    s.queue = [];
    s.sick = false;
    var due = s.echoes.filter(function (e) { return e.due <= s.month; });
    s.echoes = s.echoes.filter(function (e) { return e.due > s.month; });
    due.forEach(function (e) { s.queue.push(echoCard(s, e)); });
    if (s.month === s.openAt && s.start === "open") s.queue.push({ type: "opening" });
    if (s.energy <= 0 && isOpen(s)) {
      s.sick = true;
      s.burnouts++;
      s.queue.push({ type: "sick", eff: Math.round(sickEfficiency(s) * 100) });
    }
    s.phase = s.queue.length ? "cards" : "plan";
  }
  function sickEfficiency(s) { return clamp(0.35 + s.systems * 0.0065, 0.35, 1); }

  function findDilemma(id) { for (var i = 0; i < C.dilemmas.length; i++) if (C.dilemmas[i].id === id) return C.dilemmas[i]; return null; }

  function echoCard(s, e) {
    var d = findDilemma(e.id), ec = d[e.opt].echo;
    applyFx(s, ec.fx);
    addMods(s, ec.fx && ec.fx.mods, s.month);
    return { type: "echo", id: e.id, opt: e.opt, from: e.from };
  }

  // A month before opening: rent and running costs, one focus, and the fit-out either holds or slips.
  function prepMonth(s, plan) {
    var f = C.prepFocuses[plan.focus] || C.prepFocuses.rest;
    var fixed = fixedCosts(s), cost = f.cost, ideas = [], presold = 0, presoldCash = 0;
    s.cash -= fixed + cost;
    if (plan.focus === "fitout") s.fitPushed++;
    if (plan.focus === "presell") {
      var b = biz(s);
      presold = b.cap; presoldCash = Math.round((b.cap * b.prices[1] * 0.9) / 100) * 100;
      s.cash += presoldCash; s.presold += presold; s.energy = clamp(s.energy + PRESELL_ENERGY, 0, 100);
    }
    if (plan.focus === "train") s.quality = clamp(s.quality + 8, 0, 100);
    s.energy = clamp(s.energy + (plan.focus === "rest" ? 12 : -3), 0, 100);
    var delayed = false;
    if (s.month === s.openAt - 1 && !s.delayChecked) {
      s.delayChecked = true;
      if (s.fitPushed === 0 && rand(s) < DELAY_ODDS) { s.openAt++; delayed = true; seeIdea(s, "delay", ideas); }
    }
    var r = { month: s.month, prep: true, focus: plan.focus, fixed: fixed, focusCost: cost, presold: presold, presoldCash: presoldCash,
              delayed: delayed, openAt: s.openAt, profit: -(fixed + cost), cashChange: presoldCash - fixed - cost, ideas: ideas,
              cal: s.cal[s.month - 1], cash: s.cash, energy: s.energy, rep: s.rep, systems: s.systems };
    s.history.push(r);
    s.last = r;
    return r;
  }

  // plan = { price: 0|1|2, staff: n, focus: market|train|collect|systems|rest }
  function runMonth(s, plan) {
    if (!isOpen(s)) return prepMonth(s, plan);
    var b = biz(s), sick = !!s.sick;
    if (sick) plan = { price: s.lastPlan ? s.lastPlan.price : 1, staff: s.staff, focus: "none" };
    var staff = clamp(Math.round(plan.staff), b.minStaff, b.maxStaff);
    var hires = Math.max(0, staff - s.staff), fires = Math.max(0, s.staff - staff);
    s.staff = staff;
    var f = C.focuses[plan.focus] || { cost: 0 };
    var cal = s.cal[s.month - 1];
    var fogged = s.energy < FOG;
    var cap = capacity(s, staff, hires);
    var exp = expectedDemand(s, plan);
    var asked = Math.max(0, Math.round(exp * (0.9 + rand(s) * 0.2)));
    var presoldUsed = Math.min(s.presold, Math.round(cap * 0.25));
    s.presold -= presoldUsed;
    var wanted = asked + presoldUsed;
    var done = Math.min(wanted, cap);
    if (sick) done = Math.round(done * sickEfficiency(s));
    var paid = Math.max(0, done - presoldUsed);
    var turned = Math.max(0, wanted - cap);
    var idle = Math.max(0, cap - done);
    var p = price(s, plan.price);
    var revenue = Math.round(paid * p);
    var mistake = 0;
    if (fogged && revenue > 0 && rand(s) < 0.8) mistake = Math.round(revenue * (0.04 + rand(s) * 0.04));
    // returns and refunds (a shop that delivers): a share of what was sold comes back
    var refunds = Math.round(revenue * (b.returns || 0) * modProduct(s, "returns"));

    // money owed: part of every month's revenue is paid later, and old debts come in or go bad
    var arShare = clamp((b.arBase != null ? b.arBase : 0.08) + modSum(s, "ar"), 0, 0.6);
    var newlyOwed = Math.round((revenue - mistake - refunds) * arShare);
    var collectAll = plan.focus === "collect";
    var collected = Math.round(s.ar * (collectAll ? 1 : 0.5));
    var badDebt = collectAll ? 0 : Math.round((s.ar - collected) * 0.06);
    s.ar = s.ar - collected - badDebt + newlyOwed;

    var sal = salaries(s, staff);
    var fixed = fixedCosts(s);
    // supplies follow the work; a kitchen also buys for the tables it expects, and throws away the rest
    var wasted = Math.round(idle * (b.spoil || 0) * b.supply * modProduct(s, "cost"));
    var supplies = Math.round(done * b.supply * modProduct(s, "cost")) + wasted;
    var hiring = hires * b.hireFee + fires * b.salary;
    var pay = loanPay(s);
    s.loans.forEach(function (l) { l.left--; });
    s.loans = s.loans.filter(function (l) { return l.left > 0; });

    var profit = revenue - mistake - refunds - badDebt - sal - fixed - supplies - f.cost - hiring;
    var cashChange = revenue - mistake - refunds - newlyOwed + collected - sal - fixed - supplies - f.cost - hiring - pay;
    s.cash += cashChange;

    // Reputation: price, quality, turned-away patients, a worn-out owner, a rushed team.
    var dr = [2, 1, -1][plan.price];
    if (s.quality >= 70) dr += 2; else if (s.quality < 30) dr -= 1;
    if (turned >= Math.max(10, wanted * 0.1)) dr -= 2;
    if (fogged) dr -= 2;
    if (cap && done / cap > 0.97) dr -= 1;
    s.rep = clamp(s.rep + dr, 0, 100);
    // Quality fades a little each month; training lifts it; new people dilute it.
    var dq = -1 - hires * 3;
    if (plan.focus === "train") dq += Math.round(10 * (1 - s.quality / 130));
    s.quality = clamp(s.quality + dq, 0, 100);
    // Systems fade unless someone looks after them.
    var ds = s.systems > 0 && s.month % 2 === 0 ? -1 : 0;
    if (plan.focus === "systems") ds += Math.round(16 * (1 - s.systems / 140));
    s.systems = clamp(s.systems + ds, 0, 100);
    // Energy: the work drains it (a bigger, fuller clinic drains more), systems shield you, rest restores.
    var util = cap ? done / cap : 0;
    var drain = (4 + 2.5 * staff + 5 * util) * (1 - s.systems / 130) * modProduct(s, "energyUse");
    var act = { rest: 18, market: -3, collect: -2, train: -2, systems: -3 }[plan.focus] || 0;
    if (sick) s.energy = SICK_REST;
    else s.energy = clamp(Math.round(s.energy + 10 - drain + act - 2 * (hires + fires)), 0, 100);
    s.marketLast = plan.focus === "market";
    s.lastPlan = { price: plan.price, staff: staff, focus: plan.focus };

    var ideas = [];
    if (s.history.filter(function (h) { return !h.prep; }).length === 0 || (profit > 0 && cashChange < profit - 500)) seeIdea(s, "profit", ideas);
    if (s.ar >= 3000) seeIdea(s, "owed", ideas);
    if (turned >= 15) seeIdea(s, "full", ideas);
    if (cap && idle >= cap * 0.3) seeIdea(s, "idle", ideas);
    if (mistake) seeIdea(s, "tired", ideas);
    if (fogged) seeIdea(s, "fog", ideas);
    if (pay > 0) seeIdea(s, "loan", ideas);
    if (hires > 0) seeIdea(s, "hire", ideas);
    if (s.systems >= 50) seeIdea(s, "systems", ideas);
    if (s.systems >= 70) seeIdea(s, "away", ideas);
    if (plan.price === 2 && profit > 0) seeIdea(s, "premium", ideas);
    if (cal === "ramadan") seeIdea(s, "ramadan", ideas);
    if (s.rep >= 70) seeIdea(s, "reputation", ideas);

    var r = { month: s.month, sick: sick, price: p, priceIdx: plan.price, focus: plan.focus, staff: staff, hires: hires, fires: fires,
              cap: cap, asked: asked, wanted: wanted, done: done, turned: turned, idle: idle, presoldUsed: presoldUsed,
              revenue: revenue, mistake: mistake, refunds: refunds, wasted: wasted, badDebt: badDebt, salaries: sal, fixed: fixed, supplies: supplies, focusCost: f.cost,
              hiring: hiring, profit: profit, newlyOwed: newlyOwed, collected: collected, loanPay: pay, cashChange: cashChange,
              fogged: fogged, ideas: ideas, cal: cal, cash: s.cash, energy: s.energy, rep: s.rep, systems: s.systems, quality: s.quality };
    s.history.push(r);
    s.last = r;
    return r;
  }

  // kind: "small" | "big" | null (keep it in the business)
  function draw(s, kind) {
    var d = C.draws[kind];
    if (d && s.cash >= d.cash) {
      s.cash -= d.cash;
      s.drawn += d.cash;
      s.energy = clamp(s.energy + d.energy, 0, 100);
      seeIdea(s, "draw");
      return true;
    }
    return false;
  }
  function canDraw(s) { var r = s.last; return !!(r && !r.prep && !r.sick && r.profit > 0 && s.cash >= C.draws.small.cash); }

  function eligible(s, d) {
    if (d.biz !== "all" && d.biz !== s.biz) return false;
    var w = d.when || {};
    if (w.crunch) return s.cash < 0 && (d.id !== "k_family" || s.used.indexOf(d.id) < 0);
    if (s.used.indexOf(d.id) >= 0) return false;
    if (w.prep && isOpen(s)) return false;
    if (w.open && !isOpen(s)) return false;
    if (w.start && w.start !== s.start) return false;
    if (w.minMonth && s.month < w.minMonth) return false;
    if (w.minCash && s.cash < w.minCash) return false;
    if (w.minStaff && s.staff < w.minStaff) return false;
    if (w.nextSeason && !(s.month < s.months && s.cal[s.month] === w.nextSeason)) return false;
    return true;
  }

  // A month in the red always brings a way out (or a way down). Before opening there is
  // always something to deal with. After that, most months bring a dilemma.
  function pickDilemma(s) {
    var pool = C.dilemmas.filter(function (d) { return eligible(s, d); });
    var crunch = pool.filter(function (d) { return d.when && d.when.crunch; });
    if (crunch.length) return crunch[randInt(s, 0, crunch.length - 1)];
    if (s.sick) return null;
    if (!isOpen(s) || (s.last && s.last.prep)) {
      var prep = pool.filter(function (d) { return d.when && d.when.prep; });
      return prep.length ? prep[randInt(s, 0, prep.length - 1)] : null;
    }
    if (s.month - s.openAt < 1 || rand(s) > 0.72) return null;
    pool = pool.filter(function (d) { return !(d.when && (d.when.prep || d.when.crunch)); });
    if (!pool.length) return null;
    var total = 0;
    var w = pool.map(function (d) { var x = d.biz === "all" ? 1 : 1.5; total += x; return x; });
    var r = rand(s) * total;
    for (var i = 0; i < pool.length; i++) { r -= w[i]; if (r <= 0) return pool[i]; }
    return pool[pool.length - 1];
  }

  // A choice that spends more than the bank would cover is closed. The third door also needs energy.
  function affordable(s, o) { return !(o && o.fx && o.fx.cash < 0 && s.cash + o.fx.cash < -biz(s).overdraft); }
  function canOpen(s, d, opt) {
    if (opt === "C" && !(d.C && s.energy >= (d.C.needs || DOOR))) return false;
    return !!d[opt] && affordable(s, d[opt]);
  }

  function choose(s, d, opt) {
    if (!canOpen(s, d, opt)) return null;
    var o = d[opt];
    if (s.used.indexOf(d.id) < 0) s.used.push(d.id);
    if (d.when && d.when.crunch) s.crunchMonth = s.month;
    applyFx(s, o.fx);
    addMods(s, o.fx && o.fx.mods, s.month + 1);
    if (o.echo) s.echoes.push({ id: d.id, opt: opt, from: s.month, due: s.month + randInt(s, o.echo.after[0], o.echo.after[1]) });
    var fresh = [];
    seeIdea(s, d.id, fresh);
    seePage(s, d.page);
    s.log.push({ month: s.month, id: d.id, opt: opt });
    return { option: o, fresh: fresh.length > 0 };
  }

  function lastProfits(s, n) { return s.history.filter(function (h) { return !h.prep; }).slice(-n); }
  function freedomReached(s) {
    var last = lastProfits(s, 3);
    return s.systems >= goalOf(s).target && last.length === 3 && last.every(function (h) { return h.profit >= 0; });
  }

  // After the month: goal check, closing or burnout, then the next month or the end.
  function endMonth(s) {
    var g = goalOf(s), b = biz(s), hit = false;
    if (!s.goalDone && g.kind === "cash" && isOpen(s) && s.cash >= b.goals[g.id]) { s.goalDone = true; s.goalMonth = s.month; hit = true; }
    if (s.cash < -b.overdraft && (s.crunchMonth === s.month || s.cash < -2 * b.overdraft)) s.over = "closed";
    else if (s.burnouts >= MAX_BURNOUTS) s.over = "burnout";
    if (s.over || s.month >= s.months) {
      s.overMonth = s.month;
      s.queue = s.over ? [] : s.echoes.map(function (e) { return echoCard(s, e); });
      s.echoes = [];
      if (!s.over && !s.goalDone && g.kind === "freedom" && freedomReached(s)) { s.goalDone = true; s.goalMonth = s.month; hit = true; }
      if (!s.over && g.kind === "daily") { s.goalDone = true; s.goalMonth = s.month; }
      if (!s.over && !s.goalDone && g.kind === "cash" && s.cash >= b.goals[g.id]) { s.goalDone = true; s.goalMonth = s.month; hit = true; }
      s.phase = "finalCards";
    } else {
      s.month++;
      beginMonth(s);
    }
    return hit;
  }

  // Trophies, checked against the game and what this device remembers across games
  // (m: { pages: collected playbook pages, biz: businesses started, starts: ways started }).
  function opened(s) { return s.history.filter(function (h) { return !h.prep; }); }
  function finished(s) { return (s.phase === "finalCards" || s.phase === "end") && !s.over && s.month >= s.months; }
  var TROPHY_CHECKS = {
    month1: function (s) { return opened(s).length >= 1; },
    opened: function (s) { return s.start === "open" && opened(s).length >= 1; },
    profit: function (s) { return opened(s).some(function (h) { return h.profit > 0; }); },
    cash_up: function (s) { return opened(s).some(function (h) { return h.profit >= 2000 && h.cashChange >= 2000; }); },
    collected: function (s) { return opened(s).some(function (h) { return h.collected >= 5000; }); },
    paid_self: function (s) { return s.drawn > 0; },
    full_house: function (s) { return opened(s).some(function (h) { return !h.sick && h.cap && h.done / h.cap >= 0.95 && h.turned <= h.wanted * 0.03; }); },
    team5: function (s) { return s.staff >= 5; },
    systems70: function (s) { return s.systems >= 70; },
    rest5: function (s) { return s.history.filter(function (h) { return h.focus === "rest"; }).length >= 5; },
    clear: function (s) { return finished(s) && s.months === MONTHS && s.history.every(function (h) { return h.energy >= FOG; }); },
    debt_free: function (s) { return s.loans.length === 0 && opened(s).length >= 1; },
    cushion: function (s) { return isOpen(s) && s.cash >= biz(s).goals.safety; },
    branch: function (s) { return isOpen(s) && s.cash >= biz(s).goals.branch; },
    away: function (s) { return finished(s) && s.months === MONTHS && freedomReached(s); },
    two_years: function (s) { return finished(s) && s.months === MONTHS; },
    honest: function (s) { return (finished(s) || !!s.over) && s.honestPlus >= 3 && s.honestMinus === 0; },
    crunch: function (s) { return finished(s) && s.months === MONTHS && s.crunchMonth != null; },
    closed: function (s) { return s.over === "closed"; },
    burnout: function (s) { return s.over === "burnout"; },
    daily: function (s) { return !!s.daily && (finished(s) || !!s.over); },
    pages10: function (s, m) { return !!m && m.pages >= 10; },
    every_biz: function (s, m) { return !!m && Object.keys(C.businesses).every(function (k) { return m.biz && m.biz[k]; }); },
    both_starts: function (s, m) { return !!m && !!(m.starts && m.starts.open && m.starts.takeover); },
  };
  function trophiesFor(s, m) {
    return C.trophies.filter(function (tr) { var f = TROPHY_CHECKS[tr.id]; try { return f && f(s, m); } catch (e) { return false; } }).map(function (tr) { return tr.id; });
  }

  function stars(v, a, b) { return v >= b ? 3 : v >= a ? 2 : 1; }

  function report(s) {
    var open = s.history.filter(function (h) { return !h.prep; });
    var profit = 0, en = 0, rp = 0;
    open.forEach(function (h) { profit += h.profit; });
    s.history.forEach(function (h) { en += h.energy; rp += h.rep; });
    var n = Math.max(1, s.history.length);
    var avgE = en / n, avgR = rp / n;
    var money = s.over === "closed" ? 1 : 1 + (profit > 0 ? 1 : 0) + (s.cash >= biz(s).goals.safety ? 1 : 0);
    var customers = stars(avgR, 50, 65);
    var freedom = stars(s.systems, 40, 70);
    var balance = 1 + (avgE >= 50 ? 1 : 0) + (s.burnouts === 0 && s.drawn > 0 ? 1 : 0);
    var honesty = s.honestMinus === 0 && s.honestPlus > 0 ? 3 : s.honestPlus >= s.honestMinus ? 2 : 1;
    return { money: money, customers: customers, freedom: freedom, balance: balance, honesty: honesty, profit: profit, cash: s.cash,
             drawn: s.drawn, avgEnergy: Math.round(avgE), avgRep: Math.round(avgR), systems: s.systems, burnouts: s.burnouts };
  }

  var Engine = { TROPHY_CHECKS: TROPHY_CHECKS, trophiesFor: trophiesFor, PLAYBOOK: PLAYBOOK, pageOf: pageOf, findPage: findPage, MONTHS: MONTHS, DAILY_MONTHS: DAILY_MONTHS, dailyInfo: dailyInfo, dailyScore: dailyScore, DOOR: DOOR, FOG: FOG, MAX_BURNOUTS: MAX_BURNOUTS, newGame: newGame, beginMonth: beginMonth, runMonth: runMonth,
    draw: draw, canDraw: canDraw, pickDilemma: pickDilemma, choose: choose, canOpen: canOpen, endMonth: endMonth, report: report,
    guess: guess, capacity: capacity, price: price, salaries: salaries, fixedCosts: fixedCosts, monthlyFloor: monthlyFloor, loanPay: loanPay,
    loanLeft: loanLeft, isOpen: isOpen, goalOf: goalOf, goalTarget: goalTarget, freedomReached: freedomReached, findDilemma: findDilemma, rand: rand };
  root.OwnerEngine = Engine;
  if (typeof module !== "undefined") module.exports = Engine;
  if (typeof document === "undefined") return;

  // ═══════════════════════════ UI ═══════════════════════════
  var KEY_GAME = "owner.v1.game", KEY_META = "owner.v1.meta";
  var MENTOR = "old_man";
  var params = new URLSearchParams(location.search);
  var FAST = params.has("fast");

  function load(k) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
  function store(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode: play on without saving */ } }
  function drop(k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } }

  var meta = load(KEY_META) || {};
  if (!meta.lang) meta.lang = /^ar\b/i.test(navigator.language || "") ? "ar" : "en";
  if (params.get("lang") === "ar" || params.get("lang") === "en") meta.lang = params.get("lang");
  if (!meta.theme) meta.theme = "light";
  meta.stickers = meta.stickers || [];
  meta.games = meta.games || 0;
  meta.daily = meta.daily || {};
  meta.pages = meta.pages || [];
  meta.trophies = meta.trophies || {};
  meta.biz = meta.biz || {};
  meta.starts = meta.starts || {};
  function trophyCount() { return C.trophies.filter(function (tr) { return meta.trophies[tr.id]; }).length; }
  // Award whatever this moment earned, remember it for this game, and show a short toast.
  function checkTrophies() {
    if (!S) return [];
    var got = Engine.trophiesFor(S, { pages: meta.pages.length, biz: meta.biz, starts: meta.starts }).filter(function (id) { return !meta.trophies[id]; });
    if (!got.length) return got;
    got.forEach(function (id) { meta.trophies[id] = Date.now(); (S.trophiesNew = S.trophiesNew || []).push(id); });
    saveAll();
    var first = C.trophies.filter(function (tr) { return tr.id === got[0]; })[0];
    toast(first.img, got.length === 1 ? T("trophyOne", { a: L(first.name) }) : T("trophyMany", { a: got.length }));
    return got;
  }
  var toastTimer = null;
  function toast(image, text) {
    var old = document.querySelector(".toast");
    if (old) old.remove();
    var el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    el.innerHTML = img(image, "tiny") + "<span>" + H(text) + "</span>";
    document.body.appendChild(el);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.remove(); }, FAST ? 1200 : 2800);
  }
  function today() { return Engine.dailyInfo(params.get("day")); }

  var S = load(KEY_GAME);
  if (S && S.v !== 1) S = null;
  var ui = { plan: null, setup: { name: "", avatar: "woman_office_worker", biz: "clinic", start: "open", goal: "safety", daily: null } };
  var app = document.getElementById("app");

  function saveAll() { if (S) store(KEY_GAME, S); store(KEY_META, meta); }

  // ── text helpers ──
  function esc(x) { return String(x).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]; }); }
  // Keep numbers, signs and dollar amounts readable inside Arabic: each goes in an LTR isolate.
  function nums(html) { return html.replace(/[+−-]?\$?\d+(?:[.,]\d+)*%?/g, function (m) { return '<bdi class="num" dir="ltr">' + m + "</bdi>"; }); }
  function L(o) { return o ? (o[meta.lang] != null ? o[meta.lang] : o.en) : ""; }
  function curBiz() { return C.businesses[S ? S.biz : ui.setup.biz] || C.businesses.clinic; }
  function T(key, vars) {
    var s = L(C.ui[key]) || key;
    return s.replace(/\{(\w)\}/g, function (_, k) { return vars && vars[k] != null ? vars[k] : k === "u" ? L(curBiz().units) : ""; });
  }
  function H(text) { return nums(esc(text)); }
  function money(n, signed) {
    var a = "$" + Math.abs(Math.round(n)).toLocaleString("en-US");
    return n < 0 ? "−" + a : signed && n > 0 ? "+" + a : a;
  }
  function short(n) {
    var a = Math.abs(n), t = a >= 10000 ? Math.round(a / 1000) + "k" : a >= 1000 ? (Math.round(a / 100) / 10) + "k" : String(Math.round(a));
    return (n < 0 ? "−$" : "$") + t;
  }
  function sign(n) { return (n > 0 ? "+" : n < 0 ? "−" : "") + Math.abs(n); }
  function num(n, signed) { return '<bdi class="num" dir="ltr">' + (signed ? sign(n) : n) + "</bdi>"; }
  function cash(n, signed) { return '<bdi class="num" dir="ltr">' + money(n, signed) + "</bdi>"; }
  function pair(a, b) { return '<bdi class="num" dir="ltr">' + a + " / " + b + "</bdi>"; }
  function img(name, cls) { return '<img src="img/' + name + '.webp" alt="" class="' + (cls || "") + '" draggable="false">'; }
  function nameHtml() { return '<bdi>' + esc(S.name) + "</bdi>"; }

  function applyChrome() {
    document.documentElement.lang = meta.lang;
    document.documentElement.dir = meta.lang === "ar" ? "rtl" : "ltr";
    document.documentElement.dataset.theme = meta.theme;
    document.title = T("title");
    document.body.classList.toggle("fog", !!(S && S.phase !== "end" && S.phase !== "start" && S.energy < FOG && onGameScreen));
  }

  var onGameScreen = false;
  function show(html, opts) {
    onGameScreen = !!(opts && opts.game);
    app.innerHTML = html;
    applyChrome();
    window.scrollTo(0, 0);
    var f = app.querySelector("[data-focus]");
    if (f) f.focus({ preventScroll: true });
  }

  function on(sel, fn) { app.querySelectorAll(sel).forEach(function (el) { el.addEventListener("click", function (e) { fn(el, e); }); }); }

  // ── chrome pieces ──
  function topbar() {
    var g = Engine.goalOf(S), target = Engine.goalTarget(S);
    var have = g.kind === "cash" ? S.cash : g.kind === "daily" ? S.month : S.systems;
    var pct = S.goalDone ? 100 : Math.max(0, Math.min(100, Math.round((have / target) * 100)));
    return '<header class="top">' +
      '<div class="who">' + img(S.avatar, "av") + '<span class="nm">' + nameHtml() + '</span><span class="wk">' + H(T("month", { n: S.month, t: S.months })) + "</span></div>" +
      '<div class="meters">' +
        meter("dollar_banknote", T("cash"), short(S.cash), "m-cash" + (S.cash < 0 ? " low" : "")) +
        meter("high_voltage", T("energy"), S.energy, "m-energy" + (S.energy < FOG ? " low" : S.energy >= Engine.DOOR ? " high" : "")) +
        meter("speech_balloon", T("rep"), S.rep, "m-rep") +
        meter("puzzle_piece", T("systems"), S.systems, "m-sys") +
      "</div>" +
      '<div class="piggy" title="' + esc(T("goal")) + '">' + img(g.img, "pig") +
        '<div class="bar"><i style="width:' + pct + '%"></i></div>' +
        '<span class="pnum">' + (g.kind === "daily" ? '<bdi class="num" dir="ltr">' + short(S.cash) + "</bdi>" : S.goalDone ? "✓" : g.kind === "cash" ? '<bdi class="num" dir="ltr">' + short(S.cash) + " / " + short(target) + "</bdi>" : pair(S.systems, target)) + "</span></div>" +
      "</header>";
  }
  function meter(icon, label, v, cls) {
    return '<div class="meter ' + cls + '" aria-label="' + esc(label) + " " + v + '">' + img(icon) + '<b><bdi class="num" dir="ltr">' + v + "</bdi></b><small>" + esc(label) + "</small></div>";
  }
  function langBtn() { return '<button class="chip" data-act="lang">' + esc(T("langBtn")) + "</button>"; }
  function themeBtn() { return '<button class="chip" data-act="theme" aria-label="' + esc(T("theme")) + '">' + (meta.theme === "dark" ? "☀️" : "🌙") + "</button>"; }
  function wireChrome(rerender) {
    on('[data-act="lang"]', function () { meta.lang = meta.lang === "ar" ? "en" : "ar"; saveAll(); rerender(); });
    on('[data-act="theme"]', function () { meta.theme = meta.theme === "dark" ? "light" : "dark"; saveAll(); rerender(); });
    on('[data-act="home"]', function () { home(); });
  }

  // ═════════ Screens ═════════
  function home() {
    var canResume = S && S.phase !== "end";
    show(
      '<main class="screen home">' +
        '<div class="toolbar">' + langBtn() + themeBtn() + "</div>" +
        '<div class="hero">' +
          '<div class="float">' + img("stethoscope", "f1") + img("coin", "f2") + img("briefcase", "f3") + img("handshake", "f4") + "</div>" +
          img(MENTOR, "grandpa") +
        "</div>" +
        '<h1 class="title">' + esc(T("title")) + "</h1>" +
        '<p class="lead">' + esc(T("subtitle")) + "</p>" +
        '<div class="stack">' +
          (canResume ? '<button class="btn primary big" data-act="resume">' + esc(T("resume")) + " · " + H(T("month", { n: S.month, t: S.months })) + "</button>" : "") +
          '<button class="btn ' + (canResume ? "" : "primary big") + '" data-act="new">' + esc(T("newGame")) + "</button>" +
          '<button class="btn daily-btn" data-act="daily">' + img("calendar", "ic") + "<span>" + esc(T("daily")) + "<small>" + esc(T(meta.daily[today().day] ? "dailyPlayed" : "dailyNew")) + "</small></span></button>" +
          '<div class="row2"><button class="btn" data-act="stickers">' + img("notebook", "ic") + esc(T("stickers")) + "</button>" +
          '<button class="btn" data-act="trophies">' + img("trophy", "ic") + "<span>" + esc(T("trophiesTitle")) + ' <small class="count">' + H(T("trophyCount", { a: trophyCount(), b: C.trophies.length })) + "</small></span></button></div>" +
          '<button class="btn" data-act="playbook">' + img("notebook", "ic") + "<span>" + esc(T("playbook")) + ' <small class="count">' + H(T("playbookCount", { a: meta.pages.length, b: Engine.PLAYBOOK.length })) + "</small></span></button>" +
          '<div class="row2"><button class="btn ghost" data-act="how">' + img("light_bulb", "ic") + esc(T("howTo")) + "</button>" +
          '<button class="btn ghost" data-act="about">' + esc(T("about")) + "</button></div>" +
        "</div>" +
        footer() +
      "</main>");
    wireChrome(home);
    on('[data-act="resume"]', function () { resume(); });
    on('[data-act="new"]', function () {
      if (canResume && S.month > 1 && !confirm(T("resetQ"))) return;
      ui.setup.daily = null;
      setup();
    });
    on('[data-act="how"]', howTo);
    on('[data-act="stickers"]', stickerBook);
    on('[data-act="about"]', about);
    on('[data-act="daily"]', dailyPage);
    on('[data-act="playbook"]', playbookPage);
    on('[data-act="trophies"]', trophyPage);
  }

  // Latin names inside the Arabic credit get their own isolates so the line reads in order.
  function footer() { return '<footer class="foot"><small>' + esc(T("credit")).replace(/[A-Za-z0-9][A-Za-z0-9 ]*[A-Za-z0-9]/g, function (m) { return "<bdi>" + m + "</bdi>"; }) + "</small></footer>"; }

  // A simple page reached from home. `self` re-renders it after a language/theme switch.
  function page(titleKey, body, self) {
    show('<main class="screen page"><div class="toolbar"><button class="chip" data-act="home">' + (meta.lang === "ar" ? "→ " : "← ") + esc(T("back")) + "</button>" + langBtn() + themeBtn() + "</div>" +
      '<h2 class="h">' + esc(T(titleKey)) + "</h2>" + body + footer() + "</main>");
    wireChrome(self);
  }

  function howTo() {
    page("howTo", '<ol class="how">' + C.howTo.map(function (h) { return "<li>" + img(h.img) + "<p>" + H(L(h)) + "</p></li>"; }).join("") + "</ol>", howTo);
  }

  function about() {
    page("about", '<div class="card note">' + img("briefcase", "big") + C.aboutNote[meta.lang].map(function (p) { return "<p>" + H(p) + "</p>"; }).join("") + "</div>", about);
  }

  function trophyPage() {
    var body = '<p class="lead">' + H(T("trophyCount", { a: trophyCount(), b: C.trophies.length })) + "</p>" +
      '<div class="trophies">' + C.trophies.map(function (tr) {
        var got = !!meta.trophies[tr.id];
        return '<div class="tro' + (got ? "" : " no") + '" data-trophy="' + tr.id + '">' + img(got ? tr.img : "locked") + "<b>" + H(L(tr.name)) + "</b><small>" + H(L(tr.desc)) + "</small></div>";
      }).join("") + "</div>";
    page("trophiesTitle", body, trophyPage);
  }

  function dailyPage() {
    var d = today(), b = C.businesses[d.biz], st = C.starts[d.start], played = meta.daily[d.day];
    var body = '<section class="card daily-card">' +
        '<div class="q">' + esc(T("dailyToday")) + ' <span class="unit"><bdi class="num" dir="ltr">' + d.day + "</bdi></span></div>" +
        '<div class="today">' + img(b.img) + "<div><b>" + esc(L(b.name)) + "</b><small>" + esc(L(st.name)) + "</small></div></div>" +
        "<p>" + H(T("dailyGoal")) + "</p>" +
        (played ? '<p class="okay">' + img("check_mark_button", "tiny") + "<span>" + H(T("dailyResult", { a: played.over ? "—" : money(played.score) })) + "</span></p>" : "") +
      "</section>" +
      '<p class="muted small center">' + esc(T("dailyPrivacy")) + "</p>" +
      '<div class="sticky"><button class="btn primary big" data-act="playdaily"' + (played ? " disabled" : "") + ">" + esc(T(played ? "dailyDone" : "dailyPlay")) + "</button></div>";
    page("daily", '<p class="lead">' + H(T("dailySub")) + "</p>" + body, dailyPage);
    on('[data-act="playdaily"]', function () {
      if (played) return;
      if (S && S.phase !== "end" && S.month > 1 && !S.daily && !confirm(T("dailyReplace"))) return;
      ui.setup.daily = d;
      setup();
    });
  }

  function playbookPage() {
    var have = meta.pages;
    var body = '<p class="lead">' + H(T("playbookCount", { a: have.length, b: Engine.PLAYBOOK.length })) + "</p>" +
      (have.length ? "" : '<p class="muted center">' + esc(T("playbookEmpty")) + "</p>") +
      '<div class="pages">' + Engine.PLAYBOOK.map(function (p) {
        if (have.indexOf(p.id) < 0) return '<section class="card pg no" data-page="' + p.id + '"><span class="q">?</span><small>' + esc(T("playbookLocked")) + "</small></section>";
        return '<section class="card pg" data-page="' + p.id + '"><div class="pg-top">' + img(p.img) + "<h3>" + H(L(p.title)) + "</h3></div><p>" + H(L(p.body)) + '</p><p class="src"><small>' + esc(T("source")) + '</small> <bdi dir="ltr">' + esc(p.source) + "</bdi></p></section>";
      }).join("") + "</div>";
    page("playbook", body, playbookPage);
  }

  function allStickers() {
    var list = Object.keys(C.ideas).map(function (k) { return { id: k, img: C.ideas[k].img, text: C.ideas[k] }; });
    C.dilemmas.forEach(function (d) { list.push({ id: d.id, img: d.img, text: d.idea }); });
    return list;
  }
  function stickerBook() {
    var all = allStickers(), have = meta.stickers;
    var got = all.filter(function (x) { return have.indexOf(x.id) >= 0; }).length;
    var body = '<p class="lead">' + H(T("stickerCount", { a: got, b: all.length })) + "</p>" +
      (got ? "" : '<p class="muted">' + esc(T("stickerEmpty")) + "</p>") +
      '<div class="stickers">' + all.map(function (x) {
        var ok = have.indexOf(x.id) >= 0;
        return '<div class="sticker' + (ok ? "" : " no") + '">' + (ok ? img(x.img) + "<p>" + H(L(x.text)) + "</p>" : '<span class="q">?</span>') + "</div>";
      }).join("") + "</div>";
    page("stickers", body, stickerBook);
  }

  function setup() {
    var st = ui.setup;
    function render() {
      var dd = st.daily;
      var b = C.businesses[dd ? dd.biz : st.biz];
      show('<main class="screen setup">' +
        '<div class="toolbar"><button class="chip" data-act="home">' + (meta.lang === "ar" ? "→ " : "← ") + esc(T("home")) + "</button>" + langBtn() + themeBtn() + "</div>" +
        '<h2 class="h">' + esc(T("setupTitle")) + "</h2>" +
        '<label class="q" for="nm">' + esc(T("nameQ")) + "</label>" +
        '<input id="nm" class="name" maxlength="14" autocomplete="off" autocapitalize="words" spellcheck="false" placeholder="' + esc(T("namePh")) + '" value="' + esc(st.name) + '">' +
        '<small class="muted">' + esc(T("nameNote")) + "</small>" +
        '<div class="q">' + esc(T("avatarQ")) + "</div>" +
        '<div class="avatars">' + C.avatars.map(function (a) {
          return '<button class="pick av' + (st.avatar === a ? " on" : "") + '" data-av="' + a + '" aria-pressed="' + (st.avatar === a) + '">' + img(a) + "</button>";
        }).join("") + "</div>" +
        (dd ? '<div class="q">' + esc(T("daily")) + ' <span class="unit"><bdi class="num" dir="ltr">' + dd.day + "</bdi></span></div>" +
          '<section class="card daily-card"><div class="today">' + img(b.img) + "<div><b>" + esc(L(b.name)) + "</b><small>" + esc(L(C.starts[dd.start].name)) + "</small></div></div><p>" + H(T("dailyGoal")) + "</p></section>" :
        '<div class="q">' + esc(T("bizQ")) + "</div>" +
        '<div class="grid1">' + Object.keys(C.businesses).map(function (k) {
          var x = C.businesses[k];
          return '<button class="pick biz wide' + (st.biz === k ? " on" : "") + '" data-biz="' + k + '" aria-pressed="' + (st.biz === k) + '">' + img(x.img) + "<span><b>" + esc(L(x.name)) + "</b><small>" + H(L(x.tag)) + "</small></span></button>";
        }).join("") + '<small class="muted">' + esc(T("soon")) + "</small></div>" +
        '<div class="q">' + esc(T("startQ")) + "</div>" +
        '<div class="grid2">' + Object.keys(C.starts).map(function (k) {
          var x = C.starts[k];
          return '<button class="pick start' + (st.start === k ? " on" : "") + '" data-start="' + k + '" aria-pressed="' + (st.start === k) + '">' + img(x.img) + "<b>" + esc(L(x.name)) + "</b><small>" + H(L(x.tag)) + "</small></button>";
        }).join("") + "</div>" +
        '<div class="q">' + esc(T("goalQ")) + "</div>" +
        '<div class="grid3">' + C.goals.filter(function (g) { return !g.hidden; }).map(function (g) {
          var t = g.kind === "cash" ? cash(b.goals[g.id]) : '<bdi class="num" dir="ltr">' + g.target + "</bdi> " + esc(T("systems"));
          return '<button class="pick goal' + (st.goal === g.id ? " on" : "") + '" data-goal="' + g.id + '" aria-pressed="' + (st.goal === g.id) + '">' + img(g.img) + "<b>" + esc(L(g.name)) + "</b><span>" + t + "</span></button>";
        }).join("") + "</div>") +
        '<div class="sticky"><button class="btn primary big" data-act="start">' + esc(T("start")) + "</button></div>" +
        "</main>");
      wireChrome(render);
      var nm = app.querySelector("#nm");
      nm.addEventListener("input", function () { st.name = nm.value; });
      on("[data-av]", function (el) { st.avatar = el.dataset.av; render(); });
      on("[data-biz]", function (el) { st.biz = el.dataset.biz; render(); });
      on("[data-start]", function (el) { st.start = el.dataset.start; render(); });
      on("[data-goal]", function (el) { st.goal = el.dataset.goal; render(); });
      on('[data-act="start"]', function () {
        var name = (st.name || "").trim().slice(0, 14);
        if (!name) { nm.classList.add("shake"); nm.placeholder = T("needName"); nm.focus(); setTimeout(function () { nm.classList.remove("shake"); }, 500); return; }
        var seed = params.get("seed");
        S = dd ? Engine.newGame({ name: name, avatar: st.avatar, biz: dd.biz, start: dd.start, goal: "daily", daily: dd, seed: dd.seed })
               : Engine.newGame({ name: name, avatar: st.avatar, biz: st.biz, start: st.start, goal: st.goal, seed: seed != null ? Number(seed) : undefined });
        S.pagesAtStart = meta.pages.length;
        meta.biz[S.biz] = 1; meta.starts[S.start] = 1;
        Engine.beginMonth(S);
        saveAll();
        checkTrophies();
        resume();
      });
    }
    render();
  }

  // Route to whatever the saved state says comes next.
  function resume() {
    if (!S) return home();
    if (S.phase === "cards" || S.phase === "finalCards") return cards();
    if (S.phase === "plan") return S.sick ? runSick() : plan();
    if (S.phase === "results" || S.phase === "draw") return results();
    if (S.phase === "dilemma") return dilemma();
    if (S.phase === "idea") return afterChoice();
    if (S.phase === "end") return endScreen();
    if (S.phase === "start") { Engine.beginMonth(S); saveAll(); return resume(); }
    home();
  }

  function gameShell(inner, cls) {
    show('<div class="game ' + (cls || "") + '">' + topbar() + '<main class="screen">' + inner + "</main>" +
      '<nav class="mini">' + '<button class="chip" data-act="home">' + img("house", "tiny") + "</button>" + langBtn() + themeBtn() + "</nav></div>", { game: true });
    wireChrome(resume);
  }

  // ── Cards: echoes, opening day, a month in bed, the goal ──
  function cards() {
    var c = S.queue[0];
    if (!c) {
      if (S.phase === "finalCards") { S.phase = "end"; saveAll(); return endScreen(); }
      S.phase = "plan"; saveAll(); return resume();
    }
    var html;
    if (c.type === "echo") {
      var d = Engine.findDilemma(c.id), e = d[c.opt].echo;
      html = card(e.img, L(e.title), L(e.text), '<p class="because">' + img("hourglass_not_done", "tiny") + "<span>" + H(T("echoFrom", { n: c.from })) + "</span></p>" + fxLine(e.fx), "echo");
    } else if (c.type === "opening") {
      html = card(C.businesses[S.biz].img, T("openTitle"), T("openText"), '<div class="confetti">' + img("party_popper") + img("sparkles") + img("glowing_star") + "</div>", "goal");
    } else if (c.type === "sick") {
      html = card("face_with_spiral_eyes", T("sickTitle"), T("sickText", { n: c.eff }), ideaBox("fog", true), "closed");
    } else if (c.type === "goal") {
      var g = Engine.goalOf(S);
      html = card(g.img, T("goalHit"), L(g.name), '<div class="confetti">' + img("party_popper") + img("sparkles") + img("glowing_star") + "</div>", "goal");
    }
    gameShell(html + '<div class="sticky"><button class="btn primary big" data-act="ok" data-focus>' + esc(T("ok")) + "</button></div>");
    on('[data-act="ok"]', function () {
      if (c.type === "sick") collect("fog");
      S.queue.shift(); saveAll(); cards();
    });
  }

  function card(image, title, text, extra, cls) {
    return '<section class="card big-card ' + (cls || "") + '">' + img(image, "hero-img") + "<h2>" + H(title) + "</h2><p>" + H(text) + "</p>" + (extra || "") + "</section>";
  }

  function fxLine(fx) {
    if (!fx) return "";
    var bits = [];
    if (fx.cash) bits.push(img("dollar_banknote", "tiny") + cash(fx.cash, true));
    if (fx.loan && fx.loan.amount) bits.push(img("classical_building", "tiny") + cash(fx.loan.amount, true));
    if (fx.energy) bits.push(img("high_voltage", "tiny") + num(fx.energy, true));
    if (fx.rep) bits.push(img("speech_balloon", "tiny") + num(fx.rep, true));
    if (fx.systems) bits.push(img("puzzle_piece", "tiny") + num(fx.systems, true));
    if (fx.quality) bits.push(img("glowing_star", "tiny") + num(fx.quality, true));
    if (fx.staff) bits.push(img("busts_in_silhouette", "tiny") + num(fx.staff, true));
    return bits.length ? '<div class="fx">' + bits.map(function (b) { return "<span>" + b + "</span>"; }).join("") + "</div>" : "";
  }

  function collect(id) {
    var page = Engine.pageOf(id), fresh = false;
    if (page && meta.pages.indexOf(page) < 0) { meta.pages.push(page); fresh = true; }
    if (meta.stickers.indexOf(id) < 0) { meta.stickers.push(id); fresh = true; }
    if (fresh) saveAll();
    return fresh;
  }
  function ideaBox(id, isSystem) {
    var o = isSystem ? C.ideas[id] : Engine.findDilemma(id).idea;
    var isNew = meta.stickers.indexOf(id) < 0;
    var pg = Engine.findPage(Engine.pageOf(id));
    var pageLine = pg ? '<p class="pb">' + img(pg.img, "tiny") + "<span>" + H(T(meta.pages.indexOf(pg.id) < 0 ? "pageNew" : "pageOld", { a: L(pg.title) })) + "</span></p>" : "";
    return '<div class="idea">' + img(MENTOR, "gp") + "<div><b>" + esc(T("ideaTitle")) + (isNew ? ' <span class="new">' + esc(T("newSticker")) + "</span>" : "") + "</b><p>" + H(L(o)) + "</p>" + pageLine + "</div></div>";
  }

  function season(calNow, calNext) {
    var wNow = C.calendar[calNow], wNext = calNext ? C.calendar[calNext] : null;
    return '<section class="card weather"><div>' + img(wNow.img, "wimg") + "<div><small>" + esc(T("forecast")) + "</small><b>" + esc(L(wNow)) + "</b></div></div>" +
      (wNext ? '<div class="next"><small>' + esc(T("nextMonth")) + "</small>" + img(wNext.img, "tiny") + "<span>" + esc(L(wNext)) + "</span></div>" : "") + "</section>";
  }
  function focusGrid(list, current) {
    return '<div class="acts">' + Object.keys(list).map(function (k) {
      var a = list[k];
      return '<button class="act' + (current === k ? " on" : "") + '" data-focus-k="' + k + '" aria-pressed="' + (current === k) + '">' + img(a.img) + "<b>" + esc(L(a)) + "</b><small>" + H(L(a.hint)) + "</small></button>";
    }).join("") + "</div>";
  }
  function moneyLines() {
    var bits = [];
    if (S.loans.length) bits.push(img("classical_building", "tiny") + "<span>" + H(T("loanLine", { a: money(Engine.loanLeft(S)), b: money(Engine.loanPay(S)) })) + "</span>");
    if (S.ar > 0) bits.push(img("receipt", "tiny") + "<span>" + H(T("owedLine", { a: money(S.ar) })) + "</span>");
    return bits.length ? '<div class="moneylines">' + bits.map(function (b) { return "<p>" + b + "</p>"; }).join("") + "</div>" : "";
  }

  // ── Plan ──
  function plan() {
    if (!Engine.isOpen(S)) return prepPlan();
    var b = C.businesses[S.biz];
    var calNow = S.cal[S.month - 1], calNext = S.month < S.months ? S.cal[S.month] : null;
    if (!ui.plan || ui.plan.month !== S.month || ui.plan.prep) {
      var lp = S.lastPlan || { price: 1 };
      ui.plan = { month: S.month, price: lp.price, staff: S.staff, focus: S.energy < 50 ? "rest" : S.ar > Engine.fixedCosts(S) ? "collect" : "market" };
    }
    var p = ui.plan;
    var hires = Math.max(0, p.staff - S.staff);
    var cap = Engine.capacity(S, p.staff, hires);
    var warns = "";
    if (S.energy < FOG) warns += '<div class="warn fog-warn">' + img("face_with_spiral_eyes", "tiny") + "<span>" + esc(T("fogWarn")) + "</span></div>";
    if (S.cash < Engine.monthlyFloor(S)) warns += '<div class="warn">' + img("dollar_banknote", "tiny") + "<span>" + esc(T("cashWarn")) + "</span></div>";
    if (calNext === "ramadan") warns += '<div class="warn">' + img("star", "tiny") + "<span>" + esc(T("ramadanWarn")) + "</span></div>";
    var html =
      '<h2 class="h">' + esc(T("planTitle")) + "</h2>" + warns + season(calNow, calNext) +
      '<section class="card"><div class="q">' + esc(L(b.priceLabel)) + "</div>" +
        '<div class="seg">' + b.prices.map(function (pr, i) {
          return '<button class="opt' + (p.price === i ? " on" : "") + '" data-price="' + i + '" aria-pressed="' + (p.price === i) + '"><small>' + esc(L(C.prices[i])) + "</small><b>" + cash(Engine.price(S, i)) + "</b></button>";
        }).join("") + "</div></section>" +
      '<section class="card"><div class="q">' + esc(T("teamQ")) + ' <span class="unit">' + img("busts_in_silhouette", "tiny") + esc(L(b.staffWord)) + "</span></div>" +
        '<div class="stepper"><button class="step" data-st="-1" aria-label="−1">−</button><output class="mk">' + num(p.staff) + '</output><button class="step" data-st="1" aria-label="+1">+</button></div>' +
        '<div class="mkinfo"><span>' + H(T("teamInfo", { a: cap, b: money(Engine.salaries(S, p.staff)) })) + "</span></div>" +
        (hires ? '<div class="muted small center">' + H(T("hireNote", { a: money(b.hireFee) })) + "</div>" : "") +
        '<div class="guess">' + img(MENTOR, "tiny") + "<span>" + H(T("guess", { a: Engine.guess(S, p), b: cap })) + "</span></div>" +
        '<div class="muted small">' + esc(T("quality")) + " " + pair(S.quality, 100) + "</div></section>" +
      '<section class="card"><div class="q">' + esc(T("focusQ")) + "</div>" + focusGrid(C.focuses, p.focus) + "</section>" +
      moneyLines() +
      '<div class="sticky"><button class="btn primary big" data-act="open">' + img(b.img, "tiny") + esc(T("open")) + "</button></div>";
    gameShell(html, "plan");
    on("[data-price]", function (el) { p.price = +el.dataset.price; plan(); });
    on("[data-focus-k]", function (el) { p.focus = el.dataset.focusK; plan(); });
    on("[data-st]", function (el) { p.staff = clamp(p.staff + +el.dataset.st, b.minStaff, b.maxStaff); plan(); });
    on('[data-act="open"]', function () { work(); });
  }

  function prepPlan() {
    var calNow = S.cal[S.month - 1];
    if (!ui.plan || ui.plan.month !== S.month || !ui.plan.prep) ui.plan = { month: S.month, prep: true, focus: S.fitPushed ? "presell" : "fitout" };
    var p = ui.plan;
    var html = '<h2 class="h">' + esc(T("prepTitle")) + "</h2>" +
      '<div class="warn">' + img("hammer_and_wrench", "tiny") + "<span>" + H(T("prepNote", { n: S.openAt })) + "</span></div>" +
      season(calNow, null) +
      '<section class="card"><div class="q">' + esc(T("focusQ")) + "</div>" + focusGrid(C.prepFocuses, p.focus) + "</section>" +
      moneyLines() +
      '<div class="sticky"><button class="btn primary big" data-act="open">' + esc(T("prepGo")) + "</button></div>";
    gameShell(html, "plan prep");
    on("[data-focus-k]", function (el) { p.focus = el.dataset.focusK; prepPlan(); });
    on('[data-act="open"]', function () { work(); });
  }

  // A month in bed: the clinic runs on its own, with the last plan.
  function runSick() { ui.plan = { month: S.month, price: S.lastPlan ? S.lastPlan.price : 1, staff: S.staff, focus: "none" }; work(); }

  // ── The month ──
  function work() {
    var p = ui.plan;
    var r = Engine.runMonth(S, p.prep ? { focus: p.focus } : { price: p.price, staff: p.staff, focus: p.focus });
    S.phase = "results";
    saveAll();
    var b = C.businesses[S.biz];
    var people = ["woman", "old_man", "man", "old_woman", "boy", "girl", "child"];
    var shown = r.prep ? 0 : Math.min(14, Math.max(1, Math.round((r.wanted / b.base) * 9)));
    var served = r.prep ? 0 : Math.min(shown, Math.round((shown * r.done) / Math.max(1, r.wanted)));
    var walkers = "";
    for (var i = 0; i < shown; i++) {
      walkers += '<span class="walker' + (i < served ? " buys" : " sad") + '" style="--i:' + i + ";--n:" + shown + '">' + img(people[i % people.length]) + "</span>";
    }
    gameShell(
      '<h2 class="h center">' + esc(T(r.prep ? "prepWork" : "workTitle")) + "</h2>" +
      '<section class="stand w-' + r.cal + (r.prep ? " w-prep" : "") + '">' +
        '<div class="sky">' + img(C.calendar[r.cal].img, "sun") + "</div>" +
        '<div class="lane">' + walkers + "</div>" +
        '<div class="booth">' + img(r.prep ? "hammer_and_wrench" : b.img, "prod") + img(S.avatar, "seller") + "</div>" +
      "</section>" +
      (r.prep ? "" : '<p class="center tally">' + H(T("patientsCame", { n: r.wanted })) + "</p>") +
      '<div class="sticky"><button class="btn big" data-act="skip">' + esc(T("skip")) + "</button></div>", "sell");
    var done = false;
    function go() { if (done) return; done = true; results(); }
    on('[data-act="skip"]', go);
    setTimeout(go, FAST ? 200 : 3000 + shown * 60);
  }

  // ── Results + paying yourself ──
  function results() {
    var r = S.last;
    if (!r) { S.phase = "plan"; return plan(); }
    var html = '<h2 class="h">' + esc(T("resultsTitle")) + "</h2>";
    if (r.prep) {
      html += '<section class="card results"><p>' + H(T("prepResult", { a: money(r.fixed) })) + "</p>" +
        (r.focusCost ? "<table><tr><td>" + esc(T("focusCost")) + "</td><td>" + cash(-r.focusCost) + "</td></tr></table>" : "") +
        (r.presold ? '<p class="okay">' + img("label", "tiny") + "<span>" + H(T("presold", { a: money(r.presoldCash), b: r.presold })) + "</span></p>" : "") +
        (r.delayed ? '<p class="bad">' + img("hourglass_not_done", "tiny") + "<span>" + H(T("delayed", { n: r.openAt })) + "</span></p>" :
          S.month === S.openAt - 1 ? '<p class="okay">' + img("check_mark_button", "tiny") + "<span>" + H(T("onTime", { n: r.openAt })) + "</span></p>" : "") +
        '<table><tr class="tot"><td>' + esc(T("cashChange")) + "</td><td>" + cash(r.cashChange, true) + "</td></tr></table></section>";
    } else {
      var rows = [
        [L(C.businesses[S.biz].doneLabel), pair(r.done, r.wanted)],
        [T("revenue"), cash(r.revenue, true)],
        [T("supplies"), cash(-r.supplies)],
        [T("salaries"), cash(-r.salaries)],
        [T("rentOther"), cash(-r.fixed)],
      ];
      if (r.focusCost) rows.push([T("focusCost"), cash(-r.focusCost)]);
      if (r.hiring) rows.push([T("hiring"), cash(-r.hiring)]);
      if (r.refunds) rows.push([T("returns"), cash(-r.refunds)]);
      if (r.mistake) rows.push([T("mistake"), cash(-r.mistake)]);
      if (r.badDebt) rows.push([T("badDebt"), cash(-r.badDebt)]);
      var flow = [[T("profit"), cash(r.profit, true)]];
      if (r.newlyOwed) flow.push([T("newlyOwed"), cash(-r.newlyOwed)]);
      if (r.collected) flow.push([T("collected"), cash(r.collected, true)]);
      if (r.loanPay) flow.push([T("loanPay"), cash(-r.loanPay)]);
      html += '<section class="card results"><table>' + rows.map(function (x) { return "<tr><td>" + esc(x[0]) + "</td><td>" + x[1] + "</td></tr>"; }).join("") +
          '<tr class="tot"><td>' + esc(T("profit")) + "</td><td>" + cash(r.profit, true) + "</td></tr></table>" +
          (r.turned >= 10 ? '<p class="bad">' + img("hourglass_not_done", "tiny") + "<span>" + H(T("waiting", { n: r.turned })) + "</span></p>" : "") +
          (r.idle >= r.cap * 0.3 ? '<p class="bad">' + img("cloud", "tiny") + "<span>" + H(T("idleHours", { n: r.idle })) + "</span></p>" : "") +
          (r.wasted >= 200 ? '<p class="bad">' + img("grimacing_face", "tiny") + "<span>" + H(T("wastedFood", { a: money(r.wasted) })) + "</span></p>" : "") +
        "</section>" +
        '<section class="card results flow"><div class="q">' + esc(T("cashSide")) + "</div><table>" + flow.map(function (x) { return "<tr><td>" + esc(x[0]) + "</td><td>" + x[1] + "</td></tr>"; }).join("") +
          '<tr class="tot"><td>' + esc(T("cashChange")) + "</td><td>" + cash(r.cashChange, true) + "</td></tr></table></section>";
    }
    html += (r.ideas || []).map(function (id) { return ideaBox(id, true); }).join("");
    if (S.phase === "results" && Engine.canDraw(S)) {
      var sm = C.draws.small, bg = C.draws.big;
      html += '<section class="card treat">' + img("red_heart", "tiny") + "<b>" + esc(T("drawQ")) + "</b>" +
        '<div class="treats"><button class="btn" data-draw="small">' + img(sm.img, "tiny") + H(T("drawSmall", { a: money(sm.cash), b: sm.energy })) + "</button>" +
        (S.cash >= bg.cash ? '<button class="btn" data-draw="big">' + img(bg.img, "tiny") + H(T("drawBig", { a: money(bg.cash), b: bg.energy })) + "</button>" : "") +
        '<button class="btn primary" data-draw="keep">' + img("seedling", "tiny") + esc(T("drawNo")) + "</button></div></section>";
    } else {
      html += '<div class="sticky"><button class="btn primary big" data-act="next" data-focus>' + esc(T("next")) + "</button></div>";
    }
    gameShell(html, "results");
    function done() { (r.ideas || []).forEach(collect); S.phase = "draw"; toDilemma(); }
    on("[data-draw]", function (el) {
      var k = el.dataset.draw;
      if (k !== "keep" && Engine.draw(S, k)) { collect("draw"); checkTrophies(); }
      done();
    });
    on('[data-act="next"]', done);
  }

  // ── Dilemma ──
  function toDilemma() {
    var d = Engine.pickDilemma(S);
    if (d) { S.pending = d.id; S.phase = "dilemma"; saveAll(); return dilemma(); }
    finishMonth();
  }

  function dilemma() {
    var d = Engine.findDilemma(S.pending);
    if (!d) return finishMonth();
    var opts = ["A", "B"].concat(d.C ? ["C"] : []);
    var crunch = d.when && d.when.crunch;
    var html = (crunch ? '<div class="warn">' + img("dollar_banknote", "tiny") + "<span>" + esc(T("crunchTitle")) + " · " + cash(S.cash) + "</span></div>" : "") +
      '<section class="card dilemma">' + img(d.img, "hero-img") + "<h2>" + H(L(d.title)) + "</h2><p>" + H(L(d.text)) + "</p></section>" +
      '<div class="choices">' + opts.map(function (k) {
        var o = d[k], open = Engine.canOpen(S, d, k);
        if (k === "C") {
          var tired = S.energy < (o.needs || Engine.DOOR);
          return '<button class="choice door' + (open ? " open" : " locked") + '" data-opt="C"' + (open ? "" : " disabled aria-disabled=\"true\"") + ">" +
            img(open ? "unlocked" : "locked", "tiny") + '<span><small>' + esc(T("thirdDoor")) + "</small>" + H(L(o.label)) + "</span>" +
            (open ? "" : tired ? '<em class="need">' + img("high_voltage", "tiny") + "<span>" + H(T("locked", { n: o.needs || Engine.DOOR })) + "</span></em>" :
              '<em class="need">' + img("dollar_banknote", "tiny") + "<span>" + esc(T("noCash")) + "</span></em>") + "</button>";
        }
        if (!open) return '<button class="choice locked" data-opt="' + k + '" disabled aria-disabled="true"><span>' + H(L(o.label)) + '</span><em class="need">' + img("dollar_banknote", "tiny") + "<span>" + esc(T("noCash")) + "</span></em></button>";
        return '<button class="choice" data-opt="' + k + '"><span>' + H(L(o.label)) + "</span></button>";
      }).join("") + "</div>";
    gameShell(html, "dil");
    on("[data-opt]", function (el) {
      if (el.disabled) return;
      var res = Engine.choose(S, d, el.dataset.opt);
      if (!res) return;
      S.lastChoice = { id: d.id, opt: el.dataset.opt };
      S.phase = "idea"; saveAll(); afterChoice();
    });
  }

  function afterChoice() {
    var lc = S.lastChoice, d = Engine.findDilemma(lc.id), o = d[lc.opt];
    var html = '<section class="card big-card">' + img(d.img, "hero-img") + "<h2>" + H(L(o.label)) + "</h2><p>" + H(L(o.log)) + "</p>" + fxLine(o.fx) +
      (o.echo ? '<p class="because soft">' + img("hourglass_not_done", "tiny") + "…</p>" : "") + "</section>" +
      ideaBox(d.id, false) +
      '<div class="sticky"><button class="btn primary big" data-act="next" data-focus>' + esc(T("next")) + "</button></div>";
    gameShell(html, "ideascr");
    on('[data-act="next"]', function () { collect(d.id); finishMonth(); });
  }

  function finishMonth() {
    S.pending = null;
    var hit = Engine.endMonth(S);
    checkTrophies();
    if (hit) {
      if (S.phase === "plan") S.phase = "cards";
      S.queue.unshift({ type: "goal" });
    }
    ui.plan = null;
    saveAll();
    resume();
  }

  // ── The end: two years, a closed clinic, or a sale to rest ──
  function endScreen() {
    var r = Engine.report(S), g = Engine.goalOf(S);
    if (!S.counted) {
      S.counted = true; meta.games++;
      S.pagesNew = Math.max(0, meta.pages.length - (S.pagesAtStart || 0));
      checkTrophies();
      if (S.daily && !meta.daily[S.daily.day]) meta.daily[S.daily.day] = { score: Engine.dailyScore(S), over: S.over || null, month: S.overMonth };
      saveAll();
    }
    if (S.daily) return dailyEnd(r);
    var lines = [L(C.endLines[S.over || (S.goalDone ? "win" : "notYet")])];
    var skills = [["Money", r.money, "money"], ["Customers", r.customers, "customers"], ["Freedom", r.freedom, "freedom"], ["Balance", r.balance, "balance"], ["Honesty", r.honesty, "honesty"]];
    var low = skills.slice().sort(function (a, b) { return a[1] - b[1]; })[0];
    var high = skills.slice().sort(function (a, b) { return b[1] - a[1]; })[0];
    lines.push(L(C.endLines[high[2] + "High"]));
    if (low[1] < 3 && low !== high) lines.push(L(C.endLines[low[2] + "Low"]));
    var title = S.over === "closed" ? T("endClosed") : S.over === "burnout" ? T("endBurnout") : S.goalDone ? T("goalHit") : T("endTitle");
    var text = S.over === "closed" ? T("endClosedText", { n: S.overMonth }) : S.over === "burnout" ? T("endBurnoutText", { n: S.overMonth }) :
      T(S.goalDone ? "endWin" : "endNotYet", { a: money(S.cash), b: L(g.name) });
    var image = S.over === "closed" ? "chart_decreasing" : S.over === "burnout" ? "face_exhaling" : S.goalDone ? g.img : "trophy";
    var html =
      '<section class="card big-card end">' + img(image, "hero-img") + "<h2>" + esc(title) + "</h2><p>" + H(text) + "</p></section>" +
      '<section class="card grandpa">' + img(MENTOR, "gp") + "<div><b>" + esc(T("endMentor")) + "</b>" + lines.map(function (x) { return "<p>" + H(x) + "</p>"; }).join("") + "</div></section>" +
      '<section class="card report"><h3>' + esc(T("report")) + "</h3>" +
        skills.map(function (k) { return '<div class="skill" data-skill="' + k[2] + '" data-stars="' + k[1] + '"><span>' + esc(T("skill" + k[0])) + '</span><span class="stars">' + "★★★".slice(0, k[1]) + '<i>' + "★★★".slice(k[1]) + "</i></span></div>"; }).join("") +
        '<div class="kv"><span>' + esc(T("totalProfit")) + "</span>" + cash(r.profit, true) + "</div>" +
        '<div class="kv"><span>' + esc(T("paidYourself")) + "</span>" + cash(r.drawn) + "</div>" +
        '<div class="kv"><span>' + esc(T("finalSystems")) + "</span>" + pair(r.systems, 100) + "</div>" +
      "</section>" + pagesLine() + trophiesLine() +
      '<div class="stack"><button class="btn primary big" data-act="again">' + esc(T("again")) + '</button><button class="btn" data-act="stickers">' + img("notebook", "ic") + esc(T("stickers")) + "</button></div>";
    gameShell(html, "endscr");
    on('[data-act="again"]', function () { ui.setup.name = S.name; ui.setup.avatar = S.avatar; ui.setup.biz = S.biz; ui.setup.start = S.start; ui.setup.goal = S.goal; S = null; drop(KEY_GAME); setup(); });
    on('[data-act="stickers"]', stickerBook);
    on('[data-act="playbook"]', playbookPage);
    on('[data-act="trophies"]', trophyPage);
  }

  // The trophies this game earned, and the collection's size.
  function trophiesLine() {
    var ids = S.trophiesNew || [];
    var icons = ids.map(function (id) { var tr = C.trophies.filter(function (x) { return x.id === id; })[0]; return tr ? img(tr.img, "tiny") : ""; }).join("");
    return '<button class="card pbline trline" data-act="trophies">' + img("trophy", "tiny") + "<span>" + H(T("trophiesRun", { a: ids.length, b: trophyCount(), c: C.trophies.length })) + "</span>" + (icons ? '<span class="tricons">' + icons + "</span>" : "") + "</button>";
  }

  // How many pages this game added to the collection, and the collection's size.
  function pagesLine() {
    var fresh = (S.pagesNew != null ? S.pagesNew : 0);
    return '<button class="card pbline" data-act="playbook">' + img("notebook", "tiny") + "<span>" + H(T("pagesRun", { a: fresh, b: meta.pages.length, c: Engine.PLAYBOOK.length })) + "</span></button>";
  }

  function dailyEnd(r) {
    var b = C.businesses[S.biz], score = Engine.dailyScore(S);
    var lines = [L(C.endLines[S.over || "win"])];
    var title = S.over === "closed" ? T("endClosed") : S.over === "burnout" ? T("endBurnout") : T("dailyEnd");
    var text = S.over ? T("dailyZero") : T("dailyScore", { a: money(score) });
    var label = L(b.name) + " · " + L(C.starts[S.start].name);
    var share = S.over ? T("shareClosed", { a: S.daily.day, b: label }) : T("shareText", { a: S.daily.day, b: label, c: money(score) });
    var skills = [["Money", r.money, "money"], ["Customers", r.customers, "customers"], ["Freedom", r.freedom, "freedom"], ["Balance", r.balance, "balance"], ["Honesty", r.honesty, "honesty"]];
    var html =
      '<section class="card big-card end">' + img(S.over ? "chart_decreasing" : "calendar", "hero-img") + "<h2>" + esc(title) + "</h2><p>" + H(text) + "</p></section>" +
      '<section class="card grandpa">' + img(MENTOR, "gp") + "<div><b>" + esc(T("endMentor")) + "</b>" + lines.map(function (x) { return "<p>" + H(x) + "</p>"; }).join("") + "</div></section>" +
      '<section class="card report"><h3>' + esc(T("report")) + "</h3>" +
        skills.map(function (k) { return '<div class="skill" data-skill="' + k[2] + '" data-stars="' + k[1] + '"><span>' + esc(T("skill" + k[0])) + '</span><span class="stars">' + "★★★".slice(0, k[1]) + '<i>' + "★★★".slice(k[1]) + "</i></span></div>"; }).join("") +
        '<div class="kv"><span>' + esc(T("totalProfit")) + "</span>" + cash(r.profit, true) + "</div>" +
      "</section>" + pagesLine() + trophiesLine() +
      '<p class="muted small center copied" hidden>' + esc(T("copied")) + "</p>" +
      '<div class="stack"><button class="btn primary big" data-act="share">' + img("speech_balloon", "ic") + esc(T("share")) + '</button>' +
      '<button class="btn" data-act="home2">' + img("house", "ic") + esc(T("home")) + "</button></div>";
    gameShell(html, "endscr daily-end");
    on('[data-act="home2"]', function () { home(); });
    on('[data-act="playbook"]', playbookPage);
    on('[data-act="trophies"]', trophyPage);
    on('[data-act="share"]', function () {
      var shown = app.querySelector(".copied");
      function copied() { if (shown) shown.hidden = false; }
      function copy() {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(share).then(copied, fallback);
        else fallback();
      }
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = share; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); copied(); } catch (e) { /* nothing more to try */ }
        document.body.removeChild(ta);
      }
      if (navigator.share) navigator.share({ text: share }).catch(copy); else copy();
    });
  }

  // Test hook (local only, no network): lets the Playwright script read state.
  root.__owner = { get state() { return S; }, meta: meta, engine: Engine };

  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1") && !params.has("nosw")) {
    navigator.serviceWorker.register("sw.js").catch(function () { /* offline support is optional */ });
  }

  if (S && params.has("new")) { S = null; drop(KEY_GAME); }
  home();
})(typeof window !== "undefined" ? window : globalThis);
