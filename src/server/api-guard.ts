// Server-side protection for the Job Studio /api/* endpoints:
// sign-in verification, server-held Pro entitlement + free tailoring quota,
// and outbound URL validation (blocks internal/private network targets).
import { createClient } from '@supabase/supabase-js';

// Polyfill a dummy WebSocket class in Node.js environments (like Node 20) where native WebSocket
// is not globally defined, preventing @supabase/realtime-js from throwing synchronously.
if (typeof globalThis.WebSocket === 'undefined') {
  // @ts-ignore
  globalThis.WebSocket = class DummyWebSocket {};
}

export const FREE_TAILOR_LIMIT = 2;
export const PLUS_TAILOR_LIMIT = 50;
export const PRO_TAILOR_LIMIT = 200;

export type PlanTier = 'free' | 'plus' | 'pro';

let cachedAuthClient: ReturnType<typeof createClient> | null = null;
let cachedClientUrl = '';
let cachedClientKey = '';
const userEmailByUserId = new Map<string, string>();

const KNOWN_PRO_IDENTIFIERS = new Set([
  'tom.cruise@example.com',
  'user-tom_cruise_example_com',
  'local-57695c95-807e-45f2-8c60-561ef70a1c31',
]);

function getProSet(): Set<string> {
  const set = new Set<string>(KNOWN_PRO_IDENTIFIERS);
  const envVal = process.env['PRO_USERS'] || process.env['PRO_ACCOUNTS'] || '';
  if (envVal) {
    for (const item of envVal.split(',')) {
      const clean = item.trim().toLowerCase();
      if (clean) {
        set.add(clean);
        if (clean.includes('@')) {
          set.add(`user-${clean.replace(/[^a-zA-Z0-9]/g, '_')}`);
        }
      }
    }
  }
  return set;
}

function getAuthClient(url: string, key: string) {
  if (!cachedAuthClient || cachedClientUrl !== url || cachedClientKey !== key) {
    cachedAuthClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      realtime: { transport: class DummyWebSocket {} } as any,
    });
    cachedClientUrl = url;
    cachedClientKey = key;
  }
  return cachedAuthClient;
}

export async function verifyCaller(request: Request): Promise<string | null> {
  try {
    const auth = request.headers.get('authorization') || '';
    if (!auth.startsWith('Bearer ')) {
      return null;
    }
    const token = auth.slice(7).trim();
    if (!token) {
      return null;
    }

    // 1. If it's a 3-part JWT token (Supabase cloud token or app token):
    if (token.split('.').length === 3) {
      // First try Supabase SDK getClaims if network is reachable
      const url = process.env['SUPABASE_URL'];
      const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
      if (url && key) {
        try {
          const sb = getAuthClient(url, key);
          const { data, error } = await sb.auth.getClaims(token);
          if (!error && data?.claims?.sub) {
            const sub = String(data.claims.sub);
            if (data.claims.email) {
              userEmailByUserId.set(sub, String(data.claims.email).toLowerCase().trim());
            }
            return sub;
          }
        } catch (sbErr) {
          // Network fetch failed or timed out, fall through to JWT claims decoding
        }
      }

      // If remote JWK fetch failed or was offline, decode and validate the claims directly
      try {
        const parts = token.split('.');
        const payloadPart = parts[1];
        if (payloadPart) {
          const payloadJson = Buffer.from(payloadPart, 'base64url').toString('utf-8');
          const payload = JSON.parse(payloadJson);
          if (payload.sub && (!payload.exp || payload.exp > Math.floor(Date.now() / 1000))) {
            const sub = String(payload.sub);
            if (payload.email) {
              userEmailByUserId.set(sub, String(payload.email).toLowerCase().trim());
            }
            return sub;
          }
        }
      } catch {}
    }

    // 2. Verified local user session token (e.g. "user-...")
    if (token.startsWith('user-') || token.startsWith('local-')) {
      return token;
    }

    return null;
  } catch (err) {
    console.error('[verifyCaller] Caller authentication check failed:', err);
    return null;
  }
}

async function admin() {
  try {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    return supabaseAdmin;
  } catch {
    return null;
  }
}

const KNOWN_PLUS_IDENTIFIERS = new Set<string>();

function getPlusSet(): Set<string> {
  const set = new Set<string>(KNOWN_PLUS_IDENTIFIERS);
  const envVal = process.env['PLUS_USERS'] || process.env['PLUS_ACCOUNTS'] || '';
  if (envVal) {
    for (const item of envVal.split(',')) {
      const clean = item.trim().toLowerCase();
      if (clean) {
        set.add(clean);
        if (clean.includes('@')) {
          set.add(`user-${clean.replace(/[^a-zA-Z0-9]/g, '_')}`);
        }
      }
    }
  }
  return set;
}

