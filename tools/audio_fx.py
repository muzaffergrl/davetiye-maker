#!/usr/bin/env python3
"""G967 — platform ses efektleri: fiziğe dayalı foley sentezi (yalnız numpy).

Her efekt, gerçek nesnenin nasıl ses çıkardığından kurulur; düz filtreli gürültü değildir:

- kâğıt: hareket hızını izleyen bant gürültüsü (merkez frekansı hızla kayar) + lif dokusu (genlik pürüzü) + kâğıt
  bükülürken çıkan mikro çıtırtılar (Poisson süreci; her biri 0,1–0,6 ms'lik bir patlama ve 1–2 sönümlü rezonans) +
  kapağın ittiği hava + kapak yatarken yumuşak düşüş;
- mum mühür: kırılma geçişi (kısa uyarım → küçük, sert cisim modları) + ikincil çatlaklar + zarfın gövdesinden alçak
  bir tok ses + dökülen kırıntılar;
- ipek kurdele / sicim / kordon / deri: sürtünme yatağı, dokuma ya da lif pürüzü, yapış-kay (stick-slip) darbe dizisi
  → rezonatör bankası (gıcırtı);
- tahta kutu kapağı: menteşe gıcırtısı (yapış-kay → ahşap modları) + keçeye oturan kapak;
- metal klips / toka / anahtar: modal tıklar (uyumsuz kısmi sesler, hafif vuru), mandal (cırcır) tık dizisi;
- cam / çan / çelesta / arp / müzik kutusu tarağı: uyumsuz kısmi sesli vurmalı modeller, telli çalgı için tel modeli;
- hava / su / alev / kanat: zamanla değişen spektral zarf (STFT ile), türbülans, Minnaert kabarcıkları.

Ardından: stereo genişlik, sentetik küçük oda yankısı (frekansa bağlı sönüm), DC temizliği, tıksız giriş/çıkış,
ITU-R BS.1770 / EBU R128 bütünleşik ses yüksekliği (−20 LUFS çevresi) ve ≤ −1,5 dBTP gerçek tepe (4× aşırı örnekleme).
Aynı ad aynı sesi üretir (tohum = adın CRC32'si; efekt eklemek diğerlerini değiştirmez).

Dışarıdan kayıt, örnek (sample) ya da ses kütüphanesi kullanılmaz: kaynak kaydı platform/public/audio/LICENSES.md.
Çağıran: tools/audio_synth.py (--only fx). Liste: EFFECTS.
"""

from __future__ import annotations

import math
import zlib
from dataclasses import dataclass
from typing import Callable

import numpy as np

SR = 44100
Curve = Callable[[np.ndarray], np.ndarray]


def N(sec: float) -> int:
    return max(1, int(round(sec * SR)))


def T(n: int) -> np.ndarray:
    return np.arange(n) / SR


def rng_for(name: str) -> np.random.Generator:
    return np.random.default_rng(zlib.crc32(("bke-fx:" + name).encode()))


# ------------------------------------------------------------------------------------------------------- gestures


def bump(t0: float, tpk: float, t1: float, p: float = 1.0) -> Curve:
    """Speed of a gesture: 0 before t0, half-cosine rise to 1 at tpk, half-cosine fall to 0 at t1 (then 0)."""

    def f(t):
        t = np.asarray(t, dtype=float)
        out = np.zeros_like(t)
        a = (t >= t0) & (t < tpk)
        out[a] = 0.5 - 0.5 * np.cos(np.pi * (t[a] - t0) / max(tpk - t0, 1e-9))
        b = (t >= tpk) & (t <= t1)
        out[b] = 0.5 + 0.5 * np.cos(np.pi * (t[b] - tpk) / max(t1 - tpk, 1e-9))
        return out ** p

    return f


def decay_from(t0: float, tau: float) -> Curve:
    return lambda t: np.where(np.asarray(t) >= t0, np.exp(-np.maximum(np.asarray(t) - t0, 0) / tau), 0.0)


def ramp(t0: float, t1: float, a: float, b: float) -> Curve:
    return lambda t: a + (b - a) * np.clip((np.asarray(t) - t0) / max(t1 - t0, 1e-9), 0, 1)


# -------------------------------------------------------------------------------------------- spectral helpers


def lp(f, fc, order=2):
    return 1.0 / np.sqrt(1.0 + (np.asarray(f) / fc) ** (2 * order))


def hp(f, fc, order=2):
    return 1.0 / np.sqrt(1.0 + (fc / np.maximum(np.asarray(f), 1e-3)) ** (2 * order))


def band(f, lo, hi, order=2):
    return hp(f, lo, order) * lp(f, hi, order)


def lgauss(f, fc, sigma_oct):
    return np.exp(-0.5 * (np.log2(np.maximum(np.asarray(f), 1.0) / fc) / sigma_oct) ** 2)


def tilt(f, db_per_oct, ref=1000.0):
    return (np.maximum(np.asarray(f), 20.0) / ref) ** (db_per_oct / 6.0206)


def fft_filter(x: np.ndarray, mag: Callable[[np.ndarray], np.ndarray], pad: int = 4096) -> np.ndarray:
    """Zero-phase filtering by a magnitude response (padded both sides, so nothing wraps round)."""
    x = np.atleast_2d(x)
    n = x.shape[1]
    m = 1 << int(math.ceil(math.log2(n + 2 * pad)))
    f = np.fft.rfftfreq(m, 1 / SR)
    X = np.fft.rfft(np.pad(x, ((0, 0), (pad, m - n - pad))), axis=1)
    y = np.fft.irfft(X * mag(f)[None, :], m, axis=1)
    return y[:, pad:pad + n]


def fftconv(a: np.ndarray, b: np.ndarray) -> np.ndarray:
    n = len(a) + len(b) - 1
    m = 1 << int(math.ceil(math.log2(n)))
    return np.fft.irfft(np.fft.rfft(a, m) * np.fft.rfft(b, m), m)[:n]


def lowpass_causal(x: np.ndarray, fc: float, order: int = 2) -> np.ndarray:
    """Causal lowpass (cascaded one-pole sections as exponential kernels): no pre-ringing before an onset."""
    k = np.exp(-2 * math.pi * fc * T(N(6 / (2 * math.pi * fc)) + 1))
    k /= k.sum()
    y = x
    for _ in range(order):
        y = fftconv(y, k)[:len(x)]
    return y


# ------------------------------------------------------------------------------------- time-varying noise (STFT)

NFFT = 1024
HOP = 256
FREQS = np.fft.rfftfreq(NFFT, 1 / SR)
WIN = np.hanning(NFFT + 1)[:-1]


