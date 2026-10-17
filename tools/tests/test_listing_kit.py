"""tools/listing_kit.py tests (G059).

  python3 tools/tests/test_listing_kit.py

Covered: listing_v3.md field parsing and Etsy title/tag rules (also on the real 01 and 03 listings, plus the honesty rules
of the G059 review: no "personal start link", no "all text", no trademark tag, US spelling), the real QR of a start link
(re-encoded and compared module by module; demo/placeholder hosts and http refused), template filling (every placeholder
of every template has a value, unknown placeholders fail, text is escaped), guide strips (1–2 screens, same width, parts
of a screen), the guide's HTML (cover, captioned figures, heading kept with its picture), the PDF link check (a PDF with
no link fails), open-marker detection, `--prepublish` (offline: a fake fetch), the vercel.app warning, video rule checks,
and — when the kit has been built — the full `check` of both themes. One template is rendered with Playwright when node +
Playwright are available (skipped otherwise).
"""
import re
import sys
import tempfile
from pathlib import Path

from PIL import Image

TOOLS = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(TOOLS))
import listing_kit as lk  # noqa: E402


def test_fields_and_rules():
    md = """# x

## 1. Title

```text
Olive Wedding Website with RSVP,
Envelope Opening
```

## 3. Tags

```text
wedding website
online rsvp
```
"""
    f = lk.listing_fields(md)
    assert f["title"] == "Olive Wedding Website with RSVP, Envelope Opening", f
    assert f["tags"] == ["wedding website", "online rsvp"], f
    assert lk.title_problems(f["title"]) == []
    assert lk.title_problems("x" * 141) and lk.title_problems(None) == ["no title block"]
    assert any("'&'" in p for p in lk.title_problems("A & B & C"))
    assert any("capitals" in p for p in lk.title_problems("ONE TWO THREE FOUR words"))
    assert lk.title_problems("RSVP Wedding Website") == []
    good = [f"tag number {i}" for i in range(13)]
    assert lk.tag_problems(good) == []
    assert any("13" in p for p in lk.tag_problems(good[:12]))
    assert any("21 characters" in p for p in lk.tag_problems(good[:12] + ["a" * 21]))
    assert any("repeated" in p for p in lk.tag_problems(good[:12] + ["tag number 0"]))
    assert any("lower-case" in p for p in lk.tag_problems(good[:12] + ["Wedding!"]))


def test_real_listings():
    for t in lk.THEMES.values():
        p = t.package / "listing" / lk.LISTING_MD
        assert p.exists(), p
        md = p.read_text(encoding="utf-8")
        f = lk.listing_fields(md)
        assert lk.title_problems(f["title"]) == [], (t.id, lk.title_problems(f["title"]))
        assert lk.tag_problems(f["tags"]) == [], (t.id, lk.tag_problems(f["tags"]))
        m = re.search(r"This title: (\d+) characters", md)
        assert m and int(m.group(1)) == len(f["title"]), (t.id, m and m.group(1), len(f["title"]))
        assert "<!-- listing-kit:media -->" in md
        # Shop name, support email (K33), hosting period (K25), price (1,460 TL) and quantity (999, no stock limit) are
        # decided (2026-10-16) and filled in listing_v3.md; renewal is still the user's decision.
        assert "[QUANTITY]" not in md and "1,460 TL" in md, t.id
        assert "[AUTO RENEW" in md, (t.id, "[AUTO RENEW]")
        guide = (t.package / "customer" / "START_HERE.md").read_text(encoding="utf-8")
        assert lk.start_url(t) in guide and f"({lk.start_url(t)})" in guide, t.id  # shown and clickable
        assert "img/start_qr_page.png" in guide
        # the guide is buyer-facing: no internal markers
        assert "[VERIFY" not in guide and "TODO" not in guide, t.id
        # G059 review: honest product statements
        for text, where in ((md, lk.LISTING_MD), (guide, "START_HERE.md")):
            low = text.lower()
            assert "personal start link" not in low and "your start link is inside" not in low, (t.id, where)
            assert "all text" not in low and "all the text" not in low, (t.id, where)
            assert "colour" not in low and "personalis" not in low, (t.id, where, "US spelling")
            assert "only in safari" not in low and "20 to 30 minutes" not in low, (t.id, where)
            assert "headings" in low and "english" in low, (t.id, where)
        assert "evite" not in " ".join(f["tags"]), t.id  # Evite is a trademark
        assert f["title"].count("Wedding") <= 1, (t.id, f["title"])
        assert "QR code" in guide and "img/start_qr_page.png" in guide, t.id  # G091 guide: text + the start QR


