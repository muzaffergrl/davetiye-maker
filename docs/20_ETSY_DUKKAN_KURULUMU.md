# Etsy dükkân kurulumu — alan alan değerler (BKE Studio, 2026-10-15)

Bu belge, Etsy Shop Manager'daki dükkân ayarlarının **yapıştırmaya hazır** değerlerini ve tarayıcıda uygulama protokolünü verir.
Uygulayan: kullanıcının bilgisayarındaki Claude oturumu (Claude in Chrome, rol `claude-tarayici`). Bulut oturumu kullanıcının
Chrome'una erişemez. Değerler İngilizce, açıklamalar Türkçe.

**Dayanak:** docs/13 (rakip araştırması), docs/15 (marka, fiyat, Etsy kuralları), docs/19 §4 (alıcı metinleri, SSS),
`brand/README.md` (ikon/banner), K25–K33 (docs/01). Etsy bu ortamdan açılamıyor. Alan adları ve karakter sınırları
`[VERIFY]` etiketlidir; uygulayan oturum gerçek ekranda doğrular ve sonucu §7'ye yazar.

**eCommerce-Skills (nexscope-ai) değerlendirmesi (2026-10-15):** repo klonlanıp okundu, **projeye eklenmedi**.
- 22 Etsy beceri dosyasının 21'i aynı 56 satırlık boş şablon. İçlerinde yöntem ya da veri yok; "yapay zekâna sor" ve Nexscope
  reklamı var.
- Yalnız `etsy-seo` içerik taşıyor: sabit bir anahtar kelime listesi ve puanlama betiği. Betik bizim ilan başlığımızla
  çalıştırıldı. Verilen girdiyi yok saydı, gömülü "Handmade Bracelet / jewelry" örneğini puanladı ve takı etiketleri önerdi.
- Bu belgedeki değerler, repodaki daha derin kaynaklardan geliyor: 30 ilanlık rakip incelemesi, Etsy kural özetleri ve 78 soruluk
  alıcı soru envanteri.

---

**Karakter sayıları (2026-10-15, betikle):** shop title 53 · announcement 730 · message to buyers 248 · digital items 464 ·
headline 38 · story 745 · iade ek metni 218 · gizlilik notu 341 · bölüm adları 15/17/20.

## 0. Kesin sınırlar (uygulayan oturum için)

