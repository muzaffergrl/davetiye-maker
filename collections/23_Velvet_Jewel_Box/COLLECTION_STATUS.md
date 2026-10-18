# Koleksiyon 23 — Velvet Jewel Box (çalışma adı)

**Durum:** `editable_draft` — platform teması tema standardında, kutu ve dekor **geçici** parçalarla (GPT parçaları
bekleniyor). Satış durumu `coming` (`platform/lib/marketing/config.ts`, fiyat `[PRICE]`). Görev: G161.
Tasarım özeti: `DESIGN_BRIEF.md`. Çalışma adı marka değildir.

| Parça | Durum |
|---|---|
| Website teması | `platform/themes/velvet-jewel-box/` — çalışıyor; kutu/fiyonk/kart/zeminler başka koleksiyonların GPT dokularından tonlanmış geçici parçalar |
| GPT W2 parçaları (kutu kapalı/açık, fiyonk, kart, kadife zemin, saten zemin, ayırıcı, inci, web_hero) | bekliyor — `assets/gpt/GPT_PROMPTS.md` PAKET 5 |
| PAKET 2 örnek fotoğrafları | bekliyor — PAKET 2 (demo şu an yer tutucu gösteriyor) |
| Basılı davetiye (G139) | geçici composed düzen (kadife + fiyonk); PAKET 6 zeminleri bekliyor |
| Demo | `/start/demo/velvet-jewel-box` (yeni kodun çalıştığı ortamda; yayında değil) |
| Etsy ilan metni | taslak: `package/listing/listing_v3.md` (yayınlanmadı, K41); görsel/video/START HERE yok |

**Denenmedi:** gerçek telefon, Vercel yayını, gerçek GPT kutusu, gerçek alıcı fotoğrafları.
Son kontrol: 2026-10-17 (G161).

## G175 — paket (GPT'siz kısım, 2026-10-17)

- START HERE: `package/customer/START_HERE.{md,pdf}` + `img/start_qr.{png,svg}` (yalnız `tools/make_qr.py`),
  açılış nesnesi `box` / panel sekmesi `Box`; `python3 tools/build_customer_guides.py --check --designs 23` yeşil.
  Başlat linki `/start?theme=velvet-jewel-box` yayından sonra çalışır (denenmedi).
- Etsy verisi: `package/listing/etsy_upload.json` — `ready_to_publish: false`; blocker: görseller, video, `coming` (K41),
  fiyat `[PRICE]`, yenileme. `python3 tools/etsy_upload.py --check --designs 23` yeşil. Etsy'ye hiçbir şey gönderilmedi.
- GPT ilan sahneleri (PAKET 3, #00FF00 ekranlar): `assets/gpt/GPT_PROMPTS.md` → `assets/gpt/mockups/` (bekliyor).

**GPT sonrası:** PAKET 5/2 parçaları tema `build_images.py` ile → PAKET 3 sahneleri `assets/gpt/mockups/`'a →
`tools/listing_kit.py` `THEMES`'e `Theme(id="velvet-jewel-box", no="23", …)` (köşe süsleri GPT dekordan) +
`tools/listing_editorial/opening_stills.json`'a açılış anları → `cd platform && npm run build` →
`python3 tools/listing_editorial.py --theme velvet-jewel-box --capture --video` (9 ilan görseli + `video.mp4`) → `listing_v3.md` §5
alt metinleri gerçek dosyalara göre → `python3 tools/listing_kit.py pdf --theme velvet-jewel-box` (ilan PDF'i) →
`python3 tools/etsy_upload.py --designs 23` + `--check --strict --designs 23`.

