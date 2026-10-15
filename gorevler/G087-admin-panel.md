---
id: G087
baslik: Dükkân (admin) paneli + alıcı panelinde satın alma sonrası akış düzeltmeleri (K30)
rol: claude-kod
durum: alindi
alan: claude-G087
oncelik: 1
bagimli: []
yazar: [platform/app/admin/, platform/app/api/admin/, platform/lib/admin/, platform/components/admin/, platform/lib/data/, platform/components/panel/, platform/lib/panel/, platform/lib/sites.ts, platform/tests/, platform/previews/g087/, platform/README.md, docs/10_SITE_PLATFORMU.md, docs/16_PANEL_V2.md, docs/17_ADMIN_PANELI.md]
---

## Amaç
K30: satın alma sonrası her iş arayüzden yapılsın. Bugün dükkân tarafı yalnız terminal betikleri (`verify-order.ts`,
`reissue-edit-key.ts`, `grant-identity-change.ts`) ve Blob anahtarı ister; kullanıcı bunları çalıştıramaz. Ayrıca alıcı
panelinde 390 px yolculukta görülen akış sorunları düzeltilir.

## Yapılacaklar
1. `/admin`: tek parola (`ADMIN_PASSWORD` ortam değişkeni; yoksa admin kapalı ve dürüst metin), imzalı HttpOnly oturum çerezi,
   giriş hız sınırı, `noindex`/`no-store`.
2. Liste: bütün siteler (adres, tasarım, sipariş no, e-posta, durum, sipariş kontrolü, oluşturma/yayın, yanıt sayısı, kalan isim/tarih hakkı,
   arşiv tarihi); "Action needed" (onay bekleyen siparişler) filtresi, arama.
3. Site ayrıntısı + eylemler: siparişi onayla (Etsy'de kontrol notu), yeni düzenleme linki (bir kez gösterilir + Etsy mesaj metni),
   isim/tarih hakkı ekle, arşiv tarihini taşı, yayından kaldır, siteyi sil (adres yazılarak onay), site günlüğü.
4. Veri adaptörüne `listSites()` (local + blob + sahte blob testi).
5. Alıcı paneli: RSVP son tarihi örnek değerdeyken düğün tarihi değişince son tarih aynı aralıkla kayar; sipariş onayı beklerken
   Home'da durum kartı bunu söyler ve "Publish" düğmeleri bekleme hâlini gösterir.
6. Testler (unit + tarayıcı 390/1280), `platform/previews/g087/`, belgeler.

## Sonuç

## Günlük
- 2026-10-15 açıldı ve alındı (claude-G087, kullanıcı isteği K30)
