#!/usr/bin/env python3
"""Tasarım 03 website görsellerini GPT parçalarından hazırlar — yalnız teknik hazırlık (K21).

  python3 collections/03_Blush_Garden_Rose/website/build_images.py [--prep] [--q 80] [--placeholders]

1. `tools/parts_prep.py` çıktısı `website/img_src/` yoksa (ya da `--prep`) onu çalıştırır
   (alfa kırpma, #00FF00 pencereleri şeffaf, windows.json). `img_src/` repoya girmez (.gitignore).
2. Ön cep (envelope_open → pocket): parts_prep bu zarfta cep sınırını bulamayıp geometrik V'ye düşüyor
   (V ucu y≈778, gerçek uç y≈1005). Burada gerçek cep kenarı sütun sütun en güçlü renk geçişine
   oturtulur, iki doğruya (sol/sağ kanat) uydurulur ve kenar yumuşatılarak kesilir.
3. Kemerli çerçeve (arch_frame): GPT'nin şeffaf zemininin pencere ortasına sızması yarı saydam yeşil bir
   halka bırakıyor. Pencere bölgesi tamamen şeffaf
   yapılır (parts_prep kutusu içinde, merkezle bağlantılı opak olmayan/yeşil pikseller); kenardaki yeşil
   yansıma G → max(R, B) ile temizlenir.
4. petals.png → alfa bileşenlerine göre 6 ayrı petal.
5. Arka plan: bg_scene (telefon, net) + "mist" (aynı görselin bulanık hâli; yatay ekran) + "mist_tile"
   (çiçeksiz orta bölgenin dokusu + dikey aynası; uzun sayfalarda repeat-y ile dikişsiz zemin).
   Açık zarf üç katmana bölünür: env_flap (kapak), env_body (iç yüz), pocket (ön cep).
6. Foto alanları (PHOTOS): assets/gpt/photos/<anahtar>.jpg varsa pencere oranına kırpılır, yoksa bg_scene'den
   yumuşak yer tutucu; ikisi de img/photo_<anahtar>-<w>.webp adına yazılır. Pencere maskeleri img/mask_*.png,
   yer tutucu etiketini açan img/photos.css.
7. Hepsi WebP, 1x/2x genişliklerde → `website/img/`; ölçüler, pencere kutuları ve kartların serbest metin
   bölgesi (free_zone, %1 bantlar) `img/manifest.json`.

Yeni şekil çizmez; yalnız kırpar, maskeler, keser, bulanıklaştırır, ölçekler.
Bağımlılık: Pillow + numpy (tools/mockup_compose yardımcıları).
"""
import argparse
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

WEB = Path(__file__).resolve().parent
COL = WEB.parent
ROOT = COL.parent.parent
SRC = WEB / "img_src"
OUT = WEB / "img"
sys.path.insert(0, str(ROOT / "tools"))
from mockup_compose import en_buyuk_bolge, genislet  # noqa: E402

# her parça: (kaynak, çıktı adı, genişlikler)
WIDTHS = {
    "envelope_closed": [440, 880],
    "envelope_open": [440, 880],  # env_flap / env_body
    "pocket": [440, 880],
    "ribbon_bow": [480, 960],
    "card_small": [320, 640],
    "invitation_card": [480, 960],
    "info_card": [480, 960],
    "arch_frame": [320, 640],
    "florals_tl": [480, 960],
    "florals_br": [480, 960],
    "divider": [300],
}


def webp(im: Image.Image, name: str, widths, q: int, manifest: dict):
    im = im.convert("RGBA") if im.mode in ("RGBA", "LA", "P") else im.convert("RGB")
    w0, h0 = im.size
    files = []
    for w in widths:
        w = min(w, w0)
        h = round(h0 * w / w0)
        r = im.resize((w, h), Image.LANCZOS) if w != w0 else im
        p = OUT / f"{name}-{w}.webp"
        r.save(p, "WEBP", quality=q, method=6, alpha_quality=90)
        files.append({"file": p.name, "w": w, "h": h, "bytes": p.stat().st_size})
    manifest[name] = {"src_size": [w0, h0], "ratio": round(w0 / h0, 5), "files": files}


# ----------------------------------------------------------------------------- cep

