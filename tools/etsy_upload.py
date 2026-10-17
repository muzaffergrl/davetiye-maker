#!/usr/bin/env python3
"""Upload-ready Etsy listing data for designs 01–21 and the K42 services, built from each listing_v3.md (2026-10-15; 06–20: G123; services: G130).

  python3 tools/etsy_upload.py                      # writes collections/<NN_*>/package/listing/etsy_upload.json, prints a summary
  python3 tools/etsy_upload.py --designs 06-20      # only these designs ("06-20", "07,12", "all")
  python3 tools/etsy_upload.py --check              # writes nothing; exit 1 if a title/tag/text rule fails
  python3 tools/etsy_upload.py --check --strict     # … or if a file Etsy needs (guide PDF, images, video) is missing
  python3 tools/etsy_upload.py --designs services   # only the two service listings (collections/_services/, K42)

Services (G130, K42): "We set it up for you", custom design and the extra design revision are their own listings in collections/_services/<id>/.
They have no theme and no demo; their TRY prices were approved on 2026-10-16 (docs/23 §1), and any undecided
[PLACEHOLDER] left in a description becomes an open check. "all" builds the designs and the services.

The JSON is what a browser session pastes into Etsy's listing editor (docs/20 §8). Nothing is sent to Etsy here.
- `description` is §2 of listing_v3.md with the "[VERIFY: …]" notes taken out; each note goes to `open_checks` with
  its sentence, so the claim stays visible until it is tested. `ready_to_publish` stays false while any check is open.
- Price: 1,460 TL, approved by the user on 2026-10-16 (shop currency TRY, K38; about USD 29.48, docs/23 §1);
  quantity 999, Etsy's maximum (user: no stock limit). Renewal stays null: the user's decision (each renewal costs a fee).
- Images: the rows of §5 with the file's real state, from package/listing/images_editorial/ (the editorial set of
  2026-10-16, tools/listing_editorial.py, docs/21).
- Rules (`rule_problems`, `--check` fails): Etsy's title and tag rules (tools/listing_kit.py), the design's name in the
  title, its own demo link in the description and no other design's, and — for the designs that do not open from an
  envelope (the gatefold, pouch, wallet, book and sleeve of platform/lib/marketing/designs.ts, `openingObject`) — no
  "envelope" in the title, tags, description or alt texts.
- Missing files (the START HERE PDF that Etsy delivers, the listing images, the video) are `blockers`: they keep
  `ready_to_publish` false and fail `--check` only with `--strict` (designs 06–20 have none of them yet, G123).
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

TOOLS = Path(__file__).resolve().parent
sys.path.insert(0, str(TOOLS))
import listing_kit as lk  # noqa: E402
from listing_kit import listing_fields, tag_problems, title_problems  # noqa: E402

REPO = TOOLS.parent
DESIGNS = [
    ("01", "01_Olive_Ivory", "olive-ivory"),
    ("02", "02_Dusty_Blue", "dusty-blue-champagne"),
    ("03", "03_Blush_Garden_Rose", "blush-garden-rose"),
    ("04", "04_Vintage_Airmail", "vintage-airmail-love-letter"),
    ("05", "05_Lemon_Mediterranean", "mediterranean-lemon"),
    ("06", "06_Art_Deco_Noir", "art-deco-black-tie"),
    ("07", "07_Burgundy_Velvet", "burgundy-velvet-autumn"),
    ("08", "08_Winter_Evergreen", "winter-evergreen"),
    ("09", "09_Lavender_Provence", "lavender-provence"),
    ("10", "10_Tuscan_Vineyard", "tuscan-vineyard"),
    ("11", "11_Boho_Pampas", "boho-pampas-terracotta"),
    ("12", "12_Tropical_Destination", "tropical-destination"),
    ("13", "13_Enchanted_Forest", "enchanted-forest-storybook"),
    ("14", "14_Ivory_Lace_Pearl", "ivory-lace-pearls"),
    ("15", "15_Cherry_Blossom", "cherry-blossom-spring"),
    ("16", "16_Sunflower_Rustic", "sunflower-rustic-barn"),
    ("17", "17_Emerald_Gold_Estate", "emerald-gold-estate"),
    ("18", "18_Wildflower_Vellum", "wildflower-meadow-vellum"),
    ("19", "19_Midnight_Garden", "midnight-garden"),
    ("20", "20_Coastal_Seaside", "coastal-seaside"),
    ("21", "21_Crimson_Rose_Atelier", "crimson-rose-atelier"),  # G137; on sale since 2026-10-17 (config.ts "live", G142)
]
PRICE_TRY = 1460
QUANTITY = 999  # Etsy's maximum; the user wants no stock limit (2026-10-16)
# K42 services (G130): (id, TRY price approved 2026-10-16). Rate: 49.53 TRY per USD, BloombergHT 2026-10-16 09:30 (docs/23 §1).
SERVICES = [("setup-service", 500), ("custom-design", 2960), ("extra-revision", 500)]
USD_TRY = 49.53
USD_TRY_SOURCE = "BloombergHT, 2026-10-16 09:30 (USD/TRY 49.5247 buy / 49.5300 sell)"
SERVICE_DIGITAL_FILE = {"setup-service": "SETUP_SERVICE.pdf", "custom-design": "CUSTOM_DESIGN.pdf",
                        "extra-revision": "EXTRA_REVISION.pdf"}
PLACEHOLDER = re.compile(r"\[(?!VERIFY)[A-Z][A-Z /:-]*\]")
VERIFY = re.compile(r"\s*\[VERIFY:\s*([^\]]+)\]")
IMAGES_STATUS = ("current: editorial set of 2026-10-16 (tools/listing_editorial.py, docs/21; real screens of the K29 "
                 "editor, DPR 3 opening stills, GPT mockup scenes for images 1, 2, 4 and 8; listing_v3 §5)")
SERVICE_IMAGES_STATUS = ("current: service set of 2026-10-17 (tools/listing_services.py, G136; GM06 trust scenes, real "
                         "screens of the editor and of our ready designs' openings, no price, QR or web address)")
DESIGN_COPY = REPO / "platform" / "lib" / "marketing" / "designs.ts"
DEMO_LINK = re.compile(r"/start/demo/([a-z0-9-]+)")


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


def images(md: str, listing: Path, status: str = IMAGES_STATUS) -> tuple[list[dict], list[dict]]:
    rows, checks = [], []
    for row in table(section(md, 5)):
        if len(row) < 3 or not row[0].isdigit():
            continue
        name = row[1].strip("`")
        path = listing / lk.UPLOAD_DIR / name
        for note in VERIFY.findall(row[2]):
            checks.append({"where": f"image {row[0]}", "check": note.strip(), "text": ""})
        rows.append({
            "n": int(row[0]),
            "file": str(path.relative_to(REPO)).replace("\\", "/"),
            "alt": VERIFY.sub("", row[2]).strip(),
            "exists": path.exists(),
            "status": status if path.exists() else "missing",
        })
    return rows, checks


def theme_name(theme: str) -> str:
    """The design's name as the platform shows it ("Design: <name>" on /start): platform/themes/<id>/theme.json."""
    return json.loads((REPO / "platform" / "themes" / theme / "theme.json").read_text(encoding="utf-8"))["name"]


