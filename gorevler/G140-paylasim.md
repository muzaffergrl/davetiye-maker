---
id: G140
baslik: Link/QR paylaşımını kolaylaştır + katılımcı listesi tek butonla Excel
rol: claude-kod
durum: inceleme
alan: claude-G140
oncelik: 1
bagimli: [G128, G076, G075, G121]
yazar: [platform/lib/panel/share.ts, platform/lib/panel/card-pdf.ts, platform/lib/panel/state.ts, platform/lib/panel/model.ts, platform/components/panel/ShareKit.tsx, platform/components/panel/share-kit.module.css, platform/components/panel/QrCode.tsx, platform/components/panel/views.tsx, platform/components/panel/Panel.tsx, platform/tests/g140-share.test.ts, platform/previews/g140/, platform/README.md, gorevler/G140-paylasim.md]
---

## Amaç
K45 (2) ve (6). Kullanıcı: "Katılımcı listesini kullanıcı tek bir butonla excel dosyası olarak düzenli bir şekilde indirebilsin."
ve "Link paylaşma, QR paylaşma vs. bunları kullanıcı paneli tarafında kolaylaştıralım seçenekler ekleyelim."
Koordinatör: session_01HP9ZrJ8mhZnigbvsvUQ4pR (birleştirme onda). Değişiklik Share, Home (Excel düğmesi) ve QR bileşeniyle sınırlı.

## Sonuç
**2026-10-17 · claude-G140 — durum: inceleme.** Dal `claude/g140-paylasim` (taban `main` d5bbc39). Yayın yok.

### 1. Excel (K45 2)
- G128'in dosyası exceljs ile geri okundu (`tests/g140-share.test.ts`): Replies başlıkları sırayla (Submitted · Name · Attending ·
  Guests … Email … Note for the couple), otomatik filtre başlıktan son yanıta bütün sütunlarda, Summary sayıları. G128 testi de yeşil.
- Guests: yapışkan çubukta "Download Excel" zaten vardı (değişmedi). **Home: yanıt kartının hemen altında tek dokunuş
  "Download Excel"** (yanıt varsa; aynı `/api/rsvp/<slug>/excel`). Tarayıcıda Home'dan indirme denendi (`rsvps-<slug>-<tarih>.xlsx`).

### 2. Paylaşım (K45 6) — Share görünümü
- **Your website link**: adres, tam genişlik büyük **Copy link** (56 px), Open, telefonda **Share…** (`navigator.share`).
- **Ask guests to save the link** ipucu (yer imi / Home Screen); davet mesajında da "Please save the link" satırı.
- **Send it with a message**: Invitation · Reminder (yanıt tarihi varsa) — teşekkür modunda yalnız Thank you; düzenlenebilir metin
  (isimler, uzun tarih, yanıt tarihi, link otomatik; "Reset text"); şifre açıksa **açık bir anahtarla** mesaja eklenir (varsayılan
  kapalı). Gönder: Share… (telefon), Copy message (her yerde yedek), WhatsApp, Email, Telegram; SMS ve Messenger yalnız dokunmatik
  cihazda (masaüstünde açılmazlar). Messenger web'i Facebook app id istediğinden yalnız uygulama şeması.
- **QR code for printed cards** (katlı, G121 kararı): Black / Design colour (temanın `theme-color`'ı, beyaz zeminde ≥ 7:1'e kadar
  koyulaştırılır), PNG boyutu Small · screens / Medium · cards / Large · signs (≥ 600/1200/2400 px), SVG. QR hâlâ yalnız gerçek
  URL'den `uqr` ile (şart 8).
- **Printable QR card**: 4 × 6 in (10 × 15 cm) PDF; temanın paylaşım görseli (GPT'nin isimsiz `og-1200x630.jpg`'i) varsa üst şerit,
  yoksa yalnız tipografi — yeni dekor çizilmedi. İsimler, tarih, beyaz kare üstünde QR, "Scan to open our wedding website"
  (teşekkür modunda "Scan for our thank-you note"), adres, isteğe bağlı şifre satırı. Canlı küçük önizleme. PDF kütüphanesiz
  (`lib/panel/card-pdf.ts`). İki temada (Blush Garden Rose açık, Art Deco Black Tie koyu) PDF 150 dpi'da render edilip QR jsQR ile
  okundu → doğru URL.
- Guest password, edit link, Take offline aynı kaldı.
- Erişilebilirlik: bütün yeni düğme/linkler ≥ 44 px (uygulama linkleri 52 px); 390 ve 1280 px'te 44 px altı hedef yok (tek
  bulgu "Your message" — textarea'nın etiketi, hedef değil).
- 5 dil hazırlığı: bütün yeni metinler `SHARE_LABELS` (lib/panel/share.ts) tablosunda; panelde ayrı bir etiket sistemi yoktu,
  bu tablo ilk anahtarlı sözlük.

### Alıcı etiketleri (eski → yeni, START HERE için)
| Eski | Yeni |
|---|---|
| Share → "Copy" | "Copy link" (büyük, tam genişlik) |
| Share → "Share" | "Share…" (yalnız telefonda) |
| Share → "Open" | "Open" (değişmedi) |
| — | "Ask guests to save the link" + açıklama |
| — | "Send it with a message" · "Invitation" / "Reminder" / "Thank you" · "Your message" · "Reset text" · "Add the guest password to the message" · "Send with" · "Copy message" · "WhatsApp" · "Text message" · "Email" · "Messenger" · "Telegram" |
| QR → "Download PNG" / "Download SVG" | aynı + "Colour: Black / Design colour", "Size (PNG): Small · screens / Medium · cards / Large · signs" |
| — | "Printable QR card" · "Print the guest password on the card" · "Download card (PDF)" |
| Home → (yok) | "Download Excel" (yanıt kartının altında) |
Mesaj metinleri (misafirin gördüğü): "We’re getting married on <date>! … Please save the link — you’ll want it on the day.",
"A friendly reminder: please reply by <date>.", "Thank you for celebrating with us! …", "Password: …".

### Testler (bu oturumda)
- `npm run typecheck` temiz; `tests/g140-share.test.ts` 6/6; son tur `npm test` **1267/1267**, `npm run build` + trace-check geçti.
- Tarayıcı (build, 390 × 844 dokunmatik + 1280): iki tema — Home/Share/Guests görüntüleri, Home'dan Excel indirme, QR PNG indirme,
  kart PDF indirme. Görüntüler `platform/previews/g140/`.

### Denenmedi / açık
- Gerçek telefonda `navigator.share`, `sms:` ve `fb-messenger:` açılışı denenmedi; Playwright telefon emülasyonu panel sayfasına
  dokunmatik bilgisini geçirmedi, bu yüzden SMS/Messenger düğmeleri ekranda görülmedi (filtre mantığı birim testinde).
- Kart PDF'inin fiziksel baskısı denenmedi. Kart yazısı sistem serif/sans fontuyla (font dosyası paketlenmez).
- `Published.tsx` (ilk yayın ekranı) eski hâliyle; START HERE rehberleri (G131) bu etiketlerle henüz güncellenmedi.
