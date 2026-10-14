"""PAKET 3'ü "Etsy ilan sahneleri"ne çevirir (2026-10-14; kullanıcı: ilan görselleri çok daha etkileyici, GPT tasarlasın).

Eski PAKET 3'ün 3.1 telefon prompt'undaki zemin ve süsleri ("... on <zemin>, surrounded at the edges by <süsler>. The phone")
ve dosya başındaki "Renk dünyası" satırını okur; 01/03 pilotuyla (G801/G803) aynı 5 sahnelik bölümü yazar ve G8NN görev
dosyasını yeniden tanımlar. Bölüm zaten sahneyse dokunmaz.

  python3 tools/paket3_sahne.py --no 02 04 05          # yaz
  python3 tools/paket3_sahne.py --no 02 --dry-run      # yalnız göster
"""
import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ESKI = re.compile(r"in the center on (?P<zemin>.+?), surrounded at the edges by (?P<sus>.+?)\. The phone", re.S)
RENK = re.compile(r"^- Renk dünyası:\s*(.+)$", re.M)
ADLAR = {"02": "Dusty Blue & Champagne"}  # G802 görev dosyası yoktu (02 pilotu G013)

COMMON = ("Photorealistic high-end wedding stationery product photography, natural soft daylight from the top-left, "
          "shallow depth of field, editorial and luxurious, color world: {palette}. "
          "Every phone is a generic modern smartphone with thin even bezels and rounded corners, no logo, no brand marks, no camera bump visible from the front. "
          "Every screen is a perfectly flat, uniform, opaque pure green (#00FF00): no reflections, no glare, no gradient, no icons, no status bar, no notch content. "
          "All four corners of every screen are fully visible: no finger, prop, petal or ribbon covers any part of a screen. "
          "No text, letters, numbers, logos or watermarks anywhere in the image.")


