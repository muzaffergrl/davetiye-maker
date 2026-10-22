"""One design's full Etsy set (4:5): cover + info slides 02–08 + lifestyle 09–19, in the template approved on 01.
usage: python build_set.py NN [NN ...]   → setNN/*.png and docs-ready JPGs in out_sets/NN_<folder>/"""
import glob, json, os, re, subprocess, sys
from pathlib import Path
from PIL import Image
import segno

HERE = Path(__file__).resolve().parent
ROOT = Path("C:/Users/Foto/Documents/davetiye-maker")
sys.path.insert(0, str(HERE))
import slides

THEMES = {nn: th for nn, th, _ in json.loads((HERE / "themes.json").read_text())}
PICKS = json.loads((HERE / "picks.json").read_text())
# what opens on the first page (from the opening of each design)
OPENS = {"06": "gatefold", "09": "linen pouch", "12": "travel wallet", "13": "storybook", "14": "lace gatefold", "18": "vellum sleeve"}
SCRIPTS = ("Vibes", "Script", "Pinyon", "Allura", "Parisienne", "Italianno", "Alex Brush", "Tangerine", "Monsieur", "Rouge",
           "Petit Formal", "Herr Von", "Mrs Saint", "Imperial", "Bilbo", "Carattere", "Ballet", "Corinthia", "Luxurious",
           "Hurricane", "Meow", "Birthstone", "Water Brush", "Sacramento", "Dancing", "Satisfy", "Cormorant Upright")


def script_font(theme):
    for f in sorted((ROOT / "platform/themes" / theme).glob("*.html")):
        for fam in re.findall(r"family=([A-Za-z+]+)", f.read_text(encoding="utf8")):
            n = fam.replace("+", " ")
            if any(k in n for k in SCRIPTS):
                return n
    return "Great Vibes"


def lum(h):
    h = h.lstrip("#"); return sum(int(h[i:i + 2], 16) for i in (0, 2, 4)) / 765


def build(nn):
    d = Path(glob.glob(str(ROOT / f"collections/{nn}_*"))[0])
    th = THEMES[nn]
    pal = json.loads((d / "palette.json").read_text(encoding="utf8"))
    p = {k: pal[k] for k in ("ink", "deep", "ivory", "primary")}
    bg = d / "assets/gpt/parts/bg_page.png"
    if not bg.exists():
        img = ROOT / "platform/themes" / th / "img"
        bg = (sorted(img.glob("bg_scene-*.webp")) or sorted(img.glob("bg*-*.webp")) or sorted(img.glob("*background*.webp")))[-1]
    bgj = HERE / f"bg{nn}_page.jpg"
    Image.open(bg).convert("RGB").resize((2000, 3000), Image.LANCZOS).save(bgj, quality=93)
    qr = HERE / f"qr{nn}.png"
    segno.make(f"https://bkestudio.com/start/demo/{th}", error="q").save(str(qr), scale=24, border=2,
                                                                         dark=p["ink"] if lum(p["ink"]) < .5 else "#111111", light="#FFFFFF")
    cap, dev, sh = HERE / f"cap{nn}", HERE / f"dev{nn}", HERE / "shots" / th
    a, b = PICKS[th]
    def scr(name, fallback="g02_home_top"):
        f = cap / f"{name}.jpg"
        return str(f if f.exists() else cap / f"{fallback}.jpg")
    cfg = {"nn": nn, "name": pal["name"], "theme": th, "pal": p, "script": script_font(th), "bg": str(bgj), "shots": str(cap),
           "qr": str(qr), "out": str(HERE / f"set{nn}"), "opens": OPENS.get(nn, "envelope"),
           "extra": {"closed": str(sh / "closed.jpg"), "opening": str(sh / f"open_{a:02d}.jpg"), "open": str(sh / f"open_{b:02d}.jpg"),
                     "typing": scr("e03_copy_labels", "e02_day_place"), "live": scr("b10_live_qr", "s01_share")},
           "mockups": str(d / "assets/gpt/mockups"),
           "life": {"open": str(sh / f"open_{b:02d}.jpg"), "closed": str(sh / "closed.jpg"), "home": scr("g02_home_top"),
                    "tablet": str(dev / "tablet_home.jpg"), "invite": scr("g03_home_invitation"), "laptop_edit": str(dev / "laptop_edit.jpg"),
                    "guests_phone": scr("p01_panel_replies"), "laptop_guests": str(dev / "laptop_guests.jpg"),
                    "print": str(HERE / f"inv{nn}_front.png"), "venue": scr("g12_details_venue"), "faq": scr("g08_details_faq"),
                    "sent": scr("g11_rsvp_sent"), "schedule": scr("g07_details_schedule"), "replies": scr("p02_panel_reply_list"),
                    "share": scr("s01_share")}}
    cf = HERE / f"cfg{nn}.json"
    cf.write_text(json.dumps(cfg, indent=1), encoding="utf8")
    r1 = subprocess.run([sys.executable, "-X", "utf8", str(HERE / "slides.py"), str(cf)], cwd=HERE, capture_output=True, text=True)
    r2 = subprocess.run([sys.executable, "-X", "utf8", str(HERE / "lifestyle.py"), str(cf)], cwd=HERE, capture_output=True, text=True)
    cover(nn, cfg)
    out = sorted((HERE / f"set{nn}").glob("*.png"))
    print(f"{nn} {th}: {len(out)} images; slides rc={r1.returncode} life rc={r2.returncode}"
          + (f"\n  slides: {r1.stderr[-400:]}" if r1.returncode else "") + (f"\n  life: {r2.stderr[-600:]}" if r2.returncode else ""))


