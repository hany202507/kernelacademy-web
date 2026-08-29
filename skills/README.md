# 스킬 — 강의자료를 같은 얼굴로 만드는 도구

Kernel Academy 커리큘럼의 **강의자료를 여러 저자가 같은 스타일로** 만들기 위한
Claude Code 스킬입니다. 저자마다 색과 여백을 새로 고르지 않도록, 디자인을 템플릿에 박제해 두었습니다.

| 스킬 | 무엇을 만드나 |
|---|---|
| [`kernel-html-slides`](kernel-html-slides/) | 대본·마크다운·아웃라인 → **1280×720 단일 파일 HTML 슬라이드** (필요하면 PDF) |
| [`kernel-html-reports`](kernel-html-reports/) | 조사 노트·데이터·회의록 → **읽는 A4 보고서 HTML + PDF** |

> **둘은 한 쌍입니다. 따로 설치하지 마십시오.**
> 색 토큰 24개가 두 템플릿에서 값까지 같고, 문체 정본은 한 파일을 공유합니다 —
> `kernel-html-reports` 가 그것을 `../kernel-html-slides/assets/tone.md` 로 참조하므로
> 슬라이드 쪽이 옆에 없으면 그 경로가 죽습니다. 발표자료만 만들 계획이어도 둘 다 두십시오.

## 설치

스킬 폴더를 Claude Code 가 읽는 자리에 두면 끝입니다. 빌드도 설치 명령도 없습니다.

**나만 쓰기 —** 홈 디렉터리에 둡니다. 어느 프로젝트에서든 뜹니다.

```bash
git clone https://github.com/hany202507/kernelacademy-web.git
mkdir -p ~/.claude/skills
cp -r kernelacademy-web/skills/kernel-html-* ~/.claude/skills/
```

**팀 저장소에 두기 —** 그 저장소의 `.claude/skills/` 에 두면 협업자 모두에게 뜹니다.

```bash
mkdir -p .claude/skills
cp -r /path/to/kernelacademy-web/skills/kernel-html-* .claude/skills/
```

Windows PowerShell 이면 `cp -r` 대신 `Copy-Item -Recurse` 를 씁니다.

설치 후 Claude Code 를 새로 띄우고 `/` 목록에 두 이름이 모두 보이면 된 것입니다.

## 쓰기

**접두사도 명령어도 필요 없습니다.** 자료를 주고 말로 시키면 스킬이 알아서 뜹니다.
발표할 것이면 슬라이드가, 읽을 것이면 보고서가 뜹니다.

```
2강 대본.md 로 슬라이드 만들어줘
이 조사 노트 A4 보고서로 정리해줘
```

### 슬라이드

산출물은 **HTML 파일 하나**입니다. 브라우저로 열면 그대로 발표할 수 있습니다.

| 키 | |
|---|---|
| `←` `→` `↑` `↓` `Space` | 이동 |
| `Home` `End` | 처음 · 끝 |
| `F` | 전체화면 |
| 좌하단 진행바 클릭 | 그 부로 뛰기 |

`#12` 를 주소 뒤에 붙이면 12장부터 열립니다.

### 보고서

**HTML 과 PDF 가 같은 폴더에 함께** 나옵니다. 좌측 목차는 장 목록에서 자동 생성되고,
스크롤에 따라 현재 위치가 표시됩니다.

배포할 때는 **동봉된 PDF 를 쓰십시오.** 브라우저 인쇄는 여백에 날짜·문서 제목·`file://` 주소를
덧찍는데, 그건 문서 쪽 CSS 로 끌 수 없습니다(브라우저가 그립니다). 굳이 브라우저로 뽑아야 하면
인쇄 대화상자에서 '머리글 및 바닥글'을 끄고 '배경 그래픽'을 켜십시오.

## 실측기를 돌리려면

두 스킬 모두 **눈으로 판정할 수 없는 결함**을 재는 스크립트를 함께 씁니다.

- `slidecheck.ps1` — 슬라이드 캔버스는 `overflow:hidden` 이라 **넘친 줄이 화면에서 그냥 사라집니다.**
  한 줄이 잘려도 레이아웃은 멀쩡해 보입니다
- `printcheck.ps1` — A4 페이지 수·채움률·배치 결함을 재고, PDF 를 함께 뽑습니다

필요한 것은 둘 다 같습니다.

- **PowerShell** — Windows 는 기본 탑재, macOS·Linux 는 [PowerShell 7(`pwsh`)](https://learn.microsoft.com/powershell/scripting/install/installing-powershell) 설치
- **Chrome 또는 Edge** — 헤드리스로 실측합니다

```bash
cd ~/.claude/skills/kernel-html-slides/assets
pwsh -File slidecheck.ps1 "/절대/경로/슬라이드.html"
```

```bash
cd ~/.claude/skills/kernel-html-reports/assets
pwsh -File printcheck.ps1 -Html "/절대/경로/보고서.html" -Pdf "/절대/경로/보고서.pdf"
```

없어도 산출물은 만들어집니다. 다만 **잘린 줄을 확인하지 못한 채** 발표하거나 배포하게 됩니다.

## 막히면 기준 파일을 편다

각 스킬의 `reference/` 에 완성 기준이 들어 있습니다.
스타일이 흔들리거나 마크업이 헷갈리면 설명을 더 읽지 말고 그 파일을 열어 보는 편이 빠릅니다.

- `kernel-html-slides/reference/기준_슬라이드.html`
- `kernel-html-reports/reference/기준_보고서.html`

## 고치고 싶을 때

이 폴더는 **작업 저장소에서 내보낸 사본**입니다. 여기서 고친 내용은 다음 내보내기에서 덮어씌워집니다.
스타일 제안이나 오류 제보는 [이슈](https://github.com/hany202507/kernelacademy-web/issues)로 남겨 주십시오.

이용 조건은 [저장소 루트 README](../README.md)를 따릅니다.
