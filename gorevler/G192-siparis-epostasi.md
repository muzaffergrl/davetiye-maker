---
id: G192
baslik: Önce güven modunda siparişi Gmail'deki Etsy satış e-postasından doğrulama (IMAP)
rol: claude-kod
durum: inceleme
alan: claude-session_015RTF9kCAoVGh7PDNq8XYeP
oncelik: 1
bagimli: [G191]
yazar: [platform/lib/mailbox/, platform/lib/mail/config.ts, platform/lib/mail/templates.ts, platform/lib/claim/verify.ts, platform/lib/claim/trust.ts, platform/lib/admin/connections.ts, platform/components/admin/AdminConnections.tsx, platform/tests/order-mailbox.test.ts, platform/package.json, platform/package-lock.json, docs/10_SITE_PLATFORMU.md, gorevler/G192-siparis-epostasi.md]
---

## Amaç
Kullanıcı talebi (2026-10-22): Etsy uygulaması onaylanana kadar sipariş doğrulaması insan beklemesin; dükkâna gelen Etsy
"You made a sale" e-postasını okuyan doğrulayıcı. Görevi kullanıcının doğrudan isteğiyle bu oturum açtı.

## Sonuç
**2026-10-22 · durum: inceleme.** Dal `claude/gallant-fermi-3qub8h`.

- `lib/mailbox/config.ts`: `ORDER_MAIL_USER` / `ORDER_MAIL_PASS` (Gmail uygulama şifresi), yoksa Gmail SMTP girişi.
- `lib/mailbox/imap.ts` (imapflow 2.1.2): Tüm Postalar salt okunur, `X-GM-RAW from:etsy.com "<no>"`, en çok 10 mail; From, konu,
  Authentication-Results, text/plain (yoksa HTML) — hiçbir şey okundu işaretlenmez, içerik log'a yazılmaz.
- `lib/mailbox/orders.ts`: sayılma kuralları (Gmail'in en üst Authentication-Results'ında Etsy DMARC pass + From hizası; numara
  sipariş bağlamında; konu satış / iptal-iade). İlan / işlem numarası ve Etsy mesaj bildirimi onay vermez.
- `lib/mailbox/verify.ts MailOrderVerifier` (satış → verified, iptal → rejected, yok → pending, hata → unavailable; 12 sn sınır).
- `lib/claim/verify.ts ChainOrderVerifier`: önce Etsy, sonra e-posta; Etsy makbuzu (ödenmemiş bile) son sözdür.
  `TrustOrderVerifier` varsayılanı bu zincir. `lib/claim/trust.ts`: saatlik kontrol Etsy + kutu (tek IMAP bağlantısı);
  "e-posta yok" site kaldırmaz, 48 saatte yalnız hatırlatır.
- Admin Bağlantılar: "Sipariş e-postaları (Gmail)" bölümü, "Gelen kutusunu dene", "Doğrulanmamış siparişleri şimdi kontrol et".
- Testler: `tests/order-mailbox.test.ts` (10; yerel sahte Gmail IMAP sunucusu `hoodiecrow-imap` 3.3.1 devDependency).

### Yapılmadı / açık
- Gerçek Etsy satış e-postası görülmedi (bağlı Gmail'de Etsy e-postası yok; henüz satış yok). Biçim tahmini; ilk satışta kontrol.
- Canlıda açılması için `ORDER_MAIL_USER` + `ORDER_MAIL_PASS` (ya da Gmail SMTP ayarları) Vercel'e girilmeli.
- Dükkânın Etsy bildirimlerinin hangi Gmail'e gittiği bilinmiyor (docs/15'te `bkestudio.help@gmail.com` geçiyor).

## Günlük
- 2026-10-22 alindi + inceleme: claude-session_015RTF9kCAoVGh7PDNq8XYeP (kullanıcı talebi)
