#!/usr/bin/env bash
# Prepares footage proxies (1080x1920, 60fps) for the Hyperframes project.
# Usage: scripts/prep_media.sh <download_dir>   (dir holding newtask.mov, ov/*, br/* from Google Drive)
set -euo pipefail
SRC=${1:?download dir}
OUT=assets/footage
mkdir -p "$OUT" assets/audio assets/img
enc() { # name src start dur
  ffmpeg -v error -y -ss "$3" -i "$2" -t "$4" \
    -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=60,format=yuv420p" \
    -c:v libx264 -preset medium -crf 17 -g 30 -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$OUT/$1.mp4"
}
#   name        source                       media-start  duration(+margin)
enc c01-pain    "$SRC/br/b091215.mp4"   1.0   5.6
enc c02-walk    "$SRC/br/b091144.mp4"   0.0   4.25
enc c03-reveal  "$SRC/ov/v154525.mp4"   0.0   3.25
enc c05-band    "$SRC/ov/lv202631.mp4" 31.8   2.2
enc c06-squat   "$SRC/ov/lv151319.mp4" 23.6   4.55
enc c07-stretch "$SRC/ov/v144512.mp4"  13.4   2.5
enc c08-wear    "$SRC/ov/lv151319.mp4"  6.0   4.2
enc c09-sport   "$SRC/ov/lv151319.mp4" 30.4   6.5
enc c10-cta     "$SRC/ov/lv202631.mp4" 11.0   7.4
# c04: square split-screen (new vs old) placed on a blurred fill of itself
ffmpeg -v error -y -ss 0.3 -i "$SRC/ov/v225323.mp4" -t 1.55 -filter_complex \
  "[0:v]split[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=40:4,eq=brightness=-0.32:saturation=0.6[bg];[b]scale=1080:1080[fg];[bg][fg]overlay=0:520,fps=60,format=yuv420p" \
  -c:v libx264 -preset medium -crf 17 -g 30 -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$OUT/c04-versi.mp4"
# Voiceover: original audio stream, copied untouched
ffmpeg -v error -y -i "$SRC/newtask.mov" -vn -c:a copy assets/audio/vo.m4a
cp "$SRC/ov/sizing_chart.png" assets/img/sizing-chart.jpg
echo done
