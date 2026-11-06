import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ProfileBuilderView } from '@/jobstudio/components/ProfileBuilderView';
import { createFreshUserProfile, getUserMasterProfile } from '@/jobstudio/data/candidateProfiles';
import { MASTER_BASE_RESUME, EMPTY_CANDIDATE_INFO } from '@/jobstudio/data/defaultData';

afterEach(cleanup);
beforeEach(() => localStorage.clear());

describe('Master Profile activation', () => {
  it('saves the latest builder fields to the active evaluation source on the first click', () => {
    const email = 'profile-save@example.com';
    const profile = createFreshUserProfile(email, 'Profile Tester');
    localStorage.setItem(`jobstudio_master_profile_${email}`, JSON.stringify(profile));
    const setMasterProfileText = vi.fn();
    render(<ProfileBuilderView
      currentProfileText="" setMasterProfileText={setMasterProfileText}
      candidateInfo={EMPTY_CANDIDATE_INFO} setCandidateInfo={vi.fn()}
      resume={MASTER_BASE_RESUME} setResume={vi.fn()}
      userName="Profile Tester" setUserName={vi.fn()}
      userEmail={email} setUserEmail={vi.fn()} isLoggedIn
      onLogin={vi.fn()} onNavigateToTab={vi.fn()}
    />);
    fireEvent.click(screen.getByRole('button', { name: 'Interactive Resume Builder' }));
    const summary = screen.getAllByRole('textbox').find(el => el.tagName === 'TEXTAREA');
    if (!summary) throw new Error('Summary field not found');
    fireEvent.change(summary, { target: { value: 'Verified payroll operations experience' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save & Activate Master Profile' }));
    expect(setMasterProfileText).toHaveBeenLastCalledWith(expect.stringContaining('Verified payroll operations experience'));
    expect(getUserMasterProfile(email, 'Profile Tester').masterProfileText).toContain('Verified payroll operations experience');
  });
});