"""Etsy listing images of the K42 service listings (G136): 2000 × 2000 PNG, the editorial set's visual language (K21).

  python3 tools/listing_services.py --capture                 # capture the real screens first, then build all
  python3 tools/listing_services.py [--only setup-service] [--shots-root DIR]

Pictures come only from: the shop-wide GPT trust scenes (brand/trust/, GM06: t1 three phones, t3 the couple, t6 the
designer's desk), real screens of the platform captured from a local production build (`cd platform && npm ci &&
npm run build` first; nothing is deployed) and the BKE Studio logo (brand/svg/, G129). Nothing is drawn here: the type,
hairlines, washes and bare screens of tools/listing_editorial/templates/editorial.css on the brand palette
(brand/tokens.json), Cormorant Garamond + Montserrat like the design listings.

  --capture   tools/listing_templates/capture.ts for olive-ivory (the editor and guest screens: the setup service shows
              what we fill in, the custom design shows the pages every design has) and
              tools/listing_editorial/capture_opening.ts for the openings of seven ready designs (closed, at 0 ms).
  --shots-root  where the screens are (default $BKE_LISTING_SHOTS or <temp>/bke-listing-shots), kept out of the repo.

Honesty rules of these images: no price (the listing shows it), no QR and no web address; a ready design shown as an
example says so ("from our ready designs", "shown: Olive & Ivory"); only what the listing promises.

Writes collections/_services/<id>/package/listing/images_editorial/<name>.png (the files listing_v3 §5 names).
"""
from __future__ import annotations

import argparse
import os
import subprocess
import sys
import tempfile
from html import escape
from pathlib import Path

from PIL import Image

TOOLS = Path(__file__).resolve().parent
sys.path.insert(0, str(TOOLS))
sys.path.insert(0, str(TOOLS / "listing_v2"))
import listing_editorial as le  # noqa: E402  (place, render, node_env)
import listing_kit as lk  # noqa: E402  (step_capture)
import kompozit as kz  # noqa: E402

REPO = TOOLS.parent
TRUST = REPO / "brand" / "trust"
BRAND_MARK = REPO / "brand" / "svg" / "bke-logo-horizontal-anchor.svg"
SERVICES = REPO / "collections" / "_services"
DEFAULT_SHOTS_ROOT = Path(os.environ.get("BKE_LISTING_SHOTS") or Path(tempfile.gettempdir()) / "bke-listing-shots")
EDITOR_THEME = "olive-ivory"  # the screens of the editor and the guest pages
# ready designs whose closed opening is shown (capture_opening.ts at 0 ms): theme id → what guests tap
OPENINGS = {"lavender-provence": "pouch", "art-deco-black-tie": "gatefold", "coastal-seaside": "envelope",
            "blush-garden-rose": "envelope", "ivory-lace-pearls": "gatefold", "enchanted-forest-storybook": "book",
            "tropical-destination": "travel wallet"}
# brand/tokens.json: anchor, accent, paper_light, paper; --deep a quieter anchor for the small caps
ROOT_CSS = (":root{--ink:#2B1526;--deep:#6B4E66;--gold:#D0AE6A;--ivory:#FAF7F0;--paper:#F8F4EC;--mist:#EDE5D7;"
            "--paper-img:none;--shade:#2B1526;--gold-ink:color-mix(in srgb,#D0AE6A 62%,#2B1526);}")
IMAGES = {
    "setup-service": ["01_cover", "02_steps", "03_what_we_enter", "04_not_included"],
    "custom-design": ["01_cover", "02_steps", "03_included", "04_examples"],
    "extra-revision": ["01_cover", "02_how", "03_one_round", "04_good_to_know"],
}


# ----------------------------------------------------------------------------- capture

def capture(root: Path) -> None:
    lk.step_capture(lk.THEMES[EDITOR_THEME], lk.BASE_URL, root / EDITOR_THEME)
    for theme in OPENINGS:
        out = root / "openings" / theme
        r = subprocess.run(["node", str(le.CAPTURE_OPENING), "--theme", theme, "--out", str(out), "--at", "0"],
                           cwd=REPO, env=le.node_env())
        if r.returncode != 0:
            raise RuntimeError(f"capture_opening failed for {theme}")


