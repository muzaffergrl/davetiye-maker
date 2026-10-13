"""Kit doğrulayıcı — GPT'nin ürettiği ham görselleri Canva'ya girmeden önce denetler.

  python3 tools/kit_check.py <kit kökü> [--paket 1|2|3|4|5]

Beklenen dosyalar, ölçüler ve şeffaflık, kitin `assets/gpt/GPT_PROMPTS.md` dosyasındaki
`**Kaydet:** `yol` · ölçü · **Şeffaf zemin**` satırlarından okunur (20 tasarım, V01 ve V02–V06 aynı biçim).
Standart: docs/07_KIT_STANDARDI.md. Çıkış kodu: hepsi GEÇTİ ise 0, değilse 1.

Kontroller:
  - dosya var mı (sade ad; `_v2` gibi denemeler yalnız uyarı)
  - oran: hedef ölçünün oranına ±%2 (piksel değil oran; GPT çıktısı farklı çözünürlükte olabilir)
  - şeffaf istenenlerde: gerçek alfa kanalı, kenar şeridinin ≥%90'ı şeffaf (nesne kesilmemiş), içerik var
  - mockup'larda: #00FF00 (±40 ya da yeşil baskın) bölgesi görselin ≥%5'i ve sınır kutusunun ≥%90'ını dolduruyor (düz, tek parça)
  - prompt bloğunda `#00FF00` geçen diğer görsellerde (foto penceresi isteyen parça ve comp'lar; ör. PAKET 5 card_small,
    frame_*, W1 ekranları): aynı yeşil testine uyan (şeffaf parçada alfa ≥ 128) en büyük bağlı bölge görselin ≥%0,3'ü
    (en az 256 px) — pencere var mı; şekli/sayısı denetlenmez (parts_prep.py ölçer)
  - şeffaf istenmeyen dokularda: alfa varsa tamamen opak
  - zarf hizası (G054, docs/11 §7.1): listede website parçası (PAKET 4/5 `/parts/`) `envelope_closed` + `envelope_open`
    varsa ikisi "Kaydet" tuvaline getirilip tipe göre değişmeyen kenarları karşılaştırılır (tools/tema_build.hiza_olc):
    kapak/kese/kılıf sol-sağ-alt, kapı üst-alt + katlanma çizgileri, kitap üst-alt-sağ + sırt. Zarf tipi kapalı zarfın
    prompt başlığından ("Kapalı zarf (gatefold, iki kapı)" → kapi; parantez yok → kapak) ya da `--zarf-tipi`. Sarılı
    kapanış (`closure.png` "Kaydet" ölçüsü = kapalı zarfınki) uçları zarfın kenarına göre ölçülür. ≤ %1,5 GEÇTİ,
    ≤ %4 UYARI (geçti sayılır; tema build'i ölçülen dönüşümle düzeltir), > %4 KALDI (GPT'den yeniden üretim).
    Farklı Kaydet tuvalleri (03 PAKET 4 pilotu) → "olcekli": yalnız gövde oranı. `--hiza`: yalnız bu denetim.
Yazı/harf denetimi otomatik yapılmaz (OCR yok); görsel kontrol listesinde kalır.
"""
import argparse
import re
import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
from mockup_compose import en_buyuk_bolge, yesil_maske  # noqa: E402
import tema_build as tb  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
PENCERE_MIN_PAY = 0.003
KAYDET = re.compile(r"\*\*Kaydet:\*\*\s*`([^`]+)`(.*)")
OLCU = re.compile(r"(\d{3,5})\s*[×x]\s*(\d{3,5})")
PAKET = re.compile(r"^##\s+PAKET\s+(\d)", re.I)


def beklenenler(prompts: Path):
    """Kaydet satırları: yol, ölçü, şeffaf, mockup, paket ve `pencere` (satırdan sonraki başlığa kadar olan prompt
    bloğunda `#00FF00` geçiyor mu — foto penceresi isteniyor)."""
    out, paket, cur, baslik = [], None, None, None
    for line in prompts.read_text(encoding="utf-8").splitlines():
        m = PAKET.match(line)
        if m:
            paket = int(m.group(1))
        if line.startswith("#"):
            cur = None
            baslik = line.lstrip("#").strip()
            continue
        m = KAYDET.search(line)
        if not m:
            if cur is not None and "#00FF00" in line.upper():
                cur["pencere"] = True
            continue
        yol, kalan = m.group(1), m.group(2)
        o = OLCU.search(kalan)
        out.append({
            "yol": yol,
            "olcu": (int(o.group(1)), int(o.group(2))) if o else None,
            "seffaf": "Şeffaf" in kalan or "seffaf" in kalan.lower(),
            "mockup": "/mockups/" in yol,
            "paket": paket,
            "pencere": False,
            "baslik": baslik,
        })
        cur = out[-1]
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
    ek = ""
    if b.get("pencere") and not b["mockup"]:
        rgba = np.asarray(im.convert("RGBA"))
        yesil = yesil_maske(rgba[:, :, :3]) & (rgba[:, :, 3] >= 128)  # GPT yeşili ≈ (3,252,45) da sayılır
        bolge = en_buyuk_bolge(yesil) if yesil.any() else yesil
        pay = bolge.sum() / yesil.size
        if pay < PENCERE_MIN_PAY or bolge.sum() < 256:
            sorun.append(f"#00FF00 foto penceresi yok ya da çok küçük (en büyük yeşil bölge %{pay*100:.2f})")
        else:
            ek = f" · pencere %{pay*100:.1f}"
    if b["mockup"]:
        rgb = np.asarray(im.convert("RGB"))
        yesil = yesil_maske(rgb)  # #00FF00 ±40 ya da yeşil baskın (GPT yeşili ≈ (3,252,45))
        pay = yesil.mean()
        if pay < 0.05:
            sorun.append(f"#00FF00 alanı çok küçük/yok (%{pay*100:.1f})")
        else:
            ys, xs = np.nonzero(yesil)
            kutu = (ys.max() - ys.min() + 1) * (xs.max() - xs.min() + 1)
            dolu = yesil.sum() / kutu
            if dolu < 0.90:
                sorun.append(f"yeşil alan düz/tek parça değil (kutunun %{dolu*100:.0f}'i)")
    return (not sorun), ("; ".join(sorun) if sorun else f"{w}×{h}{' şeffaf' if b['seffaf'] else ''}{ek}")


