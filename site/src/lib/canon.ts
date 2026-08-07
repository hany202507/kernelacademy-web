/**
 * canon 마크다운 본문에서 필요한 절만 뽑아낸다.
 *
 * 사이트가 canon 을 "다시 쓰지" 않고 "읽기만" 하기 위한 유일한 통로다.
 * 여기서 뽑지 못하는 내용이 화면에 필요해지면, 사이트에 새로 쓰는 게 아니라
 * canon 을 고친다 (CLAUDE.md 정본 규칙).
 */

/**
 * 마크다운 인라인 문법을 텍스트로 평탄화한다. 카드·배지처럼 짧은 자리에 쓴다.
 *
 * canon 안의 상호 참조(`[DB-02 공백②](../../reference-db/…md)` 같은 것)는 **지운다.**
 * 사이트에는 그 문서가 없어서 독자에게 아무 뜻이 없고, 내부 문서 기호가 그대로 보이면
 * 공개용 화면에 작업 메모가 새어 나온 것처럼 읽힌다. 외부 URL 링크는 텍스트로 남긴다.
 */
export function plain(md: string): string {
  return md
    .replace(/\s*\(?\[[^\]]+\]\([^)]*\.md[^)]*\)\)?/g, '') // canon 내부 참조 → 삭제
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // 그 밖의 링크 → 텍스트
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,·)])/g, '$1') // 참조를 지운 자리에 남은 공백. 줄표(—) 앞 공백은 살린다
    .replace(/\(\s*\)/g, '')
    .trim();
}

/** `## <제목>` 절의 본문을 그대로(마크다운째) 돌려준다. */
export function section(body: string, heading: string): string {
  const re = new RegExp(`^##\\s+${heading}\\s*$([\\s\\S]*?)(?=^##\\s|\\Z)`, 'm');
  return (body.match(re)?.[1] ?? '').trim();
}

/** 블록의 「정의」 한 문단. */
export function definition(body: string): string {
  return plain(section(body, '정의'));
}

/**
 * 블록의 「역할 분담」 — AI 가 하는 일 / 사람이 하는 일.
 * 이 2열이 이 커리큘럼의 서명이라 화면에서 가장 중요한 조각이다.
 */
export function roleSplit(body: string): { ai: string; human: string } | null {
  const sec = section(body, '역할 분담');
  if (!sec) return null;
  const grab = (label: string) => {
    const m = sec.match(new RegExp(`^[-*]\\s*\\*\\*${label}\\*\\*\\s*:\\s*(.+)$`, 'm'));
    return m ? plain(m[1]) : '';
  };
  const ai = grab('AI');
  const human = grab('사람');
  return ai && human ? { ai, human } : null;
}

/** 워크플로 표에서 블록별 작업을 뽑는다. `| R | 작업 | 환경 |` */
export function workflowSteps(body: string): { block: string; task: string }[] {
  const rows = body.matchAll(/^\|\s*([RCPJVD])\s*\|\s*([^|]+?)\s*\|/gm);
  return [...rows].map((m) => ({ block: m[1], task: plain(m[2]) }));
}

/** 워크플로의 대표 시나리오 제목. `## 대표 시나리오: 부가세 신고 (분기)` */
export function scenario(body: string): string {
  return plain(body.match(/^##\s*대표 시나리오:\s*(.+)$/m)?.[1] ?? '');
}
