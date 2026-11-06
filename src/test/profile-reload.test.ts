import { test, expect } from 'vitest';
import { saveUserMasterProfile, getUserMasterProfile, createFreshUserProfile } from '@/jobstudio/data/candidateProfiles';
test('different resume survives reload', () => {
  localStorage.setItem('jobstudio_user_name','Account Owner');
  const p = { ...createFreshUserProfile('alex@example.com','Alex Morgan'), masterProfileText:'ALEX' };
  saveUserMasterProfile(p, 'owner@example.com');
  expect(getUserMasterProfile('owner@example.com','Account Owner').masterProfileText).toBe('ALEX');
});
