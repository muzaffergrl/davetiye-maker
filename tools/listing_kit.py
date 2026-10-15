#!/usr/bin/env python3
"""Etsy listing kit + buyer START HERE guide for a platform theme (G059, K24 platform model; images G065).

  python3 tools/listing_kit.py <step> --theme <id>|all [--base-url https://…] [--no-fonts]

Steps (each one reads what the step before it wrote; `all` = qr, images, video, pdf, check):
  capture   real guest screenshots + the opening recording of the theme: runs tools/listing_templates/capture.ts against
            a local production build of platform/ (`npm ci && npm run build` first; nothing is deployed)
            → collections/<NN_*>/package/shots/ (the guide's cover screen and the listing video use them)
  qr        QR of the buyer's start link /start?theme=<id> (segno, error correction Q, like tools/make_qr.py)
            → package/customer/img/start_qr.png + .svg
  images    the 7 Etsy listing images, 2000 × 2000 PNG, in the BKE Studio GM03 layout (G065): runs
            tools/listing_templates/gm03/build.py (which runs G067's tools/listing_v2/build.py for the cover, pages, how
            it works and live demo, and builds the editor, RSVP and what's-included images itself) on the design's GPT
            scenes (PAKET 3) with real screens of a local production build (guest pages and the current editor)
            → package/listing_v2/ and package/listing/images/01..07. No QR code and no web address in any image
            (docs/15 §1, off-platform): the live demo image says "demo link in the description".
  video     a short silent listing clip from the opening recording, 1080 × 1080 H.264 → package/listing/video.mp4
  pdf       START_HERE.md → START_HERE.pdf (a cover with the theme's own painted corners and its envelope screen,
            clickable start link + QR, every picture kept with its step and captioned) and listing.md →
            listing_<id>.pdf (all fields, image thumbnails, the cover at search-result size and as a 4:3 crop, video
            facts) with tools/md_to_pdf.py
  check     checks every output (sizes, counts, title/tag rules, video rules, the PDF's link, the QR's content)
            --prepublish also: start link and demo answer 200 with the theme's name (live), and no [VERIFY …] or
            [COMMERCIAL PLACEHOLDER] is left in listing_v3.md, START_HERE.md or the PDFs. A kit is not sale_ready until
            `check --prepublish` passes (docs/05 §D).

Text (START_HERE.md, listing_v3.md — G091) is written by hand; this tool only builds files from it. Undecided commercial
fields stay as placeholders ([PRICE], [RESPONSE TIME], …); the shop name is BKE Studio (K33). Etsy rules used by `check`
are in ETSY below with their source and status. The guide has no step pictures since G091 (text + the start QR).
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
TEMPLATES = TOOLS / "listing_templates" / "platform"   # video_bg.html + kit.css (the listing video's frame)
CAPTURE = TOOLS / "listing_templates" / "capture.ts"
GM03 = TOOLS / "listing_templates" / "gm03" / "build.py"
LISTING_MD = "listing_v3.md"   # G091 (the earlier listing.md stays as a record)
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

# Listing images, in upload order (file = <name>.png), built by tools/listing_templates/gm03/build.py (G065, GM03).
IMAGES = ["01_cover", "02_pages", "03_how", "04_editor", "05_rsvp", "06_included", "07_demo"]
# Guest screens capture.ts writes (the guide's cover uses g01_envelope; the video uses opening.webm). The editor screens
# of the listing images come from gm03/capture.ts (current editor), not from here.
SHOTS = ["g01_envelope", "g02_home_top", "g03_home_invitation", "g04_home_calendar", "g05_story", "g06_details_top",
         "g07_details_schedule", "g08_details_faq", "g09_rsvp_top", "g10_rsvp_form", "g11_rsvp_sent",
         "g12_details_venue", "d01_demo_home"]

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


def step_images(t: Theme, capture: bool = True) -> list[Path]:
    """The 7 GM03 listing images (G065): gm03/build.py for this design → package/listing/images/. Exit ≠ 0 of the
    builder (its own check: size, no green left, exact text, nothing on a screen, no text overlap) is an error here."""
    cmd = [sys.executable, str(GM03), "--design", t.no] + ([] if capture else ["--skip-capture"])
    r = subprocess.run(cmd, cwd=REPO)
    if r.returncode != 0:
        raise RuntimeError(f"listing images for {t.id}: gm03/build.py failed (exit {r.returncode})")
    out_dir = t.package / "listing" / "images"
    outs = [out_dir / f"{n}.png" for n in IMAGES]
    missing = [o.name for o in outs if not o.exists()]
    if missing:
        raise RuntimeError(f"listing images missing after the build: {missing}")
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
    small, crop = cover_previews(img_dir / "01_cover.png", tmp)
    rows += ["", "## The cover as buyers see it first (generated)", "",
             "Left: 300 px wide, about the size of a search result. Right: the centred 4:3 crop (2000 × 1500), in case "
             "Etsy shows the thumbnail cropped (not verified; the listing editor lets you adjust the thumbnail). The "
             "title \"Wedding Website\", the phone and the three labels must stay readable in both.", "",
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


def step_pdf(t: Theme, fonts: bool = True) -> list[Path]:
    import md_to_pdf as m2p
    pal_path = t.collection / "palette.json"
    guide_md = t.package / "customer" / "START_HERE.md"
    guide = guide_pdf(t, guide_md, t.package / "customer" / "START_HERE.pdf", fonts)
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
    return [guide, listing_pdf]


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
    images carry no QR since G065: the demo link is in the description.)"""
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
        p.append("listing.md: TBD/lorem left")
    imgs = sorted((pk / "listing" / "images").glob("*.png"))
    if [i.stem for i in imgs] != IMAGES:
        p.append(f"listing images {[i.stem for i in imgs]} (want {IMAGES})")
    if len(imgs) > ETSY["photos_max"]:
        p.append(f"{len(imgs)} listing images (Etsy max {ETSY['photos_max']})")
    for i in imgs:
        if Image.open(i).size != (2000, 2000):
            p.append(f"{i.name}: {Image.open(i).size} (want 2000×2000)")
    # docs/15 §1 (off-platform): no QR code in the listing images (G065 removed image 8's demo QR)
    left_qr = sorted(x.name for x in (pk / "listing").rglob("*qr*"))
    if left_qr:
        p.append(f"QR files in package/listing/: {left_qr} (no QR in the listing since G065)")
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