- **Dokunulmaz:** dükkân adı (`BKEStudio`; Etsy'de ad değişikliği sınırlı), ödeme/banka, kimlik doğrulama, vergi, fatura,
  yasal ad/adres, şifre, 2FA, Etsy Ads bütçesi, Etsy Plus/abonelik. Para harcatan hiçbir şey yok.
- **İlan yayınlanmaz.** İlanlar G079 canlı kontrolüne ve fiyat kararına bağlı (docs/19 §0). Dükkân "açık" duruma alınmaz.
  Taslak ilan varsa dokunulmaz.
- **Önce yedek:** her alanın mevcut değeri, üzerine yazılmadan önce §7'ye kopyalanır.
- Kullanıcı çıkış yapmışsa yalnız "Etsy'de oturum açık değil" denir. Şifre istenmez, yazılmaz.
- Etsy dışına satın alma yönlendirmesi, kupon, QR ya da dış fiyat yazılmaz (Off-Platform politikası, docs/15 §4.1).

## 1. Görünüm (Shop Manager → Settings → Info & Appearance) [VERIFY menü adları]

### 1.1 Shop title (sınır 55) [VERIFY]
Google ve Etsy aramasında dükkân adının altında görünür. Ürünü anahtar kelimeyle anlatır.

```text
Wedding Websites with RSVP & Envelope Opening Invites
```

Yedek: `Digital Wedding Website Templates with Online RSVP`

### 1.2 Shop icon ve banner
| Alan | Dosya | Not |
|---|---|---|
| Shop icon | `brand/etsy/etsy_shop_icon_1000.png` (500'lük de var) | 500×500 gösterim [VERIFY] |
| Banner (büyük) | `brand/etsy/etsy_banner_big_3360x840.jpg` | Yazı logosu sağ tarafta. Yükleme önizlemesinde mobil kırpım kontrol edilir; logo kesiliyorsa yükleme yapılmaz, §7'ye yazılır |
| Mini banner | `brand/etsy/etsy_banner_mini_1600x213.jpg` | Etsy hangisini sunuyorsa. İkisi birden seçilemez [VERIFY] |

### 1.3 Shop announcement (sınır 5,000) [VERIFY]
İlk 1–2 satır kısaltılmış önizlemede görünür. Bu yüzden ana değer başta.

```text
Wedding websites you edit yourself in your browser: no Canva, no app, no account.

HOW IT WORKS
1. Buy and download your START HERE guide (PDF).
2. Open the start link, enter your Etsy order number, then add your names, date and photos.
3. Publish and share your link. Guests open the envelope and reply on your RSVP page; you see every reply in your editor.

WHAT YOU CAN CHANGE
Names, date and time, venue, schedule, your story, Q&A, RSVP questions, links, photos, headings and labels. The artwork, colors and fonts stay as designed.

GOOD TO KNOW
• Digital product: nothing is printed or shipped.
• Your website stays online until 12 months after your wedding date.
• Questions before or after you buy? Message us here on Etsy. We reply within 24 hours.
```

### 1.4 Message to Buyers (makbuz + sipariş onay e-postası) [VERIFY sınır]
docs/19 §4.4. `{START_BASE}` = `https://davetiye-platform-five.vercel.app/start` (alan adı alınınca değişir, docs/05 §C).

```text
Thank you! Start your wedding website from the START HERE PDF in your download, or at https://davetiye-platform-five.vercel.app/start (choose the design you bought). Please save your private edit link when it appears. Questions? Message us on Etsy.
```

### 1.5 Message to Buyers for Digital Items (indirme sayfası; bütün dijital ilanlar) [VERIFY sınır]

```text
Thank you for your order! Your download is your START HERE guide (PDF). Open it and tap the start link inside.

Can't open the PDF? Start here instead and choose the design you bought: https://davetiye-platform-five.vercel.app/start

You will enter your Etsy order number, your email and your first names. Then SAVE YOUR EDIT LINK when it appears: it opens your editor, and we cannot email it to you yet.

Questions? Message us here on Etsy with your order number.
```

## 2. About (Shop Manager → Settings → About your shop) [VERIFY]

### 2.1 Story headline (kısa) [VERIFY sınır]

```text
Wedding websites you can edit yourself
```

### 2.2 Story
Kişisel bilgi uydurulmaz. AI beyanı Etsy'nin yaratıcılık kuralı ve K21 gereği (docs/15 §4.1).

```text
BKE Studio makes wedding websites that open like a real invitation: your guests tap a closed envelope, it opens, and your invitation, story, details and RSVP page follow.

We built our own editor so you never need Canva or design skills. You fill in your names, date, venue and photos in your browser, publish, and share one link. Guest replies arrive in your editor, and you can download them as a spreadsheet.

Each design is a complete look: artwork, colors and type are made to work together, and your own words and photos sit on top as editable content.

How we make it: our artwork is created with the help of AI image tools, then selected, refined and built into each website by us.

Questions are always welcome. Message us here on Etsy; we reply within 24 hours.
```

### 2.3 Shop members, social links, photos
- **Members:** boş bırakılır. Kişi adı ve rolü kullanıcı vermeden yazılmaz.
- **Social links:** boş (hesap yok).
- **About photos/video:** şimdilik yok. İleride `brand/assets/gpt/` sahnelerinden GM06 güven sahneleri kullanılabilir (GPT işi).

## 3. Shop sections [VERIFY: başlık sınırı 24 karakter, en çok 20 bölüm]

Lansmanda 5 tasarım (01–05). Bölümler stile göre:

| Bölüm | Tasarımlar |
|---|---|
| `Floral & Garden` | 01 Olive & Ivory, 03 Blush Garden Rose |
| `Classic & Vintage` | 02 Dusty Blue, 04 Vintage Airmail Love Letter |
| `Summer & Destination` | 05 Mediterranean Lemon |

İlan yoksa bölümler boş görünür. Bölümler açılır, ilanlar yayınlanınca atanır. Save the Date ürünü gelince `Save the Date` bölümü
eklenir.

## 4. Policies (Shop Manager → Settings → Policies) [VERIFY]

| Alan | Değer | Durum |
|---|---|---|
| Processing / delivery | Digital: instant download | Etsy'nin dijital varsayılanı |
| Returns & exchanges | **Not accepted** (digital items) | Etsy'nin dijital varsayılanı |
| Ek iade metni | Aşağıdaki metin | Karar verildi (2026-10-15): iade yok, düzeltme sözü var |
| Privacy | Etsy'nin standart gizlilik şablonu | Bizim platform verisi için ek not aşağıda |
| Payment | Etsy Payments | Değiştirilmez |

**Returns ek metni (kullanıcı kararı, 2026-10-15: iade yok; para iadesi sözü verilmez, düzeltme sözü verilir):**

```text
Because this is a digital product with instant access, we do not accept returns, exchanges or cancellations. If something on your website does not work as described, message us on Etsy and we will fix it.
```

**Privacy ek notu (öneri):**

```text
When you start your website, we store the details you enter (your email, names, event details and photos) and your guests' RSVP replies, only to run your website. We never sell this data. Your website and its data are removed after the hosting period ends (12 months after your wedding date). To ask for earlier deletion, message us on Etsy.
```
Silme süreci kararı `[DELETION PROCESS]` açık (docs/19 §7); "earlier deletion" cümlesi ancak süreç tanımlanınca kalır.

### 4.1 Shop FAQ [VERIFY: en çok 10 soru olabilir]
docs/19 §4.3'ten en sık 10 soru (kalan 3'ü ilan açıklamasında):

```text
Do I need Canva or an app?
No. You edit your website in your web browser, on your phone or computer. Your guests only need the link.

How do I start after buying?
Download the START HERE PDF from your Etsy purchases, open the start link and enter your Etsy order number. You can also use the start link in our Etsy message.

Do I need an account or a password?
No. You get a private edit link that opens your editor. Save it right away; we cannot email it to you yet.

What if I lose my edit link?
If your editor is still open, copy it again under Share. Otherwise message us on Etsy with your order number: we send you a new link and the old one stops working.

Can I change things after I publish?
Yes, as often as you like. Names and date can be changed 3 times in total after publishing; typo fixes and moving the date by up to 7 days are free.

Can I change the headings and wording?
Yes. Every page of the editor has "Headings & labels". The artwork, colors and fonts stay as designed.

How do my guests reply?
On your RSVP page, with no app or account. You see every reply in your editor and can download them as a spreadsheet (CSV).

How many guests can I invite?
As many as you like. One reply can include up to 10 people.

How long does my website stay online?
Until 12 months after your wedding date. After the wedding it can turn into a thank-you page.

Is anything printed or shipped?
No. It is a digital product.
```

## 5. Diğer ayarlar

| Ayar | Öneri | Gerekçe / durum |
|---|---|---|
| Dükkân dili | English | Hedef alıcı yabancı (AGENTS) |
| Para birimi | USD | docs/15 §5 önerisi. Dükkân açılışında seçildiyse değiştirilmez, §7'ye yazılır |
| Konum | Türkiye | K26 |
| Offsite Ads | Kapalı (opt out), $10k altındayken | docs/15 §1. Yalnız ayar okunur ve §7'ye yazılır; değişiklik kullanıcı onayıyla |
| Etsy Ads | Kapalı | Para harcatır; ilanlar yayında değil |
| Vacation mode / auto-reply | Değiştirilmez | İlanlar yayında değil |
| Shop updates / bildirimler | Değiştirilmez | — |

## 6. Kullanıcıdan bekleyen kararlar (uygulama bunları beklemeden yapılır)

1. ~~İade metni~~ **Karar (kullanıcı, 2026-10-15): iade yok.** §4 metni para iadesi sözü vermez; yalnız "çalışmazsa düzeltiriz"
   der. Not: Etsy Purchase Protection'da alıcı "açıklamaya uymuyor" vakası yine açabilir; düzeltme sözü bu vakaları azaltmak içindir.
2. ~~Yanıt süresi~~ **Karar (kullanıcı, 2026-10-15): 24 saat.** Duyuruya ve About'a yazıldı. `platform/lib/marketing/config.ts`
   `responseTime` ve docs/19 `[RESPONSE TIME]` yer tutucuları ayrı görevde doldurulur (entegratör).
3. **Fiyat ve lansman:** docs/15 §5. Bu belge fiyata dokunmaz.

## 7. Uygulama kaydı (uygulayan oturum doldurur)

Her alan için: mevcut değer (yedek) · girilen değer · kaydedildi mi · yeniden yüklemede doğrulandı mı · gerçek karakter sınırı ·
Etsy'deki gerçek menü adı. Uygulanmayan alan ve nedeni.

_(boş — 2026-10-15 itibarıyla hiçbir alan uygulanmadı)_