HIZA_PAKETLERI = (4, 5, None)  # website parçaları: 03 pilotu PAKET 4, K22–K24 PAKET 5 (parts_prep ile aynı)
HIZA_DURUM = {"tamam": "GEÇTİ", "uyari": "UYARI", "hata": "KALDI"}
HIZA_IPUCU = {"uyari": " (±%1,5 aşıldı: tema build'i ölçülen ölçek + ötelemeyle düzeltir, manifest.stage.align)",
              "hata": " (> %4: GPT'den yeniden üretim iste — Sonuç'a önerilen düzeltme)"}


def _yol(b) -> Path:
    return ROOT / b["yol"] if not Path(b["yol"]).is_absolute() else Path(b["yol"])


def hiza_denetle(liste, zarf_tipi=None):
    """Zarf hizası (docs/11 §7.1). (durum, mesaj, notlar) — durum: GEÇTİ / UYARI / KALDI / ATLANDI; listede
    envelope_closed + envelope_open website parçası yoksa None."""
    parcalar = {}
    for b in liste:
        if "/parts/" in b["yol"] and b.get("paket") in HIZA_PAKETLERI:
            parcalar[Path(b["yol"]).stem] = b  # aynı ad iki pakette: sonraki geçerli
    kb, ab = parcalar.get("envelope_closed"), parcalar.get("envelope_open")
    if not kb or not ab:
        return None
    eksik = [Path(b["yol"]).name for b in (kb, ab) if not _yol(b).exists()]
    if eksik:
        return "ATLANDI", f"{' ve '.join(eksik)} yok — hiza ölçülmedi", []
    tip = zarf_tipi or tb.zarf_tipi_basliktan(kb.get("baslik"))
    kp = parcalar.get("closure")
    sarili = bool(kp and kp.get("olcu") and kp["olcu"] == kb.get("olcu"))
    notlar = []
    kapanis = None
    if sarili:
        if _yol(kp).exists():
            kapanis = Image.open(_yol(kp))
        else:
            notlar.append("sarılı kapanış (closure.png) yok — kapanış uçları ölçülmedi")
    try:
        s = tb.hiza_olc(Image.open(_yol(kb)), Image.open(_yol(ab)), tip, kb.get("olcu"), ab.get("olcu"),
                        kapanis=kapanis, kapanis_tuval=kp.get("olcu") if kapanis is not None else None)
    except Exception as e:  # noqa: BLE001
        return "KALDI", f"hiza ölçülemedi: {e}", []
    notlar = s["uyarilar"] + notlar
    for e in s["kenarlar"] + s.get("kapanis", {}).get("kenarlar", []):
        if e.get("not") and (e["fark_pct"] is None or e["durum"] != "tamam"):
            notlar.append(f"{e['kenar']}: {e['not']}")
    ad = "envelope_closed ↔ envelope_open" + (" (+ sarılı closure)" if sarili else "")
    return HIZA_DURUM[s["durum"]], f"{ad} — {tb.hiza_ozet(s)}{HIZA_IPUCU.get(s['durum'], '')}", notlar


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("kok", help="kit kökü, ör. collections/03_Blush_Garden_Rose")
    ap.add_argument("--paket", type=int, choices=[1, 2, 3, 4, 5])
    ap.add_argument("--hiza", action="store_true", help="yalnız kapalı/açık zarf hizası (dosya denetimleri atlanır)")
    ap.add_argument("--zarf-tipi", choices=["kapak", "kapi", "kitap", "kese", "kilif"],
                    help="hiza için zarf tipi (vars. kapalı zarfın prompt başlığından)")
    a = ap.parse_args()
    kok = (ROOT / a.kok) if not Path(a.kok).is_absolute() else Path(a.kok)
    prompts = kok / "assets/gpt/GPT_PROMPTS.md"
    if not prompts.exists():
        sys.exit(f"GPT_PROMPTS.md yok: {prompts}")
    liste = [b for b in beklenenler(prompts) if a.paket is None or b["paket"] in (a.paket, None)]
    if not liste:
        sys.exit("GPT_PROMPTS.md içinde **Kaydet:** satırı bulunamadı")
    gecen = toplam = 0
    if not a.hiza:
        for b in liste:
            ok, msg = denetle(b, kok)
            gecen += ok
            toplam += 1
            print(f"{'GEÇTİ' if ok else 'KALDI'}  {b['yol']}  — {msg}")
    hz = hiza_denetle(liste, a.zarf_tipi)
    if hz is None and a.hiza:
        hz = ("KALDI", "listede envelope_closed + envelope_open website parçası yok", [])
    if hz is not None:
        durum, msg, notlar = hz
        if durum != "ATLANDI" or a.hiza:
            durum = "KALDI" if durum == "ATLANDI" else durum
            toplam += 1
            gecen += durum in ("GEÇTİ", "UYARI")
        print(f"{durum}  hiza  {msg}")
        for n in notlar:
            print(f"       not: {n}")
    print(f"\n{gecen}/{toplam} geçti")
    sys.exit(0 if gecen == toplam else 1)


if __name__ == "__main__":
    main()