class Shots:
    def __init__(self, root: Path):
        self.root = root

    def editor(self, name: str) -> Path:
        p = self.root / EDITOR_THEME / f"{name}.jpg"
        if not p.exists():
            raise FileNotFoundError(f"{p} (run with --capture)")
        return p

    def opening(self, theme: str) -> Path:
        p = self.root / "openings" / theme / "o01.jpg"
        if not p.exists():
            raise FileNotFoundError(f"{p} (run with --capture)")
        return p


# ----------------------------------------------------------------------------- HTML pieces

def brand(top: int = 1890) -> str:
    return (f'<img class="brand" src="{BRAND_MARK.resolve().as_uri()}" '
            f'style="left:50%;transform:translateX(-50%);top:{top}px">')


def screens(items: list[tuple[Path, str]], w: int, gap: int, top: int, stagger: int = 0, label_gap: int = 44,
            left: int | None = None, max_h: int | None = None) -> str:
    """Bare screens on paper in a row (editorial.css .screen/.label): items = (jpg, label). Heights follow the
    screens, cut at max_h (the top of the page stays, as a phone shows it)."""
    n = len(items)
    x0 = (2000 - (n * w + (n - 1) * gap)) // 2 if left is None else left
    out = []
    for i, (path, label) in enumerate(items):
        im = Image.open(path)
        h = round(w * im.height / im.width)
        if max_h:
            h = min(h, max_h)
        y = top + (stagger if i % 2 == 0 else 0)
        x = x0 + i * (w + gap)
        out.append(f'<div class="screen" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px">'
                   f'<img src="{path.resolve().as_uri()}"></div>')
        if label:
            out.append(f'<div class="label" style="left:{x - 50}px;width:{w + 100}px;top:{y + h + label_gap}px">'
                       f'<div class="kicker">{label}</div></div>')
    return "\n".join(out)


def steps_column(steps: list[tuple[str, str, str]], left: int, top: int, width: int, title_px: int = 60) -> str:
    """Numbered steps with hairlines between them (editorial.css .list)."""
    rows = "".join(f'<li style="display:flex;gap:34px;align-items:baseline"><span class="num" style="font-size:'
                   f'{title_px}px;min-width:70px">{num}</span><div><div style="font-size:{title_px}px;line-height:1.1">'
                   f'{title}</div><small style="font-size:29px;margin-top:10px">{note}</small></div></li>'
                   for num, title, note in steps)
    return f'<ul class="list abs" style="left:{left}px;top:{top}px;width:{width}px">{rows}</ul>'


def steps_row(steps: list[tuple[str, str, str]], top: int, col_w: int = 420, gap: int = 40, title_px: int = 60,
              note_px: int = 30) -> str:
    """Steps side by side, centred: numeral, title, note."""
    n = len(steps)
    x0 = (2000 - (n * col_w + (n - 1) * gap)) // 2
    return "\n".join(
        f'<div class="abs center" style="left:{x0 + i * (col_w + gap)}px;top:{top}px;width:{col_w}px">'
        f'<div class="num" style="font-size:64px;line-height:1">{num}</div>'
        f'<div class="display" style="font-size:{title_px}px;line-height:1.08;margin-top:10px">{title}</div>'
        f'<div class="note" style="margin-top:16px;font-size:{note_px}px">{note}</div></div>'
        for i, (num, title, note) in enumerate(steps))


def headline(kicker: str, title: str, top: int, lede: str = "", size: int = 124, left: int | None = None,
             width: int | None = None) -> str:
    pos = (f"left:{left}px;width:{width}px" if left is not None else "left:0;right:0")
    cls = "abs" if left is not None else "abs center"
    lede_html = f'<div class="lede" style="margin-top:26px">{lede}</div>' if lede else ""
    return (f'<div class="{cls}" style="{pos};top:{top}px"><div class="kicker">{kicker}</div>'
            f'<div class="display" style="font-size:{size}px;margin-top:28px">{title}</div>{lede_html}</div>')


