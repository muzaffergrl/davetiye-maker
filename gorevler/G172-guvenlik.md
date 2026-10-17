---
id: G172
baslik: Güvenlik incelemesi — alıcı erişimi, panel/admin API, OAuth, e-posta, RSVP, yüklemeler, statik tema rotası; gerçek bulguların düzeltilmesi
rol: claude-kod
durum: bitti
alan: claude-G172
oncelik: 1
bagimli: [G146, G147, G151, G152, G159]
yazar: [platform/lib/panel/music.ts, platform/lib/admin/api.ts, platform/lib/admin/view.ts, platform/tests/g172-security.test.ts, gorevler/G172-guvenlik.md]
---

## Amaç
`platform/` içindeki erişim ve entegrasyon kodunun güvenlik incelemesi (gerçek istek yolları izlenerek), gerçek bulguların en
küçük değişiklikle düzeltilmesi + regresyon testi. Teorik olanlar not edildi, değiştirilmedi.
Koordinatör: session_01HP9ZrJ8mhZnigbvsvUQ4pR. Durum dosyalarına, `AGENTS.md`/`CLAUDE.md`'ye dokunulmadı.

## Sonuç
**2026-10-17 · claude-G172 — durum: inceleme.** Dal `claude/g172-guvenlik` (`claude/zealous-fermi-hy1o40` üstüne). Yayın, main'e
birleştirme, PR yok. Kritik / yüksek bulgu yok; 3 düşük–orta bulgu düzeltildi, 11 madde bilinçli kabul / not.

### Bulgular

