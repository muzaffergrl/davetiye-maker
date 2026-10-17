---
id: G133
baslik: Crimson Rose Atelier — yeni ürün ve gezinilebilir demo
rol: claude-kod
durum: inceleme
alan: codex-crimson-rose-atelier
oncelik: 1
bagimli: []
yazar: [platform/themes/crimson-rose-atelier/, platform/tests/theme-crimson-rose-atelier.test.ts, collections/21_Crimson_Rose_Atelier/, platform/lib/marketing/config.ts, platform/lib/marketing/designs.ts, platform/lib/audio/catalog.ts, platform/lib/claim/claim.ts, gorevler/G133-crimson-rose-atelier.md]
---

## Kullanıcı isteği
17 Ekim 2026: bordo gül referansından mevcut Burgundy Velvet Autumn'dan ayrı ürün. Fotoğraf ve Story düzeni farklı olsun; mevcut ürünlerin işlevleri korunsun. Kullanıcı yeni ürünün GitHub'a eklenmesini onayladı; şimdilik yalnız yerel demo istedi, Vercel yayını istemedi.

## Sonuç
- Yeni tema: `crimson-rose-atelier`; çalışma adı Crimson Rose Atelier; koleksiyon 21.
- Beş sayfa, oval portresi yana kaydırılmış ana sayfa, yatay fotoğraflı elle gezilen bölüm albümü, tipografik program ve krem RSVP kartı.
- Güncel motorun müzik, harita, dinamik RSVP, takvim, teşekkür modu ve düzenlenebilir metin/fotoğraf sözleşmeleri kullanılır. Excel/Sheets, QR, şifre, düzenleme hakları ve admin ortak platform katmanındadır.
- `config.ts`: `coming`; satışta olan 20 ürün değişmedi. `designs.ts`: açıklamalar ve stiller. `audio/catalog.ts`: varsayılan Evening Strings, açılış ipuçları.
- `/start/demo/crimson-rose-atelier` standart demo rotasıdır; beş sayfa aynı demo alanında gezinir, yanıt gönderilmez. Bu rota ancak yeni kodun çalıştığı ortamda mevcuttur; eski production adresinde varmış gibi sunulmaz.
- Örnek GPT fotoğrafları demo kaydında tema varlıklarına bağlandı. `draftFromDemo` örnek medyayı temizler; yeni müşteri siteleri kurgu çiftin fotoğraflarını devralmaz. Eski demo kayıtları zaten boş medyalıydı.
- Kaynak üretim PNG'leri ve prompt'lar koleksiyon klasöründe. Font dosyası, gerçek müşteri verisi, erişim anahtarı yok.

## Doğrulama
- Yerel güncel motorla 35 içerik/tema kontrolü geçti.
- Önceki üretim turunda 75 Chrome kontrolü geçti: 320/390/430/768/1280, taşma, albüm, klavye, azaltılmış hareket, preview RSVP ve axe ciddi/kritik kontrolü. Ağ kısıtı nedeniyle sayfa/varlıklar route.fulfill ile verildi, dış fontlar yedeklerle çizildi. Bu sayı canlı test değildir.
- Yeni `theme-crimson-rose-atelier.test.ts`: 6/6 geçti; gerçek `handleDemoPage` rotası, beş sayfa, sample fotoğrafların müşteriye taşınmaması, teşekkür modu ve isteğe bağlı Story, ses kaydı, varlık dosyaları.
- Tam depo `npm test`/build/typecheck bu yerel snapshot üzerinde koşulmadı; GitHub CI ayrıca takip edilir.

## Açık
Gerçek telefon, gerçek Blob/müzik yükleme, gerçek Google hesabı/Sheets ve yeni üründe tam alıcı paneli uçtan uca testi. Alıcı rehberi ve Etsy ilan paketi bu görevde üretilmedi. Satış onayı ve fiyat açık; Vercel yayını kullanıcı isteğiyle yapılmadı.

## Günlük
- 2026-10-17: kullanıcı ayrı ürün üretimini istedi; yerel taslak ve kontroller tamamlandı.
- 2026-10-17: GitHub'a ekleme onayı alındı; kullanıcı şimdilik yalnız yerel demoyu seçti.
