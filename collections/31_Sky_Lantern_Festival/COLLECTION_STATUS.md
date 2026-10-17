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

## G175 — paket (GPT'siz kısım, 2026-10-17)

- START HERE: `package/customer/START_HERE.{md,pdf}` + `img/start_qr.{png,svg}` (yalnız `tools/make_qr.py`),
  açılış nesnesi `lantern` / panel sekmesi `Lantern`; `python3 tools/build_customer_guides.py --check --designs 31` yeşil.
  Başlat linki `/start?theme=sky-lantern-festival` yayından sonra çalışır (denenmedi).
- Etsy verisi: `package/listing/etsy_upload.json` — `ready_to_publish: false`; blocker: görseller, video, `coming` (K41),
  fiyat `[PRICE]`, yenileme. `python3 tools/etsy_upload.py --check --designs 31` yeşil. Etsy'ye hiçbir şey gönderilmedi.
- GPT ilan sahneleri (PAKET 3, #00FF00 ekranlar): `assets/gpt/GPT_PROMPTS.md` → `assets/gpt/mockups/` (bekliyor).

**GPT sonrası:** PAKET 5/2 parçaları tema `build_images.py` ile → PAKET 3 sahneleri `assets/gpt/mockups/`'a →
`tools/listing_kit.py` `THEMES`'e `Theme(id="sky-lantern-festival", no="31", …)` (köşe süsleri GPT dekordan) +
`tools/listing_editorial/opening_stills.json`'a açılış anları → `cd platform && npm run build` →
`python3 tools/listing_editorial.py --theme sky-lantern-festival --capture --video` (9 ilan görseli + `video.mp4`) → `listing_v3.md` §5
alt metinleri gerçek dosyalara göre → `python3 tools/listing_kit.py pdf --theme sky-lantern-festival` (ilan PDF'i) →
`python3 tools/etsy_upload.py --designs 31` + `--check --strict --designs 31`.