def paper() -> str:
    return '<div class="paper"></div>'


# ----------------------------------------------------------------------------- the images

def scene_bg(tmp: Path, name: str, scene: str, k: float, x0: float, y0: float, shots: list[Path]) -> tuple[str, list]:
    """A GM06 scene on the canvas with real screens in its green screens (listing_editorial.place)."""
    out = tmp / f"{name}_bg.png"
    regions = le.place(Image.open(TRUST / scene), k, x0, y0, [Image.open(p) for p in shots], out)
    return f'<div class="bg" style="background-image:url({out.resolve().as_uri()})"></div>', regions


def setup_service(s: Shots, tmp: Path) -> dict[str, str]:
    pages = {}
    # 1 — the couple looking at their finished website (GM06 t3), the words on a paper wash below
    bg, _ = scene_bg(tmp, "setup_cover", "t3_couple_editing.png", 1.3, -60, -120, [s.editor("g02_home_top")])
    pages["01_cover"] = (
        bg + '<div class="veil-bottom firm" style="--h:900px"></div>'
        + headline("Wedding website setup service", "We set it up <em>for you</em>", 1330,
                   "Send us your details, we do the rest", size=128) + brand())
    # 2 — four steps, and what the couple opens at the end: the editor's preview
    pages["02_steps"] = (
        paper() + headline("How it works", "Four <em>easy</em> steps", 150, size=120, left=130, width=1100)
        + steps_column([("i.", "Buy it with your design", "Together with your design, or after it"),
                        ("ii.", "Send us your details", "In an Etsy message; photos as a share link"),
                        ("iii.", "We set up your website", "Within 3 days of receiving everything"),
                        ("iv.", "You check and publish", "Your private edit link: change anything, then Publish")],
                       130, 560, 1040, title_px=58)
        + screens([(s.editor("b09_panel_preview"), "You check every page")], 600, 0, 330, left=1270, max_h=1300)
        + brand())
    # 3 — what we enter: real editor screens
    pages["03_what_we_enter"] = (
        paper() + headline("One round, done for you", "What we <em>enter</em> for you", 140, size=116)
        + screens([(s.editor("e02_day_place"), "Date &amp; venue"), (s.editor("b06_panel_crop"), "Up to 5 photos"),
                   (s.editor("p03_panel_questions"), "RSVP questions"),
                   (s.editor("e03_copy_labels"), "Headings &amp; wording")], 380, 46, 480, stagger=60, max_h=820)
        + '<div class="abs center note" style="left:200px;right:200px;top:1610px;font-size:31px">Your names, date '
          'and venue &nbsp;·&nbsp; the order of the day and your story &nbsp;·&nbsp; questions &amp; answers, dress '
          'code, travel and registry links &nbsp;·&nbsp; we enter the words you send us</div>' + brand())
    # 4 — good to know, next to the editor the couple keeps
    pages["04_not_included"] = (
        paper() + headline("Good to know", "One round, <em>then it's yours</em>", 150, size=112, left=130, width=1150)
        + '<ul class="list abs" style="left:130px;top:700px;width:1020px">'
          '<li>One round of setup<small>One purchase = one round for one website</small></li>'
          '<li>Change everything yourself afterwards<small>As often as you like, in your own editor</small></li>'
          '<li>The design stays as designed<small>Artwork, colors and fonts; your own look: our custom design</small></li>'
          '<li>You decide when to publish<small>Your website stays a private draft until you tap Publish</small></li>'
          '</ul>'
        + screens([(s.editor("e01_edit_pages"), "Your editor, any time")], 560, 0, 420, left=1300, max_h=1240)
        + brand())
    return pages


