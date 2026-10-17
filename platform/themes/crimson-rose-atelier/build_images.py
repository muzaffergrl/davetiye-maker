#!/usr/bin/env python3
"""Crimson Rose Atelier (21) — GPT sources → img/ (docs/11 §5.4; tools/tema_build.py).

The Codex build (G133) made the WebP files of the envelope, seal, rose branch, paper and the sample photos straight from
collections/21_Crimson_Rose_Atelier/assets/gpt/{decor,textures,photos}/ (no PAKET 5 parts: the envelope pieces are cut
in CSS from envelope-closed / envelope-open with clip-path, docs/11 §5.7). This script (G142) adds what the standard asks
of every theme and Codex did not make:
  * neutral photo placeholders ph_*.webp — a soft, toned crop of the theme's own paper texture (no person, no text,
    no flat box; docs/11 §5.4 #6), one per window shape (oval 4:5, album 4:3, venue 16:9);
  * og-1200x630.jpg + favicon.png are kept as made in G133 (their sources are not in the collection);
  * img/manifest.json: photo slots, og, favicon, theme_check table, byte total; folder ≤ 3 MB.

  python3 platform/themes/crimson-rose-atelier/build_images.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image

THEME = Path(__file__).resolve().parent
ROOT = THEME.parents[2]
sys.path.insert(0, str(ROOT / "tools"))
import tema_build as tb  # noqa: E402

COL = ROOT / "collections/21_Crimson_Rose_Atelier"
OUT = THEME / "img"
PAPER = (248, 239, 223)          # --cream

# photo windows (theme.json "aspect"): oval portrait, album leaves, venue band
SLOTS = {"hero_portrait": ("portrait", 4 / 5), "story": ("land", 4 / 3), "venue": ("wide", 16 / 9)}


def main() -> int:
    old = json.loads((OUT / "manifest.json").read_text()) if (OUT / "manifest.json").exists() else {}
    manifest: dict = {"_note": "G142: build_images.py (placeholders + manifest); envelope, seal, rose, paper and sample "
                      "photos are the G133 WebP files of the collection's GPT PNGs."}
    paper = Image.open(COL / "assets/gpt/textures/paper-background.png").convert("RGB")
    w, h = paper.size
    box = (int(w * .1), int(h * .1), int(w * .9), int(h * .9))
    slots = {}
    for key, (shape, ratio) in SLOTS.items():
        ph = tb.yer_tutucu(paper, box, ratio, w=640, ton=PAPER, karisim=.25, bulanik=6)
        tb.webp(ph, f"ph_{shape}", [640], 78, manifest, out=OUT)
        slots[key] = {"placeholder": f"ph_{shape}-640.webp", "aspect": f"{round(ratio * 1000)}/1000"}
    manifest["placeholders"] = slots
    for k in ("og", "favicon", "theme_check"):
        if k in old:
            manifest[k] = old[k]
    old_ph = OUT / "photo-placeholder.webp"
    if old_ph.exists():
        old_ph.unlink()
    manifest["bytes_total"] = tb.klasor_boyutu(THEME)
    tb.manifest_yaz(OUT, manifest)
    print(f"crimson-rose-atelier: {len(slots)} placeholders, theme folder {manifest['bytes_total'] / 1e6:.2f} MB")
    if manifest["bytes_total"] > tb.TEMA_BUTCE:
        print("ERROR: theme folder over 3 MB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
