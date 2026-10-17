# 17_Emerald_Gold_Estate — palet varyantları GPT istemleri (G158)

**Durum (2026-10-17, G158):** 5 paletin hiçbir parçası için **GPT gerekmiyor** — `recolor.json`'daki her `auto`
parça algoritmayla boyandı ve inceleme sayfalarında (`V0x_*/review/contact_sheet.jpg`) gerçek ürün gibi duruyor;
`keep` parçalar (kağıt, metal, nötr parçalar, foto yer tutucuları) her palette aynı.

Bir parça incelemede reddedilirse: `recolor.json` (ya da yalnız o palet için `palette.json` → `"recolor": {"<parça>": "gpt"}`),
istem buraya yazılır (İngilizce; asıl parçanın kaynak PNG'si referans, aynı tuval boyutu / şeffaflık / kompozisyon, yalnız
renk) ve kaydedilecek **tam yol** `collections/17_Emerald_Gold_Estate/variants/V0x_<slug>/gpt/<kaynak>.png` olur; temanın
`build_images.py` kesimi uygulanıp `platform/themes/<tema>/img/variants/<slug>/` altına konur (docs/25 §2.4).