def opening_object(theme: str, copy: str | None = None) -> str:
    """What guests tap first ("envelope", "gatefold", "pouch", "wallet", "book", "sleeve"): the opening sentence of the
    design in platform/lib/marketing/designs.ts ("Your guests tap the <thing>.", the sales site's openingObject)."""
    copy = DESIGN_COPY.read_text(encoding="utf-8") if copy is None else copy
    # G137: 21's entry is written with quoted keys ("opening": "…"), the others with bare keys (opening: '…')
    m = re.search(rf"^  '{re.escape(theme)}': \{{.*?(?:\bopening|\"opening\"):\s*['\"]Your guests tap the ([a-z]+)\.", copy,
                  re.S | re.M)
    if not m:
        raise SystemExit(f"{DESIGN_COPY.relative_to(REPO)}: no opening sentence for '{theme}'")
    return m.group(1)


def text_problems(theme: str, name: str, obj: str, title: str | None, tags: list[str], desc: str,
                  alts: list[str]) -> list[str]:
    """Rules beyond Etsy's own: the right design in the title and demo link, and no envelope where there is none."""
    p = []
    if title and name not in title:
        p.append(f"title does not name the design '{name}'")
    demos = set(DEMO_LINK.findall(desc))
    if theme not in demos:
        p.append(f"description has no live demo link /start/demo/{theme}")
    if demos - {theme}:
        p.append(f"description links another design's demo: {', '.join(sorted(demos - {theme}))}")
    if obj != "envelope":
        for where, text in [("title", title or ""), ("tags", " ".join(tags)), ("description", desc)] + \
                [(f"image {i} alt text", a) for i, a in enumerate(alts, 1)]:
            if re.search(r"envelope", text, re.I):
                p.append(f"{where} says 'envelope' but this design opens from a {obj}")
    return p


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
    problems += [f"text: {p}" for p in text_problems(theme, theme_name(theme), opening_object(theme), f["title"],
                                                      f["tags"], desc, [i["alt"] for i in imgs])]
    missing = [i["file"] for i in imgs if not i["exists"]]
    blockers = [f"listing images missing: {', '.join(missing)}"] if missing else []
    if not video.exists():
        blockers.append("listing video missing")
    if not pdf.exists():
        blockers.append(f"digital file missing: {pdf.relative_to(REPO).as_posix()} (the START HERE guide Etsy delivers)")
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
        "price_try": PRICE_TRY,
        "price_usd_approx": round(PRICE_TRY / USD_TRY, 2),
        "price_note": price_note(),
        "quantity": QUANTITY,
        "renewal": None,
        "shop_section": re.sub(r"\s*\(.*\)$", "", attrs.get("Shop section", "")),
        "digital_files": [{"file": f"collections/{folder}/package/customer/START_HERE.pdf",
                           "bytes": pdf.stat().st_size if pdf.exists() else None}],
        "images": imgs,
        "gpt_mockup_scenes": [f"collections/{folder}/assets/gpt/mockups/{m}" for m in mockups],
        "video": {"file": f"collections/{folder}/package/listing/video.mp4", "exists": video.exists()},
        "open_checks": checks,
        "blockers": blockers + ["renewal not decided"],
        "ready_to_publish": False,
        "rule_problems": problems,
    }
    return data, problems


