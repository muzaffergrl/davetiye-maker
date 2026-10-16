"""Editorial Etsy listing images (v4): 8 × 2000 px, layout + typography only (K21).

  python3 tools/listing_editorial.py --theme olive-ivory [--only 01_cover 03_pages] [--opening <dir>]

Pictures come only from: the design's GPT mockup scenes (assets/gpt/mockups/, #00FF00 screens), the theme's GPT parts
(paper texture, divider), and real screens of the platform (package/shots/, captured by tools/listing_templates/capture.ts
and tools/listing_editorial/capture_opening.ts). Nothing is drawn here.

Design rules (docs/21_ILAN_GORSELLERI.md): no boxes, badges, pills or icons; Cormorant Garamond light + Montserrat small
caps; hairlines instead of frames; one idea per image; text never over a phone; the cover's text stays inside the 4:3
search-crop band (y 250–1750).

Writes collections/<NN>/package/listing/images_editorial/<name>.png (a new folder: the G059 kit in images/ stays).
"""
from __future__ import annotations

import argparse
import shutil
import sys
import tempfile
from pathlib import Path

from PIL import Image

TOOLS = Path(__file__).resolve().parent
sys.path.insert(0, str(TOOLS))
sys.path.insert(0, str(TOOLS / "listing_v2"))
import listing_kit as lk  # noqa: E402  (themes, palette, fill, screen crop)
import md_to_pdf as m2p  # noqa: E402  (fonts + Playwright)
import kompozit as kz  # noqa: E402  (scene scaling + screens into the green screens)

HERE = TOOLS / "listing_editorial"
TPL = HERE / "templates"
REPO = TOOLS.parent
BRAND_MARK = REPO / "brand" / "svg" / "bke-logo-horizontal-anchor.svg"
IMAGES = ["01_cover", "02_opening", "03_pages", "04_edit", "05_rsvp", "06_details", "07_how", "08_included"]
FONTS = {"Cormorant Garamond": "ital,wght@0,300;0,400;0,500;1,300;1,400;1,500", "Montserrat": "wght@400;500"}
# the opening in three phones: the closed envelope (g01_envelope), then two DPR 3 stills from capture_opening.ts chosen
# by eye per theme (each theme's opening has its own timing) and saved in package/shots/ as open_mid.jpg (flap open, the
# card inside) and open_card.jpg (the card risen above the envelope); opening_stills.json records which still and when
OPENING = ["g01_envelope", "open_mid", "open_card"]


def scene_file(t: lk.Theme, *names: str) -> Path:
    d = t.collection / "assets" / "gpt" / "mockups"
    for n in names:
        if (d / n).exists():
            return d / n
    raise FileNotFoundError(f"{t.folder}: none of {names} in {d}")


def shot(shots: Path, name: str) -> Image.Image:
    return Image.open(shots / f"{name}.jpg")


def place(scene: Image.Image, k: float, x0: float, y0: float, screens: list[Image.Image], out: Path) -> list[dict]:
    """Scene scaled k, its top-left at (x0, y0) on the 2000 px canvas (edges extended by kompozit), real screens in the
    green screens left to right. Returns the screens' boxes on the canvas."""
    bg, _ = kz.yerlestir(scene, k, x0, y0, sis_gucu=0.45)
    regions = kz.ekran_bolgeleri(bg)
    if len(regions) != len(screens):
        raise RuntimeError(f"{len(regions)} green screens after placing, {len(screens)} screens given")
    fitted = [lk._screen_for(s, r["oran"]) for s, r in zip(screens, regions)]
    bg, _ = kz.ekranlari_oturt(bg, fitted)
    left = lk.screen_green(bg)
    if left:
        raise RuntimeError(f"{left} green pixels left after placing the screens")
    bg.save(out)
    return regions


def paper_screens(items: list[tuple[str, str, str]], shots: Path, w: int, gap: int, top: int, stagger: int = 0,
                  label_gap: int = 46) -> str:
    """Bare screens on paper, centred in a row: items = (shot name, numeral or '', label). Heights follow the shots."""
    n = len(items)
    left = (2000 - (n * w + (n - 1) * gap)) // 2
    html = []
    for i, (name, num, label) in enumerate(items):
        im = shot(shots, name)
        h = round(w * im.height / im.width)
        y = top + (stagger if i % 2 == 0 else 0)
        x = left + i * (w + gap)
        uri = (shots / f"{name}.jpg").resolve().as_uri()
        html.append(f'<div class="screen" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px"><img src="{uri}"></div>')
        num_html = f'<span class="num">{num}</span>' if num else ""
        html.append(f'<div class="label" style="left:{x - 40}px;width:{w + 80}px;top:{y + h + label_gap}px">{num_html}'
                    f'<div class="kicker">{label}</div></div>')
    return "\n".join(html)


