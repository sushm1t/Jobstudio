import { useEstimatedProgress, estimatedProgressAt } from './useEstimatedProgress';

/** Typical tailoring time used for the estimate (seconds). */
export const EXPECTED_TAILOR_SECONDS = 40;

/**
 * Estimated progress (0–100) while `active` is true. Climbs on a time curve and
 * holds at 95 until the work finishes. LoadingProgress shows successful completion.
 */
export function tailorProgressAt(elapsedSec: number): number {
  return estimatedProgressAt(elapsedSec, EXPECTED_TAILOR_SECONDS);
}

export function useTailorProgress(active: boolean) {
  return useEstimatedProgress(active, EXPECTED_TAILOR_SECONDS);
}
