# Site platformu — kendi sitemiz + düzenleme paneli (K24, 2026-10-13)

Kullanıcı kararı K24: teslim Canva değil. Alıcı, kendi sitesini **bizim platformumuzda** bir panelden
düzenler. Bu belge platformun tek kaynağıdır.

## 1. Alıcı akışı
1. Etsy'den bir tasarım (tema) satın alır. İndirdiği kısa PDF'te **başlat linki** var: `/start?theme=<tema>`.
2. `/start`: Etsy sipariş numarası + e-posta → taslak site oluşur → **düzenleme linki** verilir
   (gizli anahtarlı, şifresiz). Link e-postayla gönderilir (e-posta sağlayıcısı sonra; ilk sürümde ekranda gösterilir + "kaydet" uyarısı).
   **G146:** link şart değil — her cihazda `/my` ("Create your website") → aynı sipariş no + e-posta → editör açılır (§3a).
3. Panel (`/edit/<slug>?k=<anahtar>`), telefonda rahat (Panel v2, G060, tasarım `docs/16_PANEL_V2.md`): ilk açılışta
   6 adımlı **kurulum sihirbazı** (isimler → tarih/saat → mekân → fotoğraflar (kırpma) → kontrol → yayınla), sonra
   **Home · Edit · Guests · Share** görünümleri: bölüm bölüm düzenleme (isimler, tarih, mekân, program, hikâye, detaylar,
   SSS, RSVP, fotoğraflar), canlı önizleme, otomatik kayıt göstergesi, çevrimdışı yerel yedek. **Yayınla.**
   - **Düzenleme hakkı (G060, sunucuda zorlanır):** ilk yayından sonra **isimler ve tarih** (kimlik alanları) toplamda
     sınırlı sayıda değişir (varsayılan 3, bir kayıtta birlikte değişenler 1 sayılır; panelde "2 of 3 changes left"). Ücretsiz
     (G060-fix): isim alanında ≤ 2 karakterlik yazım düzeltmesi, **tarihi en çok 7 gün kaydırmak** (tarih karakterle değil günle
     ölçülür), **soyadı eklemek/çıkarmak** (ilk isim aynıyken), son değişikliği hemen **geri almak** (yayınlanmadan önce ya da
     10 dk içinde; hak geri verilir), tasarımın örnek tarihiyle yayınlanmış sitede gerçek tarihi bir kez girmek. İlk yayın, tarih
     hâlâ örnek tarihken onay ister. Diğer her şey sınırsız. Hak bitince panel destek mesajı gösterir; destek
     `scripts/grant-identity-change.ts` ile hak ekleyebilir (kayıt site günlüğünde). Sayılar tek yapılandırmadan gelir
     (`lib/marketing/config.ts` `editRights`: 3 / 2 karakter / 7 gün).
   - **Önizleme (G060-fix):** panel kendi önizlemesini kısa ömürlü imzalı jetonla açar (~12 saat, panel yeniler); kalıcı
     önizleme anahtarı panele hiç gönderilmez. Kalıcı anahtarla açılan önizlemede sunucu "Preview — not published" şeridi
     basar; arşivlenmiş sitede ve hiç yayınlanmamış taslakta oluşturulmasından 18 ay sonra 410. Önizleme linki gerçek sitenin
     yerine (süresiz, sınırsız isim değişikliğiyle) kullanılamaz.
   - **Arşiv (K25):** site düğün tarihinden **12 ay** sonra (site saat diliminde ertesi gün 00:00) salt okunur arşive geçer:
     misafir sayfaları 410, RSVP kapalı, panel okunur, yanıtlar CSV olarak indirilebilir. Öneri (karar bekliyor, docs/16 §15):
     en geç ilk yayından 48 ay sonra. Arşivde verinin silinmesi henüz yok.
   - **E-posta ile giriş (magic link):** arayüz notu var, e-posta sağlayıcısı olmadığı için **kapalı** (`/signin` dürüst metin,
     `POST /api/signin` → 503). G146'dan beri asıl giriş yolu **sipariş no + e-posta** (§3a); `/signin` oraya yönlendirir.
4. Site: `/<slug>` = kapalı zarf açılış sayfası → `/<slug>/home` → `/story`, `/details`, `/rsvp`.
5. Misafir RSVP gönderir → çift yanıtları panelde (Guests) görür, CSV indirir.
6. **Dükkân tarafı (G087, K30):** `/admin` — onay bekleyen siparişler (Yapılacak), siparişi onayla, yeni düzenleme linki,
   isim/tarih hakkı, yayında kalma tarihi, yayından kaldır, sil, hazır Etsy mesajları. Ayrıntı `docs/17_ADMIN_PANELI.md`.

## 2. Mimari
- `platform/` — Next.js (App Router) uygulaması; Vercel'e uygun.
- **Tema = statik HTML şablonları + CSS + JS + görseller** (`platform/themes/<tema>/`). Tema sayfaları
  `data-field="yol"` işaretleri taşır; platform sunucuda içerik JSON'unu (`content.demo.json` şeması)
  güvenli biçimde (HTML kaçışlı) yerleştirir. Böylece 20 tema React'e çevrilmeden üretilir.
- Koreografi (sıra/süre) temanın `site.js` başındaki ayar nesnesinde; içerikten ayrı.
- Tema şablonları ve `theme.json` sunucuda diskten okunur (işlev paketlerinde yalnız `*.html`/`*.json`); tema CSS/JS/görselleri
  **statik dosyadır** (G159): build `public/themes/`'e kopyalar, Vercel CDN `/themes/<id>/…`'den verir (aşağıda 2c "Yayın notu").
- **Veri katmanı adaptörlü:** `local` (geliştirme/test: `platform/.data/` JSON + yerel yükleme klasörü) ve
  `supabase` (canlı: Postgres + Storage). Kod adaptör arayüzüne yazılır.
- Tablolar: `sites` (id, slug, theme, variant, status draft/published, content jsonb (panel taslağı),
  published_content jsonb (ziyaretçinin gördüğü son yayın), edit_key_hash, preview_key_hash (düzenleme anahtarından HMAC;
  önizleme linki düzenleme yetkisi vermez), order_ref, owner_email, published_at, timestamps), `rsvps` (id, site_id, name, email, attending, guests, message, created_at).
- Güvenlik: düzenleme anahtarı yalnız hash olarak saklanır; RSVP'de honeypot + hız sınırı; yüklemelerde
  tür/boyut sınırı; misafir verisi yalnız çiftin panelinde.

