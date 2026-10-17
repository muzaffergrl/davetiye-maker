---
id: G174
baslik: G172 açık notları — misafir şifresi site başına küresel sınır, Etsy doğrulama sonucu önbelleği, yetim müzik parçalarının temizliği
rol: claude-kod
durum: inceleme
alan: claude-G174
oncelik: 1
bagimli: [G172]
yazar: [platform/lib/site/access.ts, platform/lib/site/gate.ts, platform/lib/etsy/verify.ts, platform/lib/etsy/order-cache.ts, platform/lib/claim/verify.ts, platform/lib/claim/claim.ts, platform/lib/panel/music.ts, platform/lib/data/types.ts, platform/lib/data/blob/index.ts, platform/lib/data/local/index.ts, platform/tests/g174-security.test.ts, platform/tests/claim.test.ts, gorevler/G174-guvenlik-takip.md]
---

## Amaç
G172 güvenlik incelemesinin açık bıraktığı üç notu (#6, #8, "Sonra: birleştirilmeyen müzik parçaları") en küçük değişiklikle
kapatmak + her biri için regresyon testi. Koordinatör: session_01HP9ZrJ8mhZnigbvsvUQ4pR. Durum dosyalarına,
`AGENTS.md`/`CLAUDE.md`'ye dokunulmadı. Yayın, main'e birleştirme, PR yok.

## Sonuç
**2026-10-17 · claude-G174 — durum: inceleme.** Dal `claude/g174-guvenlik-takip` (`claude/zealous-fermi-hy1o40` üstüne).

| # | Not (G172) | Değişiklik | Test |
|---|------------|------------|------|
| 1 | #6 Misafir şifresi: site başına çok-IP sınırı yoktu | `lib/site/access.ts` `ACCESS_LIMITS.wrongPerSite` = **300 yanlış / 60 dk / site** (tüm adresler); `lib/site/gate.ts` üç sayacı da önce `peek`, yanlışta `hit` eder (anahtar `access:wrong-site:<siteId>`, paylaşılan Blob sayacı — mevcut `getAccessRateLimiter` = `AdapterRateLimiter`). Aşılınca mevcut "Too many tries. Please wait {n} minutes…" sayfası (429 + Retry-After). Doğru şifre hiç sayılmaz; çerezi olan misafir hiç etkilenmez. Çeviriler (de/es/fr/tr) zaten vardı — yeni metin yok. | `g174-security` 1, 2 |
| 2 | #8 `etsy` modunda her `/start` POST'u Etsy API çağırıyordu | `lib/etsy/order-cache.ts` (yeni): tek belge `docs/<SHOP_DOC_ID>/etsy-order-cache.json`, anahtar `sha256(shopId + sipariş no)`, değer yalnız karar için gereken `ReceiptFacts` (bulundu mu, iptal/iade, ödendi, eşlenen tasarımlar, birim sayısı, alıcı e-postasının SHA-256'sı). Ödenmiş 10 dk, diğer (bulunamadı/ödenmemiş/iptal) 2 dk; Etsy hataları, "bağlı değil", "uygulama reddedildi" önbelleğe girmez. Süresi dolanlar her yazmada atılır, en çok 500 kayıt. Önbellek hatası = ıska (doğrulamayı asla bozmaz). `lib/etsy/verify.ts`: `evaluateReceipt` → `receiptFacts` + `decideFacts` (aynı kurallar). Önbellek yalnız `/start` (`OrderCheckInput.cached`, `claim.ts`) içindir; yeniden kontroller (admin, panel yoklaması, Yayınla) her zaman Etsy'ye sorar. Manuel/`off` modları değişmedi. Token, açık e-posta, sipariş no veya makbuz saklanmaz/loglanmaz. | `g174-security` 3, 4 |
| 3 | Birleştirilmeyen müzik parçaları Blob'da sonsuza dek kalıyordu | `DataAdapter.pruneUploadParts(siteId, before)` (blob: `parts/<site>/` listesinde `uploadedAt < before` olanları siler; local: dosya mtime). `lib/panel/music.ts`: her yeni dosyanın 0. parçasında (yetki + parça sınırından sonra) o sitenin **24 saatten eski** parçaları silinir; hata yüklemeyi engellemez. Süren yükleme dakikalar sürer → 24 saatin çok altında, silinmez. Cron yok/eklenmedi; site silme zaten tüm `parts/`'ı siliyordu. | `g174-security` 5, 6 |

### Bilinçli sınırlar / notlar
- #1: Site başına küresel sınır doğası gereği kilitlemeye de açıktır: bir botnet saatte 300 yanlış denemeyle o sitenin şifre
  formunu bir saat kapatabilir. Şifreyi zaten girmiş misafirler (90 gün çerez) etkilenmez; kaba kuvvet koruması bu bedele
  değer (4 karakterlik şifre mümkün). Gerçek düğün (150 misafir × birkaç yazım hatası, saatlere yayılmış) sınırın çok altında.
- #2: Önbellek alıcı e-postasını değiştirerek yapılan denemeleri de karşılar (Etsy'ye gitmez); kural kararı her denemede
  girilen e-posta/tasarımla yeniden verilir. Ödenmiş siparişin 10 dk içinde iptal edilmesi `/start`'ta en çok 10 dk geç
  görülür; yayın öncesi yeniden kontroller önbelleksizdir.
- #3: Temizlik fırsatçı: hiç yeni müzik yüklemeyen sitenin eski parçaları site silinene kadar kalır (G172'nin günlük parça
  sınırı bunu zaten sınırlıyor).
- `tests/claim.test.ts`: doğrulayıcıya giden girdinin beklenen değerine `cached: true` eklendi (tek satır).

### Değişen dosyalar
- `platform/lib/site/access.ts`, `platform/lib/site/gate.ts` — `wrongPerSite` sayacı.
- `platform/lib/etsy/order-cache.ts` (yeni), `platform/lib/etsy/verify.ts`, `platform/lib/claim/verify.ts`, `platform/lib/claim/claim.ts` — Etsy sonuç önbelleği.
- `platform/lib/data/types.ts`, `platform/lib/data/blob/index.ts`, `platform/lib/data/local/index.ts`, `platform/lib/panel/music.ts` — yetim parça temizliği.
- `platform/tests/g174-security.test.ts` (yeni, 6 test), `platform/tests/claim.test.ts` (1 satır).

### Kontroller
`cd platform && npm ci && rm -rf .next && npx tsc --noEmit && I18N_STRICT=1 npm test && npm run build` — tsc temiz; 1644 test,
1642 geçti, 0 hata, 2 atlandı (build çıktısı gerektiren mevcut testler); build + trace-check yeşil. `origin/claude/zealous-fermi-hy1o40`
birleştirildikten sonra (yalnız durum/görev dosyaları geldi, `platform/` değişmedi) aynı komutlar yeniden çalıştı: aynı sonuç.
Yeni `g174-security` testleri düzeltmesiz kodda kırılıyor (yeni modül/alanlar yok → yüklenmiyor).
