---
id: G091
baslik: Alıcı yolculuğu — ilan, satın alma ve satış sonrası: alıcıda hiçbir soru işareti kalmasın (K32)
rol: claude-metin
durum: bitti
alan: claude-G091
oncelik: 1
bagimli: []
yazar: [docs/19_ALICI_YOLCULUGU.md, docs/05_SET_PAKETI.md, collections/01_Olive_Ivory/package/customer/, collections/02_Dusty_Blue/package/customer/, collections/03_Blush_Garden_Rose/package/customer/, collections/04_Vintage_Airmail/package/customer/, collections/05_Lemon_Mediterranean/package/customer/, collections/*/package/listing/listing.md, collections/*/package/listing/listing_v3.md]
---

## Amaç
K32 (kullanıcı, 2026-10-15): Etsy'de ilanı incelerken, satın alırken ve satın aldıktan sonra alıcının kafasında **hiçbir soru
işareti ve endişe** kalmamalı; siteyi **kolayca düzenleyebileceğine ikna olmalı**. Satış sonrası bütün bilgilendirmeler ve rehberler
hazır olmalı; alıcı ürünü en kolay şekilde istediği gibi düzenleyebilmeli.

## Yapılacaklar
1. `docs/19_ALICI_YOLCULUGU.md`: aşama aşama yolculuk haritası (ilanı görme → inceleme → satın alma → indirme → /start → kurulum →
   yayın → paylaşma → yanıtlar → düğün sonrası → arşiv); her aşamada alıcının olası soruları/endişeleri, bugün nerede cevaplandığı
   (ilan metni, ilan görseli, SSS, START HERE PDF, Etsy mesajı, /start, panel, satış sitesi rehberi) ve **boşluklar**.
2. Soru envanteri: satın alma öncesi + sonrası en az 40 soru, her birine kısa dürüst cevap ve cevabın konacağı yer.
3. Etsy metinleri (İngilizce): ilan açıklaması ortak iskeleti (What you get · How it works in 3 steps · What you can change ·
   What your guests see · What you need · FAQ), Etsy'nin dijital ürün "message to buyers" alanı ve **satış sonrası mesaj şablonları**
   (sipariş onaylandı / başlatma linki hatırlatma / kayıp düzenleme linki / isim-tarih hakkı / yayınla nasıl / iade-sorun). Şablonlar
   admin paneline bağlanacak (G087): her şablon için kısa ad, ne zaman gönderilir, metin, `{order}` `{names}` `{site_url}` `{edit_url}`
   `{shop}` yer tutucuları.
4. START HERE rehberini güncel panele göre yeniden yaz (K29: 3 adımlı kurulum, Home/Edit/Guests/Share, düzenleme linkini kaydetme,
   sipariş onayı bekleme hâli, isim/tarih hakkı, şifre, teşekkür modu): ortak İngilizce kaynak + 01–05 için tasarım adlı kopyalar;
   PDF'ler `tools/md_to_pdf.py` ile. Her adım gerçek ekrana göre (ekran görüntüleri `platform/previews/g060/`, `g066`, `g069`,
   `g075`, `g076`, `collections/*/package/shots/`).
5. Panel içi yardım ve /start metinleri için öneri listesi (dosya + mevcut metin → önerilen metin); kodu G087 uygular.

## Kurallar
Yalnız gerçekten çalışan özellik vaat edilir (docs/05 §E). Fiyat, destek e-postası, dükkân adı, yanıt süresi (SLA), iade politikası
**uydurulmaz**: açık yer tutucu kalır. Tarih biçimi `June 12, 2027`. Rakip metni kopyalanmaz.

## Sonuç
(claude-G091, 2026-10-15; worktree dalı, push yok — entegratör birleştirir)

