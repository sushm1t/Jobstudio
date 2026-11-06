import { ToolError, type ToolContext } from '@lovable.dev/mcp-js';
import { supabaseForUser } from './supabase';

export async function readSavedRecord(ctx: ToolContext, prefix: 'jobstudio_master_profile_' | 'jobstudio_applied_jobs_'): Promise<unknown> {
  const userId = ctx.getUserId();
  const email = ctx.getUserEmail()?.toLowerCase().trim();
  if (!userId || !email) throw new ToolError('Sign in with an account to read saved career records.');
  const { data, error } = await supabaseForUser(ctx).from('user_data').select('value')
    .eq('user_id', userId).eq('key', `${prefix}${email}`).maybeSingle();
  if (error) throw new ToolError('Your saved career records could not be loaded. Try again.');
  if (!data?.value) return null;
  try { return JSON.parse(data.value); }
  catch { throw new ToolError('This saved record could not be read. Open the app to review it.'); }
}
export function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}
export const text = (value: unknown) => typeof value === 'string' ? value : '';
export const strings = (value: unknown) => Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];
export const array = (value: unknown): unknown[] => Array.isArray(value) ? value : [];