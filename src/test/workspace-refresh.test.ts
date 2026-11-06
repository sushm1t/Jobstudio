import { afterEach, expect, it } from 'vitest';
import { clearWorkspaceTab, readWorkspaceTab, rememberWorkspaceTab } from '@/jobstudio/utils/workspaceNavigation';

afterEach(() => sessionStorage.clear());

it('keeps remembered pages isolated to the signed-in account', () => {
  rememberWorkspaceTab('first', 'applied');
  expect(readWorkspaceTab('first')).toBe('applied');
  expect(readWorkspaceTab('second')).toBe('evaluator');
});

it('never restores landing or auth as a dashboard page', () => {
  rememberWorkspaceTab('first', 'screening');
  rememberWorkspaceTab('first', 'home');
  rememberWorkspaceTab('first', 'auth');
  expect(readWorkspaceTab('first')).toBe('screening');
});

it('returns to the dashboard default after logout clears the saved page', () => {
  rememberWorkspaceTab('first', 'profile');
  clearWorkspaceTab('first');
  expect(readWorkspaceTab('first')).toBe('evaluator');
});