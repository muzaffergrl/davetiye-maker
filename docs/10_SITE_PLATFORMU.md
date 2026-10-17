# Site platformu — kendi sitemiz + düzenleme paneli (K24, 2026-10-13)

Kullanıcı kararı K24: teslim Canva değil. Alıcı, kendi sitesini **bizim platformumuzda** bir panelden
düzenler. Bu belge platformun tek kaynağıdır.

## 1. Alıcı akışı
1. Etsy'den bir tasarım (tema) satın alır. İndirdiği kısa PDF'te **başlat linki** var: `/start?theme=<tema>`.
2. `/start`: Etsy sipariş numarası + e-posta → taslak site oluşur → **düzenleme linki** verilir
   (gizli anahtarlı, şifresiz). Link e-postayla gönderilir (e-posta sağlayıcısı sonra; ilk sürümde ekranda gösterilir + "kaydet" uyarısı).
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
     `POST /api/signin` → 503).
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
- Eski not (2026-10-13 sabah): bulut oturumunun Vercel bağlantısı proje açamıyordu (403); statik önizleme
  https://claude.ai/artifact/LBc4yLieUxQnLtRZ72dxwm (özel; panel yok).

## 3. Açık konular (kullanıcı / sonra)
- **Barındırma ve maliyet:** bağlı hesaplar Vercel (`daimonflora-gmailcom's projects`) ve Supabase
  (`dflora27's Org`, içinde ilgisiz 2 proje var — dokunulmaz). Yeni Supabase projesi / Vercel projesi açmak
  **kullanıcı onayı** ister. Ticari kullanımda ücretli plan gerekebilir (Vercel Hobby ticari değil;
  Supabase ücretsiz projeler hareketsizlikte duraklar) — satışa çıkmadan karar.
- **Alan adı / marka:** marka seçilmedi; ilk sürüm `*.vercel.app`.
- **Etsy sipariş doğrulama:** ilk sürüm biçim kontrolü + kayıt; Etsy API doğrulaması sonra (mağazanın Etsy API uygulaması +
  kullanıcı onayı gerekir). Ara çözüm (G060-fix): `CLAIM_ORDER_VERIFICATION=manual` — taslak hemen açılır, ama sipariş dükkân
  tarafından Etsy'de kontrol edilip `node scripts/verify-order.ts --order <no> --reason "…"` ile onaylanana kadar yayın ve
  paylaşılan önizleme kapalı. Satış sitesinin yayın kapısı `verified.orderCheck` true olmadan `launched: true` kabul etmez.
- **E-posta gönderimi** (düzenleme linki, RSVP bildirimi): sağlayıcı seçimi sonra.
- **Gizlilik metni** (misafir verisi): yayından önce.

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
