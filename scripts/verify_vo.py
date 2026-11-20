"""Check the render's VO against the original: offset (cross-correlation) and
gain (least-squares projection of the mix onto the original VO; 1.0 = 100 %).
Usage: python3 scripts/verify_vo.py <render.mp4> <assets/audio/vo.m4a>"""
import sys, subprocess, numpy as np
def load(p):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", "1", "-ar", "48000", "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).astype(np.float64)
mix, vo = load(sys.argv[1]), load(sys.argv[2])
n = len(vo)
seg = mix[: n + 4800]
# offset search ±100 ms via FFT cross-correlation
N = 1 << int(np.ceil(np.log2(len(seg) + n)))
xc = np.fft.irfft(np.fft.rfft(seg, N) * np.conj(np.fft.rfft(vo, N)), N)
lags = np.r_[np.arange(0, 4801), np.arange(-4800, 0)]
vals = np.r_[xc[:4801], xc[-4800:]]
lag = lags[np.argmax(vals)]
a = mix[max(lag, 0): max(lag, 0) + n - abs(lag)]; b = vo[max(-lag, 0): max(-lag, 0) + len(a)]
g = float(np.dot(a, b) / np.dot(b, b))
resid = a - g * b
print(f"offset: {lag} samples ({lag/48:.2f} ms)")
print(f"VO gain in mix: {g:.4f} ({20*np.log10(g):+.2f} dB)")
print(f"VO length {n/48000:.3f}s, render length {len(mix)/48000:.3f}s")
print(f"non-VO residual vs VO energy: {10*np.log10(np.dot(resid,resid)/np.dot(b,b)):.1f} dB")
