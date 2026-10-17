# 01_Olive_Ivory — palet varyantları GPT istemleri (G153)

**Durum (2026-10-17, G153):** 5 pilot paletin hiçbir parçası için **GPT gerekmiyor** — `recolor.json`'daki her
`auto` parça algoritmayla boyandı ve inceleme sayfalarında (`V0x_*/review/contact_sheet.jpg`) gerçek ürün gibi duruyor;
`keep` parçalar (fildişi kağıt, foto yer tutucuları, metal altın mühür, nötr çiçekler) her palette aynı.

Bir parça incelemede reddedilirse: `recolor.json` → `"recolor": "gpt"`, istem buraya yazılır (İngilizce; asıl parçanın
dosyası referans, aynı tuval boyutu / şeffaflık / kompozisyon, yalnız renk) ve kaydedilecek **tam yol**
`collections/01_Olive_Ivory/variants/V0x_<slug>/gpt/<parça>.png` olur; temanın `build_images.py` kesimi uygulanıp
`platform/themes/<tema>/img/variants/<slug>/` altına konur (docs/25 §2.4).
