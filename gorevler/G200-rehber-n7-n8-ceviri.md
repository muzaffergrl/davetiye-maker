---
id: G200
baslik: Rehber N7 ve N8 çevirisi — TR, DE, ES, FR + çevirilerde dalga 4 iç linkleri
rol: claude-metin
durum: inceleme
alan: claude-session-nice-faraday
oncelik: 1
bagimli: [G199]
yazar: [platform/content/guides/tr/, platform/content/guides/de/, platform/content/guides/es/, platform/content/guides/fr/, platform/tests/g199.test.ts, docs/36_ICERIK_PLANI.md, gorevler/G200-rehber-n7-n8-ceviri.md]
---

## Amaç
Kullanıcı (2026-10-22): "N7 ve N8'i 4 dile çevir".

## Sonuç (2026-10-22, bulut oturumu)
- 8 dosya: `content/guides/{tr,de,es,fr}/{free-vs-paid-wedding-websites,wedding-website-our-story-examples}.md`. Terimler önceki
  çevirilerle aynı. N7'de rakip adı yok; kendi ürünümüz için "abonelik" karşılığı kullanılmadı (rakip modellerini anlatırken
  geçiyor). N8'deki "Her version / His version" her dilde ayırt edilebilir yazıldı (TR isimlerle, DE "Ihre/Seine Version",
  ES "la versión de ella/de él", FR "selon elle/selon lui"); örnek çiftler kurgu.
- Çevirilerde G199'un iç link cümleleri: G6 → N7, G1 (tablo) → N7, G2 → N8, G4 → N8 × 4 dil (16 cümle).
- Doğrulama: **14 rehberin 56 çevirisinin hepsinde** link kümesi, H2 ve SSS sayısı İngilizceyle aynı; kırık link ve jeton yok;
  başlık ≤ 60, açıklama ≤ 160 (6 açıklama kısaltıldı).
- Build'de bulunan hata: TR N8 başlığı frontmatter'da `\"…\"` kaçışıyla yazılmıştı ve sayfada ters eğik çizgi görünüyordu
  (ayrıştırıcı kaçışı çözmüyor). Tipografik tırnakla düzeltildi; `tests/g199.test.ts`'e her dilde başlık/açıklamada `\`
  olmamasını denetleyen test eklendi (hatayla çıkış 1, düzeltmeyle 0 olduğu denendi).
- Build: N7, N8 × 4 dil, 8 sayfa 200, tek H1, `html lang` ve Article `inLanguage` doğru, İngilizce uyarısı yok, jetonlar
  gerçek değerle (12 ay, 200 karakter, bkestudio.com/clara-and-julian).
- Testler: TEST_SONUCU
- Ana dili konuşan biri tarafından okunmadı.

## Günlük
- 2026-10-22 alindi: claude-session-nice-faraday
- 2026-10-22 inceleme: 8 çeviri + 16 iç link + kaçış testi
