import { CheckCircle2, Circle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ChecklistItem {
  id: string;
  label: string;
  tab: string;
  done: boolean;
}

interface Props {
  items: ChecklistItem[];
  onOpen: (tab: string) => void;
  onDismiss: () => void;
}

export function GettingStartedChecklist({ items, onOpen, onDismiss }: Props) {
  const done = items.filter((i) => i.done).length;
  const percent = Math.round((done / items.length) * 100);

  return (
    <aside className="onboarding-checklist no-print shadow-elevated" aria-label="Getting started">
      <div className="onboarding-checklist-head">
        <div className="flex items-center gap-1.5 min-w-0">
          <strong className="truncate">Getting started</strong>
        </div>
        <span className="font-mono text-[11px] font-semibold text-brand shrink-0">{done} of {items.length}</span>
        <Button variant="ghost" size="icon" aria-label="Dismiss checklist" onClick={onDismiss}><X className="w-3.5 h-3.5" /></Button>
      </div>

      <div className="onboarding-progress" role="progressbar" aria-valuenow={done} aria-valuemin={0} aria-valuemax={items.length} aria-label={`${done} of ${items.length} completed`}>
        <span style={{ width: `${percent}%` }} />
      </div>

      <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono mb-2 px-0.5">
        <span>{done} of {items.length} completed</span>
        <span>{percent}%</span>
      </div>

      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <button type="button" className={item.done ? 'is-done' : ''} onClick={() => onOpen(item.tab)}>
              {item.done ? <CheckCircle2 className="w-4 h-4 text-success shrink-0" aria-hidden /> : <Circle className="w-4 h-4 text-subtle shrink-0" aria-hidden />}
              <span className="truncate">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
