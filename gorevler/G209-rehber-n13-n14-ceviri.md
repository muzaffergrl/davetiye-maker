---
id: G209
baslik: Rehber N13 ve N14 çevirisi — TR, DE, ES, FR + çevirilerde dalga 7 iç linkleri
rol: claude-metin
durum: inceleme
alan: claude-session-nice-faraday
oncelik: 1
bagimli: [G208]
yazar: [platform/content/guides/tr/, platform/content/guides/de/, platform/content/guides/es/, platform/content/guides/fr/, platform/tests/g206.test.ts, platform/previews/g209/, docs/36_ICERIK_PLANI.md, gorevler/G209-rehber-n13-n14-ceviri.md]
---

## Amaç
Kullanıcı (2026-10-22): "N13 ve N14'ü 4 dile çevir".

## Sonuç (2026-10-22, bulut oturumu)
- 8 dosya: `content/guides/{tr,de,es,fr}/{bilingual-wedding-website,wedding-website-after-the-wedding}.md`. Terimler önceki
  çevirilerle aynı. N13'ün dil tablosu her dilde aynı satırlar (dil adları okurun dilinde; örnek tarih ve saatler o dilin
  biçiminde değil, tablodaki her dilin kendi biçiminde, İngilizceyle aynı). Teşekkür mesajı örnekleri her dilin misafir
  diliyle (TR siz, DE/ES/FR samimi örneklerde "ihr/vosotros/vous").
- Çevirilerde G208'in iç link cümleleri: N10 → N13, G2 → N13, G3 → N14, N11 → N14 × 4 dil (16 cümle).
- Doğrulama: **20 rehberin 80 çevirisinin hepsinde** link kümesi, H2 ve SSS sayısı İngilizceyle aynı; jeton ve kaçış yok;
  başlık ≤ 60, açıklama ≤ 160 (FR N13 başlığı ve 5 açıklama kısaltıldı). `tests/g206.test.ts` matrisine N13 ve N14 eklendi
  (her dilde).
- Build: 16 sayfa 200, tek H1, `html lang` ve Article `inLanguage` doğru, İngilizce uyarısı yok; dil listelerinde 20 rehber;
  390 px taşma 0 (`previews/g209/`). `npm test` 1708/1708 (0 hata, 0 atlanan), typecheck temiz.
- Ana dili konuşan biri tarafından okunmadı.

## Günlük
- 2026-10-22 alindi: claude-session-nice-faraday
- 2026-10-22 inceleme: 8 çeviri + 16 iç link
