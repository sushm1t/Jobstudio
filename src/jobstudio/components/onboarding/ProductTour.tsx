import { useEffect } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TOUR_STEPS } from './tourSteps';

interface Props {
  step: number;
  onStep: (step: number) => void;
  onClose: (completed: boolean) => void;
}

const HIGHLIGHT = 'tour-highlight';

export function ProductTour({ step, onStep, onClose }: Props) {
  const isFinal = step >= TOUR_STEPS.length;
  const current = TOUR_STEPS[step];

  useEffect(() => {
    if (!current) return;
    const timer = window.setTimeout(() => {
      let targetNode: HTMLElement | null = null;
      if (current.target) {
        targetNode = document.querySelector(`[data-tour="${current.target}"]`) as HTMLElement | null;
        if (!targetNode && current.target === 'evaluator-tailor') {
          targetNode = document.querySelector('[data-tour="evaluator-search"]') as HTMLElement | null;
        }
      }
      const nodes = [
        document.querySelector(`[data-tour="nav-${current.tab}"]`),
        targetNode,
      ].filter(Boolean) as HTMLElement[];
      nodes.forEach((n) => n.classList.add(HIGHLIGHT));
      nodes[1]?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 150);
    return () => {
      window.clearTimeout(timer);
      document.querySelectorAll(`.${HIGHLIGHT}`).forEach((n) => n.classList.remove(HIGHLIGHT));
    };
  }, [current]);

  return (
    <div className="tour-card no-print" role="dialog" aria-label="Product tour">
      <div className="tour-card-head">
        <span>{isFinal ? 'All done' : `Step ${step + 1} of ${TOUR_STEPS.length}`}</span>
        <Button variant="ghost" size="icon" aria-label="Skip tour" onClick={() => onClose(false)}><X /></Button>
      </div>
      {isFinal || !current ? (
        <>
          <h2>You're set</h2>
          <p>Start by saving your Master Profile. You can replay this tour any time from the sidebar.</p>
          <div className="tour-card-actions">
            <Button variant="ghost" onClick={() => onStep(step - 1)}><ArrowLeft />Back</Button>
            <Button onClick={() => onClose(true)}>Build my profile <ArrowRight /></Button>
          </div>
        </>
      ) : (
        <>
          <h2>{current.title}</h2>
          <p>{current.what}</p>
          <p><strong>Where to click:</strong> {current.where}</p>
          <p className="tour-tip">Tip: {current.tip}</p>
          <div className="tour-card-actions">
            {step > 0 ? <Button variant="ghost" onClick={() => onStep(step - 1)}><ArrowLeft />Back</Button> : <Button variant="ghost" onClick={() => onClose(false)}>Skip tour</Button>}
            <Button onClick={() => onStep(step + 1)}>Next <ArrowRight /></Button>
          </div>
        </>
      )}
    </div>
  );
}
