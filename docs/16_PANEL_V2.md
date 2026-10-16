# Panel v2 — tasarım belgesi (G060, tasarım aşaması)

Durum: **tasarım** (kod yok). Kaynak kararlar: K22–K25 (`docs/01_KULLANICI_KARARLARI.md`), platform `docs/10_SITE_PLATFORMU.md`,
mevcut panel `platform/README.md` "Düzenleme paneli (G039)". Görev: `gorevler/G060-panel-v2-duzenleme-hakki.md`.
Bu belge G060'ın uygulama aşamasının tek kaynağıdır; uygulayan ajan buradaki kabul testlerini (§14) karşılar.

Değişmeyenler: arayüz **İngilizce**; ürün metni dürüst (yapılmamış şey vaat edilmez); marka, fiyat ve destek e-postası **karar
verilmedi** → metinde `[BRAND]`, `[SHOP NAME]`, `[SUPPORT EMAIL]` yer tutucuları, tek yapılandırmadan (§13.3); yasal kimlik yok (K25).
Panel bir **araçtır**: dekor çizimi yok (K21). Görsel olarak yalnız arayüz tasarımı (boşluk, tipografi, renk, sabit sürümlü ikon
kütüphanesi) ve alıcının seçtiği temanın **gerçek önizlemesi** kullanılır.

---

## 0. Özet

1. **İlk açılış = kurulum sihirbazı** (yalnız hiç yayınlanmamış sitede): Names → Date & time → Venue → Photos → Preview → Publish.
   Telefonda her adım tek konu, ilerleme göstergesi, geri dönüşte veri kaybı yok, her adım atlanabilir, her şey kendiliğinden kaydedilir.
2. **Sonra bölüm düzenleyici:** alt gezinme 4 sekme — **Home · Edit · Guests · Share**. Edit = gruplu bölüm listesi; her bölüm tam
   ekran kendi sayfasında. Bugünkü 10 bölümlük tek akordeon ve ayrı "Optional sections" bölümü kalkar; her aç/kapa kendi içeriğinin yanında.
3. Üst çubukta her zaman: kayıt durumu, **Preview**, ve gerektiğinde **Publish / Publish changes**.
4. **Düzenleme hakkı (anti-abuse), sunucuda zorlanır:** kimlik alanları = çift isimleri + düğün tarihi. İlk yayından sonra
   **3 değişiklik**; **≤ 2 karakterlik yazım düzeltmesi bedava**; diğer her şey sınırsız. Site düğün tarihinden **12 ay sonra salt
   okunur arşive** geçer. Kalan hak panelde sürekli görünür; hak 0'da yalnız yazım düzeltmesi kalır, gerisi destekle.
5. Kimlik alanları yayından sonra yalnız ayrı, bilinçli bir "Change names or date" akışıyla değişir; otomatik kayıt (PUT) bu alanları
   sunucuda korur → önizleme linki de sayılmamış bir isim değişikliğini gösteremez.
6. **E-posta ile giriş (magic link)**: arayüzü ve sunucu arayüzü tasarlandı; e-posta sağlayıcısı yokken **kapalı** ve dürüst metinle.
7. Durumlar (kaydediliyor, çevrimdışı, çakışma, link geçersiz, arşiv, boş) ve WCAG 2.2 AA erişilebilirlik ayrıntılı.
8. Kabul testleri §14: birim (kural fonksiyonu, API), tarayıcı (390 px yolculuk + MP4, `platform/previews/g060/`), erişilebilirlik.

---

## 0b. K29 sadeleştirme (2026-10-14, G066 Kısım B)

