#!/usr/bin/env python3
"""GPT'den beklenen görseller: bütün GPT_PROMPTS.md dosyalarındaki kayıt yollarını tarar, diskte olmayanları listeler.

Kullanım:
  python3 tools/gpt_bekleyen.py            # özet (koleksiyon → bölüm → eksik sayısı)
  python3 tools/gpt_bekleyen.py --yaz      # docs/26_GPT_BEKLEYEN.md dosyasını yeniden yazar (tam liste)

Yol: prompt dosyasındaki ters tırnaklı, içinde `/` olan `….png|jpg|jpeg|webp` yolu (düz metindeki tek dosya adları ve `<x>`
gibi kalıplar sayılmaz). `collections/` ya da `brand/` ile başlıyorsa repo kökünden, değilse prompt dosyasının klasöründen
çözülür. Bir Kaydet satırındaki yalın adlar (`tile_1.png`, `tile_2.png` … ya da `a.png` ve `b.png`) satırın ilk yolunun
klasöründen çözülür. `platform/`, `public/`, `img/`, `scripts/`, `tools/`, `docs/` ile başlayan yollar build çıktısı ya da
kaynak örneğidir, GPT hedefi sayılmaz.
Bölüm = yolun üstündeki en yakın `##` başlığı.

`--yaz` aynı turda docs/27_GPT_IS_LISTESI.md + .html'yi de yazar (tools/gpt_is_listesi.py, G179).
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


HEDEF_DEGIL = ("platform/", "public/", "img/", "scripts/", "tools/", "docs/")
YALIN = re.compile(r"`([^`\s/<>{}*]+\.(?:png|jpg|jpeg|webp))`")


def satir_yollari(dosya: Path, satir: str) -> list[Path]:
    """Bir satırın istediği görsel yolları (mutlak, sıralı). Kaydet satırında yalın adlar ilk yolun klasöründen."""
    out = []
    for y in YOL.findall(satir):
        if "/" not in y or any(c in y for c in "<>{}*") or y.startswith(HEDEF_DEGIL):
            continue
        out.append(KOK / y if y.startswith(("collections/", "brand/")) else dosya.parent / y)
    if out and "aydet" in satir:
        bas = satir.find(YOL.search(satir).group(0))
        kalan = satir[bas:].split("·", 1)[0]
        out += [out[0].parent / ad for ad in YALIN.findall(kalan)]
    return out


def tara(dosya: Path):
    """(bölüm, yol, var mı) üçlüleri; aynı yol bir dosyada bir kez sayılır."""
    bolum, gorulen = "(başlıksız)", set()
    for satir in dosya.read_text(encoding="utf-8").splitlines():
        if satir.startswith("## "):
            bolum = satir[3:].strip()
            continue
        for tam in satir_yollari(dosya, satir):
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
        "## ChatGPT'de elle üretim (G179)",
        "",
        "Eksik görsellerin sıralı, kendi başına yapıştırılabilir prompt listesi: `docs/27_GPT_IS_LISTESI.html` (tarayıcıda;",
        "kopyalama düğmeleri, bitti işareti, süzgeç) ve `docs/27_GPT_IS_LISTESI.md`. İkisi bu komutla birlikte yeniden yazılır.",
        "Her görsel listedeki **indirme adıyla** kaydedilirse `python3 tools/gpt_yerlestir.py --klasor <klasör>` hepsini",
        "adından hedefe eşler (harita gerekmez; bilinmeyen adlar listelenir, tahmin edilmez).",
        "",
        "## GPT görselleri gelince (G176)",
        "",
        "Gelen dosyalar tek komutla yerleşir ve etkilenen tasarımlar yeniden kurulur:",
        "",
        "1. İndirme adıyla geldiyse `--klasor <klasör>`; rastgele adlarla geldiyse Claude görsellere bakar,",
        "   `{\"<gelen dosya>\": \"<aşağıdaki listeden hedef yol>\"}` haritasını yazar (JSON) ve `--eslestir harita.json` verir.",
        "2. `python3 tools/gpt_yerlestir.py --klasor <klasör>` (ya da `--eslestir harita.json`) — KURU: her hedefin bir prompt'ta istendiğini, oran /",
        "   şeffaflık / `#00FF00` pencere şartlarını ve var olan farklı dosyanın ezilmediğini denetler; tek red = hiçbir dosya yazılmaz.",
        "3. Aynı komut `--uygula` ile: kopyalar, sonra her etkilenen tasarımda sırayla `build_images.py` → `build-print-assets.ts`",
        "   → palet (`recolor_parts.py build/check`) → img/ referans + manifest denetimi → (`--theme-check`, `--ilan`: üretim",
        "   build'i ister) → `etsy_upload.py`; en sonda bu dosyayı yeniden yazar. Tasarım × adım tablosu ve live engelleri basılır.",
        "   Yerleştirmeden yalnız adımlar: `--koleksiyon NN|all`. Hiçbir tasarımı live yapmaz, yayınlamaz, Etsy'ye göndermez.",
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
    import gpt_is_listesi  # G179: iş listesi aynı turda (tembel içe aktarma: o da bu modülü kullanır)
    gpt_is_listesi.main(["--yaz"])


if __name__ == "__main__":
    main()
