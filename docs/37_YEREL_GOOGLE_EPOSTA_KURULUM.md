# Yerel oturum talimatı: e-posta + Gmail sipariş doğrulaması + Google Sheets (bkestudio01@gmail.com) — K51 (2026-10-23)

Bulut oturumu Google hesabına, Vercel'in `bkestudio` ekibine ve bkestudio.com'a ulaşamıyor. Bu işi kullanıcının bilgisayarındaki
Claude (Claude in Chrome; Google ve Vercel'de oturum açık; docs/30 ve docs/36 ile aynı oturum) yapar. Aşağıdaki bloğu **olduğu gibi**
yerel oturuma yapıştır. Karar: K51 (docs/01). Ayrıntı ve gerekçe: docs/10 §3 ("E-posta gönderimi", G192), docs/22 (Google Sheets).

Kodun okuduğu adlar (main, `platform/lib/mail/config.ts`, `lib/mailbox/config.ts`, `lib/google/config.ts`, `lib/google/oauth.ts`,
`lib/panel/http.ts`): SMTP 465 TLS (587 STARTTLS), IMAP `imap.gmail.com:993`, Google kapsamı yalnız
`https://www.googleapis.com/auth/drive.file`, geri dönüş adresi `PLATFORM_PUBLIC_URL` + `/api/google/callback`. Kod yalnız Sheets
API'sini çağırır (`sheets.googleapis.com/v4/spreadsheets`); Drive API çağrısı yok.

---

```
Görev: BKE Studio platformunda (bkestudio.com, Vercel ekibi bkestudio, proje davetiye-maker) e-posta gönderimini, Gmail'deki Etsy
satış e-postalarıyla sipariş doğrulamasını ve Google Sheets bağlantısını dükkânın Google hesabı bkestudio01@gmail.com ile aç.
Sırayla yap; bir adım başarısızsa DUR ve olduğu gibi raporla. Yapılmamış adımı yapılmış yazma.
SIR KURALI: uygulama şifreleri, client secret, token anahtarı hiçbir dosyaya, commit'e, sohbete, ekran görüntüsüne yazılmaz.
Değeri üretildiği yerden doğrudan Vercel'in değer alanına yapıştır; ekran görüntüsünü Vercel değeri maskeledikten sonra al.

0) Ön kontrol
   - Repo: muzaffergrl/davetiye-maker → `git fetch origin && git checkout main && git pull`.
   - Tarayıcıda Google hesap seçicide etkin hesap bkestudio01@gmail.com olmalı (başka hesapla hiçbir adım yapma).
   - https://bkestudio.com/privacy ve https://bkestudio.com/terms aç: durum kodlarını yaz (/terms entegre main yayınlanınca gelir;
     404 ise 4b'de Terms alanını boş bırak ve raporda söyle).
   - Vercel → bkestudio → davetiye-maker → Settings → Environment Variables (Production): şu adların VAR/YOK durumunu yaz
     (değerleri okuma): PLATFORM_PUBLIC_URL, MARKETING_SITE_URL, CLAIM_ORDER_VERIFICATION, CRON_SECRET, ADMIN_PASSWORD,
     SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE, MAIL_FROM, ADMIN_NOTIFY_EMAIL, ORDER_MAIL_USER, ORDER_MAIL_PASS,
     ORDER_MAIL_HOST, ORDER_MAIL_PORT, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_TOKEN_KEY.
     Beklenen: PLATFORM_PUBLIC_URL = MARKETING_SITE_URL = https://bkestudio.com (sonda / yok); CLAIM_ORDER_VERIFICATION = trust
     (değilse DEĞİŞTİRME, raporla); CRON_SECRET var (yoksa 3'te ekle). GOOGLE_TOKEN_KEY zaten varsa ASLA değiştirme (Etsy
     token'ları da bu anahtardan türetilir; değişirse bütün bağlantılar düşer).

1) Google hesabı → iki uygulama şifresi (bkestudio01@gmail.com)
   a) https://myaccount.google.com/security → "2 Adımlı Doğrulama" açık mı? Kapalıysa aç; Google telefon kodu isterse kod
      sahibinin telefonuna gelir: bana sor, kodu ben söylerim.
   b) https://myaccount.google.com/apppasswords → ad "BKE site SMTP" → Oluştur → 16 harfli şifre (yalnız bir kez gösterilir).
      Pencereyi kapatmadan 3'teki SMTP_PASS alanına yapıştır (boşluklu da olur; kod boşlukları atar).
   c) Aynı sayfada ikinci şifre: ad "BKE site IMAP" → 3'teki ORDER_MAIL_PASS alanına yapıştır.
      (İki ayrı şifre: biri sızarsa yalnız o iptal edilir. Uygulama şifreleri menüsü yoksa dur ve raporla.)

2) Gmail ve Etsy bildirimleri
   a) Gmail (bkestudio01) → Ayarlar (dişli) → Tüm ayarları görün → "Yönlendirme ve POP/IMAP": IMAP erişimi "etkin" (seçenek
      yoksa IMAP zaten hep açıktır, geç) → kaydet.
   b) Aynı ayarlar → "Etiketler": "Tüm Postalar" satırında "IMAP'te göster" işaretli olmalı (kod Tüm Postalar'da arar; kapalıysa
      admin "NO_ALL_MAIL" hatası verir).
   c) Etsy (studiobke) → Settings → Account settings → Email: hesabın e-postası ne? bkestudio01@gmail.com değilse DEĞİŞTİRME;
      dur ve raporla (karar gerekir: Etsy e-postası değişir mi, yoksa ORDER_MAIL_USER o adres mi olur).
      Settings → Emails (bildirimler): "Someone purchases from my shop" / satış bildirimi açık olmalı; değilse aç ve yaz.

3) Vercel ortam değişkenleri — Settings → Environment Variables → Add (yalnız **Production**; Preview/Development'a EKLEME:
   önizleme yayınları gerçek e-posta göndermesin). Sır olanları "Sensitive" işaretle:
     SMTP_HOST            smtp.gmail.com
     SMTP_PORT            465
     SMTP_USER            bkestudio01@gmail.com
     SMTP_PASS            (1b'deki şifre)                                   Sensitive
     MAIL_FROM            BKE Studio <bkestudio01@gmail.com>
     ADMIN_NOTIFY_EMAIL   bkestudio01@gmail.com
     ORDER_MAIL_USER      bkestudio01@gmail.com
     ORDER_MAIL_PASS      (1c'deki şifre)                                   Sensitive
     GOOGLE_CLIENT_ID     (4d'den)
     GOOGLE_CLIENT_SECRET (4d'den)                                          Sensitive
     GOOGLE_TOKEN_KEY     (yalnız YOKSA) 32 rastgele bayt, base64url        Sensitive
     CRON_SECRET          (yalnız YOKSA) aynı komutla üretilen değer        Sensitive
   EKLEME: SMTP_SECURE, ORDER_MAIL_HOST, ORDER_MAIL_PORT (kodun varsayılanları doğru: 465 → TLS, imap.gmail.com:993).
   ORDER_MAIL_USER ve ORDER_MAIL_PASS ikisi birlikte girilir (biri eksikse kutu "ayarlanmadı" görünür).
   Token anahtarı (yalnız yoksa) — ekrana basmadan panoya üret, sonra Vercel alanına yapıştır:
     macOS:      node -e "process.stdout.write(require('crypto').randomBytes(32).toString('base64url'))" | pbcopy
     Windows:    node -e "process.stdout.write(require('crypto').randomBytes(32).toString('base64url'))" | Set-Clipboard
   (Kodun kabul ettiği biçim: 43 karakter base64url / 44 karakter base64 / 64 hex; `lib/google/config.ts parseTokenKey`.)
   GOOGLE_CLIENT_ID ve GOOGLE_CLIENT_SECRET 4d'de oluşur: orada gir. Sonra 5.

4) Google Cloud (console.cloud.google.com, hesap bkestudio01@gmail.com)
   a) Proje seçici: docs/22 ile önceden açılmış bir proje ("BKE Studio RSVP" ya da "BKE Studio") varsa onu kullan; yoksa
      New project → ad "BKE Studio" → Create. Hangisini kullandığını ve proje ID'sini yaz.
   b) APIs & Services → Library → "Google Sheets API" → Enable. (Drive API kodda çağrılmıyor; açmak gerekmez.)
   c) Google Auth Platform (APIs & Services → OAuth consent screen) → Get started / Branding:
      - App name: BKE Studio · User support email: bkestudio01@gmail.com · Developer contact: bkestudio01@gmail.com
      - Audience / User type: External
      - App home page: https://bkestudio.com · Privacy policy: https://bkestudio.com/privacy ·
        Terms of service: https://bkestudio.com/terms (0'da 404 ise boş bırak) · Authorized domains: bkestudio.com
      - App logo: YÜKLEME (logo, Google'ın marka doğrulamasını başlatır).
      - Data access → Add or remove scopes → filtre "drive.file" → yalnız
        https://www.googleapis.com/auth/drive.file ("See, edit, create, and delete only the specific Google Drive files you use
        with this app") → Update → Save. Başka kapsam EKLEME (kod başka kapsam istemez; fazlası doğrulama gerektirir).
      - Audience → Publishing status "Testing" → "Publish app" → "In production". (Testing'de kalırsa yalnız test kullanıcıları
        bağlanır ve izin 7 günde düşer.)
      Doğrulama hakkında: drive.file Google'ın "hassas olmayan" (non-sensitive) kapsamı; kapsam doğrulaması, "doğrulanmamış
      uygulama" uyarısı ve 100 kullanıcı sınırı yalnız hassas/kısıtlı kapsamlar içindir. Google yine de Verification Center'da
      marka doğrulaması (brand verification) isterse ekranda yazanı AYNEN raporla; alan adı sahipliği isterse: Search Console →
      Add property → Domain → bkestudio.com → TXT kaydı → Vercel → bkestudio → Domains → bkestudio.com → DNS Records → TXT ekle →
      Verify. (DNS Vercel'de değilse dur ve raporla.) Bu kontrol bu belgeyi yazan oturumda denenmedi.
   d) Clients (APIs & Services → Credentials) → Create client → Application type "Web application" → Name "BKE Studio web" →
      Authorized JavaScript origins: boş → Authorized redirect URIs: tam olarak
          https://bkestudio.com/api/google/callback
      (www yok, sonda / yok; PLATFORM_PUBLIC_URL + /api/google/callback ile birebir) → Create.
      Client ID → GOOGLE_CLIENT_ID, Client secret → GOOGLE_CLIENT_SECRET (yeni konsol secret'ı bir kez gösterir; kaybolursa
      istemcide "Add secret" ile yenisi). JSON indirme; dosyaya kaydetme.
      Var olan bir istemci kullanıyorsan redirect URI listesinde yukarıdaki adresin birebir olduğunu yaz.

5) Yeniden yayın: Vercel → davetiye-maker → Deployments → en üstteki Production (Ready) → ⋯ → Redeploy (ortam değişkenleri
   ancak yeni yayında okunur). Yeni yayın "Ready" olana kadar bekle; deployment id'sini ve commit'ini yaz.

6) Doğrulama (gerçek tarayıcı; mobil görünüm 390 px yeterli)
   a) https://bkestudio.com/admin → giriş (admin şifresi sende yoksa bana sor) → Özet → "Bağlantılar" kartı:
      - "E-posta gönderimi" rozeti "Açık" → "Test e-postası gönder" → ekranda "Test e-postası gönderildi (bkestudio01@gmail.com)…"
        → bkestudio01 gelen kutusunda (yoksa spam) "Test email from BKE Studio" geldi mi?
      - "Sipariş e-postaları (Gmail)" rozeti "Açık", açıklamada bkestudio01@gmail.com → "Gelen kutusunu dene" → ekrandaki
        cümleyi aynen yaz ("Gmail'e bağlanıldı. Son 30 günde Etsy'den N e-posta var…"). Hata metni çıkarsa aynen yaz, dur.
      - "Etsy mağazası": "Sipariş kontrolü:" satırında mod "Önce güven (trust)" mı? Aynen yaz.
   b) Test sitesi: https://bkestudio.com/start?theme=olive-ivory → sipariş no 999920261023 (test numarası; 8–12 rakam),
      e-posta bkestudio01@gmail.com, isimler "Test & Deneme" → panel açılıyor mu? bkestudio01'e iki e-posta beklenir:
      "Your private edit link — Olive & Ivory" (alıcı) ve "New website started — order not verified yet (#999920261023)"
      (dükkân; trust modu). Hangileri geldi, yaz.
   c) Panelde 3 adımlı kurulumu geç (foto şart değil) → Publish (trust'ta hemen açılır) → Guests → "Email me when a guest
      replies" aç → Google Sheets → "Connect Google Sheets" → Google izin ekranı: hesap bkestudio01, uygulama adı ve istenen izin
      (yalnız "only the specific Google Drive files you use with this app" olmalı) → Allow → panelde "Connected · Last synced …"
      → "Open sheet": Drive'da "<isimler> — RSVP replies" tablosu, Replies + Summary sayfaları.
   d) Gizli pencerede misafir olarak https://bkestudio.com/<slug> → RSVP → bir yanıt gönder (ad "Sheets Test") → tabloyu yenile:
      satır birkaç saniyede geldi mi? bkestudio01'e "New RSVP: Sheets Test — attending" e-postası geldi mi?
   e) (İsteğe bağlı) https://bkestudio.com/my → aynı sipariş no + e-posta → "Email me a sign-in link" → "Sign in to your wedding
      website — order #999920261023" geldi mi?
   f) Temizlik: panel → Guests → Google Sheets → "Disconnect" → /admin → test sitesi → "Siteyi sil" (adresi yazarak) → silindi
      mi? Drive'daki test tablosunu sil. Gmail'deki test e-postaları kalabilir.

7) Kanıt ve kayıt
   - Ekran görüntüleri (değer görünmeyen): Vercel env listesi (maskeli), Google Auth Platform Branding + Data access + Audience
     ("In production"), OAuth istemcisinin redirect URI'si, admin Bağlantılar kartı + iki test sonucu, Google izin ekranı,
     panelde "Connected", tablodaki RSVP satırı, gelen e-postaların listesi (yalnız konu satırları) →
     docs/10_canli_test/<YYYYMMDD>/ (çalıştırdığın gün; ör. 20261024).
   - docs/10 §2c sonuna tek madde: "- **E-posta + Gmail sipariş doğrulaması + Google Sheets açıldı (<tarih>, yerel oturum,
     docs/37):** env adları (değer yok), Google Cloud proje ID'si, yayın (deployment id, commit), admin test e-postası ✓/✗,
     Gelen kutusunu dene: N Etsy e-postası, test sitesi e-postaları ✓/✗, Sheets satırı ✓/✗, RSVP e-postası ✓/✗, temizlik ✓/✗,
     Google'ın doğrulama durumu (aynen)".
   - Commit (yazar SENİN Git kimliğin; Vercel ekip dışı yazarı engelliyor) → `git pull --rebase origin main` → push.

8) Bitince bana: hangi adımlar tamam, hangileri değil; Etsy hesabının e-posta adresi (2c); Google'ın doğrulama durumu;
   bir hata varsa ekrandaki metin. Hiçbir sırrı yazma.
```

---

**Kullanıcıdan gereken:** yalnız bu bloğu yerel oturuma yapıştırmak. Oturum şunları sorabilir: Google'ın telefon kodu (2 Adımlı
Doğrulama kapalıysa), admin şifresi, Etsy hesabının e-postası bkestudio01 değilse ne yapılacağı.

**Sonra (bulut oturumu / entegratör):** 6b'deki trust bildirimi ve "Gelen kutusunu dene" sonucu gelince `CLAIM_ORDER_VERIFICATION=trust`
anlam kazanır: Etsy uygulaması onaylanana kadar sipariş, Gmail'deki Etsy satış e-postasından saatte bir doğrulanır (G192). İlk gerçek
satışta admin'de sitenin "Onaylandı" olduğuna bakılır (Etsy'nin satış e-postası biçimi gerçek bir e-postayla henüz görülmedi).
