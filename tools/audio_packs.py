#!/usr/bin/env python3
"""Tasarıma özel ses paketleri (2026-10-23): her tasarımın kendi efektleri ve kendi fon müziği, koddan sentezlenir.

G126'nın ortak 10 efekti ve 4 parçası (tools/audio_synth.py) bütün tasarımlarda aynı duyuluyordu. Kullanıcı (2026-10-23):
"her şablona özel ... özel sesler oluşturup hissiyatı en kaliteli hâle getirmeliyiz". Bu betik bir tasarımın paketini
üretir: platform/public/audio/fx/<tema>/<ad>.mp3 (stereo efektler) ve platform/public/audio/music/<parça>.mp3 (elle
bestelenmiş, stereo, döngülü parça). Dış kayıt, örnek (sample) ya da başkasının bestesi yok: notalar aşağıda elle
yazıldı, tınılar toplamsal sentez + sentetik stereo salon yankısıdır (lisans kaydı platform/public/audio/LICENSES.md).

Kullanım (repo kökünden):  python3 tools/audio_packs.py [--pack crimson-rose-atelier] [--only fx|music] [--wav <klasör>]
Gerekenler: numpy, scipy, ffmpeg (libmp3lame). Sabit tohum: aynı girdi aynı sesi verir (MP3 kodlayıcı farkı hariç).
Sözleşme: lib/audio/catalog.ts DESIGN_SOUND[<tema>].pack / .opening / .cues ve MUSIC_TRACKS (tests/g126-audio.test.ts).
"""

from __future__ import annotations

import argparse
import math
import os
import subprocess
import sys
import tempfile
import wave

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

SR = 44100
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
AUDIO = os.path.join(ROOT, "platform", "public", "audio")
NOTE = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}


def midi(name: str) -> int:
    """'C4' -> 60, 'F#5' -> 78, 'Bb3' -> 58."""
    pc, rest = NOTE[name[0]], name[1:]
    while rest and rest[0] in "#b":
        pc += 1 if rest[0] == "#" else -1
        rest = rest[1:]
    return 12 * (int(rest) + 1) + pc


def hz(m: float) -> float:
    return 440.0 * 2 ** ((m - 69) / 12)


def sec(x: float) -> int:
    return int(round(x * SR))


# ------------------------------------------------------------------------------------------------------- stereo helpers


def pan(x: np.ndarray, p: float) -> np.ndarray:
    """Equal-power pan of a mono signal: p = -1 (left) … +1 (right) → (2, n)."""
    a = (p + 1) * math.pi / 4
    return np.stack([x * math.cos(a), x * math.sin(a)])


class Mix:
    def __init__(self, seconds: float):
        self.buf = np.zeros((2, sec(seconds)))

    def add(self, x: np.ndarray, at: float, gain: float = 1.0):
        if x.ndim == 1:
            x = pan(x, 0)
        i = sec(at)
        if i >= self.buf.shape[1]:
            return
        n = min(x.shape[1], self.buf.shape[1] - i)
        self.buf[:, i:i + n] += x[:, :n] * gain


def lp(x, f, order=2):
    return sosfilt(butter(order, min(f, SR * 0.45), "lowpass", fs=SR, output="sos"), x, axis=-1)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, "highpass", fs=SR, output="sos"), x, axis=-1)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, min(hi, SR * 0.45)], "bandpass", fs=SR, output="sos"), x, axis=-1)


def peak(x, f, q, gain_db):
    """RBJ peaking EQ (one biquad)."""
    a = 10 ** (gain_db / 40)
    w = 2 * math.pi * f / SR
    al = math.sin(w) / (2 * q)
    b = [1 + al * a, -2 * math.cos(w), 1 - al * a]
    d = [1 + al / a, -2 * math.cos(w), 1 - al / a]
    sos = np.array([[b[0] / d[0], b[1] / d[0], b[2] / d[0], 1, d[1] / d[0], d[2] / d[0]]])
    return sosfilt(sos, x, axis=-1)


def smoothstep(x):
    x = np.clip(x, 0, 1)
    return x * x * (3 - 2 * x)


def env_ad(n, attack, decay):
    t = np.arange(n) / SR
    return np.clip(t / max(attack, 1e-4), 0, 1) * np.exp(-np.maximum(t - attack, 0) / decay)


def noise(n, rng):
    return rng.standard_normal(n)


