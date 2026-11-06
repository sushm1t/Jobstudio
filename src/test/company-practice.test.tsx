import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { buildPracticeQuestions } from '@/jobstudio/utils/practiceQuestions';
import { buildInterviewPrompt, normalizePracticeQuestion } from '@/jobstudio/utils/interviewPrompt';
import { CompanyFocusPacks } from '@/jobstudio/components/CompanyFocusPacks';
import { createFreshUserProfile, getUserMasterProfile, saveUserMasterProfile } from '@/jobstudio/data/candidateProfiles';
import { handleApi } from '@/server/jobstudio-api';

vi.mock('@/server/api-guard', async (orig) => ({ ...(await orig<any>()), verifyCaller: async () => 'test-user', isPro: async () => false, getTailorUsage: async () => 0 }));

afterEach(() => { cleanup(); vi.unstubAllGlobals(); localStorage.clear(); });

it.each([
  ['Data Scientist', 'Data science & analytics', 'data leakage'],
  ['Operations Manager', 'Operations', 'capacity'],
  ['AI Engineer', 'AI engineering', 'RAG'],
  ['Account Executive', 'Sales & GTM', 'prospect'],
])('uses the %s target role rather than unrelated profile keywords', (role, family, topic) => {
  const result = buildPracticeQuestions(role, '', 'Managed travel operations and partnerships.');
  expect(result.family).toBe(family);
  expect(result.questions.some(q => q.q.includes(topic))).toBe(true);
});

it('builds generation context exclusively from the supplied profile and role', () => {
  const prompt = buildInterviewPrompt('Figma', 'Sales Manager', 'Enterprise prospect discovery', 'Grew tourism partnerships by 20%.');
  expect(prompt).toContain('Grew tourism partnerships by 20%.');
  expect(prompt).toContain('Sales & GTM');
  expect(prompt).not.toMatch(/Surendran|Torc Infotech|Jove|32 person-month|SC-900/);
});

it('does not accept model-generated portal verification or arbitrary source labels', () => {
  const normalized = normalizePracticeQuestion({ question: 'Explain a decision', source: 'Glassdoor verified', isFromPortal: true, category: 'Portal Reported' });
  expect(normalized.isFromPortal).toBe(false);
  expect(normalized.source).toBe('Generated practice — role & saved profile');
  expect(normalized.category).toBe('Behavioral (STAR)');
});

it('keeps separate accounts isolated and does not seed personal facts', () => {
  const first = { ...createFreshUserProfile('one@example.com', 'First Candidate'), masterProfileText: 'Travel partnerships increased 20%.' };
  saveUserMasterProfile(first, 'one@example.com');
  expect(getUserMasterProfile('two@example.com', 'Second Candidate').experiences).toEqual([]);
  expect(getUserMasterProfile('two@example.com', 'Second Candidate').certifications).toEqual([]);
  expect(getUserMasterProfile('one@example.com', 'First Candidate').masterProfileText).toBe('Travel partnerships increased 20%.');
});

it('submits the selected company, actual role, JD and saved profile for personalization', async () => {
  const fetchMock = vi.fn(async (_url: string, _options: { body: string }) => ({ ok: true, json: async () => ({ questions: [{ question: 'How did you grow tourism partnerships?', suggested_answer: 'Use my documented partnerships example.', key_talking_points: [] }] }) }));
  vi.stubGlobal('fetch', fetchMock);
  render(<CompanyFocusPacks companyName="Figma" jobTitle="Sales Manager" jobDescription="Enterprise discovery" masterProfileText="Grew tourism partnerships by 20%." />);
  fireEvent.click(screen.getByRole('button', { name: 'Personalize by role & saved profile' }));
  await screen.findByText('1. How did you grow tourism partnerships?');
  expect(JSON.parse(fetchMock.mock.calls[0]?.[1]?.body || '{}')).toEqual({ companyName: 'Figma', jobTitle: 'Sales Manager', jobDescription: 'Enterprise discovery', masterProfile: 'Grew tourism partnerships by 20%.' });
});

it('automatically anchors to an active custom role company like CertifyOS and synthesizes domain guidance', () => {
  render(
    <CompanyFocusPacks
      companyName="CertifyOS"
      jobTitle="Operations Analyst"
      jobDescription="Healthcare provider credentialing, payor enrollment, and operational SLA tracking."
      masterProfileText="Operations Analyst with 6 years experience in data validation and process rigor."
    />
  );

  // CertifyOS tab is placed first and anchored as active role
  const certifyBtn = screen.getByRole('button', { name: /CertifyOS/i });
  expect(certifyBtn).toBeInTheDocument();
  expect(screen.getAllByText(/Active Role/i).length).toBeGreaterThan(0);

  // Role-anchored guidance heading & badges
  expect(screen.getByText(/Role-anchored company guidance · CertifyOS/i)).toBeInTheDocument();
  expect(screen.getByText(/ACTIVE APPLICATION/i)).toBeInTheDocument();
  expect(screen.getAllByText(/Healthcare Technology & Operations/i).length).toBeGreaterThan(0);

  // Identified culture & operational pillars
  expect(screen.getByText(/IDENTIFIED CULTURE & OPERATIONAL PILLARS:/i)).toBeInTheDocument();
  expect(screen.getByText(/Data Accuracy & Integrity/i)).toBeInTheDocument();
  expect(screen.getByText(/Regulatory & Compliance Rigor/i)).toBeInTheDocument();

  // Domain context & interview strategy cards
  expect(screen.getByText(/Domain & Industry Context/i)).toBeInTheDocument();
  expect(screen.getByText(/Company Interview Strategy/i)).toBeInTheDocument();
});

