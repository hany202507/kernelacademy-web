// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

/**
 * 마크다운 표를 스크롤 컨테이너로 감싼다.
 *
 * 표에 직접 overflow 를 걸면(display:block) 열 너비 계산이 깨져 칸이 제멋대로 좁아진다.
 * 표는 표로 두고, 바깥 div 가 넘침을 처리해야 한다.
 * 본문 폭보다 넓게 빼내는 것도 이 div 가 맡는다(.md-table).
 */
function rehypeWrapTables() {
  return (tree) => {
    const walk = (node) => {
      if (!node.children) return;
      node.children.forEach((child, i) => {
        if (child.type === 'element' && child.tagName === 'table') {
          node.children[i] = {
            type: 'element',
            tagName: 'div',
            properties: { className: ['table-wrap', 'md-table'] },
            children: [child],
          };
        } else {
          walk(child);
        }
      });
    };
    walk(tree);
  };
}

// 정적 빌드만 한다. 클라이언트 렌더링 금지 — 크롤러가 못 읽으면 AEO 전략 전체가 무의미하다.
// (spec §4-4 / 14번 §5 AEO 요건)
export default defineConfig({
  site: 'https://kernelacademy.io',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    mdx(),
    /** 로그인 뒤에만 뜻이 있는 화면은 색인 대상이 아니다 — Base 의 noindex 와 짝을 맞춘다. */
    sitemap({ filter: (page) => !/\/(login|me|materials|auth\/callback)\/?$/.test(page) }),
  ],
  markdown: {
    shikiConfig: { theme: 'github-light', wrap: true },
    rehypePlugins: [rehypeWrapTables],
  },
  devToolbar: { enabled: false },
  vite: {
    build: {
      /**
       * 작은 자산을 HTML·CSS 안에 끼워 넣지 않는다.
       *
       * 기본값이면 200자짜리 스크립트를 인라인으로 박아 넣는데, 그러면 CSP 에
       * script-src 'unsafe-inline' 을 열어야 하고 CSP 를 두는 의미가 사라진다.
       * 요청 하나를 아끼는 것보다 인라인 스크립트를 전부 없애는 쪽이 낫다.
       */
      assetsInlineLimit: 0,
    },
  },
});
