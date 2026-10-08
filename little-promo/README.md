# The Little Entrepreneur · promo site

Source for `/littlebreneur/` (English `index.html`, Arabic `ar.html`). The site markets both the game (`/little/`) and the picture book (`/littlebreneur/book/`).

- `content.js`: all copy, English and Arabic side by side. The rules are in its header comment.
- `promo.css`: the Creatives design system: ivory and sand surfaces, Deep Teal panels, Bronze labels, arch frames, and the Manrope and Readex Pro fonts from `../little/fonts/`.
- `promo.js`: calm, content-based motion. The headline settles word by word, the stats count up, coins drop into the piggy bank until the goal, the screen and book-page carousels advance on their own, and there's a live energy meter. Everything pauses off-screen and respects reduced motion.
- `build.mjs`: writes both pages into `littlebreneur/`.

```bash
node little-promo/build.mjs
```

Pictures come from the game (`../little/img/`), the book (`book/art/`), screenshots (`shots/`, which the book's guide also uses) and book page renders (`img/`). The page loads nothing from other websites.
