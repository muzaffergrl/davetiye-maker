# 21 Crimson Rose Atelier — palet varyantları GPT istemleri (G153)

**Durum (2026-10-17, G153):** 5 pilot palet (midnight-navy, plum-gold, dusty-rose, emerald-ruby, terracotta-rust) için
**GPT parçası gerekmiyor** — gül dalı, zarf (kapalı/açık), og görseli ve baskı dalı algoritmayla boyandı ve inceleme
sayfalarında (`V0x_*/review/contact_sheet.jpg`) gerçek ürün gibi duruyor. Altın mühür, kağıt, foto yer tutucuları ve demo
fotoğrafları aynı kalır (fotoğraf boyanmaz; demo fotoğraflarındaki kırmızı güller her palette görünür — alıcı kendi
fotoğrafını koyar).

**Denenip reddedilen:** kırmızı gülü **beyaz/fildişi**, **mavi** ya da **turuncu** güle çevirmek (lekeli, sahte). Bir
"Ivory Rose" paleti istenirse gül dalı GPT'den gelir:

## İstem — fildişi güller (yalnız istenirse)

> 2026-10-20: üretildi ve uygun (referans gibi şeffaf); palet istenmediği için yerleştirilmedi —
> `docs/qa/2026-10-20-generated-visuals/beklemede/`. Palet istenirse oradan alınır.

Kaydedilecek dosya (tam yol): `collections/21_Crimson_Rose_Atelier/variants/V07_ivory_rose/gpt/rose-branch.png` — şeffaf arka plan (referans gibi)
(yeni palet klasörü + `palette.json` ile; sonra `recolor.json` → `"rose-branch": {"recolor": "gpt"}` ve dosya
`platform/themes/crimson-rose-atelier/img/variants/ivory-rose/rose-branch.webp` olarak `build_images.py`'nin aynı kesimiyle
konur).

```
Photorealistic botanical illustration of a branch of three fully open IVORY / soft cream garden roses with dark green
rose leaves and a few small buds, painted in exactly the same style, lighting, angle and composition as the reference
image (a diagonal branch of three red roses running from lower left to upper right). Keep the same size and position of
every rose and leaf; only the petal colour changes to natural ivory-white with warm cream shadows (no pink, no yellow
cast). Transparent background (PNG, alpha), no shadow on the ground, no text, no frame. Canvas 1374 × 1145 px.
Reference: collections/21_Crimson_Rose_Atelier/assets/gpt/decor/rose-branch.png
```
