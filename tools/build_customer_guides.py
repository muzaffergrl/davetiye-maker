#!/usr/bin/env python3
"""START HERE guides for designs 01–48 (G122; 21: G137; G148; 22–32: G175; 33–48: 2026-10-22): Markdown + PDF + the real start QR, from ONE source text.

  python3 tools/build_customer_guides.py                   # all 48 designs: build, then check
  python3 tools/build_customer_guides.py --designs 06-20   # only these ("06-20", "07,12", "01,06-08", "all")
  python3 tools/build_customer_guides.py --check           # build nothing; check what is on disk (exit 1 on a problem)
  python3 tools/build_customer_guides.py --base-url https://…   # another host for the start link (or GUIDE_BASE_URL)

Source: docs/19_ALICI_YOLCULUGU.md, Ek A (between <!-- g091:start-here:start --> and end). Never edit a copy by hand:
change Ek A and run this again. Placeholders filled per design ({…} left over stops the build):
  {DESIGN_NAME}    platform/themes/<id>/theme.json "name" (what /start shows as "Design: …")
  {START_URL}      <base>/start?theme=<id>      (route: platform/app/start/page.tsx)
  {PRIVACY_URL}    <base>/privacy               (route: platform/app/(marketing)/privacy/page.tsx)
  {MY_URL}         <base>/my                    (G146/G148: the Etsy order number + email open the editor on any
                                                 device; route platform/app/my/page.tsx, "Create your website")
  {OPENING}        what guests tap first: envelope, gatefold, pouch, wallet, book, sleeve, box, curtain, origami, door,
                   parcel, chart or panel (platform/lib/marketing/designs.ts, "Your guests tap the <thing>."; G175: 26
                   Kintsugi & Washi's folded paper is "origami")
  {OPENING_TAB}    the same word capitalised: the panel's first preview tab (G121, lib/panel/model.ts openingTabLabel)
  {LANGUAGE_FONTS} one of LANGUAGE_LINES, from the design's fonts (designs.ts `fonts`) and FONT_SUBSETS below

Writes per design, in collections/<NN_*>/package/customer/:
  START_HERE.md            Ek A, filled in
  img/start_qr.png + .svg  QR of the start link, made ONLY by tools/make_qr.py (segno, error correction Q, 4-module
                           quiet zone, scale 20); dark modules = the darkest colour of the design's palette.json
                           (G175: 22–32 have none yet — the palette of its designs.ts entry instead)
  img/start_qr_page.png    the same pixels centred on a white strip 4× as wide (what START_HERE.md shows; md_to_pdf and
                           tools/listing_kit.py scale pictures to the text width)
  START_HERE.pdf           US Letter, reportlab, standard PDF fonts (no font file is embedded or shipped); the QR is
                           img/start_qr.png itself and is a clickable link to the start URL; consecutive "> " lines
                           of Ek A are one framed box (G148: "Continue on another device"). Look (2026-10-22): the
                           BKE Studio logo (brand/svg, vector), a cover with the design's picture
                           (platform/themes/<id>/img/og-1200x630.jpg), the quick start alone on page 2, a clickable
                           contents with page numbers before Step 1, PDF bookmarks, brand/tokens.json colours

Checks (always after a build, or alone with --check):
  - START_HERE.md is exactly Ek A filled in now (stale copies fail), holds the start link and no {…};
    a design that does not open from an envelope has no "envelope" in it (any case: since G121 the preview tab is named
    after the design's opening too)
  - every **bold** panel label and every "quoted" panel text of the guide exists in the platform source
    (platform/components/panel, platform/app/start, platform/lib/{panel,claim,theme,audio,rsvp}, lib/maps.ts, the guest
    scripts public/audio/audio.js + public/static/map.js, the design's theme.json):
    a renamed button fails here first (run this after a panel change, e.g. G121)
  - start_qr.png encodes exactly the start URL (re-encoded and compared module by module), start_qr_page.png holds the
    same pixels, and both — plus every rendered page of the PDF — decode with jsQR (platform's devDependency, run with
    node) to the start URL; the PDF holds exactly one QR
  - the PDF's links are the start URL (at least once), the /my page (at least once, G148) and the privacy notice,
    nothing else
Needs: reportlab, segno, Pillow, numpy, pypdf, pdftoppm (poppler; or PyMuPDF) and node + jsqr for the raster check (looked up in
platform/node_modules, then in the main checkout of a git worktree, or JSQR_DIR); without node/jsqr the raster check is
reported as skipped, never as passed.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from xml.sax.saxutils import escape

TOOLS = Path(__file__).resolve().parent
REPO = TOOLS.parent
sys.path.insert(0, str(TOOLS))
import etsy_upload as eu  # noqa: E402  (design table, --designs parsing, theme name, opening object)

SOURCE = REPO / "docs" / "19_ALICI_YOLCULUGU.md"
START_MARK, END_MARK = "<!-- g091:start-here:start -->", "<!-- g091:start-here:end -->"
BASE_URL = os.environ.get("GUIDE_BASE_URL", "https://bkestudio.com")
DESIGN_COPY = REPO / "platform" / "lib" / "marketing" / "designs.ts"
MAKE_QR = TOOLS / "make_qr.py"
QR_SCALE = 20  # make_qr.py default; listing_kit.qr_matches compares at this scale
PLACEHOLDER = re.compile(r"\{[A-Z_]+\}")

# Google Fonts subsets of every font a design loads, read from fonts.googleapis.com/css2 on 2026-10-16 (G122; the same
# check as G123's listing language lines). "cyrillic" = has Cyrillic, "latin-ext" = Central/Eastern European accents,
# "latin" = Basic Latin + Western European accents only. A new font must be added here (the build stops otherwise).
FONT_SUBSETS: dict[str, set[str]] = {
    "Abril Fatface": {"latin", "latin-ext"},  # G175 (designs 22–32): fonts.googleapis.com/css2 on 2026-10-17
    "Alegreya": {"cyrillic", "latin", "latin-ext"},  # designs 33–48: fonts.googleapis.com/css2 on 2026-10-22
    "Alex Brush": {"latin", "latin-ext"},
    "Allison": {"latin", "latin-ext"},
    "Allura": {"latin", "latin-ext"},
    "Amiri": {"latin", "latin-ext"},  # + arabic; 27 (fonts synced with the rebuilt theme, 2026-10-22)
    "Arapey": {"latin"},
    "Arizonia": {"latin", "latin-ext"},
    "Ballet": {"latin", "latin-ext"},
    "Bellefair": {"latin", "latin-ext"},  # + hebrew
    "Bodoni Moda": {"latin", "latin-ext"},
    "Bonheur Royale": {"latin", "latin-ext"},
    "Brygada 1918": {"cyrillic", "latin", "latin-ext"},
    "Carattere": {"latin", "latin-ext"},
    "Cardo": {"latin", "latin-ext"},
    "Cinzel": {"latin", "latin-ext"},
    "Cinzel Decorative": {"latin", "latin-ext"},
    "Comforter Brush": {"cyrillic", "latin", "latin-ext"},
    "Corinthia": {"latin", "latin-ext"},
    "Cormorant Garamond": {"latin", "latin-ext", "cyrillic"},
    "Cormorant Infant": {"latin", "latin-ext", "cyrillic"},
    "Cormorant SC": {"latin", "latin-ext", "cyrillic"},
    "Cormorant Upright": {"latin", "latin-ext"},
    "Crimson Pro": {"latin", "latin-ext"},
    "Dancing Script": {"latin", "latin-ext"},
    "EB Garamond": {"latin", "latin-ext", "cyrillic"},
    "Ephesis": {"latin", "latin-ext"},
    "Federant": {"latin"},
    "Forum": {"latin", "latin-ext", "cyrillic"},
    "Fraunces": {"latin", "latin-ext"},
    "Gilda Display": {"latin", "latin-ext"},
    "Goudy Bookletter 1911": {"latin"},
    "Great Vibes": {"latin", "latin-ext", "cyrillic"},
    "Herr Von Muellerhoff": {"latin", "latin-ext"},
    "Homemade Apple": {"latin"},
    "Hurricane": {"latin", "latin-ext"},
    "IM Fell English": {"latin"},
    "Imperial Script": {"latin", "latin-ext"},
    "Italiana": {"latin"},
    "Italianno": {"latin", "latin-ext"},
    "Josefin Sans": {"latin", "latin-ext"},
    "Josefin Slab": {"latin"},
    "Jost": {"latin", "latin-ext", "cyrillic"},
    "Kaushan Script": {"latin", "latin-ext"},
    "Libre Baskerville": {"latin", "latin-ext"},
    "Libre Caslon Text": {"latin", "latin-ext"},
    "Limelight": {"latin", "latin-ext"},
    "Linden Hill": {"latin", "latin-ext"},
    "Lora": {"latin", "latin-ext", "cyrillic"},
    "Lustria": {"latin"},
    "Luxurious Script": {"latin", "latin-ext"},
    "Manrope": {"latin", "latin-ext", "cyrillic"},  # G137 (design 21), fonts.googleapis.com/css2 on 2026-10-17
    "Marcellus": {"latin", "latin-ext"},
    "Marcellus SC": {"latin", "latin-ext"},
    "Mea Culpa": {"latin", "latin-ext"},
    "Merriweather": {"latin", "latin-ext", "cyrillic"},
    "Monsieur La Doulaise": {"latin", "latin-ext"},
    "MonteCarlo": {"latin", "latin-ext"},
    "Mr De Haviland": {"latin", "latin-ext"},
    "Mrs Saint Delafield": {"latin", "latin-ext"},
    "Newsreader": {"latin", "latin-ext"},
    "Noto Serif Display": {"latin", "latin-ext", "cyrillic"},
    "Old Standard TT": {"cyrillic", "latin", "latin-ext"},
    "Oleo Script": {"latin", "latin-ext"},
    "Parisienne": {"latin", "latin-ext"},
    "Petit Formal Script": {"latin", "latin-ext"},
    "Pinyon Script": {"latin", "latin-ext"},
    "Playfair Display": {"latin", "latin-ext", "cyrillic"},
    "Playfair Display SC": {"latin", "latin-ext", "cyrillic"},
    "Prata": {"cyrillic", "latin"},
    "Raleway": {"latin", "latin-ext", "cyrillic"},
    "Rochester": {"latin"},
    "Rosarivo": {"latin", "latin-ext"},
    "Rouge Script": {"latin"},
    "Rozha One": {"latin", "latin-ext"},
    "Rye": {"latin", "latin-ext"},
    "Sacramento": {"latin", "latin-ext"},
    "Satisfy": {"latin"},
    "Shippori Mincho": {"latin", "latin-ext"},  # + Japanese
    "Sorts Mill Goudy": {"latin", "latin-ext"},
    "Special Elite": {"latin", "latin-ext"},
    "Spectral": {"latin", "latin-ext", "cyrillic"},
    "Tangerine": {"latin"},
    "Yesteryear": {"latin", "latin-ext"},
    "Yrsa": {"latin", "latin-ext"},
}
# The guide's language sentence for each class (the listings say the same, G123; Polish/Czech/Turkish named instead of
# "ł, ő, ş", which the PDF's standard Helvetica cannot print).
LANGUAGE_LINES = {
    "cyrillic": "Accented Latin letters and Cyrillic use the design's fonts; other alphabets show in a plain standard font.",
    "latin-ext": "Accented Latin letters use the design's fonts; Cyrillic and other alphabets show in a plain standard "
                 "font in some or all places.",
    "latin": "Western European accents (such as é, ñ and ü) use the design's fonts; some other accented letters (for "
             "example in Polish, Czech or Turkish) and other alphabets show in a simpler fallback font.",
}


# ----------------------------------------------------------------------------- source and per-design values

def template(source: Path = SOURCE) -> str:
    """Ek A of docs/19: the Markdown inside the ````markdown fence between the two markers."""
    text = source.read_text(encoding="utf-8")
    # the markers on lines of their own (§5 names them inline too)
    m = re.search(rf"^{re.escape(START_MARK)}$(.*?)^{re.escape(END_MARK)}$", text, re.S | re.M)
    if not m:
        raise SystemExit(f"{source.relative_to(REPO)}: no {START_MARK} … {END_MARK} block")
    m = re.search(r"^````markdown\n(.*?)\n````\s*$", m.group(1).strip("\n"), re.S)
    if not m:
        raise SystemExit(f"{source.relative_to(REPO)}: Ek A is not one ````markdown fence")
    return m.group(1).strip("\n") + "\n"


def design_block(theme: str, copy: str | None = None) -> str:
    copy = DESIGN_COPY.read_text(encoding="utf-8") if copy is None else copy
    m = re.search(rf"^  '{re.escape(theme)}': \{{(.*?)^  \}},", copy, re.S | re.M)
    if not m:
        raise SystemExit(f"{DESIGN_COPY.relative_to(REPO)}: no entry for '{theme}'")
    return m.group(1)


def design_fonts(theme: str, copy: str | None = None) -> list[str]:
    # G137: quoted keys and strings ("fonts": ["…"], design 21) as well as fonts: ['…']
    m = re.search(r"(?:\bfonts|\"fonts\"):\s*\[([^\]]*)\]", design_block(theme, copy))
    if not m:
        raise SystemExit(f"{DESIGN_COPY.relative_to(REPO)}: no fonts for '{theme}'")
    return re.findall(r"['\"]([^'\"]+)['\"]", m.group(1))


# Fonts of a design's printable invitation (platform/lib/print/layouts.ts) that have fewer alphabets than its website
# fonts: the language line counts them too (2026-10-22: 32's website fonts have Cyrillic, its print fonts do not).
PRINT_FONTS: dict[str, list[str]] = {"music-box-ballerina": ["Ballet", "Gilda Display"]}


def design_language(theme: str, copy: str | None = None) -> str:
    """language_class of the design's website fonts plus its PRINT_FONTS."""
    return language_class(design_fonts(theme, copy) + PRINT_FONTS.get(theme, []))


