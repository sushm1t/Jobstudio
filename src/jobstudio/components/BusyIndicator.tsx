import { Loader2 } from 'lucide-react';

/**
 * Plain spinner for ordinary app waits (page loads, sign-in, fetches).
 * Counting percentages belong to AI generation only — see LoadingProgress.
 */
export function BusyIndicator({ active = true, label }: { active?: boolean; label: string }) {
  if (!active) return null;
  return (
    <div role="status" aria-label={label} className="flex items-center justify-center gap-3 px-3 py-6 text-sm text-muted-foreground no-print">
      <Loader2 className="size-4 animate-spin text-brand" aria-hidden="true" />
      <span>{label}…</span>
    </div>
  );
}