def sweep_band(n, f_from, f_to, rng, bw=0.8, blocks=28):
    """Band-passed noise whose centre glides from f_from to f_to (overlapping raised-cosine blocks)."""
    src = rng.standard_normal(n)
    out = np.zeros(n)
    size = max(1, n // blocks)
    win = np.hanning(2 * size)
    for b in range(blocks + 1):
        c = f_from * (f_to / f_from) ** (b / blocks)
        y = bp(src, c / (1 + bw), min(c * (1 + bw), SR * 0.45))
        s0 = (b - 1) * size
        lo, hi = max(0, s0), min(n, s0 + 2 * size)
        if hi > lo:
            out[lo:hi] += y[lo:hi] * win[lo - s0:hi - s0]
    return out


def grains(n, rate, rng, lo, hi, width=0.002, shape=None):
    """Sparse tiny bursts (paper fibre crackle), density × shape."""
    out = np.zeros(n)
    k = int(rate * n / SR)
    for _ in range(k):
        i = int(rng.uniform(0, n - 1))
        if shape is not None and rng.uniform() > shape[i]:
            continue
        m = max(8, int(width * SR * rng.uniform(0.5, 1.6)))
        burst = rng.standard_normal(m) * np.exp(-np.arange(m) / (m / 5)) * rng.uniform(0.25, 1.0)
        out[i:i + m] += burst[: n - i]
    return bp(out, lo, hi)


# ---------------------------------------------------------------------------------------------------------- the room


def hall_ir(seconds: float, rng, damp=6500.0, pre=0.022, width=1.0) -> np.ndarray:
    """A stereo hall: decorrelated L/R tails that darken as they decay, a few early reflections. (2, n), unit energy."""
    n = sec(seconds)
    t = np.arange(n) / SR
    chans = []
    for ch in range(2):
        nz = rng.standard_normal(n)
        bright = lp(nz, damp)
        dark = lp(nz, damp / 5)
        mix = np.clip(t / (seconds * 0.55), 0, 1)
        tail = (bright * (1 - mix) + dark * mix) * np.exp(-6.9 * t / seconds)
        tail *= smoothstep(t / 0.03)  # the diffuse tail builds up
        ir = np.zeros(n + sec(pre))
        ir[sec(pre):] = tail
        for d, g in ((0.0093, 0.42), (0.0161, 0.30), (0.0237, 0.24), (0.0311, 0.18), (0.0427, 0.12)):
            ir[sec(d * (1.0 + 0.11 * ch))] += g * (1 if (ch + int(d * 1000)) % 2 else -1)
        chans.append(ir)
    ir = np.stack(chans)
    mid, side = (ir[0] + ir[1]) / 2, (ir[0] - ir[1]) / 2 * width
    ir = np.stack([mid + side, mid - side])
    return ir / np.sqrt(np.sum(ir ** 2) / 2)


def reverb(x: np.ndarray, ir: np.ndarray, wet: float) -> np.ndarray:
    """x (2, n) → dry/wet; each input channel feeds both outputs a little (a real room)."""
    n = x.shape[1]
    mono = (x[0] + x[1]) / 2
    out = np.zeros_like(x)
    for ch in range(2):
        out[ch] = fftconvolve(x[ch] * 0.75 + mono * 0.25, ir[ch])[:n]
    return x * (1 - wet) + out * wet


# ---------------------------------------------------------------------------------------------------------- instruments


def piano(m: int, dur: float, vel: float, rng) -> np.ndarray:
    """A felt-and-wood grand: three slightly detuned strings, inharmonic partials with a fast and a slow decay (prompt
    sound + aftersound), velocity brightness, hammer knock, damper on release, placed across the keyboard (stereo)."""
    f0 = hz(m)
    length = min(dur + 1.8, 7.0)
    n = sec(length)
    t = np.arange(n) / SR
    out = np.zeros(n)
    B = 0.00028 * (f0 / 261.6) ** 0.6
    bright = 0.42 + 0.5 * vel
    t60 = 5.2 * (261.6 / f0) ** 0.45
    for k in range(1, 17):
        fk = k * f0 * math.sqrt(1 + B * k * k)
        if fk > 11000:
            break
        amp = (1 / k ** 1.1) * bright ** (k - 1) * (1 + 0.6 * math.sin(k * math.pi * 0.12))
        fast, slow = t60 / (3.0 * (1 + 0.45 * (k - 1))), t60 / (1 + 0.3 * (k - 1))
        env = 0.55 * np.exp(-6.9 * t / fast) + 0.45 * np.exp(-6.9 * t / slow)
        ph = rng.uniform(0, 2 * math.pi)
        for d in (-0.9, 0.0, 1.1):  # cents
            out += amp * env * np.sin(2 * math.pi * fk * 2 ** (d / 1200) * t + ph + d) / 3
    att = sec(0.004)
    out[:att] *= np.linspace(0, 1, att)
    knock = sec(0.03)
    out[:knock] += bp(noise(knock, rng), 300, 2400) * np.exp(-np.arange(knock) / sec(0.005)) * 0.05 * vel
    rel = sec(dur)
    if rel < n:
        tail = np.arange(n - rel) / SR
        out[rel:] *= np.exp(-tail / 0.16)
        dn = min(sec(0.06), n - rel)
        out[rel:rel + dn] += bp(noise(dn, rng), 200, 1200) * np.exp(-np.arange(dn) / sec(0.015)) * 0.006
    out = lp(out, 1800 + 6500 * vel)
    p = np.clip((m - 64) / 30, -0.55, 0.55)
    return pan(out * vel, float(p))


def harp(m: int, vel: float, rng, length: float | None = None) -> np.ndarray:
    """A concert harp string: pluck-position spectrum, upper partials die first, a tiny pitch settle and finger noise,
    a warm soundboard."""
    f0 = hz(m)
    T = float(np.interp(m, [36, 60, 84, 96], [7.0, 4.2, 1.8, 1.1]))
    length = length or min(T + 0.3, 6.0)
    n = sec(length)
    t = np.arange(n) / SR
    settle = 1 + 0.0012 * np.exp(-t / 0.03)
    phase = 2 * math.pi * f0 * np.cumsum(settle) / SR
    out = np.zeros(n)
    pos = 0.17 + 0.05 * rng.uniform()
    for k in range(1, 14):
        if k * f0 > 9000:
            break
        a = abs(math.sin(k * math.pi * pos)) / k ** 1.35
        out += a * np.exp(-6.9 * t / (T / (1 + 0.42 * (k - 1)))) * np.sin(k * phase + rng.uniform(0, 6.28))
    att = sec(0.0025)
    out[:att] *= np.linspace(0, 1, att)
    fn = sec(0.02)
    out[:fn] += bp(noise(fn, rng), 1500, 6000) * np.exp(-np.arange(fn) / sec(0.003)) * 0.03
    out = peak(out, 240, 1.2, 3) * 0.9
    p = np.clip((m - 62) / 26, -0.6, 0.6)
    return pan(out * vel, float(p))


def celesta(m: int, vel: float, rng) -> np.ndarray:
    """A soft celesta / bell sparkle: bright inharmonic partials, quick shimmer."""
    f0 = hz(m)
    n = sec(2.2)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for r, a, d in ((1.0, 1.0, 1.1), (2.0, 0.28, 0.5), (3.0, 0.1, 0.3), (4.07, 0.12, 0.25), (5.95, 0.05, 0.12)):
        if f0 * r < SR * 0.45:
            out += a * np.exp(-t / d) * np.sin(2 * math.pi * f0 * r * t + rng.uniform(0, 6.28))
    out[: sec(0.002)] *= np.linspace(0, 1, sec(0.002))
    return pan(out * vel, float(rng.uniform(-0.35, 0.35)))


def bowed_line(notes, rng, section="violins", voices=6, gain=1.0) -> tuple[np.ndarray, float]:
    """A legato string section playing one line: notes = [(start s, length s, midi, vel)]. The pitch glides between
    connected notes, the bow swells into each note, the vibrato blooms after the onset; every player has his own
    tuning, timing, vibrato and bow noise; the sum goes through a violin (or cello) body. Returns ((2, n), start s)."""
    t0 = min(s for s, _, _, _ in notes) - 0.3
    t1 = max(s + d for s, d, _, _ in notes) + 1.2
    n = sec(t1 - t0)
    t = np.arange(n) / SR + t0
    notes = sorted(notes)
    out = np.zeros((2, n))
    body = {
        "violins": [(290, 1.4, 4), (480, 1.8, 3), (1100, 1.6, 2.5), (2700, 1.3, 4), (3600, 2, 2)],
        "violas": [(230, 1.3, 4), (420, 1.6, 3), (950, 1.6, 2), (2300, 1.5, 3)],
        "cellos": [(110, 1.2, 4), (210, 1.4, 4), (560, 1.6, 3), (1300, 1.8, 2)],
    }[section]
    hi_cut = {"violins": 6500, "violas": 5000, "cellos": 3200}[section]
    lo_cut = {"violins": 170, "violas": 120, "cellos": 55}[section]
    spread = {"violins": (-0.55, -0.05), "violas": (-0.1, 0.35), "cellos": (0.15, 0.6)}[section]
    for v in range(voices):
        jit = rng.uniform(-0.012, 0.018)
        det = rng.uniform(-7, 7)
        # pitch contour with portamento between legato notes
        mpitch = np.full(n, float(notes[0][2]))
        amp = np.zeros(n)
        vib_depth = np.zeros(n)
        for i, (s, d, m, vel) in enumerate(notes):
            s += jit
            a = sec(s - t0)
            b = sec(s + d - t0)
            prev = notes[i - 1] if i else None
            glide = 0.06 if prev and abs(prev[0] + prev[1] - notes[i][0]) < 0.06 else 0.0
            if glide:
                g0 = a - sec(glide / 2)
                ramp = smoothstep(np.arange(sec(glide)) / sec(glide))
                seg = mpitch[g0:g0 + len(ramp)]
                mpitch[g0:g0 + len(ramp)] = prev[2] + (m - prev[2]) * ramp[: len(seg)]
                mpitch[g0 + len(ramp):] = m
            else:
                mpitch[a:] = m
            # bow: attack (shorter when connected), gentle swell on long notes, release
            att = 0.09 if glide else 0.22
            idx = np.arange(max(0, a - sec(0.02)), min(n, b + sec(0.45)))
            tt = (idx - a) / SR
            e = smoothstep(tt / att) * (1 + 0.18 * np.sin(np.pi * np.clip(tt / max(d, 0.3), 0, 1)))
            rel = np.clip(1 - (tt - d) / 0.42, 0, 1) ** 1.5
            e = e * np.where(tt > d, rel, 1.0) * vel
            amp[idx] = np.maximum(amp[idx], e)
            vd = smoothstep((tt - 0.22) / 0.5) * (0.005 if section != "cellos" else 0.0035) * np.where(tt > d, rel, 1.0)
            vib_depth[idx] = np.maximum(vib_depth[idx], vd)
        amp = lp(amp, 18)
        rate = 5.4 + rng.uniform(-0.4, 0.4)
        drift = np.cumsum(rng.standard_normal(n)) / SR
        drift = lp(drift - np.linspace(drift[0], drift[-1], n), 1.5) * 0.002
        f = hz(0) * 2 ** ((mpitch + det / 100) / 12) * (1 + vib_depth * np.sin(2 * math.pi * rate * t + rng.uniform(0, 6.28)) + drift)
        phase = 2 * math.pi * np.cumsum(f) / SR
        fmax = float(f.max())
        src = np.zeros(n)
        for k in range(1, 40):
            if k * fmax > 10500:
                break
            src += np.sin(k * phase + rng.uniform(0, 6.28)) / k ** 1.05
        bow = bp(noise(n, rng), 2200, 7000) * 0.025
        voice = (src + bow) * amp
        out += pan(voice, float(rng.uniform(*spread)))
    for f, q, g in body:
        out = peak(out, f, q, g)
    out = lp(hp(out, lo_cut), hi_cut)
    return out * gain / voices, t0


# ------------------------------------------------------------------------------------------------------ mastering / I/O


def master(x: np.ndarray, peak_db=-1.5, drive=1.15) -> np.ndarray:
    x = hp(x, 32)
    x = np.tanh(x / np.max(np.abs(x)) * drive) / math.tanh(drive)
    return x / np.max(np.abs(x)) * 10 ** (peak_db / 20)


def write_wav(path: str, x: np.ndarray):
    pcm = (np.clip(x.T, -1, 1) * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def encode(x: np.ndarray, dest: str, bitrate: str, title: str, keep_wav: str | None = None):
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        src = os.path.join(tmp, "in.wav")
        write_wav(src, x)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-ac", "2", "-codec:a", "libmp3lame", "-b:a", bitrate,
                        "-map_metadata", "-1", "-metadata", f"title={title}", "-metadata", "artist=BKE Studio",
                        "-id3v2_version", "3", dest], check=True)
        if keep_wav:
            os.makedirs(keep_wav, exist_ok=True)
            write_wav(os.path.join(keep_wav, os.path.basename(dest)[:-4] + ".wav"), x)


