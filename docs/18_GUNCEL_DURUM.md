# Güncel durum — 16 Ekim 2026

Ürün (K22/K24): Etsy alıcısının **bizim platformumuzda panelden düzenlediği website**. Canva, video, PDF davetiye ve paylaşım
görseli teslimi yok. Kararlar: `docs/01_KULLANICI_KARARLARI.md` · görevler: `gorevler/PANO.md` · platform: `docs/10_SITE_PLATFORMU.md`.

## 1. Canlıda
- https://davetiye-platform-five.vercel.app — main `b952bc8` (platform ağacı `35ba50964db2`), yayın `dpl_HKT1NRKp895wEVEUbGKdzJCqU4RW`
  (aynı ağacın ikinci yüklemesi). Kontroller (docs/10): `npm test` 1189/1189 (19 atlanan), typecheck, build; `live-check` 60/60 (15–20
  dahil), `blob-smoke` 12/12; 20 tasarımın sayfası, `/start/demo/<id>` ve `/start?theme=<id>` 200.
- **20 platform teması** (01–20), satış sitesinde `/designs` 20 tasarım. Alıcı paneli (K29: 3 adımlı kurulum, 6 sayfalık Edit, Share,
  Guests/RSVP v2, şifre, teşekkür modu, isim/tarih hakkı). Dükkân paneli `/admin` v2 (G095).
- Satış sitesi `launched: false` (noindex). Fiyat, Etsy dükkân/ilan linki ve alan adı sitede yer tutucu.
- `ADMIN_PASSWORD` geçici kısa şifre (K33). Sipariş onayı ortam değişkeni için §4'e bak.

## 2. Entegratör dalında birleşti — main'de ve canlıda değil
Dal `claude/zealous-fermi-hy1o40`:
- **G099** satış vitrini: 8 öne çıkan + "See all" 20, açılış metinleri, tasarım sayfasında tek birincil eylem.
- **G100** alıcı paneli sadeleştirme (Refero P1): tek işli kurulum 1. adımı, link + Share önde başarı ekranı, tek "Sample" satırı,
  Guests liste + ayrı Results. Alıcı rehberi (docs/19) buna göre güncellendi.
- Admin Özet: Yapılacaklar en üstte.
- **G101-A/B**: 15–20 temalarında qa-kontrol bulguları düzeltildi (her tema `theme-check --stress` 128/0/0, g051 44/44, final-smoke 45/45).
- **Etsy dükkânı** (docs/20): STUDIOBKE'de tagline, duyuru, alıcı mesajları, About, 10 SSS, 3 bölüm, iptal politikası, logo/banner
  uygulandı; Offsite Ads kapalı. Kararlar K35–K41. `config.ts`: yanıt 24 saat, iade yok.
- **İlan paketi 01–05**: `listing_v3.md` + `etsy_upload.json` (`tools/etsy_upload.py`), ilan görselleri v4 editoryal (8 × 2000 px,
  `images_editorial/`, docs/21). **Etsy'ye yüklenmedi** (K41).
- Birleşik dalda toplu `npm test`/build ve canlı yayın kaydı yok (oturumlar ayrı ayrı yeşildi: G101-A 1208/1208, G101-B 1210/1210).
  Yayından önce birleşik ağaçta koşulmalı.

## 3. Sürmekte olan işler
| Görev | İş | Durum |
|---|---|---|
| G098 | 15–20 tema rötuşları (GM07 parçaları: R4/R5 → 17, R2 v2 → 20, R3 v3 → 16; R1/R6 reddedildi) | alt-ajanda |
| G121 | Panel ve satış sitesi kalanları | alt-ajanda |
| G123 | 06–20 Etsy ilan metinleri | alt-ajanda |
| G122 | START HERE (MD + PDF, gerçek QR) — 20 tasarım | açılacak |
| G124 | 06–20 ilan görselleri | açılacak |
| G090 | Aşama 1 kapanışı: 20 tasarım × (tema, satış sayfası, START HERE, ilan metni, ilan görselleri) + QA | G098, G121–G124'ü bekliyor |
| G065 | 01/03 ilan kiti (kullanıcının yerel ajanında `alindi`) | v4 görseller büyük olasılıkla yerini aldı; sahibi kapatmalı |

Aşama 2 (K16: her tasarıma ek 5 renk → 120 ürün) geçerli. Eski GP görevleri Canva dönemine göre yazılmış, blokajda; kullanıcının
yeni iş listesiyle yeniden tanımlanacak. Canva/video/PDF dönemi görevleri (189 adet) 16 Ekim'de `iptal` edildi.

## 4. Lansmanı bekleten kararlar
- **Fiyat:** hedef USD 29.40 (docs/20 §8). TL tutar ve kur güncelleme sıklığı (K38), liste fiyatı/indirim (docs/15 §5) açık. Sitede `[PRICE]`.
- **Etsy ilanları:** testlerden sonra yüklenecek (K41). İlan linkleri yok (`[ETSY LISTING URL]`). Dükkân adresi (studiobke.etsy.com) belli;
  sitede `[ETSY SHOP URL]` hâlâ yer tutucu.
- **Sipariş onayı (K34):** kayıtlara göre `CLAIM_ORDER_VERIFICATION=manual` 15 Ekim'de Vercel'e eklendi ve canlıda denendi (G092 Sonuç'u,
  "G096 yayını + K34"); `b952bc8` yayınında değişmedi. 16 Ekim'de ise canlıda açık olmadığı bildirildi; değer bu turda okunmadı.
  Yayından önce Vercel'de okunmalı ve K34'e göre `manual` olmalı.
- **E-posta altyapısı:** düzenleme linki, kayıp link ve RSVP bildirimi e-postayla gitmiyor (sağlayıcı yok).
- **Gerçek telefon testi:** `docs/20_ELLE_TEST_PLANI.md` (iPhone Safari, Android Chrome). Otomatik testler gerçek cihazı kapsamıyor.
- **React Bits Pro lisansı (G089, K31):** erişim ve lisans kapsamı doğrulanmadı. G088 bitti; G089 alınabilir.
- Diğer: gizlilik politikası (veri sorumlusunun adı ve iletişim bilgisi, docs/20 §7.2), `[ORDER CHECK TIME]`, `[EXTENSION POLICY]`,
  `[DELETION PROCESS]`, alan adı, lansmanda ≥ 12 karakterli `ADMIN_PASSWORD`.
