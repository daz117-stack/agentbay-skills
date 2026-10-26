"""Original score + sound design for the brand film, synthesised from scratch (no samples, no licences).

    python3 audio/score.py            -> output/audio/score.wav (48 kHz stereo, loudness-normalised)

Cue times are derived from timeline.json (scene starts) plus the same offsets used in src/film.js,
so retiming a scene moves its sounds with it. Tempo 96 BPM: beat = 0.625 s, bar = 2.5 s.
Only numpy + ffmpeg are required.
"""
import json, os, subprocess, sys
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TL = json.load(open(os.path.join(ROOT, 'timeline.json')))
S, DUR = TL['scenes'], TL['duration']
SR = 48000
N = int(DUR * SR) + SR  # 1 s headroom for tails, trimmed at the end
BEAT = 60 / TL['bpm']
rng = np.random.default_rng(7)

dry = np.zeros((2, N))   # direct bus
wet = np.zeros((2, N))   # reverb send bus
pad_bus = np.zeros((2, N))  # pads (ducked by kick)


def at(scene, off=0.0):
    return S[scene] + off


def note(n):  # MIDI -> Hz
    return 440.0 * 2 ** ((n - 69) / 12)


def place(bus, sig, t, pan=0.0, gain=1.0):
    """Mix a mono (or stereo) signal into a bus at time t with constant-power pan."""
    i = int(round(t * SR))
    if i >= N:
        return
    if sig.ndim == 1:
        a = (pan + 1) * np.pi / 4
        sig = np.vstack([sig * np.cos(a), sig * np.sin(a)])
    j = min(N, i + sig.shape[1])
    if i < 0:
        sig, i = sig[:, -i:], 0
    bus[:, i:j] += gain * sig[:, : j - i]


def tvec(dur):
    return np.arange(int(dur * SR)) / SR


