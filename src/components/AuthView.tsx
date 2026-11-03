import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  AlertCircle,
} from 'lucide-react';

interface AuthViewProps {
  onLogin: (name: string, email: string) => void;
  onNavigateToTab: (tab: string) => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthView: React.FC<AuthViewProps> = ({
  onLogin,
  onNavigateToTab,
  initialMode = 'signup',
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [targetRole, setTargetRole] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please provide a valid email address.');
      return;
    }

    if (mode === 'signup' && !fullName.trim()) {
      setError('Please provide your full name.');
      return;
    }

    const userName = mode === 'signup' ? fullName.trim() : fullName.trim() || email.split('@')[0];
    onLogin(userName, email.trim());

    setSuccessMessage(
      mode === 'signup'
        ? `Account created for ${userName}! Initializing your Master Profile...`
        : `Welcome back, ${userName}! Opening your workspace...`
    );

    setTimeout(() => {
      onNavigateToTab('profile');
    }, 800);
  };

  const handleDemoLogin = () => {
    onLogin('Sushmit Surendran', 'sushmit.surendran@revolut.com');
    setSuccessMessage('Signed in as Sushmit Surendran. Redirecting to Master Profile...');
    setTimeout(() => {
      onNavigateToTab('profile');
    }, 700);
  };

  return (
    <div className="max-w-xl mx-auto py-8 sm:py-14 px-4 animate-fade-in text-[#1D1D1F]">
      {/* Brand & Eyebrow */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0071E3]/10 text-[#0071E3] text-xs font-semibold tracking-wider uppercase font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0071E3] animate-pulse" />
          <span>AUTONOMOUS CAREER WORKSPACE</span>
        </div>
        <h1
          className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F]"
          style={{ letterSpacing: '-0.03em' }}
        >
          {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6E73] max-w-md mx-auto leading-relaxed">
          {mode === 'signup'
            ? 'Sign up to build your Master Profile. Upload your resume PDF once to auto-tailor across 7.1M+ live roles with zero AI hallucinations.'
            : 'Sign in to access your Master Profile, tailored resumes, and live ATS applications.'}
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.08)] shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-6 sm:p-9 space-y-6">
        {/* Mode Toggle */}
        <div className="flex items-center p-1 bg-[#F5F5F7] rounded-full text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-full transition-all cursor-pointer text-center font-semibold ${
              mode === 'signup'
                ? 'bg-white text-[#1D1D1F] shadow-[0_1px_4px_rgba(0,0,0,0.08)]'
                : 'text-[#86868B] hover:text-[#1D1D1F]'
            }`}
          >
            Create Free Account
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-full transition-all cursor-pointer text-center font-semibold ${
              mode === 'signin'
                ? 'bg-white text-[#1D1D1F] shadow-[0_1px_4px_rgba(0,0,0,0.08)]'
                : 'text-[#86868B] hover:text-[#1D1D1F]'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-[#FF3B30]/10 border border-[#FF3B30]/20 text-xs text-[#D70015] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-[#34C759]/10 border border-[#34C759]/20 text-xs text-[#248A3D] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#0071E3]" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Sushmit Surendran"
                className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent focus:border-[#0071E3] focus:bg-white rounded-2xl text-xs sm:text-sm text-[#1D1D1F] outline-none transition-all placeholder:text-[#86868B]"
                required
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-semibold text-[#1D1D1F] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#0071E3]" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent focus:border-[#0071E3] focus:bg-white rounded-2xl text-xs sm:text-sm text-[#1D1D1F] outline-none transition-all placeholder:text-[#86868B]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-[#1D1D1F] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#0071E3]" />
              <span>Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent focus:border-[#0071E3] focus:bg-white rounded-2xl text-xs sm:text-sm text-[#1D1D1F] outline-none transition-all placeholder:text-[#86868B]"
              required
            />
          </div>

          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#0071E3]" />
                <span>Target Role / Headline (Optional)</span>
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Operations Specialist, Staff Engineer, Product Manager"
                className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent focus:border-[#0071E3] focus:bg-white rounded-2xl text-xs sm:text-sm text-[#1D1D1F] outline-none transition-all placeholder:text-[#86868B]"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold rounded-full shadow-[0_4px_14px_rgba(0,113,227,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2 group text-xs sm:text-sm mt-3"
          >
            <span>
              {mode === 'signup' ? 'Create Account & Build Master Profile' : 'Sign In to Workspace'}
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Demo Login */}
          <div className="pt-3 border-t border-[rgba(0,0,0,0.06)] text-center space-y-2">
            <span className="text-[11px] text-[#86868B]">Want to explore without typing credentials?</span>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 bg-[#F5F5F7] hover:bg-[#EAEAEA] text-[#1D1D1F] font-medium rounded-full transition-all cursor-pointer border border-[rgba(0,0,0,0.06)] flex items-center justify-center gap-2 text-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0071E3]" />
              <span>One-Click Sign In as Sushmit Surendran (Verified Demo)</span>
            </button>
          </div>
        </form>

        {/* Feature Highlights */}
        <div className="pt-4 border-t border-[rgba(0,0,0,0.06)] grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="space-y-1 p-3 rounded-2xl bg-[#F5F5F7]/80">
            <div className="font-semibold text-[11px] text-[#1D1D1F] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#34C759]" />
              <span>Private &amp; Secure</span>
            </div>
            <p className="text-[10px] text-[#86868B] leading-tight">
              Your master career data is private, encrypted, and isolated to your account.
            </p>
          </div>

          <div className="space-y-1 p-3 rounded-2xl bg-[#F5F5F7]/80">
            <div className="font-semibold text-[11px] text-[#1D1D1F] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#0071E3]" />
              <span>PDF Auto-Extract</span>
            </div>
            <p className="text-[10px] text-[#86868B] leading-tight">
              Upload your PDF resume once to populate experiences and skills.
            </p>
          </div>

          <div className="space-y-1 p-3 rounded-2xl bg-[#F5F5F7]/80">
            <div className="font-semibold text-[11px] text-[#1D1D1F] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0071E3]" />
              <span>Instant Tailoring</span>
            </div>
            <p className="text-[10px] text-[#86868B] leading-tight">
              Tailor ATS resumes to 7.1M+ live jobs in under 2 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

