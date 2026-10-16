# Referans tasarım turu — Refero Pro (G088, K31, 2026-10-15)

Yapan: `claude-local-1`, kullanıcının Refero Pro hesabıyla (Chrome, oturum açık). Yöntem: Refero **Research mode** — her ekran türü için
bizim durumumuzu anlatan bir soru; Refero kendi kütüphanesindeki gerçek ürün ekranlarını (iOS + web) arayıp örnekli bir analiz döndürdü.
Aşağıdaki "referanslar" o analizlerde adı geçen ürün ekranlarıdır; **ekran görüntüsü kopyalanmadı** (şart 6), `docs/18_referans/`
klasörü açılmadı — kırpım yerine Refero araştırma bağlantıları verildi (yalnız kullanıcının hesabıyla açılır).

"Bizde şu an" sütunu G079/G092/G096 canlı gezintilerinden (`docs/10_canli_test/g079/`, `g092/`, `g096/`) gelir. Görsel dil GM04/GM05
(BKE Studio) korunur; burada istenen şey **düzen, hiyerarşi ve sadelik**tir, yeni bir görsel kimlik değil. Kodu G089 ve sonraki
claude-kod görevleri uygular; görsel parça gerekirse GPT (K21).

**Öncelik:** P1 = kullanıcının "çok daha basit" isteğine (K29) doğrudan dokunur · P2 = belirgin iyileşme · P3 = cila.

## 1. Kurulum sihirbazı (3 adım) — `#setup/1…3`

