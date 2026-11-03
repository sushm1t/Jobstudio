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
  Zap,
  Plus,
  Trash2,
  Lightbulb,
  Tag,
  AlertCircle,
  DollarSign,
  MessageSquare,
  Building2,
  Award,
  Send,
  Lock,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  PhoneCall,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { ScreeningAnswer, CandidateInfo, InterviewPrepQuestion } from '../data/defaultData';

interface ScreeningAnswersViewProps {
  screeningAnswers: ScreeningAnswer[];
  candidateInfo: CandidateInfo;
  applyUrl?: string;
  companyName: string;
  jobTitle: string;
  jobDescription?: string;
  masterProfileText?: string;
  interviewQuestions?: InterviewPrepQuestion[];
  onFetchInterviewPrep?: () => void;
  isFetchingInterviewPrep?: boolean;
  onTrackApplication?: () => void;
  isTracked?: boolean;
  onAddScreeningAnswer?: (newAnswer: ScreeningAnswer) => void;
  onRemoveScreeningAnswer?: (index: number) => void;
  isProUser?: boolean;
  onNavigateToPricing?: () => void;
}

// Preset Company Focus Packs
const COMPANY_FOCUS_PACKS = [
  {
    id: 'revolut',
    name: 'Revolut',
    tagline: 'High-Velocity Fintech Scaling',
    culture_pillars: ['Get It Done (Autonomy)', 'Never Settle (High Standards)', 'Deliver WOW', 'Radical Transparency'],
    interview_focus: 'Data-driven problem solving, real-time crisis triage, SQL analytics, SQL logic, operational velocity.',
    top_questions: [
      {
        q: 'Walk me through an operational incident where you had to make a high-stakes decision with incomplete data.',
        strategy: 'Highlight real-time root cause analysis, incident bridge coordination, and restoring SLA under 30 minutes.',
      },
      {
        q: 'How do you handle a sudden 50% spike in customer chat volume without dropping resolution quality?',
        strategy: 'Explain dynamic shift reallocation, routing rule adjustment, and temporary automation fixes.',
      },
      {
        q: 'Describe a project where you used SQL or data modeling to prove a conventional process was wrong.',
        strategy: 'Cite specific dashboard KPIs, cohort metrics, and dollar/time savings achieved.',
      },
    ],
  },
  {
    id: 'amazon',
    name: 'Amazon',
    tagline: 'Customer Obsession & Operational Depth',
    culture_pillars: ['Customer Obsession', 'Ownership', 'Bias for Action', 'Dive Deep', 'Have Backbone; Disagree & Commit'],
    interview_focus: 'Strict STAR methodology. Every single answer must have quantified metrics and demonstrate individual ownership.',
    top_questions: [
      {
        q: 'Tell me about a time you had a significant disagreement with your manager or peer. How did you handle it?',
        strategy: 'Focus on "Have Backbone; Disagree and Commit": use data to make your case respectfully, then commit 100% to the chosen path.',
      },
      {
        q: 'Tell me about a time you simplified a complex process or automated a repetitive task.',
        strategy: 'Focus on "Invent and Simplify": quantify hours saved per week and operational failure rate drop.',
      },
      {
        q: 'Describe a situation where you had to make a critical operational decision without waiting for approval.',
        strategy: 'Focus on "Bias for Action": explain calculated risk, two-way door decision-making, and rapid mitigation.',
      },
    ],
  },
  {
    id: 'google',
    name: 'Google',
    tagline: 'General Cognitive Ability & Googliness',
    culture_pillars: ['Googliness (Navigating Ambiguity)', 'General Cognitive Ability (GCA)', 'Role-Related Knowledge (RRK)', 'Collaborative Leadership'],
    interview_focus: 'Structured framework thinking, intellectual humility, ethical considerations, and systemic scalability.',
    top_questions: [
      {
        q: 'How would you measure the success of an operational overhaul across international regions?',
        strategy: 'Define primary KPI (e.g. cycle time), counter-metrics (error rate, agent burnout), and global rollout phases.',
      },
      {
        q: 'Tell me about a time a project failed or missed its milestone. What did you learn?',
        strategy: 'Exhibit intellectual humility, blameless post-mortem methodology, and systemic process guardrails created.',
      },
      {
        q: 'How do you navigate ambiguous requests from executive stakeholders when priorities shift weekly?',
        strategy: 'Structure a prioritization matrix (Impact vs Effort) and transparent asynchronous communication cadences.',
      },
    ],
  },
  {
    id: 'stripe',
    name: 'Stripe',
    tagline: 'Macro-Optimism & Deep Craftsmanship',
    culture_pillars: ['Users First', 'Operating with Urgency', 'Macro-Optimism', 'Rigor & Craftsmanship'],
    interview_focus: 'Meticulous attention to detail, clear written communication, and relentless customer advocacy.',
    top_questions: [
      {
        q: 'Describe the most rigorous workflow or standard operating procedure you ever documented.',
        strategy: 'Detail how you identified edge cases, codified runbooks, and reduced onboarding ramp from weeks to days.',
      },
      {
        q: 'Tell me about a time you noticed a subtle discrepancy in operational metrics that everyone else overlooked.',
        strategy: 'Demonstrate deep analytical curiosity, data reconciliation, and proactive error elimination.',
      },
    ],
  },
  {
    id: 'figma',
    name: 'Figma',
    tagline: 'Maker Empathy & Collaborative Execution',
    culture_pillars: ['Run with Empathy', 'Grow as We Build', 'Make it Fun', 'Craftsmanship'],
    interview_focus: 'High emotional intelligence, community feedback integration, cross-functional collaboration.',
    top_questions: [
      {
        q: 'Tell me about a time you partnered with engineering or product to resolve an operational bottleneck.',
        strategy: 'Focus on cross-functional alignment, clear ticket escalation, and mutual respect for technical constraints.',
      },
    ],
  },
];

