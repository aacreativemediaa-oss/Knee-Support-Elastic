#!/usr/bin/env bash
# v5 footage proxies (1080x1920, 60fps). Usage: scripts/prep_media.sh <download_dir>  (run from v5/)
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
enc c01-pain      "$SRC/br/b091215.mp4"   1.0   5.9
enc c02-walk      "$SRC/br/b091144.mp4"   0.0   3.3
enc c03-reveal    "$SRC/ov/v154525.mp4"   0.0   3.85
enc c05-flex      "$SRC/ov/lv202631.mp4" 29.0   4.5
enc c06-step      "$SRC/ov/lv151319.mp4" 23.6   3.6
enc c07-fabric    "$SRC/ov/lv202631.mp4" 18.4   5.55
enc c08-sport     "$SRC/ov/lv151319.mp4" 32.0   3.3
enc c09-wear      "$SRC/ov/lv151319.mp4"  6.0   4.35
enc c10-cta       "$SRC/ov/lv202631.mp4"  7.0   8.8
# c04: square split-screen (new vs old) placed on a dark blurred fill of itself
ffmpeg -v error -y -ss 0.3 -i "$SRC/ov/v225323.mp4" -t 3.2 -filter_complex \
  "[0:v]split[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=40:4,eq=brightness=-0.32:saturation=0.6[bg];[b]scale=1080:1080[fg];[bg][fg]overlay=0:520,fps=60,format=yuv420p" \
  -c:v libx264 -preset medium -crf 17 -g 30 -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$OUT/c04-versi.mp4"
# Voiceover: original audio stream, copied untouched
ffmpeg -v error -y -i "$SRC/newtask5.mov" -vn -c:a copy assets/audio/vo.m4a
echo done
