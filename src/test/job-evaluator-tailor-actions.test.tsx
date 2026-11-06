import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { JobEvaluatorView } from '@/jobstudio/components/JobEvaluatorView';
import { EMPTY_EVALUATION, type JobOpportunity } from '@/jobstudio/data/defaultData';

afterEach(cleanup);

describe('JobEvaluatorView New Role, Saved Roles Pill Deletion, and Start Fresh', () => {
  const mockOpportunities: JobOpportunity[] = [
    {
      id: 'job-1',
      title: 'Product Support Specialist',
      company: 'Linear',
      location: 'Remote',
      platform: 'Greenhouse',
      applyUrl: 'https://linear.app/careers/1',
      category: 'Incident & Service Ops',
      matchScore: 85,
      matchHighlight: 'Strong ops alignment',
      description: 'Support specialist role description',
    },
    {
      id: 'job-2',
      title: 'Service Experience Representative',
      company: 'Block Imaging',
      location: 'Holt, MI',
      platform: 'Lever',
      applyUrl: 'https://blockimaging.com/careers/2',
      category: 'Real-Time Operations & WFM',
      matchScore: 72,
      matchHighlight: 'Good customer focus',
      description: 'Service experience role description',
    },
  ];

  const baseProps = {
    evaluation: {
      ...EMPTY_EVALUATION,
      job_title: 'Service Experience Representative',
      company_name: 'Block Imaging',
      location_info: 'Headquarters - Holt, MI',
      match_score: 72,
    },
    isEvaluationComplete: false,
    opportunities: mockOpportunities,
    selectedJobId: 'job-2',
    customJobText: '',
    setCustomJobText: vi.fn(),
    customUrl: '',
    setCustomUrl: vi.fn(),
    onEvaluate: vi.fn(),
    isLoading: false,
    onProceedToResume: vi.fn(),
    onSelectPreset: vi.fn(),
    onResetWorkspace: vi.fn(),
    onRemoveOpportunity: vi.fn(),
    onClearOpportunities: vi.fn(),
  };

  it('renders [ + Tailor New Role ] and [ Start Fresh ] in the collapsed discovery summary bar', () => {
    render(<JobEvaluatorView {...baseProps} />);

    const tailorNewRoleBtns = screen.getAllByRole('button', { name: /Tailor New Role/i });
    expect(tailorNewRoleBtns.length).toBeGreaterThanOrEqual(1);

    const startFreshBtns = screen.getAllByRole('button', { name: /Start Fresh/i });
    expect(startFreshBtns.length).toBeGreaterThanOrEqual(1);
  });

  it('clicking [ + Tailor New Role ] unselects previous role, resets workspace, and expands discovery', () => {
    const onSelectPreset = vi.fn();
    const onResetWorkspace = vi.fn();
    const setCustomJobText = vi.fn();
    const setCustomUrl = vi.fn();

    render(
      <JobEvaluatorView
        {...baseProps}
        onSelectPreset={onSelectPreset}
        onResetWorkspace={onResetWorkspace}
        setCustomJobText={setCustomJobText}
        setCustomUrl={setCustomUrl}
      />
    );

    const tailorNewRoleBtn = screen.getAllByRole('button', { name: /Tailor New Role/i })[0]!;
    fireEvent.click(tailorNewRoleBtn);

    expect(onSelectPreset).toHaveBeenCalledWith('');
    expect(onResetWorkspace).toHaveBeenCalled();
    expect(setCustomJobText).toHaveBeenCalledWith('');
    expect(setCustomUrl).toHaveBeenCalledWith('');

    // Role Discovery search inputs are now visible and custom JD is not forced open
    expect(screen.getByPlaceholderText(/Company or URL/i)).toBeInTheDocument();
    const accordion = document.getElementById('custom-jd-accordion') as HTMLDetailsElement;
    expect(accordion.open).toBe(false);
  });

  it('clicking [ Start Fresh ] resets current application draft back to Master Profile', () => {
    const onResetWorkspace = vi.fn();
    const onSelectPreset = vi.fn();

    render(
      <JobEvaluatorView
        {...baseProps}
        onResetWorkspace={onResetWorkspace}
        onSelectPreset={onSelectPreset}
      />
    );

    const startFreshBtn = screen.getAllByRole('button', { name: /Start Fresh/i })[0]!;
    fireEvent.click(startFreshBtn);

    expect(onResetWorkspace).toHaveBeenCalled();
    expect(onSelectPreset).toHaveBeenCalledWith('');
  });

  it('renders delete ✕ icon on each saved role pill and triggers onRemoveOpportunity', () => {
    const onRemoveOpportunity = vi.fn();

    render(
      <JobEvaluatorView
        {...baseProps}
        onRemoveOpportunity={onRemoveOpportunity}
      />
    );

    expect(screen.getByText(/Saved roles:/i)).toBeInTheDocument();
    expect(screen.getByText(/Product Support Specialist @ Linear/i)).toBeInTheDocument();
    expect(screen.getByText(/Service Experience Representative @ Block Imaging/i)).toBeInTheDocument();

    const deleteBtn = screen.getByRole('button', {
      name: /Remove Product Support Specialist from saved roles/i,
    });
    expect(deleteBtn).toBeInTheDocument();

    fireEvent.click(deleteBtn);
    expect(onRemoveOpportunity).toHaveBeenCalledWith('job-1');
  });

  it('renders [ Clear all ] button in saved roles strip and calls onClearOpportunities', () => {
    const onClearOpportunities = vi.fn();

    render(
      <JobEvaluatorView
        {...baseProps}
        onClearOpportunities={onClearOpportunities}
      />
    );

    const clearAllBtn = screen.getByRole('button', { name: /Clear all/i });
    expect(clearAllBtn).toBeInTheDocument();

    fireEvent.click(clearAllBtn);
    expect(onClearOpportunities).toHaveBeenCalled();
  });
});

