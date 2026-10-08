// Real captures of the Founder Fog game for the promo site: 8 screens per language at 390x844 @2x,
// played through the built game (title, sectors, hq, dilemma, mentor, customers, money, report).
//   node founder-fog-app/site/shots.cjs <repo root> <png out dir>
// then convert to webp into fog/shots/ (cwebp -q 80). Needs Playwright (PLAYWRIGHT=path to it) and,
// for playwright-core, CHROME_PATH.
const { chromium } = require(process.env.PLAYWRIGHT || "playwright");
const path = require('path');
const [, , ROOT, OUT] = process.argv;
const L = {
  en: { file: 'index.html', start: /^Start your company/, cont: /^Continue with/, found: /^Found /, skip: /^Skip tutorial$/, later: /^Later$/, face: /^Face the decision/, week: /^Start week \d+/, plus: /^\+\s*1 Week$/, cust: /^Customers\n/, money: /^Money\n/ },
  ar: { file: 'ar.html', start: /^ابدأ شركتك/, cont: /^تابع مع/, found: /^أسّس /, skip: /^تخطَّ الشرح$/, later: /^لاحقًا$/, face: /^واجه القرار/, week: /^ابدأ الأسبوع/, plus: /^\+\s*أسبوع$/, cust: /^العملاء\n/, money: /^المال\n/ },
};
(async () => {
  const b = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  for (const lang of ['en', 'ar']) {
    const t = L[lang];
    const c = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: lang, hasTouch: true });
    const p = await c.newPage();
    const url = 'file://' + path.join(ROOT, 'founder-fog', t.file);
    await p.goto(url); await p.evaluate((l) => { localStorage.clear(); try { localStorage.setItem('ff_lang', l); } catch (e) {} }, lang);
    await p.goto(url); await p.waitForTimeout(2500);
    const shot = async (n) => { await p.waitForTimeout(900); await p.screenshot({ path: path.join(OUT, `${lang}-${n}.png`) }); console.log(lang, n); };
    const click = (re) => p.evaluate((src) => {
      const re = new RegExp(src);
      const els = [...document.querySelectorAll('div[tabindex],button')].filter((e) => e.offsetParent && getComputedStyle(e).cursor === 'pointer').reverse();
      const el = els.find((e) => re.test((e.innerText || '').trim()));
      if (el) { el.click(); return true; } return false;
    }, re.source);
    await shot('title');
    await click(t.start); await shot('sectors');
    await click(t.cont); await p.waitForTimeout(600); await click(t.found); await p.waitForTimeout(1500);
    await click(t.skip); await shot('hq');
    // play until the first dilemma, then choose the second option to see the mentor note
    let faced = false;
    for (let i = 0; i < 40 && !faced; i++) {
      await p.waitForTimeout(450);
      if (await click(t.face)) { faced = true; break; }
      if (await click(t.later) || await click(t.week)) continue;
      await click(t.plus);
    }
    await shot('dilemma');
    await p.evaluate(() => {
      const opts = [...document.querySelectorAll('div[tabindex]')].filter((e) => e.offsetParent && getComputedStyle(e).cursor === 'pointer' && /^B\s/.test((e.innerText || '').trim()));
      if (opts.length) opts[opts.length - 1].click();
    });
    await shot('mentor');
    await click(/^(Got it|فهمت)$/);
    for (let i = 0; i < 6; i++) { await p.waitForTimeout(300); if (!(await click(t.later))) break; }
    await click(t.cust); await p.waitForTimeout(800);
    for (let i = 0; i < 3; i++) { await p.waitForTimeout(300); if (!(await click(t.later))) break; }
    await shot('customers');
    await p.keyboard.press('Escape'); await p.goto(url); await p.waitForTimeout(2000);
    await click(/^(CONTINUE|متابعة)\n/); await p.waitForTimeout(1500);
    for (let i = 0; i < 4; i++) { await p.waitForTimeout(300); if (!(await click(t.later))) break; }
    await click(t.money); await shot('money');
    // play on without care until the run ends, for the report card
    await p.goto(url); await p.waitForTimeout(2000); await click(/^(CONTINUE|متابعة)\n/); await p.waitForTimeout(1500);
    for (let i = 0; i < 160; i++) {
      await p.waitForTimeout(250);
      if (await p.evaluate(() => /FOUNDER REPORT CARD|بطاقة تقييم المؤسس/.test(document.body.innerText))) break;
      if (await click(t.face)) { await p.waitForTimeout(400); await p.evaluate(() => { const o = [...document.querySelectorAll('div[tabindex]')].filter((e) => e.offsetParent && /^A\s/.test((e.innerText || '').trim())); if (o.length) o[o.length - 1].click(); }); continue; }
      if (await click(/^(Got it|فهمت)$/) || await click(t.later) || await click(t.week)) continue;
      await click(t.plus);
    }
    await shot('report');
    await c.close();
  }
  await b.close();
})();
