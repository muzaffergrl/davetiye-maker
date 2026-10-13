---
id: G039
baslik: Düzenleme paneli — telefonda alan düzenleme, foto yükleme, canlı önizleme, yayınla
rol: claude-kod
durum: inceleme
alan: wf-platform
oncelik: 1
bagimli: [G037]
yazar: [platform/app/edit/, platform/app/api/edit/, platform/components/panel/, platform/lib/panel/, platform/lib/qr.ts, platform/tests/panel.test.ts, platform/tests/panel-browser.ts, platform/previews/g039/]
---

## Amaç
Alıcı (çift) sitesini Canva bilmeden telefonundan düzenler. Panel İngilizce, sade, büyük dokunma alanları.

## Yapılacaklar
1. `/edit/[slug]?k=<anahtar>`: anahtar doğrulama (hash), yanlışsa genel hata.
2. Bölümler: Couple, Date & time, Venue, Schedule (satır ekle/sil/sırala), Story (3 foto + başlık), Details
   (dress code, travel, registry linkleri), RSVP (son tarih), Optional sections (aç/kapa), Photos (yükle, kırp, değiştir).
3. Otomatik taslak kayıt, doğrulama mesajları (tarih biçimi `June 12, 2027` gibi gösterim), canlı önizleme (iframe, 390 px).
4. Yayınla / yayından kaldır; yayın linki ve QR (tools/make_qr.py mantığıyla, gerçek URL'den).
5. Test: anahtar kontrolü, kayıt, foto yükleme sınırları, yayınla akışı (Playwright 390 px).

## Bitti sayılması için
- [x] Telefonda (390 px) baştan sona düzenleme → yayınla akışı testle geçiyor; ekran kaydı `platform/previews/g039/panel_flow_390.mp4`

## Sonuç
**Durum: inceleme.** Panel yerelde (`local` adaptör, `next start`) uçtan uca çalışıyor ve test edildi. Hiçbir yere yayınlanmadı;
Vercel/Supabase projesi açılmadı, PR yok, görsel üretilmedi. Test verisi kurgu (03 demo kaydı, "Elena & Marco", `example.test`/`127.0.0.1`).
Ayrıntı: `platform/README.md` → "Düzenleme paneli (G039)".

**Yapılan**
- `/edit/<slug>?k=<anahtar>` (`app/edit/[slug]/page.tsx`): anahtar saklı hash'e karşı (`authorizeEditor`). Yanlış/eksik anahtar,
  önizleme anahtarı ve bilinmeyen slug → aynı genel 404 ("This edit link is not valid"; slug'ın varlığı sızmaz). `noindex`, `no-referrer`, `no-store`.
- Panel (`components/panel/`, İngilizce, 390 px öncelikli, sakin bir araç; dekor çizimi yok — K21): akordeon bölümler Couple · Date & time
  (+ saat dilimi, tarih biçimi) · Venue · Schedule (ekle/sil/yukarı/aşağı, saate göre sırala) · Story (giriş + başlık/metin) · Details
  (dress code, map / travel & stay / registry linkleri) · RSVP (son tarih, yanıt al/alma, gelen yanıtlar + sayılar + CSV) ·
  Optional sections (temanın kullandığı bloklar) · Photos (theme.json alanları). Altta sabit Save · Preview · Publish çubuğu,
  ≥ 44–48 px dokunma alanları; ≥ 960 px'te önizleme yanda.
- Otomatik taslak kaydı (800 ms, sıralı istekler, `baseUpdatedAt` → 409 çakışmada durur ve "Reload" ister; sekme gizlenince/kapanırken kayıt).
  Doğrulama tarayıcıda aynı TS doğrulayıcıyla, hata alanın altında ve bölüm başlığında; Publish hataları listeleyip alana götürür.
  Tarihler "Saturday, May 15, 2027", saatler "4:00 PM".
- Doğrulayıcı seçeneği `validateContent(record, { platform: true })` (`lib/content/validate.ts`): yalnız `urls.website`/`urls.rsvp_form`
  boş uyarılarını kapatır, hatalara dokunmaz; testli.
- Önizleme: `/<slug>?preview=<önizleme anahtarı>` iframe, 390 px, sayfa sekmeleri, her kayıttan sonra yenilenir.
- Yayınla / yayından kaldır `lib/sites.ts` üzerinden (`publishSite`, yeni `unpublishSite`); geçersiz içerik 422 + açık mesajlar.
  Yayından sonra link + gerçek QR: `lib/qr.ts`, sabit `uqr@0.1.3`, make_qr.py ayarları (Q, 4 modül), PNG/SVG indirme.
- Foto: tarayıcıda alanın oranına kırpma (sürükle/pinch/zoom) → yükleme API'si → `lib/uploads` tür/boyut kontrolü → **sharp ile yeniden
  kodlama** (sharp Next ile zaten kuruluydu; `0.35.5` doğrudan bağımlılık yapıldı): EXIF/GPS silinir, yön uygulanır, ≤ 50 MP, ≤ 2400 px,
  oran sapması ortadan kırpılır, JPEG. `memory_photos` şemaya uygun tutulur.
- Panel API `app/api/edit/[slug]/…` (yalnız `Authorization: Bearer`; `?k=` kabul edilmez), taslak yapı kontrolü (`lib/panel/draft.ts`;
  `record_kind`/`event_type` panelden değişmez), yeni bağımlılıklar sabit: `sharp 0.35.5`, `uqr 0.1.3`, dev `jsqr 1.4.0`.

**Test edildi**
- `npm test` 118/118 (yeni `tests/panel.test.ts` 21 test): anahtar iyi/yanlış/eksik/başka site/`?k=`/bilinmeyen slug, önizleme anahtarı
  düzenleyemez (durum, kayıt, foto, yayın, kaldırma hepsi 401); taslak kaydı (yayın kopyasına dokunmaz, 409, kilitli alanlar, yapı reddi,
  400/413/415); doğrulama mesajları + platform seçeneği; yükleme sınırları (boş, > 10 MB, SVG/GIF/HTML, bozuk JPEG, > 50 MP, bilinmeyen
  alan, anahtarsız; EXIF silinmesi, oran kırpma, 2400 px); yayınla (422 → düzelt → 200, genel sayfada isim + foto) / yayından kaldır (404);
  QR bağımsız okuyucu `jsqr` ile geri çözülüyor.
- `npm run typecheck` temiz; `npm run build` geçti (5 yeni rota).
- Tarayıcı: `npm run build && NODE_PATH=/opt/node22/lib/node_modules node tests/panel-browser.ts` — `next start` + Chromium 390 px
  (isMobile/touch), **59/59**: geçersiz linkler aynı 404 → edit linki → isimleri değiştir (otomatik kayıt) → program satırı → foto yükle +
  kırp (sunucu kopyası 4:5, EXIF yok) → hatalı son tarih yayını engeller, hata alanda → önizlemede yeni isim ve foto → yayınla → QR ekran
  görüntüsünden çözülünce genel URL → genel sayfada isim ve foto → misafir yanıtı panelde → "Publish changes" → offline 404 → yeniden yayın
  → masaüstünde yan yana önizleme; konsol hatası yok, 390 px'te yatay taşma yok. Çıktılar `platform/previews/g039/` (14 ekran görüntüsü,
  `panel_flow_390.mp4` 25 sn, `checks.json`). Mevcut `tests/rsvp-browser.ts` de yeniden koşuldu: 23/23.

**Test EDİLMEDİ / yapılmadı**
- Gerçek telefonda (iOS Safari, Android Chrome) denenmedi; yalnız Chromium mobil emülasyonu. QR telefon kamerasıyla okutulmadı.
  HEIC yalnız onu çözebilen tarayıcıda açılır (Chrome'da açık hata mesajı).
- Gerçek tema ile denenmedi: G038 (`blush-garden-rose`) paralel; testler `_sample` temasıyla. Panel tema bağımsız (foto alanları ve
  isteğe bağlı bloklar temadan okunuyor).
- Vercel'de çalıştırılmadı: fonksiyon gövde sınırı 4.5 MB (tarayıcı çıktısı ≤ 3.5 MB tutuluyor); `x-forwarded-host` ile genel adres
  ve `PLATFORM_PUBLIC_URL` gerçek alan adında denenmedi.
- Değiştirilen/silinen fotoğraflar depoda kalıyor (adaptörde `deletePhoto` yok); site başına yükleme kotası yok.
- Şemada serbest metin "travel", FAQ ve guest policy metin alanları yok → yalnız link + aç/kapa. İkinci isim silinemiyor.
  Düzenleme anahtarını yenileme ("yeni link") yok. Çakışma kontrolü local adaptörde atomik değil.

**Önerilen görevler** (entegratör açar): G043'te `deletePhoto` + öksüz foto temizliği, site başına yükleme kotası, koşullu UPDATE ile atomik
`baseUpdatedAt`; Supabase Storage'a imzalı doğrudan yükleme (Vercel 4.5 MB sınırı); düzenleme linkini yenileme; şemaya isteğe bağlı
`travel_note`/FAQ metinleri (docs/03 kararı gerekir); G044 sonrası gerçek telefonda panel + QR okutma testi.

### İnceleme düzeltmeleri (2026-10-13, bağımsız inceleme bulguları)
- Otomatik kayıt: yanıtı kaybolan kendi kaydı artık "başka cihaz" çakışması sayılmıyor (409 → kayıtlı taslak okunur, aynıysa devam);
  publish/unpublish kayıtlarla aynı sıradan gidiyor (yavaş yayın sırasında yazılan değişiklik sonra, doğru `updatedAt` ile).
  Yayın atomik: doğrulanan sürüm yayınlanıyor (`publish(id, {expectedUpdatedAt})`, `StaleSiteError` → 409).
- İlk isim değişince tam ad (davetiye kartı) da izliyor (boşsa / ilk isme eşitse). Demo kaydıyla aynı kalan değerler "Sample" ve
  "Before you publish" listesi (örnek metin, boş foto yerleri, linksiz bloklar) + "Publish anyway".
- Tema göstermediği alanı sormuyor (Monogram, "A few words", an sayısı). Önizleme sekmeleri yalnız açılan sayfalar, 44 px, sarıyor;
  telefonda gerçek modal (odak, `inert`, geri tuşu kapatır). Sabit çubuk odaklanan alanı örtmüyor; çubuk 360 px'te tek satır.
  Kırpma ekranında "Use this photo" kısa ekranda da görünür. Program/an "Remove" bir kez daha soruyor; taşımada odak satırı izliyor.
  Sayaçlar artık canlı bölge değil. Şekiller kelimeyle; "1 moment"; yanıtlarda "Show all".
- Yanıtlar: seç → "Remove selected", bekleyen (yoğunluk) yanıtlar için "Keep / Remove". Fotoğraflar yayına kadar herkese açık değil
  (küçük resimler önizleme anahtarıyla). `/edit` başlıkları: `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `no-referrer`.
- Test: `npm ci`, `npm test` (197/197), `npm run typecheck`, `npm run build` (+ yeni postbuild `trace-check`) temiz; `theme-check.cjs` 68/68, `panel-browser.ts` 72/72, `claim-browser.ts` 50/50, `rsvp-browser.ts` 25/25 (hepsi geçici klasöre, kayıtlı previews değişmedi); `tools/tests/*.py` 6/6. Gerçek telefon, gerçek Vercel/Blob ve canlı yayın **denenmedi**.
- Yapılmadı: `script-src` CSP (Next satır içi betikleri nonce ister); `deletePhoto` / öksüz foto temizliği (G043).

## Günlük
- 2026-10-13 alindi: wf-platform
- 2026-10-13 bitti, incelemeye gönderildi
- 2026-10-13 inceleme bulguları düzeltildi (kayıt sırası, kayıp yanıt, örnek metin uyarısı, tam ad, modal önizleme, erişilebilirlik) — wf-fix
