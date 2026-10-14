// Kullanılan font yüzleri açıkça yüklenir; sonra [data-fit="<px>"] öğesi en geniş satırı o genişliği aşmayana dek
// küçülür (yazı hiçbir zaman kesilmez ya da taşmaz); bitince render.py'ye `window.__hazir = true`.
const YUZLER = ['900 200px "Archivo"', '800 62px "Archivo"', '300 100px "Montserrat"', '500 48px "DM Sans"', '400 48px "DM Sans"'];
Promise.all(YUZLER.map((f) => document.fonts.load(f)))
  .then(() => document.fonts.ready)
  .then(() => {
    for (const el of document.querySelectorAll('[data-fit]')) {
      const max = Number(el.dataset.fit);
      let fs = parseFloat(getComputedStyle(el).fontSize);
      while (el.getBoundingClientRect().width > max && fs > 12) {
        fs -= 1;
        el.style.fontSize = fs + 'px';
      }
    }
    window.__hazir = true;
  });
