import { useEffect, useRef, useState } from 'react';

/** Typical tailoring time used for the estimate (seconds). */
export const EXPECTED_TAILOR_SECONDS = 40;

/**
 * Estimated progress (0–100) while `active` is true. Climbs on a time curve and
 * holds at 95 until the work finishes, then shows 100 briefly.
 */
export function tailorProgressAt(elapsedSec: number): number {
  const p = 95 * (1 - Math.exp(-elapsedSec / (EXPECTED_TAILOR_SECONDS / 2.5)));
  return Math.min(95, Math.floor(p));
}

export function useTailorProgress(active: boolean) {
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      if (startRef.current !== null) {
        setProgress(100);
        startRef.current = null;
        const t = setTimeout(() => setProgress(0), 800);
        return () => clearTimeout(t);
      }
      return;
    }
    startRef.current = Date.now();
    setProgress(0);
    setElapsed(0);
    const id = setInterval(() => {
      const sec = (Date.now() - (startRef.current ?? Date.now())) / 1000;
      setElapsed(sec);
      setProgress(tailorProgressAt(sec));
    }, 250);
    return () => clearInterval(id);
  }, [active]);

  const remaining = Math.max(0, Math.ceil(EXPECTED_TAILOR_SECONDS - elapsed));
  const etaLabel = progress >= 95 ? 'Almost done…' : remaining > 0 ? `~${remaining}s left` : 'Finishing up…';
  return { progress, etaLabel };
}
