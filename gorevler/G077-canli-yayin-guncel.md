---
id: G077
baslik: Canlıya güncel main — panel v2, satış sitesi, yeni temalar; canlı kontrol + kullanıcı için test linkleri
rol: claude-tarayici
durum: inceleme
alan: claude-local-1
oncelik: 1
bagimli: []
yazar: [docs/10_SITE_PLATFORMU.md, platform/README.md]
---

## Amaç
Kullanıcı (2026-10-14): "Vercel'de yayına alalım, bitince test edebilelim; ne durumdayız anlık görelim." Canlı (`davetiye-platform-five.vercel.app`)
G049'dan beri eski; main'de panel v2 (G060), satış sitesi (G061), yeni temalar ve marka var. Bu bir **test yayını**: satış yok,
kurgusal veri. Panel v2 ve satış sitesinin inceleme düzeltmeleri sürüyor; onlar gelince yeniden yayınlanır.

## Yapılacaklar
1. `git pull` (main). `platform/`: `npm ci`, `npm test`, `npm run typecheck`, `npm run build`. Kırmızı varsa yayınlama; Sonuç'a yaz.
2. Yayın G049 yöntemiyle: `git archive HEAD:platform` → temiz klasör → `vercel deploy --prod` (+ `--meta` commit). Ortam değişkeni
   ekleme/değiştirme yok; build yeni bir değişken isterse dur, adını yaz (değerini değil).
3. Demo siteler: `platform/themes/` altındaki her tema için (`_sample` hariç) demo siteyi Blob'a tohumla (seed betiğinin blob hedefi).
   Onaylı olmayan temalar (inceleme) da test için yayınlanır; Sonuç'ta hangilerinin onaysız olduğunu yaz.
4. `scripts/live-check.mjs` ve `scripts/blob-smoke.mjs` canlıya karşı. Geçici dosyaları temizle, demolara dokunma.
5. **Kullanıcı için test seti** (kurgusal veri, gerçek e-posta yok — `test@example.com` gibi):
   - Satış sitesi ana sayfa, tasarımlar, nasıl çalışır, SSS linkleri
   - Her tema için demo site linki (`/<slug>`)
   - `/start?theme=<tema>` ile bir **test sitesi** oluştur (sipariş no `TEST-<tarih>`), çıkan **düzenleme linkini** kullanıcıya ver;
     bu sitede misafir gibi 2–3 RSVP gönder ki Guests ekranı dolu görünsün.
6. Telefon boyutunda (390 px) satış sitesi, panel (sihirbaz, Edit, Guests, Share) ve bir demo sitenin ekran görüntüsü → Sonuç'a yol.
7. Sonuç: deployment ID/URL, commit, live-check/blob-smoke sayıları, test linkleri listesi, bilinen eksikler (inceleme düzeltmeleri
   gelmedi, e-posta yok, Etsy doğrulaması yok, gerçek telefon testi yok). `docs/10` §2c'ye kısa satır.

## Kurallar
Ödeme/plan/ekip ayarı yok; alan adı alma yok; şifre/anahtar yazma yok; yalnız kurgusal test verisi.

## Sonuç
**Yayın:** production = main **`db0eac7`** (platform ağacı `1f72af6309a2`; panel v2 + G060-fix, satış sitesi, G064 QA, 4 tema),
**`dpl_HkfyAujAQ9U7jHxuQ8CGAeqRYz7j`** (READY) → https://davetiye-platform-five.vercel.app . G049 yolu: `git archive HEAD:platform` → temiz
klasör → `vercel deploy --prod --meta gitCommit=db0eac7 --meta platformTree=1f72af6309a2`. Ortam değişkeni eklenmedi/değişmedi; build yeni
değişken istemedi (`MARKETING_SITE_URL` ve `PLATFORM_CONTENT_DIR` isteğe bağlı, yoksa `PLATFORM_PUBLIC_URL` / `content/`).
Önce `b289187` yayınlanmıştı (`dpl_3fUg7HxKhWPKWyccfenHRLmc4qWJ`; test 410/410, live-check 40/40, blob-smoke 12/12); iş sürerken main'e
G060-fix ve G064 geldi ("düzeltmeler gelince yeniden yayın") → aynı yoldan yeniden test edilip yayınlandı.

