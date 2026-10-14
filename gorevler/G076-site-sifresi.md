---
id: G076
baslik: İsteğe bağlı site şifresi — yalnız şifreyi bilen misafirler siteyi açar
rol: claude-kod
durum: bitti
alan: claude-G076
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
- [x] Şifre açık/kapalı, bütün rotalar korunuyor, sızıntı yok; testler geçti

## Sonuç
Yapıldı (2026-10-14, claude-G076). Ayrıntı: `platform/README.md` "Site şifresi (G076, K28)".

- **Panel (Share → "Guest password"):** "Password protect your website" anahtarı (varsayılan kapalı); açınca öneri gelir
  (ör. `RainSaffron60`), "Suggest a password", 4–40 karakter, büyük/küçük harf önemsiz, "Copy password", davetiye mesajı
  ipucu; şifre değişince "misafirler yeniden sorulur" uyarısı. Hemen geçerli (yayın gerekmez). Yeni uç
  `POST /api/edit/<slug>/access`. Yalnız token'lı stiller (`GuestPassword.tsx`, `guest-password.module.css`).
- **Saklama:** site kaydında `guestAccess {enabled, password, version, secret}` (özel depo; içerik kaydında değil →
  sayfaya/yayına hiç gitmez; içerik şeması değişmedi). Şifre değişince `version +1` → bütün misafir çerezleri düşer.
- **Misafir:** her genel rota korunuyor — 5 sayfa = temanın kendi zemin/renk/fontuyla şifre sayfası (yalnız isimler +
  "You're invited"; tarih/mekân/foto/yeni dekor yok), `.ics` → 303 şifre sayfası, `/media` → 401, RSVP durum/gönderim → 401
  (saklanmaz). Doğru şifre → `__Host-` imzalı (site id + sürüm), HttpOnly + Secure + SameSite=Lax, 90 gün çerez, 303 aynı
  adres (açık yönlendirme yok). Yanlış şifre: IP+site 10 / 15 dk, IP 30 / 15 dk, yalnız yanlışlar sayılır; pencere doluyken
  doğru şifre de 429; blob'da paylaşımlı sayaç (`AdapterRateLimiter` + yeni `readCounter`/`peek`). Karşılaştırmalar sabit
  zamanlı. Korumalı yanıtlar `private, no-store` + `Vary: Cookie` (foto `private, max-age=300`), meta = isimler +
  "You're invited", `noindex`. Panel ve panel önizleme jetonu şifresiz; kalıcı önizleme linki şifre ister.
- **Sıra:** 404 (yok/yayında değil) → 410 arşiv (isimsiz) → panel jetonu açık → şifre → sayfa; G075 teşekkür modu
  şifreden sonra gelmeli (`lib/site/access.ts` başı, README).
- **Testler:** `npm test` 448/448 (yeni `tests/g076-access.test.ts` 19; origin/main birleştirmesinden sonra 477/477), `npm run typecheck` temiz, `npm run build` +
  trace-check geçti; tarayıcı: `tests/g076-browser.ts` 51/51, `g060-browser` 147/147, `final-smoke --theme olive-ivory`
  45/45 ve `--theme blush-garden-rose` 45/45, `rsvp-browser` 25/25 (son üçü + g060 çıktıları geçici klasöre; repodaki
  önizlemelere dokunulmadı). Ekranlar: `platform/previews/g076/` (390 px: Share şifre açık, iki temanın şifre sayfası,
  yanlış şifre) + `checks.json`; mediterranean-lemon ve vintage-airmail şifre sayfaları da göz kontrolünden geçti (commit
  edilmedi).
- **Denenmedi:** gerçek telefon (iOS Safari / Android Chrome), gerçek Vercel Blob deposu ve Vercel'de canlı (yayın yapılmadı),
  WhatsApp/iMessage bağlantı önizlemesi kazıyıcıları.
- **Kalan riskler:** kısa şifre (ör. 4 rakam) çok IP'li kararlı saldırgana karşı zayıf (sınır yavaşlatır); şifre açılmadan
  önce CDN'e girmiş bir foto en çok 5 dk daha servis edilebilir.
- **Yazar listesi dışı:** `docs/16_PANEL_V2.md` §11.11 tehdit tablosuna G076 satırları ve §15 #6 (görevi veren istedi).
  Entegratöre öneri: `docs/10` §1'e bir satır ("isteğe bağlı misafir şifresi, Share").

## Günlük
- 2026-10-14 açıldı (entegratör): K28
- 2026-10-14 alindi: claude-G076
- 2026-10-14 bitti, incelemeye gönderildi
- 2026-10-14 entegratör onayladı
