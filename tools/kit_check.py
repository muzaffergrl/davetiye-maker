"""Kit doğrulayıcı — GPT'nin ürettiği ham görselleri Canva'ya girmeden önce denetler.

  python3 tools/kit_check.py <kit kökü> [--paket 1|2|3|4]

Beklenen dosyalar, ölçüler ve şeffaflık, kitin `assets/gpt/GPT_PROMPTS.md` dosyasındaki
`**Kaydet:** `yol` · ölçü · **Şeffaf zemin**` satırlarından okunur (20 tasarım, V01 ve V02–V06 aynı biçim).
Standart: docs/07_KIT_STANDARDI.md. Çıkış kodu: hepsi GEÇTİ ise 0, değilse 1.

Kontroller:
  - dosya var mı (sade ad; `_v2` gibi denemeler yalnız uyarı)
  - oran: hedef ölçünün oranına ±%2 (piksel değil oran; GPT çıktısı farklı çözünürlükte olabilir)
  - şeffaf istenenlerde: gerçek alfa kanalı, kenar şeridinin ≥%90'ı şeffaf (nesne kesilmemiş), içerik var
  - mockup'larda: #00FF00 (±40) bölgesi görselin ≥%5'i ve sınır kutusunun ≥%90'ını dolduruyor (düz, tek parça)
  - şeffaf istenmeyen dokularda: alfa varsa tamamen opak
Yazı/harf denetimi otomatik yapılmaz (OCR yok); görsel kontrol listesinde kalır.
"""
import argparse
import re
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
KAYDET = re.compile(r"\*\*Kaydet:\*\*\s*`([^`]+)`(.*)")
OLCU = re.compile(r"(\d{3,5})\s*[×x]\s*(\d{3,5})")
PAKET = re.compile(r"^##\s+PAKET\s+(\d)", re.I)


def beklenenler(prompts: Path):
    out, paket = [], None
    for line in prompts.read_text(encoding="utf-8").splitlines():
        m = PAKET.match(line)
        if m:
            paket = int(m.group(1))
            continue
        m = KAYDET.search(line)
        if not m:
            continue
        yol, kalan = m.group(1), m.group(2)
        o = OLCU.search(kalan)
        out.append({
            "yol": yol,
            "olcu": (int(o.group(1)), int(o.group(2))) if o else None,
            "seffaf": "Şeffaf" in kalan or "seffaf" in kalan.lower(),
            "mockup": "/mockups/" in yol,
            "paket": paket,
        })
    return out


def kenar_seffaf_orani(alfa: np.ndarray, kalinlik: int) -> float:
    h, w = alfa.shape
    k = max(1, kalinlik)
    serit = np.concatenate([alfa[:k].ravel(), alfa[h - k:].ravel(), alfa[:, :k].ravel(), alfa[:, w - k:].ravel()])
    return float((serit < 16).mean())


def denetle(b, kok: Path):
    yol = ROOT / b["yol"] if not Path(b["yol"]).is_absolute() else Path(b["yol"])
    if not yol.exists():
        denemeler = sorted(yol.parent.glob(yol.stem + "_v*" + yol.suffix)) if yol.parent.exists() else []
        ek = f" (denemeler var: {', '.join(d.name for d in denemeler)} — seçileni sade adla kaydet)" if denemeler else ""
        return False, "dosya yok" + ek
    try:
        im = Image.open(yol)
        im.load()
    except Exception as e:  # noqa: BLE001
        return False, f"açılamadı: {e}"
    sorun = []
    w, h = im.size
    if b["olcu"]:
        hw, hh = b["olcu"]
        if abs((w / h) / (hw / hh) - 1) > 0.02:
            sorun.append(f"oran {w}×{h}, beklenen {hw}×{hh} oranı")
    alfa_var = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)
    if b["seffaf"]:
        if not alfa_var:
            sorun.append(f"şeffaf değil (mod {im.mode})")
        else:
            a = np.asarray(im.convert("RGBA"))[:, :, 3]
            oran = kenar_seffaf_orani(a, int(min(w, h) * 0.01))
            if oran < 0.90:
                sorun.append(f"kenarların yalnız %{oran*100:.0f}'i şeffaf (nesne kesilmiş veya zemin dolu)")
            if (a > 200).mean() < 0.01:
                sorun.append("içerik yok gibi (opak piksel <%1)")
    elif alfa_var and not b["mockup"]:
        a = np.asarray(im.convert("RGBA"))[:, :, 3]
        if (a < 250).mean() > 0.001:
            sorun.append("opak olması gerekirken şeffaf pikseller var")
    if b["mockup"]:
        rgb = np.asarray(im.convert("RGB")).astype(int)
        yesil = (np.abs(rgb[:, :, 0] - 0) <= 40) & (np.abs(rgb[:, :, 1] - 255) <= 40) & (np.abs(rgb[:, :, 2] - 0) <= 40)
        pay = yesil.mean()
        if pay < 0.05:
            sorun.append(f"#00FF00 alanı çok küçük/yok (%{pay*100:.1f})")
        else:
            ys, xs = np.nonzero(yesil)
            kutu = (ys.max() - ys.min() + 1) * (xs.max() - xs.min() + 1)
            dolu = yesil.sum() / kutu
            if dolu < 0.90:
                sorun.append(f"yeşil alan düz/tek parça değil (kutunun %{dolu*100:.0f}'i)")
    return (not sorun), ("; ".join(sorun) if sorun else f"{w}×{h}{' şeffaf' if b['seffaf'] else ''}")


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("kok", help="kit kökü, ör. collections/03_Blush_Garden_Rose")
    ap.add_argument("--paket", type=int, choices=[1, 2, 3, 4])
    a = ap.parse_args()
    kok = (ROOT / a.kok) if not Path(a.kok).is_absolute() else Path(a.kok)
    prompts = kok / "assets/gpt/GPT_PROMPTS.md"
    if not prompts.exists():
        sys.exit(f"GPT_PROMPTS.md yok: {prompts}")
    liste = [b for b in beklenenler(prompts) if a.paket is None or b["paket"] in (a.paket, None)]
    if not liste:
        sys.exit("GPT_PROMPTS.md içinde **Kaydet:** satırı bulunamadı")
    gecen = 0
    for b in liste:
        ok, msg = denetle(b, kok)
        gecen += ok
        print(f"{'GEÇTİ' if ok else 'KALDI'}  {b['yol']}  — {msg}")
    print(f"\n{gecen}/{len(liste)} geçti")
    sys.exit(0 if gecen == len(liste) else 1)


if __name__ == "__main__":
    main()
