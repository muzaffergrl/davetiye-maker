#!/usr/bin/env python3
"""GPT görselleri gelince tek komut (G176): gelen dosyaları GPT_PROMPTS.md'nin istediği yollara güvenle yerleştirir, sonra
etkilenen her tasarımın build/denetim adımlarını sırayla koşar ve tasarım × adım tablosu basar.

  python3 tools/gpt_yerlestir.py --eslestir harita.json                       # kuru: denetle, ne yapılacağını yaz
  python3 tools/gpt_yerlestir.py --eslestir harita.json --uygula              # kopyala + etkilenen tasarımların adımları
  python3 tools/gpt_yerlestir.py --klasor indirilenler/ [--uygula]           # indirme adıyla kaydedilmiş dosyalar (G179)
  python3 tools/gpt_yerlestir.py --koleksiyon 23 [--uygula]                   # yerleştirmeden yalnız adımlar (23 | 23_Velvet_Jewel_Box
                                                                              #  | velvet-jewel-box | 23,24 | all)
  … [--uzerine-yaz] [--theme-check] [--ilan]

Varsayılan KURU çalışmadır: hiçbir dosya yazılmaz, hiçbir build koşulmaz; tablo "çalışır / atlanır" der. `--uygula` yazar.

Harita (`--eslestir`): {"<gelen dosya>": "<hedef yol>"} — Claude görsellere bakıp yazar. Gelen yol mutlak ya da haritanın
klasörüne göreli; hedef repo köküne göreli ve bir GPT_PROMPTS.md'nin GERÇEKTEN istediği yol olmalı (tools/gpt_bekleyen.py
ayrıştırıcısı). Her gelen dosya prompt bloğunun makinece okunur şartlarıyla denetlenir (tools/kit_check.py denetle: oran ±%2,
şeffaf istenende gerçek alfa + şeffaf kenar şeridi, opakta şeffaf piksel yok, #00FF00 foto penceresi / mockup yeşil ekranı;
Kaydet satırları tools/gpt_kuru_deneme.py beklenenler ile). İstenenden küçük çözünürlük yalnız UYARI (GPT tuvali sınırlı).
Var olan FARKLI bir dosyanın üstüne `--uzerine-yaz` olmadan yazılmaz (aynı bayt = zaten yerinde). Tek bir girdi bile
reddedilirse HİÇBİR dosya kopyalanmaz. Uzantı farklıysa (ör. .webp → .png) PIL ile dönüştürülür; .jpg hedefe alfalı görsel
reddedilir.

Klasör (`--klasor`, G179): klasördeki her dosyanın adı (büyük/küçük harf ve .png/.jpg/.jpeg/.webp uzantısı önemsiz)
docs/27_GPT_IS_LISTESI'ndeki bir **indirme adıysa** (tools/gpt_is_listesi.indirme_adi — tek kaynak) hedefine eşlenir ve
yukarıdaki denetim/kopya/adım zinciri aynen uygulanır. Adı tanınmayan dosya listelenir, tahmin edilmez, dokunulmaz.
`--eslestir` ile birlikte verilebilir (ChatGPT adıyla kalmış dosyalar haritadan).

Adımlar (tasarım başına bu sırada; bir adım HATA verirse o tasarımın kalanı DURDU, diğer tasarımlar sürer):
  1 build_images   platform/themes/<id>/build_images.py               website parçaları (PAKET 5 / eski paketler) tamsa
  2 baski          node scripts/build-print-assets.ts --theme <id>    + baskı parçaları (PAKET 6 / G139) tamsa
  3 palet          recolor_parts.py build + check --design NN         collections/<NN>/variants/recolor.json varsa
  4 cikti          gerçek ağaçta: HTML/CSS/JS/theme.json'daki her img/<dosya> var; parçalar tamken manifest'te
                   "interim"/"geçici" izi yok (gpt_kuru_deneme denetimlerinin gerçek ağaç hâli)
  5 theme_check    --theme-check ile: node scripts/theme-assets.cjs + theme-check.cjs --theme <id> --stress
                   (üretim build'i ister: önce `cd platform && npm run build`; .next yoksa HATA)  + PAKET 2 fotoğrafları
  6 ilan           --ilan ile: listing_editorial.py --theme <id> --capture --video (üretim build'i ister; yalnız
                   listing_kit'in bildiği tasarımlar)
  7 etsy           etsy_upload.py --designs NN (yalnız etsy_upload'ın bildiği tasarımlar; Etsy'ye hiçbir şey gitmez)
  son: gpt_bekleyen.py --yaz (docs/26 yeniden yazılır; --uygula ile)

Sonda, "coming" tasarımın live olmasını ne engelliyor: eksik parçalar, başarısız/koşulmamış denetimler, göz kontrolü
(makinece kaydı yok; koordinatör contact sheet / ekran görüntülerine bakar). Bu araç hiçbir tasarımı live yapmaz, yayın
(deploy) yapmaz, Etsy'ye göndermez. Çıkış kodu: reddedilen eşleştirme ya da HATA veren adım varsa 1.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path

from PIL import Image

TOOLS = Path(__file__).resolve().parent
sys.path.insert(0, str(TOOLS))
import gpt_bekleyen as gb  # noqa: E402
import gpt_kuru_deneme as kd  # noqa: E402
import kit_check as kc  # noqa: E402

KOK = TOOLS.parent
NODE_PATH = "/opt/node22/lib/node_modules"
ADIMLAR = ["build_images", "baski", "palet", "cikti", "theme_check", "ilan", "etsy"]
GRUPLAR = ("web", "baski", "foto", "mockup", "varyant")
DURUM_ADI = {"ATLANDI": "atlandı", "KAPALI": "koşulmadı", "DURDU": "durdu", "HATA": "hata", "ÇALIŞIR": "kuru (koşulmadı)"}
BASKI_BOLUM = re.compile(r"PAKET\s*6|G139", re.I)


# ---------------------------------------------------------------- istenen dosyalar

def _rel(p: Path) -> str:
    try:
        return p.resolve().relative_to(KOK.resolve()).as_posix()
    except ValueError:
        return str(p)


def _grup(yol: str, bolum: str, prompt: Path) -> str:
    if prompt.parent.name == "variants":
        return "varyant"
    if "/photos/" in yol:
        return "foto"
    if "/mockups/" in yol:  # ilan sahneleri (PAKET 3) website build'ini beklemez
        return "mockup"
    if "/print/" in yol or BASKI_BOLUM.search(bolum):
        return "baski"
    return "web"


def _satir_sarti(prompt: Path, yol: str) -> dict:
    """Kaydet satırı kalın değilse (01–21'in G139 bölümü: "Kaydet: <yol> — 2048 × 3072 px, şeffaf …") aynı şartları yolun
    geçtiği satırdan ve bloğundan okur."""
    satirlar = prompt.read_text(encoding="utf-8").splitlines()
    ad = yol.rsplit("/", 1)[-1]
    for i, s in enumerate(satirlar):
        if f"`{yol}`" in s or (f"`{ad}`" in s and "aydet" in s):
            o = kc.OLCU.search(s)
            dusuk = s.lower()
            pencere = False
            for t in satirlar[i + 1:]:
                if t.startswith("#"):
                    break
                pencere |= "#00FF00" in t.upper()
            return {"olcu": (int(o.group(1)), int(o.group(2))) if o else None,
                    "seffaf": ("şeffaf" in dusuk or "seffaf" in dusuk or "transparent" in dusuk) and "opak" not in dusuk,
                    "pencere": pencere or "#00FF00" in s.upper()}
    return {"olcu": None, "seffaf": False, "pencere": False}


def istenenler() -> dict[str, dict]:
    """repo-göreli hedef yol → {prompt, bolum, grup, koleksiyon, var, olcu, seffaf, pencere, mockup, ekran}.
    Hangi yolların istendiğini gpt_bekleyen.tara söyler; şartlar Kaydet satırlarından (kuru_deneme + kit_check)."""
    out: dict[str, dict] = {}
    for prompt in gb.prompt_dosyalari():
        sartlar: dict[str, dict] = {}
        for b in kc.beklenenler(prompt):  # mockup, ekran
            sartlar[b["yol"]] = dict(b)
        for b in kd.beklenenler(prompt):  # çok dosyalı Kaydet satırları, "transparent"
            s = sartlar.setdefault(b["yol"], {"mockup": "/mockups/" in b["yol"], "ekran": None})
            s["olcu"] = s.get("olcu") or b["olcu"]
            s["seffaf"] = s.get("seffaf") or b["seffaf"]
            s["pencere"] = s.get("pencere") or b["pencere"]
        for bolum, yol, var in gb.tara(prompt):
            y = _rel(Path(gb.KOK) / yol) if not Path(yol).is_absolute() else _rel(Path(yol))
            if y in out:
                continue
            s = sartlar.get(y)
            if s is None:
                s = {**_satir_sarti(prompt, y), "mockup": "/mockups/" in y, "ekran": None}
            m = re.match(r"collections/([^/]+)/", y)
            out[y] = {"prompt": _rel(prompt), "bolum": bolum, "grup": _grup(y, bolum, prompt),
                      "koleksiyon": m.group(1) if m else None, "var": var,
                      "olcu": s.get("olcu"), "seffaf": bool(s.get("seffaf")), "pencere": bool(s.get("pencere")),
                      "mockup": bool(s.get("mockup")), "ekran": s.get("ekran")}
    return out


# ---------------------------------------------------------------- eşleştirme

def klasor_haritasi(klasor: Path, istenen: dict[str, dict]) -> tuple[dict[str, str], list[Path]]:
    """İndirme adıyla kaydedilmiş dosyalar → {mutlak gelen yol: hedef}; adı tanınmayanlar ayrı (tahmin yok)."""
    import gpt_is_listesi as il  # indirme adının tek kaynağı (tembel: o modül de bunu içe aktarır)
    adlar = {il.indirme_koku(il.indirme_adi(h)): h for h in istenen}
    harita, bilinmeyen = {}, []
    for f in sorted(klasor.iterdir()):
        if not f.is_file() or f.name.startswith("."):
            continue
        h = adlar.get(il.indirme_koku(f.name)) if f.suffix.lower() in il.UZANTILAR else None
        if h is None:
            bilinmeyen.append(f)
        else:
            harita[str(f.resolve())] = h
    return harita, bilinmeyen


def _ozet(p: Path) -> str:
    return hashlib.sha256(p.read_bytes()).hexdigest()


def _ayni_piksel(a: Path, b: Path) -> bool:
    try:
        x, y = Image.open(a), Image.open(b)
        return x.size == y.size and x.convert("RGBA").tobytes() == y.convert("RGBA").tobytes()
    except Exception:  # noqa: BLE001
        return False


@dataclass
class Plan:
    gelen: Path
    hedef: str
    durum: str            # KOPYALANACAK / DÖNÜŞTÜRÜLECEK / ÜZERİNE / YERİNDE / RED
    mesaj: str
    uyarilar: list[str] = field(default_factory=list)


def eslestir(harita: dict, harita_klasoru: Path, uzerine_yaz: bool, istenen: dict[str, dict]) -> list[Plan]:
    planlar: list[Plan] = []
    hedef_sayac: dict[str, int] = {}
    for h in harita.values():
        hedef_sayac[str(h)] = hedef_sayac.get(str(h), 0) + 1
    for g, h in harita.items():
        gelen = Path(g) if Path(g).is_absolute() else (harita_klasoru / g)
        hedef = str(h).strip()
        p = Plan(gelen, hedef, "RED", "")
        planlar.append(p)
        norm = Path(hedef)
        if norm.is_absolute() or ".." in norm.parts or hedef != norm.as_posix():
            p.mesaj = "hedef repo köküne göreli, '..'suz düz bir yol olmalı"
            continue
        b = istenen.get(hedef)
        if b is None:
            p.mesaj = "hiçbir GPT_PROMPTS.md bu yolu istemiyor (yazım? klasör? uzantı?)"
            continue
        if hedef_sayac[hedef] > 1:
            p.mesaj = "aynı hedefe birden çok gelen dosya eşlenmiş"
            continue
        if not gelen.is_file():
            p.mesaj = f"gelen dosya yok: {gelen}"
            continue
        try:
            im = Image.open(gelen)
            im.load()
        except Exception as e:  # noqa: BLE001
            p.mesaj = f"görsel açılamadı: {e}"
            continue
        ok, msg = kc.denetle({**b, "yol": str(gelen.resolve())}, KOK)
        if not ok:
            p.mesaj = f"prompt şartı tutmuyor: {msg}"
            continue
        if b["olcu"] and (im.width < b["olcu"][0] * 0.98 or im.height < b["olcu"][1] * 0.98):
            p.uyarilar.append(f"çözünürlük {im.width}×{im.height} < istenen {b['olcu'][0]}×{b['olcu'][1]}")
        donustur = gelen.suffix.lower() != Path(hedef).suffix.lower() and not (
            {gelen.suffix.lower(), Path(hedef).suffix.lower()} <= {".jpg", ".jpeg"})
        if donustur and Path(hedef).suffix.lower() in (".jpg", ".jpeg") and im.mode in ("RGBA", "LA", "P"):
            a = im.convert("RGBA").getchannel("A")
            if a.getextrema()[0] < 250:
                p.mesaj = "şeffaf pikselli görsel .jpg hedefe dönüştürülemez"
                continue
        tam = KOK / hedef
        if tam.exists():
            if _ozet(tam) == _ozet(gelen) or (donustur and _ayni_piksel(tam, gelen)):
                p.durum, p.mesaj = "YERİNDE", "hedefte aynı dosya var"
                continue
            if not uzerine_yaz:
                p.mesaj = "hedefte FARKLI bir dosya var (--uzerine-yaz olmadan yazılmaz)"
                continue
            p.durum = "ÜZERİNE"
        else:
            p.durum = "DÖNÜŞTÜRÜLECEK" if donustur else "KOPYALANACAK"
        p.mesaj = msg + (f" · {gelen.suffix}→{Path(hedef).suffix}" if donustur else "")
    return planlar


def uygula_plan(planlar: list[Plan]) -> None:
    for p in planlar:
        if p.durum not in ("KOPYALANACAK", "DÖNÜŞTÜRÜLECEK", "ÜZERİNE"):
            continue
        tam = KOK / p.hedef
        tam.parent.mkdir(parents=True, exist_ok=True)
        if p.gelen.suffix.lower() == tam.suffix.lower() or {p.gelen.suffix.lower(), tam.suffix.lower()} <= {".jpg", ".jpeg"}:
            shutil.copyfile(p.gelen, tam)
        else:
            im = Image.open(p.gelen)
            if tam.suffix.lower() in (".jpg", ".jpeg"):
                im.convert("RGB").save(tam, quality=92)
            else:
                im.save(tam)


# ---------------------------------------------------------------- tasarımlar

@dataclass
class Tasarim:
    no: str
    klasor: str
    tema: str | None
    durum: str  # config.ts: live / preview / coming / ?


def tasarimlar() -> dict[str, Tasarim]:
    """koleksiyon klasörü → Tasarim (tema = COL'u o klasör olan build_images.py'nin teması)."""
    temalar = {}
    for bi in sorted((KOK / "platform/themes").glob("*/build_images.py")):
        m = re.search(r'COL\s*=\s*ROOT\s*/\s*"collections/([^"/]+)"', bi.read_text(encoding="utf-8"))
        if m:
            temalar[m.group(1)] = bi.parent.name
    cfg = KOK / "platform/lib/marketing/config.ts"
    durumlar = dict(re.findall(r"id:\s*'([^']+)',[^{}]*?status:\s*'(\w+)'", cfg.read_text(encoding="utf-8"))) \
        if cfg.exists() else {}
    out = {}
    for c in sorted((KOK / "collections").iterdir()):
        m = re.match(r"(\d{2})_", c.name)
        if c.is_dir() and m:
            t = temalar.get(c.name)
            out[c.name] = Tasarim(m.group(1), c.name, t, durumlar.get(t, "?") if t else "?")
    return out


def sec(spec: str, hepsi: dict[str, Tasarim]) -> list[str]:
    secilen = []
    for parca in filter(None, (s.strip() for s in spec.split(","))):
        if parca == "all":
            secilen += [k for k, t in hepsi.items() if t.tema]
            continue
        bul = [k for k, t in hepsi.items() if parca in (t.no, k, t.tema) or (parca.isdigit() and t.no == f"{int(parca):02d}")]
        if not bul:
            raise SystemExit(f"--koleksiyon: '{parca}' bulunamadı (NN, NN_Ad, tema id ya da all)")
        secilen += bul
    return list(dict.fromkeys(secilen))


def _bilinen(dosya: str, desen: str) -> set[str]:
    p = TOOLS / dosya
    return set(re.findall(desen, p.read_text(encoding="utf-8"))) if p.exists() else set()


# ---------------------------------------------------------------- adımlar

def calistir(komut: list[str], cwd: Path, env: dict | None = None) -> tuple[int, str]:
    """Testler bunu değiştirir (build komutları gerçekten koşulmaz)."""
    r = subprocess.run(komut, cwd=cwd, env={**os.environ, **(env or {})}, capture_output=True, text=True)
    return r.returncode, (r.stdout + r.stderr)


def cikti_denetle(t: Tasarim) -> tuple[bool, str]:
    tema_dir = KOK / "platform/themes" / t.tema
    img = tema_dir / "img"
    var = {p.name for p in img.iterdir()} if img.exists() else set()
    kirik = sorted(kd.tema_refs(tema_dir) - var)
    sorun = []
    if kirik:
        sorun.append("sayfaların istediği ama img/'de olmayan: " + ", ".join(kirik))
    mf = img / "manifest.json"
    if mf.exists():
        notlar = [v for k, v in json.loads(mf.read_text(encoding="utf-8")).items()
                  if k in ("_note", "note", "mode", "_mode") and isinstance(v, str)]
        if any(re.search(r"interim|geçici", v, re.I) for v in notlar):
            sorun.append("parçalar tam ama manifest.json'da 'interim/geçici' izi var — build GPT yoluna geçmemiş")
    return (not sorun), ("; ".join(sorun) if sorun else f"{len(var)} dosya, kırık referans yok")


@dataclass
class Sonuc:
    durum: str  # TAMAM / HATA / ATLANDI / DURDU / KAPALI / ÇALIŞIR (kuru)
    not_: str = ""


def adimlari_kos(t: Tasarim, eksik: dict[str, list[str]], uygula: bool, theme_check: bool, ilan: bool) -> dict[str, Sonuc]:
    """Bir tasarımın adımları; `eksik` = grup → eksik hedef yollar (yerleşecekler sayılmış)."""
    no, tema = t.no, t.tema
    sonuc: dict[str, Sonuc] = {}
    durdu = False
    tamam: set[str] = set()
    next_var = (KOK / "platform/.next/BUILD_ID").exists()
    env_node = {"NODE_PATH": NODE_PATH} if Path(NODE_PATH).exists() else {}

    def eksik_not(*gruplar):
        n = {g: len(eksik.get(g, [])) for g in gruplar if eksik.get(g)}
        return ("eksik: " + ", ".join(f"{g} {k}" for g, k in n.items())) if n else ""

    tanimlar = [
        ("build_images", ("web",), [], lambda: [[sys.executable, str(KOK / f"platform/themes/{tema}/build_images.py")]], KOK,
         None, None),
        ("baski", ("web", "baski"), ["build_images"],
         lambda: [["node", "scripts/build-print-assets.ts", "--theme", tema]], KOK / "platform", None,
         lambda: None if (KOK / "platform/node_modules").exists() else "platform/node_modules yok (`cd platform && npm ci`)"),
        ("palet", ("web",), ["build_images"],
         lambda: [[sys.executable, str(TOOLS / "recolor_parts.py"), "build", "--design", no],
                  [sys.executable, str(TOOLS / "recolor_parts.py"), "check", "--design", no]], KOK,
         lambda: None if (KOK / "collections" / t.klasor / "variants/recolor.json").exists() else "palet yok (recolor.json)",
         None),
        ("cikti", ("web",), ["build_images"], None, None, None, None),
        ("theme_check", ("web", "foto"), ["build_images", "cikti"],
         lambda: [["node", "scripts/theme-assets.cjs"],
                  ["node", "scripts/theme-check.cjs", "--theme", tema, "--stress"]], KOK / "platform",
         lambda: None if theme_check else "KAPALI",
         lambda: None if next_var else "platform/.next yok (önce `cd platform && npm run build`)"),
        ("ilan", ("web", "foto", "mockup"), ["build_images", "cikti"],
         lambda: [[sys.executable, str(TOOLS / "listing_editorial.py"), "--theme", tema, "--capture", "--video"]], KOK,
         lambda: "KAPALI" if not ilan else (None if no in LISTING_BILINEN() else f"listing_kit {no}'i bilmiyor"),
         lambda: None if next_var else "platform/.next yok (önce `cd platform && npm run build`)"),
        ("etsy", (), ["build_images"],
         lambda: [[sys.executable, str(TOOLS / "etsy_upload.py"), "--designs", no]], KOK,
         lambda: None if no in ETSY_BILINEN() else f"etsy_upload {no}'i bilmiyor", None),
    ]
    for ad, gruplar, onceki, komutlar, cwd, kosul, ortam in tanimlar:
        if durdu:
            sonuc[ad] = Sonuc("DURDU", "önceki adım HATA")
            continue
        k = kosul() if kosul else None
        if k == "KAPALI":
            sonuc[ad] = Sonuc("KAPALI", f"--{ad.replace('_', '-')} verilmedi")
            continue
        if k:
            sonuc[ad] = Sonuc("ATLANDI", k)
            continue
        en = eksik_not(*gruplar)
        if en:
            sonuc[ad] = Sonuc("ATLANDI", en)
            continue
        ol = [o for o in onceki if o not in tamam]
        if ol:
            sonuc[ad] = Sonuc("ATLANDI", "önce: " + ", ".join(ol))
            continue
        if not uygula:
            sonuc[ad] = Sonuc("ÇALIŞIR", "")
            tamam.add(ad)  # kuru: sonraki adımların "önce" şartı için koşulmuş say
            continue
        o = ortam() if ortam else None
        if o:
            sonuc[ad] = Sonuc("HATA", o)
            durdu = True
            continue
        if ad == "cikti":
            ok, msg = cikti_denetle(t)
        else:
            ok, msg = True, ""
            for komut in komutlar():
                rc, cikti = calistir(komut, cwd, env_node if komut[0] == "node" else None)
                if rc:
                    ok, msg = False, f"`{' '.join(Path(komut[1]).name if i == 1 else c for i, c in enumerate(komut[:4]))}` " \
                                     f"çıkış {rc}: " + " | ".join(cikti.strip().splitlines()[-6:])
                    break
                msg = (cikti.strip().splitlines() or [""])[-1][:120]
        sonuc[ad] = Sonuc("TAMAM" if ok else "HATA", msg)
        if ok:
            tamam.add(ad)
        else:
            durdu = True
    return sonuc


def LISTING_BILINEN() -> set[str]:  # noqa: N802
    try:
        import listing_kit as lk
        return {t.no for t in lk.THEMES.values()}
    except Exception:  # noqa: BLE001
        return set()


def ETSY_BILINEN() -> set[str]:  # noqa: N802
    return _bilinen("etsy_upload.py", r'\(\s*"(\d\d)",\s*"\d\d_')


# ---------------------------------------------------------------- ana akış

def _tablo(satirlar: list[list[str]]) -> str:
    gen = [max(len(r[i]) for r in satirlar) for i in range(len(satirlar[0]))]
    cizgi = ["-" * g for g in gen]
    return "\n".join("| " + " | ".join(h.ljust(g) for h, g in zip(r, gen)) + " |" for r in [satirlar[0], cizgi, *satirlar[1:]])


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--eslestir", type=Path, help='harita JSON: {"<gelen dosya>": "<hedef yol>"}')
    ap.add_argument("--klasor", type=Path, help="indirme adıyla kaydedilmiş görsellerin klasörü (docs/27)")
    ap.add_argument("--koleksiyon", help="NN | NN_Ad | tema id | virgüllü liste | all (yerleştirmeden de çalışır)")
    ap.add_argument("--uygula", action="store_true", help="dosyaları yaz ve adımları koş (vars. kuru)")
    ap.add_argument("--uzerine-yaz", action="store_true", help="hedefteki farklı dosyanın üstüne yaz")
    ap.add_argument("--theme-check", action="store_true", help="theme-check --stress (üretim build'i ister)")
    ap.add_argument("--ilan", action="store_true", help="listing_editorial --capture --video (üretim build'i ister)")
    a = ap.parse_args(argv)
    if not a.eslestir and not a.koleksiyon and not a.klasor:
        ap.error("--eslestir, --klasor ya da --koleksiyon gerekli")
    if a.klasor and not a.klasor.is_dir():
        ap.error(f"klasör yok: {a.klasor}")

    istenen = istenenler()
    hepsi = tasarimlar()
    hata = False
    yerlesecek: set[str] = set()
    etkilenen: list[str] = []

    if a.eslestir or a.klasor:
        harita: dict[str, str] = {}
        if a.klasor:
            kh, bilinmeyen = klasor_haritasi(a.klasor, istenen)
            print(f"Klasör {a.klasor}: {len(kh)} dosya indirme adından eşlendi · {len(bilinmeyen)} bilinmeyen")
            for f in bilinmeyen:
                print(f"  BİLİNMEYEN      {f.name} — indirme adı değil (docs/27); dokunulmadı")
            harita.update(kh)
        if a.eslestir:
            eh = json.loads(a.eslestir.read_text(encoding="utf-8"))
            if not isinstance(eh, dict) or not all(isinstance(v, str) for v in eh.values()):
                raise SystemExit("harita bir JSON nesnesi olmalı: {\"<gelen>\": \"<hedef yol>\"}")
            klasor = a.eslestir.resolve().parent
            harita.update({str(Path(g) if Path(g).is_absolute() else klasor / g): h for g, h in eh.items()})
        if not harita:
            print("Eşlenecek dosya yok.")
            return 1 if not a.koleksiyon else 0
        planlar = eslestir(harita, Path.cwd(), a.uzerine_yaz, istenen)
        red = [p for p in planlar if p.durum == "RED"]
        print(f"Eşleştirme: {len(planlar)} dosya · {len(red)} red")
        for p in planlar:
            print(f"  {p.durum:<15} {p.gelen.name} → {p.hedef} — {p.mesaj}")
            for u in p.uyarilar:
                print(f"  {'':<15} UYARI {u}")
        if red:
            print("REDDEDİLDİ: en az bir girdi geçmedi — HİÇBİR dosya kopyalanmadı. Haritayı düzeltip yeniden koş.")
            return 1
        yeni = [p for p in planlar if p.durum != "YERİNDE"]
        if a.uygula:
            uygula_plan(planlar)
            print(f"{len(yeni)} dosya yazıldı.")
        else:
            print(f"KURU: {len(yeni)} dosya yazılacaktı (yazmak için --uygula).")
        yerlesecek = {p.hedef for p in planlar}
        for h in yerlesecek:
            k = istenen[h]["koleksiyon"]
            if k in hepsi and k not in etkilenen:
                etkilenen.append(k)
            elif k is None:
                print(f"  not: {h} bir tasarıma bağlı değil (brand/) — adım yok")
    if a.koleksiyon:
        etkilenen += [k for k in sec(a.koleksiyon, hepsi) if k not in etkilenen]
    etkilenen.sort()

    satirlar = [["Tasarım", *ADIMLAR]]
    notlar: list[str] = []
    engeller: list[str] = []
    for k in etkilenen:
        t = hepsi[k]
        if not t.tema:
            notlar.append(f"{k}: platform teması yok (build_images.py bulunamadı) — adım yok")
            continue
        eksik: dict[str, list[str]] = {g: [] for g in GRUPLAR}
        for y, b in istenen.items():
            if b["koleksiyon"] == k and not b["var"] and y not in yerlesecek:
                eksik[b["grup"]].append(y)
        s = adimlari_kos(t, eksik, a.uygula, a.theme_check, a.ilan)
        satirlar.append([f"{t.no} {t.tema}", *[s[ad].durum for ad in ADIMLAR]])
        for ad in ADIMLAR:
            if s[ad].not_ and s[ad].durum not in ("KAPALI",):
                notlar.append(f"{t.no} {ad}: {s[ad].durum} — {s[ad].not_}")
        hata |= any(r.durum == "HATA" for r in s.values())
        if t.durum != "live":
            e = []
            for g in GRUPLAR:
                if eksik[g]:
                    e.append(f"{len(eksik[g])} {g} parçası eksik ({', '.join(Path(y).name for y in eksik[g][:6])}"
                             f"{' …' if len(eksik[g]) > 6 else ''})")
            for ad in ("build_images", "baski", "cikti", "theme_check"):
                if s[ad].durum != "TAMAM":
                    e.append(f"{ad}: {DURUM_ADI.get(s[ad].durum, s[ad].durum.lower())}")
            e.append("göz kontrolü işaretlenmedi (makinece kaydı yok; koordinatör contact sheet / theme-check ekranlarına bakar)")
            engeller.append(f"{t.no} {t.tema} ({t.durum}):\n    - " + "\n    - ".join(e))

    if len(satirlar) > 1:
        print(("\nUYGULANDI" if a.uygula else "\nKURU ÇALIŞMA (hiçbir şey koşulmadı/yazılmadı; --uygula ile koşar)") + ":\n")
        print(_tablo(satirlar))
    for n in notlar:
        print("  " + n)
    if engeller:
        print("\nlive için kalanlar (bu araç live yapmaz; koordinatör kararı):")
        for e in engeller:
            print("  " + e)
    if a.uygula and (yerlesecek or len(satirlar) > 1):
        rc, out = calistir([sys.executable, str(TOOLS / "gpt_bekleyen.py"), "--yaz"], KOK)
        print("\ngpt_bekleyen --yaz: " + (out.strip().splitlines() or [""])[-1])
        hata |= bool(rc)
    return 1 if hata else 0


if __name__ == "__main__":
    sys.exit(main())
