---
id: G063
baslik: Canlıda çapraz tarayıcı testi (Firefox, Edge, Chrome; telefon emülasyonu) — 01 ve 03, alıcı + misafir yolculuğu
rol: claude-tarayici
durum: hazir
alan:
oncelik: 1
bagimli: [G049]
yazar: [docs/17_CAPRAZ_TARAYICI_TESTI.md]
---

## Amaç
Şimdiye kadar yalnız Chromium (bulut) test edildi. Local oturum kullanıcının bilgisayarındaki gerçek tarayıcılarla canlı siteyi dener.

## Yapılacaklar
1. Firefox, Edge ve Chrome'un güncel sürümleriyle (masaüstü + DevTools telefon emülasyonu 390×844 ve 360×640):
   - misafir: `/clara-and-julian` zarf → açılış → home → story → details → RSVP gönder (kurgu veri) → takvime ekle (.ics indirilir mi)
   - alıcı: `/start?theme=olive-ivory` ve `?theme=blush-garden-rose` → test sipariş no + e-posta → panel → isim/tarih/foto değiştir → yayınla → QR
   - Firefox'ta view transition yokken solma yolu düzgün mü
2. Her sorun için ekran görüntüsü + tarayıcı/sürüm + adımlar → `docs/17_CAPRAZ_TARAYICI_TESTI.md`. Düzeltme yapma (bulut ajanları düzeltir);
   test siteleri ve RSVP'leri bitince sil (live-check'in temizlik yolu).
3. Gerçek iPhone/Android yok — yalnız emülasyon olduğunu açıkça yaz.

## Sonuç
_(görevi yapan ajan doldurur)_
