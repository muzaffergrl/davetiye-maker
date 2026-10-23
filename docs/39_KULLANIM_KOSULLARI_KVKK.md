# 39 — Kullanım koşulları ve KVKK aydınlatma metni (G961, 2026-10-23)

**Hukuki danışmanlık değildir.** Bu sayfalar yalnız verilmiş kararlardan ve kodun bugün yaptığından yazıldı; yayından ve
`launched: true`'dan önce Türk hukukunu bilen bir avukata (tercihen KVKK + tüketici + e-ticaret) okutulmalı. Açık
maddeler §4'te.

Karar: sahip, 2026-10-23, madde 7 — "siteye kullanım koşulları ve uygun bir KVKK aydınlatma metni ekle, şimdiye kadarki
kararlarla tutarlı". Görev numarası G961 (görev dosyası açılmadı; kod ve belgeler bu numarayla işaretli).

## 1. Ne yazıldı (dosyalar)

| Ne | Nerede |
|---|---|
| **Kullanım koşulları** `/terms` (EN + `/tr`, `/es`, `/de`, `/fr`) | `platform/components/marketing/pages/TermsPage.tsx`; metinler `market` sözlüğünde, çeviriler `platform/lib/i18n/dict/legal/market-<dil>.ts` |
| **KVKK aydınlatma metni** `/kvkk` — asıl metin Türkçe (`/tr/kvkk`), İngilizce sürüm `/kvkk`; `/es`, `/de`, `/fr` İngilizce sürümü bir notla gösterir | metin: `platform/lib/marketing/legal.ts` (`kvkkMarkdown`), sayfa: `platform/components/marketing/pages/KvkkPage.tsx` |
| Gizlilik bildirimine ekler: **Legal basis**, **Turkey (KVKK)** bölümü (KVKK + koşullar linki), Gmail (gönderme + Etsy satış e-postalarının okunması), "satın alınan her tasarıma bir site", denetim otoritesine şikâyet cümlesi, veri sorumlusu cümlesi; Gemini maddesi zaten vardı (`#ai-chat` çapası eklendi) | `platform/components/marketing/pages/PrivacyPage.tsx` |
| Alt bilgi (her dilde): Company → Privacy · **Terms of use** · **KVKK notice** | `platform/components/marketing/Shell.tsx` |
| Site haritası, `llms.txt` (Optional), robots eğitim botu izin listesi, dil önekleri | `lib/marketing/site.ts` (`corePages`), `crawl.ts`, `lang-path.ts`; `kvkk` adresi çift sitesine verilemez (`lib/slug.ts`) |
| `/start` düğmesinin altında tek satır: "By creating your website you accept our Terms of use. Our Privacy notice and KVKK notice explain how we use your data." (5 dil, linkler arayüz dilinde, yeni sekme) | `platform/app/start/StartForm.tsx` (`LegalLine`), çeviriler `dict/legal/panel-<dil>.ts` |
| Veri sorumlusu kimliği: `legal.controllerName`, `legal.postalAddress` (**null**), `legal.updated` = 2026-10-23 | `platform/lib/marketing/config.ts` |
| Lansman kapısı: iki alan null iken `launchProblems()` iki madde listeler; `onSale` olup gerçek Etsy linki olmayan hizmet de | `platform/lib/marketing/placeholders.ts` |
| Hizmetler (kurulum, özel tasarım) `onSale: false`: `/pricing` "Extras" bölümü ve paneldeki "Prefer us to do it?" satırı **gizli**; fiyatlar değişmedi (990 / 4490 TL) | `config.ts`, `components/marketing/ExtraServices.tsx`, `lib/panel/brand.ts`, `components/panel/HelpSheet.tsx` |
| Etsy dükkânı gizlilik metni güncellendi | `docs/28_ETSY_GIZLILIK_METNI.md` |
| Testler | `platform/tests/g961-legal.test.ts` (9 test) |

Sitede **hiç köşeli parantezli yer tutucu yok**: yasal ad ve adres `null` iken sayfalar "Our full legal name and postal
address are provided on request by email." / "Veri sorumlusunun açık adı (unvanı) ve posta adresi, … adresine
yazmanız hâlinde size bildirilir." der. Değer girilince (`config.ts → legal`) üç sayfa da adı ve adresi basar; test
bunu denetler.

## 2. İçerik ve dayandığı kararlar

