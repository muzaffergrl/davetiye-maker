#!/usr/bin/env python3
"""Etsy listing kit + buyer START HERE guide for a platform theme (G059, K24 platform model).

  python3 tools/listing_kit.py <step> --theme <id>|all [--base-url https://…] [--no-fonts]

Steps (each one reads what the step before it wrote; `all` = qr, images, video, pdf, check):
  capture   real screenshots + the opening recording of the theme: runs tools/listing_templates/capture.ts against a
            local production build of platform/ (`npm ci && npm run build` first; nothing is deployed); guest pages,
            /start, and the K29 editor (3-step setup, Home, Edit's six pages, Headings & labels, Share, Guests, RSVP
            questions) → collections/<NN_*>/package/shots/
  qr        QR of the buyer's start link /start?theme=<id> (segno, error correction Q, like tools/make_qr.py)
            → package/customer/img/start_qr.png + .svg
  strips    step pictures for a guide with pictures: 1–2 real screens side by side on white, each cut to the part the
            step is about → package/customer/img/*.jpg (the G091 guide is text + QR only and uses none of them)
  images    the Etsy listing images, 2000 × 2000 PNG, from tools/listing_templates/platform/*.html (Playwright Chromium;
            layout + typography only): 01, 02 and 08 on the design's own GPT mockup scene with the real screens placed
            in its #00FF00 screens (SCENES, tools/mockup_compose.py), the others with the theme's own GPT corners
            → package/listing/images/
  video     a short silent listing clip from the opening recording, 1080 × 1080 H.264 → package/listing/video.mp4
  pdf       listing_v3.md → listing_<id>.pdf (all fields, image thumbnails, the cover at search-result size and as a
            4:3 crop, video facts) with tools/md_to_pdf.py
  guide     START_HERE.md → START_HERE.pdf with this tool's cover (not in `all`: since G091 the guide PDF is built by
            tools/build_customer_guides.py, and this step would replace it)
  check     checks every output (sizes, counts, title/tag rules, video rules, the PDF's link, the QR's content)
            --prepublish also: start link and demo answer 200 with the theme's name (live), and no [VERIFY …] or
            [COMMERCIAL PLACEHOLDER] is left in listing_v3.md, START_HERE.md or the PDFs. A kit is not sale_ready until `check --prepublish` passes (docs/05 §D).

Text (START_HERE.md, listing_v3.md) is written by hand; this tool only builds files from it. Commercial fields stay as
placeholders ([SHOP NAME], [PRICE], …). Etsy rules used by `check` are in ETSY below with their source and status.
Needs: Pillow, numpy, segno, pypdf (optional), ffmpeg/ffprobe, node + Playwright (NODE_PATH, /opt/pw-browsers).
"""
from __future__ import annotations

import argparse
import html
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

TOOLS = Path(__file__).resolve().parent
REPO = TOOLS.parent
TEMPLATES = TOOLS / "listing_templates" / "platform"
CAPTURE = TOOLS / "listing_templates" / "capture.ts"
sys.path.insert(0, str(TOOLS))

BASE_URL = os.environ.get("LISTING_BASE_URL", "https://xn--bkestudo-zkb.com")
PLACEHOLDER_HOSTS = {"example.com", "example.org", "averyandjordan.com", "www.averyandjordan.com", "localhost", "127.0.0.1"}


DESIGN_COPY = REPO / "platform" / "lib" / "marketing" / "designs.ts"
_OPENINGS: dict[str, str] = {}


def opening_object(theme_id: str) -> str:
    """What guests tap first ("envelope", "gatefold", "pouch", "wallet", "book", "sleeve"): the design's opening sentence
    in platform/lib/marketing/designs.ts ("Your guests tap the <thing>.", the sales site's openingObject; the same rule
    as tools/etsy_upload.py)."""
    if theme_id not in _OPENINGS:
        copy = DESIGN_COPY.read_text(encoding="utf-8")
        # G137: quoted keys ("opening": "…", design 21) as well as bare ones; G144: msg('…') around the sentence
        m = re.search(rf"^  '{re.escape(theme_id)}': \{{.*?(?:\bopening|\"opening\"):\s*(?:msg\(\s*)?['\"]Your guests tap the ([a-z]+)\.",
                      copy, re.S | re.M)
        if not m:
            raise RuntimeError(f"{DESIGN_COPY.relative_to(REPO)}: no opening sentence for '{theme_id}'")
        _OPENINGS[theme_id] = m.group(1)
    return _OPENINGS[theme_id]


@dataclass(frozen=True)
class Theme:
    id: str
    no: str
    folder: str
    name: str
    tagline: str
    corner_tl: str
    corner_br: str
    bg: str | None = None
    # G124: how the listing names the opening object when the bare word from designs.ts is not enough (the alt texts
    # of listing_v3 §5 say "storybook", "linen pouch", "travel wallet", "vellum sleeve")
    opening_name: str | None = None

    @property
    def collection(self) -> Path:
        return REPO / "collections" / self.folder

    @property
    def package(self) -> Path:
        return self.collection / "package"

    @property
    def opening(self) -> str:
        """The opening object's word on the design's own site ("envelope", "gatefold", "book" …)."""
        return opening_object(self.id)

    @property
    def opening_words(self) -> dict[str, str]:
        """The opening object in listing texts: `short` in a step ("The gatefold opens"), `long` in a list ("Travel
        wallet opening and four pages"). Never "envelope" for a design that is not one (G099/G124)."""
        short = "storybook" if self.opening == "book" else self.opening
        long = self.opening_name or short
        return {"short": short, "long": long, "Long": long[:1].upper() + long[1:]}


