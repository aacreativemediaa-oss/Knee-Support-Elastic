#!/usr/bin/env bash
# v8 footage proxies (1080x1920, 60fps). Usage: scripts/prep_media.sh <download_dir>  (run from v8/)
set -euo pipefail
SRC=${1:?download dir}
OUT=assets/footage
mkdir -p "$OUT" assets/audio
enc() { # name src start dur
  ffmpeg -v error -y -ss "$3" -i "$2" -t "$4" \
    -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=60,format=yuv420p" \
    -c:v libx264 -preset medium -crf 17 -g 30 -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$OUT/$1.mp4"
}
#   name          source                       media-start  duration(+margin)
enc c01-pain      "$SRC/br/b091215.mp4"   1.0   2.8    # one shot: knee gives out
enc c02-reveal    "$SRC/ov/v154525.mp4"   6.0   2.1
enc c04-band      "$SRC/ov/lv202631.mp4" 12.99  2.85   # front view; elastic band strip outlined 14.7-15.74 s
enc c05-step      "$SRC/ov/lv151319.mp4" 32.0   3.9    # high knees ~ stepping up
enc c06-jump      "$SRC/ov/lv151319.mp4" 23.6   4.15
enc c07-wear      "$SRC/ov/lv151319.mp4"  6.0   4.15   # worn; stays in place (tak bergulung)
enc c08-spray     "$SRC/ov/lv151319.mp4" 18.95  4.15   # spray passes through the knit = breathable
enc c10-cta       "$SRC/ov/lv202631.mp4"  7.0   8.25
# c09: 4K walker, framed 1.35x tighter
ffmpeg -v error -y -ss 12.0 -i "$SRC/br/b102551.mp4" -t 6.25 \
  -vf "scale=1458:2592,crop=1080:1920:378:470,fps=60,format=yuv420p" \
  -c:v libx264 -preset medium -crf 17 -g 30 -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$OUT/c09-walk.mp4"
# c03: square split-screen (new vs old) placed on a dark blurred fill of itself
ffmpeg -v error -y -ss 0.3 -i "$SRC/ov/v225323.mp4" -t 3.55 -filter_complex \
  "[0:v]split[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=40:4,eq=brightness=-0.32:saturation=0.6[bg];[b]scale=1080:1080[fg];[bg][fg]overlay=0:520,fps=60,format=yuv420p" \
  -c:v libx264 -preset medium -crf 17 -g 30 -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$OUT/c03-versi.mp4"
# Voiceover: original audio stream, copied untouched
ffmpeg -v error -y -i "$SRC/newtask8.mov" -vn -c:a copy assets/audio/vo.m4a
echo done
