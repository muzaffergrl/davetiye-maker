#!/usr/bin/env python3
"""GPT iş listesi (G179): ChatGPT'de elle üretilecek EKSİK görsellerin tek, sıralı, kendi başına yapıştırılabilir listesi.

  python3 tools/gpt_is_listesi.py          # özet (grup → tasarım → sayı)
  python3 tools/gpt_is_listesi.py --yaz    # docs/27_GPT_IS_LISTESI.md + docs/27_GPT_IS_LISTESI.html
  (tools/gpt_bekleyen.py --yaz bunu da yazar; iki belge aynı turda güncellenir)

Kaynak gpt_bekleyen ile aynıdır (prompt_dosyalari + satir_yollari): her eksik hedef yol için o yolun prompt bloğu bulunur
(yolun geçtiği başlık bölümündeki kod bloğu). Blok kendi başına yapıştırılabilir hâle getirilir:
  - bölümün "**Instructions for GPT (send before the first image):**" kod bloğu her prompt'un başına eklenir,
  - "Same as above" / "same prompt as W2.3, but …" → atıf yapılan prompt yerine konur,
  - bir Kaydet satırı birden çok dosya istiyorsa (`tile_1.png`, `tile_2.png` …) prompt yalnız o dosyayı ister,
  - sert satır kırılımları paragrafta birleştirilir (`tile_1:` gibi etiketli satırlar ayrı kalır).
Şartlar (ölçü, şeffaflık, #00FF00 pencere, ekran sayısı) gpt_yerlestir.istenenler'den — yerleştirme denetimiyle aynı kaynak.

İndirme adı (`indirme_adi`): hedef yoldan türeyen düz dosya adı — kullanıcı ChatGPT çıktısını bu adla kaydeder,
`tools/gpt_yerlestir.py --klasor <klasör>` adı hedefe çevirir. Tek doğruluk kaynağı bu fonksiyondur.
"""
from __future__ import annotations

import html
import json
import re
import sys
from math import gcd
from pathlib import Path, PurePosixPath

TOOLS = Path(__file__).resolve().parent
sys.path.insert(0, str(TOOLS))
import gpt_bekleyen as gb  # noqa: E402

CIKTI_MD = "docs/27_GPT_IS_LISTESI.md"
CIKTI_HTML = "docs/27_GPT_IS_LISTESI.html"
UZANTILAR = (".png", ".jpg", ".jpeg", ".webp")
ATLA_KLASOR = {"assets", "gpt", "parts", "variants"}

GRUPLAR = {
    "a": "A · Tasarım 22–38 (yeni tasarımlar)",
    "b": "B · Tasarım 01–21 rötuş / baskı parçaları",
    "c": "C · Palet varyantı görselleri",
    "d": "D · Diğer (marka)",
}
TURLER = {"web": "website parçası (PAKET 5)", "foto": "örnek fotoğraf (PAKET 2)", "mockup": "ilan sahnesi (PAKET 3)",
          "baski": "baskı parçası (PAKET 6 / G139)", "varyant": "palet varyantı", "sosyal": "sosyal medya (GM10)"}
TUR_SIRA = ["web", "foto", "mockup", "baski", "varyant", "sosyal"]
BASKI_BOLUM = re.compile(r"PAKET\s*6|G139", re.I)
ISTEGE_BAGLI = re.compile(r"yalnız istenirse|isteğe bağlı|optional", re.I)
ON_METIN = re.compile(r"\*\*Instructions for GPT[^*]*\*\*", re.I)
AYNI = re.compile(r"^\s*(?:the\s+)?same\s+(?:prompt\s+)?as\s+(above|the previous(?: prompt| one)?|[A-Z]*\d+(?:\.\d+)*[a-z]?)"
                  r"\s*[,.;:—–-]?\s*", re.I)
AYNI_METIN = re.compile(r"same (?:prompt )?as above|yukarıdakiyle aynı|aynı prompt", re.I)
ETIKET = re.compile(r"^([A-Za-z0-9_]{1,40}):\s+\S")
TAM_YOL = re.compile(r"((?:collections|brand)/[^\s`'\"()]+\.(?:png|jpg|jpeg|webp))")
AD = re.compile(r"(?<![\w/.–-])([A-Za-z0-9_][A-Za-z0-9_-]*\.(?:png|jpg|jpeg|webp))\b")
# prompt'ta şeffaflık için açık bir yedek yol yazıyorsa (bugün hiçbir dosyada yok) maddede gösterilir
OLCU_METIN = re.compile(r"(\d{3,5})\s*[×x]\s*(\d{3,5})\s*px")
YEDEK = re.compile(r"[^.\n]*(?:fallback|if (?:a )?transparen\w* (?:background )?is not|yedek zemin)[^.\n]*\.?", re.I)


# ---------------------------------------------------------------- indirme adı (tek doğruluk kaynağı)

def _slug(s: str) -> str:
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", s.lower())).strip("-")