def price_note() -> str:
    return (f"Approved by the user on 2026-10-16 (K42, docs/23 §1). Shop currency TRY (K38): Etsy gets the TL amount; USD "
            f"is approximate, at {USD_TRY} TRY per USD, {USD_TRY_SOURCE}.")


def build_service(sid: str, price_try: int) -> tuple[dict, list[str]]:
    """One K42 service listing (collections/_services/<sid>/): Etsy's title/tag rules, no design demo link, and every
    undecided [PLACEHOLDER] of the description as an open check."""
    listing = REPO / "collections" / "_services" / sid / "package" / "listing"
    md = (listing / "listing_v3.md").read_text(encoding="utf-8")
    f = listing_fields(md)
    desc, checks = description(md)
    attrs, more = attributes(md)
    imgs, img_checks = images(md, listing, SERVICE_IMAGES_STATUS)
    checks += more + img_checks
    for ph in sorted(set(PLACEHOLDER.findall(desc))):
        checks.append({"where": "description", "check": f"decide {ph}", "text": ""})
    problems = [f"title: {p}" for p in title_problems(f["title"])] + [f"tags: {p}" for p in tag_problems(f["tags"])]
    if f["title"] and PLACEHOLDER.search(f["title"]):
        problems.append("text: title holds a placeholder")
    if DEMO_LINK.search(desc):
        problems.append("text: a service listing links a design demo")
    pdf = listing.parent / "customer" / SERVICE_DIGITAL_FILE[sid]
    missing = [i["file"] for i in imgs if not i["exists"]]
    blockers = [f"listing images missing: {', '.join(missing)}"] if missing else []
    if not pdf.exists():
        blockers.append(f"digital file missing: {pdf.relative_to(REPO).as_posix()}")
    data = {
        "service": sid,
        "source": f"collections/_services/{sid}/package/listing/listing_v3.md",
        "title": f["title"],
        "title_length": len(f["title"] or ""),
        "description": desc,
        "tags": f["tags"],
        "category": attrs.get("Category"),
        "attributes": {k: v for k, v in attrs.items() if k not in {"Category", "Price", "Quantity", "Shop section",
                                                                   "Renewal", "Digital file"}},
        "price_try": price_try,
        "price_usd_approx": round(price_try / USD_TRY, 2),
        "price_note": price_note(),
        "quantity": QUANTITY,
        "renewal": None,
        "shop_section": re.sub(r"\s*\(.*\)$", "", attrs.get("Shop section", "")),
        "digital_files": [{"file": pdf.relative_to(REPO).as_posix(), "bytes": pdf.stat().st_size if pdf.exists() else None}],
        "images": imgs,
        "open_checks": checks,
        "blockers": blockers + ["renewal not decided"],
        "ready_to_publish": False,
        "rule_problems": problems,
    }
    return data, problems