**Kullanım koşulları** (yürürlük 2026-10-23):
- Biz kimiz: BKE Studio, Etsy dükkânı STUDIOBKE, bkestudio01@gmail.com, Etsy mesajları, yanıt 24 saat — K26, K33, K35, K37, sahip 2026-10-23 (destek e-postası).
- Ne alırsınız: satın alınan her tasarım = bir etkinlik için bir site; bir siparişte birden fazla tasarım/adet varsa her
  biri için bir site (G152 `designUnits`, sahip kararı 4); "Online until" = düğünden 12 ay sonra, en geç ilk yayından
  48 ay sonra (K25; `lib/panel/rights.ts` `ARCHIVE_MAX_AFTER_FIRST_PUBLISH_MONTHS`); uzatma, arşiv ve silme metinleri
  config'ten (K48); tasarım lisansı: yalnız kendi etkinlik sitesi + yazdırılabilir davetiye/PDF baskısı, yeniden satış yok.
- Düzenleme: isim/tarih değişikliği kuralı config'ten (`editRightsText`, docs/16 §11); hak biterse Etsy'den yazın (admin hak ekleyebiliyor, K30); otomatik çeviri taslaktır.
- Satın alma ve erişim: Etsy, Etsy fiyatı, kart bilgisi görülmez; sipariş no + e-posta (K46); düzenleme linki istenmez; sipariş kontrolü ve onay beklerken yayın bekleyebilir (K34, G192 güven modu).
- İade: dijital ürün, anında erişim → iade/değişim/iptal yok, **ancak tüketici mevzuatının kaldırılamayan hakları saklı** (K36; abartılmadı); "açıklandığı gibi çalışmazsa düzeltiriz".
- Hizmetler: yalnız `onSale: true` hizmet varsa tek cümle görünür (bugün yok).
- Kabul edilebilir kullanım, içeriğiniz (haklar sizde; barındırma için sınırlı izin), izinsiz foto/müzik yükleme yok, ihlalde gizleme/kaldırma ve çifte gerekçe, içerik bildirme (e-posta).
- Erişilebilirlik ve değişiklikler: kesinti olabilir; satın alınan bir özelliği kaldıracak güncelleme önceden bildirilir; Excel ve PDF ile kendi kopyanız.
- Canlı yardım sohbeti: Google Gemini, yanıtlar yanlış olabilir, taahhüt değildir, kişisel bilgi yazmayın (docs/35).
- Sorumluluk: makul özen; tüketici hakları ve sınırlanamayan sorumluluk saklı; öngörülemeyen zarar, kullanıcı içeriği, üçüncü taraf hizmetleri hariç; **kanunun izin verdiği yerde** üst sınır = ödenen bedel.
- Sona erme: kendiniz yayından kaldırabilirsiniz; sahte sipariş no, ciddi ihlal ya da kanun gereği kaldırma; mümkünse önce haber.
- Değişiklikler: tarih değişir; önceki satın alımdan doğan haklar kalkmaz. **Uygulanacak hukuk maddesi yok** (karar açık); yerine "ülkenizin emredici tüketici mevzuatının koruması saklıdır".

**KVKK aydınlatma metni** (KVKK m. 10, Aydınlatma Yükümlülüğü Tebliği; haklar m. 11; başvuru: Veri Sorumlusuna Başvuru
Usul ve Esasları Hakkında Tebliğ; şikâyet m. 13–14):
1. Veri sorumlusu: yalnız karar verilmiş olgular (BKE Studio, STUDIOBKE, bkestudio01@gmail.com) + ad/adres için tarafsız cümle (K25).
2. Veri kategorileri: alıcı (kimlik/iletişim, sipariş, site içeriği, işlem güvenliği, destek yazışmaları), davetli (yanıt formu, şifre çerezi), ziyaretçi (teknik kayıtlar, IP özeti, çerez/tarayıcı depolaması, sohbet). Kaynak: kodun G154 okuması + G192 (Gmail okuma) + docs/35 (sohbet) + docs/22 (Sheets).
3. Amaçlar ve hukuki sebepler: m. 5/2-c (sözleşme), 5/2-ç (yasal yükümlülük), 5/2-e (hakların korunması), 5/2-f (meşru menfaat: sahte sipariş, spam, güvenlik, davetli yanıtları, sohbet). **Açık rızaya dayanan işleme yazılmadı.**
4. Toplama yöntemi.
5. Aktarım: Vercel (ABD), Google (Gmail gönderme + satış e-postası okuma, Gemini, Sheets, Fonts, Maps), translated.net/MyMemory (İtalya), Etsy (ayrı veri sorumlusu), yetkili kurumlar. **Güvence iddiası yok**: "standart hizmet koşullarıyla kullanıyoruz" + "bu kullanım m. 9 kapsamında yurt dışına aktarımdır".
6. Saklama: K25 + K48 (config metinleri dile çevrilerek), cihaz kayıtları, sipariş kayıtları ("Etsy kuralları ve vergi mevzuatının gerektirdiği süre"), destek yazışmaları (süre yok, silme istenebilir — açık madde), sohbet (saklanmıyor), teknik kayıtlar (sağlayıcının süresi).
7. m. 11 hakları (9 bent) + panelde yapılabilenler.
8. Başvuru: kayıtlı e-posta adresinden e-posta, güvenli e-imza / mobil imza, posta adresi e-postayla istenir; başvuru içeriği (ad, imza, T.C. kimlik no / uyruk + pasaport no, adres, e-posta, telefon, konu); 30 gün, ücretsiz kural, tarife; Kurul'a şikâyet 30/60 gün.
9. Diğer metinler ve değişiklik.

