---
id: G196
baslik: Rehber N3 ve N4 çevirisi — TR, DE, ES, FR + çevirilerde dalga 2 iç linkleri
rol: claude-metin
durum: inceleme
alan: claude-session-nice-faraday
oncelik: 1
bagimli: [G195]
yazar: [platform/content/guides/tr/, platform/content/guides/de/, platform/content/guides/es/, platform/content/guides/fr/, docs/36_ICERIK_PLANI.md, gorevler/G196-rehber-n3-n4-ceviri.md]
---

## Amaç
Kullanıcı (2026-10-22): "N3 ve N4'ü 4 dile çevir".

## Sonuç (2026-10-22, bulut oturumu)
- 8 dosya: `content/guides/{tr,de,es,fr}/{wedding-website-vs-invitation,wedding-website-on-invitation}.md`. Terimler G194 ile
  aynı (TR siz + LCV, DE Sie + RSVP + Panel, ES tú + confirmación/RSVP + tu panel, FR vous + RSVP + votre panneau).
  Kopyalanabilir metinler her dilin davetiye diliyle yazıldı (ör. "Se ruega confirmación", "Merci de bien vouloir répondre",
  "Wir bitten um Ihre Antwort"). Örnek adres `{{domain}}/clara-and-julian` jetonuyla.
- Çevirilerde G195'in İngilizce iç link cümleleri: G2, G3, G4, N1, N2 × 4 dil (20 cümle).
- Doğrulama: **10 rehberin 40 çevirisinin hepsinde** link kümesi İngilizceyle birebir aynı, kırık link ve doldurulmamış jeton
  yok; N3/N4 çevirilerinde H2 sayısı ve 4 SSS aynı. Başlık ≤ 60, açıklama ≤ 160 (TR/DE N3 başlığı ve 5 açıklama kısaltıldı).
- Build: N3/N4 × 5 dil, 10 sayfa 200, tek H1, `html lang` ve Article `inLanguage` doğru, İngilizce uyarısı yok,
  N4'te "bkestudio.com/clara-and-julian".
- Testler: `npm test` 1691/1691 (0 hata, 0 atlanan; g195 testi dahil), build temiz.
- Ana dili konuşan biri tarafından okunmadı.

## Günlük
- 2026-10-22 alindi: claude-session-nice-faraday
- 2026-10-22 inceleme: 8 çeviri + 20 iç link
