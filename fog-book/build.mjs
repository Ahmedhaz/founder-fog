// Builds the Founder Fog picture book from content.js, with the Little Entrepreneur book's system:
//   fog/book/index.html (English) and ar.html (Arabic): a page-by-page web reader
//   fog/book/founder-fog-{en,ar}.pdf: A5 PDFs (same HTML, ?print)
//
//   node fog-book/build.mjs                web pages only
//   node fog-book/build.mjs --pdf          web pages + PDFs (needs playwright or playwright-core,
//                                          and CHROME_PATH or PLAYWRIGHT_BROWSERS_PATH)
//   node fog-book/build.mjs --print DIR    print-shop PDFs with 3 mm bleed into DIR (outside the repo)
//
// This public repo holds a sample: chapter 1, then a page with the full book's contents.
// The full book (chapters 2 to 12 and their art) is kept outside the repo. To build it:
//   FOG_FULL=/path/chapters.js FOG_ART=/path/art FOG_OUT=/path/out node fog-book/build.mjs --pdf
// No network: fonts, pictures and the QR code are local files.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const FULL = !!process.env.FOG_FULL;
const OUT = path.resolve(process.env.FOG_OUT || path.join(HERE, "../fog/book"));
const PDF = (lang) => `founder-fog${FULL ? "" : "-sample"}-${lang}.pdf`;
const C = require("./content.js");
const QR = fs.readFileSync(path.join(HERE, "qr-fog.svg"), "utf8").replace(/<\?xml[^>]*>/, "");

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
// Numbers stay readable in Arabic: each one sits in its own LTR isolate.
const nums = (s) => s.replace(/[$]?[+−-]?\d[\d,]*(?:\.\d+)?%?/g, (m) => `<bdi class="n">${m}</bdi>`);
const T = (o, lang) => nums(esc(o[lang]));
const img = (n, cls = "") => `<img src="art/${n}.jpg" alt="" class="${cls}">`;
const arch = (name, cls = "") => `<figure class="arch ${cls}"><img src="art/${name}.jpg" alt=""></figure>`;

// "The fog lifts": the idea behind a scene, with where it comes from.
function liftBox(l, lang) {
  return `<div class="idea lift">${img("hisham", "gp")}<div><b>${esc(C.ui.lift[lang])} · ${esc(l.t[lang])}</b><p>${T(l.d, lang)}</p>${l.src ? `<small>${esc(l.src[lang])}</small>` : ""}</div></div>`;
}