def finish_fx(x: np.ndarray, rng, room=0.9, wet=0.16, tail=0.25, peak_db=-3.0) -> np.ndarray:
    """A short room around an effect, a clean fade, the level."""
    if x.ndim == 1:
        x = pan(x, 0)
    x = np.concatenate([x, np.zeros((2, sec(tail)))], axis=1)
    x = reverb(hp(x, 45), hall_ir(room, rng, 7500, 0.008, 0.8), wet)
    fade = sec(0.04)
    x[:, -fade:] *= np.linspace(1, 0, fade)
    return x / np.max(np.abs(x)) * 10 ** (peak_db / 20)


# ===================================================================================================== Crimson Rose Atelier
#
# The opening (site.js MOTION.envelope, same numbers in lib/audio/catalog.ts):
#   0     crack   the gold wax seal is pressed, cracks in two; the halves fall left and right onto the paper
#   480   flap    the heavy oxblood flap unsticks and turns up on its hinge
#   1150  draw    the deckled card is drawn out of the pocket, paper on paper
#   2250  reveal  it lifts free into the candlelight: a harp sweep over a string swell (F major add9 → D minor colour)
#   3150  bloom   it comes forward to the guest: a warm low piano chord and a breath of air
# Pages: page (the album leaf turns, right to left), fold + stamp (the reply card folds into the envelope, the seal is
# pressed onto it), petal (home: petals settle as the names appear), tap (between pages), chime (a reply sent).


