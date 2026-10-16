#!/usr/bin/env python3
"""START HERE guides for designs 01–20 (G122): Markdown + PDF + the real start QR, from ONE source text.

  python3 tools/build_customer_guides.py                   # all 20 designs: build, then check
  python3 tools/build_customer_guides.py --designs 06-20   # only these ("06-20", "07,12", "01,06-08", "all")
  python3 tools/build_customer_guides.py --check           # build nothing; check what is on disk (exit 1 on a problem)
  python3 tools/build_customer_guides.py --base-url https://…   # another host for the start link (or GUIDE_BASE_URL)

Source: docs/19_ALICI_YOLCULUGU.md, Ek A (between <!-- g091:start-here:start --> and end). Never edit a copy by hand:
change Ek A and run this again. Placeholders filled per design ({…} left over stops the build):
  {DESIGN_NAME}    platform/themes/<id>/theme.json "name" (what /start shows as "Design: …")
  {START_URL}      <base>/start?theme=<id>      (route: platform/app/start/page.tsx)
  {PRIVACY_URL}    <base>/privacy               (route: platform/app/(marketing)/privacy/page.tsx)
  {OPENING}        what guests tap first: envelope, gatefold, pouch, wallet, book or sleeve
                   (platform/lib/marketing/designs.ts, "Your guests tap the <thing>.")
  {OPENING_TAB}    the same word capitalised: the panel's first preview tab (G121, lib/panel/model.ts openingTabLabel)
  {LANGUAGE_FONTS} one of LANGUAGE_LINES, from the design's fonts (designs.ts `fonts`) and FONT_SUBSETS below

Writes per design, in collections/<NN_*>/package/customer/:
  START_HERE.md            Ek A, filled in
  img/start_qr.png + .svg  QR of the start link, made ONLY by tools/make_qr.py (segno, error correction Q, 4-module
                           quiet zone, scale 20); dark modules = the darkest colour of the design's palette.json
  img/start_qr_page.png    the same pixels centred on a white strip 4× as wide (what START_HERE.md shows; md_to_pdf and
                           tools/listing_kit.py scale pictures to the text width)
  START_HERE.pdf           US Letter, reportlab, standard PDF fonts (no font file is embedded or shipped); the QR is
                           img/start_qr.png itself and is a clickable link to the start URL

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
  - the PDF's links are the start URL (at least once) and the privacy notice, nothing else
Needs: reportlab, segno, Pillow, numpy, pypdf, pdftoppm (poppler) and node + jsqr for the raster check (looked up in
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
BASE_URL = os.environ.get("GUIDE_BASE_URL", "https://davetiye-platform-five.vercel.app")
DESIGN_COPY = REPO / "platform" / "lib" / "marketing" / "designs.ts"
MAKE_QR = TOOLS / "make_qr.py"
QR_SCALE = 20  # make_qr.py default; listing_kit.qr_matches compares at this scale
PLACEHOLDER = re.compile(r"\{[A-Z_]+\}")

# Google Fonts subsets of every font a design loads, read from fonts.googleapis.com/css2 on 2026-10-16 (G122; the same
# check as G123's listing language lines). "cyrillic" = has Cyrillic, "latin-ext" = Central/Eastern European accents,
# "latin" = Basic Latin + Western European accents only. A new font must be added here (the build stops otherwise).
FONT_SUBSETS: dict[str, set[str]] = {
    "Alex Brush": {"latin", "latin-ext"},
    "Allison": {"latin", "latin-ext"},
    "Allura": {"latin", "latin-ext"},
    "Bodoni Moda": {"latin", "latin-ext"},
    "Cinzel": {"latin", "latin-ext"},
    "Cinzel Decorative": {"latin", "latin-ext"},
    "Cormorant Garamond": {"latin", "latin-ext", "cyrillic"},
    "Cormorant Infant": {"latin", "latin-ext", "cyrillic"},
    "Cormorant SC": {"latin", "latin-ext", "cyrillic"},
    "Dancing Script": {"latin", "latin-ext"},
    "EB Garamond": {"latin", "latin-ext", "cyrillic"},
    "Great Vibes": {"latin", "latin-ext", "cyrillic"},
    "Homemade Apple": {"latin"},
    "IM Fell English": {"latin"},
    "Italiana": {"latin"},
    "Italianno": {"latin", "latin-ext"},
    "Josefin Sans": {"latin", "latin-ext"},
    "Josefin Slab": {"latin"},
    "Kaushan Script": {"latin", "latin-ext"},
    "Libre Baskerville": {"latin", "latin-ext"},
    "Lora": {"latin", "latin-ext", "cyrillic"},
    "Marcellus": {"latin", "latin-ext"},
    "Merriweather": {"latin", "latin-ext", "cyrillic"},
    "Mrs Saint Delafield": {"latin", "latin-ext"},
    "Noto Serif Display": {"latin", "latin-ext", "cyrillic"},
    "Parisienne": {"latin", "latin-ext"},
    "Petit Formal Script": {"latin", "latin-ext"},
    "Pinyon Script": {"latin", "latin-ext"},
    "Playfair Display": {"latin", "latin-ext", "cyrillic"},
    "Playfair Display SC": {"latin", "latin-ext", "cyrillic"},
    "Raleway": {"latin", "latin-ext", "cyrillic"},
    "Sacramento": {"latin", "latin-ext"},
    "Satisfy": {"latin"},
    "Special Elite": {"latin", "latin-ext"},
    "Spectral": {"latin", "latin-ext", "cyrillic"},
    "Tangerine": {"latin"},
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
    m = re.search(r"\bfonts:\s*\[([^\]]*)\]", design_block(theme, copy))
    if not m:
        raise SystemExit(f"{DESIGN_COPY.relative_to(REPO)}: no fonts for '{theme}'")
    return re.findall(r"'([^']+)'", m.group(1))


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


def values(theme: str, base: str = BASE_URL) -> dict[str, str]:
    return {
        "DESIGN_NAME": eu.theme_name(theme),
        "START_URL": start_url(theme, base),
        "PRIVACY_URL": privacy_url(base),
        "OPENING": eu.opening_object(theme),
        "OPENING_TAB": opening_tab(eu.opening_object(theme)),
        "LANGUAGE_FONTS": LANGUAGE_LINES[language_class(design_fonts(theme))],
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


def qr_dark(folder: str) -> str:
    """The darkest colour of the design's palette (ink is light on the dark designs 06, 17, 19), as long as it keeps
    a contrast of at least 7:1 on white; else near-black."""
    pal = json.loads((REPO / "collections" / folder / "palette.json").read_text(encoding="utf-8"))
    colours = [v for v in pal.values() if isinstance(v, str) and re.fullmatch(r"#[0-9A-Fa-f]{6}", v)]
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

def _pdf_parts():
    """reportlab objects, imported on first use (the checks run without reportlab)."""
    from reportlab.lib.colors import HexColor
    from reportlab.lib.styles import ParagraphStyle
    from reportlab.platypus import Flowable, Paragraph

    ink, paper, gold = HexColor("#2B1526"), HexColor("#FAF7F0"), HexColor("#D0AE6A")
    styles = {
        "body": ParagraphStyle("GuideBody", fontName="Helvetica", fontSize=10, leading=15, spaceAfter=8, textColor=ink),
        "title": ParagraphStyle("GuideTitle", fontName="Helvetica-Bold", fontSize=25, leading=30, spaceAfter=20, textColor=ink),
        "h2": ParagraphStyle("GuideH2", fontName="Helvetica-Bold", fontSize=15, leading=20, spaceBefore=17, spaceAfter=10,
                             textColor=ink, keepWithNext=True),
        "h3": ParagraphStyle("GuideH3", fontName="Helvetica-Bold", fontSize=11, leading=16, spaceBefore=10, spaceAfter=6,
                             textColor=ink, keepWithNext=True),
        "cell": ParagraphStyle("GuideCell", fontName="Helvetica", fontSize=9, leading=13, textColor=ink),
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

    return ink, paper, gold, styles, WholeParagraph, LinkedImage


def _inline(text: str) -> str:
    text = escape(text).replace("—", "-").replace("–", "-")
    text = re.sub(r"\[([^\]]+)\]\((https?://[^)]+)\)", r'<a href="\2" color="#2B1526"><u>\1</u></a>', text)
    return re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", text)


def build_pdf(markdown: str, out: Path, qr_png: Path, url: str, name: str) -> Path:
    from reportlab.platypus import SimpleDocTemplate, Spacer, Table, TableStyle

    ink, paper, gold, styles, WholeParagraph, LinkedImage = _pdf_parts()
    from reportlab.platypus import Paragraph

    def footer(canvas, doc):
        canvas.saveState()
        canvas.setStrokeColor(gold)
        canvas.line(48, 42, 564, 42)
        canvas.setFillColor(ink)
        canvas.setFont("Helvetica", 8)
        canvas.drawString(48, 28, f"BKE Studio  |  Start Here: {name}")
        canvas.drawRightString(564, 28, str(doc.page))
        canvas.restoreState()

    flow, lines, i = [], markdown.splitlines(), 0
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
            data = []
            for r in rows:
                if re.match(r"^\|[\s:|-]+\|$", r):
                    continue
                cells = [c.strip() for c in r.strip().strip("|").split("|")]
                if not data:
                    cells = [f"**{c}**" for c in cells]
                data.append([Paragraph(_inline(c), styles["cell"]) for c in cells])
            table = Table(data, colWidths=[108, 408], repeatRows=1, hAlign="LEFT")
            table.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), paper), ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 8), ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 8), ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("LINEBELOW", (0, 0), (-1, -1), 0.5, gold)]))
            flow.extend([table, Spacer(1, 10)])
            continue
        if line.startswith("!["):
            # The start QR of tools/make_qr.py, 1.6 in, clickable.
            flow.extend([LinkedImage(qr_png, 115, url), Spacer(1, 12)])
            continue
        if line.startswith("# "):
            style, line = "title", line[2:]
        elif line.startswith("## "):
            style, line = "h2", line[3:]
        elif line.startswith("### "):
            style, line = "h3", line[4:]
        else:
            style = "body"
            if line.startswith("- "):
                line = "• " + line[2:]
        flow.append((WholeParagraph if style == "body" else Paragraph)(_inline(line), styles[style]))
    out.parent.mkdir(parents=True, exist_ok=True)
    SimpleDocTemplate(str(out), pagesize=(612, 792), leftMargin=48, rightMargin=48, topMargin=48, bottomMargin=56,
                      title=f"Start Here: {name}", author="BKE Studio", subject=f"Your {name} wedding website: how to start",
                      lang="en-US", invariant=1).build(flow, onFirstPage=footer, onLaterPages=footer)
    return out


# ----------------------------------------------------------------------------- build

def build(no: str, folder: str, theme: str, base: str = BASE_URL, tmpl: str | None = None) -> list[Path]:
    vals = values(theme, base)
    md = fill(template() if tmpl is None else tmpl, vals)
    out = customer_dir(folder)
    out.mkdir(parents=True, exist_ok=True)
    (out / "START_HERE.md").write_text(md, encoding="utf-8")
    png, svg, page = make_start_qr(vals["START_URL"], out / "img", qr_dark(folder))
    pdf = build_pdf(md, out / "START_HERE.pdf", png, vals["START_URL"], vals["DESIGN_NAME"])
    return [out / "START_HERE.md", png, svg, page, pdf]


# ----------------------------------------------------------------------------- checks

LABEL_SOURCES = [REPO / "platform" / "components" / "panel", REPO / "platform" / "app" / "start",
                 REPO / "platform" / "lib" / "panel", REPO / "platform" / "lib" / "claim", REPO / "platform" / "lib" / "theme",
                 # G131: labels the panel reads from shared modules (G126 track names, G128 answer types) and the guest
                 # site's shared scripts (G126 "Play music", G127 map card)
                 REPO / "platform" / "lib" / "audio", REPO / "platform" / "lib" / "rsvp", REPO / "platform" / "lib" / "maps.ts",
                 REPO / "platform" / "public" / "audio" / "audio.js", REPO / "platform" / "public" / "static" / "map.js"]
# Bold text in the guide that is emphasis, not a panel label (checked by hand against the source, 2026-10-16).
NOT_LABELS = {"First publish", "After that", "What stays as designed", "What guests do", "What you do", "not later",
              "3 changes in total", "12 months after your wedding date", "24 hours", "bkestudio@gmail.com",
              "Save your edit link", "Your own wording", "Sample text", "Saving",
              "Step 1 of 3"}  # "Step {step} of {SETUP_STEP_COUNT}" in Setup.tsx
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
        raise RuntimeError("pdftoppm (poppler) not found")
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
    other = sorted(set(uris) - {url, vals["PRIVACY_URL"]})
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
