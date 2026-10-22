"""Etsy listing info slides (4:5, 2000x2500) in the cover's style: big caps headline + script accent, real screens in phones,
labels, badges. usage: python slides.py <config.json> [slide ...]
config: {nn, name, theme, pal:{ink,deep,ivory,primary}, script, bg, shots, extra:{key:path}, qr, out}"""
import json, os, subprocess, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent


def uri(p):
    return Path(p).resolve().as_uri()


def head(c):
    p = c["pal"]
    dark = c.get("dark", False)
    paper = p["primary"] if dark else "#F7F4EA"
    pr = tuple(int(paper[i:i + 2], 16) for i in (1, 3, 5))
    rg = lambda a: f"rgba({pr[0]},{pr[1]},{pr[2]},{a})"
    badge_fg = p["primary"] if dark else p["ivory"]
    return f"""<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family={c['script'].replace(' ', '+')}&family=Montserrat:wght@500;600;700;800&display=block">
<style>
:root{{--ink:{p['ink']};--deep:{p['deep']};--paper:{paper};--ivory:{p['ivory']}}}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:2000px;height:2500px;overflow:hidden;background:var(--paper)}}
body{{position:relative;font-family:"Cormorant Garamond",Georgia,serif;color:var(--ink);-webkit-font-smoothing:antialiased}}
.bg{{position:absolute;inset:0;background:url("{uri(c['bg'])}") center 38%/cover}}
.veil{{position:absolute;left:-200px;right:-200px;top:-260px;height:1250px;background:radial-gradient(ellipse 50% 50% at 50% 50%, {rg(.97)} 0%, {rg(.93)} 55%, {rg(0)} 100%)}}
.veilb{{position:absolute;left:-200px;right:-200px;bottom:-300px;height:900px;background:radial-gradient(ellipse 50% 50% at 50% 50%, {rg(.95)} 0%, {rg(.85)} 50%, {rg(0)} 100%)}}
.panel{{position:absolute;background:{rg(.9)};border-radius:60px;box-shadow:0 20px 60px rgba(0,0,0,.08)}}
.c{{position:absolute;left:0;right:0;text-align:center}}
.kicker{{font-family:Montserrat,Arial,sans-serif;font-weight:600;font-size:38px;letter-spacing:.34em;text-transform:uppercase;color:var(--deep)}}
.t1{{font-weight:700;font-size:172px;line-height:1;letter-spacing:.02em;text-transform:uppercase;color:var(--ink)}}
.t2{{display:flex;align-items:baseline;justify-content:center;gap:30px;margin-top:4px}}
.t2 .w{{font-family:"{c['script']}",cursive;font-size:150px;line-height:1.05;color:var(--deep)}}
.t2 .r{{font-weight:700;font-size:172px;line-height:1;letter-spacing:.04em;text-transform:uppercase;color:var(--deep)}}
.phone{{position:absolute;border-radius:var(--rad);background:#161616;padding:var(--bez);
 box-shadow:0 0 0 5px #3a3a3a inset,0 0 0 3px #c9c3b5,0 44px 80px rgba(40,45,30,.34),0 16px 28px rgba(40,45,30,.2)}}
.phone .scr{{width:100%;height:100%;border-radius:calc(var(--rad) - var(--bez));overflow:hidden;background:#000}}
.phone .scr img{{width:100%;height:100%;border-radius:0;object-fit:cover;object-position:top;display:block}}
.phone .isl{{position:absolute;left:50%;top:calc(var(--bez) * 2.1);width:24%;height:calc(var(--bez) * 2.2);transform:translateX(-50%);border-radius:99px;background:#0d0d0d}}
.lab{{position:absolute;text-align:center;font-family:Montserrat,Arial,sans-serif;font-weight:700;font-size:40px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink)}}
.lab b{{display:inline-block;width:58px;height:58px;line-height:58px;border-radius:50%;background:var(--deep);color:{badge_fg};font-size:32px;margin-right:14px;vertical-align:4px}}
.lab small{{display:block;font-weight:500;font-size:32px;letter-spacing:.02em;text-transform:none;margin-top:10px;color:var(--deep)}}
.badge{{position:absolute;width:330px;height:330px;border-radius:50%;background:var(--deep);color:{badge_fg};display:flex;flex-direction:column;
 align-items:center;justify-content:center;text-align:center;font-family:Montserrat,Arial,sans-serif;font-weight:800;font-size:46px;line-height:1.05;letter-spacing:.04em;
 box-shadow:0 20px 44px rgba(40,45,30,.33);border:6px solid {badge_fg};outline:3px solid var(--deep)}}
.badge small{{display:block;font-weight:600;font-size:27px;letter-spacing:.12em;margin-top:10px;opacity:.92}}
.note{{position:absolute;font-family:"{c['script']}",cursive;font-size:84px;line-height:1.05;color:var(--deep)}}
.foot{{font-family:Montserrat,Arial,sans-serif;font-weight:700;font-size:40px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink)}}
ul.chk{{list-style:none}}
ul.chk li{{font-family:Montserrat,Arial,sans-serif;font-weight:600;font-size:46px;line-height:1.22;margin:0 0 40px;padding-left:96px;position:relative;color:var(--ink)}}
ul.chk li::before{{content:"";position:absolute;left:0;top:-4px;width:64px;height:64px;border-radius:50%;background:var(--deep)}}
ul.chk li::after{{content:"";position:absolute;left:23px;top:8px;width:16px;height:30px;border:solid {badge_fg};border-width:0 7px 7px 0;transform:rotate(45deg)}}
.step{{position:absolute;width:720px;font-family:Montserrat,Arial,sans-serif;color:var(--ink)}}
.step .n{{display:inline-block;width:96px;height:96px;line-height:96px;text-align:center;border-radius:50%;background:var(--deep);color:{badge_fg};font-weight:800;font-size:50px}}
.step h3{{font-family:"Cormorant Garamond",serif;font-weight:700;font-size:66px;line-height:1.05;margin:22px 0 10px;text-transform:uppercase;letter-spacing:.02em}}
.step p{{font-weight:500;font-size:38px;line-height:1.3;color:var(--deep)}}
.qrcard{{position:absolute;background:#fff;border-radius:36px;padding:44px;box-shadow:0 30px 70px rgba(40,45,30,.3)}}
</style></head><body><div class="bg"></div><div class="veil"></div>"""


