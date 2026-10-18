# Koleksiyon 36 — Victorian Glasshouse (çalışma adı)

**Durum:** `editable_draft` — platform teması tema standardında, GPT parçaları gelmeden **geçici** katmanlarla kuruldu (G185).
Satış durumu **`coming`** (`platform/lib/marketing/config.ts`; fiyat `[PRICE]`). GPT parçaları gelip yerleşince ve göz
kontrolünden sonra `live` kararı entegratörde. Tasarım özeti: `DESIGN_BRIEF.md`.

| Parça | Durum |
|---|---|
| Website teması | `platform/themes/victorian-glasshouse/` — 5 sayfa + teşekkür modu; eğrelti/cam zemin, herbaryum kâğıdı, kraft paket ve kapağı, bakır etiket, jüt sicim başka koleksiyonların GPT görsellerinden kesilip tonlandı (geçici, çizim yok); buğu ve ışık bandı CSS ışığı; eğrelti otları, demir kemerler, orkide dalı, cam vitrin, herbaryum etiketi, yaprakçıklar yalnız GPT ile görünür |
| GPT PAKET 5 (zeminler, paket gövdesi, kapak iki yüz, bakır etiket, sicim, buğu, demir kemerler, eğrelti otları, orkide dalı, numune camı, herbaryum etiketi, yaprakçıklar, kart, web_hero) | bekliyor — `assets/gpt/GPT_PROMPTS.md` (19 dosya; kuru deneme GEÇTİ 19/21, PAKET 6 elle) |
| GPT PAKET 2 (kurgu çift Flora & Edmund, 5 foto, 4:5 + 16:9) | bekliyor — `assets/gpt/GPT_PROMPTS.md` |
| GPT PAKET 6 (basılı davetiye ön/arka, 5×7 + A5, 300 ppi) | bekliyor; şimdilik `composed` düzen (`platform/lib/print/layouts.ts`: temanın herbaryum kâğıdı + eğrelti bandı, bakır plaka, kraft bant) |
| Demo | `/start/demo/victorian-glasshouse` (yeni kodun çalıştığı ortamda; misafire kapalı — `coming`) |
| Etsy ilan metni | taslak `package/listing/listing_v3.md` (K41: yayımlanmadı; `tools/etsy_upload.py` `DESIGNS`'a henüz eklenmedi) |
| Alıcı rehberi (START HERE) | başlanmadı |
| Renk paletleri (G153) | yok; GPT parçalarından sonra |

**Denenmedi:** gerçek iPhone/Android, Vercel yayını, gerçek alıcı fotoğrafları, yavaş ağ, GPT parçalarıyla görünüm, Safari'de
`@property --wipe` + `backdrop-filter`. Son kontrol: 2026-10-18 (G185).