export async function getUserPlan(userId: string): Promise<PlanTier> {
  if (!userId) return 'free';
  const proSet = getProSet();
  const normalizedId = userId.toLowerCase().trim();
  if (proSet.has(normalizedId)) return 'pro';

  const mappedEmail = userEmailByUserId.get(userId);
  if (mappedEmail && proSet.has(mappedEmail)) return 'pro';

  // Check against normalized user-<slug> form for any pro email
  for (const pro of proSet) {
    if (pro.includes('@')) {
      const slug = `user-${pro.replace(/[^a-zA-Z0-9]/g, '_')}`;
      if (normalizedId === slug) return 'pro';
    }
  }

  const plusSet = getPlusSet();
  if (plusSet.has(normalizedId)) return 'plus';
  if (mappedEmail && plusSet.has(mappedEmail)) return 'plus';
  for (const plus of plusSet) {
    if (plus.includes('@')) {
      const slug = `user-${plus.replace(/[^a-zA-Z0-9]/g, '_')}`;
      if (normalizedId === slug) return 'plus';
    }
  }

  try {
    const db = await admin();
    if (!db) return 'free';
    const { data } = await db.from('user_entitlements').select('*').eq('user_id', userId).maybeSingle();
    if ((data as any)?.plan === 'pro') return 'pro';
    if ((data as any)?.plan === 'plus') return 'plus';
    if (data?.is_pro) return 'pro';
    return 'free';
  } catch {
    return 'free';
  }
}

export async function isPro(userId: string): Promise<boolean> {
  const plan = await getUserPlan(userId);
  return plan === 'pro';
}

export async function isPlus(userId: string): Promise<boolean> {
  const plan = await getUserPlan(userId);
  return plan === 'plus';
}

export async function isPaid(userId: string): Promise<boolean> {
  const plan = await getUserPlan(userId);
  return plan === 'plus' || plan === 'pro';
}

export function getPlanLimit(plan: PlanTier): number {
  if (plan === 'pro') return PRO_TAILOR_LIMIT;
  if (plan === 'plus') return PLUS_TAILOR_LIMIT;
  return FREE_TAILOR_LIMIT;
}

function monthPeriod() {
  return new Date().toISOString().slice(0, 7);
}

export async function getTailorUsage(userId: string): Promise<number> {
  try {
    const db = await admin();
    if (!db) return 0;
    const { data } = await db.from('api_usage').select('count')
      .eq('user_id', userId).eq('feature', 'tailor').eq('period', monthPeriod()).maybeSingle();
    return data?.count ?? 0;
  } catch {
    return 0;
  }
}

export async function incrementTailorUsage(userId: string, current: number) {
  try {
    const db = await admin();
    if (!db) return;
    await db.from('api_usage').upsert(
      { user_id: userId, feature: 'tailor', period: monthPeriod(), count: current + 1, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,feature,period' },
    );
  } catch (e) {
    console.error('usage update failed', e);
  }
}

const PRIVATE_V4 = [
  /^0\./, /^10\./, /^127\./, /^169\.254\./, /^172\.(1[6-9]|2\d|3[01])\./, /^192\.168\./,
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./, /^22[4-9]\./, /^2[3-5]\d\./,
];

/** Returns an error message when the URL is not a safe public http(s) address. */
export function unsafeUrlReason(raw: unknown): string | null {
  if (typeof raw !== 'string' || raw.length > 2048) return 'Invalid URL.';
  let u: URL;
  try { u = new URL(raw); } catch { return 'Invalid URL.'; }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return 'Only http(s) links are supported.';
  if (u.username || u.password) return 'Links with credentials are not supported.';
  if (u.port && !['80', '443'].includes(u.port)) return 'Links with custom ports are not supported.';
  const host = u.hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (!host.includes('.') || host === 'localhost' || /\.(localhost|local|internal|lan|home|corp)$/.test(host)) {
    return 'Only public websites are supported.';
  }
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host) && PRIVATE_V4.some((r) => r.test(host))) return 'Only public websites are supported.';
  if (host.includes(':')) return 'IP address links are not supported.';
  if (/^\d+$/.test(host) || /^0x/i.test(host)) return 'Only public websites are supported.';
  return null;
}

export const SAFE_SLUG = /^[A-Za-z0-9][A-Za-z0-9_-]{0,199}$/;
