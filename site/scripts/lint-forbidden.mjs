/**
 * 금칙어 빌드 게이트 — 자격기본법 §39
 *
 * 민간자격 등록증 발급 전까지 「자격·인증·검정·공인」을 쓰지 않는다.
 * 사람 눈으로 매번 잡는 방식은 언젠가 샌다. URL 은 한번 박히면 바꾸기도 어렵다.
 * 그래서 빌드 산출물을 통째로 훑어 하나라도 남아 있으면 빌드를 실패시킨다.
 *
 * 제품명(Gridie)도 함께 막는다 — "제품 무관 커리큘럼"이 이 프로그램의 원칙이라,
 * 제품명이 보이는 순간 그 주장이 약해진다.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

const FORBIDDEN = ['자격', '인증', '검정', '공인', 'Gridie', '그리디'];

/**
 * 정당한 표기는 먼저 지운 뒤에 검사한다.
 * 부분일치 허용은 두지 않는다 — 아래 목록에 없는 조합은 전부 걸린다.
 */
const ALLOWED = [
  '공인회계사',          // 직업명
  '한국공인회계사회',
  'KICPA',
  '자격기본법',          // 금칙의 근거 법률을 지칭
  '민간자격 등록증',      // 등록 대상의 법적 명칭
  '「자격·인증·검정·공인」', // 금칙 자체를 설명하는 안내 문구
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

function scrub(text) {
  let s = text;
  for (const a of ALLOWED) s = s.split(a).join('·'.repeat(a.length));
  return s;
}

/** 몇 번째 줄인지 + 앞뒤 문맥을 보여 준다. 어디를 고쳐야 하는지 바로 알아야 쓸모가 있다. */
function findHits(file) {
  const raw = readFileSync(file, 'utf8');
  const lines = scrub(raw).split('\n');
  const rawLines = raw.split('\n');
  const hits = [];
  lines.forEach((line, i) => {
    for (const word of FORBIDDEN) {
      let at = line.indexOf(word);
      while (at !== -1) {
        const ctx = rawLines[i].slice(Math.max(0, at - 40), at + word.length + 40).replace(/\s+/g, ' ');
        hits.push({ line: i + 1, word, ctx });
        at = line.indexOf(word, at + word.length);
      }
    }
  });
  return hits;
}

let files;
try {
  files = walk(DIST);
} catch {
  console.error(`✗ dist/ 를 찾을 수 없습니다. 먼저 astro build 를 실행하세요.`);
  process.exit(1);
}

let total = 0;
for (const f of files) {
  const hits = findHits(f);
  if (!hits.length) continue;
  total += hits.length;
  console.error(`\n✗ ${relative(process.cwd(), f)}`);
  for (const h of hits) {
    console.error(`   ${h.line}행  「${h.word}」  … ${h.ctx} …`);
  }
}

if (total > 0) {
  console.error(
    `\n🔴 금칙어 ${total}건. 자격기본법 §39 — 등록증 발급 전까지 「자격·인증·검정·공인」을 쓸 수 없습니다.` +
      `\n   대체어: 자격→교육과정 · 인증→수료 · 검정→평가 · 공인 강사→파트너 강사 · 공인 교육기관→사용 등록 기관`
  );
  process.exit(1);
}

console.log(`✅ 금칙어 검사 통과 — HTML ${files.length}개`);
