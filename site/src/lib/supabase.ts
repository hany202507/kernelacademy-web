import { createClient } from '@supabase/supabase-js';
import { SUPABASE_REF } from '../data/site';

/**
 * Supabase 클라이언트. **브라우저에서만 부른다** —
 * 페이지 frontmatter 에서 import 하면 빌드 시점에 실행되어 세션이 없는 채로 렌더된다.
 * 반드시 `<script>` 안에서만 import 할 것.
 *
 * ── 키를 코드에 그대로 두는 이유
 * 아래 키는 `anon`(publishable) 키다. 공개되도록 설계된 값이고, 정적 사이트라
 * 어떤 방식으로 넣든 결국 번들에 그대로 실린다. 환경변수로 감싸면 GitHub Actions
 * 빌드에 비밀값을 하나 더 매달게 되고, "로컬은 되는데 배포는 안 되는" 실패만 는다.
 *
 * 실제 보호는 이 키가 아니라 DB 의 RLS 정책이 한다 (infra/supabase/001_schema.sql).
 * `service_role` 키는 정책을 전부 무시하므로 **이 파일에 절대 넣지 않는다.**
 */
export const SUPABASE_URL = `https://${SUPABASE_REF}.supabase.co`;
export const SUPABASE_ANON_KEY = 'sb_publishable_03Ah2ZheYldzqyJ1KRu2Pg_twAyVZy2';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // 매직링크가 `?code=` 로 돌아오게 한다. 토큰이 URL 조각(#)에 노출되지 않는다.
    flowType: 'pkce',
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/** 소속 유형 — 가입 폼과 내 정보 화면이 같은 목록을 쓴다. */
export const SEGMENTS = ['회계법인', '기업 재무팀', '세무사무소', '학계', '학생', '기타'] as const;

/**
 * 메일 안의 링크가 돌아올 자리.
 *
 * ⚠️ 쿼리스트링을 붙이지 않는다. Supabase 는 허용 목록과 대조할 때 주소를 통째로
 * 비교하므로 `?next=/me` 가 붙는 순간 목록에 없는 주소가 되고, 조용히 Site URL 로
 * 떨어진다(오류도 안 난다). 대신 「어디로 되돌릴지」는 아래처럼 브라우저에 적어 둔다.
 */
export function callbackUrl() {
  return new URL('/auth/callback', location.origin).href;
}

const NEXT_KEY = 'ka:next';

/**
 * 로그인 후 돌아갈 곳을 기억해 둔다.
 *
 * PKCE 는 어차피 메일 링크를 **처음 요청한 그 브라우저**에서만 완성된다
 * (검증자가 이 브라우저에 있다). 그러니 여기에 적어 두는 것이 주소에 실어 보내는
 * 것보다 덜 잃는다.
 */
export function rememberNext(next: string) {
  try {
    localStorage.setItem(NEXT_KEY, next);
  } catch {
    /* 저장소를 막아 둔 브라우저 — 기본값으로 간다 */
  }
}

/** 기억해 둔 곳을 꺼내고 지운다. 외부 주소로 튕기지 않게 사이트 안 경로만 통과시킨다. */
export function takeNext(fallback = '/me') {
  let v: string | null = null;
  try {
    v = localStorage.getItem(NEXT_KEY);
    localStorage.removeItem(NEXT_KEY);
  } catch {
    /* 무시 */
  }
  return v && v.startsWith('/') && !v.startsWith('//') ? v : fallback;
}

/**
 * 로그인 여부 확인. 없으면 로그인 화면으로 보내고 null 을 돌려준다.
 * 네트워크를 타지 않는 getSession 을 쓴다 — 화면 깜빡임을 줄이기 위해서다.
 */
export async function requireUser() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    location.replace('/login?next=' + encodeURIComponent(location.pathname + location.search));
    return null;
  }
  return data.session.user;
}

/** Supabase 오류 메시지는 영어라 그대로 보이면 불친절하다. 자주 나오는 것만 옮긴다. */
export function ko(message: string) {
  const m = message.toLowerCase();
  if (m.includes('rate limit') || m.includes('too many'))
    return '메일을 너무 자주 요청하셨습니다. 잠시 후 다시 시도해 주십시오.';
  if (m.includes('signups not allowed') || m.includes('user not found'))
    return '가입되지 않은 주소입니다. 먼저 가입해 주십시오.';
  // 만료를 먼저 본다 — 원문이 "Email link is invalid or has expired" 라
  // invalid 를 먼저 걸면 만료를 주소 오타로 잘못 안내한다.
  if (m.includes('expired') || m.includes('otp_expired'))
    return '링크가 만료되었거나 이미 사용되었습니다. 메일을 다시 요청해 주십시오. (유효 시간 1시간)';
  if (m.includes('invalid') && m.includes('email')) return '이메일 주소를 다시 확인해 주십시오.';
  return message;
}
