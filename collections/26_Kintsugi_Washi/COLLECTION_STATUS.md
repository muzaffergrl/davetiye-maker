# Koleksiyon 26 — Kintsugi & Washi (çalışma adı)

**Durum:** `editable_draft` — platform teması tema standardında kuruldu (G164), ama tasarımın kendi GPT parçaları **yok**;
görseller geçici (başka tasarımların düz kâğıt dokuları tonlandı, çizim yok). Satış durumu `coming`
(`platform/lib/marketing/config.ts`); fiyat `[PRICE]`, onay entegratörde. Tasarım özeti: `DESIGN_BRIEF.md`.

| Parça | Durum |
|---|---|
| Website teması | `platform/themes/kintsugi-washi/` — 5 sayfa, açılış (kuşak + 4 kat + kart), mürekkep maskesi, teşekkür modu, G138/G127/G126/G144 |
| GPT PAKET 5 (washi, iç washi, pirinç kâğıdı, kintsugi damarları, mürekkep lekesi, fırça darbesi, varak pulları, kuşak, kart, web_hero) | bekliyor — `assets/gpt/GPT_PROMPTS.md` |
| GPT PAKET 2 örnek fotoğraflar (kurgu Naomi & Kai) | bekliyor |
| GPT PAKET 6 basılı davetiye ön/arka | bekliyor; şimdilik geçici düzen (`lib/print/layouts.ts`, pirinç kâğıdı + çivit şeritler, ~195 ppi) |
| Demo | `/start/demo/kintsugi-washi` |
| Etsy ilan metni | taslak: `package/listing/listing_v3.md` (yayınlanmadı, K41; ilan görselleri/video GPT parçalarından sonra) |
| Alıcı rehberi (START HERE) | başlanmadı |

**Denenmedi:** gerçek telefon, Vercel yayını, gerçek alıcı fotoğrafları, GPT parçalarıyla görünüm.
Son kontrol: 2026-10-17 (G164).

**Renk paletleri (G177, 2026-10-18):** 5 palet, hepsi `coming` (satışta, panelde, `/start`'ta görünmez; tasarım da `coming`):
`sumi-charcoal` Sumi Charcoal & Gold; `moss-green` Moss Green & Gold; `plum-gold` Plum & Gold; `deep-teal` Deep Teal & Gold; `lacquer-red` Lacquer Red & Gold. Kaynak `variants/recolor.json` + `variants/V0x_*/palette.json`; **yalnız CSS** ile kuruldu
(`variants.css` + `theme.json variants`) çünkü temanın bütün görsel parçaları geçici. Görsel zeminler (GPT parçaları) şimdilik
her palette asıl renkte. **GPT parçaları gelince görsel boyama yeniden çalıştırılmalı:** `recolor.json` aile çapalarını gerçek
parçalarda ölçülen renge güncelle, sonra
`python3 tools/recolor_parts.py build --design 26 && python3 tools/recolor_parts.py check --design 26` ve
`cd platform && npm run build && NODE_PATH=/opt/node22/lib/node_modules node scripts/variant-check.cjs --theme kintsugi-washi`;
contact sheet'lere bak (`variants/GPT_PROMPTS.md`).