## 3. Bakım

- Yasal ad / adres kararı gelince: yalnız `platform/lib/marketing/config.ts` → `legal.controllerName`, `legal.postalAddress`
  (metinler kendiliğinden değişir; `docs/28`'deki iki yer tutucu da elle doldurulur). Metin değişirse `legal.updated`.
- KVKK metni iki dilde `lib/marketing/legal.ts` içinde; Türkçe asıl metindir. Test iki sürümün bölüm/liste yapısının aynı
  olduğunu denetler — birini değiştiren diğerini de değiştirir.
- Koşullar metni `TermsPage.tsx` + `dict/legal/market-<dil>.ts` (anahtar = İngilizce metin). Yeni cümle → 4 çeviri.
- Hizmet Etsy'de yayınlanınca: `config.ts` → ilgili hizmette `etsyListingUrl` (gerçek link) + `onSale: true`. O zaman
  `/pricing` Extras, panel Help satırı ve koşullardaki hizmet cümlesi kendiliğinden görünür.
- `verified.privacyText` avukat okumasına kadar `false` kalır (lansman kapısı).

## 4. Açık maddeler — avukata / sahibe (uydurulmadı)

1. **Veri sorumlusunun yasal adı ve posta adresi** (K25: yasal kimlik yok). KVKK m. 10 ve 6563 sayılı E-Ticaret Kanunu
   m. 3 (hizmet sağlayıcının tanıtıcı bilgileri) açısından sitede yer alması gerekebilir. Şimdilik "e-postayla istenirse".
2. **Satıcının hukuki/vergi statüsü** (bireysel / şahıs şirketi / şirket; vergi mükellefiyeti). Koşullardaki "satıcı kim"
   ve sipariş kayıtlarının saklama süresi buna bağlı.
3. **Uygulanacak hukuk ve yetkili mahkeme**: karar yok; koşullarda bilerek madde yok. Tüketici sözleşmesinde seçim
   tüketicinin ülkesindeki emredici korumayı kaldıramaz (koşullarda bu cümle var).
4. **Yurt dışına aktarım mekanizması (KVKK m. 9, 2024 değişikliği)**: Vercel, Google (Gmail, Gemini, Sheets, Fonts,
   Maps) ve translated.net için standart sözleşme imzalanıp Kurum'a 5 iş günü içinde bildirilmedi; yeterlilik kararı
   yok; m. 9/6 istisnaları (arızi aktarım) sürekli barındırma için uygun görünmüyor. Metin bu yüzden güvence iddia etmez.
   Avukat: hangi mekanizma (standart sözleşme, taahhütname, açık rıza ile arızi aktarım) ve hangi sağlayıcı için.
   Ayrıca Gmail kişisel Google hesabı: işleyen sözleşmesi (DPA) yok — Google Workspace'e geçiş gerekebilir.
5. **VERBİS kaydı**: yurt içi yerleşik, yıllık çalışan < 50 ve mali bilanço < 100 milyon TL olan ve ana faaliyeti özel
   nitelikli veri işleme olmayan veri sorumluları muaf olabilir; **yurt dışı yerleşik** ya da başka bir istisna dışı durum
   kayıt gerektirebilir. Statü (madde 2) belli olunca değerlendirilmeli. Kayıt gerekirse Kişisel Veri Saklama ve İmha
   Politikası da hazırlanmalı.
6. **Davetli verilerinde roller**: çift mi veri sorumlusu, biz mi veri işleyen? Metinler "çift adına saklarız" diyor
   (docs/28 ile tutarlı) ama hukuki sebep olarak bizim meşru menfaatimiz yazıldı. Netleştirilmeli; gerekirse alıcıyla bir
   veri işleme hükmü (koşullara) eklenir.
7. **Özel nitelikli veri (sağlık) — RSVP soruları**: çift "alerji / diyet" sorabilir; cevap sağlık verisi olabilir
   (KVKK m. 6). Bugün açık rıza alınmıyor; metin "özel nitelikli veri toplamayı amaçlamıyoruz, yazmak zorunda değilsiniz"
   diyor. Avukat: formda açık rıza onayı mı, soru tipinin sınırlanması mı, uyarı metni mi.
8. **Gemini ücretsiz katman**: Google mesajları kullanabilir ve okuyabilir. Ücretli katmana geçiş kararı açık (Gemini
   paid tier). Açık rıza gerekip gerekmediği değerlendirilmeli; şimdilik "isteğe bağlı + kişisel bilgi yazmayın".
9. **Tüketicinin cayma hakkı — hizmetler**: Mesafeli Sözleşmeler Yönetmeliği m. 15/1-ğ anında ifa edilen elektronik
   hizmetler ve gayrimaddi mallarda cayma hakkını istisna sayar; AB'de dijital içerikte istisna, ifaya başlanmadan önce
   tüketicinin açık onayına ve hakkını kaybettiğini kabulüne bağlı (Etsy'nin ödeme akışı bunu yapıyor mu bilinmiyor).
   **Kurulum ve özel tasarım hizmetleri** (anında ifa değil, 3 gün teslim) için cayma hakkı ayrıca değerlendirilmeli —
   bugün `onSale: false`, sitede ve koşullarda yer almıyor. Ayrıca Türk tüketiciye satışta ön bilgilendirme formu /
   mesafeli satış sözleşmesi ve Tüketici Hakem Heyeti bilgisi gerekip gerekmediği (satış Etsy'de) sorulmalı.
10. **Sorumluluk sınırı ve tek taraflı değişiklik**: "kanunun izin verdiği yerde ödenen bedel" üst sınırı ve "değişiklik
    önceki satın alımın haklarını kaldırmaz" ajan tercihi; haksız şart (TKHK m. 5) açısından okunmalı.
11. **ETBİS / e-ticaret bilgi yükümlülükleri**: Etsy üzerinden satışta satıcının ETBİS kaydı ve kendi sitesinde tanıtıcı
    bilgi gösterme yükümlülüğü olup olmadığı.
12. **Destek yazışmaları ve sipariş e-postaları için saklama süresi** belirlenmedi (Gmail kutusunda kalıyor). Saklama ve
    imha politikası ile birlikte süre konmalı.
13. Teknik not (kod): spam sayaçları `limits/<sha256>.json` dosyaları pencere bitince silinmiyor (yalnız üstüne yazılıyor);
    içinde IP yok, adı anahtar özetinden. Metinler "IP'nin kendisi saklanmaz; özeti en çok 24 saatlik sayaçta" diyor —
    doğru, ama periyodik temizlik eklenebilir.
14. AB/İngiltere alıcıları için GDPR m. 27 temsilci gereği (AB'de yerleşik olmayan ve AB'deki kişilere düzenli hizmet
    sunan veri sorumlusu) değerlendirilmeli.

## 5. Denendi / denenmedi

- Denendi (2026-10-23, yan çalışma ağacı): `tests/g961-legal.test.ts` 9/9; tam `npm test` 1828 test, 1819 geçti, 4 atlandı,
  5 kaldı — beşi de bu değişiklik olmadan da kalıyor (seyrek checkout: `collections/…/variants` ve docs görseli yok);
  `npm run typecheck` temiz. `next dev` ile 390 px: `/terms`, `/es/terms`, `/kvkk`, `/tr/kvkk`, `/de/kvkk`, `/tr/privacy`,
  `/start` — yatay taşma yok, sayfada köşeli parantez yok, alt bilgi linkleri dil önekli.
- Denenmedi: `next build` (disk; rol izni yok), gerçek telefon, avukat okuması, Etsy'ye gizlilik metninin yapıştırılması.
