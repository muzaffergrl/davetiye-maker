# Koleksiyon 31 — Sky Lantern Festival (çalışma adı)

**Durum:** `editable_draft` — platform teması tema standardında, GPT parçaları gelmeden **geçici** katmanlarla kuruldu (G170).
Satış durumu **`coming`** (`platform/lib/marketing/config.ts`; fiyat `[PRICE]`). GPT parçaları gelip yerleşince ve göz
kontrolünden sonra `live` kararı entegratörde. Tasarım özeti: `DESIGN_BRIEF.md`.

| Parça | Durum |
|---|---|
| Website teması | `platform/themes/sky-lantern-festival/` — 5 sayfa + teşekkür modu; gök/sayfa zemini/fener/uzak fener/kart başka koleksiyonların GPT görsellerinden kesilip tonlandı (geçici, çizim yok); avuçlar, yıldız tozu, paspartu, yatay çerçeve, ayırıcı yalnız GPT ile görünür |
| GPT PAKET 5 (avuçlar, sönük + yanan fener, alacakaranlık göğü, yıldız tozu, uzak fener, kart, doku, pirinç kâğıdı paspartu, yatay çerçeve, ayırıcı, web_hero) | bekliyor — `assets/gpt/GPT_PROMPTS.md` |
| GPT PAKET 2 (kurgu çift Sophie & Daniel, 5 foto) | bekliyor — `assets/gpt/GPT_PROMPTS.md` |
| GPT PAKET 6 (basılı davetiye ön/arka, 5×7 + A5, 300 ppi) | bekliyor; şimdilik `composed` düzen (`platform/lib/print/layouts.ts`: 18'in pamuk kâğıdı + temanın gök bandı ve feneri) |
| Demo | `/start/demo/sky-lantern-festival` (yeni kodun çalıştığı ortamda; misafire kapalı — `coming`) |
| Etsy ilan metni | taslak `package/listing/listing_v3.md` (K41: yayımlanmadı; ekran görüntüleri gerçek parçalardan sonra) |
| Alıcı rehberi (START HERE) | başlanmadı |

**Denenmedi:** gerçek iPhone/Android, Vercel yayını, gerçek alıcı fotoğrafları, yavaş ağ, GPT parçalarıyla görünüm. Son kontrol:
2026-10-17 (G170).

**Renk paletleri (G177, 2026-10-18):** 5 palet, hepsi `coming` (satışta, panelde, `/start`'ta görünmez; tasarım da `coming`):
`midnight-blue` Midnight Blue & Amber; `twilight-rose` Twilight Rose & Gold; `deep-teal` Deep Teal Dusk & Amber; `evergreen-night` Evergreen Night & Amber; `moonlit-slate` Moonlit Slate & Gold. Kaynak `variants/recolor.json` + `variants/V0x_*/palette.json`; **yalnız CSS** ile kuruldu
(`variants.css` + `theme.json variants`) çünkü temanın bütün görsel parçaları geçici. Görsel zeminler (GPT parçaları) şimdilik
her palette asıl renkte. **GPT parçaları gelince görsel boyama yeniden çalıştırılmalı:** `recolor.json` aile çapalarını gerçek
parçalarda ölçülen renge güncelle, sonra
`python3 tools/recolor_parts.py build --design 31 && python3 tools/recolor_parts.py check --design 31` ve
`cd platform && npm run build && NODE_PATH=/opt/node22/lib/node_modules node scripts/variant-check.cjs --theme sky-lantern-festival`;
contact sheet'lere bak (`variants/GPT_PROMPTS.md`).

