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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            STRONG HIRE • CONSENSUS PASS
          </span>
        );
      case 'HIRE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            HIRE • ADVANCE TO PANEL
          </span>
        );
      case 'NEEDS_IMPROVEMENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            POLISH RECOMMENDED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            SCREENING CALL
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-blue-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0071E3]/10 border border-[#0071E3]/20 flex items-center justify-center text-[#0071E3]">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">Recruiter-Panel Multi-Persona Review</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-purple-100 text-purple-700 border border-purple-200 uppercase tracking-wider">
                  3-Persona Sim
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluation for <strong className="text-slate-700">{jobTitle || 'Target Role'}</strong> at{' '}
                <strong className="text-slate-700">{companyName || 'Target Employer'}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {isLoading ? (
            <div className="py-16 text-center space-y-4">
              <RefreshCw className="w-10 h-10 text-[#0071E3] animate-spin mx-auto" />
              <div>
                <h4 className="text-base font-semibold text-slate-900">
                  Convening 3-Person Hiring Committee...
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Evaluating 6-second recruiter ATS scan, hiring manager business ROI, and peer technical depth against the job description.
                </p>
              </div>
            </div>
          ) : !reviewData ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-[#0071E3]">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto">
                <h4 className="text-base font-semibold text-slate-900">Run Recruiter Panel Simulation</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Simulate how your resume performs across a 3-person panel before applying: Senior Recruiter (ATS & format scan), Hiring Manager (business impact), and Technical Peer.
                </p>
              </div>
              <button
                onClick={onRunReview}
                className="px-5 py-2.5 rounded-xl bg-[#0071E3] text-white font-medium text-sm hover:bg-[#0077ED] transition-colors shadow-sm inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Start Hiring Panel Review
              </button>
            </div>
          ) : (
            <>
              {/* Top Consensus Score Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#0071E3]/20 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getVerdictBadge(reviewData.consensus_verdict)}
                      <span className="text-xs text-slate-300 font-mono">
                        Consensus Score: {reviewData.overall_score}/100
                      </span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed max-w-xl">
                      {reviewData.executive_summary}
                    </p>
                  </div>

                  {/* Circular Score Gauge */}
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 shrink-0 self-start sm:self-auto">
                    <div className="text-center">
                      <div className="text-3xl font-extrabold text-white font-mono">
                        {reviewData.overall_score}
                      </div>
                      <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
                        Panel Score
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Free vs Pro Badge / Banner if Free user */}
              {!isProUser && (
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                    <p className="text-xs text-purple-950 font-medium">
                      <strong>Free Plan:</strong> Viewing overall score and top 2 panel findings. Unlock the full 3-persona line-by-line feedback with Pro.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToPricing();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shrink-0 transition-colors shadow-sm flex items-center gap-1"
                  >
                    Upgrade ($9.99/mo)
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Persona Selector Tabs */}
              <div className="space-y-4">
                <div className="flex border-b border-slate-200 gap-2">
                  <button
                    onClick={() => setActivePersona('recruiter')}
                    className={`pb-2.5 px-3 text-xs font-bold transition-all relative flex items-center gap-2 ${
                      activePersona === 'recruiter'
                        ? 'text-[#0071E3] border-b-2 border-[#0071E3]'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Senior Recruiter (Score {reviewData.panel.recruiter.score})
                  </button>

                  <button
                    onClick={() => setActivePersona('hiring_manager')}
                    className={`pb-2.5 px-3 text-xs font-bold transition-all relative flex items-center gap-2 ${
                      activePersona === 'hiring_manager'
                        ? 'text-[#0071E3] border-b-2 border-[#0071E3]'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    Hiring Manager (Score {reviewData.panel.hiring_manager.score})
                    {!isProUser && <Lock className="w-3 h-3 text-amber-500" />}
                  </button>

                  <button
                    onClick={() => setActivePersona('technical_lead')}
                    className={`pb-2.5 px-3 text-xs font-bold transition-all relative flex items-center gap-2 ${
                      activePersona === 'technical_lead'
                        ? 'text-[#0071E3] border-b-2 border-[#0071E3]'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    Technical Peer (Score {reviewData.panel.technical_lead.score})
                    {!isProUser && <Lock className="w-3 h-3 text-amber-500" />}
                  </button>
                </div>

                {/* Active Persona Details */}
                {activePersona === 'recruiter' && (
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          {reviewData.panel.recruiter.role}
                        </h5>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {reviewData.panel.recruiter.scan_time_verdict}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {reviewData.panel.recruiter.feedback}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
                        <span className="font-bold text-emerald-800 block text-[11px] mb-0.5">
                          Standout Positive:
                        </span>
                        <span className="text-emerald-900">{reviewData.panel.recruiter.top_strength}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-100">
                        <span className="font-bold text-amber-800 block text-[11px] mb-0.5">
                          Recruiter Polish Flag:
                        </span>
                        <span className="text-amber-900">{reviewData.panel.recruiter.critical_flag}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activePersona === 'hiring_manager' && (
                  <div className="relative">
                    {!isProUser ? (
                      <div className="p-6 rounded-xl border border-dashed border-purple-200 bg-purple-50/40 text-center space-y-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
                          <Lock className="w-5 h-5" />
                        </div>
                        <h5 className="text-sm font-bold text-slate-900">
                          Hiring Manager Evaluation Locked
                        </h5>
                        <p className="text-xs text-slate-600 max-w-md mx-auto">
                          Upgrade to Pro to review the Department Director's business ROI score, leadership assessment, and exact questions they will probe during the interview.
                        </p>
                        <button
                          onClick={() => {
                            onClose();
                            onNavigateToPricing();
                          }}
                          className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition-colors"
                        >
                          Unlock on Pro ($9.99/mo)
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                              {reviewData.panel.hiring_manager.role}
                            </h5>
                          </div>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            Business Impact: {reviewData.panel.hiring_manager.business_impact_score}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {reviewData.panel.hiring_manager.feedback}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                          <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100">
                            <span className="font-bold text-blue-800 block text-[11px] mb-0.5">
                              Leadership Assessment:
                            </span>
                            <span className="text-blue-900">
                              {reviewData.panel.hiring_manager.leadership_assessment}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-100">
                            <span className="font-bold text-amber-800 block text-[11px] mb-0.5">
                              Interview Focus Probe:
                            </span>
                            <span className="text-amber-900">
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
                      <div className="p-6 rounded-xl border border-dashed border-purple-200 bg-purple-50/40 text-center space-y-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
                          <Lock className="w-5 h-5" />
                        </div>
                        <h5 className="text-sm font-bold text-slate-900">Technical Peer Evaluation Locked</h5>
                        <p className="text-xs text-slate-600 max-w-md mx-auto">
                          Upgrade to Pro to review the Technical Lead's evaluation of tooling depth, architecture rigor, and execution confidence.
                        </p>
                        <button
                          onClick={() => {
                            onClose();
                            onNavigateToPricing();
                          }}
                          className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition-colors"
                        >
                          Unlock on Pro ($9.99/mo)
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500" />
                            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                              {reviewData.panel.technical_lead.role}
                            </h5>
                          </div>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                            Execution Confidence: {reviewData.panel.technical_lead.execution_confidence}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {reviewData.panel.technical_lead.feedback}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
                            <span className="font-bold text-emerald-800 block text-[11px] mb-0.5">
                              Tooling Depth:
                            </span>
                            <span className="text-emerald-900">
                              {reviewData.panel.technical_lead.tooling_depth}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-100">
                            <span className="font-bold text-purple-800 block text-[11px] mb-0.5">
                              Recommended Technical Highlight:
                            </span>
                            <span className="text-purple-900">
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
                <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 space-y-2.5">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Top Panel Strengths
                  </h5>
                  <ul className="space-y-2">
                    {reviewData.top_strengths.slice(0, isProUser ? 3 : 2).map((s, i) => (
                      <li key={i} className="text-xs text-emerald-950 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/40 space-y-2.5">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    Top Priority Polish Fixes
                  </h5>
                  <ul className="space-y-2">
                    {reviewData.top_fixes.slice(0, isProUser ? 3 : 2).map((f, i) => (
                      <li key={i} className="text-xs text-blue-950 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
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
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Strict privacy: Resume text is processed confidentially</span>
          </div>
          <div className="flex items-center gap-2">
            {reviewData && (
              <button
                onClick={onRunReview}
                disabled={isLoading}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                Re-evaluate
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

