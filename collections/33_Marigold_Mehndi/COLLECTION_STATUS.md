# Koleksiyon 33 — Marigold & Mehndi (çalışma adı)

**Durum:** `editable_draft` — platform teması tema standardında kuruldu (G182), ama tasarımın kendi GPT parçaları **yok**;
görseller geçici (başka tasarımların düz dokuları tonlandı: ipek = 14'ün saten dokusu, kadife = 06'nın lacivert kâğıdı,
kâğıt = 18'in pamuk kâğıdı; altın = 17'nin mührünün düz metal yüzeyi; çizim yok). Satış durumu `coming`
(`platform/lib/marketing/config.ts`); fiyat `[PRICE]`, onay entegratörde. Tasarım özeti: `DESIGN_BRIEF.md`.

| Parça | Durum |
|---|---|
| Website teması | `platform/themes/marigold-mehndi/` — 5 sayfa; ilk sayfa kapalı zarf (K23 sıkı, katalog kapağı düzeni); açılış (püskül sarkacı + kılıf kayması + düz kapağın kadife yüzüne devretmesi + astar + yapraklar + diya alevleri + kart astardan yükselir); jharokha fotoğraflar ve kına akışı; teşekkür modu, G138/G127/G126/G128/G144 |
| GPT PAKET 5 (ipek, kılıf, yapraklar, jharokha, kına, diya, alev, çelenk, kına deseni, kart, püskül, ön cep, kapak, kadife, kâğıt, web_hero) | bekliyor — `assets/gpt/GPT_PROMPTS.md` (W2.1–W2.16, 18 dosya); bırak-çalıştır provası GEÇTİ 18/20 (yalnız PAKET 6 elle) |
| GPT PAKET 2 örnek fotoğraflar (kurgu Anaya & Kabir) | bekliyor (5 dosya) |
| GPT PAKET 6 basılı davetiye ön/arka | bekliyor (2 dosya); şimdilik geçici düzen (`lib/print/layouts.ts`, safran kâğıt + fuşya ipek şeritleri) |
| Demo | `/start/demo/marigold-mehndi` (demo harita pini Jaipur, Rajasthan) |
| Etsy ilan metni | taslak: `package/listing/listing_v3.md` (yayınlanmadı, K41; ilan görselleri/video GPT parçalarından sonra) |
| Alıcı rehberi (START HERE) | başlanmadı (`tools/build_customer_guides.py` bu tasarımı henüz tanımıyor; G175 düzeni) |
| Etsy verisi (`etsy_upload.json`) | başlanmadı — `tools/etsy_upload.py` `DESIGNS`e 33 eklenince `test_build_customer_guides.py` da 1–33 beklemeli (START HERE ile birlikte, G175 düzeni); Etsy'ye hiçbir şey gönderilmedi. Taslak `listing_v3.md` `etsy_upload.py --check` kurallarına göre yazıldı (geçici kayıtla denendi: başlık 125/140, 13 etiket, OK) |

**Denenmedi:** gerçek telefon, Vercel yayını, gerçek alıcı fotoğrafları, GPT parçalarıyla görünüm, sesin duyulması.
Son kontrol: 2026-10-18 (G182).
