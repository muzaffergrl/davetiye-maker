# Rehber içerik planı (G192, 2026-10-22)

Kullanıcı (2026-10-22): "içerik planıyla devam edelim" (G191 SEO/GEO/AEO denetiminin devamı, docs/35).
Yöntem: claude-seo `seo-cluster` + `seo-content-brief` (commit `23a2a81`). Anahtar kelimeler **gerçek Google sonuçlarının
örtüşmesine** göre kümelendi: iki sorgunun ilk 10 sonucunda kaç URL'nin ortak olduğuna bakıldı. 7–10 ortak sonuç = aynı
sayfa; 4–6 = aynı küme; 2–3 = birbirine link; 0–1 = ayrı sayfa.

**Sınır:** arama hacmi verisi yok (DataForSEO, Ahrefs, Google Ads ve GSC bu oturumda bağlı değil). Öncelik üç ölçüte göre
belirlendi: (1) ürünle uyum, (2) ilk sayfada kimin olduğu (forum, ince blog ya da satıcı kopyası varsa kazanılabilir;
The Knot/Zola doluysa zor), (3) mevcut rehberle çakışmama. 26 sorgu arandı (2026-10-22, ABD sonuçları). **Lansmandan
sonra GSC verisi gelince sıra yeniden yapılır** (docs/14 §11.4: "Rehber konuları gerçek sorgu verisinden seçilir").

## 0. Özet

- Bugün 6 rehber var, hepsi aynı geniş konuda ("wedding website"). Plan **12 yeni rehber** ekliyor ve onları 3 kümeye
  ayırıyor. Hız docs/14 §1.1'deki gibi ayda 2 rehber, böylece 6 dalga (Kasım 2026 – Nisan 2027). Ölçekli içerik riski
  bu hızla düşük kalıyor.
- **En güçlü fırsat:** "animated envelope wedding invitation". İlk 10 sonuç yalnız Greenvelope (aynı sayfanın 6 satıcı
  alt alan adı kopyası) ve Framer şablonlarından oluşuyor. Ürünümüz tam bu niş: zarf açılır, arkasından site gelir.
- **İkinci fırsat RSVP kümesi:** ürünümüzde RSVP ve 10'a kadar kendi soru var. "Guests don't RSVP" ve "RSVP deadline"
  sorgularında ilk sayfanın yarısı forum (WeddingWire). Forum sıralanıyorsa iyi yazılmış bir rehber yer bulabilir.
- Mevcut G3'e öneri: başlığı iki ayrı arama niyetini karşılıyor ("when to send" ve "RSVP deadline" sonuçlarında ortak
  URL yok). RSVP tarihi ayrı rehbere (N5) taşınır, G3 zamanlamaya odaklanır.

## 1. Kümeler

Merkez sayfa (pillar): **G1 `/guides/how-to-make-a-wedding-website`**. Her yeni rehber G1'e ve `/guides`'a link verir.
G1 de her kümenin ilk rehberine link verir.

### Küme A — Dijital davetiye ve zarf (ürüne en yakın, ticari-bilgi)

| # | Rehber | Hedef sorgu (+ ikincil) | İlk sayfada kim var | Öncelik |
|---|---|---|---|---|
| **N1** | Animated Envelope Wedding Invitations: How They Work and Your Options | animated envelope wedding invitation · digital wedding invitation with envelope opening (7+ ortak sonuç → aynı sayfa) | Greenvelope (6 kopya), Framer şablonları | **Dalga 1** |
| **N3** | Digital Invitation or Wedding Website: Do You Need Both? | wedding website vs invitation · do you need a wedding website (0–1 ortak → ana + ikincil, aynı rehber, iki H2) | Greenvelope, Say I Do, Joy, Refinery29, destinationweddings | Dalga 2 |
| **N7** | Free vs Paid Wedding Websites: What You Actually Pay For | free wedding website vs paid · wedding website one time payment (2–3 ortak: WedSites, Wedded Wonderland) | Loverly, WedSites, Wedded Wonderland, The Knot yardım | Dalga 4 |
| G5 | Digital Wedding Invitations: Etiquette, Pros and Cons (var) | — | — | Kanal seçimi zaten var (WhatsApp/SMS, tek tek gönderme). Ek: kopyalanabilir mesaj örnekleri; sonuçlar ince satıcı blogları |
| G6 | Canva Template vs Hosted Website (var) | — | — | — |