Kullanıcı kararı K29: panel "çok daha sade" olacak — kullanması ve bir şeyi değiştirmesi kolay, çağdaş, iyi tasarım. GM05 görsel dili
kalır (comp'lar `brand/ui/panel/`), ama daha çok boşluk, daha az rozet/çerçeve, büyük dokunma hedefleri, **tek vurgu rengi** (§8).
Sunucu, içerik şeması, doğrulama, yayın anlamı ve düzenleme hakkı kuralları **değişmedi**; değişen yalnız panelin bilgi mimarisi.
Kod: `components/panel/pages.ts` (saf fonksiyonlar, `tests/g066-panel-pages.test.ts`), `Panel.tsx`, `Setup.tsx`, `views.tsx`.
Aşağıdaki maddeler §4.3 (bölüm haritası), §4.4 (≥ 1280 ray), §5.3 (6 adımlı sihirbaz), §6.2–6.5 ve §11.7'nin (hakkın gösterimi)
ilgili kısımlarının yerine geçer; kalanlar geçerli.

1. **Kurulum 3 adım** (`#setup/1…3`): (1) isimler + tarih (ilk isimler; tam adlar açılır bölümde, isteğe bağlı; tarih, tören saati,
   telefondan saat dilimi; hak kuralı isimlerin altında tek kez) → (2) fotoğraf (tasarımın `hero_portrait` yeri; diğerleri "More
   photos" açılır bölümünde, isteğe bağlı) → (3) yayınla (örnek tarih kapısı, sipariş notu, özet, gerçek önizleme, kurallar kutusu).
   Mekân, program, hikâye, detaylar, RSVP sonra ve isteğe bağlı. Son adımda örnek metin **listesi ya da sayısı yok**; tek sakin satır:
   "Some details … still show the design's sample text. You can change them any time, before or after you publish; Home shows what is
   left." Eski adresler: `#setup/4` → 2, `#setup/5|6` → 3 (yer imleri, kayıtlı adım). Adım 1–2 atlanabilir.
2. **Edit = 6 sayfa** (`#edit/<sayfa>`): **Us** (isimler, monogram) · **Day & place** (tarih ve saat, mekân, program — sayfa içinde
   üç alt başlık) · **Photos** · **Our Story** · **Details** (host line, dress code, travel & stay, registry, misafir notu, sorular ve
   cevaplar) · **RSVP** (son tarih, sorular). Satırda yalnız tek satır özet; **örnek metin rozeti ve kilit/hak rozeti yok**, yalnız hata
   varsa "N to fix". Eski bölüm adresleri açılmaya devam eder: `#edit/venue` = Day & place, mekân bölümüne kaydırılmış; `#edit/faq` =
   Details, sorular bölümü; `#edit/names` = Us. Her bölüm sayfada `#section-<bölüm>-body` / `data-section` ile durur.
   Editörde alan etiketinin yanındaki küçük "Sample" işareti kalır (hangi alanın hâlâ örnek olduğunu söyler), ama uyarı rengi
   değil, sessiz gri.
3. **İsim ve tarih hakları tek yerde:** kilitli isimler Us sayfasında, kilitli tarih Day & place sayfasında, "N of 3 changes left" ve
   "Change" o alanların hemen yanında (`data-rights-card`). Home'daki hak kartı ve Edit listesindeki kilit rozeti kalktı. Arşivde aynı
   yerde "names and date can no longer be changed". Sunucu zorlaması (§11) aynen.
4. **Yayımlanmamış değişiklikler:** otomatik kayıt taslağa yazmaya devam eder. Yayındaki site taslağın gerisindeyken üst çubuğun
   altında tek yapışkan çubuk: **"Unpublished changes: n · Review · Publish"** (n = değişen sayfa sayısı). **Review** sheet'i yayındaki
   kopya ile taslağı karşılaştırır ve değişen sayfaların adlarını listeler (her biri o sayfayı açar) + "Publish changes". Yayındaki
   kopya sayfayla gelir (`app/edit/[slug]/page.tsx` → `site.publishedContent`), bu oturumda yayınlanınca taslağın o anki hâli olur.
   Durum kartında ikinci bir "Publish changes" yok. İlk yayın eskisi gibi kurallar + notlar sheet'iyle; sonraki yayınlar doğrudan gider
   (hatırlatmalar Home'da, kontrol Review'da). Yayın anlamı sunucuda değişmedi (taslağın tamamı yayınlanır).
5. **Home:** durum kartı → **"Your website is N% ready"** + ilerleme çubuğu + **yalnız sıradaki 3 iş** (her biri doğru editöre ve alana
   götürür; örnek metin hatırlatmaları burada, Edit'te değil) → yanıt kartı → Dates → yardım. Hazırlık: tasarımın gösterdiği her bölüm
   (hata, örnek metin, linksiz açık blok yoksa tamam), fotoğraflar (dolu yer oranı, kısmi) ve yayın birer kalem (`readiness`).
6. **Share:** önce link + QR (tek kartta); **"Guest password"** (G076; varsayılan kapalı, başlıkta Off/On) ve **"Your private edit
   link"** altta açılır bölümler; en altta "Take the website offline".
7. **Guests (G069):** aynı; yalnız görsel dil (tek vurgu).
8. **Masaüstü (≥ 960 px):** iki sütun — solda düzenleme (sekmeler üstte), sağda sabit canlı önizleme. ≥ 1280 px'te daha geniş, ray yok.

Erişilebilirlik: açılır bölümler başlık + düğme (`aria-expanded`, `aria-controls`), kapalı gövde `hidden` (yazılan kaybolmaz);
değişiklik çubuğu `role="status"`; dokunma hedefleri ≥ 44 px; odak halkası patlıcan çubukta beyaz. Tarayıcı testleri yeni akışa
uyarlandı (g060: 3 adımlı sihirbaz, hazırlık kartı, 6 sayfa, hak yeri, değişiklik çubuğu + Review, Share açılır bölümleri, iki sütun;
panel-browser, g076, g055).

**GPT comp gerekebilecek ekranlar** (şimdilik aynı dilde Claude tasarladı): değişiklik çubuğu + Review sheet'i, Home hazırlık kartı,
Day & place'in üç bölümlü sayfası, Share'in açılır bölümleri, sihirbazın 3. adımı.

---

## 0c. K29 sonrası eklenenler (2026-10-14)

- **After the wedding (G075):** Day & place sayfasının sonunda açılır bölüm — teşekkür modu Automatic / On now / Off, başlık, mesaj (≤ 400), fotoğraf, The Day sayfası Keep/Hide, teşekkür sayfası önizlemesi. Site geçince Home kartı. 7. sayfa yok.
- **Headings & labels on this page (G068):** altı editörün her birinin sonunda açılır bölüm; temanın sabit metinleri (`data-copy` anahtarları, `theme.json` → `copy` manifesti) gri tasarım metniyle, satır başı "Reset to design text". Us'ta isteğe bağlı öneri çipleri (Wedding, Vow renewal, Elopement party, Commitment ceremony; Undo). Gezinme etiketleri Details'te. Değişiklikler şeritte sayılır, Review "<Sayfa> · Headings & labels" der; isim/tarih hakkı harcanmaz. Kurulum sihirbazına eklenmedi (3 adım sade kalır). Şimdilik 01 ve 03'te; 02/04/05 G081'de.

## 1. Mevcut panel (G039 + G051 + G055) — inceleme

Çalıştırma (bu belge için, 2026-10-14): `npm ci`, iki tohum (`clara-and-julian` yayında, blush-garden-rose; `olive-draft` taslak,
olive-ivory, fotoğrafsız), `next build`, `next start`, Chromium 390 × 844 (DPR 2, mobil, dokunma) ile her bölüm, önizleme, yayın
penceresi ve geçersiz link sayfası görüntülendi. Görüntüler geçici klasörde kaldı (görev: yalnız bu belge commit'lenir).

**İyi olan ve korunacaklar**
- Otomatik kayıt kuyruğu, 409 çakışma/kayıp yanıt mantığı, `keepalive`, `beforeunload` (`usePanel.ts`) — v2'de aynen.
- "Sample" işaretleri ve "Before you publish" listesi (her madde alana götürür) — v2'de daha görünür.
- Tarih/saat alanlarının yanında okunuş ("Saturday, May 15, 2027"), sayaçlı uzunluk sınırları, alan altı hata metinleri.
- Fotoğraf kırpıcı (sürükle + pinch + kaydırıcı + klavye → sürükleme alternatifi var), sharp yeniden kodlama, QR (gerçek URL'den).
- Önizleme modalı (odak, `inert`, Android geri tuşu), geçersiz linkte genel 404 (slug sızmaz).

**Sorunlar (390 px'te görülen)**
- **İlk ekranın ~%45'i durum kartı**; içerik formunun ilk alanı ancak ikinci ekranda. Alıcıya "nereden başlayayım" söylenmiyor.
- **Tek sayfa akordeon, 10 bölüm, ~4600 px** uzunluk; bir bölüm açılınca öbürü kapanıyor, kişi yerini kaybediyor.
- **Aç/kapa ikiliği:** "Questions & answers" bölümünde "Show on the website" anahtarı + "Optional sections" bölümünde aynı anahtar;
  Details içindeki alanlar "Shown when … is on in Optional sections" diyor → alıcı iki yer arasında gidip geliyor.
- Uzun adres metni kelime ortasından kırılıyor ("http://localhost:336 / 0/olive-draft").
- Alt çubukta **"Save"** düğmesi (otomatik kayıt varken çoğu zaman pasif) yer kaplıyor; "Preview" ve "Publish" eşit ağırlıkta değil ama
  "Share" ile "Publish" aynı yerde → yayındaki sitede birincil düğmenin anlamı değişiyor.
- RSVP yanıtları ayarlarla aynı bölümde (form ayarı + yanıt listesi + CSV iç içe); yanıtlar için ayrı bir yer yok.
- Saat alanında aynı bilgi iki kez ("04:00 PM" kutu + "4:00 PM" okunuş).
- Kimlik alanları (isim, tarih) yayından sonra da serbest → aynı satın almayla başka çiftin sitesi yapılabilir (G060'ın asıl nedeni).

---

## 2. Araştırma — öğrenilen desenler (kopya yok)

Yöntem ve sınır: bu ortamdan rakip sitelere doğrudan erişim **yok** (ağ geçidi 403); bulgular web aramasının özetlerinden ve genel
UX kaynaklarından. Hiçbir rakip metni, görseli, düzeni kopyalanmadı; yalnız desen adı ve gerekçesi yazıldı. Ürün içinde doğrulanmadı.

| # | Desen | Nerede görüldü (özet) | Bizde |
|---|---|---|---|
| P1 | Önce temel bilgiler (isimler, tarih, yer), sonra tasarım/içerik | Düğün sitesi kurucularının kurulum akışları, "dört temel sayfa" önerileri | Sihirbaz §5; `/start` isimleri zaten alır (tekrar sorulmaz) |
| P2 | Sayfaları görünür/gizli yapma ve sıralama, tek "site düzenleyici" | The Knot yardım merkezi (uygulamada bölüm düzenleme, sayfa görünürlüğü); Joy (sayfa gizle/sırala) | Görünürlük anahtarı içeriğin yanında; sıralama temaya ait (yok) |
| P3 | Yayında olmayan site "Save", yayındaki "Save & Publish" | The Knot | Taslak otomatik kaydedilir; yayındaki siteye **açık** "Publish changes" |
| P4 | Tarih/etkinlik bilgisi tek "temel bilgiler" yerinde | Joy (Event Info'da tarih) | "Wedding basics" grubu: Names, Date & time, Venue |
| P5 | Partner/ortak yönetici erişimi | Joy (admin ekleme) | Aynı düzenleme linkini paylaşma ("Share with your partner"); ileride e-posta girişi |
| P6 | Etsy şablon araçlarında **süre/indirme sınırlı** düzenleme erişimi (dükkâna göre 90 gün–1 yıl, 15–30 indirme) | Corjl kullanan Etsy dükkânlarının açıklamaları | Daha yumuşak model: yalnız kimlik alanları sınırlı (§11), süre = düğün + 12 ay |
| P7 | Otomatik kayıtta üç durum: "Saved" / "Saving…" / "Failed — Retry", gecikmeli gösterge, çevrimdışı bandı + yerel kuyruk | Uygulayıcı rehberleri (Notion/Linear/Figma örnekleri) | §9 kayıt göstergesi + yerel yedek |
| P8 | Sihirbaz: uzun/çekinilen işlerde adım adım, mobilde adım başına tek konu, ilerleme göstergesi, geri dönüşte veri kaybı yok; 3–4 alanlık iş için sihirbaz gereksiz | Tasarım sistemi/UX rehberleri | 6 adım, her biri tek konu, atlanabilir (§5) |
| P9 | Hızlı işler için alt sayfa (bottom sheet), çok alanlı düzenleme + önizleme için tam ekran sayfa; iç içe sheet yok | Mobil desen rehberleri | Bölüm = tam ekran sayfa; onay/paylaşım/kimlik değişikliği = sheet |
| P10 | Magic link: 5–15 dk ömür, tek kullanım, e-posta tarayıcılarının linki "yakmaması" için ara sayfa, uygulama içi tarayıcı sorunu, hesabın varlığını sızdırmayan tek tip yanıt | Kimlik doğrulama rehberleri, uygulayıcı tartışmaları | §12 |
| P11 | Pazar yorumlarında övülen: "düzenlemesi kolay", "net talimat"; şikâyet: "çok sabit öğe", yavaşlık | `docs/13` §1, §6 | İlke 1, 4, 9 |

---

## 3. İlkeler

1. **Bir anda bir iş.** Telefonda her ekran tek konu; bir sonraki adım her zaman tek, belirgin düğme.
2. **İş güvende, ve bu görünür.** Kayıt durumu her ekranda; kaydedilmemiş değişiklik asla sessizce kaybolmaz.
3. **Taslak ≠ yayın.** Misafir yalnız yayınlananı görür; panel bunu her yayın düğmesinde ve önizlemede açıkça söyler.
4. **Dürüst metin.** Olmayan özellik görünmez ya da "not available yet" der (e-posta). Sınırlar (hak, arşiv) **önceden** söylenir.
5. **Tasarım yıldızdır, panel sakin.** Panel nötr ve temasız; renkli olan yalnız temanın gerçek önizlemesi.
6. **Affedici.** Silmede geri alma (Undo) ya da onay; her hata ne yapılacağını söyler; çıkmaz sokak yok.
7. **Adil sınır, sürpriz yok.** Hak sayacı her yerde aynı; hak harcatan her işlem, harcamadan önce bunu söyler.
8. **Varsayılan erişilebilir.** WCAG 2.2 AA, dokunma hedefi ≥ 44 px, ekran okuyucu ve klavye ile tam kullanım.
9. **Hızlı.** Panel ek ağır bağımlılık almaz; önizleme iframe'i gerektiğinde yüklenir.

---

## 4. Bilgi mimarisi

### 4.1 Modlar
| Mod | Ne zaman | Gezinme |
|---|---|---|
| **Setup** (sihirbaz) | Site hiç yayınlanmamış (`firstPublishedAt` yok) ve kurulum bu cihazda bitirilmemiş/kapatılmamış | Alt gezinme yok; üstte ilerleme + "Save & exit" |
| **Editor** | Diğer her durum | Alt gezinme: Home · Edit · Guests · Share |
| **Archived** (salt okunur) | Arşiv tarihi geçti (§11.9) | Editor ile aynı, bütün alanlar okunur metin; yalnız indirme ve görüntüleme |

### 4.2 Görünümler ve adresler
Tek Next rotası (`/edit/<slug>?k=…`); görünümler **hash** ile (anahtar sorguda kalır, geri tuşu/hareketi doğal çalışır, yer imi bozulmaz):

| Hash | Görünüm |
|---|---|
| `#setup/1` … `#setup/6` | Sihirbaz adımları (Names, Date & time, Venue, Photos, Preview, Publish) |
| `#home` (varsayılan) | Durum, sıradaki işler, yanıt özeti, hak kartı, tarihler |
| `#edit` | Bölüm listesi |
| `#edit/<bölüm>` | Bölüm sayfası (`names`, `date`, `venue`, `schedule`, `story`, `details`, `faq`, `rsvp`, `photos`) |
| `#preview/<sayfa>` | Tam ekran önizleme (mobil); masaüstünde sağ sütun |
| `#guests` | RSVP yanıtları |
| `#share` | Link, QR, paylaşım, erişim, siteyi kapatma |

Görünüm değişince odak yeni görünümün `h1`'ine taşınır ve sayfa başlığı (`document.title`) güncellenir ("Edit · Clara & Julian").

### 4.3 Bölüm haritası (bugünkü → v2)
| Grup | v2 bölümü | İçerik | Aç/kapa (bugün "Optional sections") |
|---|---|---|---|
| Wedding basics | **Names** | ilk isimler, tam isimler, "Names as shown", monogram (tema gösteriyorsa), host line | — |
| | **Date & time** | tarih, tören saati, saat dilimi, tarih biçimi | Countdown (`countdown`) |
| | **Venue** | mekân, adres, şehir/bölge/ülke, harita linki, mekân fotoğrafı | — |
| Your pages | **Schedule** | program satırları | — |
| | **Our Story** | giriş satırı, anlar (foto + başlık + metin) | sayfanın kendisi (`our_story`) |
| | **Details** | dress code, travel & stay, registry, guest policy | `dress_code`, `travel_stay`, `registry`, `guest_policy` |
| | **Questions & answers** | SSS | `faq` |
| | **RSVP settings** | son tarih, yanıt kabulü, misafir soruları | — (yanıt kabulü anahtarı burada) |
| Photos | **Photos** | temanın bütün foto yerleri (genel bakış) | — |

- Yalnız temanın gösterdiği bölüm/alan görünür (`themeFieldUse`, `optionalBlocks` — bugünkü kural).
- Foto yerleri hem **Photos**'ta hem ait oldukları bölümde (anın fotoğrafı anın kartında, mekân fotoğrafı Venue'da). Tek veri, iki giriş.
- Bölüm satırı rozetleri: `Sample` (örnek metin var), `2 to fix` (hata), `Off` (sayfa/blok kapalı), `3 changes left` (kimlik; önünde lucide `lock` ikonu).

### 4.4 Düzen (genişliğe göre)
- **< 600 px (birincil, 360–430):** tek sütun; üst uygulama çubuğu 56 px; alt gezinme 64 px + güvenli alan; içerik kenar boşluğu 16 px.
- **600–959 px:** tek sütun, içerik en çok 600 px ortada; alt gezinme kalır.
- **≥ 960 px:** iki sütun: sol içerik (en çok 600 px) + sağda yapışkan telefon önizlemesi (390 px genişlik ölçekli çerçeve, sayfa sekmeleri).
  Alt gezinme yerine içerik sütununun üstünde sekmeler.
- **≥ 1280 px:** ~~solda 220 px gezinme rayı~~ — K29 ile kalktı: ≥ 960 px her genişlikte iki sütun (§0b, §8.4).

---

## 5. İlk kurulum sihirbazı (Setup)

### 5.1 Giriş ve devam
- `/start` sonucu "Open my editor" → `#setup/1`. Site hiç yayınlanmamışsa ve bu cihazda kurulum bitmemişse panel her açılışta
  kaldığı adıma döner.
- **Adım durumu içerikten türetilir** (sunucuda yeni alan gerekmez): bir adım "bitti" = o adımın alanları boş değil ve örnek kayıttan
  farklı (bugünkü `sampleNotes` mantığı). Cihazda yalnız `localStorage['setup:<slug>'] = {step, dismissed}` (try/catch; yoksa
  ilk bitmemiş adım). Partner başka telefondan açarsa içerikten doğru adımı bulur.
- "Save & exit" → Home; Home'da "Continue setup · Step 3 of 6" kartı. İlk yayından sonra sihirbaz bir daha açılmaz.

### 5.2 Ekran düzeni (390 px)
```
┌──────────────────────────────────────┐
│ Step 2 of 6            Save & exit   │  üst: adım metni + çıkış (ikincil)
│ ▬▬▬▬▬▬▬▬▬▬▬▬▬▬░░░░░░░░░░░░░░░░░░░░   │  6 parçalı ilerleme çubuğu (aria-hidden; metin yukarıda)
│                                      │
│ When is the wedding?                 │  h1 = adımın sorusu
│ You can change the time later.       │  tek satır yardım
│                                      │
│ Wedding date                         │
│ [ 06/12/2027              (takvim) ] │
│ Saturday, June 12, 2027              │  okunuş
│ …                                    │
│                                      │
├──────────────────────────────────────┤
│ (bulut) Saved     [Back] [Continue]  │  yapışkan alt: kayıt durumu + Back (ikincil) + Continue (birincil)
└──────────────────────────────────────┘
```
"Skip for now" her adımda (Publish hariç) Continue'nun üstünde metin düğmesi. Geri hareketi/tuşu önceki adıma gider.

### 5.3 Adımlar
| # | Başlık (h1) | Alanlar | Kurallar / metin |
|---|---|---|---|
| 1 | **Your names** | İlk isimler (`/start`'tan dolu), "How your names appear" seçimi: `Clara & Julian` · `Clara and Julian` · kendi yazdığın; "Add full names for the invitation card" (açılır, isteğe bağlı); monogram (tema gösteriyorsa, otomatik) | Yardım: "You can change these freely until you publish. After that, you can change your names or wedding date 3 times — fixing a small typo is free." Canlı mini önizleme: temanın zarf sayfası ölçekli iframe (yalnız bu adımda ve Photos'ta) |
| 2 | **When is the wedding?** | Tarih (yerel tarih seçici + okunuş), tören saati (okunuş yalnız cihazın saat biçimi sitenin biçiminden farklıysa; bugünkü çift gösterim kalkar), saat dilimi ("We'll use **New York** time, from your phone. Change"), tarih biçimi (United States · United Kingdom · Canada · Australia; her seçenekte örnek tarih, `formatDate` ile) | Aynı hak yardımı. Saat dilimi listesi aranabilir sheet |
| 3 | **Where is it?** | Mekân adı, şehir, bölge (isteğe bağlı), ülke, adres (isteğe bağlı), harita linki (isteğe bağlı, "Paste a Google Maps or Apple Maps link") | — |
| 4 | **Add your photos** | Temanın foto yerleri kart kart: şekil etiketi ("Tall (portrait)"), "Add photo" → mevcut kırpıcı; yükleme ilerlemesi | "Until you add a photo, your guests see a soft placeholder image." Sayaç "2 of 5 photos" |
| 5 | **Check your website** | Tam önizleme (sayfa sekmeleri) + "Still sample text" listesi (Schedule, Story, Details, Reply-by…) | Her madde ilgili bölüm sayfasını sihirbazın üstünde açar; "Done" ile adıma döner. Continue = "Looks good" |
| 6 | **Publish your website** | Özet kartı (isimler, tarih, mekân, adres `…/clara-and-julian`), **kurallar kutusu**, "Publish my website" | Kurallar kutusu (§11.7 metni): 3 değişiklik + yazım düzeltmesi + "online until <tarih>" |

Başarı ekranı: "Your website is live" (lucide `circle-check-big`, sakin 200 ms görünme; konfeti/çizim yok, K21), link + Copy +
**Share** (`navigator.share` varsa sistem paylaşımı; yoksa gizli) + QR + "Go to my editor" → `#home`.
Yayın hatası (422) → "Before you publish" listesi (bugünkü), her madde ilgili adıma/bölüme götürür.

### 5.4 Sihirbaz kuralları
- Continue alanları doğrular (blur'da görünen hata kuralı aynı); örnek değerle devam **serbest** ama adımda sarı not: "These are
  still the sample details from the design."
- Örnek değerli bir alana odaklanınca metnin tamamı seçilir (yazınca örnek gider) — ayrı "temizle" düğmesine gerek kalmaz.
- `/start`'ta girilen bilgi tekrar sorulmaz (WCAG 3.3.7): isimler dolu gelir; adres (slug) sihirbazda yalnız gösterilir.
- Sihirbaz, editörle aynı veri/kayıt katmanını (`usePanel`) kullanır; ayrı API yok.

---

## 6. Bölüm düzenleyici (Editor)

### 6.1 Üst uygulama çubuğu
`[< geri | başlık] ················ [(bulut) Saved] [(göz) Preview] [Publish changes]`
- Kök görünümlerde (Home/Edit/Guests/Share) solda çiftin adı (serif, tek satır, kısaltılır); bölüm sayfasında geri oku + bölüm adı.
- **Kayıt göstergesi** (§9.1): ikon + kısa metin; dar ekranda yalnız ikon, `aria-label` tam metin.
- **Preview**: ikon düğme (lucide `eye`, etiketi "Preview"); bölüm sayfasında o bölümün sayfasını açar (Story → `/story`).
- **Publish düğmesi** (birincil, tek):

| Durum | Düğme |
|---|---|
| Hiç yayınlanmadı | `Publish` |
| Yayında, taslak farklı | `Publish changes` |
| Yayında, güncel | düğme yok; yerine sakin `Live` rozeti (dokununca Share) |
| Yayından kaldırıldı | `Publish again` |
| Arşiv | düğme yok; `Archived` rozeti |

Yardım (`circle-help`) her görünümde aynı yerde: üst çubuğun taşma menüsünde ve Home'un altında (WCAG 3.2.6).

### 6.2 Home
Sıra: (1) **Durum kartı** — rozet + tek cümle + tek eylem ("Your website is live · 3 changes not published yet · Publish changes");
(2) **Next steps** — en çok 5 madde (örnek metin, boş foto, hata, yaklaşan son tarih: "Replies close in 6 days"), her biri bölüme gider,
hepsi bitince kart "You're all set" der ve küçülür; (3) **Replies** özeti — "12 coming · 3 not coming · 2 new" ("new" = bu cihazda son
bakıştan beri, `localStorage`); (4) **Names & date** hak kartı (§11.7); (5) **Dates** — Wedding · Replies close · Online until.

### 6.3 Edit
Gruplu liste (§4.3). Satır: 20 px ikon + başlık + tek satır özet + rozetler + `chevron-right`; satır yüksekliği ≥ 64 px.
Bölüm sayfası: alanlar dikey; altta yapışkan "Preview this page" (ikincil). Kimlik alanları yayından sonra okunur görünür
(değer + `lock` + "Change" düğmesi) → §11.6 sheet'i.

**Liste düzenleme** (program, anlar, SSS, RSVP soruları): kart başına başlık satırı + taşma menüsü (`ellipsis`): Move up · Move down ·
Remove. Sürükle-bırak **yok** (dokunmatikte ve ekran okuyucuda zor; WCAG 2.5.7). Programda "Sort by time" kalır. Remove anında yapılır,
6 sn **Undo** snackbar'ı (kayıt zaten otomatik; Undo eski satırı yerine koyar). Onayı yalnız ağır işler ister: misafir yanıtı silme ve siteyi
kapatma (onay sheet'i), hak harcama (ne olacağını söyleyen düğme metniyle, §11.6).

### 6.4 Guests
- Üstte 3 sayı kutusu: **Coming** (kişi sayısı), **Not coming**, **Replies**; altında son tarih satırı ("Replies close at the end of
  Saturday, April 3, 2027 (New York time)").
- Süzgeç çipleri: All · Coming · Not coming · Held for review (varsa); isimle arama (≥ 8 yanıtta görünür).
- Yanıt kartı: isim, kişi sayısı, zaman; dokununca açılır: e-posta, mesaj, soruların cevapları. Taşma menüsü: "Remove reply" (onaylı).
- "Download all replies (CSV)", "Refresh"; "Reply settings" → `#edit/rsvp`.
- Hiç yayınlanmamış site: boş durum "Replies appear here after you publish your website." + Publish.

### 6.5 Share
1. **Your website link** — adres (kelime ortasında kırılmaz: `overflow-wrap: anywhere` yerine yol `/` sonrası `<wbr>`), Copy, Open, Share.
2. **QR code** — mevcut bileşen (PNG/SVG), "Scan it once with your phone camera before you print."
3. **Your edit link** — "Anyone with this link can edit your website. Share it only with your partner." · "Copy edit link" ·
   ipucu: "Tip: add this page to your Home Screen to find your editor quickly."
4. **Sign in by email** — §12 (sağlayıcı yokken "Not available yet").
5. **Take the website offline** — en altta, tehlike rengi metin düğmesi, onaylı (bugünkü metin).

---

## 7. Bileşen envanteri

| Bileşen | Amaç | Durumlar | Not / bugünkü karşılık |
|---|---|---|---|
| `AppBar` | başlık, geri, kayıt, Preview, Publish | kök / alt sayfa / arşiv | yeni |
| `BottomNav` | 4 sekme, ikon + etiket | seçili (`aria-current="page"`), rozet (yeni yanıt sayısı) | yeni |
| `SetupProgress` | "Step n of 6" + parçalı çubuk | — | yeni |
| `SaveIndicator` | kayıt durumu (§9.1) | 8 durum | `Panel.tsx` `SAVE_LABELS` genişler |
| `StatusBadge` | Draft / Live / Unpublished changes / Offline / Archived / Sample / Off / n to fix | renk + metin (+ ikon) | `pill` sınıfları |
| `Button` | primary / secondary / tertiary (metin) / danger | normal, hover, pressed, focus, disabled, busy (spinner + "Publishing…") | yükseklik 48 (primary), 44 (diğer) |
| `IconButton` | tek ikon eylem | aynı | her zaman `aria-label` |
| `TextField` / `TextArea` | etiket üstte, yardım, sayaç, hata, `Sample` çipi | boş, dolu, odak, hata, salt okunur | `fields.tsx` `TextField` |
| `DateField` / `TimeField` | yerel seçici + okunuş | geçersiz, örnek | `fields.tsx` |
| `TimeZonePicker` | aranabilir liste sheet'i | cihazın dilimi önerisi | `SelectField` yerine |
| `SegmentedControl` | tarih biçimi, isim ayracı | — | yeni |
| `SwitchRow` | aç/kapa + açıklama | açık/kapalı/disabled | `Switch` |
| `ListRow` | bölüm satırı | rozetli | yeni |
| `Card` | Home kartları, liste öğeleri | — | — |
| `ChecklistItem` | Next steps | yapılacak / bitti | `NoteList` |
| `RepeatableItem` | program/an/SSS/soru kartı + taşma menüsü | ilk/son (Move up/down gizli) | `RowActions` |
| `Menu` | taşma menüsü | klavye ok tuşları | yeni |
| `Sheet` | alt sayfa (onay, paylaşım, kimlik değişikliği, saat dilimi) | açık/kapalı; odak tuzağı, Escape, geri tuşu | `Sheet.tsx` |
| `Snackbar` | "Event removed · Undo", "Copied" | 6 sn, `role="status"` | yeni |
| `Banner` | çevrimdışı, çakışma, link geçersiz, arşiv | bilgi / uyarı / hata | `banner` |
| `EmptyState` | ikon + cümle + tek eylem | — | yeni |
| `PhotoSlotCard` | foto yeri: küçük resim, şekil, Add/Replace/Remove | boş, yükleniyor (ilerleme), hata, dolu | `PhotosSection.tsx` |
| `PhotoCropper` | kırpma | — | `PhotoCropper.tsx` (aynen) |
| `PreviewFrame` | iframe + sayfa sekmeleri + "Draft preview" etiketi | yükleniyor iskeleti | `PreviewPane.tsx` |
| `StatTile` | Guests sayıları | — | yeni |
| `ReplyCard` | yanıt | kapalı/açık, held | `Replies` |
| `RightsMeter` | 3 nokta + "2 of 3 changes left" | 3/2/1/0, destek eki | yeni (§11.7) |
| `IdentityChangeSheet` | isim/tarih değişikliği | unchanged / typo / change / no rights / gönderiliyor / hata | yeni (§11.6) |
| `LinkCard` | URL + Copy/Open/Share | kopyalandı | statusCard parçası |
| `QrCard` | QR | — | `QrCode.tsx` |
| `HelpSheet` | panel yardımı (kısa SSS + destek) | — | yeni |
| `Skeleton` | önizleme/yanıt yükleniyor | — | yeni |

İkonlar: **`lucide-react@1.46.0`** (ISC, 2026-09-14 sürümü; sürüm sabit, `package-lock` ile). Bu belgede geçen adlar bu sürümde
doğrulandı: `house`, `pencil`, `users`, `share-2`, `eye`, `eye-off`, `lock`, `circle-check-big`, `cloud`, `cloud-off`, `wifi-off`,
`loader-circle`, `triangle-alert`, `circle-alert`, `info`, `circle-help`, `calendar`, `clock`, `map-pin`, `image`, `image-plus`, `camera`,
`list-ordered`, `book-open`, `shirt`, `gift`, `bed-double`, `message-circle-question`, `mail`, `link`, `copy`, `external-link`,
`qr-code`, `download`, `archive`, `undo-2`, `rotate-ccw`, `refresh-cw`, `plus`, `trash-2`, `arrow-up`, `arrow-down`, `ellipsis`,
`chevron-left`, `chevron-right`, `x`, `key-round`, `sparkles`, `hourglass`. Tek tek içe aktarılır (ağaç sallama); ikon 20 px (satır), 24 px
(gezinme), çizgi 1.75; ikon tek başına anlam taşımaz (yanında metin ya da `aria-label`).

---

## 8. Görsel tasarım dili (tokenlar)

> **G066 (2026-10-14): panel BKE Studio markasına giydirildi; K29 ile sadeleşti.** Kaynak: `brand/tokens.json`, `brand/README.md`,
> GPT comp'ları `brand/ui/panel/u2_*.png` (GM05; comp metni değil, ürünün gerçek metni kullanılır). Aşağıdaki değerler günceldir;
> G060'ın marka-nötr değerleri (sıcak gri zemin, mürekkep siyahı, kayrak mavisi vurgu, sistem fontları) geride kaldı. Bileşenler ve
> erişilebilirlik kuralları aynı; bilgi mimarisi K29 ile değişti (§0b).

Kâğıt zemin, beyaz kartlar (çerçevesiz, yumuşak gölge), bol boşluk. **Tek vurgu rengi (K29): derin patlıcan `#2B1526`** — başlık,
birincil düğme, seçili sekme/çip, link, odak, ilerleme çubuğu, "New" rozeti, yayımlanmamış değişiklik çubuğu; sakin zeminler onun soluk
tonu. Şampanya altını ve toz lavanta yalnız **logoda** kalır. Renk yine yalnız alıcının tasarımının önizlemesinde "şarkı söyler";
dekor çizimi yok (K21), tek görsel öğe markanın kendi logo SVG'si. CSS özel özellikleri `.app`, `.overlay`, `.snackHost`, `.notice`
köklerinde (`components/panel/panel.module.css`); karanlık mod yok.

### 8.1 Renk
| Token | Değer | Kullanım | Kontrast (WCAG, hesaplandı) |
|---|---|---|---|
| `--c-bg` | `#FAF7F0` (paper_light) | sayfa zemini | — |
| `--c-surface` | `#FFFFFF` | kart, sheet, alan | — |
| `--c-surface-sunken` | `#F3EEE5` | ikon diskleri, link alanı, alt gezinme, iskelet, çubuk zemini | — |
| `--c-paper` | `#EDE5D7` (paper) | süzgeç çipleri, ilerleme parçaları zemini, kapalı anahtar | — |
| `--c-text` | `#202020` (ink) | gövde metni, etiket | 15.2 (bg), 16.3 (surface), 13.0 (paper) |
| `--c-heading` = `--c-primary` = `--c-accent` | `#2B1526` (anchor) | tek vurgu: başlıklar, birincil düğme, seçili sekme/çip, link, odak, ilerleme, "New", değişiklik çubuğu | 15.9 (bg), 17.0 (surface), 13.6 (paper); beyaz metin 17.0 |
| `--c-primary-hover` | `#45213C` | | beyaz metin 13.7 |
| `--c-accent-soft` | `#F3EDF1` (patlıcanın soluk tonu) | bilgi bandı, son tarih şeridi, kurallar kutusu, sakin not, seçili satır | anchor metin ≥ 14 |
| `--c-text-muted` | `#5C5560` | yardım, özet, pasif sekme | 6.7 (bg), 7.2 (surface), 6.2 (sunken), 5.7 (paper), ≥ 5.9 (soluk ton) |
| `--c-border` | `#EBE3D6` | ayırıcı (dekoratif) | bilgi taşımaz |
| `--c-control-border` | `#8C7F8A` | alan çerçevesi, ikincil düğme, kapalı anahtar | 3.8 (surface), 3.6 (bg), 3.0 (paper) ≥ 3:1 (1.4.11) |
| `--c-success` / `-soft` | `#1E6B43` / `#E3EFE4` | Live, Coming, Saved (durum rengi, vurgu değil) | 5.5 |
| `--c-warning` / `-soft` | `#7A4F00` / `#F8EDD3` | Sample, son hak, çevrimdışı | 6.1 |
| `--c-danger` / `-soft` | `#B0261E` / `#FBE9E7` | hata, kaldırma | 5.7; beyaz metin 6.7 |

Snackbar: patlıcan zemin, beyaz metin, eylemler kâğıt renginde altı çizili (13.6). Rozetlerde renk tek ipucu değildir (her zaman
metin, çoğu zaman ikon/nokta).

### 8.2 Tipografi (Google Fonts, `next/font` — repoda font dosyası yok)
`components/panel/fonts.ts`: satış sitesiyle aynı aileler ve dosyalar (`app/(marketing)/layout.tsx`); değişken adları panele özgü
(`--bke-display`, `--bke-wide`, `--bke-body`), sınıf her panel kökünde (uygulama, sheet ve snackbar portalları, "link geçersiz" sayfası).
- `--font-ui`: DM Sans (değişken) + sistem yığını — etiket, alan, düğme, gövde.
- `--font-display`: **Archivo 800**, harf aralığı −0.015 … −0.03em — her başlık (`h1`, kart/sheet/blok başlıkları, satır başlıkları,
  sayı kutuları, yanıt adları) ve birincil düğmeler.
- `--font-wide`: **Montserrat 300** — Home'da isimlerin altındaki tarih satırı.

| Rol | Boyut / satır | Ağırlık |
|---|---|---|
| Home isimler | clamp(34–54 px) / 1.0 | 800 |
| Görünüm başlığı (`h1`) | clamp(30–42 px) / 1.04; editör sayfası (ikonlu) clamp(26–36 px) | 800 |
| Sihirbaz sorusu | clamp(32–46 px) / 1.04 | 800 |
| Sayfa içi blok başlığı (Day & place: Date & time · Venue · Schedule) | 24 px | 800 |
| Kart / sheet başlığı | 20 / 24 px | 800 |
| Satır başlığı (Edit) | 19 px | 800 |
| Gövde, alan metni | 16 / 17 px (≥ 16: iOS yakınlaştırma yok) | 400 |
| Etiket | 16 / 22 | 600 |
| Yardım, özet | 14–15 / 20–21 | 400 |
| Rozet | 13 / 18 | 600 |

### 8.3 Boşluk, köşe, gölge, hareket
- Boşluk: 4'ün katları; kenar 16 px (< 600), 24 px (≥ 600); kartlar arası 20 px, kart içi 24 px (K29: daha çok boşluk).
- Köşe: `--r-chip` 8 · `--r-control` 12 (alan, düğme) · `--r-card` 18 · `--r-sheet` 24 · `--r-pill` 999.
- Gölge: `--e-1` `0 1px 2px rgb(43 21 38 / .04), 0 10px 24px -16px rgb(43 21 38 / .18)` (kart; çerçeve yok) · `--e-2`
  `0 18px 44px rgb(43 21 38 / .2)`.
- Yükseklik: üst çubuk 60 px, alt gezinme 68 px; birincil düğme 48 px (tam genişlikte 52), diğerleri ≥ 44 px, alan 52 px,
  Edit satırı 88 px, açılır bölüm başlığı 72 px.
- Hareket aynı (`--m-fast` 120 ms, `--m-base` 200 ms; `prefers-reduced-motion` → ~0).
- Odak: `outline: 2px solid #2B1526; outline-offset: 2px` (patlıcan çubukta beyaz); alanlarda patlıcan çerçeve + soluk hale.

### 8.4 Düzen ayrıntıları (G066, comp'lara göre; K29 ile)
- **Logo:** `components/panel/Brand.tsx` — `public/brand/bke-logo-horizontal-anchor.svg` (24 px; marka en küçük boyu). Telefonda
  üst çubukta uzun bir Publish düğmesi varken (< 440 px) ve her ekranda < 360 px küçük sembol (`bke-monogram-small-anchor.svg`, 30 px;
  marka kuralı 16–47 px). Bağlantı değil (alan adı yok, K26). Sihirbazın üstünde, başarı ekranında ve "link geçersiz" sayfasında da var.
- **Üst çubuk:** logo · (editör sayfasında geri + sayfa adı; telefonda logo yerine) · çiftin adı (yalnız ≥ 600 px; Home'da kaydırınca) ·
  kayıt durumu · Preview (telefon) · Publish (taslak) / Publish again (yayından kaldırılmış) / Live / Archived. Yayındaki sitede
  değişiklik varken Publish üst çubukta değil, altındaki **değişiklik çubuğunda** (§0b).
- **Alt gezinme:** kâğıt bant; seçili sekme patlıcan metin + altında 3 px çubuk (yalnız renk değil). Yeni yanıt sayısı patlıcan rozet.
- **≥ 960 px: iki sütun (K29)** — solda düzenleme (Home · Edit · Guests · Share sekmeleri içeriğin üstünde, seçili patlıcan), sağda
  yapışkan canlı önizleme (yuvarlak kâğıt panel, patlıcan telefon çerçevesi; açık sayfayı izler). G060'ın ≥ 1280 px gezinme rayı kalktı.
- **Home:** isimler büyük; tarih Montserrat 300. Durum kartı (Live / Draft / Offline / Archived; link kâğıt alanda + Copy; tek eylem),
  hazırlık kartı (§0b), yanıt kartı ("N new replies"), Dates, yardım.
- **Edit:** altı büyük satır-kart (52 px disk ikon, Archivo başlık, tek satır özet; yalnız hata varsa "N to fix" rozeti).
- **Guests:** sayı kutuları (≥ 480 px'te sayı + disk yan yana, telefonda disk üstte), soluk tonlu son tarih şeridi, patlıcan cevap
  çubukları (sayılar metinde), süzgeç çipleri kâğıt hap, her yanıt ayrı kart (yeni: patlıcan kenar + "New" rozeti; Coming/Not coming
  noktalı rozet), altta "Add a reply" + "Download list" (başlık fontunda).
- **Share:** üstte tek kart: adres kâğıt alanda, Copy (yayındayken birincil) / Open / Share, altında QR (beyaz üstünde kâğıt paspartu,
  PNG/SVG). Altında açılır bölümler: "Guest password" (Off/On) ve "Your private edit link"; en altta "Take the website offline".
- **Sihirbaz:** logo + "Save & exit", altında 3 parçalı çubuk + "Step n of 3"; büyük başlık; Continue 52 px.

## 9. Durumlar

### 9.1 Kayıt göstergesi
| Durum | Gösterge (ikon · metin) | Not |
|---|---|---|
| saved | `cloud` · "Saved" | varsayılan, sakin |
| pending | nokta · "Unsaved changes" | 800 ms gecikmeli kayıt bekliyor; dokununca hemen kaydeder ("Save now") |
| saving | `loader-circle` · "Saving…" | 300 ms'den kısa sürerse gösterilmez (titreme yok) |
| retrying | `cloud-off` · "Not saved yet. Trying again…" | artan aralık (bugünkü) |
| offline | `wifi-off` · "Offline" + bant | §9.2 |
| conflict | `triangle-alert` · "Saving paused" + bant | "This website was changed on another device. Reload to get the latest version." [Reload] |
| unauthorized | `triangle-alert` + tam ekran | "This edit link no longer works." (link yenilendi) + destek metni |
| refused | `circle-alert` · sunucunun mesajı | 400/413: "These changes could not be saved. Please reload the page." |

Durum metni `role="status"` (polite) içinde; yalnız saved ↔ diğerleri geçişleri okunur (her tuşta değil).

### 9.2 Çevrimdışı
- `navigator.onLine` + başarısız istek → üstte bant: "You're offline. Your changes are kept on this phone and saved when you're back online."
- **Yerel yedek:** kaydedilmemiş taslak `localStorage['draft:<slug>'] = {baseUpdatedAt, content, at}` (≤ 64 KB; try/catch). Başarılı kayıtta
  silinir. Sayfa yeniden açıldığında yedek varsa ve sunucudaki `updatedAt` = `baseUpdatedAt` ise: "You have unsaved changes from this
  phone. [Restore] [Discard]". Sunucu sürümü farklıysa yedek kullanılmaz (çakışmayı sessizce ezmemek için) ve "Discard" önerilir.
- Çevrimdışıyken: foto yükleme, Publish, kimlik değişikliği, yanıt silme **devre dışı**, nedeni düğmenin altında ("Connect to the internet to publish.").

### 9.3 Hata eşlemesi
| Sunucu | Panel |
|---|---|
| 401 `unauthorized` | tam ekran "This edit link no longer works" + "If you did not change it, message [SHOP NAME] on Etsy." |
| 403 `no_changes_left` | kimlik sheet'inde §11.8 metni |
| 403 `archived` | arşiv bandı, alanlar okunur (§11.9) |
| 409 `conflict` | conflict durumu |
| 409 `confirm_required` | kimlik sheet'i sınıfı günceller ("This now uses 1 change") ve tekrar onay ister |
| 413 / 415 (foto) | foto kartında satır içi, sunucunun bugünkü İngilizce mesajıyla (ör. "The photo is larger than 10 MB.") + "Choose another photo" |
| 422 `invalid_content` | "Before you publish" listesi |
| 429 | "Too many tries. Please wait a minute and try again." |
| 5xx / ağ | "Something went wrong on our side. Please try again." — "Your changes are kept on this phone" yalnız yerel yedek gerçekten varsa |

### 9.4 Boş durumlar
| Yer | Metin | Eylem |
|---|---|---|
| Guests, yayın yok | "Replies appear here after you publish your website." | Publish |
| Guests, yanıt yok | "No replies yet. Share your website so guests can reply." | Share |
| Schedule boş | "Add the order of the day: ceremony, dinner, dancing." | Add an event |
| Q&A boş | "Answer what guests often ask, such as parking or children." | Add a question |
| Story anı yok | "Add up to 3 moments with a photo and a short title." (sayı temadan) | Add a moment |
| Foto yeri boş | "No photo yet" + şekil | Add photo |
| Arama sonuçsuz | "No replies match “…”." | Clear search |

### 9.5 Yükleniyor
Panel durumu sunucuda üretilir (anında). Önizleme iframe'i ilk açılışta yüklenir: `Skeleton` + "Loading preview…"; 10 sn'de
"The preview is taking longer than usual. [Try again]". Yanıt listesi iskeletle.

---

## 10. Erişilebilirlik (WCAG 2.2 AA)

- **Yapı:** `lang="en"`; `header` / `nav` (alt gezinme, `aria-label="Editor"`) / `main`; her görünümde tek `h1`; bölüm başlıkları `h2`.
- **Formlar:** görünür etiket (yer tutucu etiket değildir); yardım + hata `aria-describedby`; hata `aria-invalid="true"`; hata metni ne
  yapılacağını söyler. Publish'te hata özeti sheet'i, her madde alana götürür ve odaklar (bugünkü).
- **Odak:** görünüm değişince `h1`'e; sheet açılınca ilk etkileşimli öğeye, kapanınca açan düğmeye; sheet açıkken arka plan `inert`;
  yapışkan üst/alt çubuklar odaklı alanı örtmez (`scroll-padding-top/bottom`, 2.4.11).
- **Klavye:** her şey Tab ile; menüde ok tuşları; Escape sheet/menü kapatır; kırpıcıda ok/+/- (2.5.7 sürükleme alternatifi).
- **Ekran okuyucu:** kayıt durumu polite; hak sayacı metni tam ("2 of 3 name and date changes left"); rozetler metin; ikon düğmeler etiketli;
  ilerleme "Step 2 of 6: When is the wedding?" başlıkta.
- **Görsel:** §8.1 kontrastları; 200% yakınlaştırma ve 320 px genişlikte yatay kaydırma yok (1.4.10); metin aralığı değişince kesilme yok (1.4.12).
- **Dokunma:** ≥ 44 px (2.5.8'in 24 px'inden sıkı); yakın hedefler arası boşluk.
- **Hareket:** `prefers-reduced-motion`; otomatik oynayan hareket yok.
- **Zaman:** oturum zaman aşımı yok (düzenleme linki); magic link süresi giriş içindir ve yenisi istenebilir.
- **Kimlik doğrulama (3.3.8):** link tabanlı; bilmece/kod yazma yok.
- **Tutarlı yardım (3.2.6):** yardım her görünümde aynı yerde.

---

## 11. Düzenleme hakkı modeli (anti-abuse)

> **G060-fix (2026-10-14, inceleme bulguları — uygulanan kural bu belgenin aşağıdaki ilk tasarımından farklı):** tarih karakterle
> değil **günle** ölçülür (çapadan ±7 gün ücretsiz; §11.3 tablosundaki "2027-06-12 → 2027-06-21 typo" artık 1 değişiklik);
> **soyadı ekleme/çıkarma** (ilk isim aynı) ücretsiz; son sayılan değişikliğin **geri alınması** yayından önce ya da 10 dk içinde
> ücretsiz ve hakkı iade eder; örnek tarihle yayınlanmış sitede gerçek tarih bir kez ücretsiz, ilk yayın örnek tarihte onay ister;
> arşiv sayılan tarihten hesaplanır; panel önizlemesi kısa ömürlü jetonla, kalıcı önizleme anahtarında "Preview — not published"
> şeridi ve arşivde/18 aylık yayınlanmamış taslakta 410 (§11.11 "önizlemeyi site gibi kullanmak" satırı kapandı). Ayrıntı:
> `platform/README.md` "G060-fix".

### 11.1 Kurallar (görev metni, aynen)
1. **Tek sipariş = tek site** (var: `/start` + `orders/<no>` dizini, G045/G048).
2. **Kimlik alanları = çift isimleri + düğün tarihi.** İlk yayından **sonra** bunlar için **3 değişiklik hakkı** (varsayılan).
3. **Yazım düzeltmesi (≤ 2 karakter fark) hak harcamaz.**
4. **Diğer her şey sınırsız** (saat, mekân, program, metinler, fotoğraflar, aç/kapa, RSVP ayarları, yanıtlar).
5. Site **düğün tarihinden 12 ay sonra salt okunur arşive** geçer (K25).
6. **Hepsi sunucuda zorlanır** (istemci yalnız gösterir) ve testlidir.

### 11.2 Tanımlar
- **Kimlik kaydı** (içerikten türetilir): `names[i] = {display: partners[i].display_name, full: partners[i].full_name}`, `shown: name_display`,
  `initials`, `date`. (Monogram isimlerden türeyen kimlik parçasıdır; tema göstermese de içerikte vardır.)
- **Normalleştirme** (karşılaştırmadan önce, her alana): NFC → görünmez/bidi karakterleri silme (`lib/claim/fields.ts` ile aynı küme) →
  ardışık boşlukları teke indirme → baştaki/sondaki boşluğu atma. `null` = `""`. Büyük/küçük harf **duyarlı** (Clara→clara = 1).
  `shown` için ek: isim ayracı farkı sayılmaz — `\s*(&|\+|and)\s*` → ` & ` (büyük/küçük duyarsız "and"); "Clara & Julian" →
  "Clara and Julian" değişiklik değildir.
- **Uzaklık:** alan başına Damerau–Levenshtein (bitişik harf yer değiştirmesi = 1; "optimal string alignment"), **kod noktası** üzerinde
  (`[...s]`). Tarih ISO `YYYY-MM-DD` metni olarak aynı fonksiyonla.
- **Çapa (anchor):** sayılan son kimlik. İlk yayında = o anki kimlik; her **sayılan** değişiklikte yeni kimlik olur. Bedava düzeltmeler
  çapayı **değiştirmez** → bedava düzeltmeler birikerek ilerleyemez (çapadan en çok 2 karakter sapma).

### 11.3 Sınıflandırma (saf fonksiyon, istemci + sunucu ortak: `lib/panel/rights.ts`)
```
classifyIdentityChange(anchor, next):
  if next.names.length !== anchor.names.length        → 'change'     // ikinci isim eklemek (silmek zaten yok)
  d = max over fields f in [names[i].display, names[i].full, shown, initials, date] of dist(norm(anchor.f), norm(next.f))
  d == 0 → 'unchanged';  d ≤ 2 → 'typo';  else → 'change'
```
Bir **değişiklik**, aynı onayda değişen bütün kimlik alanlarını kapsar (isimler + tarih birlikte = 1 hak).

| Çapa | Yeni | Sonuç |
|---|---|---|
| Clara | Clare | typo (1) |
| Clara | Calra | typo (1, yer değiştirme) |
| Clara | clara | typo (1) |
| `Clara ` | `Clara` | unchanged |
| Julian | Julián | typo (1) |
| Clara | Klaire | change (3) |
| Clara & Julian | Clara and Julian | unchanged (ayraç) |
| Clara → Clarie (typo) → Claire | çapa hâlâ Clara: dist(Clara, Claire) = 2 | typo |
| … → Blaire | dist(Clara, Blaire) = 3 | change (çapa = Blaire) |
| 2027-06-12 | 2027-06-21 | typo (yer değiştirme) |
| 2027-06-12 | 2027-06-13 | typo |
| 2027-06-12 | 2027-09-30 | change (3) |
| 1 isim | 2 isim | change |
| Clara+Julian, 2027-06-12 | Maria+Julian, 2027-09-30 | **1** change |

Bilinen ve kabul edilen sınır: çok kısa isimlerde 2 karakter büyük bir oran ("Ana" → "Eva" bedava). Başka bir çiftin bütün isimleri ve
tarihi aynı anda ≤ 2 karakter yakın olmalı; risk düşük, belgelenir.

### 11.4 Ne zaman sayılır
- **İlk yayından önce:** kimlik alanları serbest ve sınırsız (sihirbaz, normal otomatik kayıt).
- **İlk yayından sonra:** kimlik alanları **yalnız** `POST /api/edit/<slug>/identity` ile değişir. Otomatik kayıt (`PUT`) bu alanların
  saklı değerini korur (aşağıda). Hak, kullanıcı değişikliği **onayladığı anda** harcanır (yayında değil): böylece taslak ve önizleme
  linki her zaman sayılmış bir kimliği gösterir; "önizleme linkini başka çiftin sitesi gibi kullanma" yolu kapanır.
- Yayından kaldırıp yeniden yayınlamak sayacı sıfırlamaz (`firstPublishedAt` bir kez yazılır, hiç silinmez).
- Onaylanan kimlik taslağa yazılır; site yayındaysa panel hemen "Publish changes"i öne çıkarır ("Names changed. Publish to show them to
  your guests." + Publish).

### 11.5 Sunucu zorlaması (uygulama noktaları)
| Nokta | Kural |
|---|---|
| `lib/panel/draft.ts` `prepareDraft` (PUT) | `site.firstPublishedAt` varsa kimlik yollarının (`partners[*].display_name/full_name`, `name_display`, `initials`, `date`) saklı değerini korur (bugünkü `LOCKED_FIELDS` gibi) ve isim sayısını değiştirmez. Gelen değer farklıysa yanıt `200` + `identityKept: true` + saklı kimlik → istemci kendini düzeltir ve not gösterir. |
| `POST /api/edit/<slug>/identity` (yeni) | Gövde `{identity, baseUpdatedAt, intent}`; `intent` = `'fix'` ya da `'change'`. Sunucu `classify` eder: `unchanged` → 200 (yazmaz); `typo` → yazar, hak değişmez; `change` → `intent:'change'` değilse **409 `confirm_required`** (+ sınıf, kalan); kalan 0 ise **403 `no_changes_left`**; değilse yazar ve `used += 1`, çapa = yeni. İçerik doğrulaması (isim boş olamaz, ≤ 40, tarih geçerli) → 422. Yeni tarih arşiv tarihini geçmişe atıyorsa 422 `date_archives_site` ("This date is more than 12 months ago. Your website would close right away."). Arşivde 403 `archived`. |
| Yazma atomikliği | İçerik + hak sayacı + çapa + günlük **tek koşullu yazmada** (`expectedUpdatedAt`; blob'da ETag, ileride Postgres koşullu UPDATE). Aynı anda iki istek son hakkı harcayamaz: ikincisi 409 alır, yeniden okur, 403 görür. |
| `publishSite` (`lib/sites.ts`) | İlk yayında: `firstPublishedAt = now`, `identity = {anchor: identityOf(content), used: 0, limit: 3, granted: 0, log:[first_publish]}`. Sonraki yayınlarda savunma: `identityOf(content)` saklı kimlikten farklıysa 409 `identity_mismatch` (PUT kuralı varken olmamalı). |
| Arşiv kapısı | §11.9: bütün yazma uçları (PUT, photo, publish, unpublish, identity, RSVP silme/held) `403 archived`; genel sayfalar 410; RSVP gönderimi kapalı. |
| Destek aracı | `scripts/grant-identity-change.ts --order <no> \| --slug <s> --add <n> --reason "<metin>"` → `granted += n`, günlüğe `grant`. `--archive-on <YYYY-MM-DD>` destek uzatması (`archiveOverrideAt`). Düz anahtar gerekmez; `reissue-edit-key.ts` gibi yalnız operatör. |

### 11.6 Kimlik değişikliği arayüzü (yayından sonra)
Names veya Date & time sayfasında kilitli değerin yanında **Change** → `IdentityChangeSheet` (isimler + tarih birlikte, dokunulan alan odakta).
Sheet'in altındaki satır, yazdıkça aynı saf fonksiyonla sınıfı gösterir; birincil düğmenin metni ne olacağını söyler:

| Sınıf | Bilgi satırı | Birincil düğme |
|---|---|---|
| unchanged | "Make your change above." | (pasif) "Save" |
| typo | `circle-check-big` "Small fix — free. You still have 3 changes left." | "Save fix" |
| change, kalan ≥ 2 | `info` "This uses 1 of your 3 changes. You'll have 2 left." | "Use 1 change" |
| change, kalan 1 | `triangle-alert` "This is your last change. After this, only small typo fixes are possible." | "Use my last change" |
| change, kalan 0 | `lock` §11.8 metni | (pasif) — "Undo my edits" ikincil |

Ayrı bir onay penceresi yoktur: düğmenin metni onaydır. Başarıda snackbar: "Names changed. 2 changes left." (+ "Publish" eylemi, site yayındaysa).

### 11.7 Kalan hakkın gösterimi
- **Yayından önce** (sihirbaz 1–2. adım, Names/Date sayfası yardım satırı): "You can change these freely until you publish. After that, you
  can change your names or wedding date 3 times — fixing a small typo is free."
- **İlk yayın öncesi kurallar kutusu** (sihirbaz 6. adım ve editörden ilk Publish'in sheet'i — **her ilk yayın yolu** bunu gösterir):
  > **Good to know before you publish**
  > - After you publish, you can change your names and wedding date **3 times**. Fixing a small typo (up to 2 letters or digits) is free.
  > - Everything else — time, venue, schedule, story, photos, details and replies — you can change as often as you like.
  > - Your website stays online until **June 12, 2028**, 12 months after your wedding. Then it becomes a read-only archive.
- **Yayından sonra:** Edit listesinde Names ve Date & time satırında `lock` + "3 changes left"; Home'da `RightsMeter` kartı
  ("Names & date · 2 of 3 changes left", 3 nokta, dolu = kalan) + "How changes work" (HelpSheet'in ilgili bölümü).
  Destek eki varsa "3 of 4 changes left" (limit + granted). Ekran okuyucu metni: "2 of 3 name and date changes left".

### 11.8 Hak 0 olunca
- Kimlik alanları kilitli kalır; **yazım düzeltmesi (≤ 2) yine bedava** ve yapılabilir.
- Diğer bütün düzenleme, yayın ve RSVP normal; site yayında kalır.
- Metin: "You've used all 3 name and date changes. Small typo fixes (up to 2 letters or digits) are still free. If your wedding moved or
  something else needs to change, contact us at [SUPPORT EMAIL] or message [SHOP NAME] on Etsy with your order number."
- Destek kontrol edip (ör. gerçek erteleme) `grant-identity-change.ts` ile hak ekler. Destek süresi/politikası kullanıcı kararıdır, yazılmaz.

### 11.9 Arşiv (düğünden 12 ay sonra)
- **Arşiv anı:** `date + 12 ay` gününün **ertesi günü 00:00**, sitenin saat diliminde (`timezone`; geçersizse UTC). Ay sonu kırpılır
  (2028-02-29 düğün → 2029-02-28 son gün → 2029-03-01 arşiv). "Online until" = o son gün. `archiveOverrideAt` varsa o.
  Tarih kaynağı: sayılmış/geçerli kimliğin tarihi (= taslak = yayın).
- **Barındırma tavanı (öneri, karar gerekir):** arşiv anı en geç `firstPublishedAt + 48 ay` — bedava tarih düzeltmeleriyle yıl kaydırıp
  süresiz barındırmayı sınırlar. Kullanıcı kabul etmezse kaldırılır.
- **Arşivde panel:** üst bant "Your website was archived on June 13, 2028. You can still see your content and download your replies."
  Alanlar okunur metin (seçilebilir, `disabled` değil); Guests listesi ve CSV indirme açık; Publish, düzenleme, foto, kimlik, silme kapalı.
- **Arşivde genel adres:** 410 + platformun sade sayfası "This wedding website has been archived." (isim yok, `noindex`); foto, `.ics`
  ve RSVP 410/kapalı. Kararı gerekenler (§15): genel sayfa tamamen kapanmalı mı yoksa salt okunur görünür mü kalmalı; arşivdeki verinin
  ne zaman silineceği (gizlilik metniyle).
- **Arşivden önce:** 30 gün kala Home'da bilgi kartı: "Your website goes into archive on June 13, 2028. Download your replies before then
  if you want a copy." (E-posta hatırlatması sağlayıcı gelince.)

### 11.10 Veri modeli (site kaydına eklenenler; hepsi isteğe bağlı, eski kayıtlar okunur)
```ts
interface SiteRecord {
  // … mevcut alanlar
  firstPublishedAt?: string | null;           // ilk başarılı yayın; hiç silinmez
  identity?: {
    anchor: Identity;                          // sayılan son kimlik (normalleştirilmemiş saklanır, karşılaştırmada normalleştirilir)
    limit: number;                             // 3 (IDENTITY_CHANGE_LIMIT)
    granted: number;                           // destek ekleri
    used: number;
    log: Array<{ at: string; kind: 'first_publish' | 'typo' | 'change' | 'grant'; to?: Identity; by: 'buyer' | 'support'; note?: string }>; // son 50
  } | null;
  archiveOverrideAt?: string | null;           // destek uzatması
}
interface Identity { names: { display: string; full: string }[]; shown: string; initials: string; date: string }
```
- **Göç:** `identity` olmayan ama `publishedAt` olan kayıt (canlı demo, testler) ilk okunuşta: `firstPublishedAt = publishedAt`, çapa =
  `publishedContent` kimliği, `used = 0` — ilk yazmada kalıcı olur.
- **Panel durumu (`GET`):** `rights: {phase: 'before_publish'|'counting'|'archived', limit, granted, used, remaining, anchor, firstPublishedAt,
  onlineUntil, archiveAt, archived}` — `anchor` istemcinin canlı sınıflandırması içindir (kendi sitesinin verisi, sızıntı değil).
- Günlük kişisel veri içerir; siteyle birlikte silinir.

### 11.11 Tehdit tablosu
| Kötüye kullanım | Önlem | Kalan risk |
|---|---|---|
| Aynı siteyi başka çifte uyarlamak (isim/tarih) | 3 hak + çapa kuralı | kısa isimlerde ≤ 2 karakter (kabul) |
| Taslakta isim değiştirip önizleme linkini paylaşmak | Yayından sonra PUT kimliği korur; önizlemede RSVP çalışmaz (var) | — |
| Hiç yayınlamadan önizlemeyi site gibi kullanmak | Önizleme RSVP almaz (var). **Öneri:** panel dışında açılan önizlemede platform şeridi "Preview — not published" (`Sec-Fetch-Dest: iframe` ise gizli; `frame-ancestors 'self'` başka çerçeveyi engeller) | yayınlanmamış taslak temizliği yok (README açık konu) |
| Yeni site açmak | sipariş başına tek site | Etsy sipariş doğrulaması kapalı (satış öncesi şart, README) |
| Adresi (slug) değiştirmek | slug sabit (var); adres ilk çiftin adlarını taşır | — |
| Serbest metinlere başka isim yazmak (story, host line) | zarf, başlık, `og:title`, davet kartı kimlikten gelir | kabul |
| Tarihi kaydırıp süresiz barındırma | arşiv tarihi + tavan önerisi | — |
| Düzenleme linkini paylaşmak | engellenemez; Share'de uyarı | — |
| **Şifreli site (G076):** şifresiz görmek — sayfa, doğrudan `/media/<id>`, `.ics`, RSVP POST/durum | her misafir rotası siteye özel çerez ister: sayfa = şifre sayfası, foto 401, `.ics` 303 → şifre sayfası, RSVP 401 (saklanmaz); arşiv 410 ve yayında olmayan 404 önce | şifre açılmadan önce CDN'deki foto ≤ 5 dk |
| G076: başka sitenin çerezi, sahte/uzatılmış çerez, şifre değişince eski misafir | `__Host-` çerez = HMAC(site sırrı; site id + sürüm + süre), 90 gün; şifre değişince sürüm +1 → eski çerezler geçersiz | — |
| G076: kaba kuvvet / zamanlama | yalnız yanlışlar sayılır: IP+site 10/15 dk, IP 30/15 dk, doluyken doğru şifre de 429; paylaşımlı sayaç (blob); SHA-256 + `timingSafeEqual` | kısa şifre + çok IP (öneri ~830 bin olasılık) |
| G076: CDN'in korumalı yanıtı başkasına vermesi | `private, no-store` + `Vary: Cookie` (foto `private, max-age=300`) | — |
| G076: açık yönlendirme / başka sitenin denemeleri harcaması | form aynı adrese, `Location` denetlenmiş slug'dan göreli, `next` yok; `Sec-Fetch-Site: cross-site` → 403, SameSite=Lax | başlık göndermeyen eski tarayıcı |
| G076: bağlantı önizlemesi / arama motoru | şifre sayfası ve açık sayfalarda meta = isimler + "You're invited"; `noindex`; site haritasında çift sitesi yok | — |

---

## 12. E-posta ile giriş (magic link) — isteğe bağlı, sağlayıcı yokken kapalı

### 12.1 Arayüz
- **Nerede:** geçersiz link sayfası (`/edit/...` 404: "Lost your edit link?"), Share → "Sign in by email" kartı, `/signin` sayfası.
- **Kapalıyken (varsayılan, `SignInMailer.enabled === false`):** form **gösterilmez**; tek dürüst metin:
  "Email sign-in isn't available yet. Open your editor with the edit link you saved. Lost it? Message [SHOP NAME] on Etsy with your order
  number." Share kartında durum satırı: "Sign in by email · Not available yet".
- **Açıkken:** e-posta alanı + "Email me a sign-in link". Her durumda aynı yanıt: "If this email has a website with us, we've sent a link.
  It works for 15 minutes." (hesap varlığı sızmaz). Link → `/signin/confirm?t=…` **ara sayfası**: "Open my editor" düğmesi (POST ile
  token harcanır; e-posta tarayıcılarının ön yüklemesi linki yakmaz) → oturum → `/edit/<slug>`. Birden çok site → seçim listesi.
  Süresi dolmuş/kullanılmış: "This sign-in link has expired. [Send a new link]".

### 12.2 Sunucu
- `lib/claim/mailer.ts` deseniyle `SignInMailer` + `DisabledSignInMailer` (varsayılan); `setSignInMailer()`; gönderim hatası log'a link yazmaz.
- `POST /api/signin {email}` → her zaman 202; IP başına ve e-posta hash'i başına hız sınırı (ör. 3/saat; değer uygulamada).
- Token: 32 rastgele bayt, yalnız SHA-256 saklanır, 15 dk, tek kullanım.
- Oturum: `__Host-panel` çerezi (HttpOnly, Secure, SameSite=Lax, Path=/, 30 gün), saklanan yalnız hash; site kimliğine bağlı.
  Panel API çerezi Bearer anahtara **alternatif** kabul eder; çerezle gelen yazma isteklerinde `Origin` kontrolü + özel başlık
  (`X-Panel-Request: 1`) → CSRF yok. "Sign out" ve düzenleme linki yenilenince oturumlar düşer.
- E-posta → site dizini (`owners/<sha256(email)>.json`) gerekir: adaptör değişikliği (§13.2).
- Düzenleme linki birincil erişim olarak kalır.

---

## 13. Uygulama notları

### 13.1 Aşamalar
| Aşama | İş | Ölçüt |
|---|---|---|
| A | `lib/panel/rights.ts` (normalleştirme, uzaklık, sınıflandırma, arşiv tarihi) + sunucu zorlaması + destek aracı | §14 A–B birim/API testleri |
| B | Tokenlar, `AppBar`/`BottomNav`/görünümler, bölüm sayfaları, Home/Guests/Share | §14 D |
| C | Sihirbaz | §14 C |
| D | Durumlar: yerel yedek, çevrimdışı, hata eşlemesi | §14 E |
| E | Magic link arayüzü (kapalı) + `SignInMailer` arayüzü | §14 G |
| F | Playwright 390 px yolculuk + MP4 → `platform/previews/g060/`; README + docs/10 güncellemesi | §14 H |

### 13.2 Görev yazma alanı dışında kalan değişiklikler (entegratöre)
G060'ın `yazar:` listesi `lib/data/`, `lib/site/`, `lib/rsvp/`, `platform/scripts/` ve `package.json`'u kapsamıyor. Gerekenler:
`SiteRecord` alanları + adaptörde koşullu kimlik yazımı (`lib/data/types.ts`, `local/`, `blob/`); arşiv kapısı (`lib/site/render.ts`,
`static.ts`, `ics.ts`, `lib/rsvp/`); `scripts/grant-identity-change.ts`; magic link sayfa/uçları (`app/signin/`, `app/api/signin/`) ve
**`signin` adının ayrılmış slug listesine** eklenmesi (`lib/slug.ts`; yoksa bir çift `/signin` adresini alabilir); `lucide-react@1.46.0`
ve test için `axe-core@4.13.0` (devDependency, MPL-2.0, 2026-08-05) — entegratör ya listeyi genişletir ya da alt görev açar.

### 13.3 Tek yapılandırma
`[BRAND]`, `[SHOP NAME]`, `[SUPPORT EMAIL]` panelde ayrı kopya tutulmaz; G061'in satış sitesi için kurduğu tek marka yapılandırmasından
okunur (dosya adı G061'de netleşir). Değer yoksa yer tutucu görünür kalır (uydurulmaz). `IDENTITY_CHANGE_LIMIT = 3`,
`ARCHIVE_AFTER_MONTHS = 12`, `ARCHIVE_MAX_AFTER_FIRST_PUBLISH_MONTHS = 48` (öneri) aynı yerde ya da `lib/panel/rights.ts`'te sabit.

### 13.4 Takip edilecek belgeler
Uygulama bitince: `platform/README.md` panel bölümü, `docs/10` §1 adım 3, START HERE (01/03, G059 → etsy-metin: §11.7 metni ve sihirbaz
adımlarına göre), ilan metni (hak ve arşiv cümleleri §11.7'den, aynen).

---

## 14. Kabul testleri

**A. Hak kuralı (node:test, `tests/g060-rights.test.ts`)**
1. §11.3 tablosunun her satırı beklenen sınıfı verir.
2. Normalleştirme: NFC/NFD aynı, görünmez/bidi karakter ve boşluk farkı `unchanged`; ayraç (`&`/`and`/`+`) farkı `unchanged`.
3. Çapa kuralı: art arda bedava düzeltmeler çapadan > 2 sapınca `change` olur.
4. İsim sayısı 1 → 2 `change`.
5. Arşiv tarihi: saat dilimi sınırı (New York 23:59 → arşiv değil, 00:00 → arşiv), 29 Şubat, `archiveOverrideAt`, 48 ay tavanı (açıksa).

**B. Sunucu zorlaması (node:test, local + sahte blob)**
6. Yayından önce PUT isimleri/tarihi serbest değiştirir; `identity` yok.
7. İlk yayın `firstPublishedAt` + çapa + `used 0` yazar; unpublish/yeniden yayın bunları değiştirmez.
8. Yayından sonra PUT ile gelen isim/tarih saklanmaz; yanıt `identityKept: true` ve saklı kimlik; diğer alanlar kaydedilir.
9. Identity: typo → yazılır, `used` aynı; change + `intent:'fix'` → 409 `confirm_required`; change + `intent:'change'` → `used+1`, çapa yeni.
10. 3 değişiklikten sonra 4.: 403 `no_changes_left`, içerik değişmez; typo hâlâ 200.
11. Eşzamanlı iki "change" isteği, kalan 1: tam olarak biri başarılı, diğeri 409 → yeniden denemede 403; `used` = limit.
12. Destek aracı `--add 1` → kalan 1; günlükte `grant`.
13. Yeni tarih siteyi hemen arşive atacaksa 422 `date_archives_site`.
14. Arşiv: PUT/photo/publish/unpublish/identity/RSVP silme → 403 `archived`; GET okunur durum + `rights.archived`; CSV indirilebilir;
    genel sayfalar, foto ve `.ics` 410; misafir RSVP kapalı.
15. Göç: `identity`'siz yayınlanmış kayıt doğru çapa ve `used 0` ile okunur.
16. Önizleme anahtarı ve yanlış anahtar identity ucunda 401 (bugünkü yetki kuralı).

**C. Sihirbaz (Playwright, 390 × 844, mobil, `tests/g060-browser.ts`)**
17. `/start` → Open my editor → `#setup/1`; isimler dolu; Continue ile 6 adım; Back veri kaybetmez; Android geri = önceki adım.
18. Yenileme ve ikinci bağlamdan açılış doğru adıma döner (içerikten türetme).
19. Photos adımında yükleme + kırpma; ilerleme görünür.
20. Preview adımı "Still sample text" maddeleri ilgili bölüme götürür ve geri döner.
21. Publish adımı kurallar kutusunu (3 değişiklik, typo, online until tarihi) gösterir; yayın sonrası başarı ekranı, link, QR çözülür.
22. Sihirbaz atlanıp editörden yapılan **ilk** Publish de kurallar kutusunu gösterir.

**D. Editör**
23. Alt gezinme 4 sekme; her görünümde `h1`'e odak; hash değişir; geri hareketi önceki görünüm.
24. Aç/kapa anahtarları yalnız ilgili bölümde (ayrı "Optional sections" yok); kapalı sayfa önizleme sekmesinde yok.
25. Yayından sonra Names/Date kilitli + "3 changes left"; sheet'te typo → "Save fix", change → "Use 1 change"; sayaç 2'ye iner, Home kartı aynı.
26. Hak 0: sheet §11.8 metni ve destek yer tutucuları; typo hâlâ yapılabilir.
27. Liste satırı kaldır → Undo geri getirir; yanıt silme onay ister.
28. Guests: sayılar, süzgeç, arama, CSV; yayın yokken boş durum.
29. Share: link kopyalama, QR, düzenleme linki uyarısı, "Take offline" onayı.
30. Masaüstü 1280: üç sütun, önizleme yapışkan; 960: iki sütun.

**E. Durumlar**
31. Çevrimdışı (Playwright `setOffline`): bant görünür; Publish/foto/kimlik devre dışı; düzenleme yerel yedeğe yazılır; çevrimiçi olunca kaydedilir.
32. Kapatıp açınca yedek "Restore" teklif edilir; sunucu sürümü farklıysa önerilmez.
33. 409 çakışma bandı ve Reload; 401 tam ekran metni; 413/415 foto kartında satır içi.

**F. Erişilebilirlik**
34. `axe-core@4.13.0` her görünümde (setup 1–6, home, edit, bölüm sayfaları, guests, share, sheet'ler, arşiv): ciddi/kritik ihlal 0.
35. Dokunma hedefleri ≥ 44 × 44 px (görünür bütün etkileşimli öğeler ölçülür).
36. Tab sırası mantıklı; odaklı öğe yapışkan çubukların altında kalmaz; sheet odak tuzağı ve dönüş.
37. Token kontrastları birim testinde (§8.1 değerleri; metin ≥ 4.5, kontrol çerçevesi ≥ 3).
38. 320 px genişlik ve %200 metin: yatay kaydırma yok.
39. `prefers-reduced-motion`: geçişlerde dönüşüm yok.

**G. Magic link**
40. Varsayılan (kapalı): form yok, dürüst metin üç yerde; `POST /api/signin` 404 ya da 503 `unavailable` (uygulamada seçilir), e-posta gönderilmez.
41. Sahte mailer ile: 202 tek tip yanıt (kayıtlı/kayıtsız e-posta aynı), ara sayfa, tek kullanım, 15 dk, oturum çerezi panel API'sini açar,
    çerezli yazmada `Origin`/başlık yoksa 403; link log'a yazılmaz.

**H. Gerileme ve teslim**
42. `npm test`, `npm run typecheck`, `npm run build` (+ trace-check) geçer; `panel-browser.ts`, `final-smoke.ts --theme blush-garden-rose`
    ve `--theme olive-ivory` v2 akışına uyarlanmış hâlde geçer.
43. `platform/previews/g060/`: 390 px ekran görüntüleri (her sihirbaz adımı, Home, Edit, bir bölüm, kimlik sheet'i 3 hâli, Guests, Share,
    çevrimdışı, arşiv) + yolculuk MP4'ü + `checks.json`.
44. Gerçek telefonda deneme yapılmadıysa README ve görev Sonuç'u bunu açıkça yazar.

---

## 15. Açık kararlar (kullanıcı)

| # | Karar | Öneri |
|---|---|---|
| 1 | Arşivde genel adres: tamamen kapalı (410 + sade sayfa) mı, salt okunur görünür mü? | 410 + sade sayfa (K25 "12 ay yayında") |
| 2 | Arşivden sonra veri (içerik, foto, yanıt) ne zaman silinir? | 90 gün sonra; gizlilik metniyle birlikte karar |
| 3 | Barındırma tavanı (`firstPublishedAt + 48 ay`) | kabul |
| 4 | Destek kanalı ve hak ekleme politikası | `[SUPPORT EMAIL]` açılınca; ertelemede 1 hak |
| 5 | Panel dışı önizlemede "Preview — not published" şeridi | kabul |
| 6 | Şifreli site (misafir parolası) — rakiplerde var | K28 → G076'da yapıldı (isteğe bağlı, varsayılan kapalı; `platform/README.md` "Site şifresi") |
| 7 | Karanlık mod | v2 dışında |
| 8 | Adres (slug) ilk yayından önce bir kez değiştirilebilsin mi? | v2 dışında (adaptör + `/start` değişikliği) |

## 16. Kaynaklar (arama sonuçları; sayfalar bu ortamdan açılamadı)

- The Knot yardım merkezi: [mobil uygulamada site yönetimi](https://helpcenter.theknot.com/hc/en-us/articles/360042695012-I-need-to-manage-my-wedding-website-on-the-app-what-features-can-I-access-without-going-to-desktop),
  [yayından sonra düzenleme](https://helpcenter.theknot.com/hc/en-us/articles/9605029230484-Will-I-be-able-to-edit-my-Wedding-Website-after-I-publish-and-share-it-with-my-guests),
  [siteyi özelleştirme](https://helpcenter.theknot.com/hc/en-us/articles/49532302686740-How-do-I-customize-my-Wedding-Website)
- Joy: [Joy 101](https://withjoy.com/help/en/articles/8309436-joy-101), [SSS](https://withjoy.com/faq/), [tarih değiştirme](https://help.withjoy.com/?p=4327)
- Wedsites: [yayınlama](https://help.wedsites.com/en/articles/14455939-publishing-your-wedding-website), [parola](https://docs.wedsites.com/site/site-faqs/how-do-i-password-protect-my-website)
- Etsy/Corjl erişim süreleri (dükkân açıklamaları): [CreateMeAPrint](https://www.etsy.com/shop/CreateMeAPrint), [InAPicklePrintables](https://www.etsy.com/shop/InAPicklePrintables), [PaperPassionDesigns](https://www.etsy.com/shop/PaperPassionDesigns)
- Kayıt durumları: [pattern-playground saving](https://pattern-playground.onrender.com/patterns/saving), [saving indicators](https://www.techinterview.org/post/3233475354/frontend-real-time-ux-liveness-activity-saving/), [SaaS autosave](https://www.saasui.design/blog/saas-autosave-save-states-ux-patterns), [GitLab tasarım tartışması](https://gitlab.com/gitlab-org/gitlab-design/issues/121)
- Sihirbaz: [Visa design system wizard](https://design.visa.com/patterns/wizard/usage/), [accessible multi-step forms](https://ezud.com/accessible-multi-step-wizard-forms/)
- Alt sayfa: [bottom sheet vs modal](https://www.dolfy.ai/blog/bottom-sheet-or-modal-mobile-interruption-pattern), [bottom sheet UI](https://www.eleken.co/blog-posts/bottom-sheet-ui)
- Magic link: [LoginRadius](https://www.loginradius.com/glossary/magic-link), [Zoho ZeptoMail](https://www.zoho.com/zeptomail/articles/magic-links.html), [WIP tartışması](https://wip.co/posts/what-are-some-of-the-best-practices-for-implementing-magic-links-jqtu55)
- Pazar verisi: `docs/13_ETSY_ARASTIRMA.md`

## G100 (2026-10-16) — Refero P1 sadeleştirme
Kurulum 1. adım yalnız iki ad + tarih/saat (hak notu tek satır + "Learn more", `rightsOneLine()`); yayın başarı ekranı
`Published.tsx` (link + Copy/Share/Open önde, QR "More ways to share" altında, 2–3 isteğe bağlı sonraki adım); alan başına "Sample"
rozeti yerine sayfa başında "N fields still show sample text · Go to the first one" (örnek alan soluk/italik); Guests iki görünüm:
**Guest list** (sayılar → arama → All · Coming · Not coming · New → liste) ve **Results** (`#guests/results`: kapanış günü, dağılım,
soru başına sayı + yüzde, yiyecek/alerji notları). Ayrıntı ve ekranlar: `gorevler/G100-panel-sadelestirme.md`, `platform/previews/g100/`.

## G121 (2026-10-16) — Refero P2'ler ve docs/19 §6 kalanları
- **Kurulum:** 2. adım yalnız açılış fotoğrafı; öteki yerler "Your website has N more photo places. Add them any time under Edit →
  Photos…" satırıyla Edit → Photos'a bırakıldı ("More photos" katlaması kurulumdan kalktı). "Skip for now" artık altta küçük link değil,
  **Continue'nun yanında aynı ağırlıkta ikincil düğme** (telefonda Back ok, Skip ve Continue eşit). 3. adım: kayıt simgesinin yanında
  tek cümle "Guests can open your website with the link. You can keep editing after." (adım yardımı "Check it once, then publish.").
  `OrderPendingNote` sonuna "Reload this page to check." (docs/19 C3; süre `[ORDER CHECK TIME]` karar bekliyor).
- **Home:** durum kartı sakin tek etiket + yanında doğrudan eylem ("Live" · Share; uzun eylem — "Continue setup · Step n of 3" — kendi
  satırında), cümle 17 px; **çubuk Home'da "Live"ı tekrar etmez** (öteki görünümlerde eder). İsim başlığı küçüldü (34–54 → 28–40 px).
  Yeni **Settings** kartı (değer satırları): Time zone → Day & place "More options" açık + alan odakta (yeni `PanelContext.jump`),
  Date style → aynı yer, Name & date changes left ("3 (free until you publish)" / "2 of 3") → Help'in kural bölümü, Guest password
  (On/Off) → Share.
- **Şerit ve kayıt:** "Unpublished changes" şeridi yalnız taslak canlıdan gerçekten farklıyken (sunucunun bayrağı ya da panelin kendi
  karşılaştırması); yalnız kaydın sürmesi şeridi getirmez, eski metne dönülünce şerit kendiliğinden kalkar. Otomatik kayıt bitince
  "Saved" ~2,5 sn yazıyla (telefonda da) ve yeşil `CloudCheck` ile görünür, sonra sessiz bulut. **Review:** değişen her sayfanın yanında
  göz düğmesi → o sayfanın önizlemesi (sheet kapanır; tarihçe girdisi sırasıyla).
- **Share:** ilk ekranda link + Copy/Open/Share; QR "QR code for printed cards" adıyla **katlı** (şifre ve düzenleme linki gibi);
  "Take the website offline" en altta tehlike görünümünde (değişmedi).
- **Metinler:** Help "Can my partner edit too?" → "(Share → Your private edit link → Copy edit link)" (C1); Guests boş durumu sonuna
  "New replies show here; we don’t send email notifications yet." (C6).
- **Tasarımın kendi açılışı** (koordinatör eki): önizlemenin ilk sekmesi her tasarımda "Envelope" değil, tasarımın açılış nesnesi —
  Envelope (14 tasarım) · Gatefold (06, 14) · Pouch (09) · Wallet (12) · Book (13) · Sleeve (18); satış kopyası olmayan tasarımda
  "Opening". Kaynak `lib/marketing/designs.ts` `openingObject` (sunucuda, `panelTheme` → `PanelTheme.opening`); aynı ad "Change names
  or date" ve "How your names appear" ipuçlarında, teşekkür modu metninde, kurulum 1. adımın önizleme adında ve Headings & labels satır
  etiketlerinde ("Above your names on the book", "Open the book again (book page)").
- Bilinçli olarak yapılmayan: "Headings & labels on this page" → "Advanced: change headings & labels" adı (P2): bölüm zaten kapalı
  açılır; ad START HERE rehberlerinde, docs/19 Ek A'da ve Review satırlarında ("Us · Headings & labels") geçtiği için değiştirilmedi —
  karar koordinatörün. Ayrıntı: `gorevler/G121-panel-satis-kalanlar.md`, ekranlar `platform/previews/g121/`.

## G089 (2026-10-16) — mikro etkileşimler (K31)
Yalnız görsel katman; panel mantığına, alanlara ve etiketlere dokunulmadı. `platform/components/fx/panel-fx.css` (global, panelin mevcut
`data-panel`, `data-disclosure`, `data-save-flash`, `data-setup-done`, `data-preview` özniteliklerine bağlı; `app/edit/[slug]/page.tsx`
içe aktarır): görünüm değişince içerik yumuşakça gelir (yalnız opaklık: yapışkan çubuklar oynamaz), düğmelerde daha belirgin basma,
açılır bölümler aşağı doğru açılır, "Saved" bulut işareti zıplar, hazır olma çubuğu soldan dolar, önizleme yüklenirken sayfa biçimli
iskelet + ışık bandı (`data-fx-skeleton`, PreviewPane'de tek öznitelik) ve sayfa yüklenince yumuşak geçiş, "Your website is live"
ekranında onay işareti + bir kez marka renkli kâğıt patlaması (`components/fx/Celebrate.tsx`, Setup.tsx'te tek satır). Admin:
`components/fx/admin-fx.css` (sayfa yumuşak açılır, site kartları sırayla gelir, imleçle hafif kalkar). Hepsi `prefers-reduced-motion`'da
kapalı. Ekranlar `platform/previews/g089/`.

