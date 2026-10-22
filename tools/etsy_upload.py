#!/usr/bin/env python3
"""Upload-ready Etsy listing data for designs 01–48 and the K42 services, built from each listing_v3.md (2026-10-15; 06–20: G123; services: G130; 22–32: G175).

  python3 tools/etsy_upload.py                      # writes collections/<NN_*>/package/listing/etsy_upload.json, prints a summary
  python3 tools/etsy_upload.py --designs 06-20      # only these designs ("06-20", "07,12", "all")
  python3 tools/etsy_upload.py --check              # writes nothing; exit 1 if a title/tag/text rule fails
  python3 tools/etsy_upload.py --check --strict     # … or if a file Etsy needs (guide PDF, images, video) is missing
  python3 tools/etsy_upload.py --designs services   # only the two service listings (collections/_services/, K42)

Designs 22–32 (G175) are "coming" in platform/lib/marketing/config.ts (K41: not for sale): their data is built and
checked the same way, and "sales status coming" plus "price not decided for this design" (config.ts price "[PRICE]")
are blockers, so they never read as ready. Their listing images and video need GPT mockup scenes first (blockers too).

Services (G130, K42): "We set it up for you", custom design and the extra design revision are their own listings in collections/_services/<id>/.
They have no theme and no demo; their TRY prices are K49 (2026-10-22: 990 / 4,490 / 690 TL; docs/23 §1), and any undecided
[PLACEHOLDER] left in a description becomes an open check. "all" builds the designs and the services.

The JSON is what a browser session pastes into Etsy's listing editor (docs/20 §8). Nothing is sent to Etsy here.
- `description` is §2 of listing_v3.md with the "[VERIFY: …]" notes taken out; each note goes to `open_checks` with
  its sentence, so the claim stays visible until it is tested. `ready_to_publish` stays false while any check is open.
  G154 (G090 P0-03): §2 holds no VERIFY note any more (it claims only features that exist and passed G090's local
  checks); the live-site and real-device tests are the unchecked boxes of "Before you publish this listing" (§11),
  and each of them is an open check too ("where": "before publishing").
- Price: 1,190 TL, the launch price approved by the user on 2026-10-22 (K49; shop currency TRY, K38; about USD 24.02, docs/35 §8b) and confirmed
  per design with its sale (21: K47); a coming design (config.ts price "[PRICE]") carries the same figure as the
  proposal and a blocker until it is confirmed;
  quantity 999, Etsy's maximum (user: no stock limit). Renewal stays null: the user's decision (each renewal costs a fee).
- Images: the rows of §5 with the file's real state, from package/listing/images_v4/ when §5 lists the v4 JPGs (docs/20
  §7.10; then the video is video_v4_4x5.mp4), else from package/listing/images_editorial/ (the editorial set of
  2026-10-16, tools/listing_editorial.py, docs/21).
- Rules (`rule_problems`, `--check` fails): Etsy's title and tag rules (tools/listing_kit.py), the design's name in the
  title, its own demo link in the description and no other design's, and — for the designs that do not open from an
  envelope (gatefold, pouch, wallet, book, sleeve, box, curtain, origami, door, dome, wall, lantern of
  platform/lib/marketing/designs.ts, `openingObject`) — no
  "envelope" in the title, tags, description or alt texts.
- Palettes (G153, G178): `variations` (docs/25 §5) with each option's image (palette_<id>.jpg from
  tools/listing_editorial.py --palettes) and `variations.images`, the palette photos that go on the listing after the
  nine (`upload`: the option is offered; the overview once every palette it shows is offered). More than Etsy's 20
  photos per listing is a rule problem; a missing image of an offered option is a blocker.
- Missing files (the START HERE PDF that Etsy delivers, the listing images, the video) are `blockers`: they keep
  `ready_to_publish` false and fail `--check` only with `--strict` (designs 06–20 have none of them yet, G123).
- G175: an undecided [PLACEHOLDER] left in a design's description (as in the services) is an open check.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import unicodedata
from pathlib import Path

TOOLS = Path(__file__).resolve().parent
sys.path.insert(0, str(TOOLS))
import listing_kit as lk  # noqa: E402
from listing_kit import listing_fields, tag_problems, title_problems  # noqa: E402

REPO = TOOLS.parent
DESIGNS = [
    ("49", "49_Ivory_Pearl_Atelier", "ivory-pearl-atelier"),
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
    # G175: designs 22–32, "coming" in config.ts (K41); built and checked, never ready while coming
    ("22", "22_Nocturne_Lake_Estate", "nocturne-lake-estate"),
    ("23", "23_Velvet_Jewel_Box", "velvet-jewel-box"),
    ("24", "24_Grand_Theatre_Premiere", "grand-theatre-premiere"),
    ("25", "25_Orient_Express_Voyage", "orient-express-voyage"),
    ("26", "26_Kintsugi_Washi", "kintsugi-washi"),
    ("27", "27_Riad_Lantern_Nights", "riad-lantern-nights"),
    ("28", "28_Maison_Patisserie", "maison-patisserie"),
    ("29", "29_Celestial_Observatory", "celestial-observatory"),
    ("30", "30_Azulejo_Mosaic", "azulejo-mosaic"),
    ("31", "31_Sky_Lantern_Festival", "sky-lantern-festival"),
    ("32", "32_Music_Box_Ballerina", "music-box-ballerina"),
    # designs 33–48 (third and fourth wave), "coming" in config.ts (K41); built and checked the same way (2026-10-22)
    ("33", "33_Marigold_Mehndi", "marigold-mehndi"),
    ("34", "34_Red_Lacquer_Double_Happiness", "red-lacquer-double-happiness"),
    ("35", "35_Highland_Tartan_Thistle", "highland-tartan-thistle"),
    ("36", "36_Victorian_Glasshouse", "victorian-glasshouse"),
    ("37", "37_Art_Nouveau_Lily", "art-nouveau-lily"),
    ("38", "38_Papel_Picado_Fiesta", "papel-picado-fiesta"),
    ("39", "39_Silver_Photo_Booth", "silver-photo-booth"),
    ("40", "40_Swan_Chantilly_Lace", "swan-chantilly-lace"),
    ("41", "41_Painted_Lily_Pond", "painted-lily-pond"),
    ("42", "42_Espresso_Pastoral", "espresso-pastoral"),
    ("43", "43_Chartreuse_Garden_Party", "chartreuse-garden-party"),
    ("44", "44_Blue_Toile_Pavilion", "blue-toile-pavilion"),
    ("45", "45_Suede_Ranch_Lace", "suede-ranch-lace"),
    ("46", "46_Bordeaux_Silk_Bow", "bordeaux-silk-bow"),
    ("47", "47_Monochrome_Darkroom", "monochrome-darkroom"),
    ("48", "48_Navy_Ivory_Crest", "navy-ivory-crest"),
]
PRICE_TRY = 1190
QUANTITY = 999  # Etsy's maximum; the user wants no stock limit (2026-10-16)
# K42 services (G130): (id, TRY price, K49 2026-10-22). Rate: 49.55 TRY per USD, CNBC-e 2026-10-19 16:05 (docs/23 §1, docs/35).
SERVICES = [("setup-service", 990), ("custom-design", 4490), ("extra-revision", 690)]
USD_TRY = 49.55
USD_TRY_SOURCE = "CNBC-e free market, 2026-10-19 16:05 (USD/TRY 49.5474 buy / 49.5577 sell)"
SERVICE_DIGITAL_FILE = {"setup-service": "SETUP_SERVICE.pdf", "custom-design": "CUSTOM_DESIGN.pdf",
                        "extra-revision": "EXTRA_REVISION.pdf"}
PLACEHOLDER = re.compile(r"\[(?!VERIFY)[A-Z][A-Z /:-]*\]")
VERIFY = re.compile(r"\s*\[VERIFY:\s*([^\]]+)\]")
IMAGES_STATUS = ("current: editorial set of 2026-10-16 (tools/listing_editorial.py, docs/21; real screens of the K29 "
                 "editor, DPR 3 opening stills, GPT mockup scenes for images 1, 2, 4 and 8; listing_v3 §5)")
# G148 (K47): image 9, "continue on any device" (G146), added to the editorial set later
IMAGE9_STATUS = ("current: image 9 of 2026-10-17 (G148; tools/listing_editorial.py --capture devices, real screens of /my "
                 "and Share → Use on another device from a local build with G146; no web address or QR)")
SERVICE_IMAGES_STATUS = ("current: service set of 2026-10-17 (tools/listing_services.py, G136; GM06 trust scenes, real "
                         "screens of the editor and of our ready designs' openings, no price, QR or web address)")
# v4 set (docs/20 §7.10, tools/listing_v4): 19 JPGs in Etsy order + the 4:5 hover video; a §5 that lists .jpg files is a v4 set
V4_DIR = "images_v4"
V4_IMAGES = ["01_cover", "02_reveal", "03_rsvp", "04_edit", "05_pages", "06_included", "07_demo", "08_how", "09_closeup",
             "10_tap", "11_home", "12_devices", "13_laptop", "14_together", "15_print", "16_need", "17_day", "18_replies",
             "19_share"]
V4_VIDEO = "video_v4_4x5.mp4"
V4_STATUS = ("current: v4 set (tools/listing_v4, docs/20 §7.10; 4:5, real screens of the live demo and of a local production "
             "build; images 09–19 on the design's GPT PAKET 7 scenes)")
DESIGN_COPY = REPO / "platform" / "lib" / "marketing" / "designs.ts"
CONFIG = REPO / "platform" / "lib" / "marketing" / "config.ts"
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


def before_publishing(md: str) -> list[dict]:
    """G154: the unchecked boxes ("- [ ] …") of "Before you publish this listing", as open checks."""
    m = re.search(r"^## \d+\. Before you publish this listing\s*$(.*?)(?=^## |\Z)", md, re.S | re.M)
    if not m:
        return []
    return [{"where": "before publishing", "check": line[len("- [ ] "):].strip(), "text": ""}
            for line in m.group(1).splitlines() if line.startswith("- [ ] ")]


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
        v4 = name.endswith(".jpg")
        path = listing / (V4_DIR if v4 else lk.UPLOAD_DIR) / name
        for note in VERIFY.findall(row[2]):
            checks.append({"where": f"image {row[0]}", "check": note.strip(), "text": ""})
        rows.append({
            "n": int(row[0]),
            "file": str(path.relative_to(REPO)).replace("\\", "/"),
            "alt": VERIFY.sub("", row[2]).strip(),
            "exists": path.exists(),
            "status": (V4_STATUS if v4 else IMAGE9_STATUS if name == "09_devices.png" and status == IMAGES_STATUS else status)
            if path.exists() else "missing",
        })
    return rows, checks


def commerce(theme: str, config: str | None = None) -> dict[str, str]:
    """G175: the design's sales status and price in platform/lib/marketing/config.ts ({"status": "live"|"preview"|"coming",
    "price": …}). "preview" (main f1228e88) is in the site catalogue but, like "coming", not for sale (K41)."""
    config = CONFIG.read_text(encoding="utf-8") if config is None else config
    m = re.search(rf"id: '{re.escape(theme)}',\s*\n\s*name: '[^']+',\s*\n\s*status: '(live|preview|coming)',\s*\n(?:\s*featured: \w+,\s*\n)?\s*price: '([^']*)'",
                  config)
    if not m:
        raise SystemExit(f"{CONFIG.relative_to(REPO)}: no status/price for '{theme}'")
    return {"status": m.group(1), "price": m.group(2)}


def planned_images(listing: Path) -> list[dict]:
    """G175: the editorial upload set (listing_kit.UPLOAD_IMAGES) for a listing whose §5 has no image table yet."""
    out = []
    for n, name in enumerate(lk.UPLOAD_IMAGES, 1):
        path = listing / lk.UPLOAD_DIR / f"{name}.png"
        out.append({"n": n, "file": str(path.relative_to(REPO)).replace("\\", "/"), "alt": None, "exists": path.exists(),
                    "status": "missing (planned; alt text not written yet)" if not path.exists() else "present, no alt text"})
    return out


def theme_name(theme: str) -> str:
    """The design's name as the platform shows it ("Design: <name>" on /start): platform/themes/<id>/theme.json."""
    return json.loads((REPO / "platform" / "themes" / theme / "theme.json").read_text(encoding="utf-8"))["name"]


