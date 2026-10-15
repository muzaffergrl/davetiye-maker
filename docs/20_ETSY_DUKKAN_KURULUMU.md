# Etsy dükkân kurulumu — alan alan değerler (BKE Studio, 2026-10-15)

Bu belge, Etsy Shop Manager'daki dükkân ayarlarının **yapıştırmaya hazır** değerlerini ve tarayıcıda uygulama protokolünü verir.
Uygulayan: kullanıcının bilgisayarındaki Claude oturumu (Claude in Chrome, rol `claude-tarayici`). Bulut oturumu kullanıcının
Chrome'una erişemez. Değerler İngilizce, açıklamalar Türkçe.

**Dayanak:** docs/13 (rakip araştırması), docs/15 (marka, fiyat, Etsy kuralları), docs/19 §4 (alıcı metinleri, SSS),
`brand/README.md` (ikon/banner), K25–K33 (docs/01). Etsy bu ortamdan açılamıyor. Alan adları ve karakter sınırları
`[VERIFY]` etiketliydi; 2026-10-15'te gerçek ekranda doğrulandı, etiketler güncellendi, sonuç §7'de.

**eCommerce-Skills (nexscope-ai) değerlendirmesi (2026-10-15):** repo klonlanıp okundu, **projeye eklenmedi**.
- 22 Etsy beceri dosyasının 21'i aynı 56 satırlık boş şablon. İçlerinde yöntem ya da veri yok; "yapay zekâna sor" ve Nexscope
  reklamı var.
- Yalnız `etsy-seo` içerik taşıyor: sabit bir anahtar kelime listesi ve puanlama betiği. Betik bizim ilan başlığımızla
  çalıştırıldı. Verilen girdiyi yok saydı, gömülü "Handmade Bracelet / jewelry" örneğini puanladı ve takı etiketleri önerdi.
- Bu belgedeki değerler, repodaki daha derin kaynaklardan geliyor: 30 ilanlık rakip incelemesi, Etsy kural özetleri ve 78 soruluk
  alıcı soru envanteri.

---

**Karakter sayıları (2026-10-15, betikle):** shop title 53 · announcement 756 · message to buyers 248 · digital items 464 ·
headline 38 · story 771 · iade ek metni 204 · gizlilik notu 341 · bölüm adları 15/17/20.

## 0. Kesin sınırlar (uygulayan oturum için)

