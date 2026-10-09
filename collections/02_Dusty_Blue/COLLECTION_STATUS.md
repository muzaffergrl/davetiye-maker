# Koleksiyon 02 — Dusty Blue & Champagne (çalışma adı)

**Durum:** `editable_draft` — Canva video master yeni Canva hesabında yeniden kuruldu (`DAHXhAaKIhI`, animasyonsuz, **taslakta — onay + commit bekliyor**). Satış ürünü değil. Son güncelleme: 2026-10-09.

## Amaç
Kullanıcı, grafik üretimin kim tarafından yapılacağına (Claude kodla / GPT görsel modeliyle)
karar verebilmek için bir örnek istedi. Bu örnek tamamen **kodla** (HTML/CSS/SVG) çizildi:
hiçbir AI raster görsel, stok fotoğraf veya rakip varlığı kullanılmadı.

## Ne var
| Dosya | Ne? |
|---|---|
| `video/invitation_motion.html` | 1080×1920, ~26 sn animasyon kaynağı; tarayıcıda açınca oynar (REPLAY butonu) |
| `previews/dusty_blue_invitation_html_render.mp4` | Kaynaktan render edilen MP4 (H.264, 30 fps) — **Canva'dan değil, HTML'den** |
| `previews/*_t*.png` | Anahtar kareler (HTML render) |
| `content.demo.json` | Demo içerik kaydı (Eleanor & Theo — kurgu) |

Render: `NODE_PATH="$(npm root -g)" node tools/render_motion.mjs <html> <mp4> 26 30 --stills=2,9.8`

## Akış (zaman çizelgesi)
| Süre | Sahne |
|---|---|
| 0–3 sn | Zarf + mum mühür, "A Love Letter From Eleanor & Theo" |
| 3–6 sn | Mühür kalkar, kapak açılır (astar desenli), kart zarftan yükselir |
| 7–11 sn | "Our Story" — üç polaroid sırayla uçarak yerleşir |
| 11–16.5 sn | Davet kartı: aileler, isimler, davet cümlesi, klasik tarih kutusu, mekân |
| 17–21 sn | Program: Ceremony / Cocktail Hour / Reception + kıyafet |
| 21.6–26 sn | RSVP: son tarih, buton, mühür, kapanış cümlesi |

## Görsel kimlik
Pudra mavisi zemin + fildişi kağıt + şampanya altın detaylar; okaliptüs dalları, beyaz
çiçekler, altın eğrelti; pudra mavisi mum mühür (E&T kabartma).

| Token | Renk |
|---|---|
| ink | `#2B3A4E` |
| blue-deep | `#4E6782` |
| blue | `#6E88A3` |
| mist | `#DDE5EC` |
| gold | `#B8996A` |
| gold-light | `#D9C49E` |
| ivory | `#FBF7EF` |

Fontlar (hepsi Google Fonts ve Canva'da mevcut adaylar — alıcı hesabında doğrulanmalı):
Pinyon Script (isim/başlık), Cormorant Garamond (bilgi), Montserrat (küçük başlıklar).

## Bilinen sınırlar (dürüst)
- Fotoğraflar **yer tutucu** (soyut manzara + "YOUR PHOTO" etiketi). Gerçek ilan görselleri için gerçek/lisanslı fotoğraf gerekir.
- Botanikler vektör çizim; fotogerçekçi dantel/kağıt/mum dokusu değil. Fotogerçekçi doku görsel modelle (ör. GPT) daha iyi üretilir.
- Bu dosya Canva'da düzenlenebilir proje **değildir**. Canva'ya taşımak için: dekor katmanları ayrı PNG/SVG, metinler Canva metni, animasyonlar Canva'nın kendi animasyonlarıyla yeniden kurulmalı — bu aşama yapılmadı.
- RSVP butonu ve website metni görseldir; bağlantı yok.

## Set paketi durumu (`docs/05_SET_PAKETI.md`)
| # | Parça | Durum |
|---|---|---|
| A1 | Canva video (animasyonlu) | **v2 taslak** `DAHXhAaKIhI` (yeni hesap) · 6 sahne, 17 ayrı görsel katman, tüm metinler Canva metni · transaction `1558763910934449378` **commit edilmedi** (onay bekliyor) · önizleme: `previews/canva_master_v2_draft_6scenes.png` (Canva önizlemesi) · animasyonlar yok: Canva API'de animasyon işlemi yok, PPTX içe aktarma animasyon taşımıyor → `canva/ANIMATION_STEPS.md` arayüzde · eski master `DAHXgy2GM3s` eski hesapta, bu hesaptan açılmıyor |
| A2 | Canva website + Form RSVP | başlanmadı |
| A3 | Davetiye PDF | başlanmadı |
| A4 | Paylaşım görseli (story + kare) | başlanmadı |
| A5 | Kullanım kılavuzu PDF | başlanmadı |
| B1–B3 | Etsy ilan görselleri, video, ilan PDF'i | başlanmadı |

GPT istekleri: `assets/gpt/GPT_PROMPTS.md` (Paket 1 dokular/dekor · Paket 2 fotoğraflar · Paket 3 mockup'lar).
Canva yükleme çalışıyor (canva.com izinli). Katman yeniden yükleme/PPTX araçları: `tools/build_canva_pptx.py` (Canva doğrudan PPTX yüklemeyi reddediyor; import-design-from-url herkese açık URL ister). Export indirme çalışıyor (`export-download.canva.com` izinli).
