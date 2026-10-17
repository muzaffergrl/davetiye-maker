"""Editorial Etsy listing images (v4): 9 × 2000 px (image 9: G148), layout + typography only (K21). Designs 01–21 (G124; 21: G137).

  python3 tools/listing_editorial.py --theme olive-ivory [--only 01_cover 03_pages]
  python3 tools/listing_editorial.py --theme 06-11 13-15 18 19 --capture --video     (numbers, ranges, ids or 'all')

Pictures come only from: the design's GPT mockup scenes (assets/gpt/mockups/, #00FF00 screens), the theme's GPT parts
(paper texture), the shop-wide GPT trust scene of image 7 (brand/trust/t1_three_steps.png, GM06) and real screens of the
platform, captured from a local production build (`cd platform && npm run build` first; nothing is deployed):
  --capture   runs tools/listing_templates/capture.ts (guest pages, /start, the editor, the RSVP list, opening.webm),
              tools/listing_editorial/capture_opening.ts (two DPR 3 stills of the opening, at the times chosen by eye per
              design in tools/listing_editorial/opening_stills.json) and tools/listing_editorial/capture_devices.ts (G148:
              /my and Share → "Use on another device" for image 9) into <shots-root>/<NN_folder>/; `--capture stills`
              only the two stills (after a change in opening_stills.json), `--capture devices` only image 9's screens.
  --shots-root  where the screens are (default $BKE_LISTING_SHOTS or <temp>/bke-listing-shots): about 30 MB per design,
              kept out of the repository; package/shots/ of 01–05 is the older G059 capture (before G100/G121's editor).
  --video     also builds package/listing/video.mp4 from the capture's opening.webm (tools/listing_kit.py video).
Nothing is drawn here.

Design rules (docs/21_ILAN_GORSELLERI.md): no boxes, badges, pills or icons; Cormorant Garamond light + Montserrat small
caps; hairlines instead of frames; one idea per image; text never over a phone; the cover's text stays inside the 4:3
search-crop band (y 250–1750); a design that does not open from an envelope is never called one (its opening object
from platform/lib/marketing/designs.ts, listing_kit.Theme.opening_words); the dark designs (06, 17, 19) are laid out on
their own dark ground.

Writes collections/<NN>/package/listing/images_editorial/<name>.png.
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
BRAND_MARK_DARK = REPO / "brand" / "svg" / "bke-logo-horizontal-reverse.svg"  # gold + paper, for the dark designs
# GM06 (brand/trust/, GPT): three phones on linen, made for "start · edit · share" — image 7's scene for every design
TRUST_STEPS = REPO / "brand" / "trust" / "t1_three_steps.png"
CAPTURE_OPENING = HERE / "capture_opening.ts"
CAPTURE_DEVICES = HERE / "capture_devices.ts"  # G148: image 9's two screens (m01_my_form, m02_devices)
DEVICES = ["m01_my_form", "m02_devices"]
OPENING_STILLS = HERE / "opening_stills.json"
IMAGES = lk.UPLOAD_IMAGES  # the Etsy upload order
FONTS = {"Cormorant Garamond": "ital,wght@0,300;0,400;0,500;1,300;1,400;1,500", "Montserrat": "wght@400;500"}
# the opening in three phones: the closed opening page (g01_envelope, whatever the object), then two DPR 3 stills from
# capture_opening.ts chosen by eye per design (each opening has its own timing): open_mid.jpg (the object opening) and
# open_card.jpg (the card risen out of it); OPENING_STILLS records the chosen times, opening_stills.json in the shots
# folder what was captured
OPENING = ["g01_envelope", "open_mid", "open_card"]
DEFAULT_SHOTS_ROOT = Path(os.environ.get("BKE_LISTING_SHOTS") or Path(tempfile.gettempdir()) / "bke-listing-shots")


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


def root_css(t: lk.Theme, ground: str = "theme") -> str:
    """The theme's colours as CSS variables. ground="theme": the design's own ground (light paper, or for the dark
    designs their dark `mist_top` with the paper texture); ground="light": a light photograph behind the text (image 7's
    linen), where a dark design takes its dark `primary` as ink."""
    p = lk.palette(t)
    gpt = t.collection / "assets" / "gpt"
    # the paper texture: PAKET 5's bg_tile, or (G137, design 21 has no parts/) its GPT paper texture
    tile = next((p for p in (gpt / "parts" / "bg_tile.png", gpt / "textures" / "paper-background.png") if p.exists()), None)
    paper_img = f"url('{tile.resolve().as_uri()}')" if tile else "none"
    ink, deep, gold, paper, shade = p["ink"], p["deep"], p["gold"], p["ivory"], p["ink"]
    if lk.is_dark(t):
        if ground == "light":
            ink, shade, paper_img = p["primary"], p["primary"], "none"
            deep = f"color-mix(in srgb, {p['gold']} 45%, {p['primary']})"
        else:
            paper, shade = p["mist_top"], "#000000"
    return (f":root{{--ink:{ink};--deep:{deep};--gold:{gold};--ivory:{p['ivory']};"
            f"--paper:{paper};--mist:{p['mist_top']};--paper-img:{paper_img};--shade:{shade};"
            # gold is a fill colour; as a text/rule colour it is mixed toward the ink so it reads on paper
            f"--gold-ink:color-mix(in srgb, {gold} 70%, {ink});}}")


def opening_still_times(t: lk.Theme) -> dict[str, int]:
    data = json.loads(OPENING_STILLS.read_text(encoding="utf-8"))
    if t.id not in data:
        raise RuntimeError(f"{OPENING_STILLS.relative_to(REPO)} has no stills for {t.id}: capture candidates with "
                           f"capture_opening.ts --at 0,600,…,4800, pick two by eye and add them")
    return {k: int(data[t.id][k]) for k in ("open_mid", "open_card")}


def node_env() -> dict:
    env = dict(os.environ)
    env.setdefault("NODE_PATH", "/opt/node22/lib/node_modules")
    env.setdefault("PLAYWRIGHT_BROWSERS_PATH", "/opt/pw-browsers")
    return env


def capture_devices(t: lk.Theme, shots: Path) -> None:
    """G148: image 9's screens (capture_devices.ts: /my on a phone, Share → "Use on another device" with three
    devices), from the local production build."""
    for attempt in range(1, 4):
        r = subprocess.run(["node", str(CAPTURE_DEVICES), "--theme", t.id, "--out", str(shots)], cwd=REPO, env=node_env())
        if r.returncode == 0:
            return
        print(f"capture_devices attempt {attempt} failed for {t.id} (exit {r.returncode})", file=sys.stderr)
    raise RuntimeError(f"capture_devices failed for {t.id}")


def capture(t: lk.Theme, shots: Path, base: str = lk.BASE_URL, what: str = "all") -> None:
    """Real screens of the design from the local production build: capture.ts and image 9's screens (what="all"),
    then the two opening stills (all, stills); what="devices": only image 9's screens."""
    if what in ("all", "devices"):
        capture_devices(t, shots)
    if what == "devices":
        return
    if what == "all":
        lk.step_capture(t, base, shots)
    times = opening_still_times(t)
    with tempfile.TemporaryDirectory(prefix="opening_stills_") as tmp:
        for attempt in range(1, 4):
            r = subprocess.run(["node", str(CAPTURE_OPENING), "--theme", t.id, "--out", tmp,
                                "--at", f"{times['open_mid']},{times['open_card']}"], cwd=REPO, env=node_env())
            if r.returncode == 0:
                break
            print(f"capture_opening attempt {attempt} failed for {t.id} (exit {r.returncode})", file=sys.stderr)
        else:
            raise RuntimeError(f"capture_opening failed for {t.id}")
        shutil.copy(Path(tmp) / "o01.jpg", shots / "open_mid.jpg")
        shutil.copy(Path(tmp) / "o02.jpg", shots / "open_card.jpg")
    (shots / "opening_stills.json").write_text(json.dumps(
        {"theme": t.id, "dpr": 3, "size": "390x844", "source": str(OPENING_STILLS.relative_to(REPO)),
         "chosen": {k: {"ms_after_tap": v} for k, v in times.items()}}, indent=2) + "\n", encoding="utf-8")


