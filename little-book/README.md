# The Little Entrepreneur · picture book

Source for the 28-page A5 picture book at `/littlebreneur/book/` (English `index.html`, Arabic `ar.html`) and its print PDFs.

- `content.js`: all text, English and Arabic side by side, with the writing rules at the top. Each story page names its picture (`art: "s01"`).
- `book.css`: page layout in millimetres, so the web reader and the A5 print match exactly.
- `reader.js`: the page-by-page web reader (buttons, arrow keys, swipe, `#p5` links). With `?print` it shows every page, for the PDF.
- `build.mjs`: builds the HTML into `littlebreneur/book/`. With `--pdf` it also prints both PDFs through Chrome.

```bash
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" node little-book/build.mjs --pdf
```

The `--pdf` step needs `playwright` or `playwright-core`.

Look: it uses the colours, type and composition of the Creatives design system (warm ivory and sand pages, Deep Teal headings and panels, Bronze labels, arch-topped "threshold" frames). Fonts are Manrope (English) and Readex Pro (Arabic), both OFL and bundled in `littlebreneur/book/fonts/`.

Pictures: `littlebreneur/book/art/` holds needle-felted wool dioramas made for this book with Cloudflare Workers AI (FLUX.2 [dev]). Every scene was generated with one character sheet as its reference, so Malak, Yousef and Grandpa stay the same from page to page. They're JPEG, so the PDFs stay small.

The book makes no network requests.