THEMES: dict[str, Theme] = {
    "olive-ivory": Theme(
        id="olive-ivory", no="01", folder="01_Olive_Ivory", name="Olive & Ivory",
        tagline="Olive branches, ivory roses and a lace envelope with a gold wax seal",
        corner_tl="platform/themes/olive-ivory/img/decor_tl-960.webp",
        corner_br="platform/themes/olive-ivory/img/decor_br-960.webp",
        bg="collections/01_Olive_Ivory/assets/gpt/parts/bg_tile.png",
    ),
    "blush-garden-rose": Theme(
        id="blush-garden-rose", no="03", folder="03_Blush_Garden_Rose", name="Blush Garden Rose",
        tagline="Blush peonies, garden roses and an envelope tied with a silk bow",
        corner_tl="platform/themes/blush-garden-rose/img/florals_tl-960.webp",
        corner_br="platform/themes/blush-garden-rose/img/florals_br-960.webp",
    ),
    "dusty-blue-champagne": Theme(
        id="dusty-blue-champagne", no="02", folder="02_Dusty_Blue", name="Dusty Blue & Champagne",
        tagline="An ivory envelope with a dusty blue wax seal, cream roses and eucalyptus",
        corner_tl="platform/themes/dusty-blue-champagne/img/florals_tl-960.webp",
        corner_br="platform/themes/dusty-blue-champagne/img/florals_br-875.webp",
    ),
    "vintage-airmail-love-letter": Theme(
        id="vintage-airmail-love-letter", no="04", folder="04_Vintage_Airmail", name="Vintage Airmail Love Letter",
        tagline="A striped airmail envelope, a burgundy wax seal, stamps and dried flowers",
        corner_tl="platform/themes/vintage-airmail-love-letter/img/decor_tl-760.webp",
        corner_br="platform/themes/vintage-airmail-love-letter/img/decor_br-760.webp",
    ),
    "mediterranean-lemon": Theme(
        id="mediterranean-lemon", no="05", folder="05_Lemon_Mediterranean", name="Mediterranean Lemon",
        tagline="Lemons, cobalt tiles and a scalloped envelope tied with a blue ribbon",
        corner_tl="platform/themes/mediterranean-lemon/img/decor_tl-960.webp",
        corner_br="platform/themes/mediterranean-lemon/img/decor_br-960.webp",
    ),
    # G124: designs 06–20 (taglines = the style line of platform/lib/marketing/designs.ts; corners = the theme's
    # largest painted corner files)
    **{t.id: t for t in (
        Theme(id="art-deco-black-tie", no="06", folder="06_Art_Deco_Noir", name="Art Deco Black-Tie",
              tagline="A navy two-door gatefold with a gold art deco medallion, gold fan rays and pearls",
              corner_tl="platform/themes/art-deco-black-tie/img/decor_tl-720.webp",
              corner_br="platform/themes/art-deco-black-tie/img/decor_br-720.webp"),
        Theme(id="burgundy-velvet-autumn", no="07", folder="07_Burgundy_Velvet", name="Burgundy Velvet Autumn",
              tagline="An ivory envelope wrapped in burgundy velvet ribbon, dahlias, blackberries and copper leaves",
              corner_tl="platform/themes/burgundy-velvet-autumn/img/florals_tl-900.webp",
              corner_br="platform/themes/burgundy-velvet-autumn/img/florals_br-900.webp"),
        Theme(id="winter-evergreen", no="08", folder="08_Winter_Evergreen", name="Winter Evergreen",
              tagline="A forest green envelope with a snowy deckle edge, a pine-and-berry bundle and pine cones",
              corner_tl="platform/themes/winter-evergreen/img/decor_tl-720.webp",
              corner_br="platform/themes/winter-evergreen/img/decor_br-720.webp"),
        Theme(id="lavender-provence", no="09", folder="09_Lavender_Provence", name="Lavender Provence",
              tagline="A cream linen pouch tied with jute twine and a lavender bundle, pressed lavender and daisies",
              corner_tl="platform/themes/lavender-provence/img/florals_tl-820.webp",
              corner_br="platform/themes/lavender-provence/img/florals_br-820.webp", opening_name="linen pouch"),
        Theme(id="tuscan-vineyard", no="10", folder="10_Tuscan_Vineyard", name="Tuscan Vineyard",
              tagline="A kraft envelope tied with twine, a cork and olive leaves, grape clusters and vine leaves",
              corner_tl="platform/themes/tuscan-vineyard/img/decor_tl-960.webp",
              corner_br="platform/themes/tuscan-vineyard/img/decor_br-960.webp"),
        Theme(id="boho-pampas-terracotta", no="11", folder="11_Boho_Pampas", name="Boho Pampas Terracotta",
              tagline="A terracotta arch envelope tied with pampas and a palm spear, dried roses on sunlit sand",
              corner_tl="platform/themes/boho-pampas-terracotta/img/decor_tl-960.webp",
              corner_br="platform/themes/boho-pampas-terracotta/img/decor_br-940.webp"),
        Theme(id="tropical-destination", no="12", folder="12_Tropical_Destination", name="Tropical Destination",
              tagline="A travel wallet with a leather strap and a brass snap, plumeria, monstera and hibiscus",
              corner_tl="platform/themes/tropical-destination/img/florals_tl-960.webp",
              corner_br="platform/themes/tropical-destination/img/florals_br-960.webp", opening_name="travel wallet"),
        Theme(id="enchanted-forest-storybook", no="13", folder="13_Enchanted_Forest", name="Enchanted Forest Storybook",
              tagline="A moss-green storybook with a brass clasp, ferns, toadstools and fireflies",
              corner_tl="platform/themes/enchanted-forest-storybook/img/decor_tl-720.webp",
              corner_br="platform/themes/enchanted-forest-storybook/img/decor_br-720.webp", opening_name="storybook"),
        Theme(id="ivory-lace-pearls", no="14", folder="14_Ivory_Lace_Pearl", name="Ivory Lace & Pearls",
              tagline="A lace-covered ivory gatefold with a pearl brooch, white garden roses and pearl strands",
              corner_tl="platform/themes/ivory-lace-pearls/img/decor_tl-720.webp",
              corner_br="platform/themes/ivory-lace-pearls/img/decor_br-720.webp"),
        Theme(id="cherry-blossom-spring", no="15", folder="15_Cherry_Blossom", name="Cherry Blossom Spring",
              tagline="A pale grey envelope with a cherry blossom twig, watercolor blossoms and petals",
              corner_tl="platform/themes/cherry-blossom-spring/img/florals_tl-720.webp",
              corner_br="platform/themes/cherry-blossom-spring/img/florals_br-720.webp"),
        Theme(id="sunflower-rustic-barn", no="16", folder="16_Sunflower_Rustic", name="Sunflower Rustic Barn",
              tagline="A kraft envelope tied with a mustard gingham bow and a sunflower, sunflowers and wheat",
              corner_tl="platform/themes/sunflower-rustic-barn/img/florals_tl-720.webp",
              corner_br="platform/themes/sunflower-rustic-barn/img/florals_br-720.webp"),
        Theme(id="emerald-gold-estate", no="17", folder="17_Emerald_Gold_Estate", name="Emerald & Gold Estate",
              tagline="An emerald velvet envelope with a gold seal, gold line-art ferns and white marble cards",
              corner_tl="platform/themes/emerald-gold-estate/img/decor_tl-720.webp",
              corner_br="platform/themes/emerald-gold-estate/img/decor_br-720.webp"),
        Theme(id="wildflower-meadow-vellum", no="18", folder="18_Wildflower_Vellum", name="Wildflower Meadow Vellum",
              tagline="A frosted vellum sleeve with a wildflower label, colored-pencil poppies and cornflowers",
              corner_tl="platform/themes/wildflower-meadow-vellum/img/florals_tl-720.webp",
              corner_br="platform/themes/wildflower-meadow-vellum/img/florals_br-720.webp", opening_name="vellum sleeve"),
        Theme(id="midnight-garden", no="19", folder="19_Midnight_Garden", name="Midnight Garden",
              tagline="A matte black envelope with a silver seal, oil-painted roses, peonies and gilded frames",
              corner_tl="platform/themes/midnight-garden/img/florals_tl-720.webp",
              corner_br="platform/themes/midnight-garden/img/florals_br-720.webp"),
        Theme(id="coastal-seaside", no="20", folder="20_Coastal_Seaside", name="Coastal Seaside",
              tagline="A speckled sand envelope with a wave-edged flap and a scallop shell, watercolor sea and shells",
              corner_tl="platform/themes/coastal-seaside/img/decor_tl-720.webp",
              corner_br="platform/themes/coastal-seaside/img/decor_br-720.webp"),
        # G137: design 21 (sale status "coming"); its only painted corner piece is the rose branch
        Theme(id="crimson-rose-atelier", no="21", folder="21_Crimson_Rose_Atelier", name="Crimson Rose Atelier",
              tagline="Crimson roses, a burgundy envelope with a gold botanical wax seal, an offset oval portrait and a "
                      "landscape chapter album",
              corner_tl="platform/themes/crimson-rose-atelier/img/rose-branch.webp",
              corner_br="platform/themes/crimson-rose-atelier/img/rose-branch.webp"),
    )},
}
# The listing text each tool reads (G091: listing_v3.md replaced listing.md, which stays as the earlier record).
LISTING_MD = "listing_v3.md"

# Listing images, in upload order (file = <name>.png; template = tools/listing_templates/platform/<name>.html).
IMAGES = ["01_cover", "02_guest_pages", "03_whats_included", "04_how_it_works", "05_editor", "06_rsvp",
          "07_details", "08_live_demo"]
# The images that go on Etsy (docs/21, 2026-10-16): the editorial set from tools/listing_editorial.py. IMAGES above is
# the earlier G059 kit that the `images` step still builds into images/ (kept for comparison, not uploaded).
UPLOAD_DIR = "images_editorial"
UPLOAD_IMAGES = ["01_cover", "02_opening", "03_pages", "04_edit", "05_rsvp", "06_details", "07_how", "08_included",
                 "09_devices"]  # G148 (K47): "continue on any device" (Etsy order number + email, G146)
UPLOAD_SCENES = ["01_cover", "02_opening", "04_edit", "08_included"]  # built on GPT mockup scenes (green screens)
# Screens each template / guide strip uses (from capture.ts; b*/e*/s*/p* = the K29 editor, docs/16 §0b).
SHOTS = ["g01_envelope", "g02_home_top", "g03_home_invitation", "g04_home_calendar", "g05_story", "g06_details_top",
         "g07_details_schedule", "g08_details_faq", "g09_rsvp_top", "g10_rsvp_form", "g11_rsvp_sent",
         "g12_details_venue", "d01_demo_home", "b01_start", "b02_start_form", "b03_edit_link", "b04_setup_names",
         "b05_setup_photo", "b06_panel_crop", "b07_setup_publish", "b08_home", "b09_panel_preview", "b10_live_qr",
         "e01_edit_pages", "e02_day_place", "e03_copy_labels", "s01_share", "p01_panel_replies",
         "p02_panel_reply_list", "p03_panel_questions"]
