# 12_Tropical_Destination — palet varyantları GPT istemleri (G157)

**Durum (2026-10-17, G157):** 5 paletin hiçbir parçası için **GPT gerekmiyor** — `recolor.json`'daki her
`auto` parça algoritmayla boyandı ve inceleme sayfalarında (`V0x_*/review/contact_sheet.jpg`) gerçek ürün gibi duruyor;
`keep` parçalar her palette aynı.

Bir parça incelemede reddedilirse: `recolor.json` → `"recolor": "gpt"`, istem buraya yazılır (İngilizce; asıl parçanın
dosyası referans, aynı tuval boyutu / şeffaflık / kompozisyon, yalnız renk) ve kaydedilecek **tam yol**
`collections/12_Tropical_Destination/variants/V0x_<slug>/gpt/<parça>.png` olur; temanın `build_images.py` kesimi uygulanıp
`platform/themes/tropical-destination/img/variants/<slug>/` altına konur (docs/25 §2.4).
