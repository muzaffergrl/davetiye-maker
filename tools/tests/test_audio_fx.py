"""tools/audio_fx.py testleri (G967) — ses yüksekliği ölçümü, deterministik üretim, tıksız uçlar, tepe tavanı.

  python3 -m pytest tools/tests/test_audio_fx.py -q
"""
import math
import sys
from pathlib import Path

import numpy as np
import pytest

ARACLAR = Path(__file__).resolve().parent.parent
ROOT = ARACLAR.parent
sys.dont_write_bytecode = True
sys.path.insert(0, str(ARACLAR))
import audio_fx as fx  # noqa: E402

SAMPLE = ["seal", "paper", "slide-quick", "chime", "key", "tap"]


def test_loudness_meter_matches_bs1770_reference():
    # a full-scale 997 Hz sine in one channel of a stereo pair reads −3.01 LUFS (ITU-R BS.1770-4 / EBU Tech 3341)
    t = np.arange(fx.SR * 3) / fx.SR
    sine = np.sin(2 * math.pi * 997 * t)
    assert abs(fx.loudness(np.stack([sine, np.zeros_like(sine)])) - (-3.01)) < 0.1
    # the same −20 dB in both channels: −20 dB + 3 dB (two channels) − 3 dB (sine) ≈ −20.0
    assert abs(fx.loudness(np.stack([sine, sine]) * 0.1) - (-20.0)) < 0.15


def test_effect_list_keeps_the_g126_names_and_is_documented():
    assert len(fx.EFFECTS) >= 35
    for name in ("seal", "ribbon", "clasp", "paper", "slide", "page", "tear", "whoosh", "chime", "tap"):
        assert name in fx.EFFECTS
    doc = (ROOT / "docs" / "40_SES_EFEKTLERI.md").read_text(encoding="utf-8")
    lic = (ROOT / "platform" / "public" / "audio" / "LICENSES.md").read_text(encoding="utf-8")
    catalog = (ROOT / "platform" / "lib" / "audio" / "catalog.ts").read_text(encoding="utf-8")
    for name, e in fx.EFFECTS.items():
        assert e.tr and e.en
        assert f"`{name}`" in doc, f"{name} not in docs/40"
        assert f"fx/{name}.mp3" in lic, f"{name} not in LICENSES.md"
        assert f"'{name}'" in catalog, f"{name} not in EFFECT_NAMES"


@pytest.mark.parametrize("name", SAMPLE)
def test_render_is_deterministic_clean_and_on_level(name):
    a = fx.render(name)
    b = fx.render(name)
    assert np.array_equal(a, b), "same name, same samples"
    assert a.shape[0] == 2 and 0.15 < a.shape[1] / fx.SR < 4.0
    assert np.max(np.abs(a.mean(axis=1))) < 1e-3, "no DC offset"
    assert np.max(np.abs(a[:, 0])) < 1e-3 and np.max(np.abs(a[:, -1])) < 1e-3, "starts and ends at silence (no click)"
    tp = 20 * math.log10(fx.true_peak(a))
    assert tp <= -1.49, f"true peak {tp:.2f} dBTP"
    lufs = fx.loudness(a)
    target = fx.EFFECTS[name].lufs
    # on target, or lower only because the true-peak ceiling held it back (a sharp click)
    assert lufs <= target + 0.2 and (lufs >= target - 0.2 or tp > -1.6), f"{lufs:.1f} LUFS (target {target})"


def test_seed_depends_on_the_name_only():
    assert fx.rng_for("seal").integers(1 << 30) == fx.rng_for("seal").integers(1 << 30)
    assert fx.rng_for("seal").integers(1 << 30) != fx.rng_for("paper").integers(1 << 30)