function pages(lang) {
  const P = [];
  const m = C.meta;
  const ar = lang === "ar";
  P.push({ cls: "cover fogcover", html: `
    <div class="cover-top"><span class="ages">${esc(m.tag[lang])}</span></div>
    <h1>${esc(m.title[lang])}</h1>
    <p class="cover-sub">${esc(m.subtitle[lang])}</p>
    ${arch("cover", "cover-art")}
    <p class="cover-foot">adam.ahmedhaz.com/fog</p>` });
  P.push({ cls: "titlepage", html: `
    <div class="tp-art">${img("hisham")}${img("salma")}${img("tariq")}</div>
    <h1>${esc(m.title[lang])}</h1>
    <h2 class="alt">${esc(m.title[ar ? "en" : "ar"])}</h2>
    ${C.title.lines.map((l) => `<p class="lead">${T(l, lang)}</p>`).join("")}
    <div class="credits">${C.title.credits.map((l) => `<p>${T(l, lang)}</p>`).join("")}</div>` });
  P.push({ cls: "parents", html: `
    <h2>${esc(C.intro.title[lang])}</h2>
    ${C.intro.paras.map((p) => `<p>${T(p, lang)}</p>`).join("")}
    <div class="toc"><h3>${esc(C.ui.contents[lang])}</h3>@@TOC@@</div>` });

  const starts = [];
  C.chapters.forEach((ch, ci) => {
    const label = `${esc(C.ui.chapter[lang])} <bdi class="n">${ci + 1}</bdi>`;
    starts.push(P.length + 1);
    // Chapter opener: title, week, the lead, Hisham's line, and what the chapter covers.
    P.push({ cls: "opener", html: `
      <div class="kicker">${label} · ${esc(C.ui.week[lang])} <bdi class="n">${ch.week}</bdi></div>
      <h1>${esc(ch.title[lang])}</h1>
      ${ch.open ? arch(ch.open, "mini") : ""}
      <p class="lead big">${T(ch.lead, lang)}</p>
      <blockquote>${T(ch.quote, lang)}<cite>${esc(ch.quoteBy[lang])}</cite></blockquote>
      <div class="inthis"><h3>${esc(C.ui.inThis[lang])}</h3><ul>${ch.scenes.map((s) => `<li>${img(s.art, "thumb")}<span>${esc(s.lift.t[lang])}</span></li>`).join("")}</ul></div>` });
    ch.scenes.forEach((s, i) => {
      const kicker = `<div class="kicker">${label} · <bdi class="n">${i + 1}</bdi></div>`;
      if (s.type === "equation") {
        const e = s.eq;
        // Long numbers (like 250,000) get a smaller size so the three boxes stay on one line.
        const long = [e.a, e.b, e.c].some((x) => String(x).length > 5) ? " long" : "";
        P.push({ cls: "story equation", html: `
          ${kicker}
          <h2>${T(s.title, lang)}</h2>
          <div class="eq${long}" dir="ltr">
            <div class="box in"><b>${e.a}</b><span>${esc(e.la[lang])}</span></div><i>${e.op || "−"}</i>
            <div class="box out"><b>${e.b}</b><span>${esc(e.lb[lang])}</span></div><i>=</i>
            <div class="box pr"><b>${e.c}</b><span>${esc(e.lc[lang])}</span></div>
          </div>
          ${arch(s.art, "mini")}
          <p class="text">${T(s.text, lang)}</p>
          ${liftBox(s.lift, lang)}` });
      } else {
        P.push({ cls: "story", html: `
          ${arch(s.art)}
          ${kicker}
          <h2>${T(s.title, lang)}</h2>
          <p class="text">${T(s.text, lang)}</p>
          ${liftBox(s.lift, lang)}` });
      }
    });
    // Tools page: calc (a op b = c), checks, lines to write on, or a tally of circles.
    const t = ch.tools;
    const sec = (x) => {
      const h = `<h3>${T(x.title, lang)}</h3>`;
      if (x.type === "calc") return h + `<div class="sumbox"><div class="sumrow" dir="ltr"><span class="blank lab"><em>${esc(x.a[lang])}</em></span><i>${x.op}</i><span class="blank lab"><em>${esc(x.b[lang])}</em></span><i>=</i><span class="blank big lab"><em>${esc(x.c[lang])}</em></span></div></div>`;
      if (x.type === "checks") return h + `<ul class="checks">${x.items.map((q) => `<li><i class="tick"></i><span>${T(q, lang)}</span></li>`).join("")}</ul>`;
      if (x.type === "tally") return h + (x.note ? `<p class="lead small">${T(x.note, lang)}</p>` : "") + `<div class="tally">${Array.from({ length: x.n }, (_, k) => `<span class="dot"><bdi class="n">${k + 1}</bdi></span>`).join("")}</div>`;
      return h + `<div class="wlines">${'<div class="wl"></div>'.repeat(x.n)}</div>`;
    };
    P.push({ cls: "worksheet tools", html: `
      <div class="kicker">${label}</div>
      <h2>${T(t.title, lang)}</h2>
      ${t.sections.map(sec).join("\n")}` });
  });

  if (!FULL) {
    const F = C.fullBook;
    P.push({ cls: "fullbook", html: `
      <h2>${esc(F.title[lang])}</h2>
      <p class="lead">${T(F.lead, lang)}</p>
      <ol class="fulltoc">${F.chapters.map(([ti, wk], i) => `<li class="${i === 0 ? "read" : ""}"><bdi class="n">${i + 1}</bdi><span>${esc(ti[lang])}</span><em>${esc(C.ui.week[lang])} <bdi class="n">${wk}</bdi></em></li>`).join("")}</ol>
      <p class="note">${T(F.note, lang)}</p>` });
  }
  P.push({ cls: "back", html: `
    <p class="blurb">${T(C.back.blurb, lang)}</p>
    <div class="qrbig">${QR}</div>
    <p class="b1">${esc(C.back.play[lang])}</p><p class="url">adam.ahmedhaz.com/founder-fog</p>
    <p class="b2">${esc(C.back.small[lang])}</p>
    <div class="back-art">${img("salma")}${img("tariq")}${img("hisham")}</div>` });

  const toc = C.chapters.map((ch, ci) => [`${C.ui.chapter[lang]} ${ci + 1}: ${ch.title[lang]}`, starts[ci]]);
  P[2].html = P[2].html.replace("@@TOC@@", `<ol>${toc.map(([t, p]) => `<li><span>${esc(t)}</span><i></i><bdi class="n">${p}</bdi></li>`).join("")}</ol>`);
  return P;
}

