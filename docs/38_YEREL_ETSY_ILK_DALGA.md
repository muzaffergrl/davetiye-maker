# Yerel oturum talimatı: Etsy ilk satış dalgası (yalnız 01–20) — K55 (2026-10-23)

Bulut oturumu etsy.com'a ulaşamıyor (vekil 403). Bu işi kullanıcının bilgisayarındaki Claude (Claude in Chrome, Etsy'de oturum
açık; docs/30 ve docs/36 ile aynı oturum) yapar. Aşağıdaki bloğu **olduğu gibi** yerel oturuma yapıştır. Kararlar: K55 (ilk dalga
yalnız 01–20), K54 (22–32 yeni tasarım), K53 (bir siparişte iki tasarım), K50 (destek e-postası) — docs/01.

Bu belge docs/30 adım 4 ve docs/36'nın yerini alır (orada geçen 1.460 TL ve "21 tasarım" eskidi: fiyat 1.190 TL K49, ilk dalga 20).
Durum (docs/20 §7.13, 2026-10-23): Etsy'de **Draft 52** (49 tasarım + 3 hizmet), Active 0.

İlk dalga — `tools/listing_v4/etsy_ids.json`:

| # | Etsy ID | Tasarım | # | Etsy ID | Tasarım |
|---|---|---|---|---|---|
| 01 | 4600002514 | Olive & Ivory | 11 | 4600003789 | Boho Pampas |
| 02 | 4600005628 | Dusty Blue | 12 | 4600005789 | Tropical Destination |
| 03 | 4599984175 | Blush Garden Rose | 13 | 4600007817 | Enchanted Forest |
| 04 | 4600010892 | Vintage Airmail | 14 | 4600009955 | Ivory Lace Pearl |
| 05 | 4599990097 | Lemon Mediterranean | 15 | 4600035556 | Cherry Blossom |
| 06 | 4600016288 | Art Deco Noir | 16 | 4600013891 | Sunflower Rustic |
| 07 | 4599994711 | Burgundy Velvet | 17 | 4600015727 | Emerald Gold Estate |
| 08 | 4599997141 | Winter Evergreen | 18 | 4600042900 | Wildflower Vellum |
| 09 | 4600023014 | Lavender Provence | 19 | 4600021307 | Midnight Garden |
| 10 | 4600001025 | Tuscan Vineyard | 20 | 4600023273 | Coastal Seaside |

Taslak kalanlar: **21** (4600049152), **22–49** (`tools/etsy_ids_22_48.json`, 49 = 4601572630) ve **3 hizmet** (setup-service
4601001732, custom-design 4601005548, extra-revision 4601008536).

---

