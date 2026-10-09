"""Renk varyantı için palette.json ve GPT_PROMPTS.md üretir (kalıp T1 · Envelope Story).

Kullanım:
  python3 tools/variant_prompts.py            # PALETTES içindeki V02+ varyantların hepsini yazar
  python3 tools/variant_prompts.py V03        # yalnız bir varyant

Çıktı: collections/02_Dusty_Blue/variants/<id>/palette.json ve assets/gpt/GPT_PROMPTS.md
Standart: docs/07_KIT_STANDARDI.md. Örnek fotoğraflar ortaktır (V01 Paket 2), burada üretilmez.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE = ROOT / "collections/02_Dusty_Blue/variants"

PALETTES = [
    {
        "id": "V01_dusty_blue", "name": "Dusty Blue & Champagne",
        "ink": "#2B3A4E", "deep": "#4E6782", "primary": "#6E88A3",
        "mist_top": "#DDE5EC", "mist_bottom": "#B7C6D4",
        "gold": "#B8996A", "gold_light": "#D9C49E", "ivory": "#FBF7EF", "leaf": "#9AAE9F",
        "prompt": {}  # V01 prompt'ları elle yazıldı: collections/02_Dusty_Blue/assets/gpt/GPT_PROMPTS.md
    },
    {
        "id": "V02_blush_champagne", "name": "Blush & Champagne",
        "ink": "#3E2C2E", "deep": "#A86F72", "primary": "#D8A7A7",
        "mist_top": "#F3E4E1", "mist_bottom": "#E2C6C2",
        "gold": "#C9A96E", "gold_light": "#E3CFA6", "ivory": "#FBF7F2", "leaf": "#A7B5A0",
        "prompt": {
            "mist": "soft misty blush pink",
            "liner_bg": "soft blush pink", "liner_bg_hex": "#E2B9B6",
            "wax": "blush pink wax", "wax_shadow": "deeper dusty rose",
            "botanical": "sage-green eucalyptus, soft blush garden roses, small white blossoms, and delicate champagne-gold fern sprigs",
            "spray": "one slender sage eucalyptus branch, two tiny blush blossoms and a champagne-gold fern sprig",
            "ribbon": "a blush pink silk ribbon", "envelope": "a blush pink envelope",
        },
    },
    {
        "id": "V03_terracotta_cream", "name": "Terracotta & Cream",
        "ink": "#3A2A22", "deep": "#8E4A36", "primary": "#C1694F",
        "mist_top": "#EFE3D6", "mist_bottom": "#DCC3AE",
        "gold": "#C29A5B", "gold_light": "#DFC497", "ivory": "#FAF5EC", "leaf": "#8C9A6E",
        "prompt": {
            "mist": "warm misty cream-to-sand",
            "liner_bg": "warm terracotta", "liner_bg_hex": "#C7785F",
            "wax": "terracotta wax", "wax_shadow": "deeper burnt sienna",
            "botanical": "dried olive-green eucalyptus, burnt-orange and cream garden roses, soft pampas grass plumes, and delicate champagne-gold fern sprigs",
            "spray": "one slender dried eucalyptus branch, a small pampas plume, a tiny cream rose and a champagne-gold fern sprig",
            "ribbon": "a terracotta silk ribbon", "envelope": "a terracotta envelope",
        },
    },
    {
        "id": "V04_navy_gold", "name": "Navy & Gold",
        "ink": "#1E2C47", "deep": "#2E4266", "primary": "#3B5279",
        "mist_top": "#E3E7EE", "mist_bottom": "#BCC6D6",
        "gold": "#C5A059", "gold_light": "#E0C78F", "ivory": "#FBF8F1", "leaf": "#8FA59A",
        "prompt": {
            "mist": "cool misty pale navy-grey",
            "liner_bg": "deep navy blue", "liner_bg_hex": "#2E4266",
            "wax": "deep navy blue wax", "wax_shadow": "almost midnight navy",
            "botanical": "silver-dollar eucalyptus, white garden roses, small white blossoms, a few deep navy berries, and delicate gold fern sprigs",
            "spray": "one slender eucalyptus branch, two tiny white blossoms, a few navy berries and a gold fern sprig",
            "ribbon": "a navy blue silk ribbon", "envelope": "a navy blue envelope",
        },
    },
    {
        "id": "V05_burgundy_blush", "name": "Burgundy & Blush",
        "ink": "#3D1C22", "deep": "#7A2E3A", "primary": "#8E3B48",
        "mist_top": "#F1E1E0", "mist_bottom": "#DDBDBD",
        "gold": "#BF9A62", "gold_light": "#DCC398", "ivory": "#FBF6F1", "leaf": "#8E9C86",
        "prompt": {
            "mist": "soft misty blush",
            "liner_bg": "rich burgundy", "liner_bg_hex": "#7A2E3A",
            "wax": "burgundy wax", "wax_shadow": "deeper wine red",
            "botanical": "muted green eucalyptus, burgundy dahlias, soft blush garden roses, small white blossoms, and delicate champagne-gold fern sprigs",
            "spray": "one slender eucalyptus branch, a tiny burgundy bud, a blush blossom and a champagne-gold fern sprig",
            "ribbon": "a burgundy silk ribbon", "envelope": "a burgundy envelope",
        },
    },
    {
        "id": "V06_lavender_silver", "name": "Lavender & Silver",
        "ink": "#2F2A3D", "deep": "#6F6390", "primary": "#A89BC4",
        "mist_top": "#ECE8F3", "mist_bottom": "#D3CCE2",
        "gold": "#A9A9B3", "gold_light": "#CFCFD6", "ivory": "#FBF9F6", "leaf": "#9AA89F",
        "prompt": {
            "mist": "soft misty lavender",
            "liner_bg": "soft lavender", "liner_bg_hex": "#B5A9CF",
            "wax": "lavender wax", "wax_shadow": "deeper muted purple",
            "botanical": "silver-green eucalyptus, lavender sprigs, soft lilac and white garden roses, small white blossoms, and delicate silver fern sprigs",
            "spray": "one slender eucalyptus branch, a lavender sprig, a tiny white blossom and a silver fern sprig",
            "ribbon": "a lavender silk ribbon", "envelope": "a lavender envelope",
        },
    },
]

TEMPLATE = """# GPT görsel istekleri — Kalıp T1 · {name} ({id})

