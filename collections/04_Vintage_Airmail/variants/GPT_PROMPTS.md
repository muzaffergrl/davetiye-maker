# 04_Vintage_Airmail — palet varyantları GPT istemleri (G156)

**Durum (2026-10-17, G156):** 5 paletin (dusty-rose, sage-navy, terracotta, dusty-blue, lavender) hiçbir parçası için **GPT gerekmiyor** — `recolor.json`'daki
9 `auto` parça algoritmayla boyandı ve inceleme sayfalarında (`V0x_*/review/contact_sheet.jpg`) gerçek ürün gibi duruyor
(gözle bakıldı); 20 `keep` parça (doğal renkli çiçek/meyve/yaprak, nötr kağıt, metal, foto yer tutucuları — bkz. `why`)
her palette aynı.

Bir parça incelemede reddedilirse: `recolor.json` → `"recolor": "gpt"`, istem buraya yazılır (İngilizce; asıl parçanın
dosyası referans, aynı tuval boyutu / şeffaflık / kompozisyon, yalnız renk) ve kaydedilecek **tam yol**
`collections/04_Vintage_Airmail/variants/V0x_<slug>/gpt/<parça>.png` olur; temanın `build_images.py` kesimi uygulanıp
`platform/themes/vintage-airmail-love-letter/img/variants/<slug>/` altına konur (docs/25 §2.4).
