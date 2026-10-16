---
id: G087
baslik: Dükkân (admin) paneli + alıcı panelinde satın alma sonrası akış düzeltmeleri (K30)
rol: claude-kod
durum: bitti
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
**2026-10-15 · claude-G087** — dükkân paneli ve alıcı panelindeki iki akış düzeltmesi. Ayrıntı: `docs/17_ADMIN_PANELI.md`.

**Alıcı paneli denetimi (390 px, yerel build, `/start` → kurulum → Home/Edit/Guests/Share):** genel akış sade ve anlaşılır
(K29 3 adımlı kurulum, 6 sayfalık Edit, tek Publish yeri). Bulunan ve düzeltilen:
1. **RSVP son tarihi örnek günde kalıyordu:** düğün tarihi 18 Eylül 2027 yapılınca "Replies close April 3, 2027" (demo günü) kalıyordu.
   Artık son tarih alıcı kendisi seçmediyse düğün tarihiyle aynı aralıkla kayar (`lib/panel/model.ts` `followWeddingDate`,
   `usePanel` edit'te) → 7 Ağustos 2027. Alıcının seçtiği tarihe dokunulmaz.
2. **Sipariş onayı beklerken Home sessizdi:** yalnız Publish'e basınca "Not yet" diyordu. Home durum kartı artık "Confirming your
   order — set everything up now; you can publish as soon as it is confirmed" der, kartta Publish düğmesi yok.
3. Açık (karar gerekli): alıcıya görünen metinlerde `[SHOP NAME]` / `[SUPPORT EMAIL]` yer tutucuları (K25/K26 kararı bekliyor).

**Dükkân paneli `/admin`:** tek şifre (`ADMIN_PASSWORD`, ≥ 12 karakter; yoksa kapalı), 12 saatlik HttpOnly/SameSite=Strict oturum,
giriş hız sınırı, Origin kontrolü, noindex/no-store/çerçeve yok. Liste (Yapılacak · Hepsi · Yayında · Taslak · Arşiv + arama),
site sayfası (siparişi onayla adımları, bilgiler, hazır Etsy mesajları, yeni düzenleme linki, isim/tarih hakkı, yayında kalma
tarihi, yayından kaldır, adres yazarak silme, geçmiş). Türkçe arayüz; alıcı mesajları İngilizce. Veri adaptörüne `listSites()` +
`rsvpCounts()` (local + blob).

**Testler:** `npm test` **596/596** (yeni `tests/g087-admin.test.ts` 14/14 dahil), typecheck, build (trace-check) yeşil;
`tests/g087-browser.ts` **33/33** (ilk koşuda geri linki 23 px'ti → 44 px); ekranlar `platform/previews/g087/`. Denenmedi: canlı yayın (ADMIN_PASSWORD canlıda yok), gerçek telefon.

## Günlük
- 2026-10-15 açıldı ve alındı (claude-G087, kullanıcı isteği K30)
- 2026-10-16 entegratör onayladı (G125: `alindi`'den doğrudan; Sonuç tam, iş main'de ve canlıda — G092/G096 canlı denemesi, sonra admin v2 G095)
