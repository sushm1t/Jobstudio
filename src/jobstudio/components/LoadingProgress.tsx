import { useEffect, useRef, useState } from 'react';
import { useEstimatedProgress } from '../utils/useEstimatedProgress';

/** Result identity changes only on success; ending a failed request never shows 100%. */
export function LoadingProgress({ active, label, expectedSeconds = 40, resultToken, inline = false, idleLabel }: {
  active: boolean; label: string; expectedSeconds?: number; resultToken?: unknown; inline?: boolean; idleLabel?: string;
}) {
  const { progress, etaLabel } = useEstimatedProgress(active, expectedSeconds);
  const started = useRef(false);
  const initialResult = useRef(resultToken);
  const [completed, setCompleted] = useState(false);
  useEffect(() => {
    if (active) {
      if (!started.current) initialResult.current = resultToken;
      started.current = true;
      setCompleted(false);
      return;
    }
    if (!started.current) return;
    started.current = false;
    if (resultToken === undefined || Object.is(initialResult.current, resultToken)) return;
    setCompleted(true);
    const timer = setTimeout(() => setCompleted(false), 1500);
    return () => clearTimeout(timer);
  }, [active, resultToken]);
  if (!active && !completed) return idleLabel ? <span>{idleLabel}</span> : null;
  const value = active ? progress : 100;
  if (inline) return <span className="inline-flex min-w-0 flex-wrap items-center justify-center gap-x-2 gap-y-1 tabular-nums" aria-label={`${label} progress`} title={active ? `${etaLabel} · Estimated timing may vary` : 'Complete'}>
    <span role="status">{active ? `${label}… ${value}%` : 'Complete · 100%'}</span>
    {active && <span className="text-xs font-normal opacity-80">{etaLabel}</span>}
    <progress className="sr-only" value={value} max={100} aria-label={label} aria-valuenow={value} aria-valuetext={`${active ? 'Estimated ' : ''}${value}%`} />
  </span>;
  return <div className="space-y-2 py-3 text-sm text-foreground no-print" aria-label={`${label} progress`}>
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
      <span className="font-medium">{label}{active ? '…' : ' complete'}</span>
      <span className="shrink-0 tabular-nums font-semibold">{active ? 'Estimated ' : ''}{value}%</span>
    </div>
    <progress value={value} max={100} aria-label={label} aria-valuenow={value} aria-valuetext={`${active ? 'Estimated ' : ''}${value}%`} className="block h-1.5 w-full overflow-hidden rounded-full border-0 bg-primary/20 accent-primary [&::-webkit-progress-bar]:bg-primary/20 [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary" />
    <p role="status" className="text-xs text-muted-foreground">{active ? `${etaLabel} · Timing may vary` : 'Complete · 100%'}</p>
  </div>;
}