| # | Bulgu | Saldırı yolu | Önem | Durum | Test |
|---|-------|--------------|------|-------|------|
| 1 | **Müzik yüklemesinde parça sınırı yoktu.** Günlük yükleme sınırı ve dosya sayısı yalnız `x-upload-part: 0`'da sayılıyordu; 1., 2. parça her yeni `x-upload-id` ile sınırsız saklanıyor, birleştirilmeyen parçalar silinmiyordu. | Doğrulama kapalıyken (`off`/`manual`) herkes `/start` ile bir site + anahtar alır → `POST /api/edit/<slug>/music` `part=1, parts=3`, 3,5 MB, her seferinde yeni id → Blob'da sınırsız depolama (maliyet DoS). | Orta (maliyet) | **Düzeltildi** — `lib/panel/music.ts`: her parça `upload:part:<site>` sayacına girer, `MUSIC_PARTS_PER_DAY` = günlük yükleme × en çok parça (180/gün); aşılınca 429, gövde okunmaz/saklanmaz. Gerçek kullanıcı etkilenmez. | `g172-security` #1 |
| 2 | **Admin girişinde adres sınırı IPv6'yı /64'e indirmiyordu** (`clientIp` ham). | Tek bir /64 sahibi her denemede yeni adres kullanarak adres başına 8/15 dk sınırını atlar (genel 40/saat sınır yine tutuyordu). | Düşük | **Düzeltildi** — `lib/admin/api.ts`: `ipBucket(clientIp(req))` (diğer tüm sınırlar gibi). | `g172-security` #2 |
| 3 | **Sipariş CSV'sinde formül koruması zayıftı:** yalnız ilk karakter kontrol ediliyordu; `"  =HYPERLINK(…)"` (alıcının mekân adı vb.) korunmuyordu. Çiftin CSV'si (`csvCell`) bunu zaten yapıyordu. | Alıcı mekân/isimleri baştaki boşlukla formül olarak yazar → dükkân admin'den "CSV indir" → tablo programı. | Düşük | **Düzeltildi** — `lib/admin/view.ts ordersCsv`: `csvCell` kuralı (baştaki boşluk/satır sonundan sonra da). | `g172-security` #3 |
| 4 | `/api/my/continue` "bu sipariş için site yok" (200 `next: start`) ile "site var, e-posta yanlış" (403) ayrışıyor; özel temalı siparişte `startPath` tema id'sini veriyor. | Sipariş no tahmini ile hangi siparişlerin site açtığı öğrenilir (IP başına 10/15 dk). | Bilgi | Kabul — K46/G151 tasarımı (sipariş no = anahtar; site yoksa `/start`'a yönlendirme gerekli). | — |
| 5 | Doğrulama `off`/`manual` iken sipariş no + e-postayı bilen herkes girer / kullanılmamış siparişi kapar. | — | Bilinen | Kabul — docs/10 §3a "Bilinen sınır"; `etsy` modu açılınca kapanır. | — |
| 6 | Misafir şifresi: site başına genel (çok-IP) deneme sınırı yok (IP başına 10/15 dk, adres başına 30/15 dk). | Botnet ile tek düğün sitesine dağıtık şifre denemesi. | Düşük (teorik) | Not — gerekiyorsa site başına küresel sayaç eklenebilir. | — |
| 7 | Admin girişi genel sınırı (40/saat) aynı zamanda kilitleme: saldırgan saatte 40 yanlış denemeyle dükkânın girişini engelleyebilir. | — | Düşük (kullanılabilirlik) | Kabul — kaba kuvvet koruması bilinçli tercih; lansman öncesi kısa şifre (K33) için gerekli. | — |
| 8 | `etsy` modunda her `/start` POST'u bir Etsy API çağrısı → çok IP'den Etsy günlük kotası tüketilebilir (gerçek alıcı `503 verification_unavailable` görür). | — | Düşük (teorik) | Not — gerekirse sipariş no başına doğrulama sonucu kısa süre önbelleğe alınabilir. | — |
| 9 | Özel temanın (G151) CSS/görselleri `/themes/<id>/…` (ve `public/themes/`) üzerinden herkese açık; id bilinirse varlığı görülür. | Tema id'sini tahmin et → 200/404. | Bilgi | Kabul — alıcı sitesi yayınlanınca bu dosyalar zaten herkese açık olmak zorunda; `/start`, `/my`, liste ve API sızdırmıyor (doğrulandı). | — |
| 10 | `PLATFORM_PUBLIC_URL` tanımsızken e-postadaki / API'deki linkler istek `Host`/`x-forwarded-host`'tan kurulur. | Vercel'de Host projeye yönlenen alan adı olmak zorunda, `x-forwarded-host`'u Vercel yazar → pratikte sömürülemez. | Bilgi | Not — üretimde `PLATFORM_PUBLIC_URL` tanımlanmalı (kod zaten uyarı logluyor). | — |
| 11 | Admin oturum çerezi durumsuz (12 saat); "Çıkış" yalnız çerezi siler, çalınan çerez süresince geçerli. | Çerez HttpOnly + SameSite=Strict + Secure. | Düşük | Kabul — şifre değişince tüm oturumlar düşer. | — |
| 12 | `/api/start/slug` alınmış adresleri (taslak dahil) söyler. | Adres = herkese açık site adresi. | Bilgi | Kabul. | — |
| 13 | `/api/my/signin-link` ve `/start` e-postaları istek `origin`'iyle link kurar. | #10 ile aynı; ayrıca e-posta yalnız kayıtlı sahibe gider. | Bilgi | Kabul. | — |
| 14 | `sharp` yüklenemezse foto EXIF'iyle saklanır (`preparePhoto` geri düşüşü). | `sharp` bağımlılıkta (0.35.5) ve Vercel'de yüklü; geri düşüş yalnız yerel/test. | Bilgi | Not. | — |

### Temiz bulunanlar (izlendi, bulgu yok)
- **Tek kontrol noktası** `editAccess` (owner · shop · device) → `editorAccess/authorizeEditor`: `app/api/edit/**` (taslak, foto,
  müzik, yayın/geri alma, misafir şifresi, palet, kimlik, harita linki, cihazlar, bildirim, Google, PDF), RSVP liste/işlem/CSV/Excel,
  `/edit/<slug>` sayfası — hepsi yetkili; panel API yalnız `Authorization: Bearer` (CSRF yok), RSVP indirmeleri ayrıca `?k=`.
  Yanlış anahtar ile bilinmeyen slug aynı 401/404. Dükkân anahtarı cihazları kapatamaz, bildirim ayarını değiştiremez.
- **Cihaz anahtarları:** 32 bayt rastgele, yalnız SHA-256, sabit zamanlı karşılaştırma (tüm girişler taranır), anahtar kuşağına bağlı
  (reissue anında öldürür), en çok 10. E-posta karşılaştırması normalize + sabit zamanlı. Loglarda anahtar/e-posta/sipariş no yok.
- **`/start` + kullanılmış sipariş, çok birimli sipariş (G152), yeniden deneme belirteci:** sipariş başına 6/saat ortak sayaç,
  birim yarışı blob dizin dosyasıyla korunuyor; yeniden deneme yalnız aynı claim token + aynı e-posta + yayınlanmamış taslak + 24 saat.