def indirme_adi(hedef: str) -> str:
    """Repo-göreli hedef yol → düz indirme adı. Yalnız yoldan türer (liste/sıra değil):
    collections/23_Velvet_Jewel_Box/assets/gpt/parts/box_closed.png → 23-velvet-jewel-box__box_closed.png
    …/assets/gpt/photos/story_1.jpg → 23-velvet-jewel-box__photos__story_1.jpg
    collections/16_Sunflower_Rustic/variants/V02_navy_sunflower/gpt/closure.png → 16-sunflower-rustic__v02-navy-sunflower__closure.png"""
    p = PurePosixPath(hedef)
    klasorler = list(p.parts[:-1])
    if klasorler[:1] == ["collections"] and len(klasorler) > 1:
        klasorler = klasorler[1:]
    bas = _slug(klasorler[0]) if klasorler else "repo"
    ara = [_slug(k) for k in klasorler[1:] if k not in ATLA_KLASOR]
    return "__".join([bas, *ara, re.sub(r"[^a-z0-9_-]+", "-", p.stem.lower())]) + p.suffix.lower()


def indirme_koku(ad: str) -> str:
    """Eşleştirme anahtarı: uzantısız, küçük harf (.png / .jpg / .webp farkı önemsiz)."""
    p = PurePosixPath(ad.strip())
    return (p.stem if p.suffix.lower() in UZANTILAR else p.name).lower()


# ---------------------------------------------------------------- prompt blokları

def _sar_ac(metin: str) -> str:
    """Kod bloğundaki sert satır kırılımlarını paragraf içinde birleştirir; boş satır ve etiketli satır ayrı kalır."""
    out: list[str] = []
    for s in metin.strip("\n").splitlines():
        s = s.rstrip()
        if not s.strip():
            if out and out[-1] != "":
                out.append("")
        elif out and out[-1] != "" and not ETIKET.match(s.strip()):
            out[-1] += " " + s.strip()
        else:
            out.append(s.strip())
    return "\n".join(out).strip()


def _jetonlar(dosya: Path):
    """("H", seviye, metin) · ("K", kod) · ("T", satır) — kod blokları içindeki satırlar başlık/yol sayılmaz."""
    kod: list[str] | None = None
    for satir in dosya.read_text(encoding="utf-8").splitlines():
        if satir.lstrip().startswith("```"):
            if kod is None:
                kod = []
            else:
                yield ("K", "\n".join(kod))
                kod = None
            continue
        if kod is not None:
            kod.append(satir)
        elif re.match(r"#{1,6} ", satir):
            n = len(satir) - len(satir.lstrip("#"))
            yield ("H", n, satir[n:].strip())
        else:
            yield ("T", satir)
    if kod is not None:
        yield ("K", "\n".join(kod))


def bloklar(dosya: Path) -> tuple[str | None, dict[str, dict]]:
    """(dosyanın GPT notu, {repo-göreli hedef: {baslik, bolum, bolum_notu, on_metin, ham, kontrol, kaydet, sira, kardes}})."""
    dosya_notu: list[str] = []
    ust = True
    bolum, bolum_notu, on_metin, on_bekle = "(başlıksız)", [], None, False
    parcalar: list[dict] = []
    seg: dict | None = None

    def yeni(baslik):
        return {"baslik": baslik, "bolum": bolum, "hedefler": [], "kodlar": [], "kontrol": [], "kaydet": "",
                "metin": [], "on_metin": on_metin, "bolum_notu": None}

    for j in _jetonlar(dosya):
        if j[0] == "H":
            if j[1] <= 2:
                seg = None
            if j[1] == 2:
                ust = False
                bolum, bolum_notu, on_metin, on_bekle = j[2], [], None, False
            elif j[1] >= 3:
                ust = False
                seg = yeni(j[2])
                seg["bolum_notu"] = bolum_notu
                parcalar.append(seg)
            continue
        if j[0] == "K":
            if on_bekle:
                on_metin, on_bekle = _sar_ac(j[1]), False
                for p in parcalar:
                    if p["bolum"] == bolum and not p["hedefler"]:
                        p["on_metin"] = on_metin
            elif seg is not None:
                seg["kodlar"].append(j[1])
            continue
        satir = j[1]
        if ust and satir.startswith(">"):
            dosya_notu.append(satir.lstrip("> ").rstrip())
            continue
        if ON_METIN.search(satir) and "send before" in satir.lower():
            on_bekle = True
            continue
        yollar = gb.satir_yollari(dosya, satir)
        if yollar:
            if seg is None or (seg["hedefler"] and seg["kodlar"]):
                baslik = seg["baslik"] if seg is not None else bolum
                seg = yeni(baslik)
                seg["bolum_notu"] = bolum_notu
                parcalar.append(seg)
            seg["hedefler"] += [y for y in yollar if y not in seg["hedefler"]]
            if not seg["kaydet"]:
                seg["kaydet"] = satir.strip()
            continue
        if seg is None:
            if satir.strip() and bolum != "(başlıksız)":
                bolum_notu.append(satir.rstrip())
            continue
        if satir.strip().startswith("Kontrol:"):
            seg["kontrol"].append(satir.strip()[len("Kontrol:"):].strip())
        elif satir.strip():
            seg["metin"].append(satir.strip())

    not_ = " ".join(dosya_notu).strip()
    not_ = re.sub(r"^\*\*Instructions for GPT:?\*\*:?\s*", "", not_) if "Instructions for GPT" in not_ else ""

    out: dict[str, dict] = {}
    for sira, p in enumerate(parcalar):
        hedefler = [_rel(y) for y in p["hedefler"]]
        for i, h in enumerate(hedefler):
            if h in out and (out[h]["ham"] is not None or not p["kodlar"]):
                continue  # ilk prompt'lu bölüm kazanır (yol önce bir notta geçmiş olabilir)
            out[h] = {"baslik": p["baslik"], "bolum": p["bolum"], "on_metin": p["on_metin"],
                      "bolum_notu": "\n".join(p["bolum_notu"] or []).strip(), "ham": p["kodlar"][0] if p["kodlar"] else None,
                      "metin": " ".join(p["metin"]), "kontrol": " ".join(p["kontrol"]), "kaydet": p["kaydet"],
                      "sira": sira, "kardes": hedefler, "kardes_no": i}
    return (not_ or None), out