STEPS = ["capture", "qr", "images", "video", "pdf", "check"]


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="Etsy listing kit + START HERE guide for platform themes (G059).")
    ap.add_argument("step", choices=STEPS + ["all"])
    ap.add_argument("--theme", required=True, help=f"theme id or 'all' ({', '.join(THEMES)})")
    ap.add_argument("--base-url", default=BASE_URL, help="public base URL of the platform (default: %(default)s)")
    ap.add_argument("--no-fonts", action="store_true", help="do not download Google Fonts (system fonts)")
    ap.add_argument("--prepublish", action="store_true",
                    help="check: also the live start link and demo and no open [VERIFY]/[PLACEHOLDER] markers (must pass "
                         "before the listing goes up)")
    ap.add_argument("--skip-capture", action="store_true", help="images: use the screens cached by the last run")
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
            elif s == "images":
                for x in step_images(t, not a.skip_capture):
                    print(f"  {x.relative_to(REPO)}  {x.stat().st_size / 1_000_000:.1f} MB")
            elif s == "video":
                x = step_video(t, not a.no_fonts)
                print(f"  {x.relative_to(REPO)}  {video_facts(x)}")
            elif s == "pdf":
                for x in step_pdf(t, not a.no_fonts):
                    print(f"  {x.relative_to(REPO)}  {x.stat().st_size / 1_000_000:.2f} MB")
            elif s == "check":
                bad += len(step_check(t, a.base_url, a.prepublish))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
