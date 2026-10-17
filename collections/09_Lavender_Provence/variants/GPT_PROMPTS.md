# 09_Lavender_Provence — palet varyantları GPT istemleri (G157)

**Durum (2026-10-17, G157):** 5 paletin hiçbir parçası için **GPT gerekmiyor** — `recolor.json`'daki her `auto` parça
algoritmayla boyandı ve inceleme sayfalarında (`V0x_*/review/contact_sheet.jpg`) gerçek ürün gibi duruyor: lavanta dalları ve leylak kağıt zemin (+ foto yer tutucuları, og) boyandı; buğday, papatya, kekik, keten kese, jüt ip, fildişi tırtıklı kağıt aynı.

Bir parça incelemede reddedilirse: `recolor.json` → `"recolor": "gpt"`, istem buraya yazılır (İngilizce; asıl parçanın
dosyası referans, aynı tuval boyutu / şeffaflık / kompozisyon, yalnız renk) ve kaydedilecek **tam yol**
`collections/09_Lavender_Provence/variants/V0x_<slug>/gpt/<parça>.png` olur; temanın `build_images.py` kesimi uygulanıp
`platform/themes/lavender-provence/img/variants/<slug>/` altına konur (docs/25 §2.4).
