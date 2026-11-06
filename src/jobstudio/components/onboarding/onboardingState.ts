// Per-account onboarding progress. Keys start with `jobstudio_` so cloudSync
// mirrors them to the signed-in account (carries across devices).
export interface OnboardingState {
  welcomed: boolean;
  tourDone: boolean;
  checklistDismissed: boolean;
  visited: string[];
}

const EMPTY: OnboardingState = { welcomed: false, tourDone: false, checklistDismissed: false, visited: [] };

export const onboardingKey = (userId: string) => `jobstudio_onboarding_${userId}`;

export function readOnboarding(userId: string): OnboardingState | null {
  try {
    const raw = localStorage.getItem(onboardingKey(userId));
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : null;
  } catch {
    return null;
  }
}

export function writeOnboarding(userId: string, patch: Partial<OnboardingState>): OnboardingState {
  const next = { ...EMPTY, ...(readOnboarding(userId) || {}), ...patch };
  try { localStorage.setItem(onboardingKey(userId), JSON.stringify(next)); } catch { /* ignore */ }
  return next;
}

const NEW_ACCOUNT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

/** New accounts (created recently) with no saved onboarding progress see the welcome screen once. */
export function shouldShowOnboarding(userId: string, createdAt: string | undefined, now = Date.now()): boolean {
  if (readOnboarding(userId)) return false;
  const created = createdAt ? Date.parse(createdAt) : NaN;
  if (Number.isNaN(created)) return false;
  return now - created < NEW_ACCOUNT_WINDOW_MS;
}