def cropped_screen(name: str, shots: Path, x: int, y: int, w: int, h: int) -> str:
    uri = (shots / f"{name}.jpg").resolve().as_uri()
    return f'<div class="screen" style="--r:36px;left:{x}px;top:{y}px;width:{w}px;height:{h}px"><img src="{uri}"></div>'


def root_css(t: lk.Theme) -> str:
    p = lk.palette(t)
    tile = t.collection / "assets" / "gpt" / "parts" / "bg_tile.png"
    paper_img = f"url('{tile.resolve().as_uri()}')" if tile.exists() else "none"
    return (f":root{{--ink:{p['ink']};--deep:{p['deep']};--gold:{p['gold']};--ivory:{p['ivory']};"
            f"--paper:{p['ivory']};--mist:{p['mist_top']};--paper-img:{paper_img};"
            # gold is a fill colour; as a text/rule colour it is mixed toward the ink so it reads on paper
            f"--gold-ink:color-mix(in srgb, {p['gold']} 70%, {p['ink']});}}")


def build(t: lk.Theme, only: list[str] | None) -> list[Path]:
    shots = t.package / "shots"
    missing = [n for n in OPENING if not (shots / f"{n}.jpg").exists()]
    if missing:
        raise RuntimeError(f"missing opening stills in {shots}: {missing} (run capture_opening.ts and save the chosen stills as open_mid.jpg / open_card.jpg)")
    out_dir = t.package / "listing" / "images_editorial"
    out_dir.mkdir(parents=True, exist_ok=True)
    parts = t.collection / "assets" / "gpt" / "parts"
    base = {"theme_name": t.name, "scene.brand": BRAND_MARK.resolve().as_uri(),
            "part.divider": (parts / "divider.png").resolve().as_uri(), "divider_w": "420"}
    pages = []
    with tempfile.TemporaryDirectory(prefix="listing_editorial_") as tmp:
        tmp = Path(tmp)
        for name in only or IMAGES:
            v = dict(base)
            bg = tmp / f"{name}_bg.png"
            if name == "01_cover":
                scene = Image.open(scene_file(t, "cover_hand_v2.png", "cover_hand.png"))
                r0 = kz.ekran_bolgeleri(scene)[0]
                k = 2000 / scene.width
                # names up to 16 characters on one line; longer ones on two lines ("Vintage Airmail / Love Letter")
                words = t.name.split()
                if len(t.name) <= 16:
                    title, size, screen_top = t.name, 170, 700
                else:
                    cut = min(range(1, len(words)), key=lambda i: abs(len(" ".join(words[:i])) - len(t.name) / 2))
                    title, size, screen_top = " ".join(words[:cut]) + "\n" + " ".join(words[cut:]), 140, 820
                place(scene, k, 0, screen_top - r0["kutu"][1] * k, [shot(shots, "g01_envelope")], bg)
                v.update({"scene.bg": bg.resolve().as_uri(), "veil_h": str(screen_top + 120), "text_top": "330",
                          "title": title, "title_px": str(size)})
            elif name == "02_opening":
                scene = Image.open(scene_file(t, "three_phones.png"))
                regs = kz.ekran_bolgeleri(scene)
                k = 1.62
                x0 = 1000 - (regs[0]["kutu"][0] + regs[-1]["kutu"][2]) / 2 * k
                y0 = 470 - min(r["kutu"][1] for r in regs) * k
                placed = place(scene, k, x0, y0, [shot(shots, n) for n in OPENING], bg)
                v.update({"scene.bg": bg.resolve().as_uri(), "veil_h": "640", "veil_b": "600",
                          "below_screens": str(max(r["kutu"][3] for r in placed) + 70)})
                for i, r in enumerate(placed, 1):
                    v[f"s{i}_cx"] = str(round((r["kutu"][0] + r["kutu"][2]) / 2))
            elif name == "03_pages":
                v["screens"] = paper_screens([("g02_home_top", "", "Home"), ("g05_story", "", "Our Story"),
                                              ("g03_home_invitation", "", "Invitation"),
                                              ("g07_details_schedule", "", "Details"), ("g09_rsvp_top", "", "RSVP")],
                                             shots, w=350, gap=40, top=660, stagger=80)
            elif name == "04_edit":
                scene = Image.open(scene_file(t, "hand_phone_edit.png"))
                r0 = kz.ekran_bolgeleri(scene)[0]
                k = 2000 / scene.height
                cx = (r0["kutu"][0] + r0["kutu"][2]) / 2 * k
                place(scene, k, 1440 - cx, 0, [shot(shots, "e01_edit_pages")], bg)
                v.update({"scene.bg": bg.resolve().as_uri(), "panel_w": "920", "text_w": "700", "text_top": "330"})
            elif name == "05_rsvp":
                v["screens"] = paper_screens([("g10_rsvp_form", "", "What your guests see"),
                                              ("p02_panel_reply_list", "", "What you see")],
                                             shots, w=560, gap=140, top=520)
            elif name == "06_details":
                v["screens"] = paper_screens([("g07_details_schedule", "", "Order of the day"),
                                              ("g12_details_venue", "", "The venue"),
                                              ("g08_details_faq", "", "Questions & answers")],
                                             shots, w=500, gap=70, top=530)
            elif name == "07_how":
                steps = [("b01_start", "i.", "Start", "Open the link in your guide and enter your Etsy order number"),
                         ("b04_setup_names", "ii.", "Personalize", "Names, date and a photo, then edit anything you like"),
                         ("g02_home_top", "iii.", "Publish &amp; share", "Send one link, or print the QR code on cards")]
                html = []
                for i, (sname, num, title, text) in enumerate(steps):
                    cx = 380 + i * 620
                    html.append(f'<div class="abs center" style="left:{cx - 280}px;width:560px;top:470px">'
                                f'<div class="num" style="font-size:100px;line-height:1">{num}</div>'
                                f'<div class="display" style="font-size:72px;margin-top:10px">{title}</div>'
                                f'<div class="note" style="margin-top:20px">{text}</div></div>')
                    html.append(cropped_screen(sname, shots, cx - 255, 930, 510, 900))
                v["steps"] = "\n".join(html)
            elif name == "08_included":
                scene = Image.open(scene_file(t, "flatlay_phone_v2.png", "flatlay_phone.png"))
                r0 = kz.ekran_bolgeleri(scene)[0]
                k = 1.7
                mid = (r0["kutu"][1] + r0["kutu"][3]) / 2 * k
                x0 = 2000 - r0["kutu"][2] * k - 150  # the phone's right edge 150 px from the canvas edge
                placed = place(scene, k, x0, min(0, max(2000 - scene.height * k, 1000 - mid)),
                               [shot(shots, "d01_demo_home")], bg)
                col_w = placed[0]["kutu"][0] - 120 - 110
                if col_w < 700:
                    raise RuntimeError(f"{t.folder}: only {col_w} px left of the phone for the text column (need 700)")
                # a paper wash behind the text column, ending before the phone (dark tables: 04's wood)
                v.update({"scene.bg": bg.resolve().as_uri(), "col_left": "120", "col_top": "250",
                          "col_w": str(min(820, col_w)), "veil_w": str(placed[0]["kutu"][0] - 40)})
            body = lk.fill((TPL / f"{name}.html").read_text(encoding="utf-8"), v,
                           raw=frozenset({"screens", "steps"}))
            page = ("<!doctype html><html><head><meta charset='utf-8'><link rel='stylesheet' href='editorial.css'>"
                    f"<style>{root_css(t)}</style></head><body>{body}</body></html>")
            pages.append((page, out_dir / f"{name}.png"))
        render(pages, tmp)
    outs = [p for _, p in pages]
    for o in outs:
        Image.open(o).convert("RGB").save(o, optimize=True)
    return outs


