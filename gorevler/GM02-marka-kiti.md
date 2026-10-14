---
id: GM02
baslik: BKE Studio marka kiti — vektör logo, renk/yazı token'ları, favicon seti, Etsy ikon/banner, "Made with" rozeti
rol: claude-kod
durum: hazir
alan:
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
- [ ] SVG'ler tarayıcıda ve 32 px'te temiz; renk varyantları
- [ ] tokens.json + kontrast tablosu
- [ ] favicon seti, Etsy ikon/banner dosyaları, "Made with" rozeti
- [ ] brand/README.md

## Sonuç

## Günlük
- 2026-10-14 açıldı (entegratör): GM01'e bağlı