def select(spec: str) -> list[tuple[str, str, str]]:
    """'all', '06-20', '07,12' or a mix ('01,06-08') → rows of DESIGNS, in design order."""
    if spec.strip().lower() == "all":
        return list(DESIGNS)
    known = {no for no, _, _ in DESIGNS}
    want: set[str] = set()
    for part in filter(None, (p.strip() for p in spec.split(","))):
        m = re.fullmatch(r"(\d{1,2})(?:-(\d{1,2}))?", part)
        if not m:
            raise SystemExit(f"--designs: cannot read '{part}' (use e.g. 06-20 or 07,12)")
        lo, hi = int(m.group(1)), int(m.group(2) or m.group(1))
        for n in range(lo, hi + 1):
            if f"{n:02d}" not in known:
                raise SystemExit(f"--designs: no design {n:02d} (known: 01–{len(DESIGNS):02d})")
            want.add(f"{n:02d}")
    return [d for d in DESIGNS if d[0] in want]


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--check", action="store_true", help="write nothing; exit 1 on a rule problem")
    ap.add_argument("--strict", action="store_true", help="with --check: a missing guide PDF, image or video fails too")
    ap.add_argument("--designs", default="all", help="'all' (default, designs + services), 'services', '06-20', '07,12' …")
    a = ap.parse_args(argv)
    bad = False
    spec = a.designs.strip().lower()
    for sid, price in SERVICES if spec in {"all", "services"} else []:
        data, problems = build_service(sid, price)
        out = REPO / "collections" / "_services" / sid / "package" / "listing" / "etsy_upload.json"
        if not a.check:
            out.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
        files = [b for b in data["blockers"] if b.startswith(("listing images", "digital file"))]
        have = sum(i["exists"] for i in data["images"])
        # G131: the service's own files show in the line, so a --strict failure is never silent
        print(f"{sid}: title {data['title_length']}/140 · tags {len(data['tags'])}/13 · {price} TL "
              f"(~USD {data['price_usd_approx']}) · images {have}/{len(data['images'])} · "
              f"file {'yes' if data['digital_files'][0]['bytes'] else 'no'} · open checks {len(data['open_checks'])} · "
              f"{'OK' if not problems else 'PROBLEMS: ' + '; '.join(problems)}"
              f"{' · strict: files missing' if a.strict and files else ''}")
        bad |= bool(problems) or (a.strict and bool(files))
    for no, folder, theme in ([] if spec == "services" else select(a.designs)):
        data, problems = build(no, folder, theme)
        out = REPO / "collections" / folder / "package" / "listing" / "etsy_upload.json"
        if not a.check:
            out.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
        have = sum(i["exists"] for i in data["images"])
        files = [b for b in data["blockers"] if b.startswith(("listing images", "listing video", "digital file"))]
        print(f"{no} {theme}: title {data['title_length']}/140 · tags {len(data['tags'])}/13 · "
              f"images {have}/{len(data['images'])} · video {'yes' if data['video']['exists'] else 'no'} · "
              f"guide {'yes' if data['digital_files'][0]['bytes'] else 'no'} · mockups {len(data['gpt_mockup_scenes'])} · "
              f"open checks {len(data['open_checks'])} · {'OK' if not problems else 'PROBLEMS: ' + '; '.join(problems)}")
        bad |= bool(problems) or (a.strict and bool(files))
    return 1 if bad else 0


if __name__ == "__main__":
    raise SystemExit(main())
