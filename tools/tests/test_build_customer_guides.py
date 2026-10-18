"""tools/build_customer_guides.py tests (G122: START HERE for designs 01–20 from docs/19 Ek A; G175: 22–32).

  python3 tools/tests/test_build_customer_guides.py

Covered: Ek A is found and holds exactly the placeholders the tool fills; the design values (20 designs, the six that
open from something other than an envelope, the language line from the fonts, a dark QR colour with ≥ 7:1 contrast);
an unknown placeholder or font stops the build; the label check finds a renamed button and a changed quoted text; a
guide PDF built in a temporary folder has the clickable start link, the privacy link and nothing else, and its QR is
the make_qr.py picture; and every committed guide passes `check` (links, QR module by module, Ek A equality, labels;
the jsQR raster reading for two designs when node + jsqr are there). Nothing in the repository is written.
"""
import sys
import tempfile
from pathlib import Path

TOOLS = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(TOOLS))
import build_customer_guides as b  # noqa: E402
import etsy_upload as eu  # noqa: E402

NOT_ENVELOPE = {"art-deco-black-tie": "gatefold", "lavender-provence": "pouch", "tropical-destination": "wallet",
                "enchanted-forest-storybook": "book", "ivory-lace-pearls": "gatefold",
                "wildflower-meadow-vellum": "sleeve",
                # G175: designs 22–32 (22 opens from an envelope)
                "velvet-jewel-box": "box", "grand-theatre-premiere": "curtain", "orient-express-voyage": "wallet",
                "kintsugi-washi": "origami", "riad-lantern-nights": "door", "maison-patisserie": "box",
                "celestial-observatory": "dome", "azulejo-mosaic": "wall", "sky-lantern-festival": "lantern",
                "music-box-ballerina": "box"}
# G123's listing language lines (2026-10-16): latin-only font → "latin", all Cyrillic → "cyrillic", else "latin-ext".
LANGUAGE = {"01": "cyrillic", "02": "latin-ext", "03": "cyrillic", "04": "latin", "05": "latin-ext", "06": "latin",
            "07": "latin-ext", "08": "latin-ext", "09": "latin-ext", "10": "latin-ext", "11": "latin", "12": "latin-ext",
            "13": "latin", "14": "latin-ext", "15": "latin-ext", "16": "latin-ext", "17": "latin-ext", "18": "latin",
            "19": "cyrillic", "20": "latin-ext", "21": "cyrillic",
            # G175: Google Fonts subsets read on 2026-10-17 (28: Italiana is latin only)
            "22": "latin-ext", "23": "latin-ext", "24": "latin-ext", "25": "latin-ext", "26": "latin-ext",
            "27": "latin-ext", "28": "latin", "29": "latin-ext", "30": "latin-ext", "31": "latin-ext", "32": "latin-ext"}


def expect_exit(fn, *args):
    try:
        fn(*args)
    except SystemExit:
        return
    raise AssertionError(f"{fn.__name__} did not stop")


def test_template():
    t = b.template()
    assert t.startswith("# Start Here: Your {DESIGN_NAME} Wedding Website\n"), t[:60]
    assert set(b.PLACEHOLDER.findall(t)) == {"{DESIGN_NAME}", "{START_URL}", "{PRIVACY_URL}", "{MY_URL}", "{OPENING}",
                                             "{OPENING_TAB}", "{LANGUAGE_FONTS}"}
    # G148 (G146/K46): the order number + email on /my are the way back; the edit link is a shortcut, not "the key"
    assert "> **Continue on another device**" in t and "[{MY_URL}]({MY_URL})" in t, "no /my box"
    assert "Purchases and reviews" in t and '"Order #…"' in t, "where the order number is"
    assert "it is your key" not in t and "If you lose it, message" not in t and "We do not send emails yet" not in t
    assert "**Continue with your order number**" in t and "**Sign out other devices**" in t
    assert "img/start_qr_page.png" in t and "({START_URL})" in t
    assert "envelope" not in t.lower(), "a design-specific 'envelope' left in Ek A (use {OPENING} / {OPENING_TAB})"
    # G100: no per-field "Sample" tag, the QR under "More ways to share", Guests in two views
    assert "Sample** tag" not in t and "More ways to share" in t and "**Results:**" in t
    # G121: no "More photos" fold in the setup; the preview tab is the design's own opening
    assert "**More photos**" not in t and "**{OPENING_TAB}** is the opening page" in t
    expect_exit(b.fill, t + "{NEW_THING}", b.values("olive-ivory"))


def test_values():
    assert [no for no, _, _ in eu.DESIGNS] == [f"{i:02d}" for i in range(1, 33)]
    for no, folder, theme in eu.DESIGNS:
        v = b.values(theme)
        assert v["START_URL"] == f"https://xn--bkestudo-zkb.com/start?theme={theme}", v
        assert v["PRIVACY_URL"] == "https://xn--bkestudo-zkb.com/privacy"
        assert v["MY_URL"] == "https://xn--bkestudo-zkb.com/my"
        assert v["OPENING"] == NOT_ENVELOPE.get(theme, "envelope"), (no, v["OPENING"])
        assert v["OPENING_TAB"] == v["OPENING"].capitalize(), (no, v["OPENING_TAB"])
        assert b.language_class(b.design_fonts(theme)) == LANGUAGE[no], (no, b.design_fonts(theme))
        assert v["LANGUAGE_FONTS"] == b.LANGUAGE_LINES[LANGUAGE[no]]
        dark = b.qr_dark(folder, theme)  # G175: 22–32 read the palette of designs.ts (no palette.json yet)
        assert 1.05 / (b._luminance(dark) + 0.05) >= 7, (no, dark)
    assert b.values("olive-ivory", "https://example.org/")["START_URL"] == "https://example.org/start?theme=olive-ivory"
    expect_exit(b.language_class, ["Great Vibes", "A Font Nobody Checked"])
    assert b.language_class(["Great Vibes", "EB Garamond"]) == "cyrillic"
    assert b.language_class(["Pinyon Script", "Cormorant Garamond"]) == "latin-ext"
    assert b.language_class(["Homemade Apple", "Special Elite"]) == "latin"