export const ScreeningAnswersView: React.FC<ScreeningAnswersViewProps> = ({
  screeningAnswers,
  candidateInfo,
  applyUrl,
  companyName,
  jobTitle,
  jobDescription = '',
  masterProfileText = '',
  interviewQuestions = [],
  onFetchInterviewPrep,
  isFetchingInterviewPrep = false,
  onTrackApplication,
  isTracked = false,
  onAddScreeningAnswer,
  onRemoveScreeningAnswer,
  isProUser = false,
  onNavigateToPricing,
}) => {
  // Main Sub-Navigation Tab State
  const [activeTab, setActiveTab] = useState<'portal' | 'behavioral' | 'negotiation' | 'company_packs'>('portal');

  // Copy states
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [copiedInterviewIndex, setCopiedInterviewIndex] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<'all' | 'portal' | 'technical' | 'behavioral'>('all');

  // Custom ATS Application Question Answerer State
  const [customQuestionInput, setCustomQuestionInput] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<'star' | 'concise' | 'executive'>('star');
  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState<boolean>(false);
  const [isCopiedGenerated, setIsCopiedGenerated] = useState<boolean>(false);
  const [isSavedToForm, setIsSavedToForm] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generatedAnswerResult, setGeneratedAnswerResult] = useState<{
    question: string;
    answer: string;
    key_points: string[];
    keywords: string[];
    category: string;
    word_count: number;
  } | null>(null);

  // Behavioral Practice Coach State
  const [practiceQuestion, setPracticeQuestion] = useState<string>(
    'Describe a time you handled a critical operational failure or incident under high pressure.'
  );
  const [practiceAnswerInput, setPracticeAnswerInput] = useState<string>('');
  const [isGradingPractice, setIsGradingPractice] = useState<boolean>(false);
  const [practiceResult, setPracticeResult] = useState<{
    overall_score: number;
    situation_task_score: number;
    situation_task_feedback: string;
    action_ownership_score: number;
    action_ownership_feedback: string;
    results_metrics_score: number;
    results_metrics_feedback: string;
    delivery_polish_score: number;
    delivery_polish_feedback: string;
    strengths: string[];
    weaknesses: string[];
    gold_standard_answer: string;
  } | null>(null);
  const [copiedGoldStandard, setCopiedGoldStandard] = useState<boolean>(false);

  // Offer Negotiation Copilot State
  const [offeredBase, setOfferedBase] = useState<string>('$95,000');
  const [targetBase, setTargetBase] = useState<string>('$115,000');
  const [benefitsInput, setBenefitsInput] = useState<string>('Standard healthcare, 15 days PTO, 401(k) match');
  const [competingOfferInput, setCompetingOfferInput] = useState<string>('');
  const [leverageInput, setLeverageInput] = useState<string>(
    'Industry benchmark for high-volume operations, certified SC-900 compliance, proven track record of reducing SLA downtime by 35%'
  );
  const [isGeneratingOfferPrep, setIsGeneratingOfferPrep] = useState<boolean>(false);
  const [offerPrepResult, setOfferPrepResult] = useState<{
    counter_offer_email: string;
    phone_script: string;
    talking_points: string[];
    objection_handlers: { objection: string; response: string; backup_tactic: string }[];
    market_benchmark_insight: string;
  } | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  // Selected Company Focus Pack
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('revolut');

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

  const copyAnswerText = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopiedGenerated(true);
    setTimeout(() => setIsCopiedGenerated(false), 2000);
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

  const handleGenerateAnswer = async (overrideQuestion?: string) => {
    const q = (overrideQuestion || customQuestionInput).trim();
    if (!q) return;

    setIsGeneratingAnswer(true);
    setGenerationError(null);
    setIsCopiedGenerated(false);
    setIsSavedToForm(false);

    try {
      const response = await fetch('/api/ats/answer-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          companyName: companyName || 'Target Employer',
          jobTitle: jobTitle || 'Operations Specialist',
          jobDescription,
          masterProfile: masterProfileText,
          style: selectedStyle,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate answer');
      }

      setGeneratedAnswerResult({
        question: q,
        answer: data.suggested_answer,
        key_points: data.key_points || [],
        keywords: data.keywords || [],
        category: data.category || 'General',
        word_count: data.word_count || data.suggested_answer.split(/\s+/).length,
      });
    } catch (err: any) {
      console.error('Answer generation error:', err);
      setGenerationError(err.message || 'Failed to generate answer. Please try again.');
    } finally {
      setIsGeneratingAnswer(false);
    }
  };

  // Run Behavioral Interview Grading
  const handleGradeBehavioralAnswer = async () => {
    if (!practiceAnswerInput.trim()) return;

    setIsGradingPractice(true);
    try {
      const response = await fetch('/api/behavioral-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: practiceQuestion,
          candidateAnswer: practiceAnswerInput,
          jobTitle: jobTitle || 'Operations Specialist',
          companyName: companyName || 'Target Employer',
        }),
      });
      const data = await response.json();
      if (data.success) {
        setPracticeResult(data);
      }
    } catch (err) {
      console.error('Error grading practice answer:', err);
    } finally {
      setIsGradingPractice(false);
    }
  };

  // Run Offer Negotiation Generation
  const handleGenerateNegotiation = async () => {
    setIsGeneratingOfferPrep(true);
    try {
      const response = await fetch('/api/negotiate-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName: `${candidateInfo.first_name} ${candidateInfo.last_name}`.trim() || 'Sushmit Surendran',
          companyName: companyName || 'Target Employer',
          jobTitle: jobTitle || 'Senior Operations Specialist',
          offeredBase,
          targetBase,
          benefitsSummary: benefitsInput,
          competingOffer: competingOfferInput,
          leveragePoints: leverageInput,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setOfferPrepResult(data);
      }
    } catch (err) {
      console.error('Error generating negotiation:', err);
    } finally {
      setIsGeneratingOfferPrep(false);
    }
  };

  const PRESET_ATS_QUESTIONS = [
    {
      icon: '⚡',
      label: 'Operational Failure Mitigation',
      question: 'Describe a time you mitigated a major operational failure or critical incident under pressure.',
    },
    {
      icon: '🏢',
      label: 'Why This Company?',
      question: `Why are you interested in joining ${companyName || 'our company'} and this specific role?`,
    },
    {
      icon: '⚙️',
      label: 'Process Automation & Efficiency',
      question: 'Tell us about a manual or inefficient process you automated or redesigned to save time or costs.',
    },
    {
      icon: '🤝',
      label: 'Stakeholder Conflict Resolution',
      question: 'Describe a situation where you had a disagreement with a team or stakeholder. How did you handle it?',
    },
    {
      icon: '🏆',
      label: 'Proudest Achievement',
      question: 'What is your proudest career achievement or the project you are most proud of delivering?',
    },
    {
      icon: '💰',
      label: 'Salary & Notice Availability',
      question: 'What are your compensation expectations and what is your earliest available start date?',
    },
  ];

  const portalCount = interviewQuestions.filter((q) => q.isFromPortal || q.category === 'Portal Reported').length;
  const filteredQuestions = interviewQuestions.filter((q) => {
    if (filterCategory === 'portal') return q.isFromPortal || q.category === 'Portal Reported';
    if (filterCategory === 'technical')
      return q.category.toLowerCase().includes('technical') || q.category.toLowerCase().includes('operational');
    if (filterCategory === 'behavioral')
      return (
        q.category.toLowerCase().includes('behavioral') ||
        q.category.toLowerCase().includes('star') ||
        q.category.toLowerCase().includes('situational')
      );
    return true;
  });

  const activeCompany = COMPANY_FOCUS_PACKS.find((c) => c.id === selectedCompanyId) || COMPANY_FOCUS_PACKS[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner with Direct Application Link */}
      <div
        className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-100 text-slate-600 text-[11px] font-semibold rounded-md px-2 py-0.5 uppercase tracking-wider">
              CAREER COPILOT &amp; INTERVIEWS
            </span>
            <h2 className="font-display text-base sm:text-lg font-bold text-slate-900">
              ATS Portal, Interview Practice &amp; Negotiation
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            End-to-end interview intelligence, behavioral STAR scoring coach, and salary negotiation for{' '}
            <strong className="text-slate-700">{companyName || 'your target opportunity'}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto flex-wrap sm:flex-nowrap">
          {onTrackApplication && (
            <button
              onClick={onTrackApplication}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap justify-center ${
                isTracked
                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${isTracked ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{isTracked ? 'Tracked as Applied' : 'Mark as Applied'}</span>
            </button>
          )}

          {applyUrl && (
            <a
              href={applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-full transition-colors cursor-pointer whitespace-nowrap justify-center shadow-sm"
            >
              <span>Open {companyName || 'Job'} Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-white/80" />
            </a>
          )}
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center border-b border-slate-200 gap-1 sm:gap-4 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('portal')}
          className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap border-b-2 cursor-pointer ${
            activeTab === 'portal'
              ? 'border-[#0071E3] text-[#0071E3]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>ATS Application &amp; Autofill</span>
        </button>

        <button
          onClick={() => setActiveTab('behavioral')}
          className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap border-b-2 cursor-pointer ${
            activeTab === 'behavioral'
              ? 'border-[#0071E3] text-[#0071E3]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Behavioral Practice &amp; STAR Coach</span>
          {!isProUser && (
            <span className="px-1.5 py-0.2 text-[10px] font-bold rounded bg-purple-100 text-purple-700">
              PRO
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('negotiation')}
          className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap border-b-2 cursor-pointer ${
            activeTab === 'negotiation'
              ? 'border-[#0071E3] text-[#0071E3]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Offer &amp; Salary Negotiation</span>
          {!isProUser && (
            <span className="px-1.5 py-0.2 text-[10px] font-bold rounded bg-purple-100 text-purple-700">
              PRO
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('company_packs')}
          className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap border-b-2 cursor-pointer ${
            activeTab === 'company_packs'
              ? 'border-[#0071E3] text-[#0071E3]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Company Focus Packs</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ATS PORTAL & SCREENING ANSWERS                                      */}
      {/* ========================================================================= */}
      {activeTab === 'portal' && (
        <div className="space-y-6">
          {/* Quick-Copy Applicant Details Grid */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="bg-slate-100 text-slate-600 text-[11px] font-semibold rounded-md px-2 py-0.5 uppercase tracking-wider">
                  QUICK AUTOFILL
                </span>
                <h3 className="font-display font-semibold text-sm sm:text-base text-slate-900">
                  Standard Portal Application Fields
                </h3>
              </div>
              <span className="text-xs text-slate-400">Click any field to copy into form</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div
                onClick={() => copyField('name', `${candidateInfo.first_name} ${candidateInfo.last_name}`)}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 transition-colors cursor-pointer group flex items-center justify-between"
              >
                <div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Full Name</div>
                  <div className="text-xs font-semibold text-slate-800">{candidateInfo.first_name} {candidateInfo.last_name}</div>
                </div>
                {copiedField === 'name' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                )}
              </div>

              <div
                onClick={() => copyField('email', candidateInfo.email)}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 transition-colors cursor-pointer group flex items-center justify-between"
              >
                <div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Email Address</div>
                  <div className="text-xs font-semibold text-slate-800 truncate max-w-[170px]">
                    {candidateInfo.email}
                  </div>
                </div>
                {copiedField === 'email' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                )}
              </div>

              <div
                onClick={() => copyField('phone', candidateInfo.phone)}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 transition-colors cursor-pointer group flex items-center justify-between"
              >
                <div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Phone Number</div>
                  <div className="text-xs font-semibold text-slate-800">{candidateInfo.phone}</div>
                </div>
                {copiedField === 'phone' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                )}
              </div>

              <div
                onClick={() => copyField('location', candidateInfo.location)}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 transition-colors cursor-pointer group flex items-center justify-between"
              >
                <div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Current Location</div>
                  <div className="text-xs font-semibold text-slate-800">{candidateInfo.location}</div>
                </div>
                {copiedField === 'location' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                )}
              </div>

              <div
                onClick={() => copyField('linkedin', candidateInfo.linkedin)}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 transition-colors cursor-pointer group flex items-center justify-between"
              >
                <div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase">LinkedIn URL</div>
                  <div className="text-xs font-semibold text-slate-800 truncate max-w-[170px]">
                    {candidateInfo.linkedin}
                  </div>
                </div>
                {copiedField === 'linkedin' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                )}
              </div>

              <div
                onClick={() => copyField('work_auth', 'Authorized to work (India / Remote / Global)')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 transition-colors cursor-pointer group flex items-center justify-between"
              >
                <div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Work Authorization</div>
                  <div className="text-xs font-semibold text-slate-800">Authorized to work (India / Remote)</div>
                </div>
                {copiedField === 'work_auth' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                )}
              </div>
            </div>
          </div>

          {/* ATS Custom Question Generator */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-50 text-[#0071E3] text-[11px] font-semibold rounded-md px-2 py-0.5 uppercase tracking-wider flex items-center gap-1 border border-blue-100">
                    <Sparkles className="w-3 h-3 text-[#0071E3]" />
                    ATS PORTAL ASSISTANT
                  </span>
                  <h3 className="font-display font-semibold text-sm sm:text-base text-slate-900">
                    Custom Application Question Answerer
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  Paste any custom question from Greenhouse, Lever, Ashby, or Workday to generate a tailored, ATS-ready answer.
                </p>
              </div>

              {/* Style Selector */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full text-xs self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setSelectedStyle('star')}
                  className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                    selectedStyle === 'star' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  STAR Method
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStyle('concise')}
                  className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                    selectedStyle === 'concise'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Concise (100w)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStyle('executive')}
                  className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                    selectedStyle === 'executive'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Executive
                </button>
              </div>
            </div>

            {/* Input Box */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Enter Portal Question (or pick a preset below):
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={customQuestionInput}
                  onChange={(e) => setCustomQuestionInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateAnswer()}
                  placeholder='e.g., "Describe a time you handled a critical system outage under high pressure"'
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 focus:border-[#0071E3] transition-all"
                />
                <button
                  type="button"
                  onClick={() => handleGenerateAnswer()}
                  disabled={isGeneratingAnswer || !customQuestionInput.trim()}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-xl transition-all disabled:opacity-50 shadow-sm shrink-0 cursor-pointer"
                >
                  {isGeneratingAnswer ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Answer</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Common Portal Questions:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_ATS_QUESTIONS.map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => {
                      setCustomQuestionInput(preset.question);
                      handleGenerateAnswer(preset.question);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-xs text-slate-700 transition-colors cursor-pointer"
                  >
                    <span>{preset.icon}</span>
                    <span className="font-medium">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generated Answer Display */}
            {generatedAnswerResult && (
              <div className="p-5 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-[#0071E3]">
                        {generatedAnswerResult.category}
                      </span>
                      <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        ✓ Grounded in Master Profile
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {generatedAnswerResult.word_count} words
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{generatedAnswerResult.question}</h4>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => copyAnswerText(generatedAnswerResult.answer)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-full transition-all cursor-pointer shadow-sm"
                    >
                      {isCopiedGenerated ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Answer</span>
                        </>
                      )}
                    </button>

                    {onAddScreeningAnswer && (
                      <button
                        type="button"
                        onClick={() => {
                          onAddScreeningAnswer({
                            question: generatedAnswerResult.question,
                            suggested_answer: generatedAnswerResult.answer,
                            category: generatedAnswerResult.category,
                            keywords: generatedAnswerResult.keywords,
                            key_points: generatedAnswerResult.key_points,
                            word_count: generatedAnswerResult.word_count,
                          });
                          setIsSavedToForm(true);
                          setTimeout(() => setIsSavedToForm(false), 2500);
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                          isSavedToForm
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {isSavedToForm ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Saved to List</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Save to List</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line shadow-xs">
                  {generatedAnswerResult.answer}
                </div>

                {generatedAnswerResult.keywords && generatedAnswerResult.keywords.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 pt-1">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
                      ATS Keywords:
                    </span>
                    {generatedAnswerResult.keywords.map((kw, i) => (
                      <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-[#0071E3] font-semibold">
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Screening Form Answers List */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-slate-100 text-slate-600 text-[11px] font-semibold rounded-md px-2 py-0.5 uppercase tracking-wider">
                  SAVED RESPONSES
                </span>
                <h3 className="font-display font-semibold text-sm sm:text-base text-slate-900">
                  Application Screening Form Answers ({screeningAnswers.length})
                </h3>
              </div>
              <span className="text-xs text-slate-400">1-click copy into application form</span>
            </div>

            {screeningAnswers.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3 shadow-sm relative group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#0071E3] text-white text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-display text-sm sm:text-base font-semibold text-slate-900">
                        {item.question}
                      </h4>
                      {item.category && (
                        <span className="text-[10px] font-mono text-[#0071E3] bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1 font-semibold border border-blue-100">
                          {item.category}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => copyAnswer(idx, item.suggested_answer)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy Answer</span>
                        </>
                      )}
                    </button>

                    {onRemoveScreeningAnswer && (
                      <button
                        type="button"
                        onClick={() => onRemoveScreeningAnswer(idx)}
                        className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remove answer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 bg-slate-50 border border-slate-100 rounded-xl p-4 leading-relaxed whitespace-pre-line">
                  {item.suggested_answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BEHAVIORAL INTERVIEW PRACTICE & STAR COACH                          */}
      {/* ========================================================================= */}
      {activeTab === 'behavioral' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-purple-50 text-purple-700 text-[11px] font-semibold rounded-md px-2 py-0.5 uppercase tracking-wider border border-purple-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-600" />
                    AI STAR INTERVIEW COACH
                  </span>
                  <h3 className="font-display font-bold text-base text-slate-900">
                    Behavioral Practice &amp; AI STAR Scoring
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Type or paste your draft practice answer to any interview question. The AI Bar Raiser grades your answer across 4 STAR dimensions and generates a rewritten Gold Standard version.
                </p>
              </div>
            </div>

            {/* Question Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Target Interview Question:
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {[
                  'Describe a time you handled a critical operational failure or incident under high pressure.',
                  'Tell me about a time you had a serious disagreement with a stakeholder. How did you resolve it?',
                  'Describe a situation where you had to prioritize competing high-severity deadlines.',
                  'Give an example of an operational process you improved that delivered measurable ROI.',
                ].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPracticeQuestion(q)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer text-left ${
                      practiceQuestion === q
                        ? 'bg-purple-50 text-purple-800 border-purple-200 font-semibold'
                        : 'bg-slate-50 text-slate-600 border-slate-200/60 hover:bg-slate-100'
                    }`}
                  >
                    {q.slice(0, 55)}...
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={practiceQuestion}
                onChange={(e) => setPracticeQuestion(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            {/* Answer Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Your Draft Practice Response:</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  Write freely — include your situation, actions, and any numbers you recall
                </span>
              </label>
              <textarea
                rows={5}
                value={practiceAnswerInput}
                onChange={(e) => setPracticeAnswerInput(e.target.value)}
                placeholder="e.g. During my time at Revolut, we experienced a massive chat transfer loop during peak European hours. As the lead analyst on duty, I used SQL queries on live logs to isolate the issue to a routing rule error in the Jove pipeline. I coordinated an incident bridge, deployed an interim queue bypass rule, and brought SLA back from 70% to 99.4% within 20 minutes..."
                className="w-full p-4 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-sans leading-relaxed"
              />
            </div>

            <button
              onClick={handleGradeBehavioralAnswer}
              disabled={isGradingPractice || !practiceAnswerInput.trim()}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGradingPractice ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Bar Raiser is Grading Your Answer...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Grade Answer &amp; Generate Gold Standard Rewrite</span>
                </>
              )}
            </button>

            {/* Results Display */}
            {practiceResult && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50/50 via-white to-blue-50/40 border border-purple-200/80 space-y-6">
                {/* Score Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100 pb-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                      EVALUATION VERDICT
                    </span>
                    <h4 className="text-base font-bold text-slate-900">
                      Overall STAR Readiness Score:{' '}
                      <span className="text-purple-600 font-mono text-xl">
                        {practiceResult.overall_score}/100
                      </span>
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <div className="font-bold text-slate-900">{practiceResult.situation_task_score}/25</div>
                      <div className="text-[10px] text-slate-500 uppercase">Situation/Task</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <div className="font-bold text-slate-900">{practiceResult.action_ownership_score}/25</div>
                      <div className="text-[10px] text-slate-500 uppercase">Action/Ownership</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <div className="font-bold text-slate-900">{practiceResult.results_metrics_score}/25</div>
                      <div className="text-[10px] text-slate-500 uppercase">Results/Metrics</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <div className="font-bold text-slate-900">{practiceResult.delivery_polish_score}/25</div>
                      <div className="text-[10px] text-slate-500 uppercase">Executive Polish</div>
                    </div>
                  </div>
                </div>

                {/* Feedback Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 block">Situation &amp; Task Context:</span>
                    <p className="text-slate-600">{practiceResult.situation_task_feedback}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 block">Action &amp; Personal Ownership:</span>
                    <p className="text-slate-600">{practiceResult.action_ownership_feedback}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 block">Results &amp; Measurable Metrics:</span>
                    <p className="text-slate-600">{practiceResult.results_metrics_feedback}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 block">Delivery Polish &amp; Presence:</span>
                    <p className="text-slate-600">{practiceResult.delivery_polish_feedback}</p>
                  </div>
                </div>

                {/* Gold Standard Rewrite */}
                <div className="space-y-3 pt-2 border-t border-purple-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-500" />
                      <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Gold Standard Model Rewrite (STAR Masterclass)
                      </h5>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(practiceResult.gold_standard_answer);
                        setCopiedGoldStandard(true);
                        setTimeout(() => setCopiedGoldStandard(false), 2000);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition-colors shadow-xs"
                    >
                      {copiedGoldStandard ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Model Story</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-purple-200 shadow-xs text-xs sm:text-sm text-slate-900 leading-relaxed whitespace-pre-line">
                    {practiceResult.gold_standard_answer}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: OFFER & SALARY NEGOTIATION COPILOT                                  */}
      {/* ========================================================================= */}
      {activeTab === 'negotiation' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-50 text-emerald-700 text-[11px] font-semibold rounded-md px-2 py-0.5 uppercase tracking-wider border border-emerald-200 flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-emerald-600" />
                    OFFER &amp; COMPENSATION COPILOT
                  </span>
                  <h3 className="font-display font-bold text-base text-slate-900">
                    Strategic Salary Counter &amp; Negotiation Prep
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Never leave money on the table. Generate polite, diplomatic counter-offer emails, word-for-word recruiter phone scripts, and objection battlecards.
                </p>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Initial Offered Base Salary:</label>
                <input
                  type="text"
                  value={offeredBase}
                  onChange={(e) => setOfferedBase(e.target.value)}
                  placeholder="e.g. $95,000"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Target Counter Base Salary:</label>
                <input
                  type="text"
                  value={targetBase}
                  onChange={(e) => setTargetBase(e.target.value)}
                  placeholder="e.g. $115,000"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  Offered Benefits &amp; Equity (Optional):
                </label>
                <input
                  type="text"
                  value={benefitsInput}
                  onChange={(e) => setBenefitsInput(e.target.value)}
                  placeholder="e.g. Standard health, 15 days PTO, 401(k) match, 2,000 stock options"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  Key Leverage Points / Unique Value:
                </label>
                <input
                  type="text"
                  value={leverageInput}
                  onChange={(e) => setLeverageInput(e.target.value)}
                  placeholder="e.g. Market benchmark for high-volume operations, certified SC-900 compliance, proven record of reducing SLA downtime by 35%"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateNegotiation}
              disabled={isGeneratingOfferPrep}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGeneratingOfferPrep ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Crafting Compensation Package...</span>
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4" />
                  <span>Generate Counter Email &amp; Phone Battlecards</span>
                </>
              )}
            </button>

            {/* Negotiation Output */}
            {offerPrepResult && (
              <div className="space-y-6 pt-2">
                {/* Market Benchmark Insight */}
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold block">Market Benchmark Context:</span>
                    <span>{offerPrepResult.market_benchmark_insight}</span>
                  </div>
                </div>

                {/* Counter Offer Email Draft */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#0071E3]" />
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Diplomatic Counter-Offer Email
                      </h4>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(offerPrepResult.counter_offer_email);
                        setCopiedEmail(true);
                        setTimeout(() => setCopiedEmail(false), 2000);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0071E3] text-white text-xs font-semibold hover:bg-[#0077ED] transition-colors"
                    >
                      {copiedEmail ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Copied Email!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Email</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-mono">
                    {offerPrepResult.counter_offer_email}
                  </div>
                </div>

                {/* Live Phone Call Talking Script */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PhoneCall className="w-4 h-4 text-emerald-600" />
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Live Phone Call Speaking Script &amp; Talking Track
                      </h4>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(offerPrepResult.phone_script);
                        setCopiedScript(true);
                        setTimeout(() => setCopiedScript(false), 2000);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
                    >
                      {copiedScript ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied Script!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Script</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                    {offerPrepResult.phone_script}
                  </div>
                </div>

                {/* Recruiter Objection Battlecards */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    Recruiter Objection Battlecards ({offerPrepResult.objection_handlers.length})
                  </h4>

                  <div className="space-y-3">
                    {offerPrepResult.objection_handlers.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-xs"
                      >
                        <div className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                          <span>Objection:</span>
                          <span className="italic">"{item.objection}"</span>
                        </div>
                        <div className="text-xs text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <strong className="text-slate-900 block mb-0.5">Your Response:</strong>
                          "{item.response}"
                        </div>
                        <div className="text-[11px] text-indigo-700 bg-indigo-50 p-2 rounded-lg border border-indigo-100">
                          <strong>Pivot Strategy:</strong> {item.backup_tactic}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: COMPANY FOCUS INTERVIEW PACKS                                       */}
      {/* ========================================================================= */}
      {activeTab === 'company_packs' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-5 shadow-sm">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="bg-blue-50 text-[#0071E3] text-[11px] font-semibold rounded-md px-2 py-0.5 uppercase tracking-wider border border-blue-100 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-[#0071E3]" />
                  COMPANY FOCUS PACKS
                </span>
                <h3 className="font-display font-bold text-base text-slate-900">
                  Target Company Cultural Pillars &amp; Questions
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Understand how top tier companies evaluate candidates against their specific cultural principles and question formats.
              </p>
            </div>

            {/* Company Selector Buttons */}
            <div className="flex flex-wrap gap-2">
              {COMPANY_FOCUS_PACKS.map((comp) => (
                <button
                  key={comp.id}
                  onClick={() => setSelectedCompanyId(comp.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    selectedCompanyId === comp.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{comp.name}</span>
                </button>
              ))}
            </div>

            {/* Active Company Details */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <h4 className="text-base font-bold text-slate-900">{activeCompany.name} Focus Pack</h4>
                  <p className="text-xs text-slate-500">{activeCompany.tagline}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {activeCompany.culture_pillars.map((pillar, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700"
                    >
                      {pillar}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-950">
                <strong className="block mb-0.5 text-[#0071E3]">Interview Bar &amp; Focus:</strong>
                {activeCompany.interview_focus}
              </div>

              {/* Questions */}
              <div className="space-y-3 pt-1">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Top Asked Questions &amp; Tailoring Strategy:
                </h5>
                <div className="space-y-3">
                  {activeCompany.top_questions.map((qItem, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                      <div className="text-xs font-bold text-slate-900 flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 text-[11px]">
                          {idx + 1}
                        </span>
                        <span>{qItem.q}</span>
                      </div>
                      <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-start gap-2">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-800">Winning Strategy: </strong>
                          {qItem.strategy}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
