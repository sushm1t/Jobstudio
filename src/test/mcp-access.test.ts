import { beforeEach, describe, expect, it, vi } from 'vitest';
import { oauthReturnPath } from '@/lib/oauth-return-path';

const { maybeSingle, eq, select, from, factory } = vi.hoisted(() => {
  const maybeSingle = vi.fn();
  const eq = vi.fn();
  const select = vi.fn();
  const from = vi.fn();
  const factory = vi.fn();
  return { maybeSingle, eq, select, from, factory };
});
vi.mock('@/lib/mcp/supabase', () => ({ supabaseForUser: factory }));
import { readSavedRecord } from '@/lib/mcp/records';
import type { ToolContext } from '@lovable.dev/mcp-js';

const ctx = { getUserId: () => 'user-a', getUserEmail: () => 'Alex@Example.com' } as ToolContext;
beforeEach(() => {
  vi.clearAllMocks();
  const chain = { select, eq, maybeSingle };
  from.mockReturnValue(chain); select.mockReturnValue(chain); eq.mockReturnValue(chain);
  factory.mockReturnValue({ from });
});
describe('OAuth return safety', () => {
  it('preserves the authorization ID, query parameters and fragment', () => {
    expect(oauthReturnPath('/.lovable/oauth/consent?authorization_id=abc&mode=connect#review')).toBe('/.lovable/oauth/consent?authorization_id=abc&mode=connect#review');
  });
  it.each(['//outside.invalid', '/\\outside.invalid', '/path\n', 'https://outside.invalid'])('rejects external or malformed return %s', value => {
    expect(oauthReturnPath(value)).toBe('/');
  });
});
it('uses the verified caller ID and exact account-specific key', async () => {
  maybeSingle.mockResolvedValue({ data: { value: '{"headline":"Travel operations"}' }, error: null });
  expect(await readSavedRecord(ctx, 'jobstudio_master_profile_')).toEqual({ headline: 'Travel operations' });
  expect(eq).toHaveBeenCalledWith('user_id', 'user-a');
  expect(eq).toHaveBeenCalledWith('key', 'jobstudio_master_profile_alex@example.com');
});
it('does not query records for a caller without identity', async () => {
  await expect(readSavedRecord({ getUserId: () => null, getUserEmail: () => null } as unknown as ToolContext, 'jobstudio_applied_jobs_')).rejects.toThrow('Sign in');
  expect(from).not.toHaveBeenCalled();
});
it('does not substitute another record when no exact match exists', async () => {
  maybeSingle.mockResolvedValue({ data: null, error: null });
  expect(await readSavedRecord(ctx, 'jobstudio_applied_jobs_')).toBeNull();
  expect(maybeSingle).toHaveBeenCalledTimes(1);
});