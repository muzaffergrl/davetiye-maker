---
id: G049
baslik: Canlıya inceleme düzeltmelerini yayınla + canlı kontrol betiklerini repoya al
rol: claude-tarayici
durum: hazir
alan:
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
4. Production'a yeniden yayın (`vercel deploy --prod`), sonra iki betiği canlıya karşı çalıştır; sonuçları Sonuç'a yaz.
5. Demo site `/clara-and-julian` canlıda en güncel temayla açılıyor mu (envelope → home → story → details → RSVP) — telefon boyutunda.

## Bitti sayılması için
- [ ] Canlı sürüm main ile aynı commit; canlı kontrol ve Blob duman testi geçti (çıktı Sonuç'ta)

## Sonuç
_(görevi yapan ajan doldurur)_
