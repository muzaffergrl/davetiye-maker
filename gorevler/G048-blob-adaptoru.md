---
id: G048
baslik: Vercel Blob veri adaptörü — Supabase'siz ilk canlı sürüm (siteler, RSVP, fotoğraflar)
rol: claude-kod
durum: bitti
alan: claude-kod-12
oncelik: 1
bagimli: [G037]
yazar: [platform/lib/data/blob/, platform/tests/]
---

## Amaç
Kullanıcı: "Supabase olmasa şimdilik olmaz mı?" — ilk canlı sürüm veriyi Vercel Blob'da tutar (`docs/10_SITE_PLATFORMU.md` §2c).

## Yapılacaklar
1. Adaptör arayüzünün `blob` uygulaması (`@vercel/blob`, sabit sürüm): siteler, slug/sipariş dizinleri, RSVP'ler (her biri ayrı dosya), fotoğraflar.
2. Yazma tutarlılığı: slug ve sipariş no için "önce dizin dosyasını koşullu yaz" (varsa reddet); site kaydında sürüm alanıyla iyimser kilit.
3. Ortam: `DATA_ADAPTER=blob` + `BLOB_READ_WRITE_TOKEN` (Vercel projesine Blob deposu bağlanınca otomatik gelir). Hiçbir anahtar repoya yazılmaz.
4. Testler: local adaptörle aynı sözleşme testleri, Blob istemcisi sahte (mock) ile.

## Bitti sayılması için
- [x] Sözleşme testleri blob adaptöründe geçiyor; `npm run build` temiz

## Sonuç
**Yapıldı (claude-kod-12, 2026-10-13).** Kod + testler; hiçbir Vercel projesi/deposu açılmadı, yayın yok.

- `platform/lib/data/blob/index.ts` — `BlobAdapter` (`kind: 'blob'`), sözleşmenin tamamı + `readPhoto`. `@vercel/blob` **2.8.0**
  (2026-08-10; bağımlılıkları `--before=2026-09-28` ile çözüldü, hepsi ≥ 2 hafta eski). Yerleşim: `sites/<id>.json` (+ `version`),
  `slugs/<slug>.json`, `orders/<no>.json`, `rsvps/<site>/<ms>-<sıra>-<id>.json` (her RSVP ayrı dosya), `media/<site>/<rastgele>.<uzantı>`.
- Tutarlılık: dizinler `allowOverwrite:false` ile "varsa yazma" (çakışma → dosya okunup doğrulanır; kendi yeniden denememiz sayılmaz;
  site yazılamazsa dizinler `ifMatch` ile geri silinir; sitesi olmayan dizin 15 dk sonra geri alınır). Site güncellemesi ETag
  `ifMatch` ile iyimser kilit; bayat yazma → taze veriyle yeniden (6 deneme) → `WriteConflictError`. JSON `useCache:false`
  (CDN gecikmesi yok). Yeni hatalar `OrderRefTakenError`, `WriteConflictError` (`lib/data/types.ts`).
- Gizlilik kararı: depo **private** olmalı (site kaydı + misafir verisi). Depo erişimi depo açılırken seçildiği için fotoğraflar da
  private; ziyaretçiye mevcut `/media/...` rotasından gider (doğrudan public Blob URL'si yok — bedeli: önbellekte olmayan foto
  isteği = fonksiyon çağrısı). Token yalnız ortamdan, adaptörde private alanda; log/hata/`inspect`'te yok.
- Seçim: `DATA_ADAPTER=blob` + `BLOB_READ_WRITE_TOKEN` (yoksa açık yapılandırma hatası); `local` varsayılan kaldı. Seed
  `getDataAdapter()` kullanıyor (blob'da da çalışır), `seedSite()` dışa açık; seed siteleri `orderRef: DEMO-SEED-<slug>`.
  G038'in seed değişiklikleri (blush-garden-rose varsayılanı, örnek foto yükleme, `seed-keys.json` alanları) korunarak birleştirildi;
  local seed (fotoğraflı + `_sample --no-photos --draft`) elle denendi.
- Testler: `tests/adapter.test.ts` sözleşme testleri artık **local + blob** (10 × 2); `tests/fake-blob.ts` bellek içi SDK sahtesi
  (gerçek SDK hata sınıfları; istemci tarafı hata metinleri gerçek SDK ile birebir karşılaştırılıyor); `tests/blob-adapter.test.ts`
  21 test: slug/sipariş yarışı (3 sunucu örneği), başarısız yazmada geri alma, öksüz dizin, kayıp yanıt, sürüm çakışmaları,
  silinmiş site, CDN gecikmesi, RSVP (eşzamanlı 30, sayfalı liste, aynı ms sırası), foto, token, `getDataAdapter`, `/start` yarışı →
  409, yayın → RSVP → özet/CSV, seed (fotoğraflı). 7 kasıtlı bozulmanın hepsini testler yakaladı; 15 tekrar koşuda dalgalanma yok.
  G038 ile birleştirildikten sonra `npm test` 178/178, `npm run typecheck` temiz, `npm run build` temiz; build'li `next start` + `DATA_ADAPTER=blob` (token yok) →
  site rotası 500 + yapılandırma mesajı (ağ çağrısı yok).
- **Denenmedi:** gerçek Vercel Blob (token/depo yok). Doğrulanmamış varsayımlar: `allowOverwrite:false` ve `ifMatch`'in sunucuda
  atomik olması; "already exists" hata metni (adaptör metne değil okumaya güvenir); bir deponun tek erişim türü olması; `list`'in
  yazmadan hemen sonra tutarlı olması (değilse 5 dk çift-yanıt kontrolü kaçabilir); yok olan dosyada `del`+`ifMatch`. Vercel
  OIDC + `BLOB_STORE_ID` yolu denenmedi. Gerçek gecikme/maliyet ölçülmedi.
- Yazma alanı dışı (çağıran ajanın talimatıyla / zorunlu): `platform/package.json`, `package-lock.json` (npm install ile),
  `lib/data/index.ts` (seçim), `lib/data/types.ts` (`kind`, iki hata sınıfı), `scripts/seed.ts`, `platform/README.md`
  (adaptör bölümü, ortam değişkenleri, açık konular), `docs/10` §2c (RSVP dosya adı, private depo, test durumu). Ayrıca küçük:
  `lib/claim/claim.ts` (`OrderRefTakenError` → `409 order_used`, iki satır) ve `app/media/[...path]/route.ts` (yorum satırı).
- Önerilen görevler: (1) G044'te gerçek **private** depo bağlanınca kısa canlı duman testi (slug yarışı, ETag çakışması, RSVP
  listesi, foto) — varsayımları doğrulamak için; (2) kalıcı hız sınırı (RSVP + `/start`) hâlâ süreç içi — Vercel Firewall kuralı
  ya da G043; (3) değiştirilen fotoğrafların temizliği (`deletePhoto` yok, blob'da da dosyalar kalır).

## Günlük
- 2026-10-13 alindi: claude-kod-12
- 2026-10-13 bitti, incelemeye gönderildi
- 2026-10-13 entegratör onayladı
