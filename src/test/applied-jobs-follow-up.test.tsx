import React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AppliedJobsView,
  getDaysSinceApplied,
  isFollowUpDue,
  generateFollowUpEmail,
} from '@/jobstudio/components/AppliedJobsView';
import { AppliedJobRecord } from '@/jobstudio/data/defaultData';

afterEach(cleanup);

const sixDaysAgoMs = Date.now() - 6 * 24 * 60 * 60 * 1000;
const sixDaysAgoDateStr = new Date(sixDaysAgoMs).toISOString().split('T')[0];

const jobDue: AppliedJobRecord = {
  id: 'job-1',
  job_title: 'Senior Operations Lead',
  company_name: 'Stripe',
  applied_date: sixDaysAgoDateStr,
  created_at: sixDaysAgoMs,
  status: 'Applied',
  match_score: 94,
  location: 'Remote',
  platform: 'Greenhouse',
  apply_url: 'https://boards.greenhouse.io/stripe/jobs/123',
};

const jobRecent: AppliedJobRecord = {
  id: 'job-2',
  job_title: 'Fintech Operations Analyst',
  company_name: 'Revolut',
  applied_date: new Date().toISOString().split('T')[0],
  created_at: Date.now(),
  status: 'Applied',
  match_score: 88,
  location: 'London / Remote',
};

const jobFollowedUp: AppliedJobRecord = {
  id: 'job-3',
  job_title: 'Staff Product Ops Specialist',
  company_name: 'Adyen',
  applied_date: sixDaysAgoDateStr,
  created_at: sixDaysAgoMs,
  status: 'Under Review',
  match_score: 91,
  followed_up_at: 'Nov 6, 2026',
};

describe('Task 10: Automated Follow-Up Reminders & Email Generator', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('correctly calculates days since application', () => {
    expect(getDaysSinceApplied(jobDue)).toBeGreaterThanOrEqual(5);
    expect(getDaysSinceApplied(jobRecent)).toBe(0);
  });

  it('identifies when follow-up is due (>= 5 days, Applied or Under Review, not yet followed up)', () => {
    expect(isFollowUpDue(jobDue)).toBe(true);
    expect(isFollowUpDue(jobRecent)).toBe(false);
    expect(isFollowUpDue(jobFollowedUp)).toBe(false); // already has followed_up_at
  });

  it('generates a professional 3-paragraph tailored follow-up email', () => {
    const email = generateFollowUpEmail(jobDue, 'Alex Rivera');
    expect(email.recipient).toBe('Recruiter / Hiring Team at Stripe');
    expect(email.subject).toContain('Following up on application for Senior Operations Lead – Alex Rivera');
    expect(email.body).toContain('Dear Hiring Team at Stripe');
    expect(email.body).toContain(sixDaysAgoDateStr);
    expect(email.body).toContain('operational efficiency');
    expect(email.body).toContain('Alex Rivera');
  });

  it('displays amber follow-up due badge for jobs applied >= 5 days ago in List View', () => {
    render(
      <AppliedJobsView
        appliedJobs={[jobDue, jobRecent]}
        onAddJob={vi.fn()}
        onUpdateJob={vi.fn()}
        onDeleteJob={vi.fn()}
        candidateName="Alex Rivera"
      />
    );

    // Switch to List View
    const listBtn = screen.getByTitle(/List view/i);
    fireEvent.click(listBtn);

    // Amber reminder badge is visible for jobDue
    expect(screen.getByText(/⏰ Follow up due/i)).toBeInTheDocument();
    // 1-Click action button is visible
    expect(screen.getAllByRole('button', { name: /Generate Follow-Up Email/i }).length).toBeGreaterThanOrEqual(1);
  });

  it('displays green "Followed up on [Date]" badge when already followed up', () => {
    render(
      <AppliedJobsView
        appliedJobs={[jobFollowedUp]}
        onAddJob={vi.fn()}
        onUpdateJob={vi.fn()}
        onDeleteJob={vi.fn()}
        candidateName="Alex Rivera"
      />
    );

    // Switch to List View
    const listBtn = screen.getByTitle(/List view/i);
    fireEvent.click(listBtn);

    expect(screen.getByText(/Followed up on Nov 6, 2026/i)).toBeInTheDocument();
    expect(screen.queryByText(/⏰ Follow up due/i)).not.toBeInTheDocument();
  });

  it('opens follow-up email modal, allows copying email, and marks as followed up', async () => {
    const onUpdateJob = vi.fn();
    render(
      <AppliedJobsView
        appliedJobs={[jobDue]}
        onAddJob={vi.fn()}
        onUpdateJob={onUpdateJob}
        onDeleteJob={vi.fn()}
        candidateName="Alex Rivera"
      />
    );

    // Switch to list view
    const listBtn = screen.getByTitle(/List view/i);
    fireEvent.click(listBtn);

    const followUpBtn = screen.getByRole('button', { name: /Generate Follow-Up Email/i });
    fireEvent.click(followUpBtn);

    // Modal opens
    expect(screen.getByRole('dialog', { name: /Generate Follow-Up Email/i })).toBeInTheDocument();
    expect(screen.getByText(/Recruiter \/ Hiring Team at Stripe/i)).toBeInTheDocument();
    expect(screen.getByText(/Following up on application for Senior Operations Lead/i)).toBeInTheDocument();

    // Copy action
    const copyBtn = screen.getByRole('button', { name: /Copy Email/i });
    fireEvent.click(copyBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(screen.getByText(/Copied Email/i)).toBeInTheDocument();

    // Mark as Followed Up action
    const markBtn = screen.getByRole('button', { name: /Mark as Followed Up/i });
    act(() => {
      fireEvent.click(markBtn);
    });

    expect(onUpdateJob).toHaveBeenCalledWith('job-1', expect.objectContaining({
      followed_up_at: expect.any(String),
    }));
    expect(screen.getByText(/Marked as Followed Up!/i)).toBeInTheDocument();
  });
});

