/** 교육프로그램 세 페이지가 함께 쓰는 값. 한 곳에서만 고친다. */

export const TIERS = [
  {
    id: 'T1',
    name: '리터러시',
    hours: '2시간',
    desc: 'AI의 원리와 한계, 여섯 기능의 문법. 재무 업무의 말로 옮긴 기초',
    /** 자료 공개 시점. 준비중인 것이 많은 사이트에서 이 표시가 신뢰를 만든다. */
    open: '자료실에서 바로 받기',
    openState: 'open',
    /** 받을 수 있는 단계만 링크를 준다. 없으면 카드가 눌리지 않는다. */
    href: '/materials',
  },
  {
    id: 'T2',
    name: '실무',
    hours: '12시간',
    desc: '3일 과정. 여섯 기능을 실제 업무 순서로 조립해 끝까지 완성',
    open: '2026년 9월 공개 예정',
    openState: 'soon',
  },
  {
    id: 'T3',
    name: '심화',
    hours: '24시간',
    desc: '3주 6세션. 업무 워크플로 전체를 설계하고 검증까지 붙인다',
    open: '2026년 10월 공개 예정',
    openState: 'soon',
  },
  {
    id: 'T4',
    name: '어드바이저',
    hours: '시수 미정',
    desc: '조직 확산과 운영 설계. 구성 논의 중',
    open: '구성 논의 중',
    openState: 'later',
  },
] as const;

/** 매 회차 3.5시간의 리듬. 세종대 과정에서 검증된 포맷. */
export const RHYTHM = [
  { min: '60분', what: '설명', note: '개념·프레임' },
  { min: '30분', what: '시연', note: '실제 에이전트 시연' },
  { min: '60분', what: '만들기', note: '수강생이 직접 제작' },
  { min: '30분', what: '발표', note: '공유·피드백' },
] as const;

/**
 * 역량 축(무엇을 할 줄 알게 되는가) ↔ 콘텐츠 축(어디서 가르치는가).
 * 비어 있는 칸을 숨기지 않는다 — 위원 커리큘럼 리뷰의 실제 안건이다.
 */
export const DOMAINS = [
  {
    id: 'D1',
    name: 'AI 기초 이해',
    desc: 'LLM이 어떻게 움직이는지를 재무인의 말로. 할 수 있는 것과 없는 것의 경계',
    maps: '원리 · 왜 재무 AI는 다른가',
    href: null,
    gap: false,
  },
  {
    id: 'D2',
    name: '시장·전략 배경',
    desc: 'AX 시장의 지형, 도입 경제성, 성패 사례',
    maps: '아직 정본 문서가 없습니다',
    href: '/insights',
    gap: true,
  },
  {
    id: 'D3',
    name: '재무 AI 실무 활용',
    desc: '반복되는 재무업무를 다시 쓸 수 있는 워크플로로 바꾸기',
    maps: '여섯 기능 전체 + 일곱 워크플로',
    href: '#blocks',
    gap: false,
  },
  {
    id: 'D4',
    name: '안정성·신뢰성',
    desc: '숫자가 원본과 맞는지 확인하기, 교차검증, 검증 게이트',
    maps: 'V 검증',
    href: '#block-V',
    gap: false,
  },
  {
    id: 'D5',
    name: '보안·거버넌스 경계',
    desc: '무엇을 AI에 넣어도 되는가, 비식별화',
    maps: '실행환경(런타임) + C 연동',
    href: '#block-C',
    gap: false,
  },
  {
    id: 'D6',
    name: '확산·조직 적용',
    desc: '조직 안에서 퍼뜨리고 운영하기',
    maps: '아직 정본 문서가 없습니다',
    href: '/insights',
    gap: true,
  },
] as const;

/** 수강생이 서 있는 자리에서 시작하도록. 3단계·심화를 없애지 않고 계단을 만든다. */
export const LADDER = [
  { n: 1, title: '챗봇 활용', desc: 'Claude + Excel 등', note: '특정 제품이 없어도 되는 단계 · 진입 장벽 최소화' },
  { n: 2, title: '로컬 파일 직접 편집', desc: '실제 업무 파일에 적용', note: '' },
  { n: 3, title: '코드 기반 에이전트', desc: 'Claude Code 등', note: '반복 업무의 자산화' },
  { n: 4, title: '자동 검증·워크플로 고도화', desc: '하네스·루프 개념', note: '심화' },
] as const;
