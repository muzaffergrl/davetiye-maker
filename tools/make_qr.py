#!/usr/bin/env python3
"""Gerçek bir hedef URL'den algoritmik QR kod üretir (PNG + SVG).

Kullanım:
    python tools/make_qr.py "https://example.com/rsvp" -o previews/rsvp_qr [--dark 42452A] [--light FBF8F0]

Kurallar (AGENTS.md):
- Yalnız gerçek, alıcıya/etkinliğe ait ve doğrulanmış URL'ler kodlanır.
- AI ile çizilmiş QR benzeri desen kullanılmaz.
- Export sonrası telefon kamerasıyla okutulup hedefin açıldığı doğrulanır.
"""
import argparse
import sys
from urllib.parse import urlparse

import segno

PLACEHOLDER_HOSTS = {"example.com", "example.org", "averyandjordan.com", "www.averyandjordan.com"}


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("url")
    ap.add_argument("-o", "--out", required=True, help="Uzantısız çıktı yolu")
    ap.add_argument("--dark", default="42452A", help="Koyu modül rengi (hex, # olmadan)")
    ap.add_argument("--light", default="FFFFFF", help="Zemin rengi (hex). Kontrast düşükse okunmaz.")
    ap.add_argument("--scale", type=int, default=20)
    ap.add_argument("--allow-placeholder", action="store_true", help="Demo/örnek alan adına izin ver (yalnız iç test)")
    args = ap.parse_args()

    u = urlparse(args.url)
    if u.scheme not in ("https", "http") or not u.netloc:
        print(f"HATA: geçerli bir http(s) URL değil: {args.url}")
        return 1
    if u.netloc.lower() in PLACEHOLDER_HOSTS and not args.allow_placeholder:
        print(f"HATA: {u.netloc} demo/kurgu alan adı. Gerçek hedef ver ya da --allow-placeholder kullan.")
        return 1

    qr = segno.make(args.url, error="q", micro=False)
    common = dict(scale=args.scale, border=4, dark=f"#{args.dark}", light=f"#{args.light}")
    qr.save(f"{args.out}.png", **common)
    qr.save(f"{args.out}.svg", **common)
    print(f"QR üretildi: {args.out}.png, {args.out}.svg  (versiyon {qr.version}, hata düzeltme Q)")
    print(f"Kodlanan hedef: {args.url}")
    print("Not: export sonrası telefon kamerasıyla okutup hedefin açıldığını doğrula.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
