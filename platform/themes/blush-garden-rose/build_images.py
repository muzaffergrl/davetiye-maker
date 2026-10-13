#!/usr/bin/env python3
"""Blush Garden Rose teması — img/ klasörünü GPT parçalarından üretir. Yalnız teknik hazırlık (K21):
kırpar, maskeler, keser, bulanıklaştırır, ölçekler; yeni şekil çizmez.

  python3 platform/themes/blush-garden-rose/build_images.py [--prep-dir DIR] [--q 80]

Kaynak: collections/03_Blush_Garden_Rose/assets/gpt/parts/ (G030/G047). Önce tools/parts_prep.py çalışır
(alfa kırpma, #00FF00 pencereleri + GPT "bulut lekesi" şeffaf, windows.json); ara çıktı geçici klasöre
(ya da --prep-dir) yazılır, repoya girmez. G035'in yardımcıları (ön cep kesimi, petaller, yer tutucu,
serbest bölge) collections/03_Blush_Garden_Rose/website/build_images.py'den alınır, o dosya değişmez.

G035 demosundan farkları (platform teması):
  * Fotoğraf görsele PİŞİRİLMEZ. Her foto alanı nötr bir yer tutucu alır (img/ph_<anahtar>-<w>.webp:
    bg_scene'den yumuşak, tonlanmış kırpım); alıcının fotoğrafını platform `data-photo` ile üstüne koyar.
  * Mekân: GPT yatay altın çerçeve (frame_landscape, G047) + pencere maskesi (img/mask_landscape.png).
  * Kapalı zarfın kapağı ayrı katman (img/env_cflap-*.webp): tırtıklı kenarı izlenerek kesilir, açılışta
    menteşesinde 3D kalkar; sonra açık zarfın kapağı (env_flap) devralır.
Çıktı: img/*.webp, img/mask_*.png, img/manifest.json (ölçüler, foto alanı kutuları, kart serbest bölgeleri,
kapak geometrisi). site.css'teki yüzdeler manifest'ten alınmıştır; görsel değişirse onlar da güncellenir.
Bağımlılık: Pillow + numpy.
"""
import argparse
import importlib.util
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image

THEME = Path(__file__).resolve().parent
ROOT = THEME.parents[2]
COL = ROOT / "collections/03_Blush_Garden_Rose"
OUT = THEME / "img"
sys.dont_write_bytecode = True  # G035 ve tools/ klasörlerine __pycache__ yazma
sys.path.insert(0, str(ROOT / "tools"))
from mockup_compose import genislet  # noqa: E402

_spec = importlib.util.spec_from_file_location("g035_build", COL / "website/build_images.py")
g035 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(g035)

