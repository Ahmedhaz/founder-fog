// Builds the picture book from content.js:
//   littlebreneur/book/index.html (English) and ar.html (Arabic): a page-by-page web reader
//   littlebreneur/book/the-little-entrepreneur-{en,ar}.pdf: A5 PDFs for print (same HTML, ?print)
//
//   node little-book/build.mjs            web pages only
//   node little-book/build.mjs --pdf      web pages + PDFs (needs playwright or playwright-core,
//                                         and CHROME_PATH or PLAYWRIGHT_BROWSERS_PATH)
//   node little-book/build.mjs --print DIR   print-shop PDFs with 3 mm bleed (154 × 216 mm) into DIR,
//                                         kept out of the repo because the whole repo is published
// No network: the font, pictures and screenshots are all local files.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(HERE, "../littlebreneur/book");
const C = require("./content.js");
const QR = fs.readFileSync(path.join(HERE, "qr-little.svg"), "utf8").replace(/<\?xml[^>]*>/, "");

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
// Numbers stay readable in Arabic: each one sits in its own LTR isolate.
const nums = (s) => s.replace(/[+−-]?\d+(?:[.,]\d+)?%?/g, (m) => `<bdi class="n">${m}</bdi>`);
const T = (o, lang) => nums(esc(o[lang]));
// All pictures are the book's own needle-felted art in art/ (scenes sNN, objects o_*, grandpa).
const img = (n, cls = "", style = "") => `<img src="art/${n}.jpg" alt="" class="${cls}" style="${style}">`;
const arch = (name, cls = "", focus = "") => `<figure class="arch ${cls}"><img src="art/${name}.jpg" alt=""${focus ? ` style="object-position:${focus}"` : ""}></figure>`;

function ideaBox(o, lang) {
  return `<div class="idea">${img("grandpa", "gp")}<div><b>${esc(C.ui.idea[lang])}</b><p>${T(o, lang)}</p></div></div>`;
}

// Pencil activities after stories 2 to 4 (see C.activities); answers upside down at the bottom.
function activity(key, lang) {
  const A = C.activities[key], U = C.activityUi;
  const blank = '<span class="blank"></span>';
  // Numbers and sums like "10 × 2" stay one left-to-right unit, also in Arabic.
  const num = (x) => (typeof x === "number" || /^[\d ×+−=]+$/.test(x) ? `<bdi class="n">${esc(x)}</bdi>` : nums(esc(x)));
  const answers = [];
  const parts = A.sections.map((sec) => {
    const h = `<h3>${T(sec.title, lang)}</h3>`;
    if (sec.type === "table") {
      sec.rows.forEach((r) => answers.push(num(r.answer)));
      return h + `<table class="ptab"><thead><tr>${sec.head.map((x) => `<th>${esc(x[lang])}</th>`).join("")}</tr></thead>
        <tbody>${sec.rows.map((r) => `<tr><td class="nm">${img(r.img)}<span>${esc(r.name[lang])}</span></td>${r.cells.map((c) => `<td>${num(c)}</td>`).join("")}<td>${blank}</td></tr>`).join("")}</tbody></table>`;
    }
    if (sec.type === "ticks") {
      answers.push(sec.items.map((it) => esc(sec.options[it.answer][lang])).join(lang === "ar" ? "، " : ", "));
      return h + `<div class="keeps">${sec.items.map((it) => `<div class="kitem">${img(it.img)}<b>${esc(it.name[lang])}</b>${sec.options.map((o) => `<span><i class="tick"></i>${esc(o[lang])}</span>`).join("")}</div>`).join("")}</div>`;
    }
    if (sec.type === "box") {
      answers.push(num(sec.answer));
      return h + `<div class="boxq">${img(sec.img)}<p>${T(sec.text, lang)}</p>${blank}</div>`;
    }
    return h + `<div class="wlines">${'<div class="wl"></div>'.repeat(sec.n)}</div>`;
  });
  return { cls: "priceit", html: `
    <h2>${esc(A.title[lang])}</h2><p class="lead">${T(U.intro, lang)}</p>
    ${parts.join("\n")}
    <p class="answers">${esc(U.answers[lang])}: ${answers.join(" · ")}</p>` };
}

