---
id: GM02
baslik: BKE Studio marka kiti — vektör logo, renk/yazı token'ları, favicon seti, Etsy ikon/banner, "Made with" rozeti
rol: claude-kod
durum: inceleme
alan: claude-marka
oncelik: 1
bagimli: [GM01]
yazar: [brand/, platform/public/brand/]
---

## Amaç
GM01'in GPT çıktılarından kullanılabilir marka kiti. Claude yeni şekil çizmez (K21); yalnız vektöre çevirir, temizler,
ölçülere oturtur, renkleri ölçer, yerleşim kurar.

## Yapılacaklar
1. `monogram`, `monogram_small`, `wordmark`, `logo_horizontal`, `logo_stacked` → temiz SVG (izleme/vektörleştirme; düz
   renk, gereksiz düğüm yok). Renk varyantları: ana renk, siyah, beyaz (alfa üstünden).
2. `brand_board_final` renk kartlarından hex ölç → `brand/tokens.json` (anchor, accent, paper, ink, secondary) + kontrast
   tablosu (metin ≥ 4.5:1). Wordmark'a yakın Google Fonts (OFL) başlık + metin eşleşmesi önerisi; font dosyası repoya girmez.
3. Favicon seti (16, 32, 180, 192, 512 + `favicon.ico`) `monogram_small`'dan → `platform/public/brand/`.
4. Etsy: dükkân ikonu (`shop_icon` → 500×500 ve 1000×1000), büyük banner (`brand_scene_wide` + yazı logosu → güncel Etsy
   banner ölçüsü; yüklemeden önce Etsy yardım sayfasından doğrulanır), mini banner. Yükleme yok (Etsy hesabı gelince).
5. Misafir sayfası alt bilgisi için küçük "Made with BKE Studio" rozeti (SVG; açık ve koyu zemin).
6. `brand/README.md`: kısa marka rehberi (logo kullanım alanı, en küçük boy, renkler, yanlış kullanımlar), kaynak listesi.
7. Satış sitesi (G061) ve panel (G060) bitmişse marka yapılandırmasındaki `[BRAND]` yerine "BKE Studio" ve logo bağlantısı —
   **kullanıcı adı kesin onaylamadan yayına alınmaz.**

## Bitti sayılması için
- [x] SVG'ler tarayıcıda ve 32 px'te temiz; renk varyantları
- [x] tokens.json + kontrast tablosu
- [x] favicon seti, Etsy ikon/banner dosyaları, "Made with" rozeti
- [x] brand/README.md

## Sonuç
- **İzleme (K21: yeni şekil yok):** 5 GPT PNG'si potrace 1.16 ile izlendi ve 17 SVG çıktı (`brand/svg/`).
  - Sembol çokgen kipinde izlendi. Yazıda B eğri, K ve E çokgen, "Studio" eğri.
  - Düğüm sayıları: monogram 16, monogram_small 17, wordmark 254, yatay 221 (+3 altın), dikey 204 (+3 altın).
  - Varyantlar: anchor (yatay/dikeyde altın şeritle), black #000, white #FFF; yatay/dikeyde ayrıca reverse (kâğıt + altın).
  - Temizlik: kenar tırtıkları, köşe pahları ve monogram_small'ın alt kenar lekeleri. Dik/yatay kenarlar hizalandı.
  - monogram'da kesik köşe ucu kare kenarına 2,7 px hizalandı.
  - Wordmark rengi #202020'den ana renk #2B1526'ya çevrildi.
