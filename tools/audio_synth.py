#!/usr/bin/env python3
"""G126 — platform sesleri: özgün fon müzikleri ve ses efektleri, tamamen koddan sentezlenir.

Neden sentez: ses kütüphanelerine (Freesound, Wikimedia Commons, Musopen, Kenney) bu çalışma ortamından ulaşılamadı
(ağ politikası). Sentezde dış kayıt, örnek (sample) ya da başkasının bestesi yoktur: notalar bu betikteki kurallarla
(sabit tohumlu) üretilir, tını toplamsal sentezle çizilir. Sonuç BKE Studio'nun kendi eseridir; lisans kaydı
platform/public/audio/LICENSES.md.

Kullanım (repo kökünden):  python3 tools/audio_synth.py [--out platform/public/audio] [--only music|fx] [--wav]
Gerekenler: numpy, scipy, ffmpeg (libmp3lame). Aynı girdiler aynı dosyaları üretir (MP3 kodlayıcı farkı hariç).
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
A4 = 440.0
NOTE_NAMES = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}


def midi(name: str) -> int:
    """'C4' -> 60, 'F#5' -> 78, 'Bb3' -> 58."""
    pc = NOTE_NAMES[name[0]]
    rest = name[1:]
    while rest and rest[0] in "#b":
        pc += 1 if rest[0] == "#" else -1
        rest = rest[1:]
    return 12 * (int(rest) + 1) + pc


def freq(m: float) -> float:
    return A4 * 2 ** ((m - 69) / 12)


# ---------------------------------------------------------------------------------------------------------------- voices


def piano(m: int, dur: float, vel: float, rng: np.random.Generator) -> np.ndarray:
    """A soft felt piano: inharmonic partials, two slightly detuned strings, per-partial decay, gentle hammer."""
    f0 = freq(m)
    length = min(dur + 1.6, 5.0)
    n = int(length * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    B = 0.00035
    bright = 0.55 + 0.45 * vel
    base_t60 = 3.4 * (261.6 / f0) ** 0.35
    for k in range(1, 9):
        fk = k * f0 * math.sqrt(1 + B * k * k)
        if fk > SR * 0.45:
            break
        amp = (1 / k ** 1.25) * (bright ** (k - 1))
        t60 = base_t60 / (1 + 0.55 * (k - 1))
        env = np.exp(-6.9 * t / t60)
        det = 1 + (0.6 + 0.2 * k) / 1200 * 1.0  # cents
        ph = rng.uniform(0, 2 * math.pi)
        out += amp * env * (np.sin(2 * math.pi * fk * t + ph) + 0.8 * np.sin(2 * math.pi * fk * det * t + ph * 1.3))
    # attack (felt) and release (damper) at the end of the written duration
    att = int(0.006 * SR)
    out[:att] *= np.linspace(0, 1, att)
    rel_start = int(dur * SR)
    if rel_start < n:
        rel = np.ones(n)
        tail = np.arange(n - rel_start) / SR
        rel[rel_start:] = np.exp(-tail / 0.18)
        out *= rel
    # a breath of hammer noise
    hn = int(0.025 * SR)
    noise = rng.standard_normal(hn) * np.exp(-np.arange(hn) / (0.004 * SR)) * 0.02 * vel
    out[:hn] += sosfilt(butter(2, [800, 4000], "bandpass", fs=SR, output="sos"), noise)
    return out * vel


def music_box(m: int, dur: float, vel: float, rng: np.random.Generator) -> np.ndarray:
    """A comb-and-cylinder music box: bright, bell-like inharmonic partials, long ring."""
    f0 = freq(m)
    length = 3.2
    n = int(length * SR)
    t = np.arange(n) / SR
    ratios = [(1.0, 1.0, 2.6), (2.0, 0.35, 1.4), (3.01, 0.12, 0.8), (4.2, 0.18, 0.6), (5.4, 0.05, 0.35)]
    out = np.zeros(n)
    for r, a, t60 in ratios:
        fk = f0 * r
        if fk > SR * 0.45:
            continue
        out += a * np.exp(-6.9 * t / t60) * np.sin(2 * math.pi * fk * t + rng.uniform(0, 6.28))
    att = int(0.002 * SR)
    out[:att] *= np.linspace(0, 1, att)
    return out * vel


def strings_pad(m: int, dur: float, vel: float, rng: np.random.Generator) -> np.ndarray:
    """A warm string pad: several detuned saw-ish voices, low-passed, slow bow attack and release."""
    f0 = freq(m)
    length = dur + 1.8
    n = int(length * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for d in (-7, -2.5, 2.5, 7):
        f = f0 * 2 ** (d / 1200)
        vib = 1 + 0.0025 * np.sin(2 * math.pi * (4.6 + rng.uniform(-0.3, 0.3)) * t + rng.uniform(0, 6.28))
        phase = 2 * math.pi * np.cumsum(f * vib) / SR
        voice = np.zeros(n)
        for k in range(1, 12):
            if k * f > 9000:
                break
            voice += np.sin(k * phase) / k
        out += voice
    out = sosfilt(butter(2, min(2600, f0 * 6), "lowpass", fs=SR, output="sos"), out)
    att = int(min(0.9, dur * 0.5) * SR)
    env = np.ones(n)
    env[:att] = np.sin(np.linspace(0, math.pi / 2, att)) ** 2
    rel_start = int(dur * SR)
    tail = np.arange(n - rel_start) / SR
    env[rel_start:] = np.exp(-tail / 0.55)
    return out * env * vel * 0.12


VOICES = {"piano": piano, "box": music_box, "pad": strings_pad}


# ----------------------------------------------------------------------------------------------------------------- reverb


def reverb_ir(seconds: float, rng: np.random.Generator, damp: float = 5200, pre: float = 0.018) -> np.ndarray:
    """A synthetic hall: early reflections + exponentially decaying noise that darkens over time."""
    n = int(seconds * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    # darker as it decays: blend a bright and a dark copy
    bright = sosfilt(butter(2, damp, "lowpass", fs=SR, output="sos"), noise)
    dark = sosfilt(butter(2, damp / 4, "lowpass", fs=SR, output="sos"), noise)
    mix = np.clip(t / (seconds * 0.6), 0, 1)
    tail = (bright * (1 - mix) + dark * mix) * np.exp(-6.9 * t / seconds)
    ir = np.zeros(n + int(pre * SR))
    ir[int(pre * SR):] = tail
    for d, g in ((0.011, 0.5), (0.019, 0.35), (0.029, 0.28), (0.041, 0.2)):
        ir[int(d * SR)] += g
    return ir / np.sqrt(np.sum(ir ** 2))


# ------------------------------------------------------------------------------------------------------------ composition

# Chord = root (MIDI) + chord tones as semitones above the root.
TRIAD = {"maj": (0, 4, 7), "min": (0, 3, 7), "maj7": (0, 4, 7, 11), "min7": (0, 3, 7, 10), "dom7": (0, 4, 7, 10),
         "sus2": (0, 2, 7), "add9": (0, 4, 7, 14)}


def chord(root: str, kind: str) -> tuple[int, tuple[int, ...]]:
    return midi(root), TRIAD[kind]


def scale_notes(tonic: str, minor: bool = False) -> list[int]:
    steps = (0, 2, 3, 5, 7, 8, 10) if minor else (0, 2, 4, 5, 7, 9, 11)
    t = midi(tonic + "4") % 12
    return sorted({12 * o + (t + s) % 12 for o in range(2, 9) for s in steps})


class Score:
    def __init__(self, bpm: float, beats_per_bar: int):
        self.bpm = bpm
        self.bpb = beats_per_bar
        self.events: list[tuple[str, float, int, float, float]] = []  # voice, start s, midi, dur s, vel

    @property
    def beat(self) -> float:
        return 60.0 / self.bpm

    def add(self, voice: str, beat_pos: float, m: int, beats: float, vel: float):
        self.events.append((voice, beat_pos * self.beat, m, beats * self.beat, vel))


def melody_line(rng: np.random.Generator, chords, scale: list[int], lo: int, hi: int, rhythm, phrase_bars: int):
    """Chord tones on strong beats, stepwise passing tones between, an arch per phrase, phrase ends on the root."""
    notes = []
    current = None
    for bar, (root, tones) in enumerate(chords):
        pcs = {(root + iv) % 12 for iv in tones}
        pos_in_phrase = bar % phrase_bars
        arch = math.sin(math.pi * (pos_in_phrase + 0.5) / phrase_bars)
        target_center = lo + (hi - lo) * (0.3 + 0.55 * arch)
        for beat, length, strong in rhythm(bar, rng):
            last_of_phrase = pos_in_phrase == phrase_bars - 1 and beat == rhythm(bar, rng)[-1][0]
            if strong or current is None:
                cands = [m for m in scale if lo <= m <= hi and m % 12 in pcs]
                if last_of_phrase:
                    cands = [m for m in cands if m % 12 == root % 12] or cands
                ref = current if current is not None else target_center
                weights = np.array([math.exp(-abs(m - ref) / 3.0) * math.exp(-abs(m - target_center) / 7.0) for m in cands])
                current = int(rng.choice(cands, p=weights / weights.sum()))
            else:
                step = int(rng.choice([-2, -1, 1, 2], p=[0.2, 0.3, 0.3, 0.2]))
                idx = min(range(len(scale)), key=lambda i: abs(scale[i] - current))
                idx = max(0, min(len(scale) - 1, idx + (1 if step > 0 else -1) * (1 if abs(step) == 1 else 2)))
                if lo <= scale[idx] <= hi:
                    current = scale[idx]
            notes.append((bar, beat, current, length))
    return notes


def compose_first_light(rng):
    """Piano, D major, 66 bpm, 4/4. Ground: the old canon progression I–V–vi–iii–IV–I–IV–V (public domain since
    the 1600s) as rolling broken chords; an original melody on top. 24 bars ≈ 87 s, loops back to D."""
    s = Score(66, 4)
    prog = [chord("D3", "maj"), chord("A2", "maj"), chord("B2", "min"), chord("F#2", "min"),
            chord("G2", "maj"), chord("D3", "maj"), chord("G2", "maj"), chord("A2", "dom7")]
    chords = prog * 3
    scale = scale_notes("D")
    for bar, (root, tones) in enumerate(chords):
        b0 = bar * 4
        s.add("piano", b0, root - 12 if root > midi("E3") else root, 4, 0.5)
        # rolling 8ths: root, 5th, 10th, 5th … (open voicing)
        ladder = [root, root + 7, root + 12 + tones[1], root + 12 + tones[2], root + 24, root + 12 + tones[2], root + 12 + tones[1], root + 7]
        for i, m in enumerate(ladder):
            s.add("piano", b0 + i * 0.5, m, 1.6, 0.30 + (0.06 if i in (0, 4) else 0))
    def rhythm(bar, r):
        pats = [[(0, 1.5, True), (1.5, 0.5, False), (2, 2, True)], [(0, 1, True), (1, 1, False), (2, 1, True), (3, 1, False)],
                [(0, 3, True), (3, 1, False)], [(0, 2, True), (2, 1, True), (3, 1, False)]]
        return pats[(bar * 7 + 3) % 4] if bar % 8 != 7 else [(0, 4, True)]
    if True:
        mel = melody_line(rng, chords[8:], scale, midi("F#4"), midi("B5"), rhythm, 4)
        for bar, beat, m, length in mel:
            s.add("piano", (bar + 8) * 4 + beat, m, length * 0.95, 0.62)
    return s, len(chords) * 4


def compose_garden_waltz(rng):
    """Piano waltz, F major, 3/4 at 92 bpm: oom-pah-pah left hand, singing right hand. 32 bars ≈ 63 s."""
    s = Score(92, 3)
    phrase = [chord("F2", "maj"), chord("D2", "min"), chord("Bb2", "maj"), chord("C3", "dom7"),
              chord("F2", "maj"), chord("A2", "min"), chord("Bb2", "maj"), chord("C3", "maj")]
    phrase2 = [chord("Bb2", "maj"), chord("F2", "maj"), chord("G2", "min7"), chord("C3", "dom7"),
               chord("A2", "min"), chord("D2", "min"), chord("G2", "min7"), chord("C3", "dom7")]
    chords = phrase + phrase2 + phrase + [chord("Bb2", "maj"), chord("C3", "maj"), chord("A2", "min"), chord("D2", "min"),
                                          chord("G2", "min7"), chord("C3", "dom7"), chord("F2", "maj"), chord("C3", "dom7")]
    scale = scale_notes("F")
    for bar, (root, tones) in enumerate(chords):
        b0 = bar * 3
        s.add("piano", b0, root, 2.5, 0.55)
        up = [root + 12 + t for t in tones[1:3]] + [root + 24]
        for beat in (1, 2):
            for m in up:
                s.add("piano", b0 + beat, m, 0.8, 0.22)
    def rhythm(bar, r):
        pats = [[(0, 2, True), (2, 1, False)], [(0, 1, True), (1, 1, False), (2, 1, True)], [(0, 3, True)],
                [(0, 1.5, True), (1.5, 0.5, False), (2, 1, False)]]
        return pats[(bar * 5 + 1) % 4] if bar % 4 != 3 else [(0, 3, True)]
    mel = melody_line(rng, chords, scale, midi("C5"), midi("D6"), rhythm, 4)
    for bar, beat, m, length in mel:
        s.add("piano", bar * 3 + beat, m, length * 0.9, 0.6)
    return s, len(chords) * 3


def compose_evening_strings(rng):
    """Strings pad with a few piano notes, A minor → C major colours, 56 bpm, slow and warm. 20 bars ≈ 86 s."""
    s = Score(56, 4)
    chords = [chord("A2", "min7"), chord("F2", "maj7"), chord("C3", "add9"), chord("G2", "sus2"),
              chord("A2", "min7"), chord("F2", "maj7"), chord("D3", "min7"), chord("E2", "maj"),
              chord("F2", "maj7"), chord("G2", "maj"), chord("E2", "min7"), chord("A2", "min7"),
              chord("D3", "min7"), chord("G2", "sus2"), chord("C3", "maj7"), chord("E2", "dom7"),
              chord("A2", "min7"), chord("F2", "maj7"), chord("G2", "sus2"), chord("E2", "maj")]
    scale = scale_notes("A", minor=True)
    for bar, (root, tones) in enumerate(chords):
        b0 = bar * 4
        s.add("pad", b0, root, 4.2, 0.9)
        for iv in tones[1:]:
            s.add("pad", b0, root + 12 + iv, 4.2, 0.55)
        s.add("piano", b0, root - 12 if root > midi("D3") else root, 4, 0.35)
    def rhythm(bar, r):
        pats = [[(0, 2, True), (2, 2, True)], [(1, 1, True), (2, 2, False)], [(0, 3, True), (3, 1, False)], [(2, 2, True)]]
        return pats[(bar * 3 + 2) % 4]
    mel = melody_line(rng, chords, scale, midi("E4"), midi("A5"), rhythm, 4)
    for bar, beat, m, length in mel:
        s.add("piano", bar * 4 + beat, m, length, 0.5)
    return s, len(chords) * 4


def compose_music_box(rng):
    """A music-box lullaby in G, 3/4 at 80 bpm, with soft piano bass. 32 bars ≈ 72 s."""
    s = Score(80, 3)
    a = [chord("G2", "maj"), chord("E2", "min"), chord("C3", "maj"), chord("D3", "maj"),
         chord("G2", "maj"), chord("B2", "min"), chord("C3", "maj"), chord("D3", "dom7")]
    b = [chord("E2", "min"), chord("C3", "maj"), chord("G2", "maj"), chord("D3", "maj"),
         chord("A2", "min7"), chord("D3", "maj"), chord("G2", "maj"), chord("D3", "dom7")]
    chords = a + b + a + b
    scale = scale_notes("G")
    for bar, (root, tones) in enumerate(chords):
        b0 = bar * 3
        s.add("piano", b0, root, 3, 0.4)
        for i, iv in enumerate((tones[1], tones[2], 12)):
            s.add("box", b0 + i, root + 24 + iv, 1, 0.16)
    def rhythm(bar, r):
        pats = [[(0, 1, True), (1, 1, False), (2, 1, True)], [(0, 2, True), (2, 1, False)],
                [(0, 0.5, True), (0.5, 0.5, False), (1, 2, True)], [(0, 3, True)]]
        return pats[(bar * 3 + 1) % 4] if bar % 4 != 3 else [(0, 3, True)]
    mel = melody_line(rng, chords, scale, midi("D5"), midi("E6"), rhythm, 4)
    for bar, beat, m, length in mel:
        s.add("box", bar * 3 + beat, m, length, 0.5)
    return s, len(chords) * 3


TRACKS = {
    # id: (composer, reverb seconds, wet, seed)
    "first-light": (compose_first_light, 2.6, 0.30, 11),
    "garden-waltz": (compose_garden_waltz, 2.2, 0.26, 23),
    "evening-strings": (compose_evening_strings, 3.4, 0.38, 37),
    "music-box": (compose_music_box, 2.8, 0.34, 41),
}


def render_track(track_id: str) -> np.ndarray:
    composer, rv, wet, seed = TRACKS[track_id]
    rng = np.random.default_rng(seed)
    score, total_beats = composer(rng)
    loop_len = int(total_beats * score.beat * SR)
    buf = np.zeros(loop_len + 8 * SR)
    for voice, start, m, dur, vel in score.events:
        x = VOICES[voice](m, dur, vel, rng)
        i = int(start * SR)
        buf[i:i + len(x)] += x[: len(buf) - i]
    dry = buf
    verb = fftconvolve(dry, reverb_ir(rv, rng))[: len(dry)]
    mix = dry * (1 - wet) + verb * wet * 0.9
    # seamless loop: whatever rings past the end is folded onto the start
    loop = mix[:loop_len].copy()
    tail = mix[loop_len:]
    loop[: len(tail)] += tail[:loop_len]
    # gentle tone shaping and level: peak -3 dBFS
    loop = sosfilt(butter(1, 40, "highpass", fs=SR, output="sos"), loop)
    loop = np.tanh(loop / np.max(np.abs(loop)) * 1.1) / math.tanh(1.1)
    return loop * 10 ** (-3 / 20)


# ------------------------------------------------------------------------------------------------------------------- SFX


def bandnoise(n: int, lo: float, hi: float, rng, order: int = 2) -> np.ndarray:
    return sosfilt(butter(order, [lo, hi], "bandpass", fs=SR, output="sos"), rng.standard_normal(n))


def env_ad(n: int, attack: float, decay: float) -> np.ndarray:
    t = np.arange(n) / SR
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    return a * np.exp(-np.maximum(t - attack, 0) / decay)


def smooth_noise(n: int, rate: float, rng) -> np.ndarray:
    """Slow random 0..1 contour (interpolated), for crinkle density / swells."""
    pts = max(2, int(n / SR * rate) + 2)
    v = rng.uniform(0, 1, pts)
    return np.interp(np.linspace(0, pts - 1, n), np.arange(pts), v)


def sweep_noise(n: int, f_from: float, f_to: float, rng, bw: float = 0.9, blocks: int = 24) -> np.ndarray:
    """Band-passed noise whose centre moves from f_from to f_to (overlapping blocks, raised-cosine crossfades)."""
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    size = n // blocks
    win = np.hanning(2 * size)
    for b in range(blocks + 1):
        c = f_from * (f_to / f_from) ** (b / blocks)
        lo, hi = c / (1 + bw), min(c * (1 + bw), SR * 0.45)
        y = sosfilt(butter(2, [lo, hi], "bandpass", fs=SR, output="sos"), noise)
        start = (b - 1) * size
        seg = slice(max(0, start), min(n, start + 2 * size))
        w = win[seg.start - start: seg.stop - start]
        out[seg] += y[seg] * w
    return out


def crackles(n: int, rate: float, rng, lo=1500, hi=7000, width=0.0025) -> np.ndarray:
    out = np.zeros(n)
    k = int(rate * n / SR)
    for _ in range(k):
        i = int(rng.uniform(0, n - 1))
        m = int(width * SR * rng.uniform(0.5, 1.5))
        g = rng.uniform(0.2, 1.0)
        burst = rng.standard_normal(m) * np.exp(-np.arange(m) / (m / 4)) * g
        out[i:i + m] += burst[: n - i]
    return sosfilt(butter(2, [lo, hi], "bandpass", fs=SR, output="sos"), out)


def fx_seal(rng):
    """Wax seal: a crisp double crack with a small body thump."""
    n = int(0.32 * SR)
    out = np.zeros(n)
    for start, g in ((0.0, 1.0), (0.028, 0.6), (0.061, 0.25)):
        i = int(start * SR)
        m = int(0.03 * SR)
        out[i:i + m] += bandnoise(m, 1800, 7500, rng) * env_ad(m, 0.0004, 0.004) * g * 3
    t = np.arange(int(0.08 * SR)) / SR
    out[: len(t)] += np.sin(2 * math.pi * 140 * t) * np.exp(-t / 0.018) * 0.35
    out += crackles(n, 60, rng, 2500, 8000, 0.0015) * env_ad(n, 0.01, 0.06) * 0.4
    return out


def fx_ribbon(rng):
    """Silk ribbon slipping off: airy band-passed hiss with a soft swell."""
    n = int(0.85 * SR)
    t = np.arange(n) / SR
    swell = np.sin(np.pi * np.clip(t / 0.85, 0, 1)) ** 1.6
    out = sweep_noise(n, 5200, 2600, rng, 0.6) * swell * (0.7 + 0.3 * smooth_noise(n, 18, rng))
    return out * 0.55


def fx_clasp(rng):
    """Brass clasp / snap: two clicks and a short metallic ring."""
    n = int(0.42 * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for start, g in ((0.0, 1.0), (0.055, 0.7)):
        i = int(start * SR)
        m = int(0.012 * SR)
        out[i:i + m] += bandnoise(m, 2000, 9000, rng) * env_ad(m, 0.0002, 0.0018) * g * 3
    ring = sum(a * np.sin(2 * math.pi * f * t) * np.exp(-t / d) for f, a, d in ((2380, 0.22, 0.09), (3710, 0.14, 0.06), (5530, 0.09, 0.04)))
    i = int(0.055 * SR)
    out[i:] += ring[: n - i]
    return out


def fx_paper(rng):
    """The envelope flap lifting: a soft paper rustle with a few crinkles."""
    n = int(0.75 * SR)
    t = np.arange(n) / SR
    shape = np.sin(np.pi * np.clip(t / 0.75, 0, 1)) ** 1.2
    body = sweep_noise(n, 1400, 3400, rng, 0.8) * shape * 0.45
    crk = crackles(n, 35, rng, 1500, 6000, 0.003) * shape * 0.8
    return body + crk


def fx_slide(rng):
    """The card sliding out of its pocket: a smooth, rising paper-on-paper glide."""
    n = int(1.15 * SR)
    t = np.arange(n) / SR
    shape = np.clip(t / 0.25, 0, 1) * np.clip((1.15 - t) / 0.45, 0, 1)
    return sweep_noise(n, 900, 2600, rng, 0.7) * shape * 0.4


def fx_page(rng):
    """A page / cover turning: a swish that brightens, ending in a soft flap."""
    n = int(0.62 * SR)
    t = np.arange(n) / SR
    shape = np.sin(np.pi * np.clip(t / 0.5, 0, 1)) ** 2
    swish = sweep_noise(n, 700, 4200, rng, 0.9) * shape * 0.55
    i = int(0.46 * SR)
    m = n - i
    flap = bandnoise(m, 200, 1600, rng) * env_ad(m, 0.002, 0.03) * 0.9
    swish[i:] += flap
    return swish + crackles(n, 20, rng, 2000, 6000) * shape * 0.4


def fx_tear(rng):
    """A perforated tear strip: a fast run of tiny ticks inside a dry paper rasp."""
    n = int(0.8 * SR)
    t = np.arange(n) / SR
    shape = np.clip(t / 0.05, 0, 1) * np.clip((0.8 - t) / 0.2, 0, 1)
    rasp = bandnoise(n, 1500, 6000, rng) * shape * 0.25
    ticks = np.zeros(n)
    pos = 0.02
    while pos < 0.72:
        i = int(pos * SR)
        m = int(0.004 * SR)
        ticks[i:i + m] += rng.standard_normal(m) * np.exp(-np.arange(m) / 30) * rng.uniform(0.5, 1)
        pos += rng.uniform(0.018, 0.03)
    return rasp + sosfilt(butter(2, [1800, 8000], "bandpass", fs=SR, output="sos"), ticks) * shape * 1.2


def fx_whoosh(rng):
    """A watercolour wave sweeping across: a soft, wide whoosh."""
    n = int(1.5 * SR)
    t = np.arange(n) / SR
    shape = np.sin(np.pi * np.clip(t / 1.5, 0, 1)) ** 2
    return sweep_noise(n, 400, 1800, rng, 1.2) * shape * 0.6


def fx_chime(rng):
    """A soft three-note sparkle (E6, G#6, B6) as the card comes forward / a reply is sent."""
    n = int(1.6 * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for k, (note, g) in enumerate((("E6", 0.5), ("G#6", 0.4), ("B6", 0.35))):
        i = int(k * 0.07 * SR)
        tt = t[: n - i]
        f = freq(midi(note))
        tone = (np.sin(2 * math.pi * f * tt) + 0.25 * np.sin(2 * math.pi * f * 2.76 * tt) * np.exp(-tt / 0.15)) * np.exp(-tt / 0.45)
        tone[: int(0.002 * SR)] *= np.linspace(0, 1, int(0.002 * SR))
        out[i:] += tone * g
    return out * 0.5


def fx_tap(rng):
    """A tiny soft paper tick for moving between pages."""
    n = int(0.12 * SR)
    out = bandnoise(n, 900, 5000, rng) * env_ad(n, 0.001, 0.012) * 0.9
    t = np.arange(n) / SR
    out += np.sin(2 * math.pi * 520 * t) * np.exp(-t / 0.02) * 0.08
    return out


EFFECTS = {"seal": fx_seal, "ribbon": fx_ribbon, "clasp": fx_clasp, "paper": fx_paper, "slide": fx_slide,
           "page": fx_page, "tear": fx_tear, "whoosh": fx_whoosh, "chime": fx_chime, "tap": fx_tap}


def render_fx(name: str) -> np.ndarray:
    rng = np.random.default_rng(1000 + sorted(EFFECTS).index(name))
    x = EFFECTS[name](rng)
    x = sosfilt(butter(1, 60, "highpass", fs=SR, output="sos"), x)
    pad = np.zeros(int(0.15 * SR))  # room for a short reverb tail
    x = np.concatenate([x, pad])
    room = fftconvolve(x, reverb_ir(0.5, rng, 7000, 0.006))[: len(x)]
    x = x * 0.85 + room * 0.15
    fade = int(0.01 * SR)
    x[-fade:] *= np.linspace(1, 0, fade)
    return x / np.max(np.abs(x)) * 10 ** (-4 / 20)


# ------------------------------------------------------------------------------------------------------------------- I/O


def write_wav(path: str, x: np.ndarray):
    pcm = (np.clip(x, -1, 1) * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def encode_mp3(x: np.ndarray, dest: str, bitrate: str, title: str):
    with tempfile.TemporaryDirectory() as tmp:
        src = os.path.join(tmp, "in.wav")
        write_wav(src, x)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-ac", "1", "-codec:a", "libmp3lame", "-b:a", bitrate,
                        "-map_metadata", "-1", "-metadata", f"title={title}", "-metadata", "artist=BKE Studio", "-id3v2_version", "3",
                        dest], check=True)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=os.path.join(os.path.dirname(__file__), "..", "platform", "public", "audio"))
    ap.add_argument("--only", choices=["music", "fx"])
    ap.add_argument("--wav", action="store_true", help="also keep a .wav next to each mp3 (not committed)")
    args = ap.parse_args()
    if args.only != "fx":
        os.makedirs(os.path.join(args.out, "music"), exist_ok=True)
        for tid in TRACKS:
            x = render_track(tid)
            dest = os.path.join(args.out, "music", f"{tid}.mp3")
            encode_mp3(x, dest, "64k", tid)
            if args.wav:
                write_wav(dest[:-4] + ".wav", x)
            print(f"music/{tid}.mp3  {len(x) / SR:5.1f} s  {os.path.getsize(dest) / 1024:6.0f} KB")
    if args.only != "music":
        os.makedirs(os.path.join(args.out, "fx"), exist_ok=True)
        for name in EFFECTS:
            x = render_fx(name)
            dest = os.path.join(args.out, "fx", f"{name}.mp3")
            encode_mp3(x, dest, "48k", name)
            if args.wav:
                write_wav(dest[:-4] + ".wav", x)
            print(f"fx/{name}.mp3  {len(x) / SR:4.2f} s  {os.path.getsize(dest) / 1024:5.1f} KB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
