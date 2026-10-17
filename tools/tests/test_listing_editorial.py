"""tools/listing_editorial.py + the 20-design theme table of tools/listing_kit.py (G124).

  python3 tools/tests/test_listing_editorial.py

Covered: listing_kit.THEMES knows designs 01–20 with the same number, folder and id as tools/etsy_upload.py and the
platform's own design name (theme.json); the opening object comes from platform/lib/marketing/designs.ts and no filled
template (editorial set, G059 kit, listing video) says "envelope" for a design that opens from a gatefold, pouch,
wallet, book or sleeve; every editorial template placeholder gets a value; the dark designs (06, 17, 19) are laid out
on their own dark ground with a light logo, and image 7's light photograph turns their ink dark; the opening still times
cover every design whose images are built; GM06's three-step scene has three green screens; design selection
("06-11", ids, 'all'); and every built editorial set: 8 files, 2000 × 2000, no green left in the scene images, the file
names of listing_v3 §5, and its listing video within Etsy's rules.
"""
import json
import re
import sys
from pathlib import Path

from PIL import Image

TOOLS = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(TOOLS))
sys.path.insert(0, str(TOOLS / "listing_v2"))
import etsy_upload as eu  # noqa: E402
import listing_editorial as le  # noqa: E402
import listing_kit as lk  # noqa: E402

REPO = TOOLS.parent
DARK = {"art-deco-black-tie", "emerald-gold-estate", "midnight-garden"}


def test_theme_table():
    assert len(lk.THEMES) == 21
    assert sorted((t.no, t.folder, t.id) for t in lk.THEMES.values()) == sorted(eu.DESIGNS)
    for t in lk.THEMES.values():
        assert t.name == eu.theme_name(t.id), (t.id, t.name, eu.theme_name(t.id))
        assert (t.collection / "palette.json").exists(), t.id
        assert t.opening == eu.opening_object(t.id), t.id
        assert (lk.is_dark(t)) == (t.id in DARK), t.id
    words = {t.id: t.opening_words for t in lk.THEMES.values()}
    assert words["enchanted-forest-storybook"]["short"] == "storybook"
    assert words["lavender-provence"]["Long"] == "Linen pouch"
    assert words["olive-ivory"] == {"short": "envelope", "long": "envelope", "Long": "Envelope"}


def editorial_values(t: lk.Theme) -> dict:
    v = {"theme_name": t.name, "scene.brand": "file:///b.svg", "scene.bg": "file:///bg.png", "opening": t.opening_words["short"],
         "Opening": t.opening_words["Long"], "veil_h": "600", "veil_b": "500", "veil_w": "900", "text_top": "330",
         "title": t.name, "title_px": "170", "below_screens": "1600", "panel_w": "920", "text_w": "700",
         "col_left": "120", "col_top": "250", "col_w": "800", "screens": "", "steps": ""}
    v.update({f"s{i}_cx": "500" for i in (1, 2, 3)})
    v["s2_w"] = "560"
    return v


def test_templates_say_the_right_object():
    for t in lk.THEMES.values():
        texts = []
        for f in sorted(le.TPL.glob("*.html")):
            out = lk.fill(f.read_text(encoding="utf-8"), editorial_values(t), raw=frozenset({"screens", "steps"}))
            assert "{{" not in out, (f.name, re.findall(r"\{\{[^}]*\}\}", out)[:3])
            texts.append(out)
        kit = lk.template_values(t, Path("/shots"), {"qr.demo": "", "slot_x": "1", "slot_y": "2", "slot_w": "3",
                                                     "slot_h": "4", "slot_r": "5"}, title="t")
        for f in ("02_guest_pages.html", "03_whats_included.html", "video_bg.html"):
            texts.append(lk.fill((lk.TEMPLATES / f).read_text(encoding="utf-8"),
                                 {**kit, "scene.bg": "", "below_screens": "1", "above_screens": "1",
                                  **{f"s{i}_{k}": "1" for i in (1, 2, 3) for k in ("cx", "left", "top", "bottom")}}))
        # visible text only (comments and file names may say "envelope": g01_envelope.jpg is every design's first shot)
        visible = re.sub(r"<!--.*?-->|/\*.*?\*/|<[^>]+>", " ", " ".join(texts), flags=re.S)
        if t.opening == "envelope":
            assert "envelope" in visible.lower(), t.id
        else:
            assert "envelope" not in visible.lower(), (t.id, t.opening)
            assert t.opening_words["short"] in visible, t.id