def opening_object(theme: str, copy: str | None = None) -> str:
    """What guests tap first ("envelope", "gatefold", "pouch", "wallet", "book", "sleeve"): the opening sentence of the
    design in platform/lib/marketing/designs.ts ("Your guests tap the <thing>.", the sales site's openingObject)."""
    copy = DESIGN_COPY.read_text(encoding="utf-8") if copy is None else copy
    # G137: 21's entry was written with quoted keys ("opening": "…"), the others with bare keys (opening: '…');
    # G144: the sentence is wrapped for translation (opening: msg('…'))
    m = re.search(rf"^  '{re.escape(theme)}': \{{.*?(?:\bopening|\"opening\"):\s*(?:msg\(\s*)?['\"]Your guests tap the ([a-z]+)\.", copy,
                  re.S | re.M)
    if not m:
        raise SystemExit(f"{DESIGN_COPY.relative_to(REPO)}: no opening sentence for '{theme}'")
    return m.group(1)


def fold(text: str) -> str:
    """Without accents (G175: Etsy buyers search "patisserie"; the title may drop the design name's accent)."""
    return "".join(c for c in unicodedata.normalize("NFKD", text) if not unicodedata.combining(c))


def text_problems(theme: str, name: str, obj: str, title: str | None, tags: list[str], desc: str,
                  alts: list[str]) -> list[str]:
    """Rules beyond Etsy's own: the right design in the title and demo link, and no envelope where there is none."""
    p = []
    if title and fold(name) not in fold(title):  # G175: "Maison Patisserie" names "Maison Pâtisserie"
        p.append(f"title does not name the design '{name}'")
    demos = set(DEMO_LINK.findall(desc))
    if theme not in demos:
        p.append(f"description has no live demo link /start/demo/{theme}")
    if demos - {theme}:
        p.append(f"description links another design's demo: {', '.join(sorted(demos - {theme}))}")
    if obj != "envelope":
        for where, text in [("title", title or ""), ("tags", " ".join(tags)), ("description", desc)] + \
                [(f"image {i} alt text", a or "") for i, a in enumerate(alts, 1)]:
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
    if not imgs:  # G175: a coming design's §5 plans the set without alt texts (written against the finished files)
        imgs = planned_images(listing)
        checks.append({"where": "images", "check": "write the alt texts of listing_v3 §5 against the produced images",
                       "text": ""})
    checks += more + img_checks + before_publishing(md)
    for ph in sorted(set(PLACEHOLDER.findall(desc))):  # G175 (as in the services)
        checks.append({"where": "description", "check": f"decide {ph}", "text": ""})
    sale = commerce(theme)
    pdf = coll / "package" / "customer" / "START_HERE.pdf"
    v4 = any(f"/{V4_DIR}/" in i["file"] for i in imgs)
    video = listing / (V4_VIDEO if v4 else "video.mp4")
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
    if sale["status"] != "live":  # G175 (K41): 'coming' or 'preview' is not for sale; the price is confirmed with the sale
        blockers.append(f"sales status '{sale['status']}' in platform/lib/marketing/config.ts (K41: not for sale)")
    if sale["price"] != str(PRICE_TRY):
        blockers.append(f"price not decided for this design (config.ts price '{sale['price']}'; "
                        f"{PRICE_TRY} TL is the 01–21 design price, docs/23 §1)")
    variations, palette_problems = palette_variations(theme)
    problems += [f"variations: {p}" for p in palette_problems]
    if variations and len(variations["offered"]) > 1:
        checks.append({"where": "variations", "check": PALETTE_CHECK, "text": ""})
    if variations:  # G178: the palette photos that go on the listing
        upload = [i for i in variations["images"] if i["upload"]]
        if len(imgs) + len(upload) > ETSY_MAX_IMAGES:
            problems.append(f"images: {len(imgs)} listing images + {len(upload)} palette images > Etsy's "
                            f"{ETSY_MAX_IMAGES} photos per listing")
        gone = [i["file"] for i in upload if not i["exists"]]
        if gone:
            blockers.append(f"palette images missing: {', '.join(gone)}")
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
        "price_note": price_note() if sale["price"] == str(PRICE_TRY) else
        f"Proposed: the design price of 01–21, not confirmed for this design (config.ts '{sale['price']}'). " + price_note(),
        "quantity": QUANTITY,
        "renewal": None,
        "sales_status": sale["status"],
        "shop_section": re.sub(r"\s*\(.*\)$", "", attrs.get("Shop section", "")),
        "digital_files": [{"file": f"collections/{folder}/package/customer/START_HERE.pdf",
                           "bytes": pdf.stat().st_size if pdf.exists() else None}],
        "images": imgs,
        "gpt_mockup_scenes": [f"collections/{folder}/assets/gpt/mockups/{m}" for m in mockups],
        "video": {"file": f"collections/{folder}/package/listing/{video.name}", "exists": video.exists()},
        "open_checks": checks,
        "blockers": blockers + ["renewal not decided"],
        "ready_to_publish": False,
        "rule_problems": problems,
    }
    if variations:  # G153 (docs/25 §5): only for a design with color palettes
        data["variations"] = variations
    return data, problems