def cep_kes(im: Image.Image):
    """envelope_open → (pocket RGBA, bilgi). Gerçek V kenarı: sütun başına en güçlü geçiş + doğru uydurma."""
    a = np.asarray(im).astype(np.float64)
    al = a[..., 3]
    h, w = al.shape
    cols = np.flatnonzero(al.max(0) > 200)
    x0, x1 = int(cols.min()), int(cols.max())
    # gövde üstü: satır genişliği tam gövde genişliğine ulaştığı ilk satır
    full = (x1 - x0) * 0.97
    widths = (al > 200).sum(1)
    body_top = int(np.flatnonzero(widths >= full)[0])
    body_bot = int(np.flatnonzero(al.max(1) > 200).max())
    # ilk tahmin: köşeler (x0, body_top+15) ve uç (orta, gövde yüksekliğinin %62'si)
    xm = (x0 + x1) / 2
    tip0 = body_top + 0.62 * (body_bot - body_top)
    # kağıt referansı yerel: her sütunda tahmin çizgisinin 70 px altı kesin kağıttır; oradan yukarı çıkılır,
    # yerel kağıt renginden ilk kalıcı sapma (kesik kenarın açık rengi ya da astar) sınırdır. Astardaki
    # pembe şakayıklar kağıda yakın renkte olduğu için "en güçlü geçiş" aramak yanlış kenara oturuyordu.
    rgb = a[..., :3]

    def guess(x):
        f = 1 - abs(x - xm) / (xm - x0)
        return body_top + 35 + f * (tip0 - body_top - 35)

    pts = {"L": [], "R": []}
    for x in range(x0 + 20, x1 - 20, 3):
        if abs(x - xm) < 30:
            continue
        g = guess(x)
        y_start = int(min(g + 70, body_bot - 12))
        ref = np.median(rgb[y_start - 24:y_start, max(0, x - 3):x + 4].reshape(-1, 3), 0)
        d = np.sqrt(((rgb[:, x] - ref) ** 2).sum(-1))
        by = None
        for y in range(y_start - 24, int(g - 90), -1):
            if d[y - 3:y + 1].mean() > 24:
                by = y
                break
        if by is not None:
            pts["L" if x < xm else "R"].append((x, by))

    def fit(p):
        p = np.array(p, float)
        for _ in range(4):  # aykırıları at
            m, c = np.polyfit(p[:, 0], p[:, 1], 1)
            r = p[:, 1] - (m * p[:, 0] + c)
            keep = np.abs(r) < max(2.5, 2.5 * r.std())
            if keep.all():
                break
            p = p[keep]
        return m, c, float(np.abs(p[:, 1] - (m * p[:, 0] + c)).mean()), len(p)

    mL, cL, eL, nL = fit(pts["L"])
    mR, cR, eR, nR = fit(pts["R"])
    xt = (cR - cL) / (mL - mR)
    yt = mL * xt + cL
    # imzalı mesafe (aşağısı +): V kenarı y_edge(x) = min(sol(x), sağ(x)); cep bunun altı. Kenar 1 px kağıda
    # kaydırılır ki astar saçağı kalmasın.
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float64)
    dL = (yy - (mL * xx + cL)) / np.sqrt(1 + mL * mL)
    dR = (yy - (mR * xx + cR)) / np.sqrt(1 + mR * mR)
    d = np.maximum(dL, dR) + 2.0  # cep: iki kanat doğrusundan en az birinin altı; +2 px kesik kenarın açık şeridi
    cut = np.clip(d + 0.5, 0, 1)
    cut[:body_top] = 0
    pa = al * cut
    pa[al < 200] = 0  # gölge ve kenar AA'sı arka katmanda zaten var; ikilenmesin
    out = np.asarray(im).copy()
    out[..., 3] = np.round(pa).astype(np.uint8)
    info = {"body": [x0, body_top, x1, body_bot], "tip": [round(xt, 1), round(yt, 1)],
            "left": [round(mL, 4), round(cL, 2), round(eL, 2), nL],
            "right": [round(mR, 4), round(cR, 2), round(eR, 2), nR]}
    return Image.fromarray(out, "RGBA"), info


# ----------------------------------------------------------------------------- çerçeve penceresi

