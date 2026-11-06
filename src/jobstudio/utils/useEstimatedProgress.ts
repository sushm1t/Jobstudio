import { useEffect, useState } from 'react';

export function estimatedProgressAt(elapsedSeconds: number, expectedSeconds: number): number {
  const duration = Math.max(1, expectedSeconds);
  const fraction = Math.max(0, elapsedSeconds) / duration;
  return Math.min(95, Math.max(1, Math.floor(95 * (1 - Math.pow(1 - Math.min(1, fraction), 1.5)))));
}

export function formatWait(seconds: number): string {
  const rounded = Math.max(0, Math.ceil(seconds));
  return rounded >= 60 ? `${Math.floor(rounded / 60)}m ${rounded % 60}s` : `${rounded}s`;
}

export function useEstimatedProgress(active: boolean, expectedSeconds = 40) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!active) { setElapsed(0); return; }
    const startedAt = Date.now();
    setElapsed(0);
    const interval = setInterval(() => setElapsed((Date.now() - startedAt) / 1000), 250);
    return () => clearInterval(interval);
  }, [active, expectedSeconds]);
  return {
    progress: active ? estimatedProgressAt(elapsed, expectedSeconds) : 0,
    elapsed,
    etaLabel: elapsed >= expectedSeconds
      ? `Taking longer than estimated · ${formatWait(elapsed)} elapsed`
      : `About ${formatWait(expectedSeconds - elapsed)} remaining`,
  };
}