def bolum(d: dict) -> str:
    c = COMMON.format(**d)
    k = d["dir"] + "/assets/gpt/mockups/"
    return f"""## PAKET 3 — Etsy ilan sahneleri (görev {d['task']}; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)

> Yeni (2026-10-14): kullanıcı ilan görsellerinin çok daha etkileyici ve profesyonel olmasını istedi. Bu sahneler ilan
> görsellerinin zeminidir. Ekranlar **düz #00FF00**; Claude gerçek site ekranlarını perspektifle oraya yerleştirir
> (`tools/mockup_compose.py`), yazıları kendisi dizer. Telefon eğik durabilir; yeter ki ekranın **dört köşesi görünsün**.
> Hepsini **tek sohbette** üret; aynı masa, aynı ışık, aynı süsler. Kaydet satırındaki `N ekran` = görselde beklenen yeşil ekran sayısı.
> Üreten: `python3 tools/paket3_sahne.py --no {d['no']}` (pilot: 01/03, G801/G803).

**Instructions for GPT (send before the first image):**
```
You are the photographer and set stylist for the Etsy listing photos of a digital wedding website design called "{d['name']}". Every image in this chat is a real-looking styled product photo built around phones and a laptop whose screens are flat pure green (#00FF00); we will place the real website screens into the green areas afterwards. Keep one consistent set across all images: {d['surface']}, {d['props']}, the same light and the same color world ({d['palette']}). Aim for best-selling, magazine-quality Etsy listing photos: rich, airy, luxurious, never cluttered, never cheap stock-photo looking.
```

### 3.1 Kapak — elde telefon
**Kaydet:** `{k}cover_hand.png` · 1024×1024 · 1 ekran

```
A woman's elegant hand with natural manicured nails and a delicate gold ring holds a smartphone upright in the lower half of the frame (the top of the phone no higher than 40% from the top edge), the phone turned very slightly (about 10 degrees) toward the viewer, its screen facing the camera. Fingers hold only the sides and back of the phone. Behind it, softly out of focus, a styled table with {d['surface']} and {d['props']}. The upper 35% of the image is calm, soft, out-of-focus background with no objects, kept free for a headline. {c}
```
Kontrol: tek yeşil ekran; dört köşe görünüyor, parmak ekranda değil; telefon alt yarıda, üst %35 sakin ve boş; yazı/logo yok.

### 3.2 Üç telefon — sayfalar
**Kaydet:** `{k}three_phones.png` · 1536×1024 · 3 ekran

```
Three identical smartphones stand upright side by side on {d['surface']}, seen from the front at a slightly low eye level: the middle phone a little forward and larger, the two side phones slightly behind it, with clear space between them so they never overlap. Around their bases and at the edges of the frame: {d['props']}. The phones fill about 70% of the image width and stand in the middle band of the image. {c}
```
Kontrol: tam 3 yeşil ekran; telefonlar üst üste binmiyor; her ekranın dört köşesi görünüyor; yazı/logo yok.

### 3.3 Dizüstü + telefon
**Kaydet:** `{k}laptop_phone.png` · 1536×1024 · 2 ekran

```
An open modern laptop seen from the front at eye level stands slightly left of center on {d['surface']}, and a smartphone stands upright to its right on a small stand, both screens facing the camera. Around them: {d['props']}, arranged loosely at the edges. Generous calm space above the laptop. {c}
```
Kontrol: tam 2 yeşil ekran (dizüstü + telefon); dört köşe görünüyor; laptopta logo yok; yazı yok.

### 3.4 Masa üstü — yukarıdan
**Kaydet:** `{k}flatlay_phone.png` · 1024×1024 · 1 ekran

```
Flat-lay photo from directly above: a smartphone lies on {d['surface']}, slightly right of center and rotated about 8 degrees, surrounded at the edges by {d['props']}. The left third of the image is calm, empty surface kept free for text. {c}
```
Kontrol: tek yeşil ekran; sol üçte bir boş; süsler kenarlarda; yazı/logo yok.

### 3.5 Telefonda düzenleme — yaşam sahnesi
**Kaydet:** `{k}hand_phone_edit.png` · 1024×1024 · 1 ekran

```
A cozy lifestyle close-up: two hands hold a smartphone in portrait orientation at a comfortable reading angle, the screen facing the camera; one thumb rests at the very edge of the phone frame, never on the screen. The person sits on {d['sofa']}; a small arrangement of {d['props']} is softly blurred in the background. Warm, relaxed, happy planning mood; the person's face is not visible. {c}
```
Kontrol: tek yeşil ekran; başparmak ekranın dışında; yüz görünmüyor; yazı/logo yok.
"""


def gorev(d: dict, gunluk: str) -> str:
    return f"""---
id: {d['task']}
baslik: Tasarım {d['no']} {d['name']} — Etsy ilan sahneleri (Paket 3: 5 fotoğraf gerçekliğinde sahne, ekranlar #00FF00)
rol: gpt-gorsel
durum: hazir
alan:
oncelik: 2
bagimli: []
yazar: [{d['dir']}/assets/gpt/mockups/]
---

## Amaç
Kullanıcı (2026-10-14): ilan görselleri "çok daha etkileyici, çok daha profesyonel" olmalı; GPT tasarlasın. Bu görev ilan
görsellerinin **fotoğraf sahnelerini** üretir: elde telefon (kapak), üç telefon, dizüstü + telefon, masa üstü, telefonda
düzenleme. Ekranlar düz `#00FF00`; Claude gerçek site ekranlarını perspektifle yerleştirir ve yazıları dizer (G065 düzeni).
Pilot: 01/03 (G801/G803).

## Girdiler
- `{d['dir']}/assets/gpt/GPT_PROMPTS.md` → **PAKET 3** (talimat bloğu + 3.1–3.5)
- Tasarımın renk ve süs dünyası için: aynı dosyanın PAKET 5'i ve `{d['dir']}/assets/gpt/comps/`

## Yapılacaklar
1. Tek sohbet (5 görsel). Önce PAKET 3'teki "Instructions for GPT" bloğunu gönder, sonra 3.1–3.5'i sırayla, kelimesi kelimesine.
2. Her ekran **düz, opak, saf #00FF00**; dört köşesi görünür; parmak, yaprak, kurdele ekrana binmez. Telefon/laptopta logo yok.
   Yazı/harf/logo hiçbir yerde yok.
3. Beğenmediğini yeniden üret (`_v2`, `_v3`); seçtiğin sade adla kalır. Ek önizleme/rapor dosyası üretme.
4. Ara kayıt: 3 sahnede bir commit + push. Kontrol: `python3 tools/kit_check.py {d['dir']} --paket 3`.

## Bitti sayılması için
- [ ] 5 sahne doğru yolda; `kit_check --paket 3` 5/5 geçti
- [ ] Sonuç'ta yeniden üretilenler ve emin olunmayan noktalar

## Sonuç

## Günlük
{gunluk}- 2026-10-14 yeniden tanımlandı: telefon/laptop mockup'ı yerine 5 ilan sahnesi (`tools/paket3_sahne.py`; pilot G801/G803)
"""