const CSS = fs.readFileSync(path.join(HERE, "book.css"), "utf8");
const JS = fs.readFileSync(path.join(HERE, "reader.js"), "utf8");

function html(lang) {
  const ar = lang === "ar";
  const P = pages(lang);
  const other = ar ? "en" : "ar";
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
<link rel="icon" type="image/png" href="../../founder-fog/icons/icon-192.png">
<style>${CSS}</style>
</head>
<body>
<header class="bar">
  <a class="home" href="../${ar ? "ar.html" : ""}"><img src="../../founder-fog/icons/icon-192.png" alt=""><span>${esc(C.meta.title[lang])}</span></a>
  <a class="chip" href="${ar ? "./" : "ar.html"}" lang="${other}">${esc(C.ui.lang[lang])}</a>
  <a class="chip" href="${PDF(lang)}" download>${esc(C.ui[FULL ? "pdf" : "sample"][lang])}</a>
  <a class="chip primary" href="../../founder-fog/${ar ? "ar.html" : ""}">${esc(C.ui.play[lang])}</a>
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
if (FULL) {
  // The full build writes outside the repo: bring the fonts and all the art along.
  const pub = path.join(HERE, "../fog/book");
  fs.cpSync(path.join(pub, "fonts"), path.join(OUT, "fonts"), { recursive: true });
  fs.cpSync(path.join(pub, "art"), path.join(OUT, "art"), { recursive: true });
  if (process.env.FOG_ART) fs.cpSync(path.resolve(process.env.FOG_ART), path.join(OUT, "art"), { recursive: true });
}
for (const lang of ["en", "ar"]) fs.writeFileSync(path.join(OUT, lang === "ar" ? "ar.html" : "index.html"), html(lang));
console.log("built", OUT);

const printDir = process.argv.includes("--print") ? path.resolve(process.argv[process.argv.indexOf("--print") + 1]) : null;
if (process.argv.includes("--pdf") || printDir) {
  let pw;
  try { pw = require("playwright"); } catch { pw = require("playwright-core"); }
  const browser = await pw.chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  const jobs = [];
  if (process.argv.includes("--pdf")) for (const lang of ["en", "ar"]) jobs.push([lang, "?print", path.join(OUT, PDF(lang)), null]);
  if (printDir) { fs.mkdirSync(printDir, { recursive: true }); for (const lang of ["en", "ar"]) jobs.push([lang, "?print&bleed", path.join(printDir, PDF(lang).replace(".pdf", "-print-bleed.pdf")), "@page { size: 154mm 216mm; margin: 0; }"]); }
  for (const [lang, q, out, css] of jobs) {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(path.join(OUT, lang === "ar" ? "ar.html" : "index.html")).href + q);
    if (css) await page.addStyleTag({ content: css });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true });
    console.log("pdf", out, Math.round(fs.statSync(out).size / 1024) + " KB");
    await page.close();
  }
  await browser.close();
}
