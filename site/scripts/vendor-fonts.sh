#!/usr/bin/env bash
# 웹폰트를 직접 호스팅한다.
#
# 왜: Google Fonts 와 jsDelivr 에서 불러오면 **가입하지 않고 읽기만 하는 방문자도**
# 매 페이지마다 IP 가 국외 두 곳으로 전달된다. 개인정보 처리방침에 적은
# "읽는 데에는 아무것도 받지 않습니다" 와 어긋난다. 받아 두면 그 문장이 그냥 참이 된다.
#
# 어떻게: Google 이 한글을 unicode-range 로 잘게 쪼개 주는 것을 그대로 가져온다.
# 통짜 한글 폰트(1.5MB+)를 받으면 성능이 크게 나빠지므로, 쪼갠 결과를 받아
# 경로만 우리 것으로 바꾼다. 한 페이지가 실제로 내려받는 양은 그대로다.
#
# 사용: bash scripts/vendor-fonts.sh   (site/ 에서)
# 결과: public/fonts/  — 커밋한다. 폰트 갱신이 필요할 때만 다시 돌린다.
set -euo pipefail
cd "$(dirname "$0")/.."

# 최신 브라우저인 척해야 woff2 + unicode-range 로 쪼갠 CSS 를 준다.
# 옛 UA 로 요청하면 통짜 ttf 를 주고, 그러면 이 스크립트의 의미가 없어진다.
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"

OUT="public/fonts"
# 폰트 파일은 지우지 않는다 — 216개를 다시 받는 데 몇 분이 걸리고, 내용이 바뀌지 않는다.
# CSS 만 새로 받아 다시 쓴다.
rm -f "$OUT"/*.css
mkdir -p "$OUT/noto-serif-kr" "$OUT/pretendard"

# 웹 경로에 앞 슬래시를 붙이지 않고 넘긴다.
# Git Bash(MSYS)가 `/fonts/...` 로 시작하는 인자를 Windows 경로로 바꿔 버려
# `C:/Program Files/Git/fonts/...` 가 CSS 에 박히는 일이 실제로 있었다.
# 앞 슬래시는 python 쪽에서 붙인다.

# ── 1. Noto Serif KR — 본문·제목 ──
# 400·500·600 만 받는다. 300·700 은 선언만 있고 쓰이지 않는다(실사용 확인 2026-08-09).
echo "── Noto Serif KR"
curl -sS -A "$UA" \
  "https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;500;600&display=swap" \
  -o "$OUT/noto-serif-kr.css"

python scripts/fetch-font-urls.py "$OUT/noto-serif-kr.css" \
  "https://fonts.googleapis.com/css2" "$OUT/noto-serif-kr" "fonts/noto-serif-kr"

# ── 2. Pretendard — UI·표·숫자 ──
# 이쪽도 배포본이 이미 쪼개져 있다. 다만 jsDelivr 가 minify 하면서 상대 경로를
# `../../../packages/...` 로 바꿔 놓아, 문자열을 자르지 말고 기준 주소에 붙여 풀어야 한다.
echo "── Pretendard"
PRE="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
curl -sS -A "$UA" "$PRE" -o "$OUT/pretendard.css"

python scripts/fetch-font-urls.py "$OUT/pretendard.css" "$PRE" "$OUT/pretendard" "fonts/pretendard"

# ── 3. 한 파일로 합친다 — <link> 왕복을 하나로 줄인다 ──
cat "$OUT/noto-serif-kr.css" "$OUT/pretendard.css" > "$OUT/fonts.css"
rm "$OUT/noto-serif-kr.css" "$OUT/pretendard.css"

# ── 확인 ──
echo
echo "── 결과 ──"
echo "   woff2:  $(find "$OUT" -name '*.woff2' | wc -l) 개 / $(du -sh "$OUT" | cut -f1)"
echo "   css:    $(du -h "$OUT/fonts.css" | cut -f1) · @font-face $(grep -c '@font-face' "$OUT/fonts.css") 개"
# 주석 속 안내 링크는 브라우저가 부르지 않는다. 실제로 요청이 나가는 url() 안쪽만 본다.
left=$(grep -oE "url\(\s*['\"]?https?://[^)]*" "$OUT/fonts.css" | sort -u || true)
if [ -n "$left" ]; then
  echo "🔴 외부에서 불러오는 주소가 남았습니다:"; echo "$left" | sed 's/^/      /'; exit 1
fi
echo "   외부에서 불러오는 주소 0건 ✅"

# ── 4. 라이선스 표기 ── 둘 다 SIL Open Font License 1.1 이다. 재배포에 표기가 따라야 한다.
cat > "$OUT/README.md" <<'MD'
# 웹폰트

이 폴더는 `scripts/vendor-fonts.sh` 가 만듭니다. 손으로 고치지 마십시오.

직접 호스팅하는 이유는 성능이 아니라 **개인정보**입니다.
Google Fonts·jsDelivr 에서 불러오면 가입하지 않고 읽기만 하는 방문자도
매 페이지마다 IP 가 국외로 전달됩니다.

## 라이선스

| 폰트 | 저작자 | 라이선스 |
|---|---|---|
| Noto Serif KR | Google | SIL Open Font License 1.1 |
| Pretendard | 길형진(orioncactus) | SIL Open Font License 1.1 |

두 폰트 모두 OFL 1.1 로 배포되며, 이 조건에 따라 재배포합니다.
전문: <https://openfontlicense.org>
MD
echo "   라이선스 표기: $OUT/README.md"