def pencere_temizle(im: Image.Image, kutu):
    """Çerçeve penceresi: parts_prep kutusu (+4 px) içinde, merkezle bağlantılı opak olmayan ya da yeşil
    pikseller tamamen şeffaf yapılır. Dışarıdan taşma dolgusu kullanılmaz: kaidedeki çiçeklerin yumuşak
    alfası pencereyi dışarıya bağlıyor (dolgu sızıyor). Opak altın/çiçek pikseline dokunulmaz."""
    a = np.asarray(im).copy()
    al = a[..., 3]
    h, w = al.shape
    x, y, bw, bh = kutu
    pad = 4
    kut = np.zeros((h, w), bool)
    kut[max(0, y - pad):min(h, y + bh + pad), max(0, x - pad):min(w, x + bw + pad)] = True
    yesil = (a[..., 1].astype(int) - np.maximum(a[..., 0], a[..., 2]).astype(int)) > 20
    aday = kut & ((al < 200) | yesil)
    m = Image.fromarray(np.where(aday, 0, 255).astype(np.uint8), "L").copy()  # fromarray salt okunur; floodfill sessizce yazmaz
    cx, cy = int(x + bw / 2), int(y + bh / 2)
    if np.asarray(m)[cy, cx] != 0:
        raise SystemExit("arch_frame: pencere merkezi opak; kutu yanlış")
    ImageDraw.floodfill(m, (cx, cy), 64)
    win_all = np.asarray(m) == 64
    a[..., 3][win_all] = 0
    # kenar yeşil yansıması: 4 px içinde G'yi max(R,B)'ye kırp (altın/krem zaten G < R)
    yakin = genislet(win_all, 4) & ~win_all
    g = a[..., 1].astype(int)
    mx = np.maximum(a[..., 0], a[..., 2]).astype(int)
    fix = yakin & (g > mx)
    a[..., 1][fix] = mx[fix]
    a[..., :3][win_all] = 0
    return Image.fromarray(a, "RGBA"), win_all


# ----------------------------------------------------------------------------- petaller

