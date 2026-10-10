# تينبرونور · Teenpreneur

The teen sister of The Little Entrepreneur and Founder Fog, for ages 13 to 17. The game is at `/teen/`.

Run one side hustle for a 30-week school year. Each week you set a price, decide how many to prepare and pick one extra thing to do (promote, learn a skill, study or rest). Then you work the week and face a dilemma. Aunt Nour (خالتك نور) leaves a one-line note after every choice. Some choices come back weeks later ("echoes").

What's new compared with Little:
- **Grades** are a fourth meter. They drop each week you don't study, and drop faster in exam season. Below 40, your parents pause the hustle for a week.
- **Exam seasons** fall in weeks 9–10, 19–20 and 29–30. Results arrive after each season: 75+ earns energy and reputation, and below 55 pauses the hustle for a week.
- **Reputation** replaces smiles.
- **The week type** replaces weather: a normal week, a holiday rush, a quiet week or exam season. Each side hustle reacts differently, for example tutoring booms before exams.
- **Six side hustles:** tutoring, phone and laptop help, design for local shops, baking, thrift and resell, and small coding jobs.
- **35 dilemmas for teens:** fake payment screenshots, meeting a stranger "client" at night, friends who want it free, a cruel comment, late payers, fake followers, copied work, privacy on a customer's phone, allergies, fake designer goods, passwords sent in a chat, and scope creep.

## Files

- `content.js`: all text and numbers, English and Arabic side by side. The writing rules are in its header comment. The Arabic never genders the player.
- `game.js`: the engine (pure functions, also runs in Node) and the UI.
- `index.html`: the page and all styles. `sw.js` and `manifest.webmanifest` make it installable and offline.
- `img/`: handmade felt art, shared with Little and Founder Fog.
- `fonts/`: Manrope and Readex Pro (OFL), bundled.

## Privacy

No analytics, no tracking, no accounts, no chat and no network calls at all. The player's name and progress stay in `localStorage` on the device, under the `teen.v1.*` keys.

## Tests

```bash
node teen/tests/balance.mjs
```

Plays thousands of simulated school years for every side hustle and goal. It checks that:
- a sensible player usually reaches the mid goal;
- spending everything doesn't reach it;
- overworking drains energy;
- never studying gets the hustle paused.

```bash
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" node teen/tests/play.mjs /tmp/teen-shots
```

Plays full school years in English and Arabic for all six side hustles in a real browser at 390px, plus a run where the player never studies. It checks for:
- console errors;
- horizontal scroll;
- any outside request;
- the smart option opening at exactly 70 energy;
- echoes naming their week;
- exam results arriving in weeks 11 and 21 and at the end of the year;
- the grades rule pausing the hustle.

Test URL flags: `?lang=ar|en`, `?seed=N` (replay the same year), `?fast` (short work animation), `?nosw` (skip the service worker).
