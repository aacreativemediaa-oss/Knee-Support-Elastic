#!/usr/bin/env bash
# v4 footage proxies (1080x1920, 60fps): 7 shots, one per reference screenshot, in the same order.
# Usage: scripts/prep_media.sh <download_dir>  (run from v4/)
set -euo pipefail
SRC=${1:?download dir}
OUT=assets/footage
mkdir -p "$OUT"
enc() { # name src start dur
  ffmpeg -v error -y -ss "$3" -i "$2" -t "$4" \
    -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=60,format=yuv420p" \
    -c:v libx264 -preset medium -crf 17 -g 30 -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$OUT/$1.mp4"
}
#   name           source                       media-start  duration(+margin)   reference screenshot
enc c01-puton      "$SRC/ov/lv151319.mp4"  0.0   3.8    # 1 POV only, pulling the supports on
enc c02-silicone   "$SRC/ov/lv151319.mp4" 11.5   3.4    # 2 "Ada silicone bentuk bulat…"
enc c03-band       "$SRC/ov/lv151319.mp4"  8.0   3.4    # 3 "Bahagian kiri & kanan ada elastic band…"
enc c04-fold       "$SRC/ov/v154525.mp4"   0.6   3.4    # 4 "Bila lipat, dia bouncy kan?…"
enc c05-thick      "$SRC/ov/lv151319.mp4" 16.2   3.4    # 5 "Kain nampak tebal…"
enc c06-allday     "$SRC/ov/lv151319.mp4" 19.4   3.4    # 6 "Pakai seharian pun…"
enc c07-squat      "$SRC/ov/lv151319.mp4" 28.0   3.8    # 7 "Sesuai untuk travel…"
echo done