def custom_design(s: Shots, tmp: Path) -> dict[str, str]:
    pages = {}
    # 1 — three phones (GM06 t1) with three of our openings: different objects and palettes
    bg, placed = scene_bg(tmp, "custom_cover", "t1_three_steps.png", 1.0, 0, 90,
                          [s.opening(t) for t in ("lavender-provence", "art-deco-black-tie", "coastal-seaside")])
    bottom = max(r["kutu"][3] for r in placed)
    pages["01_cover"] = (
        bg + f'<div class="veil-top" style="--h:{min(r["kutu"][1] for r in placed) + 40}px"></div>'
        + f'<div class="veil-bottom firm" style="--h:{2000 - bottom + 110}px"></div>'
        + headline("Custom wedding website", "Designed <em>just for you</em>", 120, size=132)
        + f'<div class="abs center" style="left:0;right:0;top:{bottom + 60}px"><div class="lede">Your own opening, '
          'artwork, colors and type</div><div class="note" style="margin-top:14px">Shown: openings from our ready '
          'designs</div></div>' + brand())
    # 2 — the designer's desk (GM06 t6) and four steps
    desk = tmp / "custom_desk.png"
    bgimg, _ = kz.yerlestir(Image.open(TRUST / "t6_atelier_flatlay.png"), 2000 / 3000, 0, 0, sis_gucu=0.45)
    bgimg.crop((0, 120, 2000, 900)).save(desk)
    pages["02_steps"] = (
        paper() + headline("How it works", "Made <em>with you</em>", 110, size=112)
        + f'<div class="abs" style="left:0;top:420px;width:2000px;height:780px;background:url({desk.resolve().as_uri()}) '
          'center/cover"></div>'
        + steps_row([("i.", "Tell us your idea", "The feel, colors you love and pictures that inspire you"),
                     ("ii.", "See the first version", "Within 3 days of receiving your answers"),
                     ("iii.", "Ask for changes", "2 rounds of changes included"),
                     ("iv.", "Fill in &amp; publish", "Your names, date and photos, in your own editor")], 1280)
        + brand())
    # 3 — what is included, with the pages every design has (shown: Olive & Ivory)
    pages["03_included"] = (
        paper() + headline("What's included", "Your own <em>website</em>", 150, size=116, left=130, width=1000)
        + '<ul class="list abs" style="left:130px;top:520px;width:940px">'
          '<li>A design made just for you<small>Opening, artwork, colors and fonts; yours alone</small></li>'
          '<li>Your private online editor<small>Names, date, photos and every text, any time</small></li>'
          '<li>Every page<small>Home, Our Story, Details and RSVP</small></li>'
          '<li>Online RSVP and a QR code<small>Download your guest list; the QR code for printed cards</small></li>'
          '<li>Online until 12 months<small>after your wedding date</small></li>'
          '</ul>'
        + screens([(s.editor("g02_home_top"), ""), (s.editor("g09_rsvp_top"), "")], 380, 40, 400, stagger=140,
                  left=1140, max_h=822)
        + '<div class="abs center note" style="left:1140px;width:800px;top:1500px">Shown: our Olive &amp; Ivory '
          'design.<br>Yours is made new, just for you.</div>' + brand())
    # 4 — four openings of our ready designs
    four = [("blush-garden-rose", "An envelope"), ("ivory-lace-pearls", "A gatefold"),
            ("enchanted-forest-storybook", "A book"), ("tropical-destination", "A travel wallet")]
    pages["04_examples"] = (
        paper() + headline("For example", "Openings <em>we have made</em>", 150, size=116)
        + screens([(s.opening(t), label) for t, label in four], 380, 46, 470, stagger=60, max_h=822)
        + '<div class="abs center note" style="left:0;right:0;top:1690px">From our ready designs. Your custom '
          'design gets an opening of its own.</div>' + brand())
    return pages


