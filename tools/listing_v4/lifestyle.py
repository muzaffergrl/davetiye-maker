"""Lifestyle listing images (4:5, 2000x2500): GPT PAKET 7 scene + real screens in its green areas + headline on top.
usage: python lifestyle.py <config.json> [key ...]   (config = slides.py config + "mockups" dir + "life" screen map)"""
import json, os, subprocess, sys
from pathlib import Path
from PIL import Image

sys.path.insert(0, "C:/Users/Foto/Documents/davetiye-maker/tools")
from mockup_compose import birlestir_cok, yesil_maske, yesil_bolgeler
import numpy as np
import slides

HERE = Path(__file__).resolve().parent

# key: (scene file, [screen keys left→right], kicker, t1, script, caps, foot, labels)
LIFE = [
    ("09_closeup", "p7_01_closeup", ["open"], "{name}", "Designed to be", "", "opened", "Your photo and your names", None),
    ("10_tap", "p7_02_hand_tap", ["closed"], "For your guests", "One tap", "and it", "opens", "Sound and animation included", None),
    ("11_home", "p7_03_guest_home", ["home"], "No app · No account", "Guests open it", "", "anywhere", "Just one link on any phone", None),
    ("12_devices", "p7_04_phone_tablet", ["tablet", "invite"], "Phone · Tablet · Computer", "Beautiful on", "every", "screen", None, None),
    ("13_laptop", "p7_05_laptop", ["laptop_edit"], "Your private editor", "Edit on your", "", "laptop too", "See every change in the preview", None),
    ("14_together", "p7_06_couple_planning", ["guests_phone", "laptop_guests"], "Open your editor on any device", "Plan it", "", "together", None, None),
    ("15_print", "p7_07_print_card", ["print", "closed"], "Printable invitation included", "Print it", "or", "send it", "5×7 in or A5 PDF in your design", None),
    ("16_need", "p7_08_four_phones", ["invite", "venue", "faq", "sent"], "{name}", "Everything", "your guests", "need", None,
     ["Invitation", "Venue &amp; map", "Q&amp;A", "RSVP"]),
    ("17_day", "p7_09_venue_table", ["schedule"], "On the wedding day", "The order of", "the", "day", "With add-to-calendar buttons", None),
    ("18_replies", "p7_10_bouquet", ["replies"], "Guest list included", "Every reply", "in one", "place", "Download it as Excel in one tap", None),
    ("19_share", "p7_11_share", ["share"], "Text · WhatsApp · Email · QR", "Share it with", "one", "link", "Your own address: bkestudio.com/your-names", None),
]


def match(sc, imgs):
    """Screens to green areas (left to right): when the areas differ in shape (laptop/tablet/card + phone), the widest
    screen goes to the widest area; same-shaped areas keep the given order."""
    if len(imgs) < 2:
        return imgs
    regs = yesil_bolgeler(yesil_maske(np.asarray(sc), 40), 0.01)
    if len(regs) != len(imgs):
        return imgs
    ra = []
    for r in regs:
        ys, xs = np.nonzero(r); ra.append((xs.max() - xs.min() + 1) / (ys.max() - ys.min() + 1))
    if max(ra) / min(ra) < 1.3:
        return imgs
    ia = [im.width / im.height for im in imgs]
    by_r = sorted(range(len(ra)), key=lambda i: ra[i])
    by_i = sorted(range(len(ia)), key=lambda i: ia[i])
    out = [None] * len(imgs)
    for ri, ii in zip(by_r, by_i):
        out[ri] = imgs[ii]
    return out


def main():
    c = json.loads(Path(sys.argv[1]).read_text(encoding="utf8"))
    c["shots"] = Path(c["shots"])
    c["dark"] = sum(int(c["pal"]["ink"][i:i + 2], 16) for i in (1, 3, 5)) > 384
    want = sys.argv[2:]
    out = Path(c["out"]); out.mkdir(parents=True, exist_ok=True)
    mk = Path(c["mockups"])
    nm = c["name"].replace("&", "&amp;")
    for key, scene, scr, kicker, t1, w, r, foot, labels in LIFE:
        if want and key not in want:
            continue
        sc = Image.open(mk / f"{scene}.png").convert("RGB")
        wide = sc.width > sc.height * 1.2
        W = 2000
        if wide:                                   # fill more height: scale up and keep the middle 2000 px
            H = 1660
            sw = round(H * sc.width / sc.height)
            sc = sc.resize((sw, H), Image.LANCZOS)
            comp, _ = birlestir_cok(sc, match(sc, [Image.open(c["life"][k]) for k in scr]), feather=1.2)
            x0 = (sw - W) // 2
            comp = comp.crop((x0, 0, x0 + W, H))
        else:
            H = round(W * sc.height / sc.width)
            sc = sc.resize((W, H), Image.LANCZOS)
            comp, _ = birlestir_cok(sc, match(sc, [Image.open(c["life"][k]) for k in scr]), feather=1.2)
        cp = HERE / f"_life_{c['nn']}_{key}.jpg"
        comp.save(cp, quality=94)
        top = 560 if wide else 520
        fade = (f'<div style="position:absolute;left:0;right:0;top:{top}px;height:{H}px;background:url(\'{cp.as_uri()}\') center/cover;'
                f'-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 150px,#000 calc(100% - {150 if wide else 0}px),'
                f'{"transparent" if wide else "#000"} 100%)"></div>')
        t2 = f'<div class="t2" style="margin-top:2px">{f"<span class=w style=font-size:118px>{w}</span>" if w else ""}<span class=r style="font-size:132px">{r}</span></div>'
        body = (fade +
                f'<div class="c" style="top:70px"><div class="kicker">{kicker.format(name=nm)}</div></div>'
                f'<div class="c" style="top:150px"><div class="t1" style="font-size:140px">{t1}</div>{t2}</div>')
        if labels:
            n = len(labels)
            body += "".join(f'<div class="lab" style="left:{i * W // n}px;width:{W // n}px;top:{top + H - 40}px">{t}</div>' for i, t in enumerate(labels))
        if foot:
            fy = top + H + (70 if wide else -150)
            if not wide:
                body += f'<div style="position:absolute;left:0;right:0;top:{fy - 60}px;height:300px;background:linear-gradient(to bottom,rgba(0,0,0,0),rgba(0,0,0,.42))"></div>'
            body += (f'<div class="c" style="top:{fy}px"><div class="foot" style="{"" if wide else "color:#fff;text-shadow:0 2px 14px rgba(0,0,0,.5)"};'
                     f'letter-spacing:.06em;text-transform:none;font-size:46px">{foot}</div></div>')
        html = HERE / f"_life_{c['nn']}_{key}.html"
        html.write_text(slides.head(c).replace('<div class="bg"></div><div class="veil"></div>', '<div class="bg" style="opacity:.3"></div><div class="veil"></div>') + body + "</body></html>", encoding="utf8")
        png = out / f"{key}.png"
        subprocess.run(["node", str(HERE / "render.mjs"), str(html), str(c["bg"]), str(png)], check=True, cwd=HERE,
                       env={**os.environ, "W": "2000", "H": "2500"}, stdout=subprocess.DEVNULL)
        print(png)


if __name__ == "__main__":
    main()
