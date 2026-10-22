"""tools/recolor_parts.py testleri (G153) — sahte görseller kod içinde üretilir; pilot tasarımlar (01, 03, 21) yalnız okunur.

  python3 -m pytest tools/tests/test_recolor_parts.py -q
"""
import json
import sys
from pathlib import Path

import numpy as np
import pytest

ARACLAR = Path(__file__).resolve().parent.parent
ROOT = ARACLAR.parent
sys.dont_write_bytecode = True
sys.path.insert(0, str(ARACLAR))
import recolor_parts as rp  # noqa: E402

PILOTS = {"01": "olive-ivory", "03": "blush-garden-rose", "21": "crimson-rose-atelier"}


def fam(anchor, target, **kw):
    return {"anchor": rp.rgb_to_oklab(rp.hex_rgb(anchor)), "target": None if target is None else rp.rgb_to_oklab(rp.hex_rgb(target)), **kw}


def test_oklab_roundtrip():
    rgb = np.array([[12, 200, 90], [255, 255, 255], [0, 0, 0], [130, 126, 84]], float)
    assert np.allclose(rp.oklab_to_rgb(rp.rgb_to_oklab(rgb)), rgb, atol=0.6)


def test_anchor_maps_to_target_and_neutrals_stay():
    out = rp.transfer(np.array([rp.hex_rgb("#827E54"), rp.hex_rgb("#F3EEE4"), rp.hex_rgb("#808080")]),
                      [fam("#827E54", "#7F95A8", sigma=20)])
    assert rp.rgb_hex(out[0]) in {"#7F95A8", "#7F95A9", "#7E95A8", "#7F94A8"}
    assert np.abs(out[1] - rp.hex_rgb("#F3EEE4")).max() < 6   # pale paper: below the chroma threshold
    assert np.abs(out[2] - 128).max() < 1                       # grey: no hue


def test_keep_family_and_far_hues_unchanged():
    gold = rp.hex_rgb("#D3B688")
    red = rp.hex_rgb("#B0302A")
    leaf = fam("#767A51", "#2F3E5C", sigma=20)
    alone = rp.transfer(np.array([gold, red]), [leaf])
    kept = rp.transfer(np.array([gold, red]), [leaf, fam("#D3B688", None, sigma=9)])
    # a keep family (metal gold) takes its share of the weight: the neighbouring family pulls less (the wider the
    # keep family's sigma, the less — recolor.json's seal_gold / pale_gold for the 01 seal)
    assert np.abs(kept[0] - gold).max() < np.abs(alone[0] - gold).max()
    wide = rp.transfer(np.array([gold]), [leaf, fam("#D3B688", None, sigma=16), fam("#DCCB9F", None, sigma=16)])
    assert np.abs(wide[0] - gold).max() < np.abs(kept[0] - gold).max()
    assert np.abs(kept[1] - red).max() < 2   # a far hue is untouched


def test_texture_and_cmin():
    # lightness differences survive (texture), a family's cmin keeps pale tones out of it
    a = np.array([rp.hex_rgb("#6F7B4B"), rp.hex_rgb("#8E9A6A")])
    out = rp.transfer(a, [fam("#767A51", "#7F95A8", sigma=24)])
    la = rp.rgb_to_oklab(a)[:, 0]
    lb = rp.rgb_to_oklab(out)[:, 0]
    assert abs((la[1] - la[0]) - (lb[1] - lb[0])) < 0.01
    paper = rp.hex_rgb("#EDE4D0")
    kept = rp.transfer(paper[None, :], [fam("#767A51", "#2F3E5C", sigma=40, cmin=0.03, cfull=0.05)])[0]
    assert np.abs(kept - paper).max() < 1