PALETTE_PROPERTY = "Color palette"
PALETTE_DOC = "docs/25_PALET_VARYANTLARI.md §5"
PALETTE_CHECK = ("Etsy listing editor: confirm a digital listing accepts the custom variation 'Color palette' (same price "
                 "for every option); if it does not, use the fallback of docs/25 §5 (no variation, palette chosen on /start)")


PALETTE_IMAGES_STATUS = ("G178: tools/listing_editorial.py --palettes (real DPR 3 screens of the opening in each palette, "
                         "local production build; docs/25 §5)")
ETSY_MAX_IMAGES = 20  # photos per listing (Etsy Help "How to Create a Listing", checked 2026-10-17; plus 2 videos)


def palette_image(theme: str, variant: str | None, gpt: list[str]) -> dict:
    """G178: the listing image of one palette option (palette_<id>.jpg; palette_original.jpg for the original). A palette
    whose parts still wait for GPT has none (it stays coming)."""
    folder = next((f for _, f, t in DESIGNS if t == theme), None)
    if gpt or folder is None:
        return {"image": None, "image_note": f"waits for GPT parts: {', '.join(gpt)}" if gpt else "no listing folder"}
    path = REPO / "collections" / folder / "package" / "listing" / lk.UPLOAD_DIR / f"palette_{variant or 'original'}.jpg"
    return {"image": path.relative_to(REPO).as_posix(), "image_exists": path.exists()}


