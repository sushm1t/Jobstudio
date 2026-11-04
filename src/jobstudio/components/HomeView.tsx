// @ts-nocheck -- ported verbatim from the original project
import React, { useState, useRef } from 'react';
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

  return (
    <div className="space-y-16 animate-fade-in text-foreground pb-24 max-w-6xl mx-auto">

      {/* =========================================================================
          HERO SECTION (High-Converting Apple-Inspired Presentation with Direct Auth)
         ========================================================================= */}
      <section className="bg-card rounded-3xl border border-border p-6 sm:p-9 lg:p-11 shadow-elevated relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-gradient-to-br from-brand/10 to-success/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* LEFT COLUMN: Main Pitch & Action CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold tracking-wider uppercase font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              AUTONOMOUS CAREER SUITE FOR 2026
            </div>

            {/* Main Headline */}
            <h1
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.12]"
              style={{ letterSpacing: '-0.035em' }}
            >
              Your entire job search, in one workspace.
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
              Upload your resume once, evaluate live roles from company job boards, and export interview-ready, metric-backed applications in minutes — no copying, formatting, or hallucination-checking.
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
                    className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs sm:text-sm rounded-full shadow-elevated transition-all cursor-pointer flex items-center justify-center gap-2 group"
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
                    className="px-5 py-3 bg-card hover:bg-surface text-foreground font-semibold text-xs sm:text-sm rounded-full border border-[rgba(0,0,0,0.12)] shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-brand" />
                    <span>See All Features ↓</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onNavigateToTab('evaluator')}
                    className="px-5 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs sm:text-sm rounded-full shadow-elevated transition-all cursor-pointer flex items-center justify-center gap-2 group"
                  >
                    <span>Explore Live Roles &amp; Tailor Free</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigateToTab('profile')}
                    className="px-5 py-3 bg-card hover:bg-surface text-foreground font-semibold text-xs sm:text-sm rounded-full border border-[rgba(0,0,0,0.12)] shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <FileUp className="w-4 h-4 text-brand" />
                    <span>Upload PDF / Master Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigateToTab('roadmaps')}
                    className="px-4 py-3 bg-surface hover:bg-surface-2 text-foreground font-semibold text-xs sm:text-sm rounded-full border border-border transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Milestone className="w-4 h-4 text-brand" />
                    <span>Browse Roadmaps</span>
                  </button>
                </>
              )}
            </div>

            {/* Social Proof & Infrastructure Counter Metrics */}
            <div className="pt-5 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <div className="text-lg sm:text-xl font-bold text-foreground font-mono">Live</div>
                <div className="text-[10px] text-subtle uppercase tracking-wider font-semibold">Fetched on each search</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-brand font-mono">5 ATS</div>
                <div className="text-[10px] text-subtle uppercase tracking-wider font-semibold">Greenhouse, Ashby, Lever</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-success font-mono">&lt; 2 Minutes</div>
                <div className="text-[10px] text-subtle uppercase tracking-wider font-semibold">JD to Tailored PDF</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-foreground font-mono">0% AI Slop</div>
                <div className="text-[10px] text-subtle uppercase tracking-wider font-semibold">Ground-Truth Verified</div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: DIRECT SIGN-UP / SIGN-IN FORM OR ACTIVE PROFILE CARD */}
          <div className="lg:col-span-5">
            {!isLoggedIn ? (
              <div id="hero-auth-card" className="bg-surface rounded-3xl border border-border shadow-elevated p-5 sm:p-6 space-y-4">
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
                        ? 'bg-card text-foreground shadow-xs font-semibold'
                        : 'text-subtle hover:text-foreground'
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
                        ? 'bg-card text-foreground shadow-xs font-semibold'
                        : 'text-subtle hover:text-foreground'
                    }`}
                  >
                    Sign In
                  </button>
                </div>

                {/* Feedback Alerts */}
                {heroAuthError && (
                  <div className="p-2.5 rounded-xl bg-danger/10 text-danger border border-danger/20 text-xs flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{heroAuthError}</span>
                  </div>
                )}
                {heroAuthSuccess && (
                  <div className="p-2.5 rounded-xl bg-success/10 text-success border border-success/20 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{heroAuthSuccess}</span>
                  </div>
                )}

                {/* Form Inputs */}
                <form onSubmit={handleHeroAuthSubmit} className="space-y-3">
                  {heroAuthMode === 'signup' && (
                    <div>
                      <label className="block text-muted-foreground font-semibold text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <User className="w-3 h-3 text-brand" />
                        <span>Full Name</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={heroFullName}
                        onChange={(e) => setHeroFullName(e.target.value)}
                        placeholder="e.g. Harish Kumar"
                        className="w-full px-3 py-2 bg-card border border-[rgba(0,0,0,0.1)] focus:border-brand rounded-xl text-xs text-foreground outline-none transition-all placeholder-subtle"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-muted-foreground font-semibold text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-brand" />
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={heroEmail}
                      onChange={(e) => setHeroEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3 py-2 bg-card border border-[rgba(0,0,0,0.1)] focus:border-brand rounded-xl text-xs text-foreground outline-none transition-all placeholder-subtle"
                    />
                  </div>

                  <div>
                    <label className="block text-muted-foreground font-semibold text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-brand" />
                      <span>Password</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={heroPassword}
                      onChange={(e) => setHeroPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3 py-2 bg-card border border-[rgba(0,0,0,0.1)] focus:border-brand rounded-xl text-xs text-foreground outline-none transition-all placeholder-subtle"
                    />
                  </div>

                  {heroAuthMode === 'signup' && (
                    <div>
                      <label className="block text-muted-foreground font-semibold text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Briefcase className="w-3 h-3 text-brand" />
                        <span>Target Role / Headline <span className="text-subtle lowercase font-normal">(optional)</span></span>
                      </label>
                      <input
                        type="text"
                        value={heroTargetRole}
                        onChange={(e) => setHeroTargetRole(e.target.value)}
                        placeholder="e.g. Operations Specialist, Staff Engineer, PM"
                        className="w-full px-3 py-2 bg-card border border-[rgba(0,0,0,0.1)] focus:border-brand rounded-xl text-xs text-foreground outline-none transition-all placeholder-subtle"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs rounded-xl shadow-elevated transition-all cursor-pointer flex items-center justify-center gap-2 mt-1"
                  >
                    <span>{heroAuthMode === 'signup' ? 'Create Account & Build Master Profile' : 'Sign In to Workspace'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="pt-2 border-t border-border text-center">
                  <p className="text-[10px] text-subtle mt-1.5 font-medium">
                    Free to get started · No credit card required
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-surface rounded-3xl border border-border shadow-elevated p-6 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-base shadow-xs">
                    {userName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      <span>{userName}</span>
                      <span className="text-[10px] px-2 py-0.2 bg-success/15 text-success rounded-full font-semibold">
                        ● Signed In
                      </span>
                    </div>
                    <div className="text-xs text-subtle font-mono">{userEmail}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-subtle text-[10px] font-bold uppercase tracking-wider">Quick Actions</div>
                  <button
                    type="button"
                    onClick={() => onNavigateToTab('profile')}
                    className="w-full py-2.5 px-3.5 bg-card hover:bg-surface text-brand font-semibold text-xs rounded-xl border border-border shadow-2xs transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <FileUp className="w-4 h-4 text-brand" />
                      <span>Upload PDF / Edit Master Profile</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigateToTab('evaluator')}
                    className="w-full py-2.5 px-3.5 bg-card hover:bg-surface text-foreground font-semibold text-xs rounded-xl border border-border shadow-2xs transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-brand" />
                      <span>Explore Live Jobs</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigateToTab('roadmaps')}
                    className="w-full py-2.5 px-3.5 bg-card hover:bg-surface text-foreground font-semibold text-xs rounded-xl border border-border shadow-2xs transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Milestone className="w-4 h-4 text-brand" />
                      <span>Career Learning Roadmaps</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-subtle">
                  <span>Connected Workspace</span>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="text-danger hover:underline font-semibold cursor-pointer"
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
      <section id="features-tour" className="landing-suite space-y-8 scroll-mt-6">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold tracking-wider uppercase font-mono">
            <Sparkles className="w-3.5 h-3.5 text-brand" />
            COMPLETE APPLICATION SUITE
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-foreground tracking-tight">
            Your job search. One connected workspace.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            From your first resume upload to your next application, keep every part of your job search in one place.
          </p>
        </div>

        {/* 7 Workflow Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Feature 1: Master Profile & Vault */}
          <div className="bg-card rounded-3xl border border-border p-6 sm:p-7 shadow-elevated hover:shadow-elevated transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-brand/10 text-brand flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand bg-brand/10 px-2.5 py-0.5 rounded-full">
                  Step 1 · Master Vault
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground">
                1. Upload PDF &amp; Build Master Profile
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Upload your existing resume PDF once or paste career notes. Gemini AI parses your contact info, employment timeline, and quantitative achievements into your private Master Profile.
              </p>
            </div>
            <div className="pt-3 border-t border-border flex items-center gap-1.5 text-[11px] font-medium text-success">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Zero hallucinations: grounded strictly in your verified facts</span>
            </div>
          </div>

          {/* Feature 2: Live ATS Job Evaluator */}
          <div className="bg-card rounded-3xl border border-border p-6 sm:p-7 shadow-elevated hover:shadow-elevated transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-success/10 text-success flex items-center justify-center font-bold">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-success bg-success/10 px-2.5 py-0.5 rounded-full">
                  Step 2 · Live Roles
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground">
                2. Live ATS Evaluator &amp; Match Score
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connect directly to unauthenticated Greenhouse, Ashby, and Lever corporate backends. Inspect Match Scores (0–100%), required skills, disqualifiers, and keyword gaps before applying.
              </p>
            </div>
            <div className="pt-3 border-t border-border flex items-center gap-1.5 text-[11px] font-medium text-success">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Instant algorithmic ATS qualification test</span>
            </div>
          </div>

          {/* Feature 3: Automated Resume Tailoring */}
          <div className="bg-card rounded-3xl border border-border p-6 sm:p-7 shadow-elevated hover:shadow-elevated transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-info/10 text-info flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-info bg-info/10 px-2.5 py-0.5 rounded-full">
                  Step 3 · 60s Synthesis
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground">
                3. 1-Click ATS Tailored Resume
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Generate high-converting XYZ-formula impact bullets tailored to the target job description. Export clean, ATS-compliant single-page PDFs and editable Word (.docx) files in under 60 seconds.
              </p>
            </div>
            <div className="pt-3 border-t border-border flex items-center gap-1.5 text-[11px] font-medium text-success">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Print-ready PDF &amp; DOCX with 0 watermarks</span>
            </div>
          </div>

          {/* Feature 4: Tailored Cover Letter */}
          <div className="bg-card rounded-3xl border border-border p-6 sm:p-7 shadow-elevated hover:shadow-elevated transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-warning/10 text-warning flex items-center justify-center font-bold">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-warning bg-warning/10 px-2.5 py-0.5 rounded-full">
                  Step 4 · Narrative Cover Letter
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground">
                4. Persuasive Cover Letter Studio
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Craft human-sounding, executive cover letters tailored to the company's culture and specific team bottlenecks. Highlight your most relevant case studies with zero boilerplate AI slop.
              </p>
            </div>
            <div className="pt-3 border-t border-border flex items-center gap-1.5 text-[11px] font-medium text-success">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Personalized directly to the hiring manager</span>
            </div>
          </div>

          {/* Feature 5: 3-Persona Recruiter Review Panel */}
          <div className="bg-card rounded-3xl border border-border p-6 sm:p-7 shadow-elevated hover:shadow-elevated transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-info/10 text-info flex items-center justify-center font-bold">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-info bg-info/10 px-2.5 py-0.5 rounded-full">
                  Step 5 · Stress-Test Panel
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground">
                5. 3-Persona Recruiter Review Panel
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Simulate a hiring committee before applying. Receive honest critique from a Hiring Manager (domain depth), Bar Raiser (leadership impact), and ATS Screener (parser compliance).
              </p>
            </div>
            <div className="pt-3 border-t border-border flex items-center gap-1.5 text-[11px] font-medium text-success">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Fix red flags before human eyes review your profile</span>
            </div>
          </div>

          {/* Feature 6: STAR Portal Q&A & Interview Prep */}
          <div className="bg-card rounded-3xl border border-border p-6 sm:p-7 shadow-elevated hover:shadow-elevated transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-danger/10 text-danger flex items-center justify-center font-bold">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-danger bg-danger/10 px-2.5 py-0.5 rounded-full">
                  Step 6 · STAR Portal Q&amp;A
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground">
                6. STAR Portal Answerer &amp; Interview Prep
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Effortlessly tackle custom essay prompts on job portals with structured Situation-Task-Action-Result answers. Generate behavioral interview simulation questions with instant talking points.
              </p>
            </div>
            <div className="pt-3 border-t border-border flex items-center gap-1.5 text-[11px] font-medium text-success">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>1-click copy-paste into corporate portal forms</span>
            </div>
          </div>

          {/* Feature 7: Kanban Tracker & Career Roadmaps (Spans across all cols) */}
          <div className="bg-card rounded-3xl border border-border p-6 sm:p-7 shadow-elevated hover:shadow-elevated transition-all flex flex-col justify-between space-y-5 md:col-span-2 lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-brand/10 text-brand flex items-center justify-center font-bold">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand bg-brand/10 px-2.5 py-0.5 rounded-full">
                    Step 7 · Lifecycle Management
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  7. Personal Application Kanban Pipeline &amp; Career Roadmaps
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Never lose track of which tailored resume went to which company. Manage all your applications across a personal Kanban board (Applied, Interviewing, Offer, Archived). Explore interactive 2026 Career Roadmaps with salary data and milestone guides.
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-success font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Full version history &amp; application audit trail</span>
                </div>
              </div>

              {/* Visual preview pill card */}
              <div className="bg-surface rounded-2xl p-4 border border-border space-y-2.5 text-xs">
                <div className="text-[11px] font-mono uppercase text-subtle font-semibold">Your Autonomous Journey:</div>
                <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-semibold">
                  <div className="bg-card py-1.5 rounded-lg border border-border text-brand">1. Sign Up</div>
                  <div className="bg-card py-1.5 rounded-lg border border-border text-brand">2. Upload CV</div>
                  <div className="bg-card py-1.5 rounded-lg border border-border text-brand">3. Tailor JD</div>
                  <div className="bg-success py-1.5 rounded-lg text-primary-foreground font-bold">4. Apply</div>
                </div>
                <div className="text-[11px] text-muted-foreground text-center pt-1 font-medium">
                  Create your free account to access all 7 modules instantly.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          EMBEDDED PRICING PLANS AT THE BOTTOM (User Requirement)
         ========================================================================= */}
      <section id="pricing-section" className="space-y-8 pt-4 scroll-mt-6">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold tracking-wider uppercase font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            CLEAR & TRANSPARENT PRICING
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground tracking-tight">
            Choose how much of the search your agent runs.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Free is a functional career workspace, not an artificial countdown. Pro adds unlimited tailoring workflows, clean exports, and deep interview prep. Cancel anytime.
          </p>

          {/* Billing Toggle */}
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

        {/* 2-Tier Pricing Cards: Free vs Pro */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto items-stretch">
          {/* FREE PLAN */}
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
                  CURRENT TIER
                </span>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">Free</h3>
                <p className="text-xs text-subtle mt-1">
                  Explore the live job market & test-drive AI tailoring.
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

              <div className="space-y-2.5 pt-2">
                <span className="text-[11px] font-bold text-foreground uppercase tracking-wider block font-mono">
                  INCLUDED ON FREE:
                </span>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                    <span><strong>2 tailored resumes</strong> every month with ATS keyword alignment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                    <span>Search live jobs across Greenhouse, Ashby, Lever, and Remotive</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                    <span>Access all 2026 Career Roadmaps and curriculum milestones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                    <span>Personal Kanban application tracker for all submissions</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => onNavigateToTab('evaluator')}
                className="w-full py-3 px-4 rounded-full font-semibold text-xs transition-all border border-[rgba(0,0,0,0.12)] text-foreground hover:bg-surface cursor-pointer"
              >
                Start Free Workspace
              </button>
            </div>
          </div>

          {/* PRO PLAN ($9.99/mo) */}
          <div
            className={`bg-card rounded-3xl border-2 p-7 sm:p-8 flex flex-col justify-between transition-all relative ${
              isProUser
                ? 'border-success shadow-elevated'
                : 'border-brand shadow-elevated'
            }`}
          >
            <div className="absolute -top-3 right-6">
              <span className="px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full shadow-xs">
                MOST POPULAR
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-1.5">
                  <span>Pro</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand/10 text-brand font-mono">
                    UNLIMITED
                  </span>
                </h3>
                <p className="text-xs text-subtle mt-1">
                  Everything you need to run high-intensity, high-converting job searches.
                </p>
              </div>

              <div className="pt-2 border-t border-border">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
                    ${billingCycle === 'monthly' ? '9.99' : '7.99'}
                  </span>
                  <span className="text-xs font-semibold text-subtle">/ month</span>
                </div>
                <p className="text-[11px] text-subtle mt-1">
                  {billingCycle === 'monthly' ? 'Billed monthly · Cancel anytime' : 'Billed annually ($95.88/yr) · Save 20%'}
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <span className="text-[11px] font-bold text-brand uppercase tracking-wider block font-mono">
                  EVERYTHING IN FREE, PLUS:
                </span>
                <ul className="space-y-2 text-xs text-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />
                    <span><strong>Unlimited truthful tailored resumes</strong> & cover letters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />
                    <span><strong>Recruiter Review Panel</strong> (Hiring Manager, Bar Raiser, Screener)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />
                    <span><strong>STAR Method Portal Answerer</strong> for custom ATS application forms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />
                    <span><strong>Clean PDF & editable DOCX downloads</strong> with 0 watermarks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />
                    <span>Offer negotiation battlecards & behavioral interview simulation</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-6">
              {isProUser ? (
                <div className="w-full py-3 px-4 rounded-full font-semibold text-xs bg-success/15 text-success text-center border border-success/30">
                  ✓ Active Pro Plan
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onUpgradeToPro}
                  className="w-full py-3 px-4 rounded-full font-semibold text-xs transition-all bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Upgrade to Pro ($9.99/mo)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
