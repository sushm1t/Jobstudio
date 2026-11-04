// @ts-nocheck -- ported verbatim from the original project
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
import { supabase } from '@/integrations/supabase/client';

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

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setError('Please provide a valid email address.');
      return;
    }
    if (mode === 'signup' && !fullName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'signup') {
        const { data, error: err } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName.trim(), target_role: targetRole.trim() },
          },
        });
        if (err) throw err;
        if (!data.session) {
          setSuccessMessage(`Check ${email.trim()} for a confirmation link, then sign in.`);
          setMode('signin');
          return;
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (err) throw err;
      }
      setSuccessMessage('Signed in. Opening your workspace...');
      setTimeout(() => onNavigateToTab('profile'), 600);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    try {
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (oauthError) {
        if (oauthError.message.includes('missing OAuth secret') || oauthError.message.includes('Unsupported provider')) {
          setError(
            'Google Sign-In is not enabled yet in your Supabase project (missing OAuth Client ID & Secret). Please sign in with your email and password, or enable Google in your Supabase dashboard (Authentication → Providers → Google).'
          );
        } else {
          setError(oauthError.message || 'Google sign-in failed.');
        }
        return;
      }
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed.');
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 sm:py-14 px-4 animate-fade-in text-foreground">
      {/* Brand & Eyebrow */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold tracking-wider uppercase font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span>AUTONOMOUS CAREER WORKSPACE</span>
        </div>
        <h1
          className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground"
          style={{ letterSpacing: '-0.03em' }}
        >
          {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          {mode === 'signup'
            ? 'Sign up to build your Master Profile. Upload your resume PDF once to tailor it to any role you choose.'
            : 'Sign in to access your Master Profile, tailored resumes, and live ATS applications.'}
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-card rounded-3xl border border-border shadow-elevated p-6 sm:p-9 space-y-6">
        {/* Mode Toggle */}
        <div className="flex items-center p-1 bg-surface rounded-full text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-full transition-all cursor-pointer text-center font-semibold ${
              mode === 'signup'
                ? 'bg-card text-foreground shadow-elevated'
                : 'text-subtle hover:text-foreground'
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
                ? 'bg-card text-foreground shadow-elevated'
                : 'text-subtle hover:text-foreground'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-danger/10 border border-danger/20 text-xs text-danger flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-success/10 border border-success/20 text-xs text-success flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-brand" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full px-4 py-3 bg-surface border border-transparent focus:border-brand focus:bg-card rounded-2xl text-xs sm:text-sm text-foreground outline-none transition-all placeholder:text-subtle"
                required
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-brand" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 bg-surface border border-transparent focus:border-brand focus:bg-card rounded-2xl text-xs sm:text-sm text-foreground outline-none transition-all placeholder:text-subtle"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-brand" />
              <span>Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 bg-surface border border-transparent focus:border-brand focus:bg-card rounded-2xl text-xs sm:text-sm text-foreground outline-none transition-all placeholder:text-subtle"
              required
            />
          </div>

          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-brand" />
                <span>Target Role / Headline (Optional)</span>
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Operations Specialist, Staff Engineer, Product Manager"
                className="w-full px-4 py-3 bg-surface border border-transparent focus:border-brand focus:bg-card rounded-2xl text-xs sm:text-sm text-foreground outline-none transition-all placeholder:text-subtle"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full disabled:opacity-60 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full shadow-elevated transition-all cursor-pointer flex items-center justify-center gap-2 group text-xs sm:text-sm mt-3"
          >
            <span>
              {isSubmitting ? 'Please wait...' : mode === 'signup' ? 'Create Account & Build Master Profile' : 'Sign In to Workspace'}
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="pt-3 border-t border-border text-center space-y-2">
            <span className="text-[11px] text-subtle">or</span>
            <button
              type="button"
              onClick={handleGoogle}
              className="w-full py-2.5 bg-surface hover:bg-surface-2 text-foreground font-medium rounded-full transition-all cursor-pointer border border-border flex items-center justify-center gap-2 text-xs"
            >
              <span>Continue with Google</span>
            </button>
          </div>
        </form>

        {/* Feature Highlights */}
        <div className="pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="space-y-1 p-3 rounded-2xl bg-surface/80">
            <div className="font-semibold text-[11px] text-foreground flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-success" />
              <span>Private &amp; Secure</span>
            </div>
            <p className="text-[10px] text-subtle leading-tight">
              Your master career data is private, encrypted, and isolated to your account.
            </p>
          </div>

          <div className="space-y-1 p-3 rounded-2xl bg-surface/80">
            <div className="font-semibold text-[11px] text-foreground flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-brand" />
              <span>PDF Auto-Extract</span>
            </div>
            <p className="text-[10px] text-subtle leading-tight">
              Upload your PDF resume once to populate experiences and skills.
            </p>
          </div>

          <div className="space-y-1 p-3 rounded-2xl bg-surface/80">
            <div className="font-semibold text-[11px] text-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand" />
              <span>Instant Tailoring</span>
            </div>
            <p className="text-[10px] text-subtle leading-tight">
              Tailor ATS-friendly resumes to live job posts in minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

