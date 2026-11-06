import { createClient } from '@supabase/supabase-js';
import type { ToolContext } from '@lovable.dev/mcp-js';

function runtimeEnv(name: string): string | undefined {
  const runtime = globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } };
  return runtime.process?.env?.[name];
}
function configuredEnv(names: string[]) {
  return names.map(runtimeEnv).find(value => value?.trim())?.trim();
}
function supabaseProjectUrl() {
  const url = configuredEnv(['SUPABASE_URL', 'VITE_SUPABASE_URL']) ?? import.meta.env['VITE_SUPABASE_URL'];
  if (!url) throw new Error('Career storage is not configured.');
  return url;
}
function supabasePublishableKey() {
  const direct = configuredEnv(['SUPABASE_PUBLISHABLE_KEY', 'VITE_SUPABASE_PUBLISHABLE_KEY']);
  if (direct) return direct;
  const keyset = runtimeEnv('SUPABASE_PUBLISHABLE_KEYS');
  if (keyset) {
    try {
      const parsed: unknown = JSON.parse(keyset);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const values = parsed as Record<string, unknown>;
        const key = [values['default'], ...Object.values(values)].find((v): v is string => typeof v === 'string' && v.trim().startsWith('sb_publishable_'));
        if (key) return key.trim();
      }
    } catch { /* continue to existing key fallback */ }
  }
  const key = configuredEnv(['SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY']) ?? import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'];
  if (!key) throw new Error('Career storage is not configured.');
  return key;
}
export function supabaseForUser(ctx: ToolContext) {
  const token = ctx.getToken();
  if (!token || !ctx.isAuthenticated()) throw new Error('Sign in to access your saved career data.');
  return createClient(supabaseProjectUrl(), supabasePublishableKey(), {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}