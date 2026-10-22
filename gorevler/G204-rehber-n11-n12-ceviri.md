---
id: G204
baslik: Rehber N11 ve N12 çevirisi — TR, DE, ES, FR + çevirilerde dalga 6 iç linkleri
rol: claude-metin
durum: inceleme
alan: claude-session-nice-faraday
oncelik: 1
bagimli: [G203]
yazar: [platform/content/guides/tr/, platform/content/guides/de/, platform/content/guides/es/, platform/content/guides/fr/, platform/previews/g204/, docs/36_ICERIK_PLANI.md, gorevler/G204-rehber-n11-n12-ceviri.md]
---

## Amaç
Kullanıcı (2026-10-22): "N11 ve N12'yi 4 dile çevir".

## Sonuç (2026-10-22, bulut oturumu)
- 8 dosya: `content/guides/{tr,de,es,fr}/{wedding-website-privacy,qr-code-wedding-rsvp}.md`. Terimler önceki çevirilerle aynı
  (misafir şifresi / Gäste-Passwort / contraseña para invitados / mot de passe invités; panel / Panel / panel / panneau).
  Şifre sayfasındaki "You're invited" ürün metni olduğu için çevrilmedi. Ölçüler yerel biçimde (2,5 cm, %7 / 7 %).
- Çevirilerde G203'ün iç link cümleleri: G2 → N11, N4 → N11 ve N12, N2 → N12 × 4 dil (16 cümle).
- Doğrulama: **18 rehberin 72 çevirisinin hepsinde** link kümesi, H2 ve SSS sayısı İngilizceyle aynı; jeton ve frontmatter
  kaçışı yok; başlık ≤ 60, açıklama ≤ 160 (ES/FR başlıkları ve DE/ES/FR açıklamaları kısaltıldı).
- Build: 8 sayfa 200, tek H1, `html lang` ve Article `inLanguage` doğru, İngilizce uyarısı yok; dil listelerinde 18 rehber;
  390 px'de sayfa taşması 0 (`previews/g204/`).
- Testler: `npm test` 1699/1699 (0 hata, 0 atlanan; build güncel), typecheck temiz.
- Ana dili konuşan biri tarafından okunmadı.

## Günlük
- 2026-10-22 alindi: claude-session-nice-faraday
- 2026-10-22 inceleme: 8 çeviri + 16 iç link
