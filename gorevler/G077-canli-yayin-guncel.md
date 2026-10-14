---
id: G077
baslik: Canlıya güncel main — panel v2, satış sitesi, yeni temalar; canlı kontrol + kullanıcı için test linkleri
rol: claude-tarayici
durum: alindi
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

## Günlük
- 2026-10-14 açıldı (entegratör): kullanıcı isteği
- 2026-10-14 alindi: claude-local-1
