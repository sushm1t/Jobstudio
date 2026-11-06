import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import App from '@/jobstudio/App';

vi.mock('@/integrations/supabase/client', () => ({ supabase: { auth: {
  getSession: async () => ({ data: { session: { user: { id: 'returning-user', email: 'returning@example.com', created_at: '2020-01-01', user_metadata: {} } } } }),
  onAuthStateChange: () => ({ data: { subscription: { unsubscribe: vi.fn() } } }),
} } }));
vi.mock('@/jobstudio/utils/cloudSync', () => ({ installCloudSync: vi.fn(), startCloudSession: vi.fn(), endCloudSession: vi.fn() }));
vi.mock('@/jobstudio/utils/apiAuth', () => ({ installApiAuth: vi.fn(), fetchEntitlement: async () => null }));
vi.mock('@/jobstudio/components/CinematicHome', () => ({ CinematicHome: () => null }));
vi.mock('@/jobstudio/components/HomeView', () => ({ HomeView: ({ onNavigateToTab, onLogin }: any) => <><button onClick={() => onNavigateToTab('auth')}>Landing sign up</button><button onClick={() => onLogin('Name', 'email@example.com')}>Landing login</button></> }));
vi.mock('@/jobstudio/components/JobEvaluatorView', () => ({ JobEvaluatorView: () => <h1>Dashboard test screen</h1> }));
vi.mock('@/jobstudio/components/AuthView', () => ({ AuthView: () => <h1>Login test screen</h1> }));
afterEach(() => { cleanup(); localStorage.clear(); sessionStorage.clear(); });

it('opens a returning signed-in account directly in the dashboard', async () => {
  render(<App />);
  expect(await screen.findByRole('heading', { name: 'Dashboard test screen' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Login test screen' })).toBeNull();
});

it.each(['Landing sign up', 'Landing login'])('bypasses auth from %s while signed in', async name => {
  render(<App />);
  await screen.findByRole('heading', { name: 'Dashboard test screen' });
  fireEvent.click(screen.getByRole('button', { name: 'View website' }));
  fireEvent.click(screen.getByRole('button', { name }));
  expect(await screen.findByRole('heading', { name: 'Dashboard test screen' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Login test screen' })).toBeNull();
});

it.each(['Applied Jobs', 'Career Roadmaps', 'Tailored Documents', 'Interview Prep', 'Master Profile'])('keeps %s open after a refresh', async name => {
  const first = render(<App />);
  await screen.findByRole('heading', { name: 'Dashboard test screen' });
  fireEvent.click(screen.getByRole('button', { name }));
  expect(screen.getByRole('button', { name })).toHaveAttribute('aria-current', 'page');
  first.unmount();
  render(<App />);
  await screen.findByRole('button', { name });
  expect(screen.getByRole('button', { name })).toHaveAttribute('aria-current', 'page');
});