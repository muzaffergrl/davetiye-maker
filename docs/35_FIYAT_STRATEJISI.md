# 35 — Fiyat stratejisi (2026-10-22)

**Durum: öneri, karar değil.** Bugünkü onaylı fiyatlar (K42, docs/23 §1) değişmedi: tasarım **1.460 TL**, kurulum **500 TL**,
özel tasarım **2.960 TL**, ek revizyon **500 TL**. `platform/lib/marketing/config.ts` ve `etsy_upload.json` dosyalarına
dokunulmadı. Bu belge docs/15 §3'ün (14 Ekim) güncel pazar ve kur verisiyle yeniden ele alınmış halidir.

**Kaynak sınırı.** etsy.com bu ortamdan açılamıyor (DNS hatası). Etsy fiyatları arama motoru özetlerinden ve docs/13'teki
81 ilanlık ölçümden geliyor. Etsy ücretleri ikincil kaynaklardan; yayından önce Shop Manager → Finances ekranında doğrulanmalı.

---

## 0. Özet

| Ürün | Bugün | Öneri | ≈ USD | Satış başına net (TL / USD) |
|---|---|---|---|---|
| Tasarım — **lansman** (ilk 10 yorum) | 1.460 TL | **1.190 TL** (düz fiyat, üstü çizili değil) | $24.02 | 947 TL / $19.12 |
| Tasarım — **normal** (≥ 10 yorum, ort. ≥ 4.8) | 1.460 TL | **1.490 TL** | $30.07 | 1.193 TL / $24.08 |
| Tasarım — **kanıtlı** (≥ 30 yorum ya da Bestseller rozeti) | — | **1.790 TL** | $36.13 | 1.439 TL / $29.05 |
| "We set it up for you" | 500 TL | **990 TL** | $19.98 | 783 TL / $15.81 |
| Özel tasarım (şablon dahil) | 2.960 TL | **4.490 TL** | $90.62 | 3.653 TL / $73.73 |
| Ek tasarım revizyonu (tur başı) | 500 TL | **690 TL** | $13.93 | 537 TL / $10.84 |

Kur 49,55 TL/USD (19 Ekim, CNBC-e serbest piyasa). Net = fiyat − Etsy ücretleri (§3.1); Etsy Ads harcaması hariç.

**Tek cümleyle strateji:** Etsy'nin **üst bandında** dur (Canva şablonlarından pahalı, çünkü biz barındırıyoruz ve RSVP
dahil), Greenvelope / Paperless Post gibi misafir başına ücret alan servislerin **çok altında** kal; fiyatı **yorum sayısına
bağlı üç basamakla** yükselt; kalıcı indirim yapma; ek hizmetleri emeğe göre fiyatla; TL fiyatı her ay kura göre düzelt.

---

## 1. Pazar (Ekim 2026)

