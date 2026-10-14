---
id: G076
baslik: İsteğe bağlı site şifresi — yalnız şifreyi bilen misafirler siteyi açar
rol: claude-kod
durum: hazir
alan:
oncelik: 1
bagimli: [G060]
yazar: [platform/lib/, platform/app/, platform/components/panel/, platform/middleware.ts, platform/tests/, docs/03_URUN_ICERIK_SEMASI.json, platform/README.md, platform/previews/g076/]
---

## Amaç
K28. Çift isterse sitesini bir misafir şifresiyle korur. Varsayılan kapalı.

## Yapılacaklar
1. **Panel (Share):** "Password protect your website" anahtarı + şifre alanı (4–40 karakter; öneri üret düğmesi; çift görebilir ve
   kopyalayabilir — paylaşılmak için var). Davetiye metni ipucu: "Add the password to your invitation message".
2. **Saklama:** site kaydında (özel depo), genel sayfaya hiç gönderilmez; karşılaştırma sabit zamanlı. Şifre değişince eski misafir
   oturumları geçersiz (sürüm sayacı).
3. **Misafir akışı:** korumalı sitede her genel rota (zarf, home, story, details, rsvp, `.ics`, `/media` fotoğrafları, RSVP API) önce
   tema renginde sade bir şifre sayfası gösterir (temanın zemini + isimler; tarih/mekân/foto yok). Doğru şifre → imzalı, siteye özel,
   HttpOnly + Secure + SameSite=Lax çerez (90 gün). Yanlış denemelerde hız sınırı (IP + site). Panel ve önizleme linki şifresiz çalışır.
4. **Gizlilik:** korumalı sitede og:image/og:description ayrıntı sızdırmaz (yalnız isimler + "You're invited"); `noindex`; `sitemap`
   ve satış sitesi örnek listelerinde görünmez.
5. **Testler:** yetkisiz erişim her rotada kapalı (fotoğraf ve `.ics` dahil), doğru/yanlış şifre, hız sınırı, şifre değişince çıkış,
   çerez başka siteye geçmez, panel/önizleme etkilenmez; tarayıcı yolculuğu; final-smoke ve g060-browser geçmeli. Önizleme `platform/previews/g076/`.

## Bitti sayılması için
- [ ] Şifre açık/kapalı, bütün rotalar korunuyor, sızıntı yok; testler geçti

## Sonuç

## Günlük
- 2026-10-14 açıldı (entegratör): K28
