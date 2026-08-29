# 스킬 — 강의자료를 같은 얼굴로 만드는 도구

Kernel Academy 커리큘럼의 **강의자료를 여러 저자가 같은 스타일로** 만들기 위한
Claude Code 스킬입니다. 저자마다 색과 여백을 새로 고르지 않도록, 디자인을 템플릿에 박제해 두었습니다.

| 스킬 | 무엇을 만드나 |
|---|---|
| [`kernel-html-slides`](kernel-html-slides/) | 대본·마크다운·아웃라인 → **1280×720 단일 파일 HTML 슬라이드** (필요하면 PDF) |

## 설치

스킬 폴더를 통째로 Claude Code 가 읽는 자리에 두면 끝입니다. 빌드도 설치 명령도 없습니다.

**나만 쓰기 —** 홈 디렉터리에 둡니다. 어느 프로젝트에서든 뜹니다.

```bash
git clone https://github.com/hany202507/kernelacademy-web.git
mkdir -p ~/.claude/skills
cp -r kernelacademy-web/skills/kernel-html-slides ~/.claude/skills/
```

**팀 저장소에 두기 —** 그 저장소의 `.claude/skills/` 에 두면 협업자 모두에게 뜹니다.

```bash
mkdir -p .claude/skills
cp -r /path/to/kernelacademy-web/skills/kernel-html-slides .claude/skills/
```

Windows PowerShell 이면 `cp -r` 대신 `Copy-Item -Recurse` 를 씁니다.

설치 후 Claude Code 를 새로 띄우고 `/` 목록에 `kernel-html-slides` 가 보이면 된 것입니다.

## 쓰기

**접두사도 명령어도 필요 없습니다.** 대본을 주고 말로 시키면 스킬이 알아서 뜹니다.

```
2강 대본.md 로 슬라이드 만들어줘
```

산출물은 **HTML 파일 하나**입니다. 브라우저로 열면 그대로 발표할 수 있습니다.

| 키 | |
|---|---|
| `←` `→` `↑` `↓` `Space` | 이동 |
| `Home` `End` | 처음 · 끝 |
| `F` | 전체화면 |
| 좌하단 진행바 클릭 | 그 부로 뛰기 |

`#12` 를 주소 뒤에 붙이면 12장부터 열립니다.

## 넘침 검사기(`slidecheck`)를 돌리려면

슬라이드 캔버스는 `overflow:hidden` 이라 **넘친 줄은 화면에서 그냥 사라집니다.**
한 줄이 잘려도 레이아웃은 멀쩡해 보이므로 눈으로는 판정할 수 없습니다. 그래서 재는 도구가 붙어 있습니다.

- **PowerShell** — Windows 는 기본 탑재, macOS·Linux 는 [PowerShell 7(`pwsh`)](https://learn.microsoft.com/powershell/scripting/install/installing-powershell) 설치
- **Chrome 또는 Edge** — 헤드리스로 실측합니다

```bash
pwsh -File ~/.claude/skills/kernel-html-slides/assets/slidecheck.ps1 "/절대/경로/슬라이드.html"
```

없어도 슬라이드는 만들어집니다. 다만 **넘침을 확인하지 못한 채 발표하게 됩니다.**

## 막히면 기준 파일을 편다

`kernel-html-slides/reference/기준_슬라이드.html` 이 완성 기준입니다.
스타일이 흔들리거나 마크업이 헷갈리면 설명을 더 읽지 말고 그 파일을 열어 보는 편이 빠릅니다.

## 고치고 싶을 때

이 폴더는 **작업 저장소에서 내보낸 사본**입니다. 여기서 고친 내용은 다음 내보내기에서 덮어씌워집니다.
스타일 제안이나 오류 제보는 [이슈](https://github.com/hany202507/kernelacademy-web/issues)로 남겨 주십시오.

`SKILL.md` 가 가리키는 자매 스킬 `kernel-html-reports`(읽는 보고서용)는 아직 여기에 없습니다.
슬라이드가 아니라 문서가 필요하면 그 대목은 건너뛰십시오.

이용 조건은 [저장소 루트 README](../README.md)를 따릅니다.
