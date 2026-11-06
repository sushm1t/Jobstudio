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
  const travelProfile = buildProfileTerms('Operations Manager. Business development in travel tourism. Travel consultant, bookings, customer support, sales, stakeholder management, analytics, business systems and process improvement.');
  for (const title of ['AI Engineer', 'Application Engineer', 'Backend Software Engineer']) {
    it(`excludes ${title} for a travel operations profile despite shared business words`, () => {
      expect(scoreJobAgainstProfile({ title, descriptionSnippet: 'business operations analytics stakeholder management process improvement customer support' }, travelProfile)).toBeLessThan(40);
    });
  }
  for (const title of ['Travel Operations Manager', 'Tourism Business Development Manager', 'Operations Manager']) {
    it(`retains ${title} for the travel operations profile`, () => {
      expect(scoreJobAgainstProfile({ title, descriptionSnippet: 'travel tourism bookings sales customer support business development operations' }, travelProfile)).toBeGreaterThanOrEqual(40);
    });
  }
  it('retains engineering roles for an engineering profile', () => {
    const engineeringProfile = buildProfileTerms('AI Engineer, software development, Python machine learning, analytics, business operations.');
    expect(scoreJobAgainstProfile({ title: 'AI Engineer', descriptionSnippet: 'Python machine learning software development' }, engineeringProfile)).toBeGreaterThanOrEqual(40);
  });
});
