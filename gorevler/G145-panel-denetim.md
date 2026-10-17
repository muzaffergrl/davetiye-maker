---
id: G145
baslik: Admin + müşteri paneli denetimi — kullanıcı dostu, işlevsel, uçtan uca doğrulanmış (K45 madde 1)
rol: claude-kod
durum: inceleme
alan: claude-G145
oncelik: 1
bagimli: [G121, G126, G127, G128, G135, G138, G139, G140]
yazar: [platform/lib/, platform/app/admin/, platform/app/edit/, platform/app/api/admin/, platform/components/admin/, platform/components/panel/Panel.tsx, platform/components/panel/usePanel.ts, platform/components/panel/views.tsx, platform/components/panel/panel.module.css, platform/components/panel/SectionJumps.tsx, platform/components/panel/section-jumps.module.css, platform/tests/g145.test.ts, platform/tests/g145-browser.ts, platform/tests/g094-admin-v2.test.ts, platform/tests/g135-live-fixes.test.ts, platform/previews/g145/, docs/17_ADMIN_PANELI.md, docs/19_ALICI_YOLCULUGU.md, docs/23_EK_HIZMETLER.md, gorevler/G145-panel-denetim.md]
---

## Amaç
K45 (1). Kullanıcı: "Admin ve müşteri panelini daha da optimize edelim. daha kullanıcı dostu bir hale getirelim. tüm fonksiyonların
kusursuz çalıştığından emin olalım. Daha işlevsel bir hale getirelim." Koordinatör: session_01HP9ZrJ8mhZnigbvsvUQ4pR (birleştirir).
Taban `claude/zealous-fermi-hy1o40` (ab6bde0). Paralel G144 (5 dil) alıcı panelinin metinlerini sözlüğe taşıyor: alıcı paneli
metinlerine dokunulmadı; yeni alıcı metni yalnız bir tane (`SectionJumps` aria-label "On this page", G144 birleşince `msg()`).

## Sonuç
**2026-10-17 · claude-G145 — durum: inceleme.** Dal `claude/g145-panel-denetim`. Yayın yok, main'e dokunulmadı.

Yöntem: yerel production build (`next start`, `CLAIM_ORDER_VERIFICATION=manual`, `ADMIN_PASSWORD`, sahte `GOOGLE_*`), Playwright
ile gerçek yolculuklar 390 × 844 ve 1280 × 900. Bulunan hata düzeltildi, aynı yolculuk yeniden koşuldu. Kalıcı kontrol:
`tests/g145-browser.ts` (29/29), `tests/g145.test.ts` (4/4). Ekranlar `platform/previews/g145/`.