def petaller(im: Image.Image, n=6):
    a = np.asarray(im)
    m = a[..., 3] > 24
    out = []
    kalan = m.copy()
    for _ in range(n):
        b = en_buyuk_bolge(kalan)
        if b.sum() < 500:
            break
        kalan &= ~b
        ys, xs = np.nonzero(b)
        pad = 6
        box = (max(0, xs.min() - pad), max(0, ys.min() - pad),
               min(a.shape[1], xs.max() + 1 + pad), min(a.shape[0], ys.max() + 1 + pad))
        crop = im.crop(box)
        # yalnız bu bileşen (komşu petalin ucu girmesin)
        cm = Image.fromarray((genislet(b, 3)[box[1]:box[3], box[0]:box[2]] * 255).astype(np.uint8), "L")
        ca = np.asarray(crop).copy()
        ca[..., 3] = np.minimum(ca[..., 3], np.asarray(cm))
        out.append((box, Image.fromarray(ca, "RGBA")))
    out.sort(key=lambda t: (t[0][1] // 200, t[0][0]))
    return [p for _, p in out]


# ----------------------------------------------------------------------------- fotoğraf alanları
# G036 örnek fotoğrafları gelince yalnız bu betik yeniden çalıştırılır; HTML aynı dosya adlarını kullanır
# (img/photo_<anahtar>-<genişlik>.webp). Dosya yoksa aynı ada zarif bir yer tutucu yazılır: bg_scene'den
# yumuşak, tonlanmış bir kırpım; "Your photo here" etiketi HTML'dedir ve img/photos.css ile yalnız yer tutucu
# alanlarda görünür.
PHOTO_DIR = COL / "assets/gpt/photos"
#  anahtar          kaynak (PHOTO_DIR)    pencere  çıktı genişlikleri  yer tutucu kırpım kutusu (bg_scene px)  odak y
PHOTOS = {
    "hero_portrait": ("hero_portrait.jpg", "card", [320, 640], (20, 30, 500, 530), .38),
    "story_1":       ("story_1.jpg",       "arch", [300, 600], (0, 100, 400, 650), .40),
    "story_2":       ("story_2.jpg",       "arch", [300, 600], (600, 980, 1024, 1536), .40),
    "story_3":       ("story_3.jpg",       "arch", [300, 600], (520, 40, 960, 640), .40),
    "venue":         ("venue.jpg",         "venue", [480, 960], (0, 850, 1024, 1536), .50),
}
VENUE_ASPECT = 3 / 2


def kapla(im: Image.Image, oran: float, odak_y: float = .5) -> Image.Image:
    """Oranı `oran` (g/y) olan en büyük kırpım; yatayda ortalı, dikeyde odak_y (yüz için yukarı)."""
    w, h = im.size
    if w / h > oran:
        cw = round(h * oran)
        x0 = (w - cw) // 2
        return im.crop((x0, 0, x0 + cw, h))
    ch = round(w / oran)
    y0 = int(round((h - ch) * odak_y))
    return im.crop((0, y0, w, y0 + ch))


def yer_tutucu(bg: Image.Image, kutu, oran: float, w: int = 640) -> Image.Image:
    """bg_scene'den yumuşak odaklı, açık tonlanmış kırpım (düz pembe kutu değil)."""
    p = kapla(bg.crop(kutu), oran)
    p = p.resize((w, round(w / oran)), Image.LANCZOS).filter(ImageFilter.GaussianBlur(9 * w / 640))
    return Image.blend(p, Image.new("RGB", p.size, (248, 233, 231)), 0.34)


def pencere_maskesi(win: np.ndarray, pay: int = 2):
    """Pencere bölgesi (+pay px, çerçevenin altına taşsın diye) → (beyaz alfa maskesi, [x0, y0, x1, y1])."""
    m = genislet(win, pay)
    ys, xs = np.nonzero(m)
    x0, y0, x1, y1 = int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1
    a = (m[y0:y1, x0:x1] * 255).astype(np.uint8)
    rgba = np.dstack([np.full_like(a, 255)] * 3 + [a])
    return Image.fromarray(rgba, "RGBA"), [x0, y0, x1, y1]


def kart_penceresi(cs: Image.Image, kutu) -> np.ndarray:
    a = np.asarray(cs)
    x, y, w, h = kutu
    m = np.zeros(a.shape[:2], bool)
    m[y:y + h, x:x + w] = a[y:y + h, x:x + w, 3] < 128
    return m


# ----------------------------------------------------------------------------- serbest bölge (metin denetimi)

def serbest_bolge(im: Image.Image, merkez: float, adim: float = 1.0, ornek=(.5, .55)):
    """Kart yüzünde düz kağıt bölgesi: her %adim yükseklik bandında, merkez sütundan sola/sağa ilk "dolu"
    piksele (çiçek, altın çizgi, pencere, şeffaflık) kadar olan aralık [y%, sol%, sağ%]. make_previews.cjs
    HTML metin satırlarının bu aralıkta kaldığını (boyanmış çiçeğe değmediğini) bununla denetler."""
    a = np.asarray(im.convert("RGBA")).astype(np.int16)
    H, W = a.shape[:2]
    paper = np.median(a[int(H * ornek[0]):int(H * ornek[1]), int(W * .4):int(W * .6), :3].reshape(-1, 3), 0)
    d = np.sqrt(((a[..., :3] - paper) ** 2).sum(-1))
    busy = (d > 28) | (a[..., 3] < 200)
    busy = genislet(~genislet(~busy, 2), 2)   # açma: kağıt dokusundaki < 5 px lekeler sayılmaz
    c = int(W * merkez)
    out = []
    y = 0.0
    while y < 100:
        y0, y1 = int(H * y / 100), max(int(H * y / 100) + 1, int(H * (y + adim) / 100))
        band = busy[y0:y1].any(0)
        if band[c]:
            out.append([round(y, 2), None, None])
        else:
            L = c
            while L > 0 and not band[L - 1]:
                L -= 1
            R = c
            while R < W - 1 and not band[R + 1]:
                R += 1
            out.append([round(y, 2), round(100 * L / W, 2), round(100 * (R + 1) / W, 2)])
        y += adim
    return out


# ----------------------------------------------------------------------------- ana

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--prep", action="store_true", help="parts_prep'i yeniden çalıştır")
    ap.add_argument("--q", type=int, default=80)
    ap.add_argument("--placeholders", action="store_true", help="fotoğraf olsa da yer tutucu yaz (boş durum önizlemesi)")
    args = ap.parse_args()

    if args.prep or not (SRC / "windows.json").exists():
        r = subprocess.run([sys.executable, str(ROOT / "tools/parts_prep.py"), str(COL.relative_to(ROOT)),
                            "--out", "website/img_src"], cwd=ROOT)
        if r.returncode != 0:
            sys.exit("parts_prep başarısız")
    OUT.mkdir(exist_ok=True)
    for f in list(OUT.glob("*.webp")) + list(OUT.glob("mask_*.png")):
        f.unlink()
    win = json.loads((SRC / "windows.json").read_text())["pencereler"]
    manifest = {"_note": "build_images.py çıktısı; ölçüler px, pencere kutuları [x, y, w, h] kaynak katman pikseli"}

    # zarflar
    eo = Image.open(SRC / "envelope_open.png").convert("RGBA")
    pocket, cep = cep_kes(eo)
    print("cep", cep)
    # açık zarf üç katman: kapak (menteşede 3D döner), gövde (iç yüz + astar), ön cep. Aynı tuval genişliği;
    # kapak 0..gövde_üstü+3, gövde ve cep gövde_üstü−2..son satır (5 px bindirme, dikiş görünmesin).
    bt = cep["body"][1]
    W, H = eo.size
    webp(eo.crop((0, 0, W, bt + 3)), "env_flap", WIDTHS["envelope_open"], args.q, manifest)
    webp(eo.crop((0, bt - 2, W, H)), "env_body", WIDTHS["envelope_open"], args.q, manifest)
    webp(pocket.crop((0, bt - 2, W, H)), "pocket", WIDTHS["pocket"], args.q, manifest)
    manifest["envelope_open"] = {"src_size": [W, H], "body": cep["body"], "flap_rows": [0, bt + 3],
                                 "body_rows": [bt - 2, H], "tip": cep["tip"]}
    manifest["pocket"]["cut"] = cep
    ec = Image.open(SRC / "envelope_closed.png").convert("RGBA")
    al = np.asarray(ec)[..., 3]
    r_, c_ = np.flatnonzero(al.max(1) > 200), np.flatnonzero(al.max(0) > 200)
    webp(ec, "envelope_closed", WIDTHS["envelope_closed"], args.q, manifest)
    manifest["envelope_closed"]["body"] = [int(c_.min()), int(r_.min()), int(c_.max()), int(r_.max())]

    rb = Image.open(SRC / "ribbon_bow.png").convert("RGBA")
    webp(rb, "ribbon_bow", WIDTHS["ribbon_bow"], args.q, manifest)
    ra = np.asarray(rb)[..., 3]
    ends = [np.flatnonzero(ra[:, x] > 200) for x in (30, rb.width - 30)]
    manifest["ribbon_bow"]["band_rows_at_ends"] = [[int(e.min()), int(e.max())] for e in ends]

    cs = Image.open(SRC / "card_small.png").convert("RGBA")
    webp(cs, "card_small", WIDTHS["card_small"], args.q, manifest)
    manifest["card_small"]["window"] = win["card_small"][0]["kutu"]

    af = Image.open(SRC / "arch_frame.png").convert("RGBA")
    af, af_win = pencere_temizle(af, win["arch_frame"][0]["kutu"])
    print("arch_frame pencere px", int(af_win.sum()))
    webp(af, "arch_frame", WIDTHS["arch_frame"], args.q, manifest)
    manifest["arch_frame"]["window"] = win["arch_frame"][0]["kutu"]

    # foto alanı maskeleri (pencere şekli, 2 px taşma) + kutu yüzdeleri (site.css .photo-slot konumları bunlar)
    slots = {}
    for ad, katman, w_ in (("card", cs, kart_penceresi(cs, win["card_small"][0]["kutu"])), ("arch", af, af_win)):
        mask, (x0, y0, x1, y1) = pencere_maskesi(w_)
        mask.thumbnail((320, 480), Image.LANCZOS)
        mask.save(OUT / f"mask_{ad}.png", optimize=True)
        W_, H_ = katman.size
        slots[ad] = {"box_pct": [round(100 * x0 / W_, 3), round(100 * y0 / H_, 3), round(100 * (x1 - x0) / W_, 3),
                                 round(100 * (y1 - y0) / H_, 3)], "aspect": round((x1 - x0) / (y1 - y0), 4),
                     "mask": f"mask_{ad}.png"}
    slots["venue"] = {"aspect": round(VENUE_ASPECT, 4)}
    manifest["photo_slots"] = slots

    for nm in ("invitation_card", "info_card", "florals_tl", "florals_br", "divider"):
        webp(Image.open(SRC / f"{nm}.png"), nm, WIDTHS[nm], args.q, manifest)
    # kağıt merkezi (alfa kutusundaki kağıdın ortası) — ölçüm: invitation 48.7 %, info 49.2 %
    for nm, mx, ornek in (("invitation_card", .487, (.5, .55)), ("info_card", .492, (.5, .55)),
                          ("card_small", .5, (.8, .86))):   # card_small: kağıt örneği pencerenin altından
        manifest[nm]["free_zone"] = serbest_bolge(Image.open(SRC / f"{nm}.png"), mx, ornek=ornek)

    for i, p in enumerate(petaller(Image.open(SRC / "petals.png").convert("RGBA")), 1):
        p.thumbnail((200, 200), Image.LANCZOS)
        webp(p, f"petal{i}", [p.width], args.q, manifest)

    # arka planlar (GPT bg_scene, 1024×1536)
    bg = Image.open(COL / "assets/gpt/parts/bg_scene.png").convert("RGB")
    webp(bg, "bg_scene", [640, 1024], 78, manifest)
    mist = bg.resize((640, 960), Image.LANCZOS).filter(ImageFilter.GaussianBlur(5))
    webp(mist, "mist", [640], 82, manifest)
    # uzun sayfa zemini: bg_scene'in çiçeksiz sakin ortası (yalnız fırça dokusu), hafif yumuşatılmış ve sayfa
    # rengine %30 karıştırılmış; kendisi + dikey aynası alt alta → repeat-y ile dikişsiz.
    calm = bg.crop((280, 470, 880, 1000)).resize((640, 565), Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.6))
    calm = Image.blend(calm, Image.new("RGB", calm.size, (242, 216, 215)), 0.30)
    tile = Image.new("RGB", (calm.width, calm.height * 2))
    tile.paste(calm, (0, 0))
    tile.paste(calm.transpose(Image.FLIP_TOP_BOTTOM), (0, calm.height))
    webp(tile, "mist_tile", [640], 80, manifest)

    # fotoğraflar: gerçek dosya varsa onu, yoksa yer tutucuyu aynı ada yaz
    photos, css_on = {}, []
    for key, (dosya, pencere, gen, kutu, odak) in PHOTOS.items():
        oran = slots[pencere]["aspect"]
        kaynak = PHOTO_DIR / dosya
        if kaynak.exists() and not args.placeholders:
            im = kapla(Image.open(kaynak).convert("RGB"), oran, odak)
            gercek = True
        else:
            im = yer_tutucu(bg, kutu, oran, max(gen))
            gercek = False
            css_on.append(f'.photo-slot[data-slot="{key}"] .ph-mark')
        webp(im, f"photo_{key}", gen, 82, manifest)
        photos[key] = {"source": str(kaynak.relative_to(ROOT)), "real": gercek, "aspect": oran}
        print("foto", key, "GERCEK" if gercek else "yer tutucu", f"oran {oran}")
    manifest["photos"] = photos
    (OUT / "photos.css").write_text(
        "/* build_images.py çıktısı — elle düzenlenmez. Yer tutucu foto alanlarında \"Your photo here\" işaretini açar;\n"
        "   gerçek fotoğraf gelen alanda (assets/gpt/photos/) işaret kapanır. */\n"
        + ((",\n".join(css_on) + " { display: flex; }\n") if css_on else ""))

    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=1, ensure_ascii=False))
    tot = sum(f.stat().st_size for f in OUT.glob("*.webp"))
    print(f"{len(list(OUT.glob('*.webp')))} webp, toplam {tot / 1024:.0f} KB → {OUT}")


if __name__ == "__main__":
    main()