# START HERE pictures (for a guide with step pictures; the G091 guide is text + QR only): file → at most two screens
# side by side (G059 review: a row of three or four small phones was unreadable in the PDF), each with the part of it
# the step is about: None = the whole screen, (top, bottom) = CSS px of the 390 px wide screen, "sheet" = a bottom
# sheet without the plain background above it.
STRIPS: dict[str, list[tuple[str, object]]] = {
    "step1_start": [("b01_start", None), ("b02_start_form", None)],
    "step2_link": [("b03_edit_link", (0, 612))],
    "step3_editor": [("b04_setup_names", None), ("e01_edit_pages", None)],
    "step4_photos": [("b06_panel_crop", "sheet"), ("b05_setup_photo", None)],
    "step5_publish": [("b07_setup_publish", None), ("b10_live_qr", None)],
    "step7_replies": [("p01_panel_replies", None), ("p03_panel_questions", None)],
    "guests": [("g01_envelope", None), ("g02_home_top", None)],
}
# Listing images built on the design's own GPT mockup scene (PAKET 3, collections/<NN>/assets/gpt/mockups/, flat
# #00FF00 screens): the real screens go into the green screens left to right (tools/mockup_compose.py through
# tools/listing_v2/kompozit.py), the template sets the text on top. The other images are layout + real screens only.
SCENES: dict[str, tuple[str, list[str]]] = {
    "01_cover": ("cover_hand.png", ["g01_envelope"]),
    "02_guest_pages": ("three_phones.png", ["g02_home_top", "g05_story", "g09_rsvp_top"]),
    "08_live_demo": ("flatlay_phone.png", ["d01_demo_home"]),
}
# Placement on the 2000 px canvas (the same as G067's listing_v2): the cover phone's screen starts at y 830 under the
# headline (the strip above the scene is its own edge, mirrored and blurred); the three phones are scaled 1.52 with their
# screens from y 640; the flat-lay is scaled 1.7 against the left edge, its empty linen holding the QR column.
SCENE_LAYOUT = {"cover_screen_top": 830, "pages_scale": 1.52, "pages_screen_top": 640, "demo_scale": 1.7,
                "demo_col_left": 120}

# Etsy rules checked by `check`. Source + status: help.etsy.com and etsy.com could NOT be opened from this environment
# (2026-10-14: DNS/proxy refusal); the values come from web-search excerpts of Etsy's own help pages ("How to Create a
# Listing", "How to Add Listing Videos", "Requirements and Best Practices for Images", "How to Manage Your Digital
# Listings"). Re-check in the listing editor before publishing.
ETSY = {
    "checked": "2026-10-14, web-search excerpts of help.etsy.com (direct fetch refused) — UNVERIFIED",
    "title_max": 140,
    "tags": 13,
    "tag_max": 20,
    "photos_max": 20,
    "photo_min_px": 2000,          # recommended (not enforced) shortest side
    "videos_max": 2,               # one older help page says 1
    "video_min_s": 5.0,            # "5–15 seconds" (one page says 3–15)
    "video_max_s": 15.0,
    "video_max_mb": 100,
    "video_min_px": 500,
    "digital_files_max": 5,
    "digital_file_max_mb": 20,
}
VIDEO = {"size": 1080, "max_s": 14.5, "slot_h": 960, "fps": 30}


# ----------------------------------------------------------------------------- small helpers

def theme_of(tid: str) -> Theme:
    if tid not in THEMES:
        raise SystemExit(f"unknown theme '{tid}' (known: {', '.join(THEMES)})")
    return THEMES[tid]


def start_url(t: Theme, base: str = BASE_URL) -> str:
    return f"{base.rstrip('/')}/start?theme={t.id}"


def demo_url(t: Theme, base: str = BASE_URL) -> str:
    return f"{base.rstrip('/')}/start/demo/{t.id}"


def palette(t: Theme) -> dict:
    return json.loads((t.collection / "palette.json").read_text(encoding="utf-8"))


def luminance(hex_colour: str) -> float:
    h = hex_colour.lstrip("#")
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def is_dark(t: Theme) -> bool:
    """A dark design (06 navy, 17 emerald, 19 black): its palette's text colour (`ink`) is light and `ivory` is that
    same light colour, so light paper behind dark ink would be wrong. Listing layouts then use the dark `mist_top` as
    paper."""
    return luminance(palette(t)["ink"]) > 0.5


def check_url(url: str) -> None:
    from urllib.parse import urlparse
    u = urlparse(url)
    if u.scheme != "https" or not u.netloc:
        raise ValueError(f"not an https URL: {url}")
    if u.hostname in PLACEHOLDER_HOSTS:
        raise ValueError(f"{u.hostname} is a demo/placeholder host, not a real target")


def make_qr(url: str, out_base: Path, dark: str = "#2B2B2B", light: str = "#FFFFFF", scale: int = 20) -> tuple[Path, Path]:
    """Real QR of `url` (segno, error correction Q, 4-module quiet zone — same settings as tools/make_qr.py)."""
    import segno
    check_url(url)
    out_base.parent.mkdir(parents=True, exist_ok=True)
    qr = segno.make(url, error="q", micro=False)
    png, svg = out_base.with_suffix(".png"), out_base.with_suffix(".svg")
    qr.save(str(png), scale=scale, border=4, dark=dark, light=light)
    qr.save(str(svg), scale=scale, border=4, dark=dark, light=light)
    return png, svg


