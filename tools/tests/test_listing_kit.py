"""tools/listing_kit.py tests (G059; listing images G065).

  python3 tools/tests/test_listing_kit.py

Covered: listing field parsing and Etsy title/tag rules (also on the real 01 and 03 listing_v3.md, plus the honesty rules
of the G059 review: no "personal start link", no "all text", no trademark tag, US spelling), the real QR of a start link
(re-encoded and compared module by module; demo/placeholder hosts and http refused), template filling (every placeholder
of the video frame has a value, unknown placeholders fail, text is escaped), the G065 image set (the 7 GM03 images in the
order gm03/build.py writes them, no QR or web address in their texts, every image listed in listing_v3.md §5), the guide's
HTML (cover, captioned figures, heading kept with its picture), the PDF link check (a PDF with no link fails), open-marker
detection, `--prepublish` (offline: a fake fetch), the vercel.app warning, video rule checks, and — when the kit has been
built — the full `check` of both themes (7 images of 2000 × 2000, no QR file in package/listing/). The video frame is
rendered with Playwright when node + Playwright are available (skipped otherwise).
"""
import importlib.util
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
        for ph in ("[PRICE]", "[RESPONSE TIME]", "[REFUND POLICY]"):
            assert ph in md, (t.id, ph)
        guide = (t.package / "customer" / "START_HERE.md").read_text(encoding="utf-8")
        assert lk.start_url(t) in guide and f"({lk.start_url(t)})" in guide, t.id  # shown and clickable
        assert "img/start_qr_page.png" in guide
        # G065: the 7 images are listed in §5, image 7's "demo link in the description" is there, no QR image left
        for n in lk.IMAGES:
            assert f"`{n}.png`" in md, (t.id, n)
        assert "08_live_demo" not in md and "image 8" not in md, t.id
        assert lk.demo_url(t) in md.split("## 3. Tags")[0], (t.id, "demo link missing from the description")
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
        assert "**QR code" in guide, t.id  # G091 rewrite: "**QR code for printed cards:**"; registry links exist since G068


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


def test_templates(tmp: Path):
    shots = tmp / "shots"
    for t in lk.THEMES.values():
        values = lk.template_values(t, shots, {"slot_x": "1", "slot_y": "2", "slot_w": "3", "slot_h": "4", "slot_r": "5"},
                                    title="t")
        files = list(lk.TEMPLATES.glob("*.html"))
        assert [f.name for f in files] == ["video_bg.html"], files  # G065: the 8 G059 image templates are gone
        for f in files:
            out = lk.fill(f.read_text(encoding="utf-8"), values)
            assert "{{" not in out, (f.name, re.findall(r"\{\{[^}]*\}\}", out)[:3])
            assert t.name.replace("&", "&amp;") in out, (f.name, t.id)
        # every screen the kit uses is one the capture step writes, and the capture step writes no editor screens
        capture = lk.CAPTURE.read_text(encoding="utf-8")
        for s in lk.SHOTS:
            assert f"'{s}'" in capture, f"capture.ts does not write {s}"
        assert "#section-" not in capture and "'b04_panel_top'" not in capture
    try:
        lk.fill("{{nope}}", {})
    except KeyError:
        pass
    else:
        raise AssertionError("unknown placeholder accepted")
    assert lk.fill("<p>{{a}}</p>", {"a": "<b>&"}) == "<p>&lt;b&gt;&amp;</p>"


def gm03():
    """tools/listing_templates/gm03/build.py under its own name (it imports G067's build.py as `build`)."""
    spec = importlib.util.spec_from_file_location("gm03_build", lk.GM03)
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


def test_gm03_set():
    g = gm03()
    assert [f.removesuffix(".png") for f, _ in g.KIT] == lk.IMAGES
    g.kaydet_v2()
    assert g.v2.SIRA == [a for _, a in g.KIT]
    for _, anahtar in g.KIT:
        texts = " ".join(g.v2.GORSELLER[anahtar]["metin"]).lower()
        # docs/15 §1: no QR and no web address on any listing image
        assert "qr" not in texts.split() and "http" not in texts and ".app" not in texts and ".com" not in texts, anahtar
    assert "description" in " ".join(g.v2.GORSELLER["demo"]["metin"])
    for f in (lk.GM03.parent).glob("*.html"):
        low = f.read_text(encoding="utf-8").lower()
        assert "qr" not in re.findall(r"[a-z]+", low) and "canva" not in low, f.name


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


def test_render(tmp: Path):
    import md_to_pdf as m2p
    if not m2p.playwright_hazir():
        print("  render: node/Playwright missing — skipped")
        return
    t = lk.THEMES["olive-ivory"]
    values = lk.template_values(t, tmp, {"slot_x": "1450", "slot_y": "520", "slot_w": "444", "slot_h": "960",
                                         "slot_r": "40"}, title="video")
    out = tmp / "frame.png"
    lk._render_pages([(lk.fill((lk.TEMPLATES / "video_bg.html").read_text(encoding="utf-8"), values), out, 2000, 2000)],
                     fonts=False)
    im = Image.open(out).convert("RGB")
    assert im.size == (2000, 2000)
    # the theme's painted corner parts really are in the frame (not broken images): the corner is not flat background
    import numpy as np
    crop = im.crop((0, 0, 500, 500))
    assert len(np.unique(np.asarray(crop.resize((50, 50))).reshape(-1, 3), axis=0)) > 200


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
        assert any("[RESPONSE TIME]" in x for x in live) and any("[VERIFY" in x for x in live), live
        assert not list((t.package / "listing").rglob("*qr*")), t.id  # G065: no QR in the listing
        down = lk.prepublish_problems(t, lk.BASE_URL, get=lambda url: (0, "URLError: proxy"))
        assert sum("could not connect" in x for x in down) == 2, down
        md_open = next(x for x in live if x.startswith("customer/START_HERE.md"))
        pdf_open = next(x for x in live if x.startswith("START_HERE.pdf"))
        assert md_open.split(":")[1].split()[0] == pdf_open.split(":")[1].split()[0], (md_open, pdf_open)  # same count
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
    test_gm03_set()
    print("  test_gm03_set: ok")
    with tempfile.TemporaryDirectory() as d:
        d = Path(d)
        for test in (test_qr, test_templates, test_pdf_checks, test_render):
            test(d)
            print(f"  {test.__name__}: ok")
    test_built_kits()
    print("  test_built_kits: ok")
    print("test_listing_kit: ok")


if __name__ == "__main__":
    main()