def _rel(p: Path) -> str:
    try:
        return p.resolve().relative_to(gb.KOK.resolve()).as_posix()
    except ValueError:
        return str(p)


def _tek_dosya(prompt: str, hedef: str, kardesler: list[str], no: int) -> str:
    """Çok dosyalı blok → yalnız bu dosyayı isteyen prompt."""
    if len(kardesler) < 2:
        return prompt
    kok = PurePosixPath(hedef).stem
    kokler = [PurePosixPath(k).stem for k in kardesler]
    satirlar = prompt.splitlines()
    etiketli = {}
    for s in satirlar:
        m = ETIKET.match(s)
        if m:
            etiketli[m.group(1).lower()] = s[m.end(1) + 1:].strip()
    benim = next((etiketli[e] for e in (kok.lower(), kok.lower().rsplit("_", 1)[-1]) if e in etiketli), None)
    if benim is not None:
        ilk_kok = kokler[0].lower()
        ilk = next((etiketli[e] for e in (ilk_kok, ilk_kok.rsplit("_", 1)[-1]) if e in etiketli), None)
        if no > 0 and ilk and re.search(r"\bsame\b|\bmirrored\b", benim, re.I):
            return (f"Context (the first image of this set, already made): {ilk}\n\n"
                    f"Now make ONLY this one image ({kok}): {benim}")
        return benim
    return (f"This prompt describes a set of {len(kardesler)} separate images ({', '.join(kokler)}). Make ONLY ONE image "
            f"now: {kok} (number {no + 1} of {len(kardesler)}).\n\n{prompt}")


def coz(bloklar_: dict[str, dict]) -> dict[str, dict]:
    """Her hedefe kendi başına yapıştırılabilir `prompt` (ya da None) ve `uyari` ekler."""
    onceki: str | None = None
    basliklar = {}
    for h, b in sorted(bloklar_.items(), key=lambda kv: (kv[1]["sira"], kv[1]["kardes_no"])):
        ham = _sar_ac(b["ham"]) if b["ham"] else None
        b["uyari"] = []
        if ham is None and AYNI_METIN.search(b["metin"]) and onceki:
            ham = onceki
            b["uyari"].append("prompt 'same as above': önceki prompt kullanıldı")
        elif ham is not None:
            m = AYNI.match(ham)
            if m:
                ref = m.group(1).lower()
                kaynak = onceki if ref.startswith(("above", "the previous")) else basliklar.get(ref)
                if kaynak:
                    kalan = re.sub(r"^(?:but|except|with)\s+", "", ham[m.end():].strip(), flags=re.I)
                    ham = kaynak + (f"\n\nChange for this image: {kalan}" if kalan else "")
                else:
                    b["uyari"].append(f"'same as {m.group(1)}' çözülemedi")
        if ham is None:
            b["prompt"] = None
            b["uyari"].append("prompt bloğu bulunamadı")
            continue
        tek = _tek_dosya(ham, h, b["kardes"], b["kardes_no"])
        b["prompt"] = (b["on_metin"] + "\n\n" + tek) if b["on_metin"] else tek
        if b["kardes_no"] == 0:
            onceki = ham
            mb = re.match(r"([A-Z]*\d+(?:\.\d+)*[a-z]?)\b", b["baslik"])
            if mb:
                basliklar[mb.group(1).lower()] = ham
    return bloklar_


# ---------------------------------------------------------------- liste

def _koleksiyon(hedef: str) -> tuple[int | None, str | None]:
    m = re.match(r"collections/((\d+)_[^/]+)/", hedef)
    return (int(m.group(2)), m.group(1)) if m else (None, None)


def _tur(hedef: str, bolum: str, prompt_dosyasi: str) -> str:
    if "/variants/" in prompt_dosyasi:
        return "varyant"
    if hedef.startswith("brand/social/"):
        return "sosyal"
    if "/photos/" in hedef:
        return "foto"
    if "/mockups/" in hedef:
        return "mockup"
    if "/print/" in hedef or BASKI_BOLUM.search(bolum):
        return "baski"
    return "web"


def _grup(no: int | None, tur: str) -> str:
    if tur == "varyant":
        return "c"
    if no is None:
        return "d"
    return "a" if no >= 22 else "b"


def _oran(olcu) -> str | None:
    if not olcu:
        return None
    w, h = olcu
    g = gcd(w, h)
    a, b = w // g, h // g
    return f"{a}:{b}" if max(a, b) <= 32 else f"{w / h:.3f}:1"


