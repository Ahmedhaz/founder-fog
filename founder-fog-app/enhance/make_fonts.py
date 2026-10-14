#!/usr/bin/env python3
"""Write the game's web fonts to ../../founder-fog/fonts/ (run once; build.py only references them).

  * Archivo 400/500/600 and Azeret Mono 400/500/600: taken from the base64 TTFs inside
    original.html (Metro modules 227-229, 248-250), subset to Latin + punctuation/symbols
    and saved as WOFF2 under their expo-font family names.
  * IBM Plex Sans Arabic 400/500/600 (enhance/fonts/plex-ar-*.woff2): copied as-is (ar.html).

Needs:  pip install fonttools brotli
Run:    python3 founder-fog-app/enhance/make_fonts.py
"""
import base64
import io
import pathlib
import re
import shutil

from fontTools import subset
from fontTools.ttLib import TTFont

HERE = pathlib.Path(__file__).resolve().parent
OUT = HERE.parent.parent / "founder-fog" / "fonts"

# Metro module id -> expo-font family name (the names App.js passes to useFonts)
LATIN = {227: "Archivo_400Regular", 228: "Archivo_500Medium", 229: "Archivo_600SemiBold",
         248: "AzeretMono_400Regular", 249: "AzeretMono_500Medium", 250: "AzeretMono_600SemiBold"}

# Generous on purpose: all of Latin-1 + Latin Extended-A/B (player names), IPA/modifiers, combining
# marks, general punctuation (– — ’ “ ” • … ‹ ›), super/subscripts, currency (€ £ ₹), letterlike,
# number forms, arrows, math, misc technical, geometric shapes, symbols/dingbats. Only Vietnamese
# (U+1E00-1EFF) and other rarely used blocks are dropped; anything missing falls back to the system font.
UNICODES = ("U+0000-024F,U+0250-02FF,U+0300-036F,U+2000-206F,U+2070-209F,U+20A0-20CF,U+2100-214F,"
            "U+2150-218F,U+2190-21FF,U+2200-22FF,U+2300-23FF,U+25A0-25FF,U+2600-26FF,U+2700-27BF,"
            "U+FB00-FB06,U+FEFF,U+FFFD")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    src = (HERE / "original.html").read_text(encoding="utf-8")
    for mod_id, family in LATIN.items():
        m = re.search(r'm\.exports="data:font/ttf;base64,([A-Za-z0-9+/=]+)"\},%d,\[\]\);' % mod_id, src)
        assert m, f"font module {mod_id} not found"
        font = TTFont(io.BytesIO(base64.b64decode(m.group(1))))
        opts = subset.Options()
        opts.flavor = "woff2"
        opts.layout_features = ["*"]
        opts.name_IDs = ["*"]
        opts.notdef_outline = True
        sub = subset.Subsetter(opts)
        sub.populate(unicodes=subset.parse_unicodes(UNICODES))
        sub.subset(font)
        font.flavor = "woff2"
        dest = OUT / f"{family}.woff2"
        font.save(str(dest))
        print(f"wrote {dest} ({dest.stat().st_size:,} bytes)")
    for weight in (400, 500, 600):
        dest = OUT / f"plex-ar-{weight}.woff2"
        shutil.copyfile(HERE / "fonts" / f"plex-ar-{weight}.woff2", dest)
        print(f"wrote {dest} ({dest.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
