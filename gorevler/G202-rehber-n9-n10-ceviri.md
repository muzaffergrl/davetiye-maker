---
id: G202
baslik: Rehber N9 ve N10 çevirisi — TR, DE, ES, FR + çevirilerde dalga 5 iç linkleri
rol: claude-metin
durum: inceleme
alan: claude-session-nice-faraday
oncelik: 1
bagimli: [G201]
yazar: [platform/content/guides/tr/, platform/content/guides/de/, platform/content/guides/es/, platform/content/guides/fr/, docs/36_ICERIK_PLANI.md, gorevler/G202-rehber-n9-n10-ceviri.md]
---

## Amaç
Kullanıcı (2026-10-22): "N9 ve N10'u 4 dile çevir".

## Sonuç (2026-10-22, bulut oturumu)
- 8 dosya: `content/guides/{tr,de,es,fr}/{wedding-website-faq-examples,destination-wedding-website-checklist}.md`. Terimler önceki
  çevirilerle aynı. Örnek yanıtlar her dilin misafir diliyle (TR siz, DE/ES/FR samimi "ihr/vosotros/vous"); saat biçimleri
  yerel (15.00 / 15:00 Uhr / 15:00 / 15 h). N10 örnek takvimi (11–13 Haziran 2027, Lizbon WEST UTC+1) her dilde aynı.
- Çevirilerde G201'in iç link cümleleri: G2 → N9, G4 → N9 ve N10, G3 → N10 × 4 dil (16 cümle).
- Doğrulama: **16 rehberin 64 çevirisinin hepsinde** link kümesi, H2 ve SSS sayısı İngilizceyle aynı; kırık link, jeton ve
  frontmatter kaçışı yok; başlık ≤ 60, açıklama ≤ 160 (TR N9 başlığı ve 3 açıklama kısaltıldı).
- Build: N9, N10 × 4 dil, 8 sayfa 200, tek H1, `html lang` ve Article `inLanguage` doğru, İngilizce uyarısı yok.
- Testler: `npm test` 1696/1696 (0 hata, 0 atlanan; build güncel), typecheck temiz.
- Ana dili konuşan biri tarafından okunmadı.

## Günlük
- 2026-10-22 alindi: claude-session-nice-faraday
- 2026-10-22 inceleme: 8 çeviri + 16 iç link
