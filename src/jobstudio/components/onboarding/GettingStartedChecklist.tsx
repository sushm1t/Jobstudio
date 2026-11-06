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
  return (
    <aside className="onboarding-checklist no-print" aria-label="Getting started">
      <div className="onboarding-checklist-head">
        <strong>Getting started</strong>
        <span>{done} of {items.length}</span>
        <Button variant="ghost" size="icon" aria-label="Dismiss checklist" onClick={onDismiss}><X /></Button>
      </div>
      <div className="onboarding-progress"><span style={{ width: `${(done / items.length) * 100}%` }} /></div>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <button type="button" className={item.done ? 'is-done' : ''} onClick={() => onOpen(item.tab)}>
              {item.done ? <CheckCircle2 aria-hidden /> : <Circle aria-hidden />}
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
