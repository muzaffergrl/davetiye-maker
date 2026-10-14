---
id: G060
baslik: Panel v2 — çağdaş, en kullanıcı dostu panel + kötüye kullanıma karşı düzenleme hakkı sistemi
rol: claude-kod
durum: inceleme
alan: wf-hiz
oncelik: 1
bagimli: [G039, G045]
yazar: [platform/app/edit/, platform/app/api/edit/, platform/components/panel/, platform/lib/panel/, platform/lib/sites.ts, platform/lib/claim/, platform/app/start/, platform/tests/panel*, platform/tests/edit*, platform/tests/g060*, platform/README.md, docs/10_SITE_PLATFORMU.md]
---

## Amaç
Kullanıcı (K25): panel "harika, çağdaş, en kullanıcı dostu, anlaşılır" olmalı. Alıcı yalnız satın aldığı şablonu kullanmalı;
bir satın alma ile başka çiftlere site yapılamamalı ("sadece birkaç kez düzenleme").

## Yapılacaklar
1. **UX araştırma + tasarım:** önde gelen düğün sitesi editörlerinin akışından öğren (kopyalama yok); telefon öncelikli ilk
   kurulum sihirbazı (isimler → tarih/saat → mekân → fotoğraflar → önizle → yayınla), sonra bölüm bölüm düzenleme; canlı
   önizleme; kaydedildi göstergesi; boş durumlar; yardım ipuçları; erişilebilirlik; Türkçe değil İngilizce arayüz.
2. **Düzenleme hakkı (anti-abuse):** tek sipariş = tek site (var). Yayından sonra **kimlik alanları** (çift isimleri, tarih) için
   sınırlı değişiklik hakkı (varsayılan 3; panelde kalan hak gösterilir, hak bitince destekle iletişim mesajı); yazım düzeltmesi
   (≤ 2 karakter fark) hak harcamaz; diğer içerik (program, metinler, fotoğraflar) sınırsız. Site düğünden **12 ay sonra**
   salt okunur arşive geçer (K25). Hepsi sunucu tarafında zorlanır, testli.
3. **Erişim:** benzersiz düzenleme linki (mevcut) + isteğe bağlı e-posta ile giriş bağlantısı (magic link) için arayüz —
   e-posta sağlayıcısı yokken kapalı, metin dürüst.
4. Testler + Playwright 390 px yolculuk + ekran kaydı (`platform/previews/g060/`).

## Sonuç
**Durum: kodda bitti ve yerelde test edildi; canlıya yayınlanmadı** (bu görevde deploy yok). Tasarım: `docs/16_PANEL_V2.md`.

**Yapılanlar**
- **Düzenleme hakkı (sunucuda, adaptörden bağımsız):** `platform/lib/panel/rights.ts` (istemci + sunucu ortak, saf): kimlik =
  iki ilk isim + tam adlar, "Names as shown", monogram, tarih. İlk yayına kadar serbest; ilk yayın `firstPublishedAt` + çapa +
  `used 0` yazar. Sonra `PUT` kimliği saklı değerde tutar (`identityKept`), kimlik yalnız `POST /api/edit/<slug>/identity` ile
  değişir: alan başına ≤ 2 karakter (Damerau–Levenshtein, NFC/görünmez karakter/boşluk normalize, `&`/`and`/`+` farkı yok) =
  ücretsiz yazım düzeltmesi (çapa yerinde kalır, düzeltmeler birikip başka çift olamaz); fazlası onay ister (`409
  confirm_required`), onayla 1 hak harcar; hak 0 → `403 no_changes_left` (typo yine serbest). Varsayılan 3 hak / 2 karakter /
  12 ay `lib/marketing/config.ts`'ten okunur (satış sitesiyle aynı sayı). Sayaç + içerik **tek koşullu yazım**
  (`adapter.patchSite(id, patch, {expectedUpdatedAt})`, local kilit / blob ETag) → iki sekme son hakkı ikinci kez harcayamaz.
  Yayın savunması (`409 identity_mismatch`), eski kayıt göçü (çapa = yayındaki kimlik, 0 kullanılmış), site günlüğü (≤ 50),
  destek aracı `platform/scripts/grant-identity-change.ts` (`--add`, `--archive-on`, `--show`; neden zorunlu).