```
Görev: BKE Studio Etsy dükkânında (studiobke.etsy.com, Shop Manager) ilk satış dalgasını hazırla ve — yalnız ben açıkça
"yayınla" dediğimde — YALNIZ 01–20'yi yayınla. Sırayla yap; bir adım başarısızsa DUR ve olduğu gibi raporla. Yapılmamış adımı
yapılmış yazma.

KESİN SINIRLAR
- Ben "yayınla" demeden HİÇBİR ilanı yayınlama (Publish / Activate / Renew yok).
- Yayınlanacak olanlar yalnız şu 20 ID: 01 4600002514 · 02 4600005628 · 03 4599984175 · 04 4600010892 · 05 4599990097 ·
  06 4600016288 · 07 4599994711 · 08 4599997141 · 09 4600023014 · 10 4600001025 · 11 4600003789 · 12 4600005789 ·
  13 4600007817 · 14 4600009955 · 15 4600035556 · 16 4600013891 · 17 4600015727 · 18 4600042900 · 19 4600021307 ·
  20 4600023273. 21 (4600049152), 22–49 ve 3 hizmet TASLAK kalır.
- Listings ekranında toplu seçim YOK ("Select all", "Select N on all pages", toplu Publish/Activate). Her ilan kendi düzenleyicisinden
  (https://www.etsy.com/your/shops/me/listing-editor/edit/<ID>) tek tek.

0) Ön koşul: entegre main yayında
   - `git fetch origin && git checkout main && git pull`.
   - Vercel → bkestudio → davetiye-maker → Deployments: Production (Ready) yayınının commit'ini (<P>) yaz. Sonra:
       git merge-base --is-ancestor $(git log origin/main --format=%H --grep=G951 -1) <P> && echo "G951 yayında"
       git merge-base --is-ancestor $(git log origin/main --format=%H --grep=G954 -1) <P> && echo "G954 yayında"
     (grep boş dönerse o iş henüz main'de değil.) G951 (bir siparişte birden çok tasarım) yayında değilse 3a'daki
     "Bought two designs? …" cümlesini ÇIKAR. G954 (21 ve 49 satış sitesinde "Coming soon") yayında değilse raporda söyle (Etsy adımlarını engellemez).
   - https://bkestudio.com/start, /privacy, /terms, /kvkk durum kodlarını yaz.
   - `python3 tools/etsy_upload.py --check --strict` → çıkış 0 olmalı (değilse dur, çıktıyı yaz).

1) Dijital dosyalar (bütün taslaklar; yeni görünümlü START HERE, destek adresi bkestudio01@gmail.com)
   - Değişen PDF'ler (son yükleme 519d39f8'den, docs/20 §7.13):
       git diff --name-only 519d39f86 origin/main -- 'collections/*/package/customer/*.pdf'
     Listede olan her tasarımın taslağında (01–49 hangisi değiştiyse; ID'ler tools/listing_v4/etsy_ids.json ve
     tools/etsy_ids_22_48.json) eski dijital dosyayı kaldır → collections/<NN_*>/package/customer/START_HERE.pdf yükle →
     "Save draft". Hizmet PDF'leri listede varsa aynısı:
       setup-service  4601001732  collections/_services/setup-service/package/customer/SETUP_SERVICE.pdf
       custom-design  4601005548  collections/_services/custom-design/package/customer/CUSTOM_DESIGN.pdf
       extra-revision 4601008536  collections/_services/extra-revision/package/customer/EXTRA_REVISION.pdf
   - Her taslağı kayıttan sonra yeniden aç ve dosyayı oku: ad, boyut ve dosya ID'si (bugünkü yüklemeden mi; §7.13 yöntemi —
     boyut eski/yeniyi ayırt etmeyebilir). Hiçbir başka alana dokunma. Liste boşsa bu adımı atla ve söyle.

1b) Açıklama (2026-10-23 inceleme; 0'da G951 yayında değilse ATLA ve söyle): taslak açıklamaları hâlâ "One website per order"
   diyor. 01–20'nin (ve isteğe bağlı 21–49'un) her taslağında Description alanını sil → collections/<NN_*>/package/listing/
   etsy_upload.json içindeki `description` değerini AYNEN yapıştır → "Save draft" → yeniden açıp oku: "One website for each design
   you buy (two designs in one order: one website each)" ve "Terms of use: https://bkestudio.com/terms" satırları var mı. Başka alana
   dokunma.

2) Yer tutucu — 22–32 ilan medyası (K54): yeni tasarımdan yeniden çekilecek. Main'de şu komut yeni bir commit göstermiyorsa
   ATLA ve "re-render commit'i yok" yaz:
       git log --oneline d3becd6db..origin/main -- 'collections/2[2-9]_*/package/listing/images_v4' 'collections/3[0-2]_*/package/listing/images_v4' 'collections/2[2-9]_*/package/listing/video_v4_4x5.mp4' 'collections/3[0-2]_*/package/listing/video_v4_4x5.mp4'
   Varsa: 22–32 taslaklarında §7.13 yöntemi (medya penceresinde bütün görseller + video silinir, images_v4/01…19 sırayla ve
   video_v4_4x5.mp4 yüklenir; 19 görsel + 1 video tutmadan kaydetme; kayıttan sonra yeniden açıp say). Bu taslaklar yayınlanmaz.

3) Dükkân metinleri (Shop Manager → Settings → Info & Appearance; ve Shop Home editor → FAQ)
   a) "Message to Buyers for Digital Items" alanını sil ve AYNEN şunu yapıştır (0'da G951 yoksa "Bought two designs? …" cümlesini çıkar):

Thank you for your order!

Website design: open the START HERE PDF in your download and tap the start link (or go to https://bkestudio.com/start and choose your design). Enter your Etsy order number and email. Bought two designs? Start each one with the same order number and email.
Continue later on any device: https://bkestudio.com/my

Service (setup, custom design or extra revision): your PDF explains what to send us and what happens next.

Questions? Message us on Etsy with your order number.

      (500 karakter; cümle çıkarılırsa daha az.) Kaydet → sayfayı yenile → alanı oku, metin birebir mi (karakter sayısını yaz).
   b) Shop FAQ (Shop Home editor → Frequently asked questions; en çok 10 madde, cevap ≤ 750): yalnız şu iki maddenin cevabını
      değiştir (soru aynı kalır; madde sayısı 10 kalır):
      - "Do I need an account or a password?" →
        No. Your Etsy order number and the email you start with open your editor on any phone or computer. You also get a private edit link as a shortcut.
      - "What if I lose my edit link?" →
        No problem: on any phone or computer, open the "Create your website" page of our website (the address is in your START HERE guide) and enter your Etsy order number and the email you started with. Your editor opens where you left off.
      - Yalnız docs/37 adım 6d başarılıysa (Google Sheets'e RSVP satırı düştü) üçüncü madde: "How do my guests reply?" →
        On your RSVP page, with no app or account. You see every reply in your editor and can download them as Excel (or CSV) in one tap, or connect your own Google Sheet.
      Kaydet → yeniden oku.
      (Herkese açık SSS'de alan adı yazılmaz: docs/19 §4.3; adres alıcıya START HERE'de ve sipariş mesajında gider.)

4) Yayın öncesi rapor (yayınlamadan)
   - 01–20'nin her düzenleyicisini aç ve oku: başlık, fiyat 1.190 TL, adet 999, dijital dosya START_HERE.pdf, 19 görsel + video,
     yenileme Automatic, bölüm. Tek tablo halinde bana göster.
   - Her tasarımın collections/<NN_*>/package/listing/etsy_upload.json → "open_checks" içinde "before publishing" maddelerini
     tek satırlık özet olarak listele (bunlar yayın kapısı değil, bilgi; kapı benim "yayınla" demem).
   - Etsy'nin ilan başına yayın ücreti (0,20 USD; docs/20 §7.11'de 15 ücretsiz kredi vardı) ekranda nasıl görünüyor, yaz.
   - Sonra DUR ve "yayınla" dememi bekle.

5) "yayınla" dediğimde: 01'den 20'ye sırayla, her biri için
   https://www.etsy.com/your/shops/me/listing-editor/edit/<ID> → alanlar 4'teki gibi mi (değilse dur) → Publish.
   Etsy ücret/ödeme onayı gösterirse metnini yaz; yeni bir ödeme yöntemi isterse DUR ve bana sor.
   Her yayından sonra Listings → Active sayısı bir arttı mı bak. Sonunda: Active 20, Draft 32 (21, 22–49, 3 hizmet) olmalı;
   iki listeyi de oku ve 21 / 49 / hizmetlerin Draft'ta olduğunu yaz.

6) İlan linkleri (docs/29 C)
   - Her yayınlanan ilanın herkese açık adresini al ("View on Etsy" → https://www.etsy.com/listing/<ID>/<slug>); <ID> yukarıdaki
     tabloyla aynı mı kontrol et (farklıysa gerçeğini kullan ve raporda söyle).
   - Repo DIŞINDA bir dosyaya yaz (ör. ~/linkler.txt), satır başına: `01 https://www.etsy.com/listing/4600002514/...` (01–20).
   - `python3 tools/ilan_baglantilari.py ~/linkler.txt` (kuru) → 20 satır, hata yok → `python3 tools/ilan_baglantilari.py
     ~/linkler.txt --yaz` → `git diff --stat` yalnız platform/lib/marketing/config.ts ve platform/lib/etsy/listings.json olmalı.
   - `cd platform && npm ci && npm run typecheck && npm test` → yeşilse commit (yazar SENİN Git kimliğin; Vercel ekip dışı yazarı
     engelliyor) → `git pull --rebase origin main` → push. `launched: true` YAPMA (docs/29 C3 bulut oturumunun işi).

