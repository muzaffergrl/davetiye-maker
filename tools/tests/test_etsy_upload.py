"""tools/etsy_upload.py tests (G123: designs 06–20 added to the Etsy upload data).

  python3 tools/tests/test_etsy_upload.py

Covered: the design table against the platform (20 designs, the collection folders of designs.ts, the live designs of
config.ts, every theme folder), the opening object read from designs.ts (six designs open from something other than
an envelope), the text rules (design name in the title, its own demo link, no other design's demo, no "envelope" for a
gatefold/pouch/wallet/book/sleeve design), `--designs` parsing, and every real listing_v3.md: Etsy's title and tag
rules, the honesty rules of test_listing_kit (US spelling, no trademark tag, one "Wedding" in the title, headings and
English named, quantity left open), the eight editorial image rows in order, VERIFY notes moved out of the
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
                "wildflower-meadow-vellum": "sleeve"}


def test_design_table():
    nos = [no for no, _, _ in eu.DESIGNS]
    assert nos == [f"{i:02d}" for i in range(1, 21)], nos
    copy = (REPO / "platform" / "lib" / "marketing" / "designs.ts").read_text(encoding="utf-8")
    config = (REPO / "platform" / "lib" / "marketing" / "config.ts").read_text(encoding="utf-8")
    live = set(re.findall(r"id: '([a-z0-9-]+)',\s*\n\s*name: '[^']+',\s*\n\s*status: 'live'", config))
    assert live == {t for _, _, t in eu.DESIGNS}, sorted(live ^ {t for _, _, t in eu.DESIGNS})
    for no, folder, theme in eu.DESIGNS:
        assert folder.startswith(no + "_") and (REPO / "collections" / folder).is_dir(), folder
        assert (REPO / "platform" / "themes" / theme / "theme.json").exists(), theme
        m = re.search(rf"^  '{re.escape(theme)}': \{{\s*\n\s*id: '{re.escape(theme)}',\s*\n\s*collection: '([^']+)'",
                      copy, re.M)
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
    assert len(eu.select("all")) == 20
    for bad in ("21", "6-x", "00", "01-25"):
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
        assert "[QUANTITY]" in md, no  # undecided commercial field stays a placeholder
        assert "[VERIFY" not in data["description"] and data["open_checks"], no
        assert f"/start/demo/{theme}" in data["description"], no
        assert [i["file"].rsplit("/", 1)[1] for i in data["images"]] == [f"{n}.png" for n in lk.UPLOAD_IMAGES], no
        assert data["ready_to_publish"] is False and data["price_usd"] == eu.PRICE_USD, no
        if theme in NOT_ENVELOPE:
            text = " ".join([f["title"], *f["tags"], data["description"], *(i["alt"] for i in data["images"])])
            assert "envelope" not in text.lower(), no
            assert NOT_ENVELOPE[theme] in data["description"], no
        missing_guide = not (REPO / "collections" / folder / "package" / "customer" / "START_HERE.pdf").exists()
        assert missing_guide == any(b.startswith("digital file missing") for b in data["blockers"]), no
        committed = json.loads((listing / "etsy_upload.json").read_text(encoding="utf-8"))
        assert committed == data, (no, "etsy_upload.json is out of date: python3 tools/etsy_upload.py --designs " + no)


def test_check_exit():
    assert eu.main(["--check"]) == 0
    files_missing = any(b.startswith(("listing images", "listing video", "digital file"))
                        for _, folder, theme in eu.DESIGNS for b in eu.build(_, folder, theme)[0]["blockers"])
    assert eu.main(["--check", "--strict"]) == (1 if files_missing else 0)


def main():
    for test in (test_design_table, test_opening_object, test_text_rules, test_select, test_real_listings,
                 test_check_exit):
        test()
        print(f"  {test.__name__}: ok")
    print("test_etsy_upload: ok")


if __name__ == "__main__":
    main()
