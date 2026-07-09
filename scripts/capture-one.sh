#!/usr/bin/env bash
set -euo pipefail
NAME="$1"
URL="$2"
W="${3:-1440}"
H="${4:-900}"
OUT="/opt/cursor/artifacts/pitch-screenshots"
PUBLIC="/workspace/public/pitch"
UDIR="/tmp/chrome-pitch/${NAME}-$$"
mkdir -p "$OUT" "$PUBLIC" "$UDIR"
DEST="$OUT/${NAME}.png"

timeout 45s google-chrome \
  --headless=new \
  --disable-gpu \
  --no-sandbox \
  --disable-dev-shm-usage \
  --hide-scrollbars \
  --user-data-dir="$UDIR" \
  --window-size="${W},${H}" \
  --screenshot="$DEST" \
  "$URL" >/tmp/chrome-${NAME}.out 2>&1 || true

rm -rf "$UDIR"
if [[ -f "$DEST" ]]; then
  cp "$DEST" "$PUBLIC/${NAME}.png"
  stat -c "%n %s" "$DEST"
else
  echo "FAILED $NAME" >&2
  exit 1
fi
