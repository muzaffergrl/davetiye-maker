"""Sahne işlemleri (G067): GPT sahnesini 2000 px tuvale büyütüp yerleştirme, tuvalin sahnenin dışında kalan şeridini
sahnenin kendi kenarından uzatma, gerçek ekranları yeşil alanlara oturtma, çok hafif cam parlaklığı.

Hiçbir şey çizilmez (K21): zemin ve süsler GPT sahnesinden/parçalarından gelir; burada yalnız ölçek, kırpma, ayna +
bulanıklıkla kenar uzatma, homografi ve harmanlama var. Yeşil alan bulma ve yerleştirme tools/mockup_compose.py'den.
"""
from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import mockup_compose as mc  # noqa: E402

TUVAL = 2000


# ----------------------------------------------------------------------------- ölçek

def buyut(img: Image.Image, olcek: float) -> Image.Image:
    """Lanczos ile büyütme + hafif keskinleştirme (yumuşayan fotoğraf dokusu için; hale bırakmayacak kadar az)."""
    w, h = img.size
    out = img.convert("RGB").resize((round(w * olcek), round(h * olcek)), Image.LANCZOS)
    if olcek > 1.05:
        out = out.filter(ImageFilter.UnsharpMask(radius=1.4, percent=55, threshold=2))
    return out


def _bulanik(a: np.ndarray, sigma: float) -> np.ndarray:
    if sigma <= 0:
        return a
    im = Image.fromarray(np.clip(np.rint(a), 0, 255).astype(np.uint8), "RGB")
    return np.asarray(im.filter(ImageFilter.GaussianBlur(sigma))).astype(np.float64)


def _uzanti(serit: np.ndarray, n: int, sis: np.ndarray | None, sis_gucu: float, yayma_px: float = 140,
            doku: bool = False) -> np.ndarray:
    """Kenar şeridinin aynası. serit[0] = kenar satırı; dönen dizinin 0. satırı kenara bitişik.
    doku=True: yalnız ayna (keten gibi düz, dokulu yüzeyde dokunun sürmesi için; yandan uzatmada).
    Aksi halde (duvar/arka plan): kenardan uzaklaştıkça artan bulanıklık (odak dışı zemin gibi) ve `yayma_px` içinde
    kenar satırının düz uzantısına (yatayda çok bulanık) geçiş, böylece çapraz ışık çizgileri aynada "V" deseni
    yapmaz; sis: uzak uçta yaklaşılan düz renk (sahnenin kendi kenar ortalaması)."""
    tekrar = int(np.ceil(n / max(1, len(serit))))
    ayna = np.concatenate([serit if k % 2 == 0 else serit[::-1] for k in range(tekrar)])[:n]
    if doku:
        return ayna
    seviyeler = [0, 6, 16, 34, 60]
    katlar = [_bulanik(ayna, s) for s in seviyeler]
    t = (np.arange(n) + 0.5) / n  # 0 kenarda, 1 uzak uçta
    k = np.clip(t * (len(seviyeler) - 1) * 1.35, 0, len(seviyeler) - 1)
    i0 = np.floor(k).astype(int)
    i1 = np.minimum(i0 + 1, len(seviyeler) - 1)
    f = (k - i0)[:, None, None]
    yigin = np.stack(katlar)
    sat = np.arange(n)
    out = yigin[i0, sat] * (1 - f) + yigin[i1, sat] * f
    # kenar satırlarının yatay bulanık ortalaması, aşağı doğru tekrar: düz, sakin zemin
    kenar = serit[: max(2, min(10, len(serit)))].mean(0)
    kenar = _bulanik(np.repeat(kenar[None], 8, 0), 40)[4]
    w = np.clip((np.arange(n) + 0.5) / yayma_px, 0, 1)
    w = (w * w * (3 - 2 * w))[:, None, None]
    out = out * (1 - w) + kenar[None] * w
    yumusak = np.clip((np.arange(n) + 0.5) / 40, 0, 1)[:, None, None]  # dikiş satırı keskin kalır
    out = out * (1 - yumusak) + _bulanik(out, 3) * yumusak
    if sis is not None and sis_gucu > 0:
        a = (np.clip((t - 0.15) / 0.85, 0, 1) ** 1.6 * sis_gucu)[:, None, None]
        out = out * (1 - a) + sis[None, None, :] * a
    return out