- **Özel tema (G151):** `/start`, `/api/start`, `/my` seçici, demo (admin oturumu), satış sitesi — bilinmeyen temayla aynı cevap.
- **Admin:** HMAC oturum çerezi (HttpOnly, SameSite=Strict, Secure), yazmalarda Origin kontrolü, sabit zamanlı şifre, sayfalarda
  sunucu tarafı oturum kapısı (`AdminPage`, `adminPageState`).
- **Etsy OAuth:** state (çerez = parametre = saklanan hash, 10 dk, tek kullanım, sabit zamanlı) + PKCE S256; tokenlar AES-256-GCM
  (HKDF ile türetilmiş anahtar); loglarda yalnız hata kodu. **Google OAuth:** state çerez + site belgesinde hash, tek kullanım;
  refresh token site id'si AAD'li AES-GCM.
- **SMTP:** alıcı adresi tek adres regex'i (CR/LF, virgül yok), konu `oneLine`, HTML kaçışlı; nodemailer logları kapalı,
  hata yalnız kodla.
- **RSVP:** IP + site + depolanan yanıt sınırları (paylaşılan sayaç), honeypot, gövde sınırı, şüpheli hacim "held";
  CSV formül koruması (`csvCell`), Excel (exceljs düz metin) ve Sheets (`stringValue`) formül çalıştırmaz.
- **Yüklemeler:** foto tipi baytlardan (SVG/HTML/GIF yok), `sharp` ile yeniden kodlama (EXIF silinir), piksel sınırı; müzik imza +
  beyan edilen tip; Blob `private`, yalnız `/media` rotasıyla (yayınlanmış içerikte kullanılan dosya / önizleme jetonu / misafir çerezi).
- **Statik tema rotası:** segment kontrolü (`..`, `/`, `\`, NUL, nokta ile başlayan), `realpath` kök öneki, yalnız izinli uzantılar,
  `img/variants/` doğrudan kapalı, `~variant` yeniden yazımı `VARIANT_ID_RE` ile; SVG'ye kısıtlayıcı CSP.
- **Başlıklar:** misafir sitesi CSP (`script-src 'self'` + şablon hash'leri, satır içi olay yok, `base-uri 'none'`), site-data JSON'u
  `<`/`>`/`&` kaçışlı; `/edit`, `/start`, `/my`, `/admin` `frame-ancestors 'none'` + `no-referrer`; API cevapları `no-store`.
- **Açık yönlendirme:** slug/ics yönlendirmeleri yalnız yol; `/my` yapıştırılan link aynı köken + `/edit/<slug>?k=`;
  `google-return.js` yalnız `/edit/<slug>?k=…` kalıbı. Harita linki: yalnız listelenmiş kısaltıcı/harita alan adları, 3 adım, `redirect: manual`
  (SSRF yok). PDF: Chromium istekleri yalnız `print.invalid` + Google Fonts; başka her şey `abort`.
- **İstemci IP'si:** Vercel `x-forwarded-for`'u kendisi yazar (istemci değeri ezilir), ilk değer alınıyor; IPv6 /64'e indiriliyor.

### Değişen dosyalar
- `platform/lib/panel/music.ts` — `MUSIC_PARTS_PER_DAY`, her parçada sayaç (429 `upload_limit`).
- `platform/lib/admin/api.ts` — admin giriş sayacı `ipBucket`.
- `platform/lib/admin/view.ts` — `ordersCsv` formül kuralı = `csvCell`.
- `platform/tests/g172-security.test.ts` — 3 regresyon testi (üçü de düzeltmesiz kodda kırılıyor, doğrulandı).

### Kontroller
`cd platform && npm ci && rm -rf .next && npx tsc --noEmit && I18N_STRICT=1 npm test && npm run build` — tsc temiz; 1638 test, 1636 geçti, 0 hata, 2 atlandı (build çıktısı gerektiren mevcut testler; build test sonrası çalıştı); build + trace-check yeşil.

### Sonra / açık
- #6 (misafir şifresi küresel sayaç) ve #8 (Etsy doğrulama sonucu önbelleği) istenirse ayrı görev.
- Birleştirilmeyen müzik parçaları site silinene kadar kalır; günlük sınır artık bunu sınırlıyor, temizlik (ör. 1 günden eski
  `parts/`) istenirse ayrı görev.
- Üretimde `PLATFORM_PUBLIC_URL` tanımlı olmalı (#10).

## Günlük
- 2026-10-17 entegratör onayladı