def test_cmax_keeps_vivid_pixels_of_the_same_hue():
    # G158: a pale grey-pink paper and a vivid pink blossom share a hue; cmax moves only the paper
    paper, blossom = rp.hex_rgb("#CDC0C0"), rp.hex_rgb("#F4A0B0")
    out = rp.transfer(np.array([paper, blossom]), [fam("#CDC0C0", "#B8C2B0", sigma=25, cmin=0.004, cfull=0.009, cmax=0.03)])
    assert np.abs(out[0] - rp.hex_rgb("#B8C2B0")).max() < 4
    assert np.abs(out[1] - blossom).max() < 1


def test_part_status_palette_override():
    # G158: a palette may send a part to GPT (or keep it) while the manifest default stays auto
    part = {"recolor": "auto", "group": "floral"}
    assert rp.part_status({}, "closure", part) == "auto"
    assert rp.part_status({"recolor": {"closure": "gpt"}}, "closure", part) == "gpt"
    with pytest.raises(rp.RecolorError):
        rp.part_status({"id": "V02_x", "recolor": {"closure": "paint"}}, "closure", part)
    with pytest.raises(rp.RecolorError):
        rp.part_status({"id": "V02_x", "recolor": {"bg": "auto"}}, "bg", {"recolor": "keep", "why": "paper"})


def test_lightness_gate():
    dark, pale = rp.hex_rgb("#5E7591"), rp.hex_rgb("#CBDCEB")
    fams = [fam("#5E7591", "#A86F72", sigma=20, lmax=0.72), fam("#CBDCEB", "#F3E4E1", sigma=20, cmin=0.005, cfull=0.015, lmin=0.78)]
    out = rp.transfer(np.array([dark, pale]), fams)
    assert np.abs(out[0] - rp.hex_rgb("#A86F72")).max() < 3   # dark seal → only the seal family
    assert np.abs(out[1] - rp.hex_rgb("#F3E4E1")).max() < 3   # pale paper → only the paper family


def test_recolor_image_keeps_alpha(tmp_path):
    from PIL import Image
    arr = np.zeros((8, 8, 4), np.uint8)
    arr[..., :3] = (130, 126, 84)
    arr[..., 3] = np.arange(64, dtype=np.uint8).reshape(8, 8) * 4
    p = tmp_path / "part-8.png"
    Image.fromarray(arr, "RGBA").save(p)
    im, _ = rp.recolor_image(p, [fam("#827E54", "#6E2434")])
    out = np.array(im)
    assert (out[..., 3] == arr[..., 3]).all()
    assert out[0, 0, 0] > out[0, 0, 1]  # now red-ish


def test_part_key():
    assert rp.part_key("env_body-880.webp") == "env_body"
    assert rp.part_key("og-1200x630.jpg") == "og-1200x630"
    assert rp.part_key("favicon.png") == "favicon"
    assert rp.part_key("rose-branch.webp") == "rose-branch"


def test_tokenize_css():
    css = ":root {\n  --ink: #2F3A2B;\n}\n/* #123456 in a comment */\n.a { color: rgba(52, 58, 36, .18); border: 1px solid #b39a63; box-shadow: 0 0 2px rgba(0,0,0,.2); background: #fff }\n.b { background: #4b0c17f5 }\n"
    new, toks = rp.tokenize_css(css)
    assert toks == {"--c-343a24": "52 58 36", "--c-b39a63": "179 154 99", "--c-4b0c17": "75 12 23"}
    assert "rgb(var(--c-343a24)/.18)" in new
    assert "solid rgb(var(--c-b39a63))" in new
    assert "rgb(var(--c-4b0c17)/.961)" in new
    assert "rgba(0,0,0,.2)" in new and "#fff" in new         # greys stay
    assert "#123456 in a comment" in new
    assert "--c-343a24:52 58 36;" in new.split("}")[0]      # defined in :root
    assert rp.tokenize_css(new)[0] == new                    # idempotent
    # channels no palette changes become literals again (#rrggbb / #rrggbbaa)
    back = rp.inline_unused_channels(new, {"--c-4b0c17"})
    assert "#343a242e" in back and "solid #b39a63" in back and "rgb(var(--c-4b0c17)/.961)" in back
    assert "--c-343a24:" not in back and "--c-4b0c17:75 12 23;" in back


