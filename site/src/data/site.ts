/**
 * 사이트 전역 상수.
 *
 * ⚠️ 법인 정보의 상위 출처는 스킬 `커널스페이스-기본정보` 다.
 *    주소 이전·대표 변경이 있으면 그쪽을 먼저 고치고 여기로 내린다.
 *    ("4층 2호 → 4층 3호" 처럼 실제로 바뀐 전례가 있다.)
 *    이 파일이 site/ 안의 단일 출처이므로, 다른 곳에 값을 복제하지 않는다.
 */

export const SITE = {
  name: 'Kernel Academy',
  /** 커리큘럼 이름. 기관명과 섞지 않는다 (MIT ↔ OpenCourseWare). */
  curriculum: 'FAI',
  url: 'https://kernelacademy.io',
  tagline: '재무 AI 표준 커리큘럼. 전부 무료입니다.',
  description:
    '재무·회계 실무자가 AI를 실제로 쓰게 만드는 무료 교육 프로그램. 커리큘럼·강의자료·실습 데이터를 전면 공개합니다.',
} as const;

/** 발행 주체. 푸터·개인정보 처리방침에만 노출하고 본문·헤드라인에는 쓰지 않는다. */
export const COMPANY = {
  name: '주식회사 커널스페이스',
  nameEn: 'Kernelspace Co., Ltd.',
  ceo: '박상정',
  bizNo: '115-86-03754',
  address: '서울특별시 강남구 테헤란로2길 8, 4층 3호',
  site: 'https://www.kernelspace.io',
  email: 'hello@kernelspace.io',
} as const;

/**
 * 유튜브 채널 — 캐주얼 유입 브랜드.
 * 06번의 2단 브랜드 구조: 「AI CFO Lab」(유입) → Kernel Academy(정식).
 * 사이트에서 언급할 때는 항상 소속을 함께 밝혀 두 이름이 한 사다리임을 보이게 한다.
 */
export const YOUTUBE = {
  name: 'AI CFO Lab',
  url: 'https://www.youtube.com/@AICFOLab',
  desc: '결산·회계기준 검토·리서치 자동화 시연',
} as const;

/** GNB — 5개 상한 (14번 §2-1). 지금 3개. */
export const NAV = [
  {
    label: '소개',
    href: '/about',
    children: [
      { label: '우리는 누구인가', href: '/about' },
      { label: '교육위원회', href: '/about/committee' },
      { label: '자주 묻는 질문', href: '/about/faq' },
      { label: '자료 이용 조건', href: '/about/license' },
    ],
  },
  {
    label: '교육프로그램',
    href: '/program',
    children: [
      { label: '프로그램 소개', href: '/program' },
      { label: '기능별 훈련', href: '/program/blocks' },
      { label: '워크플로우', href: '/program/workflows' },
    ],
  },
  { label: '블로그', href: '/insights' },
  /** 유일한 행동 유도. 헤더 버튼 대신 메뉴 안에 두고 강조만 다르게 준다. */
  { label: '가입하기', href: '/join', cta: true },
] as const;

/** 블록 6색 — CSS 변수와 짝을 맞춘다. 배지에는 항상 문자를 함께 넣는다(색각·흑백 인쇄 대응). */
export const BLOCK_IDS = ['R', 'C', 'P', 'J', 'V', 'D'] as const;

/** J·V 는 매트릭스에서 먼저 눈에 들어와야 한다 — 이 과정이 다른 AI 교육과 갈리는 두 칸. */
export const EMPHASIZED_BLOCKS = ['J', 'V'] as const;
