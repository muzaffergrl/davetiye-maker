---
id: G069
baslik: RSVP yanıtları çift için düzenli ve şık — özetler, soru cevap dökümü, yeni yanıt işareti, misafir isimleri, yazdırılabilir liste
rol: claude-kod
durum: alindi
alan: claude-G069
oncelik: 1
bagimli: [G060]
yazar: [platform/components/panel/, platform/lib/, platform/app/api/, platform/themes/olive-ivory/rsvp.html, platform/themes/blush-garden-rose/rsvp.html, platform/tests/, platform/README.md, platform/previews/g069/]
---

## Amaç
Kullanıcı (2026-10-14): "RSVP talepleri müşterilere görünmeli, düzenli, harika bir şekilde". Panel v2'de Guests sekmesi var
(Coming/Not coming/Replies sayıları, süzgeç, arama, kart, CSV). Bunu düğün planlayan bir çiftin gerçekten işine yarayan,
şık bir misafir yönetimine çevir.

## Yapılacaklar
1. **Özet paneli:** gelen kişi toplamı, gelmeyen, yanıt veren, son tarihe kalan gün; **özel soruların cevap dökümü** (ör. menü
   seçimi: Chicken 12 · Fish 5 · Vegetarian 3; evet/hayır soruları yüzde), diyet/alerji notları tek listede.
2. **Misafir isimleri:** RSVP formunda "kaç kişi" > 1 ise ek kişilerin adları (isteğe bağlı alanlar; tema formu sözleşmesine eklenir,
   01 ve 03 rsvp.html güncellenir). Panelde parti olarak gösterilir; CSV her kişiyi ayrı satır verir.
3. **Yeni yanıt işareti:** son ziyaretten beri gelen yanıtlar "New" rozeti + Home'da "3 new replies" kartı; okundu işaretleme.
4. **Sıralama/süzgeç:** en yeni, isim, katılım; soru cevabına göre süzgeç (ör. yalnız Vegetarian).
5. **Düzenleme:** çift bir yanıtı elle ekleyebilir/düzeltebilir (telefonla gelen yanıtlar için) — kaynak "Added by you" işaretli.
6. **Dışa aktarma:** CSV (Excel/Google Sheets uyumlu, UTF-8 BOM, enjeksiyon güvenli) + **yazdırılabilir liste** (A4/Letter,
   tarayıcı yazdırma görünümü).
7. Erişilebilirlik ve mobil: 390 px'te tek elle kullanım, dokunma hedefi ≥ 44 px; boş durumlar dürüst metinle.
8. **Yapılmayacak (sağlayıcı yok):** yeni yanıt e-posta bildirimi — yalnız arayüz yeri ve "Coming soon" değil, hiç gösterme;
   Sonuç'a öneri olarak yaz.
9. Testler: API (ekle/düzelt/sil, özet hesapları), tarayıcı yolculuğu (misafir 3 kişilik yanıt → panel özet + New → CSV satırları),
   `rsvp-browser.ts`, `g060-browser.ts` geçmeli. Önizleme `platform/previews/g069/`.

## Bitti sayılması için
- [ ] Özet + soru dökümü + misafir isimleri + New + sıralama/süzgeç + elle ekleme + CSV/yazdır çalışıyor; testler geçti

## Sonuç

## Günlük
- 2026-10-14 açıldı (entegratör): kullanıcı isteği; panel v2 düzeltme turu bitince başlar
- 2026-10-14 alindi: claude-G069