function pages(lang) {
  const P = [];
  const m = C.meta;
  const ar = lang === "ar";
  // 1. Cover
  P.push({ cls: "cover", html: `
    <div class="cover-top"><span class="ages">${T(m.ages, lang)}</span></div>
    <h1>${esc(m.title[lang])}</h1>
    <p class="cover-sub">${esc(m.subtitle[lang])}</p>
    ${arch("cover", "cover-art")}
    <p class="cover-foot">adam.ahmedhaz.com/littlebreneur</p>` });
  // 2. Title page
  P.push({ cls: "titlepage", html: `
    <div class="tp-art">${img("o_lemon")}${img("o_coin")}${img("o_piggy")}</div>
    <h1>${esc(m.title[lang])}</h1>
    <h2 class="alt">${esc(m.title[ar ? "en" : "ar"])}</h2>
    ${C.title.lines.map((l) => `<p class="lead">${T(l, lang)}</p>`).join("")}
    <div class="credits">${C.title.credits.map((l) => `<p>${T(l, lang)}</p>`).join("")}</div>` });
  // 3. For the grown-ups + contents (page numbers filled in below)
  P.push({ cls: "parents", html: `
    <h2>${esc(C.parents.title[lang])}</h2>
    ${C.parents.paras.map((p) => `<p>${T(p, lang)}</p>`).join("")}
    <div class="toc"><h3>${esc(C.ui.contents[lang])}</h3>@@TOC@@</div>` });
  // Part 1: the stories. Each one: its scenes, then Grandpa's ideas, then its activity (if any).
  const starts = [];
  C.stories.forEach((st, si) => {
    starts.push(P.length + 1);
    const label = `${esc(C.ui.story[lang])} ${si + 1}`;
    st.scenes.forEach((s, i) => {
      const kicker = `<div class="kicker">${label} · ${i === 0 ? esc(st.name[lang]) : `<bdi class="n">${i + 1}</bdi>`}</div>`;
      if (s.type === "equation") {
        const e = s.eq;
        P.push({ cls: "story equation", html: `
          ${kicker}
          <h2>${esc(s.title[lang])}</h2>
          <div class="eq" dir="ltr">
            <div class="box in"><b>${e.a}</b><span>${esc(e.la[lang])}</span></div><i>${e.op || "−"}</i>
            <div class="box out"><b>${e.b}</b><span>${esc(e.lb[lang])}</span></div><i>=</i>
            <div class="box pr"><b>${e.c}</b><span>${esc(e.lc[lang])}</span></div>
          </div>
          ${arch(s.art, "mini", s.focus)}
          <p class="text">${T(s.text, lang)}</p>
          ${ideaBox(s.idea, lang)}` });
      } else {
        P.push({ cls: "story", html: `
          ${arch(s.art)}
          ${kicker}
          <h2>${esc(s.title[lang])}</h2>
          <p class="text">${T(s.text, lang)}</p>
          ${ideaBox(s.idea, lang)}` });
      }
    });
    // Grandpa's ideas recap for this story
    P.push({ cls: "ideas", html: `
      <div class="kicker">${label} · ${esc(st.name[lang])}</div>
      <h2>${esc(C.ideasPage.title[lang])}</h2><p class="lead">${T(st.ideas, lang)}</p>
      <div class="stickers">${st.scenes.map((s, i) => `<div class="sticker" style="--r:${(i % 2 ? 1 : -1) * (1 + (i % 3) * 0.6)}deg">${img(s.art, "thumb")}<p>${T(s.idea, lang)}</p></div>`).join("")}</div>` });
    if (st.activity) P.push(activity(st.activity, lang));
  });
  // Worksheet
  const W = C.worksheet;
  P.push({ cls: "worksheet", html: `
    <h2>${esc(W.title[lang])}</h2><p class="lead">${T(W.intro, lang)}</p>
    ${W.fields.map((f) => `<div class="field"><span>${esc(f[lang])}</span><div class="line">${f.unit ? `<em>${esc(W.coins[lang])}</em>` : ""}</div></div>`).join("")}
    <div class="sumbox"><p>${esc(W.sum[lang])}</p><div class="sumrow" dir="ltr"><span class="blank"></span><i>−</i><span class="blank"></span><i>=</i><span class="blank big"></span></div></div>
    <div class="field goal">${img("o_gift", "gimg")}<span>${esc(W.goal[lang])}</span><div class="line"><em>${esc(W.coins[lang])}</em></div></div>
    <div class="piggyrow">${img("o_piggy")}${Array.from({ length: 10 }, () => '<span class="dot"></span>').join("")}</div>` });
  // Questions to talk about, two per story
  const talkPage = P.length + 1;
  P.push({ cls: "talk", html: `
    <h2>${esc(C.talk.title[lang])}</h2><p class="lead">${T(C.talk.intro, lang)}</p>
    ${C.talk.questions.map((qs, i) => `<div class="tq">${img(C.stories[i].scenes[0].art, "thumb")}<div><b>${esc(C.ui.story[lang])} ${i + 1} · ${esc(C.stories[i].name[lang])}</b><ul>${qs.map((q) => `<li>${T(q, lang)}</li>`).join("")}</ul></div></div>`).join("")}` });
  // Part 2: the game guide
  const manualStart = P.length + 1;
  P.push({ cls: "manual-intro", html: `
    <div class="kicker">${esc(C.ui.partTwo[lang])}</div>
    <h2>${esc(C.manualIntro.title[lang])}</h2>
    ${C.manualIntro.paras.map((p) => `<p>${T(p, lang)}</p>`).join("")}
    <div class="mi-art"><div class="phone"><img src="../shots/${lang}-plan.webp" alt=""></div>
      <div class="qr">${QR}<span>adam.ahmedhaz.com/little</span></div></div>` });
  C.manual.forEach((mp, i) => {
    P.push({ cls: "manual", html: `
      <div class="kicker">${esc(C.ui.partTwo[lang])} · ${i + 1}</div>
      <h2>${esc(mp.title[lang])}</h2>
      <div class="mrow ${mp.crop === "top" ? "stack" : ""}"><div class="phone ${mp.crop === "top" ? "crop-top" : ""}"><img src="../shots/${lang}-${mp.shot}.webp" alt=""></div>
        <ol class="steps">${mp.steps.map((s) => `<li>${T(s, lang)}</li>`).join("")}</ol></div>` });
  });
  const B = C.businesses;
  P.push({ cls: "biz", html: `
    <h2>${esc(B.title[lang])}</h2>
    <table><thead><tr>${B.head.map((h) => `<th>${esc(h[lang])}</th>`).join("")}</tr></thead>
    <tbody>${B.rows.map((r) => `<tr><td class="nm">${img(r.img)}<span>${esc(r.name[lang])}</span></td><td><bdi class="n">${r.cost}</bdi></td><td><bdi class="n">${r.prices}</bdi></td><td class="${r.left.en}">${esc(r.left[lang])}</td></tr>`).join("")}</tbody></table>
    <div class="tips"><div class="tips-h">${img("grandpa", "gp")}<h3>${esc(B.tipsTitle[lang])}</h3></div><ul>${B.tips.map((t) => `<li>${T(t, lang)}</li>`).join("")}</ul></div>` });
  P.push({ cls: "glossary", html: `
    <h2>${esc(C.glossary.title[lang])}</h2>
    <div class="words">${C.glossary.words.map((w) => `<div class="word">${img(w.img)}<div><b>${esc(w.w[lang])}</b><p>${T(w.d, lang)}</p></div></div>`).join("")}</div>` });
  const Ce = C.certificate;
  const certPage = P.length + 1;
  P.push({ cls: "cert", html: `
    <div class="cert-in">
      <div class="kicker">${esc(Ce.kicker[lang])}</div>
      <h2>${esc(Ce.title[lang])}</h2>
      ${img("grandpa", "cert-gp")}
      <p class="lead">${T(Ce.line, lang)}</p>
      ${Ce.fields.map((f) => `<div class="field"><span>${esc(f[lang])}</span><div class="line"></div></div>`).join("")}
      <div class="tp-art">${img("o_lemon")}${img("o_beads")}${img("o_bike")}${img("o_cupcake")}</div>
    </div>` });
  P.push({ cls: "back", html: `
    <p class="blurb">${T(C.back.blurb, lang)}</p>
    <div class="qrbig">${QR}</div>
    <p class="b1">${esc(C.back.lines[0][lang])}</p><p class="url">adam.ahmedhaz.com/little</p>
    <p class="b2">${esc(C.back.lines[1][lang])}</p>
    <div class="back-art">${img("o_lemon")}${img("o_beads")}${img("o_bike")}${img("o_cupcake")}</div>` });

  const toc = [
    ...C.stories.map((st, si) => [`${C.ui.story[lang]} ${si + 1}: ${st.name[lang]}`, starts[si]]),
    [C.worksheet.title[lang], talkPage - 1],
    [C.talk.title[lang], talkPage],
    [C.ui.partTwo[lang] + ": " + C.manualIntro.title[lang], manualStart],
    [C.businesses.title[lang], manualStart + C.manual.length + 1],
    [C.glossary.title[lang], manualStart + C.manual.length + 2],
    [C.certificate.kicker[lang], certPage],
  ];
  P[2].html = P[2].html.replace("@@TOC@@", `<ol>${toc.map(([t, p]) => `<li><span>${esc(t)}</span><i></i><bdi class="n">${p}</bdi></li>`).join("")}</ol>`);
  return P;
}

