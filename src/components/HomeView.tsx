import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Shield,
  CheckCircle2,
  ArrowRight,
  Compass,
  FileText,
  Mail,
  HelpCircle,
  Briefcase,
  Milestone,
  Lock,
  Clock,
  TrendingUp,
  Search,
  ExternalLink,
  Layers,
  Award,
  ChevronDown,
  ChevronUp,
  X,
  User,
  Star,
  FileUp,
  AlertCircle,
  LogIn,
} from 'lucide-react';

interface HomeViewProps {
  onNavigateToTab: (tab: string) => void;
  isProUser: boolean;
  onUpgradeToPro: () => void;
  tailoredCount: number;
  isLoggedIn: boolean;
  userEmail: string;
  userName: string;
  onLogin: (name: string, email: string) => void;
  onLogout: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateToTab,
  isProUser,
  onUpgradeToPro,
  tailoredCount,
  isLoggedIn,
  userEmail,
  userName,
  onLogin,
  onLogout,
}) => {
  // Billing toggle for embedded pricing section
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  // Embedded Hero Auth Card State (Direct homepage signup/signin)
  const [heroAuthMode, setHeroAuthMode] = useState<'signup' | 'signin'>('signup');
  const [heroFullName, setHeroFullName] = useState<string>('');
  const [heroEmail, setHeroEmail] = useState<string>('');
  const [heroPassword, setHeroPassword] = useState<string>('');
  const [heroTargetRole, setHeroTargetRole] = useState<string>('');
  const [heroAuthError, setHeroAuthError] = useState<string | null>(null);
  const [heroAuthSuccess, setHeroAuthSuccess] = useState<string | null>(null);

  const handleHeroAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHeroAuthError(null);

    if (!heroEmail.trim()) {
      setHeroAuthError('Please provide a valid email address.');
      return;
    }

    if (heroAuthMode === 'signup' && !heroFullName.trim()) {
      setHeroAuthError('Please provide your full name.');
      return;
    }

    const name = heroAuthMode === 'signup' ? heroFullName.trim() : heroFullName.trim() || heroEmail.split('@')[0];
    onLogin(name, heroEmail.trim());

    setHeroAuthSuccess(
      heroAuthMode === 'signup'
        ? `Account created for ${name}! Opening your Master Profile...`
        : `Welcome back, ${name}! Opening your workspace...`
    );

    setTimeout(() => {
      onNavigateToTab('profile');
    }, 700);
  };

  const handleHeroDemoSignIn = () => {
    onLogin('Sushmit Surendran', 'sushmit.surendran@revolut.com');
    setHeroAuthSuccess('Signed in as Sushmit Surendran. Redirecting to Master Profile...');
    setTimeout(() => {
      onNavigateToTab('profile');
    }, 600);
  };

  // Interactive STAR method question selector preview
  const [selectedStarCategory, setSelectedStarCategory] = useState<'failure' | 'why_company' | 'conflict'>('failure');

  const starSamples = {
    failure: {
      question: 'Describe a time you handled a critical operational failure or unexpected breakdown.',
      s: 'During peak trading volume at Revolut, a sudden routing malfunction in customer support queues triggered a 45% spike in unassigned tickets, jeopardizing our 15-minute SLA benchmark across 1,000+ frontline agents.',
      t: 'As Real-Time Operations SME, I was tasked with establishing immediate emergency bridge communications, isolating the queue leakage point, and rebalancing frontline capacity before breach thresholds were crossed.',
      a: 'I initiated an emergency Slack incident bridge, executed scheduled Jove SQL queries to diagnose the chat transfer loop, and dynamically reassigned 85 cross-trained agents from low-volume queues to absorb the incoming backlog within 12 minutes.',
      r: 'Preempted widespread SLA breaches, reduced queue wait times from 24 minutes back down to 6.2 minutes, and implemented an automated SQL exception trigger that permanently prevented recurring transfer loops.',
      metrics: '100% SLA preservation · 12-minute resolution · 25 managerial hours saved monthly',
    },
    why_company: {
      question: 'Why do you want to join our organization and what makes you a strong fit?',
      s: 'Your team is rapidly scaling high-throughput infrastructure and international operations, where small workflow latencies can rapidly degrade client experience and partner trust.',
      t: 'My goal is to step into your operational ecosystem and immediately eliminate capacity blind spots, align cross-functional stakeholder reporting, and standardize SLA governance.',
      a: 'I bring 6 years of battle-tested real-time operations, capacity planning, and incident response experience from Revolut and Torc Infotech, having built automated Looker exception dashboards and managed multi-currency reconciliations across global teams.',
      r: 'I will deliver rapid intraday variance reduction, audit-proof operational controls, and consistent delivery predictability to your growing organization from week one.',
      metrics: 'Immediate onboarding readiness · 6 years scale experience · Proven SLA track record',
    },
    conflict: {
      question: 'How do you resolve conflict with cross-functional stakeholders when priorities clash?',
      s: 'Engineering was planning an intraday core deployment that coincided with a known high-volume customer transaction surge, risking frontline overload and delayed responses.',
      t: 'I needed to represent operational risk without halting critical product velocity, reconciling engineering sprint deadlines with real-time support capacity.',
      a: 'Rather than opposing the release, I pulled live historical arrival curve telemetry from Metabase, demonstrated the exact capacity shortfall, and proposed a staggered 3-phase rollout during our 3:00 AM lull with designated on-call support.',
      r: 'Engineering successfully deployed with zero downtime, support maintained a 98.4% SLA adherence, and we formalized the joint release review playbook for all subsequent deployments.',
      metrics: 'Zero customer disruption · 98.4% SLA sustained · Standardized joint playbook',
    },
  };

  return (
    <div className="space-y-16 animate-fade-in text-[#1D1D1F] pb-24 max-w-6xl mx-auto">
      {/* Clean Landing Brand Header (visible on homepage when logged out, since top app bar is hidden) */}
      {!isLoggedIn && (
        <div className="flex items-center justify-between py-2 px-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1D1D1F] flex items-center justify-center text-white font-bold text-xs shadow-xs">
              <span style={{ fontFamily: 'var(--font-display)' }}>JS</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-[#1D1D1F]" style={{ fontFamily: 'var(--font-display)' }}>
                Job Studio
              </span>
              <span className="hidden sm:inline text-xs text-[#86868B] font-medium">
                · Autonomous Career Workspace &amp; ATS Suite
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const card = document.getElementById('hero-auth-card');
              card?.scrollIntoView({ behavior: 'smooth' });
              const input = card?.querySelector('input');
              input?.focus();
            }}
            className="px-4 py-1.5 text-xs font-semibold text-[#0071E3] bg-[#0071E3]/10 hover:bg-[#0071E3]/20 rounded-full transition-all cursor-pointer"
          >
            Sign Up / Sign In →
          </button>
        </div>
      )}

      {/* =========================================================================
          HERO SECTION (High-Converting Apple-Inspired Presentation with Direct Auth)
         ========================================================================= */}
      <section className="bg-white rounded-3xl border border-[rgba(0,0,0,0.08)] p-6 sm:p-9 lg:p-11 shadow-[0_4px_24px_rgba(0,0,0,0.04)] relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-gradient-to-br from-[#0071E3]/10 to-[#34C759]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* LEFT COLUMN: Main Pitch & Action CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0071E3]/10 text-[#0071E3] text-xs font-semibold tracking-wider uppercase font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0071E3] animate-pulse" />
              AUTONOMOUS CAREER SUITE FOR 2026
            </div>

            {/* Main Headline */}
            <h1
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1D1D1F] tracking-tight leading-[1.12]"
              style={{ letterSpacing: '-0.035em' }}
            >
              Stop sending generic resumes into the void.
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base text-[#6E6E73] leading-relaxed max-w-xl">
              You could paste your CV into ChatGPT. But then you’re still copying, formatting, hallucination-checking, and losing track.
              Job Studio is your complete autonomous career workspace—connecting directly to live corporate ATS backends, tailoring metric-backed resumes, and prepping you for the interview.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {!isLoggedIn ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const card = document.getElementById('hero-auth-card');
                      card?.scrollIntoView({ behavior: 'smooth' });
                      const input = card?.querySelector('input');
                      input?.focus();
                    }}
                    className="px-6 py-3 bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs sm:text-sm rounded-full shadow-[0_4px_14px_rgba(0,113,227,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2 group"
                  >
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const featSection = document.getElementById('features-tour');
                      featSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-5 py-3 bg-white hover:bg-[#F5F5F7] text-[#1D1D1F] font-semibold text-xs sm:text-sm rounded-full border border-[rgba(0,0,0,0.12)] shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-[#0071E3]" />
                    <span>See All Features ↓</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onNavigateToTab('evaluator')}
                    className="px-5 py-3 bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs sm:text-sm rounded-full shadow-[0_4px_14px_rgba(0,113,227,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2 group"
                  >
                    <span>Explore Live Roles &amp; Tailor Free</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigateToTab('profile')}
                    className="px-5 py-3 bg-white hover:bg-[#F5F5F7] text-[#1D1D1F] font-semibold text-xs sm:text-sm rounded-full border border-[rgba(0,0,0,0.12)] shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <FileUp className="w-4 h-4 text-[#0071E3]" />
                    <span>Upload PDF / Master Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigateToTab('roadmaps')}
                    className="px-4 py-3 bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] font-semibold text-xs sm:text-sm rounded-full border border-[rgba(0,0,0,0.06)] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Milestone className="w-4 h-4 text-[#0071E3]" />
                    <span>Browse Roadmaps</span>
                  </button>
                </>
              )}
            </div>

            {/* Social Proof & Infrastructure Counter Metrics */}
            <div className="pt-5 border-t border-[rgba(0,0,0,0.06)] grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <div className="text-lg sm:text-xl font-bold text-[#1D1D1F] font-mono">7,135,000+</div>
                <div className="text-[10px] text-[#86868B] uppercase tracking-wider font-semibold">Live Jobs Indexed</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-[#0071E3] font-mono">172 ATS</div>
                <div className="text-[10px] text-[#86868B] uppercase tracking-wider font-semibold">Greenhouse, Ashby, Lever</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-[#34C759] font-mono">&lt; 2 Minutes</div>
                <div className="text-[10px] text-[#86868B] uppercase tracking-wider font-semibold">JD to Tailored PDF</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-[#1D1D1F] font-mono">0% AI Slop</div>
                <div className="text-[10px] text-[#86868B] uppercase tracking-wider font-semibold">Ground-Truth Verified</div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: DIRECT SIGN-UP / SIGN-IN FORM OR ACTIVE PROFILE CARD */}
          <div className="lg:col-span-5">
            {!isLoggedIn ? (
              <div id="hero-auth-card" className="bg-[#FAFAFA] rounded-3xl border border-[rgba(0,0,0,0.08)] shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-5 sm:p-6 space-y-4">
                {/* Mode Selector */}
                <div className="flex items-center p-1 bg-[#EDEDF0] rounded-full text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => {
                      setHeroAuthMode('signup');
                      setHeroAuthError(null);
                    }}
                    className={`flex-1 py-1.5 rounded-full text-center transition-all cursor-pointer ${
                      heroAuthMode === 'signup'
                        ? 'bg-white text-[#1D1D1F] shadow-xs font-semibold'
                        : 'text-[#86868B] hover:text-[#1D1D1F]'
                    }`}
                  >
                    Create Free Account
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setHeroAuthMode('signin');
                      setHeroAuthError(null);
                    }}
                    className={`flex-1 py-1.5 rounded-full text-center transition-all cursor-pointer ${
                      heroAuthMode === 'signin'
                        ? 'bg-white text-[#1D1D1F] shadow-xs font-semibold'
                        : 'text-[#86868B] hover:text-[#1D1D1F]'
                    }`}
                  >
                    Sign In
                  </button>
                </div>

                {/* Feedback Alerts */}
                {heroAuthError && (
                  <div className="p-2.5 rounded-xl bg-[#FF3B30]/10 text-[#D70015] border border-[#FF3B30]/20 text-xs flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{heroAuthError}</span>
                  </div>
                )}
                {heroAuthSuccess && (
                  <div className="p-2.5 rounded-xl bg-[#34C759]/10 text-[#248A3D] border border-[#34C759]/20 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{heroAuthSuccess}</span>
                  </div>
                )}

                {/* Form Inputs */}
                <form onSubmit={handleHeroAuthSubmit} className="space-y-3">
                  {heroAuthMode === 'signup' && (
                    <div>
                      <label className="block text-[#6E6E73] font-semibold text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <User className="w-3 h-3 text-[#0071E3]" />
                        <span>Full Name</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={heroFullName}
                        onChange={(e) => setHeroFullName(e.target.value)}
                        placeholder="e.g. Harish Kumar"
                        className="w-full px-3 py-2 bg-white border border-[rgba(0,0,0,0.1)] focus:border-[#0071E3] rounded-xl text-xs text-[#1D1D1F] outline-none transition-all placeholder-[#86868B]"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[#6E6E73] font-semibold text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-[#0071E3]" />
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={heroEmail}
                      onChange={(e) => setHeroEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3 py-2 bg-white border border-[rgba(0,0,0,0.1)] focus:border-[#0071E3] rounded-xl text-xs text-[#1D1D1F] outline-none transition-all placeholder-[#86868B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#6E6E73] font-semibold text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-[#0071E3]" />
                      <span>Password</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={heroPassword}
                      onChange={(e) => setHeroPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3 py-2 bg-white border border-[rgba(0,0,0,0.1)] focus:border-[#0071E3] rounded-xl text-xs text-[#1D1D1F] outline-none transition-all placeholder-[#86868B]"
                    />
                  </div>

                  {heroAuthMode === 'signup' && (
                    <div>
                      <label className="block text-[#6E6E73] font-semibold text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Briefcase className="w-3 h-3 text-[#0071E3]" />
                        <span>Target Role / Headline <span className="text-[#86868B] lowercase font-normal">(optional)</span></span>
                      </label>
                      <input
                        type="text"
                        value={heroTargetRole}
                        onChange={(e) => setHeroTargetRole(e.target.value)}
                        placeholder="e.g. Operations Specialist, Staff Engineer, PM"
                        className="w-full px-3 py-2 bg-white border border-[rgba(0,0,0,0.1)] focus:border-[#0071E3] rounded-xl text-xs text-[#1D1D1F] outline-none transition-all placeholder-[#86868B]"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs rounded-xl shadow-[0_2px_10px_rgba(0,113,227,0.25)] transition-all cursor-pointer flex items-center justify-center gap-2 mt-1"
                  >
                    <span>{heroAuthMode === 'signup' ? 'Create Account & Build Master Profile' : 'Sign In to Workspace'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                {/* Demo Shortcut */}
                <div className="pt-2 border-t border-[rgba(0,0,0,0.06)] text-center">
                  <button
                    type="button"
                    onClick={handleHeroDemoSignIn}
                    className="w-full py-2 px-3 bg-white hover:bg-[#F0F0F2] text-[#1D1D1F] text-[11px] font-medium rounded-xl border border-[rgba(0,0,0,0.08)] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#0071E3]" />
                    <span>One-Click Sign In as Sushmit Surendran (Verified Demo)</span>
                  </button>
                  <p className="text-[10px] text-[#86868B] mt-1.5 font-medium">
                    Free to get started · No credit card required
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-[#FAFAFA] rounded-3xl border border-[rgba(0,0,0,0.08)] shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-[rgba(0,0,0,0.06)]">
                  <div className="w-12 h-12 rounded-full bg-[#0071E3] text-white flex items-center justify-center font-bold text-base shadow-xs">
                    {userName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#1D1D1F] flex items-center gap-1.5">
                      <span>{userName}</span>
                      <span className="text-[10px] px-2 py-0.2 bg-[#34C759]/15 text-[#248A3D] rounded-full font-semibold">
                        ● Signed In
                      </span>
                    </div>
                    <div className="text-xs text-[#86868B] font-mono">{userEmail}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[#86868B] text-[10px] font-bold uppercase tracking-wider">Quick Actions</div>
                  <button
                    type="button"
                    onClick={() => onNavigateToTab('profile')}
                    className="w-full py-2.5 px-3.5 bg-white hover:bg-[#F0F0F2] text-[#0071E3] font-semibold text-xs rounded-xl border border-[rgba(0,0,0,0.08)] shadow-2xs transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <FileUp className="w-4 h-4 text-[#0071E3]" />
                      <span>Upload PDF / Edit Master Profile</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigateToTab('evaluator')}
                    className="w-full py-2.5 px-3.5 bg-white hover:bg-[#F0F0F2] text-[#1D1D1F] font-semibold text-xs rounded-xl border border-[rgba(0,0,0,0.08)] shadow-2xs transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-[#0071E3]" />
                      <span>Explore 7.1M+ Live Jobs</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigateToTab('roadmaps')}
                    className="w-full py-2.5 px-3.5 bg-white hover:bg-[#F0F0F2] text-[#1D1D1F] font-semibold text-xs rounded-xl border border-[rgba(0,0,0,0.08)] shadow-2xs transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Milestone className="w-4 h-4 text-[#0071E3]" />
                      <span>Career Learning Roadmaps</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="pt-2 border-t border-[rgba(0,0,0,0.06)] flex items-center justify-between text-xs text-[#86868B]">
                  <span>Connected Workspace</span>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="text-[#FF3B30] hover:underline font-semibold cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          COMPREHENSIVE FEATURE TOUR ("Everything Inside Your Autonomous Workspace")
         ========================================================================= */}
      <section id="features-tour" className="space-y-8 scroll-mt-6">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0071E3]/10 text-[#0071E3] text-xs font-semibold tracking-wider uppercase font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#0071E3]" />
            COMPLETE APPLICATION SUITE
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-[#1D1D1F] tracking-tight">
            How Job Studio powers your entire job search.
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed">
            Unlike disjointed ChatGPT prompts or manual document formatting, Job Studio is an end-to-end autonomous career system.
            Here is the complete workflow you unlock the moment you sign up:
          </p>
        </div>

        {/* 7 Workflow Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Feature 1: Master Profile & Vault */}
          <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.08)] p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0071E3] bg-[#0071E3]/10 px-2.5 py-0.5 rounded-full">
                  Step 1 · Master Vault
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#1D1D1F]">
                1. Upload PDF &amp; Build Master Profile
              </h3>
              <p className="text-xs text-[#6E6E73] leading-relaxed">
                Upload your existing resume PDF once or paste career notes. Gemini AI parses your contact info, employment timeline, and quantitative achievements into your private Master Profile.
              </p>
            </div>
            <div className="pt-3 border-t border-[rgba(0,0,0,0.06)] flex items-center gap-1.5 text-[11px] font-medium text-[#248A3D]">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Zero hallucinations: grounded strictly in your verified facts</span>
            </div>
          </div>

          {/* Feature 2: 7.1M+ Live ATS Job Evaluator */}
          <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.08)] p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#34C759]/10 text-[#248A3D] flex items-center justify-center font-bold">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#248A3D] bg-[#34C759]/10 px-2.5 py-0.5 rounded-full">
                  Step 2 · 7.1M+ Live Roles
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#1D1D1F]">
                2. Live ATS Evaluator &amp; Match Score
              </h3>
              <p className="text-xs text-[#6E6E73] leading-relaxed">
                Connect directly to unauthenticated Greenhouse, Ashby, and Lever corporate backends. Inspect Match Scores (0–100%), required skills, disqualifiers, and keyword gaps before applying.
              </p>
            </div>
            <div className="pt-3 border-t border-[rgba(0,0,0,0.06)] flex items-center gap-1.5 text-[11px] font-medium text-[#248A3D]">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Instant algorithmic ATS qualification test</span>
            </div>
          </div>

          {/* Feature 3: Automated Resume Tailoring */}
          <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.08)] p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#AF52DE]/10 text-[#AF52DE] flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#AF52DE] bg-[#AF52DE]/10 px-2.5 py-0.5 rounded-full">
                  Step 3 · 60s Synthesis
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#1D1D1F]">
                3. 1-Click ATS Tailored Resume
              </h3>
              <p className="text-xs text-[#6E6E73] leading-relaxed">
                Generate high-converting XYZ-formula impact bullets tailored to the target job description. Export clean, ATS-compliant single-page PDFs and editable Word (.docx) files in under 60 seconds.
              </p>
            </div>
            <div className="pt-3 border-t border-[rgba(0,0,0,0.06)] flex items-center gap-1.5 text-[11px] font-medium text-[#248A3D]">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Print-ready PDF &amp; DOCX with 0 watermarks</span>
            </div>
          </div>

          {/* Feature 4: Tailored Cover Letter */}
          <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.08)] p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#FF9500]/10 text-[#B25000] flex items-center justify-center font-bold">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B25000] bg-[#FF9500]/10 px-2.5 py-0.5 rounded-full">
                  Step 4 · Narrative Cover Letter
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#1D1D1F]">
                4. Persuasive Cover Letter Studio
              </h3>
              <p className="text-xs text-[#6E6E73] leading-relaxed">
                Craft human-sounding, executive cover letters tailored to the company's culture and specific team bottlenecks. Highlight your most relevant case studies with zero boilerplate AI slop.
              </p>
            </div>
            <div className="pt-3 border-t border-[rgba(0,0,0,0.06)] flex items-center gap-1.5 text-[11px] font-medium text-[#248A3D]">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Personalized directly to the hiring manager</span>
            </div>
          </div>

          {/* Feature 5: 3-Persona Recruiter Review Panel */}
          <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.08)] p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#5856D6]/10 text-[#5856D6] flex items-center justify-center font-bold">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5856D6] bg-[#5856D6]/10 px-2.5 py-0.5 rounded-full">
                  Step 5 · Stress-Test Panel
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#1D1D1F]">
                5. 3-Persona Recruiter Review Panel
              </h3>
              <p className="text-xs text-[#6E6E73] leading-relaxed">
                Simulate a hiring committee before applying. Receive honest critique from a Hiring Manager (domain depth), Bar Raiser (leadership impact), and ATS Screener (parser compliance).
              </p>
            </div>
            <div className="pt-3 border-t border-[rgba(0,0,0,0.06)] flex items-center gap-1.5 text-[11px] font-medium text-[#248A3D]">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Fix red flags before human eyes review your profile</span>
            </div>
          </div>

          {/* Feature 6: STAR Portal Q&A & Interview Prep */}
          <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.08)] p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#FF2D55]/10 text-[#FF2D55] flex items-center justify-center font-bold">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF2D55] bg-[#FF2D55]/10 px-2.5 py-0.5 rounded-full">
                  Step 6 · STAR Portal Q&amp;A
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#1D1D1F]">
                6. STAR Portal Answerer &amp; Interview Prep
              </h3>
              <p className="text-xs text-[#6E6E73] leading-relaxed">
                Effortlessly tackle custom essay prompts on job portals with structured Situation-Task-Action-Result answers. Generate behavioral interview simulation questions with instant talking points.
              </p>
            </div>
            <div className="pt-3 border-t border-[rgba(0,0,0,0.06)] flex items-center gap-1.5 text-[11px] font-medium text-[#248A3D]">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>1-click copy-paste into corporate portal forms</span>
            </div>
          </div>

          {/* Feature 7: Kanban Tracker & Career Roadmaps (Spans across all cols) */}
          <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.08)] p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between space-y-5 md:col-span-2 lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center font-bold">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0071E3] bg-[#0071E3]/10 px-2.5 py-0.5 rounded-full">
                    Step 7 · Lifecycle Management
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#1D1D1F]">
                  7. Personal Application Kanban Pipeline &amp; Career Roadmaps
                </h3>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  Never lose track of which tailored resume went to which company. Manage all your applications across a personal Kanban board (Applied, Interviewing, Offer, Archived). Explore interactive 2026 Career Roadmaps with salary data and milestone guides.
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-[#248A3D] font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Full version history &amp; application audit trail</span>
                </div>
              </div>

              {/* Visual preview pill card */}
              <div className="bg-[#F5F5F7] rounded-2xl p-4 border border-[rgba(0,0,0,0.06)] space-y-2.5 text-xs">
                <div className="text-[11px] font-mono uppercase text-[#86868B] font-semibold">Your Autonomous Journey:</div>
                <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-semibold">
                  <div className="bg-white py-1.5 rounded-lg border border-[rgba(0,0,0,0.06)] text-[#0071E3]">1. Sign Up</div>
                  <div className="bg-white py-1.5 rounded-lg border border-[rgba(0,0,0,0.06)] text-[#0071E3]">2. Upload CV</div>
                  <div className="bg-white py-1.5 rounded-lg border border-[rgba(0,0,0,0.06)] text-[#0071E3]">3. Tailor JD</div>
                  <div className="bg-[#34C759] py-1.5 rounded-lg text-white font-bold">4. Land Offer</div>
                </div>
                <div className="text-[11px] text-[#6E6E73] text-center pt-1 font-medium">
                  Create your free account to access all 7 modules instantly.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PAIN POINTS SECTION ("Sound familiar?" - Image 4)
         ========================================================================= */}
      <section className="space-y-6 text-center">
        <div className="space-y-2 max-w-2xl mx-auto">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF3B30] bg-[#FF3B30]/10 px-3 py-1 rounded-full">
            THE CURRENT JOB HUNTING REALITY
          </span>
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-[#1D1D1F] tracking-tight">
            Sound familiar?
          </h2>
          <p className="text-sm text-[#6E6E73] leading-relaxed">
            Most job seekers spend 2+ hours manually customizing every single application—only to be screened out by algorithmic ATS filters before a human ever looks.
          </p>
        </div>

        {/* Floating Pain Point Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto pt-2">
          {[
            { text: 'Rewriting cover letters for every single vacancy', icon: '📝' },
            { text: 'Generic AI text flagged and auto-rejected by ATS screeners', icon: '❌' },
            { text: 'Lost track of what version was sent to which company', icon: '🔍' },
            { text: 'Spending 2+ hours per application on weekends', icon: '⏰' },
            { text: 'Never hearing back from recruiters after weeks of waiting', icon: '📭' },
            { text: 'Applications disappearing into the portal void', icon: '🕳️' },
            { text: 'Manually retyping work history on repetitive portal forms', icon: '🔁' },
            { text: 'Job search burnout, frustration, and prompt fatigue', icon: '😫' },
            { text: 'Missing critical hiring deadlines due to slow customization', icon: '⏳' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[rgba(0,0,0,0.08)] shadow-[0_2px_8px_rgba(0,0,0,0.03)] text-xs text-[#1D1D1F] font-medium hover:border-[#FF3B30]/40 transition-colors"
            >
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          THE COMPARISON: The DIY Approach vs. Job Studio (Image 1)
         ========================================================================= */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-[#1D1D1F] tracking-tight">
            You could paste your CV into ChatGPT. But then what?
          </h2>
          <p className="text-sm text-[#6E6E73]">
            Job searching is already hard enough. You need an autonomous workspace that remembers your master profile, tracks your applications, and ensures quality—not another blank tool to manage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Card 1: The DIY Approach */}
          <div className="bg-[#F5F5F7] rounded-3xl border border-[rgba(0,0,0,0.06)] p-7 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#86868B] uppercase">
                <span className="w-2 h-2 rounded-full bg-[#86868B]" />
                THE DIY APPROACH
              </div>
              <h3 className="text-xl font-bold text-[#1D1D1F]">
                Manual Prompt Engineering
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed">
                You paste your CV and a 3,000-word job description into ChatGPT. It returns a block of text. Now you’re copying, formatting bullet indents, checking whether it hallucinated skills you don’t have, and wondering if required ATS keywords were missed.
              </p>
            </div>

            <div className="pt-4 border-t border-[rgba(0,0,0,0.06)] text-xs text-[#86868B] italic space-y-1">
              <p>• Every application becomes a 2-hour manual project.</p>
              <p>• Every edit requires starting over. No version control.</p>
              <p>• No application tracking. Just you and a blank prompt.</p>
            </div>
          </div>

          {/* Card 2: Your Complete System (Job Studio) */}
          <div className="bg-white rounded-3xl border-2 border-[#0071E3] p-7 sm:p-8 flex flex-col justify-between space-y-6 shadow-[0_8px_32px_rgba(0,113,227,0.08)] relative">
            <div className="absolute -top-3 right-6">
              <span className="px-3 py-1 bg-[#0071E3] text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-xs">
                RECOMMENDED
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#0071E3] uppercase">
                <Zap className="w-3.5 h-3.5" />
                YOUR COMPLETE AUTONOMOUS WORKSPACE
              </div>
              <h3 className="text-xl font-bold text-[#1D1D1F]">
                Job Studio End-to-End System
              </h3>
              <p className="text-xs sm:text-sm text-[#1D1D1F] leading-relaxed">
                Paste any job URL or pull from our live 7.1M+ ATS index. We analyze the true requirements, check disqualifiers, verify every claim against your master profile, generate tailored impact bullets, run a 3-persona recruiter panel, and export a print-ready PDF and DOCX in 60 seconds.
              </p>
            </div>

            <div className="pt-4 border-t border-[rgba(0,0,0,0.06)] text-xs text-[#248A3D] font-medium space-y-1">
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34C759]" />
                One click from job posting to verified tailored resume
              </p>
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34C759]" />
                Every application tracked in your personal Kanban pipeline
              </p>
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34C759]" />
                Zero hallucinations: grounded 100% in your verified achievements
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          THE STAR METHOD DEEP-DIVE (User Requirement)
         ========================================================================= */}
      <section className="bg-white rounded-3xl border border-[rgba(0,0,0,0.08)] p-7 sm:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-8">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#AF52DE]/10 text-[#AF52DE] text-xs font-semibold tracking-wider uppercase font-mono">
            <Star className="w-3.5 h-3.5" />
            THE STAR METHOD APPLICATION ENGINE
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#1D1D1F] tracking-tight">
            Pass ATS screening questions with structured, metric-backed answers.
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed">
            When applying on Greenhouse, Lever, Ashby, or Workday, portals frequently demand custom essay answers (e.g., <em>"Describe an operational failure you mitigated"</em> or <em>"Why do you want to work here?"</em>).
            Job Studio generates structured responses following the proven <strong>STAR Framework (Situation, Task, Action, Result)</strong>, injecting relevant ATS keywords and candidate metrics.
          </p>
        </div>

        {/* 4 Pillars of STAR Method */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[rgba(0,0,0,0.04)] space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-[#0071E3] text-white flex items-center justify-center font-bold text-xs">S</span>
            <h4 className="text-sm font-bold text-[#1D1D1F]">Situation</h4>
            <p className="text-[11px] text-[#6E6E73] leading-relaxed">
              Establishes the operational context, frontline volume, and specific business stakes without vague generalizations.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[rgba(0,0,0,0.04)] space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-[#0071E3] text-white flex items-center justify-center font-bold text-xs">T</span>
            <h4 className="text-sm font-bold text-[#1D1D1F]">Task</h4>
            <p className="text-[11px] text-[#6E6E73] leading-relaxed">
              Defines your specific ownership, cross-functional mandate, and the exact problem you needed to resolve.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[rgba(0,0,0,0.04)] space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-[#0071E3] text-white flex items-center justify-center font-bold text-xs">A</span>
            <h4 className="text-sm font-bold text-[#1D1D1F]">Action</h4>
            <p className="text-[11px] text-[#6E6E73] leading-relaxed">
              Details the concrete tools, SQL scripts, incident war-rooms, or automation pipelines you actively deployed.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[rgba(0,0,0,0.04)] space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-[#34C759] text-white flex items-center justify-center font-bold text-xs">R</span>
            <h4 className="text-sm font-bold text-[#1D1D1F]">Result</h4>
            <p className="text-[11px] text-[#6E6E73] leading-relaxed">
              Closes with verified business impact metrics (e.g., 14% SLA gain, 25 hours saved per month, eliminated defects).
            </p>
          </div>
        </div>

        {/* Interactive Sample Selector */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#FBFBFD] border border-[rgba(0,0,0,0.08)] space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-semibold text-[#86868B] uppercase tracking-wider font-mono">
              Live STAR Demonstration:
            </span>
            <div className="flex items-center gap-1.5">
              {[
                { key: 'failure' as const, label: 'Operational Breakdown' },
                { key: 'why_company' as const, label: 'Why This Company' },
                { key: 'conflict' as const, label: 'Stakeholder Alignment' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSelectedStarCategory(tab.key)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    selectedStarCategory === tab.key
                      ? 'bg-[#0071E3] text-white shadow-2xs'
                      : 'bg-white text-[#6E6E73] hover:text-[#1D1D1F] border border-[rgba(0,0,0,0.06)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rendered Demonstration Card */}
          <div className="bg-white p-5 rounded-xl border border-[rgba(0,0,0,0.06)] space-y-3">
            <div className="text-xs font-semibold text-[#1D1D1F] flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#F5F5F7] text-[#0071E3] font-mono text-[10px] font-bold">
                PORTAL PROMPT
              </span>
              <span>"{starSamples[selectedStarCategory].question}"</span>
            </div>

            <div className="space-y-2 text-xs text-[#1D1D1F] leading-relaxed pl-3 border-l-2 border-[#0071E3]">
              <p><strong>[Situation]</strong> {starSamples[selectedStarCategory].s}</p>
              <p><strong>[Task]</strong> {starSamples[selectedStarCategory].t}</p>
              <p><strong>[Action]</strong> {starSamples[selectedStarCategory].a}</p>
              <p><strong>[Result]</strong> {starSamples[selectedStarCategory].r}</p>
            </div>

            <div className="pt-2 border-t border-[rgba(0,0,0,0.04)] flex items-center justify-between text-[11px] font-mono text-[#248A3D]">
              <span>✓ Verified Alignment: {starSamples[selectedStarCategory].metrics}</span>
              <button
                type="button"
                onClick={() => onNavigateToTab('screening')}
                className="text-[#0071E3] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Answer My Portal Questions</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          THE ALTERNATIVES & COST COMPARISON (Image 3)
         ========================================================================= */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-[#1D1D1F] tracking-tight">
            The alternatives to doing this alone are expensive, slow, or generic.
          </h2>
          <p className="text-sm text-[#6E6E73]">
            You can navigate the job market without Job Studio. Here is what it typically costs in cash, weekends, and delayed career offers to do it the other ways:
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.08)] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="px-6 py-4 bg-[#F5F5F7] border-b border-[rgba(0,0,0,0.06)] flex items-center justify-between text-xs font-mono font-semibold text-[#86868B] uppercase">
            <span>HOW YOU WOULD DO IT ALONE</span>
            <span>ESTIMATED COST</span>
          </div>

          <div className="divide-y divide-[rgba(0,0,0,0.06)] text-xs sm:text-sm">
            {/* Alternative 1 */}
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-[#1D1D1F]">Human Career Consultant & Resume Writer</h4>
                <p className="text-xs text-[#86868B]">
                  3–5 consultation calls · 2–3 weeks delivery turnaround · static text that becomes obsolete when applying to a different role
                </p>
              </div>
              <div className="font-mono font-bold text-[#1D1D1F] shrink-0 text-sm sm:text-base">
                $500 – $1,500 <span className="text-xs font-normal text-[#86868B]">/ project</span>
              </div>
            </div>

            {/* Alternative 2 */}
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-[#1D1D1F]">Online "Optimize Your LinkedIn & Resume" Courses</h4>
                <p className="text-xs text-[#86868B]">
                  10–30 hours of passive video modules · you still have to write alone afterwards · zero real-time feedback on your target JD
                </p>
              </div>
              <div className="font-mono font-bold text-[#1D1D1F] shrink-0 text-sm sm:text-base">
                $197 – $997 <span className="text-xs font-normal text-[#86868B]">+ hours of time</span>
              </div>
            </div>

            {/* Alternative 3 */}
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-[#1D1D1F]">You + ChatGPT on Sunday Afternoons</h4>
                <p className="text-xs text-[#86868B]">
                  Generic prompts · AI phrasing that sounds robotic to recruiters · manual formatting headaches · nothing to measure progress against
                </p>
              </div>
              <div className="font-mono font-bold text-[#1D1D1F] shrink-0 text-sm sm:text-base">
                ~6 hours <span className="text-xs font-normal text-[#86868B]">/ weekend, every month</span>
              </div>
            </div>

            {/* Alternative 4 */}
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-[#FF3B30]">The Cost of Waiting (Status Quo)</h4>
                <p className="text-xs text-[#86868B]">
                  Every additional month spent searching is a full month of target salary never earned. An invisible cost, but very real.
                </p>
              </div>
              <div className="font-mono font-bold text-[#FF3B30] shrink-0 text-sm sm:text-base">
                $5,000 – $15,000+ <span className="text-xs font-normal text-[#86868B]">/ month of delay</span>
              </div>
            </div>

            {/* Job Studio Highlight */}
            <div className="p-6 bg-[#0071E3]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t-2 border-[#0071E3]">
              <div className="space-y-1">
                <h4 className="font-bold text-[#0071E3] flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  <span>Job Studio Complete Workspace</span>
                </h4>
                <p className="text-xs text-[#6E6E73]">
                  Direct ATS crawling across 7.1M+ jobs · grounded tailoring in 60s · Recruiter Review Panel · STAR portal answerer · full application tracking
                </p>
              </div>
              <div className="font-mono font-bold text-[#0071E3] shrink-0 text-base sm:text-xl">
                Free or $9.99 <span className="text-xs font-normal text-[#86868B]">/ month (cancel anytime)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          EMBEDDED PRICING PLANS AT THE BOTTOM (User Requirement)
         ========================================================================= */}
      <section className="space-y-8 pt-4">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0071E3]/10 text-[#0071E3] text-xs font-semibold tracking-wider uppercase font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0071E3] animate-pulse" />
            CLEAR & TRANSPARENT PRICING
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#1D1D1F] tracking-tight">
            Choose how much of the search your agent runs.
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6E73]">
            Free is a functional career workspace, not an artificial countdown. Pro adds unlimited tailoring workflows, clean exports, and deep interview prep. Cancel anytime.
          </p>

          {/* Billing Toggle */}
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

        {/* 2-Tier Pricing Cards: Free vs Pro */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto items-stretch">
          {/* FREE PLAN */}
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
                  CURRENT TIER
                </span>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="font-display text-xl font-bold text-[#1D1D1F]">Free</h3>
                <p className="text-xs text-[#86868B] mt-1">
                  Explore the live job market & test-drive AI tailoring.
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

              <div className="space-y-2.5 pt-2">
                <span className="text-[11px] font-bold text-[#1D1D1F] uppercase tracking-wider block font-mono">
                  INCLUDED ON FREE:
                </span>
                <ul className="space-y-2 text-xs text-[#6E6E73]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#34C759] shrink-0 mt-0.5" />
                    <span><strong>2 tailored resumes</strong> every month with ATS keyword alignment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#34C759] shrink-0 mt-0.5" />
                    <span>Search 7.1M+ jobs across Greenhouse, Ashby, Lever, and Remotive</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#34C759] shrink-0 mt-0.5" />
                    <span>Access all 2026 Career Roadmaps and curriculum milestones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#34C759] shrink-0 mt-0.5" />
                    <span>Personal Kanban application tracker for all submissions</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => onNavigateToTab('evaluator')}
                className="w-full py-3 px-4 rounded-full font-semibold text-xs transition-all border border-[rgba(0,0,0,0.12)] text-[#1D1D1F] hover:bg-[#F5F5F7] cursor-pointer"
              >
                Start Free Workspace
              </button>
            </div>
          </div>

          {/* PRO PLAN ($9.99/mo) */}
          <div
            className={`bg-white rounded-3xl border-2 p-7 sm:p-8 flex flex-col justify-between transition-all relative ${
              isProUser
                ? 'border-[#34C759] shadow-[0_8px_32px_rgba(52,199,89,0.15)]'
                : 'border-[#0071E3] shadow-[0_8px_32px_rgba(0,113,227,0.12)]'
            }`}
          >
            <div className="absolute -top-3 right-6">
              <span className="px-3 py-1 bg-[#0071E3] text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-xs">
                MOST POPULAR
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-display text-xl font-bold text-[#1D1D1F] flex items-center gap-1.5">
                  <span>Pro</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0071E3]/10 text-[#0071E3] font-mono">
                    UNLIMITED
                  </span>
                </h3>
                <p className="text-xs text-[#86868B] mt-1">
                  Everything you need to run high-intensity, high-converting job searches.
                </p>
              </div>

              <div className="pt-2 border-t border-[rgba(0,0,0,0.04)]">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-4xl sm:text-5xl font-bold text-[#1D1D1F] tracking-tight">
                    ${billingCycle === 'monthly' ? '9.99' : '7.99'}
                  </span>
                  <span className="text-xs font-semibold text-[#86868B]">/ month</span>
                </div>
                <p className="text-[11px] text-[#86868B] mt-1">
                  {billingCycle === 'monthly' ? 'Billed monthly · Cancel anytime' : 'Billed annually ($95.88/yr) · Save 20%'}
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <span className="text-[11px] font-bold text-[#0071E3] uppercase tracking-wider block font-mono">
                  EVERYTHING IN FREE, PLUS:
                </span>
                <ul className="space-y-2 text-xs text-[#1D1D1F]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0071E3] shrink-0 mt-0.5" />
                    <span><strong>Unlimited truthful tailored resumes</strong> & cover letters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0071E3] shrink-0 mt-0.5" />
                    <span><strong>Recruiter Review Panel</strong> (Hiring Manager, Bar Raiser, Screener)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0071E3] shrink-0 mt-0.5" />
                    <span><strong>STAR Method Portal Answerer</strong> for custom ATS application forms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0071E3] shrink-0 mt-0.5" />
                    <span><strong>Clean PDF & editable DOCX downloads</strong> with 0 watermarks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0071E3] shrink-0 mt-0.5" />
                    <span>Offer negotiation battlecards & behavioral interview simulation</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-6">
              {isProUser ? (
                <div className="w-full py-3 px-4 rounded-full font-semibold text-xs bg-[#34C759]/15 text-[#248A3D] text-center border border-[#34C759]/30">
                  ✓ Active Pro Plan
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onUpgradeToPro}
                  className="w-full py-3 px-4 rounded-full font-semibold text-xs transition-all bg-[#0071E3] hover:bg-[#0077ED] text-white shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Upgrade to Pro ($9.99/mo)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

{/* =========================================================================
          BOTTOM CALL TO ACTION BANNER (For Logged Out Visitors)
         ========================================================================= */}
      {!isLoggedIn && (
        <section className="bg-gradient-to-r from-[#1D1D1F] to-[#2C2C2E] rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#34C759] bg-[#34C759]/20 px-3 py-1 rounded-full">
              START YOUR AUTONOMOUS CAREER SEARCH
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-bold tracking-tight">
              Ready to stop sending generic resumes into the void?
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A1A6] leading-relaxed max-w-xl mx-auto">
              Create your free account in 30 seconds. Upload your resume once, evaluate live roles across 172 ATS endpoints, and synthesize interview-ready applications.
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={() => {
                const card = document.getElementById('hero-auth-card');
                card?.scrollIntoView({ behavior: 'smooth' });
                const input = card?.querySelector('input');
                input?.focus();
              }}
              className="px-8 py-3.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs sm:text-sm rounded-full shadow-[0_4px_16px_rgba(0,113,227,0.4)] transition-all cursor-pointer flex items-center gap-2 group"
            >
              <span>Create Free Account &amp; Build Master Profile</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <p className="text-[11px] text-[#86868B]">
            Free to get started · No credit card required · Instant setup
          </p>
        </section>
      )}
    </div>
  );
};