**Kontroller (db0eac7):** `npm ci` · `npm test` **427/427** (2 test build'e bağlı → build sonrası `marketing-build` 2/2) · typecheck ·
build (trace-check: 5 tema) — hepsi yeşil. Canlıda `live-check` **40/40** (yazma yolu dahil, geçici siteler silindi), 4 temalı salt-okuma
`live-check` **36/36**, `blob-smoke` **12/12**. Satış sayfaları, 4 demo, `/start/demo/<tema>` 200.

**Demo siteler (Blob, yeni kodla tohumlandı):** `/clara-and-julian` (03 Blush Garden Rose), `/avery-and-jordan` (01 Olive & Ivory),
`/margot-and-henry` (04 Vintage Airmail), `/isabella-and-marco` (05 Mediterranean Lemon). Anahtarlar yalnız yerel geçici klasörde.
**Onaysız temalar:** `vintage-airmail-love-letter` (G404 inceleme; satış sitesinde "coming", `/designs/...` 404) ve `mediterranean-lemon`
(G405 inceleme; satış sitesinde yok) — test için yayında.

**Kullanıcı test seti (kurgusal):** satış sitesi `/`, `/designs`, `/designs/blush-garden-rose`, `/designs/olive-ivory`, `/how-it-works`,
`/faq`, `/pricing`, `/features`, `/guides`; demolar yukarıda; test sitesi **`/lily-and-theo`** (`/start?theme=blush-garden-rose`, sipariş no
`20261014`, `test@example.com`, Lily & Theo; sihirbazla yayınlandı, 14 alan bilerek örnek metin). Düzenleme linki yalnız sohbette verildi
(repoda yok). Misafir gibi 3 RSVP: Olivia Testperson geliyor 2 kişi, Mia Sample geliyor 1 kişi, Noah Example gelmiyor → Guests: 3 geliyor,
1 gelmiyor, 3 yanıt.

**Ekran görüntüleri (390×844, DPR 3 → 585 px):** `docs/10_canli_test/` — 01 satış ana sayfa, 02 `/start`, 03 panel sihirbazı (geçici
`g077-sihirbaz` taslağı, sonra silindi), 05 Home, 06 Edit, 07 Guests, 08 Share, 09–10 Olive demo (zarf, home). Klasör `yazar` kapsamı dışı
(docs/10'un eki).

**Bilinen eksikler / notlar:**
- `/start` sipariş alanı yalnız 8–12 rakam kabul ediyor: `TEST-20261014` "Your Etsy order number has 8 to 12 digits" hatası verdi →
  `20261014` kullanıldı.
- Onaysız temalar `/start?theme=<id>` ile doğrudan sahiplenilebiliyor (form açılıyor); satış başlamadan kapatılmalı (öneri).
- E-posta yok ("We cannot email it to you yet"); Etsy sipariş doğrulaması yok; satış sitesinde `[BRAND]` yer tutucusu; platform
  sayfalarında favicon 404 (G063 B1); gerçek iPhone/Android testi yok (yalnız Chrome mobil emülasyonu); `/start` hız sınırı süreç içi.
- Windows: `tools/validate_content.py` karşılaştırma testi Python UTF-8 kipi kapalıyken kalıyor (`PYTHONUTF8=1` ile geçiyor); eski yerel
  `.next/` typecheck'i kırıyor — ikisi `platform/README.md`'ye not edildi. Yayın hâlâ arşiv yolundan (commit yazarı ekip üyesi değil).
- Test sitesi `/lily-and-theo` ve sipariş `20261014` kullanıcı denesin diye **silinmedi**; bitince silinmeli (live-check temizlik yolu).

## Günlük
- 2026-10-14 açıldı (entegratör): kullanıcı isteği
- 2026-10-14 alindi: claude-local-1
- 2026-10-14 bitti, incelemeye gönderildi