> **Instructions for GPT:** Generate every image in Package 1, then Package 3, in order. Use each
> English prompt exactly as written, follow its checklist, and save each file with the exact file
> name and folder shown under "Kaydet". No text, letters, logos or watermarks in any image.

Bu dosya bu renk kitinin prompt'larının **tek kaynağıdır**. Üretildi: `tools/variant_prompts.py`
(elle düzenleme yerine palet/şablonu değiştirip yeniden üret). Standart: `docs/07_KIT_STANDARDI.md`.
Görev: `gorevler/` içindeki `{id}` görevi. Örnek fotoğraflar ortaktır (V01 Paket 2) — burada yok.

## Nereye?
- Repo `muzaffergrl/davetiye-maker`, dal `main`
- Klasör: `{folder}/assets/gpt/` altındaki `textures/`, `decor/`, `mockups/`
- Commit mesajı: `GPT görselleri: {id} Paket 1` (veya `Paket 3`)
- Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya yükleme işi verme.

## Renkler
ink `{ink}` · deep `{deep}` · primary `{primary}` · ivory `{ivory}` · gold `{gold}` · leaf `{leaf}`

---

## PAKET 1 — Dokular ve dekor

### 1.1 Fildişi kağıt dokusu
**Kaydet:** `{folder}/assets/gpt/textures/ivory_paper.png` · Kare (1024×1024)

```
Seamless tileable texture of premium ivory cotton paper, color close to {ivory}, subtle natural fibers and very soft grain, evenly lit from the top, no shadows, no vignette, no folds, no objects, no text. Flat top-down scan look, high detail, square.
```
Kontrol: düz ve eşit ışık; kenarlarda koyulaşma yok; yazı yok.

### 1.2 Zarf iç astarı deseni
**Kaydet:** `{folder}/assets/gpt/textures/envelope_liner.png` · Kare (1024×1024)

```
Seamless tileable envelope liner pattern for a classic wedding invitation: {liner_bg} background ({liner_bg_hex}) with a delicate {gold_word} ({gold_light}) botanical damask of small eucalyptus leaves and tiny five-petal blossoms, printed-on-paper look with faint paper grain, elegant and not busy, evenly lit, flat top-down, no text, no logos.
```
Kontrol: desen kenarlardan kesintisiz devam ediyor gibi; çok kalabalık değil.

### 1.3 Video arka planı
**Kaydet:** `{folder}/assets/gpt/textures/background_mist.png` · Dikey (1024×1536)

```
Vertical background for a romantic wedding invitation video: {mist} gradient ({mist_top} at the top to {mist_bottom} at the bottom) with very gentle out-of-focus bokeh light circles and a faint fine paper grain. Calm, airy, elegant. Completely empty in the middle — no objects, no flowers, no text. Even soft light.
```
Kontrol: ortası boş; çiçek veya nesne yok.

### 1.4 Mum mühür (harfsiz)
**Kaydet:** `{folder}/assets/gpt/decor/wax_seal_blank.png` · Kare (1024×1024) · **Şeffaf zemin**