def palette_listing_images(theme: str, options: list[dict]) -> list[dict]:
    """G178: the palette photos to add after the nine listing images: the overview (10_palettes.jpg, every palette that
    has an image) once every palette it shows is offered, and each offered option's own image (Etsy shows it when the
    buyer picks the option; a photo must be on the listing before it can be attached)."""
    folder = next((f for _, f, t in DESIGNS if t == theme), None)
    if folder is None:
        return []
    shown = [o for o in options if o.get("image")]
    overview = REPO / "collections" / folder / "package" / "listing" / lk.UPLOAD_DIR / "10_palettes.jpg"
    out = [{"file": overview.relative_to(REPO).as_posix(), "exists": overview.exists(), "option": None,
            "upload": len(shown) > 1 and all(o["offered"] for o in shown),
            "alt": f"{theme_name(theme)} in {len(shown)} color palettes: the opening page of each, side by side",
            "status": PALETTE_IMAGES_STATUS if overview.exists() else "missing"}]
    for o in shown:
        out.append({"file": o["image"], "exists": o["image_exists"], "option": o["name"],
                    "upload": o["offered"] and sum(x["offered"] for x in options) > 1,
                    "alt": (f"{theme_name(theme)} in its original palette" if o["variant"] is None else
                            f"{theme_name(theme)} in the {o['name']} palette") + ": the opening page closed and opening",
                    "status": PALETTE_IMAGES_STATUS if o["image_exists"] else "missing"})
    return out


