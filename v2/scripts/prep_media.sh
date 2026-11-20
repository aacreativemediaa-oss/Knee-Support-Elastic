#!/usr/bin/env bash
# v2 footage proxies (1080x1920, 60fps). Usage: v2/scripts/prep_media.sh <download_dir>  (run from v2/)
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
# c01: 4K source, framed 1.35x tighter on the walker (lower-centre)
ffmpeg -v error -y -ss 13.0 -i "$SRC/br/b102551.mp4" -t 4.7 \
  -vf "scale=1458:2592,crop=1080:1920:378:470,fps=60,format=yuv420p" \
  -c:v libx264 -preset medium -crf 17 -g 30 -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$OUT/c01-walk.mp4"
enc c02-sprain    "$SRC/br/b114700.mp4"   5.0  3.15
enc c03-reveal    "$SRC/ov/v154525.mp4"   5.0  3.2
enc c04-wear      "$SRC/ov/lv151319.mp4"  0.8  2.45
enc c05-flex      "$SRC/ov/lv202631.mp4" 28.8  2.9
enc c06-move      "$SRC/ov/lv151319.mp4" 32.5  1.9
enc c07-snug      "$SRC/ov/lv151319.mp4"  8.2  2.75
enc c08-band      "$SRC/ov/lv202631.mp4" 18.4  4.9
enc c09-size      "$SRC/ov/v142805.mp4"   0.0  2.95
enc c10-cta       "$SRC/ov/v144512.mp4"   0.0  6.7
# Voiceover: original audio stream, copied untouched
ffmpeg -v error -y -i "$SRC/newtask2.mov" -vn -c:a copy assets/audio/vo.m4a
cp "$SRC/ov/sizing_chart.png" assets/img/sizing-chart.jpg
echo done
