import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import App from '@/jobstudio/App';
import { createFreshUserProfile, saveUserMasterProfile } from '@/jobstudio/data/candidateProfiles';

vi.mock('@/integrations/supabase/client', () => ({ supabase: { auth: {
  getSession: async () => ({ data: { session: { user: { id: 'tailoring-user', email: 'tailoring@example.com', user_metadata: { full_name: 'Tailoring Tester' } } } } }),
  onAuthStateChange: () => ({ data: { subscription: { unsubscribe: vi.fn() } } }),
} } }));
vi.mock('@/jobstudio/utils/cloudSync', () => ({ installCloudSync: vi.fn(), startCloudSession: vi.fn(), endCloudSession: vi.fn() }));
vi.mock('@/jobstudio/components/CinematicHome', () => ({ CinematicHome: () => null }));
vi.mock('@/jobstudio/components/HomeView', () => ({ HomeView: ({ onNavigateToTab }: any) => <button onClick={() => onNavigateToTab('evaluator')}>Open evaluator</button> }));
vi.mock('@/jobstudio/components/JobEvaluatorView', () => ({ JobEvaluatorView: ({ onEvaluate, onProceedToResume, setCustomJobText, onSelectPreset, evaluation, isEvaluationComplete }: any) => <>
  <output data-testid="completed-score">{isEvaluationComplete ? evaluation.match_score : 'pending'}</output>
  <button onClick={() => onSelectPreset('fit-role', { id: 'fit-role', title: 'Operations Manager', company: 'Spotify', description: 'Operations strategy', matchScore: 85 })}>Select opportunity</button>
  <button onClick={() => { setCustomJobText('Palantir Backend Software Engineer'); onEvaluate('Palantir Backend Software Engineer'); }}>Tailor application</button>
  <button onClick={onProceedToResume}>View Resume</button>
</> }));
vi.mock('@/jobstudio/components/ResumeDocument', () => ({ ResumeDocument: ({ resume }: any) => <div data-testid="resume-summary">{resume.tailored_summary}</div> }));

afterEach(() => { cleanup(); vi.unstubAllGlobals(); localStorage.clear(); sessionStorage.clear(); });

it('keeps the generated resume when View Resume changes tabs', async () => {
  localStorage.setItem('jobstudio_logged_in', 'true');
  localStorage.setItem('jobstudio_user_email', 'tailoring@example.com');
  localStorage.setItem('jobstudio_user_name', 'Tailoring Tester');
  saveUserMasterProfile({
    ...createFreshUserProfile('tailoring@example.com', 'Tailoring Tester'),
    masterProfileText: 'Senior Systems Engineer with 6+ years experience in distributed architectures.',
  }, 'tailoring@example.com');
  vi.stubGlobal('fetch', vi.fn(async (url: string) => ({ ok: true, json: async () => url === '/api/evaluate' ? {
    match_score: 45, company_name: 'Palantir', job_title: 'Backend Software Engineer', tailoring_recommendations: [],
  } : url === '/api/tailor' ? {
    tailored_summary: 'Role-specific backend summary for Palantir', skills: ['Python'], experiences: [],
  } : { questions: [] } })));
  render(<App />);
  // Navigate through the real workspace so the App's tab effects run.
  await waitFor(() => expect(localStorage.getItem('jobstudio_logged_in')).toBe('true'));
  await screen.findByRole('button', { name: 'Tailor application' });
  fireEvent.click(screen.getByRole('button', { name: 'Tailor application' }));
  await waitFor(() => expect((window as any).__JOBSTUDIO_ACTIVE_RESUME__?.tailored_summary).toBe('Role-specific backend summary for Palantir'));
  fireEvent.click(screen.getByRole('button', { name: 'View Resume' }));
  expect(screen.getByTestId('resume-summary')).toHaveTextContent('Role-specific backend summary for Palantir');
});

it('withholds an 85-point preliminary score and exposes only the completed 32-point assessment', async () => {
  localStorage.setItem('jobstudio_logged_in', 'true');
  localStorage.setItem('jobstudio_user_email', 'tailoring@example.com');
  localStorage.setItem('jobstudio_user_name', 'Tailoring Tester');
  saveUserMasterProfile({
    ...createFreshUserProfile('tailoring@example.com', 'Tailoring Tester'),
    masterProfileText: 'Senior Systems Engineer with 6+ years experience in distributed architectures.',
  }, 'tailoring@example.com');
  vi.stubGlobal('fetch', vi.fn(async (url: string) => ({ ok: true, json: async () => url === '/api/evaluate' ? {
    match_score: 32, company_name: 'Spotify', job_title: 'Operations Manager', tailoring_recommendations: [],
  } : url === '/api/tailor' ? { tailored_summary: 'Tailored operations resume', skills: [], experiences: [] } : { questions: [] } })));
  render(<App />);
  await screen.findByRole('button', { name: 'Tailor application' });
  fireEvent.click(screen.getByRole('button', { name: 'Select opportunity' }));
  expect(screen.getByTestId('completed-score').textContent).toBe('pending');
  fireEvent.click(screen.getByRole('button', { name: 'Tailor application' }));
  await waitFor(() => expect(screen.getByTestId('completed-score').textContent).toBe('32'));
  fireEvent.click(screen.getByRole('button', { name: 'Select opportunity' }));
  expect(screen.getByTestId('completed-score').textContent).toBe('pending');
});