def top_color(src):
    from PIL import Image
    im = Image.open(src).convert("RGB"); w = im.width
    px = [im.getpixel((x, 4)) for x in range(0, w, max(1, w // 40))]
    px.sort(key=sum)
    r, g, b = px[len(px) // 2]
    return f"#{r:02x}{g:02x}{b:02x}"


def phone(src, x, y, w, rot=0):
    h = round(w * 2.13)
    rad, bez = round(w * 0.153), round(w * 0.031)
    sb = round(h * 0.05)
    return (f'<div class="phone" style="--rad:{rad}px;--bez:{bez}px;left:{x}px;top:{y}px;width:{w}px;height:{h}px;transform:rotate({rot}deg)">'
            f'<div class="scr" style="background:{top_color(src)};padding-top:{sb}px"><img src="{uri(src)}"></div><div class="isl"></div></div>')


def title(kicker, t1, w=None, r=None, top=150):
    t2 = f'<div class="t2">{f"<span class=w>{w}</span>" if w else ""}{f"<span class=r>{r}</span>" if r else ""}</div>' if (w or r) else ""
    return f'<div class="c" style="top:{top}px"><div class="kicker">{kicker}</div></div><div class="c" style="top:{top + 95}px"><div class="t1">{t1}</div>{t2}</div>'


def slides(c):
    s, x = c["shots"], c["extra"]
    nm = c["name"].replace("&", "&amp;")
    S = {}
    # 2 — the opening, 3 steps
    S["02_reveal"] = (title(f"{nm} · The opening", "Opens like" + ("" if c.get("opens", "envelope").endswith("s") or c.get("opens") == "origami" else " a"), w="real", r=c.get("opens", "envelope")) +
        phone(x["closed"], 120, 820, 560, -3) + phone(x["opening"], 720, 790, 560, 0) + phone(x["open"], 1320, 820, 560, 3) +
        '<div class="veilb"></div>' +
        '<div class="lab" style="left:100px;width:600px;top:2080px"><b>1</b>Guests tap</div>'
        '<div class="lab" style="left:700px;width:600px;top:2080px"><b>2</b>It opens</div>'
        '<div class="lab" style="left:1300px;width:600px;top:2080px"><b>3</b>Your photo</div>'
        '<div class="c" style="top:2250px"><div class="foot">Sound &amp; animation included</div></div>')
    # 3 — RSVP
    S["03_rsvp"] = (title("Online RSVP built in", "Collect RSVPs", w="with", r="ease") +
        phone(s / "g10_rsvp_form.jpg", 190, 760, 720, -3) + phone(s / "p01_panel_replies.jpg", 1090, 700, 720, 3) +
        '<div class="veilb"></div>' +
        '<div class="lab" style="left:150px;width:800px;top:2330px">Guests reply in seconds</div>'
        '<div class="lab" style="left:1050px;width:800px;top:2330px">You see who\'s coming</div>'
        '<div class="badge" style="left:1615px;top:1720px;transform:rotate(6deg)">EXCEL<small>GUEST LIST<br>DOWNLOAD</small></div>'
        '<div class="badge" style="left:60px;top:1840px;transform:rotate(-6deg)">YOUR<small>OWN<br>QUESTIONS</small></div>')
    # 4 — edit on your phone
    S["04_edit"] = (title("No Canva · No app · No account", "Edit everything", w="on your", r="phone") +
        phone(s / "e01_edit_pages.jpg", 120, 860, 540, -3) + phone(x["typing"], 690, 790, 620, 0) + phone(x["live"], 1340, 860, 540, 3) +
        '<div class="veilb"></div>' +
        '<div class="lab" style="left:90px;width:600px;top:2090px"><b>1</b>Pick a page</div>'
        '<div class="lab" style="left:700px;width:600px;top:2150px"><b>2</b>Change any text</div>'
        '<div class="lab" style="left:1310px;width:600px;top:2090px"><b>3</b>Publish</div>'
        '<div class="badge" style="left:1620px;top:640px;transform:rotate(8deg)">NO<br>CANVA<small>NEEDED</small></div>'
        '<div class="c" style="top:2290px"><div class="foot">Every change saves by itself</div></div>')
    # 5 — every page
    S["05_pages"] = (title(f"{nm} · 4 pages + the {c.get('opens', 'envelope')}", "Every page", w="beautifully", r="included") +
        phone(s / "g02_home_top.jpg", 70, 930, 440) + phone(s / "g05_story.jpg", 545, 930, 440) +
        phone(s / "g07_details_schedule.jpg", 1020, 930, 440) + phone(s / "g09_rsvp_top.jpg", 1495, 930, 440) +
        '<div class="veilb"></div>' +
        ''.join(f'<div class="lab" style="left:{50 + i * 475}px;width:480px;top:1930px">{t}</div>'
                for i, t in enumerate(["Home", "Our Story", "Details", "RSVP"])) +
        '<div class="c" style="top:2120px"><div class="foot">Countdown · schedule · map · Q&amp;A</div></div>'
        '<div class="c" style="top:2200px"><div class="foot" style="font-weight:600;letter-spacing:.06em;text-transform:none">add-to-calendar · music · dress code · travel &amp; registry</div></div>')
    # 6 — what's included
    items = ["Envelope opening + Home, Our Story, Details &amp; RSVP pages", "Online RSVP with your own questions",
             "Guest list &amp; one-tap Excel download", "Countdown &amp; add-to-calendar", "Your 5 photos, music &amp; venue map",
             "QR code + printable invitation (PDF)", "Easy editor on phone or computer", "Online until 12 months after your wedding"]
    S["06_included"] = (title(f"{nm}", "What's", r="included") +
        phone(s / "g03_home_invitation.jpg", 110, 700, 700, -2) +
        '<div class="panel" style="left:880px;top:740px;width:1040px;height:1500px"></div>'
        '<div style="position:absolute;left:940px;top:820px;width:940px"><ul class="chk">' + "".join(f"<li>{i}</li>" for i in items) + "</ul></div>"
        '<div class="veilb"></div>''<div class="c" style="top:2330px"><div class="foot">Instant access · No Canva · No app</div></div>')
    # 7 — live demo + QR
    S["07_demo"] = (title("See it on your own phone", "Try it", w="before you", r="buy") +
        phone(x["closed"], 230, 760, 740, -3) +
        f'<div class="qrcard" style="left:1140px;top:960px;width:640px;height:640px;transform:rotate(3deg)"><img src="{uri(c["qr"])}" style="width:100%;height:100%"></div>'
        '<div class="panel" style="left:1080px;top:1660px;width:800px;height:470px"></div><div class="note" style="left:1100px;top:1680px;width:760px;text-align:center">Scan with your<br>phone camera</div>'
        '<div class="lab" style="left:1060px;width:840px;top:1960px;text-transform:none;letter-spacing:.02em;font-weight:600">or tap the demo link<br>in the description</div>'
        '<div class="badge" style="left:1610px;top:610px;transform:rotate(8deg)">LIVE<small>DEMO</small></div>'
        '<div class="veilb"></div>''<div class="c" style="top:2330px"><div class="foot">Sample names &amp; photos · yours replace them</div></div>')
    # 8 — how it works
    st = [("1", "Buy &amp; open", "the START HERE guide from your Etsy purchases"), ("2", "Start", "with your Etsy order number and first names"),
          ("3", "Personalize", "names, date, photos, story, RSVP questions"), ("4", "Publish &amp; share", "one link by text, WhatsApp, email or QR")]
    pos = [(90, 820), (1310, 820), (90, 1600), (1310, 1600)]
    S["08_how"] = (title("Simple 3-step setup", "How it", w="", r="works") +
        phone(s / "b05_setup_photo.jpg", 745, 760, 510, 0) +
        "".join(f'<div class="panel" style="left:{px - 40}px;top:{py - 40}px;width:680px;height:{560}px"></div><div class="step" style="left:{px}px;top:{py}px;width:600px"><span class="n">{n}</span><h3>{h}</h3><p>{p}</p></div>'
                for (n, h, p), (px, py) in zip(st, pos)) +
        '<div class="veilb"></div>''<div class="c" style="top:2330px"><div class="foot">Every change saves by itself · edit anytime</div></div>')
    return S


def main():
    c = json.loads(Path(sys.argv[1]).read_text(encoding="utf8"))
    c["shots"] = Path(c["shots"])
    c["dark"] = sum(int(c["pal"]["ink"][i:i + 2], 16) for i in (1, 3, 5)) > 384
    want = sys.argv[2:]
    out = Path(c["out"]); out.mkdir(parents=True, exist_ok=True)
    for k, body in slides(c).items():
        if want and k not in want:
            continue
        html = HERE / f"_sl_{c['nn']}_{k}.html"
        html.write_text(head(c) + body + "</body></html>", encoding="utf8")
        png = out / f"{k}.png"
        subprocess.run(["node", str(HERE / "render.mjs"), str(html), str(c["bg"]), str(png)], check=True, cwd=HERE,
                       env={**os.environ, "W": "2000", "H": "2500"}, stdout=subprocess.DEVNULL)
        print(png)


if __name__ == "__main__":
    main()
