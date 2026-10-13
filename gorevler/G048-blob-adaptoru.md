---
id: G048
baslik: Vercel Blob veri adaptörü — Supabase'siz ilk canlı sürüm (siteler, RSVP, fotoğraflar)
rol: claude-kod
durum: alindi
alan: claude-kod-12
oncelik: 1
bagimli: [G037]
yazar: [platform/lib/data/blob/, platform/tests/]
---

## Amaç
Kullanıcı: "Supabase olmasa şimdilik olmaz mı?" — ilk canlı sürüm veriyi Vercel Blob'da tutar (`docs/10_SITE_PLATFORMU.md` §2c).

## Yapılacaklar
1. Adaptör arayüzünün `blob` uygulaması (`@vercel/blob`, sabit sürüm): siteler, slug/sipariş dizinleri, RSVP'ler (her biri ayrı dosya), fotoğraflar.
2. Yazma tutarlılığı: slug ve sipariş no için "önce dizin dosyasını koşullu yaz" (varsa reddet); site kaydında sürüm alanıyla iyimser kilit.
3. Ortam: `DATA_ADAPTER=blob` + `BLOB_READ_WRITE_TOKEN` (Vercel projesine Blob deposu bağlanınca otomatik gelir). Hiçbir anahtar repoya yazılmaz.
4. Testler: local adaptörle aynı sözleşme testleri, Blob istemcisi sahte (mock) ile.

## Bitti sayılması için
- [ ] Sözleşme testleri blob adaptöründe geçiyor; `npm run build` temiz

## Sonuç
_(görevi yapan ajan doldurur)_

## Günlük
- 2026-10-13 alindi: claude-kod-12
