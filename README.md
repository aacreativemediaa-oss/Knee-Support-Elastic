# Knee Support Elastic — iklan menegak (Hyperframes)

Video iklan 1080×1920, 60fps, ~40 s, dibina dengan [Hyperframes](https://hyperframes.heygen.com) (HTML → MP4).

**Output:** `renders/knee-support-elastic_1080x1920_60fps.mp4`

## Struktur

| Fail | Isi |
| --- | --- |
| `index.html` | Root: 10 klip footage, VO asal, 32 SFX, hos grafik & caption (dijana oleh `scripts/build.mjs`) |
| `compositions/g-*.html` | Satu blok motion graphics bagi setiap klip (hook, pain, reveal, versi, band, flex, fabric, comfort, use, cta) |
| `compositions/captions.html` | Caption 2–3 perkataan (dijana) |
| `scripts/transcript.json` | Transkrip VO (whisper large-v3, perkataan + masa), dengan pembetulan ejaan |
| `scripts/levels.txt` | Loudness setiap klip & gain yang dikenakan |
| `scripts/prep_media.sh` | Potong & tukar footage sumber ke proxy 1080×1920@60 |
| `scripts/synth_sfx.py` | Sintesis SFX (whoosh, pop, ding, impact, cha-ching, riser, zap) |
| `assets/` | VO, SFX, font Anton, sizing chart, GSAP (footage proxy tidak di-commit) |

## Bina semula

```bash
npm install
# muat turun fail Drive ke <dl>/ (newtask.mov, ov/*, br/*), kemudian:
scripts/prep_media.sh <dl>
python3 scripts/synth_sfx.py        # perlukan numpy
node scripts/build.mjs              # jana index.html + captions.html
npx hyperframes check
npx hyperframes render -o renders/out.mp4 --fps 60 --video-bitrate 13.5M --max-bitrate 16M
```

Lihat `REVIEW.md` untuk keputusan kreatif dan hasil semakan.
