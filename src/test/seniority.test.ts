import { describe, it, expect } from 'vitest';
import { extractSeniorityLevel as f } from '@/server/jobstudio-api';
describe('seniority', () => {
  it('support specialist is not lead despite description', () =>
    expect(f('Customer Support Specialist', 'You will work with our lead engineers and staff to manage tickets')).toBe('Early / Junior'));
  it('director title is lead', () => expect(f('Director of Engineering')).toBe('Lead / Staff / Director'));
  it('senior title', () => expect(f('Senior Product Designer')).toBe('Senior'));
  it('years fallback', () => expect(f('Software Engineer', 'Requires 6+ years of experience')).toBe('Senior'));
  it('customer support manager is not director', () => expect(f('Customer Support Manager')).not.toBe('Lead / Staff / Director'));
});