def cr_crack(rng):
    n = sec(0.75)
    x = np.zeros((2, n))
    # pressure: the wax gives a little under the thumb (dull creak)
    pn = sec(0.09)
    creak = bp(noise(pn, rng), 180, 900) * np.sin(np.linspace(0, math.pi, pn)) ** 2 * 0.25
    creak *= 1 + 0.6 * np.sin(2 * math.pi * 55 * np.arange(pn) / SR)
    x[:, :pn] += pan(creak, 0)
    # the snap: a brittle broadband crack and two micro-cracks running through the wax
    for at, g, p in ((0.085, 1.0, 0.0), (0.097, 0.55, -0.2), (0.118, 0.35, 0.25)):
        m = sec(0.035)
        s = (bp(noise(m, rng), 1400, 9500) * env_ad(m, 0.0003, 0.0035) * 2.6
             + bp(noise(m, rng), 400, 1800) * env_ad(m, 0.0006, 0.009) * 0.9) * g
        x[:, sec(at):sec(at) + m] += pan(s, p)
    # a resonant wax body under the snap
    bn = sec(0.12)
    tt = np.arange(bn) / SR
    x[:, sec(0.085):sec(0.085) + bn] += pan(np.sin(2 * math.pi * 210 * tt) * np.exp(-tt / 0.02) * 0.32, 0)
    # the two halves land on the paper: left first, then right (site.js: halves fall at ~260 / 340 ms)
    for at, p, f in ((0.27, -0.55, 260), (0.355, 0.55, 300)):
        m = sec(0.08)
        tt = np.arange(m) / SR
        land = (np.sin(2 * math.pi * f * tt) * np.exp(-tt / 0.012) * 0.35
                + bp(noise(m, rng), 900, 5000) * env_ad(m, 0.0004, 0.006) * 0.7)
        x[:, sec(at):sec(at) + m] += pan(land, p)
        # a tiny bounce
        m2 = sec(0.03)
        x[:, sec(at + 0.055):sec(at + 0.055) + m2] += pan(bp(noise(m2, rng), 1200, 6000) * env_ad(m2, 0.0003, 0.003) * 0.25, p)
    return finish_fx(x, rng, 0.8, 0.14, 0.2)


def cr_flap(rng):
    n = sec(1.05)
    t = np.arange(n) / SR
    # the adhesive lets go: a quick zipper of fine crackles along the flap edge
    peel_shape = smoothstep(t / 0.05) * np.clip(1 - (t - 0.05) / 0.22, 0, 1)
    peel = grains(n, 900, rng, 1800, 9000, 0.0012, peel_shape) * 0.9
    # the heavy paper swings: a soft air push that brightens as it turns, then settles back down
    swing_shape = np.sin(np.pi * np.clip((t - 0.08) / 0.78, 0, 1)) ** 1.6
    swing = sweep_band(n, 500, 1900, rng, 0.9) * swing_shape * 0.55
    # cotton paper flexing: low rustle grains inside the swing
    flex = grains(n, 140, rng, 600, 3500, 0.006, swing_shape) * 0.5
    # the flap settles open (soft, papery)
    m = sec(0.09)
    settle = bp(noise(m, rng), 250, 1600) * env_ad(m, 0.003, 0.025) * 0.45
    mono = peel + swing + flex
    mono[sec(0.86):sec(0.86) + m] += settle
    # it rises up and away from the guest: a slight widening
    left = mono * (1.0 - 0.15 * smoothstep(t / 0.9))
    right = np.roll(mono, sec(0.0007)) * (0.85 + 0.15 * smoothstep(t / 0.9))
    return finish_fx(np.stack([left, right]), rng, 1.0, 0.18, 0.25)


def cr_draw(rng):
    n = sec(1.25)
    t = np.arange(n) / SR
    shape = smoothstep(t / 0.18) * np.clip((1.0 - t) / 0.35, 0, 1) ** 1.2
    # paper on paper: a glide whose grain rises as the card speeds up, with stick-slip flutter
    glide = sweep_band(n, 700, 2600, rng, 0.7) * shape
    flutter = 1 + 0.35 * np.sin(2 * math.pi * (22 + 18 * t) * t) * smoothstep(t / 0.3)
    fibres = grains(n, 260, rng, 1500, 7000, 0.0015, shape) * 0.6
    mono = glide * flutter * 0.5 + fibres
    # the card leaves the pocket: a light flick of the deckled edge
    m = sec(0.06)
    mono[sec(0.98):sec(0.98) + m] += bp(noise(m, rng), 1800, 8000) * env_ad(m, 0.0006, 0.01) * 0.6
    return finish_fx(pan(mono, 0.05), rng, 0.9, 0.16, 0.25)


