# The Little Entrepreneur · picture book

Source for the 28-page A5 picture book at `/littlebreneur/book/` (English `index.html`, Arabic `ar.html`) and its print PDFs.

- `content.js`: all text, English and Arabic side by side, with the writing rules at the top. Scenes are plain data (picture, position and size).
- `book.css`: page layout in millimetres, so the web reader and the A5 print match exactly.
- `reader.js`: the page-by-page web reader (buttons, arrow keys, swipe, `#p5` links). With `?print` it shows every page, for the PDF.
- `build.mjs`: builds the HTML into `littlebreneur/book/`. With `--pdf` it also prints both PDFs through Chrome.

```bash
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" node little-book/build.mjs --pdf
```

The `--pdf` step needs `playwright` or `playwright-core`. Pictures are Microsoft Fluent Emoji (MIT) in `littlebreneur/book/img/`. The font is Baloo Bhaijaan 2 (OFL), bundled in `littlebreneur/book/fonts/`. The book makes no network requests.
