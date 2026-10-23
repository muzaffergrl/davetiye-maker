---
id: G198
baslik: Rehber N5 ve N6 çevirisi — TR, DE, ES, FR + G3 çevirilerinin yeni yapıya getirilmesi + değişen linkler
rol: claude-metin
durum: inceleme
alan: claude-session-nice-faraday
oncelik: 1
bagimli: [G197]
yazar: [platform/content/guides/tr/, platform/content/guides/de/, platform/content/guides/es/, platform/content/guides/fr/, docs/36_ICERIK_PLANI.md, gorevler/G198-rehber-n5-n6-ceviri.md]
---

## Amaç
Kullanıcı (2026-10-22): "N5 ve N6'yı 4 dile çevir".

## Sonuç (2026-10-22, bulut oturumu)
- 8 dosya: `content/guides/{tr,de,es,fr}/{wedding-rsvp-deadline,guests-did-not-rsvp}.md`. Terimler G194/G196 ile aynı.
  Örnek takvim her dilde aynı günler (Cumartesi 12 Haziran 2027 → Cuma 21 Mayıs → Cuma 16 Nisan); mesaj örnekleri
  arkadaş tonunda (sen/du/tú/tu), telefon metni dahil.
- G3 çevirileri G197'deki İngilizce yapıya getirildi: yeni başlık/açıklama/hızlı yanıt, `updated`/`reviewed` 2026-10-22,
  "son tarih" + "hatırlatmalar" tek kısa bölüm (N5 ve N6'ya link), yeni "üç aydan az kaldıysa" bölümü.
- Değişen linkler çevirilere işlendi: G1 (2 link → N5), N2 (G3 → N5, adım 4 → N6), G5 (G3 link metni yeni başlığa göre).
- Doğrulama: **12 rehberin 48 çevirisinin hepsinde** link kümesi, H2 sayısı ve SSS sayısı İngilizceyle aynı; kırık link ve
  jeton yok; başlık ≤ 60, açıklama ≤ 160 (4 açıklama kısaltıldı); çevirinin `updated` tarihi İngilizceden eski değil.
- Build: N5, N6, G3 × 4 dil, 12 sayfa 200, tek H1, `html lang` ve Article `inLanguage` doğru, İngilizce uyarısı yok.
- Testler: `npm test` 1691/1691 (0 hata, 0 atlanan), build temiz.
- Ana dili konuşan biri tarafından okunmadı.

## Günlük
- 2026-10-22 alindi: claude-session-nice-faraday
- 2026-10-22 inceleme: 8 çeviri + G3 × 4 senkron + 16 link
