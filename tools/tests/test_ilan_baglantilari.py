"""tools/ilan_baglantilari.py: Etsy ilan linkleri → config.ts etsyListingUrl + listings.json eşlemesi."""
import json
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import ilan_baglantilari as ib  # noqa: E402

CONFIG = """  services: [
    { id: 'setup-service', name: 'We set it up for you', price: '500', etsyListingUrl: '[ETSY LISTING URL]' },
    { id: 'custom-design', name: 'Custom design', price: '2960', etsyListingUrl: '[ETSY LISTING URL]' },
  ],
  designs: [
    {
      id: 'olive-ivory',
      name: 'Olive & Ivory',
      status: 'live',
      featured: true,
      price: '1460',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-14',
    },
    {
      id: 'dusty-blue-champagne',
      name: 'Dusty Blue',
      status: 'live',
      featured: true,
      price: '1460',
      compareAtPrice: null,
      etsyListingUrl: '[ETSY LISTING URL]',
      updated: '2026-10-14',
    },
  ],
"""


def test_temizle_drops_utm_and_reads_listing_id():
    link, lid = ib.temizle("https://www.etsy.com/listing/1234567890/olive-ivory-wedding?ref=shop&utm_source=x&utm_medium=y")
    assert lid == "1234567890"
    assert link == "https://www.etsy.com/listing/1234567890/olive-ivory-wedding?ref=shop"
    for bad in ("http://www.etsy.com/listing/1/x", "https://example.com/listing/1", "https://www.etsy.com/shop/STUDIOBKE"):
        with pytest.raises(ValueError):
            ib.temizle(bad)


def test_oku_accepts_design_numbers_and_rejects_duplicates(tmp_path: Path):
    f = tmp_path / "l.txt"
    f.write_text("# yorum\n01 https://www.etsy.com/listing/111/a\nsetup-service=https://www.etsy.com/listing/222/b\n",
                 encoding="utf-8")
    assert ib.oku(f, {"01": "olive-ivory"}) == [
        ("olive-ivory", "https://www.etsy.com/listing/111/a", "111"),
        ("setup-service", "https://www.etsy.com/listing/222/b", "222"),
    ]
    f.write_text("01 https://www.etsy.com/listing/111/a\nolive-ivory https://www.etsy.com/listing/333/c\n"
                 "nope https://www.etsy.com/listing/444/d\n", encoding="utf-8")
    with pytest.raises(ValueError) as e:
        ib.oku(f, {"01": "olive-ivory"})
    assert "aynı anahtar" in str(e.value) and "bilinmeyen" in str(e.value)


def test_uygula_writes_only_the_right_lines():
    kayit = [("dusty-blue-champagne", "https://www.etsy.com/listing/555/d", "555"),
             ("setup-service", "https://www.etsy.com/listing/666/s", "666"),
             ("extra-revision", "https://www.etsy.com/listing/777/e", "777")]
    config, listings = ib.uygula(kayit, CONFIG, {"note": "n", "listings": {}, "services": {}})
    assert config.count("[ETSY LISTING URL]") == 2  # olive-ivory and custom-design untouched
    assert "etsyListingUrl: 'https://www.etsy.com/listing/555/d'" in config.split("id: 'dusty-blue-champagne'")[1]
    assert "etsyListingUrl: 'https://www.etsy.com/listing/555/d'" not in config.split("id: 'dusty-blue-champagne'")[0]
    assert "{ id: 'setup-service', name: 'We set it up for you', price: '500', etsyListingUrl: 'https://www.etsy.com/listing/666/s' }" in config
    assert listings == {"note": "n", "listings": {"555": "dusty-blue-champagne"},
                        "services": {"666": "setup", "777": "extra_revision"}}


def test_real_repo_designs_resolve():
    no_tema = ib.tasarimlar()
    assert no_tema["01"] == "olive-ivory" and no_tema["21"] == "crimson-rose-atelier"
    config = ib.CONFIG.read_text(encoding="utf-8")
    for tema in ("olive-ivory", "crimson-rose-atelier"):
        out = ib.config_yaz(config, tema, "https://www.etsy.com/listing/9/x")
        assert out.count("etsyListingUrl: 'https://www.etsy.com/listing/9/x'") == 1
    json.loads(ib.LISTINGS.read_text(encoding="utf-8"))