def cr_reveal(rng):
    """Harp sweep F3→A6 over Fmaj9, a soft string swell, two celesta sparkles: the card in the candlelight."""
    mix = Mix(3.2)
    sweep = ["F3", "A3", "C4", "E4", "G4", "A4", "C5", "E5", "F5", "G5", "A5", "C6", "E6", "A6"]
    for i, nm in enumerate(sweep):
        at = 0.035 * i + 0.0009 * i * i
        vel = 0.42 + 0.35 * math.sin(math.pi * (i + 0.5) / len(sweep))
        mix.add(harp(midi(nm), vel, rng, 2.9 - at), at, 0.5)
    # the strings swell in under the harp (their own fade-in; the harp keeps its attack)
    swell, s0 = bowed_line([(0.0, 2.2, midi("F4"), 0.7), (0.0, 2.2, midi("A4"), 0.6), (0.0, 2.2, midi("C5"), 0.55),
                            (0.05, 2.15, midi("E5"), 0.4)], rng, "violins", voices=5, gain=0.3)
    low, l0 = bowed_line([(0.1, 2.2, midi("F2"), 0.8), (0.1, 2.2, midi("C3"), 0.6)], rng, "cellos", voices=3, gain=0.34)
    for line, start in ((swell, s0), (low, l0)):
        k = min(sec(0.6), line.shape[1])
        line[:, :k] *= smoothstep(np.arange(k) / k)
        mix.add(line, max(0.0, start + 0.15))
    for at, nm in ((0.62, "A6"), (0.9, "E6")):
        mix.add(celesta(midi(nm), 0.18, rng), at)
    x = mix.buf
    x = reverb(x, hall_ir(2.6, rng, 7000, 0.024), 0.36)
    fade = sec(0.6)
    x[:, -fade:] *= np.linspace(1, 0, fade) ** 1.5
    return x / np.max(np.abs(x)) * 10 ** (-5 / 20)


def cr_bloom(rng):
    """The card comes forward: a low warm D minor (add9) piano bloom and a breath of air moving towards the guest."""
    mix = Mix(2.2)
    for i, nm in enumerate(["D2", "A2", "F3", "E4", "A4"]):
        mix.add(piano(midi(nm), 1.4, 0.32 if i < 3 else 0.24, rng), 0.012 * i, 0.9)
    n = sec(0.7)
    t = np.arange(n) / SR
    air = sweep_band(n, 1600, 500, rng, 1.0) * np.sin(np.pi * t / 0.7) ** 2 * 0.14
    mix.add(pan(air, 0), 0)
    x = reverb(mix.buf, hall_ir(2.2, rng, 6500, 0.02), 0.3)
    fade = sec(0.5)
    x[:, -fade:] *= np.linspace(1, 0, fade)
    return x / np.max(np.abs(x)) * 10 ** (-4 / 20)


def cr_page(rng):
    """A thick album leaf turning right to left: it lifts (soft unsticking), sweeps over (air + flexing cotton) and
    lands on the left page."""
    n = sec(0.85)
    t = np.arange(n) / SR
    lift = grains(n, 300, rng, 1500, 7000, 0.0015, np.clip(1 - t / 0.12, 0, 1)) * 0.5
    sw_shape = np.sin(np.pi * np.clip((t - 0.06) / 0.62, 0, 1)) ** 2
    sweep = sweep_band(n, 600, 3200, rng, 0.9) * sw_shape * 0.5
    flex = grains(n, 120, rng, 700, 4000, 0.005, sw_shape) * 0.45
    m = sec(0.1)
    land = bp(noise(m, rng), 180, 1400) * env_ad(m, 0.002, 0.03) * 0.7
    mono = lift + sweep + flex
    mono[sec(0.66):sec(0.66) + m] += land
    p = 0.55 - 1.1 * smoothstep(t / 0.7)  # right → left
    a = (p + 1) * math.pi / 4
    x = np.stack([mono * np.cos(a), mono * np.sin(a)])
    return finish_fx(x, rng, 0.8, 0.14, 0.2)


def cr_fold(rng):
    """The reply card is folded and slipped into the envelope: a crisp crease, then a short paper glide."""
    n = sec(0.9)
    t = np.arange(n) / SR
    crease_shape = smoothstep(t / 0.02) * np.clip(1 - t / 0.16, 0, 1)
    crease = grains(n, 1400, rng, 1600, 8000, 0.001, crease_shape) * 0.8
    m = sec(0.05)
    crease[sec(0.13):sec(0.13) + m] += bp(noise(m, rng), 300, 2500) * env_ad(m, 0.001, 0.012) * 0.6
    gl_shape = np.sin(np.pi * np.clip((t - 0.3) / 0.5, 0, 1)) ** 1.5
    glide = sweep_band(n, 2200, 900, rng, 0.7) * gl_shape * 0.45
    return finish_fx(pan(crease + glide, -0.05), rng, 0.8, 0.14, 0.2)


