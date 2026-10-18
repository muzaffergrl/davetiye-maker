# Koleksiyon 29 — Celestial Observatory (çalışma adı)

**Durum:** `editable_draft` — platform teması tema standardında kuruldu (G168), ama tasarımın kendi GPT parçaları **yok**;
görseller geçici (başka tasarımların düz dokuları tonlandı, pirinç = 17'nin mührünün düz metal yüzeyi; çizim yok). Satış
durumu `coming` (`platform/lib/marketing/config.ts`); fiyat `[PRICE]`, onay entegratörde. Tasarım özeti: `DESIGN_BRIEF.md`.

| Parça | Durum |
|---|---|
| Website teması | `platform/themes/celestial-observatory/` — 5 sayfa, açılış (kubbe + yarık göğü + iki kapak yarısı + ışık + yıldızlar + takımyıldız + kart), planisfer fotoğraflar ve kadran süpürmesi, kaydırmayla dönen gök, teşekkür modu, G138/G127/G126/G144 |
| GPT PAKET 5 (gece göğü, harita kâğıdı, kubbe, yarık kapağı, yıldızlar, yıldız haritası, planisfer halkası, usturlap, ay evreleri, yörüngeler, kart, web_hero) | bekliyor — `assets/gpt/GPT_PROMPTS.md`; bırak-çalıştır provası GEÇTİ 14/16 (yalnız PAKET 6 elle) |
| GPT PAKET 2 örnek fotoğraflar (kurgu Celeste & Rowan) | bekliyor |
| GPT PAKET 6 basılı davetiye ön/arka | bekliyor; şimdilik geçici düzen (`lib/print/layouts.ts`, harita kâğıdı + gece göğü şeritleri, ~195 ppi) |
| Demo | `/start/demo/celestial-observatory` (demo harita pini Flagstaff, AZ) |
| Etsy ilan metni | taslak: `package/listing/listing_v3.md` (yayınlanmadı, K41; ilan görselleri/video GPT parçalarından sonra) |
| Alıcı rehberi (START HERE) | başlanmadı |

**Denenmedi:** gerçek telefon, Vercel yayını, gerçek alıcı fotoğrafları, GPT parçalarıyla görünüm.
Son kontrol: 2026-10-17 (G168).

## G175 — paket (GPT'siz kısım, 2026-10-17)

- START HERE: `package/customer/START_HERE.{md,pdf}` + `img/start_qr.{png,svg}` (yalnız `tools/make_qr.py`),
  açılış nesnesi `dome` / panel sekmesi `Dome`; `python3 tools/build_customer_guides.py --check --designs 29` yeşil.
  Başlat linki `/start?theme=celestial-observatory` yayından sonra çalışır (denenmedi).
- Etsy verisi: `package/listing/etsy_upload.json` — `ready_to_publish: false`; blocker: görseller, video, `coming` (K41),
  fiyat `[PRICE]`, yenileme. `python3 tools/etsy_upload.py --check --designs 29` yeşil. Etsy'ye hiçbir şey gönderilmedi.
- GPT ilan sahneleri (PAKET 3, #00FF00 ekranlar): `assets/gpt/GPT_PROMPTS.md` → `assets/gpt/mockups/` (bekliyor).

**GPT sonrası:** PAKET 5/2 parçaları tema `build_images.py` ile → PAKET 3 sahneleri `assets/gpt/mockups/`'a →
`tools/listing_kit.py` `THEMES`'e `Theme(id="celestial-observatory", no="29", …)` (köşe süsleri GPT dekordan) +
`tools/listing_editorial/opening_stills.json`'a açılış anları → `cd platform && npm run build` →
`python3 tools/listing_editorial.py --theme celestial-observatory --capture --video` (9 ilan görseli + `video.mp4`) → `listing_v3.md` §5
alt metinleri gerçek dosyalara göre → `python3 tools/listing_kit.py pdf --theme celestial-observatory` (ilan PDF'i) →
`python3 tools/etsy_upload.py --designs 29` + `--check --strict --designs 29`.

**Renk paletleri (G177, 2026-10-18):** 5 palet, hepsi `coming` (satışta, panelde, `/start`'ta görünmez; tasarım da `coming`):
`twilight-plum` Twilight Plum & Gold; `night-teal` Night Teal & Gold; `burgundy-night` Burgundy Night & Gold; `midnight-silver` Midnight & Silver; `forest-night` Forest Night & Brass. Kaynak `variants/recolor.json` + `variants/V0x_*/palette.json`; **yalnız CSS** ile kuruldu
(`variants.css` + `theme.json variants`) çünkü temanın bütün görsel parçaları geçici. Görsel zeminler (GPT parçaları) şimdilik
her palette asıl renkte. **GPT parçaları gelince görsel boyama yeniden çalıştırılmalı:** `recolor.json` aile çapalarını gerçek
parçalarda ölçülen renge güncelle, sonra
`python3 tools/recolor_parts.py build --design 29 && python3 tools/recolor_parts.py check --design 29` ve
`cd platform && npm run build && NODE_PATH=/opt/node22/lib/node_modules node scripts/variant-check.cjs --theme celestial-observatory`;
contact sheet'lere bak (`variants/GPT_PROMPTS.md`).