- **Arşiv (K25):** düğün + 12 ay (ay sonu kırpılır), ertesi gün 00:00 site saat diliminde; öneri tavanı ilk yayın + 48 ay (açık,
  karar bekliyor); destek override'ı; hiç yayınlanmamış site arşivlenmez. Arşivde genel sayfa/foto/`.ics` 410 (çift bilgisi yok,
  noindex), misafir formu kapalı, panel okunur + CSV, yazan uçlar `403 archived`; siteyi hemen arşivleyecek tarihle ilk yayın ve
  `/identity` reddedilir (`date_archives_site`).
- **Panel v2 (`platform/components/panel/`):** 6 adımlı kurulum sihirbazı (isimler → tarih/saat → mekân → fotoğraflar + kırpma →
  kontrol/önizleme → kurallar + yayınla → "Your website is live", link + QR), sonra Home · Edit · Guests · Share (hash adresleri,
  geri tuşu), bölüm sayfaları, Names kilidi + kimlik sheet'i (canlı "Save fix" / "Use 1 change", kalan hak), hak sayacı, Undo
  snackbar, taşma menüsü, telefon önizlemesi (portal, `inert`, geçmiş kaydı), masaüstü 1280 üç sütun / 960 iki sütun, kayıt
  göstergesi, çevrimdışı yerel yedek + "Restore/Discard", çakışma bandı, arşiv görünümü, 401 tam ekran metni. Tokenlar §8,
  ikonlar `lucide-react@1.46.0` (sabit), font dosyası yok, dekor çizimi yok (K21). Marka/destek değerleri `[SHOP NAME]`,
  `[SUPPORT EMAIL]` yer tutucusu (K25/K26 kararı bekliyor; uydurulmadı, `mailto:` yapılmadı).
- **E-posta ile giriş:** sağlayıcı yok → kapalı. `/signin` dürüst metin, form yok; `POST /api/signin` → 503 `unavailable`;
  `SignInMailer` arayüzü; geçersiz link sayfasında "Lost your edit link?".
- Eski davranışın hepsi korundu: otomatik kayıt + 409, doğrulama, foto kırpma, önizleme anahtarı, yayınla/kaldır, QR, RSVP liste/CSV,
  SSS ve RSVP soru düzenleyicileri, uzunluk sınırları.

**Testler (2026-10-14, origin/main ile birleştirilmiş kodda)**
- `npm test` **348/348**, `npm run typecheck` temiz, `npm run build` + trace-check geçti.
- Yeni: `tests/g060-rights.test.ts` (7), `tests/g060-api.test.ts` (12; iki sekme yarışı local'de ve **aynı sahte Blob deposunda iki
  sunucu örneği**, arşiv kapıları, göç, 401 eşitliği); `tests/panel.test.ts` 27.
- Tarayıcı (Chromium 390 × 844 mobil emülasyon): `tests/g060-browser.ts` **104/104** (sihirbaz, yayın + QR çözümü, kimlik
  typo/değişiklik/hak 0, Guests arama/süzgeç/silme, Share, çevrimdışı + yerel kopya, çakışma, arşiv 410, 401, magic link kapalı,
  axe-core 4.13.0 13 görünümde ciddi/kritik 0, dokunma hedefi ≥ 44 px, 320 px yatay kaydırma yok, azaltılmış hareket, 1280/1000).
  v2'ye uyarlanan eski testler: `panel-browser.ts` 75/75, `final-smoke.ts --theme blush-garden-rose` 44/44 ve `--theme olive-ivory`
  44/44, `g051-browser.ts` 44/44, `g055-browser.ts` 136/136, `claim-browser.ts` 50/50, `rsvp-browser.ts` 25/25.
- Çıktı: `platform/previews/g060/` — 30 ekran görüntüsü (her sihirbaz adımı, Home, Edit, bölümler, kimlik sheet'i hâlleri, Guests,
  Share, çevrimdışı, yerel kopya, çakışma, arşiv, 1280/1000), `g060_journey_390.mp4` (~38 sn: sihirbaz → yayın → sonra kalan hakla
  isim değişikliği → yayın), `checks.json`.

