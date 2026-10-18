"""tools/etsy_upload.py tests (G123: designs 06–20 added to the Etsy upload data; G175: 22–32, "coming").

  python3 tools/tests/test_etsy_upload.py

Covered: the design table against the platform (20 designs, the collection folders of designs.ts, the live designs of
config.ts, every theme folder), the opening object read from designs.ts (six designs open from something other than
an envelope), the text rules (design name in the title, its own demo link, no other design's demo, no "envelope" for a
gatefold/pouch/wallet/book/sleeve design), `--designs` parsing, and every real listing_v3.md: Etsy's title and tag
rules, the honesty rules of test_listing_kit (US spelling, no trademark tag, one "Wedding" in the title, headings and
English named, the approved price and quantity), the eight editorial image rows in order, VERIFY notes moved out of the
description, and the committed etsy_upload.json equal to what the tool builds now. Nothing is written.
"""
import json
import re
import sys
from pathlib import Path

TOOLS = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(TOOLS))
import etsy_upload as eu  # noqa: E402
import listing_kit as lk  # noqa: E402

REPO = TOOLS.parent
NOT_ENVELOPE = {"art-deco-black-tie": "gatefold", "lavender-provence": "pouch", "tropical-destination": "wallet",
                "enchanted-forest-storybook": "book", "ivory-lace-pearls": "gatefold",
                "wildflower-meadow-vellum": "sleeve",
                # G175: designs 22–32 (22 opens from an envelope)
                "velvet-jewel-box": "box", "grand-theatre-premiere": "curtain", "orient-express-voyage": "wallet",
                "kintsugi-washi": "origami", "riad-lantern-nights": "door", "maison-patisserie": "box",
                "celestial-observatory": "dome", "azulejo-mosaic": "wall", "sky-lantern-festival": "lantern",
                "music-box-ballerina": "box"}
# G142: design 21 opened for sale (config.ts "live"); G175: 22–32 are "coming" (K41) — remove a design here when it opens
COMING: set[str] = {"nocturne-lake-estate", "velvet-jewel-box", "grand-theatre-premiere", "orient-express-voyage",
                    "kintsugi-washi", "riad-lantern-nights", "maison-patisserie", "celestial-observatory",
                    "azulejo-mosaic", "sky-lantern-festival", "music-box-ballerina"}


def test_design_table():
    nos = [no for no, _, _ in eu.DESIGNS]
    assert nos == [f"{i:02d}" for i in range(1, 33)], nos
    copy = (REPO / "platform" / "lib" / "marketing" / "designs.ts").read_text(encoding="utf-8")
    config = (REPO / "platform" / "lib" / "marketing" / "config.ts").read_text(encoding="utf-8")
    live = set(re.findall(r"id: '([a-z0-9-]+)',\s*\n\s*name: '[^']+',\s*\n\s*status: 'live'", config))
    every = {t for _, _, t in eu.DESIGNS}
    assert live == every - COMING, sorted(live ^ (every - COMING))
    for theme in COMING:  # same TS style as the other entries since G142
        assert re.search(rf"id: '{re.escape(theme)}',\s*\n\s*name: '[^']+',\s*\n\s*status: 'coming'", config), theme
    for no, folder, theme in eu.DESIGNS:
        assert folder.startswith(no + "_") and (REPO / "collections" / folder).is_dir(), folder
        assert (REPO / "platform" / "themes" / theme / "theme.json").exists(), theme
        m = re.search(rf"^  '{re.escape(theme)}': \{{\s*\n\s*[\"']?id[\"']?: [\"']{re.escape(theme)}[\"'],\s*\n"
                      rf"\s*[\"']?collection[\"']?: [\"']([^'\"]+)[\"']", copy, re.M)
        assert m and m.group(1) == folder, (theme, m and m.group(1), folder)


def test_opening_object():
    found = {t: eu.opening_object(t) for _, _, t in eu.DESIGNS}
    assert {t: o for t, o in found.items() if o != "envelope"} == NOT_ENVELOPE, found
    copy = "  'x-theme': {\n    id: 'x-theme',\n    opening:\n      'Your guests tap the lantern. It glows.',\n  },\n"
    assert eu.opening_object("x-theme", copy) == "lantern"
    try:
        eu.opening_object("y-theme", copy)
    except SystemExit:
        pass
    else:
        raise AssertionError("a theme without an opening sentence was accepted")


