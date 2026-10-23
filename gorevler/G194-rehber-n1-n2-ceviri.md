---
id: G194
baslik: Rehber N1 ve N2 çevirisi — TR, DE, ES, FR + çevirilerde yeni iç linkler
rol: claude-metin
durum: inceleme
alan: claude-session-nice-faraday
oncelik: 1
bagimli: [G193]
yazar: [platform/content/guides/tr/, platform/content/guides/de/, platform/content/guides/es/, platform/content/guides/fr/, docs/36_ICERIK_PLANI.md, gorevler/G194-rehber-n1-n2-ceviri.md]
---

## Amaç
Kullanıcı (2026-10-22): "N1 ve N2'yi 4 dile çevir".

## Sonuç (2026-10-22, bulut oturumu)
- 8 dosya: `content/guides/{tr,de,es,fr}/{animated-envelope-wedding-invitations,wedding-rsvp-questions}.md`.
  Terimler mevcut çevirilerle aynı: TR "siz" + "LCV"; DE "Sie" + "RSVP" + "Ihrem Panel"; ES "tú" + "confirmación (RSVP)" +
  "tu panel"; FR "vous" + "RSVP" + "votre panneau", Fransız noktalama. Sayfa adları: Ana Sayfa/Hikâyemiz/Detaylar/LCV,
  Home/Our Story/Details/RSVP, Inicio/Nuestra historia/Detalles/RSVP, Accueil/Notre histoire/Détails/RSVP.
  Örnek tarih: 15 Mayıs 2027 / 15. Mai 2027 / 15 de mayo de 2027 / 15 mai 2027. Samimi örnek metinler "sen/du/tú/tu".
- Doğrulama (parseGuide): her çeviride İngilizceyle aynı 8 H2, 4 SSS, tablo (+N1'de kontrol listesi) ve **birebir aynı link
  kümesi**; kırık link yok; başlık ≤ 60, açıklama ≤ 160. Kelime sayısı dile göre 1.132–1.704.
- Mevcut çevirilerde (G1, G2, G5, G6 × 4 dil) İngilizcedeki G193 iç link cümlelerinin karşılıkları eklendi (16 cümle).
- Canlı build: 8 sayfa 200, `html lang` doğru, "This guide is available in English" uyarısı yok, Article `inLanguage` doğru,
  hreflang 5 dil + x-default.
- Testler: `npm test` 1689/1689 (0 hata, 0 atlanan), build temiz.
- Ana dili konuşan biri tarafından okunmadı (çeviriyi Claude yaptı; mevcut 24 çeviri de aynı yolla yapılmıştı).

## Günlük
- 2026-10-22 alindi: claude-session-nice-faraday
- 2026-10-22 inceleme: 8 çeviri + 16 iç link