def qr_matches(png: Path, url: str, scale: int = 20) -> bool:
    """Does the PNG hold exactly the QR of `url` (re-encoded with the same settings, compared module by module)?"""
    import segno
    qr = segno.make(url, error="q", micro=False)
    matrix = np.array([[bool(v) for v in row] for row in qr.matrix])
    n = matrix.shape[0] + 8
    im = np.asarray(Image.open(png).convert("L"))
    if im.shape[0] != n * scale or im.shape[1] != n * scale:
        return False
    centres = im[scale // 2::scale, scale // 2::scale][:n, :n] < 128
    expect = np.zeros((n, n), bool)
    expect[4:-4, 4:-4] = matrix
    return bool((centres == expect).all())


# ----------------------------------------------------------------------------- listing_v3.md fields

def _block_after(md: str, heading_re: str) -> str | None:
    m = re.search(heading_re + r".*?\n```text\n(.*?)\n```", md, re.S | re.I | re.M)
    return m.group(1) if m else None


def listing_fields(md: str) -> dict:
    """Title and tags from listing_v3.md: the first ```text block after '## 1. Title' and after '## 3. Tags'."""
    title = _block_after(md, r"^##\s*1\.\s*Title")
    tags = _block_after(md, r"^##\s*3\.\s*Tags")
    return {
        "title": " ".join(title.split()) if title else None,
        "tags": [x.strip() for x in tags.splitlines() if x.strip()] if tags else [],
    }


def title_problems(title: str | None) -> list[str]:
    if not title:
        return ["no title block"]
    p = []
    if len(title) > ETSY["title_max"]:
        p.append(f"title is {len(title)} characters (max {ETSY['title_max']})")
    for ch in "%:&+":
        if title.count(ch) > 1:
            p.append(f"'{ch}' more than once")
    if re.search(r"[$^`]", title):
        p.append("contains $ ^ or `")
    caps = [w for w in re.findall(r"[A-Za-z]{2,}", title) if w.isupper()]
    if len(caps) > 3:
        p.append(f"more than 3 words in capitals: {caps}")
    return p


def tag_problems(tags: list[str]) -> list[str]:
    p = []
    if len(tags) != ETSY["tags"]:
        p.append(f"{len(tags)} tags (Etsy allows {ETSY['tags']}; use all of them)")
    seen = set()
    for t in tags:
        if len(t) > ETSY["tag_max"]:
            p.append(f"tag '{t}' is {len(t)} characters (max {ETSY['tag_max']})")
        if not re.fullmatch(r"[a-z0-9][a-z0-9 '-]*", t):
            p.append(f"tag '{t}': use lower-case letters, numbers, spaces, ' and - only")
        if t.lower() in seen:
            p.append(f"tag '{t}' repeated")
        seen.add(t.lower())
    return p


# ----------------------------------------------------------------------------- templates

def root_css(t: Theme) -> str:
    pal = palette(t)
    keys = ["ink", "deep", "primary", "mist_top", "mist_bottom", "gold", "gold_light", "ivory", "leaf"]
    lines = [f"  --{k.replace('_', '-')}: {pal[k]};" for k in keys if k in pal]
    bg = f"url('{(REPO / t.bg).resolve().as_uri()}')" if t.bg else "none"
    lines.append(f"  --bg-image: {bg};")
    # the light centre of the background's radial wash: ivory, or for a dark design (light ink) a slightly lighter
    # shade of its own dark ground, so light text keeps its contrast (G124)
    if is_dark(t):
        lines.append(f"  --glow: color-mix(in srgb, {pal['mist_top']} 88%, {pal['ivory']});")
    return ":root {\n" + "\n".join(lines) + "\n}"


HEAD = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{{title}} — {{theme_name}}</title>
<link rel="stylesheet" href="fonts.css">
<link rel="stylesheet" href="kit.css">
<style>{{root_css}}</style>"""


def fill(template: str, values: dict[str, str], raw: frozenset = frozenset({"head", "root_css"})) -> str:
    """{{key}} → value (HTML-escaped unless raw). An unknown key is an error, not silent text."""
    def sub(m):
        k = m.group(1)
        if k not in values:
            raise KeyError(f"template placeholder {{{{{k}}}}} has no value")
        v = values[k]
        return v if k in raw or k.startswith(("shot.", "part.", "qr.", "scene.")) else html.escape(v, quote=True)
    out = re.sub(r"\{\{\s*([\w.]+)\s*\}\}", sub, template)
    # the head block itself holds placeholders
    return re.sub(r"\{\{\s*([\w.]+)\s*\}\}", sub, out)


def template_values(t: Theme, shots: Path, extra: dict[str, str] | None = None, title: str = "") -> dict[str, str]:
    v = {
        "head": HEAD, "root_css": root_css(t), "title": title, "theme_name": t.name, "tagline": t.tagline,
        # the script title of the cover: 200 px up to 13 characters ("Olive & Ivory"), smaller for longer names
        "title_px": str(min(200, round(200 * 13 / max(13, len(t.name))))),
        "demo_url": demo_url(t), "start_url": start_url(t),
        "demo_host": demo_url(t).split("://", 1)[1].split("/", 1)[0],
        "demo_path": "/" + demo_url(t).split("://", 1)[1].split("/", 1)[1],
        "part.corner_tl": (REPO / t.corner_tl).resolve().as_uri(),
        "part.corner_br": (REPO / t.corner_br).resolve().as_uri(),
        # what guests tap first, as the listing names it ("envelope", "gatefold", "storybook" …)
        "opening": t.opening_words["short"], "opening_long": t.opening_words["long"], "Opening": t.opening_words["Long"],
    }
    for s in SHOTS:
        v[f"shot.{s}"] = (shots / f"{s}.jpg").resolve().as_uri()
    v.update(extra or {})
    return v


FONTS = ["Cormorant Garamond", "Montserrat", "Great Vibes"]


def _render_pages(pages: list[tuple[str, Path, int, int]], fonts: bool) -> None:
    """pages: (html text, output png, width, height). One temp folder with kit.css + fonts.css."""
    import md_to_pdf as m2p
    if not m2p.playwright_hazir():
        raise RuntimeError("node + Playwright not found (NODE_PATH=/opt/node22/lib/node_modules, /opt/pw-browsers)")
    with tempfile.TemporaryDirectory(prefix="listing_kit_") as tmp:
        tmp = Path(tmp)
        shutil.copy(TEMPLATES / "kit.css", tmp / "kit.css")
        css = m2p.google_fonts_css(FONTS, tmp / "fonts") if fonts else ""
        if fonts and not css:  # a silent fallback (Georgia) is wider: headings wrap and run into the phones
            raise RuntimeError("Google Fonts could not be downloaded (try again, or --no-fonts to accept fallback fonts)")
        (tmp / "fonts.css").write_text(css, encoding="utf-8")
        for i, (text, out, w, h) in enumerate(pages):
            page = tmp / f"page_{i}.html"
            page.write_text(text, encoding="utf-8")
            out.parent.mkdir(parents=True, exist_ok=True)
            m2p.playwright_calistir({"url": page.as_uri(), "out": str(out.resolve()), "mode": "png", "width": w,
                                     "height": h, "scale": 1, "fonts": FONTS if css else []}, tmp)


# ----------------------------------------------------------------------------- steps

def step_capture(t: Theme, base: str, out: Path | None = None) -> None:
    env = dict(os.environ)
    env.setdefault("NODE_PATH", "/opt/node22/lib/node_modules")
    env.setdefault("PLAYWRIGHT_BROWSERS_PATH", "/opt/pw-browsers")
    # Headless Chromium sometimes loses a renderer ("Target crashed") on the DPR 3 pages of 03 (3 of 8 runs on
    # 2026-10-14, at different steps): the whole capture is repeated, up to 3 times.
    for attempt in range(1, 4):
        r = subprocess.run(["node", str(CAPTURE), "--theme", t.id, "--out", str(out or t.package / "shots"),
                            "--public-url", base], cwd=REPO, env=env)
        if r.returncode == 0:
            return
        print(f"capture attempt {attempt} failed for {t.id} (exit {r.returncode})", file=sys.stderr)
    raise RuntimeError(f"capture failed for {t.id}")


def step_qr(t: Theme, base: str) -> list[Path]:
    """start_qr.png/.svg = the code itself (for printing, and for `check`); start_qr_page.png = the same pixels centred
    on a white strip four times as wide, so the guide shows it at about a quarter of the text width (md_to_pdf scales
    every picture to the text width): about 1.75 in on US Letter."""
    pal = palette(t)
    png, svg = make_qr(start_url(t, base), t.package / "customer" / "img" / "start_qr", dark=pal["ink"])
    qr = Image.open(png).convert("RGB")
    page = Image.new("RGB", (qr.width * 4, qr.height), "white")
    page.paste(qr, (qr.width * 3 // 2, 0))
    page_png = png.with_name("start_qr_page.png")
    page.save(page_png, optimize=True)
    return [png, svg, page_png]


def _rounded(im: Image.Image, r: int) -> Image.Image:
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, im.width - 1, im.height - 1), r, fill=255)
    out = Image.new("RGBA", im.size)
    out.paste(im.convert("RGB"), (0, 0), mask)
    return out


def _sheet_top(im: Image.Image) -> int:
    """First pixel row of a bottom sheet: rows above it are one plain colour (capture.ts puts the editor's background
    behind the sheet)."""
    a = np.asarray(im.convert("RGB")).astype(int)
    ref = a[2, a.shape[1] // 2]
    for y in range(a.shape[0]):  # the white sheet is only ≈ 9–17 levels from the editor's background
        if np.abs(a[y] - ref).max() > 8:
            return max(0, y - 6)
    return 0


def screen_part(path: Path, part: object) -> Image.Image:
    """The part of a captured screen a guide picture shows (see STRIPS); screens are 390 CSS px wide at any scale."""
    im = Image.open(path).convert("RGB")
    k = im.width / 390
    if part == "sheet":
        return im.crop((0, _sheet_top(im), im.width, im.height))
    if isinstance(part, tuple):
        top, bottom = (round(v * k) for v in part)
        return im.crop((0, min(top, im.height - 1), im.width, min(bottom, im.height)))
    return im


STRIP = {"w": 880, "gap": 132, "pad": 22}  # 880 px ≈ 300 dpi at 3 in


def make_strip(screens: list[tuple[Path, object]], out: Path, w: int = STRIP["w"], gap: int = STRIP["gap"],
               pad: int = STRIP["pad"]) -> Path:
    """1–2 screens side by side on white, always two slots wide: in the PDF (the picture at 93.5 % of the text width,
    GUIDE_CSS) every screen is then 42.5 % of the text width (≈ 3 in on US Letter). Rounded corners and a hairline
    border (layout only)."""
    if not 1 <= len(screens) <= 2:
        raise ValueError(f"a guide picture holds 1 or 2 screens, not {len(screens)}")
    parts = [screen_part(p, part) for p, part in screens]
    parts = [im.resize((w, round(im.height * w / im.width)), Image.LANCZOS) for im in parts]
    h = max(im.height for im in parts)
    canvas = Image.new("RGB", (2 * w + gap + 2 * pad, h + 2 * pad), "white")
    used = len(parts) * w + (len(parts) - 1) * gap
    x = (canvas.width - used) // 2
    r = round(w * 0.06)
    for im in parts:
        border = Image.new("RGBA", (w + 4, im.height + 4))
        ImageDraw.Draw(border).rounded_rectangle((0, 0, w + 3, im.height + 3), r + 2, fill=(205, 200, 190, 255))
        canvas.paste(border, (x - 2, pad - 2), border)
        rim = _rounded(im, r)
        canvas.paste(rim, (x, pad), rim)
        x += w + gap
    out.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out, quality=82, optimize=True)
    return out


def step_strips(t: Theme) -> list[Path]:
    shots = t.package / "shots"
    return [make_strip([(shots / f"{s}.jpg", part) for s, part in parts], t.package / "customer" / "img" / f"{name}.jpg")
            for name, parts in STRIPS.items()]


def screen_green(im: Image.Image) -> int:
    """Pixels still close to the mockup's flat screen green (#00FF00): a fringe left after placing the screens. (Not
    kompozit.yesil_kalinti's wider test: leaves in a theme's own screens, e.g. 05's lemon leaves, are green too.)"""
    a = np.asarray(im.convert("RGB")).astype(np.int16)
    return int((((a[..., 1] - np.maximum(a[..., 0], a[..., 2])) >= 150) & (a[..., 1] >= 200)).sum())


def _screen_for(im: Image.Image, ratio: float) -> Image.Image:
    """A captured screen cut to a green screen's width/height ratio: taller screens keep their top (the page's first
    screen is what a phone shows), wider ones (a still cut shorter by capture.ts) lose the same width on both sides."""
    im = im.convert("RGB")
    if im.width / im.height < ratio:
        return im.crop((0, 0, im.width, round(im.width / ratio)))
    w = round(im.height * ratio)
    x = (im.width - w) // 2
    return im.crop((x, 0, x + w, im.height))


def scene_background(t: Theme, name: str, shots: Path, out: Path) -> dict[str, str]:
    """The listing image's 2000 px background: the design's GPT mockup scene, placed on the canvas (SCENE_LAYOUT), with
    the real screens in its green screens (no drawing, K21). Returns the template values: the background and where the
    screens ended up (so text never covers a phone)."""
    sys.path.insert(0, str(TOOLS / "listing_v2"))
    import kompozit as kz  # scale + edge extension, then mockup_compose.birlestir_cok for the screens
    file, names = SCENES[name]
    scene = Image.open(t.collection / "assets" / "gpt" / "mockups" / file)
    regions = kz.ekran_bolgeleri(scene)
    if len(regions) != len(names):
        raise RuntimeError(f"{t.folder} {file}: {len(regions)} green screens, {len(names)} expected")
    T, L = kz.TUVAL, SCENE_LAYOUT
    if name == "01_cover":
        k = T / scene.width
        x0, y0 = 0, L["cover_screen_top"] - regions[0]["kutu"][1] * k
    elif name == "02_guest_pages":
        k = L["pages_scale"]
        x0 = T / 2 - (regions[0]["kutu"][0] + regions[-1]["kutu"][2]) / 2 * k
        y0 = L["pages_screen_top"] - min(r["kutu"][1] for r in regions) * k
    else:  # the flat-lay: against the left edge, the phone centred vertically where the scene allows it
        k = L["demo_scale"]
        mid = (regions[0]["kutu"][1] + regions[0]["kutu"][3]) / 2 * k
        x0, y0 = 0, min(0, max(T - scene.height * k, T / 2 - mid))
    bg, _ = kz.yerlestir(scene, k, x0, y0, sis_gucu=0.45)
    placed = kz.ekran_bolgeleri(bg)
    screens = [_screen_for(Image.open(shots / f"{n}.jpg"), r["oran"]) for n, r in zip(names, placed)]
    bg, _ = kz.ekranlari_oturt(bg, screens)
    left = screen_green(bg)
    if left:
        raise RuntimeError(f"{t.folder} {name}: {left} green pixels left after placing the screens")
    out.parent.mkdir(parents=True, exist_ok=True)
    bg.save(out)
    v = {"scene.bg": out.resolve().as_uri()}
    for i, r in enumerate(placed, 1):
        x_0, y_0, x_1, y_1 = r["kutu"]
        v.update({f"s{i}_cx": str(round((x_0 + x_1) / 2)), f"s{i}_left": str(x_0), f"s{i}_top": str(y_0),
                  f"s{i}_bottom": str(y_1)})
    # (the phone's frame is ≈ 20 px outside its screen)
    v["below_screens"] = str(max(r["kutu"][3] for r in placed) + 56)
    v["above_screens"] = str(min(r["kutu"][1] for r in placed) - 20)
    if name == "08_live_demo":
        col_w = placed[0]["kutu"][0] - 90 - L["demo_col_left"]
        if col_w < 640:
            raise RuntimeError(f"{t.folder} {file}: only {col_w} px left of the phone for the QR column (need 640)")
        v.update({"col_left": str(L["demo_col_left"]), "col_w": str(min(820, col_w)),
                  "col_mid": str(round((placed[0]["kutu"][1] + placed[0]["kutu"][3]) / 2))})
    return v


def step_images(t: Theme, fonts: bool = True) -> list[Path]:
    shots = t.package / "shots"
    missing = [s for s in SHOTS if not (shots / f"{s}.jpg").exists()]
    if missing:
        raise RuntimeError(f"missing screens in {shots}: {missing} (run the capture step)")
    out_dir = t.package / "listing" / "images"
    # the demo QR of image 8 is kept next to the images: `check --prepublish` decodes it (it must open demo_url)
    pal = palette(t)
    qr_png, _ = make_qr(demo_url(t), t.package / "listing" / "demo_qr", dark=pal["ink"], light=pal.get("ivory", "#FFFFFF"))
    values = template_values(t, shots, {"qr.demo": qr_png.resolve().as_uri()})
    pages = []
    with tempfile.TemporaryDirectory(prefix="listing_scenes_") as tmp:
        for name in IMAGES:
            v = dict(values, title=name)
            if name in SCENES:
                v.update(scene_background(t, name, shots, Path(tmp) / f"{name}_bg.png"))
            pages.append((fill((TEMPLATES / f"{name}.html").read_text(encoding="utf-8"), v),
                          out_dir / f"{name}.png", 2000, 2000))
        _render_pages(pages, fonts)
    outs = [out_dir / f"{n}.png" for n in IMAGES]
    for o in outs:  # lossless re-save: smaller file, same pixels
        Image.open(o).convert("RGB").save(o, optimize=True)
    return outs


def _ffprobe(path: Path) -> dict:
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries",
                        "stream=codec_type,codec_name,width,height,r_frame_rate:format=duration,size",
                        "-of", "json", str(path)], capture_output=True, text=True, check=True)
    return json.loads(r.stdout)


