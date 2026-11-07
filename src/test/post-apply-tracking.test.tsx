import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '@/jobstudio/App';
import { PostApplyTrackingBanner } from '@/jobstudio/components/PostApplyTrackingBanner';
import { JobEvaluatorView } from '@/jobstudio/components/JobEvaluatorView';
import { ResumeDocument } from '@/jobstudio/components/ResumeDocument';
import { createFreshUserProfile, saveUserMasterProfile } from '@/jobstudio/data/candidateProfiles';
import { EMPTY_EVALUATION, TailoredResumeData } from '@/jobstudio/data/defaultData';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: async () => ({
        data: {
          session: {
            user: { id: 'test-user-post-apply', email: 'applicant@example.com', user_metadata: { full_name: 'Alex Applicant' } },
          },
        },
      }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
    from: () => ({
      upsert: vi.fn().mockResolvedValue({ error: null }),
      delete: vi.fn().mockResolvedValue({ error: null }),
    }),
  },
}));

vi.mock('@/jobstudio/utils/cloudSync', () => ({
  installCloudSync: vi.fn(),
  startCloudSession: vi.fn(),
  endCloudSession: vi.fn(),
}));

vi.mock('@/jobstudio/components/CinematicHome', () => ({ CinematicHome: () => null }));

describe('PostApplyTrackingBanner Component', () => {
  afterEach(cleanup);

  it('renders correctly when open and fires dismiss callback', () => {
    const onDismiss = vi.fn();
    const onTrack = vi.fn();

    render(
      <PostApplyTrackingBanner
        isOpen={true}
        jobTitle="Staff Product Designer"
        companyName="Figma"
        isTracked={false}
        onTrackAndSave={onTrack}
        onDismiss={onDismiss}
      />
    );

    expect(screen.getByTestId('post-apply-tracking-banner')).toBeInTheDocument();
    expect(screen.getByText(/applying to/i)).toHaveTextContent('Applying to Staff Product Designer at Figma?');
    expect(screen.getByRole('button', { name: /track application & save resume/i })).toBeInTheDocument();

    // Dismiss click
    fireEvent.click(screen.getByLabelText(/dismiss application tracking prompt/i));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('displays "Tracked as Applied" when isTracked is true', () => {
    render(
      <PostApplyTrackingBanner
        isOpen={true}
        jobTitle="Staff Product Designer"
        companyName="Figma"
        isTracked={true}
        onTrackAndSave={vi.fn()}
        onDismiss={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /tracked as applied/i })).toBeInTheDocument();
  });
});

describe('JobEvaluatorView and ResumeDocument "Apply now" Triggers', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('calls onApplyClick and window.open when Apply now link is clicked in JobEvaluatorView', () => {
    const onApplyMock = vi.fn();
    const openSpy = vi.fn();
    vi.stubGlobal('open', openSpy);

    render(
      <JobEvaluatorView
        evaluation={{
          ...EMPTY_EVALUATION,
          job_title: 'Staff Product Designer',
          company_name: 'Figma',
          match_score: 92,
        }}
        isEvaluationComplete={true}
        opportunities={[
          {
            id: 'figma-des',
            title: 'Staff Product Designer',
            company: 'Figma',
            applyUrl: 'https://boards.greenhouse.io/figma/jobs/99',
            description: 'Design enterprise tools',
            matchScore: 92,
          },
        ]}
        selectedJobId="figma-des"
        customJobText=""
        setCustomJobText={vi.fn()}
        customUrl=""
        setCustomUrl={vi.fn()}
        onEvaluate={vi.fn()}
        isLoading={false}
        onProceedToResume={vi.fn()}
        onSelectPreset={vi.fn()}
        onApplyClick={onApplyMock}
        isTracked={false}
      />
    );

    const applyNowLink = screen.getByRole('link', { name: /apply now/i });
    expect(applyNowLink).toBeInTheDocument();
    expect(applyNowLink).toHaveAttribute('href', 'https://boards.greenhouse.io/figma/jobs/99');

    fireEvent.click(applyNowLink);
    expect(openSpy).toHaveBeenCalledWith('https://boards.greenhouse.io/figma/jobs/99', '_blank');
    expect(onApplyMock).toHaveBeenCalledWith('https://boards.greenhouse.io/figma/jobs/99');
  });

  it('calls onApplyClick and window.open when Apply now link is clicked in ResumeDocument', () => {
    const onApplyMock = vi.fn();
    const openSpy = vi.fn();
    vi.stubGlobal('open', openSpy);

    const sampleResume: TailoredResumeData = {
      full_name: 'Alex Rivera',
      email: 'alex@example.com',
      phone: '',
      location: '',
      linkedin: '',
      tailored_summary: 'Tailored resume summary',
      skills: ['Figma'],
      experiences: [],
      education: [],
      certifications: [],
    };

    render(
      <ResumeDocument
        resume={sampleResume}
        setResume={vi.fn()}
        jobTitle="Staff Product Designer"
        companyName="Figma"
        applyUrl="https://boards.greenhouse.io/figma/jobs/99"
        onApplyClick={onApplyMock}
        isTracked={false}
        onTrackApplication={vi.fn()}
      />
    );

    const applyNowLink = screen.getByRole('link', { name: /apply now/i });
    expect(applyNowLink).toBeInTheDocument();

    fireEvent.click(applyNowLink);
    expect(openSpy).toHaveBeenCalledWith('https://boards.greenhouse.io/figma/jobs/99', '_blank');
    expect(onApplyMock).toHaveBeenCalledWith('https://boards.greenhouse.io/figma/jobs/99');
  });
});

