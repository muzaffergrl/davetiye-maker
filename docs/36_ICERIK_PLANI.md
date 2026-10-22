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
| 2 | Aralık 2026 | N3 davetiye mi site mi, N4 davetiyeye site linki — **yazıldı (G195) ve TR/DE/ES/FR'ye çevrildi (G196), 2026-10-22** | G5 mesaj örnekleri |
| 3 | Ocak 2027 | N5 RSVP tarihi, N6 cevap vermeyen misafir — **yazıldı (G197) ve TR/DE/ES/FR'ye çevrildi (G198), 2026-10-22** | G3 başlık + RSVP bölümü (**G197'de yapıldı**); 6 eski rehberin 3 aylık gözden geçirmesi |
| 4 | Şubat 2027 | N7 ücretsiz/ücretli, N8 Our Story — **yazıldı (G199) ve TR/DE/ES/FR'ye çevrildi (G200), 2026-10-22** | — |
| 5 | Mart 2027 | N9 SSS örnekleri, N10 destination — **yazıldı (G201) ve TR/DE/ES/FR'ye çevrildi (G202), 2026-10-22** | — |
| 6 | Nisan 2027 | N11 gizlilik, N12 QR — **yazıldı (G203) ve TR/DE/ES/FR'ye çevrildi (G204), 2026-10-22** | G2 gizlilik bölümü N11'e link verir (**G203**; bölüm kısaltılmadı, G2'nin kelime payı dar); ikinci 3 aylık gözden geçirme |

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

| Dalga | Nasıl anlarız işe yaramadı |
|---|---|
| Her rehber | Yayından 8 hafta sonra GSC'de hedef sorgu için gösterim 0 ya da ortalama pozisyon > 50 |
| N1 | 12 hafta sonra "animated envelope wedding invitation" için ilk 20'de değil |
| Küme C | Rehberden `/designs` ya da demoya tıklama oranı < %1 (`Tracker.tsx` olayları) |
| GEO | Aylık AI kontrolünde (docs/14 §11.3) RSVP ve zarf sorgularında BKE Studio hiç alıntılanmıyor |

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
