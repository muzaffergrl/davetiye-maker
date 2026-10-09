---
name: icerik-tutarlilik
description: Bir koleksiyonun video, website, misafir PDF'i ve START HERE dosyalarındaki isim, tarih, saat, mekân, program, RSVP ve link bilgilerinin tek içerik kaydıyla birebir aynı olduğunu denetle. İçerik değiştiğinde, export öncesinde ve satış öncesi kontrolde kullan.
---

# İçerik tutarlılığı

Formatlar kendiliğinden senkronize değildir. Tek doğru kaynak, koleksiyonun
`content.*.json` kaydıdır (şema: `docs/03_URUN_ICERIK_SEMASI.json`).

## Adımlar
1. Kaydı doğrula:
   ```bash
   python tools/validate_content.py collections/<koleksiyon>/content.<ad>.json
   ```
   HATA varsa önce kaydı düzelt. Çıktıdaki **canonical metinler** referanstır.
2. Her formatı oku ve canonical metinlerle birebir karşılaştır:
   - Video master (sahne 1 isimler, sahne 4 davet/tarih/saat/mekân, sahne 5 program, sahne 6 RSVP)
   - Website (açılış, davet, program, venue, RSVP bölümü, geri sayım hedefi + saat dilimi)
   - Misafir PDF / görsel
   - START HERE PDF (demo bilgileri ve linkler)
3. Linkler: `urls.*` null ise ilgili buton/QR yer tutucu ve açıkça demo mu? Dolu ise her
   formatta aynı hedef mi?
4. `optional_blocks` false olan bölüm hiçbir formatta görünmemeli.
5. Sonucu tablo olarak raporla:

| Alan | Kayıt | Video | Website | PDF | Not |
|---|---|---|---|---|---|

Okunamayan format "kontrol edilemedi" diye yazılır, eşleşti sayılmaz.

## Tarih/saat kuralı
US: `Saturday, June 12, 2027` · `4:00 PM`. UK/AU: `Saturday, 12 June 2027` · `4:00 pm`.
Sayısal (`06/12/27`) biçim kullanılmaz.
