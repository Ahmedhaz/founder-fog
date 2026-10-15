#!/usr/bin/env python3
"""Write the game's web fonts to ../../founder-fog/fonts/ (build.py only references them).

  * Manrope 500/600/700/800 (enhance/fonts/manrope-*.ttf, the static instances the book uses):
    subset to Latin + punctuation/symbols and saved as WOFF2.
  * Readex Pro Arabic 400/500/600 (enhance/fonts/readex-ar-*.woff2): copied as-is (ar.html).

Run it again whenever a font in enhance/fonts/ changes. The output is committed, so the
pages, the service worker and the app shells all ship the same files.

Needs:  pip install fonttools brotli
Run:    python3 founder-fog-app/enhance/make_fonts.py
"""
import pathlib
import shutil

from fontTools import subset
from fontTools.ttLib import TTFont

HERE = pathlib.Path(__file__).resolve().parent
OUT = HERE.parent.parent / "founder-fog" / "fonts"

MANROPE = (500, 600, 700, 800)
READEX = (400, 500, 600)

# Generous on purpose: all of Latin-1 + Latin Extended-A/B (player names), IPA/modifiers, combining
# marks, general punctuation (– — ’ “ ” • … ‹ ›), super/subscripts, currency (€ £ ₹), letterlike,
# number forms, arrows, math, misc technical, geometric shapes, symbols/dingbats. Only Vietnamese
# (U+1E00-1EFF) and other rarely used blocks are dropped; anything missing falls back to the system font.
UNICODES = ("U+0000-024F,U+0250-02FF,U+0300-036F,U+2000-206F,U+2070-209F,U+20A0-20CF,U+2100-214F,"
            "U+2150-218F,U+2190-21FF,U+2200-22FF,U+2300-23FF,U+25A0-25FF,U+2600-26FF,U+2700-27BF,"
            "U+FB00-FB06,U+FEFF,U+FFFD")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for weight in MANROPE:
        font = TTFont(str(HERE / "fonts" / f"manrope-{weight}.ttf"))
        opts = subset.Options()
        opts.flavor = "woff2"
        opts.layout_features = ["*"]
        opts.name_IDs = ["*"]
        opts.notdef_outline = True
        sub = subset.Subsetter(opts)
        sub.populate(unicodes=subset.parse_unicodes(UNICODES))
        sub.subset(font)
        font.flavor = "woff2"
        dest = OUT / f"manrope-{weight}.woff2"
        font.save(str(dest))
        print(f"wrote {dest} ({dest.stat().st_size:,} bytes)")
    for weight in READEX:
        dest = OUT / f"readex-ar-{weight}.woff2"
        shutil.copyfile(HERE / "fonts" / f"readex-ar-{weight}.woff2", dest)
        print(f"wrote {dest} ({dest.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
