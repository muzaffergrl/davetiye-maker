# Koleksiyon 27 — Riad Lantern Nights (çalışma adı)

**Durum:** `editable_draft` — platform teması tema standardında, GPT parçaları gelmeden **geçici** katmanlarla kuruldu (G165).
Satış durumu **`coming`** (`platform/lib/marketing/config.ts`; fiyat `[PRICE]`). GPT parçaları gelip yerleşince ve göz
kontrolünden sonra `live` kararı entegratörde. Tasarım özeti: `DESIGN_BRIEF.md`.

| Parça | Durum |
|---|---|
| Website teması | `platform/themes/riad-lantern-nights/` — 5 sayfa + teşekkür modu; kapılar/avlu/kart/duvar/çiniler başka koleksiyonların GPT görsellerinden kesilip tonlandı (geçici, çizim yok) |
| GPT PAKET 5 (kapılar, kapı çerçevesi, avlu, kart, fener, zemin, doku, 4 zellige, kemer çerçeve, yatay çerçeve, bougainvillea ×2, ayırıcı, accent, web_hero) | bekliyor — `assets/gpt/GPT_PROMPTS.md` |
| GPT PAKET 2 (kurgu çift Leila & Adrian, 5 foto) | bekliyor — `assets/gpt/GPT_PROMPTS.md` |
| GPT PAKET 6 (basılı davetiye ön/arka, 5×7 + A5, 300 ppi) | bekliyor; şimdilik `composed` düzen (`platform/lib/print/layouts.ts`: 05'in fildişi sıvası + temanın çinileri) |
| Demo | `/start/demo/riad-lantern-nights` (yeni kodun çalıştığı ortamda; misafire kapalı — `coming`) |
| Etsy ilan metni | taslak `package/listing/listing_v3.md` (K41: yayımlanmadı; ekran görüntüleri gerçek parçalardan sonra) |
| Alıcı rehberi (START HERE) | başlanmadı |

**Denenmedi:** gerçek iPhone/Android, Vercel yayını, gerçek alıcı fotoğrafları, yavaş ağ. Son kontrol: 2026-10-17 (G165).

**Renk paletleri (G177, 2026-10-18):** 5 palet, hepsi `coming` (satışta, panelde, `/start`'ta görünmez; tasarım da `coming`):
`midnight-indigo` Midnight Indigo & Saffron; `emerald-garden` Emerald Garden & Brass; `rose-clay` Rose Clay & Brass; `aubergine` Aubergine & Saffron; `olive-grove` Olive Grove & Brass. Kaynak `variants/recolor.json` + `variants/V0x_*/palette.json`; **yalnız CSS** ile kuruldu
(`variants.css` + `theme.json variants`) çünkü temanın bütün görsel parçaları geçici. Görsel zeminler (GPT parçaları) şimdilik
her palette asıl renkte. **GPT parçaları gelince görsel boyama yeniden çalıştırılmalı:** `recolor.json` aile çapalarını gerçek
parçalarda ölçülen renge güncelle, sonra
`python3 tools/recolor_parts.py build --design 27 && python3 tools/recolor_parts.py check --design 27` ve
`cd platform && npm run build && NODE_PATH=/opt/node22/lib/node_modules node scripts/variant-check.cjs --theme riad-lantern-nights`;
contact sheet'lere bak (`variants/GPT_PROMPTS.md`).

