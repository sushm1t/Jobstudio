import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WelcomeScreen } from '@/jobstudio/components/onboarding/WelcomeScreen';
import { ProductTour } from '@/jobstudio/components/onboarding/ProductTour';
import { GettingStartedChecklist } from '@/jobstudio/components/onboarding/GettingStartedChecklist';
import { TOUR_STEPS } from '@/jobstudio/components/onboarding/tourSteps';
import { sections } from '@/jobstudio/components/WorkspaceNavigation';
import { ProfileBuilderView } from '@/jobstudio/components/ProfileBuilderView';
import { EMPTY_CANDIDATE_INFO, MASTER_BASE_RESUME } from '@/jobstudio/data/defaultData';

afterEach(cleanup);
beforeEach(() => {
  localStorage.clear();
});

describe('Onboarding Flow Alignment with Current Dashboard UI', () => {
  it('renders WelcomeScreen with the 4 core pillars matching the dashboard workflow', () => {
    const onStartTour = vi.fn();
    const onSkip = vi.fn();

    render(<WelcomeScreen userName="Sarah Connor" onStartTour={onStartTour} onSkip={onSkip} />);

    expect(screen.getByRole('heading', { name: "Hi Sarah, let's get you set up." })).toBeInTheDocument();
    expect(screen.getByText('Build your master profile')).toBeInTheDocument();
    expect(screen.getByText('Evaluate target jobs')).toBeInTheDocument();
    expect(screen.getByText('Tailor documents')).toBeInTheDocument();
    expect(screen.getByText('Interview prep & tracking')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Take the 2-minute tour/i }));
    expect(onStartTour).toHaveBeenCalledOnce();

    fireEvent.click(screen.getByRole('button', { name: /Skip, start with my profile/i }));
    expect(onSkip).toHaveBeenCalledOnce();
  });

  it('aligns all 6 tour step titles exactly with the current dashboard navigation tabs', () => {
    const navItems = sections.flatMap((s) => s.items);

    // The sidebar order must follow the sequential 1-2-3-4-5-6 candidate journey (no jumping back and forth)
    expect(navItems.map((n) => n.id)).toEqual([
      'profile',
      'evaluator',
      'resume',
      'screening',
      'applied',
      'roadmaps',
    ]);

    // Step 0: Master Profile
    expect(TOUR_STEPS[0]!.tab).toBe('profile');
    expect(TOUR_STEPS[0]!.title).toBe('Master Profile');
    expect(navItems.find((n) => n.id === 'profile')?.label).toBe('Master Profile');

    // Step 1: Job Evaluator
    expect(TOUR_STEPS[1]!.tab).toBe('evaluator');
    expect(TOUR_STEPS[1]!.title).toBe('Job Evaluator');
    expect(navItems.find((n) => n.id === 'evaluator')?.label).toBe('Job Evaluator');

    // Step 2: Tailored Documents (matches sidebar)
    expect(TOUR_STEPS[2]!.tab).toBe('resume');
    expect(TOUR_STEPS[2]!.title).toBe('Tailored Documents');
    expect(navItems.find((n) => n.id === 'resume')?.label).toBe('Tailored Documents');

    // Step 3: Interview Prep (matches sidebar)
    expect(TOUR_STEPS[3]!.tab).toBe('screening');
    expect(TOUR_STEPS[3]!.title).toBe('Interview Prep');
    expect(navItems.find((n) => n.id === 'screening')?.label).toBe('Interview Prep');

    // Step 4: Applied Jobs
    expect(TOUR_STEPS[4]!.tab).toBe('applied');
    expect(TOUR_STEPS[4]!.title).toBe('Applied Jobs');
    expect(navItems.find((n) => n.id === 'applied')?.label).toBe('Applied Jobs');

    // Step 5: Career Roadmaps
    expect(TOUR_STEPS[5]!.tab).toBe('roadmaps');
    expect(TOUR_STEPS[5]!.title).toBe('Career Roadmaps');
    expect(navItems.find((n) => n.id === 'roadmaps')?.label).toBe('Career Roadmaps');
  });

  it('navigates through ProductTour steps and completes with "Build my profile"', () => {
    const onStep = vi.fn();
    const onClose = vi.fn();

    // Step 0: Master Profile
    const { rerender } = render(<ProductTour step={0} onStep={onStep} onClose={onClose} />);
    expect(screen.getByText('Step 1 of 6')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Master Profile' })).toBeInTheDocument();
    expect(screen.getByText(/Hero AI Fast-Track/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    expect(onStep).toHaveBeenCalledWith(1);

    // Step 2: Tailored Documents
    rerender(<ProductTour step={2} onStep={onStep} onClose={onClose} />);
    expect(screen.getByText('Step 3 of 6')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Tailored Documents' })).toBeInTheDocument();
    expect(screen.getByText(/tailored resume, matching cover letter, and referral outreach messages inline/i)).toBeInTheDocument();

    // Step 3: Interview Prep
    rerender(<ProductTour step={3} onStep={onStep} onClose={onClose} />);
    expect(screen.getByText('Step 4 of 6')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Interview Prep' })).toBeInTheDocument();
    expect(screen.getByText(/Round 2 & Offer Prep/i)).toBeInTheDocument();

    // Final Step (Step 6 / completed)
    rerender(<ProductTour step={6} onStep={onStep} onClose={onClose} />);
    expect(screen.getByText('All done')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: "You're set" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Build my profile/i }));
    expect(onClose).toHaveBeenCalledWith(true);
  });

  it('ensures data-tour="profile-upload" target exists in ProfileBuilderView', () => {
    render(
      <ProfileBuilderView
        currentProfileText=""
        setMasterProfileText={vi.fn()}
        candidateInfo={EMPTY_CANDIDATE_INFO}
        setCandidateInfo={vi.fn()}
        resume={MASTER_BASE_RESUME}
        setResume={vi.fn()}
        userName="Candidate"
        setUserName={vi.fn()}
        userEmail="test@example.com"
        setUserEmail={vi.fn()}
        isLoggedIn={true}
        onLogin={vi.fn()}
        onNavigateToTab={vi.fn()}
      />
    );

    // Element with data-tour="profile-upload" must exist so tour can highlight it
    const uploadTarget = document.querySelector('[data-tour="profile-upload"]');
    expect(uploadTarget).not.toBeNull();
  });

  it('renders GettingStartedChecklist and updates progress based on completed tasks', () => {
    const onOpen = vi.fn();
    const onDismiss = vi.fn();

    const items = [
      { id: 'profile', label: 'Save your Master Profile', tab: 'profile', done: true },
      { id: 'assess', label: 'Assess and tailor a job', tab: 'evaluator', done: false },
      { id: 'track', label: 'Track an application', tab: 'applied', done: false },
      { id: 'roadmap', label: 'Explore a career roadmap', tab: 'roadmaps', done: false },
    ];

    render(<GettingStartedChecklist items={items} onOpen={onOpen} onDismiss={onDismiss} />);

    expect(screen.getByText('Getting started')).toBeInTheDocument();
    expect(screen.getByText('1 of 4')).toBeInTheDocument();

    // Click an item to open its tab
    fireEvent.click(screen.getByText('Assess and tailor a job'));
    expect(onOpen).toHaveBeenCalledWith('evaluator');

    // Click dismiss button
    fireEvent.click(screen.getByRole('button', { name: /Dismiss checklist/i }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });
});