def video_facts(path: Path) -> dict:
    info = _ffprobe(path)
    v = next((s for s in info["streams"] if s["codec_type"] == "video"), {})
    return {
        "file": path.name, "duration_s": round(float(info["format"]["duration"]), 2),
        "size_mb": round(int(info["format"]["size"]) / 1_000_000, 2), "width": v.get("width"), "height": v.get("height"),
        "codec": v.get("codec_name"), "fps": v.get("r_frame_rate"),
        "audio": any(s["codec_type"] == "audio" for s in info["streams"]),
    }


def video_problems(f: dict) -> list[str]:
    p = []
    if not ETSY["video_min_s"] <= f["duration_s"] <= ETSY["video_max_s"]:
        p.append(f"{f['duration_s']} s (Etsy: {ETSY['video_min_s']:g}–{ETSY['video_max_s']:g} s)")
    if f["size_mb"] > ETSY["video_max_mb"]:
        p.append(f"{f['size_mb']} MB (max {ETSY['video_max_mb']} MB)")
    if min(f["width"] or 0, f["height"] or 0) < ETSY["video_min_px"]:
        p.append(f"{f['width']}×{f['height']} below {ETSY['video_min_px']} px")
    if f["audio"]:
        p.append("has an audio track (Etsy plays listing videos without sound; ship it silent)")
    if f["codec"] != "h264":
        p.append(f"codec {f['codec']} (use H.264 MP4)")
    return p


def palettes(t: Theme) -> list[dict]:
    """G178: the design's colour palettes for the listing (docs/25 §5): the original first, then theme.json "variants" in
    order, each {id (None = original), name, status, gpt: [parts still waiting for GPT]}. A palette's parts wait for GPT
    when its palette.json "recolor" or recolor.json "parts" set them to "gpt" (docs/25 §2 step 4); such a palette gets no
    listing image (tools/listing_editorial.py --palettes) and no image on its Etsy variation option."""
    tj = json.loads((REPO / "platform" / "themes" / t.id / "theme.json").read_text(encoding="utf-8"))
    vdir = t.collection / "variants"
    manifest = json.loads((vdir / "recolor.json").read_text(encoding="utf-8")) if (vdir / "recolor.json").exists() else {}
    base_gpt = {k for k, v in (manifest.get("parts") or {}).items() if isinstance(v, dict) and v.get("recolor") == "gpt"}
    by_slug = {}
    for pj in sorted(vdir.glob("V0*/palette.json")):
        d = json.loads(pj.read_text(encoding="utf-8"))
        by_slug[d.get("slug")] = d
    out = [{"id": None, "name": t.name, "status": "live", "gpt": []}]
    for v in tj.get("variants") or []:
        over = (by_slug.get(v["id"]) or {}).get("recolor") or {}
        gpt = sorted((base_gpt - {k for k, r in over.items() if r != "gpt"}) | {k for k, r in over.items() if r == "gpt"})
        out.append({"id": v["id"], "name": v["name"], "status": v.get("status"), "gpt": gpt})
    return out


def shots_dir(t: Theme, root: Path | None = None) -> Path:
    """The theme's captured screens: package/shots/ (G059), or <root>/<folder>/ when the capture was written outside the
    repository (G124: tools/listing_editorial.py --capture keeps the 30-odd MB of screens per design out of the repo)."""
    return Path(root) / t.folder if root else t.package / "shots"


