import {
  AppliedJobRecord,
  ApplicationEvent,
  ApplicationStatus,
  ResumeVersionSnapshot,
  TailoredResumeData,
} from './defaultData';

export type ApplicationEventType = ApplicationEvent['type'];

const newId = (prefix: string): string =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function createApplicationEvent(
  type: ApplicationEventType,
  detail: string,
  extra: Partial<Omit<ApplicationEvent, 'id' | 'at' | 'type' | 'detail'>> = {}
): ApplicationEvent {
  return {
    id: newId('ev'),
    at: Date.now(),
    type,
    detail,
    ...extra,
  };
}

/**
 * Wraps a freshly created application record with its first audit event
 * and an empty resume-version history.
 */
export function withCreatedEvent(
  record: AppliedJobRecord
): AppliedJobRecord {
  return {
    ...record,
    resume_versions: record.resume_versions || [],
    events: [createApplicationEvent('created', 'Application added to tracker')],
  };
}

/**
 * Applies an update to an application and appends audit events for what changed:
 * a status move logs `status_changed` (with from/to), any edited field logs
 * `details_updated`.
 */
export function applyJobUpdate(
  record: AppliedJobRecord,
  updates: Partial<AppliedJobRecord>
): AppliedJobRecord {
  const events: ApplicationEvent[] = [];

  if (updates.status && updates.status !== record.status) {
    events.push(
      createApplicationEvent(
        'status_changed',
        `Status moved from "${record.status}" to "${updates.status}"`,
        { from_status: record.status as ApplicationStatus, to_status: updates.status as ApplicationStatus }
      )
    );
  }

  const detailFields: Array<keyof AppliedJobRecord> = [
    'job_title',
    'company_name',
    'location',
    'platform',
    'apply_url',
    'applied_date',
    'match_score',
    'salary',
    'notes',
    'interview_date',
  ];
  const changedDetailKeys = detailFields.filter(
    (key) =>
      key in updates &&
      (updates as unknown as Record<string, unknown>)[key] !== (record as unknown as Record<string, unknown>)[key]
  );

  if (changedDetailKeys.length > 0) {
    events.push(createApplicationEvent('details_updated', describeDetailChange(changedDetailKeys)));
  }

  if (events.length === 0) {
    return { ...record, ...updates };
  }

  return { ...record, ...updates, events: [...(record.events || []), ...events] };
}

function describeDetailChange(keys: Array<keyof AppliedJobRecord>): string {
  if (keys.length === 1 && keys[0] === 'notes') return 'Notes updated';
  if (keys.includes('match_score')) return 'Application details edited (match score revised)';
  return 'Application details edited';
}

/**
 * Saves the current tailored resume as a labelled, immutable version snapshot
 * on the application and logs a `resume_version_saved` audit event.
 */
export function withNewResumeVersion(
  record: AppliedJobRecord,
  resume: TailoredResumeData,
  matchScore?: number
): AppliedJobRecord {
  const versions = record.resume_versions || [];
  const score = matchScore ?? record.match_score;
  const version: ResumeVersionSnapshot = {
    id: newId('rv'),
    label: `v${versions.length + 1}`,
    saved_at: Date.now(),
    resume,
  };
  if (score !== undefined) {
    version.match_score = score;
  }

  return {
    ...record,
    resume_versions: [...versions, version],
    events: [
      ...(record.events || []),
      createApplicationEvent('resume_version_saved', `Saved resume version ${version.label}`),
    ],
  };
}
