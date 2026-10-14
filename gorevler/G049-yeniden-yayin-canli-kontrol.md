---
id: G049
baslik: Canlıya inceleme düzeltmelerini yayınla + canlı kontrol betiklerini repoya al
rol: claude-tarayici
durum: inceleme
alan: claude-local-1
oncelik: 1
bagimli: [G044]
yazar: [platform/scripts/live-check.mjs, platform/scripts/blob-smoke.mjs, platform/scripts/seed.ts, platform/README.md, docs/10_SITE_PLATFORMU.md]
---

## Amaç
Canlı site (https://davetiye-platform-five.vercel.app) inceleme öncesi kodla çalışıyor; edca755 + 8607926 (platform inceleme
düzeltmeleri, 197/197 test) yayınlanmadı. Local oturum yayınlar ve canlıda doğrular.

## Yapılacaklar
1. `git pull`; `cd platform && npm ci && npm test && npm run build` (yerelde geçmeli).
2. G044'teki canlı uçtan uca ve gerçek Blob duman testi betiklerini `platform/scripts/live-check.mjs` ve `platform/scripts/blob-smoke.mjs`
   olarak repoya al (anahtar/URL değerleri ortam değişkeninden; repoya değer yazılmaz).
3. `seed.ts`: Windows'ta `python3` yoksa `python`/`py -3` dene.
4. Vercel'de `PLATFORM_PUBLIC_URL=https://davetiye-platform-five.vercel.app` (Production + Preview) ortam değişkenini ekle
   (og:image ve .ics mutlak adresleri için). Sonra production'a yeniden yayın (`vercel deploy --prod`), sonra iki betiği canlıya karşı çalıştır; sonuçları Sonuç'a yaz.
5. Demo site `/clara-and-julian` canlıda en güncel temayla açılıyor mu (envelope → home → story → details → RSVP) — telefon boyutunda.

## Bitti sayılması için
- [ ] Canlı sürüm main ile aynı commit; canlı kontrol ve Blob duman testi geçti (çıktı Sonuç'ta)

## Sonuç
**Yapıldı (claude-local-1, 2026-10-14).** Ayrıntı: `docs/10` §2c "Yeniden yayın (G049)".

- [x] **Canlı = main:** production `dpl_2wNCu8cwSnw4PcWpQ2pTqcGjbdTC` = main `59b1291`, platform ağacı `f9ff114cfa65` (sonraki main commit'leri
  — G059 ilan kiti — platforma dokunmadı; ağaç özeti aynı). Adres https://davetiye-platform-five.vercel.app.
- [x] **Canlı kontrol 41/41, Blob duman testi 12/12** (çıktı özeti `docs/10` §2c; geçici siteler ve smoke dosyaları silindi, demo dokunulmadı).
- 1. `npm ci`, `npm test` **299/299** (Windows'ta, 0 atlanan), typecheck, build + trace-check temiz.
- 2. Betikler repoda: `platform/scripts/live-check.mjs`, `platform/scripts/blob-smoke.mjs` (değerler ortamdan; anahtar/token yazdırılmaz;
  README "Canlı kontroller"). İki bağımsız inceleme ajanı + çürütme turu: 17 bulgudan 14'ü doğrulandı ve hepsi uygulandı (temizlik kimlikle +
  kalan dosya silme + eski koşu süpürme + SIGINT, zaman aşımı, https, anahtar yalnız genel adrese, hata metni ayıklama, ikinci `/start`
  isteği yalnız 201 sonrası, RSVP tarihleri bugüne göre, `--no-claim`, 429 = LIMIT, ham dizin kontrolleri).
- 3. `seed.ts` için değişiklik gerekmedi: G056 fotoğraf küçültmeyi `sharp`'a taşıdı, seed artık Python çağırmıyor.
- 4. `PLATFORM_PUBLIC_URL=https://davetiye-platform-five.vercel.app` Production + Preview'a eklendi; production'a yeniden yayın yapıldı.
  og:image ve `.ics` bu adresle (betik, base = genel adres olduğunda ayarın eksikliğini ayırt edemediğini açıkça yazar).
- 5. Telefon boyutunda (375×812) zarf → home → story → details → RSVP ve `/start?theme=blush-garden-rose|olive-ivory` görsel olarak kontrol
  edildi; içerik tam. (Uygulama içi tarayıcı paneli gizliyken animasyonlar duraklıyor — ilk ekran görüntüleri boş çıkıyordu; sayfa `load` 0,5 sn.)
- **Bulunan ve düzeltilen (yazma alanı dışı, gerekçeli):**
  - Blob adaptörü: gerçek depo üst üste binen koşullu yazmalarda `412` yerine düz `BlobError("… conflicting operation …")` dönüyor;
    `mutate` ve `claimIndex` bunu yeniden denemiyordu (8 eşzamanlı güncellemeden 1'i hatayla düşüyordu). `lib/data/blob/index.ts`
    `looksLikeConcurrentWrite`; `tests/blob-adapter.test.ts` +2 test (düzeltmesiz ikisi de kırılıyor). Canlıda sonra 8/8.
  - `tests/g055-review.test.ts`: `path.relative` Windows'ta `\` veriyordu → `/`'ye çevrildi (yalnız test).
- **Yayın engeli (kullanıcı kararı):** Pro ekipte commit yazarı ekip üyesi değilse CLI yayını `BLOCKED` (`dpl_BgNBxoWYAdD5bf38BFqsZefyYJzu`).
  Kullanıcı "commit'in birebir kopyasını yayınla"yı seçti: `git archive HEAD:platform` → temiz klasör → `vercel deploy --prod` (+ `--meta
  gitCommit`, `platformTree`). Kalıcı çözüm kullanıcıda (commit kimliği ya da ekip ayarı).
- **Windows / yerel ortam:** `core.autocrlf=true` CRLF yüzünden canlıya main'den farklı baytlar gidiyordu ve `site.js` bütçe testi kalıyordu →
  yerel kopya LF'ye alındı. `python3` komutu yoktu (4 Python eşlik testi atlanıyordu) → bu makinede `python3.exe` eklendi.
- **Denenmedi:** gerçek iOS/Android cihaz, çok örnekli hız sınırı davranışı, yük/maliyet.
- **Önerilen görevler:** (1) repoya `.gitattributes` (`* text=auto eol=lf`) — Windows ajanları için; (2) Vercel yayın kimliği kararı (commit
  yazarı / ekip ayarı) — kullanıcı; (3) kalıcı hız sınırı (RSVP + `/start`, süreç içi bellek) — eski öneri, hâlâ açık.

## Günlük
- 2026-10-14 alindi: claude-local-1
- 2026-10-14 bitti, incelemeye gönderildi
