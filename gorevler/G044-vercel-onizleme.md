---
id: G044
baslik: Vercel önizleme yayını (demo site + panel)
rol: claude-tarayici
durum: inceleme
alan: claude-local-1
oncelik: 2
bagimli: [G048]
yazar: [platform/vercel.json, docs/10_SITE_PLATFORMU.md]
---

## Amaç
Kullanıcı demo siteyi ve paneli telefonundan açabilsin. Kullanıcı onay verdi (2026-10-13: "aç projeleri"). Bulutun Vercel bağlantısı proje açamadığı (403) için **local oturumda** yapılır: adımlar `docs/12_LOCAL_KURULUM.md` §3. Supabase yok; veri Vercel Blob (G048).

## Sonuç
**Yapıldı (claude-local-1, 2026-10-13).** Ayrıntı ve kimlikler: `docs/10_SITE_PLATFORMU.md` §2c "Canlı (G044)".

- Vercel CLI `vercel@60.1.3` (2026-09-26; sabit sürüm, global), giriş: kullanıcı cihaz onayı, `vercel whoami` = `daimonflora-8395`.
- Proje `davetiye-platform` (`prj_WRKdVHmsou7QU2B5UhgO8uksAobj`), ekip `daimonflora-gmailcoms-projects`, `iad1`.
  Private Blob deposu `davetiye-platform-data` (`store_91tcR2Y0pohygoAO`) Production/Preview/Development'a bağlı.
  Ortam değişkeni adları: `BLOB_READ_WRITE_TOKEN`, `DATA_ADAPTER` (=blob; Production + Preview). Değerler hiçbir yere yazılmadı.
- Yayın: `dpl_3XgfvmC2YCrnXVtmBg6U7npTZQWB` → **https://davetiye-platform-five.vercel.app** (herkese açık production takma adı).
  Not: projenin ilk `vercel deploy`'u Vercel tarafından otomatik production'a atandı ("önce preview" adımı bu yüzden ayrı bir
  preview olarak oluşmadı; aynı derleme). Sonraki yayınlar preview olur; deployment'a özel URL'ler Vercel girişi ister.
- Demo tohumu: `/clara-and-julian` blob deposunda, yayında; fotoğraflar seed'in Pillow ayarıyla (1600 px, q84) önceden küçültüldü
  (Windows'ta `python3` komutu yok — seed onu arıyor). Panel linki kullanıcıya sohbette verildi; anahtar repoda yok.
- **Bulunan hata (G048 alanı, düzeltildi):** gerçek depo büyük JSON okumalarında zayıf ETag (`W/"…"`) döndürüyor, `ifMatch` güçlü
  ETag istiyor → her güncelleme/yayın `WriteConflictError` ile düşüyordu (canlıda panel kaydı ve "Publish" çalışmazdı).
  `platform/lib/data/blob/index.ts` `readJson`: `W/` önekini atar. `platform/tests/fake-blob.ts`: `weakEtagMinBytes` (varsayılan 1024)
  ile gerçek davranışı taklit eder — düzeltmesiz 10 test kırılıyor, düzeltmeyle `npm test` 177/178 (1 atlandı), typecheck temiz.
- Testler: gerçek depoda duman testi (yarışlar, sunucu koşulları, eşzamanlı yazma, RSVP, foto, gizlilik 403, temizlik) — düzeltme
  sonrası 11/11, 11/11, 10/11 (bir koşuda 8 yazmadan 1'i adı alınamayan geçici hatayla düştü; kayıp yazma yok; tekrarlanmadı).
  Canlı uçtan uca 30/30 (sayfalar, foto, panel, kaydet/409, foto yükleme, yayın, RSVP, liste, CSV, `/start` 201/409). Betikler repoda
  değil (oturumun geçici klasöründe); önerilen görev: bunları `platform/scripts/live-check.*` olarak repoya almak.
- Yazma alanı dışı (zorunlu, gerekçeli): `platform/next.config.ts` (panel/RSVP/start rotalarına tema dosyası izleme — README
  "G044'te eklenmeli"), `platform/.vercelignore` (yerel `.data` anahtarları yüklenmesin), `platform/.gitignore` (`.vercel`, `.env*` —
  `vercel link` ekledi), `platform/lib/data/blob/index.ts` + `platform/tests/fake-blob.ts` (yukarıdaki hata).
- Denenmedi: gerçek telefon, Vercel'de çok örnekli hız sınırı (süreç içi kaldı), maliyet/yük, Git bağlantılı yayın.
- Önerilen görevler: (1) kalıcı hız sınırı (RSVP + `/start`; Vercel Firewall ya da Blob/KV); (2) `seed.ts`'in Windows'ta `python`
  araması; (3) canlı kontrol betiklerinin repoya alınması; (4) `PLATFORM_PUBLIC_URL` ve alan adı kararı (kullanıcı).

## Günlük
- 2026-10-13 blokaj: Vercel projesi açmak için kullanıcı onayı bekleniyor
- 2026-10-13 hazir: kullanıcı onayı geldi; local oturuma (claude-tarayici) taşındı, G048'e bağlı
- 2026-10-13 G048 onaylandı; G038 incelemesi sürerken önizleme yayını yapılabilir (bağımlılık yalnız G048)
- 2026-10-13 alindi: claude-local-1
- 2026-10-13 bitti, incelemeye gönderildi
