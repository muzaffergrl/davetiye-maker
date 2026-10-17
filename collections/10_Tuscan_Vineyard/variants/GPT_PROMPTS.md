# 10_Tuscan_Vineyard — palet varyantları GPT istemleri (G157)

**Durum (2026-10-17, G157):** 5 paletin hiçbir parçası için **GPT gerekmiyor** — `recolor.json`'daki her `auto` parça
algoritmayla boyandı ve inceleme sayfalarında (`V0x_*/review/contact_sheet.jpg`) gerçek ürün gibi duruyor: zarf astarı, kart çizgileri/çerçeveleri, kraft kapaktaki asma bandı ve (plum/rosé paletlerinde) üzüm salkımları boyandı; kraft, parşömen, gün batımı manzarası, meşe, yapraklar, mantar düğme aynı.

Bir parça incelemede reddedilirse: `recolor.json` → `"recolor": "gpt"`, istem buraya yazılır (İngilizce; asıl parçanın
dosyası referans, aynı tuval boyutu / şeffaflık / kompozisyon, yalnız renk) ve kaydedilecek **tam yol**
`collections/10_Tuscan_Vineyard/variants/V0x_<slug>/gpt/<parça>.png` olur; temanın `build_images.py` kesimi uygulanıp
`platform/themes/tuscan-vineyard/img/variants/<slug>/` altına konur (docs/25 §2.4).