it('submits the active custom anchored company for personalized practice questions', async () => {
  const fetchMock = vi.fn(async (_url: string, _options: { body: string }) => ({
    ok: true,
    json: async () => ({
      questions: [
        {
          question: 'How do you handle payor enrollment SLA exceptions at CertifyOS?',
          suggested_answer: 'Focus on root-cause analysis and rigorous audit logs.',
          key_talking_points: ['Data audit trail', 'Proactive communication'],
        },
      ],
    }),
  }));
  vi.stubGlobal('fetch', fetchMock);

  render(
    <CompanyFocusPacks
      companyName="CertifyOS"
      jobTitle="Operations Analyst"
      jobDescription="Healthcare credentialing operations"
      masterProfileText="Operations Analyst with 6 years data validation experience."
    />
  );

  fireEvent.click(screen.getByRole('button', { name: 'Personalize by role & saved profile' }));
  await screen.findByText('1. How do you handle payor enrollment SLA exceptions at CertifyOS?');

  const sentBody = JSON.parse(fetchMock.mock.calls[0]?.[1]?.body || '{}');
  expect(sentBody.companyName).toBe('CertifyOS');
  expect(sentBody.jobTitle).toBe('Operations Analyst');
});

it('streamlines company selector by displaying only active company by default and supporting progressive disclosure', () => {
  render(
    <CompanyFocusPacks
      companyName="MyAdvice"
      jobTitle="India Delivery Operations Manager"
      jobDescription="Healthcare practice digital marketing and client operations"
      masterProfileText="Operations Leader with 6 years leading 1,000+ frontline agents and dynamic queues."
    />
  );

  // Active company tab is shown
  expect(screen.getByRole('button', { name: /MyAdvice/i })).toBeInTheDocument();

  // Non-active companies (Revolut, Amazon, Google, Stripe, Figma) are hidden by default to eliminate cognitive load
  expect(screen.queryByRole('button', { name: 'Revolut' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Amazon' })).not.toBeInTheDocument();

  // Single profile evidence grounding card is present
  expect(screen.getByText(/Profile Evidence Grounding/i)).toBeInTheDocument();
  expect(screen.getAllByText(/Operations Leader with 6 years/i).length).toBe(1);

  // Target competencies are labeled per question
  expect(screen.getAllByText(/Target Competency:/i).length).toBeGreaterThan(0);

  // Click Browse Other Companies to expand the curated library
  const browseBtn = screen.getByRole('button', { name: /Browse Other Companies/i });
  fireEvent.click(browseBtn);

  // Now other companies are visible
  expect(screen.getByRole('button', { name: 'Revolut' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Amazon' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Hide Other Companies/i })).toBeInTheDocument();

  // Switching company shows quick return shortcut to active role
  fireEvent.click(screen.getByRole('button', { name: 'Amazon' }));
  expect(screen.getByRole('button', { name: /Return to MyAdvice \(Active Role\)/i })).toBeInTheDocument();

  // Clicking return restores MyAdvice and collapses the secondary list
  fireEvent.click(screen.getByRole('button', { name: /Return to MyAdvice \(Active Role\)/i }));
  expect(screen.queryByRole('button', { name: 'Amazon' })).not.toBeInTheDocument();
});

it('provides a 100-company library with instant search, category filtering, and guidance loading', () => {
  render(
    <CompanyFocusPacks
      companyName=""
      jobTitle="Software Engineer"
      jobDescription="Distributed systems"
      masterProfileText="Full stack developer with 5 years experience."
    />
  );

  // Default featured row displays top anchor companies
  expect(screen.getByRole('button', { name: 'Revolut' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Google' })).toBeInTheDocument();

  // Click expand to open full 100-company directory
  const expandBtn = screen.getByRole('button', { name: /Browse Other Companies \(100\+\)/i });
  fireEvent.click(expandBtn);

  // Directory is open with 100 available badge
  expect(screen.getByText(/100 AVAILABLE/i)).toBeInTheDocument();

  // Search for Netflix
  const searchInput = screen.getByPlaceholderText(/Search 100\+ companies/i);
  fireEvent.change(searchInput, { target: { value: 'Netflix' } });

  // Netflix is shown, Spotify is filtered out
  const netflixBtn = screen.getByRole('button', { name: 'Netflix' });
  expect(netflixBtn).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Spotify' })).not.toBeInTheDocument();

  // Clicking Netflix loads Netflix guidance and culture values
  fireEvent.click(netflixBtn);
  expect(screen.getByText(/Site-verified company guidance · Netflix/i)).toBeInTheDocument();
  expect(screen.getByText(/Freedom & Responsibility/i)).toBeInTheDocument();
  expect(screen.getAllByText(/Selflessness/i).length).toBeGreaterThan(0);
});

it('rejects signed-out API callers', async () => {
  const { verifyCaller } = await vi.importActual<any>('@/server/api-guard');
  expect(await verifyCaller(new Request('http://localhost/api/tailor', { method: 'POST' }))).toBeNull();
});

it('blocks internal network addresses for page fetching', async () => {
  const { unsafeUrlReason } = await vi.importActual<any>('@/server/api-guard');
  for (const u of ['http://127.0.0.1/', 'http://localhost/', 'http://169.254.169.254/latest', 'file:///etc/passwd', 'http://10.0.0.5/', 'http://[::1]/']) expect(unsafeUrlReason(u)).not.toBeNull();
  expect(unsafeUrlReason('https://jobs.lever.co/acme/123')).toBeNull();
});

it('never substitutes fictional achievements when AI answering fails', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 503 })));
  const response = await handleApi(new Request('http://localhost/api/ats/answer-question', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: 'Describe an incident', masterProfile: 'Travel bookings and vendor coordination.' }) }));
  const data = await response.json();
  expect(response.status).toBe(503);
  expect(data.success).toBe(false);
  expect(data.answer).toBeUndefined();
});