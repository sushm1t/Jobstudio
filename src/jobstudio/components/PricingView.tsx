// @ts-nocheck -- ported verbatim from the original project
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
      a: 'Job Studio fetches live openings directly from public company job boards on Greenhouse, Lever, Ashby, SmartRecruiters and Workable, plus selected remote and tech job boards. Results reflect what those boards list at the time you search.',
    },
    {
      q: 'Are my personal details and resume confidential?',
      a: 'Yes, 100%. Your career history, contact details, and resume files are stored strictly within your local session and are never sold or shared with third-party recruiters.',
    },
  ];

  return (
    <div className="workspace-pricing max-w-5xl mx-auto space-y-12 pb-16">
      {/* Top Hero Banner */}
      <div className="text-center space-y-4 pt-4 sm:pt-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold tracking-wider uppercase font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          PRICING & PLANS
        </div>

        <h1
          className="font-display text-3xl sm:text-5xl font-bold text-foreground tracking-tight max-w-2xl mx-auto leading-tight"
          style={{ letterSpacing: '-0.03em' }}
        >
          Plans &amp; subscription
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Free is a useful career workspace, not a countdown. Pro adds unlimited agent tailoring workflows, clean PDF exports, and deep interview preparation. Cancel anytime.
        </p>

        {/* Billing Cycle Toggle */}
        <div className="pt-2 flex items-center justify-center">
          <div className="inline-flex items-center p-1 bg-surface rounded-full border border-border text-xs font-medium">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-card text-foreground shadow-elevated font-semibold'
                  : 'text-subtle hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-card text-foreground shadow-elevated font-semibold'
                  : 'text-subtle hover:text-foreground'
              }`}
            >
              <span>Annual</span>
              <span className="px-1.5 py-0.5 rounded-full bg-success/15 text-success text-[10px] font-bold">
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
          className={`bg-card rounded-3xl border p-7 sm:p-8 flex flex-col justify-between transition-all relative ${
            !isProUser
              ? 'border-brand/40 shadow-elevated'
              : 'border-border shadow-elevated'
          }`}
        >
          {!isProUser && (
            <div className="absolute -top-3 left-6">
              <span className="px-3 py-1 bg-surface border border-border text-foreground text-[10px] font-bold uppercase tracking-wider rounded-full shadow-xs">
                YOUR CURRENT PLAN
              </span>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h3 className="font-display text-xl font-bold text-foreground">Free</h3>
              <p className="text-xs text-subtle mt-1">
                Explore the market & test-drive AI tailoring.
              </p>
            </div>

            <div className="pt-2 border-t border-border">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
                  $0
                </span>
                <span className="text-xs font-semibold text-subtle">forever</span>
              </div>
              <p className="text-[11px] text-subtle mt-1">No credit card required</p>
            </div>

            {/* Free Usage Progress */}
            <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">Monthly Tailoring Quota</span>
                <span className="font-bold text-brand font-mono">
                  {Math.min(tailoredCount, 2)} / 2 used
                </span>
              </div>
              <div className="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    tailoredCount >= 2 ? 'bg-warning' : 'bg-primary'
                  }`}
                  style={{ width: `${Math.min((tailoredCount / 2) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-subtle">
                {tailoredCount >= 2
                  ? 'Quota reached for this month. Upgrade to Pro for unlimited tailoring.'
                  : `${2 - Math.min(tailoredCount, 2)} free tailored resume${
                      2 - Math.min(tailoredCount, 2) === 1 ? '' : 's'
                    } remaining.`}
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-3 pt-2">
              <span className="text-[11px] font-semibold text-subtle uppercase tracking-wider block">
                WHAT'S INCLUDED:
              </span>
              <ul className="space-y-2.5 text-xs text-foreground">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <span>
                    <strong>2 Truthful AI Tailored Resumes</strong> per month with match score
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <span>
                    <strong>Recruiter-Panel Review:</strong> Score + Top 2 findings
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <span>
                    <strong>1 Custom Cover Letter draft</strong> with recruiter sign-off
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <span>
                    <strong>Search live jobs</strong> from company boards on Greenhouse, Lever, Ashby and more
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <span>
                    <strong>17 Career Roadmaps</strong> (Stage 1 & 2 foundations)
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <span>
                    <strong>Quick-Copy Applicant Dossier</strong> for application autofill
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <span>
                    <strong>Clean ATS Vector PDF Export</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2.5 text-subtle">
                  <X className="w-4 h-4 text-subtle/40 shrink-0 mt-0.5" />
                  <span>Clean DOCX &amp; ATS Plaintext Export</span>
                </li>
                <li className="flex items-start gap-2.5 text-subtle">
                  <X className="w-4 h-4 text-subtle/40 shrink-0 mt-0.5" />
                  <span>Full 3-Persona Recruiter Panel Breakdown</span>
                </li>
                <li className="flex items-start gap-2.5 text-subtle">
                  <X className="w-4 h-4 text-subtle/40 shrink-0 mt-0.5" />
                  <span>Offer &amp; Salary Negotiation Copilot</span>
                </li>
                <li className="flex items-start gap-2.5 text-subtle">
                  <X className="w-4 h-4 text-subtle/40 shrink-0 mt-0.5" />
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
                className="w-full py-3 px-4 rounded-full bg-surface text-subtle text-xs font-semibold cursor-default text-center"
              >
                Current Plan
              </button>
            ) : (
              <button
                type="button"
                onClick={onDowngradeToFree}
                className="w-full py-3 px-4 rounded-full bg-card border border-border hover:bg-surface text-foreground text-xs font-semibold cursor-pointer transition-colors text-center"
              >
                Downgrade to Free
              </button>
            )}
          </div>
        </div>

        {/* PRO CARD ($9.99/mo) */}
        <div
          className={`bg-card rounded-3xl border-2 p-7 sm:p-8 flex flex-col justify-between transition-all relative ${
            isProUser
              ? 'border-success shadow-elevated'
              : 'border-brand shadow-elevated'
          }`}
        >
          {/* Badge */}
          <div className="absolute -top-3.5 left-6 flex items-center gap-1.5">
            <span className="px-3.5 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-primary-foreground" />
              BEST VALUE · RECOMMENDED
            </span>
          </div>

          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">Pro</h3>
                <p className="text-xs text-subtle mt-1">
                  Run an intense, autonomous search with complete AI copilot tools.
                </p>
              </div>
              {isProUser && (
                <span className="px-2.5 py-1 bg-success/15 text-success text-[11px] font-bold rounded-full font-mono">
                  ACTIVE
                </span>
              )}
            </div>

            <div className="pt-2 border-t border-border">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
                  ${billingCycle === 'monthly' ? monthlyPrice : annualMonthlyPrice}
                </span>
                <span className="text-xs font-semibold text-subtle">/mo</span>
              </div>
              <p className="text-[11px] text-subtle mt-1">
                {billingCycle === 'monthly'
                  ? 'Billed monthly · Cancel anytime'
                  : `$${annualTotal} billed yearly · Save $24/year`}
              </p>
            </div>

            {/* Pro Highlight Box */}
            <div className="p-3.5 rounded-2xl bg-brand/5 border border-brand/15 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-brand">
                <Zap className="w-3.5 h-3.5" />
                <span>Zero Limits on Tailoring & Preparation</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Tailor as many positions as you find. Never get blocked by monthly limits when high-volume hiring waves open.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-3 pt-2">
              <span className="text-[11px] font-semibold text-subtle uppercase tracking-wider block">
                EVERYTHING IN FREE, PLUS:
              </span>
              <ul className="space-y-2.5 text-xs text-foreground">
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-brand/15 text-brand flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>
                    <strong>Unlimited Truthful AI Tailored Resumes</strong> with deep ATS match scoring
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-brand/15 text-brand flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>
                    <strong>Full 3-Persona Recruiter-Panel Reviews</strong> (Senior Recruiter, Hiring Manager, Technical Lead)
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-brand/15 text-brand flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>
                    <strong>Offer &amp; Salary Negotiation Copilot</strong> (Counter-offer email generator, live phone script, objection handlers)
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-brand/15 text-brand flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>
                    <strong>Behavioral Interview Practice &amp; STAR Coach</strong> (AI Bar Raiser scoring + Gold Standard model rewrites)
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-brand/15 text-brand flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>
                    <strong>Company Focus Interview Packs</strong> (Google, Amazon, Stripe, Revolut, Figma, Meta, Netflix)
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-brand/15 text-brand flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>
                    <strong>Clean PDF + DOCX Export + ATS Plaintext</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-brand/15 text-brand flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>
                    <strong>All 17 Career Roadmaps &amp; Readiness Assessments</strong> — full access to all stages and diagnostic matching
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-brand/15 text-brand flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>
                    <strong>Full ATS Application Question Answerer</strong> (STAR stories, Why Company, embedded keywords)
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-brand/15 text-brand flex items-center justify-center shrink-0 mt-0.5">
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
                className="w-full py-3.5 px-4 rounded-full bg-success/15 text-success text-xs font-bold flex items-center justify-center gap-1.5 cursor-default"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Active Pro Plan</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartCheckout}
                className="w-full py-3.5 px-4 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold transition-all cursor-pointer shadow-elevated flex items-center justify-center gap-2 group"
              >
                <span>Upgrade to Pro (${billingCycle === 'monthly' ? '$9.99' : '$7.99'}/mo)</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Feature Comparison Matrix */}
      <div className="bg-card rounded-3xl border border-border p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="border-b border-border pb-4">
          <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
            Detailed Plan Comparison
          </h3>
          <p className="text-xs text-subtle mt-1">
            Compare every capability across Free and Pro tiers.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-subtle uppercase tracking-wider text-[10px]">
                <th className="py-3 pr-4 font-semibold">Capability</th>
                <th className="py-3 px-4 font-semibold w-32 sm:w-44 text-center">Free ($0)</th>
                <th className="py-3 pl-4 font-semibold w-32 sm:w-44 text-center text-brand">
                  Pro ($9.99/mo)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,0,0,0.04)] text-foreground">
              {/* Category 1: BUILD & APPLY */}
              <tr className="bg-surface/50 font-semibold text-[11px] text-muted-foreground">
                <td colSpan={3} className="py-2.5 px-2">
                  BUILD &amp; APPLY
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Tailored Resumes with ATS Match Score</td>
                <td className="py-3 px-4 text-center font-medium text-subtle">2 per month</td>
                <td className="py-3 pl-4 text-center font-bold text-brand">Unlimited</td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Clean (Unwatermarked) PDF + DOCX Export</td>
                <td className="py-3 px-4 text-center text-subtle">PDF Vector</td>
                <td className="py-3 pl-4 text-center font-bold text-brand">
                  ✓ Clean PDF + DOCX + Plaintext
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Recruiter-Panel Multi-Persona Reviews</td>
                <td className="py-3 px-4 text-center text-subtle">Score + Top 2 findings</td>
                <td className="py-3 pl-4 text-center font-bold text-brand">
                  ✓ Full 3-Persona Committee
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Custom Role-Specific Cover Letters</td>
                <td className="py-3 px-4 text-center font-medium text-subtle">1 draft</td>
                <td className="py-3 pl-4 text-center font-bold text-brand">Unlimited</td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Match Gap Breakdown &amp; Action Plan</td>
                <td className="py-3 px-4 text-center text-success">✓ Included</td>
                <td className="py-3 pl-4 text-center text-success">✓ Included</td>
              </tr>

              {/* Category 2: COPILOT & INTERVIEWS */}
              <tr className="bg-surface/50 font-semibold text-[11px] text-muted-foreground">
                <td colSpan={3} className="py-2.5 px-2">
                  COPILOT &amp; INTERVIEWS
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Offer &amp; Salary Negotiation Copilot</td>
                <td className="py-3 px-4 text-center text-subtle">—</td>
                <td className="py-3 pl-4 text-center font-bold text-brand">
                  ✓ Email, Phone Script &amp; Objections
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Behavioral Interview Practice &amp; STAR Coach</td>
                <td className="py-3 px-4 text-center text-subtle">—</td>
                <td className="py-3 pl-4 text-center font-bold text-brand">
                  ✓ AI Bar Raiser + Gold Model Rewrites
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Company Focus Interview Packs</td>
                <td className="py-3 px-4 text-center text-subtle">1 Sample</td>
                <td className="py-3 pl-4 text-center font-bold text-brand">
                  ✓ All Top Companies (Amazon, Google, etc.)
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">ATS Application Question Answerer (STAR Stories)</td>
                <td className="py-3 px-4 text-center text-subtle">Preview (1 question)</td>
                <td className="py-3 pl-4 text-center font-bold text-brand">
                  ✓ Unlimited questions
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Portal-Reported Questions (Glassdoor / AmbitionBox)</td>
                <td className="py-3 px-4 text-center text-subtle">Sample preview</td>
                <td className="py-3 pl-4 text-center font-bold text-brand">
                  ✓ Full portal intel
                </td>
              </tr>

              {/* Category 3: CAREER ROADMAPS & SEARCH */}
              <tr className="bg-surface/50 font-semibold text-[11px] text-muted-foreground">
                <td colSpan={3} className="py-2.5 px-2">
                  CAREER ROADMAPS &amp; SEARCH
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">17 Career Roadmaps Access</td>
                <td className="py-3 px-4 text-center font-medium text-subtle">
                  Stages 1 &amp; 2 (Foundations)
                </td>
                <td className="py-3 pl-4 text-center font-bold text-brand">
                  All Stages (Complete 17 Paths)
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Roadmap Readiness Assessments</td>
                <td className="py-3 px-4 text-center text-subtle">—</td>
                <td className="py-3 pl-4 text-center font-bold text-brand">
                  ✓ 1-Click Profile Diagnostic
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Live ATS Job Explorer (company boards on 5 ATS platforms)</td>
                <td className="py-3 px-4 text-center text-success">✓ Full Search</td>
                <td className="py-3 pl-4 text-center text-success">✓ Full Search + Direct Crawler</td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Applied Jobs Pipeline Tracker</td>
                <td className="py-3 px-4 text-center font-medium text-subtle">Up to 5 jobs</td>
                <td className="py-3 pl-4 text-center font-bold text-brand">Unlimited</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-card rounded-3xl border border-border p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex items-center gap-2 border-b border-border pb-4">
          <HelpCircle className="w-5 h-5 text-brand" />
          <div>
            <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-subtle">
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
                  <span className="font-display font-semibold text-sm sm:text-base text-foreground group-hover:text-brand transition-colors">
                    {faq.q}
                  </span>
                  <span className="text-subtle shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs sm:text-[13px] text-muted-foreground leading-relaxed pr-8 animate-fadeIn">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-card rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-border space-y-5 relative">
            <button
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-5 right-5 text-subtle hover:text-foreground text-sm font-bold cursor-pointer"
            >
              ✕
            </button>

            {checkoutSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-success/15 text-success flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  Welcome to Job Studio Pro!
                </h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Your Pro account is now active. All limits have been removed across resume tailoring, interview prep, and roadmaps.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <span className="apple-badge-blue text-[10px] uppercase font-mono font-bold">
                    UPGRADE TO PRO
                  </span>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    Confirm Pro Subscription
                  </h3>
                  <p className="text-xs text-subtle">
                    Instant access to unlimited tailored resumes, interview prep, and clean exports.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface border border-border space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                    <span>Job Studio Pro ({billingCycle === 'monthly' ? 'Monthly' : 'Annual'})</span>
                    <span>${billingCycle === 'monthly' ? '9.99' : annualTotal}</span>
                  </div>
                  <div className="text-[11px] text-subtle flex items-center justify-between">
                    <span>Billing cycle:</span>
                    <span>{billingCycle === 'monthly' ? '$9.99/month' : '$7.99/month (Billed annually)'}</span>
                  </div>
                  <div className="text-[11px] text-success font-medium flex items-center gap-1 pt-1 border-t border-border">
                    <Check className="w-3 h-3" />
                    <span>Includes 200+ portal questions & unlimited tailored resumes</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-subtle">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-success shrink-0" />
                    <span>Cancel anytime with 1 click · No hidden charges</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCheckoutModal(false)}
                    className="flex-1 py-2.5 px-4 rounded-full bg-surface text-foreground hover:bg-surface-2 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmUpgrade}
                    className="flex-1 py-2.5 px-4 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold cursor-pointer transition-colors shadow-md"
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