describe('Integrated Post-Apply Tracking Flow in App', () => {
  const userEmail = 'applicant@example.com';
  const userName = 'Alex Applicant';

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem('jobstudio_logged_in', 'true');
    localStorage.setItem('jobstudio_user_email', userEmail);
    localStorage.setItem('jobstudio_user_name', userName);

    saveUserMasterProfile(
      {
        ...createFreshUserProfile(userEmail, userName),
        masterProfileText: 'Senior Product Designer with 7+ years building enterprise SaaS and design systems.',
      },
      userEmail
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('clicking Apply now in App opens banner, and clicking Track Application snapshots tailored resume into applied jobs', async () => {
    const openSpy = vi.fn();
    vi.stubGlobal('open', openSpy);

    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => ({
        ok: true,
        json: async () => {
          if (url === '/api/evaluate') {
            return {
              match_score: 88,
              company_name: 'Linear',
              job_title: 'Product Support Specialist',
              location_info: 'Remote',
              tailoring_recommendations: [],
            };
          }
          if (url === '/api/tailor') {
            return {
              tailored_summary: 'Specialized Linear customer diagnostics and triage summary.',
              skills: ['SQL', 'Linear API'],
              experiences: [],
            };
          }
          return {};
        },
      }))
    );

    render(<App />);
    await waitFor(() => expect(localStorage.getItem('jobstudio_logged_in')).toBe('true'));

    // Check banner is initially not visible
    expect(screen.queryByTestId('post-apply-tracking-banner')).toBeNull();

    // Fill in custom job text and custom URL
    const urlInput = screen.getByPlaceholderText(/Or import from job link/i);
    fireEvent.change(urlInput, { target: { value: 'https://jobs.ashbyhq.com/linear/product-support-specialist' } });

    const textarea = screen.getByPlaceholderText(/Paste the full job description/i);
    fireEvent.change(textarea, { target: { value: 'Linear Product Support Specialist Ashby job description' } });

    // Click Assess & Tailor with Custom JD
    const assessBtn = screen.getByRole('button', { name: /assess & tailor with custom jd/i });
    fireEvent.click(assessBtn);

    // After evaluation finishes, the "Apply now" button is visible
    const applyNowLink = await screen.findByRole('link', { name: /apply now/i });
    expect(applyNowLink).toBeInTheDocument();

    // Click "Apply now"
    fireEvent.click(applyNowLink);
    expect(openSpy).toHaveBeenCalled();

    // Verify slide-over banner is displayed at bottom right
    const banner = await screen.findByTestId('post-apply-tracking-banner');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveTextContent(/applying to/i);

    // Click "Track Application & Save Resume"
    const trackBtn = screen.getByRole('button', { name: /track application & save resume/i });
    fireEvent.click(trackBtn);

    // Verify both on-screen button and prompt update to "Tracked as Applied"
    await waitFor(() => {
      const trackedBtns = screen.getAllByRole('button', { name: /tracked as applied/i });
      expect(trackedBtns.length).toBeGreaterThanOrEqual(2);
    });

    // Verify localStorage has the applied job with snapshot
    const stored = JSON.parse(localStorage.getItem(`jobstudio_applied_jobs_${userEmail}`) || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].status).toBe('Applied');
    expect(stored[0].resume_versions).toHaveLength(1);
    expect(stored[0].resume_versions[0].resume.tailored_summary).toBe(
      'Specialized Linear customer diagnostics and triage summary.'
    );
  });
});