def step_video(t: Theme, fonts: bool = True, shots: Path | None = None) -> Path:
    shots = shots or t.package / "shots"
    src = shots / "opening.webm"
    meta = json.loads((shots / "opening.json").read_text())
    size, slot_h = VIDEO["size"], VIDEO["slot_h"]
    # the picture inside the recording (older captures: a 390 × 844 picture in a 780 × 1688 frame)
    cw, ch = (int(v) for v in meta.get("content", "390x844").split("x"))
    slot_w = round(slot_h * cw / ch / 2) * 2
    slot_x, slot_y, radius = size - slot_w - 110, (size - slot_h) // 2, 40
    raw = float(_ffprobe(src)["format"]["duration"])
    dur = round(min(VIDEO["max_s"], raw - meta["lead_in_s"] - 0.1), 2)
    if dur < ETSY["video_min_s"]:
        raise RuntimeError(f"recording too short ({dur} s after the lead-in)")
    out = t.package / "listing" / "video.mp4"
    out.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="listing_video_") as tmp:
        tmp = Path(tmp)
        bg = tmp / "bg.png"
        values = template_values(t, shots, {"slot_x": str(slot_x), "slot_y": str(slot_y), "slot_w": str(slot_w),
                                            "slot_h": str(slot_h), "slot_r": str(radius)}, title="video")
        _render_pages([(fill((TEMPLATES / "video_bg.html").read_text(encoding="utf-8"), values), bg, size, size)], fonts)
        mask = tmp / "mask.png"
        m = Image.new("L", (slot_w, slot_h), 0)
        ImageDraw.Draw(m).rounded_rectangle((0, 0, slot_w - 1, slot_h - 1), radius, fill=255)
        m.save(mask)
        # No fade from or to black (G059 review: a black first frame, and a black flash each time Etsy loops the
        # clip): the clip starts on the closed envelope and its last `xf` seconds dissolve back into that first frame,
        # so the loop is seamless.
        xf, fps = 0.5, VIDEO["fps"]
        fc = (f"[1:v]trim=start={meta['lead_in_s']}:duration={dur},setpts=PTS-STARTPTS,fps={fps},"
              f"crop={cw}:{ch}:0:0,scale={slot_w}:{slot_h}:flags=lanczos,format=rgba[v];"
              f"[2:v]format=gray,scale={slot_w}:{slot_h}[m];[v][m]alphamerge[vm];"
              f"[0:v][vm]overlay={slot_x}:{slot_y}:shortest=1,format=yuv420p,split[a][b];"
              f"[b]trim=end_frame=1,loop=loop={round(xf * fps) - 1}:size=1:start=0,setpts=N/{fps}/TB[first];"
              f"[a][first]xfade=transition=fade:duration={xf}:offset={dur - xf:.2f},format=yuv420p[out]")
        cmd = ["ffmpeg", "-y", "-loglevel", "error", "-loop", "1", "-framerate", str(VIDEO["fps"]), "-t", f"{dur}",
               "-i", str(bg), "-i", str(src), "-loop", "1", "-t", f"{dur}", "-i", str(mask),
               "-filter_complex", fc, "-map", "[out]", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "20",
               "-movflags", "+faststart", "-t", f"{dur}", str(out)]
        subprocess.run(cmd, check=True)
    return out


def _video_frames(video: Path, out_dir: Path, times=(0.6, 4.0, 9.0)) -> list[Path]:
    outs = []
    for i, s in enumerate(times):
        o = out_dir / f"frame_{i}.jpg"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", str(s), "-i", str(video), "-frames:v", "1",
                        "-vf", "scale=360:-1", str(o)], check=True)
        outs.append(o)
    return outs


