import { createFileRoute, redirect } from '@tanstack/react-router';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { BusyIndicator } from '@/jobstudio/components/BusyIndicator';

export const Route = createFileRoute('/.lovable/oauth/consent')({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({ authorization_id: typeof search['authorization_id'] === 'string' ? search['authorization_id'] : '' }),
  beforeLoad: async ({ search, location }) => {
    if (!search['authorization_id']) throw new Error('This connection request is missing its authorization ID. Restart the connection from your assistant.');
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (!data.session) throw redirect({ to: '/login', search: { next: location.pathname + location.searchStr + location.hash } });
  },
  loader: async ({ location }) => {
    const id = new URLSearchParams(location.searchStr).get('authorization_id');
    if (!id) throw new Error('This connection request is invalid.');
    const { data, error } = await supabase.auth.oauth.getAuthorizationDetails(id);
    if (error) throw new Error('This connection request is invalid, expired, or unavailable. Restart the connection from your assistant.');
    const target = redirectTarget(data);
    if (typeof target === 'string' && !('client' in data)) throw redirect({ href: target });
    const { data: session } = await supabase.auth.getSession();
    return { details: data, email: session.session?.user.email ?? '' };
  },
  head: () => ({ meta: [
    { title: 'Futureprep — Authorize an assistant connection' },
    { name: 'description', content: 'Review and approve access to your own saved Futureprep career profile and applications.' },
    { property: 'og:title', content: 'Connect your assistant to Futureprep' },
    { property: 'og:description', content: 'Control assistant access to your saved career data.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
  ] }),
  pendingComponent: () => <main className="min-h-screen bg-background text-foreground p-8 flex items-center justify-center"><BusyIndicator label="Loading connection request" /></main>,
  errorComponent: ({ error }) => <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6"><div className="max-w-lg space-y-4"><h1 className="text-2xl font-semibold">Connection unavailable</h1><p role="alert" className="text-muted-foreground">{error instanceof Error ? error.message : 'This connection request could not be loaded.'}</p><Button asChild variant="outline"><a href="/">Back to Futureprep</a></Button></div></main>,
  component: Consent,
});

function redirectTarget(value: unknown): string | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const result = value as { redirect_url?: unknown; redirect_to?: unknown };
  const target = result.redirect_url ?? result.redirect_to;
  return typeof target === 'string' ? target : undefined;
}

function Consent() {
  const { details, email } = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const client = details && 'client' in details ? details.client : null;
  const clientName = client?.name ?? 'your assistant';
  const scope = details && 'scope' in details && typeof details.scope === 'string' ? details.scope : '';
  const redirectUri = details && 'redirect_uri' in details ? String(details.redirect_uri) : '';
  async function decide(approve: boolean) {
    setBusy(true); setError('');
    try {
      const result = approve ? await supabase.auth.oauth.approveAuthorization(authorization_id) : await supabase.auth.oauth.denyAuthorization(authorization_id);
      if (result.error) throw result.error;
      const data = result.data;
      const target = redirectTarget(data);
      if (typeof target !== 'string' || !target) throw new Error('The connection could not finish. Try again.');
      window.location.assign(target);
    } catch { setError(approve ? 'Access was not approved. Please try again.' : 'Cancellation failed. Please try again.'); setBusy(false); }
  }
  return <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
    <section className="w-full max-w-xl space-y-6">
      <BusyIndicator active={busy} label="Finishing account connection" />
      <p className="text-muted-foreground text-sm">Futureprep · Account connection</p>
      <h1 className="text-3xl font-semibold break-words">Connect {clientName} to Futureprep</h1>
      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-border py-4"><span className="break-all">{email}</span><Button variant="ghost" disabled={busy} onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }}>Switch account</Button></div>
      <p>This lets {clientName} use this app as you.</p>
      {redirectUri && <p className="text-sm text-muted-foreground break-all">Return address: {redirectUri}</p>}
      <ul className="list-disc pl-5 space-y-2 text-sm">
        {scope.split(/\s+/).filter(Boolean).map(value => <li key={value}>{value === 'openid' || value === 'profile' ? 'Share your basic profile' : value === 'email' ? 'Share your email address' : `Additional permission requested: ${value}`}</li>)}
        <li>Read your saved career profile (without contact details)</li><li>Read your saved applications, audit history and resume version labels</li>
      </ul>
      <p className="text-sm text-muted-foreground">This does not bypass this app’s permissions or account privacy. These tools do not edit records or submit applications.</p>
      {error && <p role="alert" className="text-destructive">{error}</p>}
      <div className="flex gap-3"><Button disabled={busy} onClick={() => decide(true)}>Approve connection</Button><Button disabled={busy} variant="outline" onClick={() => decide(false)}>Cancel connection</Button></div>
    </section>
  </main>;
}