def test_qr(tmp: Path):
    url = lk.start_url(lk.THEMES["blush-garden-rose"])
    png, svg = lk.make_qr(url, tmp / "qr" / "start_qr", dark="#3F2A2E")
    assert png.exists() and svg.exists()
    assert lk.qr_matches(png, url)
    assert not lk.qr_matches(png, url + "x")
    assert not lk.qr_matches(png, lk.start_url(lk.THEMES["olive-ivory"]))
    for bad in ("http://davetiye-platform-five.vercel.app/start", "https://example.com/start", "https://localhost/x"):
        try:
            lk.make_qr(bad, tmp / "bad")
        except ValueError:
            continue
        raise AssertionError(f"accepted {bad}")


# what listing_kit.scene_background gives the scene templates (01, 02, 08)
SCENE_VALUES = {"scene.bg": "file:///bg.png", "below_screens": "1600", "above_screens": "600", "col_left": "120",
                "col_w": "800", "col_mid": "1000",
                **{f"s{i}_{k}": "500" for i in (1, 2, 3) for k in ("cx", "left", "top", "bottom")}}


def test_templates(tmp: Path):
    shots = tmp / "shots"
    for t in lk.THEMES.values():
        values = lk.template_values(t, shots, {"qr.demo": "file:///x.png", "slot_x": "1", "slot_y": "2", "slot_w": "3",
                                               "slot_h": "4", "slot_r": "5", **SCENE_VALUES}, title="t")
        for f in list(lk.TEMPLATES.glob("*.html")):
            out = lk.fill(f.read_text(encoding="utf-8"), values)
            assert "{{" not in out, (f.name, re.findall(r"\{\{[^}]*\}\}", out)[:3])
            assert t.name.replace("&", "&amp;") in out, (f.name, t.id)
        for n in lk.IMAGES:
            assert (lk.TEMPLATES / f"{n}.html").exists(), n
        # every screen a template uses is one the capture step writes
        used = set()
        for f in lk.TEMPLATES.glob("*.html"):
            used |= set(re.findall(r"\{\{\s*shot\.(\w+)\s*\}\}", f.read_text(encoding="utf-8")))
        assert used <= set(lk.SHOTS), used - set(lk.SHOTS)
        capture = lk.CAPTURE.read_text(encoding="utf-8")
        for s in lk.SHOTS:
            assert f"'{s}'" in capture, f"capture.ts does not write {s}"
    try:
        lk.fill("{{nope}}", {})
    except KeyError:
        pass
    else:
        raise AssertionError("unknown placeholder accepted")
    assert lk.fill("<p>{{a}}</p>", {"a": "<b>&"}) == "<p>&lt;b&gt;&amp;</p>"