- **Dokunulmaz:** dükkân adı (`BKEStudio`; Etsy'de ad değişikliği sınırlı), ödeme/banka, kimlik doğrulama, vergi, fatura,
  yasal ad/adres, şifre, 2FA, Etsy Ads bütçesi, Etsy Plus/abonelik. Para harcatan hiçbir şey yok.
- **İlan yayınlanmaz.** İlanlar G079 canlı kontrolüne ve fiyat kararına bağlı (docs/19 §0). Dükkân "açık" duruma alınmaz.
  Taslak ilan varsa dokunulmaz.
- **Önce yedek:** her alanın mevcut değeri, üzerine yazılmadan önce §7'ye kopyalanır.
- Kullanıcı çıkış yapmışsa yalnız "Etsy'de oturum açık değil" denir. Şifre istenmez, yazılmaz.
- Etsy dışına satın alma yönlendirmesi, kupon, QR ya da dış fiyat yazılmaz (Off-Platform politikası, docs/15 §4.1).

## 1. Görünüm (Shop Manager → Settings → Info & Appearance / Your shop) [doğrulandı 2026-10-15, §7]

### 1.1 Shop title — Etsy'de artık **Tagline** (Settings → Your shop → Shop basics; sınır 55) [doğrulandı]
Google ve Etsy aramasında dükkân adının altında görünür. Ürünü anahtar kelimeyle anlatır.

```text
Wedding Websites with RSVP & Envelope Opening Invites
```

Yedek: `Digital Wedding Website Templates with Online RSVP`

### 1.2 Shop icon ve banner
| Alan | Dosya | Not |
|---|---|---|
| Shop icon | `brand/etsy/etsy_shop_icon_1000.png` (500'lük de var) | Etsy'de "Logo" (Your shop → Shop basics). **Uygulanmadı, §7** |
| Banner (büyük) | `brand/etsy/etsy_banner_big_3360x840.jpg` | Yazı logosu sağ tarafta. Yükleme önizlemesinde mobil kırpım kontrol edilir; logo kesiliyorsa yükleme yapılmaz, §7'ye yazılır |
| Mini banner | `brand/etsy/etsy_banner_mini_1600x213.jpg` | Banner, Shop Home editor'de (kalem ikonu). **Uygulanmadı, §7** |

### 1.3 Shop announcement (alanda sınır tanımlı değil) [doğrulandı]
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

### 1.4 Message to Buyers (makbuz + sipariş onay e-postası) [doğrulandı; alanda sınır tanımlı değil]
docs/19 §4.4. `{START_BASE}` = `https://davetiye-platform-five.vercel.app/start` (alan adı alınınca değişir, docs/05 §C).

```text
Thank you! Start your wedding website from the START HERE PDF in your download, or at https://davetiye-platform-five.vercel.app/start (choose the design you bought). Please save your private edit link when it appears. Questions? Message us on Etsy.
```

### 1.5 Message to Buyers for Digital Items (indirme sayfası; bütün dijital ilanlar) [doğrulandı; alanda sınır tanımlı değil]

```text
Thank you for your order! Your download is your START HERE guide (PDF). Open it and tap the start link inside.

Can't open the PDF? Start here instead and choose the design you bought: https://davetiye-platform-five.vercel.app/start

You will enter your Etsy order number, your email and your first names. Then SAVE YOUR EDIT LINK when it appears: it opens your editor, and we cannot email it to you yet.

Questions? Message us here on Etsy with your order number.
```

## 2. About (Settings → Your shop → Shop basics → About your shop) [doğrulandı]

### 2.1 Story headline (Headline, sınır 150) [doğrulandı]

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

## 3. Shop sections (Listings → Sections → Organize your listings; başlık 24, en çok 20) [doğrulandı]

Lansmanda 5 tasarım (01–05). Bölümler stile göre:

| Bölüm | Tasarımlar |
|---|---|
| `Floral & Garden` | 01 Olive & Ivory, 03 Blush Garden Rose |
| `Classic & Vintage` | 02 Dusty Blue, 04 Vintage Airmail Love Letter |
| `Summer & Destination` | 05 Mediterranean Lemon |

İlan yoksa bölümler boş görünür. Bölümler açılır, ilanlar yayınlanınca atanır. Save the Date ürünü gelince `Save the Date` bölümü
eklenir.

## 4. Policies (Settings → Policy settings: Returns & exchanges · Cancellations · Privacy · Fixed policies) [kısmen, §7]

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

### 4.1 Shop FAQ (Shop Home editor → Frequently asked questions; en çok 10, soru "Custom" 300, cevap 750) [doğrulandı]
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
2. ~~Yanıt süresi~~ **Karar (kullanıcı, 2026-10-15): 24 saat.** Duyuruya, About'a, `platform/lib/marketing/config.ts`
   (`responseTime: '24 hours'`) ve docs/19'a yazıldı.
3. **Fiyat ve lansman:** docs/15 §5. Bu belge fiyata dokunmaz.

## 7. Uygulama kaydı (uygulayan oturum doldurur)

Her alan için: mevcut değer (yedek) · girilen değer · kaydedildi mi · yeniden yüklemede doğrulandı mı · gerçek karakter sınırı ·
Etsy'deki gerçek menü adı. Uygulanmayan alan ve nedeni.

**Uygulama: 2026-10-15, Claude in Chrome (kullanıcının oturumu açık Chrome'u, Shop Manager).** Dükkân: `STUDIOBKE`
(studiobke.etsy.com). Kullanıcının açık sekmesi bu oturumun sekme grubunda görünmedi. Aynı Chrome profilinde yeni bir sekme
açıldı; oturum açıktı.

### 7.1 Girilen ve doğrulanan alanlar
Her alan kaydedildi. Sonra sayfa yeniden yüklendi, değer okundu ve birebir aynı çıktı.

| Alan | Etsy'deki gerçek yer / ad | Yedek (önceki değer) | Gerçek sınır | Girilen (karakter) |
|---|---|---|---|---|
| Shop title | Settings → **Your shop** → Shop basics → **Tagline** ("Formerly known as Shop title") | boş | 55 (sayaç) | §1.1 ana değer (53) |
| Shop announcement | Settings → **Info & Appearance** → Shop Announcement (`shop[announcement]`) | boş | alanda `maxlength` yok | §1.3 (756; satır sonları dahil, betik 730 saymıştı) |
| Message to Buyers | Info & Appearance → Message to Buyers (`shop[sale_message]`) | boş | `maxlength` yok | §1.4 (248) |
| Message to Buyers for Digital Items | Info & Appearance → Message to Buyers for Digital Items (`shop[digital_sale_message]`) | boş | `maxlength` yok | §1.5 (464) |
| About headline | Your shop → Shop basics → **About your shop** → Headline | boş | 150 | §2.1 (38) |
| About story | aynı yer → Your story | boş | 5000 | §2.2 (745; paragraflar korundu) |
| Bölümler | Listings → sağ kolon **Sections** → "Organize your listings" → New Section / **Manage Sections** | bölüm yoktu | başlık 24, en çok 20 | `Floral & Garden`, `Classic & Vintage`, `Summer & Destination` (ilan yok, hepsi 0) |
| İptal politikası | Settings → **Policy settings** → **Cancellations** → Create policy → Publish | boş | serbest metin yok, yalnız aç/kapa | "I don't accept order cancellations" (vitrinde: "Cancellations: not accepted") |
| SSS (10 soru) | **Shop Home editor** (`/shop/STUDIOBKE/edit`) → Frequently asked questions → Add an FAQ → soru listesinde **Custom** | SSS yoktu | en çok 10 (10. sorudan sonra "Add an FAQ" kayboluyor); soru 300, cevap 750 | §4.1'deki 10 soru, aynı sırayla |

Not: iptal politikası docs/20 tablosunda ayrı bir satır değildi. Kullanıcının "iade yok" kararıyla (§6.1) ve §4 iade metnindeki
"cancellations" ifadesiyle aynı olduğu için yayınlandı. Geri almak için: Policy settings → Cancellations → kalem ikonu.

### 7.2 Girilmeyen alanlar ve nedeni
- **Shop icon (Logo) ve banner uygulanmadı.** Dükkânda kullanıcının daha önce yüklediği logo ve banner var (dashboard: "Logo
  added", "Banner added"). İkisi de `brand/etsy/` dosyalarından farklı, eski bir tasarım. Logo, içinde "STUDIO · BKE · INVITATIONS"
  yazan bir daire mühür. Banner'da "Digital Wedding Invitations / Animated Video & Website Templates" yazıyor. Logoyu değiştirmek
  için önce mevcut logoyu kaldırmak gerekiyor (Shop basics → Logo → Edit → ×). Bu tıklama Claude Code izin denetimince engellendi.
  Kullanıcının kendi yüklediği görseller açık onayı olmadan ezilmesin diye banner'a da dokunulmadı. Bu yüzden mobil kırpım
  önizlemesi yapılmadı.
  Mevcut görsellerin yedek URL'leri:
  - logo: `https://i.etsystatic.com/68570726/r/isla/de861b/90028703/isla_500x500.90028703_r9emg7wh.jpg`
  - banner: `https://i.etsystatic.com/68570726/r/isbl/4fd719/89080116/isbl_3360x840.89080116_nvqgkb5c.jpg`
  Yeni görseller şuradan yüklenir. Banner: Shop Home editor → banner'ın sağ altındaki kalem ikonu. Logo: Shop Home editor'de
  ikonun üstündeki kamera ya da Shop basics → Logo.
- **Returns ek metni için alan yok.** Policy settings → Returns & exchanges yalnız **fiziksel ürünler** için politika kuruyor
  ("return and exchange policies for non-digital items"). Dijital ürünlerde Etsy iadeyi zaten kapalı tutuyor. Vitrinde "See item
  details for return and exchange eligibility." yazıyor. Metin ilan açıklamasına konmalı (etsy-metin işi). İptal tarafı 7.1'de
  yayınlandı.
- **Privacy yayınlanmadı.** Etsy'de hazır bir şablon yok. Tek bir serbest metin kutusu var ve AB alıcıları için GDPR uyumlu tam
  bir politika isteniyor (Etsy yalnız örnek şablona link veriyor). §4'teki 341 karakterlik not "şablona ek" olarak yazılmıştı.
  Tek başına GDPR politikasının yerini tutmaz. "Earlier deletion" cümlesi de `[DELETION PROCESS]` kararına bağlı. Tam metin veri
  sorumlusunun adını ve iletişim bilgisini gerektiriyor; bunlar uydurulamaz. Karar kullanıcının.
- Members, social links, featured photos/video: §2.3 gereği boş bırakıldı.

### 7.3 Yalnız okunan ayarlar (§5); hiçbiri değiştirilmedi
| Ayar | Ekrandaki değer | Yer |
|---|---|---|
| Dükkân adı | `STUDIOBKE` (docs'ta `BKEStudio` yazıyordu) | Shop basics |
| Konum | Bilecik, Türkiye | Shop Home editor |
| Saat dilimi | Türkiye / Istanbul (UTC+03) | Settings → Options |
| Dükkân dili | Ekranda gösterilmiyor; ek çeviri yok | Settings → Languages and translations |
| Automatic Listing Translation | **Enabled** | Options |
| Para birimi | Doğrulanamadı. Offsite Ads panelinde tutarlar **TL** görünüyor; bu, hesabın görüntüleme para birimi olabilir. Ödeme ayarları sayfası §0 gereği açılmadı | — |
| Offsite Ads | **Açık** (sayfada "Opt out from Offsite Ads" butonu duruyor). docs/15 kapalı olmasını öneriyor; kullanıcı onayı bekliyor | Marketing → Offsite Ads |
| Etsy Ads | Henüz kullanılamıyor: "13 days left until you can start advertising" (yeni dükkânda 15 gün bekleme) | Marketing → Etsy Ads |
| Vacation mode | Kapalı | Options → Vacation Mode |
| Custom order requests | Disabled | Options |
| Gift wrap / gift note | Gift wrap disabled · gift note **offered** (dijital üründe etkisiz) | Options |
| GPSR | Fiziksel ve dijital: "Sell … to all EEA states and NI" | Options |
| Satıcı statüsü (AB) | Private individual | Shop Home editor → Seller details |
| İlanlar | Active 0 · Draft 0 · Expired 0 · Sold out 0 · Inactive 0 | Listings |

### 7.4 Beklenmedik bulgular
- Dükkân adı `STUDIOBKE`, belgede ise `BKEStudio`. About metni "BKE Studio" diyor. Tutarlılık kararı kullanıcının.
- Mevcut logo ve banner eski marka çalışmasından ("STUDIO BKE INVITATIONS" mührü). Banner'daki "Animated Video" vaadi şu an
  vitrinde duruyor; oysa video ürünü K22'den beri askıda.
- Eski URL `/your/shops/me/edit` 404 veriyor. Info & Appearance: `/your/shops/me`; Your shop:
  `/your/shops/me/settings/your-shop/shop-basics`.