WIDTHS = {
    "envelope_closed": [440, 880], "envelope_open": [440, 880], "pocket": [440, 880], "env_cflap": [440, 880],
    "ribbon_bow": [480, 960], "card_small": [320, 640], "invitation_card": [480, 960], "info_card": [480, 960],
    "arch_frame": [320, 640], "frame_landscape": [480, 960], "florals_tl": [480, 960], "florals_br": [480, 960],
    "divider": [300],
}
# foto anahtarı → (pencere, çıktı genişlikleri, bg_scene yer tutucu kırpım kutusu)  — theme.json photos ile aynı anahtarlar
PLACEHOLDERS = {
    "hero_portrait": ("card", [320, 640], (20, 30, 500, 530)),
    "story_1": ("arch", [300, 600], (0, 100, 400, 650)),
    "story_2": ("arch", [300, 600], (600, 980, 1024, 1536)),
    "story_3": ("arch", [300, 600], (520, 40, 960, 640)),
    "venue": ("landscape", [480, 960], (0, 850, 1024, 1536)),
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


def pencere(prep: Path, windows: dict, ad: str, esik: int = 0) -> np.ndarray:
    """parts_prep pencere maskesi (kapsama > esik; 0 = pencerenin dokunduğu her piksel, 254 = tam şeffaf
    pencere) → katman boyutunda bool pencere."""
    p = windows[ad][0]
    x, y, w, h = p["kutu"]
    W, H = p["katman_olcu"]
    m = np.zeros((H, W), bool)
    m[y:y + h, x:x + w] = np.asarray(Image.open(prep / p["maske"]))[..., 3] > esik
    return m


# ----------------------------------------------------------------------------- kapalı zarfın kapağı

def kapak_kes(ec: Image.Image):
    """envelope_closed → (kapak RGBA, bilgi). Kapak: üst kenardan ortadaki uca inen V; alt kenarı tırtıklı
    (açık renkli lif şeridi) ve altında ön yüze düşen gölge var. Her sütunda kapağın bittiği satır = açık
    şeritten gölgeye en güçlü parlaklık düşüşü. Önce iki doğru (sol/sağ kanat) uydurulur, sonra her sütun
    bu V'nin ±14 px'inde yeniden aranır (tırtık izlenir) ve 7 sütunluk medyanla yumuşatılır."""
    a = np.asarray(ec).astype(np.float64)
    al = a[..., 3]
    h, w = al.shape
    cols = np.flatnonzero(al.max(0) > 200)
    rows = np.flatnonzero(al.max(1) > 200)
    x0, x1, y0, y1 = int(cols.min()), int(cols.max()), int(rows.min()), int(rows.max())
    lum = a[..., :3] @ np.array([0.299, 0.587, 0.114])
    lum = (np.roll(lum, 1, 1) + lum + np.roll(lum, -1, 1)) / 3  # yatay hafif yumuşatma (doku gürültüsü)
    cs = np.vstack([np.zeros((1, w)), np.cumsum(lum, 0)])

    def dusus(ylo, yhi, x):
        """y ∈ [ylo, yhi): (3 satır üst ort.) − (3 satır alt ort.); en büyüğü ve konumu."""
        ys = np.arange(max(ylo, 3), min(yhi, h - 4))
        ust = (cs[ys, x] - cs[ys - 3, x]) / 3
        alt = (cs[ys + 4, x] - cs[ys + 1, x]) / 3
        d = ust - alt
        i = int(np.argmax(d))
        return int(ys[i]), float(d[i])

    xm = (x0 + x1) / 2
    ilk = {"L": [], "R": []}
    for x in range(x0 + 8, x1 - 8, 2):
        top = int(np.argmax(al[:, x] > 200))
        y, d = dusus(top + 8, int(y0 + 0.66 * (y1 - y0)), x)
        if d > 40:
            ilk["L" if x < xm else "R"].append((x, y))

    def fit(p):
        p = np.array(p, float)
        for _ in range(5):
            m, c = np.polyfit(p[:, 0], p[:, 1], 1)
            r = p[:, 1] - (m * p[:, 0] + c)
            keep = np.abs(r) < max(4.0, 2.5 * r.std())
            if keep.all():
                break
            p = p[keep]
        return m, c, len(p)

    mL, cL, nL = fit(ilk["L"])
    mR, cR, nR = fit(ilk["R"])
    xt = (cR - cL) / (mL - mR)
    yt = mL * xt + cL
    xs = np.arange(w)
    v = np.minimum(mL * xs + cL, mR * xs + cR)
    kenar = v.copy()
    for x in range(x0 + 2, x1 - 1):
        y, d = dusus(int(v[x]) - 14, int(v[x]) + 15, x)
        if d > 30:
            kenar[x] = y + 1  # y: açık şeridin son satırı (dahil); kenar = ilk gölge satırı
    yum = kenar.copy()
    for x in range(x0 + 3, x1 - 3):
        yum[x] = np.median(kenar[x - 3:x + 4])
    yum = np.clip(yum, v - 12, v + 12)
    satir = np.arange(h)[:, None]
    kap = np.clip(yum[None, :] - satir, 0, 1)  # satır < kenar−1 → 1, satır ≥ kenar → 0 (1 px yumuşak geçiş)
    out = np.asarray(ec).copy()
    out[..., 3] = np.round(al * kap).astype(np.uint8)
    alt = int(np.ceil(yum[x0:x1 + 1].max())) + 2
    menteşe = int(np.median([np.argmax(al[:, x] > 200) for x in range(x0 + 40, x1 - 40)]))
    bilgi = {"canvas": [w, h], "rows": [0, alt], "hinge_row": menteşe, "tip": [round(xt, 1), round(yt, 1)],
             "left": [round(mL, 4), round(cL, 2), nL], "right": [round(mR, 4), round(cR, 2), nR]}
    return Image.fromarray(out[:alt], "RGBA"), bilgi


# ----------------------------------------------------------------------------- denetim

def pencere_seffaf_mi(dosya: Path, tam: np.ndarray) -> int:
    """WebP çıktısında tam şeffaf pencere (parts_prep kapsaması 255; katman boyutunda bool) şeffaf kaldı mı?
    Görünür (alfa > %10) piksel sayısı. Küçültme/WebP kenarı 1–2 px yayar: pencere o kadar içeri alınır."""
    im = np.asarray(Image.open(dosya).convert("RGBA"))
    H, W = im.shape[:2]
    m = np.asarray(Image.fromarray((tam * 255).astype(np.uint8)).resize((W, H), Image.LANCZOS)) > 250
    r = 2
    m = ~genislet(~np.pad(m, r + 1), r)[r + 1:-r - 1, r + 1:-r - 1]
    return int((im[..., 3][m] > 24).sum())


def yesil_gorunur(dosya: Path) -> int:
    a = np.asarray(Image.open(dosya).convert("RGBA")).astype(np.int16)
    tint = a[..., 1] - np.maximum(a[..., 0], a[..., 2])
    return int(((tint > 40) & (a[..., 1] * 2 >= 3 * np.maximum(a[..., 0], a[..., 2])) & (a[..., 3] > 25)).sum())


# ----------------------------------------------------------------------------- ana

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--prep-dir", help="parts_prep çıktısı için klasör (vars. geçici)")
    ap.add_argument("--q", type=int, default=80)
    args = ap.parse_args()

    tmp = None
    if args.prep_dir:
        prep = Path(args.prep_dir).resolve()
    else:
        tmp = tempfile.TemporaryDirectory(prefix="bgr-prep-")
        prep = Path(tmp.name)
    if not (prep / "windows.json").exists():
        r = subprocess.run([sys.executable, "-B", str(ROOT / "tools/parts_prep.py"), str(COL.relative_to(ROOT)),
                            "--out", str(prep)], cwd=ROOT)
        if r.returncode != 0:
            sys.exit("parts_prep başarısız")
    win = json.loads((prep / "windows.json").read_text())["pencereler"]
    OUT.mkdir(exist_ok=True)
    for f in list(OUT.glob("*.webp")) + list(OUT.glob("mask_*.png")):
        f.unlink()
    manifest = {"_note": "build_images.py çıktısı (tema); ölçüler px, kutular [x, y, w, h] kaynak katman pikseli, "
                         "box_pct yüzde"}
    q = args.q

    # açık zarf: kapak (menteşede döner), gövde (astar), ön cep — G035 ile aynı kesim
    eo = Image.open(prep / "envelope_open.png").convert("RGBA")
    pocket, cep = g035.cep_kes(eo)
    bt = cep["body"][1]
    W, H = eo.size
    webp(eo.crop((0, 0, W, bt + 3)), "env_flap", WIDTHS["envelope_open"], q, manifest)
    webp(eo.crop((0, bt - 2, W, H)), "env_body", WIDTHS["envelope_open"], q, manifest)
    webp(pocket.crop((0, bt - 2, W, H)), "pocket", WIDTHS["pocket"], q, manifest)
    manifest["envelope_open"] = {"src_size": [W, H], "body": cep["body"], "flap_rows": [0, bt + 3],
                                 "body_rows": [bt - 2, H], "tip": cep["tip"]}
    manifest["pocket"]["cut"] = cep

    # kapalı zarf + ayrı kapak katmanı
    ec = Image.open(prep / "envelope_closed.png").convert("RGBA")
    al = np.asarray(ec)[..., 3]
    r_, c_ = np.flatnonzero(al.max(1) > 200), np.flatnonzero(al.max(0) > 200)
    webp(ec, "envelope_closed", WIDTHS["envelope_closed"], q, manifest)
    manifest["envelope_closed"]["body"] = [int(c_.min()), int(r_.min()), int(c_.max()), int(r_.max())]
    flap, kb = kapak_kes(ec)
    webp(flap, "env_cflap", WIDTHS["env_cflap"], q, manifest)
    kb["height_pct_of_closed"] = round(100 * kb["rows"][1] / ec.height, 3)
    kb["hinge_pct_of_flap"] = round(100 * kb["hinge_row"] / kb["rows"][1], 3)
    manifest["env_cflap"]["cut"] = kb
    print("kapak", kb)

    rb = Image.open(prep / "ribbon_bow.png").convert("RGBA")
    webp(rb, "ribbon_bow", WIDTHS["ribbon_bow"], q, manifest)

    # çerçeveli parçalar ve foto alanı maskeleri (pencere + 2 px, çerçevenin altına taşsın)
    slots = {}
    katmanlar = {"card": "card_small", "arch": "arch_frame", "landscape": "frame_landscape"}
    for ad, parca in katmanlar.items():
        im = Image.open(prep / f"{parca}.png").convert("RGBA")
        webp(im, parca, WIDTHS[parca], q, manifest)
        manifest[parca]["window"] = win[parca][0]["kutu"]
        manifest[parca]["leke_px"] = win[parca][0].get("leke_px", 0)
        mask, (x0, y0, x1, y1) = g035.pencere_maskesi(pencere(prep, win, parca))
        tam = pencere(prep, win, parca, 254)
        kaynak_gorunur = int((np.asarray(im)[..., 3][tam] > 0).sum())
        if kaynak_gorunur:
            sys.exit(f"{parca}: parts_prep çıktısında tam pencerede {kaynak_gorunur} görünür piksel (leke kaldı)")
        mask.thumbnail((480, 480), Image.LANCZOS)
        mask.save(OUT / f"mask_{ad}.png", optimize=True)
        Wl, Hl = im.size
        box = [round(100 * x0 / Wl, 3), round(100 * y0 / Hl, 3), round(100 * (x1 - x0) / Wl, 3),
               round(100 * (y1 - y0) / Hl, 3)]
        slots[ad] = {"box_pct": box, "aspect": round((x1 - x0) / (y1 - y0), 4), "box_px": [x1 - x0, y1 - y0],
                     "mask": f"mask_{ad}.png"}
        for f in manifest[parca]["files"]:
            gorunur = pencere_seffaf_mi(OUT / f["file"], tam)
            f["window_visible_px"] = gorunur
            if gorunur:
                sys.exit(f"{f['file']}: pencerede {gorunur} görünür piksel (leke kaldı)")
    manifest["photo_slots"] = slots

    for nm in ("invitation_card", "info_card", "florals_tl", "florals_br", "divider"):
        webp(Image.open(prep / f"{nm}.png"), nm, WIDTHS[nm], q, manifest)
    for nm, mx, ornek in (("invitation_card", .487, (.5, .55)), ("info_card", .492, (.5, .55)),
                          ("card_small", .5, (.8, .86))):
        manifest[nm]["free_zone"] = g035.serbest_bolge(Image.open(prep / f"{nm}.png"), mx, ornek=ornek)

    for i, p in enumerate(g035.petaller(Image.open(prep / "petals.png").convert("RGBA")), 1):
        p.thumbnail((200, 200), Image.LANCZOS)
        webp(p, f"petal{i}", [p.width], q, manifest)

    bg = Image.open(COL / "assets/gpt/parts/bg_scene.png").convert("RGB")
    webp(bg, "bg_scene", [640, 1024], 78, manifest)
    mist = bg.resize((640, 960), Image.LANCZOS).filter(g035.ImageFilter.GaussianBlur(5))
    webp(mist, "mist", [640], 82, manifest)
    calm = bg.crop((280, 470, 880, 1000)).resize((640, 565), Image.LANCZOS).filter(g035.ImageFilter.GaussianBlur(1.6))
    calm = Image.blend(calm, Image.new("RGB", calm.size, (242, 216, 215)), 0.30)
    tile = Image.new("RGB", (calm.width, calm.height * 2))
    tile.paste(calm, (0, 0))
    tile.paste(calm.transpose(Image.FLIP_TOP_BOTTOM), (0, calm.height))
    webp(tile, "mist_tile", [640], 80, manifest)

    # nötr foto yer tutucuları (gerçek fotoğraf asla tema görseline girmez)
    for key, (ad, gen, kutu) in PLACEHOLDERS.items():
        oran = slots[ad]["aspect"]
        webp(g035.yer_tutucu(bg, kutu, oran, max(gen)), f"ph_{key}", gen, 82, manifest)
        manifest[f"ph_{key}"]["aspect"] = oran

    yesil = {f.name: n for f in sorted(OUT.glob("*.webp")) if (n := yesil_gorunur(f))}
    if yesil:
        sys.exit(f"görünür #00FF00 kalıntısı: {yesil}")
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=1, ensure_ascii=False) + "\n")
    tot = sum(f.stat().st_size for f in OUT.glob("*.webp"))
    print(f"{len(list(OUT.glob('*.webp')))} webp, toplam {tot / 1024:.0f} KB → {OUT.relative_to(ROOT)}")
    for ad, s in slots.items():
        print(f"foto alanı {ad}: box_pct {s['box_pct']} oran {s['aspect']} ({s['box_px'][0]}/{s['box_px'][1]})")
    if tmp:
        tmp.cleanup()


if __name__ == "__main__":
    main()