def language_class(fonts: list[str]) -> str:
    """'cyrillic' when every font has Cyrillic, 'latin' when one font has Basic/Western Latin only, else 'latin-ext'."""
    unknown = [f for f in fonts if f not in FONT_SUBSETS]
    if unknown:
        raise SystemExit(f"font(s) not in FONT_SUBSETS: {', '.join(unknown)} — check fonts.googleapis.com/css2 and add them")
    subsets = [FONT_SUBSETS[f] for f in fonts]
    if any("latin-ext" not in s for s in subsets):
        return "latin"
    return "cyrillic" if all("cyrillic" in s for s in subsets) else "latin-ext"


def start_url(theme: str, base: str = BASE_URL) -> str:
    return f"{base.rstrip('/')}/start?theme={theme}"


def privacy_url(base: str = BASE_URL) -> str:
    return f"{base.rstrip('/')}/privacy"


def my_url(base: str = BASE_URL) -> str:
    """G148: the page where the Etsy order number + email open the editor on any device (G146, K46)."""
    return f"{base.rstrip('/')}/my"


def values(theme: str, base: str = BASE_URL) -> dict[str, str]:
    return {
        "DESIGN_NAME": eu.theme_name(theme),
        "START_URL": start_url(theme, base),
        "PRIVACY_URL": privacy_url(base),
        "MY_URL": my_url(base),
        "OPENING": eu.opening_object(theme),
        "OPENING_TAB": opening_tab(eu.opening_object(theme)),
        "LANGUAGE_FONTS": LANGUAGE_LINES[design_language(theme)],
    }


