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
| Etsy ilan paketi / alıcı rehberi | ilan metni + START HERE + Etsy verisi: G175 (aşağıda); görseller/video GPT sonrası |

**Denenmedi:** gerçek telefon, Vercel yayını, gerçek alıcı fotoğrafları.

## G175 — paket (GPT'siz kısım, 2026-10-17)

- `package/listing/listing_v3.md` yazıldı (G175, ilk ilan metni). START HERE: `package/customer/START_HERE.{md,pdf}` + `img/start_qr.{png,svg}` (yalnız `tools/make_qr.py`),
  açılış nesnesi `envelope` / panel sekmesi `Envelope`; `python3 tools/build_customer_guides.py --check --designs 22` yeşil.
  Başlat linki `/start?theme=nocturne-lake-estate` yayından sonra çalışır (denenmedi).
- Etsy verisi: `package/listing/etsy_upload.json` — `ready_to_publish: false`; blocker: görseller, video, `coming` (K41),
  fiyat `[PRICE]`, yenileme. `python3 tools/etsy_upload.py --check --designs 22` yeşil. Etsy'ye hiçbir şey gönderilmedi.
- GPT ilan sahneleri (PAKET 3, #00FF00 ekranlar): `assets/gpt/GPT_PROMPTS.md` → `assets/gpt/mockups/` (bekliyor).

**GPT sonrası:** PAKET 5/2 parçaları tema `build_images.py` ile → PAKET 3 sahneleri `assets/gpt/mockups/`'a →
`tools/listing_kit.py` `THEMES`'e `Theme(id="nocturne-lake-estate", no="22", …)` (köşe süsleri GPT dekordan) +
`tools/listing_editorial/opening_stills.json`'a açılış anları → `cd platform && npm run build` →
`python3 tools/listing_editorial.py --theme nocturne-lake-estate --capture --video` (9 ilan görseli + `video.mp4`) → `listing_v3.md` §5
alt metinleri gerçek dosyalara göre → `python3 tools/listing_kit.py pdf --theme nocturne-lake-estate` (ilan PDF'i) →
`python3 tools/etsy_upload.py --designs 22` + `--check --strict --designs 22`.

**Renk paletleri (G177, 2026-10-18):** 5 palet, hepsi `coming` (satışta, panelde, `/start`'ta görünmez; tasarım da `coming`):
`midnight-navy` Midnight Navy & Champagne; `emerald-night` Emerald Night & Gold; `burgundy-noir` Burgundy Noir & Gold; `moonlit-silver` Moonlit Silver; `plum-rose-gold` Plum Night & Rose Gold. Kaynak `variants/recolor.json` + `variants/V0x_*/palette.json`; **yalnız CSS** ile kuruldu
(`variants.css` + `theme.json variants`) çünkü temanın bütün görsel parçaları geçici. Görsel zeminler (GPT parçaları) şimdilik
her palette asıl renkte. **GPT parçaları gelince görsel boyama yeniden çalıştırılmalı:** `recolor.json` aile çapalarını gerçek
parçalarda ölçülen renge güncelle, sonra
`python3 tools/recolor_parts.py build --design 22 && python3 tools/recolor_parts.py check --design 22` ve
`cd platform && npm run build && NODE_PATH=/opt/node22/lib/node_modules node scripts/variant-check.cjs --theme nocturne-lake-estate`;
contact sheet'lere bak (`variants/GPT_PROMPTS.md`).