## 2b. Uygulanan (G037, 2026-10-13)
- `platform/`: Next.js 16 + cheerio şablon motoru; işaretler `data-field`, `data-photo`, `data-optional`, `data-url`,
  ayrıca `data-repeat`, `data-if`, `data-text`, izinli `data-attr-*` (ayrıntı `platform/README.md`). Satır içi tema betikleri CSP hash'li.
- Doğrulama: platform sitelerinde `urls.website` ve `urls.rsvp_form` boş olabilir (site ve RSVP platformun kendisi) — bu uyarılar
  platform kayıtları için kapatılır (G039).

## 2c. Canlı veri — ilk sürüm (kullanıcı, 2026-10-13: "Supabase olmasa şimdilik olmaz mı?")
- İlk sürüm **Supabase'siz**: veri ve fotoğraflar Vercel'in kendi depolamasında (Vercel Blob) — `blob` adaptörü (G048).
  Site kaydı `sites/<id>.json` + `slugs/<slug>.json` + `orders/<sipariş>.json` dizinleri; her RSVP ayrı dosya
  (`rsvps/<site>/<zaman>-<sıra>-<id>.json`, yazma çakışması yok); fotoğraflar `media/<site>/...`. Düşük hacim için yeterli.
  Depo **private** açılmalı (site kaydı ve misafir verisi); fotoğraflar ziyaretçiye platformun `/media/...` rotasından gider.
  Adaptör sahte (bellek içi) Blob ile ve **G044'te gerçek private depoda** test edildi (aşağıda).