def opening_tab(opening: str) -> str:
    """The panel's first preview tab (G121): lib/panel/model.ts openingTabLabel — the opening word, first letter capital."""
    return opening[:1].upper() + opening[1:]


def fill(text: str, vals: dict[str, str]) -> str:
    for key, value in vals.items():
        text = text.replace("{" + key + "}", value)
    left = sorted(set(PLACEHOLDER.findall(text)))
    if left:
        raise SystemExit(f"Ek A has placeholders this tool does not fill: {', '.join(left)}")
    return text


def customer_dir(folder: str) -> Path:
    return REPO / "collections" / folder / "package" / "customer"


# ----------------------------------------------------------------------------- QR (tools/make_qr.py only)

def _luminance(hex_colour: str) -> float:
    rgb = [int(hex_colour.lstrip("#")[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4 for c in rgb]
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]


def palette_colours(folder: str, theme: str | None = None) -> list[str]:
    """#rrggbb colours of the collection's palette.json; G175: designs 22–32 have none yet, so the palette of the
    design's sales copy (platform/lib/marketing/designs.ts `palette`, the colours /designs shows) is used instead."""
    pal_file = REPO / "collections" / folder / "palette.json"
    if pal_file.exists():
        pal = json.loads(pal_file.read_text(encoding="utf-8"))
        return [v for v in pal.values() if isinstance(v, str) and re.fullmatch(r"#[0-9A-Fa-f]{6}", v)]
    if theme is None:
        return []
    m = re.search(r"\bpalette:\s*\[(.*?)\]", design_block(theme), re.S)
    return re.findall(r"#[0-9A-Fa-f]{6}", m.group(1)) if m else []


def qr_dark(folder: str, theme: str | None = None) -> str:
    """The darkest colour of the design's palette (ink is light on the dark designs 06, 17, 19), as long as it keeps
    a contrast of at least 7:1 on white; else near-black."""
    colours = palette_colours(folder, theme)
    best = min(colours, key=_luminance) if colours else "#2B2B2B"
    return best.upper() if 1.05 / (_luminance(best) + 0.05) >= 7 else "#2B2B2B"


def make_start_qr(url: str, img_dir: Path, dark: str) -> tuple[Path, Path, Path]:
    from PIL import Image
    img_dir.mkdir(parents=True, exist_ok=True)
    base = img_dir / "start_qr"
    r = subprocess.run([sys.executable, str(MAKE_QR), url, "-o", str(base), "--dark", dark.lstrip("#"),
                        "--light", "FFFFFF", "--scale", str(QR_SCALE)], capture_output=True, text=True)
    if r.returncode != 0:
        raise SystemExit(f"make_qr.py failed for {url}:\n{r.stdout}{r.stderr}")
    png, svg = base.with_suffix(".png"), base.with_suffix(".svg")
    qr = Image.open(png).convert("RGB")
    page = Image.new("RGB", (qr.width * 4, qr.height), "white")
    page.paste(qr, (qr.width * 3 // 2, 0))
    page_png = img_dir / "start_qr_page.png"
    page.save(page_png, optimize=True)
    return png, svg, page_png


# ----------------------------------------------------------------------------- PDF (reportlab, standard fonts)
# 2026-10-22 look: BKE Studio logo (brand/svg, drawn as vector paths, no font), a cover with the design's own picture
# (platform/themes/<id>/img/og-1200x630.jpg: no text in it), the quick start on a page of its own, a clickable "full
# guide" contents (+ PDF bookmarks), numbered badges, cards, colours of brand/tokens.json. The words are still only Ek A
# plus a few fixed signposts of the layout (GUIDE_TEXT); standard PDF fonts only (Helvetica, Times-Italic, ZapfDingbats).

BRAND_SVG = REPO / "brand" / "svg"
BRAND_TOKENS = REPO / "brand" / "tokens.json"
PAGE_W, PAGE_H, MARGIN = 612, 792, 54
TEXT_W = PAGE_W - 2 * MARGIN
HERO_H = 214  # the cover picture, full text width
QUICK_START = "Start now"  # the H2 that opens page 2 (Ek A "## Start now: the first 5 steps")
QA_SECTIONS = ("Quick answers", "Troubleshooting")  # "**question** answer" lines become question/answer pairs
GUIDE_TEXT = {  # the layout's own signposts (not panel labels; nothing here is checked against the platform source)
    "full_kicker": "THE FULL GUIDE",
    "full_title": "Everything else, when you need it",
    "full_body": "You do not need to read it all now. Each part below explains one area of your editor. "
                 "Tap a topic to jump to it.",
    "contents": "In this guide",
}


def _colours() -> dict[str, str]:
    tok = json.loads(BRAND_TOKENS.read_text(encoding="utf-8"))["color"]
    c = {k: tok[k]["hex"] for k in ("anchor", "accent", "paper", "ink", "secondary", "paper_light")}
    # derived for the guide: card white, hairlines, a soft tint for boxes, a darker gold that is readable as small text
    # on paper_light (5.6:1) and a muted ink for page furniture (6.0:1)
    c.update(card="#FFFFFF", line="#E6DCCB", tint="#F3ECE0", gold_text="#7A5F2E", muted="#655862")
    return c


def _svg_shapes(svg: Path) -> tuple[list[float], list[tuple[str, str]]]:
    """viewBox and (fill, d) of a brand SVG: flat paths of absolute M/L/C/Z only (traced logos, brand/README.md)."""
    text = svg.read_text(encoding="utf-8")
    vb = [float(x) for x in re.search(r'viewBox="([^"]+)"', text).group(1).split()]
    shapes = re.findall(r'<path fill="(#[0-9A-Fa-f]{6})" d="([^"]+)"', text)
    if not shapes or re.search(r"[^MLCZ0-9.,\s-]", "".join(d for _, d in shapes)):
        raise SystemExit(f"{svg.relative_to(REPO)}: not a flat M/L/C/Z path logo")
    return vb, shapes


def draw_logo(canv, svg: Path, x: float, y: float, height: float) -> float:
    """Draw a brand SVG with its bottom-left corner at (x, y), `height` pt tall; returns its width."""
    from reportlab.lib.colors import HexColor
    from reportlab.pdfgen.canvas import FILL_NON_ZERO
    vb, shapes = _svg_shapes(svg)
    s = height / vb[3]
    canv.saveState()
    canv.translate(x - vb[0] * s, y + (vb[1] + vb[3]) * s)
    canv.scale(s, -s)
    for fill, d in shapes:
        p, cmd, nums = canv.beginPath(), None, []
        for tok in re.findall(r"[MLCZ]|-?(?:\d+\.?\d*|\.\d+)", d):
            if tok in "MLCZ":
                cmd, nums = tok, []
                if tok == "Z":
                    p.close()
                continue
            nums.append(float(tok))
            if cmd == "M" and len(nums) == 2:
                p.moveTo(*nums)
                cmd, nums = "L", []  # further pairs after M are lines
            elif cmd == "L" and len(nums) == 2:
                p.lineTo(*nums)
                nums = []
            elif cmd == "C" and len(nums) == 6:
                p.curveTo(*nums)
                nums = []
        canv.setFillColor(HexColor(fill))
        canv.drawPath(p, stroke=0, fill=1, fillMode=FILL_NON_ZERO)
    canv.restoreState()
    return vb[2] * s


def hero_picture(theme: str) -> Path | None:
    p = REPO / "platform" / "themes" / theme / "img" / "og-1200x630.jpg"
    return p if p.exists() else None


def _inline(text: str, link: str = "#2B1526", bold: str = "#2B1526") -> str:
    text = escape(text).replace("—", "-").replace("–", "-")
    text = re.sub(r"\[([^\]]+)\]\((https?://[^)]+)\)", rf'<a href="\2" color="{link}"><u>\1</u></a>', text)
    return re.sub(r"\*\*([^*]+)\*\*", rf'<font color="{bold}"><b>\1</b></font>', text)


def _pdf_parts(c: dict[str, str]):
    """reportlab styles and flowables, imported on first use (the checks run without reportlab)."""
    from reportlab.lib.colors import HexColor
    from reportlab.lib.styles import ParagraphStyle
    from reportlab.platypus import Flowable, Paragraph

    H = {k: HexColor(v) for k, v in c.items()}
    body = dict(fontName="Helvetica", fontSize=10.2, leading=15.6, textColor=H["ink"])
    S = {
        "body": ParagraphStyle("GBody", spaceAfter=8, **body),
        "lead": ParagraphStyle("GLead", fontName="Helvetica", fontSize=11.5, leading=17.5, textColor=H["ink"], spaceAfter=16),
        "bullet": ParagraphStyle("GBullet", spaceAfter=5, leftIndent=16, bulletIndent=2, bulletFontName="Helvetica-Bold",
                                 bulletFontSize=11, bulletColor=H["accent"], **body),
        "step": ParagraphStyle("GStep", **body),
        "cover_title": ParagraphStyle("GCoverTitle", fontName="Helvetica-Bold", fontSize=40, leading=44,
                                      textColor=H["anchor"], spaceAfter=4),
        "cover_sub": ParagraphStyle("GCoverSub", fontName="Times-Italic", fontSize=21, leading=26, textColor=H["anchor"],
                                    spaceAfter=14),
        "kicker": ParagraphStyle("GKicker", fontName="Helvetica-Bold", fontSize=8, leading=11, textColor=H["gold_text"]),
        "h2": ParagraphStyle("GH2", fontName="Helvetica-Bold", fontSize=17, leading=21.5, textColor=H["anchor"]),
        "h3": ParagraphStyle("GH3", fontName="Helvetica-Bold", fontSize=11.5, leading=16, spaceBefore=10, spaceAfter=6,
                             textColor=H["anchor"], keepWithNext=True),
        "card_title": ParagraphStyle("GCardTitle", fontName="Helvetica-Bold", fontSize=12, leading=16, spaceAfter=9,
                                     textColor=H["anchor"]),
        "cell": ParagraphStyle("GCell", fontName="Helvetica", fontSize=9.4, leading=13.6, textColor=H["ink"]),
        "cell_head": ParagraphStyle("GCellHead", fontName="Helvetica-Bold", fontSize=9.4, leading=13.6,
                                    textColor=H["paper_light"]),
        "q": ParagraphStyle("GQ", fontName="Helvetica-Bold", fontSize=10.4, leading=15, textColor=H["anchor"], spaceAfter=3),
        "a": ParagraphStyle("GA", spaceAfter=0, **body),
        "band_title": ParagraphStyle("GBandTitle", fontName="Helvetica-Bold", fontSize=18, leading=23,
                                     textColor=H["paper_light"], spaceAfter=6),
        "band_body": ParagraphStyle("GBandBody", fontName="Helvetica", fontSize=10.4, leading=15.5,
                                    textColor=H["paper"]),
        "band_kicker": ParagraphStyle("GBandKicker", fontName="Helvetica-Bold", fontSize=8, leading=11,
                                      textColor=H["accent"], spaceAfter=6),
        "toc": ParagraphStyle("GToc", fontName="Helvetica", fontSize=10, leading=14, textColor=H["ink"]),
        "toc_page": ParagraphStyle("GTocPage", fontName="Helvetica", fontSize=10, leading=14, textColor=H["muted"],
                                   alignment=2),
    }

    class WholeParagraph(Paragraph):
        """A body paragraph is never split over two pages."""

        def split(self, available_width, available_height):
            return []

    class LinkedImage(Flowable):
        """The QR picture at a fixed size, clickable (opens the start link)."""

        def __init__(self, path: Path, size: float, url: str):
            super().__init__()
            self.path, self.size, self.url = str(path), size, url

        def wrap(self, *_):
            return self.size, self.size

        def draw(self):
            self.canv.drawImage(self.path, 0, 0, self.size, self.size)
            self.canv.linkURL(self.url, (0, 0, self.size, self.size), relative=1, thickness=0)

    class Badge(Flowable):
        """A numbered circle: filled (the quick start) or a gold ring (lists further on)."""

        def __init__(self, n: str, d: float, filled: bool):
            super().__init__()
            self.n, self.d, self.filled = n, d, filled

        def wrap(self, *_):
            return self.d, self.d

        def draw(self):
            cv, r = self.canv, self.d / 2
            if self.filled:
                cv.setFillColor(H["anchor"])
                cv.circle(r, r, r, stroke=0, fill=1)
                cv.setFillColor(H["paper_light"])
            else:
                cv.setStrokeColor(H["accent"])
                cv.setLineWidth(1.2)
                cv.setFillColor(H["card"])
                cv.circle(r, r, r - 0.6, stroke=1, fill=1)
                cv.setFillColor(H["anchor"])
            size = self.d * 0.5
            cv.setFont("Helvetica-Bold", size)
            cv.drawCentredString(r, r - size * 0.36, self.n)

    class Heading(Flowable):
        """A section title: optional kicker ("STEP 3"), the title, a short gold bar; a PDF bookmark and a jump target."""

        def __init__(self, title: str, kicker: str, key: str, toc_title: str, space_before: float = 24):
            super().__init__()
            self.title, self.kicker, self.toc_key, self.toc_title = title, kicker, key, toc_title
            self.spaceBefore, self.keepWithNext = space_before, True

        def wrap(self, aw, ah):
            self._t = Paragraph(f'<a name="{self.toc_key}"/>{_inline(self.title)}', S["h2"])
            self._k = Paragraph(self.kicker, S["kicker"]) if self.kicker else None
            _, self._th = self._t.wrap(aw, ah)
            self._kh = self._k.wrap(aw, ah)[1] + 3 if self._k else 0
            self.width, self.height = aw, self._kh + self._th + 14
            return self.width, self.height

        def draw(self):
            y = self.height
            if self._k:
                self._k.drawOn(self.canv, 0, y - self._kh + 3)
                y -= self._kh
            self._t.drawOn(self.canv, 0, y - self._th)
            self.canv.setFillColor(H["accent"])
            self.canv.roundRect(0, 2, 30, 2.6, 1.3, stroke=0, fill=1)

    class Check(Flowable):
        """A drawn check mark (the cover's "Good to know" list)."""

        def wrap(self, *_):
            return 12, 12

        def draw(self):
            cv = self.canv
            cv.setStrokeColor(H["gold_text"])
            cv.setLineWidth(1.8)
            cv.setLineCap(1)
            cv.setLineJoin(1)
            p = cv.beginPath()
            p.moveTo(1.5, 5.5)
            p.lineTo(4.8, 2.2)
            p.lineTo(10.5, 9.5)
            cv.drawPath(p, stroke=1, fill=0)

    return H, S, WholeParagraph, LinkedImage, Badge, Heading, Check


def _blocks(markdown: str) -> list[tuple]:
    """Ek A as blocks: ("title", text) ("h2", text) ("h3", text) ("p", text) ("li", text) ("num", n, text)
    ("table", rows) ("box", lines) ("qr",)."""
    out, lines, i = [], markdown.splitlines(), 0
    while i < len(lines):
        line = lines[i]
        i += 1
        if not line.strip():
            continue
        if line.startswith("|"):
            rows = [line]
            while i < len(lines) and lines[i].startswith("|"):
                rows.append(lines[i])
                i += 1
            out.append(("table", [[c.strip() for c in r.strip().strip("|").split("|")]
                                  for r in rows if not re.match(r"^\|[\s:|-]+\|$", r)]))
        elif line.startswith(">"):
            box = [line]
            while i < len(lines) and lines[i].startswith(">"):
                box.append(lines[i])
                i += 1
            out.append(("box", [b for b in (x[1:].strip() for x in box) if b]))
        elif line.startswith("!["):
            out.append(("qr",))
        elif line.startswith("# "):
            out.append(("title", line[2:]))
        elif line.startswith("## "):
            out.append(("h2", line[3:]))
        elif line.startswith("### "):
            out.append(("h3", line[4:]))
        elif line.startswith("- "):
            out.append(("li", line[2:]))
        elif m := re.match(r"^(\d+)\. (.*)$", line):
            out.append(("num", m.group(1), m.group(2)))
        else:
            out.append(("p", line))
    return out


def _sections(blocks: list[tuple]) -> list[tuple[str, str, str, str]]:
    """(key, kicker, title, contents title) of every H2."""
    out = []
    for n, b in enumerate(x for x in blocks if x[0] == "h2"):
        m = re.match(r"^Step (\d+)\. (.*)$", b[1])
        kicker, title = (f"STEP {m.group(1)}", m.group(2)) if m else ("", b[1])
        if b[1].startswith(QUICK_START):
            kicker = "QUICK START"
        toc = f"Step {m.group(1)}: {m.group(2)}" if m else b[1]
        out.append((f"s{n:02d}", kicker, title, toc))
    return out


def build_pdf(markdown: str, out: Path, qr_png: Path, url: str, name: str, hero: Path | None = None) -> Path:
    from PIL import Image
    from reportlab.platypus import (KeepTogether, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table,
                                    TableStyle)

    c = _colours()
    H, S, WholeParagraph, LinkedImage, Badge, Heading, Check = _pdf_parts(c)
    inl = lambda t: _inline(t, link=c["anchor"], bold=c["anchor"])  # noqa: E731
    blocks = _blocks(markdown)
    sections = _sections(blocks)
    title = next(b[1] for b in blocks if b[0] == "title")
    big, small = (title.split(": ", 1) + [""])[:2]

    def card(inner: list, bg: str = "card", pad: float = 16, border: bool = True, width: float = TEXT_W) -> Table:
        t = Table([[inner]], colWidths=[width], hAlign="LEFT")
        style = [("BACKGROUND", (0, 0), (-1, -1), H[bg]), ("ROUNDEDCORNERS", [10, 10, 10, 10]),
                 ("LEFTPADDING", (0, 0), (-1, -1), pad), ("RIGHTPADDING", (0, 0), (-1, -1), pad),
                 ("TOPPADDING", (0, 0), (-1, -1), pad - 2), ("BOTTOMPADDING", (0, 0), (-1, -1), pad - 6)]
        if border:
            style.append(("BOX", (0, 0), (-1, -1), 0.7, H["line"]))
        t.setStyle(TableStyle(style))
        return t

    def numbered(n: str, text: str, big_badge: bool, width: float = TEXT_W) -> Table:
        d = 24 if big_badge else 18
        gap = 14 if big_badge else 10
        p = Paragraph(inl(text), S["step"])
        t = Table([[Badge(n, d, big_badge), p]], colWidths=[d + gap, width - d - gap], hAlign="LEFT")
        t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                               ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 0),
                               ("BOTTOMPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (1, 0), (1, 0), 3 if big_badge else 1)]))
        return t

    def contents(pages: dict[str, int]) -> list:
        rows = [(f'<a href="#{k}" color="{c["ink"]}">{escape(t)}</a>', str(pages.get(k, ""))) for k, _, _, t in sections]
        half = (len(rows) + 1) // 2
        left, right = rows[:half], rows[half:] + [("", "")] * (2 * half - len(rows))
        data = [[Paragraph(a, S["toc"]), Paragraph(b, S["toc_page"]), "", Paragraph(x, S["toc"]),
                 Paragraph(y, S["toc_page"])] for (a, b), (x, y) in zip(left, right)]
        col = (TEXT_W - 20) / 2
        t = Table(data, colWidths=[col - 26, 26, 20, col - 26, 26], hAlign="LEFT")
        t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                               ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 3),
                               ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
                               ("LINEBELOW", (0, 0), (1, -1), 0.5, H["line"]),
                               ("LINEBELOW", (3, 0), (4, len(rows) - half - 1), 0.5, H["line"])]))
        return [Spacer(1, 10), Paragraph(GUIDE_TEXT["contents"], S["card_title"]), t]

    def flow(pages: dict[str, int]) -> list:
        f, sec, sec_i, i = [Spacer(1, HERO_H + 40)], "", -1, 0
        while i < len(blocks):
            b = blocks[i]
            i += 1
            kind = b[0]
            if kind == "title":
                f += [Paragraph(escape(big), S["cover_title"])]
                if small:
                    f.append(Paragraph(escape(small), S["cover_sub"]))
            elif kind == "h2":
                sec_i += 1
                sec = b[1]
                key, kicker, head, toc = sections[sec_i]
                if sec_i in (1, 2):  # the quick start alone on page 2; "Come back on any device" opens page 3
                    f.append(PageBreak())
                elif re.match(r"^Step 1\. ", sec):  # the full guide starts: a signpost and the contents, together
                    f += [KeepTogether([Spacer(1, 2), card([
                        Paragraph(GUIDE_TEXT["full_kicker"], S["band_kicker"]),
                        Paragraph(GUIDE_TEXT["full_title"], S["band_title"]),
                        Paragraph(GUIDE_TEXT["full_body"], S["band_body"])], bg="anchor", pad=18, border=False),
                        *contents(pages)])]
                if sec_i == 0:  # "Good to know" on the cover: one card of check marks
                    items = []
                    while i < len(blocks) and blocks[i][0] == "li":
                        row = Table([[Check(), Paragraph(inl(blocks[i][1]), S["step"])]], colWidths=[22, TEXT_W - 62])
                        row.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                                                 ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (0, 0), 2),
                                                 ("TOPPADDING", (1, 0), (1, 0), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 7)]))
                        items.append(row)
                        i += 1
                    f.append(card([Paragraph(f'<a name="{key}"/>{escape(head)}', S["card_title"]), *items], pad=20))
                    continue
                if sec.startswith("Help and privacy"):  # the last section, kept on one page: the way to reach us on a card
                    last = [Heading(head, kicker, key, toc, space_before=26)]
                    while i < len(blocks) and blocks[i][0] == "p":
                        para = Paragraph(inl(blocks[i][1]), S["body"])
                        last += [Spacer(1, 2), card([para], bg="tint", pad=16, border=False), Spacer(1, 10)] \
                            if "@" in blocks[i][1] else [para]
                        i += 1
                    f.append(KeepTogether(last + [Spacer(1, 10), _EndMark()]))
                    continue
                f.append(Heading(head, kicker, key, toc, space_before=4 if sec.startswith(QUICK_START) else 26))
            elif kind == "h3":
                f.append(Paragraph(inl(b[1]), S["h3"]))
            elif kind == "num":
                quick = sec.startswith(QUICK_START)
                f += [numbered(b[1], b[2], quick), Spacer(1, 14 if quick else 9)]
            elif kind == "li":
                f.append(WholeParagraph(inl(b[1]), S["bullet"], bulletText="•"))
            elif kind == "qr":
                # the start QR (tools/make_qr.py), clickable, in a card with the typed-address line that follows it
                side = []
                if i < len(blocks) and blocks[i][0] == "p" and "Type this address" in blocks[i][1]:
                    side.append(Paragraph(inl(blocks[i][1]), S["step"]))
                    i += 1
                qr = 112
                inner = Table([[LinkedImage(qr_png, qr, url), side]], colWidths=[qr + 18, TEXT_W - 38 - 32 - qr - 18])
                inner.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                                           ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 0),
                                           ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
                q = card([inner], pad=16, width=TEXT_W - 38)
                wrap = Table([["", q]], colWidths=[38, TEXT_W - 38], hAlign="LEFT")
                wrap.setStyle(TableStyle([("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                                          ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
                f += [wrap, Spacer(1, 16)]
            elif kind == "table":
                rows = b[1]
                data = [[Paragraph(inl(x), S["cell_head"]) for x in rows[0]]]
                data += [[Paragraph(f"<b>{inl(r[0])}</b>", S["cell"]), Paragraph(inl(r[1]), S["cell"])] for r in rows[1:]]
                t = Table(data, colWidths=[104, TEXT_W - 104], repeatRows=1, hAlign="LEFT")
                st = [("BACKGROUND", (0, 0), (-1, 0), H["anchor"]), ("BACKGROUND", (0, 1), (-1, -1), H["card"]),
                      ("ROUNDEDCORNERS", [8, 8, 8, 8]), ("VALIGN", (0, 0), (-1, -1), "TOP"),
                      ("LEFTPADDING", (0, 0), (-1, -1), 10), ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                      ("TOPPADDING", (0, 0), (-1, -1), 8), ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                      ("LINEBELOW", (0, 1), (-1, -2), 0.5, H["line"]), ("BOX", (0, 0), (-1, -1), 0.7, H["line"])]
                t.setStyle(TableStyle(st))
                f += [Spacer(1, 4), t, Spacer(1, 14)]
            elif kind == "box":
                inner = []
                for line in b[1]:
                    if m := re.fullmatch(r"\*\*([^*]+)\*\*", line):
                        inner.append(Paragraph(inl(m.group(1)), S["card_title"]))
                    elif m := re.match(r"^(\d+)\. (.*)$", line):
                        inner += [numbered(m.group(1), m.group(2), False, TEXT_W - 36), Spacer(1, 7)]
                    else:
                        inner.append(Paragraph(inl(line), S["body"]))
                f += [Spacer(1, 2), card(inner, bg="tint", pad=18, border=False), Spacer(1, 14)]
            elif kind == "p" and sec.startswith(QA_SECTIONS) and (m := re.match(r"^\*\*(.+?)\*\*\s*(.*)$", b[1])):
                f.append(KeepTogether([Paragraph(inl(m.group(1)), S["q"]), Paragraph(inl(m.group(2)), S["a"]),
                                       Spacer(1, 10)]))
            elif kind == "p":
                lead = sec_i < 0  # the thank-you line under the title
                f.append((Paragraph if lead else WholeParagraph)(inl(b[1]), S["lead" if lead else "body"]))
        return f

    class _EndMark(Spacer):
        """The logo, small and centred, under the last section."""

        def __init__(self):
            super().__init__(TEXT_W, 40)

        def draw(self):
            vb, _ = _svg_shapes(BRAND_SVG / "bke-logo-horizontal-anchor.svg")
            h = 18
            draw_logo(self.canv, BRAND_SVG / "bke-logo-horizontal-anchor.svg", (TEXT_W - vb[2] * h / vb[3]) / 2, 8, h)

    def page_bg(canv):
        canv.setFillColor(H["paper_light"])
        canv.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)

    hero_file = None

    def cover(canv, doc):
        canv.saveState()
        page_bg(canv)
        draw_logo(canv, BRAND_SVG / "bke-logo-horizontal-anchor.svg", MARGIN, PAGE_H - 70, 24)
        top = PAGE_H - 92
        p = canv.beginPath()
        p.roundRect(MARGIN, top - HERO_H, TEXT_W, HERO_H, 14)
        canv.saveState()
        canv.clipPath(p, stroke=0, fill=0)
        if hero_file:
            canv.drawImage(str(hero_file), MARGIN, top - HERO_H, TEXT_W, HERO_H)
        else:
            canv.setFillColor(H["paper"])
            canv.rect(MARGIN, top - HERO_H, TEXT_W, HERO_H, stroke=0, fill=1)
            draw_logo(canv, BRAND_SVG / "bke-monogram-anchor.svg", PAGE_W / 2 - 50, top - HERO_H / 2 - 46, 92)
        canv.restoreState()
        # the design's name on a white label over the picture (as /start says "Design: …")
        label = f"Design: {name}"
        canv.setFont("Helvetica-Bold", 9)
        w = canv.stringWidth(label, "Helvetica-Bold", 9) + 24
        canv.setFillColor(H["card"])
        canv.roundRect(MARGIN + 14, top - HERO_H + 14, w, 22, 11, stroke=0, fill=1)
        canv.setFillColor(H["anchor"])
        canv.drawString(MARGIN + 26, top - HERO_H + 21.5, label)
        canv.restoreState()

    state = {"total": 0}

    def later(canv, doc):
        canv.saveState()
        page_bg(canv)
        canv.setStrokeColor(H["line"])
        canv.setLineWidth(0.7)
        canv.line(MARGIN, 44, PAGE_W - MARGIN, 44)
        draw_logo(canv, BRAND_SVG / "bke-monogram-small-anchor.svg", MARGIN, 24, 12)
        canv.setFillColor(H["muted"])
        canv.setFont("Helvetica", 8)
        canv.drawString(MARGIN + 20, 27, f"Start Here  ·  {name}")
        total = state["total"]
        canv.drawRightString(PAGE_W - MARGIN, 27, f"{doc.page} / {total}" if total else str(doc.page))
        canv.restoreState()

    class GuideDoc(SimpleDocTemplate):
        def afterFlowable(self, fl):
            key = getattr(fl, "toc_key", None)
            if key:
                self.canv.addOutlineEntry(fl.toc_title, key, level=0)
                self.pages_of[key] = self.page

    out.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="guide_hero_") as tmp:
        if hero:
            im = Image.open(hero).convert("RGB")
            want = TEXT_W / HERO_H
            h = round(im.width / want)
            if h <= im.height:
                top = (im.height - h) // 2
                im = im.crop((0, top, im.width, top + h))
            hero_file = Path(tmp) / "hero.jpg"
            im.save(hero_file, quality=86, optimize=True, progressive=False)
        pages: dict[str, int] = {}
        for _ in range(2):  # pass 1 finds the page of every section, pass 2 prints them in the contents
            doc = GuideDoc(str(out), pagesize=(PAGE_W, PAGE_H), leftMargin=MARGIN, rightMargin=MARGIN, topMargin=MARGIN,
                           bottomMargin=62, title=f"Start Here: {name}", author="BKE Studio",
                           subject=f"Your {name} wedding website: how to start", lang="en-US", invariant=1)
            doc.pages_of = {}
            doc.build(flow(pages), onFirstPage=cover, onLaterPages=later)
            pages, state["total"] = {**dict(doc.pages_of), sections[0][0]: 1}, doc.page  # "Good to know": the cover
    return out


# ----------------------------------------------------------------------------- build

def build(no: str, folder: str, theme: str, base: str = BASE_URL, tmpl: str | None = None) -> list[Path]:
    vals = values(theme, base)
    md = fill(template() if tmpl is None else tmpl, vals)
    out = customer_dir(folder)
    out.mkdir(parents=True, exist_ok=True)
    (out / "START_HERE.md").write_text(md, encoding="utf-8")
    png, svg, page = make_start_qr(vals["START_URL"], out / "img", qr_dark(folder, theme))
    pdf = build_pdf(md, out / "START_HERE.pdf", png, vals["START_URL"], vals["DESIGN_NAME"], hero_picture(theme))
    return [out / "START_HERE.md", png, svg, page, pdf]


# ----------------------------------------------------------------------------- checks

LABEL_SOURCES = [REPO / "platform" / "components" / "panel", REPO / "platform" / "app" / "start",
                 REPO / "platform" / "lib" / "panel", REPO / "platform" / "lib" / "claim", REPO / "platform" / "lib" / "theme",
                 # G131: labels the panel reads from shared modules (G126 track names, G128 answer types) and the guest
                 # site's shared scripts (G126 "Play music", G127 map card)
                 REPO / "platform" / "lib" / "audio", REPO / "platform" / "lib" / "rsvp", REPO / "platform" / "lib" / "maps.ts",
                 REPO / "platform" / "public" / "audio" / "audio.js", REPO / "platform" / "public" / "static" / "map.js",
                 # G148: /my ("Open or start your website", G146) and the sales site's "Create your website" button
                 REPO / "platform" / "components" / "my", REPO / "platform" / "components" / "marketing" / "Shell.tsx",
                 # G154: Share → Downloads (G139): the card reads its words from lib/print/labels.ts
                 REPO / "platform" / "lib" / "print" / "labels.ts"]
# Bold text in the guide that is emphasis, not a panel label (checked by hand against the source, 2026-10-16).
NOT_LABELS = {"First publish", "After that", "What stays as designed", "What guests do", "What you do", "not later",
              "3 changes in total", "12 months after your wedding date", "24 hours", "bkestudio01@gmail.com",
              "Save your edit link", "Your own wording", "Sample text", "Saving",
              "Step 1 of 3",  # "Step {step} of {SETUP_STEP_COUNT}" in Setup.tsx
              "Continue on another device"}  # G148: the title of the guide's own box, not a UI label
NOT_QUOTES = {"#", "3 fields still show sample text"}  # a sample of SampleLine's "{count} fields still show sample text"
_corpus: dict[str, str] = {}


def _source_text(theme: str) -> str:
    if theme not in _corpus:
        if "" not in _corpus:
            parts = []
            for d in LABEL_SOURCES:
                if d.is_file():  # a single module or a guest-site script (.js)
                    parts.append(d.read_text(encoding="utf-8"))
                    continue
                for p in sorted(d.rglob("*")):
                    if p.suffix in {".ts", ".tsx"} and ".test." not in p.name:
                        parts.append(p.read_text(encoding="utf-8"))
            text = "\n".join(parts)
            for a, b in (("&amp;", "&"), ("&rsquo;", "’"), ("&lsquo;", "‘"), ("&apos;", "'"), ("&quot;", '"'), ("\\'", "'")):
                text = text.replace(a, b)
            _corpus[""] = text
        theme_json = REPO / "platform" / "themes" / theme / "theme.json"
        _corpus[theme] = _corpus[""] + "\n" + (theme_json.read_text(encoding="utf-8") if theme_json.exists() else "")
    return _corpus[theme]


def label_problems(md: str, theme: str) -> list[str]:
    """Bold labels must appear as a UI string (between quotes or JSX > … <) and quoted texts somewhere in the source."""
    src = _source_text(theme)
    tab = opening_tab(eu.opening_object(theme))
    out = []
    body = re.split(r"^## Quick answers$", md, flags=re.M)[0]  # Quick answers + Troubleshooting: bold = questions
    for run in re.findall(r"\*\*(.+?)\*\*", body):
        run = run.strip().strip('"')
        if run.endswith("?") or (run.endswith(".") and len(run.split()) > 4):  # a bold sentence, not a label
            continue
        for label in (s.strip().rstrip(":.") for s in run.split("→")):
            if not label or label in NOT_LABELS:
                continue
            if label == tab:  # computed in the panel from designs.ts (G121), not a string in the source
                if "export function openingTabLabel" not in src:
                    out.append(f"preview tab **{label}**: the panel no longer names it after the design's opening "
                               "(lib/panel/model.ts openingTabLabel)")
                continue
            pat = rf"(?:^|['\"`>}}“])\s*{re.escape(label)}\s*(?:$|['\"`<{{”])"
            if not re.search(pat, src, re.M):
                out.append(f"label not in the panel source: **{label}**")
    for quote in re.findall(r'"([^"\n]+)"', md):
        q = quote.strip().rstrip(".")
        if q in NOT_QUOTES or q.startswith("http"):
            continue
        if q not in src:
            out.append(f'quoted text not in the panel/theme source: "{q}"')
    return sorted(set(out))


def pdf_uris(pdf: Path) -> list[str]:
    from pypdf import PdfReader
    uris = []
    for page in PdfReader(str(pdf)).pages:
        for a in page.get("/Annots") or []:
            act = a.get_object().get("/A")
            if act and act.get("/URI"):
                uris.append(str(act["/URI"]))
    return uris


def pdf_page_count(pdf: Path) -> int:
    from pypdf import PdfReader
    return len(PdfReader(str(pdf)).pages)


def jsqr_dir() -> Path | None:
    cands = [os.environ.get("JSQR_DIR"), REPO / "platform" / "node_modules" / "jsqr"]
    try:  # a git worktree has no node_modules of its own: use the main checkout's
        common = subprocess.run(["git", "-C", str(REPO), "rev-parse", "--path-format=absolute", "--git-common-dir"],
                                capture_output=True, text=True, check=True).stdout.strip()
        cands.append(Path(common).parent / "platform" / "node_modules" / "jsqr")
    except (OSError, subprocess.CalledProcessError):
        pass
    for c in cands:
        if c and (Path(c) / "package.json").exists():
            return Path(c)
    return None


JSQR_JS = r"""
const jsQR = require(process.argv[2]);
const fs = require('fs');
const items = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
console.log(JSON.stringify(items.map((it) => {
  const b = fs.readFileSync(it.raw);
  const r = jsQR(new Uint8ClampedArray(b.buffer, b.byteOffset, b.length), it.w, it.h);
  return r ? r.data : null;
})));
"""


def raster_qr(images: list[Path]) -> list[str | None] | None:
    """jsQR's reading of each picture (None = no QR found); None when node or jsqr is missing."""
    from PIL import Image
    js, node = jsqr_dir(), shutil.which("node")
    if not js or not node:
        return None
    with tempfile.TemporaryDirectory(prefix="guide_qr_") as tmp:
        tmp = Path(tmp)
        items = []
        for n, img in enumerate(images):
            im = Image.open(img).convert("RGBA")
            raw = tmp / f"{n}.rgba"
            raw.write_bytes(im.tobytes())
            items.append({"raw": str(raw), "w": im.width, "h": im.height})
        (tmp / "items.json").write_text(json.dumps(items), encoding="utf-8")
        (tmp / "decode.js").write_text(JSQR_JS, encoding="utf-8")
        r = subprocess.run([node, str(tmp / "decode.js"), str(js), str(tmp / "items.json")], capture_output=True, text=True)
        if r.returncode != 0:
            raise RuntimeError(f"jsQR failed: {r.stderr.strip()[:300]}")
        return json.loads(r.stdout)


def pdf_pages_png(pdf: Path, out_dir: Path, dpi: int = 150) -> list[Path]:
    if not shutil.which("pdftoppm"):
        try:  # no poppler (Windows): the same pages with PyMuPDF, named like pdftoppm's output
            import fitz
        except ImportError:
            raise RuntimeError("pdftoppm (poppler) not found, and no PyMuPDF") from None
        with fitz.open(pdf) as doc:
            for i, page in enumerate(doc, 1):
                page.get_pixmap(dpi=dpi).save(out_dir / f"page-{i}.png")
        return sorted(out_dir.glob("page-*.png"), key=lambda p: int(re.search(r"-(\d+)\.png$", p.name).group(1)))
    subprocess.run(["pdftoppm", "-r", str(dpi), "-png", str(pdf), str(out_dir / "page")], check=True)
    return sorted(out_dir.glob("page-*.png"), key=lambda p: int(re.search(r"-(\d+)\.png$", p.name).group(1)))


def check(no: str, folder: str, theme: str, base: str = BASE_URL, raster: bool = True,
          tmpl: str | None = None) -> tuple[list[str], dict]:
    """Problems (empty = all good) and facts for the report (pages, links, QR readings)."""
    import numpy as np
    from PIL import Image
    lk = eu.lk
    out, p, facts = customer_dir(folder), [], {}
    vals = values(theme, base)
    url = vals["START_URL"]
    md_path, pdf = out / "START_HERE.md", out / "START_HERE.pdf"
    png, page_png = out / "img" / "start_qr.png", out / "img" / "start_qr_page.png"
    for f in (md_path, pdf, png, out / "img" / "start_qr.svg", page_png):
        if not f.exists():
            p.append(f"missing {f.relative_to(REPO)}")
    if p:
        return p, facts
    md = md_path.read_text(encoding="utf-8")
    if md != fill(template() if tmpl is None else tmpl, vals):
        p.append("START_HERE.md is not Ek A of docs/19 filled in (stale copy: run this tool)")
    if f"({url})" not in md:
        p.append(f"START_HERE.md has no clickable {url}")
    if f"({vals['MY_URL']})" not in md:  # G148: the way back on any device
        p.append(f"START_HERE.md has no clickable {vals['MY_URL']}")
    if PLACEHOLDER.search(md):
        p.append("START_HERE.md has {…} left")
    if vals["OPENING"] != "envelope" and re.search(r"\benvelope\b", md, re.I):
        p.append(f"'envelope' in the guide of a {vals['OPENING']} design")
    p += label_problems(md, theme)
    # QR: module by module (segno re-encode), and the page strip holds the same pixels
    if not lk.qr_matches(png, url, scale=QR_SCALE):
        p.append(f"start_qr.png does not encode {url}")
    qr_px = np.asarray(Image.open(png).convert("RGB"))
    strip = np.asarray(Image.open(page_png).convert("RGB"))
    w = qr_px.shape[1]
    if strip.shape[0] != qr_px.shape[0] or not np.array_equal(strip[:, w * 3 // 2:w * 5 // 2], qr_px):
        p.append("start_qr_page.png is not the start QR")
    svg = (out / "img" / "start_qr.svg").read_text(encoding="utf-8")
    if "segno" not in svg:
        p.append("start_qr.svg was not made by tools/make_qr.py (segno)")
    # PDF links
    uris = pdf_uris(pdf)
    facts["links"] = uris
    if url not in uris:
        p.append(f"START_HERE.pdf has no clickable {url}")
    if vals["MY_URL"] not in uris:
        p.append(f"START_HERE.pdf has no clickable {vals['MY_URL']}")
    other = sorted(set(uris) - {url, vals["PRIVACY_URL"], vals["MY_URL"]})
    if other:
        p.append(f"START_HERE.pdf links elsewhere: {other}")
    facts["pages"] = pdf_page_count(pdf)
    text = lk.pdf_text(pdf) or ""
    if vals["DESIGN_NAME"] not in text or PLACEHOLDER.search(text):
        p.append("START_HERE.pdf text: design name missing or {…} left")
    # Raster: jsQR on the QR files and on every rendered page of the PDF
    if raster:
        with tempfile.TemporaryDirectory(prefix="guide_pages_") as tmp:
            pages = pdf_pages_png(pdf, Path(tmp))
            read = raster_qr([png, page_png, *pages])
        if read is None:
            facts["raster"] = "skipped (node or jsqr not found)"
        else:
            # jsQR can "find" a code with no data in a page of plain text (seen once at 150 dpi, 11 page 6): a real QR
            # always carries data, so an empty reading counts as no QR and is only reported.
            files, in_pdf = read[:2], [r for r in read[2:] if r]
            empty = [n for n, r in enumerate(read[2:], 1) if r == ""]
            facts["raster"] = {"start_qr.png": files[0], "start_qr_page.png": files[1], "pdf": in_pdf, "empty_pages": empty}
            if files != [url, url]:
                p.append(f"jsQR reads the QR files as {files}, not {url}")
            if in_pdf != [url]:
                p.append(f"jsQR reads the PDF pages as {in_pdf} (want exactly one QR: {url})")
    return p, facts


# ----------------------------------------------------------------------------- CLI

def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--designs", default="all", help="'all' (default), '06-20', '07,12' …")
    ap.add_argument("--check", action="store_true", help="build nothing; check the files on disk")
    ap.add_argument("--base-url", default=BASE_URL, help=f"host of the start link (default {BASE_URL})")
    ap.add_argument("--no-raster", action="store_true", help="skip the jsQR reading of the PNGs and the PDF pages")
    a = ap.parse_args(argv)
    tmpl = template()
    bad = 0
    for no, folder, theme in eu.select(a.designs):
        if not a.check:
            build(no, folder, theme, a.base_url, tmpl)
        problems, facts = check(no, folder, theme, a.base_url, not a.no_raster, tmpl)
        raster = facts.get("raster")
        qr_note = raster if isinstance(raster, str) else ("jsQR ok" if not problems else "jsQR see below")
        if isinstance(raster, dict) and raster["empty_pages"]:
            qr_note += f" (empty jsQR reading ignored on page {', '.join(map(str, raster['empty_pages']))})"
        print(f"{no} {theme}: {facts.get('pages', '?')} pages · links {sorted(set(facts.get('links', [])))} · "
              f"{qr_note} · {'OK' if not problems else f'{len(problems)} problem(s)'}")
        for x in problems:
            print(f"  - {x}")
        bad += bool(problems)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
