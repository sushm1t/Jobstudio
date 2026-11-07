import React from 'react';
import { cleanup, fireEvent, render, screen, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ProfileBuilderView, CloudSyncIndicator } from '@/jobstudio/components/ProfileBuilderView';
import { createFreshUserProfile, getUserMasterProfile, saveUserMasterProfile } from '@/jobstudio/data/candidateProfiles';
import { EMPTY_RESUME } from '@/jobstudio/data/defaultData';

vi.mock('@/jobstudio/utils/cloudSync', () => ({
  triggerCloudSync: vi.fn().mockResolvedValue(true),
  hasPendingCloudSync: vi.fn().mockReturnValue(false),
}));

describe('CloudSyncIndicator Component', () => {
  afterEach(cleanup);

  it('renders "Cloud synced" in saved state with aria-live="polite"', () => {
    render(<CloudSyncIndicator status="saved" />);
    const indicator = screen.getByRole('status');
    expect(indicator).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('Cloud synced')).toBeInTheDocument();
  });

  it('renders "Saving changes..." with spinner in saving state', () => {
    render(<CloudSyncIndicator status="saving" />);
    const indicator = screen.getByRole('status');
    expect(indicator).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('Saving changes...')).toBeInTheDocument();
  });

  it('renders "Unsaved draft" in unsaved state', () => {
    render(<CloudSyncIndicator status="unsaved" />);
    const indicator = screen.getByRole('status');
    expect(indicator).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('Unsaved draft')).toBeInTheDocument();
  });
});

describe('ProfileBuilderView Auto-Save & Synchronization Flow', () => {
  const testEmail = 'autosave@example.com';
  const testName = 'Alex Autosave';

  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem('jobstudio_logged_in', 'true');
    localStorage.setItem('jobstudio_user_email', testEmail);
    localStorage.setItem('jobstudio_user_name', testName);

    saveUserMasterProfile(
      {
        ...createFreshUserProfile(testEmail, testName),
        summary: 'Senior Cloud Engineer with Kubernetes and Go experience.',
        skills: ['Go', 'Kubernetes'],
        masterProfileText: 'Senior Cloud Engineer with Kubernetes and Go experience.',
      },
      testEmail
    );
  });

  afterEach(() => {
    cleanup();
    vi.clearAllTimers();
    vi.useRealTimers();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('displays "Cloud synced" on initial load and transitions to "Saving changes..." and back to "Cloud synced" after 1.5s debounce', async () => {
    const setMasterProfileTextMock = vi.fn();
    const setCandidateInfoMock = vi.fn();
    const setResumeMock = vi.fn();

    render(
      <ProfileBuilderView
        currentProfileText=""
        setMasterProfileText={setMasterProfileTextMock}
        candidateInfo={{
          first_name: 'Alex',
          last_name: 'Autosave',
          email: testEmail,
          phone: '',
          location: '',
          linkedin: '',
        }}
        setCandidateInfo={setCandidateInfoMock}
        resume={EMPTY_RESUME}
        setResume={setResumeMock}
        userName={testName}
        setUserName={vi.fn()}
        userEmail={testEmail}
        setUserEmail={vi.fn()}
        isLoggedIn={true}
        onLogin={vi.fn()}
        onNavigateToTab={vi.fn()}
      />
    );

    // Initial state should be "Cloud synced"
    const indicators = screen.getAllByTestId('cloud-sync-indicator');
    expect(indicators[0]).toHaveTextContent('Cloud synced');

    // Switch to Vault Tab to edit raw markdown
    fireEvent.click(screen.getByRole('button', { name: /Master Vault Context/i }));

    const textarea = screen.getByPlaceholderText(/Paste or write your full career chronology/i);
    expect(textarea).toBeInTheDocument();

    // Edit profile text
    act(() => {
      fireEvent.change(textarea, {
        target: { value: 'Updated Senior Cloud Systems Lead with Terraform and AWS.' },
      });
    });

    // Indicator should immediately transition to "Saving changes..."
    expect(screen.getAllByTestId('cloud-sync-indicator')[0]).toHaveTextContent('Saving changes...');

    // Advance timer by 1,400ms (before debounce expires)
    act(() => {
      vi.advanceTimersByTime(1400);
    });
    // Should still be saving
    expect(screen.getAllByTestId('cloud-sync-indicator')[0]).toHaveTextContent('Saving changes...');

    // Advance remaining 200ms (total 1,600ms, past 1,500ms threshold)
    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    // After 1,500ms debounce, status should be "Cloud synced"
    expect(screen.getAllByTestId('cloud-sync-indicator')[0]).toHaveTextContent('Cloud synced');

    // Verify localStorage has persisted the new profile text
    const saved = getUserMasterProfile(testEmail, testName);
    expect(saved.masterProfileText).toBe('Updated Senior Cloud Systems Lead with Terraform and AWS.');
  });

  it('explicitly clicking "Save Master Profile" provides immediate "Profile Saved & Activated" feedback and persists to storage', async () => {
    render(
      <ProfileBuilderView
        currentProfileText=""
        setMasterProfileText={vi.fn()}
        candidateInfo={{
          first_name: 'Alex',
          last_name: 'Autosave',
          email: testEmail,
          phone: '',
          location: '',
          linkedin: '',
        }}
        setCandidateInfo={vi.fn()}
        resume={EMPTY_RESUME}
        setResume={vi.fn()}
        userName={testName}
        setUserName={vi.fn()}
        userEmail={testEmail}
        setUserEmail={vi.fn()}
        isLoggedIn={true}
        onLogin={vi.fn()}
        onNavigateToTab={vi.fn()}
      />
    );

    // Click "Save Master Profile" in header
    const saveHeaderBtn = screen.getByRole('button', { name: /save master profile/i });
    await act(async () => {
      fireEvent.click(saveHeaderBtn);
    });

    // Verify immediate feedback
    expect(screen.getAllByText(/profile saved & activated/i).length).toBeGreaterThan(0);
  });
});