def yerlestir(sahne: Image.Image, olcek: float, x0: float, y0: float, sis_gucu: float = 0.0,
              kenar_satir: int = 120) -> tuple[Image.Image, dict]:
    """Sahneyi `olcek` ile büyütüp tuvalde (x0, y0)'a koyar (sol üst köşe; negatif = kırpılır). Tuvalin sahne dışında
    kalan üst/alt/sol/sağ şeritleri sahnenin kendi kenarının aynasıyla doldurulur (artan bulanıklık; sis_gucu > 0
    ise uzak uçta sahnenin kenar ortalama rengine yaklaşır). Dönen bilgi: yerleşim ve uzatılan şerit genişlikleri."""
    b = np.asarray(buyut(sahne, olcek)).astype(np.float64)
    bh, bw = b.shape[:2]
    x0, y0 = int(round(x0)), int(round(y0))
    sol, ust = max(0, x0), max(0, y0)
    sag, alt = max(0, TUVAL - (x0 + bw)), max(0, TUVAL - (y0 + bh))
    # önce yatay uzatma (tam yükseklikte), sonra dikey
    if sol or sag:
        parca = [b]
        if sol:
            serit = b[:, :kenar_satir].transpose(1, 0, 2)
            parca.insert(0, _uzanti(serit, sol, None, 0, doku=True)[::-1].transpose(1, 0, 2))
        if sag:
            serit = b[:, -kenar_satir:][:, ::-1].transpose(1, 0, 2)
            parca.append(_uzanti(serit, sag, None, 0, doku=True).transpose(1, 0, 2))
        b = np.concatenate(parca, axis=1)
        x0 -= sol
    if ust or alt:
        parca = [b]
        if ust:
            serit = b[:kenar_satir]
            sis = b[: max(4, kenar_satir // 3)].reshape(-1, 3).mean(0)
            parca.insert(0, _uzanti(serit, ust, sis, sis_gucu)[::-1])
        if alt:
            serit = b[-kenar_satir:][::-1]
            sis = b[-max(4, kenar_satir // 3):].reshape(-1, 3).mean(0)
            parca.append(_uzanti(serit, alt, sis, sis_gucu))
        b = np.concatenate(parca, axis=0)
        y0 -= ust
    tuval = b[-y0: -y0 + TUVAL, -x0: -x0 + TUVAL]
    assert tuval.shape[:2] == (TUVAL, TUVAL), tuval.shape
    bilgi = {"olcek": round(olcek, 4), "x0": x0 + sol, "y0": y0 + ust, "uzatma": {"ust": ust, "alt": alt, "sol": sol, "sag": sag}}
    return Image.fromarray(np.clip(np.rint(tuval), 0, 255).astype(np.uint8), "RGB"), bilgi


# ----------------------------------------------------------------------------- yeşil ekranlar

def ekran_bolgeleri(img: Image.Image, tol: int = 40, min_oran: float = 0.01) -> list[dict]:
    """Soldan sağa yeşil ekranlar: köşeler (TL, TR, BR, BL), kenar uzunluklarından genişlik/yükseklik, en/boy oranı,
    sınır kutusu."""
    ham = mc.yesil_maske(np.asarray(img.convert("RGB")), tol)
    out = []
    for b in mc.yesil_bolgeler(ham, min_oran):
        q = mc.dort_kose(b)
        gen = (np.linalg.norm(q[1] - q[0]) + np.linalg.norm(q[2] - q[3])) / 2
        yuk = (np.linalg.norm(q[3] - q[0]) + np.linalg.norm(q[2] - q[1])) / 2
        ys, xs = np.nonzero(b)
        out.append({"kose": q, "gen": float(gen), "yuk": float(yuk), "oran": float(gen / yuk),
                    "kutu": [int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1]})
    return out


def ekran_yuksekligi(oran: float, css_gen: int = 390) -> int:
    """Yeşil ekranın biçimine uyan telefon görüntü alanı yüksekliği (CSS px; genişlik 390)."""
    return int(round(css_gen / oran))


def ekranlari_oturt(img: Image.Image, ekranlar: list[Image.Image], feather: float = 2.0, parlaklik: float = 0.05,
                    tol: int = 40) -> tuple[Image.Image, list[dict]]:
    """Ekran görüntülerini (soldan sağa sırayla) yeşil alanlara yerleştirir. Ekran görüntüsü önce Lanczos ile hedef
    dörtgen boyuna indirilir (homografi örneklemesi ~1:1 olsun, metin keskin kalsın); maske yeşil bölgenin kendisi
    (yuvarlak köşeler dahil), kenar `feather` px dışa yumuşatılır; sonra çok hafif çapraz cam parlaklığı."""
    bolgeler = ekran_bolgeleri(img, tol)
    if len(bolgeler) != len(ekranlar):
        raise ValueError(f"sahnede {len(bolgeler)} yeşil ekran var, {len(ekranlar)} ekran görüntüsü verildi")
    hazir = []
    for bol, ek in zip(bolgeler, ekranlar):
        hedef_h = int(round(bol["yuk"] * 1.15))
        ek = ek.convert("RGB")
        hazir.append(ek.resize((int(round(hedef_h * ek.width / ek.height)), hedef_h), Image.LANCZOS))
    out, bilgiler = mc.birlestir_cok(img, hazir, mod="cover", tol=tol, feather=feather)
    if parlaklik > 0:
        a = np.asarray(out).astype(np.float64)
        once = np.asarray(img.convert("RGB")).astype(np.float64)
        for bol in bolgeler:
            q = bol["kose"]
            x0, y0, x1, y1 = bol["kutu"]
            x0, y0, x1, y1 = max(0, x0 - 4), max(0, y0 - 4), min(a.shape[1], x1 + 4), min(a.shape[0], y1 + 4)
            yy, xx = np.mgrid[y0:y1, x0:x1].astype(np.float64) + 0.5
            # ekranın yeşil payı (anti-alias kenarı dahil) = parlaklığın maskesi; çerçeveye taşmaz
            yesillik = once[y0:y1, x0:x1, 1] - np.maximum(once[y0:y1, x0:x1, 0], once[y0:y1, x0:x1, 2])
            m = np.clip(yesillik / 200.0, 0, 1)
            d = q[2] - q[0]
            t = ((xx - q[0][0]) * d[0] + (yy - q[0][1]) * d[1]) / (d @ d)
            # sol üstten çapraz, yumuşak bir yansıma; ekranın ortasına varmadan söner
            s = parlaklik * np.clip(1 - t / 0.55, 0, 1) ** 1.8
            p = a[y0:y1, x0:x1]
            a[y0:y1, x0:x1] = p + (255 - p) * (s * m)[..., None]
        out = Image.fromarray(np.clip(np.rint(a), 0, 255).astype(np.uint8), "RGB")
    for bol, bil in zip(bolgeler, bilgiler):
        bil["gen"], bil["yuk"], bil["kutu"] = round(bol["gen"], 1), round(bol["yuk"], 1), bol["kutu"]
    return out, bilgiler


def yesil_kalinti(img: Image.Image) -> int:
    """Görselde kalan yeşil baskın piksel sayısı (G − max(R, B) ≥ 60 ve G ≥ 120): yerleştirme sonrası saçak kontrolü."""
    a = np.asarray(img.convert("RGB")).astype(np.int16)
    g = a[..., 1] - np.maximum(a[..., 0], a[..., 2])
    return int(((g >= 60) & (a[..., 1] >= 120)).sum())