def test_labels():
    md = b.fill(b.template(), b.values("olive-ivory"))
    assert b.label_problems(md, "olive-ivory") == []
    bad = md.replace("**Mark as seen**", "**Mark all as read**").replace('"Page not found"', '"No page here"')
    found = b.label_problems(bad, "olive-ivory")
    assert any("Mark all as read" in x for x in found) and any("No page here" in x for x in found), found
    # G131: labels from lib/audio (track names), lib/rsvp (answer types) and the guest scripts ("Play music") are found,
    # and a renamed one still fails
    for label in ("**Music & sound**", "**Evening Strings**", "**Yes / No**", "**Preview map**", "**Connect Google Sheets**",
                  '"Play music"', '"Google Sheets: coming soon"', "Prefer us to do it?"):
        assert label in md, label
    # G148: the /my labels (components/my) and the sales site's button (marketing/Shell.tsx) are found; a renamed one fails
    for label in ("**Open or start your website**", "**Create your website**", "**Share → Use on another device**"):
        assert label in md, label
    bad = md.replace("**Open or start your website**", "**Open your website**")
    assert any("Open your website" in x for x in b.label_problems(bad, "olive-ivory"))
    bad = md.replace("**Evening Strings**", "**Evening Song**").replace('"Play music"', '"Start the music"')
    found = b.label_problems(bad, "olive-ivory")
    assert any("Evening Song" in x for x in found) and any("Start the music" in x for x in found), found
    # G121: the preview tab is computed (openingTabLabel), so "Book" passes for the book design only through that rule
    book = b.fill(b.template(), b.values("enchanted-forest-storybook"))
    assert "**Book** is the opening page" in book and b.label_problems(book, "enchanted-forest-storybook") == []
    # G175: the new opening objects of 22–32 the same way (26's folded paper is the "Origami" tab in the panel)
    for theme, tab in (("kintsugi-washi", "Origami"), ("grand-theatre-premiere", "Curtain"), ("azulejo-mosaic", "Wall")):
        md = b.fill(b.template(), b.values(theme))
        assert f"**{tab}** is the opening page" in md and b.label_problems(md, theme) == [], theme
        assert "envelope" not in md.lower(), theme


def test_pdf(tmp: Path):
    v = b.values("tropical-destination")
    md = b.fill(b.template(), v)
    png, svg, page = b.make_start_qr(v["START_URL"], tmp / "img", b.qr_dark("12_Tropical_Destination"))
    assert b.eu.lk.qr_matches(png, v["START_URL"], scale=b.QR_SCALE) and "segno" in svg.read_text(encoding="utf-8")
    pdf = b.build_pdf(md, tmp / "START_HERE.pdf", png, v["START_URL"], v["DESIGN_NAME"])
    uris = b.pdf_uris(pdf)
    assert v["START_URL"] in uris and set(uris) == {v["START_URL"], v["PRIVACY_URL"], v["MY_URL"]}, uris
    assert 5 <= b.pdf_page_count(pdf) <= 10, b.pdf_page_count(pdf)  # G154: + Languages and Downloads (10 pages)
    text = b.eu.lk.pdf_text(pdf) or ""
    # since G121 even the preview tab names the wallet: no "envelope" in any case
    assert "Tropical Destination" in text and "tap the wallet" in text and "envelope" not in text.lower(), text[:200]
    assert "Wallet is the opening page" in " ".join(text.split()), "preview tab not named after the opening"
    # G148: the box is in the PDF, with its title and the /my address
    flat = " ".join(text.split())
    assert "Continue on another device" in flat and "xn--bkestudo-zkb.com/my" in flat, flat[:300]
    # G154 (G090 P0-01, P1-05, P2-04): K48 texts instead of placeholders, Downloads, and the start address as plain text
    assert "[" not in flat.replace("[{", ""), "a [PLACEHOLDER] is left in the guide"
    assert "usually within 24 hours" in flat and "we can extend it" in flat and "within 30 days" in flat
    assert "Download website as PDF" in flat and "Printable invitation" in flat
    assert f"Type this address into your browser: {v['START_URL']}" in flat, "start address not printed as text"


def test_committed():
    raster = {"01", "06", "26"}  # the jsQR reading takes a few seconds per design: envelope, gatefold, origami (G175)
    for no, folder, theme in eu.DESIGNS:
        if not (b.customer_dir(folder) / "START_HERE.pdf").exists():
            raise AssertionError(f"{no}: no guide — python3 tools/build_customer_guides.py --designs {no}")
        problems, facts = b.check(no, folder, theme, raster=no in raster)
        assert problems == [], (no, problems)
        if no in raster and isinstance(facts.get("raster"), dict):
            assert facts["raster"]["pdf"] == [b.start_url(theme)], facts["raster"]


def main():
    test_template()
    print("  test_template: ok")
    test_values()
    print("  test_values: ok")
    test_labels()
    print("  test_labels: ok")
    with tempfile.TemporaryDirectory() as d:
        test_pdf(Path(d))
    print("  test_pdf: ok")
    test_committed()
    print("  test_committed: ok")
    print("test_build_customer_guides: ok")


if __name__ == "__main__":
    main()
