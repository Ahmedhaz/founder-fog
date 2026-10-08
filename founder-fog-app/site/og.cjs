// Renders the 1200x630 social cards from the built pages' own assets.
const { chromium } = require(process.env.PLAYWRIGHT || "/opt/node-tools/node_modules/playwright");
const path = require("path");
const fs = require("fs");
// pages rendered with setContent can't read file:// URLs, so assets go in as data URIs
const data = (file, type) => `data:${type};base64,` + fs.readFileSync(file).toString("base64");
const FONTS = path.join(__dirname, "..", "enhance", "fonts");
const out = process.argv[2];
const T = {
  en: { dir: "ltr", font: "Manrope", title: "Build a company.<br>Keep your head clear.", sub: "The startup game that tells the truth · free · English & Arabic", brand: "Founder Fog" },
  ar: { dir: "rtl", font: "Readex Pro", title: "ابنِ شركة.<br>وحافظ على صفاء ذهنك.", sub: "لعبة الشركات الناشئة التي تقول الحقيقة · مجانية · بالعربية والإنجليزية", brand: "ضباب المؤسس" },
};
(async () => {
  const b = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  for (const lang of ["en", "ar"]) {
    const t = T[lang];
    const shot = data(path.join(out, "shots", lang + "-hq.webp"), "image/webp");
    // the book's fonts: Manrope, and Readex Pro for Arabic (static instances from the game build)
    const face = (fam, file, w, type) => `@font-face{font-family:"${fam}";font-weight:${w};src:url(${data(path.join(FONTS, file), type)})}`;
    const fonts = face("Manrope", "manrope-600.ttf", 500, "font/ttf") + face("Manrope", "manrope-800.ttf", 800, "font/ttf") +
      face("Readex Pro", "readex-ar-500.woff2", 500, "font/woff2") + face("Readex Pro", "readex-ar-600.woff2", 800, "font/woff2");
    const cover = data(path.join(out, "..", "founder-fog", "img", "cover.jpg"), "image/jpeg");
    await p.setContent(`<!doctype html><html dir="${t.dir}"><head>
<style>${fonts}body{margin:0;width:1200px;height:630px;font-family:"${t.font}","Manrope",Arial,sans-serif;background:linear-gradient(170deg,#E6E8E4,#F1EFEA 50%,#F8F6F1);color:#12292B;display:flex;align-items:center;overflow:hidden;position:relative}
.t{padding:0 70px;flex:1}.k{font-weight:800;letter-spacing:${lang === "en" ? "-.01em" : "0"};color:#8C6D45;font-size:28px}
h1{font-size:${lang === "en" ? 62 : 58}px;line-height:1.14;margin:16px 0 18px;font-weight:800;color:#0D3F3F;letter-spacing:${lang === "en" ? "-.02em" : "0"}}
p{font-size:25px;color:#4F6264;margin:0}.ph{position:relative;z-index:2;width:250px;height:541px;border-radius:38px;background:#12292B;padding:9px;margin-block:0;margin-inline:0 250px;transform:translateY(70px);box-shadow:0 30px 60px rgba(18,41,43,.25)}
.arch{position:absolute;top:70px;${lang === "en" ? "right" : "left"}:30px;width:300px;height:375px;border-radius:170px 170px 18px 18px/150px 150px 18px 18px;background:url(${cover}) center 30%/cover;box-shadow:0 3px 0 #E4DDD2,0 18px 40px rgba(18,41,43,.14)}
.ph img{width:100%;height:100%;object-fit:cover;border-radius:30px}</style></head>
<body><div class="arch"></div>
<div class="t"><div class="k">${t.brand}</div><h1>${t.title}</h1><p>${t.sub}</p></div><div class="ph"><img src="${shot}"></div></body></html>`, { waitUntil: "load" });
    await p.waitForTimeout(800);
    await p.screenshot({ path: path.join(out, `og-${lang}.png`) });
    console.log("wrote", path.join(out, `og-${lang}.png`));
  }
  await b.close();
})();