def test_dark_ground():
    for t in lk.THEMES.values():
        p = lk.palette(t)
        css = le.root_css(t)
        light = le.root_css(t, "light")
        if t.id in DARK:
            assert f"--paper:{p['mist_top']}" in css and "--shade:#000000" in css, t.id
            assert f"--ink:{p['primary']}" in light and "--paper-img:none" in light, t.id  # image 7: linen photo
            assert "--glow:" in lk.root_css(t)  # the video's backdrop
        else:
            assert css == light and f"--paper:{p['ivory']}" in css and f"--ink:{p['ink']}" in css, t.id
            assert "--glow:" not in lk.root_css(t)
    assert le.BRAND_MARK_DARK.exists() and le.BRAND_MARK.exists()


def test_trust_scene_and_stills():
    import kompozit as kz
    assert len(kz.ekran_bolgeleri(Image.open(le.TRUST_STEPS))) == 3  # start · personalize · publish
    stills = json.loads(le.OPENING_STILLS.read_text(encoding="utf-8"))
    for tid, v in stills.items():
        if tid.startswith("_"):
            continue
        assert tid in lk.THEMES, tid
        assert 0 < v["open_mid"] < v["open_card"] <= 4800, (tid, v)
    for t in lk.THEMES.values():
        if (t.package / "listing" / "images_editorial" / "02_opening.png").exists():
            assert t.id in stills, f"{t.id}: images built but no opening still times"


def test_select():
    assert [t.no for t in le.select(["06-08", "13"])] == ["06", "07", "08", "13"]
    assert [t.no for t in le.select(["olive-ivory", "01", "all"])] == [f"{i:02d}" for i in range(1, 22)]
    for bad in (["22"], ["nope"]):
        try:
            le.select(bad)
        except SystemExit:
            continue
        raise AssertionError(f"accepted {bad}")


def test_built_sets():
    built = 0
    for t in lk.THEMES.values():
        d = t.package / "listing" / "images_editorial"
        files = sorted(p.name for p in d.glob("*.png")) if d.exists() else []
        if not files:
            continue
        built += 1
        expected = [f"{n}.png" for n in lk.UPLOAD_IMAGES]
        missing = [n for n in lk.UPLOAD_IMAGES if f"{n}.png" not in files]
        # G137: a design without its GPT mockup scenes yet (21, G821) has only the images built without a scene
        no_scenes = not any((t.collection / "assets" / "gpt" / "mockups" / f).exists()
                            for f in ("cover_hand_v2.png", "cover_hand.png", "three_phones.png"))
        assert set(files) <= set(expected) and (not missing or (no_scenes and missing == lk.UPLOAD_SCENES)), (t.id, files)
        md = (t.package / "listing" / lk.LISTING_MD).read_text(encoding="utf-8")
        rows = re.findall(r"^\| \d \| `(\d\d_\w+\.png)` \|", eu.section(md, 5), re.M)
        assert rows == expected, (t.id, rows)
        for f in files:
            im = Image.open(d / f)
            assert im.size == (2000, 2000), (t.id, f, im.size)
            if f[:-4] in lk.UPLOAD_SCENES or f == "07_how.png":
                assert lk.screen_green(im) == 0, (t.id, f)
        # the listing video of the same capture (Etsy's rules as listing_kit.ETSY has them)
        video = t.package / "listing" / "video.mp4"
        assert video.exists(), f"{t.id}: images built but no video.mp4"
        assert lk.video_problems(lk.video_facts(video)) == [], (t.id, lk.video_problems(lk.video_facts(video)))
    print(f"  built editorial sets: {built}")


def main():
    for test in (test_theme_table, test_templates_say_the_right_object, test_dark_ground, test_trust_scene_and_stills,
                 test_select, test_built_sets):
        test()
        print(f"  {test.__name__}: ok")
    print("test_listing_editorial: ok")


if __name__ == "__main__":
    main()