def cr_stamp(rng):
    """The gold seal pressed onto the envelope: a soft heavy press into warm wax, a muted thud through the paper — with
    enough body between 200 Hz and 2 kHz to be heard on a phone speaker."""
    n = sec(0.55)
    t = np.arange(n) / SR
    f = 150 + 60 * np.exp(-t / 0.025)
    thud = (np.sin(2 * math.pi * np.cumsum(f) / SR) + 0.45 * np.sin(4 * math.pi * np.cumsum(f) / SR)) * np.exp(-t / 0.06) * 0.7
    thud *= smoothstep(t / 0.004)
    body = bp(noise(n, rng), 220, 1400) * env_ad(n, 0.003, 0.035) * 0.75
    pat = bp(noise(n, rng), 1200, 4500) * env_ad(n, 0.001, 0.008) * 0.35
    squish = bp(noise(n, rng), 600, 2600) * np.clip((t - 0.02) / 0.03, 0, 1) * np.exp(-t / 0.1) * 0.2
    return finish_fx(pan(thud + body + pat + squish, 0), rng, 0.7, 0.12, 0.2, -3.5)


def cr_petal(rng):
    """Petals settling as the names appear on home: a breath of air and two harp harmonics, very soft."""
    mix = Mix(2.4)
    n = sec(1.6)
    t = np.arange(n) / SR
    air = sweep_band(n, 2600, 1100, rng, 1.1) * np.sin(np.pi * t / 1.6) ** 2 * 0.12
    mix.add(pan(air, -0.15), 0)
    for at, nm in ((0.25, "A6"), (0.55, "D7")):
        mix.add(harp(midi(nm), 0.22, rng, 1.6) * 0.8, at)
        mix.add(celesta(midi(nm), 0.08, rng), at)
    x = reverb(mix.buf, hall_ir(2.4, rng, 7000, 0.025), 0.4)
    fade = sec(0.4)
    x[:, -fade:] *= np.linspace(1, 0, fade)
    return x / np.max(np.abs(x)) * 10 ** (-9 / 20)


def cr_tap(rng):
    """Between pages: a soft felt-and-wood tick with a whisper of paper."""
    n = sec(0.14)
    t = np.arange(n) / SR
    wood = (np.sin(2 * math.pi * 640 * t) * np.exp(-t / 0.012) * 0.35 + np.sin(2 * math.pi * 1720 * t) * np.exp(-t / 0.005) * 0.12) * smoothstep(t / 0.0012)
    paper = bp(noise(n, rng), 1200, 6000) * env_ad(n, 0.0008, 0.008) * 0.35
    return finish_fx(pan(wood + paper, 0), rng, 0.5, 0.1, 0.12, -6)


def cr_chime(rng):
    """A reply is sent: two harp notes and a golden celesta (D major colour after the minor opening)."""
    mix = Mix(2.4)
    for at, nm, v in ((0.0, "A5", 0.5), (0.11, "D6", 0.45), (0.22, "F#6", 0.4)):
        mix.add(harp(midi(nm), v, rng, 2.0), at)
    mix.add(celesta(midi("A6"), 0.16, rng), 0.24)
    x = reverb(mix.buf, hall_ir(2.2, rng, 7500, 0.02), 0.32)
    fade = sec(0.5)
    x[:, -fade:] *= np.linspace(1, 0, fade)
    return x / np.max(np.abs(x)) * 10 ** (-4 / 20)


# ----------------------------------------------------------------------------------------- Rose Nocturne (the music)
#
# A candlelit waltz in D minor, 3/4 at 76 bpm, 40 bars ≈ 95 s, looping (the last bar's A7 leads back to the first Dm).
# Intro (4): harp alone · A (8): the piano sings over a waltz · A' (8): the violins take the tune, the harp ripples ·
# B (8): F major, piano tune, violins hold a counter-line · A'' (8): violins and piano together, the tune climbs ·
# Outro (4): the piano remembers the first phrase, the harp leads home. Every note below is written by hand.

RN_BPM = 76
RN_BEAT = 60 / RN_BPM
RN_BAR = 3 * RN_BEAT

# (bass, chord tones) per bar; "x|y" = x on beats 1–2, y on beat 3
RN_CHORDS = {
    "Dm": ("D2", ["D", "F", "A"]), "Bb": ("Bb1", ["Bb", "D", "F"]), "Gm": ("G1", ["G", "Bb", "D"]),
    "A7": ("A1", ["A", "C#", "E", "G"]), "F": ("F2", ["F", "A", "C"]), "C/E": ("E2", ["C", "E", "G"]),
    "Gm7": ("G1", ["G", "Bb", "D", "F"]), "C7": ("C2", ["C", "E", "G", "Bb"]), "Asus": ("A1", ["A", "D", "E"]),
}
RN_BARS = (["Dm", "Bb", "Gm", "Asus"]                                          # intro 0–3
           + ["Dm", "Bb", "Gm", "A7", "Dm", "F", "Gm|A7", "Dm"]                # A 4–11
           + ["Dm", "Bb", "Gm", "A7", "Dm", "Bb", "Gm|A7", "Dm"]               # A' 12–19
           + ["F", "C/E", "Dm", "Bb", "Gm7", "C7", "F", "A7"]                  # B 20–27
           + ["Dm", "Bb", "Gm", "A7", "Dm", "Bb", "Gm|A7", "Dm"]               # A'' 28–35
           + ["Bb", "Gm", "Asus", "A7"])                                       # outro 36–39

RN_A = [("A4", 2), ("D5", 1), ("F5", 1.5), ("E5", .5), ("D5", 1), ("D5", 2), ("Bb4", 1), ("A4", 2), ("C#5", 1),
        ("A4", 2), ("D5", 1), ("A5", 1.5), ("G5", .5), ("F5", 1), ("E5", 1), ("G5", 1), ("F5", .5), ("E5", .5), ("D5", 3)]
RN_A2 = [("F5", 2), ("A5", 1), ("D6", 1.5), ("C6", .5), ("Bb5", 1), ("Bb5", 1), ("A5", 1), ("G5", 1), ("E5", 2), ("A5", 1),
         ("F5", 1), ("E5", 1), ("D5", 1), ("D5", 1.5), ("F5", .5), ("Bb5", 1), ("A5", 1), ("G5", 1), ("E5", 1), ("D5", 3)]