def test_text_rules():
    demo = "See it: https://example.test/start/demo/x-theme"
    ok = eu.text_problems("x-theme", "X Theme", "gatefold", "X Theme Wedding Website, Gatefold Opening", ["gatefold"],
                          demo, ["three phones show the gatefold closed"])
    assert ok == [], ok
    p = eu.text_problems("x-theme", "X Theme", "gatefold", "X Theme Wedding Website, Envelope Opening",
                         ["envelope invitation"], demo + " The ENVELOPE opens.", ["the envelope opening"])
    assert sum("says 'envelope'" in x for x in p) == 4, p  # title, tags, description, alt text 1
    assert eu.text_problems("x-theme", "X Theme", "envelope", "X Theme, Envelope Opening", ["envelope invitation"],
                            demo + " The envelope opens.", ["the envelope opening"]) == []
    p = eu.text_problems("x-theme", "Other Name", "envelope", "X Theme Wedding Website", [], "no link here", [])
    assert any("does not name" in x for x in p) and any("no live demo link" in x for x in p), p
    p = eu.text_problems("x-theme", "X Theme", "envelope", "X Theme", [], demo + " and /start/demo/y-theme", [])
    assert p == ["description links another design's demo: y-theme"], p


def test_select():
    assert [d[0] for d in eu.select("06-20")] == [f"{i:02d}" for i in range(6, 21)]
    assert [d[0] for d in eu.select("12,7")] == ["07", "12"]
    assert [d[0] for d in eu.select("01,06-08")] == ["01", "06", "07", "08"]
    assert len(eu.select("all")) == 32
    for bad in ("33", "6-x", "00", "01-35"):
        try:
            eu.select(bad)
        except SystemExit:
            continue
        raise AssertionError(f"accepted --designs {bad}")


def test_real_listings():
    for no, folder, theme in eu.DESIGNS:
        listing = REPO / "collections" / folder / "package" / "listing"
        md = (listing / "listing_v3.md").read_text(encoding="utf-8")
        data, problems = eu.build(no, folder, theme)
        assert problems == [], (no, problems)
        f = lk.listing_fields(md)
        m = re.search(r"This title: (\d+) characters", md)
        assert m and int(m.group(1)) == len(f["title"]) <= 140, (no, m and m.group(1), len(f["title"]))
        assert f["title"].count("Wedding") <= 1, (no, f["title"])
        assert len(f["tags"]) == 13 and all(len(t) <= 20 for t in f["tags"]), (no, f["tags"])
        assert "evite" not in " ".join(f["tags"]), no  # Evite is a trademark
        low = md.lower()
        assert "colour" not in low and "personalis" not in low, (no, "US spelling")
        assert "headings" in low and "english" in low, no
        assert "[QUANTITY]" not in md and "| Quantity | 999" in md, no  # decided 2026-10-16: no stock limit
        assert "[VERIFY" not in data["description"] and data["open_checks"], no
        assert f"/start/demo/{theme}" in data["description"], no
        names = [i["file"].rsplit("/", 1)[1] for i in data["images"]]
        if theme in COMING:  # G175: the planned set (8 rows written before image 9, or all 9 without alt texts)
            assert names == [f"{n}.png" for n in lk.UPLOAD_IMAGES][:len(names)] and len(names) >= 8, no
            assert not any(i["exists"] for i in data["images"]) and any(
                b.startswith("listing images missing") for b in data["blockers"]), no
        else:
            assert names == [f"{n}.png" for n in lk.UPLOAD_IMAGES], no
        assert data["ready_to_publish"] is False and data["price_try"] == eu.PRICE_TRY == 1460, no
        assert data["quantity"] == 999, no
        if theme in COMING:  # G175 (K41): not for sale, price confirmed with the sale; both are blockers
            assert data["sales_status"] == "coming" and "[PRICE]" in md and "| Price | **1,460 TL**" not in md, no
            assert any(b.startswith("sales status 'coming'") for b in data["blockers"]), no
            assert any(b.startswith("price not decided") for b in data["blockers"]), no
            assert data["price_note"].startswith("Proposed:"), no
        else:
            assert data["sales_status"] == "live" and "| Price | **1,460 TL**" in md, no
            assert not any(b.startswith(("sales status", "price not decided")) for b in data["blockers"]), no
        if theme in NOT_ENVELOPE:
            text = " ".join([f["title"], *f["tags"], data["description"], *(i["alt"] or "" for i in data["images"])])
            assert "envelope" not in text.lower(), no
            assert NOT_ENVELOPE[theme] in data["description"], no
        missing_guide = not (REPO / "collections" / folder / "package" / "customer" / "START_HERE.pdf").exists()
        assert missing_guide == any(b.startswith("digital file missing") for b in data["blockers"]), no
        committed = json.loads((listing / "etsy_upload.json").read_text(encoding="utf-8"))
        assert committed == data, (no, "etsy_upload.json is out of date: python3 tools/etsy_upload.py --designs " + no)


