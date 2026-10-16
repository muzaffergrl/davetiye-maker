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
headline 38 · story 771 · iade ek metni 204 · gizlilik notu 341 · bölüm adları 15/17/20. **G122 (2026-10-16):** announcement
759 · story 819 (zarfsız tasarımlar için kapsayıcı cümle; Etsy'de yeniden girilmeli, §7.6).

## 0. Kesin sınırlar (uygulayan oturum için)

- **Dokunulmaz:** dükkân adı (`BKEStudio`; Etsy'de ad değişikliği sınırlı), ödeme/banka, kimlik doğrulama, vergi, fatura,
  yasal ad/adres, şifre, 2FA, Etsy Ads bütçesi, Etsy Plus/abonelik. Para harcatan hiçbir şey yok.
- **İlan yayınlanmaz.** İlanlar canlı kontrole ve fiyat kararına bağlı (docs/19 §0). G079 2026-10-15'ten beri canlı; ama
  START HERE rehberleri (G122) G100 panelini anlatıyor ve 2026-10-16 production'ı (`b952bc8`) G100'ü içermiyor: önce G100'lü
  yayın. Dükkân "açık" duruma alınmaz.
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

Not (G122, 2026-10-16): 20 tasarımın 6'sı zarfla açılmıyor (06 ve 14 gatefold, 09 pouch, 12 wallet, 13 book, 18 sleeve;
`platform/lib/marketing/designs.ts`). Tagline arama kelimesi olarak böyle bırakıldı (14 tasarım zarflı); zarf demeyen değer
istenirse yedek kullanılır. Kullanıcı kararı.

### 1.2 Shop icon ve banner
| Alan | Dosya | Not |
|---|---|---|
| Shop icon | `brand/etsy/etsy_shop_icon_1000.png` (500'lük de var) | Etsy'de "Logo" (Your shop → Shop basics / Shop Home editor). **Uygulandı, §7.5** |
| Banner (büyük) | `brand/etsy/etsy_banner_big_3360x840.jpg` | Yazı logosu sağ tarafta. Mobil kırpım ölçüldü (kırpım yok), **uygulandı, §7.5** |
| Mini banner | `brand/etsy/etsy_banner_mini_1600x213.jpg` | Kullanılmadı: Etsy'de "Mini Banner" mobilde görünmüyor; Big Banner seçili kaldı (§7.5) |

### 1.3 Shop announcement (alanda sınır tanımlı değil) [doğrulandı]
İlk 1–2 satır kısaltılmış önizlemede görünür. Bu yüzden ana değer başta.

```text
Wedding websites you edit yourself in your browser: no Canva, no app, no account.

HOW IT WORKS
1. Buy and download your START HERE guide (PDF).
2. Open the start link, enter your Etsy order number, then add your names, date and photos.
3. Publish and share your link. Guests open your invitation and reply on your RSVP page; you see every reply in your editor.

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
BKE Studio makes wedding websites that open like a real invitation: your guests tap a closed envelope, gatefold or keepsake (each design has its own), it opens, and your invitation, story, details and RSVP page follow.

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

Lansmanda 5 tasarım (01–05); 06–20'nin ilan metinleri G123'te yazıldı. Bölümler stile göre:

| Bölüm | 01–05 (lansman) | 06–20 (G123 önerisi, kullanıcı kararı) | Toplam |
|---|---|---|---|
| `Floral & Garden` | 01 Olive & Ivory, 03 Blush Garden Rose | 07 Burgundy Velvet Autumn, 08 Winter Evergreen, 09 Lavender Provence, 13 Enchanted Forest Storybook, 15 Cherry Blossom Spring, 16 Sunflower Rustic Barn, 18 Wildflower Meadow Vellum, 19 Midnight Garden | 10 |
| `Classic & Vintage` | 02 Dusty Blue, 04 Vintage Airmail Love Letter | 06 Art Deco Black-Tie, 14 Ivory Lace & Pearls, 17 Emerald & Gold Estate | 5 |
| `Summer & Destination` | 05 Mediterranean Lemon | 10 Tuscan Vineyard, 11 Boho Pampas Terracotta, 12 Tropical Destination, 20 Coastal Seaside | 5 |

06–20'nin bölümü her `listing_v3.md` §4 "Shop section" satırından (G123) alındı; Etsy'de yeni bölüm açılmaz, üç bölüm yeter
(sınır 20). `Floral & Garden` 10 tasarımla kalabalık olursa ayrı bölüm (ör. `Seasonal`) kullanıcı kararıdır.

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
| Para birimi | **TRY** (kullanıcı kararı 2026-10-15; USD önerisi yerine) | §7.3, §8. İlan fiyatı TL girilir |
| Konum | Türkiye | K26 |
| Offsite Ads | **Kapatıldı** (opt out, 2026-10-15, kullanıcı onayıyla; doğrulandı §7.3) | docs/15 §1. Son 12 ayda $10k altındayken isteğe bağlı |
| Etsy Ads | Kapalı | Para harcatır; ilanlar yayında değil |
| Vacation mode / auto-reply | Değiştirilmez | İlanlar yayında değil |
| Shop updates / bildirimler | Değiştirilmez | — |

## 6. Kullanıcıdan bekleyen kararlar (uygulama bunları beklemeden yapılır)

**2026-10-15 kararları:** Offsite Ads kapatılır (§5); Etsy dükkân adı `STUDIOBKE` kalır (§7.4). Gizlilik politikası için veri
sorumlusu adı ve iletişim bilgisi kullanıcıdan gelecek (§7.2).

1. ~~İade metni~~ **Karar (kullanıcı, 2026-10-15): iade yok.** §4 metni para iadesi sözü vermez; yalnız "çalışmazsa düzeltiriz"
   der. Not: Etsy Purchase Protection'da alıcı "açıklamaya uymuyor" vakası yine açabilir; düzeltme sözü bu vakaları azaltmak içindir.
2. ~~Yanıt süresi~~ **Karar (kullanıcı, 2026-10-15): 24 saat.** Duyuruya, About'a, `platform/lib/marketing/config.ts`
   (`responseTime: '24 hours'`), docs/19, 5 tasarımın `listing_v3.md` + `START_HERE.md`/PDF'ine yazıldı. İade kararı aynı
   dosyalara ve `config.ts` `policies.refund`, admin `refund_or_problem` şablonuna işlendi (2026-10-15).
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
- ~~Shop icon (Logo) ve banner~~ İlk turda uygulanmamıştı (eski görseller vardı, logoyu kaldırma tıklaması izin denetimine
  takıldı). Kullanıcı onayıyla aynı gün uygulandı, bkz. §7.5.
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
| Para birimi | **TRY (₺), kullanıcı kararı 2026-10-15: TRY kalır** (USD önerisi konuşuldu, kullanıcı TRY'yi seçti). Kaynak: Offsite Ads sayfa verisi, `shop_data.currency_code: "TRY"`. Sonuçları: ödeme hesabı TL ise %2.5 döviz çevirme ücreti yok; fiyat kur değiştikçe elle güncellenir; yabancı alıcı fiyatı küsuratlı dolar karşılığıyla görür. İlan fiyatı TL girilir: USD 29.40'ın TL karşılığı henüz belirlenmedi (§8) | Offsite Ads sayfa verisi |
| Offsite Ads | **Kapalı (opt out), 2026-10-15, kullanıcı onayıyla.** Ekran: "You opted out of Offsite Ads on October 15, 2026. It takes a few days to remove all ads with your items from our ad networks. You could see traffic from Offsite Ads up to two days after you've opted out. If those visits bring you a sale in the next 30 days, we'll apply the advertising fee to that order." Sayfa yenilendikten sonra veride `isOptedOut: true`, `optedOutDate: "October 15, 2026"`. Yeniden açma: "You can turn ads back on any time" (sayfada "Turn on Offsite Ads" butonu). Onay penceresi ("A few things to know before you opt out") yalnız çıkmayı onaylattı; para ya da bütçe sormadı. Not: önceki 3 deneme, sekme arka planda kaldığı için çalışmamıştı. Anahtar ("Opt out from Offsite Ads") açık konumdayken "katılım açık" anlamına geliyordu | Marketing → Offsite Ads |
| Etsy Ads | Henüz kullanılamıyor: "13 days left until you can start advertising" (yeni dükkânda 15 gün bekleme) | Marketing → Etsy Ads |
| Vacation mode | Kapalı | Options → Vacation Mode |
| Custom order requests | Disabled | Options |
| Gift wrap / gift note | Gift wrap disabled · gift note **offered** (dijital üründe etkisiz) | Options |
| GPSR | Fiziksel ve dijital: "Sell … to all EEA states and NI" | Options |
| Satıcı statüsü (AB) | Private individual | Shop Home editor → Seller details |
| İlanlar | Active 0 · Draft 0 · Expired 0 · Sold out 0 · Inactive 0 | Listings |

### 7.4 Beklenmedik bulgular
- Dükkân adı `STUDIOBKE`, belgede ise `BKEStudio`. About metni "BKE Studio" diyor. **Karar (kullanıcı, 2026-10-15): Etsy adı
  `STUDIOBKE` olarak kalır;** metinlerdeki marka adı "BKE Studio" değişmez.
- Önceki logo ve banner eski marka çalışmasındandı ("STUDIO BKE INVITATIONS" mührü). Banner "Animated Video" vaat ediyordu;
  video ürünü K22'den beri askıda. §7.5'te değiştirildi.
- Eski URL `/your/shops/me/edit` 404 veriyor. Info & Appearance: `/your/shops/me`; Your shop:
  `/your/shops/me/settings/your-shop/shop-basics`.

### 7.5 Logo ve banner (kullanıcı onayı, 2026-10-15)
Onay: "mevcut logo ve banner'ı brand/etsy dosyalarıyla değiştir; mobil kırpımda logo kesiliyorsa banner'ı yükleme."

| Alan | Yer | Önceki (yedek URL) | Yüklenen | Doğrulama |
|---|---|---|---|---|
| Logo | Shop Home editor (`/shop/STUDIOBKE/edit`) → ikonun üstündeki kamera → "Adjust and crop your icon" → Save → "How's it look?" → Looks good | `https://i.etsystatic.com/68570726/r/isla/de861b/90028703/isla_500x500.90028703_r9emg7wh.jpg` | `brand/etsy/etsy_shop_icon_1000.png` → Etsy görseli `89092710` | Yenilemede vitrinde ve editörde yeni ikon. Etsy şartı: .jpg/.gif/.png, 10 MB altı, en az 500×500 |
| Banner | Shop Home editor → banner sağ altı kalem → "You are editing your banner" modu → "Add an image" → Save. Stil: **Big Banner** (değiştirilmedi; "Choose a banner style": Big Banner / Mini Banner / None, Carousel ve Collage ücretli planda) | `https://i.etsystatic.com/68570726/r/isbl/4fd719/89080116/isbl_3360x840.89080116_nvqgkb5c.jpg` | `brand/etsy/etsy_banner_big_3360x840.jpg` → Etsy görseli `90041343` | Yenilemede vitrinde yeni banner, tam 4:1 |

**Mobil kırpım kontrolü (kaydetmeden önce):** Editörde mobil önizleme yok. Vitrin, 360/390/430/768 px genişlikteki bir iframe'de
ölçüldü. Banner `object-fit: fill` ile kabın tam genişliğinde, 4:1 oranında gösteriliyor (ör. 360 px → 343×86, 390 px →
374×93). Kırpım yok. `min-height: 78px` kuralı yalnız 312 px'ten dar ekranlarda devreye girer. Sağdaki "BKE Studio" yazı logosu
kesilmiyor. 360 px'te yazı logosu yaklaşık 15 px yüksekliğinde. Etsy mobil uygulaması bu yöntemle ölçülemedi.
Mini banner (`etsy_banner_mini_1600x213.jpg`) kullanılmadı; Big Banner mobilde de görünüyor, Mini Banner görünmüyor.

Not: Kamera ve kalem ikonları doğrudan işletim sisteminin dosya penceresini açıyor; bu pencere tarayıcı otomasyonunu kilitliyor.
Dosya, sayfadaki gizli `input[type=file]`'a doğrudan verildi (logo: `#image-manager-shop-icon-form`; banner: düzenleme modunda
banner'ın üstündeki "Add an image" formu).

### 7.6 Etsy'de yeniden girilmesi gereken alanlar (G122, 2026-10-16)
§1.3 ve §2.2 metni 2026-10-15'te Etsy'ye girildikten sonra değişti. Belgedeki metin Etsy'yi güncellemez: aşağıdaki alanlar
Shop Manager'da **yeniden girilmeli** (eski değer §7.1'deki 2026-10-15 girişi), kaydedilip sayfa yenilenerek okunmalı. Bu bulut
oturumu Etsy'ye erişemez; iş `claude-tarayici` rolündedir. Yapılana kadar Etsy'deki metin eskidir.

| Alan | Yer (§7.1) | Değişen | Yeni karakter |
|---|---|---|---|
| Shop announcement | Info & Appearance → Shop Announcement | HOW IT WORKS 3. madde: "Guests open the envelope" → "Guests open your invitation" | 759 |
| About story | Your shop → Shop basics → About your shop → Your story | 1. paragraf: "tap a closed envelope" → "tap a closed envelope, gatefold or keepsake (each design has its own)" | 819 |

Değişmeyenler: Tagline (§1.1 notu), Message to Buyers (§1.4, §1.5), Headline, bölüm adları (06–20 yalnız ilanlar yayınlanınca
atanır, §3), SSS (§4.1).

## 8. İlan paketi (01–05) — yüklemeye hazır, Etsy'ye eklenmedi (2026-10-15)

Kullanıcı kararı (2026-10-15): ilanlar **yüklenecek biçimde hazırlanır ama Etsy'ye eklenmez** (taslak da açılmaz). Önce testler yapılacak.
Fiyat şimdilik **USD 29.40**; nihai fiyat docs/15 §5'te açık.

- Kaynak metin: her tasarımın `package/listing/listing_v3.md` dosyası. Yükleme verisi: aynı klasördeki `etsy_upload.json`.
  Üreten: `python3 tools/etsy_upload.py`; yalnız denetim için `--check`. JSON'da başlık, açıklama, 13 etiket, kategori ve
  nitelikler, fiyat, bölüm, dijital dosya (`START_HERE.pdf`), görsel listesi ve alt metinleri, GPT mockup sahneleri,
  `open_checks` ve `blockers` bulunur.
- Açıklamadaki `[VERIFY: …]` notları JSON'da metinden çıkarıldı ve cümlesiyle birlikte `open_checks`'e taşındı (tasarım başına 8).
  Bunlar canlı site, gerçek telefon, sipariş doğrulaması ve Etsy'nin AI/"Designed by" kuralıyla ilgili. Test sonucu olumsuzsa
  cümle `listing_v3.md`'den silinir ya da yeniden yazılır, sonra JSON yeniden üretilir.
- Kurallar geçti (listing_kit kuralları): başlıklar 101–113/140, etiketler 13/13 (≤ 20 karakter, küçük harf).
- **Görseller hazır değil.** 01 ve 03'ün 8 görseli eski editörle çekildi (G059), yeniden yapılmalı. 02, 04 ve 05'in görseli yok.
  GPT'nin Etsy mockup sahneleri (PAKET 3, `assets/gpt/mockups/`) 5 tasarımda da mevcut. Bu yüzden şimdilik yeni GPT promptu
  gerekmiyor. Kalan iş Claude'un: güncel editörden gerçek ekran çekmek ve bunları yeşil ekranlara yerleştirmek
  (`tools/mockup_compose.py`). Ardından 8 ilan görselini kurmak. `listing_kit.py` şu an yalnız 01 ve 03'ü tanıyor.
- Karar bekleyenler: adet (quantity), otomatik yenileme (her yenileme ilan ücreti), nihai fiyat.
- **Para birimi TRY (kullanıcı kararı, 2026-10-15).** Etsy ilan fiyatını dükkân para biriminde ister. `etsy_upload.json`'daki `price_usd: 29.40` bir hedef değerdir; Etsy'ye TL fiyat girilecek. TL tutar ve kur güncelleme sıklığı kullanıcı kararıdır (docs/15 §5).
- Yayın öncesi kontrol listesi: her `listing_v3.md` §11.