const CSS = fs.readFileSync(path.join(HERE, "book.css"), "utf8");
const JS = fs.readFileSync(path.join(HERE, "reader.js"), "utf8");

function html(lang) {
  const ar = lang === "ar";
  const P = pages(lang);
  const other = ar ? "en" : "ar";
  const file = ar ? "ar.html" : "index.html";
  const body = P.map((p, i) => `<section class="page ${p.cls}" data-n="${i + 1}">${p.html}${i > 0 && i < P.length - 1 ? `<footer class="pn"><bdi class="n">${i + 1}</bdi></footer>` : ""}</section>`).join("\n");
  return `<!doctype html>
<html lang="${lang}" dir="${ar ? "rtl" : "ltr"}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(C.meta.title[lang])} · ${ar ? "الكتاب المصوّر" : "The picture book"}</title>
<meta name="description" content="${esc(C.back.blurb[lang])}">
<link rel="canonical" href="${C.meta.promo}book/${ar ? "ar.html" : ""}">
<link rel="alternate" hreflang="en" href="${C.meta.promo}book/">
<link rel="alternate" hreflang="ar" href="${C.meta.promo}book/ar.html">
<meta property="og:title" content="${esc(C.meta.title[lang])}">
<meta property="og:description" content="${esc(C.back.blurb[lang])}">
<meta property="og:image" content="${C.meta.promo}og-${lang}.png">
<link rel="icon" type="image/png" href="../../little/icons/icon-192.png">
<style>${CSS}</style>
</head>
<body>
<header class="bar">
  <a class="home" href="../${ar ? "ar.html" : ""}"><img src="../../little/icons/icon-192.png" alt=""><span>${esc(C.meta.title[lang])}</span></a>
  <a class="chip" href="${ar ? "./" : "ar.html"}" lang="${other}">${esc(C.ui.lang[lang])}</a>
  <a class="chip" href="the-little-entrepreneur-${lang}.pdf" download>${esc(C.ui.pdf[lang])}</a>
  <a class="chip primary" href="../../little/?lang=${lang}">${esc(C.ui.play[lang])}</a>
</header>
<main class="reader"><div class="stage"><div class="book">
${body}
</div></div></main>
<nav class="nav"><button class="prev" aria-label="${esc(C.ui.prev[lang])}">${ar ? "→" : "←"}</button><span class="count" dir="ltr"><span class="cur">1</span> / ${P.length}</span><button class="next" aria-label="${esc(C.ui.next[lang])}">${ar ? "←" : "→"}</button></nav>
<script>${JS}</script>
</body>
</html>
`;
}

