import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { ProfileBuilderView } from '@/jobstudio/components/ProfileBuilderView';
import { createFreshUserProfile, getUserMasterProfile, saveUserMasterProfile, resetUserMasterProfile } from '@/jobstudio/data/candidateProfiles';
import { MASTER_BASE_RESUME, EMPTY_CANDIDATE_INFO } from '@/jobstudio/data/defaultData';

const email = 'career-switch@example.com';
beforeEach(() => {
  localStorage.clear();
  saveUserMasterProfile({ ...createFreshUserProfile(email, 'Career Tester'), summary: 'Old engineering career', skills: ['Python'], phone: '12345', masterProfileText: 'Old engineering career' }, email);
});
afterEach(cleanup);

function mount() {
  const setMasterProfileText = vi.fn();
  const setResume = vi.fn();
  const onProfileReset = vi.fn();
  render(<ProfileBuilderView currentProfileText="Old engineering career" setMasterProfileText={setMasterProfileText}
    candidateInfo={EMPTY_CANDIDATE_INFO} setCandidateInfo={vi.fn()} resume={MASTER_BASE_RESUME} setResume={setResume}
    userName="Career Tester" setUserName={vi.fn()} userEmail={email} setUserEmail={vi.fn()} isLoggedIn
    onLogin={vi.fn()} onNavigateToTab={vi.fn()} onProfileReset={onProfileReset} />);
  return { setMasterProfileText, setResume, onProfileReset };
}

it('edits and saves existing profile fields without clearing existing skills', () => {
  const { setMasterProfileText } = mount();
  fireEvent.click(screen.getByRole('button', { name: 'Edit existing profile' }));
  fireEvent.change(screen.getByDisplayValue('Old engineering career'), { target: { value: 'New travel operations career' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save & Activate Master Profile' }));
  expect(getUserMasterProfile(email, 'Career Tester').summary).toBe('New travel operations career');
  expect(getUserMasterProfile(email, 'Career Tester').skills).toEqual(['Python']);
  expect(setMasterProfileText).toHaveBeenCalledWith(expect.stringContaining('New travel operations career'));
});

it('canceling deletion leaves the stored and active profile untouched', () => {
  const { onProfileReset } = mount();
  fireEvent.click(screen.getByRole('button', { name: 'Delete entire profile' }));
  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(getUserMasterProfile(email, 'Career Tester').masterProfileText).toBe('Old engineering career');
  expect(onProfileReset).not.toHaveBeenCalled();
});

it('confirmed deletion clears old profile and active resume while retaining saved applications', () => {
  localStorage.setItem('jobstudio_applied_jobs_' + email, '[{"id":"saved-application"}]');
  const { setMasterProfileText, setResume, onProfileReset } = mount();
  fireEvent.click(screen.getByRole('button', { name: 'Delete entire profile' }));
  fireEvent.click(screen.getByRole('button', { name: 'Delete and start fresh' }));
  const restored = getUserMasterProfile(email, 'Career Tester');
  expect(restored.masterProfileText).toBe('');
  expect(restored.summary).toBe('');
  expect(restored.skills).toEqual([]);
  expect(restored.experiences).toEqual([]);
  expect(restored.phone).toBe('');
  expect(restored.name).toBe('');
  expect(setMasterProfileText).toHaveBeenLastCalledWith('');
  expect(setResume).toHaveBeenCalledWith(expect.objectContaining({ tailored_summary: '', skills: [], experiences: [] }));
  expect(onProfileReset).toHaveBeenCalledOnce();
  expect(localStorage.getItem('jobstudio_applied_jobs_' + email)).toBe('[{"id":"saved-application"}]');
});

it('a reset does not restore demo profile data when the account name contains a previous demo name', () => {
  resetUserMasterProfile(email);
  expect(getUserMasterProfile(email, 'Former Demo Tester').masterProfileText).toBe('');
  expect(getUserMasterProfile(email, 'Former Demo Tester').skills).toEqual([]);
});