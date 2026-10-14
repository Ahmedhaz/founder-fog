  // ================================================================ doors
  // How a decision is made.
  //   * The third door: some dilemmas have an option C, a mentor's answer. It
  //     only opens at clarity DOOR_CLARITY or more; below that the card shows
  //     it locked, so players learn that a clear head opens options.
  //   * Sleep on it: the book's rule 2, "Below 40, nothing irreversible." Any
  //     dilemma can wait one week, once. It costs a little (someone's patience,
  //     and a positive offer shrinks to 90%). Taken back above the fog line
  //     after being put off below it, the card shows what the fog was hiding.
  //   * The decision map: every decision is logged with its door, clarity and
  //     the echoes that came back from it; the report card draws it, and
  //     "Try the other door" replays the run from just before any decision
  //     (snapshots of the last SNAP_MAX decisions, kept outside the save).
  // shares App's scope (see stories.js, teach.js, meta.js, book.js).

  const DOOR_CLARITY = 70; // clarity needed to open a third door (option C)
  const FOG_LINE = 40; // below this the numbers fog over (FOG_THRESHOLD in the fog module)
  const SLEEP_GAIN = 0.9; // a decision put off a week: positive cash / MRR / users land at 90%
  const NO_SLEEP = ["ORG_BOARD", "ORG_COFOUNDER", "ST_NOUR"]; // these want an answer this week
  const SNAP_KEY = "founderFog.snaps",
    SNAP_MAX = 20;

  // the effects of a decision that was slept on: the good part of the offer is a little smaller
  function sleptFx(fx) {
    const out = {};
    for (const k in fx || {}) out[k] = (k === "cash" || k === "mrrPct" || k === "users") && fx[k] > 0 ? Math.round(fx[k] * SLEEP_GAIN * 1000) / 1000 : fx[k];
    if (out.cash) out.cash = Math.round(out.cash);
    if (out.users) out.users = Math.round(out.users);
    return out;
  }
  const libOf = (id) => LIBRARY.find((d) => d.id === id) || POP_DOORS[id] || null;
  // an option's effects in the library's format (the original game's events use the engine's keys)
  function optionFx(ev, side) {
    const d = libOf(ev.id);
    if (d && d[side]) return flatFx(d[side].fx);
    const e = (ev["option_" + side] && ev["option_" + side].effects) || {};
    return { trust: e.investorTrust, morale: e.teamMorale, cash: e.cash };
  }
  const isHome = (ev) => /Personal|Family|الشخصية|العائلة|الأسرة/.test(String(ev.category || "")) || ["A", "B"].some((k) => optionFx(ev, k).partner);

  // who has to wait, read from what the dilemma touches
  function sleepCost(s, ev) {
    const fx = ["A", "B", "C"].reduce((a, k) => Object.assign(a, optionFx(ev, k) || {}), {}),
      gains =
        !!LIBRARY.find((d) => d.id === ev.id) &&
        ["A", "B", "C"].some((k) => {
          const o = optionFx(ev, k) || {};
          return o.cash > 0 || o.mrrPct > 0 || o.users > 0;
        });
    if (isHome(ev) && trustOf(s, "nour") >= TRUST_HIGH) return { fx: { clarity: -1 }, gains: gains, nour: true }; // trust.js: Nour's patience buys the week
    if (fx.partner || fx.family) return { fx: { partner: -3 }, gains: gains };
    if (fx.cofounder) return { fx: { cofounder: -3 }, gains: gains };
    if (fx.trust || fx.boardTrust || fx.equity) return { fx: { trust: -2 }, gains: gains };
    if (fx.morale || fx.culture) return { fx: { morale: -2 }, gains: gains };
    return { fx: { churn: 0.2 }, gains: gains };
  }
  const sleepCostText = (c) => previewOf(c.fx) + (c.gains ? " | Gains −10%" : "");

  // the original game's dilemmas get their third door when they come up
  function withDoors(ev) {
    const d = ev && POP_DOORS[ev.id];
    if (!d || !d.C || ev.option_C) return ev;
    return { ...ev, option_C: { title: d.C.title, preview: previewOf(d.C.fx), effects: {}, log_text: d.C.log } };
  }

  // what the fog was hiding on a card: whether an option comes back later
  function hasEcho(ev, key) {
    const d = libOf(ev.id),
      side = String(key).slice(-1);
    return !!((d && d[side] && d[side].echo) || (ENGINE_ECHOES[ev.id] && ENGINE_ECHOES[ev.id][key]));
  }

  // ------------------------------------------------------------ snapshots
  // The state just before each decision, in localStorage next to the save
  // (not inside it), for the current run only.
  let snapCache = null; // parsed once per page
  function readSnaps() {
    if (snapCache) return snapCache;
    try {
      snapCache = JSON.parse(window.localStorage.getItem(SNAP_KEY) || "null") || { run: null, list: [] };
    } catch (e) {
      snapCache = { run: null, list: [] };
    }
    return snapCache;
  }
  function writeSnaps(v) {
    snapCache = v;
    for (let k = 0; k < 6; k++) {
      try {
        window.localStorage.setItem(SNAP_KEY, JSON.stringify(v));
        return;
      } catch (e) {
        if (!v.list.length) return;
        v.list = v.list.slice(Math.ceil(v.list.length / 3)); // out of room: drop the oldest
      }
    }
  }
  function snapState(s) {
    const c = { ...s };
    c.journalLog = (s.journalLog || []).slice(-25);
    delete c.metaTrophies;
    delete c.metaEnded;
    return JSON.stringify(c);
  }
  function saveSnap(s, i) {
    try {
      const v = readSnaps();
      if (v.run !== s.runId) (v.run = s.runId), (v.list = []);
      v.list = v.list
        .filter((x) => x.i !== i)
        .concat([{ i: i, w: s.week, id: s.pendingEvent.id, json: snapState(s) }])
        .slice(-SNAP_MAX);
      writeSnaps(v);
    } catch (e) {}
  }
  function snapFor(s, i) {
    const v = readSnaps();
    return (v.run === s.runId && v.list.find((x) => x.i === i)) || null;
  }
  // the state to replay from: decision i of this run, and the snapshots before it to carry over
  function replayState(s, i) {
    const v = readSnaps(),
      snap = v.run === s.runId && v.list.find((x) => x.i === i);
    if (!snap) return null;
    const r = JSON.parse(snap.json),
      d = ensureTeach(s).decisions[i] || {};
    r.replay = { w: snap.w, id: snap.id, was: d.door || null, of: s.runId };
    r.daily = null; // never on the daily board
    r.gameOver = r.victory = !1;
    if (r.teach) r.teach.note = null;
    return { state: r, keep: v.list.filter((x) => x.i < i) };
  }
  const keepSnaps = (s, list) => writeSnaps({ run: s.runId, list: list });

  (function () {
    const P = Engine.StartupEngine.prototype;
    if (P.__doors) return;
    P.__doors = true;

    // one week's grace, once per dilemma
    P.canSleep = function () {
      const ev = this.state.pendingEvent;
      return !!(ev && ev.id && !ev.slept && !NO_SLEEP.includes(ev.id) && !this.state.gameOver && !this.state.victory);
    };
    P.sleepOnEvent = function () {
      const s = this.state,
        ev = s.pendingEvent;
      if (!this.canSleep()) return { success: !1, reason: "This one needs an answer this week." };
      const st = ensureStory(s),
        cost = sleepCost(s, ev),
        card = { ...ev, slept: { w: s.week, c: Math.round(s.mentalClarity) } };
      // the offer cools a little while you sleep on it
      if (cost.gains) {
        const d = libOf(ev.id);
        ["A", "B", "C"].forEach((k) => d && d[k] && card["option_" + k] && (card["option_" + k] = { ...card["option_" + k], preview: previewOf(sleptFx(d[k].fx)) }));
      }
      (st.slept = st.slept || []).push(card);
      s.pendingEvent = null;
      const t = ensureTeach(s);
      t.slept = (t.slept || 0) + 1;
      applyFx(this, cost.fx);
      this.addLog("😴 Slept on it: " + leadEmoji(ev.title)[1], cost.nour ? "Nour said take the week. It comes back first thing next week." : "You put the decision off for a week. It comes back first thing next week.", "mentor");
      track("sleep", s, { id: ev.id, clarity: Math.round(s.mentalClarity) });
      return { success: !0, state: this.recalculate() };
    };
    // a slept-on decision comes back as soon as nothing else is waiting
    const wake = (s) => {
      const st = ensureStory(s);
      if (s.pendingEvent || s.gameOver || s.victory || !(st.slept || []).length) return false;
      const k = st.slept.findIndex((e) => e.slept.w < s.week);
      if (k < 0) return false;
      s.pendingEvent = st.slept.splice(k, 1)[0];
      return true;
    };

    const advance = P.advanceWeek;
    P.advanceWeek = function (...args) {
      advance.apply(this, args);
      const s = this.state;
      if (s.pendingEvent) s.pendingEvent = withDoors(s.pendingEvent);
      if (wake(s) && s.mkt) s.mkt.notes.unshift(["😴", "The decision you slept on is back.", 0]);
      return this.recalculate();
    };

    const resolve = P.resolveEventChoice;
    P.resolveEventChoice = function (key = "option_A") {
      const s = this.state,
        ev = s.pendingEvent;
      if (!ev) return resolve.call(this, key);
      if (key === "option_C" && (!ev.option_C || s.mentalClarity < DOOR_CLARITY)) return s; // the third door is locked
      const t = ensureTeach(s),
        n = t.decisions.length,
        clarity = Math.round(s.mentalClarity),
        st = ensureStory(s);
      if (ev.id) saveSnap(s, n);
      if (ev.slept && ev.slept.c < FOG_LINE && clarity >= FOG_LINE) st.clearWake = (st.clearWake || 0) + 1;
      resolve.call(this, key);
      const d = t.decisions[n];
      if (d && d.id === ev.id) {
        d.door = String(key).slice(-1);
        d.clarity = clarity;
        if (ev.slept) d.slept = ev.slept.w;
      }
      if (ev.id) track("decision", s, { id: ev.id, door: String(key).slice(-1), slept: !!ev.slept, clarity: clarity });
      wake(s);
      return this.state;
    };
  })();

  TROPHIES.push({ id: "slept", icon: "🧘", name: "Slept on it", desc: "Put off a decision in the fog, then make it with a clear head.", check: (s) => !!(s.story && s.story.clearWake) });

  // ------------------------------------------------------ the decision map
  // the 16 decisions of the book Founder Fog, by chapter (book.js)
  const bookChapter = (id) => (FOG_BOOK.find((b) => b.src === id) || {}).ch || null;

  function DecisionMap({ S, tp, onReplay }) {
    const t = ensureTeach(S),
      echoes = S.echoLog || [],
      list = t.decisions.map((d, i) => ({ d: d, i: i })).filter((x) => x.d.id);
    if (!list.length) return null;
    return jsxs(View, {
      style: tst.card,
      children: [
        jsx(Text, { style: tst.cardKicker, children: "YOUR DECISION MAP" }),
        jsx(Text, { style: [tst.hint, { marginTop: 0, marginBottom: 8 }], children: "Every decision, and what came back from it." }),
        ...list.map(({ d, i }, idx) => {
          const back = echoes.filter((e) => e.from === d.week && (!e.id || e.id === d.id)),
            turning = !!tp && tp.week === d.week && tp.id === d.id,
            ch = bookChapter(d.id),
            snap = snapFor(S, i),
            last = idx === list.length - 1;
          return jsxs(
            View,
            {
              style: dst.step,
              children: [
                jsxs(View, { style: dst.rail, children: [jsx(View, { style: [dst.dot, turning && dst.dotHot, d.door === "C" && dst.dotC] }), !last && jsx(View, { style: dst.line })] }),
                jsxs(View, {
                  style: [dst.body, turning && dst.bodyHot],
                  children: [
                    turning && jsx(Text, { style: dst.hotTag, children: "THE TURNING POINT" }),
                    jsx(Text, { style: dst.week, children: "Week " + d.week }),
                    jsx(Text, { style: dst.title, children: leadEmoji(String(d.title || ""))[1] }),
                    d.choice && jsx(Text, { style: dst.choice, children: (d.door ? "Door " + d.door + ": " : "") + d.choice }),
                    jsxs(View, {
                      style: dst.tags,
                      children: [
                        d.clarity != null && jsx(Text, { style: [dst.tag, d.clarity < FOG_LINE && dst.tagFog], children: "Clarity " + d.clarity }),
                        d.slept && jsx(Text, { style: dst.tag, children: "😴 Slept on it" }),
                      ],
                    }),
                    ...back.map((e, k) => jsx(Text, { style: dst.echo, children: "⏪ " + e.title + " · came back in week " + e.week }, "e" + k)),
                    ch && jsx(Text, { style: dst.book, children: "This decision is chapter " + ch + " of the book Founder Fog" }),
                    snap &&
                      jsx(Touchable, {
                        style: dst.replay,
                        activeOpacity: 0.8,
                        onPress: () => onReplay(i),
                        children: jsx(Text, { style: dst.replayTxt, children: "Try the other door ▸" }),
                      }),
                  ],
                }),
              ],
            },
            "d" + i,
          );
        }),
        jsx(Text, { style: tst.hint, children: "Trying the other door starts a new company from that week. Replays earn no trophies." }),
      ],
    });
  }

  const dst = StyleSheet.create({
    step: { flexDirection: "row", gap: 10, alignItems: "stretch" },
    rail: { width: 14, alignItems: "center" },
    dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLOR.act, marginTop: 14 },
    dotHot: { backgroundColor: COLOR.gold, width: 14, height: 14, borderRadius: 7 },
    dotC: { backgroundColor: COLOR.vital },
    line: { flex: 1, width: 2, backgroundColor: COLOR.line, marginTop: 2 },
    body: { flex: 1, paddingVertical: 8, paddingHorizontal: 10, marginBottom: 6, borderRadius: 12 },
    bodyHot: { backgroundColor: "#FFF4D6", borderWidth: 1, borderColor: "#F3C77A" },
    hotTag: { fontFamily: "AzeretMono_600SemiBold", fontSize: 9.5, letterSpacing: 1, color: COLOR.gold, marginBottom: 2 },
    week: { fontFamily: "AzeretMono_500Medium", fontSize: 11, color: COLOR.text3 },
    title: { fontFamily: "Archivo_600SemiBold", fontSize: 14.5, lineHeight: 20, color: COLOR.text, marginTop: 1 },
    choice: { fontFamily: "Archivo_400Regular", fontSize: 13.5, lineHeight: 19, color: COLOR.text2, marginTop: 2 },
    tags: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 5 },
    tag: { fontFamily: "Archivo_500Medium", fontSize: 11.5, color: COLOR.text2, backgroundColor: COLOR.panel2, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2, overflow: "hidden" },
    tagFog: { color: COLOR.fog, backgroundColor: "#FFF1DC" },
    echo: { fontFamily: "Archivo_500Medium", fontSize: 12.5, lineHeight: 18, color: COLOR.text2, marginTop: 5 },
    book: { fontFamily: "Archivo_500Medium", fontSize: 12.5, lineHeight: 18, color: COLOR.act, marginTop: 5 },
    replay: { alignSelf: "flex-start", marginTop: 7, borderRadius: 10, borderWidth: 1, borderColor: COLOR.lineHot, paddingHorizontal: 10, paddingVertical: 6 },
    replayTxt: { fontFamily: "Archivo_600SemiBold", fontSize: 13, color: COLOR.act },
  });
