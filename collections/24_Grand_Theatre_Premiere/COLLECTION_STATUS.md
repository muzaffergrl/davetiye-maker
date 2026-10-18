# Koleksiyon 24 — Grand Theatre Premiere (çalışma adı)

**Durum:** `editable_draft` — platform teması tema standardında, **geçici parçalarla** (GPT parçaları yok). Satış durumu
`coming` (`platform/lib/marketing/config.ts`, fiyat `[PRICE]`); `live` için GPT parçaları + göz kontrolü + onay gerekir.
Tasarım özeti: `DESIGN_BRIEF.md`. Görev: `gorevler/G162-grand-theatre.md`.

| Parça | Durum |
|---|---|
| Website teması | `platform/themes/grand-theatre-premiere/` — çalışıyor; sahne katmanları 06 kadife + 21 kâğıt dokularından tonlanmış geçici kesim |
| GPT PAKET 5 (kemer, perde kanatları ×4, sahne içi, program kartı, kadife/kâğıt karoları, bilet koçanı, salon, püskül, web_hero) | bekliyor — `assets/gpt/GPT_PROMPTS.md` |
| PAKET 2 örnek fotoğraflar (kurgu çift) | bekliyor |
| PAKET 6 basılı davetiye zeminleri (5×7, A5) | bekliyor; şimdilik composed düzen (kâğıt + kadife bantları) |
| Demo | `/start/demo/grand-theatre-premiere` (yeni kodun çalıştığı ortamda) |
| Etsy ilan metni | taslak `package/listing/listing_v3.md` (yayımlanmadı, K41); görsel, video, START HERE yok |

**Denenmedi:** gerçek telefon, Vercel yayını, gerçek alıcı fotoğrafları, Safari'de sayfa çevirme geçişi.

## G175 — paket (GPT'siz kısım, 2026-10-17)

- START HERE: `package/customer/START_HERE.{md,pdf}` + `img/start_qr.{png,svg}` (yalnız `tools/make_qr.py`),
  açılış nesnesi `curtain` / panel sekmesi `Curtain`; `python3 tools/build_customer_guides.py --check --designs 24` yeşil.
  Başlat linki `/start?theme=grand-theatre-premiere` yayından sonra çalışır (denenmedi).
- Etsy verisi: `package/listing/etsy_upload.json` — `ready_to_publish: false`; blocker: görseller, video, `coming` (K41),
  fiyat `[PRICE]`, yenileme. `python3 tools/etsy_upload.py --check --designs 24` yeşil. Etsy'ye hiçbir şey gönderilmedi.
- GPT ilan sahneleri (PAKET 3, #00FF00 ekranlar): `assets/gpt/GPT_PROMPTS.md` → `assets/gpt/mockups/` (bekliyor).

**GPT sonrası:** PAKET 5/2 parçaları tema `build_images.py` ile → PAKET 3 sahneleri `assets/gpt/mockups/`'a →
`tools/listing_kit.py` `THEMES`'e `Theme(id="grand-theatre-premiere", no="24", …)` (köşe süsleri GPT dekordan) +
`tools/listing_editorial/opening_stills.json`'a açılış anları → `cd platform && npm run build` →
`python3 tools/listing_editorial.py --theme grand-theatre-premiere --capture --video` (9 ilan görseli + `video.mp4`) → `listing_v3.md` §5
alt metinleri gerçek dosyalara göre → `python3 tools/listing_kit.py pdf --theme grand-theatre-premiere` (ilan PDF'i) →
`python3 tools/etsy_upload.py --designs 24` + `--check --strict --designs 24`.

**Renk paletleri (G177, 2026-10-18):** 5 palet, hepsi `coming` (satışta, panelde, `/start`'ta görünmez; tasarım da `coming`):
`crimson-velvet` Crimson Velvet & Gold; `royal-sapphire` Royal Sapphire & Gold; `emerald-velvet` Emerald Velvet & Gold; `plum-velvet` Plum Velvet & Gold; `onyx-gold` Black Tie Onyx & Gold. Kaynak `variants/recolor.json` + `variants/V0x_*/palette.json`; **yalnız CSS** ile kuruldu
(`variants.css` + `theme.json variants`) çünkü temanın bütün görsel parçaları geçici. Görsel zeminler (GPT parçaları) şimdilik
her palette asıl renkte. **GPT parçaları gelince görsel boyama yeniden çalıştırılmalı:** `recolor.json` aile çapalarını gerçek
parçalarda ölçülen renge güncelle, sonra
`python3 tools/recolor_parts.py build --design 24 && python3 tools/recolor_parts.py check --design 24` ve
`cd platform && npm run build && NODE_PATH=/opt/node22/lib/node_modules node scripts/variant-check.cjs --theme grand-theatre-premiere`;
contact sheet'lere bak (`variants/GPT_PROMPTS.md`).

