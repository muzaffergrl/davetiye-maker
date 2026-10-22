---
id: G211
baslik: Rehber N15 ve N16 çevirisi — TR, DE, ES, FR + çevirilerde dalga 8 iç linkleri
rol: claude-metin
durum: inceleme
alan: claude-session-nice-faraday
oncelik: 1
bagimli: [G210]
yazar: [platform/content/guides/tr/, platform/content/guides/de/, platform/content/guides/es/, platform/content/guides/fr/, platform/tests/g206.test.ts, platform/previews/g211/, docs/36_ICERIK_PLANI.md, gorevler/G211-rehber-n15-n16-ceviri.md]
---

## Amaç
Kullanıcı (2026-10-22): "N15 ve N16'yı 4 dile çevir".

## Sonuç (2026-10-22, bulut oturumu)
- 8 dosya: `content/guides/{tr,de,es,fr}/{print-wedding-invitations-at-home,wedding-weekend-itinerary}.md`. Terimler önceki
  çevirilerle aynı; baskı terimleri yerel (taşma payı / Beschnitt / sangrado / fonds perdus; kesim işaretleri / Schnittmarken /
  marcas de corte / traits de coupe). Ölçüler inç ve mm ile; kâğıt ağırlığı yalnız g/m² (lb karşılığı İngilizcede kaldı).
  N16 örnek programı ve metinler her dilin saat biçiminde (19.00 / 19:00 Uhr / 19:00 / 19 h); misafir hitabı önceki
  çevirilerle aynı (TR siz, DE/ES/FR örnek mesajlarda samimi).
- Çevirilerde G210'un iç link cümleleri: N4 → N15, N12 → N15, N10 → N16, G4 → N16 × 4 dil (16 cümle; betik scratchpad
  `g210links.py`, bölüm sırası İngilizceden).
- Doğrulama: **22 rehberin 88 çevirisinin hepsinde** link kümesi, H2 ve SSS sayısı İngilizceyle aynı; jeton ve kaçış yok;
  başlık ≤ 60, açıklama ≤ 160 (FR N15 başlığı ve 4 açıklama kısaltıldı). `tests/g206.test.ts` matrisine N15 ve N16 eklendi.
- Build: 16 sayfa 200, tek H1, `html lang` ve Article `inLanguage` doğru, İngilizce uyarısı yok; dil listelerinde 22 rehber;
  390 px taşma 0 (`previews/g211/`). `npm test` 1711/1711 (0 hata, 0 atlanan), typecheck temiz.
- Ana dili konuşan biri tarafından okunmadı.

## Günlük
- 2026-10-22 alindi: claude-session-nice-faraday
- 2026-10-22 inceleme: 8 çeviri + 16 iç link
