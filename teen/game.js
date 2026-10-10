// تينبرونور · Teenpreneur
// Engine (pure functions, also runs in Node for balance tests) + UI.
// No network calls and no analytics. Progress is saved in localStorage on this device only.
(function (root) {
  "use strict";
  var C = root.TEEN || (typeof require === "function" ? require("./content.js") : null);

  // ═══════════════════════════ Engine ═══════════════════════════
  var WEEKS = 30;               // one school year
  var START_COINS = 60;
  var START = { energy: 80, rep: 50, quality: 40, grades: 70 };
  var DOOR = 70;                // energy needed for the smart third option
  var SLEEPY = 40;              // below this, tired mistakes happen
  var GRADES_FLOOR = 40;        // below this at the start of a week, parents pause the hustle
  var EXAM_PASS = 55, EXAM_GREAT = 75;
  var EXAM_SEASONS = [[9, 10], [19, 20], [29, 30]];
  var PRICE_F = [1.45, 1, 0.6];
  var TREATS = { small: { coins: 8, energy: 8 }, big: { coins: 40, energy: 12 } };
  var RESCUE = 30;

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  // mulberry32: small seeded RNG kept inside the state so a year replays the same
  function rand(s) {
    var t = (s.rs = (s.rs + 0x6D2B79F5) >>> 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  function randInt(s, lo, hi) { return lo + Math.floor(rand(s) * (hi - lo + 1)); }

  function isExamWeek(w) { return EXAM_SEASONS.some(function (x) { return w >= x[0] && w <= x[1]; }); }

  function newGame(o) {
    var seed = (o.seed != null ? o.seed : Math.floor(Math.random() * 1e9)) >>> 0;
    var s = {
      v: 1, name: o.name, avatar: o.avatar, biz: o.biz, goal: o.goal,
      week: 1, coins: START_COINS, energy: START.energy, rep: START.rep, quality: START.quality, grades: START.grades,
      stock: 0, honestPlus: 0, honestMinus: 0, studyWeeks: 0, closedWeeks: 0,
      rescues: 0, goalDone: false, promoLast: false,
      mods: [], echoes: [], used: [], history: [], ideasSeen: [], log: [], exams: [],
      phase: "start", queue: [], rs: seed, seed: seed,
    };
    s.cal = [];
    for (var w = 1; w <= WEEKS; w++) {
      var r = rand(s);
      s.cal.push(isExamWeek(w) ? "exams" : w === 1 ? "normal" : r < 0.5 ? "normal" : r < 0.78 ? "busy" : "quiet");
    }
    return s;
  }

  function biz(s) { return C.businesses[s.biz]; }
  function goalOf(s) { for (var i = 0; i < C.goals.length; i++) if (C.goals[i].id === s.goal) return C.goals[i]; return C.goals[0]; }

  function modProduct(s, k) {
    var x = 1;
    s.mods.forEach(function (m) { if (m.k === k && m.start <= s.week && s.week <= m.end) x *= m.x; });
    return x;
  }
  function modSum(s, k) {
    var x = 0;
    s.mods.forEach(function (m) { if (m.k === k && m.start <= s.week && s.week <= m.end) x += m.x; });
    return x;
  }
  function addMods(s, list, start) {
    (list || []).forEach(function (m) { s.mods.push({ k: m.k, x: m.x, start: start, end: start + m.weeks - 1 }); });
  }

  function unitCost(s) { return biz(s).cost * modProduct(s, "cost"); }
  function makeCost(s, n) { return Math.round(n * unitCost(s)); }
  function maxMake(s) { var u = unitCost(s); return u <= 0 ? 40 : Math.min(40, Math.floor((s.coins + 0.0001) / u)); }

  // Customers who would come, before the random wobble. Shown to the player as Nour's estimate.
  function expectedCustomers(s, plan) {
    var b = biz(s);
    var d = b.base * (1 + 0.015 * (s.week - 1));
    d *= PRICE_F[plan.price];
    d *= 0.8 + s.quality / 250;
    d *= 0.7 + s.rep / 150;
    if (plan.activity === "promote") d *= 1.3; else if (s.promoLast) d *= 1.1;
    d *= b.cal[s.cal[s.week - 1]];
    if (s.energy < 20) d *= 0.7; else if (s.energy < SLEEPY) d *= 0.85;
    d *= modProduct(s, "demand");
    return d;
  }
  function guess(s, plan) { return Math.max(0, Math.round(expectedCustomers(s, plan))); }

  function applyFx(s, fx) {
    if (!fx) return;
    if (fx.coins) s.coins = Math.max(0, s.coins + fx.coins);
    if (fx.energy) s.energy = clamp(s.energy + fx.energy, 0, 100);
    if (fx.rep) s.rep = clamp(s.rep + fx.rep, 0, 100);
    if (fx.quality) s.quality = clamp(s.quality + fx.quality, 0, 100);
    if (fx.grades) s.grades = clamp(s.grades + fx.grades, 0, 100);
    if (fx.honest > 0) s.honestPlus += fx.honest;
    if (fx.honest < 0) s.honestMinus -= fx.honest;
  }

  function seeIdea(s, id, out) {
    if (s.ideasSeen.indexOf(id) < 0) { s.ideasSeen.push(id); if (out) out.push(id); }
  }

  // Exam results at the end of each exam season. A low result pauses the hustle for a week.
  function examCard(s, term, final) {
    var band = s.grades >= EXAM_GREAT ? "great" : s.grades >= EXAM_PASS ? "ok" : "low";
    var fx = band === "great" ? { energy: 8, rep: 3 } : null;
    applyFx(s, fx);
    if (band === "low" && !final) s.closed = true;
    s.exams.push({ term: term, grades: s.grades, band: band });
    return { type: "exam", term: term, grades: s.grades, band: band, final: !!final, fx: fx };
  }

  // Start of a week: echoes that are due, exam results, the grades rule, and Nour's rescue.
  function beginWeek(s) {
    s.queue = [];
    s.closed = false;
    var due = s.echoes.filter(function (e) { return e.due <= s.week; });
    s.echoes = s.echoes.filter(function (e) { return e.due > s.week; });
    due.forEach(function (e) { s.queue.push(echoCard(s, e)); });
    for (var t = 0; t < EXAM_SEASONS.length - 1; t++) {
      if (s.week === EXAM_SEASONS[t][1] + 1) s.queue.push(examCard(s, t + 1, false));
    }
    if (!s.closed && s.grades < GRADES_FLOOR) {
      s.closed = true;
      s.queue.push({ type: "closed", who: s.week % 2 ? "mum" : "dad", idea: "grades" });
    } else if (!s.closed && s.coins < unitCost(s) && s.stock === 0 && s.rescues < 2) {
      s.rescues++;
      s.coins += RESCUE;
      s.queue.push({ type: "rescue" });
    }
    s.phase = s.queue.length ? "cards" : "plan";
  }

  function findDilemma(id) { for (var i = 0; i < C.dilemmas.length; i++) if (C.dilemmas[i].id === id) return C.dilemmas[i]; return null; }

  function echoCard(s, e) {
    var d = findDilemma(e.id), ec = d[e.opt].echo;
    applyFx(s, ec.fx);
    addMods(s, ec.fx && ec.fx.mods, s.week);
    return { type: "echo", id: e.id, opt: e.opt, from: e.from };
  }

  // Paused week (grades rule or a low exam): no work, study counts, a little rest.
  function closeWeek(s) {
    s.closedWeeks++;
    s.studyWeeks++;
    s.grades = clamp(s.grades + 14, 0, 100);
    s.energy = clamp(s.energy + 10, 0, 100);
    s.promoLast = false;
    s.history.push({ week: s.week, closed: true, energy: s.energy, rep: s.rep, coins: s.coins, grades: s.grades });
  }

  // plan = { price: 0|1|2, make: n, activity: promote|learn|study|rest }
  function sell(s, plan) {
    var b = biz(s), price = b.prices[plan.price];
    var make = clamp(Math.floor(plan.make) || 0, 0, maxMake(s));
    var spent = makeCost(s, make);
    s.coins -= spent;
    var sleepy = s.energy < SLEEPY;
    var cal = s.cal[s.week - 1];
    var exp = expectedCustomers(s, plan);
    var customers = Math.max(0, Math.round(exp * (0.85 + rand(s) * 0.3)));
    var available = make + s.stock;
    var sold = Math.min(available, customers);
    var unserved = customers - sold;
    var revenue = sold * price;
    var left = available - sold;
    var wasted = b.spoils ? left : 0;
    var kept = b.spoils ? 0 : left;
    var mistake = 0;
    if (sleepy && revenue > 0 && rand(s) < 0.75) mistake = Math.min(revenue, randInt(s, 3, 8));
    var bonus = Math.round(modSum(s, "bonus"));
    var profit = revenue + bonus - spent - mistake;
    var share = modProduct(s, "share");
    var partner = share < 1 && profit > 0 ? Math.round(profit * (1 - share)) : 0;
    s.coins = Math.max(0, s.coins + revenue + bonus - mistake - partner);
    s.stock = kept;

    // Reputation: price, quality, turned-away customers, a worn-out seller.
    var dr = [3, 1, -2][plan.price];
    if (s.quality >= 70) dr += 2; else if (s.quality < 25) dr -= 1;
    if (unserved >= 3) dr -= 2;
    if (sleepy) dr -= 2;
    s.rep = clamp(s.rep + dr, 0, 100);

    // Energy: the work drains it (more units, more work), the activity, a night's sleep.
    var drain = Math.round((9 + make / 2.5) * modProduct(s, "energyUse"));
    var act = { rest: 26, promote: -4, learn: -4, study: -3 }[plan.activity] || 0;
    s.energy = clamp(s.energy + 8 - drain + act, 0, 100);
    if (plan.activity === "learn") s.quality = clamp(s.quality + 12, 0, 100);
    // Grades: studying lifts them, every other week lets them slide (faster in exam season).
    if (plan.activity === "study") { s.grades = clamp(s.grades + 9, 0, 100); s.studyWeeks++; }
    else s.grades = clamp(s.grades - (cal === "exams" ? 8 : 3), 0, 100);
    s.promoLast = plan.activity === "promote";

    var ideas = [];
    if (profit > 0) seeIdea(s, "profit", ideas);
    if (wasted >= 2) seeIdea(s, "waste", ideas);
    if (unserved >= 3) seeIdea(s, "soldout", ideas);
    if (kept >= 2) seeIdea(s, "stock", ideas);
    if (mistake) seeIdea(s, "tired", ideas);
    if (plan.activity === "promote") seeIdea(s, "promote", ideas);
    if (s.quality >= 70) seeIdea(s, "quality", ideas);
    if (plan.price === 2 && sold > 0) seeIdea(s, "premium", ideas);
    if (cal === "exams") seeIdea(s, "exams", ideas);
    if (s.rep >= 70) seeIdea(s, "reputation", ideas);

    var r = { week: s.week, price: price, priceIdx: plan.price, activity: plan.activity, make: make, available: available, customers: customers, sold: sold,
              unserved: unserved, revenue: revenue, spent: spent, profit: profit, partner: partner, bonus: bonus,
              wasted: wasted, kept: kept, mistake: mistake, sleepy: sleepy, ideas: ideas,
              cal: cal, energy: s.energy, rep: s.rep, coins: s.coins, grades: s.grades };
    s.history.push(r);
    s.last = r;
    return r;
  }

  // kind: "small" | "big" | null (save it)
  function treat(s, kind) {
    var t = TREATS[kind];
    if (t && s.coins >= t.coins) {
      s.coins -= t.coins;
      s.energy = clamp(s.energy + t.energy, 0, 100);
      s.treats = (s.treats || 0) + 1;
      return true;
    }
    if (!kind) seeIdea(s, "saving", []);
    return false;
  }

  function eligible(s, d) {
    if (d.biz !== "all" && d.biz !== s.biz) return false;
    if (s.used.indexOf(d.id) >= 0) return false;
    var w = d.when || {};
    if (w.minWeek && s.week < w.minWeek) return false;
    if (w.minCoins && s.coins < w.minCoins) return false;
    if (w.examNext && !(s.week < WEEKS && s.cal[s.week] === "exams" && s.cal[s.week - 1] !== "exams")) return false;
    if (w.quietNext && !(s.week < WEEKS && s.cal[s.week] === "quiet")) return false;
    return true;
  }

  // Most weeks get a dilemma; a long year needs breathing room. Side-hustle ones are a little more likely.
  function pickDilemma(s) {
    if (s.week < 2 || rand(s) > 0.62) return null;
    var pool = C.dilemmas.filter(function (d) { return eligible(s, d); });
    if (!pool.length) return null;
    var timed = pool.filter(function (d) { return d.when && (d.when.examNext || d.when.quietNext); });
    if (timed.length) return timed[0];
    var total = 0;
    var w = pool.map(function (d) { var x = d.biz === "all" ? 1 : 1.5; total += x; return x; });
    var r = rand(s) * total;
    for (var i = 0; i < pool.length; i++) { r -= w[i]; if (r <= 0) return pool[i]; }
    return pool[pool.length - 1];
  }

  function canOpen(s, d, opt) { return opt !== "C" || (d.C && s.energy >= (d.C.needs || DOOR)); }

  function choose(s, d, opt) {
    if (!canOpen(s, d, opt)) return null;
    var o = d[opt];
    s.used.push(d.id);
    applyFx(s, o.fx);
    addMods(s, o.fx && o.fx.mods, s.week + 1);
    if (o.echo) s.echoes.push({ id: d.id, opt: opt, from: s.week, due: s.week + randInt(s, o.echo.after[0], o.echo.after[1]) });
    var fresh = [];
    seeIdea(s, d.id, fresh);
    s.log.push({ week: s.week, id: d.id, opt: opt });
    return { option: o, fresh: fresh.length > 0 };
  }

  // After the week: goal check, then the next week or the end of the year.
  function endWeek(s) {
    var g = goalOf(s), hit = false;
    if (!s.goalDone && s.coins >= g.coins) { s.goalDone = true; s.goalWeek = s.week; s.coins -= g.coins; hit = true; }
    if (s.week >= WEEKS) {
      s.queue = s.echoes.map(function (e) { return echoCard(s, e); });
      s.echoes = [];
      s.queue.push(examCard(s, EXAM_SEASONS.length, true));
      if (!s.goalDone && s.coins >= g.coins) { s.goalDone = true; s.goalWeek = s.week; s.coins -= g.coins; hit = true; }
      s.phase = "finalCards";
    } else {
      s.week++;
      beginWeek(s);
    }
    return hit;
  }

  function stars(v, a, b) { return v >= b ? 3 : v >= a ? 2 : 1; }

  function report(s) {
    var sales = s.history.filter(function (h) { return !h.closed; });
    var made = 0, wasted = 0, profit = 0, en = 0, rp = 0, gr = 0;
    sales.forEach(function (h) { made += h.make; wasted += h.wasted; profit += h.profit; });
    s.history.forEach(function (h) { en += h.energy; rp += h.rep; gr += h.grades; });
    var n = Math.max(1, s.history.length);
    var waste = made ? (wasted + s.stock) / made : 0;
    var avgE = en / n, avgR = rp / n, avgG = gr / n;
    var money = 1 + (waste <= 0.15 ? 1 : 0) + (s.goalDone ? 1 : 0);
    var customers = stars(avgR, 50, 68);
    var balance = 1 + (avgE >= 50 ? 1 : 0) + (s.closedWeeks === 0 ? 1 : 0);
    var school = stars(avgG, 60, 75);
    var honesty = s.honestMinus === 0 && s.honestPlus > 0 ? 3 : s.honestPlus >= s.honestMinus ? 2 : 1;
    var saved = s.coins + (s.goalDone ? goalOf(s).coins : 0);
    return { money: money, customers: customers, balance: balance, school: school, honesty: honesty, profit: profit, saved: saved,
             avgEnergy: Math.round(avgE), avgRep: Math.round(avgR), avgGrades: Math.round(avgG), waste: waste,
             studyWeeks: s.studyWeeks, closedWeeks: s.closedWeeks, grades: s.grades };
  }

  var Engine = { WEEKS: WEEKS, DOOR: DOOR, SLEEPY: SLEEPY, TREATS: TREATS, GRADES_FLOOR: GRADES_FLOOR, newGame: newGame, beginWeek: beginWeek, closeWeek: closeWeek,
    sell: sell, treat: treat, pickDilemma: pickDilemma, choose: choose, canOpen: canOpen, endWeek: endWeek, report: report, isExamWeek: isExamWeek,
    guess: guess, makeCost: makeCost, maxMake: maxMake, unitCost: unitCost, goalOf: goalOf, findDilemma: findDilemma, rand: rand };
  root.TeenEngine = Engine;
  if (typeof module !== "undefined") module.exports = Engine;
  if (typeof document === "undefined") return;

  // ═══════════════════════════ UI ═══════════════════════════
  var KEY_GAME = "teen.v1.game", KEY_META = "teen.v1.meta";
  var MENTOR = "woman_office_worker";
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
  meta.seasons = meta.seasons || 0;

  var S = load(KEY_GAME);
  if (S && S.v !== 1) S = null;
  var ui = { plan: null, pending: null, setup: { name: "", avatar: "girl", biz: "tutor", goal: "course" } };
  var app = document.getElementById("app");

  function saveAll() { if (S) store(KEY_GAME, S); store(KEY_META, meta); }

  // ── text helpers ──
  function esc(x) { return String(x).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]; }); }
  // Keep numbers and signs readable inside Arabic: every number goes in an LTR isolate.
  function nums(html) { return html.replace(/[+−-]?\d+(?:[.,]\d+)*%?/g, function (m) { return '<bdi class="num" dir="ltr">' + m + "</bdi>"; }); }
  function L(o) { return o ? (o[meta.lang] != null ? o[meta.lang] : o.en) : ""; }
  function T(key, vars) {
    var s = L(C.ui[key]) || key;
    return s.replace(/\{(\w)\}/g, function (_, k) { return vars && vars[k] != null ? vars[k] : ""; });
  }
  function H(text) { return nums(esc(text)); }
  function sign(n) { return (n > 0 ? "+" : n < 0 ? "−" : "") + Math.abs(n); }
  function num(n, signed) { return '<bdi class="num" dir="ltr">' + (signed ? sign(n) : n) + "</bdi>"; }
  function pair(a, b) { return '<bdi class="num" dir="ltr">' + a + " / " + b + "</bdi>"; }
  function img(name, cls) { return '<img src="img/' + name + '.webp" alt="" class="' + (cls || "") + '" draggable="false">'; }
  function nameHtml() { return '<bdi>' + esc(S.name) + "</bdi>"; }

  function applyChrome() {
    document.documentElement.lang = meta.lang;
    document.documentElement.dir = meta.lang === "ar" ? "rtl" : "ltr";
    document.documentElement.dataset.theme = meta.theme;
    document.title = T("title");
    document.body.classList.toggle("sleepy", !!(S && S.phase !== "end" && S.phase !== "start" && S.energy < SLEEPY && onGameScreen));
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
    var g = Engine.goalOf(S);
    var pct = S.goalDone ? 100 : Math.min(100, Math.round((S.coins / g.coins) * 100));
    return '<header class="top">' +
      '<div class="who">' + img(S.avatar, "av") + '<span class="nm">' + nameHtml() + '</span><span class="wk">' + H(T("week", { n: S.week })) + "</span></div>" +
      '<div class="meters">' +
        meter("coin", T("coins"), S.coins, "m-coins") +
        meter("high_voltage", T("energy"), S.energy, "m-energy" + (S.energy < SLEEPY ? " low" : S.energy >= Engine.DOOR ? " high" : "")) +
        meter("heart_hands", T("rep"), S.rep, "m-rep") +
        meter("graduation_cap", T("grades"), S.grades, "m-grades" + (S.grades < 55 ? " low" : "")) +
      "</div>" +
      '<div class="piggy" title="' + esc(T("goal")) + '">' + img("pig_face", "pig") +
        '<div class="bar"><i style="width:' + pct + '%"></i></div>' + img(g.img, "gimg") +
        '<span class="pnum">' + (S.goalDone ? "✓" : pair(S.coins, g.coins)) + "</span></div>" +
      "</header>";
  }
  function meter(icon, label, v, cls) {
    return '<div class="meter ' + cls + '" aria-label="' + esc(label) + " " + v + '">' + img(icon) + '<b>' + num(v) + "</b><small>" + esc(label) + "</small></div>";
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
          '<div class="float">' + img("laptop", "f1") + img("cupcake", "f2") + img("mobile_phone", "f3") + img("artist_palette", "f4") + "</div>" +
          img(MENTOR, "grandpa") +
        "</div>" +
        '<h1 class="title">' + esc(T("title")) + "</h1>" +
        '<p class="lead">' + esc(T("subtitle")) + "</p>" +
        '<div class="stack">' +
          (canResume ? '<button class="btn primary big" data-act="resume">' + esc(T("resume")) + " · " + H(T("week", { n: S.week })) + "</button>" : "") +
          '<button class="btn ' + (canResume ? "" : "primary big") + '" data-act="new">' + esc(T("newGame")) + "</button>" +
          '<div class="row2"><button class="btn" data-act="how">' + img("light_bulb", "ic") + esc(T("howTo")) + "</button>" +
          '<button class="btn" data-act="stickers">' + img("notebook", "ic") + esc(T("stickers")) + "</button></div>" +
          '<button class="btn ghost" data-act="parents">' + esc(T("parents")) + "</button>" +
        "</div>" +
        footer() +
      "</main>");
    wireChrome(home);
    on('[data-act="resume"]', function () { resume(); });
    on('[data-act="new"]', function () {
      if (canResume && S.week > 1 && !confirm(T("resetQ"))) return;
      setup();
    });
    on('[data-act="how"]', howTo);
    on('[data-act="stickers"]', stickerBook);
    on('[data-act="parents"]', parents);
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

  function parents() {
    page("parents", '<div class="card note">' + img("house", "big") + C.parentsNote[meta.lang].map(function (p) { return "<p>" + H(p) + "</p>"; }).join("") + "</div>", parents);
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
        '<div class="q">' + esc(T("bizQ")) + "</div>" +
        '<div class="grid2">' + Object.keys(C.businesses).map(function (k) {
          var b = C.businesses[k];
          return '<button class="pick biz' + (st.biz === k ? " on" : "") + '" data-biz="' + k + '" aria-pressed="' + (st.biz === k) + '">' + img(b.img) + "<b>" + esc(L(b.name)) + "</b><small>" + H(L(b.tag)) + "</small></button>";
        }).join("") + "</div>" +
        '<div class="q">' + esc(T("goalQ")) + "</div>" +
        '<div class="grid2">' + C.goals.map(function (g) {
          return '<button class="pick goal' + (st.goal === g.id ? " on" : "") + '" data-goal="' + g.id + '" aria-pressed="' + (st.goal === g.id) + '">' + img(g.img) + "<b>" + esc(L(g.name)) + "</b><span>" + img("coin", "tiny") + num(g.coins) + "</span></button>";
        }).join("") + "</div>" +
        '<div class="sticky"><button class="btn primary big" data-act="start">' + esc(T("start")) + "</button></div>" +
        "</main>");
      wireChrome(render);
      var nm = app.querySelector("#nm");
      nm.addEventListener("input", function () { st.name = nm.value; });
      on("[data-av]", function (el) { st.avatar = el.dataset.av; render(); });
      on("[data-biz]", function (el) { st.biz = el.dataset.biz; render(); });
      on("[data-goal]", function (el) { st.goal = el.dataset.goal; render(); });
      on('[data-act="start"]', function () {
        var name = (st.name || "").trim().slice(0, 14);
        if (!name) { nm.classList.add("shake"); nm.placeholder = T("needName"); nm.focus(); setTimeout(function () { nm.classList.remove("shake"); }, 500); return; }
        var seed = params.get("seed");
        S = Engine.newGame({ name: name, avatar: st.avatar, biz: st.biz, goal: st.goal, seed: seed != null ? Number(seed) : undefined });
        Engine.beginWeek(S);
        saveAll();
        resume();
      });
    }
    render();
  }

  // Route to whatever the saved state says comes next.
  function resume() {
    if (!S) return home();
    if (S.phase === "cards" || S.phase === "finalCards") return cards();
    if (S.phase === "plan") return plan();
    if (S.phase === "results") return results();
    if (S.phase === "treat") return results();
    if (S.phase === "dilemma") return dilemma();
    if (S.phase === "idea") return afterChoice();
    if (S.phase === "end") return endScreen();
    if (S.phase === "start") { Engine.beginWeek(S); saveAll(); return resume(); }
    home();
  }

  function gameShell(inner, cls) {
    show('<div class="game ' + (cls || "") + '">' + topbar() + '<main class="screen">' + inner + "</main>" +
      '<nav class="mini">' + '<button class="chip" data-act="home">' + img("house", "tiny") + "</button>" + langBtn() + themeBtn() + "</nav></div>", { game: true });
    wireChrome(resume);
  }

  // ── Cards: echoes, exam results, the grades pause, rescue, goal ──
  function cards() {
    var c = S.queue[0];
    if (!c) {
      if (S.phase === "finalCards") { S.phase = "end"; saveAll(); return endScreen(); }
      if (S.closed) { Engine.closeWeek(S); return toDilemma(); }
      S.phase = "plan"; saveAll(); return plan();
    }
    var html;
    if (c.type === "echo") {
      var d = Engine.findDilemma(c.id), e = d[c.opt].echo;
      html = card(e.img, L(e.title), L(e.text), '<p class="because">' + img("hourglass_not_done", "tiny") + "<span>" + H(T("echoFrom", { n: c.from })) + "</span></p>" + fxLine(e.fx), "echo");
    } else if (c.type === "closed") {
      html = card(c.who === "mum" ? "woman" : "man", T("closedTitle"), T(c.who === "mum" ? "closedMum" : "closedDad"), ideaBox(c.idea, true), "closed");
    } else if (c.type === "exam") {
      var key = c.band === "great" ? "examGreat" : c.band === "ok" ? "examOk" : c.final ? "examLowFinal" : "examLow";
      html = card(c.band === "great" ? "trophy" : c.band === "ok" ? "check_mark_button" : "books", T("examTitle", { n: c.term }), T(key, { n: c.grades }),
        fxLine(c.fx) + (c.band === "low" && !c.final ? ideaBox("grades", true) : ""), "exam exam-" + c.band);
    } else if (c.type === "rescue") {
      html = card(MENTOR, T("rescueTitle"), T("rescueText"), fxLine({ coins: 30 }), "rescue");
    } else if (c.type === "goal") {
      var g = Engine.goalOf(S);
      html = card(g.img, T("goalHit"), L(g.name), '<div class="confetti">' + img("party_popper") + img("sparkles") + img("glowing_star") + "</div>", "goal");
    }
    gameShell(html + '<div class="sticky"><button class="btn primary big" data-act="ok" data-focus>' + esc(T("ok")) + "</button></div>");
    on('[data-act="ok"]', function () {
      if (c.type === "closed" && c.idea) collect(c.idea);
      if (c.type === "exam" && c.band === "low" && !c.final) collect("grades");
      S.queue.shift(); saveAll(); cards();
    });
  }

  function card(image, title, text, extra, cls) {
    return '<section class="card big-card ' + (cls || "") + '">' + img(image, "hero-img") + "<h2>" + H(title) + "</h2><p>" + H(text) + "</p>" + (extra || "") + "</section>";
  }

  function fxLine(fx) {
    if (!fx) return "";
    var bits = [];
    if (fx.coins) bits.push(img("coin", "tiny") + num(fx.coins, true));
    if (fx.energy) bits.push(img("high_voltage", "tiny") + num(fx.energy, true));
    if (fx.rep) bits.push(img("heart_hands", "tiny") + num(fx.rep, true));
    if (fx.grades) bits.push(img("graduation_cap", "tiny") + num(fx.grades, true));
    if (fx.quality) bits.push(img("glowing_star", "tiny") + num(fx.quality, true));
    return bits.length ? '<div class="fx">' + bits.map(function (b) { return "<span>" + b + "</span>"; }).join("") + "</div>" : "";
  }

  function collect(id) {
    if (meta.stickers.indexOf(id) < 0) { meta.stickers.push(id); saveAll(); return true; }
    return false;
  }
  function ideaBox(id, isSystem) {
    var o = isSystem ? C.ideas[id] : Engine.findDilemma(id).idea;
    var isNew = meta.stickers.indexOf(id) < 0;
    return '<div class="idea">' + img(MENTOR, "gp") + "<div><b>" + esc(T("ideaTitle")) + (isNew ? ' <span class="new">' + esc(T("newSticker")) + "</span>" : "") + "</b><p>" + H(L(o)) + "</p></div></div>";
  }

  // ── Plan ──
  function plan() {
    var b = C.businesses[S.biz];
    var calNow = S.cal[S.week - 1];
    if (!ui.plan || ui.plan.week !== S.week) {
      var p0 = { week: S.week, price: 1, activity: (calNow === "exams" || S.grades < 55) ? "study" : S.energy < 50 ? "rest" : "promote" };
      p0.make = Math.max(0, Math.min(Engine.maxMake(S), Engine.guess(S, p0) - S.stock));
      ui.plan = p0;
    }
    var p = ui.plan;
    p.make = Math.min(p.make, Engine.maxMake(S));
    var wNow = C.calendar[calNow], wNext = S.week < Engine.WEEKS ? C.calendar[S.cal[S.week]] : null;
    var cost = Engine.makeCost(S, p.make);
    var html =
      '<h2 class="h">' + esc(T("planTitle")) + "</h2>" +
      (calNow === "exams" ? '<div class="warn">' + img("memo", "tiny") + "<span>" + esc(T("examWarn")) + "</span></div>" :
        S.grades < 55 ? '<div class="warn">' + img("graduation_cap", "tiny") + "<span>" + H(T("gradesWarn")) + "</span></div>" : "") +
      (S.energy < SLEEPY ? '<div class="warn sleepy-warn">' + img("yawning_face", "tiny") + "<span>" + esc(T("sleepyWarn")) + "</span></div>" : "") +
      '<section class="card weather"><div>' + img(wNow.img, "wimg") + "<div><small>" + esc(T("forecast")) + "</small><b>" + esc(L(wNow)) + "</b></div></div>" +
        (wNext ? '<div class="next"><small>' + esc(T("nextWeek")) + "</small>" + img(wNext.img, "tiny") + "<span>" + esc(L(wNext)) + "</span></div>" : "") + "</section>" +
      '<section class="card"><div class="q">' + esc(T("priceQ")) + "</div>" +
        '<div class="seg">' + b.prices.map(function (pr, i) {
          return '<button class="opt' + (p.price === i ? " on" : "") + '" data-price="' + i + '" aria-pressed="' + (p.price === i) + '"><small>' + esc(L(C.prices[i])) + "</small><b>" + img("coin", "tiny") + num(pr) + "</b></button>";
        }).join("") + "</div></section>" +
      '<section class="card"><div class="q">' + esc(T("makeQ")) + ' <span class="unit">' + img(b.img, "tiny") + esc(L(b.item)) + "</span></div>" +
        '<div class="stepper"><button class="step" data-mk="-1" aria-label="−1">−</button><output class="mk">' + num(p.make) + '</output><button class="step" data-mk="1" aria-label="+1">+</button></div>' +
        '<div class="mkinfo"><span>' + H(T("makeCost", { n: cost })) + "</span>" + (S.stock ? '<span class="stock">' + H(T("inStock", { n: S.stock })) + "</span>" : "") + "</div>" +
        '<div class="guess">' + img(MENTOR, "tiny") + "<span>" + H(T("guess", { n: Engine.guess(S, p) })) + "</span></div>" +
        (p.make >= Engine.maxMake(S) && Engine.maxMake(S) < 40 ? '<div class="muted small">' + esc(T("tooPoor")) + "</div>" : "") +
        '<div class="muted small">' + esc(T("quality")) + " " + pair(S.quality, 100) + "</div></section>" +
      '<section class="card"><div class="q">' + esc(T("activityQ")) + "</div>" +
        '<div class="acts">' + Object.keys(C.activities).map(function (k) {
          var a = C.activities[k];
          return '<button class="act' + (p.activity === k ? " on" : "") + '" data-actv="' + k + '" aria-pressed="' + (p.activity === k) + '">' + img(a.img) + "<b>" + esc(L(a)) + "</b><small>" + esc(L(a.hint)) + "</small></button>";
        }).join("") + "</div></section>" +
      '<div class="sticky"><button class="btn primary big" data-act="open">' + img(b.img, "tiny") + esc(T("open")) + "</button></div>";
    gameShell(html, "plan");
    on("[data-price]", function (el) { p.price = +el.dataset.price; plan(); });
    on("[data-actv]", function (el) { p.activity = el.dataset.actv; plan(); });
    on("[data-mk]", function (el) { p.make = clamp(p.make + +el.dataset.mk, 0, Engine.maxMake(S)); plan(); });
    on('[data-act="open"]', function () { sellDay(); });
  }

  // ── Work week ──
  function sellDay() {
    var p = ui.plan;
    var r = Engine.sell(S, { price: p.price, make: p.make, activity: p.activity });
    S.phase = "results";
    saveAll();
    var b = C.businesses[S.biz];
    var people = ["boy", "girl", "woman", "man", "old_woman", "child", "old_man"];
    var shown = Math.min(r.customers, 14);
    var walkers = "";
    for (var i = 0; i < shown; i++) {
      var got = i < Math.min(r.sold, shown);
      walkers += '<span class="walker' + (got ? " buys" : " sad") + '" style="--i:' + i + ";--n:" + shown + '">' + img(people[i % people.length]) + "</span>";
    }
    gameShell(
      '<h2 class="h center">' + esc(T("sellTitle")) + "</h2>" +
      '<section class="stand w-' + r.cal + '">' +
        '<div class="sky">' + img(C.calendar[r.cal].img, "sun") + "</div>" +
        '<div class="lane">' + walkers + "</div>" +
        '<div class="booth">' + img(b.img, "prod") + img(S.avatar, "seller") + "</div>" +
      "</section>" +
      '<p class="center tally">' + H(T("customersCame", { n: r.customers })) + "</p>" +
      '<div class="sticky"><button class="btn big" data-act="skip">' + esc(T("skip")) + "</button></div>", "sell");
    var done = false;
    function go() { if (done) return; done = true; results(); }
    on('[data-act="skip"]', go);
    setTimeout(go, FAST ? 200 : 3200 + shown * 60);
  }

  // ── Results + treat ──
  function results() {
    var r = S.last;
    if (!r) { S.phase = "plan"; return plan(); }
    var rows = [
      [T("sold"), pair(r.sold, r.available)],
      [T("coinsIn"), num(r.revenue, true)],
      [T("coinsSpent"), num(-r.spent, true)],
    ];
    if (r.bonus) rows.push([T("bonus"), num(r.bonus, true)]);
    if (r.mistake) rows.push([T("mistake"), num(-r.mistake, true)]);
    var html = '<h2 class="h">' + esc(T("resultsTitle")) + "</h2>" +
      '<section class="card results"><table>' + rows.map(function (x) { return "<tr><td>" + esc(x[0]) + "</td><td>" + x[1] + "</td></tr>"; }).join("") +
        '<tr class="tot"><td>' + esc(T("profit")) + "</td><td>" + num(r.profit, true) + "</td></tr>" +
        (r.partner ? "<tr><td>" + esc(T("partnerCut")) + "</td><td>" + num(-r.partner, true) + "</td></tr>" : "") +
      "</table>" +
      '<p class="sum">' + H(T("profitSum", { a: r.revenue + r.bonus, b: r.spent + r.mistake, c: sign(r.profit) })) + "</p>" +
      (r.wasted ? '<p class="bad">' + img("grimacing_face", "tiny") + "<span>" + esc(T("wasted")) + ": " + num(r.wasted) + "</span></p>" : "") +
      (r.kept ? '<p class="okay">' + img("package", "tiny") + "<span>" + esc(T("kept")) + ": " + num(r.kept) + "</span></p>" : "") +
      (r.unserved >= 3 ? '<p class="bad">' + img("package", "tiny") + "<span>" + H(T("soldOut", { n: r.unserved })) + "</span></p>" : "") +
      "</section>" +
      (r.ideas || []).map(function (id) { return ideaBox(id, true); }).join("");
    var canTreat = S.coins >= Engine.TREATS.small.coins && r.profit > 0;
    if (S.phase === "results" && canTreat) {
      html += '<section class="card treat">' + img("soft_ice_cream", "tiny") + "<b>" + esc(T("treatQ")) + "</b>" +
        '<div class="treats"><button class="btn" data-treat="small">' + img("soft_ice_cream", "tiny") + H(T("treatYes")) + "</button>" +
        (S.coins >= Engine.TREATS.big.coins ? '<button class="btn" data-treat="big">' + img("sparkles", "tiny") + H(T("treatBig")) + "</button>" : "") +
        '<button class="btn primary" data-treat="save">' + img("pig_face", "tiny") + esc(T("treatNo")) + "</button></div></section>";
    } else {
      html += '<div class="sticky"><button class="btn primary big" data-act="next" data-focus>' + esc(T("next")) + "</button></div>";
    }
    gameShell(html, "results");
    function done() { (r.ideas || []).forEach(collect); S.phase = "treat"; toDilemma(); }
    on("[data-treat]", function (el) { var k = el.dataset.treat; Engine.treat(S, k === "save" ? null : k); if (k === "save") collect("saving"); done(); });
    on('[data-act="next"]', done);
  }

  // ── Dilemma ──
  function toDilemma() {
    var d = Engine.pickDilemma(S);
    if (d) { S.pending = d.id; S.phase = "dilemma"; saveAll(); return dilemma(); }
    finishWeek();
  }

  function dilemma() {
    var d = Engine.findDilemma(S.pending);
    if (!d) return finishWeek();
    var opts = ["A", "B"].concat(d.C ? ["C"] : []);
    var html = '<section class="card dilemma">' + img(d.img, "hero-img") + "<h2>" + H(L(d.title)) + "</h2><p>" + H(L(d.text)) + "</p></section>" +
      '<div class="choices">' + opts.map(function (k) {
        var o = d[k], open = Engine.canOpen(S, d, k);
        if (k === "C") {
          return '<button class="choice door' + (open ? " open" : " locked") + '" data-opt="C"' + (open ? "" : " disabled aria-disabled=\"true\"") + ">" +
            img(open ? "unlocked" : "locked", "tiny") + '<span><small>' + esc(T("thirdDoor")) + "</small>" + H(L(o.label)) + "</span>" +
            (open ? "" : '<em class="need">' + img("high_voltage", "tiny") + "<span>" + H(T("locked", { n: o.needs || Engine.DOOR })) + "</span></em>") + "</button>";
        }
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
    on('[data-act="next"]', function () { collect(d.id); finishWeek(); });
  }

  function finishWeek() {
    S.pending = null;
    var hit = Engine.endWeek(S);
    if (hit) {
      if (S.phase === "plan") S.phase = "cards";
      S.queue.unshift({ type: "goal" });
    }
    ui.plan = null;
    saveAll();
    resume();
  }

  // ── End of the school year ──
  function endScreen() {
    var r = Engine.report(S), g = Engine.goalOf(S);
    if (!S.counted) { S.counted = true; meta.seasons++; saveAll(); }
    var lines = [L(C.endLines[S.goalDone ? "win" : "notYet"])];
    var skills = [["Money", r.money, "money"], ["Customers", r.customers, "customers"], ["Balance", r.balance, "balance"], ["School", r.school, "school"], ["Honesty", r.honesty, "honesty"]];
    var low = skills.slice().sort(function (a, b) { return a[1] - b[1]; })[0];
    var high = skills.slice().sort(function (a, b) { return b[1] - a[1]; })[0];
    lines.push(L(C.endLines[high[2] + "High"]));
    if (low[1] < 3 && low !== high) lines.push(L(C.endLines[low[2] + "Low"]));
    var pct = Math.min(100, Math.round((r.saved / g.coins) * 100));
    var html =
      '<section class="card big-card end">' + img(S.goalDone ? g.img : "graduation_cap", "hero-img") +
        "<h2>" + esc(T(S.goalDone ? "goalHit" : "endTitle")) + "</h2>" +
        "<p>" + (S.goalDone ? H(T("endWin", { a: r.saved, b: L(g.name) })) : H(T("endNotYet", { a: r.saved, b: g.coins, c: pct }))) + "</p></section>" +
      '<section class="card grandpa">' + img(MENTOR, "gp") + "<div><b>" + esc(T("endMentor")) + "</b>" + lines.map(function (x) { return "<p>" + H(x) + "</p>"; }).join("") + "</div></section>" +
      '<section class="card report"><h3>' + esc(T("report")) + "</h3>" +
        skills.map(function (k) { return '<div class="skill" data-skill="' + k[2] + '" data-stars="' + k[1] + '"><span>' + esc(T("skill" + k[0])) + '</span><span class="stars">' + "★★★".slice(0, k[1]) + '<i>' + "★★★".slice(k[1]) + "</i></span></div>"; }).join("") +
        '<div class="kv"><span>' + esc(T("totalProfit")) + "</span>" + num(r.profit, true) + "</div>" +
        '<div class="kv"><span>' + esc(T("weeksStudied")) + "</span>" + pair(r.studyWeeks, Engine.WEEKS) + "</div>" +
        '<div class="kv"><span>' + esc(T("finalGrades")) + "</span>" + pair(r.grades, 100) + "</div>" +
      "</section>" +
      '<div class="stack"><button class="btn primary big" data-act="again">' + esc(T("again")) + '</button><button class="btn" data-act="stickers">' + img("notebook", "ic") + esc(T("stickers")) + "</button></div>";
    gameShell(html, "endscr");
    on('[data-act="again"]', function () { ui.setup.name = S.name; ui.setup.avatar = S.avatar; ui.setup.biz = S.biz; ui.setup.goal = S.goal; S = null; drop(KEY_GAME); setup(); });
    on('[data-act="stickers"]', stickerBook);
  }

  // Test hook (local only, no network): lets the Playwright script read state.
  root.__teen = { get state() { return S; }, meta: meta, engine: Engine };

  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1") && !params.has("nosw")) {
    navigator.serviceWorker.register("sw.js").catch(function () { /* offline support is optional */ });
  }

  if (S && params.has("new")) { S = null; drop(KEY_GAME); }
  home();
})(typeof window !== "undefined" ? window : globalThis);
