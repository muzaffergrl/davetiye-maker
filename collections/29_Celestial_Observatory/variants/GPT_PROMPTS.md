# 29_Celestial_Observatory — palet varyantları GPT istemleri (G177)

**Durum (2026-10-17, G177):** 5 palet (twilight-plum, night-teal, burgundy-night, midnight-silver, forest-night) şimdilik **yalnız CSS** ile kuruldu (`build --css-only`): temanın
bütün görsel parçaları **geçici** (başka tasarımların GPT piksellerinden kesilip tonlandı; tasarımın kendi PAKET 5 parçaları
`assets/gpt/GPT_PROMPTS.md`'de bekliyor). Geçici parça boyanmadı; bu yüzden şu an **hiçbir palet için GPT istemi yok** —
boyanacak gerçek parça yok. `recolor.json`'da 6 parça `auto` (gelecek GPT parçası boyanacak), 2 parça `keep`
(foto yer tutucusu / fotoğraf).

GPT parçaları gelince (docs/25 §2.3–2.4): `recolor.json` aile çapaları gerçek parçalarda ölçülen medyan renge güncellenir,
`python3 tools/recolor_parts.py build --design 29` (görsellerle) çalıştırılır ve `V0x_*/review/contact_sheet.jpg`'ye
bakılır. Bir parça incelemede reddedilirse: `recolor.json` (ya da yalnız o palette `palette.json` → `"recolor"`) →
`"gpt"`, istem buraya yazılır (İngilizce; asıl GPT parçası referans, aynı tuval boyutu / şeffaflık / kompozisyon, yalnız
renk) ve kaydedilecek **tam yol** `collections/29_Celestial_Observatory/variants/V0x_<slug>/gpt/<parça>.png` olur; temanın
`build_images.py` kesimi uygulanıp `platform/themes/celestial-observatory/img/variants/<slug>/` altına konur.
