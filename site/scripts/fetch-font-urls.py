"""CSS 안의 폰트 주소를 전부 내려받고, 우리 경로로 바꿔 쓴다.

vendor-fonts.sh 가 부른다. 따로 돌릴 일은 없다.

주소를 문자열로 자르지 않고 urljoin 으로 푸는 이유:
jsDelivr 는 minify 하면서 상대 경로를 `../../../packages/...` 로 바꿔 놓는다.
`./woff2/` 같은 모양을 가정하고 자르면 조용히 0건을 받고, 그 사실을 눈치채지 못한 채
외부 주소가 그대로 남은 CSS 를 배포하게 된다. 실제로 한 번 그렇게 됐다.

웹 경로는 앞 슬래시 없이 받는다(`fonts/pretendard`). Git Bash(MSYS)가
`/fonts/...` 로 시작하는 인자를 `C:/Program Files/Git/fonts/...` 로 바꿔 버리기 때문이다.
슬래시는 여기서 붙인다.

사용: python fetch-font-urls.py <css> <css의 원래 주소> <내려받을 폴더> <바꿔 쓸 경로>
"""

import os
import re
import sys
import urllib.request
from urllib.parse import urljoin

css_path, base_url, out_dir, web_prefix = sys.argv[1:5]
web_prefix = "/" + web_prefix.strip("/")
URL = re.compile(r"url\(\s*['\"]?([^)'\"]+\.woff2?)['\"]?\s*\)")

css = open(css_path, encoding="utf-8").read()
os.makedirs(out_dir, exist_ok=True)

refs = sorted(set(URL.findall(css)))
if not refs:
    sys.exit(f"🔴 {css_path} 에서 폰트 주소를 하나도 찾지 못했습니다. CSS 형식이 바뀐 것 같습니다.")

seen: dict[str, str] = {}
for ref in refs:
    absolute = urljoin(base_url, ref)
    name = absolute.rsplit("/", 1)[-1].split("?")[0]
    # 서로 다른 주소가 같은 파일명으로 떨어지면 하나가 덮인다 — 조용히 깨지므로 막는다.
    if name in seen and seen[name] != absolute:
        sys.exit(f"🔴 파일명이 겹칩니다: {name}\n   {seen[name]}\n   {absolute}")
    seen[name] = absolute

    dest = os.path.join(out_dir, name)
    if not os.path.exists(dest):
        with urllib.request.urlopen(absolute) as r, open(dest, "wb") as f:
            f.write(r.read())
    css = css.replace(ref, f"{web_prefix}/{name}")

open(css_path, "w", encoding="utf-8").write(css)
print(f"   {len(refs)}개 내려받음 → {out_dir}")
