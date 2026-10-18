# Koleksiyon 27 — Riad Lantern Nights (çalışma adı)

**Durum:** `editable_draft` — platform teması tema standardında, GPT parçaları gelmeden **geçici** katmanlarla kuruldu (G165).
Satış durumu **`coming`** (`platform/lib/marketing/config.ts`; fiyat `[PRICE]`). GPT parçaları gelip yerleşince ve göz
kontrolünden sonra `live` kararı entegratörde. Tasarım özeti: `DESIGN_BRIEF.md`.

| Parça | Durum |
|---|---|
| Website teması | `platform/themes/riad-lantern-nights/` — 5 sayfa + teşekkür modu; kapılar/avlu/kart/duvar/çiniler başka koleksiyonların GPT görsellerinden kesilip tonlandı (geçici, çizim yok) |
| GPT PAKET 5 (kapılar, kapı çerçevesi, avlu, kart, fener, zemin, doku, 4 zellige, kemer çerçeve, yatay çerçeve, bougainvillea ×2, ayırıcı, accent, web_hero) | bekliyor — `assets/gpt/GPT_PROMPTS.md` |
| GPT PAKET 2 (kurgu çift Leila & Adrian, 5 foto) | bekliyor — `assets/gpt/GPT_PROMPTS.md` |
| GPT PAKET 6 (basılı davetiye ön/arka, 5×7 + A5, 300 ppi) | bekliyor; şimdilik `composed` düzen (`platform/lib/print/layouts.ts`: 05'in fildişi sıvası + temanın çinileri) |
| Demo | `/start/demo/riad-lantern-nights` (yeni kodun çalıştığı ortamda; misafire kapalı — `coming`) |
| Etsy ilan metni | taslak `package/listing/listing_v3.md` (K41: yayımlanmadı; ekran görüntüleri gerçek parçalardan sonra) |
| Alıcı rehberi (START HERE) | başlanmadı |

**Denenmedi:** gerçek iPhone/Android, Vercel yayını, gerçek alıcı fotoğrafları, yavaş ağ. Son kontrol: 2026-10-17 (G165).

## G175 — paket (GPT'siz kısım, 2026-10-17)

- START HERE: `package/customer/START_HERE.{md,pdf}` + `img/start_qr.{png,svg}` (yalnız `tools/make_qr.py`),
  açılış nesnesi `door` / panel sekmesi `Door`; `python3 tools/build_customer_guides.py --check --designs 27` yeşil.
  Başlat linki `/start?theme=riad-lantern-nights` yayından sonra çalışır (denenmedi).
- Etsy verisi: `package/listing/etsy_upload.json` — `ready_to_publish: false`; blocker: görseller, video, `coming` (K41),
  fiyat `[PRICE]`, yenileme. `python3 tools/etsy_upload.py --check --designs 27` yeşil. Etsy'ye hiçbir şey gönderilmedi.
- GPT ilan sahneleri (PAKET 3, #00FF00 ekranlar): `assets/gpt/GPT_PROMPTS.md` → `assets/gpt/mockups/` (bekliyor).

**GPT sonrası:** PAKET 5/2 parçaları tema `build_images.py` ile → PAKET 3 sahneleri `assets/gpt/mockups/`'a →
`tools/listing_kit.py` `THEMES`'e `Theme(id="riad-lantern-nights", no="27", …)` (köşe süsleri GPT dekordan) +
`tools/listing_editorial/opening_stills.json`'a açılış anları → `cd platform && npm run build` →
`python3 tools/listing_editorial.py --theme riad-lantern-nights --capture --video` (9 ilan görseli + `video.mp4`) → `listing_v3.md` §5
alt metinleri gerçek dosyalara göre → `python3 tools/listing_kit.py pdf --theme riad-lantern-nights` (ilan PDF'i) →
`python3 tools/etsy_upload.py --designs 27` + `--check --strict --designs 27`.

