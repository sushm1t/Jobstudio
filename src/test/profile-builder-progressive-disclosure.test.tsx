import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ProfileBuilderView } from '@/jobstudio/components/ProfileBuilderView';
import { createFreshUserProfile, saveUserMasterProfile, getUserMasterProfile } from '@/jobstudio/data/candidateProfiles';
import { MASTER_BASE_RESUME, EMPTY_CANDIDATE_INFO } from '@/jobstudio/data/defaultData';

const testEmail = 'alex.rivera@example.com';
const testName = 'Alex Rivera';

afterEach(cleanup);
beforeEach(() => {
  localStorage.clear();
});

function mountPopulated(customSummary = 'Experienced Systems Architect') {
  const profile = {
    ...createFreshUserProfile(testEmail, testName),
    headline: 'Senior Systems Architect',
    summary: customSummary,
    phone: '+1 (555) 019-2834',
    location: 'Seattle, WA',
    linkedin: 'https://linkedin.com/in/alex-rivera',
    skills: ['Distributed Systems', 'TypeScript', 'Kubernetes'],
    experiences: [
      {
        title: 'Staff Architect',
        company: 'CloudCore Systems',
        date_range: '2021 – Present',
        location: 'Remote',
        bullets: ['Architected core multi-region event pipeline processing 50M daily events.'],
      },
    ],
    education: [
      {
        degree: 'B.S. in Computer Science',
        institution: 'University of Washington',
        year: '2015 – 2019',
      },
    ],
    certifications: ['AWS Solutions Architect Professional'],
  };
  saveUserMasterProfile(profile, testEmail);

  const setMasterProfileText = vi.fn();
  const setResume = vi.fn();
  const setCandidateInfo = vi.fn();

  render(
    <ProfileBuilderView
      currentProfileText={profile.masterProfileText}
      setMasterProfileText={setMasterProfileText}
      candidateInfo={EMPTY_CANDIDATE_INFO}
      setCandidateInfo={setCandidateInfo}
      resume={MASTER_BASE_RESUME}
      setResume={setResume}
      userName={testName}
      setUserName={vi.fn()}
      userEmail={testEmail}
      setUserEmail={vi.fn()}
      isLoggedIn={true}
      onLogin={vi.fn()}
      onNavigateToTab={vi.fn()}
    />
  );

  return { profile, setMasterProfileText, setResume };
}

function mountUnpopulated() {
  const setMasterProfileText = vi.fn();
  const setResume = vi.fn();

  render(
    <ProfileBuilderView
      currentProfileText=""
      setMasterProfileText={setMasterProfileText}
      candidateInfo={EMPTY_CANDIDATE_INFO}
      setCandidateInfo={vi.fn()}
      resume={MASTER_BASE_RESUME}
      setResume={setResume}
      userName="Candidate"
      setUserName={vi.fn()}
      userEmail={testEmail}
      setUserEmail={vi.fn()}
      isLoggedIn={true}
      onLogin={vi.fn()}
      onNavigateToTab={vi.fn()}
    />
  );

  return { setMasterProfileText, setResume };
}

