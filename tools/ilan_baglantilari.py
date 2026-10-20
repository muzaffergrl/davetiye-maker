#!/usr/bin/env python3
"""Etsy ilan linklerini platforma bağlar (lansmanın son adımı, K41 sonrası).

  python3 tools/ilan_baglantilari.py linkler.txt            # KURU: ne yazılacağını gösterir
  python3 tools/ilan_baglantilari.py linkler.txt --yaz      # config.ts + listings.json'a yazar

`linkler.txt`: her satırda `<anahtar> <Etsy ilan linki>` (boşluk, sekme ya da `=`); `#` ile başlayan satır yorum.
Anahtar: tema id'si (`olive-ivory`), tasarım no'su (`01`) ya da hizmet (`setup-service`, `custom-design`,
`extra-revision`). Link Etsy'nin verdiği gibi (Share & Save dahil) yapıştırılır; `utm_` parametreleri atılır
(docs/14 §7.2: satış sitesi utm'li linki kabul etmez).

Yazdıkları:
- `platform/lib/marketing/config.ts`: tasarımın / hizmetin `etsyListingUrl` alanı (yalnız o satır).
- `platform/lib/etsy/listings.json`: `listings[<listing_id>] = <tema>` ve `services[<listing_id>] = setup | custom_design |
  extra_revision` (G147/G152 sipariş doğrulaması bu eşlemeyle tasarımı ve site sayısını bilir).
Hiçbir şeyi yayınlamaz; `launched` bayrağına dokunmaz.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

KOK = Path(__file__).resolve().parent.parent
CONFIG = KOK / "platform/lib/marketing/config.ts"
LISTINGS = KOK / "platform/lib/etsy/listings.json"
HIZMETLER = {"setup-service": "setup", "custom-design": "custom_design", "extra-revision": "extra_revision"}
CONFIG_HIZMET = {"setup-service", "custom-design"}  # extra-revision satış sitesinde yok, yalnız eşlemede
ILAN = re.compile(r"/listing/(\d+)(?:/|$)")


def tasarimlar() -> dict[str, str]:
    """Tasarım no ('01') → tema id; ilan paketlerinden (etsy_upload.json)."""
    out = {}
    for f in sorted(KOK.glob("collections/[0-9][0-9]_*/package/listing/etsy_upload.json")):
        d = json.loads(f.read_text(encoding="utf-8"))
        out[d["design"]] = d["theme"]
    return out


def temizle(url: str) -> tuple[str, str]:
    """Etsy ilan linki → (utm'siz link, listing_id). Etsy dışı ya da ilan olmayan link ValueError."""
    p = urlsplit(url.strip())
    if p.scheme != "https" or not (p.hostname == "etsy.com" or (p.hostname or "").endswith(".etsy.com")):
        raise ValueError(f"Etsy linki değil: {url}")
    m = ILAN.search(p.path)
    if not m:
        raise ValueError(f"ilan linki değil (/listing/<no> yok): {url}")
    sorgu = [(k, v) for k, v in parse_qsl(p.query, keep_blank_values=True) if not k.lower().startswith("utm_")]
    return urlunsplit((p.scheme, p.netloc, p.path, urlencode(sorgu), "")), m.group(1)


def oku(dosya: Path, no_tema: dict[str, str]) -> list[tuple[str, str, str]]:
    """[(anahtar: tema id ya da hizmet, link, listing_id)]; hatalarda hepsini birden bildirir."""
    temalar = set(no_tema.values())
    out, hatalar, gorulen = [], [], {}
    for i, satir in enumerate(dosya.read_text(encoding="utf-8").splitlines(), 1):
        satir = satir.strip()
        if not satir or satir.startswith("#"):
            continue
        parca = re.split(r"\s*=\s*|\s+", satir, maxsplit=1)
        if len(parca) != 2:
            hatalar.append(f"{i}. satır: '<anahtar> <link>' bekleniyordu")
            continue
        anahtar, url = parca
        anahtar = no_tema.get(anahtar.zfill(2), anahtar) if anahtar.isdigit() else anahtar
        if anahtar not in temalar and anahtar not in HIZMETLER:
            hatalar.append(f"{i}. satır: bilinmeyen tasarım/hizmet '{parca[0]}'")
            continue
        try:
            link, lid = temizle(url)
        except ValueError as e:
            hatalar.append(f"{i}. satır: {e}")
            continue
        for eski, ad in ((gorulen.get(anahtar), "anahtar"), (gorulen.get(lid), "ilan no")):
            if eski:
                hatalar.append(f"{i}. satır: aynı {ad} {eski}. satırda da var")
        gorulen[anahtar] = gorulen[lid] = i
        out.append((anahtar, link, lid))
    if hatalar:
        raise ValueError("\n".join(hatalar))
    return out


def config_yaz(metin: str, anahtar: str, link: str) -> str:
    """`id: '<anahtar>'` bloğundaki ilk etsyListingUrl değerini değiştirir (blok = sonraki `id:`'ye kadar)."""
    bas = re.search(rf"\bid: '{re.escape(anahtar)}',", metin)  # virgüllü: tip tanımındaki `id: 'a' | 'b'` değil
    if not bas:
        raise ValueError(f"config.ts'te '{anahtar}' yok")
    son = re.compile(r"\bid: '").search(metin, bas.end())
    blok_son = son.start() if son else len(metin)
    alan = re.compile(r"etsyListingUrl: '[^']*'").search(metin, bas.end(), blok_son)
    if not alan:
        raise ValueError(f"config.ts '{anahtar}' bloğunda etsyListingUrl yok")
    return metin[:alan.start()] + f"etsyListingUrl: '{link}'" + metin[alan.end():]


def uygula(kayitlar, config: str, listings: dict) -> tuple[str, dict]:
    listings = {**listings, "listings": dict(listings.get("listings", {})), "services": dict(listings.get("services", {}))}
    for anahtar, link, lid in kayitlar:
        if anahtar in HIZMETLER:
            listings["services"][lid] = HIZMETLER[anahtar]
            listings["listings"].pop(lid, None)
            if anahtar in CONFIG_HIZMET:
                config = config_yaz(config, anahtar, link)
        else:
            listings["listings"][lid] = anahtar
            listings["services"].pop(lid, None)
            config = config_yaz(config, anahtar, link)
    return config, listings


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("dosya", type=Path, help="satır başına '<tasarım|hizmet> <Etsy ilan linki>'")
    ap.add_argument("--yaz", action="store_true", help="config.ts ve listings.json'a yaz (yoksa kuru)")
    a = ap.parse_args(argv)
    try:
        kayitlar = oku(a.dosya, tasarimlar())
        config, listings = uygula(kayitlar, CONFIG.read_text(encoding="utf-8"), json.loads(LISTINGS.read_text(encoding="utf-8")))
    except ValueError as e:
        print(f"HATA:\n{e}", file=sys.stderr)
        return 1
    for anahtar, link, lid in kayitlar:
        print(f"{anahtar:32} {lid:>12}  {link}")
    canli = set(re.findall(r"id: '([a-z-]+)',\n\s+name: '[^']*',\n\s+status: 'live'", config))
    bagli = {k for k, _, _ in kayitlar}
    eksik = sorted(canli - bagli - set(re.findall(r"id: '([a-z-]+)',(?:\n[^\n]*){4}\n\s+etsyListingUrl: 'https", config)))
    print(f"\n{len(kayitlar)} link · satışta olup linki olmayan: {', '.join(eksik) if eksik else 'yok'}")
    if not a.yaz:
        print("KURU: hiçbir şey yazılmadı (--yaz ile yazılır)")
        return 0
    CONFIG.write_text(config, encoding="utf-8")
    LISTINGS.write_text(json.dumps(listings, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"yazıldı: {CONFIG.relative_to(KOK)}, {LISTINGS.relative_to(KOK)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
