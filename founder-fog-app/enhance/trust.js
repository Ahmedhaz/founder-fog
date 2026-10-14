  // ================================================================ trust
  // Four people whose trust a founder spends: Tariq (the co-founder), Nour (at
  // home), Layla (the lead investor) and the team. Built on what the game
  // already tracks, so nothing is counted twice:
  //   Tariq = his Circle relationship ("co"), Nour = hers ("nour"),
  //   Layla = investor trust, the team = morale.
  // Content moves them with fx.trust as an object, { tariq: +5, nour: -8 }
  // (a plain number is still investor trust). Below a line things get colder,
  // above 80 each one gives something back; crossing either says so.
  // shares App's scope (see stories.js, org.js, doors.js).

  const TRUST_PEOPLE = [
    { id: "tariq", name: "Tariq", icon: "🛠", fx: "cofounder", low: 35 },
    { id: "nour", name: "Nour", icon: "❤", fx: "partner", low: 30 },
    { id: "layla", name: "Layla", icon: "💼", fx: "trust", low: 30 },
    { id: "team", name: "Your team", icon: "👥", fx: "morale", low: 30 },
  ];
  const TRUST_HIGH = 80;
  // a fx with trust: { tariq, nour, layla, team } turned into the game's own keys
  function flatFx(fx) {
    const t = fx && fx.trust;
    if (!t || typeof t !== "object") return fx || {};
    const out = { ...fx };
    delete out.trust;
    TRUST_PEOPLE.forEach((p) => t[p.id] && (out[p.fx] = (out[p.fx] || 0) + t[p.id]));
    return out;
  }
  // 0-100, or null when that person is gone (Tariq left the company)
  function trustOf(s, id) {
    if (id === "tariq") {
      const r = rel(s, "co");
      return r && (s.team || []).some((m) => m.id === "emp_cto") ? r.health : null;
    }
    if (id === "nour") {
      const r = rel(s, "nour");
      return r ? r.health : 75;
    }
    if (id === "layla") return s.investorTrust == null ? 80 : s.investorTrust;
    return s.teamMorale;
  }
  const trustBand = (v, low) => (v == null ? "gone" : v >= TRUST_HIGH ? "close" : v >= 55 ? "steady" : v >= low ? "strained" : "cold");
  // "Tariq: steady" (whole phrases, so the Arabic build can translate them)
  const TRUST_STATE = {
    close: (n) => `${n}: close`,
    steady: (n) => `${n}: steady`,
    strained: (n) => `${n}: strained`,
    cold: (n) => `${n}: cold`,
    gone: (n) => `${n}: gone`,
  };

  // what each of them says when trust crosses a line
  const TRUST_LINES = {
    tariq: {
      cold: ["🛠", "Tariq answers in one word now. He has stopped arguing, which is worse."],
      close: ["🛠", "Tariq stayed late without being asked and left a note: go home, I've got the deploy."],
    },
    nour: {
      cold: ["❤", "Nour has stopped asking how your day was."],
      close: ["❤", "Nour packed you lunch with a note: proud of you, home by eight."],
    },
    layla: {
      cold: ["💼", "Layla's replies now come from her assistant."],
      close: ["💼", "Layla mentioned you by name at her fund's partner meeting."],
    },
    team: {
      cold: ["👥", "The team goes quiet when you walk in. Two people updated their profiles this week."],
      close: ["👥", "Someone pinned a customer's thank-you note on the wall. The team ships without being chased."],
    },
  };
  // Tariq's tone in the inbox
  function tariqTone(s) {
    const v = trustOf(s, "tariq");
    if (v == null) return null;
    if (v < 35) return "No greeting and no sign-off. That's new.";
    if (v >= TRUST_HIGH) return "He signs off: whatever you pick, I'm in.";
    return null;
  }

  function ensureTrust(s) {
    if (!s.trust) s.trust = { band: {}, cover: -99, intro: -99, ask: -99 };
    return s.trust;
  }

  function trustWeek(engine) {
    const s = engine.state,
      t = ensureTrust(s),
      notes = s.mkt ? s.mkt.notes : [],
      v = {};
    TRUST_PEOPLE.forEach((p) => (v[p.id] = trustOf(s, p.id)));

    // crossing a line: a warm or a cold line in the weekly report
    TRUST_PEOPLE.forEach((p) => {
      const b = trustBand(v[p.id], p.low),
        was = t.band[p.id];
      t.band[p.id] = b;
      if (!was || b === was || !TRUST_LINES[p.id][b]) return;
      const [icon, line] = TRUST_LINES[p.id][b];
      engine.addLog(icon + " " + TRUST_STATE[b](p.name), line, b === "close" ? "mentor" : "negative");
      notes.push([icon, line, b === "close" ? 1 : -1]);
    });

    // Tariq above 80 covers a crisis weekend, once a quarter
    if (v.tariq >= TRUST_HIGH && (s.mentalClarity < 35 || parseFloat(s.runwayMonths) < 3) && s.week - t.cover >= 12) {
      t.cover = s.week;
      s.mentalClarity = Math.min(100, s.mentalClarity + 8);
      engine.addLog("🛠 Tariq covered the weekend", "You were running on empty. Tariq took the on-call phone and the investor update, and told you to sleep.", "mentor");
      notes.push(["🛠", "Tariq covered the weekend. Clarity +8.", 1]);
    }
    // Nour below 30: home is heavier every week (and her ultimatum comes sooner, see stories.js)
    if (v.nour < 30 && s.week % 2 === 0) s.mentalClarity = Math.max(0, s.mentalClarity - 1);
    // Layla below 30: board pressure; above 80: an introduction, about every four months
    if (v.layla < 30) {
      const o = ensureOrg(s);
      if (o.board) o.board.trust = clamp(o.board.trust - 1, 0, 100);
      if (s.week - t.ask >= 6) {
        t.ask = s.week;
        s.mentalClarity = Math.max(0, s.mentalClarity - 2);
        engine.addLog("💼 Layla wants weekly numbers", "Layla asked for a weekly call and the numbers the day before. The rest of the board listens to her.", "negative");
        notes.push(["💼", "Layla wants weekly numbers now. Clarity −2.", -1]);
      }
    } else if (v.layla >= TRUST_HIGH && s.week >= 6 && s.week - t.intro >= 16) {
      t.intro = s.week;
      applyFx(engine, { users: 40, mrrPct: 0.04 });
      engine.addLog("💼 Layla introduced a customer", "Layla forwarded your deck to a company she knows well. They signed a small contract this week.", "mentor");
      notes.push(["💼", "Layla introduced a customer. MRR up.", 1]);
    }
    // the team: below 30 people start leaving (the engine's resignations) and culture frays; above 80 they ship faster
    if (v.team < 30 && ensureOrg(s).culture > 30) ensureOrg(s).culture -= 0.5;
    else if (v.team >= TRUST_HIGH) s.techDebt = Math.max(0, s.techDebt - 1);
  }

  // Layla has one number: her Circle card ("angel") shows investor trust. Reaching
  // out to her on the card (+11) moves investor trust; the card's weekly decay
  // does not (investor trust never decayed), so the week's changes are dropped.
  function syncLayla(s, keepCard) {
    const r = rel(s, "angel");
    if (!r) return;
    const t = ensureTrust(s);
    let inv = s.investorTrust == null ? 80 : s.investorTrust;
    if (keepCard && t.lay != null && r.health !== t.lay) inv = clamp(inv + (r.health - t.lay), 0, 100);
    s.investorTrust = inv;
    r.health = inv;
    t.lay = inv;
  }

  (function () {
    const P = Engine.StartupEngine.prototype;
    if (P.__trust) return;
    P.__trust = true;
    const recalc = P.recalculate;
    P.recalculate = function (...args) {
      if (this.state) syncLayla(this.state, !this.__advancing);
      return recalc.apply(this, args);
    };
    const advance = P.advanceWeek;
    P.advanceWeek = function (...args) {
      this.__advancing = true;
      try {
        advance.apply(this, args);
      } finally {
        this.__advancing = false;
      }
      syncLayla(this.state, false);
      if (!this.state.gameOver && !this.state.victory) trustWeek(this);
      return this.recalculate();
    };
  })();

  // on the Circle screen: the four meters, compact
  function TrustPanel({ S }) {
    return jsxs(View, {
      style: rst.wrap,
      children: [
        jsx(Text, { style: rst.kicker, children: "TRUST" }),
        jsx(View, {
          style: rst.grid,
          children: TRUST_PEOPLE.map((p) => {
            const live = trustOf(S, p.id),
              b = trustBand(live, p.low),
              co = p.id === "tariq" && rel(S, "co"),
              v = live == null && co ? co.health : live, // Tariq after he left: the same number his Circle card shows
              col = b === "close" ? COLOR.vital : b === "steady" ? COLOR.act : b === "strained" ? COLOR.fog : COLOR.crit;
            return jsxs(
              View,
              {
                style: rst.cell,
                children: [
                  jsxs(View, {
                    style: rst.top,
                    children: [
                      jsx(Pic, { e: p.icon, size: 20 }),
                      jsx(Text, { style: rst.name, numberOfLines: 1, children: p.name }),
                      jsx(Text, { style: [rst.num, { color: col }], children: v == null ? "—" : Math.round(v) + "%" }),
                    ],
                  }),
                  jsx(View, { style: rst.track, children: jsx(View, { style: [rst.fill, { width: Math.max(3, v || 0) + "%", backgroundColor: col }] }) }),
                  jsx(Text, { style: [rst.state, { color: col }], children: TRUST_STATE[b](p.name) }),
                ],
              },
              p.id,
            );
          }),
        }),
      ],
    });
  }
  const trustLine = (S) => "Trust at the end: " + TRUST_PEOPLE.map((p) => p.name + " " + (trustOf(S, p.id) == null ? "—" : Math.round(trustOf(S, p.id)))).join(" · ");

  const rst = StyleSheet.create({
    wrap: { backgroundColor: COLOR.panel, marginHorizontal: 12, marginTop: 10, borderRadius: 14, padding: 10, borderWidth: 1, borderColor: COLOR.line },
    kicker: { fontFamily: "AzeretMono_500Medium", fontSize: 10, letterSpacing: 1.2, color: COLOR.text3, marginBottom: 6 },
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    cell: { width: "48%", flexGrow: 1, backgroundColor: COLOR.panel2, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 6 },
    top: { flexDirection: "row", alignItems: "center", gap: 6 },
    name: { flex: 1, fontFamily: "Archivo_600SemiBold", fontSize: 13, color: COLOR.text },
    num: { fontFamily: "AzeretMono_600SemiBold", fontSize: 13 },
    track: { height: 4, borderRadius: 2, backgroundColor: COLOR.line, overflow: "hidden", marginTop: 5 },
    fill: { height: 4, borderRadius: 2 },
    state: { fontFamily: "Archivo_500Medium", fontSize: 11.5, marginTop: 4 },
  });
