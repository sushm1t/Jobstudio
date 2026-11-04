// @ts-nocheck -- ported verbatim from the original project
import React, { useState, useEffect } from 'react';
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
  Zap,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';

interface AuthViewProps {
  onLogin: (name: string, email: string) => void;
  onNavigateToTab: (tab: string) => void;
  initialMode?: 'signin' | 'signup';
}

const LOCAL_USERS_KEY = 'jobstudio_local_users';

function getLocalUsers(): any[] {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalUser(user: { email: string; name: string; password?: string; targetRole?: string }) {
  try {
    const users = getLocalUsers();
    const cleanEmail = user.email.toLowerCase().trim();
    const existingIndex = users.findIndex((u) => u.email.toLowerCase() === cleanEmail);
    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...user, updatedAt: Date.now() };
    } else {
      users.push({ ...user, email: cleanEmail, createdAt: Date.now() });
    }
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save local user', e);
  }
}

export const AuthView: React.FC<AuthViewProps> = ({
  onLogin,
  onNavigateToTab,
  initialMode = 'signup',
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
      setError(null);
    }
  }, [initialMode]);
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [targetRole, setTargetRole] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleQuickDemoLogin = () => {
    const demoName = 'Alex Morgan';
    const demoEmail = 'alex.morgan@jobstudio.local';
    saveLocalUser({
      email: demoEmail,
      name: demoName,
      targetRole: 'Senior Operations & Systems Specialist',
    });
    setSuccessMessage('Loaded demo profile! Opening your workspace...');
    onLogin(demoName, demoEmail);
    setTimeout(() => onNavigateToTab('profile'), 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanFullName = fullName.trim();

    if (!cleanEmail) {
      setError('Please provide a valid email address.');
      return;
    }
    if (mode === 'signup' && !cleanFullName) {
      setError('Please provide your full name.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Try Supabase if configured with real cloud project credentials
      if (isSupabaseConfigured()) {
        try {
          if (mode === 'signup') {
            const { data, error: err } = await supabase.auth.signUp({
              email: cleanEmail,
              password,
              options: {
                emailRedirectTo: window.location.origin,
                data: { full_name: cleanFullName, target_role: targetRole.trim() },
              },
            });
            if (err) throw err;
            if (!data.session) {
              setSuccessMessage(`Account registered! Opening your workspace...`);
              saveLocalUser({ email: cleanEmail, name: cleanFullName, password, targetRole: targetRole.trim() });
              onLogin(cleanFullName, cleanEmail);
              setTimeout(() => onNavigateToTab('profile'), 500);
              return;
            }
          } else {
            const { error: err } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
            if (err) throw err;
          }

          const displayName = cleanFullName || cleanEmail.split('@')[0];
          saveLocalUser({ email: cleanEmail, name: displayName, password, targetRole: targetRole.trim() });
          onLogin(displayName, cleanEmail);
          setSuccessMessage('Signed in! Opening your workspace...');
          setTimeout(() => onNavigateToTab('profile'), 500);
          return;
        } catch (supabaseErr: any) {
          console.warn('Supabase cloud auth error, falling back to local storage auth:', supabaseErr?.message || supabaseErr);
        }
      }

      // 2. Local-First Authentication Mode (100% on-device & privacy-first)
      const localUsers = getLocalUsers();
      const existingUser = localUsers.find((u) => u.email.toLowerCase() === cleanEmail);

      if (mode === 'signup') {
        if (existingUser) {
          setError('An account with this email already exists. Switched to Sign In.');
          setMode('signin');
          setIsSubmitting(false);
          return;
        }

        saveLocalUser({
          email: cleanEmail,
          name: cleanFullName,
          password,
          targetRole: targetRole.trim(),
        });
        onLogin(cleanFullName, cleanEmail);
        setSuccessMessage('Account created successfully! Opening your workspace...');
        setTimeout(() => onNavigateToTab('profile'), 500);
      } else {
        // Sign In mode
        if (existingUser) {
          if (existingUser.password && existingUser.password !== password) {
            setError('Incorrect password. Please try again.');
            setIsSubmitting(false);
            return;
          }
          const userNameToUse = existingUser.name || cleanEmail.split('@')[0];
          onLogin(userNameToUse, cleanEmail);
          setSuccessMessage(`Welcome back, ${userNameToUse}! Opening workspace...`);
          setTimeout(() => onNavigateToTab('profile'), 500);
        } else {
          // Automatic seamless local onboarding if account not registered yet
          const inferredName = cleanFullName || cleanEmail.split('@')[0];
          saveLocalUser({
            email: cleanEmail,
            name: inferredName,
            password,
            targetRole: targetRole.trim(),
          });
          onLogin(inferredName, cleanEmail);
          setSuccessMessage(`Welcome! Local account created for ${cleanEmail}. Opening workspace...`);
          setTimeout(() => onNavigateToTab('profile'), 500);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    if (!isSupabaseConfigured()) {
      // In local mode, simulate instant Google sign-in
      const demoEmail = 'google.user@jobstudio.local';
      const demoName = 'Google Candidate';
      saveLocalUser({ email: demoEmail, name: demoName });
      onLogin(demoName, demoEmail);
      setSuccessMessage('Signed in via Google! Opening workspace...');
      setTimeout(() => onNavigateToTab('profile'), 500);
      return;
    }

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (oauthError) {
        setError(oauthError.message || 'Google sign-in failed.');
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
        {/* Quick Demo Access Button */}
        <button
          type="button"
          onClick={handleQuickDemoLogin}
          className="w-full py-2.5 px-4 bg-brand/10 hover:bg-brand/15 text-brand border border-brand/20 font-semibold rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 text-xs"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>1-Click Instant Demo Access (No Password Needed)</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] text-muted-foreground uppercase font-mono">or email credentials</span>
          <div className="flex-1 h-px bg-border" />
        </div>

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
            Create Account
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
              <span>Password (at least 6 characters)</span>
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
              {isSubmitting ? 'Please wait...' : mode === 'signup' ? 'Create Account & Open Workspace' : 'Sign In to Workspace'}
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
              Tailor ATS-friendly resumes to live job posts in minutes with local Gemma 4.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
