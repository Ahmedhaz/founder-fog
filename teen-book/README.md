# Teenpreneur · picture book

Source for the A5 picture book at `/teenpreneur/book/` (English `index.html`, Arabic `ar.html`) and its PDFs. It's the third book in the series, after The Little Entrepreneur (`little-book/`) and Founder Fog (`fog-book/`), and uses the same system.

- `content.js`: the book's text, English and Arabic side by side, with the writing rules at the top. This public repo holds a sample: the cover, chapter 1, then a page with the full book's contents.
- `book.css`: page layout in millimetres, so the web reader and the A5 print match exactly.
- `reader.js`: the page-by-page web reader. With `?print` it shows every page, for the PDF.
- `build.mjs`: builds the HTML into `teenpreneur/book/`. With `--pdf` it also prints both PDFs through Chrome, and with `--print DIR` it writes print-shop PDFs with 3 mm bleed.

```bash
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" node teen-book/build.mjs --pdf
```

The full book has 8 chapters and 60 pages. Chapters 2 to 8 and their pictures are kept outside this repo. To build it:

```bash
TEEN_FULL=/path/chapters.js TEEN_ART=/path/art TEEN_OUT=/path/out node teen-book/build.mjs --pdf
```

The pictures are needle-felted wool dioramas made with Cloudflare Workers AI (FLUX.2 klein). Each scene was generated with a reference image for every character in it, so Laila, Omar, Salma and Aunt Nour look the same from page to page.

The book makes no network requests: the fonts, pictures and QR code are local files.
