import { defineTool } from '@lovable.dev/mcp-js';
import { z } from 'zod';
import { array, readSavedRecord, record, text } from '../records';

export const statuses = ['Applied', 'Under Review', 'Interviewing', 'Offer Received', 'Rejected', 'Archived'] as const;
export default defineTool({
  name: 'list_applications', title: 'List my saved applications',
  description: 'List up to 50 of your saved applications, optionally filtered by status; returns stable IDs for reading application history.',
  inputSchema: { status: z.enum(statuses).optional().describe('Only show applications in this status; omit for all statuses.'), limit: z.number().int().min(1).max(50).default(20).describe('Maximum number of applications to return, from 1 to 50.') },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ status, limit }, ctx) => {
    const applications = array(await readSavedRecord(ctx, 'jobstudio_applied_jobs_')).map(record)
      .filter(job => !status || job['status'] === status).slice(0, limit).map(job => ({
        id: text(job['id']), company: text(job['company_name']), title: text(job['job_title']), status: text(job['status']),
        location: text(job['location']), applied_date: text(job['applied_date']), resume_version_count: array(job['resume_versions']).length,
      }));
    return { content: [{ type: 'text', text: applications.length ? JSON.stringify(applications) : 'No saved applications match this status.' }], structuredContent: { applications } };
  },
});