**Yapılmadı / dürüst notlar**
- **Gerçek telefonda denenmedi** (iOS Safari / Android Chrome); yalnız Chromium mobil emülasyonu. QR kamerayla okutulmadı (`jsqr`).
- Magic link açık akışı (§12.2: token, 15 dk, oturum çerezi, kabul testi 41) yapılmadı — sağlayıcı yok; yalnız kapalı arayüz.
- Kabul testlerinden: token kontrastı için ayrı birim testi (37) yok (kontrast axe-core'un `color-contrast` kuralıyla denetlendi);
  %200 metin büyütme (38) ve foto 413/415 satır içi hata (33) g060-browser'da ayrıca denenmedi (413/415 `panel.test.ts`'te API
  düzeyinde var).
- Saat dilimi seçimi yerel `<select>` (aranabilir sheet yok); `#preview/<sayfa>` adresi ve panel dışı önizlemede "Preview — not
  published" şeridi (§15 #5) yok; yardım Home'dan açılır (üst çubuk menüsünde değil).
- Arşivden sonra veri silme yok (§15 #2 karar bekliyor); 48 ay tavanı öneri olarak AÇIK (§15 #3).
- `platform/previews/g039/` eski (G039) arayüz görüntüleri olarak kaldı (ikili dosya üzerine yazılmadı); v2 görüntüleri g060/.

**Yazma alanı dışında değişen dosyalar (entegratör onayına)** — hepsi hak/arşiv zorlaması ya da v2'ye uyum için gerekliydi:
`platform/lib/data/types.ts`, `lib/data/local/index.ts`, `lib/data/blob/index.ts` (`patchSite`, `PublishOptions.set`, yeni alanlar),
`lib/site/render.ts`, `lib/site/static.ts`, `lib/site/ics.ts`, `lib/rsvp/guest.ts`, `app/api/rsvp/[slug]/responses/route.ts`
(arşiv kapıları), `app/signin/`, `app/api/signin/`, `scripts/grant-identity-change.ts`, `package.json` + `package-lock.json`
(`lucide-react@1.46.0`, dev `axe-core@4.13.0`), `previews/g060/`, ve v2'ye uyarlanan tarayıcı testleri
`tests/final-smoke.ts`, `tests/g051-browser.ts`, `tests/g055-browser.ts`, `tests/claim-browser.ts`.

**Entegratöre / önerilen görevler**
- Canlıya yayından ve canlı denemeden sonra `lib/marketing/config.ts` `verified.editRights` ve `verified.archive` → `true`
  (G061 satış sayfaları bu kuralları ancak o zaman söyler). Bu görevde değiştirilmedi.
- START HERE / ilan metinleri (G059, etsy-metin) v2 akışına ("Open my editor" → kurulum adımları, 3 isim/tarih değişikliği, 12 ay)
  göre güncellenmeli — önerilen görev.
- §15 kararları (kullanıcı): arşiv sonrası silme süresi, 48 ay tavanı, destek hak politikası; marka adı / destek e-postası (K26).
- Önerilen görev: magic link (e-posta sağlayıcısı seçilince) + gerçek telefon testi (iPhone + Android).

## Günlük
- 2026-10-14 alindi: wf-hiz
- 2026-10-14 bitti, incelemeye gönderildi
- 2026-10-14 G060-fix: inceleme bulguları uygulandı — tarih günle (±7 gün ücretsiz), soyadı ücretsiz, Undo (10 dk / yayından önce, hak geri), örnek tarihle ilk yayın engeli + sunucuda bir kez ücretsiz, panel önizleme jetonu (kalıcı anahtar panele gitmez) + paylaşılan önizlemede "Preview" şeridi + arşivde/18 ay taslakta 410, manuel sipariş onayı (CLAIM_ORDER_VERIFICATION=manual, scripts/verify-order.ts, satış kapısı verified.orderCheck), blob üzerinde paylaşılan hız sayacı, foto sınırları (60/gün, 450 dosya), panel UX (telefon saat dilimi, 6. adım çubuğu 320–419 px, kırpma 360×640, sade kural metinleri, tek hak rozeti, sign-in kartı kalktı, önizleme 2,5 sn durulunca). Etsy API doğrulaması, satış sitesi bulguları (G061) ve gerçek cihaz testi yapılmadı.