### Yapılanlar (düzeltme + yeni işlev)
1. **Linki değiştirmeden düzenle** (docs/23 §3.3'te açık kalan iş): admin site sayfasında üst satırda **Düzenle** ve Destek
   işlemlerinde kart. Dükkânın kendi 72 saatlik anahtarı (`SiteRecord.shopEdit`: yalnız hash + süre; `issueShopEditKey`,
   `endShopEditKey`, `canEdit` iki anahtarı da kabul eder). Editör yeni sekmede (açılır pencere engeline takılmadan) açılır; panelde
   Türkçe "Dükkân olarak düzenliyorsunuz · … tarihine kadar · alıcının linki değişmedi" şeridi; Share'de "Your private edit link"
   gizli; /my'a kaydedilmez. **Dükkân linkini kapat** → link 404, mesaj şablonu kendiliğinden yeni **`setup_service_done_same_link`**
   (link içermez). Geçmiş'e açıldı/kapatıldı satırı; Özet → Yapılacaklar açık kalan linki "Kapat" ile listeler.
2. **Hata: dükkân yazınca alıcının paneli kilitleniyordu.** Her admin yaması (not, mesaj kaydı, onay, hak, e-posta) `updatedAt`'i
   ilerletiyor; alıcının açık panelindeki bir sonraki otomatik kayıt 409 alıp "changed in another window — reload" ile duruyordu
   (yazılan son metin ancak yeniden yüklemeyle, yerel kopya "eski sürüm" diye sorularak dönüyordu). Şimdi: sunucudaki taslak panelin
   son kaydettiğiyle aynıysa panel yeni sürümü alıp kaydı yeniden gönderir (`usePanel.ts`). Başka cihaz gerçekten taslağı
   değiştirdiyse eski korumalı davranış aynen.
3. **Sipariş onayı beklerken Publish kendiliğinden açılır:** panel görünürken dakikada bir ve yeniden görünür olunca yalnız
   `orderPending`'i yeniden okur (önce "Reload this page to check" — elle yenileme gerekiyordu).
4. **Uzun Edit sayfalarında bölüm içi gezinme:** Details (Good to know · Travel & stay · Meal & menu · Questions & answers) ve
   Day & place (Date & time · Venue · Schedule) başında atlama düğmeleri (44 px, sarar; başlığa odak). Details sayfası 390 px'de
   ~4200 px uzunluğundaydı.
5. **Yeni eklenen soru/seçenek/konaklama/blok kırmızı hatayla açılmıyor:** "Please write the question", "Add at least two choices"
   vb. yalnız öğenin bir alanından çıkınca ya da yayınlama denenince görünür. Panel açılırken var olan hatalar ve Home/Review
   listeleri değişmedi.
6. **Hata: Travel & stay yanlış uyarısı.** Bölüm açık, "Getting here" notu ya da konaklama kartı dolu ama genel link boşken Home ve
   yayın öncesi "Travel & stay is on but has no link yet, so guests do not see it" diyordu; misafir aslında bölümü görüyor (G138).
   Uyarı artık yalnız bölüm gerçekten boşken (`prePublishNotes`).
7. **Admin hızlı arama:** Özet'te arama kutusu → Siparişler `?q=` ("Hepsi" filtresinde). Hata: Yapılacak filtresi seçiliyken arama
   yalnız onay bekleyenlerde arıyordu; yazmaya başlayınca filtre Hepsi'ne geçer.
8. **Hata: Tasarımlar sayfası fiyatı `$1460`** yazıyordu (dükkân TRY). Şimdi satış sitesinin `displayPrice`'ı: `1,460 TRY`.
9. **"Alıcı adına yayınla" hatalı taslakta hangi alanların sorunlu olduğunu** söyler (ilk 3, + sayı); önce yalnız "eksik ya da
   hatalı alan var" diyordu.
10. Belgeler: docs/17 §1c, docs/23 §3 (adım 3 ve 6, §5 tablosu, §7), docs/19 §4.5 şablon kopyası (test eşitliği korunuyor).

### Fonksiyon denetim tablosu
✓ = yolculukta çalıştı · düzeltildi = hata bulundu, düzeltildi, yeniden koşuldu · karar = karar/iş bekliyor · (eski test) = bu turda
tarayıcıda koşulmadı, önceki görevin tarayıcı testi kapsıyor ve `npm test` yeşil.

| Fonksiyon | Durum | Kanıt |
|---|---|---|
| /start boş gönderim → alan hataları | ✓ | 5 alanın hepsi kendi iletisiyle, 390 px |
| /start sipariş (#'li no, büyük harfli e-posta) → adres önerisi, link, kopyala | ✓ | `mia-and-theo`, pano = link, e-posta küçültüldü |
| /start → onay bekliyor bilgisi | ✓ | "We are confirming your Etsy order…" |
| Kurulum 1: isim + tarih + saat | ✓ | Continue → #setup/2 |
| Kurulum 2: foto yükle → kırp → kaydet | ✓ | "1 of 5 photos" |
| Kurulum 3: Publish onay beklerken kilitli | ✓ | düğme disabled + açıklama |
| Onay sonrası Publish'in açılması | düzeltildi | önce elle yenileme; şimdi görünür olunca/dakikada bir (j18) |
| Örnek tarih kapısı (ilk yayın) | ✓ | "Your wedding date is still the design's sample" |
| Publish → canlı, Home %55 + sıradaki 3 iş | ✓ | Venue / Details / Story örnek metinleri |
| Edit 6 sayfa özetleri | ✓ | Us, Day & place, Photos, Our Story, Details, RSVP |
| Day & place: harita linki çözülemezse | ✓ | 422 → "We could not read the pin…", adres aramasına düşer |
| Details: 0–10 blok, ulaşım/konaklama, yemek/menü, SSS | ✓ | alanlar ve kısa yollar; ekran `j7-details` |
| Travel & stay "link yok" uyarısı | düzeltildi | `tests/g145.test.ts` |
| Uzun sayfada gezinme | düzeltildi (yeni) | g145-browser: Details 4 atlama, odak başlıkta |
| Story müzik: hazır parçalar / kendi dosyan | ✓ | 4 parça + "Your own music" + "No music" |
| RSVP form alanları (zorunlu/isteğe bağlı) + özel soru | ✓ | soru ekle; boş soru hatası ertelendi (düzeltildi) |
| Önizleme (sekme başına) | ✓ | Envelope/Home/Story/Details/RSVP |
| Misafir: zarf → açılış, sayfalar 200, yatay kaydırma yok | ✓ | 4 sayfa, foto görünüyor |
| Misafir RSVP: zorunlu alan hataları | ✓ | isim + katılım |
| Misafir RSVP: evet (2 kişi) / hayır → teşekkür | ✓ | iki teşekkür metni |
| Guests: sayılar, arama, filtre, sıralama, New | ✓ | 2 yanıt, "oliv" araması |
| Guests: yanıt düzelt / sil (onaylı) / elle ekle (boşta hata) | ✓ | "Edited by you", "Remove reply", "Added by you" |
| Guests: Excel (yapışkan çubuk) + CSV | ✓ | `.xlsx` 8 KB, CSV kişi başına satır |
| Results | ✓ | evet/hayır yüzdeleri, yemek/alerji notları |
| Google Sheets "Connect" (sahte Google) | ✓ | accounts.google.com, kapsam `drive.file`, geri dönüş URL'si; bozuk state → anlaşılır 400 |
| Sheets "coming soon" (ayarsız) | ✓ (eski test) | g128-browser |
| Share: link kopyala, hazır mesaj, WhatsApp/SMS/e-posta/Messenger/Telegram | ✓ | pano ve 5 bağlantı |
| Share: QR (PNG/SVG, renk, boyut), QR kartı PDF | ✓ | seçenekler görünür (indirme eski test g140) |
| Downloads: site PDF, davetiye 5×7 | ✓ | 2,0 MB / 6 sn, 1,2 MB / 2 sn, `%PDF-` |
| Downloads: A5, arka yüz, taşma payı | ✓ (eski test) | g139 |
| Site şifresi: aç → misafir sayfası, yanlış/doğru | ✓ | 401 + ileti, doğru şifreyle Details |
| Teşekkür modu | ✓ (eski test) | g075-browser |
| İsim/tarih hakkı (yayından sonra kilit, Change, sayaç) | ✓ / (eski test) | "3 of 3 changes left", Change; akış g060-browser |
| Arşiv (süre sonu yazma reddi) | ✓ (eski test) | g060 |
| /my: hatırlanan editör, link yapıştırma, yanlış link | ✓ | "This edit link is not valid" + yol |
| Kayıp link → admin "Yeni düzenleme linki" | ✓ | eski 404, yeni 200, şablon `new_edit_link` |
| Admin giriş (yanlış/doğru), Özet, Yapılacaklar, KPI'lar | ✓ | 390 + 1280, yatay kaydırma yok |
| Admin sipariş onayı | ✓ | "Sipariş onaylandı. Alıcı artık yayınlayabilir." + şablon |
| Admin dükkân notu, e-posta düzeltme, mesaj kopyala | ✓ | not kaydı alıcıyı artık kilitlemiyor (düzeltildi) |
| Admin hak ekleme / yayında kalma süresi | ✓ | "4 / 4 kaldı", "30 Ocak 2029 dahil" |
| Admin yayından kaldır → misafir 404 | ✓ | |
| Admin alıcı adına yayınla (hatalı taslak) | düzeltildi | ileti artık alanları söylüyor |
| Admin siteyi sil (adres kilidi) | ✓ | yarım adresle kapalı; silince listeden düştü |
| Admin Yeni sipariş: boş, kullanılmış numara, oluşturma | ✓ | link bir kez + mesaj |
| Admin Siparişler arama (no, #no, e-posta, tasarım, şehir, sitesiz no) | ✓ | sitesiz numarada ipucu |
| Admin hızlı arama (Özet) | düzeltildi (yeni) | g145-browser |
| Admin Müşteriler / Tasarımlar | ✓ / düzeltildi | fiyat `$1460` → `1,460 TRY` |
| Admin "linki değiştirmeden düzenle" (hizmet siparişi) | düzeltildi (yeni) | g145-browser 13 kontrol |
| axe-core, dokunma hedefleri, yatay kaydırma | ✓ | g145-browser (Details, admin Özet, admin site 390) |

### Kırık / yarım kalanlar (bu görevde çözülmedi)
- Yanlış/eski edit linki sayfası (`/edit/...` 404) yalnız metin; /my ve /start'a düğme yok. Alıcı metni olduğu için G144
  birleşince (sözlük) eklenmeli.
- Admin yamaları `updatedAt`'i ilerlettiği için "Son değişiklik" ve Yapılacaklar'daki "yayınlanmamış değişiklik (2 gün)" sayacı
  dükkânın not/mesaj kopyalamasıyla da sıfırlanıyor. Ayrı bir `contentUpdatedAt` gerekir (veri modeli; küçük ama iki adaptör).
- Details'te "Dress code" bölümü ile "Good to know → + Dress code" kısa yolu aynı bilgiyi iki yerde sunuyor; hangisinin kalacağı
  ürün kararı.

### Karar bekleyenler
1. **Özel temayı yalnız bir alıcıya açma** (docs/23 §4.4) — öneri: `theme.json`'a `private: { orders: ["<Etsy no>"] }` (ya da
   `custom: true`). `listThemes`/satış listesi/`/start` seçicisi/sitemap bu temayı göstermez; `/start?theme=<id>` yalnız listedeki
   sipariş numarasıyla açar (`claim` doğrulaması), admin **Yeni sipariş** temayı her zaman seçtirir (`adminCreatableThemes`'e
   `private` dahil). Demo yalnız admin önizleme anahtarıyla. İş: `lib/claim/themes.ts`, `lib/themes/approval.ts`, `lib/admin/create.ts`,
   marketing filtreleri + test. Onay verilirse ayrı görev (claude-kod, ~yarım gün).
2. Dükkân linki süresi 72 saat (kurulum teslimi 3 gün). Daha kısa/uzun istenirse tek sabit: `SHOP_EDIT_TTL_MS`.
3. Dükkân oturumunda Publish açık (docs/23: "Yayınlama alıcıdadır"; şerit bunu hatırlatıyor). Dükkân oturumunda yayınlamayı tamamen
   kapatmak istenirse küçük bir değişiklik.

### Test
- `tests/g145.test.ts` (npm test): dükkân anahtarı (alıcı anahtarı/önizleme değişmez, 72 saat, yenisi eskisini kapatır, kapatma,
  anahtar saklanmaz, geçmiş), admin eylemleri + panel API'si, Yapılacaklar, yeni şablon, Travel & stay uyarısı.
- `tests/g145-browser.ts` (build sonrası): 29 kontrol — yukarıdaki 1, 2, 4, 5, 7, 8 ve axe/dokunma/yatay kaydırma.
- `npm test`: **1307 / 1308** geçti. Tek kırmızı `tests/g139-print.test.ts` "every platform design has a printable invitation…":
  `22 !== 21` — G142 iki tema ekledi, G139 testi 21 bekliyor. Tabanda (ab6bde0) da aynı şekilde kırık (değişiklikler geri alınarak
  doğrulandı); bu görevin yazar alanında değil → koordinatöre: sayı 22 olmalı ve crimson/nocturne baskı parçaları kontrol edilmeli.
- `npm run build`: temiz (trace-check 23 tema). `npm run typecheck` temiz.
