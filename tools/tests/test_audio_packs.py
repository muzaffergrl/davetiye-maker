"""tools/audio_packs.py testleri (K59) — tasarım paketlerinin ses yüksekliği ve tepe sınırlayıcı.

  python3 -m pytest tools/tests/test_audio_packs.py -q

İnceleme 2026-10-23: 21'in `crack`'i keskin tıkı yüzünden tepe tavanında kalıp −27 LUFS'a düşmüştü (hedef −20). Kayıtlı
MP3'ler BS.1770 ölçeriyle hedeflerinde mi, `level(limit=True)` keskin bir geçişi hedefe getiriyor mu, tavana takılmayan
sese dokunmuyor mu.
"""
import math
import shutil
import subprocess
import sys
from pathlib import Path

import numpy as np
import pytest

ARACLAR = Path(__file__).resolve().parent.parent
ROOT = ARACLAR.parent
sys.dont_write_bytecode = True
sys.path.insert(0, str(ARACLAR))
import audio_fx as fx  # noqa: E402

PACK_FX = ROOT / "platform" / "public" / "audio" / "fx"
# tools/audio_packs.py PACKS[...]["lufs"] (read here without scipy, so the file check runs everywhere ffmpeg is)
CRIMSON = {"crack": -20, "flap": -20, "draw": -20, "reveal": -21, "bloom": -21, "page": -20, "fold": -21,
           "stamp": -20, "petal": -22, "tap": -24, "chime": -21}


def decode(path: Path) -> np.ndarray:
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-f", "s16le", "-ac", "2", "-ar", str(fx.SR), "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, "<i2").reshape(-1, 2).T / 32768.0


@pytest.mark.skipif(not shutil.which("ffmpeg"), reason="ffmpeg yok")
@pytest.mark.parametrize("name", sorted(CRIMSON))
def test_committed_pack_effects_are_on_level(name):
    x = decode(PACK_FX / "crimson-rose-atelier" / f"{name}.mp3")
    lufs, tp = fx.loudness(x), 20 * math.log10(fx.true_peak(x))
    # MP3 coding moves the level a few tenths; a sound held under its target by the peak ceiling fails here
    assert abs(lufs - CRIMSON[name]) <= 0.6, f"{name}: {lufs:.1f} LUFS (target {CRIMSON[name]})"
    assert tp <= -1.0, f"{name}: true peak {tp:.2f} dBTP"


def test_pack_targets_match_the_tool():
    src = (ARACLAR / "audio_packs.py").read_text(encoding="utf-8")
    for name, target in CRIMSON.items():
        assert f'"{name}": {target}' in src, name


def _transient(rng) -> np.ndarray:
    """A quiet bed with one 4 ms burst: a crest far above what the −1.5 dBTP ceiling allows at −20 LUFS."""
    n = fx.SR
    t = np.arange(n) / fx.SR
    x = np.sin(2 * math.pi * 300 * t) * 0.02
    m = int(0.004 * fx.SR)
    x[int(0.3 * fx.SR):int(0.3 * fx.SR) + m] += rng.standard_normal(m) * np.exp(-np.arange(m) / (0.0008 * fx.SR))
    return np.stack([x, x * 0.9])


def test_level_limit_brings_a_transient_to_its_target_and_leaves_others_alone():
    pytest.importorskip("scipy")
    import audio_packs as ap

    x = _transient(np.random.default_rng(7))
    plain = ap.level(x, -20)
    assert ap.loudness(plain) < -23, "the ceiling holds the plain level under target (the old crack case)"
    lim = ap.level(x, -20, limit=True)
    assert abs(ap.loudness(lim) - (-20)) < 0.2
    assert ap.true_peak(lim) <= 10 ** (-1.5 / 20) + 1e-9
    # a sound that reaches its target under the ceiling is not touched
    soft = np.stack([np.sin(2 * math.pi * 440 * np.arange(fx.SR) / fx.SR) * 0.1] * 2)
    assert np.array_equal(ap.level(soft, -20), ap.level(soft, -20, limit=True))
