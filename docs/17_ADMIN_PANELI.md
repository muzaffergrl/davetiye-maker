# Dükkân (admin) paneli — G087, K30 (2026-10-15)

Kullanıcı kararı K30: satın alma sonrası her iş **arayüzden** yapılır; terminal betiğine ve Blob anahtarına gerek kalmaz.
Adres: **`/admin`** (satış sitesiyle aynı alan adı). Dil: Türkçe (dükkânın dili); alıcıya giden mesajlar İngilizce.

## 1. Açma
- Sunucu ortam değişkeni **`ADMIN_PASSWORD`**. Yoksa `/admin` "Yönetim paneli kapalı" der, giriş formu bile göstermez. Şifre repoya,
  log'a ve bu belgeye yazılmaz. **K33:** lansmandan önce (`MARKETING.launched` false) en az 4 karakter kabul edilir ve panelde
  "Geçici kısa şifre" uyarısı çıkar; lansmanda en az 12 karakter şart — `launched: true` build'i kısa şifreyle durur, panel de kapanır.
- Giriş: tek şifre → 12 saatlik oturum çerezi (`bke_admin`, HttpOnly, SameSite=Strict, https'te Secure). Şifre değişince bütün
  oturumlar düşer. Deneme sınırı: adres başına 15 dakikada 8, toplam saatte 40 (doğru ya da yanlış her deneme sayılır).
- Sayfalar `noindex`, `no-store`, `no-referrer`, çerçeveye alınmaz (`frame-ancestors 'none'`). Yazma isteklerinde Origin kontrolü.

## 1a. v2 (G095, 2026-10-15)
Menü: **Özet · Siparişler · Müşteriler · Tasarımlar · + Yeni sipariş**. Özet = `/admin` (sayılar, Yapılacaklar, haftalık satış,
en çok satanlar, yaklaşan düğünler, son siparişler); eski liste `/admin/orders`'a taşındı (+ sıralama, CSV). Müşteriler
(e-postaya göre), Tasarımlar (satış/yayında/linkler), Yeni sipariş (dükkân alıcı adına site açar, link bir kez + mesaj).
Site sayfasına: Taslağı gör, dükkân notu, sitede ne var, misafir yanıtları (sil, CSV), e-posta düzeltme, alıcı adına yayınla.
Satış sitesinde **My website** → `/my` (alıcının bu cihazda açtığı düzenleyici; link yapıştırma; /start; kayıp link).
Ayrıntı: `gorevler/G095-admin-v2.md`. Aşağıdaki §2 v1 ekranlarını anlatır; site sayfası aynen geçerlidir.

## 2. Ekranlar
**Liste (`/admin`)** — "Satış sonrası nasıl işliyor?" açılır kutusu; filtre çipleri **Yapılacak · Hepsi · Yayında · Taslak · Arşiv**
(sayılarla; onay bekleyen sipariş varsa Yapılacak seçili açılır); arama (sipariş no — `#3456` gibi —, e-posta, isimler, adres, tasarım);
her site bir kart: durum rozetleri, isimler, adres + tasarım, sipariş no, oluşturma zamanı (İstanbul saati), yanıt sayısı.

**Site sayfası (`/admin/site/<id>`)**, yukarıdan aşağı:
1. **Yapılacak: siparişi onayla** (yalnız onay bekleyen sitede): sipariş numarasını kopyala, Etsy siparişleri linki, kontrol listesi
   (ödendi mi, iade/iptal yok mu, doğru tasarım mı, alıcının yazdığı e-posta), not, **Siparişi onayla**. Onaydan sonra mesaj şablonu
   kendiliğinden "Sipariş onaylandı"ya geçer.
2. **Bilgiler**: sipariş, sipariş kontrolü, e-posta, tasarım, adres, oluşturma / ilk yayın / son değişiklik, düğün tarihi, yayında
   kalma tarihi, RSVP yanıtı, isim/tarih hakkı (ör. "2 / 3 kaldı"), misafir şifresi açık/kapalı.
3. **Etsy mesajı**: hazır şablonlar (alıcının isimleri, sipariş no, site adresi, gerekiyorsa yeni link dolu) → **Mesajı kopyala** →
   Etsy'de siparişin konuşmasına yapıştır. Şablonlar `platform/lib/admin/messages.ts` (sözcükler G091'in alanı; id'ler sabit):
   `order_confirmed`, `start_link_reminder`, `new_edit_link`, `extra_change_granted`, `how_to_publish`, `publish_blocked_pending`,
   `general_help`. Kararlaşmamış ticari bilgiler (dükkân adı, destek e-postası…) `lib/marketing/config.ts`'ten gelir; uydurulmaz.
4. **Destek işlemleri**: **Yeni düzenleme linki** (onay adımıyla; eski link hemen ölür, yeni link yalnız bir kez gösterilir ve
   kaydedilmez) · **İsim/tarih hakkı ekle** (+1/+2/+3, neden zorunlu; yalnız ilk yayından sonra) · **Yayında kalma süresi** (kapanış
   günü + neden; varsayılana dönüş) · **Yayından kaldır** (onay adımıyla; hiçbir şey silinmez).
5. **Siteyi sil**: adres aynen yazılmadan düğme açılmaz; içerik, fotoğraflar ve yanıtlar kalıcı silinir.
6. **Geçmiş**: oluşturma, sipariş onayı, ilk yayın, isim/tarih değişiklikleri, eklenen haklar, tarih değişiklikleri (kim, ne zaman).

## 3. Satış sonrası akış (dükkânın gözünden)
1. Alıcı Etsy'den alır, PDF'teki linkle `/start`'ı açar, sipariş no + e-postayla siteyi başlatır, düzenleme linkini kaydeder.
2. (`CLAIM_ORDER_VERIFICATION=manual`) Site **Yapılacak**'a düşer. Alıcı bu arada her şeyi düzenleyebilir; panelin Home kartı
   "Confirming your order" der, Publish açılmaz.
3. Dükkân Etsy'de siparişi kontrol eder → **Siparişi onayla** → "Sipariş onaylandı" mesajını Etsy'den gönderir. Alıcı yayınlar.
4. Link kaybı → **Yeni düzenleme linki** → "Yeni düzenleme linki" mesajı. Düğün ertelendi → **İsim/tarih hakkı ekle** → mesaj.
   Uzatma → **Yayında kalma süresi**. İade/kötüye kullanım → **Yayından kaldır** ya da **Siteyi sil**.

## 4. Kod
- `platform/lib/admin/`: `auth.ts` (şifre, oturum belirteci, çerez), `api.ts` (giriş/çıkış, liste, eylemler — `lib/sites.ts`'in
  betiklerle aynı fonksiyonları), `summary.ts` (sunucu: SiteRecord → özet, geçmiş), `view.ts` (tarayıcı: tipler, filtre, sayılar),
  `messages.ts` (Etsy şablonları), `page.ts` (sayfa kapısı).
- Rotalar: `app/admin/page.tsx`, `app/admin/site/[id]/page.tsx`, `app/api/admin/session` (POST/DELETE), `app/api/admin/sites` (GET),
  `app/api/admin/sites/[id]/[action]` (POST: confirm, reissue, grant, archive, unpublish, delete).
- Bileşenler: `components/admin/` (Shell, Gate, AdminLogin, AdminList, AdminSite, badges, format, admin.module.css — panelin
  BKE dili, tek vurgu rengi).
- Veri adaptörü: `listSites()` (en yeni önce) ve `rsvpCounts()` (blob'da tek listeleme, okuma yok) — local + blob.
- Eski betikler (`scripts/verify-order.ts`, `reissue-edit-key.ts`, `grant-identity-change.ts`) çalışmaya devam eder.

## 5. Testler
- `tests/g087-admin.test.ts` (npm test): oturum belirteci (süre, kurcalama, şifre değişimi), kapalı/zayıf şifre, giriş (yanlış,
  yabancı origin, Origin'siz, hız sınırı), liste (sır yok), onay → yayın açılır, yeni link (eski ölü), hak (yayından önce red),
  arşiv tarihi, yayından kaldır, silme onayı, filtre/arama, şablonlar (yer tutucu kalmaz, SLA/garanti yok), local+blob `listSites`/
  `rsvpCounts`, RSVP son tarihinin düğün tarihini izlemesi.
- `tests/g087-browser.ts` (build sonrası): alıcı `/start` → Home "Confirming your order" + son tarih kayması; admin kapalı/giriş/
  liste/arama/site/onay/mesaj/yeni link/silme kilidi/masaüstü/çıkış; axe-core, dokunma hedefleri, yatay kaydırma. Ekranlar
  `platform/previews/g087/`.

## 6. Açık / sonra
- Canlıda `ADMIN_PASSWORD` henüz yok → canlı admin kapalı. Bulut oturumunun Vercel bağlantısı env eklerken 403 aldı; şifre ve yayın
  yerel oturumun G079 4d adımında (değer kullanıcıdan alınır).
- Yeni sipariş bildirimi (e-posta/push) yok: e-posta sağlayıcısı kararı (docs/10 §3). Şimdilik Yapılacak listesi.
- Etsy API ile otomatik sipariş doğrulama (docs/10 §3) gelince "Siparişi onayla" adımı kendiliğinden kalkar.
- Çok sayıda sitede liste her açılışta bütün kayıtları okur (blob); yüzlerce site için yeterli, binlerde sayfalama/indeks gerekir.
