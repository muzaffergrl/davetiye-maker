#!/usr/bin/env python3
"""Upload-ready Etsy listing data for designs 01–05, built from each design's listing_v3.md (2026-10-15).

  python3 tools/etsy_upload.py            # writes collections/<NN_*>/package/listing/etsy_upload.json, prints a summary
  python3 tools/etsy_upload.py --check    # writes nothing; exit 1 if a title/tag rule fails or a file is missing

The JSON is what a browser session pastes into Etsy's listing editor (docs/20 §8). Nothing is sent to Etsy here.
- `description` is §2 of listing_v3.md with the "[VERIFY: …]" notes taken out; each note goes to `open_checks` with
  its sentence, so the claim stays visible until it is tested. `ready_to_publish` stays false while any check is open.
- Price is the draft price the user gave on 2026-10-15 (USD 29.40, "for now"); quantity and renewal stay null:
  they are the user's decision (renewal costs a listing fee).
- Images: the rows of §5 with the file's real state. All five designs were rebuilt on 2026-10-15 with the current
  editor (K29) by `tools/listing_kit.py capture` + `images`: real screens, in GPT's mockup scenes for images 1, 2, 8.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

TOOLS = Path(__file__).resolve().parent
sys.path.insert(0, str(TOOLS))
from listing_kit import listing_fields, tag_problems, title_problems  # noqa: E402

REPO = TOOLS.parent
DESIGNS = [
    ("01", "01_Olive_Ivory", "olive-ivory"),
    ("02", "02_Dusty_Blue", "dusty-blue-champagne"),
    ("03", "03_Blush_Garden_Rose", "blush-garden-rose"),
    ("04", "04_Vintage_Airmail", "vintage-airmail-love-letter"),
    ("05", "05_Lemon_Mediterranean", "mediterranean-lemon"),
]
PRICE_USD = 29.40
PRICE_NOTE = "Draft price from the user on 2026-10-15 ('for now'); final price is still a decision (docs/15 §5)."
VERIFY = re.compile(r"\s*\[VERIFY:\s*([^\]]+)\]")
IMAGES_STATUS = ("current: rebuilt 2026-10-15 with the K29 editor (tools/listing_kit.py capture + images; real screens, "
                 "GPT mockup scenes for images 1, 2 and 8; listing_v3 §5)")


def section(md: str, no: int) -> str:
    m = re.search(rf"^## {no}\. .*?$(.*?)(?=^## \d+\. |\Z)", md, re.S | re.M)
    if not m:
        raise SystemExit(f"no section {no}")
    return m.group(1)


def description(md: str) -> tuple[str, list[dict]]:
    """§2 between its two '---' lines; VERIFY notes removed and returned with their sentence."""
    body = section(md, 2).split("\n---\n")
    if len(body) < 3:
        raise SystemExit("description is not between two '---' lines")
    text, checks = [], []
    for line in body[1].strip("\n").splitlines():
        for note in VERIFY.findall(line):
            checks.append({"where": "description", "check": note.strip(), "text": VERIFY.sub("", line).strip()})
        text.append(VERIFY.sub("", line).rstrip())
    return "\n".join(text).strip(), checks


def table(block: str) -> list[list[str]]:
    rows = []
    for line in block.splitlines():
        if line.startswith("|") and not re.match(r"^\|[\s|:-]+\|$", line):
            rows.append([c.strip() for c in line.strip("|").split("|")])
    return rows[1:]  # without the header


def attributes(md: str) -> tuple[dict, list[dict]]:
    sec = section(md, 4)
    checks = [{"where": "attributes", "check": n.strip(), "text": ""} for n in VERIFY.findall(sec.split("|")[0])]
    out = {}
    for field, value in table(sec):
        for note in VERIFY.findall(value):
            checks.append({"where": f"attributes.{field}", "check": note.strip(), "text": ""})
        out[field] = VERIFY.sub("", value).strip()
    return out, checks


def images(md: str, listing: Path) -> tuple[list[dict], list[dict]]:
    rows, checks = [], []
    for row in table(section(md, 5)):
        if len(row) < 3 or not row[0].isdigit():
            continue
        name = row[1].strip("`")
        path = listing / "images" / name
        for note in VERIFY.findall(row[2]):
            checks.append({"where": f"image {row[0]}", "check": note.strip(), "text": ""})
        rows.append({
            "n": int(row[0]),
            "file": str(path.relative_to(REPO)).replace("\\", "/"),
            "alt": VERIFY.sub("", row[2]).strip(),
            "exists": path.exists(),
            "status": IMAGES_STATUS if path.exists() else "missing",
        })
    return rows, checks


def build(no: str, folder: str, theme: str) -> tuple[dict, list[str]]:
    coll = REPO / "collections" / folder
    listing = coll / "package" / "listing"
    md = (listing / "listing_v3.md").read_text(encoding="utf-8")
    f = listing_fields(md)
    desc, checks = description(md)
    attrs, more = attributes(md)
    imgs, img_checks = images(md, listing)
    checks += more + img_checks
    pdf = coll / "package" / "customer" / "START_HERE.pdf"
    video = listing / "video.mp4"
    mockups = sorted(p.name for p in (coll / "assets" / "gpt" / "mockups").glob("*.png"))
    problems = [f"title: {p}" for p in title_problems(f["title"])] + [f"tags: {p}" for p in tag_problems(f["tags"])]
    if not pdf.exists():
        problems.append(f"missing digital file {pdf.relative_to(REPO)}")
    missing = [i["file"] for i in imgs if not i["exists"]]
    blockers = [f"listing images missing: {', '.join(missing)}"] if missing else []
    if not video.exists():
        blockers.append("listing video missing")
    data = {
        "design": no,
        "theme": theme,
        "source": f"collections/{folder}/package/listing/listing_v3.md",
        "title": f["title"],
        "title_length": len(f["title"] or ""),
        "description": desc,
        "tags": f["tags"],
        "category": attrs.get("Category"),
        "attributes": {k: v for k, v in attrs.items() if k not in {"Category", "Price", "Quantity", "Shop section",
                                                                   "Renewal", "Digital file"}},
        "price_usd": PRICE_USD,
        "price_note": PRICE_NOTE,
        "quantity": None,
        "renewal": None,
        "shop_section": re.sub(r"\s*\(.*\)$", "", attrs.get("Shop section", "")),
        "digital_files": [{"file": f"collections/{folder}/package/customer/START_HERE.pdf",
                           "bytes": pdf.stat().st_size if pdf.exists() else None}],
        "images": imgs,
        "gpt_mockup_scenes": [f"collections/{folder}/assets/gpt/mockups/{m}" for m in mockups],
        "video": {"file": f"collections/{folder}/package/listing/video.mp4", "exists": video.exists()},
        "open_checks": checks,
        "blockers": blockers + ["quantity and renewal not decided", "final price not decided"],
        "ready_to_publish": False,
        "rule_problems": problems,
    }
    return data, problems


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--check", action="store_true", help="write nothing; exit 1 on a rule problem")
    a = ap.parse_args()
    bad = False
    for no, folder, theme in DESIGNS:
        data, problems = build(no, folder, theme)
        out = REPO / "collections" / folder / "package" / "listing" / "etsy_upload.json"
        if not a.check:
            out.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
        have = sum(i["exists"] for i in data["images"])
        print(f"{no} {theme}: title {data['title_length']}/140 · tags {len(data['tags'])}/13 · "
              f"images {have}/{len(data['images'])} · mockups {len(data['gpt_mockup_scenes'])} · "
              f"open checks {len(data['open_checks'])} · {'OK' if not problems else 'PROBLEMS: ' + '; '.join(problems)}")
        bad |= bool(problems)
    return 1 if bad else 0


if __name__ == "__main__":
    raise SystemExit(main())
