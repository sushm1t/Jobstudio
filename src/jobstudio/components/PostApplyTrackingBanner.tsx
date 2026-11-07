import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

export interface PostApplyTrackingBannerProps {
  isOpen: boolean;
  jobTitle: string;
  companyName: string;
  isTracked: boolean;
  onTrackAndSave: () => void;
  onDismiss: () => void;
}

export const PostApplyTrackingBanner: React.FC<PostApplyTrackingBannerProps> = ({
  isOpen,
  jobTitle,
  companyName,
  isTracked,
  onTrackAndSave,
  onDismiss,
}) => {
  if (!isOpen) return null;

  return (
    <aside
      role="status"
      aria-live="polite"
      aria-label="Post-application tracking prompt"
      data-testid="post-apply-tracking-banner"
      className="fixed bottom-5 right-5 z-50 max-w-sm sm:max-w-md w-[calc(100%-2.5rem)] bg-card border border-border shadow-2xl rounded-2xl p-4 sm:p-4.5 animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-auto"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-brand/10 border border-brand/20 shrink-0 mt-0.5">
          <CheckCircle2 className="w-5 h-5 text-brand animate-pulse" />
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold text-foreground leading-snug">
              Applying to <span className="font-bold">{jobTitle}</span>
              {companyName ? <> at <span className="font-bold">{companyName}</span></> : null}?
            </h4>
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss application tracking prompt"
              className="text-muted-foreground hover:text-foreground -mr-1 -mt-1 p-1 rounded-lg hover:bg-surface-2 transition-colors cursor-pointer text-sm font-semibold leading-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Track this application in your pipeline and snapshot your tailored resume version.
          </p>

          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={onTrackAndSave}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer shadow-xs ${
                isTracked
                  ? 'bg-success/15 text-success border border-success/30 hover:bg-success/20'
                  : 'bg-primary hover:bg-primary/90 text-primary-foreground'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isTracked ? 'Tracked as Applied' : 'Track Application & Save Resume'}</span>
            </button>

            <button
              type="button"
              onClick={onDismiss}
              className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