| Küme | Fiyat | Not |
|---|---|---|
| Etsy, Canva website şablonu (docs/13, 81 ilan) | indirimli satış medyanı **$18.19**; üst çeyrek $22.47; en yüksek $32.18; liste fiyatı medyanı $26.95 | 72/81 sürekli indirimde (medyan %40). $35 üstü satış fiyatı yok |
| Etsy, animasyonlu zarf + RSVP (Ekim 2026 arama özeti) | ucuz uç $1–4 (yalnız video), orta $8–17, üst uç **$26–27** (çok sayfalı website + zarf) | Hepsi Canva teslimi; alıcı kendisi düzenleyip yayınlıyor |
| Etsy, "hosted for you" / concierge | **$17–19** satış ($54.59'dan %65 indirimle gösteriliyor) | Barındırılan site satan az sayıda ilan var; hepsi elle yapılan hizmet |
| Etsy, Wix / WordPress / HTML şablon | $9–36 | Alıcı kendi barındırıyor |
| Greenvelope | $19 (küçük liste) · **$99 / 100 misafir** · $199 / 200 misafir | Misafir sayısına göre, tek seferlik |
| Paperless Post premium | ≈ $60–115 / 100 misafir (üçüncü taraf karşılaştırması) | Tasarıma göre değişiyor |
| Joy, Zola, The Knot | site ücretsiz | Gelir hediye listesinden; "şov" açılış yok |

**Çıkarımlar**
1. **Doğrudan rakibimiz yok.** Etsy'de hem "hazır tasarım + zarf açılışı" hem "barındırılan site + panel + RSVP" satan ilan
   bulunmadı. Bu ikisi ayrı ayrı var: Canva şablonları ($18–27) ve elle yapılan concierge siteler ($17–19 indirimli).
2. **Alıcının referansı Etsy'deki indirimli fiyat.** Arama sonucunda alıcı "$18.65 ~~$28.70~~" görüyor. Bizim $30'umuz bunun
   ≈ 1,6 katı. Bu farkı ilan kapağı ve ilk iki görsel açıklamalı: "No Canva needed · hosted for you · RSVP included".
3. **Asıl değer karşılaştırması platformlarla.** 100 misafirli düğünde Greenvelope $99. "One price, unlimited guests" mesajı
   fiyatı ucuz gösterir; "yalnız $30" demeden.
4. **Pazarın tavanı ≈ $32–36.** Yorumsuz yeni dükkân bu tavana çıkamaz; yorum geldikçe çıkabilir.

---

## 2. Neden bu basamaklar

### 2.1 Lansman 1.190 TL (≈ $24)
- Yeni dükkân, **0 yorum.** Etsy'de dönüşümü en çok yorum ve sipariş geçmişi belirler; ilk 10 yorum en pahalı varlıktır.
- $24, pazar üst çeyreğinin ($22.47) hemen üstü: "ucuz şablon" sinyali vermez, ama yorumsuz $30'dan kolay satar.
- Net $19,12 hâlâ pazar medyanındaki Canva satıcısının brüt fiyatından yüksek.
- **Zamanlama iyi:** nişan sezonu Kasım–Şubat; Etsy'de "wedding invitation" aramaları Ocak'ta zirve (bir anahtar kelime
  aracına göre Kasım'dan ≈ %59 fazla). Kasım'da lansman → Ocak zirvesine yorumlarla girilir.
- **Düz fiyat.** Üstü çizili "1.490 → 1.190" gösterilmez: 1.490'dan henüz satış yapılmadı; Etsy rehberi ve FTC referans fiyat
  kuralı (docs/15 risk 7) buna karşı.

### 2.2 Normal 1.490 TL (≈ $30)
- Bugünkü onaylı 1.460 TL'nin kur sonrası karşılığı (1.460 TL bugün $29.47; 2026 sonu beklentisi 51,55 ile $28.32'ye düşer).
- Pazarın görülen en yüksek satışı ($32.18) altında. $25–35 bandında 16 ilan var; hepsinden fazla şey veriyoruz.

### 2.3 Kanıtlı 1.790 TL (≈ $36)
- Yalnız sosyal kanıt oluşunca: ≥ 30 yorum ya da Bestseller / Star Seller rozeti ve dönüşüm normal aşamadaki kadar.
- Bu, pazarın bilinen tavanını aşan tek basamak. Dönüşüm düşerse (§5) 1.490'a dönülür.

### 2.4 Tüm tasarımlar aynı fiyat
- 21 (ileride 48) tasarımın hepsi aynı fiyatta. Tek alan (`config.ts`), tek mesaj, asistanlara tutarlı fiyat (docs/14 §1.2).
- Tasarıma göre fiyat ancak veri gelince: belirli bir tasarım diğerlerinden açıkça fazla satıyorsa o tasarım bir basamak
  önden gidebilir. Lansmanda yok.
- Renk paletleri (docs/25) **ücretsiz** kalır: rakip şikâyeti "renk değiştirmek zor" (docs/13 §6); bu bizim farkımız.

---

## 3. Birim ekonomi

### 3.1 Etsy ücret modeli (TR satıcı, ilan TRY, ödeme hesabı TRY)
- İşlem ücreti %6,5 · ödeme işleme %6,5 + 14 TL (vergi dahil toplam üzerinden; vergi ort. +%5 varsayıldı) ·
  Regulatory Operating Fee **%1,67** (22 Haz 2026'dan beri; bazı kaynaklar hâlâ %2,24–2,27 diyor, doğrulanmadı) ·
  listeleme $0,20 (≈ 10 TL) · bunların hepsine %20 KDV.
- Döviz çevirme %2,5 **yok** (ilan ve ödeme hesabı ikisi de TRY, K38).
- Offsite Ads kapalı (docs/20 §7.3). Açılsaydı reklamdan gelen siparişte ayrıca %15 + KDV.
- Sonuç: tasarım fiyatında Etsy payı ≈ **%20**; 500 TL'lik hizmette sabit kalemler yüzünden ≈ %24.

### 3.2 Neden ek hizmet fiyatları artmalı
- **Kurulum 500 TL → net 381 TL ($7,70).** İş: alıcıdan içeriği almak, 5 foto + metinleri girmek, kontrol, Etsy mesajları.
  Gerçekçi ≈ 30–45 dk + yazışma. Satılan her kurulum, saat başı $10–15'e çalışmak demek.
  Etsy'deki concierge siteler indirimli $17–19, liste fiyatı $54,59. **990 TL ($20)** bu bandın içinde, net $15,81.
- **Özel tasarım 2.960 TL → net 2.399 TL ($48).** Yeni GPT sanatı, tema kurulumu, 2 revizyon, münhasırlık (başkasına
  satılmaz, K42). Bu, satılabilir bir tasarımın üretim maliyetini tek alıcıya veriyor. **4.490 TL ($91)**; şablon fiyatının
  ≈ 3 katı. Talep az olursa da sorun değil: bu ilanın asıl işi çıpa olmak (yanında $30 makul görünür).
- **Ek revizyon 500 → 690 TL.** Özel tasarımda üçüncü turu caydırmak için; Etsy payı küçük tutarda orantısız.

### 3.3 Sepet büyütme
- **Kurulum, tasarım ilanında varyasyon olsun** (öneri): `Wedding website` 1.190/1.490 · `Website + we set it up for you`
  +990. Alıcı hizmeti satın alma anında görür; ayrı ilan yalnız sonradan isteyen için kalır. Etsy Services kuralı açısından
  ayrı ilanla aynı risk (docs/23 §2 `[VERIFY]`); karar kullanıcıda (§7).
- Save the Date ürünü gelince: `Website + Save the Date` varyasyonu, tek başına alımdan ≈ %35 pahalı (docs/15 §3.8 ile aynı mantık).
- Etsy "çoklu alım indirimi" anlamsız (bir çift bir site alır). Tekrar alım yolu: aynı çiftin nişan / bridal shower
  sitesi ileride ayrı ürün olursa.

---

## 4. Kampanya takvimi (yılda 3–4 gerçek, süreli kampanya)

Kampanya yalnız **normal fiyattan gerçekten satış yapılmış** dönemden sonra ve **≤ 30 gün** (Etsy satış aracı sınırı).

| Dönem | Ne | Neden |
|---|---|---|
| Kasım 2026 – lansman | Kampanya yok, düz 1.190 TL | İlk yorumlar; üstü çizili referans fiyat henüz yok |
| Black Friday / Cyber Monday 2027 | %20–25, ≤ 7 gün | Etsy'nin kendi trafiği; alıcılar indirim arıyor |
| Ocak–Şubat (zirve) | **Kampanya yok** | Talep zaten en yüksek; indirim marj kaybı |
| Mart–Nisan | İsteğe bağlı %15, ≤ 14 gün | Bahar düğünleri için geç kalan alıcı |
| Haziran–Ağustos (durgun) | %20, ≤ 21 gün | Talep düşük; yorum akışını korumak |

Kampanya bitince fiyat aynı gün normale döner. Satış sitesi `price` ve `compareAtPrice` alanları kampanyayla aynı gün
güncellenir (docs/14 §10).

---

## 5. Ölçüm ve karar kuralları

Etsy A/B testi sunmuyor; basamaklar sırayla denenir. Her basamak en az **300 ilan ziyareti** (21 ilanın toplamı) ya da
**30 gün** görmeden yargılanmaz. Kaynak: Shop Manager → Stats (visits, orders, conversion rate).

| Durum | Karar |
|---|---|
| Lansmanda 10 yorum, ortalama ≥ 4.8 | 1.490'a çık |
| 1.490'da dönüşüm, lansmandakinin ≥ %70'i | Kal; ≥ 30 yorumda 1.790'ı dene |
| 1.490'da dönüşüm, lansmandakinin < %50'si (60 gün) | 1.290'a in, ilan görsellerini yeniden ele al |
| 1.790'da gelir (sipariş × net) 1.490'dakinden düşük | 1.490'a dön |
| Kurulumun eklenme oranı < %5 | Hizmet mesajını ilk görsellere taşı; fiyat değil, görünürlük sorunu |
| Kurulumun eklenme oranı > %30 | 1.190'a çık; talep emeği aşıyor |

**Varsayım:** Etsy'de dijital ürün dönüşümü genelde %1–3 (ikincil kaynak; bizim için ölçülmedi). Lansmanda %1'in altı fiyat
değil vitrin sorunu sayılır: önce kapak, başlık, video.

---

## 6. TL fiyat ve kur kuralı (K38: dükkân TRY kalır)

- TCMB Ekim 2026 Piyasa Katılımcıları Anketi: yıl sonu USD/TRY beklentisi **51,55**, 12 ay sonrası **59,26** (bugün 49,55).
  Yani TL fiyat sabit kalırsa dolar karşılığı bir yılda ≈ **%16** erir; ayda ≈ %1,5.
- **Kural:** her ayın ilk iş günü hedef USD fiyat × güncel kur → en yakın **x90 TL**'ye yuvarla. Fark %3'ten azsa
  dokunma. Hedefler: lansman $24, normal $30, kanıtlı $36, kurulum $20, özel $90, revizyon $14.
- Değişiklik `config.ts` + bütün `etsy_upload.json` dosyalarına aynı gün işlenir (docs/14 §10: fiyat her yerde aynı).
- Yabancı alıcı fiyatı Etsy'nin çevirdiği küsuratlı dolarla görür ($24.02 gibi); bunu kontrol edemeyiz, sorun değil.

---

## 7. Yapılmayacaklar

- **Kalıcı "%50 indirim" görüntüsü.** Rakiplerin 72/81'i yapıyor; Etsy rehberine ve FTC kuralına ters (docs/15 risk 7).
  Bizim fiyatımız düz ve gerçek.
- **Pazarın en ucuz ucu ($1–10).** Barındırma, destek ve panel maliyeti olan ürün o uçta zarar eder ve düşük kalite sinyali verir.
- **Misafir sayısına göre fiyat.** Greenvelope'a karşı en güçlü mesajımız "unlimited guests".
- **Etsy dışında fiyat, kupon, ödeme linki** (Off-Platform politikası, docs/15 §4.1).
- **Barındırma uzatma / düzenleme hakkı satmak** — lansmanda yok (docs/15 §3.10).

---

## 8. Kullanıcıdan beklenen kararlar

1. **Basamaklı tasarım fiyatı:** lansman 1.190 → normal 1.490 → kanıtlı 1.790 TL (öneri) mi, yoksa baştan düz 1.460/1.490 mı?
2. **Ek hizmet fiyatları:** kurulum 990, özel tasarım 4.490, revizyon 690 TL (öneri) mi, mevcut 500 / 2.960 / 500 mü?
3. **Kurulum varyasyonu:** her tasarım ilanına "+ we set it up for you" varyasyonu eklensin mi (ayrı ilan da kalır)?
4. **Aylık kur güncellemesi** kuralı (§6) uygulanır mı?

Onay gelince: `config.ts` fiyatları, 21 tasarım + 3 hizmet `etsy_upload.json`, docs/01 (yeni K kaydı), docs/23 §1 güncellenir
(entegratör, AGENTS.md).

---

## 9. Kaynaklar

- docs/13 §4 (81 Etsy website ilanı, 2026-10-13) · docs/15 §3 (ücretler, maliyet, risk 7) · docs/23 §1 (onaylı fiyatlar).
- Etsy arama özetleri (Ekim 2026; sayfalar doğrudan açılamadı): https://www.etsy.com/market/rsvp_wedding_website ·
  https://www.etsy.com/market/wedding_website_canva_animated_envelope · https://www.etsy.com/market/wedding_websites ·
  https://www.etsy.com/listing/4326097919/animated-wedding-invitation-envelope
- Greenvelope karşılaştırması: https://www.greenvelope.com/resources/best-digital-wedding-invitation-platforms ·
  https://progressive.greenvelope.com/compare/greenvelope-vs-paperless-post (Greenvelope'un kendi sayfası, pazarlama iddiası)
- Joy: https://withjoy.com/blog/best-digital-save-the-date-platforms-for-2026-weddings/
- Etsy ücretleri (ikincil): https://beancount.io/uk/blog/2026/08/22/etsy-regulatory-operating-fee-increase-june-2026-seller-payout-bookkeeping-guide ·
  https://www.ideasoft.com.tr/etsy-komisyon-oranlari/ · https://printful.com/blog/how-much-does-etsy-take-per-sale
- Mevsimsellik (zayıf kaynak): https://www.listifyai.net/keyword/wedding-invitation
- Fiyatlama rehberleri (satıcı blogu): https://listingview.io/blogs/how-to-price-products-on-etsy-2026 ·
  https://www.unilink.us/blog/digital-products-etsy-2026
- Kur: https://www.iscihaber.net/ekonomi/19-ekim-2026-dolar-ne-kadar-euro-bugun-kac-tl-oldu/273006 ·
  TCMB anketi: https://www.foreks.com/haber/detay/6ad1d143422c786f3f7a43e8/PICNEWS/tr/piyasa-katilimcilarinin-yil-sonu-enflasyon-beklentisi-yuzde-29-63-e-yukseldi-16-10-26/
- Net hesabı: §3.1 modeli; betik bu oturumun geçici klasöründe, sonuçlar §0 tablosunda.