def cover(nn, c):
    s = (HERE / "cover_v4.html").read_text(encoding="utf8")
    p = c["pal"]
    dark = lum(p["ink"]) > .5
    paper = p["primary"] if dark else "#F7F4EA"
    pr = tuple(int(paper[i:i + 2], 16) for i in (1, 3, 5))
    s = s.replace("--ink:#2F3A2B;--deep:#5E6B45;--paper:#F7F4EA;--ivory:#FBF8F0", f"--ink:{p['ink']};--deep:{p['deep']};--paper:{paper};--ivory:{p['ivory']}")
    s = s.replace("rgba(247,244,234,", f"rgba({pr[0]},{pr[1]},{pr[2]},")
    fg = p["primary"] if dark else p["ivory"]
    s = s.replace(".badge{position:absolute;width:330px;height:330px;border-radius:50%;background:var(--deep);color:var(--ivory);",
                  f".badge{{position:absolute;width:330px;height:330px;border-radius:50%;background:var(--deep);color:{fg};")
    s = s.replace("border:6px solid var(--ivory);outline:3px solid var(--deep)", f"border:6px solid {fg};outline:3px solid var(--deep)")
    s = s.replace("family=Great+Vibes", "family=" + c["script"].replace(" ", "+")).replace('"Great Vibes"', f'"{c["script"]}"')
    s = s.replace("Olive &amp; Ivory &nbsp;·&nbsp; Digital Invitation", c["name"].replace("&", "&amp;") + " &nbsp;·&nbsp; Digital Invitation")
    s1, s2 = c["extra"]["closed"], c["extra"]["open"]
    s = s.replace('<div class="scr"><img src="SCR1">', f'<div class="scr" style="--scrtop:{slides.top_color(s1)}"><img src="SCR1">')
    s = s.replace('<div class="scr"><img src="SCR2">', f'<div class="scr" style="--scrtop:{slides.top_color(s2)}"><img src="SCR2">')
    s = s.replace("SCR1", Path(s1).resolve().as_uri()).replace("SCR2", Path(s2).resolve().as_uri())
    html = HERE / f"_cv_{nn}.html"
    html.write_text(s, encoding="utf8")
    out = Path(c["out"]); out.mkdir(exist_ok=True)
    subprocess.run(["node", str(HERE / "render.mjs"), str(html), c["bg"], str(out / "01_cover.png")], check=True, cwd=HERE,
                   env={**os.environ, "W": "2000", "H": "2500"}, stdout=subprocess.DEVNULL)


if __name__ == "__main__":
    for nn in sys.argv[1:]:
        build(nn)
