#!/bin/zsh
#
# Encode one exported loop into the pair the site serves: a VP9 WebM and an
# H.264 mp4 of the same name, both silent.
#
#   scripts/encode-video.sh "~/exports/Mood/highlight 1.webm" \
#                           public/images/vol2/projects/Mood
#
# Run it on every new loop that comes out of Figma or a screen recording, and
# keep the original somewhere outside the repo — this never writes over its
# own input, so it can be re-run, but re-encoding an encode compounds loss.
#
# ── why both formats ──────────────────────────────────────────────────
# `VideoSources` offers the WebM first and the mp4 behind it. Everything
# modern takes the WebM; the mp4 is for what does not, and it has to be a
# real H.264 file — the markup used to fake it by swapping the extension on
# a WebM URL, which left older Safari fetching a VP9 file labelled mp4.
#
# ── the numbers this was tuned on, 2026-09-17 ─────────────────────────
# Figma's own WebM export and QuickTime screen recordings are both far over
# what this content needs. Measured across the ten project loops: 94MB of
# source became 7.2MB of WebM, SSIM 0.977-0.9998 against the originals.
# `gaspar-ai-video2.mp4` alone went from 42MB to 1.6MB at SSIM 0.995.
#
# Do NOT add a "already small enough, leave it" shortcut. The first version
# of this had one, keyed on bitrate, and it skipped two files that were five
# times larger than their own H.264 fallback: Figma's VP9 output is
# inefficient at any bitrate, so a low number does not mean a good encode.
set -e

src="$1"
dest="$2"
if [ -z "$src" ] || [ -z "$dest" ]; then
  echo "usage: $0 <input video> <output directory>" >&2
  exit 64
fi

base=$(basename "$src")
stem="${base%.*}"
codec=$(ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 "$src")
fps=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 "$src" | awk -F/ '{printf "%d", $1/$2}')

# screen recordings arrive at 60fps; these loops are decorative, 30 is plenty
rate=()
[ "$fps" -gt 31 ] && rate=(-r 30)

# flat UI capture carries a higher crf than a poster animation with grain in it
crf=32
[ "$codec" = "h264" ] && crf=34

mkdir -p "$dest"

ffmpeg -nostdin -v error -y -i "$src" -an "${rate[@]}" \
  -c:v libvpx-vp9 -crf $crf -b:v 0 -row-mt 1 -deadline good -cpu-used 2 \
  -pix_fmt yuv420p "$dest/$stem.webm"

ffmpeg -nostdin -v error -y -i "$src" -an "${rate[@]}" \
  -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p \
  -profile:v high -level 4.0 -movflags +faststart "$dest/$stem.mp4"

ls -la "$dest/$stem.webm" "$dest/$stem.mp4" | awk '{printf "  %7.2f MB  %s\n", $5/1048576, $NF}'