def cover_previews(cover: Path, tmp: Path) -> tuple[Path, Path]:
    """The cover at search-result size (300 px) and its centred 4:3 crop (2000 × 1500, shown 600 px wide)."""
    im = Image.open(cover).convert("RGB")
    small = tmp / "cover_300.png"
    im.resize((300, 300), Image.LANCZOS).save(small)
    top = (im.height - im.width * 3 // 4) // 2
    crop = tmp / "cover_4x3.jpg"
    im.crop((0, top, im.width, top + im.width * 3 // 4)).resize((600, 450), Image.LANCZOS).save(crop, quality=86)
    return small, crop


def media_markdown(t: Theme, tmp: Path) -> str:
    """The listing PDF's generated part: image thumbnails (4 per row), video facts + 3 frames, check results."""
    img_dir = t.package / "listing" / UPLOAD_DIR
    thumbs = []
    for n in UPLOAD_IMAGES:
        p = img_dir / f"{n}.png"
        th = tmp / f"thumb_{n}.jpg"
        im = Image.open(p).convert("RGB")
        im.thumbnail((420, 420))
        im.save(th, quality=82)
        thumbs.append((n, th, Image.open(p).size, p.stat().st_size))
    rows = ["## Images (generated by tools/listing_editorial.py)", "",
            f"Upload in this order. Files: `package/listing/{UPLOAD_DIR}/`.", "",
            "| 1 | 2 | 3 | 4 |", "|---|---|---|---|"]
    for i in range(0, len(thumbs), 4):
        part = thumbs[i:i + 4]
        rows.append("| " + " | ".join(f"![{n}]({th}) **{n}.png** · {w}×{h} · {s / 1_000_000:.1f} MB"
                                      for n, th, (w, h), s in part) + " |")
    small, crop = cover_previews(img_dir / "01_cover.png", tmp)
    rows += ["", "## The cover as buyers see it first (generated)", "",
             "Left: 300 px wide, about the size of a search result. Right: the centred 4:3 crop (2000 × 1500), in case "
             "Etsy shows the thumbnail cropped (not verified; the listing editor lets you adjust the thumbnail). The "
             "theme name and \"Wedding website · Online RSVP\" must stay readable in both.", "",
             "| 300 px | 4:3 centre crop |", "|---|---|",
             f"| ![cover 300 px]({small}) | ![cover 4:3]({crop}) |"]
    v = t.package / "listing" / "video.mp4"
    if v.exists():
        f = video_facts(v)
        frames = _video_frames(v, tmp)
        prob = video_problems(f)
        rows += ["", "## Video (generated)", "",
                 "| Field | Value |", "|---|---|",
                 f"| File | `package/listing/video.mp4` |",
                 f"| Length | {f['duration_s']} s |",
                 f"| Size | {f['size_mb']} MB |",
                 f"| Frame | {f['width']} × {f['height']} px, {f['fps']} fps, {f['codec']} |",
                 f"| Sound | {'yes' if f['audio'] else 'none'} |",
                 f"| Etsy rules used | {ETSY['video_min_s']:g}–{ETSY['video_max_s']:g} s, ≤ {ETSY['video_max_mb']} MB, "
                 f"≥ {ETSY['video_min_px']} px — {ETSY['checked']} |",
                 f"| Check | {'passes the rules above' if not prob else '; '.join(prob)} |", "",
                 "| Start | Middle | End |", "|---|---|---|",
                 "| " + " | ".join(f"![frame]({p})" for p in frames) + " |"]
    return "\n".join(rows) + "\n"


GUIDE_CSS = """
/* START HERE (G059 review): every picture stays with its step and has a visible caption; tables and short lists do
   not split across pages; page 1 opens with a cover in the theme's own painted parts (layout only, K21). */
figure { margin: .5em 0 1em; break-inside: avoid; page-break-inside: avoid; }
/* 93.5 % of the text width: each of the two screens of a guide picture is then 42.5 % of it (≈ 3 in on Letter) */
figure img { margin: 0 auto; width: 93.5%; }
figcaption { text-align: center; font-size: .9em; font-style: italic; color: var(--ink); margin-top: .35em; }
.keep { break-inside: avoid; page-break-inside: avoid; }
table, ul, ol { break-inside: avoid; page-break-inside: avoid; }
img.qr { width: 1.75in; margin: .4em auto .2em; }
.cover { position: relative; overflow: hidden; border-radius: 10px; margin: 0 0 1em; padding: .4in .45in .4in .5in;
  background-color: var(--cover-bg); background-image: var(--cover-tile); background-size: 3.2in;
  border: 1px solid var(--gold-light); display: flex; align-items: center; gap: .3in; min-height: 4.1in;
  break-inside: avoid; page-break-inside: avoid; }
.cover .c-tl, .cover .c-br { position: absolute; pointer-events: none; }
.cover .c-tl { top: -.1in; left: -.1in; width: 1.7in; }
.cover .c-br { bottom: -.1in; right: -.1in; width: 1.4in; }
.cover .c-text { position: relative; z-index: 1; flex: 1; padding-top: .6in; }
.cover .c-eyebrow { font-family: var(--body-font); font-weight: 600; font-size: 9pt; letter-spacing: .24em;
  text-transform: uppercase; color: var(--head); margin: 0 0 .6em; }
.cover h1 { text-align: left; margin: 0; font-size: 36pt; line-height: 1.05; }
.cover h1::after { display: none; }
.cover .c-line2 { font-family: var(--heading-font); font-size: 15pt; line-height: 1.25; color: var(--head); margin: .3em 0 0;
  white-space: nowrap; text-align: left; }
.cover .c-name { font-family: "Great Vibes", "Snell Roundhand", cursive; font-size: 38pt; line-height: 1.2; color: var(--head);
  margin: .3em 0 0; white-space: nowrap; }
.cover .c-screen { position: relative; z-index: 1; width: 1.65in; border-radius: .14in; border: 1px solid var(--gold-light);
  box-shadow: 0 6px 18px rgba(40, 30, 20, .18); margin: 0; }
"""


def cover_assets(t: Theme, tmp: Path) -> dict[str, str]:
    """The guide cover's pictures, resized for print at their size on the page (the full-size paper tile alone is
    2.6 MB): corners 600/520 px PNG (transparent), envelope screen 560 px JPEG, paper tile 800 px JPEG."""
    out = {}
    for key, src, width, fmt in (("tl", REPO / t.corner_tl, 600, "png"), ("br", REPO / t.corner_br, 520, "png"),
                                 ("screen", t.package / "shots" / "g01_envelope.jpg", 560, "jpg"),
                                 ("tile", REPO / t.bg if t.bg else None, 800, "jpg")):
        if src is None:
            out[key] = ""
            continue
        im = Image.open(src).convert("RGBA" if fmt == "png" else "RGB")
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
        dst = tmp / f"cover_{key}.{fmt}"
        im.save(dst, **({"optimize": True} if fmt == "png" else {"quality": 82}))
        out[key] = dst.resolve().as_uri()
    return out


def guide_html(t: Theme, doc: str, fonts: dict, assets: dict[str, str] | None = None) -> str:
    """md_to_pdf's HTML of START_HERE.md → the guide's HTML: the # title becomes a cover ("Start Here" and "Your <name>
    Wedding Website" on two controlled lines, the theme name in script, the theme's own painted corners and its
    envelope screen), each picture becomes a figure with its alt text as a visible caption, and a ## heading is kept
    together with the picture right under it."""
    pal = palette(t)
    a = assets or {"tl": (REPO / t.corner_tl).resolve().as_uri(), "br": (REPO / t.corner_br).resolve().as_uri(),
                   "screen": (t.package / "shots" / "g01_envelope.jpg").resolve().as_uri(),
                   "tile": (REPO / t.bg).resolve().as_uri() if t.bg else ""}
    tile = f"url('{a['tile']}')" if a["tile"] else "none"
    cover = (
        '<section class="cover">'
        f'<img class="c-tl" src="{a["tl"]}" alt="">'
        f'<img class="c-br" src="{a["br"]}" alt="">'
        '<div class="c-text">'
        '<p class="c-eyebrow">Your guide</p>'
        '<h1>Start Here</h1>'
        f'<p class="c-line2">Your {html.escape(t.name)} Wedding Website</p>'
        f'<p class="c-name">{html.escape(t.name)}</p>'
        '</div>'
        f'<img class="c-screen" src="{a["screen"]}" alt="">'
        '</section>')
    doc, n = re.subn(r"<h1[^>]*>.*?</h1>", lambda m: cover, doc, count=1, flags=re.S)
    if not n:
        raise RuntimeError("START_HERE.md has no # title")

    def figure(m):
        src, alt = m.group(1), m.group(2)
        if "start_qr" in src:  # the code itself at 1.75 in (start_qr_page.png is the same code on a 4× wide strip)
            return f'<p><img class="qr" src="{src.replace("start_qr_page.png", "start_qr.png")}" alt="{alt}"></p>'
        return f'<figure><img src="{src}" alt="{alt}"><figcaption>{alt}</figcaption></figure>'

    doc = re.sub(r'<p>\s*<img src="([^"]+)" alt="([^"]*)">\s*</p>', figure, doc)
    # (one heading only: a lazy .*? would run on to a later heading that has a picture and glue whole sections)
    doc = re.sub(r"(<h2[^>]*>(?:(?!</h2>).)*</h2>)\s*(<figure>.*?</figure>)", r'<div class="keep">\1\2</div>', doc, flags=re.S)
    root = (f":root {{ --cover-bg: {pal.get('mist_top', '#F6F1EA')}; --cover-tile: {tile}; "
            f"--heading-font: \"{fonts['heading']}\", Georgia, serif; --body-font: \"{fonts['body']}\", Arial, sans-serif; }}")
    return doc.replace("</head>", f"<style>{root}\n{GUIDE_CSS}</style>\n</head>", 1)


def guide_pdf(t: Theme, md: Path, out: Path, fonts: bool = True) -> Path:
    import md_to_pdf as m2p
    pal = m2p.palet_oku(t.collection / "palette.json")
    with tempfile.TemporaryDirectory(prefix="guide_pdf_") as tmp:
        tmp = Path(tmp)
        families = {**m2p.VARSAYILAN_FONTLAR, **(pal.get("fonts") or {})}
        names = sorted({families["heading"], families["body"], "Great Vibes"})
        css = m2p.google_fonts_css(names, tmp / "fonts") if fonts else ""
        doc, families = m2p.html_belge(md.read_text(encoding="utf-8"), md.parent, pal, "letter", css)
        page = tmp / "guide.html"
        page.write_text(guide_html(t, doc, families, cover_assets(t, tmp)), encoding="utf-8")
        out.parent.mkdir(parents=True, exist_ok=True)
        m2p.playwright_calistir({"url": page.as_uri(), "out": str(out.resolve()), "mode": "pdf", "format": "Letter",
                                 "margin": m2p.kenar("letter"), "footer": m2p.altbilgi(pal, families),
                                 "fonts": names if css else []}, tmp)
    return out


def step_guide(t: Theme, fonts: bool = True) -> Path:
    return guide_pdf(t, t.package / "customer" / "START_HERE.md", t.package / "customer" / "START_HERE.pdf", fonts)


def step_pdf(t: Theme, fonts: bool = True) -> list[Path]:
    import md_to_pdf as m2p
    pal_path = t.collection / "palette.json"
    listing_md = t.package / "listing" / LISTING_MD
    with tempfile.TemporaryDirectory(prefix="listing_pdf_") as tmp:
        tmp = Path(tmp)
        text = listing_md.read_text(encoding="utf-8")
        marker = "<!-- listing-kit:media -->"
        if marker not in text:
            raise RuntimeError(f"{listing_md} has no '{marker}' line")
        doc = tmp / "listing.md"
        doc.write_text(text.replace(marker, media_markdown(t, tmp)), encoding="utf-8")
        listing_pdf = m2p.donustur(doc, t.package / "listing" / f"listing_{t.id}.pdf", pal_path, "letter", fonts)
    return [listing_pdf]


def pdf_uris(pdf: Path) -> set[str] | None:
    """Link targets (/URI) in a PDF; None when pypdf is not installed (the link cannot be checked then)."""
    try:
        from pypdf import PdfReader
    except ImportError:  # pragma: no cover
        return None
    uris = set()
    for page in PdfReader(str(pdf)).pages:
        for a in page.get("/Annots") or []:
            a = a.get_object()
            act = a.get("/A")
            if act and act.get("/URI"):
                uris.add(str(act["/URI"]))
    return uris


def pdf_text(pdf: Path) -> str | None:
    try:
        from pypdf import PdfReader
    except ImportError:  # pragma: no cover
        return None
    return "\n".join(page.extract_text() or "" for page in PdfReader(str(pdf)).pages)


# An open marker: [VERIFY …] or a commercial placeholder in capitals, e.g. [SHOP NAME], [PRICE], [AUTO RENEW: yes/no].
# (Markdown links [text](url) and task boxes [ ] / [x] do not match.)
OPEN_MARKER = re.compile(r"\[(?:VERIFY\b[^\]]*|[A-Z][A-Z0-9 _/-]*[A-Z0-9](?::[^\]]*)?)\]")


def open_markers(text: str) -> list[str]:
    """Distinct open markers, [VERIFY …] first (they need a test, the others a decision)."""
    found = {" ".join(m.group(0).split()) for m in OPEN_MARKER.finditer(text)}
    return sorted(found, key=lambda x: (not x.startswith("[VERIFY"), x))


def fetch(url: str, timeout: int = 20) -> tuple[int, str]:
    """GET through the environment's proxy settings (urllib). (status, text); status 0 = could not connect."""
    import urllib.error
    import urllib.request
    req = urllib.request.Request(url, headers={"User-Agent": "listing-kit-check/1 (+G059)"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, r.read(400_000).decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, ""
    except Exception as e:  # noqa: BLE001
        return 0, f"{type(e).__name__}: {e}"


def prepublish_problems(t: Theme, base: str, get=fetch) -> list[str]:
    """What must be true before the listing goes up (docs/05 §D): the start link and the demo answer 200 on the live
    site and name the theme, and no [VERIFY …] or commercial placeholder is left in the texts or the PDFs. (The listing
    images carry no QR since the editorial set, docs/21: Etsy's Off-Platform policy, docs/15 §4.1.)"""
    p: list[str] = []
    for label, url in (("start link", start_url(t, base)), ("demo", demo_url(t, base))):
        status, body = get(url)
        if status != 200:
            p.append(f"live {label} {url}: {'could not connect (' + body[:120] + ')' if status == 0 else status}")
        elif t.name not in body and html.escape(t.name) not in body:
            p.append(f"live {label} {url}: 200 but the page does not name {t.name}")
    for f in (t.package / "listing" / LISTING_MD, t.package / "customer" / "START_HERE.md"):
        left = open_markers(f.read_text(encoding="utf-8"))
        if left:
            p.append(f"{f.relative_to(t.package)}: {len(left)} still open: {', '.join(left[:8])}{' …' if len(left) > 8 else ''}")
    for f in (t.package / "customer" / "START_HERE.pdf", t.package / "listing" / f"listing_{t.id}.pdf"):
        text = pdf_text(f) if f.exists() else ""
        if text is None:
            p.append(f"{f.name}: cannot read the PDF text (pypdf not installed)")
        elif open_markers(" ".join(text.split())):  # PDF text breaks lines inside a marker: join them first
            left = open_markers(" ".join(text.split()))
            p.append(f"{f.name}: {len(left)} still open: {', '.join(left[:8])}{' …' if len(left) > 8 else ''} "
                     "(fill them in the .md, then rebuild with the pdf step)")
    return p


def host_warnings(base: str) -> list[str]:
    from urllib.parse import urlparse
    host = urlparse(base).hostname or ""
    if host.endswith(".vercel.app"):
        return [f"start links and QR codes use {host}, a temporary Vercel address: choose the final domain "
                "(or commit to a permanent redirect from this one) before the first sale; buyers print these QR codes "
                "(docs/05 §C)"]
    return []


def step_check(t: Theme, base: str, prepublish: bool = False) -> list[str]:
    """Returns problems (empty = all good) and prints a short report; warnings are printed, not counted."""
    p: list[str] = []
    pk = t.package
    md = (pk / "listing" / LISTING_MD).read_text(encoding="utf-8")
    f = listing_fields(md)
    p += [f"title: {x}" for x in title_problems(f["title"])]
    p += [f"tags: {x}" for x in tag_problems(f["tags"])]
    if re.search(r"\b(TBD|lorem)\b", md, re.I):
        p.append(f"{LISTING_MD}: TBD/lorem left")
    imgs = sorted((pk / "listing" / UPLOAD_DIR).glob("*.png"))
    if len(imgs) < 7:
        p.append(f"{len(imgs)} listing images (need ≥ 7)")
    for name in UPLOAD_IMAGES:
        if not (pk / "listing" / UPLOAD_DIR / f"{name}.png").exists():
            p.append(f"no listing/{UPLOAD_DIR}/{name}.png")
    for name in UPLOAD_SCENES:  # a green edge left by the mockup screen reads as a defect
        scene_img = pk / "listing" / UPLOAD_DIR / f"{name}.png"
        if scene_img.exists() and screen_green(Image.open(scene_img)):
            p.append(f"{name}.png: green pixels left from the mockup screen")
    if len(imgs) > ETSY["photos_max"]:
        p.append(f"{len(imgs)} listing images (Etsy max {ETSY['photos_max']})")
    for i in imgs:
        if Image.open(i).size != (2000, 2000):
            p.append(f"{i.name}: {Image.open(i).size} (want 2000×2000)")
    v = pk / "listing" / "video.mp4"
    if not v.exists():
        p.append("no listing/video.mp4")
    else:
        p += [f"video: {x}" for x in video_problems(video_facts(v))]
    qr = pk / "customer" / "img" / "start_qr.png"
    if not qr.exists() or not qr_matches(qr, start_url(t, base)):
        p.append(f"start_qr.png does not encode {start_url(t, base)}")
    page_qr = pk / "customer" / "img" / "start_qr_page.png"
    if not page_qr.exists() or not np.array_equal(
            np.asarray(Image.open(page_qr).convert("RGB"))[:, Image.open(qr).width * 3 // 2:Image.open(qr).width * 5 // 2],
            np.asarray(Image.open(qr).convert("RGB"))):
        p.append("start_qr_page.png is not the start QR")
    guide = (pk / "customer" / "START_HERE.md").read_text(encoding="utf-8")
    if start_url(t, base) not in guide:
        p.append("START_HERE.md does not contain the start link")
    gpdf = pk / "customer" / "START_HERE.pdf"
    if not gpdf.exists():
        p.append("no START_HERE.pdf")
    else:
        p += [f"START_HERE.pdf: {x}" for x in pdf_link_problems(gpdf, start_url(t, base))]
        mb = gpdf.stat().st_size / 1_000_000
        if mb > ETSY["digital_file_max_mb"]:
            p.append(f"START_HERE.pdf is {mb:.1f} MB (Etsy digital file max {ETSY['digital_file_max_mb']} MB)")
    if not (pk / "listing" / f"listing_{t.id}.pdf").exists():
        p.append(f"no listing_{t.id}.pdf")
    if prepublish:
        p += [f"prepublish: {x}" for x in prepublish_problems(t, base)]
    print(f"[{t.id}] title {len(f['title'] or '')} chars · {len(f['tags'])} tags · {len(imgs)} images · "
          f"{'video ok' if v.exists() else 'no video'} · {len(p)} problem(s){' (prepublish)' if prepublish else ''}")
    for x in p:
        print(f"  - {x}")
    for x in host_warnings(base):
        print(f"  ! warning: {x}")
    return p


def pdf_link_problems(pdf: Path, url: str) -> list[str]:
    """The PDF must hold a clickable link to `url` (a PDF without any link fails too)."""
    uris = pdf_uris(pdf)
    if uris is None:
        return ["cannot check its links (pypdf not installed)"]
    if url not in uris:
        return [f"no clickable {url} (links: {sorted(uris)[:4] or 'none'})"]
    return []


STEPS = ["capture", "qr", "strips", "images", "video", "pdf", "guide", "check"]


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="Etsy listing kit + START HERE guide for platform themes (G059).")
    ap.add_argument("step", choices=STEPS + ["all"])
    ap.add_argument("--theme", required=True, help=f"theme id or 'all' ({', '.join(THEMES)})")
    ap.add_argument("--base-url", default=BASE_URL, help="public base URL of the platform (default: %(default)s)")
    ap.add_argument("--no-fonts", action="store_true", help="do not download Google Fonts (system fonts)")
    ap.add_argument("--shots-root", type=Path, default=None,
                    help="video: read <root>/<NN_folder>/ (opening.webm + opening.json) instead of package/shots/ "
                         "(the folder tools/listing_editorial.py --capture writes)")
    ap.add_argument("--prepublish", action="store_true",
                    help="check: also the live start link and demo, image 8's demo QR and no open [VERIFY]/[PLACEHOLDER] "
                         "markers (must pass before the listing goes up)")
    a = ap.parse_args(argv)
    check_url(a.base_url)
    themes = list(THEMES.values()) if a.theme == "all" else [theme_of(a.theme)]
    steps = ["qr", "images", "video", "pdf", "check"] if a.step == "all" else [a.step]
    bad = 0
    for t in themes:
        for s in steps:
            print(f"== {t.id}: {s}")
            if s == "capture":
                step_capture(t, a.base_url)
            elif s == "qr":
                for x in step_qr(t, a.base_url):
                    print(f"  {x.relative_to(REPO)}")
            elif s == "strips":
                for x in step_strips(t):
                    print(f"  {x.relative_to(REPO)}")
            elif s == "images":
                for x in step_images(t, not a.no_fonts):
                    print(f"  {x.relative_to(REPO)}  {x.stat().st_size / 1_000_000:.1f} MB")
            elif s == "video":
                x = step_video(t, not a.no_fonts, shots_dir(t, a.shots_root))
                print(f"  {x.relative_to(REPO)}  {video_facts(x)}")
            elif s == "pdf":
                for x in step_pdf(t, not a.no_fonts):
                    print(f"  {x.relative_to(REPO)}  {x.stat().st_size / 1_000_000:.2f} MB")
            elif s == "guide":
                x = step_guide(t, not a.no_fonts)
                print(f"  {x.relative_to(REPO)}  {x.stat().st_size / 1_000_000:.2f} MB")
            elif s == "check":
                bad += len(step_check(t, a.base_url, a.prepublish))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
