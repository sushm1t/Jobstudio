import { afterEach, expect, it } from 'vitest';
import { readOnboarding, shouldShowOnboarding, writeOnboarding } from '@/jobstudio/components/onboarding/onboardingState';

afterEach(() => localStorage.clear());
const now = Date.parse('2026-11-05T00:00:00Z');

it('shows onboarding once for a newly created account', () => {
  expect(shouldShowOnboarding('u1', '2026-11-04T23:00:00Z', now)).toBe(true);
  writeOnboarding('u1', {});
  expect(shouldShowOnboarding('u1', '2026-11-04T23:00:00Z', now)).toBe(false);
});

it('does not show onboarding to existing older accounts', () => {
  expect(shouldShowOnboarding('u2', '2026-01-01T00:00:00Z', now)).toBe(false);
});

it('skipping the welcome screen is remembered per account', () => {
  writeOnboarding('u3', { welcomed: true });
  expect(readOnboarding('u3')?.welcomed).toBe(true);
  expect(readOnboarding('u4')).toBeNull();
});