def is_listesi(hepsi: bool = False) -> tuple[list[dict], dict[str, str]]:
    """(eksik maddeler — sıralı ve numaralı, {tasarım klasörü: dosyanın GPT notu}). hepsi=True: var olanlar da."""
    import gpt_yerlestir as gy  # şartlar yerleştirme denetimiyle aynı kaynaktan (döngüsel içe aktarma yok: tembel)
    istenen = gy.istenenler()
    tum_hedefler = set(istenen)
    adlar: dict[str, str] = {}
    for h in sorted(tum_hedefler):
        k = indirme_koku(indirme_adi(h))
        if k in adlar and adlar[k] != h:
            raise ValueError(f"indirme adı çakışıyor: {adlar[k]} ↔ {h} → {k}")
        adlar[k] = h

    maddeler: list[dict] = []
    notlar: dict[str, str] = {}
    for dosya_sira, dosya in enumerate(gb.prompt_dosyalari()):
        not_, bl = bloklar(dosya)
        coz(bl)
        prompt_rel = _rel(dosya)
        no, kol = _koleksiyon(prompt_rel)
        if not_ and kol:
            notlar.setdefault(kol, not_)
        for h, b in bl.items():
            s = istenen.get(h)
            if s is None or (s["var"] and not hepsi):
                continue
            no, kol = _koleksiyon(h)
            tur = _tur(h, b["bolum"], prompt_rel)
            yedek = YEDEK.search(b["prompt"] or "")
            olcu, seffaf, kaynak = s.get("olcu"), bool(s["seffaf"]), "Kaydet satırı"
            if not olcu and b["prompt"]:
                o = OLCU_METIN.search(b["prompt"])
                if o:
                    olcu, kaynak = (int(o.group(1)), int(o.group(2))), "prompt metni"
            if not seffaf and b["prompt"] and not s.get("olcu") and re.search(r"transparent background", b["prompt"], re.I):
                seffaf, kaynak = True, "prompt metni"
            maddeler.append({
                "hedef": h, "indirme_adi": indirme_adi(h), "prompt_dosyasi": prompt_rel,
                "tasarim_no": no, "tasarim": kol or (PurePosixPath(h).parts[0]), "tur": tur, "grup": _grup(no, tur),
                "bolum": b["bolum"], "baslik": b["baslik"], "kaydet": b["kaydet"], "prompt": b["prompt"],
                "kontrol": b["kontrol"], "bolum_notu": b["bolum_notu"], "uyari": b["uyari"],
                "istege_bagli": bool(ISTEGE_BAGLI.search(b["bolum"] + " " + b["baslik"])),
                "olcu": list(olcu) if olcu else None, "oran": _oran(olcu), "sart_kaynagi": kaynak,
                "seffaf": seffaf, "pencere": bool(s["pencere"]), "ekran": s.get("ekran"),
                "bicim": PurePosixPath(h).suffix.lstrip(".").lower(), "var": bool(s["var"]),
                "seffaf_yedek": yedek.group(0).strip() if yedek else None,
                "_sira": (dosya_sira, b["sira"], b["kardes_no"]),
            })
    maddeler.sort(key=lambda m: ("abcd".index(m["grup"]), m["istege_bagli"], m["tasarim_no"] or 0,
                                 TUR_SIRA.index(m["tur"]), m["_sira"]))
    maddeler = _referans_once(maddeler)
    no_by_hedef = {}
    for i, m in enumerate(maddeler, 1):
        m["no"] = i
        no_by_hedef[m["hedef"]] = i
        del m["_sira"]
    for m in maddeler:
        m["referanslar"] = _referanslar(m, istenen, no_by_hedef)
    return maddeler, notlar


REF_VER = re.compile(r"give ((?:[\w.-]+\.(?:png|jpe?g))(?:(?:,| and) [\w.-]+\.(?:png|jpe?g))*) as (?:the |its )?"
                     r"(?:style |position )?reference|\(reference: ([\w.-]+\.(?:png|jpe?g))")


def _referans_once(maddeler: list[dict]) -> list[dict]:
    """Bir tasarımın içinde, prompt'u "give X.png as the reference" diyen madde X'ten önce gelmesin: X öne alınır
    (32'de kapak ve iç kuyu, sonra tanımlanan kutu gövdesini referans alıyor). Yalnız açık referans sayılır — "where it
    will sit in X.png" gibi konum tarifleri sırayı değiştirmez. Döngüde özgün sıra korunur."""
    out, i = [], 0
    while i < len(maddeler):
        j = i
        while j < len(maddeler) and (maddeler[j]["grup"], maddeler[j]["tasarim"]) == (maddeler[i]["grup"], maddeler[i]["tasarim"]):
            j += 1
        blok = maddeler[i:j]
        ad_idx = {PurePosixPath(m["hedef"]).name: k for k, m in enumerate(blok)}
        bagli = []
        for k, m in enumerate(blok):
            refs = set()
            for a, b in REF_VER.findall(m["prompt"] or ""):
                for ad in re.findall(r"[\w.-]+\.(?:png|jpe?g)", a + " " + b):
                    if ad in ad_idx and ad_idx[ad] != k:
                        refs.add(ad_idx[ad])
            bagli.append(refs)
        yerlesen, sira = set(), []

        def yerlestir(k, yol):
            if k in yerlesen or k in yol:
                return
            for r in sorted(bagli[k]):
                yerlestir(r, yol | {k})
            yerlesen.add(k)
            sira.append(k)

        for k in range(len(blok)):
            yerlestir(k, frozenset())
        out.extend(blok[k] for k in sira)
        i = j
    return out


