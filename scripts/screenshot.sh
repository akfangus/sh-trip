#!/usr/bin/env bash
# 실행 중인 dev/preview 서버의 페이지를 폰 폭(375px)으로 캡처한다.
# 헤드리스 크롬은 창 폭이 500px 밑으로 줄지 않아서, 375px iframe 으로 감싸서 찍는다.
#
#   scripts/screenshot.sh /landmarks/kiyomizudera/ [out.png] [height]
#   BASE_URL=http://localhost:4329 scripts/screenshot.sh /basics/
set -euo pipefail

path="${1:?사용법: scripts/screenshot.sh <경로> [out.png] [height]}"
out="${2:-screenshot.png}"
height="${3:-1600}"
base="${BASE_URL:-http://localhost:4321}"
chrome="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"

tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT
wrapper="$tmpdir/shot.html"
printf '<body style="margin:0;background:#888"><iframe src="%s%s" style="border:0;width:375px;height:%spx;display:block"></iframe>' \
  "$base" "$path" "$height" >"$wrapper"

"$chrome" --headless=new --hide-scrollbars --window-size="500,$height" \
  --virtual-time-budget=4000 --screenshot="$(cd "$(dirname "$out")" && pwd)/$(basename "$out")" \
  "file://$wrapper" >/dev/null 2>&1
echo "$out"
