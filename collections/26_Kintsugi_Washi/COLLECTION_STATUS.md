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

## G175 — paket (GPT'siz kısım, 2026-10-17)

- START HERE: `package/customer/START_HERE.{md,pdf}` + `img/start_qr.{png,svg}` (yalnız `tools/make_qr.py`),
  açılış nesnesi `origami` / panel sekmesi `Origami`; `python3 tools/build_customer_guides.py --check --designs 26` yeşil.
  Başlat linki `/start?theme=kintsugi-washi` yayından sonra çalışır (denenmedi).
- Etsy verisi: `package/listing/etsy_upload.json` — `ready_to_publish: false`; blocker: görseller, video, `coming` (K41),
  fiyat `[PRICE]`, yenileme. `python3 tools/etsy_upload.py --check --designs 26` yeşil. Etsy'ye hiçbir şey gönderilmedi.
- GPT ilan sahneleri (PAKET 3, #00FF00 ekranlar): `assets/gpt/GPT_PROMPTS.md` → `assets/gpt/mockups/` (bekliyor).

**GPT sonrası:** PAKET 5/2 parçaları tema `build_images.py` ile → PAKET 3 sahneleri `assets/gpt/mockups/`'a →
`tools/listing_kit.py` `THEMES`'e `Theme(id="kintsugi-washi", no="26", …)` (köşe süsleri GPT dekordan) +
`tools/listing_editorial/opening_stills.json`'a açılış anları → `cd platform && npm run build` →
`python3 tools/listing_editorial.py --theme kintsugi-washi --capture --video` (9 ilan görseli + `video.mp4`) → `listing_v3.md` §5
alt metinleri gerçek dosyalara göre → `python3 tools/listing_kit.py pdf --theme kintsugi-washi` (ilan PDF'i) →
`python3 tools/etsy_upload.py --designs 26` + `--check --strict --designs 26`.