Refero: [Wedding Website Onboarding Patterns](https://refero.design/research/fc662df1-d634-4e8b-891c-d1934bc722af)
Referanslar: Target (adım göstergesi + iki alanlı olay formu), Loowner (üstte ilerleme, ekranda tek mesaj + tek eylem), ElevenMusic
(foto + isim adımında "Skip"), Notion (yayınlamadan önce ne olacağını anlatan ekran), Luma (onay + paylaş/davet eylemleri), Givingli
(başarıdan sonra isteğe bağlı sonraki adımlar).

| Bizde şu an | Değişiklik | Öncelik |
|---|---|---|
| 1. adımda 4 satırlık "değişiklik hakkı" notu + "How your names appear" açıklaması | Ekranda tek iş: iki isim + tarih. Hak notunu tek satıra indir ("After publishing you can change names or the date 3 times.") ve "Learn more" ile aç; "How your names appear"i ilk ekrandan kaldır | P1 · ✓ G100 |
| Başlık "Your names and date", ilerleme çubuğu üstte | Doğru; "Step 1 of 3 · Your names and date" biçimine geç (adım adı ile sayı tek satırda) | P3 · yapılmadı (h1 ile tekrar olur) |
| 2. adım "Add your photo" + "More photos (Optional)" + "Skip for now" | "Skip for now" birincil düğmenin yanında aynı ağırlıkta dursun (şu an altta küçük); "More photos" kurulumdan çıksın (Edit → Photos) | P2 · ✓ G121 |
| 3. adım: tarih kapısı + "Publish my website" | Yayından önce tek cümle: "Guests can open your website with the link. You can keep editing after." (Notion); tarih kapısı korunur | P2 · ✓ G121 |
| Yayın sonrası: link, Copy/Open/Share, QR, PNG/SVG, "Go to my editor" | Başarı ekranında önce **link + Share**; QR ve indirmeler "More ways to share" altında; sonra 2–3 isteğe bağlı sonraki adım (Givingli/Luma) | P1 · ✓ G100 |

## 2. Düzenleyici — Edit listesi, sayfa formları, şerit

Refero: [Simple Mobile Wedding Site Editor](https://refero.design/research/79db0383-d9b9-4ca2-84ff-912928ce402a)
Referanslar: Play ve Shopify (sayfa bağlamı önizlemenin yanında), Buy Me a Coffee ve Linktree (alanları anlamlı bölümlere ayırma,
alanın açık/zorunlu durumu listede görünür), Mailchimp, Craft (ortak seçeneklerden sonra "Advanced"), Notion ve Medium (yayın
kontrolü sayfanın geri kalanından ayrı; önizleme + son yayın eylemi birlikte).

| Bizde şu an | Değişiklik | Öncelik |
|---|---|---|
| Day & place tek ekranda ~20 alan (tarih, saat, saat dilimi, tarih biçimi, geri sayım, mekân, program, After the wedding) | Önce yalnız misafirin ihtiyacı: tarih, saat, mekân adı + şehir. **Time zone, Date style, Show countdown** → "More options" açılır bölümü (Craft). Program ve After the wedding ayrı alt başlıklar | P1 · ✓ G087/G100 |
| Editörlerde alan başına "Sample" rozeti (Details'te 4–5) | Rozet yerine sayfanın başında tek satır: "3 fields still show sample text" + ilkine git; alanın kendisinde yalnız soluk yer tutucu metni | P1 · ✓ G100 |
| Her sayfanın sonunda "Headings & labels on this page" | "Advanced: change headings & labels" adıyla kapalı açılır bölüm (Craft) | P2 · kısmen: zaten kapalı açılır bölüm; ad değişmedi (START HERE, Review) — karar bekliyor |
| Kaydetme durumu üstte bulut ikonu; "Unpublished changes: n · Review · Publish" şeridi | Doğru yönde. Medium/Notion gibi ikisini ayır: otomatik kayıtta kısa "Saved" geri bildirimi, şerit **yalnız** taslak canlıdan farklıyken. Review sayfası değişen sayfaları önizlemeyle göstersin | P2 · ✓ G121 |
| Edit listesi 6 satır (Us · Day & place · Photos · Our Story · Details · RSVP) | Korunur (Shopify/Play: adlı satırlar, nokta sayfalama değil). Seçili sayfanın önizlemesi bir dokunuşla açılsın ("Preview this page" zaten var — satırın yanına da) | P3 · yapılmadı |

## 3. Ana ekran (Home) ve ayarlar

Refero: [ana ekran araştırması](https://refero.design/research/79fe3946-26b4-47ec-9cc3-7f87a8902ad2)
Referanslar: Shopify (önemli durumun altında kompakt ilerleme rehberi), Monday.com (hafif ilerleme çubuğu + kontrol listesi; durum
seçici), Notion (davet, link görünürlüğü ve paylaşma tek odakta; tarih/saat/saat dilimi değer satırları), Moises (izinler açık ama ikincil),
Poppy (gruplu ayar listesi).

| Bizde şu an | Değişiklik | Öncelik |
|---|---|---|
| "Your website is 32% ready" + sıradaki 3 iş | Korunur — ekranın çapası bu (Shopify). Yüzde kartı en üstte, isim/tarih başlığı daha küçük | P2 · ✓ G121 |
| Durum: "Live" rozeti + "Your website is live — 14 things…" kartı + üst çubukta Live | Tek sakin durum etiketi (Notion/Monday): üstte "Live" ya da "Draft", yanında doğrudan eylem; kartta tekrar etmesin | P2 · ✓ G121 |
| Saat dilimi, tarih biçimi Day & place içinde; isim/tarih hakkı alanların yanında | Seyrek ayarlar için Home'dan ulaşılan küçük **Settings** listesi (Poppy/Notion değer satırları): Time zone · Date style · Name & date changes left · Guest password | P2 · ✓ G121 |

## 4. Paylaş (Share) ve misafir listesi (Guests)

Refero: [Mobile Sharing & RSVP Patterns](https://refero.design/research/770340c6-6341-468b-8f00-dd0dd5f14825)
Referanslar: Craft (kopyala/paylaş, QR ve parola tek panelde), Linktree (URL + kopyala görünür kalan kompakt paylaşım), Luma (arama +
durum sekmeleri, kişi başına kompakt yanıt rozeti), Hitchd (özet sayılar, arama, süzgeç, misafir satırları ve dışa aktarma tek
yönetim görünümünde), Partiful (tek yanıtı açınca soru cevapları ve geçmiş), Typeform (seçenek başına sayı + yüzde).

| Bizde şu an | Değişiklik | Öncelik |
|---|---|---|
| Share: link + Copy/Open/Share, QR + PNG/SVG, Guest password (kapalı), Your private edit link (kapalı), "Take the website offline" | Sıra doğru (K29). QR'ı da kapalı bir bölüme al ("QR code for printed cards"), ilk ekranda yalnız link + Copy + Share kalsın (Linktree). "Take the website offline" en alta, tehlikeli eylem görünümünde | P2 · ✓ G121 |
| Guests: 3 sayı kartı, kapanış şeridi, "n new replies" bandı, Answers dökümü, liste | Hitchd/Luma düzeni: sayılar → arama + durum sekmeleri (All · Coming · Not coming · New) → liste; **Answers dökümü ayrı bir "Results" görünümüne** (Typeform: sayı + yüzde). Telefonda ilk ekranda liste görünmeli | P1 · ✓ G100 |
| Yanıt kartı "…" menüsü | Kartı açınca Partiful gibi tek yanıt sayfası: kişi(ler), cevaplar, not, kaynak (misafir/çift), düzenle | P3 · yapılmadı |

## 5. Satış sitesi (ana sayfa, galeri, tasarım sayfası, fiyat/SSS)

Refero: [Mobile Wedding Template Marketing…](https://refero.design/research/8482529a-58c0-45ca-aedc-75790a672df7)
Referanslar: Partiful (düğün şablonu galerisi + doğrudan "Create yours"), Hitchd (örnekler, fiyat, yorumlar sırayla; düğüne özel tasarım
önizlemeleri; fiyatın yanında güven ve SSS), PamPam (telefon önizlemesiyle gerçek düğün kullanımı), Pop Site (yüzen telefon maketlerinde
örnek siteler), Linear (telefonla açılan hero), Squarespace (büyük şablon önizlemesi + "View demo site" + tek birincil eylem), Craft
(kategori + tekrar eden önizleme kartları), Arcade (kısa fiyat bilgisi + SSS akordeonu). Not: Refero'nun web örnekleri masaüstü
görüntüleri; mobil kırılımı doğrulamazlar.

| Bizde şu an | Değişiklik | Öncelik |
|---|---|---|
| Hero: başlık + metin + "Open the invitation" + tek telefon önizlemesi | Doğru yönde (gerçek tema ekranı, Pop Site/PamPam). Telefon çerçevesinde **kaydırılabilir 3–4 gerçek ekran** (zarf → home → RSVP) ve "Tap to open" ipucu | P2 · yapılmadı (gerekçe §9) |
| /designs: 14 kart, her kartta "Live demo" | Kartlar taranabilir kalsın; karttaki tek eylem **"Live demo"**, satın alma tasarım sayfasında (Squarespace). 14 tasarımda stil çipleriyle süzme (Craft: kategori) | P2 · ✓ G121 |
| Tasarım sayfası | Büyük önizleme + kısa özet + **tek birincil eylem** ("Buy on Etsy"), "View live demo" ikincil (Squarespace) | P1 · ✓ G099 |
| Fiyat sayfası `[PRICE]`, `[ETSY SHOP URL]` yer tutucuları | Fiyat + "neler dahil" kartları + güven (yorumlar, iade/yanıt süresi) **aynı ekranda**, hemen altında SSS akordeonu (Hitchd, Arcade). Yer tutucular kullanıcı kararı bekliyor | P1 (karar sonrası) · karar bekliyor |
| Mobil sıra | Refero'nun önerdiği tek sütun: hero önizleme → tasarımlar → seçili tasarım + canlı demo → nasıl çalışır → fiyat ve dahil olanlar → yorumlar/SSS → satın alma | P2 · ✓ G121 |

## 6. Dükkân paneli (/admin)

Refero: [Responsive Shop Admin Patterns](https://refero.design/research/07b73ad2-ac14-421d-8293-2d3bd3f42893)
Referanslar: Shopify iOS admin (bakış panosu ile iş listesi ayrı; telefonda tek sütun tarama), Shopify web + PayPal + Kitchen.co (arama ve
durum süzgeçleri listenin hemen üstünde), Programa (ayrı yeniden gönder/durum paneli), Zendesk + Missive (müşteri bağlamı + hazır
yanıtlar), silme onayında adı yazdırma örneği + Fibery, Shuttle (uyarı metni, iptal/sil yerleşimi).

| Bizde şu an | Değişiklik | Öncelik |
|---|---|---|
| Özet: geçici şifre uyarısı, sayı kartları, Yapılacaklar, son siparişler, haftalık satış | Yapılacaklar **en üstte** (sayı kartlarından önce); onay bekleyen sipariş kırmızı/turuncu tek satır + tek dokunuşla onay sayfası (Shopify) | P1 · ✓ (G095 Özet: Yapılacaklar sayı kartlarının üstünde) |
| Siparişler: süzgeç çipleri + arama + kartlar | Doğru (Shopify/PayPal). Telefonda kart başına 3 satırdan fazla bilgi olmasın; durum rozeti solda | P3 · yapılmadı |
| Site sayfası: Bilgiler, Etsy mesajı, Destek işlemleri, Siteyi sil | Destek işlemlerini **niyete göre** grupla ve geri alınabilir olanlarla (yeni link, hak ekle, süre uzat) yüksek etkili olanları (yayından kaldır) ayır (Programa/Zendesk). Etsy mesajı müşteri bağlamının yanında (Zendesk makroları) | P2 · ✓ G121 |
| Siteyi sil: adres yazınca açılan kırmızı düğme | Korunur — adı yazdırma doğru örnek. Uyarı metni kısa, "Cancel" solda, "Delete permanently" sağda (Fibery/Shuttle) | P3 · ✓ G121 |

## 7. GPT comp istekleri (gerekirse, GM05 dili)

Kod değişikliklerinin çoğu mevcut bileşenlerle yapılabilir. Görsel karar gerektiren üç ekran için GM05 diliyle yeni comp önerilir:
1. **Guests v3** (390 px): sayılar → arama + sekmeler → liste; ayrı "Results" (soru dökümü) ekranı.
2. **Kurulum 1. adım sade hâli + yayın başarı ekranı** (link + Share önde, "More ways to share", 2–3 sonraki adım).
3. **Satış sitesi tasarım sayfası** (büyük kaydırılabilir telefon önizlemesi + tek "Buy on Etsy" + ikincil "View live demo").

## 8. Notlar
- Refero analizleri kendi sınırlarını da yazdı: düzenleyicide "kalıcı yayınlanmamış değişiklik şeridi" ve tam bir düğün sitesi
  düzenleyicisi kütüphanede birebir yok; öneriler bileşen kalıplarından derlendi. Misafir listesinde sayı/döküm için en güçlü örnekler
  masaüstü panoları.
- Refero bağlantıları kullanıcının hesabına bağlıdır; hesapsız açılmaz.

## 9. Uygulama durumu (G121, 2026-10-16)
Tablolardaki "Öncelik" hücresine durum eklendi: **✓ G0xx** = o görevde yapıldı (G087 admin + Day & place "More options", G095 admin
Özet, G099 satış vitrini ve tasarım sayfası, G100 panel P1'leri, G121 kalan P2'ler); "karar bekliyor" = kullanıcı/koordinatör kararı;
"yapılmadı" = P3 ya da gerekçeli olarak bırakıldı.
- **Hero'da kaydırılabilir 3–4 ekran (§5, P2) yapılmadı:** 390 px'te telefon çerçevesi 160 px (kaydırması zor), açılış dizisi
  (kapalı → açılıyor → ana sayfa) hemen aşağıdaki "How the opening works" bölümünde gerçek kayıtla var, "Tap to open" ipucu zaten var
  ve ilk ekran düzeni G093–G099 tarayıcı testleriyle ölçülü; telefonda dokununca gerçek demo açılıyor.
- **"Headings & labels" adı (§2, P2):** bölüm zaten kapalı açılır ve sayfanın sonunda (Craft düzeni); "Advanced: change headings &
  labels" adına geçmek START HERE rehberlerini (docs/19 Ek A), Review satırlarını ve testleri birlikte değiştirmeyi gerektirir —
  koordinatör kararı.
- **Fiyat sayfası (§5, P1):** fiyat ve Etsy linki kararı bekliyor; düzen karar sonrasına.
- Ayrıntı: `gorevler/G121-panel-satis-kalanlar.md`; ekranlar `platform/previews/g121/`.