def palette_variations(theme: str) -> tuple[dict | None, list[str]]:
    """G153: one listing per design with a "Color palette" variation (docs/25 §5). Options come from the theme's own
    theme.json "variants": the original first, every palette after it; only "live" ones are offered on Etsy, "coming" ones
    are listed (offered: false) so the structure is ready when the coordinator flips them. None without palettes."""
    tj = REPO / "platform" / "themes" / theme / "theme.json"
    data = json.loads(tj.read_text(encoding="utf-8")) if tj.exists() else {}
    variants = data.get("variants") or []
    if not variants:
        return None, []
    original = f"Original ({data.get('name', theme)})"
    # G178: each option's listing image (tools/listing_editorial.py --palettes), attached to the option in Etsy's editor
    gpt = {p["id"]: p["gpt"] for p in lk.palettes(lk.THEMES[theme])} if theme in lk.THEMES else {}
    options = [dict({"name": original, "variant": None, "status": "live", "offered": True,
                     "start_link": f"/start?theme={theme}"}, **palette_image(theme, None, []))]
    for v in variants:
        options.append(dict({"name": v.get("name"), "variant": v.get("id"), "status": v.get("status"),
                             "offered": v.get("status") == "live",
                             "start_link": f"/start?theme={theme}&variant={v.get('id')}"},
                            **palette_image(theme, v.get("id"), gpt.get(v.get("id"), []))))
    problems = []
    names = [o["name"] for o in options]
    if len(set(n.lower() for n in names if n)) != len(names):
        problems.append("palette option names repeat")
    for o in options:
        if not o["name"] or len(o["name"]) > 40:
            problems.append(f"palette option name must be 1–40 characters: {o['name']!r}")
        if o["status"] not in ("live", "coming"):
            problems.append(f"palette {o['variant']}: status must be live or coming")
    return {
        "structure": "one listing, variation 'Color palette' (same price)",
        "doc": PALETTE_DOC,
        "property": PALETTE_PROPERTY,
        "price_varies": False,
        "options": options,
        "offered": [o["name"] for o in options if o["offered"]],
        "images": palette_listing_images(theme, options),
        "fallback": ("No variation: the listing names the palettes in the description and shows them on one image; the "
                     "buyer picks the palette on /start (the START HERE link) and can switch it in the editor."),
    }, problems


def price_note() -> str:
    return (f"Approved by the user on 2026-10-22 (K49 launch price, docs/35 §8b). Shop currency TRY (K38): Etsy gets the TL amount; USD "
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
        files = [b for b in data["blockers"] if b.startswith(("listing images", "listing video", "digital file",
                                                              "palette images"))]
        pal = [i for i in data.get("variations", {}).get("images", []) if i["exists"]]
        print(f"{no} {theme}: title {data['title_length']}/140 · tags {len(data['tags'])}/13 · "
              f"images {have}/{len(data['images'])}{f' (+{len(pal)} palette)' if pal else ''} · video {'yes' if data['video']['exists'] else 'no'} · "
              f"guide {'yes' if data['digital_files'][0]['bytes'] else 'no'} · mockups {len(data['gpt_mockup_scenes'])} · "
              f"open checks {len(data['open_checks'])} · {'OK' if not problems else 'PROBLEMS: ' + '; '.join(problems)}")
        bad |= bool(problems) or (a.strict and bool(files))
    return 1 if bad else 0


if __name__ == "__main__":
    raise SystemExit(main())
