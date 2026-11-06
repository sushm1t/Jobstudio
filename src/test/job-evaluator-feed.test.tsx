import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { JobEvaluatorView } from '@/jobstudio/components/JobEvaluatorView';
import { EMPTY_EVALUATION } from '@/jobstudio/data/defaultData';

afterEach(cleanup);

describe('JobEvaluatorView - Feed & Count Transparency', () => {
  const mockProps = {
    evaluation: {
      ...EMPTY_EVALUATION,
      job_title: '',
      company_name: '',
    },
    isEvaluationComplete: false,
    opportunities: [],
    selectedJobId: '',
    customJobText: '',
    setCustomJobText: vi.fn(),
    customUrl: '',
    setCustomUrl: vi.fn(),
    onEvaluate: vi.fn(),
    isLoading: false,
    onProceedToResume: vi.fn(),
    onSelectPreset: vi.fn(),
    masterProfileText: 'Staff Software Engineer with deep expertise in Go, Kubernetes, PostgreSQL, TypeScript, and distributed systems.',
  };

  const sampleAnthropicJobs = [
    {
      id: 'gh-1',
      title: 'Customer Operations Lead',
      company: 'Anthropic',
      location: 'San Francisco, CA',
      department: 'Operations',
      platform: 'Greenhouse',
      applyUrl: 'https://boards.greenhouse.io/anthropic/jobs/1',
      rawDescription: 'Manage frontline enterprise support operations and client escalation SLAs.',
      isRemote: false,
      workplaceType: 'Hybrid',
      seniority: 'Mid-Level',
    },
    {
      id: 'gh-2',
      title: 'Staff Software Engineer, Distributed Systems',
      company: 'Anthropic',
      location: 'San Francisco, CA',
      department: 'Engineering',
      platform: 'Greenhouse',
      applyUrl: 'https://boards.greenhouse.io/anthropic/jobs/2',
      rawDescription: 'Build distributed systems with Go, Kubernetes, and PostgreSQL at scale.',
      isRemote: false,
      workplaceType: 'Hybrid',
      seniority: 'Lead / Staff / Director',
    },
  ];

  it('does NOT display inflated "Fetched 400 active roles" banner when positions are loaded', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => ({
        success: true,
        company: 'Anthropic',
        slug: 'anthropic',
        ats: 'Greenhouse',
        totalFound: 400, // raw limit
        jobs: sampleAnthropicJobs,
      }),
    })));

    render(<JobEvaluatorView {...mockProps} />);

    // Click Fetch Live Roles
    const fetchBtn = screen.getByRole('button', { name: /Fetch Live Roles/i });
    fireEvent.click(fetchBtn);

    await waitFor(() => {
      expect(screen.getByText('Staff Software Engineer, Distributed Systems')).toBeInTheDocument();
    });

    // Verify the misleading green banner is NEVER displayed
    expect(screen.queryByText(/Fetched 400 active roles/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/from official GREENHOUSE boards/i)).not.toBeInTheDocument();
  }, 10000);

  it('displays accurate exhaustion state and hides dead Load More button for company boards', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => ({
        success: true,
        company: 'Anthropic',
        slug: 'anthropic',
        ats: 'Greenhouse',
        jobs: sampleAnthropicJobs,
      }),
    })));

    render(<JobEvaluatorView {...mockProps} />);

    // Select Anthropic and crawl
    const fetchBtn = screen.getByRole('button', { name: /Fetch Live Roles/i });
    fireEvent.click(fetchBtn);

    await waitFor(() => {
      expect(screen.getByText('Staff Software Engineer, Distributed Systems')).toBeInTheDocument();
    });

    // In a single-company query, all live positions are loaded in one fetch.
    // The dead "Load More" button MUST NOT be displayed.
    expect(screen.queryByRole('button', { name: /Load More/i })).not.toBeInTheDocument();

    // Instead, the verified exhaustion marker must be displayed
    expect(screen.getByText(/All \d+ live positions loaded/i)).toBeInTheDocument();
    expect(screen.getByText(/Up to date with official/i)).toBeInTheDocument();
  }, 10000);

  it('renders LinkedIn-style dual discovery switcher (Best Matches vs All Open Roles)', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => ({
        success: true,
        company: 'All Companies (Unified 7.1M+ Live Catalogue)',
        slug: 'all',
        ats: 'Direct ATS Network',
        jobs: sampleAnthropicJobs,
      }),
    })));

    render(<JobEvaluatorView {...mockProps} />);

    const fetchBtn = screen.getByRole('button', { name: /Fetch Live Roles/i });
    fireEvent.click(fetchBtn);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Best Matches/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /All Open Roles/i })).toBeInTheDocument();
    });

    // Switching to All Open Roles shows both the matching SWE role and the Customer Operations role
    fireEvent.click(screen.getByRole('button', { name: /All Open Roles/i }));
    expect(screen.getByText('Customer Operations Lead')).toBeInTheDocument();
    expect(screen.getByText('Staff Software Engineer, Distributed Systems')).toBeInTheDocument();
  }, 10000);

  it('filters reactively by Discipline when clicking discipline chips', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => ({
        success: true,
        company: 'Anthropic',
        slug: 'anthropic',
        ats: 'Greenhouse',
        jobs: sampleAnthropicJobs,
      }),
    })));

    render(<JobEvaluatorView {...mockProps} />);

    const fetchBtn = screen.getByRole('button', { name: /Fetch Live Roles/i });
    fireEvent.click(fetchBtn);

    await waitFor(() => {
      expect(screen.getByText(/💻 Engineering/i)).toBeInTheDocument();
    });

    // Switch to All Open Roles first to view all roles
    fireEvent.click(screen.getByRole('button', { name: /All Open Roles/i }));
    expect(screen.getByText('Customer Operations Lead')).toBeInTheDocument();
    expect(screen.getByText('Staff Software Engineer, Distributed Systems')).toBeInTheDocument();

    // Click Engineering discipline chip
    fireEvent.click(screen.getByRole('button', { name: /💻 Engineering/i }));

    // Engineering job remains, Operations job is filtered out
    expect(screen.getByText('Staff Software Engineer, Distributed Systems')).toBeInTheDocument();
    expect(screen.queryByText('Customer Operations Lead')).not.toBeInTheDocument();

    // Click Operations discipline chip
    fireEvent.click(screen.getByRole('button', { name: /⚙️ Operations/i }));
    expect(screen.getByText('Customer Operations Lead')).toBeInTheDocument();
    expect(screen.queryByText('Staff Software Engineer, Distributed Systems')).not.toBeInTheDocument();
  });
});