def test_strip(tmp: Path):
    shots = []
    for i, c in enumerate([(200, 180, 170), (60, 90, 70), (240, 240, 230)]):
        p = tmp / f"s{i}.jpg"
        Image.new("RGB", (1170, 2532), c).save(p)
        shots.append(p)
    a = lk.make_strip([(shots[0], None)], tmp / "a.jpg")
    b = lk.make_strip([(shots[0], None), (shots[1], None)], tmp / "b.jpg")
    ia, ib = Image.open(a), Image.open(b)
    assert ia.size == ib.size, (ia.size, ib.size)  # always two slots wide: every screen the same size in the PDF
    assert ia.getpixel((5, 5)) == (255, 255, 255) or sum(ia.getpixel((5, 5))) > 750  # white margin
    mid = ia.getpixel((ia.width // 2, ia.height // 2))
    assert abs(mid[0] - 200) < 8, mid  # the single screen sits in the middle
    # each screen ≥ 42 % of the text width (the PDF shows the picture at 93.5 % of the text width, GUIDE_CSS)
    assert "width: 93.5%" in lk.GUIDE_CSS
    assert lk.STRIP["w"] / ib.width * 0.935 >= 0.42, ib.width
    try:
        lk.make_strip([(s, None) for s in shots], tmp / "c.jpg")
    except ValueError:
        pass
    else:
        raise AssertionError("three screens accepted")
    # a part of a screen: CSS px of the 390 px wide screen (here DPR 3)
    part = lk.screen_part(shots[0], (0, 300))
    assert part.size == (1170, 900), part.size
    assert lk.screen_part(shots[0], (0, 2000)).height == 2532  # clamped to the screen
    # a bottom sheet: the plain rows above it are dropped
    sheet = Image.new("RGB", (1170, 2532), (246, 243, 238))
    sheet.paste((255, 255, 255), (0, 600, 1170, 2532))
    sp = tmp / "sheet.jpg"
    sheet.save(sp, quality=95)
    top = lk.screen_part(sp, "sheet")
    assert 2532 - 600 <= top.height <= 2532 - 600 + 12, top.height


def test_guide_html():
    t = lk.THEMES["blush-garden-rose"]
    doc = ("<html><head><title>x</title></head><body><h1 id=\"s\">Start Here: Your Blush Garden Rose Wedding Website</h1>"
           "<p>Intro</p><p><img src=\"file:///q/start_qr_page.png\" alt=\"QR code\"></p>"
           "<h2 id=\"link\">Your start link</h2><p>No picture here</p>"
           "<h2 id=\"step-1\">Step 1: Start</h2>\n<p><img src=\"file:///s/step1.jpg\" alt=\"Step 1: the start page\"></p><p>Text</p>"
           "</body></html>")
    out = lk.guide_html(t, doc, {"heading": "Cormorant Garamond", "body": "Montserrat"})
    assert 'class="cover"' in out and "Start Here" in out and "Your Blush Garden Rose Wedding Website" in out
    assert "<h1 id" not in out  # the # title became the cover
    assert t.corner_tl.split("/")[-1] in out and "g01_envelope.jpg" in out
    assert "<figcaption>Step 1: the start page</figcaption>" in out
    assert '<div class="keep"><h2 id="step-1">' in out  # heading kept with its picture
    assert '<div class="keep"><h2 id="link">' not in out  # … and only its own heading
    assert 'class="qr"' in out and "<figcaption>QR code</figcaption>" not in out
    assert "/q/start_qr.png" in out  # the code itself, not the 4× wide strip
    assert "break-inside: avoid" in out


def test_pdf_checks(tmp: Path):
    blank = tmp / "nolink.pdf"
    Image.new("RGB", (612, 792), "white").save(blank)
    url = lk.start_url(lk.THEMES["olive-ivory"])
    probs = lk.pdf_link_problems(blank, url)
    assert probs and "no clickable" in probs[0], probs  # G059 review: a PDF without any link must fail
    assert lk.open_markers("x [VERIFY: a] [SHOP NAME] [AUTO RENEW: yes/no] [PRICE] y [VERIFY: b\n c]") == \
        ["[VERIFY: a]", "[VERIFY: b c]", "[AUTO RENEW: yes/no]", "[PRICE]", "[SHOP NAME]"]  # VERIFY first
    assert lk.open_markers("[https://a.b](https://a.b) - [ ] task - [x] done [Step 1] (x)") == []
    assert lk.host_warnings("https://davetiye-platform-five.vercel.app") and not lk.host_warnings("https://example.org")


def test_video_rules():
    ok = {"duration_s": 12.0, "size_mb": 3.0, "width": 1080, "height": 1080, "codec": "h264", "audio": False}
    assert lk.video_problems(ok) == []
    assert lk.video_problems({**ok, "duration_s": 4.0}) and lk.video_problems({**ok, "duration_s": 16.0})
    assert lk.video_problems({**ok, "audio": True}) and lk.video_problems({**ok, "size_mb": 101})
    assert lk.video_problems({**ok, "width": 400, "height": 400}) and lk.video_problems({**ok, "codec": "vp9"})


def test_scenes():
    """Every theme has the GPT scene of each scene image with as many green screens as real screens go into it, and a
    screen is cut to a green screen's shape from its top (taller) or evenly from both sides (wider)."""
    sys.path.insert(0, str(TOOLS / "listing_v2"))
    import kompozit as kz
    for t in lk.THEMES.values():
        for name, (file, shots) in lk.SCENES.items():
            assert name in lk.IMAGES and set(shots) <= set(lk.SHOTS), name
            scene = t.collection / "assets" / "gpt" / "mockups" / file
            assert scene.exists(), scene
            assert len(kz.ekran_bolgeleri(Image.open(scene))) == len(shots), (t.id, file)
    im = Image.new("RGB", (390, 844), "white")
    assert lk._screen_for(im, 0.5).size == (390, 780)
    assert lk._screen_for(Image.new("RGB", (390, 700)), 0.5).size == (350, 700)


def test_render(tmp: Path):
    import md_to_pdf as m2p
    if not m2p.playwright_hazir():
        print("  render: node/Playwright missing — skipped")
        return
    t = lk.THEMES["olive-ivory"]
    shots = t.package / "shots"
    if not (shots / "g03_home_invitation.jpg").exists():
        print("  render: no captured screens — skipped")
        return
    values = lk.template_values(t, shots, {"qr.demo": "", "title": "t"})
    out = tmp / "inc.png"
    lk._render_pages([(lk.fill((lk.TEMPLATES / "03_whats_included.html").read_text(encoding="utf-8"), values), out, 2000, 2000)],
                     fonts=False)
    im = Image.open(out).convert("RGB")
    assert im.size == (2000, 2000)
    # the screenshot really is in the picture (not a broken image): the phone area is not flat background
    crop = im.crop((1300, 700, 1800, 1500))
    import numpy as np
    assert len(np.unique(np.asarray(crop.resize((50, 80))).reshape(-1, 3), axis=0)) > 200


def test_built_kits():
    built = [t for t in lk.THEMES.values() if (t.package / "listing" / f"listing_{t.id}.pdf").exists()]
    if not built:
        print("  built kits: not built yet — skipped (python3 tools/listing_kit.py all --theme all)")
        return
    for t in built:
        problems = lk.step_check(t, lk.BASE_URL)
        assert problems == [], (t.id, problems)
        uris = lk.pdf_uris(t.package / "customer" / "START_HERE.pdf")
        assert lk.start_url(t) in uris, (t.id, uris)
        # --prepublish, offline: a fake live site that answers with the theme's name → only the open markers remain
        live = lk.prepublish_problems(t, lk.BASE_URL, get=lambda url: (200, f"<title>{t.name}</title>"))
        assert not any(x.startswith("live ") for x in live), live
        assert not any("demo_qr" in x for x in live), live  # image 8's QR encodes the demo link
        live = [x.replace("\\", "/") for x in live]  # (relative paths print with \ on Windows)
        assert any(x.startswith(f"listing/{lk.LISTING_MD}: ") and "still open" in x for x in live), live
        assert any("[VERIFY" in x for x in live), live
        down = lk.prepublish_problems(t, lk.BASE_URL, get=lambda url: (0, "URLError: proxy"))
        assert sum("could not connect" in x for x in down) == 2, down
        # G154 (K48): the START HERE guide has no open placeholder left, in the .md and in the PDF alike
        assert not any(x.startswith(("customer/START_HERE.md", "START_HERE.pdf")) for x in live), live
        wrong = lk.prepublish_problems(t, lk.BASE_URL, get=lambda url: (200, "<title>Other</title>"))
        assert sum("does not name" in x for x in wrong) == 2, wrong


def main():
    test_fields_and_rules()
    print("  test_fields_and_rules: ok")
    test_real_listings()
    print("  test_real_listings: ok")
    test_video_rules()
    print("  test_video_rules: ok")
    test_guide_html()
    print("  test_guide_html: ok")
    test_scenes()
    print("  test_scenes: ok")
    with tempfile.TemporaryDirectory() as d:
        d = Path(d)
        for test in (test_qr, test_templates, test_strip, test_pdf_checks, test_render):
            test(d)
            print(f"  {test.__name__}: ok")
    test_built_kits()
    print("  test_built_kits: ok")
    print("test_listing_kit: ok")


if __name__ == "__main__":
    main()