def test_fix_contrast():
    text, changed = rp.fix_contrast(rp.hex_rgb("#C99A9A"), rp.hex_rgb("#EDE4D0"), 4.5)
    assert changed and rp.contrast(text, rp.hex_rgb("#EDE4D0")) >= 4.5
    light, changed = rp.fix_contrast(rp.hex_rgb("#3A2A2B"), rp.hex_rgb("#1F2A44"), 4.5)
    assert changed and rp.contrast(light, rp.hex_rgb("#1F2A44")) >= 4.5
    same, changed = rp.fix_contrast(rp.hex_rgb("#222222"), rp.hex_rgb("#FFFFFF"), 4.5)
    assert not changed


def test_palette_validation(tmp_path):
    d = tmp_path / "99_Test" / "variants" / "V02_bad"
    d.mkdir(parents=True)
    (d / "palette.json").write_text(json.dumps({"id": "V02_bad", "slug": "Bad Slug", "name": "", "swatch": []}))
    with pytest.raises(rp.RecolorError) as e:
        rp.load_palettes(tmp_path / "99_Test")
    msg = str(e.value)
    assert "slug" in msg and "name" in msg and "swatch" in msg and "ink" in msg


@pytest.mark.parametrize("no,theme", sorted(PILOTS.items()))
def test_pilot_designs_are_complete(no, theme):
    design = rp.design_dir(no)
    assert rp.check(design) == []
    spec = rp.load_spec(design)
    # photos are never recoloured
    for name, part in spec["parts"].items():
        if part.get("why", "").startswith("photo:"):
            assert part["recolor"] == "keep", name
    tj = json.loads((ROOT / "platform/themes" / theme / "theme.json").read_text())
    assert len(tj["variants"]) == 5 and all(v["status"] == "coming" for v in tj["variants"])
    css = (ROOT / "platform/themes" / theme / "variants.css").read_text()
    # every contrast pair holds in every palette's tokens
    base = {}
    for f in [*spec["css"]["files"], "variants.css"]:  # variants.css :root = the channel tokens (G157)
        p = ROOT / "platform/themes" / theme / f
        if p.exists():
            for k, v in rp.root_tokens(p.read_text()).items():
                base.setdefault(k, v[1])
    for v in tj["variants"]:
        block = css.split(f'html[data-variant="{v["id"]}"] {{', 1)[1].split("}", 1)[0]
        vals = dict(base)
        for name, value in rp.TOKEN_DEF_RE.findall(block):
            vals[name] = rp.parse_color(value)[0]
        for text, ground, need in spec["css"]["contrast"]:
            assert rp.contrast(vals[text], vals[ground]) >= need - 0.01, (v["id"], text, ground)
    for v in tj["variants"]:
        pr = v.get("print", {})
        for k in ("ink", "accent"):
            if k in pr:
                assert rp.contrast(rp.hex_rgb(pr[k]), rp.hex_rgb(spec["print_colors"]["paper"])) >= 4.5 - 0.01


def test_build_dry_run_does_not_write(tmp_path, monkeypatch):
    design = rp.design_dir("21")
    theme = ROOT / "platform/themes/crimson-rose-atelier"
    before = (theme / "variants.css").read_text()
    rep = rp.build(design, "V03_plum_gold", sheet=False, write=False)
    assert rep["V03_plum_gold"]["slug"] == "plum-gold"
    assert rep["V03_plum_gold"]["images"] >= 3
    assert (theme / "variants.css").read_text() == before


G157 = {"09": "lavender-provence", "10": "tuscan-vineyard", "11": "boho-pampas-terracotta",
        "12": "tropical-destination", "13": "enchanted-forest-storybook", "14": "ivory-lace-pearls"}


@pytest.mark.parametrize("no,theme", sorted(G157.items()))
def test_g157_designs_are_complete(no, theme):
    test_pilot_designs_are_complete(no, theme)


