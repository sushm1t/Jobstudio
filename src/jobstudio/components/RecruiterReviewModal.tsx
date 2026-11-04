// @ts-nocheck -- ported verbatim from the original project
import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lock,
  UserCheck,
  Briefcase,
  Cpu,
  ChevronRight,
  TrendingUp,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

export interface RecruiterPanelData {
  overall_score: number;
  consensus_verdict: 'STRONG_HIRE' | 'HIRE' | 'NEEDS_IMPROVEMENT' | 'PASS';
  executive_summary: string;
  panel: {
    recruiter: {
      role: string;
      score: number;
      scan_time_verdict: string;
      feedback: string;
      top_strength: string;
      critical_flag: string;
    };
    hiring_manager: {
      role: string;
      score: number;
      business_impact_score: string;
      feedback: string;
      leadership_assessment: string;
      major_concern: string;
    };
    technical_lead: {
      role: string;
      score: number;
      execution_confidence: string;
      feedback: string;
      tooling_depth: string;
      gap_to_fill: string;
    };
  };
  top_strengths: string[];
  top_fixes: string[];
}

interface RecruiterReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewData: RecruiterPanelData | null;
  isLoading: boolean;
  onRunReview: () => void;
  jobTitle: string;
  companyName: string;
  isProUser: boolean;
  onNavigateToPricing: () => void;
}

