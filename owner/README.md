# صاحب المشروع · Business Owner

The small-business sister of Bousla, The Little Entrepreneur and Teenpreneur, for adults: people thinking about opening a business and owners who already run one. The game is at `/owner/`.

Run a small business for two years, one month at a time. Each month you set a price, size the team and pick one focus: marketing, training, chasing payments, building systems or resting. Then the month runs and a dilemma usually follows. Uncle Salah (العم صلاح), who ran a pharmacy for 30 years, leaves a one-line note after every choice. Some choices come back months later ("echoes").

What's different from the other games:
- **Two starts.** "Open a new clinic" begins with two months of fit-out: rent runs, no patients yet, and an unpushed fit-out can slip a month. "Take over a running clinic" begins with patients, a bigger loan and an owner who does everything.
- **Profit is not cash.** Every month shows both. Part of revenue is paid later (insurers and companies), old debts are collected or go bad, and the loan instalment comes every month.
- **Systems** are the fourth meter: how much runs without you. They shield your energy and keep the clinic going if you burn out.
- **The fog**, as in Bousla: below 40 energy the numbers blur and tired mistakes cost money. At 0 you spend a month in bed and the clinic runs on its systems. The second time, you sell it to rest.
- **Cash crunch.** A month that ends below zero brings a way out: family money, a bank loan or a supplier deal, each with its own price. The clinic closes only if cash is still past what the bank covers after that.
- **Goals:** a safety cushion, a second branch, or a month away (Systems 70+ and no loss in the last three months).
- **Pay yourself.** After a profitable month you can take a salary. It costs cash and restores energy.
- **First business: a physio and wellness clinic**, with 10 clinic dilemmas, 8 general ones, 3 for the fit-out months and 3 cash-crunch cards. More businesses come next.

## Files

- `content.js`: all text and numbers, English and Arabic side by side. The writing rules are in its header comment. The Arabic never genders the player.
- `game.js`: the engine (pure functions, also runs in Node) and the UI.
- `index.html`: the page and all styles. `sw.js` and `manifest.webmanifest` make it installable and offline. When you add a picture to `img/`, add it to `sw.js` too.
- `img/`: handmade felt art, shared with the other games.
- `fonts/`: Manrope and Readex Pro (OFL), bundled.

## Privacy

No analytics, no tracking, no accounts and no network calls at all. The player's name and progress stay in `localStorage` on the device, under the `owner.v1.*` keys.

## Tests

```bash
node owner/tests/balance.mjs
```

Plays thousands of simulated two-year games for both starts and every goal. It checks that:
- a sensible player usually builds the safety cushion, sometimes opens a second branch, and can reach the month away;
- a sensible player rarely closes or ends up in bed;
- a spender rarely lasts;
- never resting brings the fog and a month in bed;
- without systems the month away is out of reach.

```bash
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" node owner/tests/play.mjs /tmp/owner-shots
```

Plays full games in English and Arabic for both starts in a real browser at 390px, plus a run where the player never rests. It checks for:
- console errors;
- horizontal scroll;
- any outside request;
- leftover `{placeholders}`;
- the smart option opening at exactly 70 energy;
- echoes naming their month;
- the fit-out months and opening day;
- the fog below 40 energy;
- a month in bed for a player who never rests;
- every picture being precached by the service worker.

Test URL flags: `?lang=ar|en`, `?seed=N` (replay the same game), `?fast` (short month animation), `?nosw` (skip the service worker), `?new` (drop the saved game).