def render(pages: list[tuple[str, Path]], tmp: Path) -> None:
    if not m2p.playwright_hazir():
        raise RuntimeError("node + Playwright not found (NODE_PATH=/opt/node22/lib/node_modules, /opt/pw-browsers)")
    shutil.copy(TPL / "editorial.css", tmp / "editorial.css")
    saved = dict(m2p.FONT_AILELERI)
    m2p.FONT_AILELERI.update(FONTS)
    try:
        css = m2p.google_fonts_css(list(FONTS), tmp / "fonts")
    finally:
        m2p.FONT_AILELERI.clear()
        m2p.FONT_AILELERI.update(saved)
    if not css:
        raise RuntimeError("Google Fonts could not be downloaded; fallback fonts would change every line break")
    (tmp / "fonts.css").write_text(css, encoding="utf-8")
    for i, (text, out) in enumerate(pages):
        page = tmp / f"page_{i}.html"
        page.write_text(text, encoding="utf-8")
        m2p.playwright_calistir({"url": page.as_uri(), "out": str(out.resolve()), "mode": "png", "width": 2000,
                                 "height": 2000, "scale": 1, "fonts": list(FONTS)}, tmp)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--theme", required=True, choices=sorted(lk.THEMES))
    ap.add_argument("--only", nargs="*", choices=IMAGES)
    a = ap.parse_args()
    for o in build(lk.THEMES[a.theme], a.only):
        print(o.relative_to(REPO))


if __name__ == "__main__":
    main()
