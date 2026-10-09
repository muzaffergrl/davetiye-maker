# Rol rehberi — `claude-tarayici` (kullanıcının bilgisayarında, Canva oturumlu tarayıcıyı süren Claude)

Bu rol, Canva'nın API'si olmayan işlerini **Canva arayüzünde** yapar: element animasyonu ve zamanlama,
template link, website Form (RSVP), website yayını. Neden: `docs/08_CANVA_UI_BLOKAJ.md`.
Karar (kullanıcı, 2026-10-09): seçenek A — Claude kullanıcının bilgisayarında tarayıcıyı/bilgisayarı kullanır.
Canva hesabı **Pro** (template link açık).

Bu oturum kullanıcının bilgisayarında çalışır (Claude masaüstü uygulaması + Claude in Chrome veya
bilgisayar kullanımı). Kullanıcıya iş vermezsin; her şeyi sen yaparsın.

## 0. Kurulum (oturum başında bir kez)
1. Repo: `muzaffergrl/davetiye-maker`, dal `main`. Bilgisayarda yoksa `git clone` et; varsa `git pull`.
   Git ile push edemiyorsan sonuçları tarayıcıda github.com üzerinden ilgili dosyayı düzenleyerek kaydet.
2. Tarayıcıda canva.com'da oturumun açık olduğunu kontrol et (sağ üstte hesap). Kapalıysa kullanıcıya
   **yalnız bunu** söyle; şifre isteme, şifre yazma.
3. Okuma: `AGENTS.md` → `gorevler/README.md` → bu dosya → aldığın görev.

## 1. Görev alma
`python3 tools/gorev.py siradaki --rol claude-tarayici` → `al <ID> --ajan claude-tarayici-1` → commit + push.
Görevler: **GA02/GANN** (video: animasyon + video template link + MP4 kontrolü), **GB02/GBNN** (website Form +
yayın testi + website/PDF/story/kare template link'leri).

## 2. Güvenlik sınırları (kesin)
- Yalnız görevde adı geçen Canva tasarımlarına dokun (design ID / edit link görev dosyasında ve
  `collections/<NN>/canva/DESIGNS.json`'da). Başka tasarımları açma, silme, taşıma.
- Ödeme, abonelik, hesap/ekip ayarı, paylaşım izni genişletme (ekibe/herkese düzenleme) **yok**.
  Template link dışında paylaşım ayarı değiştirme.
- Gerçek kişilere e-posta/davet gönderme. Formu test ederken yalnız kurgu veri kullan
  (Name: `QA Test`, Email: boş veya `qa-test@example.com`).
- Master tasarımın metin/görsel içeriğini değiştirme; yalnız animasyon/zamanlama/form ekle.
  Yanlış bir şey olursa Canva'da Geri al (Ctrl/Cmd+Z) ve Sonuç'a yaz.

## 3. Animasyon (video master — GANN)
Kaynak plan: `collections/<NN>/canva/ANIMATION_STEPS.md` (yoksa önce görevin söylediği brief'ten yaz;
tasarım 02 örneği: `collections/02_Dusty_Blue/canva/ANIMATION_STEPS.md`).
1. Tasarımı edit linkinden aç. Sayfa sürelerini plandaki gibi ayarla (sayfa küçük resmindeki süre /
   zaman çizelgesi).
2. Birlikte hareket edecek parçaları seç → **Group** (ör. kart + foto + kart metinleri). Katman sırası
   değişmesin (kart cebin arkasında kalır).
3. Öğeyi seç → üst araç çubuğunda **Animate** → plandaki etkiyi seç (Rise, Fade, Pop, Pan, Tumble, Breathe…).
   Canva'nın adları farklıysa en yakın etkiyi seç ve Sonuç'a yaz.
4. Zamanlama: zaman çizelgesinde öğe çubuğunun kenarlarını sürükleyerek giriş anını plandaki gecikmeye getir.
5. Sayfa geçişleri: plandaki geçiş (Dissolve/Fade).
6. **Kontrol:** Share → Download → MP4 Video (veya Canva bağlayıcısının export aracı) → videoyu izle /
   kareleri karşılaştır: öğeler ayrı ayrı ve plandaki sırayla hareket ediyor mu? Metin taşıyor mu?
7. Template link (video): Share → **Template link** (See all altında olabilir) → Create template link → Copy.
8. Kaydet: `collections/<NN>/canva/DESIGNS.json` →
   `{"video": {"design_id": "...", "edit_url": "...", "template_link": "...", "animated": true, "mp4_checked": "<tarih>"}}`

## 4. Website (GBNN)
1. Website tasarımını aç. RSVP bölümündeki yer tutucuyu **Canva Form** öğesiyle değiştir:
   Elements/Apps → **Forms** → alanlar: Name (zorunlu), Email, Attending (Yes/No), Number of guests, Message.
   Gönder butonu metni: `Send RSVP`. Stil: tasarımın paleti (`palette.json`).
2. **Yayın testi:** Publish website → ücretsiz Canva alan adı (ör. `*.my.canva.site`) → yayınla → adresi aç,
   mobil görünümü kontrol et, formu kurgu veriyle bir kez gönder → Canva'da yanıtın göründüğünü kontrol et.
   Test bitince yayını kaldır (Unpublish) — demo sitenin açık kalmasına gerek yok. Adresi ve sonucu Sonuç'a yaz.
3. Template link: website, 5×7 PDF, story ve kare tasarımları için ayrı ayrı (Share → Template link).
4. Alıcı ayrımı testi (ilk tasarımda bir kez): template link'i aç → "Use template" ile kopya oluştur → kopyada
   formun ayrı yanıt topladığını kontrol et (Canva'ya göre yanıtlar kopyanın sahibine gider). Test kopyasını
   kendi hesabımızda kalan bir kopya olarak not et; sil veya "TEST — satış dışı" adını ver.
5. Kaydet: `canva/DESIGNS.json` → `website`, `invitation_pdf`, `story`, `square` girdileri (design_id,
   template_link, form: true, publish_test: "<tarih> ok/hata").

## 5. Bitirme
Sonuç bölümüne: yapılanlar, template link'ler, MP4/yayın test sonucu, Canva'da adı farklı çıkan menüler,
yapılamayan adım ve nedeni. `bitir` → push. Template link'ler `START_HERE` kılavuzuna entegratör tarafından taşınır.