def build(t: lk.Theme, only: list[str] | None, shots: Path) -> list[Path]:
    names = only or IMAGES
    # the screens each image needs (G148: image 9 alone needs only its own two)
    need = (OPENING if {"01_cover", "02_opening"} & set(names) else []) + (DEVICES if "09_devices" in names else [])
    missing = [n for n in need if not (shots / f"{n}.jpg").exists()]
    if missing:
        raise RuntimeError(f"missing screens in {shots}: {missing} (run with --capture, or --capture devices for "
                           "image 9)")
    out_dir = t.package / "listing" / "images_editorial"
    out_dir.mkdir(parents=True, exist_ok=True)
    dark = lk.is_dark(t)
    words = t.opening_words
    base = {"theme_name": t.name, "scene.brand": (BRAND_MARK_DARK if dark else BRAND_MARK).resolve().as_uri(),
            "opening": words["short"], "Opening": words["Long"]}
    pages = []
    with tempfile.TemporaryDirectory(prefix="listing_editorial_") as tmp:
        tmp = Path(tmp)
        for name in names:
            v = dict(base)
            bg = tmp / f"{name}_bg.png"
            ground = "theme"
            if name == "01_cover":
                scene = Image.open(scene_file(t, "cover_hand_v2.png", "cover_hand.png"))
                r0 = kz.ekran_bolgeleri(scene)[0]
                k = 2000 / scene.width
                # names up to 16 characters on one line; longer ones on two lines ("Vintage Airmail / Love Letter")
                words_ = t.name.split()
                if len(t.name) <= 16:
                    title, size, screen_top = t.name, 170, 700
                else:
                    cut = min(range(1, len(words_)), key=lambda i: abs(len(" ".join(words_[:i])) - len(t.name) / 2))
                    title, size, screen_top = " ".join(words_[:cut]) + "\n" + " ".join(words_[cut:]), 140, 820
                # the phone's screen at screen_top, or lower when that would lift the scene off the canvas bottom (a
                # blurred, mirrored band under the hand: 08's scene, G124)
                y0 = max(screen_top - r0["kutu"][1] * k, 2000 - scene.height * k)
                place(scene, k, 0, y0, [shot(shots, "g01_envelope")], bg)
                screen_top = round(y0 + r0["kutu"][1] * k)
                v.update({"scene.bg": bg.resolve().as_uri(), "veil_h": str(screen_top + 120), "text_top": "330",
                          "title": title, "title_px": str(size)})
            elif name == "02_opening":
                scene = Image.open(scene_file(t, "three_phones.png"))
                regs = kz.ekran_bolgeleri(scene)
                k = 1.62
                x0 = 1000 - (regs[0]["kutu"][0] + regs[-1]["kutu"][2]) / 2 * k
                y0 = 470 - min(r["kutu"][1] for r in regs) * k
                placed = place(scene, k, x0, y0, [shot(shots, n) for n in OPENING], bg)
                bottom = max(r["kutu"][3] for r in placed)
                # G124: the labels on a paper wash that starts at the phones (a dark table under them in 07, 13)
                v.update({"scene.bg": bg.resolve().as_uri(), "veil_h": "640", "veil_b": str(2000 - bottom),
                          "below_screens": str(bottom + 140)})
                cx = [round((r["kutu"][0] + r["kutu"][2]) / 2) for r in placed]
                for i, c in enumerate(cx, 1):
                    v[f"s{i}_cx"] = str(c)
                # the middle label may be wider than the outer ones ("The storybook opens"), never into them (440 px)
                v["s2_w"] = str(min(600, 2 * (min(cx[1] - cx[0], cx[2] - cx[1]) - 220 - 30)))
            elif name == "03_pages":
                v["screens"] = paper_screens([("g02_home_top", "", "Home"), ("g05_story", "", "Our Story"),
                                              ("g03_home_invitation", "", "Invitation"),
                                              ("g07_details_schedule", "", "Details"), ("g09_rsvp_top", "", "RSVP")],
                                             shots, w=350, gap=40, top=660, stagger=80)
            elif name == "04_edit":
                scene = Image.open(scene_file(t, "hand_phone_edit_v2.png", "hand_phone_edit.png"))
                r0 = kz.ekran_bolgeleri(scene)[0]
                k = 2000 / scene.height
                cx = (r0["kutu"][0] + r0["kutu"][2]) / 2 * k
                place(scene, k, 1440 - cx, 0, [shot(shots, "e01_edit_pages")], bg)
                v.update({"scene.bg": bg.resolve().as_uri(), "panel_w": "920", "text_w": "700", "text_top": "330"})
            elif name == "05_rsvp":
                # G124: the editor's Guests page since G100/G121 (counts, search, the replies, Download list) on its
                # first screen; the scrolled list (p02) lost its header to the sticky bar
                v["screens"] = paper_screens([("g10_rsvp_form", "", "What your guests see"),
                                              ("p01_panel_replies", "", "What you see")],
                                             shots, w=560, gap=140, top=520)
            elif name == "09_devices":
                # G148 (K47): the /my form on one phone, the editor's signed-in devices on another (real screens,
                # capture_devices.ts; no web address or QR in them); the same layout as image 5
                v["screens"] = paper_screens([("m01_my_form", "", "Order number + email"),
                                              ("m02_devices", "", "Every device, one editor")],
                                             shots, w=560, gap=140, top=520)
            elif name == "06_details":
                v["screens"] = paper_screens([("g07_details_schedule", "", "Order of the day"),
                                              ("g12_details_venue", "", "The venue"),
                                              ("g08_details_faq", "", "Questions & answers")],
                                             shots, w=500, gap=70, top=530)
            elif name == "07_how":
                # GM06 T1 (shop-wide, design-independent): three phones on linen = the three steps, real screens in them
                ground = "light"
                v["scene.brand"] = BRAND_MARK.resolve().as_uri()
                placed = place(Image.open(TRUST_STEPS), 2000 / Image.open(TRUST_STEPS).width, 0, 0,
                               [shot(shots, n) for n in ("b01_start", "b04_setup_names", "g02_home_top")], bg)
                steps = [("i.", "Start", "Open the link in your guide and enter your Etsy order number"),
                         ("ii.", "Personalize", "Names, date and a photo, then edit anything you like"),
                         ("iii.", "Publish &amp; share", "Send one link, or print the QR code on cards")]
                below = max(r["kutu"][3] for r in placed) + 54
                html = []
                for r, (num, title, text) in zip(placed, steps):
                    c = round((r["kutu"][0] + r["kutu"][2]) / 2)
                    html.append(f'<div class="abs center" style="left:{c - 270}px;width:540px;top:{below}px">'
                                f'<div class="num" style="font-size:64px;line-height:1">{num}</div>'
                                f'<div class="display" style="font-size:66px;margin-top:6px">{title}</div>'
                                f'<div class="note" style="margin-top:14px">{text}</div></div>')
                v.update({"scene.bg": bg.resolve().as_uri(), "steps": "\n".join(html),
                          "veil_h": str(min(r["kutu"][1] for r in placed) + 40),
                          "veil_b": str(2000 - below + 120)})
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
                    f"<style>{root_css(t, ground)}</style></head><body>{body}</body></html>")
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