def fft_filter(x, lo=0.0, hi=None, slope=1.0):
    """Zero-phase band filter with soft (octave-based) skirts."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR) + 1e-6
    m = np.ones_like(f)
    if lo > 0:
        m *= 1 / (1 + (lo / f) ** (4 * slope))
    if hi:
        m *= 1 / (1 + (f / hi) ** (4 * slope))
    return np.fft.irfft(X * m, len(x))


def noise(dur):
    return rng.standard_normal(int(dur * SR))


def moving_band(dur, f0, f1, bw=0.6, shape=None, seed=None):
    """Noise through a band-pass whose centre glides f0 -> f1 (log). STFT overlap-add."""
    n = int(dur * SR)
    fr, hop = 2048, 256
    x = (np.random.default_rng(seed) if seed is not None else rng).standard_normal(n + fr)
    win = np.hanning(fr)
    idx = np.arange(0, n, hop)
    frames = np.lib.stride_tricks.sliding_window_view(x, fr)[idx] * win
    F = np.fft.rfft(frames, axis=1)
    freqs = np.fft.rfftfreq(fr, 1 / SR) + 1
    p = idx / max(1, n)
    fc = np.exp(np.log(f0) + (np.log(f1) - np.log(f0)) * p)[:, None]
    F *= np.exp(-0.5 * (np.log2(freqs[None, :] / fc) / bw) ** 2)
    y = np.fft.irfft(F, fr, axis=1) * win
    out = np.zeros(n + fr)
    norm = np.zeros(n + fr)
    for k, i in enumerate(idx):
        out[i:i + fr] += y[k]
        norm[i:i + fr] += win ** 2
    out = out[:n] / np.maximum(norm[:n], 1e-3)
    e = shape(np.linspace(0, 1, n)) if shape else np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    out *= e
    return out / (np.max(np.abs(out)) + 1e-9)


# ---------------------------------------------------------------- instruments
def kick(amp=1.0, f0=118, f1=44, dec=0.38):
    t = tvec(0.6)
    f = f1 + (f0 - f1) * np.exp(-t / 0.035)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) * np.exp(-t / dec)
    click = fft_filter(noise(0.6), 1500, 6000) * np.exp(-t / 0.004) * 0.25
    return amp * (s + click) * np.minimum(1, t / 0.002)


def thud(amp=1.0, f0=90, f1=34, dec=0.7):
    t = tvec(1.4)
    f = f1 + (f0 - f1) * np.exp(-t / 0.05)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / dec)
    body = fft_filter(noise(1.4), 30, 260) * np.exp(-t / 0.09) * 0.9
    return amp * (s + body) * np.minimum(1, t / 0.003)


def hat(amp=1.0, dec=0.035, open_=False):
    d = 0.35 if open_ else 0.12
    t = tvec(d)
    s = fft_filter(noise(d), 6500, 15000) * np.exp(-t / (0.16 if open_ else dec))
    return amp * s / 3


def rim(amp=1.0):
    t = tvec(0.25)
    s = fft_filter(noise(0.25), 900, 3200) * (np.exp(-t / 0.018) + 0.5 * np.exp(-np.maximum(0, t - 0.012) / 0.03) * (t > 0.012))
    tone = np.sin(2 * np.pi * 1650 * t) * np.exp(-t / 0.02) * 0.3
    return amp * (s / 2.5 + tone)


def tick(amp=1.0, f=3800, dec=0.006):
    t = tvec(0.06)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t / dec) + fft_filter(noise(0.06), 3000, 12000) * np.exp(-t / 0.002) * 0.4
    return 0.38 * amp * s   # ticks are punctuation, kept well under the music


def blip(f, amp=1.0, dec=0.09, harm=0.25):
    t = tvec(dec * 8)
    s = (np.sin(2 * np.pi * f * t) + harm * np.sin(4 * np.pi * f * t)) * np.exp(-t / dec) * np.minimum(1, t / 0.002)
    return amp * s


def pluck(f, amp=1.0, dec=0.9, bright=1.0):
    t = tvec(dec * 4)
    s = np.zeros_like(t)
    for k in range(1, 9):
        if f * k > 14000:
            break
        s += (1 / k ** (1.6 / bright)) * np.sin(2 * np.pi * f * k * t + k) * np.exp(-t * k ** 0.8 / dec)
    s += fft_filter(noise(dec * 4), 2000, 8000) * np.exp(-t / 0.003) * 0.05
    return amp * s * np.minimum(1, t / 0.003)


def bell(f, amp=1.0, dec=2.6, index=2.4, ratio=2.0):
    t = tvec(dec * 2.5)
    I = index * np.exp(-t / (dec * 0.25)) + 0.3
    s = np.sin(2 * np.pi * f * t + I * np.sin(2 * np.pi * f * ratio * t))
    s += 0.25 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / (dec * 0.2))
    return amp * s * np.exp(-t / dec) * np.minimum(1, t / 0.002)


def pad(notes, dur, amp=1.0, att=0.8, rel=1.6, cut=6.0, detune=7):
    """Warm additive pad, 3 detuned voices per note, stereo spread. Returns (2, n)."""
    t = tvec(dur + rel)
    out = np.zeros((2, len(t)))
    for ni, n in enumerate(notes):
        f = note(n)
        for v, (cents, pan) in enumerate([(-detune, -0.6), (0, 0.0), (detune, 0.6)]):
            fv = f * 2 ** (cents / 1200)
            s = np.zeros_like(t)
            for k in range(1, 14):
                if fv * k > 9000:
                    break
                s += (1 / k) * np.exp(-k / cut) * np.sin(2 * np.pi * fv * k * t + rng.uniform(0, 6.28))
            a = (pan + 1) * np.pi / 4
            out[0] += s * np.cos(a)
            out[1] += s * np.sin(a)
    env = np.minimum(1, t / att) * np.where(t < dur, 1, np.exp(-(t - dur) / (rel / 3)))
    lfo = 1 + 0.08 * np.sin(2 * np.pi * 0.23 * t)
    return amp * out * env * lfo / (len(notes) * 3)


def bass(n, dur, amp=1.0):
    t = tvec(dur + 0.3)
    f = note(n)
    s = np.sin(2 * np.pi * f * t) + 0.18 * np.sin(4 * np.pi * f * t) + 0.06 * np.sin(6 * np.pi * f * t)
    env = np.minimum(1, t / 0.012) * np.where(t < dur, 1, np.exp(-(t - dur) / 0.06))
    return amp * s * env


def whoosh(dur, f0, f1, amp=1.0, bw=0.7, peak=0.65):
    shape = lambda p: np.where(p < peak, (p / peak) ** 2, ((1 - p) / (1 - peak)) ** 1.5)
    return amp * moving_band(dur, f0, f1, bw, shape)


def riser(dur, amp=1.0):
    shape = lambda p: p ** 2.2 * np.minimum(1, (1 - p) * 30)
    return amp * moving_band(dur, 300, 7000, 0.9, shape)


def boom(amp=1.0):
    t = tvec(2.5)
    f = 38 + 50 * np.exp(-t / 0.08)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.9)
    air = fft_filter(noise(2.5), 80, 900) * np.exp(-t / 0.25) * 0.4
    return amp * (s + air) * np.minimum(1, t / 0.004)


# ---------------------------------------------------------------- harmony
Dm9 = [50, 57, 60, 64, 65, 69]          # D3 A3 C4 E4 F4 A4
Dm7 = [50, 57, 60, 65, 69]
Bbmaj7 = [46, 53, 57, 62, 65]
Fmaj = [53, 57, 60, 65, 69]
C6 = [48, 55, 60, 64, 69]
Bbmaj9 = [46, 53, 57, 60, 62, 65]
Csus = [48, 55, 60, 65, 67]
Gm9 = [43, 50, 57, 58, 62, 65]
Fmaj9 = [41, 48, 57, 60, 64, 67, 69]
cluster = [50, 56, 57, 62, 63, 65]       # tension for the "mess"

chords = [  # (start, end, notes, gain)
    (0.35, 4.9, Dm9, 0.55),
    (4.9, 7.45, cluster, 0.45),
    (7.45, 10.0, Bbmaj7, 0.6),
    (10.0, 12.5, Dm7, 0.6), (12.5, 15.0, Bbmaj7, 0.6), (15.0, 17.5, Fmaj, 0.6), (17.5, 20.0, C6, 0.6),
    (20.0, 21.25, Bbmaj9, 0.75), (21.25, 22.5, Csus, 0.7),
    (at('trusted'), at('stable'), Dm9, 0.62),
    (at('stable'), at('designed'), Bbmaj7, 0.6),
    (at('designed'), at('reveal'), Gm9, 0.6),
    (at('reveal'), at('reveal', 1.55), Csus, 0.55),
    (at('reveal', 1.55), DUR - 0.4, Fmaj9, 0.75),
]
for a, b, ns, g in chords:
    place(pad_bus, pad(ns, b - a, amp=g * 0.5, att=0.35 if a > 1 else 1.2, rel=1.4 if b < DUR - 1 else 2.2), a)

# Bass roots follow the chords from the groove onwards.
roots = [(7.5, 10.0, 34), (10.0, 12.5, 38), (12.5, 15.0, 34), (15.0, 17.5, 41), (17.5, 20.0, 36), (20.0, 21.25, 34), (21.25, 21.85, 36),
         (at('stable', 0.95), at('designed'), 34), (at('designed'), at('designed', 3.3), 31), (at('reveal', 1.55), DUR - 1.2, 29)]
for a, b, n in roots:
    # pulse on each beat inside the span (8th-note feel in the groove)
    t = a
    while t < b - 0.05:
        dd = min(BEAT * 0.9, b - t)
        place(dry, bass(n, dd * 0.85, 0.32), t)
        t += BEAT
# Long bass pedal for the end frame
place(dry, bass(29, DUR - at("reveal", 1.6) - 0.8, 0.13), at("reveal", 1.6))


# ---------------------------------------------------------------- drums
def beats(a, b, step=BEAT, offset=0.0):
    t0 = np.ceil((a - offset) / step - 1e-9) * step + offset
    return [x for x in np.arange(t0, b - 1e-6, step)]


kicks = []
def groove(a, b, kick_amp=0.8, hats=True, rims=True, all_beats=False):
    for t in beats(a, b, BEAT):
        bi = int(round(t / BEAT)) % 4
        if all_beats or bi in (0, 2):
            place(dry, kick(kick_amp), t); kicks.append(t)
        if rims and bi in (1, 3):
            place(dry, rim(0.42), t, pan=0.1); place(wet, rim(0.15), t)
    if hats:
        for i, t in enumerate(beats(a, b, BEAT / 4)):
            v = [0.5, 0.18, 0.32, 0.18][i % 4]
            place(dry, hat(v * 0.55), t, pan=0.25)
        for t in beats(a, b, BEAT, BEAT / 2):
            if int(round((t - BEAT / 2) / BEAT)) % 4 == 3:
                place(dry, hat(0.22, open_=True), t, pan=-0.2)

groove(7.5, 21.85)
groove(at('stable', 1.25), at('designed') - 0.05, kick_amp=0.7, hats=False, rims=False, all_beats=True)   # steady heartbeat
groove(at('designed', 0.0), at('designed', 3.3), kick_amp=0.55, hats=True, rims=True)

# Sidechain-style duck of the pads under each kick (gentle pump)
duck = np.ones(N)
for t in kicks:
    i = int(t * SR); L = int(0.3 * SR)
    seg = 1 - 0.35 * np.exp(-np.arange(L) / (0.09 * SR))
    duck[i:i + L] = np.minimum(duck[i:i + L], seg[: max(0, min(L, N - i))])
pad_bus *= duck
dry += pad_bus
wet += pad_bus * 0.55

# ---------------------------------------------------------------- melodic pluck motif
def arp(a, b, chord, amp=0.22, pattern=(0, 2, 1, 3, 2, 4, 3, 1), step=BEAT / 2, octave=12, swing=0.0):
    tones = sorted(chord)[1:]
    for i, t in enumerate(beats(a, b, step)):
        n = tones[pattern[i % len(pattern)] % len(tones)] + octave
        v = amp * (1.0 if i % 2 == 0 else 0.7)
        p = 0.35 if i % 2 else -0.35
        place(dry, pluck(note(n), v, dec=0.5), t + (swing if i % 2 else 0), pan=p)
        place(wet, pluck(note(n), v * 0.6, dec=0.5), t + (swing if i % 2 else 0))

arp(1.25, 4.6, Dm9, 0.14, step=BEAT)
# Chaos: unquantised, out-of-key fragments
for i in range(9):
    t = 5.0 + rng.uniform(0, 1.6)
    place(dry, pluck(note(int(rng.choice([62, 63, 68, 69, 74, 75]))), 0.08, dec=0.35), t, pan=rng.uniform(-.8, .8))
for a, b, ch in [(7.5, 10.0, Bbmaj7), (10.0, 12.5, Dm7), (12.5, 15.0, Bbmaj7), (15.0, 17.5, Fmaj), (17.5, 20.0, C6), (20.0, 21.25, Bbmaj9), (21.25, 21.85, Csus)]:
    arp(a, b, ch, 0.16)
arp(at('trusted', 0.6), at('stable') - 0.3, Dm9, 0.11, step=BEAT)
arp(at('designed', 0.0), at('designed', 3.3), Gm9, 0.13)

# ---------------------------------------------------------------- sound design cues
def M(*sigs):
    """Sum mono signals of different lengths."""
    out = np.zeros(max(len(x) for x in sigs))
    for x in sigs:
        out[: len(x)] += x
    return out


def delay(sig, sec):
    return np.concatenate([np.zeros(int(sec * SR)), sig])


def sfx(fn, t, pan=0.0, gain=1.0, send=0.25):
    s = fn()
    place(dry, s, t, pan, gain)
    if send:
        place(wet, s, t, pan, gain * send)

# 1. Opening
sfx(lambda: M(tick(0.9, 3200, 0.01), blip(1760, 0.25, 0.05)), at('open', 0.2), send=0.5)
sfx(lambda: whoosh(1.1, 600, 5200, 0.22, bw=0.5, peak=0.15), at('open', 0.48), send=0.4)
sfx(lambda: blip(880, 0.16, 0.5, 0.1), at('open', 0.5), send=0.6)
sfx(lambda: tick(0.5, 4200), at('open', 1.0), pan=-0.9); sfx(lambda: tick(0.5, 4200), at('open', 1.0), pan=0.9)
sfx(lambda: whoosh(0.5, 2500, 900, 0.07), at('open', 2.5))
for d in range(6):  # grid ticks spreading from centre, rising pitch
    for side in ([0] if d == 0 else [-1, 1]):
        sfx(lambda d=d: tick(0.35, 2400 + d * 280, 0.005), at('open', 2.75 + d * 0.05), pan=side * d / 6)
sfx(lambda: riser(0.8, 0.22), at('open', 4.1))
sfx(lambda: boom(0.35), at('idea', 0.0), send=0.6)

# 2. Idea: things land on the desk, the line sweeps, everything snaps on-grid
for i in range(6):
    sfx(lambda: fft_filter(noise(0.08), 1800, 7000) * np.exp(-tvec(0.08) / 0.015) * 0.25, at('idea', 0.47 + i * 0.12), pan=rng.uniform(-.6, .6))
sfx(lambda: whoosh(1.0, 500, 6000, 0.28, bw=0.55, peak=0.5), at('idea', 1.6))
messy_cx = [545, 1340, 940, 1435, 705, 1085]
def sweepX(L):
    p = min(1, max(0, (L - 1.65) / 0.95))
    return -250 + (2150 + 250) * (-(np.cos(np.pi * p) - 1) / 2)
for k, cx in enumerate(sorted(messy_cx)):
    L = next(x for x in np.arange(1.65, 2.7, 0.005) if sweepX(x) >= cx)
    sfx(lambda k=k: M(tick(0.55, 3000 + k * 220, 0.008), blip(note(74 + [0, 2, 5, 7, 9, 12][k]), 0.12, 0.12)), at('idea', L + 0.02), pan=(cx - 960) / 1100, send=0.4)
sfx(lambda: whoosh(0.6, 300, 4000, 0.3, peak=0.85), at('idea', 4.55))
sfx(lambda: M(boom(0.3), tick(0.4, 2600)), at('cap', 0.3), send=0.5)

# 3. Capabilities
c = at('cap')
sfx(lambda: blip(110, 0.35, 0.18, 0.4), c + 0.15)                              # screen on
for i in range(6):
    sfx(lambda: tick(0.22, 2800 + 120 * i), c + 0.1 + 0.4 + i * 0.06, pan=0.3)
sfx(lambda: whoosh(0.5, 900, 3500, 0.12), c + 0.1 + 0.5, pan=0.4)
sfx(lambda: M(blip(1320, 0.2, 0.06), tick(0.3, 5000)), c + 0.1 + 1.08, pan=0.4)
sfx(lambda: blip(990, 0.14, 0.08), c + 0.1 + 1.6, pan=0.2)
# pans
for a, b, pans in [(2.6, 3.25, (-0.7, 0.7)), (5.1, 5.75, (0, 0)), (7.6, 8.25, (0.7, -0.7))]:
    w = whoosh(b - a + 0.2, 400, 2600, 0.42, bw=0.8, peak=0.55)
    place(dry, w, c + a, pans[0] * 0.5); place(dry, w * 0.6, c + a + 0.02, pans[1] * 0.5)
# orders
b0 = c + 2.95
sfx(lambda: blip(note(81), 0.22, 0.07), b0 + 0.45, pan=-0.4)
sfx(lambda: blip(note(86), 0.2, 0.08), b0 + 0.52, pan=-0.4)
sfx(lambda: whoosh(0.32, 1200, 3800, 0.08, bw=0.4), b0 + 0.7, pan=-0.2)
sfx(lambda: tick(0.35, 3300), b0 + 1.0, pan=0.1)
sfx(lambda: whoosh(0.32, 1200, 3800, 0.08, bw=0.4), b0 + 1.2, pan=0.3)
sfx(lambda: bell(note(84), 0.22, 0.9, 1.2) , b0 + 1.5, pan=0.5, send=0.6)       # order ready chime
sfx(lambda: bell(note(88), 0.18, 1.1, 1.2), b0 + 1.62, pan=0.5, send=0.6)
# retail
d0 = c + 5.45
sfx(lambda: fft_filter(noise(0.12), 900, 5000) * np.exp(-tvec(0.12) / 0.03) * 0.2, d0 + 0.5, pan=-0.3)
sfx(lambda: whoosh(0.4, 2000, 5000, 0.05, bw=0.3), d0 + 0.75, pan=-0.3)
sfx(lambda: np.sin(2 * np.pi * 2093 * tvec(0.11)) * 0.16 * np.minimum(1, tvec(0.11) / 0.003) * np.minimum(1, (0.11 - tvec(0.11)) / 0.01), d0 + 1.15, pan=-0.3, send=0.2)
sfx(lambda: tick(0.3, 3600), d0 + 1.25, pan=0.1)
sfx(lambda: blip(note(83), 0.16, 0.09) , d0 + 1.32, pan=0.5)
sfx(lambda: blip(note(88), 0.14, 0.12), d0 + 1.40, pan=0.5)
# brand assets: shutter-like clicks as each lands
c0 = c + 7.95
for i in range(4):
    sfx(lambda: M(tick(0.5, 2200, 0.004), 0.6 * delay(tick(0.6, 1800, 0.004), 0.028)), c0 + 0.18 + i * 0.14, pan=-0.2 + i * 0.25)
for i in range(4):
    sfx(lambda: tick(0.18, 5200, 0.003), c0 + 1.0 + i * 0.06, pan=0.4)
# pull back: one system
sfx(lambda: whoosh(1.4, 250, 3000, 0.4, bw=0.9, peak=0.5), c + 10.0, send=0.5)
sfx(lambda: M(boom(0.28), tick(0.4, 2000)), c + 10.9, send=0.6)
sfx(lambda: whoosh(1.0, 800, 6000, 0.12, bw=0.4, peak=0.3), c + 10.9)
for i in range(4):
    sfx(lambda: blip(note(84 + [0, 4, 7, 12][i]), 0.13, 0.1), c + 11.4 + i * 0.05, pan=[-.6, .6, -.3, .3][i], send=0.5)
sfx(lambda: riser(0.9, 0.3), at('trusted') - 0.85)

# 4. Principles
sfx(lambda: boom(0.55), at('trusted'), send=0.7)
sfx(lambda: moving_band(1.5, 9000, 5000, 0.5, lambda p: (1 - p) ** 1.5 * np.minimum(1, p * 20)) * 0.07, at('trusted', 0.4), send=0.8)   # glass clearing
for i in range(5):
    sfx(lambda: bell(note(96 + [0, 3, 7, 10, 14][i]), 0.03, 0.6, 0.6), at('trusted', 0.6 + i * 0.22), pan=rng.uniform(-.7, .7), send=0.9)
for i, L in enumerate([1.6, 2.124, 2.276, 2.8]):
    sfx(lambda i=i: M(tick(0.35, 3000), blip(note(76 + [0, 3, 5, 7][i]), 0.13, 0.1)), at('trusted', L), pan=-0.6 + i * 0.4, send=0.5)
sfx(lambda: whoosh(0.7, 2000, 200, 0.3, peak=0.6), at('stable', -0.45))
sfx(lambda: whoosh(0.7, 300, 1200, 0.1), at('stable', 0.05))
for i in range(6):   # letters land on the beam
    land = 0.5 + i * 0.075 + 0.42
    sfx(lambda i=i: thud(1.0 if i == 0 else 0.55, 92 - i * 4), at('stable', land), pan=(-0.5 + i * 0.2), send=0.35)
sfx(lambda: boom(0.3), at('stable', 0.92), send=0.6)
sfx(lambda: whoosh(0.7, 200, 2400, 0.3, peak=0.6), at('designed', -0.45))
for i in range(13):  # guides drawing: fast ascending ticks
    sfx(lambda i=i: tick(0.16, 2400 + i * 160, 0.004), at('designed', 0.05 + i * 0.03), pan=-0.8 + i * 0.13)
pent = [0, 2, 4, 7, 9]
for i in range(13):  # letters snapping into place: a little pentatonic run
    n = 72 + pent[i % 5] + 12 * (i // 5)
    sfx(lambda n=n: M(blip(note(n), 0.1, 0.05), tick(0.15, 4000, 0.003)), at('designed', 0.3 + i * 0.045 + 0.12), pan=-0.7 + i * 0.11, send=0.4)
for j in range(3):
    sfx(lambda: M(kick(0.3, 160, 70, 0.12), tick(0.25, 2600)), at('designed', 1.0 + j * 0.12 + 0.1), pan=-0.5 + j * 0.5)
sfx(lambda: riser(0.95, 0.32), at('reveal', -0.4))

# 5. Reveal: two strokes draw, lock, then the two-note signature
sfx(lambda: whoosh(0.95, 500, 2400, 0.12, bw=0.4, peak=0.8), at('reveal', 0.62), pan=-0.3)
sfx(lambda: whoosh(0.95, 520, 2500, 0.12, bw=0.4, peak=0.8), at('reveal', 0.62), pan=0.3)
sfx(lambda: boom(0.6), at('reveal', 1.52), send=0.8)
sfx(lambda: bell(note(72), 0.3, 3.0), at('reveal', 1.55), pan=-0.15, send=0.9)   # C5
sfx(lambda: bell(note(77), 0.3, 3.4), at('reveal', 1.72), pan=0.15, send=0.9)    # F5
sfx(lambda: pluck(note(65), 0.18, 1.6), at('reveal', 1.55), send=0.8)
sfx(lambda: whoosh(0.7, 800, 3000, 0.07), at('reveal', 1.95))
sfx(lambda: bell(note(84), 0.08, 2.5), at('reveal', 4.05), pan=-0.3, send=1.0)    # quiet echo of the signature
sfx(lambda: bell(note(89), 0.07, 2.8), at('reveal', 4.22), pan=0.3, send=1.0)

# ---------------------------------------------------------------- reverb (synthetic multiband IR)
def make_ir(length=2.6, pre=0.018):
    n = int(length * SR); t = np.arange(n) / SR
    ir = np.zeros((2, n))
    for ch in range(2):
        nz = np.random.default_rng(100 + ch).standard_normal(n)
        for lo, hi, tau, g in [(40, 500, 0.75, 1.0), (500, 2000, 0.6, 0.8), (2000, 6000, 0.38, 0.5), (6000, 16000, 0.18, 0.25)]:
            ir[ch] += g * fft_filter(nz, lo, hi) * np.exp(-t / tau)
    ir[:, : int(pre * SR)] = 0
    return ir / np.sqrt(np.sum(ir ** 2, axis=1, keepdims=True))

def convolve(x, h):
    n = len(x) + len(h) - 1
    nf = 1 << (n - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, nf) * np.fft.rfft(h, nf), nf)[: len(x)]

ir = make_ir()
rev = np.vstack([convolve(wet[0], ir[0]), convolve(wet[1], ir[1])])
mix = dry + 0.42 * rev

# ---------------------------------------------------------------- master
mix = np.vstack([fft_filter(mix[0], 28), fft_filter(mix[1], 28)])
# fade out the very end
n_end = int(DUR * SR)
fade = np.ones(N); fl = int(1.6 * SR)
fade[n_end - fl:n_end] = np.cos(np.linspace(0, np.pi / 2, fl)) ** 2
fade[n_end:] = 0
mix *= fade
mix = mix[:, :n_end]
peak = np.max(np.abs(mix))
mix = np.tanh(1.2 * mix / peak) / np.tanh(1.2)            # gentle saturation / peak control
mix *= 0.89

out_dir = os.path.join(ROOT, 'output', 'audio'); os.makedirs(out_dir, exist_ok=True)
raw = os.path.join(out_dir, 'score_raw.wav'); final = os.path.join(out_dir, 'score.wav')
pcm = (np.clip(mix.T, -1, 1) * 32767).astype('<i2')
import wave
with wave.open(raw, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())

# Two-pass EBU R128 loudness normalisation to -16 LUFS integrated, -1.5 dBTP (web/YouTube friendly).
meas = subprocess.run(['ffmpeg', '-hide_banner', '-i', raw, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'],
                      capture_output=True, text=True).stderr
js = json.loads(meas[meas.rindex('{'):meas.rindex('}') + 1])
af = (f"loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={js['input_i']}:measured_TP={js['input_tp']}:measured_LRA={js['input_lra']}"
      f":measured_thresh={js['input_thresh']}:offset={js['target_offset']}:linear=true")
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', af, '-ar', str(SR), '-c:a', 'pcm_s16le', final], check=True)
os.remove(raw)
print(f"wrote {os.path.relpath(final, ROOT)}  ({DUR:.2f}s, input loudness {js['input_i']} LUFS -> -16 LUFS)")
