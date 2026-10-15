// Composes the App Store / Play screenshots (1320x2868, the 6.9" iPhone size) from the raw captures
// made by shots.cjs: a caption in the book's type above the game in a phone frame, 6 per language.
//   node founder-fog-app/site/store.cjs <png shots dir> <jpg out dir>
// Needs Playwright (PLAYWRIGHT=path to it) and, for playwright-core, CHROME_PATH.
const { chromium } = require(process.env.PLAYWRIGHT || "playwright");
const path = require("path");
const fs = require("fs");
const [, , SHOTS, OUT] = process.argv;
const FONTS = path.join(__dirname, "..", "enhance", "fonts");
const data = (file, type) => `data:${type};base64,` + fs.readFileSync(file).toString("base64");

// one caption per store slot: [raw capture, title, subtitle]
const T = {
  en: {
    dir: "ltr", font: "Manrope", kicker: "Bousla",
    slides: [
      ["title", "A year in the founder's chair", "Run a startup week by week, in about an hour."],
      ["dilemma", "Real decisions, no right answer", "195 dilemmas from real founders' lives."],
      ["mentor", "Learn the lesson behind each choice", "Mentor notes with real sources after every decision."],
      ["customers", "Find product-market fit", "Talk to customers, run experiments, pivot."],
      ["money", "Money that doesn't lie", "Runway, burn and valuation, like a real company."],
      ["report", "See what kind of founder you are", "Six skills graded at the end of every run."],
    ],
  },
  ar: {
    dir: "rtl", font: "Readex Pro", kicker: "بوصلة المؤسس",
    slides: [
      ["title", "عام على كرسي المؤسس", "أدِر شركة ناشئة أسبوعًا بأسبوع، في نحو ساعة."],
      ["dilemma", "قرارات حقيقية بلا إجابة صحيحة", "195 معضلة من حياة المؤسسين الحقيقية."],
      ["mentor", "تعلّم الدرس خلف كل قرار", "ملاحظات المرشد ومصادرها الحقيقية بعد كل قرار."],
      ["customers", "اعثر على التوافق مع السوق", "تحدّث مع العملاء، وجرّب، وغيّر الاتجاه."],
      ["money", "أرقام لا تكذب", "مدة الصمود والحرق والتقييم، كشركة حقيقية."],
      ["report", "اعرف أي مؤسس أنت", "ست مهارات تُقيَّم في نهاية كل جولة."],
    ],
  },
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  const p = await b.newPage({ viewport: { width: 1320, height: 2868 } });
  const face = (fam, file, w, type) => `@font-face{font-family:"${fam}";font-weight:${w};src:url(${data(path.join(FONTS, file), type)})}`;
  const fonts = face("Manrope", "manrope-600.ttf", 500, "font/ttf") + face("Manrope", "manrope-800.ttf", 800, "font/ttf") +
    face("Readex Pro", "readex-ar-500.woff2", 500, "font/woff2") + face("Readex Pro", "readex-ar-600.woff2", 800, "font/woff2");
  for (const lang of ["en", "ar"]) {
    const t = T[lang];
    for (let i = 0; i < t.slides.length; i++) {
      const [shot, title, sub] = t.slides[i];
      const img = data(path.join(SHOTS, `${lang}-${shot}.png`), "image/png");
      await p.setContent(`<!doctype html><html dir="${t.dir}"><head><style>${fonts}
html,body{margin:0;width:1320px;height:2868px;overflow:hidden}
body{font-family:"${t.font}","Manrope",Arial,sans-serif;background:linear-gradient(180deg,#F6F3EC,#F8F6F1 40%,#F8F6F1);color:#0D3F3F;position:relative}
.cap{position:absolute;top:150px;left:70px;right:70px;text-align:center}
.k{font-weight:800;font-size:36px;letter-spacing:${lang === "en" ? ".14em" : "0"};text-transform:uppercase;color:#8C6D45}
h1{font-size:${lang === "en" ? 116 : 108}px;line-height:1.06;margin:26px 0 24px;font-weight:800;letter-spacing:${lang === "en" ? "-.025em" : "0"}}
p{font-size:52px;line-height:1.3;margin:0;color:#4F6264;font-weight:500}
.ph{position:absolute;top:820px;left:150px;width:1020px;height:2300px;border-radius:104px;background:#12292B;padding:24px;box-sizing:border-box;box-shadow:0 40px 90px rgba(18,41,43,.22)}
.ph img{display:block;width:972px;border-radius:82px}
</style></head><body>
<div class="cap"><div class="k">${t.kicker}</div><h1>${title}</h1><p>${sub}</p></div>
<div class="ph"><img src="${img}"></div>
</body></html>`, { waitUntil: "load" });
      await p.waitForTimeout(300);
      const file = path.join(OUT, `${lang}-${i + 1}.jpg`);
      await p.screenshot({ path: file, type: "jpeg", quality: 88 });
      console.log("wrote", file);
    }
  }
  await b.close();
})();
