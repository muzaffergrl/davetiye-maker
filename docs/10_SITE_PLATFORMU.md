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
  (`rsvps/<site>/<id>.json`, yazma çakışması yok); fotoğraflar `media/<site>/...`. Düşük hacim için yeterli.
- Satış hacmi artınca Supabase/Postgres adaptörü (G043) ile değiştirilir; adaptör arayüzü aynı kalır.
- Durum (2026-10-13): Supabase projesi açma oturum izin denetiminde reddedildi; Vercel bağlantısı proje açamıyor (403).
  Vercel çözülmeden canlı yayın yok. Demo tasarım 03, statik önizleme olarak claude.ai sayfasında:
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