def _referanslar(m: dict, istenen: dict, no_by_hedef: dict) -> list[dict]:
    """Prompt'ta adı geçen başka görseller (ChatGPT'ye referans olarak eklenecek): listede mi, repoda mı?"""
    if not m["prompt"]:
        return []
    kendi = PurePosixPath(m["hedef"]).name
    ekli = re.search(r"attached|reference", m["prompt"], re.I)
    kol_kok = gb.KOK / "collections" / m["tasarim"] / "assets/gpt" if m["tasarim_no"] is not None else None
    out, gorulen = [], set()
    for tam in TAM_YOL.findall(m["prompt"]):
        gorulen.add(PurePosixPath(tam).name)
        if no_by_hedef.get(tam, 0) > m["no"]:
            continue
        out.append({"ad": PurePosixPath(tam).name, "no": no_by_hedef.get(tam), "yol": tam if (gb.KOK / tam).exists()
                    or tam in no_by_hedef else None})
    for ad in AD.findall(m["prompt"]):
        if ad in gorulen or (ad == kendi and not ekli):
            continue
        gorulen.add(ad)
        r = {"ad": ad, "no": None, "yol": None}
        # kendi adıyla "attached" (varyant rötuşu): asıl parça koleksiyonun assets/gpt'sinde, başka varyantta değil
        aday = [] if ad == kendi else [h for h in istenen if istenen[h]["koleksiyon"] == m["tasarim"]
                                        and PurePosixPath(h).name == ad and h != m["hedef"] and "/variants/" not in h]
        for h in aday:
            if h in no_by_hedef:
                r["no"], r["yol"] = no_by_hedef[h], h
                break
        if r["no"] and r["no"] > m["no"]:
            continue  # listede sonra üretilecek: bu madde için eklenemez (adı yalnız konum tarifi)
        if r["yol"] is None and kol_kok is not None and kol_kok.exists():
            bul = sorted(p for p in kol_kok.rglob(ad) if _rel(p) != m["hedef"] and "/variants/" not in _rel(p))
            if bul:
                r["yol"] = _rel(bul[0])
        out.append(r)
    return out


# ---------------------------------------------------------------- çıktılar

NEDEN = ("22–32 tasarımları 18–19 Ekim 2026'da imagegen sanatıyla yeniden kuruldu: website parçaları (PAKET 5) artık "
         "istenmiyor; bu tasarımlardan yalnız ilan sahneleri (PAKET 3) ve yeni görünüme uyan baskı zeminleri (PAKET 6) "
         "isteniyor, örnek fotoğrafları (PAKET 2) isteğe bağlı ve grubun sonunda. 33–38 ancak kendi website parçaları "
         "(PAKET 5) gelince geçici yer tutuculardan çıkıp live olabilir; örnek fotoğraflar (PAKET 2) theme-check ve demo "
         "için, ilan sahneleri (PAKET 3) ve baskı zeminleri (PAKET 6) satış paketi için gerekir. 01–21'in website parçaları "
         "tam; bu gruptaki 2× baskı parçaları yalnız basılı davetiyeyi ~230 ppi'den 300 ppi'ye çıkarır (bugünkü "
         "parçalarla da çalışıyor). Palet varyantları en sonda: o paletler `coming` ve GPT gelene dek asıl renkli parçayla "
         "görünüyor; fildişi gül paleti yalnız istenirse.")

NOTLAR_CHATGPT = [
    "Her tasarım için **yeni bir sohbet** aç ve o tasarımın maddelerini aynı sohbette sırayla üret (stil, ışık, malzeme "
    "tutarlı kalsın). Tasarım başlığındaki İngilizce GPT notu varsa önce onu gönder; notta adı geçen repo görsellerini "
    "(ör. 22–32'de `bg_scene-1024.webp` ve `v3-closed-880.webp`) o ilk mesaja ekle.",
    "**Her mesajda tek görsel:** \"Prompt'u kopyala\" → ChatGPT'ye yapıştır → gönder. Prompt'u kısaltma, Türkçeye çevirme.",
    "Ölçü / oran ve şeffaf zemin prompt'un içinde yazar; ChatGPT farklı verirse aynı sohbette \"same image, exactly "
    "W×H px (oran), true transparent background PNG\" diye bir kez iste. Oran ±%2 tutmalı; çözünürlük küçükse yalnız uyarı.",
    "**Ek görsel** satırı varsa o dosyayı (listede daha önce ürettiğin ya da repodaki) mesaja görsel olarak ekle.",
    "Görseli **PNG** olarak indir (fotoğraflar .jpg hedefli olsa da PNG indir; yerleştirici dönüştürür).",
    "\"Dosya adını kopyala\" ile dosyayı **indirme adıyla** yeniden adlandır ve hepsini tek klasörde topla. Sonra Claude: "
    "`python3 tools/gpt_yerlestir.py --klasor <klasör>` (kuru) → `--uygula`. Adı değiştirmediysen (ChatGPT adıyla "
    "kaldıysa) otomatik eşleşmez: Claude görsellere bakıp `--eslestir harita.json` yazar — daha yavaş.",
    "ChatGPT **şeffaf zemin vermiyorsa**: prompt dosyalarında yazılı bir yedek yol (#00FF00 ya da düz zemin) yok — "
    "beyaz/damalı zeminli görseli kaydetme (yerleştirici reddeder). Maddeyi **Sorun** olarak işaretle ve geç; Claude "
    "sonra bakar. Bir maddede yedek yazıyorsa maddenin içinde \"Şeffaf yedek\" satırı görünür.",
    "Görselde yazı, harf, logo, QR benzeri kare çıkarsa yeniden üret — hiçbir parçada yazı istenmiyor.",
]


def _alan_ozeti(m: dict) -> str:
    p = []
    if m["olcu"]:
        p.append(f"{m['olcu'][0]}×{m['olcu'][1]} px ({m['oran']})")
    p.append("şeffaf zemin (gerçek alfa)" if m["seffaf"] else "opak")
    if m["pencere"]:
        p.append("düz #00FF00 pencere")
    if m["ekran"]:
        p.append(f"{m['ekran']} yeşil ekran")
    p.append(m["bicim"].upper())
    return " · ".join(p)