describe('ProfileBuilderView - Progressive Disclosure', () => {
  it('renders the Hero AI / PDF Fast-Track prominently at the top', () => {
    mountPopulated();

    // Fast-track hero banner exists with clear auto-fill action
    expect(screen.getByRole('heading', { name: /Upload Resume to Auto-Fill Profile/i })).toBeInTheDocument();
    expect(screen.getByText(/Hero AI Fast-Track/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upload PDF/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Paste Text/i })).toBeInTheDocument();
    expect(screen.getByText(/Drag & drop your resume PDF here/i)).toBeInTheDocument();
  });

  it('defaults manual input fields to collapsed when profile is already populated, showing Overview Card', () => {
    mountPopulated('Veteran distributed systems engineer with 8 years of production cloud leadership');

    // Overview card is present
    expect(screen.getByLabelText(/Profile overview card/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: testName })).toBeInTheDocument();
    expect(screen.getByText(/Master Profile Active/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Senior Systems Architect/i).length).toBeGreaterThan(0);

    // Contact details displayed in overview chips
    expect(screen.getByText(testEmail)).toBeInTheDocument();
    expect(screen.getByText('+1 (555) 019-2834')).toBeInTheDocument();
    expect(screen.getByText('Seattle, WA')).toBeInTheDocument();

    // 4 Step metric summaries displayed
    expect(screen.getAllByText(/1 Position/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/3 Skills/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/1 Degrees/i).length).toBeGreaterThan(0);

    // Prominent "Edit Profile" trigger button is present
    const editBtn = screen.getByRole('button', { name: 'Edit Profile' });
    expect(editBtn).toBeInTheDocument();

    // Manual input fields are collapsed (not in DOM before clicking Edit)
    expect(screen.queryByText(/Complete Your Authentic Profile Setup/i)).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/Type a skill/i)).not.toBeInTheDocument();
  });

  it('clicking "Edit Profile" uncollapses the 4 guided steps/accordions', () => {
    mountPopulated();

    // Click Edit Profile trigger
    const editBtn = screen.getByRole('button', { name: 'Edit Profile' });
    fireEvent.click(editBtn);

    // Guided 4-step container appears
    expect(screen.getByText(/Complete Your Authentic Profile Setup/i)).toBeInTheDocument();
    expect(screen.getByText(/4 logical stages/i)).toBeInTheDocument();

    // All 4 logical sections / accordions are rendered
    expect(screen.getAllByText(/1\. Basic Contact & Identity/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/2\. Core Experience & Impact Bullets/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/3\. Key Skills & Projects/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/4\. Education & Certifications/i).length).toBeGreaterThan(0);

    // Section 1 inputs are accessible
    expect(screen.getByPlaceholderText('Your full name')).toHaveValue(testName);
    expect(screen.getByPlaceholderText('name@example.com')).toHaveValue(testEmail);

    // Section 2 experience is rendered
    expect(screen.getByDisplayValue('Staff Architect')).toBeInTheDocument();
    expect(screen.getByDisplayValue('CloudCore Systems')).toBeInTheDocument();

    // Section 3 skills & projects are rendered
    expect(screen.getByText('Distributed Systems')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Kubernetes')).toBeInTheDocument();

    // Section 4 education & certs are rendered
    expect(screen.getByText('B.S. in Computer Science')).toBeInTheDocument();
    expect(screen.getByText('AWS Solutions Architect Professional')).toBeInTheDocument();
  });

  it('allows stepping through from Step 1 to Step 4 and saving changes', () => {
    const { setMasterProfileText } = mountPopulated();

    // Enter edit mode
    fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));

    // Click Next: Core Experience
    fireEvent.click(screen.getByRole('button', { name: /Next: Core Experience/i }));

    // Click Next: Skills & Projects
    fireEvent.click(screen.getByRole('button', { name: /Next: Skills & Projects/i }));

    // Add a new skill in Step 3
    const skillInput = screen.getByPlaceholderText(/Type a skill/i);
    fireEvent.change(skillInput, { target: { value: 'Rust' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add Skill' }));
    expect(screen.getByText('Rust')).toBeInTheDocument();

    // Click Next: Education & Certifications
    fireEvent.click(screen.getByRole('button', { name: /Next: Education & Certifications/i }));

    // Click Save & Finish Editing
    fireEvent.click(screen.getByRole('button', { name: /Save & Finish Editing/i }));

    // Stored profile updated with new skill
    const stored = getUserMasterProfile(testEmail, testName);
    expect(stored.skills).toContain('Rust');
    expect(setMasterProfileText).toHaveBeenCalled();
  });

  it('unpopulated profile opens directly in guided setup mode alongside Hero Fast-Track', () => {
    mountUnpopulated();

    // Hero Fast-track is visible
    expect(screen.getByRole('heading', { name: /Upload Resume to Auto-Fill Profile/i })).toBeInTheDocument();

    // Guided 4-step builder is already open for immediate input
    expect(screen.getAllByText(/1\. Basic Contact & Identity/i).length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText('Your full name')).toBeInTheDocument();
  });
});