- **Kontrol (izleme):**
  - Her SVG Chromium'da kaynak PNG ölçeğinde çizildi ve alfa maskesiyle karşılaştırıldı. 1 px'ten büyük sapma yok (monogram'daki bilinçli hizalama hariç).
  - `brand/proofs/svg_proof.png`: açık/koyu zeminde, 32 ve 16 px'te bakıldı.
  - B-K-E Studio yazımı bütün dosyalarda gözle doğrulandı. Dikey logo 32 px'te okunmuyor; README'de en küçük boyu 64 px.
- **Renk ve kontrast:**
  - Hex'ler panonun 5 kartından ölçüldü: anchor #2B1526, accent #D0AE6A, paper #EDE5D7, ink #202020, secondary #9F84A7, zemin #FAF7F0.
  - Kartlar %100 tek renk; GM01 bunları zaten düz renge indirmişti, yani ölçülen değer o düzleştirilmiş renk.
  - Kontrast tablosunda 22 çift var. Altın ve lavanta açık zeminde metin olamaz (1.69–3.32).
- **Yazı tipi önerisi** (yalnız ad, font dosyası yok): Archivo 900 Expanded (BKE), Montserrat 300 +0.08em (Studio), DM Sans 400/500 (metin).
  Karşılaştırma `proofs/font_match.png`; fontlar logoya yakın ama aynısı değil.
- **Favicon** (`platform/public/brand/`): `icon.svg`, `favicon.ico` (16/32/48), `favicon-16/32.png`, `apple-touch-icon.png` (180), `icon-192/512.png`.
  - 16/32 px'te K'nin kesikleri kâğıt rengiyle dolu, böylece koyu sekmede de okunur.
  - Favicon piksel ızgarasına otursun diye kareye ~%3 esnetildi.
  - Göz kontrolü (`proofs/favicon_proof.png`): 32 px net. 16 px'te K okunuyor ama kapak çizgisi ~1 px ve yumuşak.
- **Etsy** (`brand/etsy/`):
  - İkon 500/1000: `shop_icon.png` izlendi, sembol %70 daire içinde.
  - Büyük banner 3360×840 ve mini banner 1600×213: GPT sahnesi + yazı logosu SVG'si.
  - Büyük banner'da fotoğraf ~1,9× büyütüldü ve hafif yumuşak.
  - `help.etsy.com` proxy'den açılamadı. Ölçüler Etsy Handbook/Help Center arama özetlerinden alındı ve README'de [VERIFY] olarak işaretli.
  - Yükleme yapılmadı.
- **Rozet:** `brand/badge/made-with-bke-studio-{light,dark}.svg`. "Made with" DM Sans 500 harf yollarına çevrildi. Bağlantı hedefi kararlaştırılmadı, temalara bağlanmadı.
- **Bağlanması gerekenler** (bu görevde kod değişmedi; ad kesin onayından sonra):
  1. `platform/lib/marketing/config.ts`:
     - `brand.name: '[BRAND]'` → `'BKE Studio'`
     - `brand.logo: null` → JSON-LD logo yolu (ör. `/brand/icon-512.png`, ya da logo SVG'si public'e kopyalanınca onun yolu)
  2. `platform/components/marketing/Shell.tsx`:
     - başlık (15–16. satır): yazı yerine `bke-logo-horizontal-anchor.svg`
     - alt bilgi (68. satır): `-reverse.svg`
     - önce bu SVG'ler `platform/public/brand/`e kopyalanmalı
  3. `platform/app/(marketing)/layout.tsx` 35–36: geçici `/marketing/favicon.svg` yerine
     `/brand/icon.svg` + `/brand/favicon.ico` + apple `/brand/apple-touch-icon.png`.
  4. Kök `platform/app/layout.tsx`: metadata'da icon yok (panel/misafir). İstenirse aynı set ve 192/512 için bir manifest eklenir.
- **Yapılmadı / test edilmedi:**
  - gerçek tarayıcı sekmesinde favicon (yalnız Chromium çizimi ve büyütülmüş prova)
  - iOS/Android ana ekran
  - Etsy yükleme ekranı ve mobil banner kırpımı
  - baskı
  - marka/tescil araştırması

## Günlük
- 2026-10-14 açıldı (entegratör): GM01'e bağlı
- 2026-10-14 alindi: claude-marka
- 2026-10-14 bitti, incelemeye gönderildi: claude-marka; 17 SVG, tokens.json, favicon seti, Etsy ikon/banner, "Made with" rozeti, README