- Satış hacmi artınca Supabase/Postgres adaptörü (G043) ile değiştirilir; adaptör arayüzü aynı kalır.
- **Canlı (G044, 2026-10-13, local oturum `claude-local-1`):**
  - Vercel ekibi `daimonflora-gmailcoms-projects` (`team_pZ2ioUaryATDt15wOOUcCkQD`), proje **`davetiye-platform`**
    (`prj_WRKdVHmsou7QU2B5UhgO8uksAobj`), Next.js, fonksiyon bölgesi `iad1` (`platform/vercel.json`).
    CLI ile `platform/` klasöründen yayınlanıyor (Git bağlantısı yok; proje ayarında kök dizin boş — CLI zaten `platform/`'u yükler).
    Yükleme dışı: `platform/.vercelignore` (`.data` — düz anahtarlı `seed-keys.json` —, `.next`, `previews`, `.env*`).
  - Blob deposu **`davetiye-platform-data`** (`store_91tcR2Y0pohygoAO`, iad1, erişim **private**), projeye Production + Preview +
    Development için bağlı. Ortam değişkeni **adları**: `BLOB_READ_WRITE_TOKEN` (Vercel ekledi), `DATA_ADAPTER=blob` (Production, Preview).
    `PLATFORM_PUBLIC_URL` tanımlı değil (panel isteğin host'unu kullanır).
  - Adres: **https://davetiye-platform-five.vercel.app** (production takma adı; herkese açık). Projenin ilk yayını Vercel
    tarafından otomatik production'a atandı; sonraki `vercel deploy`'lar preview olur. Deployment'a özel URL'ler Vercel girişi ister
    (Deployment Protection, varsayılan).
  - Demo: `/clara-and-julian` (blush-garden-rose, 03 demo içeriği, 5 kurgu GPT fotoğrafı 1600 px'e küçültülerek). Düzenleme anahtarı
    yalnız yerel geçici dosyada; repoda yok.
  - **Gerçek depoda bulunan hata ve düzeltmesi:** depo büyük (sıkıştırılmış) JSON okumalarında zayıf ETag (`W/"…"`) döndürüyor,
    `ifMatch` yalnız güçlü ETag kabul ediyor → her site güncellemesi/yayın reddediliyordu. `readJson` artık `W/` önekini atıyor;
    `tests/fake-blob.ts` bu davranışı taklit ediyor (düzeltmesiz 10 test kırılıyor). Küçük dizin dosyaları güçlü ETag ile geliyor.
  - Gerçek depo duman testi (slug/sipariş yarışı, sunucunun `allowOverwrite:false` ve bayat `ifMatch` reddi, 2 örnek × 8 eşzamanlı
    yazma — kayıp yok, 10 eşzamanlı RSVP hemen listeleniyor, foto, token'sız blob URL'si 403, temizlik): düzeltme sonrası 3 koşuda
    11/11, 11/11 ve 10/11 (ilk koşuda 8 yazmadan 1'i adı alınamayan geçici bir hatayla düştü; sürüm sayımı kayıp yazma olmadığını
    gösterdi; tekrarlanmadı).
  - Canlı uçtan uca (yayındaki adrese karşı, 30/30): 5 demo sayfası + CSP, fotoğraflar `/media` (immutable önbellek), tema varlığı,
    panel sayfası (yanlış anahtar 404), panel API, geçici sitede kaydet → bayat kayıt 409 → foto yükleme (sharp Vercel'de çalışıyor) →
    yayınla → sayfada değişiklik → misafir RSVP → çift listesi + CSV, `/start` sayfası + canlı demo + sahiplenme 201 + aynı sipariş 409.
    Geçici siteler silindi.
  - Denenmedi: gerçek telefon (iOS Safari / Android Chrome), Vercel'de çok örnekli hız sınırı davranışı (sınırlar hâlâ süreç içi),
    yük/maliyet ölçümü, Git bağlantılı otomatik yayın.
- **Yeniden yayın (G049, 2026-10-14, `claude-local-1`):**
  - Production = main `59b1291` (platform ağacı `f9ff114cfa65`; sonraki main commit'leri platforma dokunmadı), `dpl_2wNCu8cwSnw4PcWpQ2pTqcGjbdTC`,
    aynı adres https://davetiye-platform-five.vercel.app. Ortam değişkeni adlarına `PLATFORM_PUBLIC_URL` eklendi (Production + Preview;
    og:image ve takvim linkleri için).
  - **Yayın yolu:** ekip Pro planda ve repo private → Vercel yalnız ekip üyelerinin commit'lerini yayınlıyor; commit yazarı
    `Claude <noreply@anthropic.com>` olduğu için CLI yayını `BLOCKED` oldu (`dpl_BgNBxoWYAdD5bf38BFqsZefyYJzu`). Kullanıcı kararıyla
    (2026-10-14) yayın, commit'in `git archive HEAD:platform` ile çıkarılmış birebir kopyasından yapılıyor (git bilgisi gitmez;
    `--meta gitCommit=<kısa sha> --meta platformTree=<ağaç>` notu eklenir). Kalıcı çözüm seçenekleri (kullanıcı): commit'leri ekip üyesinin
    Git kimliğiyle atmak ya da Vercel ekip ayarı.
  - **Windows notu:** Git for Windows varsayılanı `core.autocrlf=true` çalışma kopyasını CRLF'e çeviriyordu → bu makineden yapılan yayın
    main'le bayt bayt aynı değildi ve `site.js` boyut bütçesi testi kalıyordu. Yerel kopya `core.autocrlf=false`, `core.eol=lf`'ye alındı;
    `git archive` zaten repo içeriğini (LF) verir. Önerilen: repoya `.gitattributes` (`* text=auto eol=lf`).
  - Canlı sonuç: `scripts/live-check.mjs` **41/41** (5 demo sayfası + CSP, og:image, `.ics`, foto, panel + başlıklar, 2 temanın `/start` ve
    demoları, geçici sitede kaydet/409/foto (yayınlanmamış foto önizleme anahtarı olmadan 404, anahtarla 200)/yayın/RSVP/CSV, `/start`
    201 + 409, temizlik); `scripts/blob-smoke.mjs` **12/12** (8/8 eşzamanlı yazma). Telefon boyutunda (375 px) zarf → home → story →
    details → RSVP akışı ve iki `/start` sayfası görsel olarak kontrol edildi.
  - Gerçek depoda bulunan ikinci ayrıntı: üst üste binen koşullu yazmalar `412` yerine düz `BlobError("… conflicting operation …")`
    alıyor → adaptör bunu da yeniden dener (G049; önceden 8 eşzamanlı yazmadan 1'i hatayla düşüyordu, veri kaybı yoktu).
- **Test yayını (G077, 2026-10-14, `claude-local-1`):** production = main `db0eac7` (platform ağacı `1f72af6309a2`; panel v2 +
  G060-fix, satış sitesi, G064 QA, 4 tema), `dpl_HkfyAujAQ9U7jHxuQ8CGAeqRYz7j`, aynı adres; G049 arşiv yolu, ortam değişkeni değişmedi.
  Önce `npm test` 427/427 (+2 build'e bağlı test build sonrası 2/2), typecheck, build yeşil. (Aynı gün önce `b289187` yayınlanmıştı —
  `dpl_3fUg7HxKhWPKWyccfenHRLmc4qWJ`, 410/410 + 40/40 + 12/12 —; G060-fix/G064 gelince yeniden yayınlandı.) Demo siteler Blob'da yeni kodla:
  `/clara-and-julian` (03), `/avery-and-jordan` (01), `/margot-and-henry` (04, onaysız), `/isabella-and-marco` (05, onaysız).
  `live-check` 40/40 + dört temalı salt-okuma 36/36, `blob-smoke` 12/12. Kullanıcı için test sitesi `/lily-and-theo` (blush, kurgu,
  3 RSVP). Ekran görüntüleri (390 px): `docs/10_canli_test/`.
- **Canlı güncelleme (G078, 2026-10-14, `claude-local-1`):** production = main `2dc812b` (platform ağacı `cbebd425efc9`; BKE Studio satış
  sitesi G066-A, RSVP v2 G069, isteğe bağlı site şifresi G076, tema 02 Dusty Blue), `dpl_CrRsWGBkUZNrtQW6LkQpZEJhRukG`. Önce `npm test`
  493/493 (+2 build sonrası 2/2), typecheck, build yeşil. Demolara `/eleanor-and-theo` (02, onaysız) eklendi; hepsi yeni kodla tohumlandı.
  `live-check` 40/40 + beş temalı salt-okuma 41/41, `blob-smoke` 12/12. Site şifresi ayrı geçici sitede denendi (çalışıyor), site silindi.
  Ekran görüntüleri: `docs/10_canli_test/g078/`.
- **Sade panel canlıda (G079, 2026-10-15, `claude-local-1`):** production = main `1d25e57` (platform ağacı `5b9002e5e600`; G066-B BKE
  Studio paneli + K29 sadeleştirme, G075 teşekkür modu, G068 düzenlenebilir metinler, G080 `/start` kapısı, 5 tasarım satışta),
  `dpl_BfYJEMS1nxXarDBKovViJ2F81Y6h`. `npm test` 574/574 (Windows'ta g080-approval'ın 8 testi symlink izni yüzünden yalnız junction
  shim'iyle geçiyor — README "Windows notları"), typecheck, build yeşil. Demolar yeniden tohumlandı; `live-check` 40/40, beş tema 41/41,
  `blob-smoke` 12/12. Panel gezintisi ve 3 adımlı kurulum canlıda denendi; ekran görüntüleri `docs/10_canli_test/g079/`.
- **Dükkân paneli canlıda (G092, 2026-10-15, `claude-local-1`):** production = main `55cf6ee` (platform ağacı `117993db9549`; /admin G087,
  G091 metinleri, K33), `dpl_9VoCE8w6VuARyzHPJCfeDeWPRDSj`. Vercel'e `ADMIN_PASSWORD` (Production + Preview, Secret; kullanıcı onayıyla, K33 geçici kısa
  şifre) eklendi. `npm test` 651/651, typecheck, build yeşil; `live-check` 40/40, beş tema 41/41, `blob-smoke` 12/12. Canlı admin: giriş + "Geçici kısa
  şifre" uyarısı, liste, site sayfası, mesaj kopyalama, yeni düzenleme linki (eski 404, yeni açılır), adres yazarak silme (404).
  `CLAIM_ORDER_VERIFICATION` tanımlı değil (= biçim kontrolü) → sipariş onayı adımı canlıda yok. Ekranlar `docs/10_canli_test/g092/`.
- **Yayın (2026-10-16, `claude-local-1`):** production = main `b952bc8` (platform ağacı `35ba50964db2`; PR #7: 15–20 temaları, satış sitesinde 20
  tasarım, panel mesaj penceresinde kelime bölünmesi düzeltmesi), `dpl_8ZNhkwSZueCgw7AioMrtoFg6ZixR`. Temiz main worktree'sinde `npm test` 1189/1189
  (19 atlanan: Playwright'lı tema testleri + build'e bağlı), typecheck, build yeşil; `live-check` 40/40, `blob-smoke` 12/12. Ortam değişkeni değişmedi.
  Bir dakika sonra ayrı bir yerel oturum habersiz aynı ağacı yeniden yükledi → **şu anki production `dpl_HKT1NRKp895wEVEUbGKdzJCqU4RW`** (içerik aynı; aynı
  `--meta`). Ek kontrol: 20 tasarımın her biri için tasarım sayfası, `/start/demo/<id>` ve `/start?theme=<id>` formu 200; `live-check` yeni 6 temayla
  (`LIVE_THEMES=` 15–20) **60/60**. (İki oturum aynı yayını iki kez yaptı: yayın işinin tek oturumda tutulması önerilir.)
- **Yayın (2026-10-17, `claude-local-1`):** production = main `d5bbc39` (platform ağacı `4ee213627e67`), `dpl_GcQSunZSKxDhGo1yp4KYStztSPjN`; build yeşil, 6 env adı Production'da; `live-check` 20 satış temasıyla **130/130**, `blob-smoke` **12/12**, 5 demo yeniden tohumlandı; 390 px göz kontrolü geçti (geçici `/start` sitesi açıldı, sipariş onayı `verify-order.ts` ile, yayın + Excel + Sheets izin ekranı görüldü; admin şifresi olmadığından silme `adapter.deleteSite` ile, Admin Özet `adminDashboard` ile: 5 Demo satış sayılmıyor).
- **Yayın (2026-10-17, yerel oturum):** production = main `e849c4e` (platform ağacı `e5adc23bb730`; G138 içerik blokları, G140 paylaşım, G141 vitrin), `dpl_2X2G3Q2fnq9AUMCmhGXsiLNLGAgo` (READY), arşiv yolu + `--meta`; `npm ci` + build yeşil (testler bulutta 1273/1273); ortam değişkeni değişmedi (6 gerekli ad Production'da var); `live-check` 20 satış temasıyla **132/132**, `blob-smoke` **12/12**, 5 demo yeniden tohumlandı. 390 px göz kontrolü: satış sitesi, panel bölümleri (3 Details bloğu eklendi), geçici `/g-e849-check` (sipariş `verify-order.ts` ile onaylandı) yayınlandı → Share kiti, QR renk/boyut/kart, test yanıtıyla Guests + Home "Download Excel" (xlsx 200), Google Sheets izin akışı (`drive.file`; izin verilmedi); admin Özet demoları satış saymıyor; site admin'den silindi (404, Blob'da 0 dosya). Demo Story'de ses düğmesi var; Details'te "Show map" + yol tarifi `72f2f26f` ile yeniden tohumlanan demolarda görünüyor.
- **Düzeltme yayını (2026-10-17, `claude-local-1`):** production = main `bd869bb` (platform ağacı `a8702e8391cf`), `dpl_HZU61XPKRzXaQ1sZWVePhwY2TStm`. Düzeltilen: panelde React #418 hydration hatası (kurulum adımı 1 / Day & place: `TimeField` 12/24 saat okumasını ilk render'da yapıyordu, mount sonrasına alındı), ilk yüklemede sekme başlığının "Edit your website"ta kalması (`components/panel/title.ts`), tohumlanan demolarda harita yoktu (`seed.ts` demo şehri pinini ekler; 5 demo yeniden tohumlandı, hepsinde Show map + Google/Apple yol tarifi), operatör betikleri Windows'ta sessizce çıkıyordu (main guard). `npm test` 1259/1259 (17 atlanan), typecheck, build yeşil; `live-check` 20 temayla **128/128**, `blob-smoke` **12/12**; canlı panelde (Playwright, 390 px) #418 yok, başlıklar doğru; geçici siteler silindi, admin özeti (aynı kodla): 5 Demo satış sayılmıyor. Sonraki main commit'leri (G139/G142/G144/G145) bu yayında yok.
- **Yayın (2026-10-17, yerel oturum):** production = main `477589f` (platform ağacı `387fcfbd77ae`; G139 PDF indirmeleri, G144 diller, G145 panel denetimi), `dpl_BdTLgKpin8Pfse8cEzzDdapYxaS3` (READY, boyut uyarısı yok), arşiv yolu + `--meta`; `npm ci` + build yeşil (testler bulutta 1335/1335); ortam değişkeni değişmedi; `live-check` 20 satış temasıyla **130/130**, `blob-smoke` **12/12**, 5 demo yeniden tohumlandı. 390 px: satış sitesi dil seçici (mobil menü) + `/tr`, `/de` o dilde (ama `<html lang>` `en` kalıyor); geçici `/g477-pdf-check`: TR ekle + Otomatik çevir (12 metin, ~24 sn, MyMemory; kalite zayıf: "Reception"→"Alım"), misafir `?lang=tr` + dil seçici, Details'te 4 "On this page" atlaması; **PDF:** site PDF'i 20 sn / 1.9 MB (4 sayfa), A5 bleed+crop 8.7 sn / 1.1 MB, 5×7 bleed+crop 4.7 sn / 1.1 MB (2 sayfa, QR'lı arka yüz) — ancak oturumdaki **ilk davetiye isteği iki denemede de 500** (`browserContext.newPage: Target page, context or browser has been closed`; önbellekteki Chromium istekler arasında ölüyor, `lib/print/browser.ts`), yeniden deneyince iniyor. Dükkân linki (`issueShopEditKey`/`endShopEditKey`; admin şifresi yerelde yok): TR şerit, alıcı linki çalışıyor, kapatınca 404; admin Özet/Tasarımlar ekranı görülmedi (veri: 20 live, 21–22 coming). Geçici site silindi (404).
- **Yayın notu — tema dosyaları statik (G159, 2026-10-17; henüz yayınlanmadı):** tema CSS/JS/görselleri (paletler dahil)
  artık hiçbir Vercel işlevinin paketinde değil. `npm run build` = `prebuild` (`scripts/theme-assets.cjs`: `themes/<id>/…` →
  `public/themes/<id>/…`, palet görseli `img/variants/<v>/x` → `~<v>/img/x`) + `next build` + `postbuild` (`trace-check`).
  Vercel kaynaktan build ederken `npm run build`'i çalıştırdığı için (son yayının build günlüğü, `dpl_BdTLgKpin8Pfse8cEzzDdapYxaS3`:
  `Running "npm run build"` → `next build` → `postbuild` trace-check) **`git archive HEAD:platform` + `vercel deploy` yolu aynen
  çalışır**; `public/themes` arşivde yok (git'e girmez, `.vercelignore`'da), build sırasında oluşur. `--prebuilt` ile yayın
  yapılırsa önce yerelde `npm run build` şart (trace-check kopya eksikse build'i düşürür). Adresler değişmedi
  (`/themes/<id>/…`, `/themes/<id>/~<v>/…`; yayındaki siteler, tema HTML'i, PDF hattı aynı URL'leri kullanır); başlıklar rotanınkiyle
  aynı (`public, max-age=3600, s-maxage=86400`, `nosniff`, SVG CSP) — fark: JS `application/javascript` (önce `text/javascript`),
  ETag/Last-Modified ile 304, ve varlık uzantılı bir 404 de bu önbellek başlığını taşıyor (Vercel'de CDN önbelleği yayın başına,
  zararsız). Yayından sonra denenecek: `live-check` (tema CSS'i), bir palet demosu (`/start/demo/olive-ivory?variant=sage-gold`)
  ağ sekmesinde `~sage-gold/img/…` 200 ve `x-vercel-cache`, site PDF'i (tema görselleri PDF işlevine CDN'den gelir — önizleme
  yayınında Deployment Protection bunu engelleyebilir, production'da açık; palet baskı parçaları da öyle, eskiden beri). Ölçüm
  (yerel build, 29 tema, 15'inde palet): varlık rotası 101 → 2,4 MB (paletlerle artık büyümez), PDF rotası 184 → 142,5 MB (bütün
  `public/` izleniyordu; artık yalnız `public/print/<tema>/*.webp`), en büyük işlev PDF rotası; `trace-check` her işlevde tema
  dosyası ≤ 40 MB ve toplam ≤ 200 MB arar. Ayrıntı: `gorevler/G159-statik-tema.md`, `platform/README.md` "Vercel paketleri".
- **Lansman yayını (2026-10-20, yerel oturum, docs/30):** bkestudio.com artık ayrı ekipte: Vercel `bkestudio` (Pro), proje **`davetiye-maker`**, **Git bağlı** (main'e push production'a yayınlanır; arşiv yolu gerekmez). main `f7cce5f` (main + `claude/focused-tesla-37o26v`, yazar dflora) → production; `ADMIN_PASSWORD` yenilendikten sonra yeniden yayın `dpl_5uwZNwo2TH3mHvmArhihkYAvewoe` (Ready, bkestudio.com). Env (Production): `CLAIM_ORDER_VERIFICATION=manual`, `PLATFORM_PUBLIC_URL` = `MARKETING_SITE_URL` = `https://bkestudio.com` (zaten doğruydu), `ADMIN_PASSWORD` (Sensitive, yeni, ≥ 16). Yerelde `npm ci`, typecheck, build yeşil; `npm test` 1640/1640 (17 atlanan; Windows'ta önceki iki tam koşuda `g152` RSVP e-posta sınırı testi paralel yükte 1 kez kaldı, tek başına 6/6). `live-check --no-write` 21 satış temasıyla **107/116**: 9 FAIL'in hepsi `/clara-and-julian` demosunun bu projenin Blob deposunda olmamasından (404; og:image/.ics/foto/RSVP onun alt kontrolleri). **Yazma yolu ve `blob-smoke` koşmadı**: bu projenin `BLOB_READ_WRITE_TOKEN`'ı yerelde yok (yereldeki `.env.local` eski `daimonflora` deposunun).
  - Uçtan uca (aynı gün, canlı bkestudio.com; Chrome masaüstü genişlikte — pencere 390'a küçülmedi —, misafir görünümü oturumsuz Playwright 390 px): `/start?theme=olive-ivory` → sipariş `20261020TEST` **reddedildi** (kural 8–12 rakam) → `999920261020` ile taslak `test-and-deneme` → panel 3 adımlı kurulum, foto kırpma + yükleme, "Kaydedildi" → Yayınla kilitli ("doğruluyoruz") → `/admin` Yapılacaklar'da "onay bekliyor" → Siparişi onayla (kullanıcı tıkladı) → Yayınla açıldı, yayınlandı → misafir zarfı + foto → RSVP gönderildi → panel Davetliler 1 yanıt, admin "Katılıyor · 1 kişi" → site admin'den kalıcı silindi (kullanıcı tıkladı; 404, Özet 0). Bulgular: TR panel kurulum 3. adımda 2 cümle İngilizce; admin onay notu hazır "Etsy'de kontrol edildi: ödendi…" metniyle geliyor (kontrolsüz onaylanabilir). Ekranlar `docs/10_canli_test/lansman_20261020/`.
- Eski not (2026-10-13 sabah): bulut oturumunun Vercel bağlantısı proje açamıyordu (403); statik önizleme
  https://claude.ai/artifact/LBc4yLieUxQnLtRZ72dxwm (özel; panel yok).

## 3. Açık konular (kullanıcı / sonra)
- **Barındırma ve maliyet:** bağlı hesaplar Vercel (`daimonflora-gmailcom's projects`) ve Supabase
  (`dflora27's Org`, içinde ilgisiz 2 proje var — dokunulmaz). Yeni Supabase projesi / Vercel projesi açmak
  **kullanıcı onayı** ister. Ticari kullanımda ücretli plan gerekebilir (Vercel Hobby ticari değil;
  Supabase ücretsiz projeler hareketsizlikte duraklar) — satışa çıkmadan karar.
- **Alan adı / marka:** marka seçilmedi; ilk sürüm `*.vercel.app`.
- **Etsy sipariş doğrulama:** dört mod (`CLAIM_ORDER_VERIFICATION`): tanımsız/`off` = yalnız biçim kontrolü; `manual` (G060-fix,
  şu an canlıda) = taslak hemen açılır, sipariş dükkân tarafından onaylanana kadar (admin "Siparişi onayla" ya da
  `node scripts/verify-order.ts --order <no> --reason "…"`) yayın ve paylaşılan önizleme kapalı; **`etsy` (G147, kod hazır, açılması
  sahibin kurulumunu bekliyor)** = sipariş numarası Etsy'den bizim mağazanın makbuzu olarak okunur. Satış sitesinin yayın kapısı
  `verified.orderCheck` true olmadan `launched: true` kabul etmez.
  - Kurallar: makbuz bizim mağazada ve ödenmiş → site hemen yayınlanabilir; iptal / tamamı iade → reddedilir; bizim mağazada yok →
    reddedilir; henüz ödenmemiş ("payment processing") → site açılır, bekler, ödeme gelince kendiliğinden onaylanır; Etsy alıcı
    e-postasını veriyorsa (çoğu zaman vermez, Etsy'nin ayrıca onayı gerekir) ve farklıysa → reddedilir; ilan → tasarım eşlemesi
    `platform/lib/etsy/listings.json` (ilanlar yayınlanınca `listing_id → tema id` doldurulur; eşlenmemiş ilan tasarım yüzünden
    reddedilmez); Etsy cevap vermez / yoğun (429) → alıcıya "birkaç dakika sonra tekrar deneyin".
  - **`trust` — önce güven, sonra doğrula (G191, kod hazır, açılması sahibin kararını bekliyor):** alıcı hiç beklemez. `/start`'ta
    Etsy sorulabiliyorsa (`etsy` modundaki kurallar) kesin cevap geçerli: ödenmiş → onaylı; bizim mağazada yok / iptal / iade /
    başka e-posta / başka tasarım → reddedilir. Geri kalan her durumda (Etsy bağlı değil, ödeme işleniyor, Etsy cevap vermiyor) site
    **"provisional"** açılır: **hemen yayınlanabilir**, paylaşılan önizleme açık; dükkâna "Yeni site başlatıldı — önce güven" e-postası
    gider (SMTP açıksa). Sonra `lib/claim/trust.ts` kontrol eder — saatte bir Vercel Cron (`GET /api/cron/orders`, `vercel.json`,
    `CRON_SECRET` gerekir, yalnız `trust` modunda çalışır) ve admin → Bağlantılar → "Bekleyen siparişleri Etsy'de kontrol et":
    - Etsy bağlıysa: onaylanırsa → `verified`; Etsy kesin "uymuyor" derse ya da sipariş 48 saat sonra hâlâ ödenmemişse → site
      **yayından kalkar ve beklemeye alınır** (`pending`, alıcı panelde "We are still confirming your Etsy order" görür, Publish kapalı)
      + dükkâna "Site yayından kaldırıldı" e-postası (neden yazılı).
    - 48 saat dolup hâlâ doğrulanmadıysa (Etsy bağlı değil / cevap yok): site **yayında kalır** (cevapsız durumda alıcı aleyhine
      karar verilmez); dükkâna **bir kez** "48 saatte doğrulanamadı" e-postası, admin'de "Yapılacak"a düşer.
    - Admin site sayfası: "Siparişi onayla" ya da **"Yayından kaldır ve beklet"** (nedeniyle). Dükkânın beklettiği siteyi Etsy'nin
      tekrar kontrolü serbest bırakmaz; yalnız "Siparişi onayla" bırakır, sonra alıcı (ya da "Alıcı adına yayınla") yeniden yayınlar.
    - Açmak için (bir kez): Vercel → Environment Variables (Production, Sensitive) `CRON_SECRET` = en az 16 karakter rastgele değer;
      `CLAIM_ORDER_VERIFICATION=trust`; yeniden yayın. Etsy bağlantısı (aşağıdaki kurulum) olmadan da çalışır; o zaman "sonra
      doğrula" adımı otomatik değildir: dükkân e-postayla haber alır, uymayanı admin'den bekletir. Etsy bağlanınca kendiliğinden olur.
    - **Gerçek Etsy ile denenmedi** (Etsy uygulaması henüz yok); testler sahte Etsy ve sahte e-postayla
      (`platform/tests/trust-orders.test.ts`).
  - **Çok ürünlü sipariş (G152):** `etsy` modunda bir sipariş **N site** açabilir; N = makbuzdaki tasarım birimleri (tasarım
    satırlarının adetleri toplamı; eşlenmemiş satır da tasarım sayılır; `listings.json` → `services` altındaki kurulum / özel tasarım /
    ek revizyon ilanları **hiç sayılmaz**; en az 1, en çok 10). `/start`'ta boş birim varsa yeni site açılır; hepsi doluysa eski davranış
    (aynı e-posta → giriş, o tasarımın sitesi; başka e-posta → `order_used`). `off`/`manual`'de ve Etsy bağlı değilken bir sipariş = bir
    site. Blob'da birim başına ayrı sipariş dizini (`orders/<no>.json`, `orders/<no>~2.json` …; iki örnek aynı birimi alamaz, yarışı
    kaybeden bir sonraki birimi alır). Satışa çıkmadan ilanlar yayınlanınca `services` doldurulmalı.
  - **Güvenli geri düşüş:** `etsy` modunda ayarlar eksik, mağaza bağlı değil ya da Etsy bağlantıyı reddediyorsa `/start` hata vermez,
    `manual` gibi davranır (site bekler) ve admin → Özet → **Bağlantılar** kartı uyarı gösterir. Bağlantı kurulunca bekleyen siteler
    "Bekleyen siparişleri Etsy'de kontrol et" ile, ayrıca alıcı paneli açıkken ve alıcı Publish'e basınca kendiliğinden onaylanır.
  - **Sahibin kurulumu (bir kez):**
    1. Mağaza sahibinin Etsy hesabıyla etsy.com/developers → **Your Apps** → yeni uygulama oluşturun (ad, kısa açıklama: "kendi
       mağazamın siparişlerini okuyan araç").
    2. Uygulamanın callback (redirect) adreslerine sitenin tam adresiyle `https://<site adresi>/api/etsy/callback` ekleyin.
    3. Aynı sayfadaki **keystring** → Vercel'de `ETSY_API_KEY`, **shared secret** → `ETSY_SHARED_SECRET` (Production, "Sensitive").
       Tokenları şifreleyen anahtar için yeni bir şey gerekmez: zaten var olan `GOOGLE_TOKEN_KEY`'den (Google Sheets) ayrı bir etiketle
       (HKDF) türetilir. `GOOGLE_TOKEN_KEY` yoksa 32 rastgele bayt (base64) olarak eklenir; değiştirilirse Etsy yeniden bağlanır.
    4. **Etsy'nin uygulamayı onaylaması günler–haftalar sürebilir.** Bu sürede `manual` çalışmaya devam eder, hiçbir şey bozulmaz.
    5. Onaydan sonra (yeniden yayın sonrası) admin → Özet → Bağlantılar → **Etsy mağazasını bağla** → Etsy'de izin verin (yalnız okuma:
       `transactions_r`, `shops_r`) → "Etsy mağazası bağlandı" → **Yönetime dön**. 10 dakika içinde, aynı tarayıcıda tamamlanmalı.
    6. Vercel'de `CLAIM_ORDER_VERIFICATION=etsy` yapıp yeniden yayınlayın; eski bekleyenler için **Bekleyen siparişleri Etsy'de kontrol et**.
    7. "Bağlantıyı kes" tokenları burada siler (Etsy tarafındaki izni Etsy hesap ayarlarından da kaldırabilirsiniz).
- **E-posta gönderimi** (G147, kod hazır; `SMTP_HOST` + `SMTP_USER` + `SMTP_PASS` girilince açılır, girilmeden hiçbir şey değişmez):
  `/start` sonrası alıcıya özel düzenleme linki + "başka cihazda `<site>/my` adresinden sipariş no + e-postayla devam" e-postası;
  `/my`'den istenen giriş linki (G146, "Email me a sign-in link"); site **onay bekleyerek** açıldığında dükkâna "New website started — order needs a
  check" bildirimi (yalnız sipariş no, tasarım, admin linki; alıcının linki yok). Gönderim hatası siteyi açmayı bozmaz, link ekranda
  kalır; e-posta içeriği, link ve adresler log'a yazılmaz. **RSVP bildirimi (G152):** panel → Guests → "Email me when a guest
  replies" (varsayılan kapalı, yalnız SMTP açıkken görünür) → her sayılan misafir yanıtında kayıtlı sahip adresine kısa e-posta (misafir
  adı, katılım, kişi sayısı, en çok 5 cevap, not; panele **anahtarsız** `<site>/my` linki). Site başına günde en çok 20; fazlası sayılır,
  bir sonraki e-posta "N more replies" der. Ayar `docs/<site>/rsvp-notify.json`; gönderim hatası yanıtı etkilemez.
  - **Sahibin kurulumu (Gmail, bir kez):**
    1. Google hesabında **2 Adımlı Doğrulama** açık olmalı (Google Hesabı → Güvenlik).
    2. Google Hesabı → Güvenlik → **Uygulama şifreleri** → bir ad yazın (ör. "Vercel site") → Oluştur → 16 harfli şifreyi kopyalayın
       (hesap şifreniz değil; boşluklu da yapıştırabilirsiniz).
    3. Vercel → proje → Settings → Environment Variables (Production, "Sensitive"): `SMTP_HOST` = `smtp.gmail.com`, `SMTP_PORT` = `465`,
       `SMTP_USER` = Gmail adresi, `SMTP_PASS` = uygulama şifresi. İsteğe bağlı: `MAIL_FROM` (gönderen adı/adresi; varsayılan
       "BKE Studio" + `SMTP_USER`), `ADMIN_NOTIFY_EMAIL` (bildirimlerin gideceği adres; varsayılan `SMTP_USER`). Yeniden yayınlayın.
    4. Admin → Özet → Bağlantılar → "E-posta gönderimi: Açık" → **Test e-postası gönder** (gelen kutusu + spam klasörü).
    Kişisel Gmail'in günlük gönderim sınırı vardır; dükkân hacmine yeter, büyürse aynı değişkenlerle başka bir SMTP servisine geçilir.
- **Gizlilik metni** (misafir verisi): yayından önce.

## 3a. Erişim: her cihazdan sipariş no + e-posta (G146, K46 — 2026-10-17)
Etsy'nin anında indirmesi her alıcıya **aynı PDF'i** verir; PDF'te alıcıya özel kod/link olamaz. Alıcının "kodu" **Etsy sipariş
numarasıdır** (Etsy → You → Purchases and reviews; Etsy onay e-postasında "Order #…"). **Sipariş no + siteyi başlatırken verdiği
e-posta = her cihazdan erişim.** Hesap yok, şifre yok, dükkânın işi yok. Özel düzenleme linki kolaylık olarak kalır.
- **Satış sitesi düğmesi** "My website" → **"Create your website"** (TR "Davetiye siteni oluştur"; masaüstü, mobil menü, alt bilgi).
  Rota yine `/my` (eski linkler/PDF'ler çalışır).
- **`/my` = "Create your invitation website":** önce bu cihazda açılmış editörler (varsa), sonra 3 adım (Etsy'den satın al → Etsy
  anında PDF verir → sipariş no + e-postayı buraya gir; sipariş numarasının nerede olduğu), sonra **tek form** →
  `POST /api/my/continue`: sipariş için site var ve e-posta sahibininkiyle eşleşiyor (normalize, büyük/küçük harf duyarsız, sabit
  zamanlı) → yeni **cihaz anahtarı** → editör açılır; site yok → `/start?theme=…` (tema yoksa "Hangi tasarımı aldınız?" seçici;
  sipariş no + e-posta **sessionStorage** ile taşınır, URL'ye yazılmaz); diğer her durum → tek genel mesaj. Katlı ikinci yol
  "Have your private edit link?" (yapıştır). "Email me a sign-in link" yalnız e-posta sağlayıcısı açıkken (`getEditLinkMailer().enabled`;
  G147) görünür: eşleşirse cihaz anahtarlı link **kayıtlı sahip adresine** `kind: 'signin'` ile gider; cevap her durumda aynı.
- **Cihaz anahtarı** (`lib/device-keys.ts`): `dv-` + 32 rastgele bayt; yalnız SHA-256 saklanır, oluşturma zamanı ve kısa etiket
  ("iPhone · Safari"). Site kaydında **değil**, site belgesinde (`docs/<site>/devices.json`, `readSiteDoc/updateSiteDoc`; blob'da
  ETag koşullu yazma) — yeni cihazda giriş `updatedAt`'i oynatmaz, açık paneller çakışma görmez. En çok 10; en eskisi düşer.
  Her anahtar düzenleme anahtarının **kuşağına** bağlı: anahtar yeniden üretilince (admin "Yeni link", `scripts/reissue-edit-key.ts`,
  `/start` yeniden deneme — hepsi `reissueKeys`) tüm cihaz anahtarları anında ölür ve belge silinir. Dükkânın 72 saatlik kendi
  linki (G145) alıcının anahtarını değiştirmediği için cihazları kapatmaz.
- **Tek kontrol noktası:** `lib/sites.ts editAccess` (owner · shop · device) ← `lib/rsvp/couple.ts editorAccess/authorizeEditor`:
  panel sayfası, panel API'si, foto/müzik yükleme, harita linki, Google Sheets, PDF indirme, RSVP listesi/işlemleri/CSV/Excel, cihazlar.
  Önizleme: panel kısa ömürlü önizleme jetonunu `previewKeyHash`'ten alır (cihaz oturumunda da çalışır); paylaşılan önizleme linki
  (düzenleme anahtarından HMAC) değişmedi.
- **`/start` + kullanılmış sipariş:** aynı e-posta → `order_used` yerine cihaz anahtarıyla giriş, editörde "This order already has a
  website — we opened it for you" notu (200 `existing: true`); başka e-posta → 409, mesaj `/my`'ı gösterir. Yeniden deneme (claim
  token) davranışı aynen.
- **Panel → Share → "Use on another device":** "<origin>/my adresini açın, sipariş no + e-posta girin" + `<origin>/my` QR'ı
  (algoritmik, sır yok) + giriş yapılmış cihazlar listesi ("This device") + **Sign out other devices** (kullanılan cihaz dışındaki tüm
  cihaz anahtarları silinir; özel düzenleme linki değişmez; dükkân linki bunu yapamaz). Geçersiz link sayfası ve panelin "link artık
  çalışmıyor" ekranı **"Continue with your order number"** → `/my` düğmesi gösterir.
- **Güvenlik:** `/api/my/continue` IP başına 10/15 dk, sipariş başına 6/saat (sipariş sayacı `/start` girişiyle ortak; sayaç adında
  sipariş numarasının hash'i); `/api/my/signin-link` IP başına 5/saat, sipariş başına 3/saat. JSON-only, 1 KB sınırı, honeypot,
  `no-store` + `no-referrer`; `/my` sayfası `/edit` ile aynı güvenli başlıkları alır (frame-ancestors 'none'). Anahtar, e-posta ve tam
  sipariş numarası loglanmaz.
- Bilinen sınır: Etsy doğrulaması kapalıyken (biçim kontrolü) sipariş no + e-postayı bilen herkes girer — K46 kararının bilinçli
  bedeli; G147'nin Etsy doğrulayıcısı açıldığında `/start` önce siparişi doğrular. Gerçek e-posta gönderimi G147'de.
- **G152 ekleri:** çok ürünlü siparişte aynı e-postanın birden çok sitesi varsa `/my` rastgele birini açmaz, küçük bir seçici
  ("Which website do you want to open?" — isimler + adres; anahtar yalnız seçilen site için) gösterir; "Email me a sign-in link" her
  site için ayrı e-posta yollar. Admin site sayfası → Destek işlemleri → **Giriş yapılan cihazlar** (sayı, etiket, tarih; salt okunur) +
  **Tüm cihazlarda oturumu kapat** (cihaz anahtarları silinir; alıcının özel linki ve dükkân linki kalır). Alıcı ekranlarının (`/start`,
  `/my`, `/signin`, `/edit/...`, bunların not-found sayfaları) **sunucu HTML'i** artık doğru `<html lang>`'i taşır: `app/layout.tsx`
  kaldırıldı; satış sitesi (`app/(marketing)/layout.tsx`, statik kaldı), admin (`app/admin/layout.tsx`, `tr`) ve her alıcı ekranı
  (`app/{edit,my,signin,start}/layout.tsx` → `components/i18n/RootDocument.tsx BuyerRootLayout`, `bke_lang` çerezi / Accept-Language)
  ayrı kök layout; eşleşmeyen adresler `app/global-not-found.tsx` (`experimental.globalNotFound`). Kök layout'lar arası geçiş tam
  sayfa yüklemesidir.
- **Destek notu:** siparişi başkası kendi e-postasıyla kapmışsa (doğrulama kapalıyken) dükkân **önce admin'de e-postayı gerçek
  alıcınınkiyle düzeltir, sonra "Yeni link" (reissue)** yapar: reissue cihaz anahtarlarını düşürür, düzeltilmiş e-posta da yeni
  girişi gerçek alıcıya bağlar. (E-posta düzeltmesi tek başına cihazları kapatmaz.)

## 3b. Özel tasarımı yalnız o alıcıya açma (G151, K42/K47 — 2026-10-17)
"Custom design" hizmetinde alıcıya yaptığımız tasarım **başkasına satılmaz**. Tema klasörüne konur ve `theme.json`'a sipariş
numarası yazılır — başka hiçbir yere dokunulmaz:
```json
"private": { "orders": ["4815162342"] }
```
- Numara Etsy'deki gibi yazılabilir (`"#4815 162342"` de olur; `/start` gibi rakamlara indirgenir, 8–12 rakam). Birden çok sipariş
  (ör. ek tur, ikinci site) için listeye eklenir. Boş liste `[]` = henüz kimse başlatamaz, yalnız dükkân.
- **Gizli olduğu her yer:** `listThemes`, `/start` ve `/my` tasarım seçicisi, üretim listesi, satış sitesi (liste, tasarım sayfası,
  vitrin, sitemap, llms.txt — bunlar yalnız `lib/marketing/config.ts designs[]`'tan beslenir: **özel tema oraya eklenmez**;
  `tests/g151.test.ts` gerçek tema klasörlerini tarayıp yakalar).
- **Alıcının linki:** `/start?theme=<id>&order=<sipariş no>` (sipariş no formda dolu gelir). Ayrıca alıcı `/my`'da sipariş no +
  e-postasını yazınca site yoksa doğrudan bu linke gider. Listede olmayan numara / numarasız link / başka tema: bilinmeyen temayla
  **aynı cevap** ("This start link is not valid"; `POST /api/start` → 404 `theme_unavailable`) — tasarımın varlığı sızmaz. Satış
  sitesinde olmadığı için üretimdeki onay kapısı (G080) özel temaya uygulanmaz; sipariş numarası yeterli.
- **Dükkân:** Admin → **Yeni sipariş** özel temayı her zaman ("(özel tasarım)") ve her sipariş numarasıyla başlatır; Tasarımlar
  sayfası rozet + sipariş numaraları + numaralı başlatma linki gösterir. **Demo** (`/start/demo/<id>`) yalnız admin oturumuyla açılır
  (`Cache-Control: private, no-store`); alıcının `/start` sayfasında demo önizlemesi yoktur. Başlatılmış sitenin paneli, örnek tarih
  ve yayını normal çalışır.
- `scripts/theme-check.cjs` özel temada `/start` demo kontrolünü atlar (uyarı), diğer kontroller aynı.

## 4. Görevler
| ID | İş | Bağımlı |
|---|---|---|
| G035 | Tasarım 03 statik demo (ilk tema kaynağı) | — |
| G037 | Platform iskeleti: Next.js, tema şablon motoru, local adaptör, site rotaları, test | — |
| G038 | Tasarım 03'ü tema olarak platforma taşı | G035, G037 |
| G039 | Düzenleme paneli (alanlar, foto yükleme, önizleme, yayınla) | G037 |
| G042 | RSVP: misafir formu → veri, panelde liste + CSV | G037 |
| G043 | Supabase adaptörü + şema + RLS + storage | G037 · **kullanıcı onayı** |
| G044 | Vercel önizleme yayını | G038 · **kullanıcı onayı** |
| G045 | `/start` sahiplenme akışı (sipariş no + e-posta → taslak site + düzenleme linki) | G039 |
| G060 | Panel v2 (sihirbaz, Home/Edit/Guests/Share) + düzenleme hakkı + 12 ay arşiv | G039, G045 |
| G046 | Tema standardı belgesi + GPT website parça listesi (Paket W) | G038 |
