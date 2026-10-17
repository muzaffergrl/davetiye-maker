#!/usr/bin/env python3
"""GPT'den beklenen görseller: bütün GPT_PROMPTS.md dosyalarındaki kayıt yollarını tarar, diskte olmayanları listeler.

Kullanım:
  python3 tools/gpt_bekleyen.py            # özet (koleksiyon → bölüm → eksik sayısı)
  python3 tools/gpt_bekleyen.py --yaz      # docs/26_GPT_BEKLEYEN.md dosyasını yeniden yazar (tam liste)

Yol: prompt dosyasındaki ters tırnaklı, içinde `/` olan `….png|jpg|jpeg|webp` yolu (düz metindeki tek dosya adları ve `<x>`
gibi kalıplar sayılmaz). `collections/` ya da `brand/` ile başlıyorsa repo kökünden, değilse prompt dosyasının klasöründen
çözülür. Bölüm = yolun üstündeki en yakın `##` başlığı.
"""
import re
import sys
from collections import OrderedDict
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
YOL = re.compile(r"`([^`\s]+\.(?:png|jpg|jpeg|webp))`")
CIKTI = KOK / "docs/26_GPT_BEKLEYEN.md"


def prompt_dosyalari():
    desenler = ["collections/*/assets/gpt/GPT_PROMPTS.md", "collections/*/variants/GPT_PROMPTS.md", "brand/GPT_PROMPTS.md"]
    for d in desenler:
        yield from sorted(KOK.glob(d))


def tara(dosya: Path):
    """(bölüm, yol, var mı) üçlüleri; aynı yol bir dosyada bir kez sayılır."""
    bolum, gorulen = "(başlıksız)", set()
    for satir in dosya.read_text(encoding="utf-8").splitlines():
        if satir.startswith("## "):
            bolum = satir[3:].strip()
            continue
        for y in YOL.findall(satir):
            if "/" not in y or any(c in y for c in "<>{}*"):
                continue
            tam = KOK / y if y.startswith(("collections/", "brand/")) else dosya.parent / y
            anahtar = tam.resolve()
            if anahtar in gorulen:
                continue
            gorulen.add(anahtar)
            yield bolum, tam.relative_to(KOK) if tam.resolve().is_relative_to(KOK) else tam, tam.exists()


def topla():
    sonuc = OrderedDict()
    for dosya in prompt_dosyalari():
        bolumler = OrderedDict()
        for bolum, yol, var in tara(dosya):
            b = bolumler.setdefault(bolum, {"var": 0, "eksik": []})
            if var:
                b["var"] += 1
            else:
                b["eksik"].append(str(yol))
        if bolumler:
            sonuc[str(dosya.relative_to(KOK))] = bolumler
    return sonuc


def main():
    sonuc = topla()
    toplam_eksik = sum(len(b["eksik"]) for bol in sonuc.values() for b in bol.values())
    if "--yaz" not in sys.argv:
        for dosya, bolumler in sonuc.items():
            eksik = sum(len(b["eksik"]) for b in bolumler.values())
            if eksik:
                print(f"{eksik:4d}  {dosya}")
        print(f"toplam eksik: {toplam_eksik}")
        return
    satirlar = [
        "# GPT'den beklenen görseller",
        "",
        "`python3 tools/gpt_bekleyen.py --yaz` ile üretilir (elle düzenlenmez). Her satır bir prompt dosyası bölümü: kaç görsel",
        "diskte var, hangileri eksik. Prompt metni ve kayıt yolu ilgili `GPT_PROMPTS.md` dosyasındadır; görsel o yola kaydedilince",
        "bu liste kendiliğinden kısalır. Sonrasında ilgili temanın `build_images.py` / `build-print-assets.ts` komutu çalıştırılır",
        "(prompt dosyasında yazar).",
        "",
        f"**Toplam eksik: {toplam_eksik}**",
        "",
        "| Prompt dosyası | Bölüm | Var | Eksik |",
        "|---|---|---|---|",
    ]
    for dosya, bolumler in sonuc.items():
        for bolum, b in bolumler.items():
            if b["eksik"]:
                satirlar.append(f"| `{dosya}` | {bolum.replace('|', '/')} | {b['var']} | {len(b['eksik'])} |")
    satirlar += ["", "## Eksik dosyalar", ""]
    for dosya, bolumler in sonuc.items():
        eksikler = [(bolum, y) for bolum, b in bolumler.items() for y in b["eksik"]]
        if not eksikler:
            continue
        satirlar.append(f"### `{dosya}`")
        satirlar.append("")
        for bolum, y in eksikler:
            satirlar.append(f"- `{y}` — {bolum}")
        satirlar.append("")
    CIKTI.write_text("\n".join(satirlar).rstrip() + "\n", encoding="utf-8")
    print(f"{CIKTI.relative_to(KOK)} yazıldı · toplam eksik: {toplam_eksik}")


if __name__ == "__main__":
    main()
