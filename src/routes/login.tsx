import { createFileRoute, ClientOnly, useNavigate } from '@tanstack/react-router';
import { lazy, Suspense, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { oauthReturnPath } from '@/lib/oauth-return-path';
import { BusyIndicator } from '@/jobstudio/components/BusyIndicator';

const AuthView = lazy(() => import('@/jobstudio/components/AuthView').then(module => ({ default: module.AuthView })));
export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>) => ({ next: oauthReturnPath(search['next']) }),
  head: () => ({ meta: [
    { title: 'Futureprep — Sign in to connect your account' },
    { name: 'description', content: 'Sign in or create your Futureprep account to authorize your chosen assistant.' },
    { property: 'og:title', content: 'Futureprep account connection' },
    { property: 'og:description', content: 'Securely sign in to authorize an assistant to read your saved career data.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
  ] }),
  component: Login,
});
function Login() {
  const { next } = Route.useSearch();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  useEffect(() => {
    let active = true;
    setShowForm(false);
    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session) { void navigate({ to: next, replace: true }); return; }
      setShowForm(true);
    }).catch(() => {
      if (active) setShowForm(true);
    });
    return () => { active = false; };
  }, [next, navigate]);
  if (!showForm) return <main className="min-h-screen bg-background p-8 flex items-center justify-center"><BusyIndicator label="Opening your workspace" /></main>;
  return <main className="min-h-screen bg-background text-foreground"><ClientOnly><Suspense fallback={<div className="p-8"><BusyIndicator label="Opening sign-in" /></div>}>
    <AuthView next={next} initialMode="signin" onLogin={() => {}} onNavigateToTab={() => { void navigate({ to: next, replace: true }); }} />
  </Suspense></ClientOnly></main>;
}