#!/usr/bin/env python3
"""Etsy listing kit + buyer START HERE guide for a platform theme (G059, K24 platform model).

  python3 tools/listing_kit.py <step> --theme <id>|all [--base-url https://…] [--no-fonts]

Steps (each one reads what the step before it wrote; `all` = qr, strips, images, video, pdf, check):
  capture   real screenshots + the opening recording of the theme: runs tools/listing_templates/capture.ts against a
            local production build of platform/ (`npm ci && npm run build` first; nothing is deployed)
            → collections/<NN_*>/package/shots/
  qr        QR of the buyer's start link /start?theme=<id> (segno, error correction Q, like tools/make_qr.py)
            → package/customer/img/start_qr.png + .svg
  strips    the guide's step pictures: 1–3 real screens side by side on white → package/customer/img/*.jpg
  images    the Etsy listing images, 2000 × 2000 PNG, from tools/listing_templates/platform/*.html (Playwright Chromium;
            layout + typography only, the theme's own GPT parts and real screens) → package/listing/images/
  video     a short silent listing clip from the opening recording, 1080 × 1080 H.264 → package/listing/video.mp4
  pdf       START_HERE.md → START_HERE.pdf (clickable start link + QR) and listing.md → listing_<id>.pdf (all fields,
            image thumbnails, video facts) with tools/md_to_pdf.py
  check     checks every output (sizes, counts, title/tag rules, video rules, the PDF's link, the QR's content)

Text (START_HERE.md, listing.md) is written by hand; this tool only builds files from it. Commercial fields stay as
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

BASE_URL = os.environ.get("LISTING_BASE_URL", "https://davetiye-platform-five.vercel.app")
PLACEHOLDER_HOSTS = {"example.com", "example.org", "averyandjordan.com", "www.averyandjordan.com", "localhost", "127.0.0.1"}


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

    @property
    def collection(self) -> Path:
        return REPO / "collections" / self.folder

    @property
    def package(self) -> Path:
        return self.collection / "package"


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
}

# Listing images, in upload order (file = <name>.png; template = tools/listing_templates/platform/<name>.html).
IMAGES = ["01_cover", "02_guest_pages", "03_whats_included", "04_how_it_works", "05_editor", "06_rsvp",
          "07_details", "08_live_demo"]
# Screens each template / guide strip uses (from capture.ts).
SHOTS = ["g01_envelope", "g02_home_top", "g03_home_invitation", "g04_home_calendar", "g05_story", "g06_details_top",
         "g07_details_schedule", "g08_details_faq", "g09_rsvp_top", "g10_rsvp_form", "g11_rsvp_sent", "b01_start",
         "b02_start_form", "b03_edit_link", "b04_panel_top", "b05_panel_date", "b06_panel_crop", "b07_panel_photos",
         "b08_panel_preview", "b09_publish_notes", "b10_live_qr", "p01_panel_replies", "p02_panel_csv",
         "p03_panel_questions", "d01_demo_home"]
# START HERE pictures: file → screens shown side by side.
STRIPS = {
    "step1_start": ["b01_start", "b02_start_form"],
    "step2_link": ["b03_edit_link"],
    "step3_editor": ["b04_panel_top", "b05_panel_date"],
    "step4_photos": ["b06_panel_crop", "b07_panel_photos"],
    "step5_publish": ["b08_panel_preview", "b09_publish_notes", "b10_live_qr"],
    "step7_replies": ["p01_panel_replies", "p02_panel_csv", "p03_panel_questions"],
    "guests": ["g01_envelope", "g02_home_top", "g07_details_schedule"],
}

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


# ----------------------------------------------------------------------------- listing.md fields

def _block_after(md: str, heading_re: str) -> str | None:
    m = re.search(heading_re + r".*?\n```text\n(.*?)\n```", md, re.S | re.I | re.M)
    return m.group(1) if m else None


def listing_fields(md: str) -> dict:
    """Title and tags from listing.md: the first ```text block after '## 1. Title' and after '## 3. Tags'."""
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
        return v if k in raw or k.startswith(("shot.", "part.", "qr.")) else html.escape(v, quote=True)
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
        (tmp / "fonts.css").write_text(css, encoding="utf-8")
        for i, (text, out, w, h) in enumerate(pages):
            page = tmp / f"page_{i}.html"
            page.write_text(text, encoding="utf-8")
            out.parent.mkdir(parents=True, exist_ok=True)
            m2p.playwright_calistir({"url": page.as_uri(), "out": str(out.resolve()), "mode": "png", "width": w,
                                     "height": h, "scale": 1, "fonts": FONTS if css else []}, tmp)


# ----------------------------------------------------------------------------- steps

def step_capture(t: Theme, base: str) -> None:
    env = dict(os.environ)
    env.setdefault("NODE_PATH", "/opt/node22/lib/node_modules")
    env.setdefault("PLAYWRIGHT_BROWSERS_PATH", "/opt/pw-browsers")
    # Headless Chromium sometimes loses a renderer ("Target crashed") on the DPR 3 pages of 03 (3 of 8 runs on
    # 2026-10-14, at different steps): the whole capture is repeated, up to 3 times.
    for attempt in range(1, 4):
        r = subprocess.run(["node", str(CAPTURE), "--theme", t.id, "--out", str(t.package / "shots"), "--public-url", base],
                           cwd=REPO, env=env)
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


def make_strip(screens: list[Path], out: Path, slots: int = 4, h: int = 900, gap: int = 54, pad: int = 24) -> Path:
    """1–3 screens side by side on white, always `slots` wide (so every guide picture has the same height on the
    page, about 3.5 in on US Letter); rounded corners and a hairline border (layout only)."""
    w = round(h * 1170 / 2532)
    canvas = Image.new("RGB", (slots * w + (slots - 1) * gap + 2 * pad, h + 2 * pad), "white")
    used = len(screens) * w + (len(screens) - 1) * gap
    x = (canvas.width - used) // 2
    for s in screens:
        im = Image.open(s).convert("RGB").resize((w, h), Image.LANCZOS)
        r = round(w * 0.07)
        border = Image.new("RGBA", (w + 4, h + 4))
        ImageDraw.Draw(border).rounded_rectangle((0, 0, w + 3, h + 3), r + 2, fill=(205, 200, 190, 255))
        canvas.paste(border, (x - 2, pad - 2), border)
        rim = _rounded(im, r)
        canvas.paste(rim, (x, pad), rim)
        x += w + gap
    out.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out, quality=86, optimize=True)
    return out


def step_strips(t: Theme) -> list[Path]:
    shots = t.package / "shots"
    return [make_strip([shots / f"{s}.jpg" for s in names], t.package / "customer" / "img" / f"{name}.jpg")
            for name, names in STRIPS.items()]


def step_images(t: Theme, fonts: bool = True) -> list[Path]:
    shots = t.package / "shots"
    missing = [s for s in SHOTS if not (shots / f"{s}.jpg").exists()]
    if missing:
        raise RuntimeError(f"missing screens in {shots}: {missing} (run the capture step)")
    out_dir = t.package / "listing" / "images"
    with tempfile.TemporaryDirectory(prefix="listing_qr_") as tmp:
        pal = palette(t)
        qr_png, _ = make_qr(demo_url(t), Path(tmp) / "demo_qr", dark=pal["ink"], light=pal.get("ivory", "#FFFFFF"))
        values = template_values(t, shots, {"qr.demo": qr_png.resolve().as_uri()})
        pages = []
        for name in IMAGES:
            values["title"] = name
            pages.append((fill((TEMPLATES / f"{name}.html").read_text(encoding="utf-8"), values),
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


def step_video(t: Theme, fonts: bool = True) -> Path:
    shots = t.package / "shots"
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
        fade = 0.4
        fc = (f"[1:v]trim=start={meta['lead_in_s']}:duration={dur},setpts=PTS-STARTPTS,fps={VIDEO['fps']},"
              f"crop={cw}:{ch}:0:0,scale={slot_w}:{slot_h}:flags=lanczos,format=rgba[v];"
              f"[2:v]format=gray,scale={slot_w}:{slot_h}[m];[v][m]alphamerge[vm];"
              f"[0:v][vm]overlay={slot_x}:{slot_y}:shortest=1,"
              f"fade=t=in:st=0:d={fade},fade=t=out:st={dur - fade:.2f}:d={fade},format=yuv420p[out]")
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


def media_markdown(t: Theme, tmp: Path) -> str:
    """The listing PDF's generated part: image thumbnails (4 per row), video facts + 3 frames, check results."""
    img_dir = t.package / "listing" / "images"
    thumbs = []
    for n in IMAGES:
        p = img_dir / f"{n}.png"
        th = tmp / f"thumb_{n}.jpg"
        im = Image.open(p).convert("RGB")
        im.thumbnail((420, 420))
        im.save(th, quality=82)
        thumbs.append((n, th, Image.open(p).size, p.stat().st_size))
    rows = ["## Images (generated by tools/listing_kit.py)", "",
            "Upload in this order. Files: `package/listing/images/`.", "",
            "| 1 | 2 | 3 | 4 |", "|---|---|---|---|"]
    for i in range(0, len(thumbs), 4):
        part = thumbs[i:i + 4]
        rows.append("| " + " | ".join(f"![{n}]({th}) **{n}.png** · {w}×{h} · {s / 1_000_000:.1f} MB"
                                      for n, th, (w, h), s in part) + " |")
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


def step_pdf(t: Theme) -> list[Path]:
    import md_to_pdf as m2p
    pal_path = t.collection / "palette.json"
    guide_md = t.package / "customer" / "START_HERE.md"
    guide_pdf = m2p.donustur(guide_md, t.package / "customer" / "START_HERE.pdf", pal_path, "letter", True)
    listing_md = t.package / "listing" / "listing.md"
    with tempfile.TemporaryDirectory(prefix="listing_pdf_") as tmp:
        tmp = Path(tmp)
        text = listing_md.read_text(encoding="utf-8")
        marker = "<!-- listing-kit:media -->"
        if marker not in text:
            raise RuntimeError(f"{listing_md} has no '{marker}' line")
        doc = tmp / "listing.md"
        doc.write_text(text.replace(marker, media_markdown(t, tmp)), encoding="utf-8")
        listing_pdf = m2p.donustur(doc, t.package / "listing" / f"listing_{t.id}.pdf", pal_path, "letter", True)
    return [guide_pdf, listing_pdf]


def pdf_uris(pdf: Path) -> set[str]:
    try:
        from pypdf import PdfReader
    except ImportError:  # pragma: no cover
        return set()
    uris = set()
    for page in PdfReader(str(pdf)).pages:
        for a in page.get("/Annots") or []:
            a = a.get_object()
            act = a.get("/A")
            if act and act.get("/URI"):
                uris.add(str(act["/URI"]))
    return uris


def step_check(t: Theme, base: str) -> list[str]:
    """Returns problems (empty = all good). Prints a short report."""
    p: list[str] = []
    pk = t.package
    md = (pk / "listing" / "listing.md").read_text(encoding="utf-8")
    f = listing_fields(md)
    p += [f"title: {x}" for x in title_problems(f["title"])]
    p += [f"tags: {x}" for x in tag_problems(f["tags"])]
    if re.search(r"\b(TBD|lorem)\b", md, re.I):
        p.append("listing.md: TBD/lorem left")
    imgs = sorted((pk / "listing" / "images").glob("*.png"))
    if len(imgs) < 7:
        p.append(f"{len(imgs)} listing images (need ≥ 7)")
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
    for name in STRIPS:
        if f"img/{name}.jpg" not in guide:
            p.append(f"START_HERE.md does not show img/{name}.jpg")
    gpdf = pk / "customer" / "START_HERE.pdf"
    if not gpdf.exists():
        p.append("no START_HERE.pdf")
    else:
        uris = pdf_uris(gpdf)
        if uris and start_url(t, base) not in uris:
            p.append(f"START_HERE.pdf has no clickable {start_url(t, base)} (links: {sorted(uris)[:4]})")
        mb = gpdf.stat().st_size / 1_000_000
        if mb > ETSY["digital_file_max_mb"]:
            p.append(f"START_HERE.pdf is {mb:.1f} MB (Etsy digital file max {ETSY['digital_file_max_mb']} MB)")
    if not (pk / "listing" / f"listing_{t.id}.pdf").exists():
        p.append(f"no listing_{t.id}.pdf")
    print(f"[{t.id}] title {len(f['title'] or '')} chars · {len(f['tags'])} tags · {len(imgs)} images · "
          f"{'video ok' if v.exists() else 'no video'} · {len(p)} problem(s)")
    for x in p:
        print(f"  - {x}")
    return p


STEPS = ["capture", "qr", "strips", "images", "video", "pdf", "check"]


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="Etsy listing kit + START HERE guide for platform themes (G059).")
    ap.add_argument("step", choices=STEPS + ["all"])
    ap.add_argument("--theme", required=True, help=f"theme id or 'all' ({', '.join(THEMES)})")
    ap.add_argument("--base-url", default=BASE_URL, help="public base URL of the platform (default: %(default)s)")
    ap.add_argument("--no-fonts", action="store_true", help="do not download Google Fonts (system fonts)")
    a = ap.parse_args(argv)
    check_url(a.base_url)
    themes = list(THEMES.values()) if a.theme == "all" else [theme_of(a.theme)]
    steps = ["qr", "strips", "images", "video", "pdf", "check"] if a.step == "all" else [a.step]
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
                x = step_video(t, not a.no_fonts)
                print(f"  {x.relative_to(REPO)}  {video_facts(x)}")
            elif s == "pdf":
                for x in step_pdf(t):
                    print(f"  {x.relative_to(REPO)}  {x.stat().st_size / 1_000_000:.2f} MB")
            elif s == "check":
                bad += len(step_check(t, a.base_url))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
