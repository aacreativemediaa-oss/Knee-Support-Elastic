#!/usr/bin/env bash
# v6 footage proxies (1080x1920, 60fps). Usage: scripts/prep_media.sh <download_dir>  (run from v6/)
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
enc c01-pain      "$SRC/br/b091215.mp4"   1.0   4.1
enc c02-walk      "$SRC/br/b091144.mp4"   0.5   2.7
enc c03-reveal    "$SRC/ov/v154525.mp4"   6.0   2.35
enc c04-old       "$SRC/ov/v203948.mp4"   0.9   2.1
enc c05-flex      "$SRC/ov/lv202631.mp4" 29.0   4.7
enc c07-fold      "$SRC/ov/v154525.mp4"   1.4   2.9
enc c08-walk      "$SRC/ov/lv151319.mp4" 30.4   4.9
enc c09-fabric    "$SRC/ov/lv202631.mp4" 18.4   4.2
enc c10-cta       "$SRC/ov/lv202631.mp4"  7.0   9.8
# c06: square split-screen (new vs old) placed on a dark blurred fill of itself
ffmpeg -v error -y -ss 0.3 -i "$SRC/ov/v225323.mp4" -t 2.4 -filter_complex \
  "[0:v]split[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=40:4,eq=brightness=-0.32:saturation=0.6[bg];[b]scale=1080:1080[fg];[bg][fg]overlay=0:520,fps=60,format=yuv420p" \
  -c:v libx264 -preset medium -crf 17 -g 30 -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$OUT/c06-versi.mp4"
# Voiceover: original audio stream, copied untouched
ffmpeg -v error -y -i "$SRC/newtask6.mov" -vn -c:a copy assets/audio/vo.m4a
echo done