### Küme B — Sitenin içeriği

| # | Rehber | Hedef sorgu | İlk sayfada kim var | Öncelik |
|---|---|---|---|---|
| **N8** | Our Story Examples for Your Wedding Website | wedding website our story examples | Joy (23 örnek), The Knot, destinationweddings, Wix | Dalga 4. G4 kısa altyazı metni veriyor; N8 hikâyenin yapısını ve uzun örnekleri verir, G4'e link |
| **N9** | Wedding Website FAQ: Questions Guests Ask, With Sample Answers | wedding website faq examples | The Knot (34 SSS), Say I Do, WeddingWire, Riley & Grey | Dalga 5 |
| **N10** | Destination Wedding Website Checklist | destination wedding website what to include | The Knot, WedSites, Riley & Grey, weddingsabroadguide | Dalga 5 |
| **N11** | Wedding Website Privacy: What Not to Share and When to Use a Password | wedding website privacy · password | Zola, WeddingWire, Riley & Grey, Inside Weddings | Dalga 6 |
| G2, G4 | var | — | — | G2'nin gizlilik bölümü kısalır, N11'e link verir. "Welcome message" G4'te kalır (G4 ile 2 ortak sonuç) |

### Küme C — RSVP ve paylaşma

| # | Rehber | Hedef sorgu | İlk sayfada kim var | Öncelik |
|---|---|---|---|---|
| **N2** | Wedding RSVP Questions to Ask Guests (With Ready-to-Use Wording) | wedding rsvp questions | The Knot, Jotform, Joy, Say I Do, Loverly | **Dalga 1** |
| **N4** | How to Put Your Wedding Website on the Invitation (Wording and QR) | how to put wedding website on invitation | Greenvelope (kopyalar), WedSites, The Knot | Dalga 2 |
| **N5** | Wedding RSVP Deadline: How to Pick the Date | wedding rsvp deadline | Paperlust + 7 WeddingWire forum sayfası | Dalga 3 |
| **N6** | Guests Didn't RSVP? What to Do and What to Say | what to do when guests don't rsvp | Offbeat Bride, The Daily Meal, WeddingWire forumu, rsvpify | Dalga 3 |
| **N12** | QR Codes for Wedding RSVPs: Size, Placement and Testing | qr code wedding rsvp (N4 ile 0–1 ortak → ayrı) | Jotform, Fotor, QRStuff, The Knot, Uniqode | Dalga 6 |
| G3 | When to Share Your Wedding Website… (var) | when to send wedding website | Zola, Shutterfly, WedSites, Say I Do | Dalga 3'te başlık: `When to Send Your Wedding Website, Save the Dates and Invitations`; RSVP bölümü kısalır, N5'e link |

### Plana alınmayanlar

| Sorgu | Neden |
|---|---|
| best wedding website builder 2026 | İlk sayfa sponsorlu karşılaştırmalar (Elementor, Gizmodo, The Knot). Satıcı olarak tarafsız bir sıralama yazamayız |
| greenvelope alternative | Sonuçlar Semrush, Trustpilot ve Capterra. Rakip adı ancak birincil kaynakta doğrulanınca yazılır (docs/14) |
| digital save the date | Üründe yok ("A matching save the date (not yet)", facts.ts). Ürün gelince plana girer |
| wedding website template · wedding website with rsvp · interactive wedding invitation | Ticari niyet; sonuçlar şablon pazarları ve site kurucular. Hedef sayfa rehber değil `/designs` ve ana sayfa (G191 metinleri zaten kapsıyor) |
| etsy wedding website template | Sonuçlar spam ve tek tük Etsy dükkânı. Hedef Etsy ilanının kendisi (docs/20) |

## 2. Takvim

