/**
 * 소셜 미리보기 이미지(og:image)를 만든다.
 *
 * 카톡·슬랙·링크드인에 주소를 붙였을 때 뜨는 카드다. 없으면 글자만 나오고,
 * 교육위원께 링크를 보낼 때 그것이 첫인상이 된다.
 *
 * 사용: node scripts/make-og.mjs   (site/ 에서)
 * 결과: public/og.png — 커밋한다. 문구가 바뀔 때만 다시 돌린다.
 *
 * SVG 를 sharp 로 굽는다. 브라우저가 아니라 librsvg 가 그리므로
 * 웹폰트는 못 쓰고 시스템 폰트만 쓴다 — 그래서 사이트와 글꼴이 미묘하게 다르다.
 * 카드 한 장이라 그 편이 낫다(웹폰트를 넣으려면 글자를 패스로 변환해야 한다).
 */
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

const W = 1200;
const H = 630;

const 세리프 = "Georgia, 'Times New Roman', serif";
const 한글 = "'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif";

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#fcfdfb"/>

  <!-- 왼쪽 세이지 띠 — 사이트 머리말의 색을 그대로 쓴다 -->
  <rect x="0" y="0" width="14" height="${H}" fill="#3f7350"/>

  <!-- 아래쪽 옅은 지면 — 무게중심을 낮춘다 -->
  <rect x="14" y="${H - 96}" width="${W - 14}" height="96" fill="#f1f6ef"/>

  <text x="96" y="196" font-family="${세리프}" font-size="88" font-weight="500"
        letter-spacing="1" fill="#1a1c19">Kernel Academy</text>

  <rect x="98" y="240" width="72" height="3" fill="#3f7350"/>

  <text x="96" y="330" font-family="${한글}" font-size="44" font-weight="600"
        fill="#1a1c19">${esc('재무 AI 표준 커리큘럼')}</text>

  <text x="96" y="396" font-family="${한글}" font-size="29" font-weight="400"
        fill="#53574f">${esc('커리큘럼 · 강의자료 · 실습 데이터를')}</text>
  <text x="96" y="440" font-family="${한글}" font-size="29" font-weight="400"
        fill="#53574f">${esc('전면 무료로 공개합니다')}</text>

  <text x="96" y="${H - 36}" font-family="${세리프}" font-size="27"
        letter-spacing="0.5" fill="#53574f">kernelacademy.io</text>
  <text x="${W - 96}" y="${H - 36}" text-anchor="end" font-family="${한글}" font-size="23"
        fill="#91968c">${esc('주식회사 커널스페이스')}</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
writeFileSync('public/og.png', png);
console.log(`public/og.png — ${W}×${H}, ${(png.length / 1024).toFixed(0)}KB`);
