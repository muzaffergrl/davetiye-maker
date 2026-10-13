# Local çalışma — kullanıcının bilgisayarındaki Claude oturumu için kurulum (2026-10-13)

Kullanıcı kararı: "local'e geçelim, kurulumu sen yap". Bu belge **kullanıcının bilgisayarında çalışan Claude**
içindir. Kullanıcıya iş verilmez (AGENTS.md kalıcı talep 6); yalnız Vercel'e **kendi tarayıcısında bir kez giriş**
yapması gerekir (şifreyi Claude yazmaz, istemez).

Neden local: bulut oturumunun Vercel bağlantısı proje açamıyor (403), Etsy bulutta engelli, kullanıcı siteyi
telefonunda canlı görmek istiyor. Kod ve görev protokolü aynı: repo `muzaffergrl/davetiye-maker`, dal `main`,
`gorevler/README.md`.

## 1. Ortam (Claude yapar)
1. İşletim sistemini tespit et. Eksikse kur: `git`, **Node.js 22**, **Python 3.11+**
   (Windows: `winget install Git.Git OpenJS.NodeJS.LTS Python.Python.3.12`; macOS: Homebrew ile `git node@22 python`).
   Kurulum yönetici onayı isterse kullanıcıya yalnız "çıkan pencerede Evet'e bas" de.
2. Klasör: kullanıcının belgeler klasöründe `davetiye-maker`. Yoksa `git clone https://github.com/muzaffergrl/davetiye-maker.git`;
   varsa `git pull`. GitHub girişi gerekirse tarayıcıdan giriş yeterli (Git Credential Manager / `gh auth login --web`).
3. Bağımlılıklar:
   - `python -m pip install -r tools/requirements.txt`
   - `cd platform && npm ci && npx playwright install chromium`
4. Doğrula: `npm test`, `npm run typecheck`, `npm run build` (platform/), `python tools/tests/test_kit_check.py` vb.
   Hepsi geçmeli; geçmeyeni Sonuç'a yaz, uydurma.

## 2. Telefonda canlı önizleme (aynı Wi-Fi)
`npm run seed && npm run build && npx next start -H 0.0.0.0 -p 3000` → bilgisayarın yerel IP'sini bul
(`ipconfig` / `ipconfig getifaddr en0`) → kullanıcıya `http://<ip>:3000/<demo-slug>` ve panel linkini ver.
Güvenlik duvarı izin sorarsa yalnız "özel ağlar"a izin.

## 3. Vercel yayını (görev G044)
1. `npx vercel@latest login` yerine sabit sürüm kullan (`npx vercel@<güncel kararlı sürüm> login`); tarayıcı açılır, **kullanıcı
   kendi hesabıyla onaylar** (Vercel ekibi: `daimonflora-gmailcom's projects`).
2. Proje: `davetiye-platform`, kök dizin `platform`, framework Next.js, fonksiyon bölgesi `iad1`.
3. Depolama: Vercel **Blob** deposu oluştur — **erişimi PRIVATE olmalı** (anahtar hash'leri, taslaklar, misafir RSVP'leri
   tutuluyor; fotoğraflar `/media` rotasından sunulur) — ve projeye bağla (`BLOB_READ_WRITE_TOKEN` otomatik gelir).
   Bağladıktan sonra G048 Sonuç'undaki gerçek depo duman testini çalıştır (slug/sipariş tekilliği, ETag çakışması, RSVP listesi). Ortam: `DATA_ADAPTER=blob`
   (adaptör G048 main'de ve onaylı). **Supabase kullanılmaz** (`docs/10` §2c).
4. Önce **preview** yayını; demo siteyi tohumla (seed betiğinin blob hedefi), kullanıcıya site + panel linki.
5. Ücretli plana geçiş, alan adı satın alma, ekip ayarı **yok** — gerekirse kullanıcıya sor.
6. Sonuç: proje adı/ID, yayın URL'si, ortam değişkeni adları (değerleri değil) → `gorevler/G044-*.md` Sonuç + `docs/10` §2c.

## 4. Etsy araştırması (tarayıcı)
Claude in Chrome açıksa kullanıcının tarayıcısında yeni sekmede Etsy'de "wedding website template", "digital wedding
invitation website", "envelope wedding invitation website" ara; ilk 30 ilanın görsel dili, açılış şovu, fiyat aralığı,
teslim biçimi (link/Canva/Templett), yorumlarda şikâyet/övgü → `docs/13_ETSY_ARASTIRMA.md`. Rakip görseli/çizimi
kopyalanmaz (AGENTS.md şart 6); yalnız gözlem ve ekran görüntüsü adı/linki.

## 5. Kurallar
- Şifre/anahtar yazma, isteme, repoya koyma. Ortam değişkeni değerleri sohbete yazılmaz.
- Kullanıcıya elle iş verme; giriş/onay gibi tek tıklık adımlar dışında her şeyi sen yap.
- Bulut oturumu da aynı repoda çalışır: her push'tan önce `git pull --rebase origin main`.
