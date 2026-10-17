"""Betik biçimli test dosyalarını (conftest.py collect_ignore) pytest altında tek test olarak koşar: `python3 <dosya>`."""
import subprocess
import sys
from pathlib import Path

import pytest

KOK = Path(__file__).resolve().parents[2]
BETIKLER = [
    "test_build_customer_guides.py",
    "test_kit_check.py",
    "test_listing_kit.py",
    "test_md_to_pdf.py",
    "test_mockup_compose.py",
    "test_parts_prep.py",
    "test_parts_prep_paket5.py",
]


@pytest.mark.parametrize("ad", BETIKLER)
def test_betik(ad):
    r = subprocess.run([sys.executable, str(Path(__file__).parent / ad)], cwd=KOK, capture_output=True, text=True)
    assert r.returncode == 0, f"{ad}\n{r.stdout[-2000:]}\n{r.stderr[-2000:]}"
