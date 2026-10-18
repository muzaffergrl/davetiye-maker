# Koleksiyon 28 — Maison Pâtisserie (çalışma adı)

**Durum:** `editable_draft` — platform teması tema standardında, **geçici katmanlarla** (GPT parçaları henüz yok).
Satış durumu `coming` (`platform/lib/marketing/config.ts`, fiyat `[PRICE]`); `live` için GPT parçaları + göz kontrolü +
onay gerekir. Tasarım özeti: `DESIGN_BRIEF.md`. Çalışma adı marka değildir.

| Parça | Durum |
|---|---|
| Website teması | `platform/themes/maison-patisserie/` — tamam (G166); bütün görseller geçici (depodaki GPT kâğıt/saten/fiyonk görsellerinden kırpma + tonlama) |
| GPT PAKET 5 (kutu, kapak, kurdele, fiyonk ×3, ipek kâğıt ×2, kart, zemin, karo, raf, şeker inci, web_hero; makaron/tül ertelendi — G167) | bekliyor — `assets/gpt/GPT_PROMPTS.md`; bırak-çalıştır provası GEÇTİ (G167, `kuru_sekil.json`) |
| GPT PAKET 2 (kurgu çift fotoğrafları) | bekliyor — demo bugün nötr yer tutucularla |
| GPT PAKET 6 (basılı davetiye ön/arka zemini, tek çift, 1575×2175, 300 ppi; 5×7 ve A5 aynı zemini kullanır — G167) | bekliyor — basılı davetiye bugün `composed` geçici düzen (krem kâğıt + fiyonk); geçiş adımları GPT_PROMPTS.md PAKET 6 "Gelince" |
| Demo | `/start/demo/maison-patisserie` (yeni kodun çalıştığı ortamda); demo harita pini yok (`lib/claim/demo-map.ts` görev alanı dışı) |
| Etsy ilan metni | taslak — `package/listing/listing_v3.md` (yayımlanmadı, K41) |
| Etsy görselleri / alıcı rehberi | başlanmadı |

**Denenmedi:** gerçek telefon, Vercel yayını, gerçek alıcı fotoğrafları, yavaş ağ.

**Renk paletleri (G177, 2026-10-18):** 5 palet, hepsi `coming` (satışta, panelde, `/start`'ta görünmez; tasarım da `coming`):
`lavender-macaron` Lavender & Rose; `blush-pistachio` Blush & Pistachio; `mint-mocha` Mint & Mocha; `lemon-raspberry` Lemon & Raspberry; `powder-blue` Powder Blue & Rose. Kaynak `variants/recolor.json` + `variants/V0x_*/palette.json`; **yalnız CSS** ile kuruldu
(`variants.css` + `theme.json variants`) çünkü temanın bütün görsel parçaları geçici. Görsel zeminler (GPT parçaları) şimdilik
her palette asıl renkte. **GPT parçaları gelince görsel boyama yeniden çalıştırılmalı:** `recolor.json` aile çapalarını gerçek
parçalarda ölçülen renge güncelle, sonra
`python3 tools/recolor_parts.py build --design 28 && python3 tools/recolor_parts.py check --design 28` ve
`cd platform && npm run build && NODE_PATH=/opt/node22/lib/node_modules node scripts/variant-check.cjs --theme maison-patisserie`;
contact sheet'lere bak (`variants/GPT_PROMPTS.md`).