def _ref_metni(r: dict) -> str:
    if r["no"]:
        return f"{r['ad']} (listede #{r['no']})"
    if r["yol"]:
        return f"{r['ad']} (repoda: {r['yol']})"
    return f"{r['ad']} (bulunamadı)"


def _sayim(maddeler):
    out: dict[str, dict[str, int]] = {}
    for m in maddeler:
        out.setdefault(m["grup"], {}).setdefault(m["tasarim"], 0)
        out[m["grup"]][m["tasarim"]] += 1
    return out


def md_yaz(maddeler: list[dict], notlar: dict[str, str]) -> str:
    say = _sayim(maddeler)
    s = ["# GPT iş listesi — ChatGPT'de üretilecek görseller", "",
         "`python3 tools/gpt_is_listesi.py --yaz` (ya da `tools/gpt_bekleyen.py --yaz`) ile üretilir; elle düzenlenmez. "
         "Kaynak: bütün `GPT_PROMPTS.md` dosyaları. Her madde kendi başına yapıştırılabilir tam İngilizce prompt'tur. "
         "Tıklanabilir, kopyalama düğmeli ve işaretlenebilir sürüm: [`27_GPT_IS_LISTESI.html`](27_GPT_IS_LISTESI.html) "
         "(tarayıcıda aç).", "",
         f"**Toplam: {len(maddeler)} görsel** · " + " · ".join(f"{GRUPLAR[g]}: {sum(say[g].values())}" for g in "abcd" if g in say),
         "", "## Neden bu sıra", "", NEDEN, "", "## ChatGPT'de çalışma", ""]
    s += [f"{i}. {n}" for i, n in enumerate(NOTLAR_CHATGPT, 1)]
    s += ["", "## Sayım", "", "| Grup | Tasarım | Görsel |", "|---|---|---|"]
    for g in "abcd":
        for t, n in say.get(g, {}).items():
            s.append(f"| {g.upper()} | {t} | {n} |")
    grup = tasarim = None
    for m in maddeler:
        if m["grup"] != grup:
            grup, tasarim = m["grup"], None
            s += ["", f"## {GRUPLAR[grup]}", ""]
        if m["tasarim"] != tasarim:
            tasarim = m["tasarim"]
            s += [f"### {tasarim}", ""]
            if tasarim in notlar:
                s += ["Sohbetin ilk mesajı (dosyanın GPT notu):", "", "```", notlar[tasarim], "```", ""]
        s += [f"#### {m['no']}. {m['baslik']}" + (" — isteğe bağlı" if m["istege_bagli"] else ""), "",
              f"- İndirme adı: `{m['indirme_adi']}`",
              f"- Hedef: `{m['hedef']}`",
              f"- Bölüm: {m['bolum']} ({TURLER[m['tur']]})",
              f"- Şart: {_alan_ozeti(m)}"]
        if m["referanslar"]:
            s.append("- Ek görsel: " + ", ".join(_ref_metni(r) for r in m["referanslar"]))
        if m["seffaf_yedek"]:
            s.append(f"- Şeffaf yedek: {m['seffaf_yedek']}")
        for u in m["uyari"]:
            s.append(f"- UYARI: {u}")
        s.append("")
        s += ["```", m["prompt"] or "(prompt bulunamadı — prompt dosyasına bak)", "```", ""]
        if m["kontrol"]:
            s += [f"Kontrol: {m['kontrol']}", ""]
    return "\n".join(s).rstrip() + "\n"


CSS = """
:root{--bg:#f7f6f3;--fg:#1f1f1d;--muted:#6b6a65;--card:#fff;--line:#e2e0da;--acc:#2f5d8a;--ok:#2e7d4f;--warn:#a5531b;--code:#f1efea}
@media (prefers-color-scheme:dark){:root{--bg:#171716;--fg:#ebeae6;--muted:#a3a19a;--card:#21211f;--line:#353431;--acc:#8db7e0;--ok:#7fc79b;--warn:#e7a06a;--code:#2a2a27}}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
main{max-width:960px;margin:0 auto;padding:16px}
h1{font-size:1.35rem;margin:.2rem 0 .6rem}h2{font-size:1.1rem;margin:1.6rem 0 .4rem}h3{font-size:1rem;margin:1.2rem 0 .4rem;color:var(--muted)}
details.notes{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:.6rem .9rem;margin:.6rem 0}
details.notes summary{cursor:pointer;font-weight:600}
.bar{position:sticky;top:0;z-index:2;background:var(--bg);border-bottom:1px solid var(--line);padding:.6rem 0;display:flex;flex-wrap:wrap;gap:.5rem;align-items:center}
.bar select,.bar label{font:inherit;color:var(--fg)}
select{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:.35rem .5rem;max-width:100%}
#sayac{margin-left:auto;font-weight:600}
.item{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:.8rem .9rem;margin:.7rem 0}
.item.done{opacity:.55}.item.sorun{border-color:var(--warn)}
.head{display:flex;gap:.6rem;align-items:flex-start}
.head input{width:1.3rem;height:1.3rem;margin-top:.15rem;flex:none}
.no{font-weight:700;color:var(--acc);margin-right:.3rem}
.meta{color:var(--muted);font-size:.88rem;margin:.35rem 0;overflow-wrap:anywhere}
.meta code,.fn{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.85rem}
.fn{background:var(--code);border-radius:6px;padding:.1rem .35rem;overflow-wrap:anywhere;color:var(--fg)}
pre{background:var(--code);border-radius:8px;padding:.7rem;white-space:pre-wrap;overflow-wrap:anywhere;font:13px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace;margin:.5rem 0;max-height:16rem;overflow:auto}
.btns{display:flex;flex-wrap:wrap;gap:.4rem;margin:.4rem 0}
button{font:inherit;font-size:.9rem;border:1px solid var(--line);background:var(--card);color:var(--fg);border-radius:8px;padding:.4rem .7rem;cursor:pointer;min-height:2.2rem}
button.primary{background:var(--acc);border-color:var(--acc);color:var(--bg)}
button.ok{border-color:var(--ok);color:var(--ok)}
.warn{color:var(--warn);font-size:.88rem}
.kontrol{font-size:.88rem;color:var(--muted)}
.hidden{display:none}
"""

