  // ================================================================ book
  // "Play this week": every decision chapter of the book Founder Fog has a
  // code (FOG-W07 = week 7). The code, or a link with ?book=W07 / #book=W07,
  // opens that week of a B2B SaaS company with the book's ledger roughly in
  // place and that chapter's decision in front of the player. After it the
  // game carries on normally from that week.
  // shares App's scope (see economy.js / market.js / org.js / stories.js).

  // week, chapter, clarity, what comes first, and the ledger for that week
  // (src: a dilemma id, POP_ for the original game's events, tgt: a weekly
  // target template from module 264, mail: an inbox card)
  const FOG_BOOK = [
    { week: 1, ch: 5, clarity: 85, src: "POP_001", cash: 38000, mrr: 0, team: 2, users: 100, morale: 85, pmf: 15, debt: 15 },
    { week: 3, ch: 6, clarity: 80, tgt: "ms_first_ten", cash: 36500, mrr: 2400, team: 2, users: 130, morale: 84, pmf: 18, debt: 16 },
    { week: 7, ch: 7, clarity: 68, src: "dl_prod_01", cash: 31000, mrr: 3400, team: 2, users: 210, morale: 82, pmf: 24, debt: 20 },
    { week: 11, ch: 8, clarity: 72, src: "dl_ppl_11", cash: 172000, mrr: 5200, team: 3, users: 380, morale: 80, pmf: 30, debt: 22, runway: 18 },
    { week: 14, ch: 9, clarity: 62, src: "dl_prod_11", cash: 160000, mrr: 7500, team: 4, users: 620, morale: 78, pmf: 36, debt: 24, runway: 16 },
    { week: 17, ch: 10, clarity: 58, src: "dl_mena_01", cash: 146000, mrr: 9000, team: 5, users: 760, morale: 75, pmf: 38, debt: 26, runway: 14 },
    { week: 20, ch: 11, clarity: 55, src: "dl_mena_07", cash: 128000, mrr: 10500, team: 6, users: 900, morale: 70, pmf: 40, debt: 28, runway: 10 },
    { week: 24, ch: 12, clarity: 50, src: "dl_life_09", cash: 98000, mrr: 12000, team: 7, users: 1050, morale: 66, pmf: 42, debt: 31, runway: 7 },
    { week: 27, ch: 13, clarity: 44, src: "dl_ppl_17", cash: 68000, mrr: 13000, team: 8, users: 1150, morale: 60, pmf: 42, debt: 34, runway: 4 },
    { week: 31, ch: 14, clarity: 38, src: "dl_ppl_07", cash: 61000, mrr: 13800, team: 8, users: 1220, morale: 52, pmf: 44, debt: 36, runway: 5 },
    { week: 34, ch: 15, clarity: 35, src: "dl_life_08", cash: 57000, mrr: 14800, team: 6, users: 1300, morale: 55, pmf: 45, debt: 36, runway: 6 },
    { week: 37, ch: 16, clarity: 28, src: "dl_life_13", cash: 52000, mrr: 16200, team: 6, users: 1420, morale: 58, pmf: 46, debt: 35, runway: 6 },
    { week: 41, ch: 17, clarity: 45, src: "dl_life_05", cash: 50000, mrr: 19000, team: 7, users: 1650, morale: 62, pmf: 50, debt: 33, runway: 8 },
    { week: 44, ch: 18, clarity: 52, mail: "mx_thread_04", cash: 51000, mrr: 20500, team: 8, users: 1800, morale: 64, pmf: 52, debt: 32, runway: 9 },
    { week: 48, ch: 19, clarity: 58, src: "dl_mena_20", cash: 56000, mrr: 22500, team: 9, users: 2050, morale: 68, pmf: 55, debt: 30, runway: 12 },
    { week: 52, ch: 20, clarity: 64, tgt: "ms_reflect", cash: 62000, mrr: 24000, team: 9, users: 2400, morale: 72, pmf: 58, debt: 28, runway: 15 },
  ];
  // the jobs people are hired into, in the order the company in the book hires them
  const FOG_BOOK_JOBS = ["sales", "engineer", "marketer", "support", "designer", "engineer", "operator", "sales"];
  const fogBookCode = (b) => "FOG-W" + (b.week < 10 ? "0" : "") + b.week;
  // "FOG-W07", "fog w7", "W07", "7" all find week 7
  function fogBookFind(code) {
    const m = String(code || "")
      .replace(/[\u0660-\u0669]/g, (d) => d.charCodeAt(0) - 0x0660) // Arabic-Indic digits
      .replace(/[\u06f0-\u06f9]/g, (d) => d.charCodeAt(0) - 0x06f0) // Persian digits
      .toUpperCase()
      .replace(/[\s_\-–—.]/g, "")
      .match(/^(?:FOG)?W?0*(\d{1,2})$/);
    return (m && FOG_BOOK.find((b) => b.week === +m[1])) || null;
  }
  // ?book=W07 or #book=W07 on the game's URL
  function fogBookFromUrl() {
    try {
      const m = (window.location.search + "&" + window.location.hash).match(/[?&#]book=([^&#]+)/i);
      return m ? fogBookFind(decodeURIComponent(m[1])) : null;
    } catch (e) {
      return null;
    }
  }
  function fogBookClearUrl() {
    try {
      const u = window.location.pathname + window.location.search.replace(/([?&])book=[^&#]*&?/i, "$1").replace(/[?&]$/, "");
      window.history.replaceState(null, "", u);
    } catch (e) {}
  }

  // the weekly target, built the same way the engine's generator builds it (module 264)
  function fogBookTarget(s, id) {
    const G = typeof __r === "function" ? __r(264) : null,
      c = G && G.__template && G.__template(id);
    if (!c) return null;
    const p = c.build(s),
      t = s.week;
    return {
      week: t,
      generated: !0,
      challengeId: c.id,
      book: !0,
      title: p.title,
      tasks: p.tasks,
      reward_exp: p.reward_exp || 90,
      reward_cash: p.reward_cash,
      reward_clarity: p.reward_clarity,
      howToGuide: { whyItMatters: p.whyItMatters, strategies: p.strategies.map((e) => ({ ...e, id: `${e.id}_w${t}` })) },
    };
  }
  // the dilemma, straight from the library (no season or condition checks: the book decides when)
  function fogBookEvent(s, id) {
    if (/^POP_/.test(id)) {
      const ev = (Engine.POPUP_EVENTS_DATABASE || []).find((x) => x.id === id);
      if (!ev) return null;
      s.triggeredEventIds.includes(id) || s.triggeredEventIds.push(id);
      s.eventLastSeenWeek = { ...(s.eventLastSeenWeek || {}), [id]: s.week };
      return withDoors(ev);
    }
    const d = LIBRARY.find((x) => x.id === id);
    if (!d) return null;
    ensureStory(s).seen[d.id] = s.week;
    metDilemma(d.id);
    return dlCard(d);
  }

  // set the company up as it stands in that week of the book
  function applyFogBook(engine, b) {
    const s = engine.state,
      o = ensureOrg(s),
      m = ensureMarket(s),
      e = ensureEcon(s);
    s.week = b.week;
    s.month = Math.ceil(b.week / 4);
    s.cash = b.cash;
    s.monthlyRevenue = b.mrr;
    s.activeUsers = b.users;
    s.mentalClarity = b.clarity;
    s.teamMorale = b.morale;
    s.techDebt = b.debt;
    s.arpu = b.week >= 7 ? 50 : 25;
    s.churnRate = b.week >= 14 ? 3.5 : b.week >= 7 ? 4.2 : 5;
    s.stage = b.mrr >= 4e4 ? 3 : b.mrr >= 5e3 ? 2 : 1;
    s.slotUsed = !1;
    s.pendingEvent = null;
    s.lastPitchWeek = b.week >= 11 ? 10 : -99;
    // the team: founder and Tariq, then hires in the book's order, all past their ramp-up
    for (let k = 2; k < b.team; k++) {
      const c = Engine.generateCandidate(k),
        fn = FOG_BOOK_JOBS[k - 2] || "engineer";
      s.team.push({ id: c.id, name: c.name, role: ROLE_FNS[fn].title, fn: fn, archetypeKey: c.archetypeKey, archetypeLabel: c.archetypeLabel, archetypeColor: c.archetypeColor, archetypeBg: c.archetypeBg, salary: Math.round((c.salary * ROLE_FNS[fn].pay) / 50) * 50, hiredWeek: Math.max(1, b.week - 6 - 3 * (b.team - k)) });
    }
    o.hires = Math.max(0, b.team - 2);
    // Omar signs in week 2, Layla's $150k lands in week 10, Northwind signs in week 19
    const rel = (id) => (s.relationships || []).find((r) => r.id === id) || {};
    if (b.week >= 2) rel("c2").health = 72;
    if (b.week >= 19) rel("c1").health = 80;
    if (b.week >= 10) {
      rel("angel").health = 74;
      s.equity = 88;
      s.rounds = [{ week: 10, stage: 1, name: "Angel", amount: 150000, pct: 0.12, investor: "Layla Fahmy", pending: false }];
      if (!o.board) o.board = { investors: 1, trust: 68, nextMeeting: b.week + 4, ask: null };
    }
    m.pmf = m.base = b.pmf;
    // the economy: same stage, a growth history that matches the ledger, today's valuation
    e.stage = s.stage;
    e.hist = [0.72, 0.78, 0.84, 0.9, 0.95, 1].map((f) => Math.round(b.mrr * f));
    e.nextCreep = b.week + 13;
    e.moodUntil = b.week + 20;
    e.mood = "normal";
    // burn: whatever makes the runway match the book (the payroll is trimmed if it alone is too much)
    engine.recalculate();
    if (b.runway) {
      const f = moneyFlows(s),
        out = f.inflow + b.cash / b.runway,
        room = out - f.ops - (f.debt || 0) - 1200,
        pay = s.team.reduce((a, x) => a + (x.id === "emp_founder" || x.id === "emp_cto" ? 0 : x.salary || 0), 0),
        fixed = s.teamPayroll - pay;
      if (pay > 0 && fixed + pay > room) {
        const k = Math.max(0.6, (room - fixed) / pay);
        s.team.forEach((x) => x.id !== "emp_founder" && x.id !== "emp_cto" && (x.salary = Math.round((x.salary * k) / 50) * 50));
      }
      engine.recalculate();
      s.baseBurn = Math.max(1200, Math.round(out - f.ops - (f.debt || 0) - s.teamPayroll));
    }
    // the calendar is already where it should be, so the season isn't announced again
    ensureStory(s).season = season(s);
    e.premium = e.base = e.shown = null;
    s.valuation = valuationParts(s).base;
    s.currentTarget = null;
    engine.recalculate();
    s.cash = b.cash;

    // what the chapter puts in front of the player
    s.book = { code: fogBookCode(b), week: b.week, ch: b.ch, tgt: null };
    if (b.src) s.pendingEvent = fogBookEvent(s, b.src);
    if (b.tgt) {
      s.book.tgt = fogBookTarget(s, b.tgt);
      if (s.book.tgt) s.currentTarget = s.book.tgt;
    }
    if (b.mail) {
      const h = (MAIL_ALL.find((c) => c.id === b.mail) || {}).after;
      if (h) {
        s.mailLog = { ...(s.mailLog || {}), [h.id]: { side: h.side, week: b.week - h.weeks } };
        s.inboxSeen = { ...(s.inboxSeen || {}), [h.id]: b.week - h.weeks };
      }
      s.inbox = [{ id: b.mail, week: b.week }];
      s.inboxSeen = { ...(s.inboxSeen || {}), [b.mail]: b.week };
    }
    s.journalLog = (s.journalLog || []).filter((j) => j.week !== 1 || b.week === 1);
    engine.addLog(`📓 From the book: chapter ${b.ch}`, `Week ${b.week} of the company in the book. This is the decision from chapter ${b.ch}: choose a door. To try the other one, enter ${fogBookCode(b)} again.`, "mentor");
    engine.recalculate();
    s.cash = b.cash;
  }

  // the weekly target generator would replace the book's target on every recalculation
  (function () {
    const P = Engine.StartupEngine.prototype;
    if (P.__book) return;
    P.__book = true;
    const recalc = P.recalculate;
    P.recalculate = function () {
      const out = recalc.apply(this, arguments),
        s = this.state,
        t = s.book && s.book.tgt;
      if (t && s.week === t.week && (!s.currentTarget || s.currentTarget.challengeId !== t.challengeId)) s.currentTarget = t;
      return out;
    };
  })();
