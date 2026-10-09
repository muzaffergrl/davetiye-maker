---
id: GV02B
baslik: Video pilotu · Tasarım 02 — GPT kliplerini Canva'da master kopyasına yerleştir (hibrit)
rol: claude-tarayici
durum: blokaj
alan:
oncelik: 1
bagimli: [GV02A]
yazar: [collections/02_Dusty_Blue/canva/]
---

## Amaç
GPT kliplerini Canva'ya yükleyip master'ın **kopyasında** her sayfanın arka planına video olarak koymak; Canva metin ve fotoğraf katmanlarını videonun son karesine hizalamak. Master'a dokunulmaz.

## Girdiler
- `gorevler/roller/claude-tarayici.md` §6
- `collections/02_Dusty_Blue/assets/gpt/video/`
- Master: `DAHXhAaKIhI` (https://www.canva.com/d/Vm8qVW0Y1D4rdcP)

## Yapılacaklar
1. Master'ın kopyasını oluştur, adı: `Dusty Blue — VIDEO HYBRID TEST (satış dışı)`.
2. 6 klibi Canva'ya yükle (Uploads); her klibi kendi sayfasında tam sayfa arka plan video olarak koy (Set as background veya tam sayfa boyut, en alt katman).
3. Videoda zaten görünen statik katmanları (zarf, mühür, kart, polaroid çerçeveleri, köşe botanikleri) o kopyada gizle/sil; metinleri ve fotoğraf kutularını bırak.
4. Metinleri ve fotoğraf kutularını videonun son karesindeki kart/çerçeve konumlarına hizala; fotoğraflara ve kart metinlerine video bittikten sonra görünecek şekilde basit Fade/Rise animasyonu ve gecikme ver.
5. Sayfa sürelerini klip sürelerine eşitle; MP4 export al ve kontrol et (hizalama, okunurluk, geçişler).
6. Kopyanın design ID ve edit linkini `canva/DESIGNS.json` → `video_hybrid_test` alanına yaz.

## Bitti sayılması için
- [ ] MP4 export izlendi; metin ve fotoğraflar kartlara/çerçevelere oturuyor
- [ ] DESIGNS.json'da kayıt var

## Sonuç
_(görevi yapan ajan doldurur: ne yapıldı, hangi dosyalar, ne test edildi / edilmedi, blokaj, önerilen yeni görevler)_

## Günlük
- 2026-10-09 İPTAL (kullanıcı kararı K19): GPT video aracı yok, Higgsfield kullanılmayacak; animasyon Canva-yerel (GA02). Alınmaz.