def select(specs: list[str]) -> list[lk.Theme]:
    """Theme ids, design numbers or ranges ("06-11"), or 'all' → themes in design order."""
    by_no = {t.no: t for t in lk.THEMES.values()}
    want: list[lk.Theme] = []
    for spec in specs:
        for part in filter(None, (p.strip() for p in spec.split(","))):
            if part == "all":
                want += list(by_no.values())
            elif part in lk.THEMES:
                want.append(lk.THEMES[part])
            elif m := re.fullmatch(r"(\d{1,2})(?:-(\d{1,2}))?", part):
                for n in range(int(m.group(1)), int(m.group(2) or m.group(1)) + 1):
                    if f"{n:02d}" not in by_no:
                        raise SystemExit(f"no design {n:02d}")
                    want.append(by_no[f"{n:02d}"])
            else:
                raise SystemExit(f"unknown theme '{part}' (ids: {', '.join(lk.THEMES)}; or 01–21, 06-11, all)")
    seen: dict[str, lk.Theme] = {}
    for t in sorted(want, key=lambda t: t.no):
        seen.setdefault(t.id, t)
    return list(seen.values())


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--theme", required=True, nargs="+", help="theme ids, design numbers or ranges (06-11), or 'all'")
    ap.add_argument("--only", nargs="*", choices=IMAGES)
    ap.add_argument("--shots-root", type=Path, default=DEFAULT_SHOTS_ROOT,
                    help="captured screens: <root>/<NN_folder>/ (default: %(default)s)")
    ap.add_argument("--capture", nargs="?", const="all", choices=["all", "stills", "devices"],
                    help="capture first (local production build): all screens + the opening stills, only the stills, "
                         "or only image 9's screens (devices)")
    ap.add_argument("--video", action="store_true", help="also build package/listing/video.mp4 (listing_kit video)")
    ap.add_argument("--base-url", default=lk.BASE_URL, help="public base URL shown in the captured screens")
    a = ap.parse_args()
    for t in select(a.theme):
        shots = lk.shots_dir(t, a.shots_root)
        print(f"== {t.no} {t.id} ({t.opening}) — screens: {shots}")
        if a.capture:
            shots.mkdir(parents=True, exist_ok=True)
            capture(t, shots, a.base_url, a.capture)
        for o in build(t, a.only, shots):
            print(f"  {o.relative_to(REPO)}")
        if a.video:
            v = lk.step_video(t, True, shots)
            print(f"  {v.relative_to(REPO)}  {lk.video_facts(v)}")


if __name__ == "__main__":
    main()