JS = r"""
(function(){
  var KEY='g179-gpt-is-listesi';
  var st={bitti:{},sorun:{}};
  try{var r=localStorage.getItem(KEY);if(r){var o=JSON.parse(r);st.bitti=o.bitti||{};st.sorun=o.sorun||{};}}catch(e){}
  function kaydet(){try{localStorage.setItem(KEY,JSON.stringify(st));}catch(e){}}
  var items=[].slice.call(document.querySelectorAll('.item'));
  var fg=document.getElementById('f-grup'),fd=document.getElementById('f-tasarim'),fb=document.getElementById('f-bitmeyen');
  function kopyala(metin,btn){
    function tamam(){var e=btn.textContent;btn.textContent='Kopyalandı ✓';btn.classList.add('ok');setTimeout(function(){btn.textContent=e;btn.classList.remove('ok');},1400);}
    function yedek(){var t=document.createElement('textarea');t.value=metin;t.setAttribute('readonly','');t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();try{document.execCommand('copy');tamam();}catch(e){}document.body.removeChild(t);}
    if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(metin).then(tamam,yedek);}else{yedek();}
  }
  function guncelle(){
    var g=fg.value,d=fd.value,b=fb.checked,gor=0,bit=0;
    items.forEach(function(el){
      var ad=el.dataset.ad,done=!!st.bitti[ad];
      el.classList.toggle('done',done);el.classList.toggle('sorun',!!st.sorun[ad]);
      el.querySelector('.cb').checked=done;
      var sb=el.querySelector('.sorun-btn');sb.textContent=st.sorun[ad]?'Sorun ✕':'Sorun';
      if(done)bit++;
      var goster=(!g||el.dataset.grup===g)&&(!d||el.dataset.tasarim===d)&&(!b||!done);
      el.classList.toggle('hidden',!goster);if(goster)gor++;
    });
    document.querySelectorAll('.baslik-grup,.baslik-tasarim').forEach(function(h){
      var k=h.dataset.k,var_=items.some(function(el){return !el.classList.contains('hidden')&&(el.dataset.grup===k||el.dataset.tasarim===k);});
      h.classList.toggle('hidden',!var_);
    });
    document.getElementById('sayac').textContent=bit+' / '+items.length+' bitti · görünen '+gor;
  }
  items.forEach(function(el){
    var ad=el.dataset.ad;
    el.querySelector('.cb').addEventListener('change',function(e){if(e.target.checked)st.bitti[ad]=1;else delete st.bitti[ad];kaydet();guncelle();});
    el.querySelector('.kp').addEventListener('click',function(e){kopyala(el.querySelector('pre').textContent,e.currentTarget);});
    el.querySelector('.ka').addEventListener('click',function(e){kopyala(ad,e.currentTarget);});
    el.querySelector('.sorun-btn').addEventListener('click',function(){if(st.sorun[ad])delete st.sorun[ad];else st.sorun[ad]=1;kaydet();guncelle();});
  });
  document.querySelectorAll('.kp-not').forEach(function(b){b.addEventListener('click',function(e){kopyala(b.parentNode.querySelector('pre').textContent,e.currentTarget);});});
  [fg,fd,fb].forEach(function(x){x.addEventListener('change',guncelle);});
  guncelle();
})();
"""