def shaped_noise(n: int, r: np.random.Generator, spec: Callable[[np.ndarray, np.ndarray], np.ndarray]) -> np.ndarray:
    """Noise whose magnitude spectrum at time t is spec(t, f) (frames of 23 ms, 75 % overlap, Hann OLA).
    spec(t, f) = 1 everywhere gives unit-variance white noise."""
    frames = int(math.ceil((n + NFFT) / HOP)) + 1
    tc = (np.arange(frames) * HOP / SR)[:, None]
    M = np.broadcast_to(spec(tc, FREQS[None, :]), (frames, len(FREQS)))
    Z = (r.standard_normal(M.shape) + 1j * r.standard_normal(M.shape)) / math.sqrt(2)
    blocks = np.fft.irfft(M * Z, NFFT, axis=1) * WIN
    out = np.zeros((frames - 1) * HOP + NFFT)
    for i in range(frames):
        out[i * HOP:i * HOP + NFFT] += blocks[i]
    return out[NFFT // 2:NFFT // 2 + n] * math.sqrt(NFFT / 1.5)


def pan_gains(p: float) -> tuple[float, float]:
    a = (np.clip(p, -1, 1) + 1) * math.pi / 4
    return math.cos(a) * math.sqrt(2), math.sin(a) * math.sqrt(2)


def stereo_pair(n, r, spec, width=0.5):
    """Two independent realisations mixed so their correlation falls as width goes 0 → 1."""
    a = shaped_noise(n, r, spec)
    b = shaped_noise(n, r, spec)
    th = width * math.pi / 4
    return np.stack([a * math.cos(th) + b * math.sin(th), a * math.cos(th) - b * math.sin(th)])


def mono(x: np.ndarray, pan: float = 0.0) -> np.ndarray:
    gl, gr = pan_gains(pan)
    return np.stack([x * gl, x * gr])


def repan(x: np.ndarray, pan: Callable[[np.ndarray], np.ndarray] | float) -> np.ndarray:
    """Moves the middle of a stereo signal (side kept): static pan or a pan curve over time."""
    mid = (x[0] + x[1]) / 2
    side = (x[0] - x[1]) / 2
    p = pan(T(x.shape[1])) if callable(pan) else np.full(x.shape[1], float(pan))
    a = (np.clip(p, -1, 1) + 1) * math.pi / 4
    return np.stack([mid * np.cos(a) * math.sqrt(2) + side, mid * np.sin(a) * math.sqrt(2) - side])


# ------------------------------------------------------------------------------------------------- building blocks


def bed(n, r, vel: Curve, c0, c1, sigma=1.0, lo=60.0, hi=15000.0, gamma=1.0, width=0.5, tilt_db=0.0) -> np.ndarray:
    """Friction / air bed: a log-Gaussian band whose centre glides c0 → c1 as the motion speed vel(t) (0..1) rises,
    level ∝ vel^gamma — faster rubbing is louder and brighter, as with real paper, cloth and air."""

    def spec(tc, f):
        v = np.clip(vel(tc), 0, 1)
        c = c0 * (c1 / c0) ** v
        return (v ** gamma) * lgauss(f, c, sigma) * band(f, lo, hi, 2) * tilt(f, tilt_db)

    return stereo_pair(n, r, spec, width)


def rough(n, r, lo, hi, depth) -> np.ndarray:
    """Amplitude roughness (fibres, weave, pile, turbulence): 1 + depth × band-limited noise, never below 0."""
    x = shaped_noise(n, r, lambda tc, f: band(f, lo, hi, 2) + 0 * tc)
    x /= np.sqrt(np.mean(x ** 2)) + 1e-12
    return np.clip(1 + depth * x, 0, None)


def ring(n: int, modes, detune: float = 0.0) -> np.ndarray:
    """Impulse response of a bank of damped modes [(freq, decay s, amp)]; detune adds a beating twin per mode."""
    t = T(n)
    out = np.zeros(n)
    for f, d, a in modes:
        if f >= SR * 0.46:
            continue
        e = np.exp(-t / d)
        out += a * e * np.sin(2 * math.pi * f * t)
        if detune:
            out += 0.6 * a * e * np.sin(2 * math.pi * f * (1 + detune) * t)
    return out


def excitation(r, width_ms: float, noise: float) -> np.ndarray:
    """A strike: half-sine pulse (width = hardness) plus a little noise."""
    w = max(2, int(width_ms * 1e-3 * SR))
    pulse = np.sin(np.pi * (np.arange(w) + 0.5) / w)
    pulse += noise * r.standard_normal(w) * np.exp(-np.arange(w) / (w / 2))
    return pulse / w


def strike(n, r, at, modes, width_ms=0.2, noise=0.3, pan=0.0, detune=0.0012, length=None) -> np.ndarray:
    """An object struck at time `at`: excitation through its modes (hard → short pulse → brighter)."""
    out = np.zeros(n)
    i = int(at * SR)
    if i >= n:
        return np.zeros((2, n))
    dur = length or min(n - i, int(5 * max(d for _, d, _ in modes) * SR) + 64)
    y = np.convolve(excitation(r, width_ms, noise), ring(dur, modes, detune))[:dur]
    y /= np.max(np.abs(y)) + 1e-12
    out[i:i + len(y)] += y[:n - i]
    return mono(out, pan)


def thud(n, r, at, freqs=(150.0, 260.0), decay=0.035, lp_hz=1200.0, pan=0.0) -> np.ndarray:
    """A soft landing (paper, felt, cloth): low modes plus a dull noise puff."""
    out = np.zeros(n)
    i = int(at * SR)
    if i >= n:
        return np.zeros((2, n))
    m = min(n - i, N(decay * 6 + 0.02))
    t = T(m)
    body = sum(a * np.exp(-t / (decay * k)) * np.sin(2 * math.pi * f * t) for f, a, k in zip(freqs, (1.0, 0.55, 0.4), (1.0, 0.7, 0.5)))
    att = 1 - np.exp(-t / 0.0015)
    puff = lowpass_causal(r.standard_normal(m) * np.exp(-t / 0.009), lp_hz, 2)
    puff -= lowpass_causal(puff, 60, 1)
    y = body * att + 0.3 * puff / (np.max(np.abs(puff)) + 1e-12)
    y *= np.clip(t / 0.0012, 0, 1)
    out[i:i + m] += y / (np.max(np.abs(y)) + 1e-12)
    return mono(out, pan)


def puff(n, r, at, dur, centre, sigma=1.1, width=0.4) -> np.ndarray:
    """A short breath of air (something light leaving, a flame catching)."""
    return bed(n, r, bump(at, at + min(0.015, dur * 0.2), at + dur, 1.6), centre * 0.8, centre * 1.25, sigma,
               40, 12000, gamma=1.0, width=width)


def poisson_times(r, n, rate: Curve) -> np.ndarray:
    tt = T(n)
    rmax = float(np.max(rate(tt)))
    if rmax <= 0:
        return np.zeros(0)
    cand = np.sort(r.uniform(0, n / SR, r.poisson(rmax * n / SR)))
    return cand[r.uniform(0, 1, len(cand)) < rate(cand) / rmax]


GRAIN = int(0.009 * SR)
TG = np.arange(GRAIN) / SR


def crinkle_grain(r, lo, hi, decay=(0.25e-3, 1.6e-3)) -> np.ndarray:
    """One buckle of a sheet: 0.1–0.6 ms noise burst through one or two damped modes between lo and hi."""
    bl = max(2, int(r.uniform(0.1e-3, 0.6e-3) * SR))
    burst = r.standard_normal(bl) * np.exp(-np.arange(bl) / (bl / 3))
    g = np.zeros(GRAIN)
    for _ in range(int(r.integers(1, 3))):
        f = math.exp(r.uniform(math.log(lo), math.log(hi)))
        d = r.uniform(*decay)
        g += np.convolve(burst, np.exp(-TG / d) * np.sin(2 * math.pi * f * TG))[:GRAIN] * r.uniform(0.6, 1.0)
    g[:bl] += 0.2 * burst
    return g / (np.max(np.abs(g)) + 1e-12)


def crinkles(n, r, rate: Curve, lo=1500.0, hi=7000.0, decay=(0.25e-3, 1.6e-3), width=0.6, pan=0.0, amp: Curve | None = None,
             tail=2.4, cap=3.5) -> np.ndarray:
    """Micro-events of paper / leaves / foam: an inhomogeneous Poisson process (rate(t) per s), Pareto strengths
    (few loud, many faint, as in real crackle), each at a random place within ±width of `pan`."""
    out = np.zeros((2, n))
    for t0 in poisson_times(r, n, rate):
        i = int(t0 * SR)
        g = crinkle_grain(r, lo, hi, decay)
        a = min(r.pareto(tail) + 0.12, cap) * (float(amp(np.array([t0]))[0]) if amp else 1.0)
        gl, gr = pan_gains(float(np.clip(pan + r.uniform(-width, width), -1, 1)))
        m = min(GRAIN, n - i)
        out[0, i:i + m] += g[:m] * a * gl
        out[1, i:i + m] += g[:m] * a * gr
    return out


def creak(n, r, rate: Curve, amp: Curve, modes, jitter=0.1, pan=0.0) -> np.ndarray:
    """Stick-slip friction (hinge, leather, knot): a pulse train whose rate(t) sets the pitch of the creak, each
    slip exciting the object's modes."""
    tt = T(n)
    wob = shaped_noise(n, r, lambda tc, f: lp(f, 12, 2) + 0 * tc)
    wob /= np.max(np.abs(wob)) + 1e-12
    ph = np.cumsum(np.maximum(rate(tt) * (1 + jitter * wob), 1.0)) / SR
    idx = np.nonzero(np.diff(np.floor(ph)) > 0)[0] + 1
    exc = np.zeros(n)
    exc[idx] = amp(tt[idx]) * r.uniform(0.55, 1.0, len(idx))
    exc += np.roll(exc, 1) * -0.5 + np.roll(exc, 2) * 0.15  # a slip is a short asymmetric kick, not a pure spike
    y = fftconv(exc, ring(N(max(d for _, d, _ in modes) * 6), modes))[:n]
    return mono(y / (np.max(np.abs(y)) + 1e-12), pan)


def bell(n, at, f, partials, tau, attack=0.002, beat=0.8, pan=0.0) -> np.ndarray:
    """A struck bar / bell / glass: inharmonic partials [(ratio, amp, decay scale)], each a beating pair."""
    out = np.zeros(n)
    i = int(at * SR)
    if i >= n:
        return np.zeros((2, n))
    t = T(n - i)
    y = np.zeros(n - i)
    for ratio, a, ds in partials:
        fr = f * ratio
        if fr >= 16500:
            continue
        e = np.exp(-t / (tau * ds))
        db = beat * math.sqrt(ratio) / 2
        y += a * e * (np.sin(2 * math.pi * (fr - db) * t) + np.sin(2 * math.pi * (fr + db) * t)) / 2
    y *= 1 - np.exp(-t / (attack / 3))
    out[i:] = y
    return mono(out, pan)


def pluck(n, at, f, tau1=1.3, pos=0.27, inharm=8e-5, bright=0.82, pan=0.0) -> np.ndarray:
    """A plucked string (harp): partial k at k·f·√(1+Bk²), amplitude from the pluck point, higher partials die first."""
    out = np.zeros(n)
    i = int(at * SR)
    t = T(n - i)
    y = np.zeros(n - i)
    for k in range(1, 16):
        fk = k * f * math.sqrt(1 + inharm * k * k)
        if fk > 14000:
            break
        ak = abs(math.sin(k * math.pi * pos)) / k ** 1.1 * bright ** (k - 1)
        y += ak * np.exp(-t / (tau1 / (1 + 0.32 * (k - 1) ** 1.15))) * np.sin(2 * math.pi * fk * t)
    y *= 1 - np.exp(-t / 0.0012)
    out[i:] = y
    return mono(out, pan)


def am_sine(n, rate, depth, phase=0.0) -> np.ndarray:
    return 1 + depth * np.sin(2 * math.pi * rate * T(n) + phase)


# ------------------------------------------------------------------------------------------------------ the room


def room_ir(r, rt60=0.4, pre=0.004) -> np.ndarray:
    """A small, soft room: early reflections + a diffuse tail that decays faster in the highs (stereo, decorrelated)."""
    n = N(rt60 * 1.2 + 0.03)

    def spec(tc, f):
        rt = rt60 * np.clip(1.15 - 0.22 * np.log2(np.maximum(f, 400) / 400), 0.35, 1.15)
        return np.exp(-6.91 * tc / rt) * band(f, 140, 11000, 1)

    irs = []
    for _ in range(2):
        tail = shaped_noise(n, r, spec)
        t = T(n)
        tail *= np.clip((t - pre - 0.008) / 0.012, 0, 1)
        er = np.zeros(n)
        for _k in range(7):
            d = r.uniform(0.003, 0.026)
            er[int((pre + d) * SR)] += r.uniform(0.25, 0.7) * (1 - d / 0.04) * r.choice([-1, 1])
        er = lowpass_causal(er, 7000, 1)
        ir = 0.55 * er / (np.sqrt(np.sum(er ** 2)) + 1e-12) + tail / (np.sqrt(np.sum(tail ** 2)) + 1e-12)
        irs.append(ir / np.sqrt(np.sum(ir ** 2)))
    return np.stack(irs)


def add_room(x: np.ndarray, r, rt60: float, wet: float) -> np.ndarray:
    ir = room_ir(r, rt60)
    m = (x[0] + x[1]) / 2
    n = x.shape[1] + ir.shape[1] - 1
    y = np.zeros((2, n))
    y[:, :x.shape[1]] = x
    y[0] += wet * fftconv(m, ir[0])[:n]
    y[1] += wet * fftconv(m, ir[1])[:n]
    return y


# ------------------------------------------------------------------------------- loudness (ITU-R BS.1770-4) and peaks


def _biquad_mag(f, b, a, fs=48000.0):
    z = np.exp(-2j * np.pi * np.asarray(f) / fs)
    return np.abs((b[0] + b[1] * z + b[2] * z * z) / (a[0] + a[1] * z + a[2] * z * z))


def k_weight(f):
    """K-weighting (BS.1770 pre-filter + RLB high-pass); the reference 48 kHz biquads, read as a frequency curve."""
    shelf = _biquad_mag(f, (1.53512485958697, -2.69169618940638, 1.19839281085285), (1.0, -1.69065929318241, 0.73248077421585))
    hpf = _biquad_mag(f, (1.0, -2.0, 1.0), (1.0, -1.99004745483398, 0.99007225036621))
    return shelf * hpf


def loudness(x: np.ndarray) -> float:
    """Integrated loudness in LUFS (400 ms blocks, 75 % overlap, −70 LUFS absolute and −10 LU relative gates)."""
    y = fft_filter(x, k_weight)
    blk, hop = N(0.4), N(0.1)
    if y.shape[1] < blk:
        y = np.pad(y, ((0, 0), (0, blk - y.shape[1])))
    z = np.array([np.sum(np.mean(y[:, s:s + blk] ** 2, axis=1)) for s in range(0, y.shape[1] - blk + 1, hop)])
    lk = -0.691 + 10 * np.log10(np.maximum(z, 1e-20))
    z1 = z[lk > -70]
    if not len(z1):
        return -70.0
    rel = -0.691 + 10 * math.log10(np.mean(z1)) - 10
    z2 = z[(lk > -70) & (lk > rel)]
    return -0.691 + 10 * math.log10(np.mean(z2))


def true_peak(x: np.ndarray, over: int = 4) -> float:
    n = x.shape[1]
    X = np.fft.rfft(x, axis=1)
    y = np.fft.irfft(X, n * over, axis=1) * over
    return float(np.max(np.abs(y)))


def master(x: np.ndarray, target_lufs: float, tp_db: float = -1.5) -> np.ndarray:
    """DC and rumble out, a gentle 2–5 kHz taming, click-free ends, silence trimmed, loudness, true-peak ceiling."""
    x = x - x.mean(axis=1, keepdims=True)
    x = fft_filter(x, lambda f: hp(f, 32, 2) * (1 - 0.16 * lgauss(f, 3300, 0.55)))
    env = np.max(np.abs(x), axis=0)
    loud = np.nonzero(env > np.max(env) * 10 ** (-62 / 20))[0]
    x = x[:, :min(x.shape[1], loud[-1] + N(0.03))]
    fi, fo = N(0.0015), min(N(0.06), x.shape[1] // 3)
    x[:, :fi] *= np.sin(np.linspace(0, math.pi / 2, fi)) ** 2
    x[:, -fo:] *= np.cos(np.linspace(0, math.pi / 2, fo)) ** 2
    x *= 10 ** ((target_lufs - loudness(x)) / 20)
    tp = true_peak(x)
    ceiling = 10 ** (tp_db / 20)
    if tp > ceiling:
        x *= ceiling / tp
    return x


# ================================================================================================== THE EFFECTS
# Each returns a dry stereo array (2, n); the registry adds the room, then master() sets the level.


def _flap(r, dur, lo, hi, c0, c1, ck, crate, unstick, air, flop, width=0.45):
    """An envelope flap: unsticks (a short dense crackle), bends up (rustle + crinkles that follow its speed),
    pushes air, and lies back with a soft flop."""
    n = N(dur + 0.08)
    tm = dur * 0.66
    vel = bump(0.02, 0.36 * tm, tm, 1.2)
    x = bed(n, r, vel, c0, c1, 1.0, lo, hi, gamma=1.5, width=width, tilt_db=-1.5) * 0.3
    x *= rough(n, r, 30, 170, 0.45)
    rate = lambda t: crate * (0.6 * vel(t) ** 1.6 + unstick * 4.0 * decay_from(0.004, 0.03)(t))
    x += crinkles(n, r, rate, ck[0], ck[1], width=0.5) * 0.2
    x += crinkles(n, r, lambda t: 0.25 * rate(t), ck[0] * 0.45, ck[0] * 1.2, decay=(0.8e-3, 2.5e-3), width=0.4, cap=2.0) * 0.16
    x += bed(n, r, vel, 110, 260, 0.8, 45, 900, gamma=1.6, width=0.25) * air
    tf = tm + 0.015
    x += thud(n, r, tf, (150.0, 245.0), 0.032, 1300) * flop * 0.22
    x += crinkles(n, r, lambda t: 200 * decay_from(tf, 0.028)(t), ck[0], ck[1] * 0.8, width=0.4) * 0.09
    return x


def fx_paper(r):
    """Envelope flap — medium laid paper."""
    return _flap(r, 0.95, 300, 9000, 900, 2400, (1500, 7000), 150, 1.0, 0.35, 0.5)


def fx_paper_soft(r):
    """Envelope flap — heavy cotton / handmade paper: lower, softer, more air."""
    return _flap(r, 1.1, 170, 6000, 560, 1500, (900, 4300), 85, 0.6, 0.5, 0.65, width=0.5)


def fx_paper_crisp(r):
    """Envelope flap — crisp card stock / kraft: brighter crackle, sharper unstick."""
    return _flap(r, 0.85, 450, 11000, 1150, 3000, (2100, 9000), 240, 1.4, 0.25, 0.35, width=0.4)


def _fold(r, dur, shift):
    """A washi fold opening on its crease: a soft fibrous 'fwip', a few crinkles, a light settle."""
    n = N(dur + 0.06)
    vel = bump(0.0, 0.17 * dur / 0.6, 0.44 * dur / 0.6, 1.0)
    x = bed(n, r, vel, 1050 * shift, 2500 * shift, 1.15, 380, 10500, gamma=1.2, width=0.55) * 0.5
    x *= rough(n, r, 60, 260, 0.5)
    x += crinkles(n, r, lambda t: 110 * vel(t), 1700 * shift, 6300 * shift, decay=(0.3e-3, 1.0e-3)) * 0.1
    x += bed(n, r, vel, 140, 320, 0.8, 45, 800, gamma=1.8, width=0.2) * 0.35
    x += thud(n, r, 0.46 * dur / 0.6, (185.0 * shift, 310.0 * shift), 0.024, 1700) * 0.06
    return x


def fx_fold(r):
    return _fold(r, 0.6, 1.0)


def fx_fold_2(r):
    return _fold(r, 0.66, 0.89)


def _slide(r, dur, bright):
    """A card gliding out of its pocket: paper-on-paper friction that speeds up and slows down, fine fibre texture,
    edge hiss, rare micro-catches, and a soft release as it clears the mouth."""
    n = N(dur + 0.08)
    tm = dur * 0.86
    vel = bump(0.0, 0.42 * tm, tm, 1.5)
    x = bed(n, r, vel, 620 * bright, 1850 * bright, 1.05, 180, 9000, gamma=1.25, width=0.35, tilt_db=-1) * 0.6
    x *= rough(n, r, 120, 450, 0.22)
    x += bed(n, r, vel, 4300 * bright, 6900 * bright, 0.55, 2600, 13000, gamma=2.0, width=0.5) * 0.11
    x += crinkles(n, r, lambda t: 28 * vel(t), 1200, 5000) * 0.06
    tr = tm - 0.035
    x += crinkles(n, r, lambda t: 700 * decay_from(tr, 0.012)(t), 1500, 6000, width=0.3) * 0.08
    x += puff(n, r, tr, 0.13, 520) * 0.16
    return x


def fx_slide(r):
    return _slide(r, 1.25, 1.0)


def fx_slide_quick(r):
    return _slide(r, 0.75, 1.12)


def fx_page(r):
    """A page turning right → left: lift rustle, the swish of the sheet through the air with a short flutter at the
    top, and the soft slap as it lands."""
    n = N(1.08)
    lift = bump(0.0, 0.05, 0.17)
    swing = bump(0.08, 0.33, 0.63, 1.4)
    x = bed(n, r, lift, 1500, 3000, 1.0, 600, 10000, width=0.4) * 0.22
    x += crinkles(n, r, lambda t: 240 * lift(t) + 55 * swing(t), 1800, 7500) * 0.11
    air = bed(n, r, swing, 340, 1650, 1.2, 110, 8000, gamma=1.4, width=0.5) * 0.7
    air *= 1 + 0.35 * np.sin(2 * math.pi * 21 * T(n)) * bump(0.4, 0.52, 0.64)(T(n))
    x += repan(air, ramp(0.08, 0.63, 0.45, -0.45))
    x += thud(n, r, 0.635, (150.0, 255.0), 0.028, 4200, pan=-0.35) * 0.3
    x += crinkles(n, r, lambda t: 180 * decay_from(0.64, 0.03)(t), 1500, 6000, pan=-0.35, width=0.3) * 0.06
    return x


def fx_book(r):
    """A storybook cover: the cloth spine creaks, the board swings through the air, lands with a soft thump; the
    first pages settle."""
    n = N(1.4)
    cr = bump(0.0, 0.08, 0.4)
    x = creak(n, r, lambda t: 52 + 48 * np.clip(t / 0.32, 0, 1), cr,
              [(240.0, 0.02, 1.0), (560.0, 0.012, 0.6), (1150.0, 0.007, 0.35), (2100.0, 0.004, 0.12)], jitter=0.12) * 0.22
    sw = bump(0.1, 0.42, 0.8, 1.3)
    x += bed(n, r, sw, 170, 680, 1.1, 50, 4000, gamma=1.5, width=0.5) * 0.75
    x += bed(n, r, sw, 900, 2200, 1.0, 400, 8000, gamma=2.0, width=0.5) * 0.1
    x += thud(n, r, 0.82, (95.0, 165.0, 310.0), 0.06, 900, pan=-0.25) * 0.75
    x += crinkles(n, r, lambda t: 260 * decay_from(0.84, 0.05)(t), 1300, 5500, width=0.5) * 0.05
    return x


def fx_tear(r):
    """A perforated strip torn along the top: the bridges pop one after another, faster as the tear runs (left →
    right), inside a dry fibrous rasp; the strip end flutters free."""
    n = N(1.0)
    out = np.zeros((2, n))
    t, gap = 0.015, 0.025
    while t < 0.72:
        g = crinkle_grain(r, 1100, 4200, decay=(0.4e-3, 1.4e-3))
        i = int(t * SR)
        gl, gr = pan_gains(-0.55 + 1.1 * t / 0.72)
        a = r.uniform(0.55, 1.0)
        out[0, i:i + GRAIN] += g * a * gl
        out[1, i:i + GRAIN] += g * a * gr
        t += gap * r.uniform(0.75, 1.25)
        gap = max(0.013, gap * 0.965)
    x = out * 0.3
    v = bump(0.0, 0.08, 0.78, 0.6)
    rasp = bed(n, r, v, 1300, 2500, 1.0, 400, 9000, gamma=1.0, width=0.3) * 0.35
    x += repan(rasp * rough(n, r, 80, 300, 0.6), ramp(0.0, 0.72, -0.5, 0.5))
    fl = bump(0.72, 0.78, 0.92)
    x += repan(bed(n, r, fl, 1700, 3400, 1.0, 500, 10000, width=0.3) * am_sine(n, 26, 0.5) * 0.18, 0.5)
    return x


def fx_vellum(r):
    """A frosted vellum sleeve sliding off: smoother and glassier than paper, a faint stiff-sheet 'sing',
    crisp little crackles."""
    n = N(1.4)
    vel = bump(0.0, 0.45, 1.15, 1.4)
    x = bed(n, r, vel, 1700, 4000, 0.9, 600, 14000, gamma=1.3, width=0.45) * 0.45
    x *= rough(n, r, 200, 600, 0.12)
    x += bed(n, r, vel, 1650, 1780, 0.05, 900, 4000, gamma=2.0, width=0.2) * 0.05
    x += crinkles(n, r, lambda t: 40 * vel(t), 3000, 9500, decay=(0.2e-3, 0.7e-3)) * 0.07
    x += puff(n, r, 1.08, 0.15, 700) * 0.12
    return x


def fx_peel(r):
    """A paper label peeling off: the adhesive lets go in a dense run of micro-ticks, then the label lifts away."""
    n = N(1.0)
    rate = lambda t: 900 * bump(0.0, 0.22, 0.56)(t)
    x = crinkles(n, r, rate, 1400, 6500, decay=(0.15e-3, 0.6e-3), width=0.25, tail=3.0) * 0.12
    x += bed(n, r, bump(0.0, 0.2, 0.56), 1500, 3000, 1.0, 500, 9000, width=0.3) * 0.16
    x += bed(n, r, bump(0.5, 0.62, 0.86, 1.2), 600, 1500, 1.1, 150, 6000, width=0.5) * 0.3
    return x


def fx_flutter(r):
    """Cut-paper (tissue) flags flying up one after another into a garland, left → right."""
    n = N(1.65)
    x = np.zeros((2, n))
    for i in range(6):
        t0 = i * 0.11 + r.uniform(-0.008, 0.008)
        env = bump(t0, t0 + 0.07, t0 + 0.56, 1.2)
        layer = bed(n, r, env, 2000, 3800, 0.85, 800, 12000, width=0.25, tilt_db=-1) * am_sine(n, r.uniform(17, 24), 0.6, r.uniform(0, 6.28))
        layer += crinkles(n, r, lambda t, e=env: 160 * e(t), 2200, 8000) * 0.1
        layer += bed(n, r, env, 300, 650, 0.9, 80, 2000, width=0.2) * 0.15
        x += repan(layer, -0.6 + 1.2 * i / 5) * (0.95 - 0.05 * i)
    return x * 0.6


def fx_tap(r):
    """A soft paper tick for moving between pages."""
    n = N(0.16)
    x = strike(n, r, 0.0, [(1150.0, 0.0024, 1.0), (1900.0, 0.0012, 0.35), (5200.0, 0.0006, 0.2)], 0.3, 0.5)
    x += thud(n, r, 0.0, (420.0, 760.0), 0.008, 2500) * 0.4
    return x


def fx_ribbon(r):
    """A silk ribbon slipping free: smooth high friction with a fine weave, speeding up, and the end flicking away."""
    n = N(1.08)
    vel = bump(0.0, 0.48, 0.82, 1.6)
    x = bed(n, r, vel, 2000, 4400, 0.75, 900, 14000, gamma=1.4, width=0.45, tilt_db=-1.5) * 0.45
    x *= rough(n, r, 180, 380, 0.25)
    x += bed(n, r, vel, 700, 1500, 1.0, 200, 5000, gamma=1.8, width=0.3) * 0.14
    x += bed(n, r, bump(0.7, 0.8, 0.93), 2600, 5000, 0.8, 1500, 15000, width=0.4) * 0.16
    x += strike(n, r, 0.9, [(1500.0, 0.0016, 1.0), (2800.0, 0.001, 0.3)], 0.4, 0.6, pan=0.3) * 0.035
    return x


def fx_bow(r):
    """A silk bow untied loop by loop (left, then right), each pull rubbing through the knot with a tiny fabric
    squeak; then the ribbon slithers off."""
    n = N(1.45)
    x = np.zeros((2, n))
    for t0, pan, g in ((0.0, -0.3, 0.8), (0.25, 0.3, 1.0)):
        v = bump(t0, t0 + 0.12, t0 + 0.5, 1.2)
        layer = bed(n, r, v, 1300, 3000, 0.85, 400, 12000, gamma=1.3, width=0.3, tilt_db=-1.5) * 0.42 * rough(n, r, 180, 380, 0.25)
        layer += creak(n, r, lambda t, v=v: 150 + 80 * v(t), v, [(950.0, 0.004, 1.0), (1750.0, 0.003, 0.5)], jitter=0.2) * 0.05
        x += repan(layer, pan) * g
    v3 = bump(0.55, 0.86, 1.28, 1.5)
    x += bed(n, r, v3, 1800, 3900, 0.8, 600, 13000, gamma=1.4, width=0.45, tilt_db=-1.5) * 0.36 * rough(n, r, 180, 380, 0.25)
    x += thud(n, r, 1.28, (210.0, 380.0), 0.02, 1800) * 0.06
    return x


def fx_twine(r):
    """Jute twine unwinding: coarse friction, fibres that catch and let go (stick-slip), a few bigger snags."""
    n = N(1.15)
    vel = bump(0.0, 0.3, 0.95, 1.0)
    x = bed(n, r, vel, 850, 2300, 1.1, 230, 9000, gamma=1.1, width=0.4) * 0.42
    x *= rough(n, r, 25, 90, 0.75)
    x += creak(n, r, lambda t: 34 + 26 * vel(t), vel, [(1050.0, 0.003, 1.0), (2200.0, 0.002, 0.45)], jitter=0.35) * 0.1
    x += crinkles(n, r, lambda t: 85 * vel(t), 1400, 6000) * 0.11
    for _ in range(4):
        x += strike(n, r, r.uniform(0.08, 0.8), [(r.uniform(850, 1500), 0.004, 1.0), (r.uniform(2000, 2700), 0.002, 0.4)],
                    0.5, 0.8, pan=r.uniform(-0.3, 0.3)) * 0.08
    return x


def fx_cord(r):
    """A silk cord: the loop knocks over its stud, slithers off (thicker and smoother than twine) and drops."""
    n = N(1.15)
    x = strike(n, r, 0.0, [(620.0, 0.012, 1.0), (1450.0, 0.007, 0.5), (2900.0, 0.003, 0.15)], 1.0, 0.3) * 0.25
    vel = bump(0.03, 0.3, 0.86, 1.3)
    x += bed(n, r, vel, 1250, 3100, 0.9, 380, 12000, gamma=1.3, width=0.35) * 0.42 * rough(n, r, 120, 300, 0.3)
    x += thud(n, r, 0.9, (190.0, 340.0), 0.03, 1500) * 0.14
    return x


def fx_velvet(r):
    """Velvet brushed: muffled, plush (slow pile texture), almost no highs; settles softly."""
    n = N(1.1)
    vel = bump(0.0, 0.35, 0.9, 1.2)
    x = bed(n, r, vel, 340, 980, 1.1, 80, 4500, gamma=1.3, width=0.5, tilt_db=-2) * 0.8
    x *= rough(n, r, 15, 45, 0.3)
    x += bed(n, r, vel, 2500, 4500, 0.9, 1500, 9000, gamma=2.0, width=0.5) * 0.045
    x += thud(n, r, 0.83, (120.0, 200.0), 0.04, 700) * 0.14
    return x


def fx_lace(r):
    """Lace lifting off like a veil: a soft, wide, breathing whisper with very fine threads."""
    n = N(1.6)
    vel = bump(0.0, 0.5, 1.35, 1.0)
    x = bed(n, r, vel, 850, 2300, 1.4, 140, 12000, gamma=1.2, width=0.85, tilt_db=-1.5) * 0.4
    x *= am_sine(n, 2.6, 0.35, 1.0)
    x += crinkles(n, r, lambda t: 24 * vel(t), 4000, 9500, decay=(0.2e-3, 0.6e-3), width=0.8) * 0.035
    x += bed(n, r, vel, 150, 340, 0.9, 45, 900, width=0.4) * 0.25
    return x


def fx_curtain(r):
    """A heavy velvet stage curtain swinging open: a mass of moving air and cloth, brass rings at the start, a soft
    settle."""
    n = N(1.75)
    vel = bump(0.0, 0.45, 1.3, 1.2)
    x = bed(n, r, vel, 130, 560, 1.2, 35, 3500, gamma=1.3, width=0.7) * 0.9
    x += bed(n, r, vel, 600, 1500, 1.0, 200, 6000, gamma=1.5, width=0.6) * 0.28 * rough(n, r, 20, 60, 0.35)
    for k, tk in enumerate((0.02, 0.07, 0.15, 0.24)):
        x += strike(n, r, tk, [(3150.0 * (1 + 0.04 * k), 0.05, 1.0), (5100.0, 0.03, 0.5), (7400.0, 0.02, 0.35)], 0.12, 0.3,
                    pan=(-0.3, 0.2, -0.1, 0.3)[k]) * 0.035 * (1 - 0.15 * k)
    x += thud(n, r, 1.27, (105.0, 175.0), 0.07, 700) * 0.2
    return x


def fx_strap(r):
    """A leather strap drawn out of its buckle: a creak (stick-slip through leather modes) over a soft slide."""
    n = N(1.12)
    vel = bump(0.02, 0.3, 0.86, 1.2)
    x = creak(n, r, lambda t: 70 + 85 * vel(t), lambda t: vel(t) ** 0.8,
              [(330.0, 0.012, 1.0), (780.0, 0.008, 0.6), (1500.0, 0.005, 0.32), (2700.0, 0.003, 0.1)], jitter=0.12) * 0.3
    x += bed(n, r, vel, 650, 1700, 1.0, 180, 7000, width=0.35) * 0.3
    x += puff(n, r, 0.86, 0.12, 900) * 0.12
    return x


WAX = [(1850.0, 0.006, 1.0), (2900.0, 0.004, 0.5), (4300.0, 0.003, 0.3), (6900.0, 0.002, 0.42), (9100.0, 0.0015, 0.25)]


def fx_seal(r):
    """A wax seal breaking: the brittle crack, two smaller cracks, the envelope's body underneath, crumbs falling,
    the paper easing."""
    n = N(0.8)
    x = strike(n, r, 0.0, WAX, 0.07, 0.7) * 0.7
    # the fracture runs: a dense cluster of micro-cracks over ≈ 15 ms, then two smaller cracks
    x += crinkles(n, r, lambda t: 2200 * bump(0.0, 0.002, 0.016)(t), 1500, 7500, decay=(0.3e-3, 1.2e-3), width=0.15, cap=2.5) * 0.3
    x += strike(n, r, 0.013, [(f * 1.13, d, a) for f, d, a in WAX], 0.06, 0.7, pan=0.15) * 0.4
    x += crinkles(n, r, lambda t: 1600 * bump(0.04, 0.042, 0.052)(t), 1800, 8000, decay=(0.3e-3, 1.0e-3), width=0.2, cap=2.0) * 0.2
    x += strike(n, r, 0.042, [(f * 0.92, d, a) for f, d, a in WAX], 0.08, 0.7, pan=-0.12) * 0.24
    x += thud(n, r, 0.002, (140.0, 235.0), 0.03, 850) * 0.3
    x += crinkles(n, r, lambda t: 140 * decay_from(0.02, 0.1)(t), 3000, 9000, decay=(0.15e-3, 0.5e-3), width=0.5, cap=1.4) * 0.1
    x += bed(n, r, bump(0.02, 0.08, 0.32), 1500, 3000, 1.0, 400, 9000, width=0.4) * 0.1
    return x


def fx_seal_lift(r):
    """A wax seal lifting off whole: a soft low 'tck' as the wax lets go, a few crumbs, the paper easing."""
    n = N(0.66)
    x = strike(n, r, 0.0, [(1100.0, 0.004, 1.0), (1900.0, 0.003, 0.55), (3100.0, 0.002, 0.2)], 0.35, 0.3) * 0.4
    x += crinkles(n, r, lambda t: 1200 * bump(0.0, 0.003, 0.02)(t), 1200, 5000, decay=(0.4e-3, 1.4e-3), width=0.15, cap=2.0) * 0.18
    x += thud(n, r, 0.0, (170.0, 300.0), 0.02, 900) * 0.3
    x += crinkles(n, r, lambda t: 80 * decay_from(0.0, 0.06)(t), 2500, 8000, decay=(0.15e-3, 0.5e-3)) * 0.06
    x += bed(n, r, bump(0.03, 0.12, 0.42), 1200, 2600, 1.0, 300, 9000, width=0.4) * 0.14
    return x


BRASS = [(1880.0, 0.06, 1.0), (3150.0, 0.018, 0.3), (6350.0, 0.03, 0.55), (8900.0, 0.02, 0.4)]


def fx_clasp(r):
    """A brass clasp unhooking: the catch clicks, the hook swings and knocks, a tiny rattle, the body underneath."""
    n = N(0.78)
    x = strike(n, r, 0.0, BRASS, 0.1, 0.4) * 0.55
    x += strike(n, r, 0.066, [(f * 0.78, d * 0.8, a) for f, d, a in BRASS], 0.16, 0.3, pan=0.15) * 0.36
    x += strike(n, r, 0.112, [(f * 1.12, d * 0.5, a) for f, d, a in BRASS], 0.08, 0.4, pan=0.25) * 0.12
    x += thud(n, r, 0.0, (210.0, 380.0), 0.02, 1200) * 0.3
    return x


def fx_buckle(r):
    """A buckle's frame tipping open on its bar: a short metal scrape, the clank, the prong letting go."""
    n = N(0.9)
    sc = bump(0.0, 0.03, 0.09)
    x = bed(n, r, sc, 3000, 5200, 0.8, 1500, 12000, width=0.2) * 0.1 * rough(n, r, 200, 500, 0.6)
    iron = [(1350.0, 0.11, 1.0), (2240.0, 0.03, 0.35), (3650.0, 0.02, 0.18), (5150.0, 0.03, 0.25), (7300.0, 0.02, 0.2)]
    x += strike(n, r, 0.085, iron, 0.22, 0.3) * 0.55
    x += strike(n, r, 0.21, [(f * 1.35, d * 0.5, a) for f, d, a in iron], 0.1, 0.4, pan=0.2) * 0.18
    x += thud(n, r, 0.085, (160.0, 300.0), 0.03, 900) * 0.32
    x += creak(n, r, lambda t: 90 + 0 * t, bump(0.22, 0.3, 0.5), [(330.0, 0.01, 1.0), (800.0, 0.006, 0.5)], 0.15) * 0.06
    return x


def fx_key(r):
    """A music-box key wound two turns: ratchet clicks (steel pawl) through the wooden box, the key turning in its
    hole; the second turn a little tighter."""
    n = N(1.35)
    x = np.zeros((2, n))
    for turn, t0 in enumerate((0.0, 0.6)):
        gap = 0.074 - 0.006 * turn
        tk = t0 + 0.02
        for k in range(6):
            s = 1 + 0.04 * turn
            x += strike(n, r, tk, [(5400.0 * s, 0.004, 1.0), (7900.0 * s, 0.003, 0.6), (11200.0 * s, 0.002, 0.4)], 0.05, 0.3) * 0.2
            x += strike(n, r, tk, [(290.0, 0.03, 1.0), (540.0, 0.02, 0.6), (980.0, 0.012, 0.4), (1700.0, 0.006, 0.2)], 0.6, 0.2) \
                * (0.42 + 0.06 * turn) * r.uniform(0.8, 1.0)
            tk += gap * r.uniform(0.9, 1.1)
        v = bump(t0, t0 + 0.2, t0 + 0.5)
        x += bed(n, r, v, 1400, 2000, 0.5, 600, 6000, width=0.2) * 0.05 * rough(n, r, 100, 300, 0.5)
    return x


def fx_lock(r):
    """A turn-lock: the brass button turns (dry scrape) and drops into its detent, with a small overshoot click."""
    n = N(0.78)
    v = bump(0.0, 0.08, 0.2)
    x = bed(n, r, v, 2600, 4200, 0.7, 1200, 12000, width=0.2) * 0.1 * rough(n, r, 250, 600, 0.6)
    lock = [(1650.0, 0.04, 1.0), (2900.0, 0.012, 0.3), (6100.0, 0.025, 0.5), (8600.0, 0.015, 0.35)]
    x += strike(n, r, 0.2, lock, 0.11, 0.4) * 0.55
    x += strike(n, r, 0.236, [(f * 1.06, d * 0.7, a) for f, d, a in lock], 0.08, 0.4, pan=0.1) * 0.18
    x += thud(n, r, 0.2, (240.0, 420.0), 0.02, 1400) * 0.25
    return x


def fx_brooch(r):
    """A brooch coming off its pin: the catch clicks, the pin slides out of the cloth, a delicate tink as it frees."""
    n = N(1.0)
    x = strike(n, r, 0.0, [(5800.0, 0.012, 1.0), (8300.0, 0.008, 0.6)], 0.05, 0.3) * 0.2
    v = bump(0.04, 0.12, 0.34, 1.2)
    x += bed(n, r, v, 3600, 5800, 0.6, 2000, 13000, width=0.2) * 0.15 * rough(n, r, 150, 400, 0.5)
    x += strike(n, r, 0.34, [(1760.0, 0.16, 1.0), (3020.0, 0.04, 0.12), (6900.0, 0.08, 0.3), (9300.0, 0.05, 0.15)], 0.2, 0.05, pan=0.15) * 0.22
    return x


def fx_porcelain(r):
    """A porcelain button turning on paper (gritty, slowing), then lifting off with a pure ring."""
    n = N(1.3)
    v = bump(0.0, 0.12, 0.42)
    x = bed(n, r, v, 1450, 3100, 0.9, 500, 10000, width=0.2) * 0.17 * rough(n, r, 60, 220, 0.7)
    x += crinkles(n, r, lambda t: 70 * v(t), 2000, 7000) * 0.045
    x += strike(n, r, 0.44, [(1690.0, 0.3, 1.0), (2980.0, 0.05, 0.1), (6640.0, 0.12, 0.3), (9100.0, 0.07, 0.12)], 0.15, 0.05) * 0.22
    return x


def fx_tile(r):
    """A glazed tile turning over and clacking down twice."""
    n = N(0.98)
    v = bump(0.0, 0.08, 0.22)
    x = bed(n, r, v, 1800, 3400, 0.8, 600, 10000, width=0.3) * 0.1 * rough(n, r, 100, 400, 0.6)
    cer = [(1720.0, 0.035, 1.0), (3080.0, 0.012, 0.3), (4420.0, 0.01, 0.2), (6900.0, 0.01, 0.35)]
    x += strike(n, r, 0.22, cer, 0.1, 0.5) * 0.55
    x += strike(n, r, 0.31, [(f * 1.04, d * 0.8, a) for f, d, a in cer], 0.1, 0.5, pan=0.1) * 0.22
    x += thud(n, r, 0.22, (230.0, 460.0), 0.025, 1500) * 0.4
    x += strike(n, r, 0.22, [(5200.0, 0.22, 1.0)], 0.2, 0.0) * 0.02
    return x


WOOD = [(380.0, 0.014, 1.0), (820.0, 0.01, 0.7), (1450.0, 0.007, 0.45), (2350.0, 0.004, 0.18)]


def fx_lid(r):
    """A lacquered box lid on its hinge: a creak (stick-slip through the wood), a whisper of brass hinge, the air
    under the lid, the soft felt stop."""
    n = N(1.28)
    v = bump(0.03, 0.25, 0.72)
    x = creak(n, r, lambda t: 85 + 70 * np.clip((t - 0.03) / 0.6, 0, 1), lambda t: v(t) ** 0.9, WOOD, jitter=0.1) * 0.32
    x += bed(n, r, lambda t: v(t) ** 2, 2050, 2150, 0.04, 1200, 5000, width=0.1) * 0.025
    x += bed(n, r, v, 240, 680, 1.0, 70, 3000, width=0.4) * 0.25
    x += thud(n, r, 0.78, (140.0, 320.0), 0.05, 1000) * 0.55
    x += strike(n, r, 0.78, WOOD, 0.5, 0.2) * 0.16
    return x


def fx_twig(r):
    """A dry twig / bundle loosening: a small woody crack, needles and blossoms rustling, then it slides away."""
    n = N(1.05)
    woody = [(720.0, 0.012, 1.0), (1580.0, 0.008, 0.6), (2900.0, 0.004, 0.25)]
    x = strike(n, r, 0.0, woody, 0.25, 0.4) * 0.32
    x += strike(n, r, 0.045, [(f * 1.1, d, a) for f, d, a in woody], 0.2, 0.4, pan=0.1) * 0.14
    v = bump(0.02, 0.25, 0.86)
    x += crinkles(n, r, lambda t: 210 * v(t), 2200, 8000, decay=(0.2e-3, 0.9e-3), width=0.6) * 0.09
    x += bed(n, r, v, 1300, 2800, 1.0, 400, 11000, width=0.5) * 0.17
    return x


CELESTA = [(1.0, 1.0, 1.0), (2.756, 0.07, 0.2), (5.404, 0.025, 0.1)]


def fx_chime(r):
    """The card comes forward: a celesta-like A-major arpeggio (A5 C♯6 E6 A6), soft mallet, beating partials and a
    warm low bloom under it."""
    n = N(2.9)
    x = np.zeros((2, n))
    for f, at, pan, g in ((880.0, 0.0, -0.25, 1.0), (1108.7, 0.055, -0.08, 0.85), (1318.5, 0.11, 0.1, 0.78), (1760.0, 0.17, 0.25, 0.55)):
        x += bell(n, at, f, CELESTA, 1.15 * (880 / f) ** 0.45, 0.002, 0.9, pan) * g
        x += strike(n, r, at, [(1150.0, 0.002, 1.0), (620.0, 0.004, 0.6)], 1.5, 1.0, pan=pan) * 0.02  # felt mallet
    x += bell(n, 0.0, 440.0, [(1.0, 1.0, 1.0), (1.5, 0.35, 0.8)], 0.95, 0.06, 0.4) * 0.1
    return x


VIBES = [(1.0, 1.0, 1.0), (3.98, 0.06, 0.15), (9.9, 0.015, 0.08)]


def fx_chime_warm(r):
    """A warmer, lower bell arpeggio (E5 G♯5 B5 E6, vibraphone-like bars) with a low bloom."""
    n = N(3.2)
    x = np.zeros((2, n))
    for f, at, pan, g in ((659.3, 0.0, -0.22, 1.0), (830.6, 0.07, -0.06, 0.85), (987.8, 0.14, 0.08, 0.78), (1318.5, 0.22, 0.24, 0.5)):
        x += bell(n, at, f, VIBES, 1.5 * (660 / f) ** 0.4, 0.003, 0.7, pan) * g
    x += bell(n, 0.0, 329.6, [(1.0, 1.0, 1.0), (2.0, 0.25, 0.6)], 1.2, 0.08, 0.3) * 0.16
    return x


def fx_harp(r):
    """A short harp glissando up a D-major pentatonic (D5 → F♯6) that rings on."""
    n = N(2.9)
    x = np.zeros((2, n))
    notes = (587.3, 659.3, 740.0, 880.0, 987.8, 1174.7, 1318.5, 1480.0)
    for k, f in enumerate(notes):
        x += pluck(n, 0.045 * k + r.uniform(-0.004, 0.004), f, 1.35 * (587 / f) ** 0.35, 0.27, 8e-5, 0.8, -0.35 + 0.7 * k / 7) \
            * (0.7 + 0.04 * k)
    return x


def fx_sparkle(r):
    """A glint: three tiny high bells in a quick upward twinkle over a breath of air."""
    n = N(1.0)
    x = np.zeros((2, n))
    for k, (f, pan) in enumerate(((5274.0, -0.2), (6272.0, 0.12), (7459.0, 0.3))):
        x += bell(n, 0.02 + 0.035 * k, f, [(1.0, 1.0, 1.0), (1.5, 0.15, 0.5)], 0.34 - 0.06 * k, 0.0015, 2.0, pan) * (0.6 - 0.1 * k)
    x += bed(n, r, bump(0.0, 0.05, 0.42), 7000, 11000, 0.6, 5000, 16000, width=0.6) * 0.07
    return x


def fx_shimmer(r):
    """A sweep of light: a glassy, airy shimmer with tiny grains of light, crossing left → right."""
    n = N(1.65)
    sw = bump(0.0, 0.55, 1.35, 1.2)
    x = bed(n, r, sw, 6000, 9000, 0.6, 3500, 16000, width=0.9) * 0.16
    for _ in range(26):
        t0 = float(r.uniform(0.05, 1.3))
        f = math.exp(r.uniform(math.log(5600), math.log(11000)))
        x += bell(n, t0, f, [(1.0, 1.0, 1.0)], r.uniform(0.08, 0.25), 0.002, 0.0, -0.6 + 1.2 * t0 / 1.35) * r.uniform(0.04, 0.12) * float(sw(np.array([t0]))[0] + 0.2)
    return repan(x, ramp(0.0, 1.4, -0.4, 0.4))


def fx_stars(r):
    """Stars lighting up one by one: six small pure bells on an E-major pentatonic, across the sky."""
    n = N(1.9)
    x = np.zeros((2, n))
    seq = ((1480.0, 0.0, -0.5), (987.8, 0.16, 0.3), (1661.2, 0.29, -0.15), (1244.5, 0.47, 0.5), (1975.5, 0.62, -0.35), (1480.0, 0.8, 0.15))
    for f, at, pan in seq:
        x += bell(n, at, f, [(1.0, 1.0, 1.0), (2.71, 0.07, 0.3)], 0.55, 0.002, 1.1, pan) * r.uniform(0.55, 0.75)
    x += bed(n, r, bump(0.0, 0.5, 1.4), 6500, 9500, 0.6, 4000, 16000, width=0.9) * 0.03
    return x


def fx_comb(r):
    """A music-box phrase: steel comb tines (clamped-bar partials 1 : 6.27 : 17.55) plucked by the cylinder, coloured
    by the wooden box."""
    n = N(3.0)
    x = np.zeros((2, n))
    phrase = ((784.0, 0.0), (987.8, 0.19), (1174.7, 0.38), (987.8, 0.62), (880.0, 0.81), (784.0, 1.0))
    for f, at in phrase:
        f *= 2 ** (r.uniform(-4, 4) / 1200)
        x += bell(n, at, f, [(1.0, 1.0, 1.0), (6.27, 0.05, 0.07), (17.55, 0.01, 0.03)], 1.5 * (784 / f) ** 0.5, 0.0012, 0.4, r.uniform(-0.2, 0.2)) * 0.6
        x += strike(n, r, at, [(4800.0, 0.002, 1.0), (7600.0, 0.0015, 0.6)], 0.03, 0.2) * 0.03
        x += strike(n, r, at, [(330.0, 0.02, 1.0), (640.0, 0.012, 0.6), (1200.0, 0.007, 0.3)], 0.8, 0.1) * 0.05
    return x


def fx_whoosh(r):
    """Air moving past: a soft, wide whoosh that rises and falls in pitch and crosses left → right."""
    n = N(1.35)
    v = bump(0.0, 0.55, 1.15, 1.6)
    x = bed(n, r, v, 250, 1250, 1.2, 55, 9000, gamma=1.6, width=0.55, tilt_db=-1) * 0.8
    x *= rough(n, r, 6, 16, 0.25)
    return repan(x, ramp(0.0, 1.15, -0.45, 0.45))


def fx_wave(r):
    """A watercolour wave: a swell of water rolling across (left → right), foam fizzing at the crest, receding."""
    n = N(2.1)
    swell = bump(0.0, 0.7, 1.75, 1.1)
    x = bed(n, r, swell, 150, 620, 1.2, 35, 5000, gamma=1.3, width=0.6) * 0.8
    crest = bump(0.4, 0.8, 1.95)
    x += crinkles(n, r, lambda t: 1600 * crest(t) ** 1.5, 2500, 9000, decay=(0.1e-3, 0.5e-3), width=0.8) * 0.028
    x += bed(n, r, crest, 2400, 4300, 0.9, 1500, 13000, width=0.8) * 0.11
    return repan(x, ramp(0.0, 1.6, -0.55, 0.55))


def fx_water(r):
    """Water: a gentle slosh and a few bubbles (Minnaert resonances, rising as they reach the surface)."""
    n = N(1.25)
    slosh = bump(0.0, 0.25, 0.85)
    x = bed(n, r, slosh, 300, 880, 1.0, 90, 5000, width=0.5) * 0.35 * am_sine(n, 4.5, 0.5)
    for _ in range(6):
        at = float(r.uniform(0.05, 0.62))
        f0 = float(r.uniform(600, 1300))
        d = float(r.uniform(0.03, 0.06))
        i = int(at * SR)
        m = min(n - i, N(d * 4))
        t = T(m)
        y = np.sin(2 * math.pi * np.cumsum(f0 * (1 + 0.5 * t / d)) / SR) * np.exp(-t / (d / 2.5)) * (1 - np.exp(-t / 0.002))
        b = np.zeros(n)
        b[i:i + m] = y
        x += mono(b, float(r.uniform(-0.4, 0.4))) * float(r.uniform(0.12, 0.26))
    return x


def fx_wings(r):
    """Three doves taking wing (0, 0.3, 0.6 s): each a few soft wing beats (≈ 8.5 Hz) fading as it flies off."""
    n = N(1.75)
    x = np.zeros((2, n))
    for d, (t0, pan) in enumerate(((0.0, -0.45), (0.3, 0.1), (0.6, 0.5))):
        for k in range(6):
            tk = t0 + k * 0.118 * r.uniform(0.94, 1.06)
            flap = bed(n, r, bump(tk, tk + 0.012, tk + 0.07, 1.0), 1300, 550, 1.1, 200, 7000, width=0.3) * 0.5
            flap += crinkles(n, r, lambda t, a=tk: 400 * decay_from(a, 0.025)(t), 2600, 7000, width=0.2) * 0.03
            x += repan(flap, pan + 0.05 * k * np.sign(pan or 1)) * (1.0 - 0.13 * k) * (1 - 0.1 * d)
    return x


def fx_petals(r):
    """Blooms bursting out / petals shaken loose: a soft puff, then a light flurry that thins out."""
    n = N(1.25)
    x = puff(n, r, 0.0, 0.14, 700) * 0.22
    v = decay_from(0.02, 0.25)
    x += crinkles(n, r, lambda t: 260 * v(t), 1200, 4200, decay=(0.6e-3, 2.0e-3), width=0.8, tail=3.0, cap=1.2) * 0.07
    x += bed(n, r, lambda t: 0.8 * v(t), 1400, 2400, 1.1, 400, 9000, width=0.8) * 0.14
    return x


def fx_flash(r):
    """A vintage flashbulb: the shutter clicks, the bulb pops (a soft thump), and the flash unit's whine climbs as
    it recharges."""
    n = N(1.0)
    x = strike(n, r, 0.0, [(1900.0, 0.008, 1.0), (3500.0, 0.005, 0.45), (5600.0, 0.004, 0.35)], 0.08, 0.5) * 0.3
    x += strike(n, r, 0.008, [(2300.0, 0.006, 1.0), (4100.0, 0.004, 0.4)], 0.08, 0.5, pan=0.05) * 0.18
    pop = np.zeros(n)
    m = N(0.06)
    burst = lowpass_causal(r.standard_normal(m) * np.exp(-T(m) / 0.02), 2500, 2)
    pop[N(0.012):N(0.012) + m] = burst * np.clip(T(m) / 0.001, 0, 1)
    x += mono(pop / (np.max(np.abs(pop)) + 1e-12)) * 0.22
    x += thud(n, r, 0.012, (160.0, 290.0), 0.025, 1200) * 0.22
    t = T(n)
    f = 4800 * (9500 / 4800) ** np.clip((t - 0.12) / 0.7, 0, 1)
    whine = np.sin(2 * math.pi * np.cumsum(f) / SR) * bump(0.12, 0.2, 0.86, 0.7)(t)
    x += mono(whine) * 0.022
    x += bed(n, r, bump(0.12, 0.3, 0.86), 7000, 9000, 0.6, 5000, 15000, width=0.3) * 0.015
    return x


def fx_lantern(r):
    """A lantern kindled: the soft 'foomp' of a flame catching, then a fluttering flame that settles; a tiny wick
    crackle."""
    n = N(1.5)
    x = bed(n, r, bump(0.0, 0.03, 0.32, 1.2), 220, 520, 1.1, 50, 4000, width=0.4) * 0.45
    fl = lambda t: 0.6 * decay_from(0.05, 0.6)(t) * np.clip(np.asarray(t) / 0.06, 0, 1)
    x += bed(n, r, fl, 360, 520, 1.3, 80, 6000, width=0.5) * 0.5 * rough(n, r, 4, 15, 0.6)
    x += crinkles(n, r, lambda t: 7 * fl(t) / 0.6, 2000, 5500, width=0.3) * 0.05
    return x


def fx_film(r):
    """A strip of negatives running off across the screen: sprocket ticks (rate up, steady, down) over the smooth
    slide of celluloid, ending in a little flick."""
    n = N(1.6)
    rate = lambda t: 45 * np.clip(np.asarray(t) / 0.25, 0, 1) * np.clip((1.35 - np.asarray(t)) / 0.35, 0, 1)
    x = np.zeros((2, n))
    tt = T(n)
    ph = np.cumsum(rate(tt)) / SR
    for i in np.nonzero(np.diff(np.floor(ph)) > 0)[0]:
        t0 = i / SR
        x += strike(n, r, t0, [(2200.0, 0.003, 1.0), (4600.0, 0.002, 0.5), (7100.0, 0.0012, 0.4)], 0.05, 0.5,
                    pan=-0.6 + 1.2 * t0 / 1.35, detune=0, length=N(0.02)) * r.uniform(0.07, 0.1)
    v = lambda t: rate(t) / 45
    x += repan(bed(n, r, v, 2500, 4000, 0.9, 1200, 12000, width=0.3) * 0.045, ramp(0.0, 1.35, -0.6, 0.6))
    x += repan(bed(n, r, bump(1.3, 1.36, 1.5), 1800, 3600, 1.0, 600, 10000, width=0.3) * 0.18 * am_sine(n, 28, 0.5), 0.6)
    return x


def fx_brush(r):
    """Four broad brushstrokes on wet watercolour paper: dense bristle texture over a soft wet sweep."""
    n = N(1.45)
    x = np.zeros((2, n))
    for t0, pan in ((0.0, -0.4), (0.25, 0.1), (0.5, -0.1), (0.75, 0.4)):
        env = bump(t0, t0 + 0.035, t0 + 0.34, 0.8)
        layer = crinkles(n, r, lambda t, e=env: 1500 * e(t), 1200, 6000, decay=(0.1e-3, 0.4e-3), width=0.15, tail=4.0, cap=1.5) * 0.03
        layer += bed(n, r, env, 500, 1100, 1.0, 150, 5000, width=0.3) * 0.18 * rough(n, r, 40, 160, 0.4)
        layer += bed(n, r, env, 2000, 3600, 0.8, 1200, 10000, width=0.3) * 0.04 * rough(n, r, 200, 800, 0.5)
        x += repan(layer, ramp(t0, t0 + 0.34, pan - 0.12, pan + 0.12))
    return x


def fx_pen(r):
    """Initials inked: three short nib strokes (chattering scratch) with tiny touches at the starts."""
    n = N(0.75)
    x = np.zeros((2, n))
    for t0, d, pan in ((0.0, 0.16, -0.1), (0.2, 0.12, 0.05), (0.36, 0.2, 0.12)):
        env = bump(t0, t0 + 0.02, t0 + d, 0.6)
        x += repan(bed(n, r, env, 2400, 3600, 0.7, 1500, 11000, width=0.1) * 0.2 * rough(n, r, 200, 420, 0.7), pan)
        x += strike(n, r, t0, [(2100.0, 0.002, 1.0), (4300.0, 0.001, 0.4)], 0.1, 0.4, pan=pan) * 0.06
    return x


# -------------------------------------------------------------------------------------------------------- registry


@dataclass(frozen=True)
class Effect:
    fn: Callable[[np.random.Generator], np.ndarray]
    #: integrated loudness target (LUFS); ambient layers and UI ticks sit a little lower
    lufs: float
    #: small-room reverb: RT60 (s) and wet level
    rt60: float
    wet: float
    tr: str
    en: str
    #: the dry signal's fade at the end of its array (bells ring on, so they fade gently, like a damper)
    tail: float = 0.08


PAPER, CLOTH, HARD, BELL, AIR = (0.38, 0.16), (0.4, 0.16), (0.42, 0.18), (1.1, 0.3), (0.55, 0.14)


def _e(fn, lufs, room, tr, en):
    return Effect(fn, lufs, room[0], room[1], tr, en, 0.9 if room is BELL else 0.08)


EFFECTS: dict[str, Effect] = {
    # paper
    "paper": _e(fx_paper, -20, PAPER, "Zarf kapağı kalkar — orta gramaj kâğıt", "Envelope flap lifting — medium laid paper"),
    "paper-soft": _e(fx_paper_soft, -20, PAPER, "Zarf kapağı — kalın pamuklu / el yapımı kâğıt (yumuşak, alçak)", "Envelope flap — heavy cotton paper"),
    "paper-crisp": _e(fx_paper_crisp, -20, PAPER, "Zarf kapağı — sert karton / kraft (parlak çıtırtı)", "Envelope flap — crisp card / kraft"),
    "fold": _e(fx_fold, -21, PAPER, "Washi / ince kâğıt kanadı açılır", "A light paper fold opening"),
    "fold-2": _e(fx_fold_2, -21, PAPER, "Aynı kanadın biraz daha alçak çeşidi (arka arkaya kanatlar için)", "Variation of the fold"),
    "slide": _e(fx_slide, -20, PAPER, "Kart cebinden kayarak çıkar (≈ 1,3 s)", "Card gliding out of its pocket"),
    "slide-quick": _e(fx_slide_quick, -20, PAPER, "Kart / bilet hızlı kayar (≈ 0,8 s)", "Card / ticket sliding out quickly"),
    "page": _e(fx_page, -20, PAPER, "Sayfa çevrilir (sağdan sola, yere iner)", "A page turning"),
    "book": _e(fx_book, -20, PAPER, "Masal kitabının kapağı açılır (sırt gıcırtısı, tok iniş)", "A storybook cover opening"),
    "tear": _e(fx_tear, -20, PAPER, "Delikli şerit yırtılır (soldan sağa)", "A perforated strip torn off"),
    "vellum": _e(fx_vellum, -21, PAPER, "Buzlu aydınger kılıf kayar", "A frosted vellum sleeve sliding off"),
    "peel": _e(fx_peel, -21, PAPER, "Etiket soyulur", "A label peeling off"),
    "flutter": _e(fx_flutter, -21, PAPER, "Kesme kâğıt bayraklar sırayla havalanır", "Cut-paper flags flying up one by one"),
    "tap": _e(fx_tap, -24, PAPER, "Sayfa geçişinde yumuşak kâğıt tıkı", "A soft paper tick (page links)"),
    # cloth, cord, leather
    "ribbon": _e(fx_ribbon, -20, CLOTH, "İpek kurdele kayıp çıkar, ucu savrulur", "A silk ribbon slipping free"),
    "bow": _e(fx_bow, -20, CLOTH, "İpek fiyonk ilmek ilmek çözülür", "A silk bow untied loop by loop"),
    "twine": _e(fx_twine, -20, CLOTH, "Jüt sicim çözülür (lif takılmaları)", "Jute twine unwinding"),
    "cord": _e(fx_cord, -20, CLOTH, "İpek kordon düğmeden kayar, düşer", "A silk cord slipping off its stud"),
    "velvet": _e(fx_velvet, -21, CLOTH, "Kadife / yün / keten — boğuk fırçalama", "Velvet / wool / linen brushed"),
    "lace": _e(fx_lace, -22, CLOTH, "Dantel duvak gibi kalkar", "Lace lifting like a veil"),
    "curtain": _e(fx_curtain, -20, CLOTH, "Ağır kadife sahne perdesi açılır", "A heavy stage curtain swinging open"),
    "strap": _e(fx_strap, -20, CLOTH, "Deri kayış tokadan çekilir (deri gıcırtısı)", "A leather strap drawn through a buckle"),
    # wax, metal, wood, ceramic
    "seal": _e(fx_seal, -20, HARD, "Mum mühür kırılır (çatlak, kırıntı, gövde)", "A wax seal breaking"),
    "seal-lift": _e(fx_seal_lift, -21, HARD, "Mum mühür bütün olarak kalkar", "A wax seal lifting off whole"),
    "clasp": _e(fx_clasp, -21, HARD, "Pirinç klips açılır", "A brass clasp unhooking"),
    "buckle": _e(fx_buckle, -21, HARD, "Kemer tokası açılır", "A buckle tipping open"),
    "key": _e(fx_key, -21, HARD, "Müzik kutusu anahtarı iki tur kurulur", "A music-box key wound two turns"),
    "lock": _e(fx_lock, -21, HARD, "Döner kilit / konço döner, yerine oturur", "A turn-lock turning into its detent"),
    "brooch": _e(fx_brooch, -21, HARD, "Broş / inci klips iğnesinden çıkar", "A brooch coming off its pin"),
    "porcelain": _e(fx_porcelain, -21, HARD, "Porselen düğme döner, kalkar (ince çınlama)", "A porcelain button turning and lifting"),
    "tile": _e(fx_tile, -21, HARD, "Sırlı çini döner, yerine vurur", "A glazed tile turning over"),
    "lid": _e(fx_lid, -20, HARD, "Lake kutu kapağı menteşesinde açılır", "A lacquered box lid on its hinge"),
    "twig": _e(fx_twig, -21, HARD, "Kuru dal / çam demeti gevşer, hışırdar", "A dry twig / bundle loosening"),
    # bells
    "chime": _e(fx_chime, -21, BELL, "Kart öne gelir: çelesta arpeji (La majör)", "Card forward: celesta arpeggio"),
    "chime-warm": _e(fx_chime_warm, -21, BELL, "Kart öne gelir: daha sıcak, alçak çan arpeji (Mi majör)", "Card forward: warm bell arpeggio"),
    "harp": _e(fx_harp, -21, BELL, "Kart öne gelir: kısa arp glissandosu", "Card forward: a short harp glissando"),
    "sparkle": _e(fx_sparkle, -23, BELL, "Pırıltı: elmas / hilal / inci ışığı yakalar", "A glint of light"),
    "shimmer": _e(fx_shimmer, -24, BELL, "Işık süpürmesi (soldan sağa camsı parıltı)", "A sweep of light"),
    "stars": _e(fx_stars, -22, BELL, "Yıldızlar / ateşböcekleri / ışıklar tek tek yanar", "Stars lighting up one by one"),
    "comb": _e(fx_comb, -21, BELL, "Müzik kutusu tarağı: kısa ezgi", "A music-box phrase"),
    # air, water, fire, others
    "whoosh": _e(fx_whoosh, -21, AIR, "Yumuşak hava geçişi (soldan sağa)", "A soft whoosh"),
    "wave": _e(fx_wave, -21, AIR, "Suluboya dalga ekranı geçer, köpük", "A watercolour wave rolling across"),
    "water": _e(fx_water, -22, AIR, "Su: hafif çalkantı, kabarcıklar", "Water: a gentle slosh and bubbles"),
    "wings": _e(fx_wings, -21, AIR, "Üç güvercin havalanır", "Three doves taking wing"),
    "petals": _e(fx_petals, -22, AIR, "Çiçek kümesi patlar / yapraklar dökülür", "Blooms bursting / petals shaken loose"),
    "flash": _e(fx_flash, -21, AIR, "Eski flaş: deklanşör, ampul patlaması, şarj ıslığı", "A vintage flashbulb"),
    "lantern": _e(fx_lantern, -21, AIR, "Fener / kandil yanar, alev titrer", "A lantern kindled"),
    "film": _e(fx_film, -21, AIR, "Negatif şeridi ekrandan akar (dişli tıkları)", "A film strip running off"),
    "brush": _e(fx_brush, -21, AIR, "Dört geniş fırça darbesi (ıslak suluboya)", "Four broad brushstrokes"),
    "pen": _e(fx_pen, -23, AIR, "Baş harfler mürekkeple yazılır (uç cızırtısı)", "Initials inked with a nib"),
}


def render(name: str) -> np.ndarray:
    """Final stereo samples (2, n) at SR for one effect: synthesis, room, mastering."""
    e = EFFECTS[name]
    r = rng_for(name)
    x = e.fn(r)
    fo = min(N(e.tail), x.shape[1] // 2)
    x[:, -fo:] *= np.cos(np.linspace(0, math.pi / 2, fo)) ** 2  # whatever still rings at the end of the array fades out
    x = add_room(x, r, e.rt60, e.wet)
    return master(x, e.lufs)
