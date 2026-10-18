# 22 — Google Sheets bağlantısı (G128): Google Cloud kurulumu

Alıcı panelde **Guests → Google Sheets → Connect Google Sheets**'e dokunur, Google'da izin verir; kendi Drive'ında
"<İsimler> — RSVP replies" tablosu açılır (Replies + Summary sayfaları, Excel'le aynı düzen). Her yeni / düzeltilen /
silinen yanıtta ve yayınlamada (form alanları değişmiş olabilir) tablo baştan yazılır. Kod: `platform/lib/google/`,
uçlar `platform/app/api/edit/[slug]/google`, `platform/app/api/google/callback`.

**Bu adımlar yapılmadan düğme panelde görünmez** ("Google Sheets: coming soon" satırı çıkar); Excel indirme her durumda çalışır.

## Google Cloud'da yapılacaklar (bir kez, dükkân hesabıyla)

1. <https://console.cloud.google.com> → üstte proje seçici → **New project** → ad: `BKE Studio RSVP` → **Create**.
2. **APIs & Services → Library**: **Google Sheets API** → **Enable**; ardından **Google Drive API** → **Enable**.
3. **APIs & Services → OAuth consent screen** (yeni arayüzde **Google Auth Platform**):
   - **User type: External** → uygulama adı `BKE Studio`, destek e-postası, geliştirici e-postası (ticari bilgiler: sizin seçiminiz).
   - **Scopes / Data access → Add or remove scopes** → yalnız `https://www.googleapis.com/auth/drive.file` ekleyin
     (".../auth/drive.file — See, edit, create, and delete only the specific Google Drive files you use with this app").
     Başka kapsam eklemeyin.
   - **Publishing status → Publish app → In production.** (Testing'de kalırsa yalnız eklenen test kullanıcıları bağlanabilir
     ve izin 7 günde düşer.) `drive.file` hassas olmayan kapsam olduğu için Google doğrulaması gerekmemesi beklenir;
     Google yine de marka doğrulaması isterse ekrandaki adımları izleyin (alan adı / gizlilik politikası linki gerekebilir).
4. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - **Application type: Web application**, ad: `BKE Studio platform`.
   - **Authorized redirect URIs → Add URI:** `https://xn--bkestudo-zkb.com/api/google/callback`
     (G189: marka alan adı; eski Vercel adresi kayıtlıysa yenisini de ekleyin; adres `PLATFORM_PUBLIC_URL` + `/api/google/callback` ile **birebir** aynı olmalı).
   - **Create** → çıkan **Client ID** ve **Client secret**'i kopyalayın.
5. Vercel → proje → **Settings → Environment Variables** (Production):
   - `GOOGLE_CLIENT_ID` = Client ID
   - `GOOGLE_CLIENT_SECRET` = Client secret
   - `GOOGLE_TOKEN_KEY` = 32 rastgele bayt, ör. terminalde `openssl rand -base64 32` çıktısı. **Değiştirmeyin**: değişirse
     bütün bağlantılar düşer, çiftler yeniden bağlanmak zorunda kalır.
   - `PLATFORM_PUBLIC_URL` = `https://xn--bkestudo-zkb.com` olmalı (geri dönüş adresi bundan kurulur).
6. Yeniden yayınlayın (deploy). Panelde Guests'te "Connect Google Sheets" düğmesi görünür.

## Güvenlik ve veri

- Kapsam yalnız `drive.file`: uygulama yalnız kendi oluşturduğu dosyayı görür; alıcının Drive'ındaki başka hiçbir şeyi okuyamaz.
- Refresh token sitede ayrı bir belgede (`docs/<siteId>/google-sheets.json`, site kaydının dışında) **AES-256-GCM** ile şifreli
  (`GOOGLE_TOKEN_KEY`, site kimliği ek veri); log'a, panele, tarayıcıya hiç yazılmaz. Disconnect token'ı Google'da iptal eder ve siler;
  tablo alıcının Drive'ında kalır.
- OAuth `state` = `<slug>.<rastgele>`: aynı tarayıcı (HttpOnly çerez, 10 dk) + aynı site (hash site belgesinde) + tek kullanım.
  Panel uçları yalnız `Authorization: Bearer <düzenleme anahtarı>` kabul eder.
- Misafir hiç beklemez: senkron yanıttan sonra `after()` ile koşar. Hata olursa panelde "Sync failed — Sync now" (Google bağlantıyı
  reddettiyse "Connect again"). Alıcı tabloyu silerse sonraki senkron yenisini açar.

## Denenmedi (dürüst durum)

Gerçek Google hesabı / gerçek OAuth istemcisiyle uçtan uca deneme **yapılmadı** (bu oturumda kimlik bilgisi yok). Akış, Google'ın
token ve Sheets uçlarını taklit eden yerel sahte sunucuyla birim testinde denendi (`platform/tests/g128-rsvp-sheets.test.ts`).
İlk gerçek bağlantıdan sonra kontrol edin: izin ekranı metni, tablonun Drive'da açılması, başlık rengi / şeritler / filtre,
yeni misafir yanıtının birkaç saniye içinde tabloya düşmesi.