RN_B = [("C5", 1), ("F5", 1), ("A5", 1), ("G5", 2), ("E5", 1), ("F5", 1.5), ("E5", .5), ("D5", 1), ("F5", 2), ("D5", 1),
        ("Bb5", 1.5), ("A5", .5), ("G5", 1), ("E5", 1), ("G5", 1), ("Bb5", 1), ("A5", 3), ("G5", 1), ("E5", 1), ("C#5", 1)]
RN_B_COUNTER = [("A4", 3), ("G4", 3), ("A4", 3), ("Bb4", 3), ("D5", 3), ("C5", 1.5), ("Bb4", 1.5), ("A4", 3), ("A4", 3)]
RN_A3 = [("D5", 2), ("A5", 1), ("F5", 1.5), ("E5", .5), ("D5", 1), ("G5", 1), ("Bb5", 1), ("D6", 1), ("C#6", 2), ("A5", 1),
         ("D6", 1.5), ("C6", .5), ("A5", 1), ("Bb5", 1), ("A5", 1), ("G5", 1), ("G5", 1), ("F5", 1), ("E5", 1), ("D5", 3)]
RN_OUTRO = [("D5", 2), ("C5", 1), ("Bb4", 3), ("A4", 3)]


def rn_line(seq, bar0):
    """[(name, beats)] from the start of bar0 → [(start s, length s, midi)]."""
    out, pos = [], bar0 * 3.0
    for nm, beats in seq:
        out.append((pos * RN_BEAT, beats * RN_BEAT, midi(nm)))
        pos += beats
    return out


def rn_phrase_vel(i, total, lo=0.45, hi=0.68):
    """A gentle arch over a phrase."""
    return lo + (hi - lo) * math.sin(math.pi * (i + 0.5) / total)


def chord_at(bar: int, beat: int):
    name = RN_BARS[bar]
    if "|" in name:
        a, b = name.split("|")
        name = a if beat < 2 else b
    return RN_CHORDS[name]


def voice_near(pcs, lo, hi):
    """Chord tones (pitch-class names) placed between midi lo and hi, closest position."""
    out = []
    for pc in pcs:
        base = midi(pc + "3")
        while base < lo:
            base += 12
        while base > hi:
            base -= 12
        out.append(base)
    return sorted(out)


