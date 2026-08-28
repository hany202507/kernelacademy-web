import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 블록·워크플로는 `../canon/` 을 직접 읽는다. site/ 안에 복사본을 두지 않는다.
 * 복사본이 생기는 순간 이중 관리가 시작되고, 다음 개정에서 유실된다 (CLAUDE.md 정본 규칙).
 * export 후 공개 repo 에서도 canon/ 과 site/ 가 같은 상대 위치이므로 그대로 빌드된다.
 */
const CANON = '../canon/00_프레임워크';

const 공개여부 = z.enum(['공개', '준비중']);

const blocks = defineCollection({
  loader: glob({ base: `${CANON}/blocks`, pattern: '*.md' }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    oneline: z.string(),
    order: z.number(),
    updated: z.coerce.date(),
    공개여부,
  }),
});

const workflows = defineCollection({
  loader: glob({ base: `${CANON}/workflows`, pattern: '*.md' }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    combo: z.array(z.string()),
    scenario: z.string(),
    order: z.number(),
    updated: z.coerce.date(),
    공개여부,
  }),
});

const insights = defineCollection({
  loader: glob({ base: './src/content/insights', pattern: '*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['트렌드', '사례', '커리어']),
    lede: z.string(),
    published: z.coerce.date(),
    updated: z.coerce.date(),
    order: z.number(),
    /** 어느 학습단계에서 쓰이는 이야기인가. 글을 커리큘럼에 걸어 두기 위한 표시. */
    stage: z.enum(['T1 리터러시', 'T2 실무', 'T3 어드바이저']),
    /** 카드 썸네일·글 머리 사진. public/images/ 기준 경로. */
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    /** 본문 하단 출처 블록. 조사일이 붙은 문서가 근거로 말한다는 신호가 된다. */
    sources: z.array(z.object({ label: z.string(), note: z.string().optional() })).default([]),
    /**
     * 자주 받는 질문. 본문 아래에 렌더링되고 동시에 FAQPage 구조화데이터로 나간다.
     * 본문에 Q&A 를 또 쓰지 않는다 — 두 군데 두면 다음 개정에서 갈라진다.
     * 답은 인용될 것을 전제로 한 문단 단언형으로 쓴다(AI 답변 인용 = AEO).
     */
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  }),
});

export const collections = { blocks, workflows, insights };
