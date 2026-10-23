---
id: G966
baslik: Canlı izleme — saatlik salt okunur bkestudio.com kontrolü (GitHub Actions) + başarısızlıkta tek issue
rol: claude-kod
durum: inceleme
alan: claude-session_012jLH6SCFqEm45m7Yf9wdxm
oncelik: 2
bagimli: []
yazar: [.github/workflows/live-check.yml, platform/scripts/live-ping.mjs, platform/tests/live-ping.test.ts, platform/README.md, gorevler/G966-canli-izleme.md]
---

## Amaç
Canlı sitenin (bkestudio.com) çöktüğünü / sertifikasının bittiğini / yasal sayfada yer tutucu göründüğünü sahibi müşteriden önce
öğrensin. Veri yaratmayan, sır istemeyen bir kontrol.

## Sonuç
**2026-10-23 · durum: inceleme.** Dal `claude/adoring-gates-docs`.

- `platform/scripts/live-ping.mjs` (yalnız Node yerleşikleri: fetch, tls): `/`, `/start`, `/start/demo/olive-ivory`, `/privacy`,
  `/terms`, `/kvkk` → 200 + tam HTML; aynı kökte en çok 3 yönlendirme, başka host FAIL; `--max-ms` 10000 / `--warn-ms` 4000;
  TLS sertifikası doğrulanır, < 7 gün FAIL, < 21 gün WARN; yasal sayfaların görünen metninde köşeli parantezli yer tutucu FAIL (K56).
  `--allow-404 /terms,/kvkk`: bu sayfalar yayına çıkana kadar 404 WARN. `live-check.mjs` kullanılmadı: `@vercel/blob`, `sharp` ve
  TypeScript modülleri ister (npm ci gerekir), salt okunur kipi de demo site verisine bağlı.
- `.github/workflows/live-check.yml`: saatlik (dakika 23) + elle; seyrek/sığ checkout (yalnız betik), Node 22; izinler contents read,
  issues write; concurrency `live-check`. Başarısızlıkta etiketli (`canli-kontrol`) tek "Canlı kontrol başarısız" issue'su açılır;
  açıksa gövdesi son log'la güncellenir (saatlik bildirim yağmuru yok), kapalıysa yeniden açılıp yorum eklenir; geçince yorum + kapanır.
- Test: `tests/live-ping.test.ts` (6 test, yerel sahte HTTP sunucusu: izinli 404, 500, yer tutucu, yönlendirmeler, süre, kullanım).
  TLS yolu elle denendi (kendinden imzalı sertifika: 30 gün OK, 5 gün FAIL, güvenilmeyen FAIL). YAML python `yaml` ile okundu;
  github-script blokları sahte API ile denendi (aç / güncelle / yeniden aç / kapat).

### Yapılmadı / açık
- Gerçek bkestudio.com'a karşı koşturulamadı: bu ortamdan erişim yok (vekil 403; doğrudan DNS yok). İlk gerçek koşu main'e
  birleşince GitHub'da (zamanlanmış iş yalnız varsayılan daldaki dosyayla çalışır; Actions → Live check → Run workflow ile elle).
- `/terms` ve `/kvkk` canlıya çıkınca workflow'daki `--allow-404 /terms,/kvkk` kaldırılmalı.
- Demo yolu `/start/demo/olive-ivory` (Blob verisine bağlı değil); 01 satıştan kalkarsa başka bir tema yazılmalı.

## Günlük
- 2026-10-23 alındı + inceleme: claude-session_012jLH6SCFqEm45m7Yf9wdxm (docs rolü)