def extra_revision(s: Shots, tmp: Path) -> dict[str, str]:
    pages = {}
    # 1 — the designer's desk (GM06 t6), the words on its calm top
    bg, _ = scene_bg(tmp, "extra_cover", "t6_atelier_flatlay.png", 0.8, -260, 420, [])
    pages["01_cover"] = (
        bg + '<div class="veil-top" style="--h:1000px"></div>'
        + headline("Extra design revision", "One more <em>round of changes</em>", 150,
                   "For our custom design orders &nbsp;·&nbsp; ready within 3 days", size=124) + brand())
    # 2 — how it works
    pages["02_how"] = (
        paper() + headline("How it works", "Three <em>simple</em> steps", 330, size=124)
        + '<div class="rule abs" style="left:240px;right:240px;top:760px"></div>'
        + steps_row([("i.", "Buy this listing", "After the 2 rounds your custom design includes"),
                     ("ii.", "Send your changes", "All of them together, in one Etsy message"),
                     ("iii.", "Get your design", "Updated within 3 days of receiving your changes")], 870, col_w=560,
                    gap=30, title_px=74, note_px=33)
        + '<div class="rule abs" style="left:240px;right:240px;top:1330px"></div>'
        + '<div class="abs center lede" style="left:0;right:0;top:1420px">One purchase = one round of changes</div>'
        + brand())
    # 3 — what one round covers, and what stays free in the editor
    pages["03_one_round"] = (
        paper() + headline("One round of changes", "What a round <em>covers</em>", 150, size=112, left=130,
                           width=1150)
        + '<ul class="list abs" style="left:130px;top:560px;width:1000px">'
          '<li>The opening<small>What your guests tap first</small></li>'
          '<li>The artwork<small>Scenes, flowers and details</small></li>'
          '<li>The colors and fonts<small>All changes for one round in one message</small></li>'
          '</ul>'
          '<div class="abs" style="left:130px;top:1290px;width:1000px"><div class="kicker">Always free</div>'
          '<div class="body" style="margin-top:20px">Your names, dates, photos and texts: you change those yourself '
          'in your editor, at any time.</div></div>'
        + screens([(s.editor("e01_edit_pages"), "Your editor")], 560, 0, 420, left=1300, max_h=1240) + brand())
    # 4 — good to know
    pages["04_good_to_know"] = (
        paper() + headline("Good to know", "For our <em>custom design</em> orders", 200, size=112)
        + '<ul class="list abs center" style="left:360px;width:1280px;top:600px">'
          '<li>One purchase = one round<small>Buy it again for another round</small></li>'
          '<li>Only for custom design orders<small>No custom design yet? Please message us before you buy</small></li>'
          '<li>Your design stays yours alone<small>We never sell it to anyone else</small></li>'
          '<li>Not what you asked for? We fix it<small>Message us on Etsy, we reply within 24 hours</small></li>'
          '</ul>' + brand())
    return pages


BUILDERS = {"setup-service": setup_service, "custom-design": custom_design, "extra-revision": extra_revision}


def build(sid: str, s: Shots) -> list[Path]:
    out_dir = SERVICES / sid / "package" / "listing" / lk.UPLOAD_DIR
    out_dir.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="listing_services_") as tmp:
        tmp = Path(tmp)
        bodies = BUILDERS[sid](s, tmp)
        if list(bodies) != IMAGES[sid]:
            raise RuntimeError(f"{sid}: built {list(bodies)}, listing_v3 §5 wants {IMAGES[sid]}")
        pages = [("<!doctype html><html><head><meta charset='utf-8'><link rel='stylesheet' href='editorial.css'>"
                  f"<style>{ROOT_CSS}</style></head><body>{body}</body></html>", out_dir / f"{name}.png")
                 for name, body in bodies.items()]
        le.render(pages, tmp)
    outs = [p for _, p in pages]
    for o in outs:
        im = Image.open(o).convert("RGB")
        if im.size != (2000, 2000) or lk.screen_green(im):
            raise RuntimeError(f"{o}: {im.size}, green pixels {lk.screen_green(im)}")
        im.save(o, optimize=True)
    return outs


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--only", nargs="*", choices=list(BUILDERS))
    ap.add_argument("--shots-root", type=Path, default=DEFAULT_SHOTS_ROOT / "_services")
    ap.add_argument("--capture", action="store_true", help="capture the real screens first (local production build)")
    a = ap.parse_args()
    if a.capture:
        capture(a.shots_root)
    s = Shots(a.shots_root)
    for sid in a.only or BUILDERS:
        for o in build(sid, s):
            print(f"  {o.relative_to(REPO)}")


if __name__ == "__main__":
    main()
