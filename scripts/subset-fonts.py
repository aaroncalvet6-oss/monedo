"""Subsets the self-hosted Geist fonts to the characters Monedo uses (Spanish).

Geist ships Latin, Latin Extended, Cyrillic, Greek…; Monedo only needs Basic Latin, Latin-1
(á é í ó ú ñ ü ¿ ¡ « » ·), general punctuation (– — “ ” … nbsp), € and a few arrows and math
signs. Cutting the rest halves the font weight, which matters for the first paint on phones.
A unit test (fonts.test.ts) fails if the code uses a character outside these ranges.

Usage:  pip install fonttools brotli && python3 scripts/subset-fonts.py
"""
from pathlib import Path

from fontTools import subset

UNICODES = "U+0000-00FF,U+0152-0153,U+2000-206F,U+20AC,U+2122,U+2190-21FF,U+2212,U+2248,U+2260-2265"

SOURCES = {
    "node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2": "src/fonts/Geist-Variable.woff2",
    "node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2": "src/fonts/GeistMono-Variable.woff2",
}

for source, target in SOURCES.items():
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]  # keep tabular figures (tnum) and kerning
    options.name_IDs = ["*"]
    options.notdef_outline = True
    font = subset.load_font(source, options)
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=subset.parse_unicodes(UNICODES))
    subsetter.subset(font)
    subset.save_font(font, target, options)
    print(f"{target}: {Path(source).stat().st_size} → {Path(target).stat().st_size} bytes")