export const RecruiterReviewModal: React.FC<RecruiterReviewModalProps> = ({
  isOpen,
  onClose,
  reviewData,
  isLoading,
  onRunReview,
  jobTitle,
  companyName,
  isProUser,
  onNavigateToPricing,
}) => {
  const [activePersona, setActivePersona] = useState<'recruiter' | 'hiring_manager' | 'technical_lead'>(
    'recruiter'
  );

  if (!isOpen) return null;

  const getVerdictBadge = (verdict?: string) => {
    switch (verdict) {
      case 'STRONG_HIRE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-bold border border-success/30">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            STRONG HIRE • CONSENSUS PASS
          </span>
        );
      case 'HIRE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold border border-brand/25">
            <span className="w-2 h-2 rounded-full bg-brand" />
            HIRE • ADVANCE TO PANEL
          </span>
        );
      case 'NEEDS_IMPROVEMENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning/10 text-warning text-xs font-bold border border-warning/25">
            <span className="w-2 h-2 rounded-full bg-warning" />
            POLISH RECOMMENDED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface text-muted-foreground text-xs font-bold">
            SCREENING CALL
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-overlay/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-card rounded-2xl shadow-2xl border border-border my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-gradient-to-r from-surface via-white to-surface/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground">Recruiter-Panel Multi-Persona Review</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-info/10 text-info border border-info/25 uppercase tracking-wider">
                  3-Persona Sim
                </span>
              </div>
              <p className="text-xs text-subtle mt-0.5">
                Evaluation for <strong className="text-muted-foreground">{jobTitle || 'Target Role'}</strong> at{' '}
                <strong className="text-muted-foreground">{companyName || 'Target Employer'}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-subtle hover:text-muted-foreground rounded-lg hover:bg-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {isLoading ? (
            <div className="py-16 text-center space-y-4">
              <RefreshCw className="w-10 h-10 text-brand animate-spin mx-auto" />
              <div>
                <h4 className="text-base font-semibold text-foreground">
                  Convening 3-Person Hiring Committee...
                </h4>
                <p className="text-xs text-subtle max-w-md mx-auto mt-1">
                  Evaluating 6-second recruiter ATS scan, hiring manager business ROI, and peer technical depth against the job description.
                </p>
              </div>
            </div>
          ) : !reviewData ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-brand/10 border border-brand/25 flex items-center justify-center mx-auto text-brand">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto">
                <h4 className="text-base font-semibold text-foreground">Run Recruiter Panel Simulation</h4>
                <p className="text-xs text-subtle mt-1">
                  Simulate how your resume performs across a 3-person panel before applying: Senior Recruiter (ATS & format scan), Hiring Manager (business impact), and Technical Peer.
                </p>
              </div>
              <button
                onClick={onRunReview}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Start Hiring Panel Review
              </button>
            </div>
          ) : (
            <>
              {/* Top Consensus Score Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-surface to-surface text-primary-foreground shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand/20 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getVerdictBadge(reviewData.consensus_verdict)}
                      <span className="text-xs text-subtle font-mono">
                        Consensus Score: {reviewData.overall_score}/100
                      </span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed max-w-xl">
                      {reviewData.executive_summary}
                    </p>
                  </div>

                  {/* Circular Score Gauge */}
                  <div className="flex items-center gap-3 bg-card/10 backdrop-blur-md px-4 py-3 rounded-xl border border-border/10 shrink-0 self-start sm:self-auto">
                    <div className="text-center">
                      <div className="text-3xl font-extrabold text-primary-foreground font-mono">
                        {reviewData.overall_score}
                      </div>
                      <div className="text-[10px] text-subtle uppercase tracking-wider font-semibold">
                        Panel Score
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Free vs Pro Badge / Banner if Free user */}
              {!isProUser && (
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-surface via-indigo-50 to-surface border border-info/25 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-info shrink-0" />
                    <p className="text-xs text-info font-medium">
                      <strong>Free Plan:</strong> Viewing overall score and top 2 panel findings. Unlock the full 3-persona line-by-line feedback with Pro.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToPricing();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-info hover:bg-info text-primary-foreground text-xs font-semibold shrink-0 transition-colors shadow-sm flex items-center gap-1"
                  >
                    Upgrade ($9.99/mo)
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Persona Selector Tabs */}
              <div className="space-y-4">
                <div className="flex border-b border-border gap-2">
                  <button
                    onClick={() => setActivePersona('recruiter')}
                    className={`pb-2.5 px-3 text-xs font-bold transition-all relative flex items-center gap-2 ${
                      activePersona === 'recruiter'
                        ? 'text-brand border-b-2 border-brand'
                        : 'text-subtle hover:text-foreground'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Senior Recruiter (Score {reviewData.panel.recruiter.score})
                  </button>

                  <button
                    onClick={() => setActivePersona('hiring_manager')}
                    className={`pb-2.5 px-3 text-xs font-bold transition-all relative flex items-center gap-2 ${
                      activePersona === 'hiring_manager'
                        ? 'text-brand border-b-2 border-brand'
                        : 'text-subtle hover:text-foreground'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    Hiring Manager (Score {reviewData.panel.hiring_manager.score})
                    {!isProUser && <Lock className="w-3 h-3 text-warning" />}
                  </button>

                  <button
                    onClick={() => setActivePersona('technical_lead')}
                    className={`pb-2.5 px-3 text-xs font-bold transition-all relative flex items-center gap-2 ${
                      activePersona === 'technical_lead'
                        ? 'text-brand border-b-2 border-brand'
                        : 'text-subtle hover:text-foreground'
                    }`}
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    Technical Peer (Score {reviewData.panel.technical_lead.score})
                    {!isProUser && <Lock className="w-3 h-3 text-warning" />}
                  </button>
                </div>

                {/* Active Persona Details */}
                {activePersona === 'recruiter' && (
                  <div className="p-4 rounded-xl border border-border bg-surface/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand" />
                        <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          {reviewData.panel.recruiter.role}
                        </h5>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand/10 text-brand">
                        {reviewData.panel.recruiter.scan_time_verdict}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {reviewData.panel.recruiter.feedback}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-success/10 border border-success/30">
                        <span className="font-bold text-success block text-[11px] mb-0.5">
                          Standout Positive:
                        </span>
                        <span className="text-success">{reviewData.panel.recruiter.top_strength}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-warning/10 border border-warning/25">
                        <span className="font-bold text-warning block text-[11px] mb-0.5">
                          Recruiter Polish Flag:
                        </span>
                        <span className="text-warning">{reviewData.panel.recruiter.critical_flag}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activePersona === 'hiring_manager' && (
                  <div className="relative">
                    {!isProUser ? (
                      <div className="p-6 rounded-xl border border-dashed border-info/25 bg-info/10/40 text-center space-y-3">
                        <div className="w-10 h-10 rounded-full bg-info/10 text-info flex items-center justify-center mx-auto">
                          <Lock className="w-5 h-5" />
                        </div>
                        <h5 className="text-sm font-bold text-foreground">
                          Hiring Manager Evaluation Locked
                        </h5>
                        <p className="text-xs text-muted-foreground max-w-md mx-auto">
                          Upgrade to Pro to review the Department Director's business ROI score, leadership assessment, and exact questions they will probe during the interview.
                        </p>
                        <button
                          onClick={() => {
                            onClose();
                            onNavigateToPricing();
                          }}
                          className="px-4 py-2 rounded-xl bg-info text-primary-foreground text-xs font-semibold hover:bg-info transition-colors"
                        >
                          Unlock on Pro ($9.99/mo)
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border border-border bg-surface/50 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-success" />
                            <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                              {reviewData.panel.hiring_manager.role}
                            </h5>
                          </div>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-success/10 text-success">
                            Business Impact: {reviewData.panel.hiring_manager.business_impact_score}
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {reviewData.panel.hiring_manager.feedback}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                          <div className="p-2.5 rounded-lg bg-brand/10 border border-brand/25">
                            <span className="font-bold text-brand block text-[11px] mb-0.5">
                              Leadership Assessment:
                            </span>
                            <span className="text-brand">
                              {reviewData.panel.hiring_manager.leadership_assessment}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-warning/10 border border-warning/25">
                            <span className="font-bold text-warning block text-[11px] mb-0.5">
                              Interview Focus Probe:
                            </span>
                            <span className="text-warning">
                              {reviewData.panel.hiring_manager.major_concern}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activePersona === 'technical_lead' && (
                  <div className="relative">
                    {!isProUser ? (
                      <div className="p-6 rounded-xl border border-dashed border-info/25 bg-info/10/40 text-center space-y-3">
                        <div className="w-10 h-10 rounded-full bg-info/10 text-info flex items-center justify-center mx-auto">
                          <Lock className="w-5 h-5" />
                        </div>
                        <h5 className="text-sm font-bold text-foreground">Technical Peer Evaluation Locked</h5>
                        <p className="text-xs text-muted-foreground max-w-md mx-auto">
                          Upgrade to Pro to review the Technical Lead's evaluation of tooling depth, architecture rigor, and execution confidence.
                        </p>
                        <button
                          onClick={() => {
                            onClose();
                            onNavigateToPricing();
                          }}
                          className="px-4 py-2 rounded-xl bg-info text-primary-foreground text-xs font-semibold hover:bg-info transition-colors"
                        >
                          Unlock on Pro ($9.99/mo)
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border border-border bg-surface/50 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-brand" />
                            <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                              {reviewData.panel.technical_lead.role}
                            </h5>
                          </div>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand/10 text-brand">
                            Execution Confidence: {reviewData.panel.technical_lead.execution_confidence}
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {reviewData.panel.technical_lead.feedback}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                          <div className="p-2.5 rounded-lg bg-success/10 border border-success/30">
                            <span className="font-bold text-success block text-[11px] mb-0.5">
                              Tooling Depth:
                            </span>
                            <span className="text-success">
                              {reviewData.panel.technical_lead.tooling_depth}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-info/10 border border-info/25">
                            <span className="font-bold text-info block text-[11px] mb-0.5">
                              Recommended Technical Highlight:
                            </span>
                            <span className="text-info">
                              {reviewData.panel.technical_lead.gap_to_fill}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Key Strengths & Polish Fixes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-success/30 bg-success/10/40 space-y-2.5">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-success flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    Top Panel Strengths
                  </h5>
                  <ul className="space-y-2">
                    {reviewData.top_strengths.slice(0, isProUser ? 3 : 2).map((s, i) => (
                      <li key={i} className="text-xs text-success flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-brand/25 bg-brand/10/40 space-y-2.5">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-brand flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-brand" />
                    Top Priority Polish Fixes
                  </h5>
                  <ul className="space-y-2">
                    {reviewData.top_fixes.slice(0, isProUser ? 3 : 2).map((f, i) => (
                      <li key={i} className="text-xs text-brand flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand mt-1.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-border bg-surface flex items-center justify-between">
          <div className="text-xs text-subtle flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-success" />
            <span>Strict privacy: Resume text is processed confidentially</span>
          </div>
          <div className="flex items-center gap-2">
            {reviewData && (
              <button
                onClick={onRunReview}
                disabled={isLoading}
                className="px-3.5 py-2 text-xs font-medium text-muted-foreground bg-card border border-border rounded-xl hover:bg-surface transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                Re-evaluate
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-primary-foreground bg-foreground rounded-xl hover:bg-foreground/90 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