| Dalga | Ay | Yeni | Güncelleme |
|---|---|---|---|
| 1 | Kasım 2026 (lansmanla) | N1 zarf, N2 RSVP soruları — **yazıldı (G193) ve TR/DE/ES/FR'ye çevrildi (G194), 2026-10-22** | — |
| 2 | Aralık 2026 | N3 davetiye mi site mi, N4 davetiyeye site linki — **yazıldı (G195) ve TR/DE/ES/FR'ye çevrildi (G196), 2026-10-22** | G5 mesaj örnekleri (**G206**: yanında biriyle davet, gönderdikten sonra değişiklik, save the date; N6'ya link) |
| 3 | Ocak 2027 | N5 RSVP tarihi, N6 cevap vermeyen misafir — **yazıldı (G197) ve TR/DE/ES/FR'ye çevrildi (G198), 2026-10-22** | G3 başlık + RSVP bölümü (**G197'de yapıldı**); 6 eski rehberin 3 aylık gözden geçirmesi (**G205'te erken yapıldı, 2026-10-22**: kaynaklar, ürün iddiaları, iç linkler; 5 dil) |
| 4 | Şubat 2027 | N7 ücretsiz/ücretli, N8 Our Story — **yazıldı (G199) ve TR/DE/ES/FR'ye çevrildi (G200), 2026-10-22** | — |
| 5 | Mart 2027 | N9 SSS örnekleri, N10 destination — **yazıldı (G201) ve TR/DE/ES/FR'ye çevrildi (G202), 2026-10-22** | — |
| 6 | Nisan 2027 | N11 gizlilik, N12 QR — **yazıldı (G203) ve TR/DE/ES/FR'ye çevrildi (G204), 2026-10-22** | G2 gizlilik bölümü N11'e link verir (**G203**; bölüm kısaltılmadı, G2'nin kelime payı dar); ikinci 3 aylık gözden geçirme (**sıradaki: 2027-01-22 civarı, 18 rehberin hepsi**; G205 yöntemi) |
| 7 | Mayıs 2027 | N13 iki dilli site, N14 düğünden sonra site (§7) — **yazıldı (G208) ve TR/DE/ES/FR'ye çevrildi (G209), 2026-10-22** | N10, G2 → N13; G3, N11 → N14 (5 dilde) |
| 8 | Haziran 2027 | N15 evde/matbaada baskı, N16 düğün hafta sonu programı (§7) — **İngilizcesi yazıldı (G210), 2026-10-22** | N4, N12 → N15; N10, G4 → N16 (yalnız İngilizce; çevirilerdeki linkler çeviri göreviyle) |

Her rehber önce İngilizce yazılır ve gözden geçirilir; sonra 4 dile çevrilir (`content/guides/{tr,de,es,fr}/`, G144 düzeni).

## 3. Yazım kuralları (docs/14 §6.12 + AGENTS.md)

- 1.200–1.800 kelime. Başta 40–60 kelimelik "Quick answer" (frontmatter `quickAnswer`).
- Rehberde en az bir **özgün öğe**: tablo, kontrol listesi ya da kopyalanabilir metin. Başka sitedeki listeyi yeniden
  yazmak yetmez.
- Tarih, görgü kuralı ya da sayı içeren iddialar kaynaklı olur (Emily Post Institute, kurum yardım sayfaları). Satıcı
  blogları kaynak gösterilmez. İstatistik uydurulmaz.
- Sonda "FAQ" bölümü (3–4 soru, H3; yanıt 40–80 kelime).
- Ürün en fazla %10 yer kaplar; tek yumuşak çağrı (`See how it looks: open a live demo`). Yalnız `facts.ts`'te olan
  özellik yazılır (örn. "up to 10 RSVP questions", "optional guest password"). E-posta ile gönderme, save the date,
  misafir listesi içe aktarma **yazılmaz**.
- Yazar "BKE Studio Editorial"; kişi uydurulmaz (docs/35 #7).
- Tarih biçimi `June 12, 2027`. Rakip adı yalnız birincil kaynakla doğrulanmış olgu için.

## 4. İç link matrisi

| Rehber | → G1 | → kardeş rehberler (2–3) | → ürün sayfası |
|---|---|---|---|
| N1 | ✓ | N3, G5, G6 | `/designs`, ana sayfadaki canlı demo |
| N2 | ✓ | N5, N6, G4 | `/features` (RSVP) |
| N3 | ✓ | N1, N4, G5, G2 | `/how-it-works` |
| N4 | ✓ | N12, G3, G4 | `/features` (QR) |
| N5 | ✓ | N6, N2, G3 | — |
| N6 | ✓ | N5, N2 | — |
| N7 | ✓ | G6, N3 | `/pricing` |
| N8 | ✓ | G4, G2 | `/designs` (Our Story ekranı) |
| N9 | ✓ | G2, G4, N10 | `/faq` değil: ürün SSS'si ile karışmaz |
| N10 | ✓ | G2, G3, N9 | — |
| N11 | ✓ | G2, N4 | `/features` (guest password) |
| N12 | ✓ | N4, N2 | `/features` (QR) |

**Durum (G206, 2026-10-22):** matris 5 dilde tamam; eksik 5 bağlantı (G1 → N1, G1 → N8, N5 → G1, N12 → G1, N9 → N10)
eklendi ve `tests/g206.test.ts` matrisi her dilde denetliyor.

Yayın günü ters linkler de eklenir: her yeni rehber en az **3 iç link** alır (G1 + 2 kardeş; footer G191'den beri hepsini
listeliyor).

## 5. Dalga 1 brifleri

### N1 · `/guides/animated-envelope-wedding-invitations`

- **Title (≤ 60):** `Animated Envelope Wedding Invitations: How They Work` (51) · **Description:** `What an animated envelope
  invitation is, how guests open it on a phone, email invitations vs envelope websites, and what to check before you choose.`
- **Arama niyeti:** ticari-bilgi. Okur "zarfı açılan dijital davetiye" gördü ve seçenekleri anlamak istiyor.
- **Açı:** ilk sayfa iki kategoriyi karıştırıyor: e-postayla giden davetiye kartı (Greenvelope tipi) ve zarfla açılan
  website şablonu (Framer tipi). Rehber iki modeli tarafsızca ayırır ve karar tablosu verir. Kendi ürünümüz üçüncü bir
  satır değil, "website" modelinin bir örneği olarak geçer.
- **Taslak:**
  1. Quick answer
  2. What is an animated envelope invitation? (tanım: "An animated envelope invitation is …")
  3. How guests open it (dokun → mühür/kurdele → kart; ses, uzunluk, telefonda erişilebilirlik ve hareket azaltma)
  4. Two kinds: an emailed invitation card vs an envelope that opens into a wedding website (tablo: nasıl gönderilir,
     RSVP nerede, misafir başına ücret ya da tek fiyat, sonradan güncelleme, link önizlemesi)
  5. What to check before you choose (kontrol listesi: telefonda deneme, açılış süresi, RSVP sonuçlarını indirme, link
     ne kadar süre açık kalır, misafir hesabı gerekiyor mu)
  6. Etiquette: is an animated invitation formal enough? (→ G5)
  7. FAQ (4)
- **Özgün öğe:** karar tablosu + 8 maddelik "before you choose" listesi.
- **Görsel:** gerçek açılış klibi (`public/marketing/designs/<id>/` 10 sn klip) + poster; VideoObject şeması zaten var.
  Yeni GPT görseli gerekmez.
- **Kaynak:** Emily Post Institute (dijital davetiye görgüsü). Rakip özellikleri yalnız kendi sayfasından ve tarihle.

### N2 · `/guides/wedding-rsvp-questions`

- **Title:** `Wedding RSVP Questions to Ask Guests (With Wording)` (51) · **Description:** `Which RSVP questions your
  caterer, venue and planner actually need, which to skip, and ready-to-use wording for meal, dietary, plus-one and
  song questions.`
- **Arama niyeti:** bilgi; okur RSVP formunu kuruyor.
- **Açı:** ilk sayfadaki listeler uzun (Jotform 40 soru, The Knot). Fark yaratan şey **kime lazım** sorusu: her sorunun
  yanında cevabı kimin kullandığı (catering, mekân, oturma planı, ulaşım) yazar. Soru sayısını düşük tutmanın gerekçesi
  verilir.
- **Taslak:**
  1. Quick answer
  2. The two questions every RSVP needs (geliyor mu + kaç kişi)
  3. Questions by who needs the answer (tablo: soru · kime lazım · ne zaman lazım · örnek metin)
  4. Questions to skip, and why (uzun form = geç yanıt)
  5. Ready-to-use wording, formal and relaxed (kopyalanabilir)
  6. Questions only some guests should see (çocuk menüsü, prova yemeği): platformda yoksa ayrı mesaj
  7. After the deadline: export and share with vendors (→ N5, N6)
  8. FAQ (4)
- **Özgün öğe:** "soru → kime lazım" tablosu + iki tonda kopyalanabilir metin.
- **Ürün cümlesi (facts.ts):** "up to 10 questions of your own", "Excel or CSV download".

## 6. Ölçüm (falsifiability)

**Plan durumu (2026-10-22):** 12 rehber yazıldı ve çevrildi, matris ve G5 güncellemesi tamam, ilk 6 rehber erken gözden
geçirildi (G205). Kalan işler veriye bağlı: lansman + GSC bağlantısı → gerçek sorgu verisiyle yeni konu sırası (§0 "Sınır"),
bu tablodaki ölçümler ve 2027-01-22 civarı 18 rehberin gözden geçirmesi.

| Dalga | Nasıl anlarız işe yaramadı |
|---|---|
| Her rehber | Yayından 8 hafta sonra GSC'de hedef sorgu için gösterim 0 ya da ortalama pozisyon > 50 |
| N1 | 12 hafta sonra "animated envelope wedding invitation" için ilk 20'de değil |
| Küme C | Rehberden `/designs` ya da demoya tıklama oranı < %1 (`Tracker.tsx` olayları) |
| GEO | Aylık AI kontrolünde (docs/14 §11.3) RSVP ve zarf sorgularında BKE Studio hiç alıntılanmıyor |

## 7. Yeni konu adayları (G207, 2026-10-22)

Kullanıcı: "yeni konular öner". Aynı yöntem: adaylar **ürünün gerçek özelliklerinden** (facts.ts) çıkarıldı, 16 sorgu
arandı (ABD sonuçları), mevcut 18 rehberle çakışma kontrol edildi. Arama hacmi verisi yine yok; sıra tahmindir ve GSC
gelince yeniden yapılır.

### Önerilenler (öncelik sırasıyla)

| # | Rehber (çalışma başlığı) | Hedef sorgu (+ ikincil) | İlk sayfada kim var | Ürün bağı (facts.ts) | Öneri |
|---|---|---|---|---|---|
| **N13** | Bilingual Wedding Website: How to Welcome Guests in Two Languages | bilingual wedding website · multilingual wedding website (· invitation for guests who speak different languages: 0 ortak, ayrı H2) | WedSites blog, Joy (kendi aracını öne çıkaran liste), Riley & Grey yardım sayfası, planlama blogları (Aisle Planner, Say I Do, weddingsonline) | 5 dilde site, hazır metinler çevrili, kendi metinlerin otomatik çeviri taslağı | **Dalga 7.** En güçlü ürün farkı; rehberin 4 çevirisi de doğal olarak hedef kitleye gider |
| **N14** | What to Do With Your Wedding Website After the Wedding | what to do with wedding website after the wedding · how long to keep wedding website up (1–2 ortak → aynı rehber) | Inside Weddings, Loverly, WedSites yardım, Riley & Grey, Wikipedia | Teşekkür sayfası (otomatik ya da kapalı), düğünden {{months}} ay sonrasına kadar açık, yanıtları indirme, yayından kaldırma | **Dalga 7.** Rakiplerin "süre dolunca kapanır" sorusuna dürüst yanıt; N11 ile bağlantılı |
| **N15** | How to Print Wedding Invitations at Home (or at a Local Print Shop) | print wedding invitations at home | Love Inc., Paperlust, Avery, şablon spam sayfaları | Basılabilir davetiye PDF'i (5 × 7 in / A5, taşma payı ve kesim işaretleri), QR kartı; biz basmıyoruz | Dalga 8. Kâğıt, ölçek %100, test baskısı, zarf ve posta; N4/N12'ye link |
| **N16** | Wedding Weekend Itinerary: What to Tell Guests and When | wedding weekend itinerary for guests · wedding schedule for guests | Rock My Wedding, Paperlust, Inside Weddings, Wedded Wonderland, mekân blogları, spam şablonlar | Gün akışı (en fazla {{scheduleRows}} satır), saat dilimi, takvime ekleme (Apple/Outlook, Google) | Dalga 8. N10 (destination) ile çakışmaması için çok günlük programın yazımına odaklanır; G4'teki program metnine link |
| N17 | Change the Date: How to Tell Guests Your Wedding Has Moved | change the date wedding wording · postponed wedding announcement | Paperless Post, Zola, WeddingWire (+ forumlar), Junebug, Brite, Greenvelope | Tarih değişikliği hakkı sınırlı (yayından sonra {n} değişiklik; birkaç güne kadar kaydırma serbest) | Dalga 9, isteğe bağlı. Ürün iddiası dikkat ister: sınır açıkça yazılır. G3'ün "tarih değişirse" bölümü buraya link verir |
| N18 | Music on Your Wedding Website: What Works on Phones | wedding website music · song on wedding website | İnce: WedSites yardım, eski WeddingWire forumları, spam sayfa | Our Story'de 4 parçadan biri ya da kendi dosyan, ses efektleri, kapatılabilir | Dalga 9, isteğe bağlı. Sonuçlar zayıf ama hacim muhtemelen düşük; otomatik çalma engeli ve erişilebilirlik açısı |

### Önerilmeyenler

| Sorgu | Neden |
|---|---|
| wedding website welcome message examples | The Knot, Joy, WeddingWire dolu; G4 karşılama metinlerini zaten veriyor (plan §1: "Welcome message G4'te kalır") |
| wedding website mistakes to avoid | WeddingWire, Inside Weddings, A Practical Wedding; içerik G2 + N11 + N9 ile büyük ölçüde örtüşüyor |
| wedding website url ideas | Joy, Riley & Grey, GoDaddy; sonuçların ana önerisi kendi alan adı, ürünümüzde yok (adres {{domain}}/isimler). Kısa bir bölüm olarak G1'e eklenebilir |
| wedding thank you message examples | Sonuçlar teşekkür kartı yazımı, website değil; N14'te tek bölüm olarak yeterli |
| elopement / small wedding website | Az ve dağınık sonuç, ürüne özel açı zayıf; N3 kısmen karşılıyor |
| add to calendar wedding invitation | Araç satıcıları; N16'da tek bölüm olarak yeter |

### İç linkler (yazılırsa)

N13 → G1, N3, N10, `/features` (diller) · N14 → G1, N11, G3, `/features` (teşekkür sayfası) · N15 → G1, N4, N12,
`/features` (basılabilir davetiye) · N16 → G1, N10, G4, N9 · N17 → G1, G3, G5 · N18 → G1, G4, `/designs`.

## Kaynaklar (arama sonuçları, 2026-10-22)

- [Greenvelope — animated envelope invitations](https://card.greenvelope.com/resources/animated-envelope-invitations),
  [Framer — Together Vows](https://www.framer.com/community/marketplace/templates/together-vows/)
- [The Knot — wedding RSVP questions](https://www.theknot.com/content/wedding-rsvp-questions),
  [Jotform — RSVP questions](https://www.jotform.com/blog/rsvp-questions/)
- [Paperlust — RSVP deadline](https://paperlust.co/blog/wedding-rsvp-deadline/),
  [Offbeat Bride — guests don't RSVP](https://offbeatwed.com/what-if-wedding-guests-dont-rsvp/)
- [The Knot — how to share wedding websites](https://www.theknot.com/content/how-to-share-wedding-websites),
  [The Knot — wedding QR code](https://www.theknot.com/content/wedding-qr-code)
- [Joy — Our Story examples](https://withjoy.com/blog/23-beautiful-wedding-website-our-story-examples-that-wow-guests/),
  [The Knot — wedding website FAQ](https://theknot.com/content/wedding-website-faq-page)
- [Loverly — free vs paid](https://loverly.com/planning/wedding-planning/the-difference-between-a-free-and-paid-wedding-website),
  [WedSites — pricing](https://wedsites.com/pricing)
- [Zola — wedding website dos and don'ts](https://ZOLA.com/expert-advice/dos-and-donts-wedding-website),
  [Riley & Grey — destination wedding websites](https://www.rileygrey.com/wedding-guide/wedding-planning/destination-wedding-websites-what-to-include-for-traveling-guests)
- [Zola — when to send invitations](https://zola.com/expert-advice/when-should-you-send-out-your-wedding-invitations),
  [Joy — do I need a wedding website](https://withjoy.com/blog/do-i-need-wedding-website/)