def test_unchanged_parts_are_not_copied():
    """G157: a palette that keeps every family of a part writes no copy of it (the asset route serves the original)."""
    from PIL import Image
    a = Image.new("RGBA", (8, 8), (120, 80, 160, 255))
    b = Image.new("RGBA", (8, 8), (121, 80, 159, 255))
    c = Image.new("RGBA", (8, 8), (90, 120, 160, 255))
    assert rp.unchanged(a, b) and not rp.unchanged(a, c)
    design = rp.design_dir("14")
    spec = rp.load_spec(design)
    pal = next(p for p in rp.load_palettes(design) if p["slug"] == "dusty-blue")
    out = ROOT / "platform/themes/ivory-lace-pearls/img/variants/dusty-blue"
    for name, part in spec["parts"].items():
        fams = pal["families"]
        if part["recolor"] == "auto" and all(fams.get(f) is None for f in spec["groups"][part["group"]]):
            assert not list(out.glob(f"{name}-*")), name


@pytest.mark.parametrize("theme", ["olive-ivory", "dusty-blue-champagne", "blush-garden-rose", "vintage-airmail-love-letter",
                                   "mediterranean-lemon", "art-deco-black-tie", "burgundy-velvet-autumn", "winter-evergreen",
                                   "crimson-rose-atelier"])
def test_variants_css_header_comment_closes_once(theme):
    """G156: a '*/' inside the generated header (e.g. 'variants/*/palette.json') closed the comment early and the browser
    dropped the :root channel defaults — the original palette then lost every rgb(var(--c-…)) colour."""
    css = (ROOT / "platform/themes" / theme / "variants.css").read_text()
    head, _, rest = css.partition("*/")
    assert head.startswith("/*") and "/*" not in head[2:]
    assert rest.lstrip().startswith(":root {"), rest[:80]


def test_root_tokens_reads_every_root_block():
    """G177: 24 keeps its stage geometry in one :root and its colours in a second one; both are read, first definition wins."""
    css = ":root{--stage-ar:880/1344;--rule:1px dashed #6e5119b3}\n.a{color:red}\n:root{--velvet:#0e3d40;--gold:#c9a45c}\n:root{--gold:#000000}"
    toks = rp.root_tokens(css)
    assert set(toks) == {"--velvet", "--gold"}
    assert rp.rgb_hex(toks["--gold"][1]) == "#C9A45C"


# docs/35: 22 (G422) and 23 (G423) were rebuilt from their own layered GPT parts; their palettes are redone from the new
# art later.
G177 = {"24": "grand-theatre-premiere", "25": "orient-express-voyage",
        "26": "kintsugi-washi", "27": "riad-lantern-nights", "28": "maison-patisserie", "29": "celestial-observatory",
        "30": "azulejo-mosaic", "31": "sky-lantern-festival", "32": "music-box-ballerina"}


@pytest.mark.parametrize("no,theme", sorted(G177.items()))
def test_g177_designs_are_complete(no, theme):
    """G177: 22–32 got their palettes CSS-only (every part is interim until GPT); the five stay coming."""
    test_pilot_designs_are_complete(no, theme)
    test_variants_css_header_comment_closes_once(theme)


def test_channels_go_to_the_colour_root_not_the_stage_block():
    """G177: 24's first :root is the stage geometry block build_images.py rewrites; the channel tokens go to the colour :root."""
    css = (":root{--stage-ar:880/1344;--rule:1px dashed #6e5119b3}\n:root{--velvet:#0e3d40}\n"
           ".nav{background:#061416f2}")
    new, toks = rp.tokenize_css(css)
    stage, colours = list(rp.ROOT_BLOCK_RE.finditer(new))[:2]
    assert "--c-" not in stage.group(0) and "--c-061416:6 20 22;" in colours.group(0)
    assert "rgb(var(--c-061416)/.949)" in new
