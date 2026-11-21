#!/usr/bin/env bash
# v4 footage proxies (1080x1920, 60fps), shots matched to the reference screenshots.
# Usage: scripts/prep_media.sh <download_dir>  (run from v4/)
set -euo pipefail
SRC=${1:?download dir}
OUT=assets/footage
mkdir -p "$OUT" assets/audio assets/img
enc() { # name src start dur
  ffmpeg -v error -y -ss "$3" -i "$2" -t "$4" \
    -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=60,format=yuv420p" \
    -c:v libx264 -preset medium -crf 17 -g 30 -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$OUT/$1.mp4"
}
#   name          source                       media-start  duration(+margin)
enc c01-legs      "$SRC/ov/lv151319.mp4"  4.0   4.85
enc c02-ankle     "$SRC/br/b114700.mp4"   0.0   2.9
enc c03-walk      "$SRC/br/b091144.mp4"   1.6   3.05
enc c04-fold      "$SRC/ov/v154525.mp4"   0.6   2.8
enc c05-puton     "$SRC/ov/lv151319.mp4"  0.0   2.05
enc c06-knees     "$SRC/ov/lv151319.mp4"  9.6   4.2
enc c07-squat     "$SRC/ov/lv151319.mp4" 28.0   3.2
enc c08-breath    "$SRC/ov/lv151319.mp4" 16.2   5.9
enc c09-size      "$SRC/ov/v142805.mp4"   0.5   2.7
enc c10-cta       "$SRC/ov/lv202631.mp4"  7.0   6.4
# Voiceover: original audio stream, copied untouched (same VO as v3)
ffmpeg -v error -y -i "$SRC/newtask3.mov" -vn -c:a copy assets/audio/vo.m4a
echo done
