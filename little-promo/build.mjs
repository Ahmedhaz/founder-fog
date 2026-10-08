// Builds the promo site littlebreneur/index.html (English) and ar.html (Arabic) from content.js.
//   node little-promo/build.mjs
// The page uses the game's bundled fonts and pictures (../little/), the book's art (book/art/),
// screenshots (shots/) and book page renders (img/). Nothing loads from other websites.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(HERE, "../littlebreneur");
const C = require("./content.js");
const CSS = fs.readFileSync(path.join(HERE, "promo.css"), "utf8");
const JS = fs.readFileSync(path.join(HERE, "promo.js"), "utf8");
const BASE = "https://adam.ahmedhaz.com/littlebreneur/";

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const nums = (s) => s.replace(/[+−-]?\d+(?:[.,]\d+)?%?/g, (m) => `<bdi class="n">${m}</bdi>`);
const T = (o, l) => nums(esc(o[l]));
const gi = (n, cls = "round", lazy = true) => `<img src="../little/img/${n}.webp" alt="" class="${cls}" width="160" height="160"${lazy ? ' loading="lazy"' : ""}>`;

function page(l) {
  const ar = l === "ar", other = ar ? "en" : "ar", file = ar ? "ar.html" : "index.html";
  const url = BASE + (ar ? "ar.html" : "");
  const game = `../little/?lang=${l}`, book = `book/${ar ? "ar.html" : ""}`, pdf = `book/the-little-entrepreneur-${l}.pdf`;
  const H = C.hero, TW = C.two, F = C.family, W = C.week, S = C.screens, B = C.bookIn, E = C.energy, K = C.skills, PH = C.phone, P = C.parents, Q = C.faq, FI = C.finale;
  return `<!doctype html>
<html lang="${l}" dir="${ar ? "rtl" : "ltr"}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(C.meta.title[l])}</title>
<meta name="description" content="${esc(C.meta.desc[l])}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="en" href="${BASE}">
<link rel="alternate" hreflang="ar" href="${BASE}ar.html">
<link rel="alternate" hreflang="x-default" href="${BASE}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(C.meta.title[l])}">
<meta property="og:description" content="${esc(C.meta.desc[l])}">
<meta property="og:image" content="${BASE}og-${l}.png">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="${ar ? "ar_AR" : "en_US"}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#FBFAF9">
<link rel="icon" type="image/png" href="../little/icons/icon-192.png">
<link rel="apple-touch-icon" href="../little/icons/icon-192.png">
<link rel="preload" href="../little/fonts/${ar ? "ReadexPro" : "Manrope"}.ttf" as="font" type="font/ttf" crossorigin>
<script>
  // First visit follows the device language; a choice made here or in the game is remembered (little.v1.meta, this device only).
  (function () {
    document.documentElement.classList.add("js");
    var page = document.documentElement.lang, pref = null;
    try { pref = (JSON.parse(localStorage.getItem("little.v1.meta") || "{}") || {}).lang || null; } catch (e) {}
    var want = pref || ((navigator.language || "").toLowerCase().indexOf("ar") === 0 ? "ar" : "en");
    if (want !== page && !/[?&]stay/.test(location.search)) location.replace(want === "ar" ? "ar.html" : "./");
  })();
  function setLang(l) { try { var m = JSON.parse(localStorage.getItem("little.v1.meta") || "{}") || {}; m.lang = l; localStorage.setItem("little.v1.meta", JSON.stringify(m)); } catch (e) {} }
</script>
<style>${CSS}</style>
</head>
<body>
<header class="bar"><div class="wrap">
  <a class="logo" href="./"><img src="../little/icons/icon-192.png" alt=""><span>${esc(C.meta.brand[l])}</span></a>
  <nav class="links"><a href="#game">${esc(C.nav.game[l])}</a><a href="#book">${esc(C.nav.book[l])}</a><a href="#parents">${esc(C.nav.parents[l])}</a></nav>
  <a class="btn btn-sm" href="${ar ? "./" : "ar.html"}" hreflang="${other}" lang="${other}" onclick="setLang('${other}')">${C.nav.lang[l]}</a>
  <a class="btn btn-primary btn-sm hide-sm" href="${game}">${esc(C.nav.play[l])}</a>
</div><span class="progress" aria-hidden="true"></span></header>
<main>
  <section class="hero scene"><div class="wrap">
    <div class="hero-grid">
      <div>
        <div class="kicker reveal">${esc(H.kicker[l])}</div>
        <h1 class="words">${esc(H.h1[l])}</h1>
        <p class="sub reveal" style="--i:2">${T(H.sub, l)}</p>
        <div class="ctas reveal" style="--i:3"><a class="btn btn-primary" href="${game}">${gi("lemon", "", false)}${esc(H.play[l])}</a><a class="btn" href="${book}">${gi("books", "", false)}${esc(H.read[l])}</a></div>
        <p class="note reveal" style="--i:4">${esc(H.note[l])}</p>
      </div>
      <div class="stage reveal">
        <figure class="arch" style="margin:0"><img src="book/art/cover.jpg" alt="${esc(C.meta.brand[l])}"></figure>
        <div class="phone"><img src="shots/${l}-home.webp" alt=""></div>
        <img class="bookmini" src="img/page-${l}-01.jpg" alt="">
        <div class="goalcard" aria-label="${esc(H.goal[l])}">
          <small>${esc(H.goal[l])}</small>${gi("pig_face", "round pig", false)}<div class="gbar"><i></i></div>${gi("wrapped_gift", "round gift", false)}
          <b class="gnum"><bdi class="n"><span data-goal="220">0</span> / 220</bdi></b>
        </div>
      </div>
    </div>
    <div class="stats">${C.stats.map(([n, lab], i) => `<div class="stat reveal" style="--i:${i}"><b><bdi class="n" data-count="${n}">${n}</bdi></b><span>${esc(lab[l])}</span></div>`).join("")}</div>
  </div></section>

  <section class="ivory" id="game"><div class="wrap">
    <div class="kicker reveal">${esc(TW.kicker[l])}</div>
    <h2 class="reveal">${esc(TW.h2[l])}</h2>
    <div class="two">
      <article class="prod reveal"><div class="vis"><div class="phone"><img loading="lazy" src="shots/${l}-plan.webp" alt=""></div></div>
        <div><h3>${esc(TW.game.title[l])}</h3><p>${T(TW.game.lead, l)}</p><ul>${TW.game.points.map((p) => `<li>${T(p, l)}</li>`).join("")}</ul>
        <div class="ctas"><a class="btn btn-primary" href="${game}">${esc(TW.game.cta[l])}</a></div></div></article>
      <article class="prod reveal" style="--i:1" id="book"><div class="vis"><img class="cover" loading="lazy" src="img/page-${l}-01.jpg" alt=""></div>
        <div><h3>${esc(TW.book.title[l])}</h3><p>${T(TW.book.lead, l)}</p><ul>${TW.book.points.map((p) => `<li>${T(p, l)}</li>`).join("")}</ul>
        <div class="ctas"><a class="btn btn-primary" href="${book}">${esc(TW.book.cta[l])}</a><a class="btn" href="${pdf}" download>${esc(TW.book.pdf[l])}</a></div></div></article>
    </div>
  </div></section>

  <section class="family"><div class="wrap split">
    <figure class="arch reveal" style="margin:0"><img loading="lazy" src="img/family.jpg" alt=""></figure>
    <div>
      <div class="kicker reveal">${esc(F.kicker[l])}</div>
      <h2 class="reveal">${esc(F.h2[l])}</h2>
      <div class="people">${F.people.map((p, i) => `<div class="person reveal" style="--i:${i}">${gi(["girl", "boy", "old_man"][i])}<div><b>${esc(p.n[l])}</b><span>${T(p.d, l)}</span></div></div>`).join("")}</div>
    </div>
  </div></section>

  <section class="sand"><div class="wrap">
    <div class="kicker reveal">${esc(W.kicker[l])}</div>
    <h2 class="reveal">${esc(W.h2[l])}</h2>
    <ol class="steps">${W.steps.map(([ic, b, p], i) => `<li class="reveal" style="--i:${i}">${gi(ic)}<b>${esc(b[l])}</b><p>${T(p, l)}</p></li>`).join("")}</ol>
  </div></section>

  <section class="scene"><div class="wrap">
    <div class="kicker reveal">${esc(S.kicker[l])}</div>
    <h2 class="reveal">${esc(S.h2[l])}</h2>
    <div class="rail" tabindex="0">${S.items.map(([k, b, p]) => `<figure><div class="phone"><img loading="lazy" src="shots/${l}-${k}.webp" alt="${esc(b[l])}"></div><figcaption><b>${esc(b[l])}</b>${T(p, l)}</figcaption></figure>`).join("")}</div>
    <div class="dots" aria-hidden="true">${"<i></i>".repeat(S.items.length)}</div>
  </div></section>

  <section class="ivory scene"><div class="wrap">
    <div class="kicker reveal">${esc(B.kicker[l])}</div>
    <h2 class="reveal">${esc(B.h2[l])}</h2>
    <p class="sub reveal">${T(B.sub, l)}</p>
    <div class="rail" tabindex="0">${B.pages.map(([n, cap]) => `<figure><a class="page" href="${book}#p${+n}" style="display:block"><img loading="lazy" src="img/page-${l}-${n}.jpg" alt="${esc(cap[l])}"></a><figcaption><b>${esc(cap[l])}</b></figcaption></figure>`).join("")}</div>
    <div class="dots" aria-hidden="true">${"<i></i>".repeat(B.pages.length)}</div>
    <div class="ctas reveal" style="justify-content:center;margin-top:18px"><a class="btn btn-primary" href="${book}">${esc(B.cta[l])}</a><a class="btn" href="${pdf}" download>${esc(TW.book.pdf[l])}</a></div>
  </div></section>

  <section class="teal scene"><div class="wrap split">
    <div>
      <div class="kicker reveal">${esc(E.kicker[l])}</div>
      <h2 class="reveal">${esc(E.h2[l])}</h2>
      <p class="sub reveal">${T(E.p, l)}</p>
    </div>
    <div class="reveal">
      <div class="edemo" data-sleepy="${esc(E.sleepy[l])}" data-normal="${esc(E.normal[l])}" data-open="${esc(E.open[l])}">
        <div class="erow">${gi("high_voltage")}<span class="elabel">${esc(E.label[l])}</span><b class="enum" dir="ltr">86</b></div>
        <div class="ebar"><i></i><span class="m m40"></span><span class="m m70"></span></div>
        <div class="marks" aria-hidden="true"><span class="k40"><bdi class="n">40</bdi></span><span class="k70"><bdi class="n">70</bdi></span></div>
        <div class="estate">${gi("partying_face")}<span>${esc(E.open[l])}</span><span class="door">${gi("unlocked")}${esc(E.door[l])}</span></div>
        <input type="range" min="0" max="100" value="86" aria-label="${esc(E.label[l])}">
        <small>${esc(E.try[l])}</small>
      </div>
    </div>
  </div></section>

  <section><div class="wrap">
    <div class="kicker reveal">${esc(K.kicker[l])}</div>
    <h2 class="reveal">${esc(K.h2[l])}</h2>
    <div class="grid4">${K.items.map(([ic, b, p], i) => `<div class="card reveal" style="--i:${i}">${gi(ic)}<h3>${esc(b[l])}</h3><p>${T(p, l)}</p></div>`).join("")}</div>
  </div></section>

  <section class="sand"><div class="wrap split">
    <div>
      <div class="kicker reveal">${esc(PH.kicker[l])}</div>
      <h2 class="reveal">${esc(PH.h2[l])}</h2>
      <ol class="phonesteps">${PH.steps.map((s, i) => `<li class="reveal" style="--i:${i}"><span>${T(s, l)}</span></li>`).join("")}</ol>
      <div class="ctas reveal" style="margin-top:20px"><a class="btn btn-primary" href="${game}">${esc(C.nav.play[l])}</a></div>
    </div>
    <div class="reveal"><div class="phone" style="width:min(250px,64vw);margin-inline:auto"><img loading="lazy" src="shots/${l}-report.webp" alt=""></div></div>
  </div></section>

  <section id="parents"><div class="wrap split">
    <div>
      <div class="kicker reveal">${esc(P.kicker[l])}</div>
      <h2 class="reveal">${esc(P.h2[l])}</h2>
      <ul class="ticks">${P.items.map(([ic, b, p], i) => `<li class="reveal" style="--i:${i}">${gi(ic)}<div><b>${esc(b[l])}</b><span>${T(p, l)}</span></div></li>`).join("")}</ul>
    </div>
    <div class="reveal"><a href="${book}#p17" style="display:block;max-width:330px;margin-inline:auto"><img loading="lazy" src="img/page-${l}-17.jpg" alt="" style="border-radius:6px;box-shadow:var(--shadow)"></a></div>
  </div></section>

  <section class="ivory"><div class="wrap" style="max-width:820px">
    <div class="kicker reveal">${esc(Q.kicker[l])}</div>
    <h2 class="reveal">${esc(Q.h2[l])}</h2>
    ${Q.items.map(([q, a], i) => `<details class="reveal" style="--i:${i}"><summary>${esc(q[l])}</summary><p>${T(a, l)}</p></details>`).join("")}
  </div></section>

  <section class="teal finale"><div class="wrap">
    <div class="row" aria-hidden="true">${gi("girl")}${gi("old_man")}${gi("boy")}</div>
    <h2 class="reveal">${esc(FI.h2[l])}</h2>
    <p class="sub reveal">${T(FI.p, l)}</p>
    <div class="ctas reveal"><a class="btn btn-light" href="${game}">${esc(H.play[l])}</a><a class="btn btn-ghost" href="${book}">${esc(H.read[l])}</a></div>
  </div></section>
</main>
<footer><div class="wrap"><p>${esc(C.foot.line[l])} · <a href="../fog/${ar ? "ar.html" : ""}">${ar ? "ضباب المؤسس" : "Founder Fog"}</a></p><p><small>${ar ? C.foot.credit[l].replace(/(Manrope|Readex Pro|OFL)/g, "<bdi>$1</bdi>") : esc(C.foot.credit[l])}</small></p></div></footer>
<script>${JS}</script>
</body>
</html>
`;
}

for (const l of ["en", "ar"]) fs.writeFileSync(path.join(OUT, l === "ar" ? "ar.html" : "index.html"), page(l));
console.log("built", OUT);
