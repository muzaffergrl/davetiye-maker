# Koleksiyon 22 — Nocturne Lake Estate (çalışma adı)

**Durum:** `functional_pilot` (geçici zarf parçalarıyla) — platform teması tema standardında (G142: theme-check `--stress`
0 hata, final-smoke 45/45, g051 44/44). Satış durumu `coming`; fiyat ve onay entegratörde.
Tasarım özeti: `DESIGN_BRIEF.md`. Çalışma adı marka değildir.

| Parça | Durum |
|---|---|
| Website teması | `platform/themes/nocturne-lake-estate/` — tamam; zarf parçaları tek kapalı zarftan kesildi (geçici) |
| GPT W2 parçaları (zarf kapalı/açık, mühür, kart, zemin, accent, ayırıcı, web_hero) | bekliyor — `assets/gpt/GPT_PROMPTS.md` |
| PAKET 2 fotoğrafları | bekliyor — `assets/gpt/GPT_PROMPTS.md` |
| Demo | `/start/demo/nocturne-lake-estate` (yeni kodun çalıştığı ortamda) |
| Etsy ilan paketi / alıcı rehberi | başlanmadı |

**Denenmedi:** gerçek telefon, Vercel yayını, gerçek alıcı fotoğrafları.

**Renk paletleri (G177, 2026-10-18):** 5 palet, hepsi `coming` (satışta, panelde, `/start`'ta görünmez; tasarım da `coming`):
`midnight-navy` Midnight Navy & Champagne; `emerald-night` Emerald Night & Gold; `burgundy-noir` Burgundy Noir & Gold; `moonlit-silver` Moonlit Silver; `plum-rose-gold` Plum Night & Rose Gold. Kaynak `variants/recolor.json` + `variants/V0x_*/palette.json`; **yalnız CSS** ile kuruldu
(`variants.css` + `theme.json variants`) çünkü temanın bütün görsel parçaları geçici. Görsel zeminler (GPT parçaları) şimdilik
her palette asıl renkte. **GPT parçaları gelince görsel boyama yeniden çalıştırılmalı:** `recolor.json` aile çapalarını gerçek
parçalarda ölçülen renge güncelle, sonra
`python3 tools/recolor_parts.py build --design 22 && python3 tools/recolor_parts.py check --design 22` ve
`cd platform && npm run build && NODE_PATH=/opt/node22/lib/node_modules node scripts/variant-check.cjs --theme nocturne-lake-estate`;
contact sheet'lere bak (`variants/GPT_PROMPTS.md`).

