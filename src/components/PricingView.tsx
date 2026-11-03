import React, { useState } from 'react';
import {
  Check,
  X,
  Sparkles,
  Zap,
  Shield,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  FileText,
  Compass,
  Milestone,
  HelpCircle as QuestionIcon,
  Download,
  Briefcase,
} from 'lucide-react';

interface PricingViewProps {
  isProUser: boolean;
  onUpgradeToPro: () => void;
  onDowngradeToFree: () => void;
  tailoredCount: number;
  onNavigateToTab: (tab: string) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({
  isProUser,
  onUpgradeToPro,
  onDowngradeToFree,
  tailoredCount,
  onNavigateToTab,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<Record<number, boolean>>({ 0: true });

  const monthlyPrice = 9.99;
  const annualMonthlyPrice = 7.99; // 20% discount
  const annualTotal = (annualMonthlyPrice * 12).toFixed(2);

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleStartCheckout = () => {
    setShowCheckoutModal(true);
  };

  const handleConfirmUpgrade = () => {
    onUpgradeToPro();
    setCheckoutSuccess(true);
    setTimeout(() => {
      setShowCheckoutModal(false);
      setCheckoutSuccess(false);
    }, 1800);
  };

  const faqs = [
    {
      q: 'How does the 2 free tailored resumes limit work?',
      a: 'Free users can tailor up to 2 resumes per month using our AI matching engine. Each tailored resume aligns your verified background with the target job description and generates custom impact bullets. Once you reach 2 resumes, you can upgrade to Pro for $9.99/month to tailor unlimited resumes.',
    },
    {
      q: 'Can I cancel my Pro subscription at any time?',
      a: 'Yes, absolutely. There are no contracts, lock-ins, or cancellation fees. You can cancel with a single click at any time, and you will retain Pro access until the end of your billing cycle.',
    },
    {
      q: 'What is included in the ATS Application Question Answerer?',
      a: 'When applying on Greenhouse, Lever, Ashby, or Workday, portals frequently ask custom open-ended questions like "Describe a time you mitigated an operational failure" or "Why do you want to work here?". Pro users can generate tailored, metric-backed STAR stories with embedded ATS keywords for any portal question.',
    },
    {
      q: 'How does Interview Prep Intelligence work?',
      a: 'Pro unlocks authentic interview questions reported by real candidates on Glassdoor and AmbitionBox for your target company and role. You get interviewer objectives, key talking points, and tailored STAR model answers grounded in your verified experience.',
    },
    {
      q: 'Which ATS job platforms are connected?',
      a: 'Job Studio connects directly to unauthenticated feeds across 172 ATS platforms including Greenhouse, Lever, Ashby, SmartRecruiters, Workday, and corporate tech boards, aggregating over 7.1M+ live positions.',
    },
    {
      q: 'Are my personal details and resume confidential?',
      a: 'Yes, 100%. Your career history, contact details, and resume files are stored strictly within your local session and are never sold or shared with third-party recruiters.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-16">
      {/* Top Hero Banner */}
      <div className="text-center space-y-4 pt-4 sm:pt-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0071E3]/10 text-[#0071E3] text-xs font-semibold tracking-wider uppercase font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0071E3] animate-pulse" />
          PRICING & PLANS
        </div>

        <h1
          className="font-display text-3xl sm:text-5xl font-bold text-[#1D1D1F] tracking-tight max-w-2xl mx-auto leading-tight"
          style={{ letterSpacing: '-0.03em' }}
        >
          Choose how much of the search your agent can run.
        </h1>

        <p className="text-sm sm:text-base text-[#6E6E73] max-w-xl mx-auto leading-relaxed">
          Free is a useful career workspace, not a countdown. Pro adds unlimited agent tailoring workflows, clean PDF exports, and deep interview preparation. Cancel anytime.
        </p>

        {/* Billing Cycle Toggle */}
        <div className="pt-2 flex items-center justify-center">
          <div className="inline-flex items-center p-1 bg-[#F5F5F7] rounded-full border border-[rgba(0,0,0,0.04)] text-xs font-medium">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-white text-[#1D1D1F] shadow-[0_1px_4px_rgba(0,0,0,0.08)] font-semibold'
                  : 'text-[#86868B] hover:text-[#1D1D1F]'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-white text-[#1D1D1F] shadow-[0_1px_4px_rgba(0,0,0,0.08)] font-semibold'
                  : 'text-[#86868B] hover:text-[#1D1D1F]'
              }`}
            >
              <span>Annual</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#34C759]/15 text-[#248A3D] text-[10px] font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        {/* FREE CARD */}
        <div
          className={`bg-white rounded-3xl border p-7 sm:p-8 flex flex-col justify-between transition-all relative ${
            !isProUser
              ? 'border-[#0071E3]/40 shadow-[0_4px_24px_rgba(0,113,227,0.08)]'
              : 'border-[rgba(0,0,0,0.08)] shadow-[0_2px_12px_rgba(0,0,0,0.04)]'
          }`}
        >
          {!isProUser && (
            <div className="absolute -top-3 left-6">
              <span className="px-3 py-1 bg-[#F5F5F7] border border-[#D2D2D7] text-[#1D1D1F] text-[10px] font-bold uppercase tracking-wider rounded-full shadow-xs">
                YOUR CURRENT PLAN
              </span>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h3 className="font-display text-xl font-bold text-[#1D1D1F]">Free</h3>
              <p className="text-xs text-[#86868B] mt-1">
                Explore the market & test-drive AI tailoring.
              </p>
            </div>

            <div className="pt-2 border-t border-[rgba(0,0,0,0.04)]">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-4xl sm:text-5xl font-bold text-[#1D1D1F] tracking-tight">
                  $0
                </span>
                <span className="text-xs font-semibold text-[#86868B]">forever</span>
              </div>
              <p className="text-[11px] text-[#86868B] mt-1">No credit card required</p>
            </div>

            {/* Free Usage Progress */}
            <div className="p-3.5 rounded-2xl bg-[#F5F5F7] border border-[rgba(0,0,0,0.04)] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#1D1D1F]">Monthly Tailoring Quota</span>
                <span className="font-bold text-[#0071E3] font-mono">
                  {Math.min(tailoredCount, 2)} / 2 used
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#E5E5EA] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    tailoredCount >= 2 ? 'bg-[#FF9500]' : 'bg-[#0071E3]'
                  }`}
                  style={{ width: `${Math.min((tailoredCount / 2) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-[#86868B]">
                {tailoredCount >= 2
                  ? 'Quota reached for this month. Upgrade to Pro for unlimited tailoring.'
                  : `${2 - Math.min(tailoredCount, 2)} free tailored resume${
                      2 - Math.min(tailoredCount, 2) === 1 ? '' : 's'
                    } remaining.`}
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-3 pt-2">
              <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider block">
                WHAT'S INCLUDED:
              </span>
              <ul className="space-y-2.5 text-xs text-[#1D1D1F]">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#34C759] shrink-0 mt-0.5" />
                  <span>
                    <strong>2 Truthful AI Tailored Resumes</strong> per month with match score
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#34C759] shrink-0 mt-0.5" />
                  <span>
                    <strong>Recruiter-Panel Review:</strong> Score + Top 2 findings
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#34C759] shrink-0 mt-0.5" />
                  <span>
                    <strong>1 Custom Cover Letter draft</strong> with recruiter sign-off
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#34C759] shrink-0 mt-0.5" />
                  <span>
                    <strong>Search 7.1M+ Live Jobs</strong> across 172 ATS platforms
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#34C759] shrink-0 mt-0.5" />
                  <span>
                    <strong>17 Career Roadmaps</strong> (Stage 1 & 2 foundations)
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#34C759] shrink-0 mt-0.5" />
                  <span>
                    <strong>Quick-Copy Applicant Dossier</strong> for application autofill
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#34C759] shrink-0 mt-0.5" />
                  <span>
                    <strong>Clean ATS Vector PDF Export</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2.5 text-[#86868B]">
                  <X className="w-4 h-4 text-[#86868B]/40 shrink-0 mt-0.5" />
                  <span>Clean DOCX &amp; ATS Plaintext Export</span>
                </li>
                <li className="flex items-start gap-2.5 text-[#86868B]">
                  <X className="w-4 h-4 text-[#86868B]/40 shrink-0 mt-0.5" />
                  <span>Full 3-Persona Recruiter Panel Breakdown</span>
                </li>
                <li className="flex items-start gap-2.5 text-[#86868B]">
                  <X className="w-4 h-4 text-[#86868B]/40 shrink-0 mt-0.5" />
                  <span>Offer &amp; Salary Negotiation Copilot</span>
                </li>
                <li className="flex items-start gap-2.5 text-[#86868B]">
                  <X className="w-4 h-4 text-[#86868B]/40 shrink-0 mt-0.5" />
                  <span>Behavioral Interview Practice Coach &amp; STAR Scoring</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8">
            {!isProUser ? (
              <button
                type="button"
                disabled
                className="w-full py-3 px-4 rounded-full bg-[#F5F5F7] text-[#86868B] text-xs font-semibold cursor-default text-center"
              >
                Current Plan
              </button>
            ) : (
              <button
                type="button"
                onClick={onDowngradeToFree}
                className="w-full py-3 px-4 rounded-full bg-white border border-[#D2D2D7] hover:bg-[#F5F5F7] text-[#1D1D1F] text-xs font-semibold cursor-pointer transition-colors text-center"
              >
                Downgrade to Free
              </button>
            )}
          </div>
        </div>

        {/* PRO CARD ($9.99/mo) */}
        <div
          className={`bg-white rounded-3xl border-2 p-7 sm:p-8 flex flex-col justify-between transition-all relative ${
            isProUser
              ? 'border-[#34C759] shadow-[0_4px_30px_rgba(52,199,89,0.15)]'
              : 'border-[#0071E3] shadow-[0_4px_30px_rgba(0,113,227,0.15)]'
          }`}
        >
          {/* Badge */}
          <div className="absolute -top-3.5 left-6 flex items-center gap-1.5">
            <span className="px-3.5 py-1 bg-[#0071E3] text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-white" />
              BEST VALUE · RECOMMENDED
            </span>
          </div>

          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-[#1D1D1F]">Pro</h3>
                <p className="text-xs text-[#86868B] mt-1">
                  Run an intense, autonomous search with complete AI copilot tools.
                </p>
              </div>
              {isProUser && (
                <span className="px-2.5 py-1 bg-[#34C759]/15 text-[#248A3D] text-[11px] font-bold rounded-full font-mono">
                  ACTIVE
                </span>
              )}
            </div>

            <div className="pt-2 border-t border-[rgba(0,0,0,0.04)]">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-4xl sm:text-5xl font-bold text-[#1D1D1F] tracking-tight">
                  ${billingCycle === 'monthly' ? monthlyPrice : annualMonthlyPrice}
                </span>
                <span className="text-xs font-semibold text-[#86868B]">/mo</span>
              </div>
              <p className="text-[11px] text-[#86868B] mt-1">
                {billingCycle === 'monthly'
                  ? 'Billed monthly · Cancel anytime'
                  : `$${annualTotal} billed yearly · Save $24/year`}
              </p>
            </div>

            {/* Pro Highlight Box */}
            <div className="p-3.5 rounded-2xl bg-[#0071E3]/5 border border-[#0071E3]/15 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0071E3]">
                <Zap className="w-3.5 h-3.5" />
                <span>Zero Limits on Tailoring & Preparation</span>
              </div>
              <p className="text-[11px] text-[#6E6E73] leading-relaxed">
                Tailor as many positions as you find. Never get blocked by monthly limits when high-volume hiring waves open.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-3 pt-2">
              <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider block">
                EVERYTHING IN FREE, PLUS:
              </span>
              <ul className="space-y-2.5 text-xs text-[#1D1D1F]">
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#0071E3]/15 text-[#0071E3] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>
                    <strong>Unlimited Truthful AI Tailored Resumes</strong> with deep ATS match scoring
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#0071E3]/15 text-[#0071E3] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>
                    <strong>Full 3-Persona Recruiter-Panel Reviews</strong> (Senior Recruiter, Hiring Manager, Technical Lead)
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#0071E3]/15 text-[#0071E3] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>
                    <strong>Offer &amp; Salary Negotiation Copilot</strong> (Counter-offer email generator, live phone script, objection handlers)
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#0071E3]/15 text-[#0071E3] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>
                    <strong>Behavioral Interview Practice &amp; STAR Coach</strong> (AI Bar Raiser scoring + Gold Standard model rewrites)
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#0071E3]/15 text-[#0071E3] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>
                    <strong>Company Focus Interview Packs</strong> (Google, Amazon, Stripe, Revolut, Figma, Meta, Netflix)
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#0071E3]/15 text-[#0071E3] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>
                    <strong>Clean PDF + DOCX Export + ATS Plaintext</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#0071E3]/15 text-[#0071E3] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>
                    <strong>All 17 Career Roadmaps &amp; Readiness Assessments</strong> — full access to all stages and diagnostic matching
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#0071E3]/15 text-[#0071E3] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>
                    <strong>Full ATS Application Question Answerer</strong> (STAR stories, Why Company, embedded keywords)
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#0071E3]/15 text-[#0071E3] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>
                    <strong>Priority AI Processing</strong> with fast, unthrottled generation
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8">
            {isProUser ? (
              <button
                type="button"
                disabled
                className="w-full py-3.5 px-4 rounded-full bg-[#34C759]/15 text-[#248A3D] text-xs font-bold flex items-center justify-center gap-1.5 cursor-default"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Active Pro Plan</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartCheckout}
                className="w-full py-3.5 px-4 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold transition-all cursor-pointer shadow-[0_2px_12px_rgba(0,113,227,0.35)] flex items-center justify-center gap-2 group"
              >
                <span>Upgrade to Pro (${billingCycle === 'monthly' ? '$9.99' : '$7.99'}/mo)</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Feature Comparison Matrix */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="border-b border-[rgba(0,0,0,0.06)] pb-4">
          <h3 className="font-display text-lg sm:text-xl font-bold text-[#1D1D1F]">
            Detailed Plan Comparison
          </h3>
          <p className="text-xs text-[#86868B] mt-1">
            Compare every capability across Free and Pro tiers.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[rgba(0,0,0,0.06)] text-[#86868B] uppercase tracking-wider text-[10px]">
                <th className="py-3 pr-4 font-semibold">Capability</th>
                <th className="py-3 px-4 font-semibold w-32 sm:w-44 text-center">Free ($0)</th>
                <th className="py-3 pl-4 font-semibold w-32 sm:w-44 text-center text-[#0071E3]">
                  Pro ($9.99/mo)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,0,0,0.04)] text-[#1D1D1F]">
              {/* Category 1: BUILD & APPLY */}
              <tr className="bg-[#F5F5F7]/50 font-semibold text-[11px] text-[#6E6E73]">
                <td colSpan={3} className="py-2.5 px-2">
                  BUILD &amp; APPLY
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Tailored Resumes with ATS Match Score</td>
                <td className="py-3 px-4 text-center font-medium text-[#86868B]">2 per month</td>
                <td className="py-3 pl-4 text-center font-bold text-[#0071E3]">Unlimited</td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Clean (Unwatermarked) PDF + DOCX Export</td>
                <td className="py-3 px-4 text-center text-[#86868B]">PDF Vector</td>
                <td className="py-3 pl-4 text-center font-bold text-[#0071E3]">
                  ✓ Clean PDF + DOCX + Plaintext
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Recruiter-Panel Multi-Persona Reviews</td>
                <td className="py-3 px-4 text-center text-[#86868B]">Score + Top 2 findings</td>
                <td className="py-3 pl-4 text-center font-bold text-[#0071E3]">
                  ✓ Full 3-Persona Committee
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Custom Role-Specific Cover Letters</td>
                <td className="py-3 px-4 text-center font-medium text-[#86868B]">1 draft</td>
                <td className="py-3 pl-4 text-center font-bold text-[#0071E3]">Unlimited</td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Match Gap Breakdown &amp; Action Plan</td>
                <td className="py-3 px-4 text-center text-[#34C759]">✓ Included</td>
                <td className="py-3 pl-4 text-center text-[#34C759]">✓ Included</td>
              </tr>

              {/* Category 2: COPILOT & INTERVIEWS */}
              <tr className="bg-[#F5F5F7]/50 font-semibold text-[11px] text-[#6E6E73]">
                <td colSpan={3} className="py-2.5 px-2">
                  COPILOT &amp; INTERVIEWS
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Offer &amp; Salary Negotiation Copilot</td>
                <td className="py-3 px-4 text-center text-[#86868B]">—</td>
                <td className="py-3 pl-4 text-center font-bold text-[#0071E3]">
                  ✓ Email, Phone Script &amp; Objections
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Behavioral Interview Practice &amp; STAR Coach</td>
                <td className="py-3 px-4 text-center text-[#86868B]">—</td>
                <td className="py-3 pl-4 text-center font-bold text-[#0071E3]">
                  ✓ AI Bar Raiser + Gold Model Rewrites
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Company Focus Interview Packs</td>
                <td className="py-3 px-4 text-center text-[#86868B]">1 Sample</td>
                <td className="py-3 pl-4 text-center font-bold text-[#0071E3]">
                  ✓ All Top Companies (Amazon, Google, etc.)
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">ATS Application Question Answerer (STAR Stories)</td>
                <td className="py-3 px-4 text-center text-[#86868B]">Preview (1 question)</td>
                <td className="py-3 pl-4 text-center font-bold text-[#0071E3]">
                  ✓ Unlimited questions
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Portal-Reported Questions (Glassdoor / AmbitionBox)</td>
                <td className="py-3 px-4 text-center text-[#86868B]">Sample preview</td>
                <td className="py-3 pl-4 text-center font-bold text-[#0071E3]">
                  ✓ Full portal intel
                </td>
              </tr>

              {/* Category 3: CAREER ROADMAPS & SEARCH */}
              <tr className="bg-[#F5F5F7]/50 font-semibold text-[11px] text-[#6E6E73]">
                <td colSpan={3} className="py-2.5 px-2">
                  CAREER ROADMAPS &amp; SEARCH
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">17 Career Roadmaps Access</td>
                <td className="py-3 px-4 text-center font-medium text-[#86868B]">
                  Stages 1 &amp; 2 (Foundations)
                </td>
                <td className="py-3 pl-4 text-center font-bold text-[#0071E3]">
                  All Stages (Complete 17 Paths)
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Roadmap Readiness Assessments</td>
                <td className="py-3 px-4 text-center text-[#86868B]">—</td>
                <td className="py-3 pl-4 text-center font-bold text-[#0071E3]">
                  ✓ 1-Click Profile Diagnostic
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Live ATS Job Explorer (7.1M+ jobs, 172 ATS)</td>
                <td className="py-3 px-4 text-center text-[#34C759]">✓ Full Search</td>
                <td className="py-3 pl-4 text-center text-[#34C759]">✓ Full Search + Direct Crawler</td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Applied Jobs Pipeline Tracker</td>
                <td className="py-3 px-4 text-center font-medium text-[#86868B]">Up to 5 jobs</td>
                <td className="py-3 pl-4 text-center font-bold text-[#0071E3]">Unlimited</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex items-center gap-2 border-b border-[rgba(0,0,0,0.06)] pb-4">
          <HelpCircle className="w-5 h-5 text-[#0071E3]" />
          <div>
            <h3 className="font-display text-lg sm:text-xl font-bold text-[#1D1D1F]">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-[#86868B]">
              Everything you need to know about plans and billing.
            </p>
          </div>
        </div>

        <div className="divide-y divide-[rgba(0,0,0,0.06)]">
          {faqs.map((faq, idx) => {
            const isOpen = !!openFaq[idx];
            return (
              <div key={idx} className="py-4 first:pt-2 last:pb-2">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between text-left gap-4 cursor-pointer group"
                >
                  <span className="font-display font-semibold text-sm sm:text-base text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">
                    {faq.q}
                  </span>
                  <span className="text-[#86868B] shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs sm:text-[13px] text-[#6E6E73] leading-relaxed pr-8 animate-fadeIn">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[rgba(0,0,0,0.08)] space-y-5 relative">
            <button
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-5 right-5 text-[#86868B] hover:text-[#1D1D1F] text-sm font-bold cursor-pointer"
            >
              ✕
            </button>

            {checkoutSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#34C759]/15 text-[#248A3D] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display text-xl font-bold text-[#1D1D1F]">
                  Welcome to Job Studio Pro!
                </h3>
                <p className="text-xs text-[#6E6E73] max-w-xs mx-auto">
                  Your Pro account is now active. All limits have been removed across resume tailoring, interview prep, and roadmaps.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <span className="apple-badge-blue text-[10px] uppercase font-mono font-bold">
                    UPGRADE TO PRO
                  </span>
                  <h3 className="font-display text-xl font-bold text-[#1D1D1F]">
                    Confirm Pro Subscription
                  </h3>
                  <p className="text-xs text-[#86868B]">
                    Instant access to unlimited tailored resumes, interview prep, and clean exports.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[rgba(0,0,0,0.04)] space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#1D1D1F]">
                    <span>Job Studio Pro ({billingCycle === 'monthly' ? 'Monthly' : 'Annual'})</span>
                    <span>${billingCycle === 'monthly' ? '9.99' : annualTotal}</span>
                  </div>
                  <div className="text-[11px] text-[#86868B] flex items-center justify-between">
                    <span>Billing cycle:</span>
                    <span>{billingCycle === 'monthly' ? '$9.99/month' : '$7.99/month (Billed annually)'}</span>
                  </div>
                  <div className="text-[11px] text-[#248A3D] font-medium flex items-center gap-1 pt-1 border-t border-[rgba(0,0,0,0.06)]">
                    <Check className="w-3 h-3" />
                    <span>Includes 200+ portal questions & unlimited tailored resumes</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#86868B]">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#34C759] shrink-0" />
                    <span>Cancel anytime with 1 click · No hidden charges</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCheckoutModal(false)}
                    className="flex-1 py-2.5 px-4 rounded-full bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED] text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmUpgrade}
                    className="flex-1 py-2.5 px-4 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold cursor-pointer transition-colors shadow-md"
                  >
                    Activate Pro Now
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

