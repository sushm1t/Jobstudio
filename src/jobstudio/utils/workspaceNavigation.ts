const workspaceTabs = new Set(['evaluator', 'applied', 'roadmaps', 'resume', 'cover-letter', 'referral', 'screening', 'profile', 'pricing']);
const keyFor = (userId: string) => `jobstudio_workspace_tab_${userId}`;

/** Keep refresh navigation local to this browser tab and verified account. */
export function readWorkspaceTab(userId: string): string {
  try {
    const saved = sessionStorage.getItem(keyFor(userId));
    return saved && workspaceTabs.has(saved) ? saved : 'evaluator';
  } catch {
    return 'evaluator';
  }
}

export function rememberWorkspaceTab(userId: string, tab: string) {
  if (!workspaceTabs.has(tab)) return;
  try { sessionStorage.setItem(keyFor(userId), tab); } catch { /* Storage may be unavailable. */ }
}

export function clearWorkspaceTab(userId: string) {
  try { sessionStorage.removeItem(keyFor(userId)); } catch { /* Storage may be unavailable. */ }
}