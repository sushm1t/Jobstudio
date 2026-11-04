import { describe, it, expect } from 'vitest';
import { buildProfileTerms, scoreJobAgainstProfile, PROFILE_MATCH_THRESHOLD } from '@/jobstudio/utils/profileMatch';

const profile = buildProfileTerms('Senior Product Manager. Led AI product roadmap, analytics, SQL, stakeholder management.');

describe('profile matching', () => {
  it('keeps a role whose title matches the profile', () => {
    expect(scoreJobAgainstProfile({ title: 'Senior Product Manager, AI' }, profile)).toBeGreaterThanOrEqual(PROFILE_MATCH_THRESHOLD);
  });
  it('drops an unrelated role', () => {
    expect(scoreJobAgainstProfile({ title: 'Mechanical Welder' }, profile)).toBeLessThan(PROFILE_MATCH_THRESHOLD);
  });
  it('scores 0 with an empty profile', () => {
    expect(scoreJobAgainstProfile({ title: 'Product Manager' }, buildProfileTerms(''))).toBe(0);
  });
});
