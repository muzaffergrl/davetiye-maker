# Koleksiyon 30 — Azulejo Mosaic (çalışma adı)

**Durum:** `editable_draft` — platform teması tema standardında kuruldu (G169), ama tasarımın kendi GPT parçaları **yok**;
görseller geçici (çiniler 05'in boyalı bordüründen kesildi, zeminler 05/18'in düz dokularından tonlandı; çizim yok). Satış
durumu `coming` (`platform/lib/marketing/config.ts`); fiyat `[PRICE]`, onay entegratörde. Tasarım özeti: `DESIGN_BRIEF.md`.

| Parça | Durum |
|---|---|
| Website teması | `platform/themes/azulejo-mosaic/` — 5 sayfa, çini dalgası açılışı (24 ayrı çini + kart), foto mozaikleri, teşekkür modu, G138/G127/G126/G144 |
| GPT PAKET 5 (4 çini, çini sırtı, kobalt duvar, badana, kart kâğıdı, friz, saksılar, web_hero) | bekliyor — `assets/gpt/GPT_PROMPTS.md` |
| GPT PAKET 2 örnek fotoğraflar (kurgu Inês & Mateo) | bekliyor |
| GPT PAKET 6 basılı davetiye ön/arka (1819×2551, 5×7 + A5 300 ppi) | bekliyor; şimdilik geçici düzen (`lib/print/layouts.ts`, pamuk kâğıdı + çini sıraları) |
| Demo | `/start/demo/azulejo-mosaic` (yerel build; yayın yok) |
| Etsy ilan metni | taslak: `package/listing/listing_v3.md` (yayınlanmadı, K41; görseller/video GPT parçalarından sonra) |
| Alıcı rehberi (START HERE) | başlanmadı |

**Denenmedi:** gerçek telefon, Vercel yayını, gerçek alıcı fotoğrafları, GPT parçalarıyla görünüm.
Son kontrol: 2026-10-17 (G169).

## G175 — paket (GPT'siz kısım, 2026-10-17)

- START HERE: `package/customer/START_HERE.{md,pdf}` + `img/start_qr.{png,svg}` (yalnız `tools/make_qr.py`),
  açılış nesnesi `wall` / panel sekmesi `Wall`; `python3 tools/build_customer_guides.py --check --designs 30` yeşil.
  Başlat linki `/start?theme=azulejo-mosaic` yayından sonra çalışır (denenmedi).
- Etsy verisi: `package/listing/etsy_upload.json` — `ready_to_publish: false`; blocker: görseller, video, `coming` (K41),
  fiyat `[PRICE]`, yenileme. `python3 tools/etsy_upload.py --check --designs 30` yeşil. Etsy'ye hiçbir şey gönderilmedi.
- GPT ilan sahneleri (PAKET 3, #00FF00 ekranlar): `assets/gpt/GPT_PROMPTS.md` → `assets/gpt/mockups/` (bekliyor).

**GPT sonrası:** PAKET 5/2 parçaları tema `build_images.py` ile → PAKET 3 sahneleri `assets/gpt/mockups/`'a →
`tools/listing_kit.py` `THEMES`'e `Theme(id="azulejo-mosaic", no="30", …)` (köşe süsleri GPT dekordan) +
`tools/listing_editorial/opening_stills.json`'a açılış anları → `cd platform && npm run build` →
`python3 tools/listing_editorial.py --theme azulejo-mosaic --capture --video` (9 ilan görseli + `video.mp4`) → `listing_v3.md` §5
alt metinleri gerçek dosyalara göre → `python3 tools/listing_kit.py pdf --theme azulejo-mosaic` (ilan PDF'i) →
`python3 tools/etsy_upload.py --designs 30` + `--check --strict --designs 30`.

**Renk paletleri (G177, 2026-10-18):** 5 palet, hepsi `coming` (satışta, panelde, `/start`'ta görünmez; tasarım da `coming`):
`manganese-violet` Manganese Violet & Terracotta; `copper-green` Copper Green & Ochre; `teal-glaze` Teal Glaze & Terracotta; `wine-ochre` Wine Glaze & Ochre; `slate-blue` Slate Blue & Terracotta. Kaynak `variants/recolor.json` + `variants/V0x_*/palette.json`; **yalnız CSS** ile kuruldu
(`variants.css` + `theme.json variants`) çünkü temanın bütün görsel parçaları geçici. Görsel zeminler (GPT parçaları) şimdilik
her palette asıl renkte. **GPT parçaları gelince görsel boyama yeniden çalıştırılmalı:** `recolor.json` aile çapalarını gerçek
parçalarda ölçülen renge güncelle, sonra
`python3 tools/recolor_parts.py build --design 30 && python3 tools/recolor_parts.py check --design 30` ve
`cd platform && npm run build && NODE_PATH=/opt/node22/lib/node_modules node scripts/variant-check.cjs --theme azulejo-mosaic`;
contact sheet'lere bak (`variants/GPT_PROMPTS.md`).