def html_yaz(maddeler: list[dict], notlar: dict[str, str]) -> str:
    e = html.escape
    say = _sayim(maddeler)
    tasarimlar = list(dict.fromkeys(m["tasarim"] for m in maddeler))
    p = ["<!doctype html>", '<html lang="tr">', "<head>", '<meta charset="utf-8">',
         '<meta name="viewport" content="width=device-width, initial-scale=1">',
         '<meta name="color-scheme" content="light dark">',
         "<title>GPT iş listesi</title>", f"<style>{CSS}</style>", "</head>", "<body>", "<main>",
         "<h1>GPT iş listesi</h1>",
         f"<p>{len(maddeler)} görsel ChatGPT'de üretilecek. Her madde kendi başına yapıştırılabilir İngilizce prompt; "
         "işaretlerin bu tarayıcıda saklanır. Üretildi: <code>python3 tools/gpt_is_listesi.py --yaz</code> (elle düzenlenmez).</p>",
         '<details class="notes" open><summary>ChatGPT\'de nasıl çalışılır</summary><ol>']
    p += [f"<li>{_md_satir(n)}</li>" for n in NOTLAR_CHATGPT]
    p += ["</ol></details>",
          f'<details class="notes"><summary>Neden bu sıra</summary><p>{_md_satir(NEDEN)}</p><ul>']
    for g in "abcd":
        if g in say:
            p.append(f"<li>{e(GRUPLAR[g])}: {sum(say[g].values())}</li>")
    p += ["</ul></details>", '<div class="bar">',
          '<select id="f-grup" aria-label="Grup"><option value="">Bütün gruplar</option>'
          + "".join(f'<option value="{g}">{e(GRUPLAR[g])}</option>' for g in "abcd" if g in say) + "</select>",
          '<select id="f-tasarim" aria-label="Tasarım"><option value="">Bütün tasarımlar</option>'
          + "".join(f'<option value="{e(t)}">{e(t)}</option>' for t in tasarimlar) + "</select>",
          '<label><input type="checkbox" id="f-bitmeyen"> yalnız bitmeyenler</label>',
          '<span id="sayac"></span>', "</div>"]
    grup = tasarim = None
    for m in maddeler:
        if m["grup"] != grup:
            grup, tasarim = m["grup"], None
            p.append(f'<h2 class="baslik-grup" data-k="{grup}">{e(GRUPLAR[grup])}</h2>')
        if m["tasarim"] != tasarim:
            tasarim = m["tasarim"]
            p.append(f'<h3 class="baslik-tasarim" data-k="{e(tasarim)}">{e(tasarim)}</h3>')
            if tasarim in notlar and grup != "c":
                p.append('<details class="notes baslik-tasarim" data-k="' + e(tasarim) + '"><summary>Sohbetin ilk mesajı '
                         "(dosyanın GPT notu)</summary><pre>" + e(notlar[tasarim]) + "</pre>"
                         '<button type="button" class="kp-not">Notu kopyala</button></details>')
        satirlar = [f'<div class="meta">Hedef: <code>{e(m["hedef"])}</code></div>',
                    f'<div class="meta">{e(m["bolum"])} · {e(TURLER[m["tur"]])}</div>',
                    f'<div class="meta"><b>Şart:</b> {e(_alan_ozeti(m))}</div>']
        if m["referanslar"]:
            satirlar.append('<div class="meta"><b>Ek görsel:</b> ' + e(", ".join(_ref_metni(r) for r in m["referanslar"])) + "</div>")
        if m["seffaf_yedek"]:
            satirlar.append(f'<div class="meta"><b>Şeffaf yedek:</b> {e(m["seffaf_yedek"])}</div>')
        satirlar += [f'<div class="warn">UYARI: {e(u)}</div>' for u in m["uyari"]]
        p += [f'<section class="item" id="m{m["no"]}" data-ad="{e(m["indirme_adi"])}" data-grup="{m["grup"]}" '
              f'data-tasarim="{e(m["tasarim"])}">',
              f'<div class="head"><input type="checkbox" class="cb" aria-label="Bitti #{m["no"]}"><div>'
              f'<div><span class="no">#{m["no"]}</span><b>{e(m["baslik"])}</b>'
              + (" <i>(isteğe bağlı)</i>" if m["istege_bagli"] else "") + "</div>"
              f'<div class="meta">İndirme adı: <span class="fn">{e(m["indirme_adi"])}</span></div></div></div>',
              *satirlar,
              f"<pre>{e(m['prompt'] or '(prompt bulunamadı — prompt dosyasına bak)')}</pre>",
              '<div class="btns"><button type="button" class="kp primary">Prompt\'u kopyala</button>'
              '<button type="button" class="ka">Dosya adını kopyala</button>'
              '<button type="button" class="sorun-btn">Sorun</button></div>']
        if m["kontrol"]:
            p.append(f'<div class="kontrol">Kontrol: {e(m["kontrol"])}</div>')
        p.append("</section>")
    p += ["</main>", f"<script>{JS}</script>", "</body>", "</html>"]
    return "\n".join(p) + "\n"


def _md_satir(metin: str) -> str:
    t = html.escape(metin)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    return re.sub(r"`(.+?)`", r"<code>\1</code>", t)


def yaz() -> tuple[int, dict]:
    maddeler, notlar = is_listesi()
    (gb.KOK / CIKTI_MD).write_text(md_yaz(maddeler, notlar), encoding="utf-8")
    (gb.KOK / CIKTI_HTML).write_text(html_yaz(maddeler, notlar), encoding="utf-8")
    return len(maddeler), _sayim(maddeler)


def main(argv: list[str] | None = None) -> int:
    argv = sys.argv[1:] if argv is None else argv
    if "--json" in argv:
        print(json.dumps(is_listesi()[0], ensure_ascii=False, indent=1))
        return 0
    if "--yaz" in argv:
        n, say = yaz()
        print(f"{CIKTI_MD} + {CIKTI_HTML} yazıldı · {n} görsel · "
              + " · ".join(f"{g.upper()} {sum(say[g].values())}" for g in "abcd" if g in say))
        return 0
    maddeler, _ = is_listesi()
    say = _sayim(maddeler)
    for g in "abcd":
        if g in say:
            print(f"{GRUPLAR[g]}: {sum(say[g].values())}")
            for t, n in say[g].items():
                print(f"  {n:4d}  {t}")
    eksik_prompt = [m for m in maddeler if not m["prompt"]]
    print(f"toplam: {len(maddeler)} · prompt'u bulunamayan: {len(eksik_prompt)}")
    for m in eksik_prompt:
        print(f"  ! {m['hedef']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