def isle(no: str, dry: bool):
    kol = next((p for p in (ROOT / "collections").glob(f"{no}_*") if p.is_dir()), None)
    if not kol:
        sys.exit(f"{no}: koleksiyon yok")
    pr = kol / "assets/gpt/GPT_PROMPTS.md"
    t = pr.read_text(encoding="utf-8")
    i = t.index("## PAKET 3")
    m = re.search(r"^## (?!PAKET 3)", t[i + 5:], re.M)
    j = i + 5 + m.start() if m else len(t)
    eski = t[i:j]
    if "Etsy ilan sahneleri" in eski:
        print(f"{no}: zaten sahne — atlandı")
        return
    e = ESKI.search(eski)
    r = RENK.search(t)
    if not e or not r:
        sys.exit(f"{no}: eski 3.1 zemin/süs ya da Renk dünyası okunamadı")
    task = f"G8{no}"
    tf = next((ROOT / "gorevler").glob(f"{task}-*.md"), None)
    if tf:
        tt = tf.read_text(encoding="utf-8")
        ad = re.search(r"^baslik: Tasarım \d+ (.+?) —", tt, re.M).group(1)
        gun = tt[tt.index("## Günlük") + len("## Günlük\n"):] if "## Günlük" in tt else ""
    else:
        ad = ADLAR.get(no) or kol.name.split("_", 1)[1].replace("_", " ")
        tf = ROOT / "gorevler" / f"{task}-mockup.md"
        gun = ""
    palet = r.group(1).strip()
    ana = re.split(r",| and ", palet)[0].strip()
    d = dict(no=no, task=task, name=ad, dir=str(kol.relative_to(ROOT)), surface=" ".join(e.group("zemin").split()),
             props=" ".join(e.group("sus").split()), palette=palet,
             sofa=f"a cream linen sofa with a {ana} cushion and a ceramic coffee cup")
    yeni = t[:i] + bolum(d) + ("\n---\n\n" if m else "") + t[j:]
    if dry:
        print(f"{no}: {ad} · zemin={d['surface']!r} · süs={d['props']!r} · palet={palet!r} → {tf.name}")
        return
    pr.write_text(yeni, encoding="utf-8")
    tf.write_text(gorev(d, gun if gun.endswith("\n") or not gun else gun + "\n"), encoding="utf-8")
    print(f"{no}: yazıldı ({pr.relative_to(ROOT)}, {tf.relative_to(ROOT)})")


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--no", nargs="+", required=True, help="tasarım numaraları, ör. 02 04 05")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args(argv)
    for no in a.no:
        isle(no.zfill(2), a.dry_run)


if __name__ == "__main__":
    main()