**Yazılanlar**
- `docs/19_ALICI_YOLCULUGU.md` (yeni): §0 bulunan 10 soru işareti ve nerede kapandığı · §1 ürünün bugünkü gerçek davranışı (kaynak
  koddan, her cevabın dayanağı) · §2 15 aşamalı yolculuk haritası (soru / bugün nerede / boşluk / kapanış) · §3 **78 soruluk envanter**
  (EN kısa cevap, yer, durum ✓/V/K) · §4 ilan açıklaması ortak iskeleti, başlık/etiket kalıbı, ilan SSS'si, Etsy'nin iki otomatik
  alıcı mesajı (dükkân geneli → temasız `/start` tasarım seçicisi) ve **18 satış sonrası mesaj şablonu** (makine okunur JSON,
  `<!-- g091:templates:start -->` … `end`; alanlar `id`, `title`, `when`, `placeholders`, `body`[paragraflar], `note`) + kullanım
  kuralları · §5 START HERE yapısı · §6 **uygulama önerileri (G087'ye)**: admin A1–A6, `/start` B1–B5, panel C1–C6, satış sitesi
  D1–D6 (dosya + mevcut → önerilen) · §7 açık kalanlar · **Ek A START HERE ortak kaynağı** (yalnız `{DESIGN_NAME}`, `{START_URL}`).
- START HERE: `collections/0{1..5}_*/package/customer/START_HERE.md` + `START_HERE.pdf` (5 tasarım, Ek A'dan; 02'nin Canva dönemi
  metni değişti; 02/04/05 için `img/start_qr.{png,svg}` + `start_qr_page.png` `tools/make_qr.py` ile gerçek başlat URL'sinden).
  Yeni: "Start now: the first 5 steps", "Save your edit link: it is your key" (panelden yeniden kopyalama dahil), sipariş onayı
  bekleme, 6 sayfa tablosu, Headings & labels, isim/tarih hakkı, şifre, yanıtlar, teşekkür modu, online süresi, quick answers,
  troubleshooting. Düğme/başlık adları kaynak koddan birebir.
- İlan: `collections/0{1..5}_*/package/listing/listing_v3.md` (ortak iskeletten; durum tablosu, başlık ≤ 140, 13 etiket ≤ 20 —
  ikisi de betikle denetlendi —, açıklama, nitelikler, görsel listesi + alt metin, video, SSS, Etsy otomatik mesajları, şablon
  listesi, v2'den farklar, yayın öncesi kontrol listesi). Eski `listing.md`'ler silinmedi; 02'ninkine "OUT OF DATE" notu eklendi.
- `docs/05_SET_PAKETI.md`: docs/19 işaretçisi; A6 ve B1 satırları; §E "bütün yazı" (G068 sonrası kısmen doğru), barındırma süresi
  + K33, yeni satırlar (manuel sipariş onayı, şifre/teşekkür modu), kayıp link süreci; §G.
- **K33 uygulandı** (koordinatör, 2026-10-15): dükkân adı "BKE Studio", destek "bkestudio@gmail.com" bütün metinlerde; yanıt süresi
  `[RESPONSE TIME]` (config'teki adla aynı) yer tutucu.

**Doğrulama:** 5 PDF reportlab ile (1 sn; `tools/build_customer_guides.py`'nin 5 tasarımlı kazıma alanı kopyası — araç yalnız 01/03'ü
biliyor ve `tools/` yazma alanı dışında): her biri 7 sayfa, ~20 KB; tıklanabilir linkler (`/URI`) = başlat linki + gizlilik; ilk
sayfadaki QR ve `img/start_qr.png` jsqr ile çözüldü → doğru `/start?theme=<tema>` (10/10); 03'ün bütün sayfaları ve 04'ün ilk sayfası
render edilip gözle kontrol edildi. Şablon JSON'u ayrıştırıldı; kullanılan yer tutucular = `placeholders`, `{edit_url}` yalnız
`new_edit_link`'te. Tarayıcı/build testi koşulmadı (görev tanımı).

**Doğrulanmamış iddialar (metinlerde `[VERIFY]` ya da §7'de):** gerçek iPhone/Android; HEIC; Q&A ve RSVP sorularının canlıda uçtan
uca denenmesi; QR'ın telefon kamerasıyla okutulması; manuel sipariş onayının canlıda açık olması (entegratör bildirimi);
"Purchases and reviews → Download files" ve Etsy uygulamasında dijital indirme; Etsy otomatik mesaj alanlarının karakter sınırı;
AI beyanı/"Designed by"; ilan görselinde QR. **Rehberler K29 paneline göre; canlıda hâlâ G078 (eski panel) — G079 yayınlanıp
denetlenmeden PDF/ilan satışa girmez.**

**Açık kalanlar (karar):** `[RESPONSE TIME]`, `[ORDER CHECK TIME]`, `[REFUND POLICY]`, `[EXTENSION POLICY]`, `[DELETION PROCESS]`,
`[POSTPONEMENT POLICY]`, `[DESIGN SWITCH POLICY]`, fiyat, Etsy dükkân linki, alan adı, 48 aylık tavan.

**Önerilen görevler (entegratör açar):** (1) claude-kod: `build_customer_guides.py`'yi 5 tasarıma genişlet + kopyaları Ek A'dan üret;
`listing_kit.py`'yi `listing_v3.md`'ye geçir ve 02/04/05'i tanıt. (2) claude-kod: G079 sonrası 5 tema için `capture` + görseller (01/03
İG3 "every step in pictures" ve İG4/İG5 eski panel), önerilen İG9/İG10. (3) claude-tarayici: §4.4 mesajlarını Shop Manager'a gir.
(4) G087: docs/19 §6 A–D. (5) Gerçek telefon + QR kamera testi.

## Günlük
- 2026-10-15 açıldı ve alındı (claude-G091, kullanıcı isteği K32)
- 2026-10-15 bitti, incelemeye gönderildi
- 2026-10-16 entegratör onayladı
