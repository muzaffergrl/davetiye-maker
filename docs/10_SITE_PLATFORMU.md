# Site platformu — kendi sitemiz + düzenleme paneli (K24, 2026-10-13)

Kullanıcı kararı K24: teslim Canva değil. Alıcı, kendi sitesini **bizim platformumuzda** bir panelden
düzenler. Bu belge platformun tek kaynağıdır.

## 1. Alıcı akışı
1. Etsy'den bir tasarım (tema) satın alır. İndirdiği kısa PDF'te **başlat linki** var: `/start?theme=<tema>`.
2. `/start`: Etsy sipariş numarası + e-posta → taslak site oluşur → **düzenleme linki** verilir
   (gizli anahtarlı, şifresiz). Link e-postayla gönderilir (e-posta sağlayıcısı sonra; ilk sürümde ekranda gösterilir + "kaydet" uyarısı).
3. Panel (`/edit/<slug>?k=<anahtar>`), telefonda rahat: isimler, tarih/saat, mekân, program satırları,
   metinler, isteğe bağlı bölümler, fotoğraf yükleme (kırpma), RSVP son tarihi. Canlı önizleme. **Yayınla.**
4. Site: `/<slug>` = kapalı zarf açılış sayfası → `/<slug>/home` → `/story`, `/details`, `/rsvp`.
5. Misafir RSVP gönderir → çift yanıtları panelde görür, CSV indirir.

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
- Eski not (2026-10-13 sabah): bulut oturumunun Vercel bağlantısı proje açamıyordu (403); statik önizleme
  https://claude.ai/artifact/LBc4yLieUxQnLtRZ72dxwm (özel; panel yok).

## 3. Açık konular (kullanıcı / sonra)
- **Barındırma ve maliyet:** bağlı hesaplar Vercel (`daimonflora-gmailcom's projects`) ve Supabase
  (`dflora27's Org`, içinde ilgisiz 2 proje var — dokunulmaz). Yeni Supabase projesi / Vercel projesi açmak
  **kullanıcı onayı** ister. Ticari kullanımda ücretli plan gerekebilir (Vercel Hobby ticari değil;
  Supabase ücretsiz projeler hareketsizlikte duraklar) — satışa çıkmadan karar.
- **Alan adı / marka:** marka seçilmedi; ilk sürüm `*.vercel.app`.
- **Etsy sipariş doğrulama:** ilk sürüm biçim kontrolü + kayıt; Etsy API doğrulaması sonra.
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
| G046 | Tema standardı belgesi + GPT website parça listesi (Paket W) | G038 |
