// Bousla (formerly Founder Fog) — title screen + new-company setup (replaces Metro module 265).
// Same dependency list as the original module: React, View, Text, TextInput,
// StyleSheet, ScrollView, TouchableOpacity, engine, theme, jsx runtime.
function (g, r, i, a, m, _e, d) {
  "use strict";
  function e(e) {
    return e && e.__esModule ? e : { default: e };
  }
  Object.defineProperty(_e, "__esModule", { value: !0 });

  var React = r(d[0]),
    View = e(r(d[1])).default,
    Text = e(r(d[2])).default,
    TextInput = e(r(d[3])).default,
    StyleSheet = e(r(d[4])).default,
    ScrollView = e(r(d[5])).default,
    Touchable = e(r(d[6])).default,
    Engine = r(d[7]),
    Theme = r(d[8]),
    J = r(d[9]);

  const COLOR = Theme.COLOR,
    TYPE = Theme.TYPE,
    jsx = J.jsx,
    jsxs = J.jsxs;

  const PICS = /*@PICS*/ {};
  function Pic({ e, size, style }) {
    const k = PICS[String(e || "").replace(/\uFE0F/g, "")];
    if (k) return jsx(View, { dataSet: { pic: k }, style: [{ width: size, height: size }, style] });
    return jsx(Text, { style: [{ fontSize: Math.round(size * 0.78), lineHeight: size, textAlign: "center" }, style], children: e });
  }
  const AVATARS = ["avatar_m1", "avatar_w1", "avatar_m2", "avatar_w2"];

  const ICONS = { saas_ai: "🤖", fintech: "💳", ecommerce_marketplace: "🛍️", healthtech: "🩺", edtech: "🎓" };

  // The market picker. Short names and one-line pitches (the Arabic comes from ar.json, like every string here).
  const SECTOR_SHORT = { saas_ai: "AI SaaS", fintech: "Fintech", ecommerce_marketplace: "Marketplace", healthtech: "HealthTech", edtech: "EdTech" };
  const SECTOR_PITCH = {
    saas_ai: "AI agents that do office work, sold to companies by subscription.",
    fintech: "Payments across borders for online shops and apps.",
    ecommerce_marketplace: "A curated shop for niche brands. You take a cut of each sale.",
    healthtech: "Online doctors and care plans for people with chronic illness.",
    edtech: "Tech skills courses that end in a job.",
  };
  // Difficulty is measured, not guessed: bot survival over 900 games per sector
  // (the balance pass before this picker): HealthTech ~54%, AI SaaS ~53%,
  // Fintech ~49%, EdTech ~38%, Marketplace ~23%. Retune here if balance changes.
  const DIFFICULTY = { saas_ai: "easier", healthtech: "easier", fintech: "medium", edtech: "hard", ecommerce_marketplace: "hardest" };
  const DIFF_LOOK = {
    easier: { label: "Easier", fg: "#1E7F45", bg: "#DFF5E7" },
    medium: { label: "Medium", fg: "#9A6400", bg: "#FFF1CC" },
    hard: { label: "Hard", fg: "#C42B22", bg: "#FDE3E1" },
    hardest: { label: "Hardest", fg: "#FFFFFF", bg: "#8E1B16" },
  };
  // The fog of this market: each industry's central trap, from Part Three of the book (chapters 21-25).
  const SECTOR_FOG = {
    saas_ai: { ch: 21, text: "The margin fog: every answer costs you compute. Growth can make you poorer." },
    fintech: { ch: 22, text: "The permission fog: nothing grows until the licence lands." },
    ecommerce_marketplace: { ch: 23, text: "The liquidity fog: a full homepage can hide an empty search." },
    healthtech: { ch: 24, text: "The trust fog: growth is slow, and one bad story costs more than ten good ones." },
    edtech: { ch: 25, text: "The outcome fog: you sell a result you don't control, on a school calendar." },
  };
  const FIRST_SECTOR = "saas_ai"; // preselected, with a badge, until the player has finished a company
  const SECTOR_KEY = "founderFog.sector"; // the last market a player started in

  const money = (v) => "$" + Math.round(v).toLocaleString();
  const moneyShort = (v) => (v >= 1e3 ? "$" + Math.round(v / 1e3) + "k" : money(v));
  const cleanName = (n) => String(n || "").replace(/^[\d\u0660-\u0669]+\.\s*/, "");

  // The Arabic build is the same code served as ar.html with <html lang="ar" dir="rtl">.
  const IS_AR = typeof document !== "undefined" && document.documentElement.lang === "ar";
  // keeps "$25k" and "7.1" in one piece inside right-to-left text
  const ltr = (t) => (IS_AR ? "\u2066" + t + "\u2069" : t);
  const sectorName = (s) => cleanName(IS_AR ? s.name_ar || s.name_en : s.name_en);
  const sectorShort = (s) => SECTOR_SHORT[s.id] || sectorName(s);
  // the engine's long name, in this build's language only (name_en is translated in ar.html; drop "(B2B SaaS)" there)
  const sectorLong = (s) => {
    const n = cleanName(s.name_en);
    return IS_AR ? n.replace(/\s*\([A-Za-z0-9 &]+\)\s*$/, "") : n;
  };
  function switchLanguage() {
    try {
      window.localStorage.setItem("founderFog.lang", IS_AR ? "en" : "ar");
    } catch (err) {}
    window.location.replace(IS_AR ? "index.html" : "ar.html");
  }
  // difficulty modes; the rules live in App's economy.js under the same ids
  const MODES = [
    { id: "venture", icon: "🚀", name: "Venture-backed", desc: "The classic story. Normal cash, normal market.", cash: 1 },
    { id: "bootstrapped", icon: "🧾", name: "Bootstrapped", desc: "40% less cash, and investors won't meet you before week 26.", cash: 0.6 },
    { id: "winter", icon: "🧊", name: "Funding winter", desc: "You start in a downturn: valuations are low and winters come back more often.", cash: 1 },
    { id: "hard", icon: "🌫️", name: "Deep fog", desc: "40% less cash and almost three times the shocks. For bragging rights.", cash: 0.6 },
  ];
  // each sector's special rule (implemented in App's market.js)
  const SECTOR_RULES = {
    saas_ai: "Customers stay longest here: churn settles 1% lower.",
    fintech: "No real growth until the central bank licence lands (weeks 8–14). Compliance costs $800/mo.",
    ecommerce_marketplace: "Chicken and egg: growth is slow until $5k MRR, then the network kicks in.",
    healthtech: "Trust builds slowly: growth runs 15% slower, churn settles 1.5% lower.",
    edtech: "Seasons: back-to-school weeks grow 40% faster, summer 30% slower. Churn settles 1% higher.",
  };
  // suggested names, so the daily board isn't full of one default founder (fictional, editable)
  const FOUNDER_NAMES = ["Lina", "Maya", "Ziad", "Rana", "Hadi", "Fares", "Reem", "Jana"];
  const COMPANY_NAMES = {
    saas_ai: ["Wasla AI", "Mizan AI", "Manara AI"],
    fintech: ["Rawaj Pay", "Dafaa", "Qirsh Pay"],
    ecommerce_marketplace: ["Souqna", "Dukkan Box", "Souq Al Hay"],
    healthtech: ["Nabd", "Rahah Care", "Shifa Link"],
    edtech: ["Maharat Academy", "Code Majlis", "Darsak"],
  };
  const companyFor = (sectorId, n) => {
    const l = COMPANY_NAMES[sectorId] || COMPANY_NAMES.saas_ai;
    return l[n % l.length];
  };
  const CHALLENGES = [
    { id: "winter26", icon: "🧊", name: "Survive the funding winter", goal: "Still running at week 26, in a downturn.", mode: "winter" },
    { id: "fit20", icon: "🔍", name: "Find fit in 12 weeks", goal: "Reach 40% product-market fit by week 12.", mode: "venture" },
    { id: "control30", icon: "🪑", name: "Raise and keep control", goal: "Close a round by week 20, keep 70% of the company and control of the board.", mode: "venture" },
    { id: "boot40", icon: "🌱", name: "Default alive, bootstrapped", goal: "Reach default alive with $6,000 MRR by week 40, without investors.", mode: "bootstrapped" },
    { id: "ramadan20", icon: "🌅", name: "Through Ramadan together", goal: "Reach week 20, past Ramadan, with team morale at 60% or more and Tariq still with you.", mode: "venture" },
    { id: "clear26", icon: "🌫", name: "Never lose the view", goal: "Reach week 26 without your clarity ever falling below 40%.", mode: "venture" },
    { id: "lean36", icon: "🛠", name: "Small team, real business", goal: "Reach default alive by week 36 with 4 people or fewer on the team.", mode: "venture" },
    { id: "people30", icon: "🫶", name: "Keep your people", goal: "Reach week 30 with Tariq, Nour and Layla all at 60% trust or more.", mode: "venture" },
    { id: "seriesA78", icon: "🦄", name: "Series A in a year", goal: "Reach the Series A stage, $40,000 MRR, by week 52.", mode: "venture" },
  ];
  function sectorNumbers(s, cashMult) {
    const monthlyBurn = 2e3 * (s.burn_multiplier || 1) + 1500,
      cash = Math.round(s.initial_cash * (cashMult || 1));
    return { cash: cash, burnWeek: monthlyBurn / 4, runway: cash / monthlyBurn };
  }

  const GOAL = "Goal: reach a $100M valuation before the cash — or you — run out.";

  // small phones (640px tall): a smaller rocket so the goal line and buttons all fit
  const SHORT_SCREEN = typeof window !== "undefined" && window.innerHeight < 720;

  function Title({ saved, onNew, onCustom, onResume, onDiscard, onChallenges, onDaily, onTrophies, onBook, meta }) {
    return jsxs(View, {
      style: st.titleWrap,
      dataSet: { ff: "sky" },
      children: [
        jsx(View, { dataSet: { ff: "fogbank" }, pointerEvents: "none", style: st.titleFog }),
        // EN | عربي switch, always visible at the top of the title screen
        jsx(View, {
          style: st.langSwitch,
          children: [
            ["EN", false],
            ["\u0639\u0631\u0628\u064a", true],
          ].map(([label, ar]) =>
            jsx(
              Touchable,
              {
                style: [st.langOpt, ar === IS_AR && st.langOptOn],
                onPress: () => ar !== IS_AR && switchLanguage(),
                children: jsx(Text, { style: [st.langTxt, ar === IS_AR && st.langTxtOn], children: label }),
              },
              label,
            ),
          ),
        }),
        jsxs(View, {
          style: [st.titleCenter, SHORT_SCREEN && { gap: 4 }],
          children: [
            jsxs(View, {
              style: st.heroArt,
              // The book's cover in an arch-topped frame (styled by [data-ff="cover"] in build.py)
              children: [jsx(View, { style: saved ? st.coverArchSm : st.coverArch, dataSet: { ff: "cover" } })],
            }),
            jsx(Text, { style: st.logo, children: "BOUSLA" }),
            jsx(Text, { style: st.logoTag, children: "Build a company. Keep your head clear.\nYou will not always be able to read the numbers." }),
            jsx(Text, { style: st.titleGoal, children: GOAL }),
          ],
        }),
        jsxs(View, {
          style: st.titleActions,
          children: [
            saved &&
              jsxs(Touchable, {
                style: st.saveCard,
                onPress: onResume,
                activeOpacity: 0.85,
                dataSet: { ff: "rise1" },
                children: [
                  jsxs(View, {
                    style: { flex: 1 },
                    children: [
                      jsx(Text, { style: st.saveKicker, children: "CONTINUE" }),
                      jsx(Text, { style: st.saveTitle, numberOfLines: 1, children: saved.state.companyName }),
                      jsx(Text, { style: st.saveSub, children: "Week " + saved.state.week + " · " + money(saved.state.cash) + " in the bank" }),
                    ],
                  }),
                  jsx(Text, { style: st.saveArrow, children: "▸" }),
                ],
              }),
            jsx(Touchable, {
              style: [st.primaryBtn, saved && st.secondaryBtn],
              onPress: onNew,
              activeOpacity: 0.85,
              dataSet: { ff: "rise2" },
              children: jsx(Text, { style: [st.primaryTxt, saved && st.secondaryTxt], children: saved ? "Start a new company" : "Start your company ▸" }),
            }),
            // the full setup (market, difficulty, background) for anyone who wants it, first run or not
            jsx(Touchable, {
              style: st.customLink,
              onPress: onCustom,
              activeOpacity: 0.7,
              dataSet: { ffflow: "custom" },
              children: jsx(Text, { style: st.customTxt, children: "Custom company" }),
            }),
            jsx(Touchable, {
              style: [st.primaryBtn, st.secondaryBtn],
              onPress: onChallenges,
              activeOpacity: 0.85,
              dataSet: { ff: "rise3" },
              children: jsx(Text, { style: [st.primaryTxt, st.secondaryTxt], children: "🎯 Challenges" }),
            }),
            meta &&
              jsxs(View, {
                style: st.metaRow,
                dataSet: { ff: "rise4" },
                children: [
                  jsxs(Touchable, {
                    style: st.metaBtn,
                    onPress: onDaily,
                    activeOpacity: 0.85,
                    children: [jsx(Pic, { e: "📅", size: 28 }), jsx(Text, { style: st.metaTxt, children: "Daily" }), jsx(Text, { style: st.metaSub, children: meta.daily.played ? "Played ✓" : "New today" })],
                  }),
                  jsxs(Touchable, {
                    style: st.metaBtn,
                    onPress: onTrophies,
                    activeOpacity: 0.85,
                    children: [jsx(Pic, { e: "🏆", size: 28 }), jsx(Text, { style: st.metaTxt, children: "Trophies" }), jsx(Text, { style: st.metaSub, children: meta.trophies })],
                  }),
                  meta.startBook &&
                    jsxs(Touchable, {
                      style: st.metaBtn,
                      onPress: onBook,
                      activeOpacity: 0.85,
                      dataSet: { ffbook: "open" },
                      children: [jsx(Pic, { e: "📓", size: 28 }), jsx(Text, { style: [st.metaTxt, { fontSize: 13 }], numberOfLines: 1, children: "From the book" }), jsx(Text, { style: st.metaSub, children: "Enter a code" })],
                    }),
                ],
              }),
            saved &&
              jsx(Touchable, {
                onPress: onDiscard,
                style: st.discard,
                children: jsx(Text, { style: st.discardTxt, children: "Delete saved game" }),
              }),
          ],
        }),
      ],
    });
  }

  function StepHeader({ step, steps, title, sub, onBack }) {
    return jsxs(View, {
      style: st.stepHeader,
      children: [
        jsxs(View, {
          style: st.stepTop,
          children: [
            jsx(Touchable, { onPress: onBack, style: st.backBtn, children: jsx(Text, { style: st.backTxt, children: "‹" }) }),
            jsx(View, {
              style: st.dots,
              children: (steps === 1 ? [1] : [1, 2]).map((n) => jsx(View, { style: [st.dot, n <= step && st.dotOn] }, n)),
            }),
            jsx(View, { style: { width: 40 } }),
          ],
        }),
        jsx(Text, { style: st.stepTitle, children: title }),
        jsx(Text, { style: st.stepSub, children: sub }),
      ],
    });
  }

  _e.OnboardingScreen = function ({ onStartGame, saved, onResume, onDiscard, meta }) {
    // first-time players start on AI SaaS; everyone else on the market they last picked
    const firstRun = !!(meta && meta.firstRun);
    const preferredSector = () => {
      let id = null;
      try {
        id = window.localStorage.getItem(SECTOR_KEY);
      } catch (e) {}
      if (firstRun || !Engine.SECTORS.some((x) => x.id === id)) id = Engine.SECTORS.some((x) => x.id === FIRST_SECTOR) ? FIRST_SECTOR : Engine.SECTORS[0].id;
      return id;
    };
    const [step, setStep] = React.useState(0),
      [sectorId, setSectorId] = React.useState(preferredSector),
      [sectorOpen, setSectorOpen] = React.useState(false),
      [advOpen, setAdvOpen] = React.useState(false),
      [pick] = React.useState(() => Math.floor(Math.random() * 1e6)),
      [founder, setFounder] = React.useState(() => FOUNDER_NAMES[pick % FOUNDER_NAMES.length]),
      [company, setCompanyRaw] = React.useState(""),
      [companyTouched, setCompanyTouched] = React.useState(false),
      [avatar, setAvatar] = React.useState("avatar_m1"),
      [mode, setMode] = React.useState("venture"),
      [challenge, setChallenge] = React.useState(null),
      [background, setBackground] = React.useState("first"),
      [bookCode, setBookCode] = React.useState(""),
      [bookErr, setBookErr] = React.useState(false),
      [guided, setGuided] = React.useState(() => {
        try {
          return window.localStorage.getItem("founderFog.guided") !== "off";
        } catch (e) {
          return true;
        }
      });
    // the company name follows the market until the player types their own
    const setCompany = (v) => (setCompanyTouched(true), setCompanyRaw(v));
    React.useEffect(() => {
      if (!companyTouched) setCompanyRaw(companyFor(sectorId, pick));
    }, [sectorId]);
    const toggleGuided = () => {
      try {
        window.localStorage.setItem("founderFog.guided", guided ? "off" : "on");
      } catch (e) {}
      setGuided(!guided);
    };

    // A first-timer goes straight to one short screen (AI SaaS, venture-backed, first-timer, guided);
    // a returning player picks a market, then names the company with the rest under "Advanced settings".
    const startNew = () => {
      setChallenge(null);
      setSectorOpen(false);
      setAdvOpen(false);
      if (firstRun) {
        setSectorId(FIRST_SECTOR);
        setMode("venture");
        setBackground("first");
        setAvatar(AVATARS[0]);
        setStep("quick");
      } else setSectorId(preferredSector()), setStep(1);
    };
    // "Custom company" on the title screen: the full flow, with the advanced section already open
    const startCustom = () => (setChallenge(null), setSectorId(preferredSector()), setSectorOpen(false), setAdvOpen(true), setStep(1));

    if (step === 0)
      return jsx(Title, { saved: saved, meta: meta, onResume: onResume, onDiscard: onDiscard, onNew: startNew, onCustom: startCustom, onChallenges: () => setStep("ch"), onDaily: () => setStep("daily"), onTrophies: () => setStep("trophies"), onBook: () => (setBookErr(false), setStep("book")) });

    // the daily challenge and the trophy room; their panels come from App (meta.js)
    if ((step === "daily" || step === "trophies") && meta) {
      const daily = meta.daily;
      return jsxs(View, {
        style: st.container,
        children: [
          step === "daily"
            ? jsx(StepHeader, { step: 1, title: "Daily challenge", sub: "Same market, same difficulty, same luck for everyone today. One try a day.", onBack: () => setStep(0) })
            : jsx(StepHeader, { step: 1, title: "Trophies", sub: "Earned across every company you found. Some unlock new founder backgrounds.", onBack: () => setStep(0) }),
          jsx(ScrollView, { style: { flex: 1 }, contentContainerStyle: st.list, children: jsx(step === "daily" ? meta.DailyPanel : meta.TrophyPanel, {}) }),
          step === "daily" &&
            jsx(View, {
              style: st.footer,
              children: jsx(Touchable, {
                style: [st.primaryBtn, daily.played && { opacity: 0.4 }],
                disabled: !!daily.played,
                onPress: () => (setChallenge("daily"), setSectorId(daily.sectorId), setMode(daily.mode), setStep(2)),
                activeOpacity: 0.85,
                children: jsx(Text, { style: st.primaryTxt, children: daily.played ? "Come back tomorrow" : "Play today's challenge ▸" }),
              }),
            }),
        ],
      });
    }

    // "From the book": each decision chapter has a code (FOG-W07) that opens that week (App's book.js)
    if (step === "book" && meta && meta.startBook) {
      const go = () => (meta.startBook(bookCode) ? setBookCode("") : setBookErr(true));
      return jsxs(View, {
        style: st.container,
        children: [
          jsx(StepHeader, { step: 1, title: "From the book", sub: "Every decision chapter of Founder Fog ends with a code. Type it to play that week, with the chapter's decision in front of you.", onBack: () => setStep(0) }),
          jsxs(ScrollView, {
            style: { flex: 1 },
            contentContainerStyle: st.list,
            keyboardShouldPersistTaps: "handled",
            children: [
              jsx(Text, { style: st.inputLabel, children: "CHAPTER CODE" }),
              jsx(TextInput, {
                style: [st.input, st.codeInput, bookErr && { borderColor: COLOR.crit }],
                value: bookCode,
                onChangeText: (t) => (setBookCode(t.toUpperCase()), setBookErr(false)),
                onSubmitEditing: go,
                placeholder: "FOG-W07",
                placeholderTextColor: COLOR.text3,
                autoCapitalize: "characters",
                autoCorrect: !1,
                maxLength: 12,
                dataSet: { ffbook: "code" },
              }),
              bookErr && jsx(Text, { style: [st.modeDesc, { color: COLOR.crit }], children: "That code isn't in the book. Codes look like FOG-W07: the week of the chapter's decision." }),
              jsx(Text, { style: st.modeDesc, children: "You play the company from the book: a B2B SaaS start-up in that week, with the book's cash, revenue and team. Choose a door, then enter the code again to try the other one." }),
            ],
          }),
          jsx(View, {
            style: st.footer,
            children: jsx(Touchable, {
              style: [st.primaryBtn, !bookCode.trim() && { opacity: 0.4 }],
              disabled: !bookCode.trim(),
              onPress: go,
              activeOpacity: 0.85,
              dataSet: { ffbook: "go" },
              children: jsx(Text, { style: st.primaryTxt, children: "Play this week ▸" }),
            }),
          }),
        ],
      });
    }

    // scenario challenges: one goal, a deadline, a fixed difficulty (rules in App's teach.js)
    if (step === "ch")
      return jsxs(View, {
        style: st.container,
        children: [
          jsx(StepHeader, { step: 1, title: "Challenges", sub: "Short runs with one goal. Good for a class or a coffee break.", onBack: () => setStep(0) }),
          jsx(ScrollView, {
            style: { flex: 1 },
            contentContainerStyle: st.list,
            // general challenges, then one per industry (those fix the market too)
            children: CHALLENGES.concat((meta && meta.challenges) || []).map((c, idx) =>
              jsxs(
                Touchable,
                {
                  style: st.sector,
                  activeOpacity: 0.85,
                  dataSet: { ff: "rise" + Math.min(idx + 1, 4) },
                  onPress: () => (setChallenge(c.id), setMode(c.mode), c.sector ? (setSectorId(c.sector), setStep(2)) : setStep(1)),
                  children: [
                    jsxs(View, {
                      style: st.sectorTop,
                      children: [
                        jsx(View, { style: st.sectorIcon, children: jsx(Pic, { e: c.icon, size: 36 }) }),
                        jsxs(View, { style: { flex: 1 }, children: [jsx(Text, { style: st.sectorName, children: c.name }), c.sector && jsx(Text, { style: st.desc, children: ICONS[c.sector] + "  " + sectorShort(Engine.SECTORS.find((x) => x.id === c.sector) || {}) })] }),
                      ],
                    }),
                    jsx(Text, { style: st.desc, children: c.goal }),
                  ],
                },
                c.id,
              ),
            ),
          }),
        ],
      });

    const sector = Engine.SECTORS.find((s) => s.id === sectorId) || Engine.SECTORS[0];
    const modeInfo = MODES.find((m) => m.id === mode) || MODES[0];
    const nums = sectorNumbers(sector, modeInfo.cash);

    if (step === 1) {
      const roles = (meta && meta.sectorRoles) || {};
      const pick = (id) => (id === sectorId ? setSectorOpen(!sectorOpen) : (setSectorId(id), setSectorOpen(true)));
      const startIn = () => {
        try {
          window.localStorage.setItem(SECTOR_KEY, sector.id);
        } catch (e) {}
        setStep(2);
      };
      return jsxs(View, {
        style: st.container,
        children: [
          jsx(StepHeader, { step: 1, title: "Pick your market", sub: "Tap a market to see how it plays.", onBack: () => setStep(0) }),
          jsx(ScrollView, {
            style: { flex: 1 },
            contentContainerStyle: [st.list, st.sectorList],
            showsVerticalScrollIndicator: !1,
            children: Engine.SECTORS.map((s, idx) => {
              const on = s.id === sectorId,
                open = on && sectorOpen;
              const n = sectorNumbers(s),
                margin = Math.round((s.gross_margin || 0) * 100),
                diff = DIFF_LOOK[DIFFICULTY[s.id]] || DIFF_LOOK.medium,
                fog = SECTOR_FOG[s.id],
                role = roles[s.id];
              // the stats in plain words, for someone who has never read a P&L
              const cashTxt = ltr(money(n.cash)),
                months = Math.round(n.runway),
                per100 = ltr("$100"),
                kept = ltr("$" + margin);
              return jsxs(
                Touchable,
                {
                  style: [st.sector, st.sectorCompact, on && st.sectorOn],
                  onPress: () => pick(s.id),
                  activeOpacity: 0.85,
                  dataSet: { ff: "rise" + Math.min(idx + 1, 4), ffsector: s.id },
                  accessibilityRole: "button",
                  accessibilityState: { selected: on, expanded: open },
                  children: [
                    jsxs(View, {
                      style: st.sectorTop,
                      children: [
                        jsx(View, { style: [st.sectorIcon, on && st.sectorIconOn], children: jsx(Pic, { e: ICONS[s.id] || "🚀", size: 32 }) }),
                        jsxs(View, {
                          style: { flex: 1, minWidth: 0 },
                          children: [
                            jsxs(View, {
                              style: st.nameRow,
                              children: [
                                jsx(Text, { style: st.sectorName, numberOfLines: 1, children: sectorShort(s) }),
                                firstRun && s.id === FIRST_SECTOR && jsx(View, { style: st.firstBadge, dataSet: { ffbadge: "first" }, children: jsx(Text, { style: st.firstBadgeTxt, numberOfLines: 1, children: "Good first company" }) }),
                                jsx(View, { style: { flex: 1 } }),
                                jsx(View, { style: [st.diff, { backgroundColor: diff.bg }], children: jsx(Text, { style: [st.diffTxt, { color: diff.fg }], numberOfLines: 1, children: diff.label }) }),
                              ],
                            }),
                            jsx(Text, { style: st.pitch, numberOfLines: open ? 3 : 1, children: SECTOR_PITCH[s.id] || s.tagline }),
                          ],
                        }),
                      ],
                    }),
                    jsx(View, {
                      style: st.miniStats,
                      children: [
                        [ltr(moneyShort(s.initial_cash)), " cash"],
                        [ltr(n.runway.toFixed(1)) + " mo", " runway"],
                        [ltr(margin + "%"), " margin"],
                      ].map(([v, l]) => jsx(View, { style: st.mini, children: jsxs(Text, { style: st.miniTxt, numberOfLines: 1, children: [jsx(Text, { style: st.miniV, children: v }), l] }) }, l)),
                    }),
                    open &&
                      jsxs(View, {
                        style: st.more,
                        dataSet: { ff: "open" },
                        children: [
                          jsx(Text, { style: st.longName, children: sectorLong(s) }),
                          fog &&
                            jsxs(View, {
                              style: st.fogBox,
                              children: [
                                jsx(Text, { style: st.moreKicker, children: "THE FOG OF THIS MARKET" }),
                                jsx(Text, { style: st.fogTxt, children: fog.text }),
                                jsx(Text, { style: st.fogCh, children: "Chapter " + fog.ch + " of the book Founder Fog" }),
                              ],
                            }),
                          SECTOR_RULES[s.id] && jsxs(View, { style: st.rule2, children: [jsx(Pic, { e: "⚖️", size: 18 }), jsx(Text, { style: st.rule2Txt, children: SECTOR_RULES[s.id] })] }),
                          role &&
                            jsxs(View, {
                              style: st.whoBox,
                              children: [
                                jsx(Text, { style: st.moreKicker, children: "WHO YOU'LL DEAL WITH" }),
                                jsxs(View, { style: st.who, children: [jsx(Pic, { e: "🏢", size: 20 }), jsxs(Text, { style: st.whoTxt, children: [jsx(Text, { style: st.whoName, children: "Northwind Retail" }), " · " + role.c1] })] }),
                                jsxs(View, { style: st.who, children: [jsx(Pic, { e: "🤝", size: 20 }), jsxs(Text, { style: st.whoTxt, children: [jsx(Text, { style: st.whoName, children: "Omar Sabry" }), " · " + role.c2] })] }),
                              ],
                            }),
                          jsx(Text, { style: st.plain, children: `${cashTxt} lasts about ${months} months at your starting burn. Of every ${per100} customers pay, about ${kept} is left after direct costs.` }),
                        ],
                      }),
                  ],
                },
                s.id,
              );
            }),
          }),
          jsx(View, {
            style: st.footer,
            children: jsx(Touchable, {
              style: st.primaryBtn,
              onPress: startIn,
              activeOpacity: 0.85,
              dataSet: { ffsector: "start" },
              children: jsx(Text, { style: st.primaryTxt, children: "Start in " + sectorShort(sector) + " ▸" }),
            }),
          }),
        ],
      });
    }

    const ready = founder.trim() && company.trim();
    const found = (opts) =>
      jsx(View, {
        style: st.footer,
        children: jsx(Touchable, {
          style: [st.primaryBtn, !ready && { opacity: 0.4 }],
          disabled: !ready,
          onPress: () => onStartGame(Object.assign({ founderName: founder.trim(), companyName: company.trim() }, opts)),
          activeOpacity: 0.85,
          dataSet: { ffflow: "found" },
          children: jsx(Text, { style: st.primaryTxt, children: "Found " + (company.trim() || "the company") + " ▸" }),
        }),
      });

    // first run: one screen, two names, then the tutorial
    if (step === "quick")
      return jsxs(View, {
        style: st.container,
        children: [
          jsx(StepHeader, { step: 1, steps: 1, title: "Name your company", sub: "You start an AI SaaS company. A one-minute tutorial walks you through your first week.", onBack: () => setStep(0) }),
          jsxs(ScrollView, {
            style: { flex: 1 },
            contentContainerStyle: st.list,
            keyboardShouldPersistTaps: "handled",
            dataSet: { ffflow: "quick" },
            children: [
              jsx(Text, { style: st.inputLabel, children: "FOUNDER" }),
              jsx(TextInput, { style: st.input, value: founder, onChangeText: setFounder, placeholder: "Your name", placeholderTextColor: COLOR.text3, maxLength: 24 }),
              jsx(Text, { style: st.inputLabel, children: "COMPANY" }),
              jsx(TextInput, { style: st.input, value: company, onChangeText: setCompany, placeholder: "Company name", placeholderTextColor: COLOR.text3, maxLength: 28 }),
              jsx(Text, { style: [st.goal, st.goalLine], children: GOAL }),
            ],
          }),
          found({ sectorId: FIRST_SECTOR, avatar: AVATARS[0], mode: "venture", challenge: null, guided: true, background: "first" }),
        ],
      });

    // difficulty, background and the guided month, folded away for returning players
    const bgs = (meta && meta.backgrounds) || [],
      bgOpen = bgs.filter((b) => b.unlocked),
      bgLocked = bgs.length - bgOpen.length,
      bgInfo = bgOpen.find((x) => x.id === background) || bgOpen[0];
    const advanced = [
      jsxs(
        Touchable,
        {
          style: [st.advHead, advOpen && st.advHeadOn],
          activeOpacity: 0.85,
          onPress: () => setAdvOpen(!advOpen),
          dataSet: { ffadv: advOpen ? "open" : "closed" },
          children: [
            jsx(Pic, { e: "🛠️", size: 22 }),
            jsxs(View, {
              style: { flex: 1 },
              children: [
                jsx(Text, { style: st.advTitle, children: "Advanced settings" }),
                jsx(Text, { style: st.advSub, numberOfLines: 1, children: modeInfo.name + (bgInfo ? " · " + bgInfo.name : "") }),
              ],
            }),
            jsx(Text, { style: st.advChev, children: advOpen ? "▴" : "▾" }),
          ],
        },
        "advHead",
      ),
      advOpen &&
        jsxs(
          View,
          {
            style: st.advBody,
            dataSet: { ff: "open" },
            children: [
              jsx(Text, { style: st.inputLabel, children: "DIFFICULTY" }),
              jsx(View, {
                style: st.modes,
                children: MODES.map((m) =>
                  jsxs(
                    Touchable,
                    {
                      style: [st.modeOpt, m.id === mode && st.modeOn],
                      onPress: () => setMode(m.id),
                      activeOpacity: 0.85,
                      dataSet: { ffmode: m.id },
                      children: [jsx(Pic, { e: m.icon, size: 30 }), jsx(Text, { style: [st.modeName, m.id === mode && { color: "#2D7FF9" }], numberOfLines: 2, children: m.name })],
                    },
                    m.id,
                  ),
                ),
              }),
              jsx(Text, { style: st.modeDesc, children: modeInfo.desc }),
              // founder backgrounds, earned across runs (meta.js); locked ones stay hidden
              bgInfo && jsx(Text, { style: st.inputLabel, children: "BACKGROUND" }),
              bgInfo &&
                jsx(View, {
                  style: st.modes,
                  children: bgOpen.map((b) =>
                    jsxs(
                      Touchable,
                      {
                        style: [st.modeOpt, b.id === bgInfo.id && st.modeOn],
                        onPress: () => setBackground(b.id),
                        activeOpacity: 0.85,
                        dataSet: { ffbg: b.id },
                        children: [jsx(Pic, { e: b.icon, size: 30 }), jsx(Text, { style: [st.modeName, b.id === bgInfo.id && { color: "#2D7FF9" }], numberOfLines: 2, children: b.name })],
                      },
                      b.id,
                    ),
                  ),
                }),
              bgInfo && jsx(Text, { style: st.modeDesc, children: bgInfo.desc }),
              bgLocked > 0 && jsx(Text, { style: st.lockedTxt, children: bgLocked === 1 ? "One more background unlocks with trophies" : bgLocked + " more backgrounds unlock with trophies" }),
              jsxs(Touchable, {
                style: st.guideRow,
                activeOpacity: 0.85,
                onPress: toggleGuided,
                children: [
                  jsx(View, { style: [st.check, guided && st.checkOn], children: guided ? jsx(Text, { style: st.checkTick, children: "✓" }) : null }),
                  jsxs(View, {
                    style: { flex: 1 },
                    children: [
                      jsx(Text, { style: st.guideTitle, children: "Guided first month" }),
                      jsx(Text, { style: st.guideSub, children: "New systems unlock one week at a time. Turn off if you've played before." }),
                    ],
                  }),
                ],
              }),
            ],
          },
          "advBody",
        ),
    ];

    return jsxs(View, {
      style: st.container,
      children: [
        jsx(StepHeader, { step: 2, title: "Name your company", sub: ICONS[sector.id] + "  " + sectorShort(sector), onBack: () => setStep(challenge === "daily" ? "daily" : challenge && challenge.indexOf("sc_") === 0 ? "ch" : 1) }),
        jsxs(ScrollView, {
          style: { flex: 1 },
          contentContainerStyle: st.list,
          keyboardShouldPersistTaps: "handled",
          children: [
            jsx(Text, { style: st.inputLabel, children: "PICK YOUR LOOK" }),
            jsx(View, {
              style: st.avatars,
              children: AVATARS.map((a) =>
                jsx(
                  Touchable,
                  { style: [st.avatarOpt, a === avatar && st.avatarOn], onPress: () => setAvatar(a), activeOpacity: 0.85, children: jsx(Pic, { e: a, size: 56 }) },
                  a,
                ),
              ),
            }),
            jsx(Text, { style: st.inputLabel, children: "FOUNDER" }),
            jsx(TextInput, { style: st.input, value: founder, onChangeText: setFounder, placeholder: "Your name", placeholderTextColor: COLOR.text3, maxLength: 24 }),
            jsx(Text, { style: st.inputLabel, children: "COMPANY" }),
            jsx(TextInput, { style: st.input, value: company, onChangeText: setCompany, placeholder: "Company name", placeholderTextColor: COLOR.text3, maxLength: 28 }),
            challenge && jsx(Text, { style: st.inputLabel, children: "CHALLENGE" }),
            challenge && jsx(Text, { style: st.modeDesc, children: "🎯 " + (challenge === "daily" ? "Still running at week 26, with the highest valuation you can build. Your first try today goes on the leaderboard." : (CHALLENGES.concat((meta && meta.challenges) || []).find((c) => c.id === challenge) || {}).goal) }),
            !challenge && advanced[0],
            !challenge && advanced[1],
            jsxs(View, {
              style: st.brief,
              dataSet: { ff: "rise1" },
              children: [
                jsx(Text, { style: st.briefKicker, children: "DAY ONE" }),
                jsxs(View, {
                  style: st.statsRow,
                  children: [
                    [money(nums.cash), "in the bank", COLOR.vital],
                    [money(nums.burnWeek), "burn / week", COLOR.crit],
                    [nums.runway.toFixed(1) + " mo", "runway", COLOR.fog],
                  ].map(([v, l, c]) =>
                    jsxs(View, { style: st.stat, children: [jsx(Text, { style: [st.statV, { color: c }], children: v }), jsx(Text, { style: st.statL, children: l })] }, l),
                  ),
                }),
              ],
            }),
            // the weekly rules for challenges and first-timers; a returning player only needs the goal
            (challenge || firstRun) &&
              jsxs(View, {
                style: st.rules,
                dataSet: { ff: "rise2" },
                children: [
                  jsx(Text, { style: st.briefKicker, children: "HOW A WEEK WORKS" }),
                  // with the guided month on, the in-game tour teaches this by doing it
                  guided && !challenge
                    ? jsxs(View, { style: st.rule, children: [jsx(Text, { style: st.ruleIcon, children: "🎓" }), jsx(Text, { style: st.ruleTxt, children: "A one-minute, hands-on tutorial starts as soon as you found the company. You'll play your first week step by step." })] }, "tour")
                    : [
                    ["🎯", "Hit the weekly target by picking one strategy."],
                    ["⚡", "You get one personal action a week: rest, network, or reach out."],
                    ["⚖️", "Every few weeks a dilemma lands. There is no right option."],
                    ["🔍", "Talk to customers. Growth only works once people really want what you make."],
                    ["💵", "Costs grow as you grow. You're safe only when revenue after margin pays for everything."],
                    ["🌫️", "Stress drains clarity. Below 40% the fog hides your numbers. At 5% it's over."],
                    ].map(([icon, text]) =>
                      jsxs(View, { style: st.rule, children: [jsx(Text, { style: st.ruleIcon, children: icon }), jsx(Text, { style: st.ruleTxt, children: text })] }, icon),
                    ),
                  jsx(Text, { style: st.goal, children: GOAL }),
                ],
              }),
            !(challenge || firstRun) && jsx(Text, { style: [st.goal, st.goalLine], children: GOAL }),
          ],
        }),
        found({ sectorId: sector.id, avatar: avatar, mode: mode, challenge: challenge, guided: guided, background: bgInfo ? bgInfo.id : background }),
      ],
    });
  };

  const st = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLOR.ink },
    metaRow: { flexDirection: "row", gap: 10, marginTop: 10 },
    metaBtn: { flex: 1, alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 16, paddingVertical: 10, borderWidth: 1, borderColor: COLOR.line },
    metaTxt: { fontFamily: "Archivo_600SemiBold", fontSize: 14.5, color: COLOR.text, marginTop: 4 },
    metaSub: { fontFamily: "Archivo_500Medium", fontSize: 12, color: COLOR.text3, marginTop: 1 },
    heroArt: { width: 260, alignItems: "center", justifyContent: "center", marginTop: 16 },
    coverArch: { width: 214, height: 250 },
    coverArchSm: { width: 150, height: 176 },
    orbit: { position: "absolute" },
    heroFog: { position: "absolute", left: -40, right: -40, bottom: 20, height: 70 },
    rule2: { flexDirection: "row", alignItems: "flex-start", gap: 6, backgroundColor: COLOR.panel2, borderRadius: 10, padding: 8 },
    rule2Txt: { ...TYPE.body, flex: 1, fontSize: 12.5, lineHeight: 17, color: COLOR.text2 },
    guideRow: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#FFFFFF", borderRadius: 14, padding: 12, marginTop: 10 },
    check: { width: 26, height: 26, borderRadius: 8, borderWidth: 2, borderColor: COLOR.lineHot, alignItems: "center", justifyContent: "center" },
    checkOn: { backgroundColor: COLOR.vital, borderColor: COLOR.vital },
    checkTick: { color: "#fff", fontFamily: "Archivo_600SemiBold", fontSize: 15 },
    guideTitle: { fontFamily: "Archivo_600SemiBold", fontSize: 14.5, color: COLOR.text },
    guideSub: { ...TYPE.body, fontSize: 12.5, lineHeight: 17, color: COLOR.text2, marginTop: 2 },
    modes: { flexDirection: "row", gap: 8, marginTop: 4 },
    modeOpt: { flex: 1, alignItems: "center", gap: 4, paddingVertical: 10, paddingHorizontal: 4, borderRadius: 14, backgroundColor: "#FFFFFF", borderWidth: 2, borderColor: "transparent" },
    modeOn: { borderColor: "#2D7FF9", backgroundColor: "#E9F0FF" },
    modeName: { fontFamily: "Archivo_600SemiBold", fontSize: 10.5, lineHeight: 13, color: COLOR.text2, textAlign: "center" },
    modeDesc: { ...TYPE.body, fontSize: 13, lineHeight: 18, color: COLOR.text2, marginTop: 8 },
    avatars: { flexDirection: "row", gap: 10, marginBottom: 6 },
    avatarOpt: { flex: 1, aspectRatio: 1, maxWidth: 86, borderRadius: 20, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "transparent" },
    avatarOn: { borderColor: "#2D7FF9", backgroundColor: "#E9F0FF" },
    titleWrap: { flex: 1, backgroundColor: COLOR.ink, justifyContent: "space-between", padding: 24, overflow: "hidden" },
    titleFog: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 },
    titleCenter: { flex: 1, justifyContent: "center", alignItems: "center", gap: 10 },
    logoMark: { fontSize: 64, textAlign: "center" },
    logo: { fontFamily: "Archivo_600SemiBold", fontSize: 34, letterSpacing: -0.4, color: COLOR.accent, textAlign: "center", marginTop: 6 },
    logoTag: { ...TYPE.body, fontSize: 14, lineHeight: 21, color: COLOR.text2, textAlign: "center", maxWidth: 300 },
    langSwitch: { direction: "ltr", flexDirection: "row", alignSelf: "center", marginTop: 8, padding: 3, borderRadius: 999, backgroundColor: COLOR.panel, borderWidth: 1, borderColor: COLOR.lineHot, zIndex: 5 },
    langOpt: { minWidth: 64, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, alignItems: "center" },
    langOptOn: { backgroundColor: COLOR.accent },
    langTxt: { fontFamily: "Archivo_600SemiBold", fontSize: 14, color: COLOR.text2 },
    langTxtOn: { color: "#fff" },
    titleActions: { gap: 12, width: "100%", maxWidth: 440, alignSelf: "center" },
    saveCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLOR.panel,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: COLOR.lineHot,
      borderLeftWidth: 4,
      borderLeftColor: COLOR.vital,
    },
    saveKicker: { ...TYPE.label, color: COLOR.vital },
    saveTitle: { ...TYPE.screenTitle, fontSize: 18, color: COLOR.text, marginTop: 2 },
    saveSub: { ...TYPE.body, color: COLOR.text2, marginTop: 2 },
    saveArrow: { color: COLOR.vital, fontSize: 22, marginLeft: 8 },
    primaryBtn: { backgroundColor: COLOR.accent, borderRadius: 14, minHeight: 54, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 },
    primaryTxt: { fontFamily: "Archivo_600SemiBold", fontSize: 16, color: "#fff", letterSpacing: 0.2 },
    secondaryBtn: { backgroundColor: COLOR.panel2, borderWidth: 1, borderColor: COLOR.line },
    secondaryTxt: { color: COLOR.text },
    discard: { alignItems: "center", paddingVertical: 8 },
    discardTxt: { ...TYPE.label, color: COLOR.text3, textTransform: "none" },
    stepHeader: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
    stepTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
    backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLOR.panel, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: COLOR.line },
    backTxt: { color: COLOR.text, fontSize: 24, lineHeight: 26, marginTop: -2 },
    dots: { flexDirection: "row", gap: 6 },
    dot: { width: 22, height: 4, borderRadius: 2, backgroundColor: COLOR.line },
    dotOn: { backgroundColor: COLOR.accent },
    stepTitle: { fontFamily: "Archivo_600SemiBold", fontSize: 26, letterSpacing: -0.6, color: COLOR.text },
    stepSub: { ...TYPE.body, fontSize: 13.5, color: COLOR.text2, marginTop: 4 },
    list: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 8, gap: 10, width: "100%", maxWidth: 560, alignSelf: "center" },
    sector: { backgroundColor: COLOR.panel, borderRadius: 16, padding: 14, borderWidth: 1.5, borderColor: COLOR.line },
    sectorOn: { borderColor: COLOR.accent, backgroundColor: "#FFF6F2" },
    sectorTop: { flexDirection: "row", alignItems: "center", gap: 12 },
    sectorIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: COLOR.panel2, alignItems: "center", justifyContent: "center" },
    sectorIconOn: { backgroundColor: "#FFE3DA" },
    sectorEmoji: { fontSize: 24 },
    // the market picker: compact cards, the selected one opens
    sectorList: { gap: 8, paddingTop: 4 },
    sectorCompact: { paddingVertical: 11, paddingHorizontal: 12 },
    nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    firstBadge: { backgroundColor: "#E9F0FF", borderRadius: 999, paddingHorizontal: 7, paddingVertical: 2, flexShrink: 1 },
    firstBadgeTxt: { fontFamily: "Archivo_600SemiBold", fontSize: 10.5, color: COLOR.act },
    diff: { borderRadius: 999, paddingHorizontal: 9, paddingVertical: 3 },
    diffTxt: { fontFamily: "Archivo_600SemiBold", fontSize: 11 },
    pitch: { ...TYPE.body, fontSize: 12.5, lineHeight: 17, color: COLOR.text2, marginTop: 2 },
    miniStats: { flexDirection: "row", gap: 6, marginTop: 8 },
    mini: { flex: 1, alignItems: "center", backgroundColor: COLOR.panel2, borderRadius: 8, paddingVertical: 5, paddingHorizontal: 4, minWidth: 0 },
    miniTxt: { ...TYPE.body, fontSize: 11, color: COLOR.text3 },
    miniV: { fontFamily: "Archivo_600SemiBold", fontSize: 12.5, color: COLOR.text },
    more: { marginTop: 10, gap: 8, overflow: "hidden" },
    longName: { ...TYPE.body, fontSize: 11.5, color: COLOR.text3 },
    moreKicker: { fontFamily: "Archivo_600SemiBold", fontSize: 10.5, letterSpacing: 0.6, color: COLOR.text3, marginBottom: 3 },
    fogBox: { backgroundColor: "#FFF1E0", borderRadius: 12, padding: 10, borderWidth: 1, borderColor: "#FFD3A8" },
    fogTxt: { fontFamily: "Archivo_600SemiBold", fontSize: 14, lineHeight: 20, color: COLOR.text },
    fogCh: { ...TYPE.body, fontSize: 11.5, color: COLOR.fog, marginTop: 4 },
    whoBox: { backgroundColor: COLOR.panel2, borderRadius: 10, padding: 8, gap: 4 },
    who: { flexDirection: "row", alignItems: "center", gap: 8 },
    whoTxt: { ...TYPE.body, flex: 1, fontSize: 12.5, lineHeight: 17, color: COLOR.text2 },
    whoName: { fontFamily: "Archivo_600SemiBold", color: COLOR.text },
    plain: { ...TYPE.body, fontSize: 12.5, lineHeight: 18, color: COLOR.text2 },
    sectorName: { fontFamily: "Archivo_600SemiBold", fontSize: 15, color: COLOR.text, letterSpacing: -0.2 },
    statsRow: { flexDirection: "row", gap: 8, marginTop: 12 },
    stat: { flex: 1, backgroundColor: COLOR.panel2, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10 },
    statV: { fontFamily: "AzeretMono_600SemiBold", fontSize: 14, color: COLOR.text, letterSpacing: -0.3 },
    statL: { ...TYPE.body, fontSize: 10.5, color: COLOR.text3, marginTop: 2 },
    desc: { ...TYPE.body, fontSize: 13, lineHeight: 19, color: COLOR.text2, marginTop: 12 },
    footer: { padding: 16, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLOR.line, backgroundColor: COLOR.ink },
    inputLabel: { ...TYPE.label, color: COLOR.text3, marginTop: 8 },
    codeInput: { fontFamily: "AzeretMono_600SemiBold", fontSize: 20, letterSpacing: 2, textAlign: "center", writingDirection: "ltr" },
    input: {
      backgroundColor: COLOR.panel,
      borderWidth: 1.5,
      borderColor: COLOR.line,
      borderRadius: 14,
      paddingHorizontal: 16,
      height: 54,
      fontFamily: "Archivo_600SemiBold",
      fontSize: 17,
      color: COLOR.text,
      outlineStyle: "none",
    },
    brief: { backgroundColor: COLOR.panel, borderRadius: 16, padding: 14, marginTop: 10, borderWidth: 1, borderColor: COLOR.line },
    briefKicker: { ...TYPE.label, color: COLOR.text3 },
    rules: { backgroundColor: COLOR.panel, borderRadius: 16, padding: 14, gap: 10, borderWidth: 1, borderColor: COLOR.line },
    rule: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
    ruleIcon: { fontSize: 16, width: 22, textAlign: "center" },
    ruleTxt: { ...TYPE.body, fontSize: 13, lineHeight: 19, color: COLOR.text2, flex: 1 },
    goal: { ...TYPE.body, fontSize: 13, color: COLOR.gold, marginTop: 2 },
    goalLine: { marginTop: 12, textAlign: "center" },
    titleGoal: { ...TYPE.body, fontSize: 13, lineHeight: 18, color: COLOR.gold, textAlign: "center", maxWidth: 340, marginTop: 2 },
    customLink: { alignItems: "center", paddingVertical: 4, marginTop: -4 },
    customTxt: { fontFamily: "Archivo_600SemiBold", fontSize: 14, color: COLOR.act, textDecorationLine: "underline" },
    advHead: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#FFFFFF", borderRadius: 14, padding: 12, marginTop: 12, borderWidth: 1, borderColor: COLOR.line },
    advHeadOn: { borderColor: COLOR.lineHot },
    advTitle: { fontFamily: "Archivo_600SemiBold", fontSize: 14.5, color: COLOR.text },
    advSub: { ...TYPE.body, fontSize: 12.5, color: COLOR.text2, marginTop: 1 },
    advChev: { fontSize: 16, color: COLOR.text3 },
    advBody: { gap: 4, overflow: "hidden" },
    lockedTxt: { ...TYPE.body, fontSize: 12, color: COLOR.text3, marginTop: 6 },
  });
}