fs.mkdirSync(OUT, { recursive: true });
for (const lang of ["en", "ar"]) fs.writeFileSync(path.join(OUT, lang === "ar" ? "ar.html" : "index.html"), html(lang));
console.log("built", OUT);

const printDir = process.argv.includes("--print") ? path.resolve(process.argv[process.argv.indexOf("--print") + 1]) : null;
if (process.argv.includes("--pdf") || printDir) {
  let pw;
  try { pw = require("playwright"); } catch { pw = require("playwright-core"); }
  const browser = await pw.chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  for (const lang of ["en", "ar"]) {
    if (!process.argv.includes("--pdf")) break;
    const page = await browser.newPage();
    await page.goto(pathToFileURL(path.join(OUT, lang === "ar" ? "ar.html" : "index.html")).href + "?print");
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    const out = path.join(OUT, `the-little-entrepreneur-${lang}.pdf`);
    await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true });
    console.log("pdf", out, Math.round(fs.statSync(out).size / 1024) + " KB");
    await page.close();
  }
  if (printDir) {
    fs.mkdirSync(printDir, { recursive: true });
    for (const lang of ["en", "ar"]) {
      const page = await browser.newPage();
      await page.goto(pathToFileURL(path.join(OUT, lang === "ar" ? "ar.html" : "index.html")).href + "?print&bleed");
      await page.addStyleTag({ content: "@page { size: 154mm 216mm; margin: 0; }" });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(300);
      const out = path.join(printDir, `the-little-entrepreneur-${lang}-print-bleed.pdf`);
      await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true });
      console.log("print", out, Math.round(fs.statSync(out).size / 1024) + " KB");
      await page.close();
    }
  }
  await browser.close();
}
