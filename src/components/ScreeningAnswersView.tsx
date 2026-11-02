import React, { useState } from 'react';
import {
  Copy,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  User,
  Sparkles,
  Globe,
  ChevronDown,
  ChevronUp,
  Loader2,
  Check,
} from 'lucide-react';
import { ScreeningAnswer, CandidateInfo, InterviewPrepQuestion } from '../data/defaultData';

interface ScreeningAnswersViewProps {
  screeningAnswers: ScreeningAnswer[];
  candidateInfo: CandidateInfo;
  applyUrl?: string;
  companyName: string;
  jobTitle: string;
  interviewQuestions?: InterviewPrepQuestion[];
  onFetchInterviewPrep?: () => void;
  isFetchingInterviewPrep?: boolean;
}

export const ScreeningAnswersView: React.FC<ScreeningAnswersViewProps> = ({
  screeningAnswers,
  candidateInfo,
  applyUrl,
  companyName,
  jobTitle,
  interviewQuestions = [],
  onFetchInterviewPrep,
  isFetchingInterviewPrep = false,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [copiedInterviewIndex, setCopiedInterviewIndex] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<'all' | 'portal' | 'technical' | 'behavioral'>('all');

  const copyAnswer = (index: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyField = (field: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const toggleAnswer = (idx: number) => {
    setRevealedAnswers((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const copyInterviewAnswer = (idx: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedInterviewIndex(idx);
    setTimeout(() => setCopiedInterviewIndex(null), 2000);
  };

  const portalCount = interviewQuestions.filter((q) => q.isFromPortal || q.category === 'Portal Reported').length;
  const filteredQuestions = interviewQuestions.filter((q) => {
    if (filterCategory === 'portal') return q.isFromPortal || q.category === 'Portal Reported';
    if (filterCategory === 'technical') return q.category.toLowerCase().includes('technical') || q.category.toLowerCase().includes('operational');
    if (filterCategory === 'behavioral') return q.category.toLowerCase().includes('behavioral') || q.category.toLowerCase().includes('star') || q.category.toLowerCase().includes('situational');
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner with Direct Application Link */}
      <div
        className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[rgba(120,120,128,0.12)] text-[#6E6E73] text-[11px] font-semibold rounded-md px-2 py-0.5 uppercase tracking-wider">APPLICATION PORTAL</span>
            <h2 className="font-display text-base sm:text-lg font-semibold text-[#1D1D1F]" style={{ letterSpacing: '-0.025em' }}>
              ATS Form Pre-fills & Interview Intelligence
            </h2>
          </div>
          <p className="text-xs text-[#6E6E73] mt-1">
            1-click ATS application answers and portal-verified interview preparation for {companyName || 'your target opportunity'}.
          </p>
        </div>

        {applyUrl && (
          <a
            href={applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-full transition-colors cursor-pointer whitespace-nowrap self-stretch sm:self-auto justify-center"
          >
            <span>Open {companyName} Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-white/80" />
          </a>
        )}
      </div>

      {/* Quick-Copy Applicant Details Grid */}
      <div
        className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] p-6 space-y-4"
        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
      >
        <div className="flex items-center gap-2">
          <span className="bg-[rgba(120,120,128,0.12)] text-[#6E6E73] text-[11px] font-semibold rounded-md px-2 py-0.5 uppercase tracking-wider">DOSSIER</span>
          <h3 className="font-display font-semibold text-sm sm:text-base text-[#1D1D1F]" style={{ letterSpacing: '-0.025em' }}>
            Quick-Copy Applicant Details
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Full Name', val: `${candidateInfo.first_name} ${candidateInfo.last_name}` },
            { label: 'Email', val: candidateInfo.email },
            { label: 'Phone', val: candidateInfo.phone },
            { label: 'Location', val: candidateInfo.location },
            { label: 'LinkedIn', val: candidateInfo.linkedin },
            { label: 'Current Role', val: 'Real-Time Analyst / SME at Revolut' },
            { label: 'Total Experience', val: '6 Years (Fintech & B2B Ops)' },
            { label: 'Notice Period', val: 'Standard / Immediate Available' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#F5F5F7] border border-[rgba(0,0,0,0.04)] hover:border-[#D2D2D7] transition-colors flex flex-col justify-between"
            >
              <div className="text-[11px] font-medium text-[#86868B]">{item.label}</div>
              <div className="text-xs font-semibold text-[#1D1D1F] mt-1 truncate" title={item.val}>
                {item.val}
              </div>
              <button
                onClick={() => copyField(item.label, item.val)}
                className="mt-2 text-[11px] inline-flex items-center gap-1 text-[#0071E3] hover:text-[#0077ED] font-semibold cursor-pointer"
              >
                {copiedField === item.label ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-[#34C759]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Screening Questions & Pre-fills */}
      <div className="space-y-3.5">
        <div className="flex items-center gap-2">
          <span className="bg-[rgba(120,120,128,0.12)] text-[#6E6E73] text-[11px] font-semibold rounded-md px-2 py-0.5 uppercase tracking-wider">FORM RESPONSES</span>
          <h3 className="font-display font-semibold text-sm sm:text-base text-[#1D1D1F]" style={{ letterSpacing: '-0.025em' }}>
            Application Screening Form Answers
          </h3>
        </div>

        {screeningAnswers.length > 0 ? (
          screeningAnswers.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] p-5 space-y-3"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#0071E3] text-white text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <h4 className="font-display text-sm sm:text-base font-semibold text-[#1D1D1F] leading-snug" style={{ letterSpacing: '-0.025em' }}>
                    {item.question}
                  </h4>
                </div>

                <button
                  onClick={() => copyAnswer(idx, item.suggested_answer)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1D1D1F] bg-[#F5F5F7] hover:bg-[#E8E8ED] rounded-full transition-colors cursor-pointer shrink-0"
                >
                  {copiedIndex === idx ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#34C759]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#6E6E73]" />
                      <span>Copy Answer</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs sm:text-sm text-[#1D1D1F] bg-[#F5F5F7] border border-[rgba(0,0,0,0.04)] rounded-xl p-4 leading-relaxed">
                {item.suggested_answer}
              </p>
            </div>
          ))
        ) : (
          <div
            className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] p-8 text-center space-y-2"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
          >
            <p className="text-xs sm:text-sm text-[#6E6E73]">
              Select an opportunity in Job Evaluator or evaluate a job description to generate tailored screening form responses.
            </p>
          </div>
        )}
      </div>

      {/* Interview Prep Intelligence Section */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D2D2D7] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[rgba(120,120,128,0.12)] text-[#6E6E73] text-[11px] font-semibold rounded-md px-2 py-0.5 uppercase tracking-wider">INTERVIEW PREP</span>
              <h3 className="font-display text-base sm:text-lg font-semibold text-[#1D1D1F]" style={{ letterSpacing: '-0.025em' }}>
                Role & Company Interview Intelligence
              </h3>
            </div>
            <p className="text-xs text-[#6E6E73] mt-1">
              Portal-reported questions from Glassdoor/AmbitionBox and tailored STAR responses for {jobTitle && companyName ? `${jobTitle} at ${companyName}` : 'your target opportunity'}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onFetchInterviewPrep && (
              <button
                onClick={onFetchInterviewPrep}
                disabled={isFetchingInterviewPrep}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#1D1D1F] hover:text-[#1D1D1F] bg-[#F5F5F7] hover:bg-[#E8E8ED] rounded-full transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                {isFetchingInterviewPrep ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0071E3]" />
                    <span>Searching Portals...</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-3.5 h-3.5 text-[#6E6E73]" />
                    <span>Search Portals / Refresh</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        {interviewQuestions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                filterCategory === 'all'
                  ? 'bg-[#0071E3] text-white font-semibold'
                  : 'bg-[#F5F5F7] text-[#6E6E73] hover:bg-[#E8E8ED]'
              }`}
            >
              All Questions ({interviewQuestions.length})
            </button>
            {portalCount > 0 && (
              <button
                onClick={() => setFilterCategory('portal')}
                className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer inline-flex items-center gap-1 ${
                  filterCategory === 'portal'
                    ? 'bg-[#0071E3] text-white font-semibold'
                    : 'bg-[#F5F5F7] text-[#6E6E73] hover:bg-[#E8E8ED]'
                }`}
              >
                <Globe className="w-3 h-3" />
                <span>Portal Reported ({portalCount})</span>
              </button>
            )}
            <button
              onClick={() => setFilterCategory('technical')}
              className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                filterCategory === 'technical'
                  ? 'bg-[#0071E3] text-white font-semibold'
                  : 'bg-[#F5F5F7] text-[#6E6E73] hover:bg-[#E8E8ED]'
              }`}
            >
              Technical & Operational
            </button>
            <button
              onClick={() => setFilterCategory('behavioral')}
              className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                filterCategory === 'behavioral'
                  ? 'bg-[#0071E3] text-white font-semibold'
                  : 'bg-[#F5F5F7] text-[#6E6E73] hover:bg-[#E8E8ED]'
              }`}
            >
              Behavioral & STAR
            </button>
          </div>
        )}

        {/* Question Cards List */}
        {filteredQuestions.length > 0 ? (
          <div className="space-y-4">
            {filteredQuestions.map((item, idx) => {
              const isRevealed = !!revealedAnswers[idx];
              const isPortal = item.isFromPortal || item.category === 'Portal Reported';

              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] p-5 sm:p-6 transition-all space-y-3.5"
                  style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
                >
                  {/* Card Top: Badges & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {isPortal ? (
                          <span className="bg-[rgba(120,120,128,0.12)] text-[#6E6E73] text-[11px] font-semibold rounded-md px-2 py-0.5 uppercase tracking-wider inline-flex items-center">
                            <Globe className="w-3 h-3 inline mr-1" />
                            <span>{item.source || 'Portal Reported Question'}</span>
                          </span>
                        ) : (
                          <span className="bg-[rgba(120,120,128,0.12)] text-[#6E6E73] text-[11px] font-semibold rounded-md px-2 py-0.5 uppercase tracking-wider inline-flex items-center">
                            <Sparkles className="w-3 h-3 inline mr-1 text-[#6E6E73]" />
                            <span>{item.category}</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-display text-base sm:text-lg font-semibold text-[#1D1D1F] leading-snug" style={{ letterSpacing: '-0.025em' }}>
                        {item.question}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-start">
                      <button
                        onClick={() => toggleAnswer(idx)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
                          isRevealed
                            ? 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED]'
                            : 'bg-[#0071E3] text-white hover:bg-[#0077ED]'
                        }`}
                      >
                        {isRevealed ? (
                          <>
                            <span>Hide Answer</span>
                            <ChevronUp className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            <span>Provide Answer</span>
                            <ChevronDown className="w-3.5 h-3.5 text-white/80" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Interviewer Intent / Why Asked */}
                  {item.why_asked && (
                    <div className="text-xs text-[#1D1D1F] bg-[#F5F5F7] border border-[rgba(0,0,0,0.04)] rounded-xl px-3.5 py-2.5 leading-relaxed">
                      <span className="font-semibold text-[#1D1D1F]">Interviewer Objective: </span>
                      {item.why_asked}
                    </div>
                  )}

                  {/* Collapsible Answer & Talking Points Container */}
                  {isRevealed && (
                    <div className="mt-3 pt-3 border-t border-[rgba(0,0,0,0.06)] space-y-3.5 animate-fadeIn">
                      {/* Key Talking Points */}
                      {item.key_talking_points && item.key_talking_points.length > 0 && (
                        <div className="bg-[#F5F5F7] border border-[rgba(0,0,0,0.04)] rounded-xl p-4 space-y-2">
                          <div className="bg-[rgba(120,120,128,0.12)] text-[#6E6E73] text-[10px] font-semibold rounded-md px-2 py-0.5 uppercase tracking-wider inline-block">
                            KEY POINTS TO EMPHASIZE
                          </div>
                          <ul className="space-y-1.5 pt-1">
                            {item.key_talking_points.map((tp, tpIdx) => (
                              <li
                                key={tpIdx}
                                className="text-xs text-[#1D1D1F] flex items-start gap-2 leading-relaxed"
                              >
                                <span className="text-[#0071E3] text-xs shrink-0 mt-0.5">•</span>
                                <span>{tp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Tailored STAR Model Answer */}
                      <div className="bg-[#F5F5F7] border border-[rgba(0,0,0,0.04)] rounded-xl p-4 sm:p-5 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-display text-xs font-semibold text-[#1D1D1F] uppercase tracking-wider">
                            Tailored Model Answer (STAR Method)
                          </span>
                          <button
                            onClick={() => copyInterviewAnswer(idx, item.suggested_answer)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0071E3] hover:text-[#0077ED] cursor-pointer"
                          >
                            {copiedInterviewIndex === idx ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-[#34C759]" />
                                <span>Copied Answer!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Answer</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="text-xs sm:text-sm text-[#1D1D1F] whitespace-pre-line leading-relaxed">
                          {item.suggested_answer}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] p-10 text-center space-y-4"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
          >
            <div className="w-14 h-14 rounded-full bg-[#F5F5F7] flex items-center justify-center mx-auto">
              <HelpCircle className="w-6 h-6 text-[#86868B]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-display text-xl font-semibold text-[#1D1D1F]" style={{ letterSpacing: '-0.025em' }}>
                No Interview Questions Loaded Yet
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6E73] max-w-md mx-auto leading-relaxed">
                Click &quot;Search Portals / Refresh&quot; to check Glassdoor and AmbitionBox for interview questions reported for {companyName || 'your target opportunity'}.
              </p>
            </div>
            {onFetchInterviewPrep && (
              <button
                onClick={onFetchInterviewPrep}
                disabled={isFetchingInterviewPrep}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-full transition-colors cursor-pointer disabled:opacity-50"
              >
                {isFetchingInterviewPrep ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white/80" />
                    <span>Searching Portals...</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-3.5 h-3.5 text-white/80" />
                    <span>Search Portals Now</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
