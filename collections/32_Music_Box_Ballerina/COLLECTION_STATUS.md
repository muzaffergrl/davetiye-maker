# Koleksiyon 32 — Music Box Ballerina (çalışma adı)

**Durum:** `editable_draft` — platform teması tema standardında, **geçici katmanlarla** (GPT parçaları henüz yok).
Satış durumu `coming` (`platform/lib/marketing/config.ts`, fiyat `[PRICE]`); `live` için GPT parçaları + göz kontrolü +
onay gerekir. Tasarım özeti: `DESIGN_BRIEF.md`. Çalışma adı marka değildir.

| Parça | Durum |
|---|---|
| Website teması | `platform/themes/music-box-ballerina/` — tamam (G171); bütün görseller geçici (depodaki GPT kâğıt/saten/çerçeve/yaprak görsellerinden kırpma + tonlama); balerin yerinde düz bir yer tutucu |
| GPT PAKET 5 (iç kapak + ayna, saten kuyu, kutu önü, kapalı kapak, anahtar, balerin + 2 dönüş şeridi, kart, 3 yaprak, sayfa zemini, saten, web_hero) | bekliyor — `assets/gpt/GPT_PROMPTS.md`; bırak-çalıştır provası için `kuru_sekil.json` |
| GPT PAKET 2 (kurgu çift fotoğrafları) | bekliyor — demo bugün nötr yer tutucularla |
| GPT PAKET 6 (basılı davetiye ön/arka zemini, 1575×2175, 300 ppi; 5×7 ve A5 aynı zemini kullanır) | bekliyor — basılı davetiye bugün `composed` geçici düzen (pudra kâğıt + gül yaprağı); geçiş adımları GPT_PROMPTS.md PAKET 6 "Gelince" |
| Ses | katalogdaki Music Box parçası + açılış efektleri (yeni ses yok) |
| Demo | `/start/demo/music-box-ballerina` (yeni kodun çalıştığı ortamda); demo harita pini Saratoga Springs, NY |
| Etsy ilan metni | taslak — `package/listing/listing_v3.md` (yayımlanmadı, K41) |
| Etsy görselleri / alıcı rehberi | başlanmadı |

**Denenmedi:** gerçek telefon, Vercel yayını, gerçek alıcı fotoğrafları, yavaş ağ, seslerin kulakla dinlenmesi.

**Renk paletleri (G177, 2026-10-18):** 5 palet, hepsi `coming` (satışta, panelde, `/start`'ta görünmez; tasarım da `coming`):
`lilac-gold` Lilac & Gold; `powder-blue` Powder Blue & Gold; `sage-mint` Sage Mint & Gold; `champagne` Champagne & Gold; `peach-coral` Peach Coral & Gold. Kaynak `variants/recolor.json` + `variants/V0x_*/palette.json`; **yalnız CSS** ile kuruldu
(`variants.css` + `theme.json variants`) çünkü temanın bütün görsel parçaları geçici. Görsel zeminler (GPT parçaları) şimdilik
her palette asıl renkte. **GPT parçaları gelince görsel boyama yeniden çalıştırılmalı:** `recolor.json` aile çapalarını gerçek
parçalarda ölçülen renge güncelle, sonra
`python3 tools/recolor_parts.py build --design 32 && python3 tools/recolor_parts.py check --design 32` ve
`cd platform && npm run build && NODE_PATH=/opt/node22/lib/node_modules node scripts/variant-check.cjs --theme music-box-ballerina`;
contact sheet'lere bak (`variants/GPT_PROMPTS.md`).

