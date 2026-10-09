---
name: qr-kod
description: Davetiye, website veya PDF için RSVP/website/konum QR kodu gerektiğinde kullan. Gerçek hedef URL'den algoritmik QR üretir; AI çizimi QR'ı engeller.
---

# QR kod üretimi

1. Hedef URL'yi içerik kaydının `urls` alanından al. `null` ise QR üretme; tasarımda açık
   bir yer tutucu bırak ve kullanıcıya hangi URL'nin gerektiğini tek cümleyle sor.
2. Üret (koleksiyon renginde, yüksek kontrast):
   ```bash
   pip install -r tools/requirements.txt   # bir kez
   python tools/make_qr.py "<URL>" -o collections/<koleksiyon>/previews/<ad>_qr --dark 42452A --light FFFFFF
   ```
   Açık zemin + koyu modül şart. Altın/açık zeytin gibi düşük kontrastlı renkler okunmaz.
3. SVG'yi Canva'ya yükle; en az ~2.5 cm baskı / video karesinde ~260 px genişlik, etrafında
   sessiz alan bırak. Üzerine dekor bindirme.
4. Export sonrası (MP4 karesi, PDF, PNG) telefon kamerasıyla okut; hedefin açıldığını doğrula.
   Doğrulanmadıysa "QR eklendi, okutma testi yapılmadı" diye raporla.
