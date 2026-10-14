"""tools/listing_kit.py tests (G059).

  python3 tools/tests/test_listing_kit.py

Covered: listing.md field parsing and Etsy title/tag rules (also on the real 01 and 03 listings), the real QR of a start
link (re-encoded and compared module by module; demo/placeholder hosts and http refused), template filling (every
placeholder of every template has a value, unknown placeholders fail, text is escaped), guide strips (same size for 1–3
screens), video rule checks, and — when the kit has been built — the full `check` of both themes (images, video, PDF link,
QR). One template is rendered with Playwright when node + Playwright are available (skipped otherwise).
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
        p = t.package / "listing" / "listing.md"
        assert p.exists(), p
        md = p.read_text(encoding="utf-8")
        f = lk.listing_fields(md)
        assert lk.title_problems(f["title"]) == [], (t.id, lk.title_problems(f["title"]))
        assert lk.tag_problems(f["tags"]) == [], (t.id, lk.tag_problems(f["tags"]))
        m = re.search(r"This title: (\d+) characters", md)
        assert m and int(m.group(1)) == len(f["title"]), (t.id, m and m.group(1), len(f["title"]))
        assert "<!-- listing-kit:media -->" in md
        for ph in ("[PRICE]", "[SHOP NAME]", "[HOSTING PERIOD]", "[SUPPORT EMAIL]"):
            assert ph in md, (t.id, ph)
        guide = (t.package / "customer" / "START_HERE.md").read_text(encoding="utf-8")
        assert lk.start_url(t) in guide and f"({lk.start_url(t)})" in guide, t.id  # shown and clickable
        assert "img/start_qr_page.png" in guide
        for name in lk.STRIPS:
            assert f"img/{name}.jpg" in guide, (t.id, name)
        # the guide is buyer-facing: no internal markers
        assert "[VERIFY" not in guide and "TODO" not in guide, t.id


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
        values = lk.template_values(t, shots, {"qr.demo": "file:///x.png", "slot_x": "1", "slot_y": "2", "slot_w": "3",
                                               "slot_h": "4", "slot_r": "5"}, title="t")
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
    a = lk.make_strip(shots[:1], tmp / "a.jpg")
    b = lk.make_strip(shots, tmp / "b.jpg")
    ia, ib = Image.open(a), Image.open(b)
    assert ia.size == ib.size, (ia.size, ib.size)
    assert ia.getpixel((5, 5)) == (255, 255, 255) or sum(ia.getpixel((5, 5))) > 750  # white margin
    mid = ia.getpixel((ia.width // 2, ia.height // 2))
    assert abs(mid[0] - 200) < 8, mid  # the single screen sits in the middle


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


def main():
    test_fields_and_rules()
    print("  test_fields_and_rules: ok")
    test_real_listings()
    print("  test_real_listings: ok")
    test_video_rules()
    print("  test_video_rules: ok")
    with tempfile.TemporaryDirectory() as d:
        d = Path(d)
        for test in (test_qr, test_templates, test_strip, test_render):
            test(d)
            print(f"  {test.__name__}: ok")
    test_built_kits()
    print("  test_built_kits: ok")
    print("test_listing_kit: ok")


if __name__ == "__main__":
    main()
