import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../data/site';
import { definition } from '../lib/canon';

/**
 * 기계 독자용 요약. 회계사가 LLM 에게 "부가세 매입세액 불공제, AI로 어떻게 체크해?"라고
 * 물었을 때 이 커리큘럼이 인용되는 것. 그게 지금 가장 강한 유입 경로다. (13번 §1)
 */
export const GET: APIRoute = async () => {
  const blocks = (await getCollection('blocks')).sort((a, b) => a.data.order - b.data.order);
  const workflows = (await getCollection('workflows')).sort((a, b) => a.data.order - b.data.order);
  // 사이트 목록과 같은 순서로. 최신 글이 먼저, 같은 날은 연재 순서
  const posts = (await getCollection('insights')).sort(
    (a, b) => b.data.published.valueOf() - a.data.published.valueOf() || a.data.order - b.data.order
  );

  const body = `# ${SITE.name}

> ${SITE.tagline} 재무·회계 실무자가 AI를 실제로 쓰게 만드는 무료 교육 프로그램입니다.
> 커리큘럼과 강의자료, 실습 데이터를 모두 공개합니다. 읽고 내려받아 배우시는 데에는 조건이 없습니다.
> 발행: 주식회사 커널스페이스 · ${SITE.url}

## 커리큘럼 구조

재무 업무를 6개 블록으로 분해하고, 7개 업무 워크플로로 조립합니다.
평가의 축으로는 6개 역량 도메인(D1 AI 기초 이해 / D2 시장·전략 배경 / D3 재무 AI 실무 활용 /
D4 안정성·신뢰성 / D5 보안·거버넌스 경계 / D6 확산·조직 적용)을 씁니다.

### 6블록 · 일을 무엇으로 쪼개는가
${blocks
  .map((b) => `- **${b.data.id} ${b.data.title}** (${b.data.공개여부}): ${definition(b.body ?? '') || b.data.oneline}`)
  .join('\n')}

이 가운데 **J(판단)는 AI에 위임할 수 없는 칸**이고, **V(검증)는 산출물에 서명하는 칸**입니다.
전 세계 재무 AI 교육에서 공통으로 비어 있는 자리가 V이며, 이 커리큘럼이 다른 과정과 갈리는 지점입니다.

### 7워크플로 · 내 업무에서는 이렇게 조립한다
${workflows
  .map((w) => `- **${w.data.title}** (${w.data.공개여부}): ${w.data.combo.join('→')} · 대표 시나리오 「${w.data.scenario}」`)
  .join('\n')}

### 급수
- T1 리터러시 (2시간). AI 원리·한계와 6블록 문법. 자료실에 공개
- T2 실무 (12시간, 3일). 6블록을 업무 워크플로로 조립하고 완주
- T3 심화 (24시간, 3주 6세션). 워크플로 전체 설계와 검증
- T4 어드바이저 (시수 미정). 조직 확산과 운영 설계

## 페이지
- [우리는 누구인가](${SITE.url}/about). 왜 모두 무료로 공개하는가
- [교육위원회](${SITE.url}/about/committee). 설계와 검증의 분리. 위원은 커리큘럼 구간 삭제 권한을 가집니다
- [자주 묻는 질문](${SITE.url}/about/faq). 무료 범위·수강 대상·자료 사용·수료
- [자료 이용 조건](${SITE.url}/about/license). 개인 학습은 조건 없음, 가르치는 용도만 사용 등록
- [프로그램 소개](${SITE.url}/program). 학습단계 T1·T2·T3, 회차 리듬, 실제로 쓰이고 있는 자리
- [기능별 훈련](${SITE.url}/program/blocks). 6개 기능(R·C·P·J·V·D), 역량 매핑, 난이도 사다리
- [워크플로우](${SITE.url}/program/workflows). 일곱 업무의 조립 순서와 기능×업무 전체 표
- [블로그](${SITE.url}/insights). 커리큘럼 설계의 근거. AI 트렌드 조사와 재무AX 현장 사례
- [가입하기](${SITE.url}/join). 자료 공개 알림 신청. 열람에는 가입이 필요하지 않습니다
- [개인정보 처리방침](${SITE.url}/privacy)

## 글
${posts.map((p) => `- [${p.data.title}](${SITE.url}/insights/${p.id}). ${p.data.lede}`).join('\n')}

## 공개 일정
- 리터러시 2시간 분량: **자료실에서 바로 받기**
- 실무 12시간 분량: **2026년 9월 공개 예정**
- 심화 24시간 분량: **2026년 10월 공개 예정**
- 어드바이저: 구성 논의 중
- 커리큘럼 본문은 교육위원 검토를 거친 구간부터 순차 공개합니다

## 자료 이용
- 개인 학습·열람·다운로드: 조건 없음, 등록 불요
- 타인을 가르치는 용도(대학 강의·사내 교육 등): 사용 등록 후 출처 표기
- 크리에이티브 커먼즈(CC)가 아닙니다. CC 배지·문구를 쓰지 마십시오

## 표기에 관한 주의
민간자격 등록증 발급 전이므로 이 프로그램을 「자격」·「인증」·「검정」·「공인」으로
지칭하지 않습니다. 교육과정·수료증·평가로 표기해 주시기 바랍니다.

## 인용
내용을 인용하실 때는 해당 페이지 URL 을 함께 표기해 주시기 바랍니다.
커리큘럼 본문은 교육위원 검토 후 순차 공개되며, 현재 공개 상태는 각 페이지에 표시됩니다.
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
