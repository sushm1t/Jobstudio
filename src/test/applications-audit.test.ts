import { describe, expect, it } from 'vitest';

import {
  applyJobUpdate,
  withCreatedEvent,
  withNewResumeVersion,
} from '@/jobstudio/data/applicationHistory';
import { AppliedJobRecord, TailoredResumeData } from '@/jobstudio/data/defaultData';

const baseJob = (): AppliedJobRecord =>
  withCreatedEvent({
    id: 'app-test-1',
    company_name: 'Revolut',
    job_title: 'Operations Analyst',
    applied_date: '2026-11-01',
    status: 'Applied',
    created_at: 1700000000000,
  });

const resumeSample = (summary: string): TailoredResumeData => ({
  full_name: 'Alex Example',
  email: 's@example.com',
  phone: '',
  location: '',
  linkedin: '',
  tailored_summary: summary,
  skills: ['SQL'],
  experiences: [],
  education: [],
  certifications: [],
});

describe('application audit trail', () => {
  it('logs a created event when an application is added', () => {
    const job = baseJob();
    expect(job.events).toHaveLength(1);
    expect(job.events?.[0]?.type).toBe('created');
    expect(job.resume_versions).toEqual([]);
  });

  it('logs a status_changed event with from and to when the status moves', () => {
    const job = applyJobUpdate(baseJob(), { status: 'Interviewing' });
    expect(job.status).toBe('Interviewing');
    const statusEvent = job.events!.find((e) => e.type === 'status_changed');
    expect(statusEvent).toBeDefined();
    expect(statusEvent!.from_status).toBe('Applied');
    expect(statusEvent!.to_status).toBe('Interviewing');
  });

  it('does not log a status_changed event when the status is unchanged', () => {
    const job = applyJobUpdate(baseJob(), { status: 'Applied' });
    expect(job.events!.some((e) => e.type === 'status_changed')).toBe(false);
  });

  it('logs a details_updated event when a field is edited', () => {
    const job = applyJobUpdate(baseJob(), { notes: 'Recruiter call Friday' });
    const editEvent = job.events!.find((e) => e.type === 'details_updated');
    expect(editEvent).toBeDefined();
    expect(editEvent!.detail).toBe('Notes updated');
  });

  it('appends no event when nothing changed', () => {
    const job = baseJob();
    const updated = applyJobUpdate(job, {});
    expect(updated.events).toHaveLength(1);
  });
});

describe('saved resume versions', () => {
  it('stores the first snapshot as v1 with the application match score', () => {
    const job = withNewResumeVersion(baseJob(), resumeSample('First snapshot'), 82);
    const v1 = job.resume_versions?.[0];
    expect(job.resume_versions).toHaveLength(1);
    expect(v1?.label).toBe('v1');
    expect(v1?.resume.tailored_summary).toBe('First snapshot');
    expect(v1?.match_score).toBe(82);
    expect(job.events!.some((e) => e.type === 'resume_version_saved')).toBe(true);
  });

  it('labels each subsequent snapshot v2, v3, ... without mutating earlier ones', () => {
    const v1 = withNewResumeVersion(baseJob(), resumeSample('First'), 82);
    const v2 = withNewResumeVersion(v1, resumeSample('Second'), 88);
    expect(v2.resume_versions!.map((v) => v.label)).toEqual(['v1', 'v2']);
    expect(v2.resume_versions?.[0]?.resume.tailored_summary).toBe('First');
    expect(v2.resume_versions?.[1]?.resume.tailored_summary).toBe('Second');
  });
});
