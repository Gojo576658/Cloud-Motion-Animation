#!/usr/bin/env bash
# Renders the full video section by section (a section is skipped if its file exists,
# so deleting out/seg_*.mp4 re-renders just that part), then joins everything.
set -e
cd "$(dirname "$0")"
SEGS="0 40 86 155 229 275 317 363 426 465 527"
set -- $SEGS
prev=$1; shift
for cur in "$@"; do
  f="out/seg_$(printf %03d $prev)-$(printf %03d $cur).mp4"
  if [ ! -f "$f" ]; then
    echo "=== rendering $prev..$cur"
    node render.mjs --from "$prev" --to "$cur" --workers "${WORKERS:-4}" --out "$(basename "$f")" 2>&1 | grep -v "text overlap"
  fi
  prev=$cur
done
ls out/seg_*.mp4 | sed "s#^out/#file '#; s#\$#'#" > out/segs.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i out/segs.txt -c copy -movflags +faststart out/smart-tv-listening.mp4
echo "=== done: out/smart-tv-listening.mp4"
