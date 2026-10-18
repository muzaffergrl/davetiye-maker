# Koleksiyon 25 — Orient Express Voyage (çalışma adı)

**Durum:** `editable_draft` — platform teması tema standardında kuruldu (G163) ama **bütün görseller geçici düz palet
tonu**; GPT parçaları gelmedi. Satış durumu `coming` (`platform/lib/marketing/config.ts`, `[PRICE]`). Çalışma adı marka değildir.
Tasarım özeti: `DESIGN_BRIEF.md`.

| Parça | Durum |
|---|---|
| Website teması | `platform/themes/orient-express-voyage/` — 5 sayfa, açılış, hareket imzası, teşekkür modu, copy manifesti tamam; görseller geçici |
| GPT PAKET 5 (16 website parçası) | bekliyor — `assets/gpt/GPT_PROMPTS.md` |
| PAKET 2 örnek fotoğraflar (5) | bekliyor |
| PAKET 6 basılı davetiye zeminleri (5×7 + A5, ön/arka) | bekliyor; şimdilik `layouts.ts` composed (geçici afiş tonu + damga) |
| Demo | `/start/demo/orient-express-voyage` (yeni kodun çalıştığı ortamda; foto yer tutucularıyla) |
| Etsy ilanı | `package/listing/listing_v3.md` taslak (yayın yok, K41); görseller/video/START HERE yok |

**Denenmedi:** gerçek telefon, Vercel yayını, gerçek alıcı fotoğrafları, GPT parçalarıyla görünüm. Son kontrol: 2026-10-17.

## G175 — paket (GPT'siz kısım, 2026-10-17)

- START HERE: `package/customer/START_HERE.{md,pdf}` + `img/start_qr.{png,svg}` (yalnız `tools/make_qr.py`),
  açılış nesnesi `wallet` / panel sekmesi `Wallet`; `python3 tools/build_customer_guides.py --check --designs 25` yeşil.
  Başlat linki `/start?theme=orient-express-voyage` yayından sonra çalışır (denenmedi).
- Etsy verisi: `package/listing/etsy_upload.json` — `ready_to_publish: false`; blocker: görseller, video, `coming` (K41),
  fiyat `[PRICE]`, yenileme. `python3 tools/etsy_upload.py --check --designs 25` yeşil. Etsy'ye hiçbir şey gönderilmedi.
- GPT ilan sahneleri (PAKET 3, #00FF00 ekranlar): `assets/gpt/GPT_PROMPTS.md` → `assets/gpt/mockups/` (bekliyor).

**GPT sonrası:** PAKET 5/2 parçaları tema `build_images.py` ile → PAKET 3 sahneleri `assets/gpt/mockups/`'a →
`tools/listing_kit.py` `THEMES`'e `Theme(id="orient-express-voyage", no="25", …)` (köşe süsleri GPT dekordan) +
`tools/listing_editorial/opening_stills.json`'a açılış anları → `cd platform && npm run build` →
`python3 tools/listing_editorial.py --theme orient-express-voyage --capture --video` (9 ilan görseli + `video.mp4`) → `listing_v3.md` §5
alt metinleri gerçek dosyalara göre → `python3 tools/listing_kit.py pdf --theme orient-express-voyage` (ilan PDF'i) →
`python3 tools/etsy_upload.py --designs 25` + `--check --strict --designs 25`.

