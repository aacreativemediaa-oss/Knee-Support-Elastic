"""Synthesise the film's sound effects (no samples): whoosh, pop, ding, impact,
cha-ching, riser, zap. Writes 48 kHz mono 16-bit WAVs to assets/sfx/.
Seeded, so every run produces identical files."""
import numpy as np, wave, os, math

SR = 48000
rng = np.random.default_rng(7)
OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "sfx")
os.makedirs(OUT, exist_ok=True)

def t(d): return np.arange(int(SR * d)) / SR

def biquad_bp(x, f0, q):
    """Time-varying band-pass (RBJ cookbook); f0 may be an array."""
    f0 = np.broadcast_to(np.asarray(f0, float), x.shape)
    y = np.zeros_like(x); x1 = x2 = y1 = y2 = 0.0
    for i in range(len(x)):
        w = 2 * math.pi * f0[i] / SR; a = math.sin(w) / (2 * q); c = math.cos(w)
        b0, b2, a0, a1, a2 = a, -a, 1 + a, -2 * c, 1 - a
        yi = (b0 * x[i] + b2 * x2 - a1 * y1 - a2 * y2) / a0
        x2, x1, y2, y1 = x1, x[i], y1, yi
        y[i] = yi
    return y

def lowpass(x, fc):
    a = math.exp(-2 * math.pi * fc / SR); y = np.zeros_like(x); p = 0.0
    for i in range(len(x)): p = (1 - a) * x[i] + a * p; y[i] = p
    return y

def env(n, att, rel_shape=4.0):
    e = np.ones(n); na = max(1, int(att * SR)); e[:na] = np.linspace(0, 1, na)
    tail = np.linspace(0, 1, n - na); e[na:] = (1 - tail) ** rel_shape
    return e

def save(name, x, peak_db=-6.0):
    x = x / (np.max(np.abs(x)) + 1e-9) * 10 ** (peak_db / 20)
    fade = min(len(x), int(0.004 * SR)); x[-fade:] *= np.linspace(1, 0, fade)
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())
    print("wrote", name, f"{len(x)/SR:.2f}s")

def whoosh(d, f_lo, f_hi, peak_at):
    tt = t(d); n = len(tt); noise = rng.standard_normal(n)
    pos = tt / d
    sweep = np.where(pos < peak_at, f_lo + (f_hi - f_lo) * (pos / peak_at) ** 1.5,
                     f_hi - (f_hi - f_lo) * 0.6 * ((pos - peak_at) / (1 - peak_at)))
    y = biquad_bp(noise, sweep, 1.2)
    e = np.where(pos < peak_at, (pos / peak_at) ** 2, (1 - (pos - peak_at) / (1 - peak_at)) ** 2.5)
    return y * e

save("whoosh-a", whoosh(0.42, 300, 3200, 0.55))
save("whoosh-b", whoosh(0.36, 450, 4200, 0.45))

# pop: short pitched blip with fast downward chirp
tt = t(0.12); f = 900 * np.exp(-tt * 28) + 380
save("pop", np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(tt), 0.002, 6))

# ding: bell partials with long decay
tt = t(1.1); y = sum(a * np.sin(2 * np.pi * fr * tt) * np.exp(-tt * dk)
                      for fr, a, dk in [(1318.5, 1, 3.2), (2637, .45, 5), (3955, .25, 7.5), (1977.8, .3, 4)])
y[: int(.003 * SR)] *= np.linspace(0, 1, int(.003 * SR))
save("ding", y)

# impact: sub thump + low noise burst
tt = t(0.7); f = 120 * np.exp(-tt * 9) + 42
thump = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 6)
burst = lowpass(rng.standard_normal(len(tt)), 900) * np.exp(-tt * 18) * 3
save("impact", thump + burst, -4)

# cha-ching: two metallic hits + coin shimmer
def metal(d, base, dk):
    tt = t(d); return sum(a * np.sin(2 * np.pi * base * r * tt) for r, a in [(1, 1), (2.76, .6), (5.4, .4), (8.93, .25)]) * np.exp(-tt * dk)
y = np.zeros(int(SR * 1.0))
c1 = metal(0.25, 1800, 22); y[: len(c1)] += c1 * .7
c2 = metal(0.85, 2350, 5.5); o = int(.16 * SR); y[o:o + len(c2)] += c2[: len(y) - o]
sh = biquad_bp(rng.standard_normal(len(y)), 7000, 2.0) * np.exp(-np.arange(len(y)) / SR * 6) * .5
y += np.r_[np.zeros(o), sh[:-o]]
save("cha-ching", y)

# riser: noise + tone sweeping up, swelling into the hit
tt = t(1.2); pos = tt / 1.2
nz = biquad_bp(rng.standard_normal(len(tt)), 400 + 5000 * pos ** 2, 1.5)
tone = np.sin(2 * np.pi * np.cumsum(220 + 660 * pos ** 2) / SR) * .35
save("riser", (nz + tone) * pos ** 2.2)

# zap: fast downward square-ish sweep with buzz
tt = t(0.22); f = 2400 * np.exp(-tt * 18) + 160
ph = np.cumsum(f) / SR
y = np.tanh(3 * np.sin(2 * np.pi * ph)) * env(len(tt), 0.002, 2.5)
save("zap", y * 0.8)