```
A single realistic wax seal viewed straight from above, {wax} ({primary} with {wax_shadow} {deep} shadows), organic irregular poured edge, a smooth flat circular pressed center with a thin raised ring around it, and a tiny embossed eucalyptus-leaf wreath around the ring. The center must be completely EMPTY and smooth — no letters, no monogram, no symbols. Soft natural light from the top-left, subtle glossy highlights. Centered with generous empty space around it. Transparent background PNG.
```
Kontrol: **ortada harf yok**; zemin gerçekten şeffaf; mühür tam ortalı ve kesilmemiş.

### 1.5 Büyük köşe çiçek kümesi
**Kaydet:** `{folder}/assets/gpt/decor/botanical_corner.png` · Kare (1024×1024) · **Şeffaf zemin**

```
Watercolor-and-gouache style botanical corner arrangement for a classic romantic wedding invitation: {botanical}. The arrangement grows from the TOP-LEFT corner and fans diagonally toward the center, leaving the bottom-right two thirds of the square empty. Refined, airy, not crowded. Transparent background PNG, no text.
```
Kontrol: sol üst köşeden başlıyor; sağ alt boş; zemin şeffaf.

### 1.6 Küçük yatay dal (ayırıcı)
**Kaydet:** `{folder}/assets/gpt/decor/botanical_spray.png` · Yatay (1536×1024) · **Şeffaf zemin**

```
A small horizontal botanical spray in the same watercolor-and-gouache style: {spray}, lying horizontally and centered, about 70% of the image width, lots of empty space around it. Transparent background PNG, no text.
```
Kontrol: 1.5 ile aynı stil ve renkler; yatay ve ortalı.

---

## PAKET 3 — Etsy ilan mockup'ları

Ekran ve kart yüzeyleri **düz yeşil (#00FF00)** olacak; tasarım oraya yerleştirilecek.

### 3.1 Telefon mockup'ı
**Kaydet:** `{folder}/assets/gpt/mockups/phone_flatlay.png` · Dikey (1024×1536)

```
Bright airy flat-lay photo from directly above: a modern smartphone lying perfectly straight (not tilted, not rotated) in the center on an ivory linen tablecloth, surrounded at the edges by {flowers_short}, {ribbon} and a few {gold_word} accents. The phone screen is a perfectly flat, uniform pure green (#00FF00) with no reflections, no glare and no icons. Soft natural daylight, gentle shadows, no text, no logos, no brand marks on the phone.
```

### 3.2 Dizüstü mockup'ı
**Kaydet:** `{folder}/assets/gpt/mockups/laptop_desk.png` · Yatay (1536×1024)

```
Elegant styled desk scene: an open modern laptop seen straight from the front at eye level, centered, on a light oak desk with a small vase of {flowers_short} and a linen notebook. The laptop screen is a perfectly flat, uniform pure green (#00FF00) with no reflections and no glare. Soft natural window light, airy and bright, no text, no logos, no brand marks.
```

### 3.3 Basılı kart mockup'ı
**Kaydet:** `{folder}/assets/gpt/mockups/card_flatlay.png` · Dikey (1024×1536)

```
Bright flat-lay photo from directly above: a single blank 5x7 portrait invitation card lying perfectly straight in the center, its face is a perfectly flat, uniform pure green (#00FF00) with crisp edges, resting on {envelope} with an ivory linen background, {flowers_short} at the edges, {ribbon}. Soft natural daylight, gentle shadows, no text, no logos.
```

Kontrol (mockup'lar): yeşil alan tamamen düz ve tek renk; telefon, laptop ve kart düz duruyor.
"""


def write(p):
    folder = f"collections/02_Dusty_Blue/variants/{p['id']}"
    out = ROOT / folder
    (out / "assets/gpt").mkdir(parents=True, exist_ok=True)
    for sub in ("textures", "decor", "mockups"):
        d = out / "assets/gpt" / sub
        d.mkdir(exist_ok=True)
        (d / ".gitkeep").touch()
    pal = {k: v for k, v in p.items() if k != "prompt"}
    (out / "palette.json").write_text(json.dumps(pal, indent=2, ensure_ascii=False) + "\n")
    pr = p["prompt"]
    gold_word = "silver" if "silver" in p["name"].lower() else "champagne-gold"
    flowers_short = pr["botanical"].split(", and")[0]
    text = TEMPLATE.format(folder=folder, gold_word=gold_word, flowers_short=flowers_short,
                           **pal, **pr)
    (out / "assets/gpt/GPT_PROMPTS.md").write_text(text)
    print("yazıldı:", folder)


def main(args):
    for p in PALETTES:
        if not p["prompt"]:
            continue
        if args and not any(p["id"].startswith(a) for a in args):
            continue
        write(p)


if __name__ == "__main__":
    main(sys.argv[1:])
