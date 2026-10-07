# الانتربرونور الصغير · The Little Entrepreneur

A sister game to Founder Fog for children aged 8–12. The game is at `/little/`, and its promo site (EN `index.html`, AR `ar.html`) is at `/littlebreneur/`, the same way `fog/` promotes `founder-fog/`.

Run a tiny business for one 12-week summer: pick a price, how many to make and one activity each week, sell, then face a dilemma. Grandpa (جدّو) shares a one-line idea after every choice. Some choices come back 2–5 weeks later ("echoes"). Energy is the kid version of clarity: below 40 the screen gets sleepy, and at 70+ a third, wiser option opens.

## Files

- `content.js`: all text and numbers, English and Arabic side by side (businesses, goals, dilemmas, Grandpa's ideas, UI strings). The writing rules are in its header comment. Edit here to add dilemmas.
- `game.js`: the engine (pure functions, also runs in Node) and the UI.
- `index.html`: the page and all styles. `sw.js` and `manifest.webmanifest` make it installable and offline.
- `img/`: 3D emoji from [Microsoft Fluent Emoji](https://github.com/microsoft/fluentui-emoji) (MIT), resized to 160px webp.

## Privacy

No analytics, no tracking, no accounts and no network calls except the Google Font. The child's name and progress stay in `localStorage` on the device.

## Tests

```bash
node little/tests/balance.mjs
```

Plays thousands of simulated summers per business and goal, and checks that a sensible strategy usually reaches the mid goal, that spending everything never does, and that overworking drains energy and costs sales.

```bash
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" node little/tests/play.mjs /tmp/little-shots
```

Plays full summers in English and Arabic for all four businesses in a real browser at 390px. It needs `playwright` or `playwright-core` installed, and a browser from `PLAYWRIGHT_BROWSERS_PATH` or `CHROME_PATH`. It checks for console errors, horizontal scroll and outside requests, that the third door opens at exactly 70 energy, that echoes name their week, and that the homework rule closes the stand in week 4. Screenshots go to the folder you pass.

Set `LITTLE_REAL_FONT=1` to load the real font, for promo screenshots.

Test URL flags: `?lang=ar|en`, `?seed=N` (replay the same summer), `?fast` (short sell animation), `?nosw` (skip the service worker).
