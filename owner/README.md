# صاحب المشروع · Business Owner

The small-business sister of Bousla, The Little Entrepreneur and Teenpreneur, for adults: people thinking about opening a business and owners who already run one. The game is at `/owner/`.

Run a small business for two years, one month at a time. Each month you set a price, size the team and pick one focus: marketing, training, chasing payments, building systems or resting. Then the month runs and a dilemma usually follows. Uncle Salah (العم صلاح), who ran a pharmacy for 30 years, leaves a one-line note after every choice. Some choices come back months later ("echoes").

What's different from the other games:
- **Five businesses**, each with its own economics and dilemmas:
  - a physio and wellness clinic;
  - a restaurant and café, where food bought for tables that stay empty is thrown away and Ramadan evenings are the rush;
  - a shop and online store, with cash on delivery, couriers and returns;
  - a carpentry workshop, with big jobs, few clients and late payers;
  - a marketing agency, with high salaries, clients who pay in 60 days and endless revisions.
- **Two starts.** "Open from scratch" begins with two months of setting up: rent runs, no customers yet, and an unpushed fit-out can slip a month. "Take over a running business" begins with customers, a bigger loan and an owner who does everything.
- **Profit is not cash.** Every month shows both. Part of revenue is paid later (insurers and companies), old debts are collected or go bad, and the loan instalment comes every month.
- **Systems** are the fourth meter: how much runs without you. They shield your energy and keep the clinic going if you burn out.
- **The fog**, as in Bousla: below 40 energy the numbers blur and tired mistakes cost money. At 0 you spend a month in bed and the clinic runs on its systems. The second time, you sell it to rest.
- **Cash crunch.** A month that ends below zero brings a way out: family money, a bank loan or a supplier deal, each with its own price. The clinic closes only if cash is still past what the bank covers after that.
- **Goals:** a safety cushion, a second branch, or a month away (Systems 70+ and no loss in the last three months).
- **Pay yourself.** After a profitable month you can take a salary. It costs cash and restores energy.
- **Daily challenge**, as in Bousla: the same business, start and luck for everyone on a given UTC day, 12 months, one try. The score is the cash at the end (zero if the business didn't last). There is no leaderboard, because the game makes no network calls; the end screen copies a short result to share by hand.
- **The Owner's Playbook**, as in Bousla's Founder Playbook: 32 pages collected across games, each unlocked by a dilemma or a moment in the game (the first loan, money owed piling up, the fog). Each page is the idea, why it matters, one thing to do this month, and a real source. The pages are in `playbook.js`.
- **Trophies**, as in Bousla: 24, kept on this device across games, from the first profitable month and paying yourself to "it runs without you", paying off every loan, getting through a cash crunch and trying all five businesses. Closing and burning out earn one too. A short toast announces each one, there's a trophy room, and the end screen shows the game's haul.
- **57 dilemmas**: 11 for the clinic, 8 each for the other four businesses, 8 general ones, 3 for the setting-up months and 3 cash-crunch cards.

## Files

- `content.js`: all text and numbers, English and Arabic side by side. `playbook.js`: the Owner's Playbook pages, in the same format. The writing rules are in its header comment. The Arabic never genders the player.
- `game.js`: the engine (pure functions, also runs in Node) and the UI.
- `index.html`: the page and all styles. `sw.js` and `manifest.webmanifest` make it installable and offline. When you add a picture to `img/`, add it to `sw.js` too.
- `img/`: handmade felt art, shared with the other games.
- `fonts/`: Manrope and Readex Pro (OFL), bundled.

## Privacy

No analytics, no tracking, no accounts and no network calls at all. The player's name and progress stay in `localStorage` on the device, under the `owner.v1.*` keys.

## Tests

```bash
node owner/tests/content.mjs
```

Checks that every text has English and Arabic with exactly the same numbers and placeholders, that every dilemma and note points at a playbook page that exists, that every page is unlocked by something, and that every picture exists and is precached.

```bash
node owner/tests/balance.mjs
```

Plays thousands of simulated two-year games for both starts and every goal. It checks that:
- in every business and both starts, a sensible player usually builds the safety cushion, sometimes opens a second branch, and can reach the month away;
- a sensible player rarely closes or ends up in bed;
- a spender rarely lasts;
- never resting brings the fog and a month in bed;
- without systems the month away is out of reach.
- every playbook page is unlocked in some simulated game.
- every trophy that one game can earn is earned in some simulated game.

```bash
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" node owner/tests/play.mjs /tmp/owner-shots
```

Plays full games in English and Arabic for every business and both starts in a real browser at 390px, plus a run per language where the player never rests. It checks for:
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

It also checks the trophy room and the toasts, and earns the three trophies that need several games (every business, both starts, 10 pages) by seeding the device's memory. It also plays the same day's daily challenge in English and Arabic with the same choices and requires the same result, checks that the shared text names the day, and that a second try that day is blocked.

Test URL flags: `?lang=ar|en`, `?seed=N` (replay the same game), `?day=YYYY-MM-DD` (that day's daily challenge), `?fast` (short month animation), `?nosw` (skip the service worker), `?new` (drop the saved game).
