// Promo page behaviour: reveals, count-ups, the savings goal, self-advancing rails and the live
// energy meter. Everything pauses off-screen and respects prefers-reduced-motion. No network.
(function () {
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var IMG = "../little/img/";
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function ease(t) { return 1 - Math.pow(1 - t, 3); }
  function tween(ms, fn, done) {
    var t0 = performance.now();
    (function step(now) { var t = Math.min(1, (now - t0) / ms); fn(ease(t)); if (t < 1) requestAnimationFrame(step); else if (done) done(); })(t0);
  }

  // Headline words arrive one by one.
  var h1 = $("h1.words");
  if (h1 && !reduce) h1.innerHTML = h1.textContent.trim().split(/\s+/).map(function (w, i) { return '<span class="w" style="--i:' + i + '">' + w + "</span>"; }).join(" ");

  // Reading progress.
  var bar = $(".bar");
  function prog() { var h = document.documentElement.scrollHeight - innerHeight; bar.style.setProperty("--sp", h > 0 ? Math.min(1, scrollY / h) : 0); }
  addEventListener("scroll", prog, { passive: true }); prog();

  function count(el) {
    var to = +el.dataset.count, from = el.dataset.from != null ? +el.dataset.from : 0;
    if (reduce) { el.textContent = to; return; }
    tween(1300, function (t) { el.textContent = Math.round(from + (to - from) * t); });
  }

  if (!("IntersectionObserver" in window)) { $$(".reveal").forEach(function (el) { el.classList.add("in"); }); $$(".scene").forEach(function (el) { el.classList.add("live"); }); return; }
  var seen = new WeakSet();
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (x) {
      if (!x.isIntersecting) return;
      x.target.classList.add("in");
      $$("[data-count]", x.target).forEach(function (c) { if (!seen.has(c)) { seen.add(c); count(c); } });
      io.unobserve(x.target);
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  $$(".reveal").forEach(function (el) { io.observe(el); });
  var live = new IntersectionObserver(function (es) {
    es.forEach(function (x) { x.target.classList.toggle("live", x.isIntersecting); x.target.dispatchEvent(new CustomEvent(x.isIntersecting ? "live" : "idle")); });
  });
  $$(".scene").forEach(function (el) { live.observe(el); });

  // Hero: coins drop into the piggy bank until the gift for Mum is reached.
  var goal = $(".goalcard"), stage = $(".stage");
  if (goal) {
    var pig = $(".pig", goal), num = $("[data-goal]", goal), target = +num.dataset.goal, running = false;
    function coin() {
      var s = stage.getBoundingClientRect(), p = pig.getBoundingClientRect();
      var c = document.createElement("img");
      c.src = IMG + "coin.webp"; c.className = "coinfall"; c.alt = "";
      var x0 = s.width * (0.3 + Math.random() * 0.4), y0 = 30 + Math.random() * 60;
      c.style.left = x0 + "px"; c.style.top = y0 + "px";
      c.style.setProperty("--dx", (p.left - s.left + p.width / 2 - 14 - x0) + "px");
      c.style.setProperty("--dy", (p.top - s.top + 6 - y0) + "px");
      stage.appendChild(c);
      setTimeout(function () { c.remove(); pig.classList.remove("gulp"); void pig.offsetWidth; pig.classList.add("gulp"); }, 880);
    }
    function confetti() {
      var g = $(".gift", goal).getBoundingClientRect(), s = stage.getBoundingClientRect(), cols = ["#0D3F3F", "#8C6D45", "#D2B48A", "#EEE9E2", "#15595A"];
      for (var i = 0; i < 18; i++) {
        var c = document.createElement("i"); c.className = "confetti";
        c.style.left = (g.left - s.left + g.width / 2) + "px"; c.style.top = (g.top - s.top + 8) + "px";
        c.style.background = cols[i % cols.length];
        c.style.setProperty("--dx", (Math.random() * 200 - 100) + "px"); c.style.setProperty("--dy", (-50 - Math.random() * 140) + "px"); c.style.setProperty("--r", (Math.random() * 600 - 300) + "deg");
        stage.appendChild(c); setTimeout(function (el) { el.remove(); }.bind(null, c), 1200);
      }
    }
    function run() {
      if (running) return; running = true;
      goal.classList.remove("done");
      var drops = setInterval(coin, 380);
      tween(4600, function (t) { num.textContent = Math.round(target * t); goal.style.setProperty("--g", t); }, function () {
        clearInterval(drops); goal.classList.add("done"); confetti();
        setTimeout(function () { running = false; if (stage.closest(".scene").classList.contains("live")) { tween(600, function (t) { goal.style.setProperty("--g", 1 - t); num.textContent = Math.round(target * (1 - t)); }, run); } }, 3200);
      });
    }
    if (reduce) { num.textContent = target; goal.style.setProperty("--g", 1); goal.classList.add("done"); }
    else stage.closest(".scene").addEventListener("live", function () { setTimeout(run, 700); });
  }

  // Rails (game screens, book pages): advance on their own until touched; the middle one grows.
  $$(".rail").forEach(function (rail) {
    var items = $$("figure", rail), dots = $$("i", rail.nextElementSibling), user = false, auto = null;
    function active() {
      var r = rail.getBoundingClientRect(), mid = r.left + r.width / 2, best = 0, bd = 1e9;
      items.forEach(function (s, i) { var b = s.getBoundingClientRect(), d = Math.abs(b.left + b.width / 2 - mid); if (d < bd) { bd = d; best = i; } });
      items.forEach(function (s, i) { s.classList.toggle("active", i === best); });
      dots.forEach(function (d, i) { d.classList.toggle("on", i === best); });
      return best;
    }
    rail.addEventListener("scroll", function () { requestAnimationFrame(active); }, { passive: true });
    ["pointerdown", "wheel", "touchstart", "keydown"].forEach(function (ev) { rail.addEventListener(ev, function () { user = true; }, { passive: true }); });
    function next() {
      if (user) return;
      var i = active(), atEnd = rail.scrollWidth - rail.clientWidth - Math.abs(rail.scrollLeft) < 4;
      // At the end of the scroll (or the last item), go back to the start.
      if (atEnd || i === items.length - 1) { rail.scrollTo({ left: 0, behavior: reduce ? "auto" : "smooth" }); return; }
      var s = items[i + 1], r = rail.getBoundingClientRect(), b = s.getBoundingClientRect();
      rail.scrollBy({ left: b.left + b.width / 2 - (r.left + r.width / 2), behavior: reduce ? "auto" : "smooth" });
    }
    var sc = rail.closest(".scene");
    sc.addEventListener("live", function () { active(); if (!reduce && !auto) auto = setInterval(next, 3000); });
    sc.addEventListener("idle", function () { clearInterval(auto); auto = null; });
    active();
  });

  // Energy: the meter from the game. It plays a little day on its own; dragging takes over.
  var demo = $(".edemo");
  if (demo) {
    var range = $("input", demo), enumEl = $(".enum", demo), state = $(".estate", demo), stateImg = $(".estate > img", demo), stateTxt = $(".estate > span", demo);
    var lock = $(".door img", demo), touched = false, playing = null;
    function set(v) {
      v = Math.max(0, Math.min(100, Math.round(v)));
      demo.style.setProperty("--e", v / 100); enumEl.textContent = v; range.value = v;
      var sleepy = v < 40, open = v >= 70, key = sleepy ? "sleepy" : open ? "open" : "normal";
      demo.classList.toggle("sleepy", sleepy); demo.classList.toggle("open", open);
      if (state.dataset.k !== key) {
        state.dataset.k = key;
        stateImg.src = IMG + (sleepy ? "yawning_face" : open ? "partying_face" : "smiling_face_with_smiling_eyes") + ".webp";
        stateTxt.textContent = demo.dataset[key];
        lock.src = IMG + (open ? "unlocked" : "locked") + ".webp";
      }
    }
    range.addEventListener("input", function () { touched = true; clearTimeout(playing); set(+range.value); });
    var path = [86, 74, 58, 44, 32, 22, 38, 61, 78, 92], k = 0, cur = 86;
    function day() {
      if (touched || !demo.closest(".scene").classList.contains("live")) { playing = null; return; }
      var from = cur, to = path[k = (k + 1) % path.length];
      tween(1200, function (t) { if (!touched) { cur = from + (to - from) * t; set(cur); } }, function () { if (!touched) playing = setTimeout(day, 800); });
    }
    set(86);
    if (!reduce) demo.closest(".scene").addEventListener("live", function () { if (!playing && !touched) playing = setTimeout(day, 500); });
  }
})();