7) Kanıt ve kayıt
   - Ekranlar: 1'deki dosya kontrolleri, 3a/3b kayıtlı hâli, 4'teki tablo, 5 sonrası Listings Active (20) ve Drafts (32) →
     docs/20_etsy_taslaklar_<YYYYMMDD>/ (çalıştırdığın gün).
   - docs/20_ETSY_DUKKAN_KURULUMU.md §7'ye yeni alt bölüm "### 7.14 İlk satış dalgası 01–20 (<tarih>, yerel oturum, Claude in
     Chrome; docs/38)": PDF değişimi (hangi taslaklar, dosya ID'leri), 22–32 medya durumu, yeni alıcı mesajı ve SSS (§1.5 ve §4.1
     metinlerini Etsy'deki yeni hâliyle değiştir; eskisini §7.14'te kısaca an), yayınlanan 20 ilan ve linkleri, Etsy'nin gösterdiği
     ücret/uyarılar, Active/Draft sayıları. docs/19 §4.4'teki "Message to Buyers for Digital Items" kutusunu da yeni metinle güncelle.
   - Commit + `git pull --rebase origin main` + push (6'daki commit'le birlikte olabilir).

8) Bitince bana: her adımın sonucu; yayınlanan 20 ilanın link listesi (6'daki biçimde); taslakta kalanların sayısı; Etsy uyarıları.
```

---

**Kullanıcıdan gereken:** bloğu yerel oturuma yapıştırmak; 4. adımdaki raporu görünce **"yayınla"** demek (ya da demeyip
düzeltme istemek). Link listesi bulut oturumuna gelince satış sitesinde `launched: true` için docs/29 C3 yapılır.