def test_services():
    """G130 (K42): the two service listings — Etsy rules, TRY proposal, undecided fields kept as open checks."""
    assert [sid for sid, _ in eu.SERVICES] == ["setup-service", "custom-design", "extra-revision"]
    for sid, price in eu.SERVICES:
        listing = REPO / "collections" / "_services" / sid / "package" / "listing"
        md = (listing / "listing_v3.md").read_text(encoding="utf-8")
        data, problems = eu.build_service(sid, price)
        assert problems == [], (sid, problems)
        f = lk.listing_fields(md)
        m = re.search(r"This title: (\d+) characters", md)
        assert m and int(m.group(1)) == len(f["title"]) <= 140, sid
        assert f["title"].count("Wedding") <= 1, (sid, f["title"])
        assert len(f["tags"]) == 13 and all(len(t) <= 20 for t in f["tags"]), (sid, f["tags"])
        assert "/start/demo/" not in data["description"] and "[VERIFY" not in data["description"], sid
        assert not eu.PLACEHOLDER.search(data["description"]), sid  # K42 decisions filled in (2026-10-16)
        assert "within 3 days" in data["description"] and data["quantity"] == 999, sid
        assert "No returns" in data["description"] and "24 hours" in data["description"], sid  # K36, K37
        assert data["price_try"] == price and abs(data["price_usd_approx"] - price / eu.USD_TRY) < 0.01, sid
        assert data["ready_to_publish"] is False and "renewal not decided" in data["blockers"], sid
        committed = json.loads((listing / "etsy_upload.json").read_text(encoding="utf-8"))
        assert committed == data, (sid, "etsy_upload.json is out of date: python3 tools/etsy_upload.py --designs services")
    custom = eu.build_service("custom-design", 2960)[0]["description"]
    assert "2 rounds of changes" in custom and "500 TL" in custom and "includes the design" in custom
    assert "never sell it" in custom  # exclusive (2026-10-16)
    extra = eu.build_service("extra-revision", 500)[0]["description"]
    assert "only for couples who already ordered a custom design" in extra and "One purchase = one round" in extra


def test_check_exit():
    assert eu.main(["--check"]) == 0
    # --strict counts the files Etsy needs of every listing that "all" builds: the 32 designs and (G130) the services
    files = ("listing images", "listing video", "digital file")
    missing = {no: any(b.startswith(files) for b in eu.build(no, folder, theme)[0]["blockers"])
               for no, folder, theme in eu.DESIGNS}
    designs_missing = any(missing.values())
    services_missing = any(b.startswith(files) for sid, price in eu.SERVICES
                           for b in eu.build_service(sid, price)[0]["blockers"])
    assert eu.main(["--check", "--strict"]) == (1 if designs_missing or services_missing else 0)
    first20 = any(v for no, v in missing.items() if no <= "20")
    assert eu.main(["--check", "--strict", "--designs", "01-20"]) == (1 if first20 else 0)
    assert eu.main(["--check", "--strict", "--designs", "21"]) == (1 if missing["21"] else 0)
    assert eu.main(["--check", "--strict", "--designs", "services"]) == (1 if services_missing else 0)
    assert eu.main(["--check", "--designs", "22-32"]) == 0  # G175: rules green although the GPT files are missing
    assert eu.main(["--check", "--strict", "--designs", "22-32"]) == 1


def main():
    for test in (test_design_table, test_opening_object, test_text_rules, test_select, test_real_listings,
                 test_services, test_check_exit):
        test()
        print(f"  {test.__name__}: ok")
    print("test_etsy_upload: ok")


if __name__ == "__main__":
    main()


def test_palette_variations_g153():
    """G153: one listing + 'Colour palette' variation from theme.json; only live palettes are offered."""
    import etsy_upload as m
    v, problems = m.palette_variations("crimson-rose-atelier")
    assert problems == []
    assert v["property"] == "Color palette" and v["price_varies"] is False
    assert v["options"][0] == {"name": "Original (Crimson Rose Atelier)", "variant": None, "status": "live", "offered": True,
                               "start_link": "/start?theme=crimson-rose-atelier"}
    assert len(v["options"]) == 6
    assert v["offered"] == [o["name"] for o in v["options"] if o["status"] == "live"]
    assert all(o["start_link"].endswith(f"&variant={o['variant']}") for o in v["options"][1:])
    assert m.palette_variations("_sample") == (None, [])  # no palettes (internal sample theme)
    data, _ = m.build("21", "21_Crimson_Rose_Atelier", "crimson-rose-atelier")
    assert data["variations"]["options"] == v["options"]