def render_rose_nocturne() -> np.ndarray:
    rng = np.random.default_rng(2110)
    bars = len(RN_BARS)
    loop = bars * RN_BAR
    mix = Mix(loop + 9)
    swing = lambda: rng.uniform(-0.008, 0.012)  # human timing  # noqa: E731

    # cellos: one held bass per bar (arco, soft), two-bar slurs where the root repeats
    cello_notes = []
    for bar in range(bars):
        bass = midi(chord_at(bar, 0)[0])
        if bass < midi("C2"):
            bass += 12
        sect = "intro" if bar < 4 else "outro" if bar >= 36 else ""
        v = 0.42 if sect else 0.55 + (0.12 if 28 <= bar < 36 else 0)
        cello_notes.append((bar * RN_BAR + 0.02, RN_BAR * 0.96, bass, v))
    for chunk in range(0, bars, 8):
        line, s0 = bowed_line([c for c in cello_notes if chunk * RN_BAR <= c[0] < (chunk + 8) * RN_BAR], rng, "cellos", 4, 0.55)
        mix.add(line, max(0.0, s0))

    # violas: a sustained pad of the inner chord tones, only from A' on (fuller), quieter in B
    for bar in range(12, 36):
        _, pcs = chord_at(bar, 0)
        tones = voice_near(pcs[:3], midi("F3"), midi("D4"))
        v = 0.32 if 20 <= bar < 28 else 0.4
        if bar < 14:  # the violas creep in under the violins' entrance (A')
            v *= 0.35 + 0.65 * (bar - 12) / 2
        notes = [(bar * RN_BAR, RN_BAR * 1.02, m, v) for m in tones]
        line, s0 = bowed_line(notes, rng, "violas", 3, 0.32)
        mix.add(line, max(0.0, s0))

    # piano waltz left hand: bass on 1 (A, B, outro), chord on 2 and 3
    for bar in range(4, bars):
        if 12 <= bar < 20 or 28 <= bar < 36:
            continue  # the harp ripples (A') / the full texture (A'') carry these bars
        bass_name, _ = chord_at(bar, 0)
        b = midi(bass_name) + 12
        mix.add(piano(b, RN_BEAT * 1.6, 0.36, rng), bar * RN_BAR + swing())
        for beat in (1, 2):
            _, pcs = chord_at(bar, beat)
            for m in voice_near(pcs[:3], midi("F3"), midi("E4")):
                mix.add(piano(m, RN_BEAT * 0.8, 0.2, rng), bar * RN_BAR + beat * RN_BEAT + swing(), 0.85)

    # A'': the piano left hand in broken chords under the full strings
    for bar in range(28, 36):
        for i, beat in enumerate((0, 1, 2)):
            _, pcs = chord_at(bar, beat)
            tones = voice_near(pcs[:3], midi("D3"), midi("D4"))
            m = midi(chord_at(bar, 0)[0]) + 12 if beat == 0 else tones[(i + bar) % len(tones)]
            mix.add(piano(m, RN_BEAT * 1.2, 0.3 if beat == 0 else 0.22, rng), bar * RN_BAR + beat * RN_BEAT + swing())

    # harp: arpeggios in the intro and outro, rippling eighths in A' and A'', a sweep into B
    def harp_arp(bar, rising=True, vel=0.42, reach=6):
        _, pcs = chord_at(bar, 0)
        root = midi(chord_at(bar, 0)[0]) + 12
        tones = sorted({root} | set(voice_near(pcs, root, root + 12)) | {root + 12} | set(voice_near(pcs, root + 12, root + 24)))
        tones = tones[:reach] if rising else tones[:reach][::-1]
        for i, m in enumerate(tones):
            mix.add(harp(m, vel * (0.85 + 0.15 * (i == 0)), rng), bar * RN_BAR + i * RN_BEAT / 2 + swing(), 0.75)
    for bar in list(range(0, 4)) + list(range(36, 40)):
        harp_arp(bar, True, 0.4 if bar < 4 else 0.34)
    for bar in list(range(12, 20)) + list(range(28, 36)):
        _, pcs = chord_at(bar, 0)
        tones = voice_near(pcs[:3], midi("A3"), midi("A4"))
        patt = [tones[0], tones[1], tones[2], tones[1] + 12, tones[2], tones[1]]
        for i, m in enumerate(patt):
            _, pcs_i = chord_at(bar, i // 2)
            if (m % 12) not in {midi(pc + "3") % 12 for pc in pcs_i}:
                m = voice_near(pcs_i[:3], m - 3, m + 3)[0]
            mix.add(harp(m, 0.24 if bar < 28 else 0.2, rng), bar * RN_BAR + i * RN_BEAT / 2 + swing(), 0.7)
    # a glissando up into B (bar 19 beat 3) and down out of it (bar 27 beat 3)
    for i, nm in enumerate(["F4", "A4", "C5", "F5", "A5", "C6", "F6"]):
        mix.add(harp(midi(nm), 0.3, rng), 19 * RN_BAR + 2 * RN_BEAT + i * 0.05, 0.7)
    for i, nm in enumerate(["A6", "E6", "C#6", "A5", "G5", "E5", "C#5"]):
        mix.add(harp(midi(nm), 0.28, rng), 27 * RN_BAR + 2 * RN_BEAT + i * 0.055, 0.7)

    # the tune: piano (A, B, outro), violins (A', A''), piano an octave below the violins in A''
    for seq, bar0, who in ((RN_A, 4, "piano"), (RN_A2, 12, "violins"), (RN_B, 20, "piano"), (RN_A3, 28, "violins"),
                           (RN_OUTRO, 36, "piano")):
        line = rn_line(seq, bar0)
        if who == "piano":
            for i, (s, d, m) in enumerate(line):
                v = rn_phrase_vel(i % max(1, len(line) // 2), max(1, len(line) // 2), 0.5, 0.7)
                if bar0 == 36:
                    v *= 0.75
                mix.add(piano(m, d * 0.97, v, rng), s + swing())
        else:
            notes = [(s, d * 0.995, m, rn_phrase_vel(i % 10, 10, 0.6, 0.9)) for i, (s, d, m) in enumerate(line)]
            ln, s0 = bowed_line(notes, rng, "violins", 7, 1.15)
            mix.add(ln, max(0.0, s0))
            if bar0 == 28:
                for i, (s, d, m) in enumerate(line):
                    mix.add(piano(m - 12, d * 0.9, 0.38, rng), s + swing(), 0.8)
    counter = [(s, d, m, 0.5) for s, d, m in rn_line(RN_B_COUNTER, 20)]
    ln, s0 = bowed_line(counter, rng, "violins", 6, 0.55)
    mix.add(ln, max(0.0, s0))

    # a few celesta glints at phrase ends
    for bar, nm in ((11, "D6"), (19, "A6"), (27, "C#6"), (35, "D6")):
        mix.add(celesta(midi(nm), 0.1, rng), bar * RN_BAR + RN_BEAT)

    x = mix.buf
    x = reverb(x, hall_ir(3.0, rng, 6800, 0.026, 1.1), 0.34)
    # warm the top a touch, gentle low end
    x = peak(x, 180, 0.8, 1.5)
    x = peak(x, 3500, 0.9, -1.5)
    # seamless loop: everything ringing past the end folds onto the start
    n = sec(loop)
    out = x[:, :n].copy()
    tail = x[:, n:]
    out[:, :tail.shape[1]] += tail[:, :n]
    return master(out, -1.5, 1.1)


PACKS = {
    "crimson-rose-atelier": {
        "seed": 2100,
        "fx": {"crack": cr_crack, "flap": cr_flap, "draw": cr_draw, "reveal": cr_reveal, "bloom": cr_bloom,
               "page": cr_page, "fold": cr_fold, "stamp": cr_stamp, "petal": cr_petal, "tap": cr_tap, "chime": cr_chime},
        "music": {"rose-nocturne": render_rose_nocturne},
    },
}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--pack", choices=sorted(PACKS), action="append")
    ap.add_argument("--only", choices=["fx", "music"])
    ap.add_argument("--fx", action="append", help="render only these effect names")
    ap.add_argument("--wav", help="also write .wav copies into this folder (not committed)")
    args = ap.parse_args()
    for pack in args.pack or sorted(PACKS):
        spec = PACKS[pack]
        if args.only != "music":
            for k, (name, fn) in enumerate(sorted(spec["fx"].items())):
                if args.fx and name not in args.fx:
                    continue
                x = fn(np.random.default_rng(spec["seed"] + k))
                dest = os.path.join(AUDIO, "fx", pack, f"{name}.mp3")
                encode(x, dest, "96k", f"{pack} {name}", args.wav)
                print(f"fx/{pack}/{name}.mp3  {x.shape[1] / SR:4.2f} s  {os.path.getsize(dest) / 1024:5.1f} KB")
        if args.only != "fx":
            for tid, fn in spec["music"].items():
                x = fn()
                dest = os.path.join(AUDIO, "music", f"{tid}.mp3")
                encode(x, dest, "112k", tid, args.wav)
                print(f"music/{tid}.mp3  {x.shape[1] / SR:5.1f} s  {os.path.getsize(dest) / 1024:6.0f} KB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
