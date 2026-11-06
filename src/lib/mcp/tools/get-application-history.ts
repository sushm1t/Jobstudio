import { defineTool, ToolError } from '@lovable.dev/mcp-js';
import { z } from 'zod';
import { array, readSavedRecord, record, text } from '../records';

export default defineTool({
  name: 'get_application_history', title: 'Read my application history',
  description: 'Read the latest 100 audit events and saved resume version labels for one of your applications, using its ID from list_applications.',
  inputSchema: { application_id: z.string().min(1).max(200).describe('Stable application ID returned by list_applications.') },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ application_id }, ctx) => {
    const job = array(await readSavedRecord(ctx, 'jobstudio_applied_jobs_')).map(record).find(job => job['id'] === application_id);
    if (!job) throw new ToolError('Application not found in your saved records.');
    const history = {
      id: text(job['id']), company: text(job['company_name']), title: text(job['job_title']), status: text(job['status']),
      events: array(job['events']).slice(-100).map(value => { const event = record(value); return {
        type: text(event['type']), at: typeof event['at'] === 'number' ? event['at'] : null, detail: text(event['detail']),
        from_status: text(event['from_status']), to_status: text(event['to_status']),
      }; }),
      resume_versions: array(job['resume_versions']).slice(-100).map(value => { const version = record(value); return {
        id: text(version['id']), label: text(version['label']), saved_at: typeof version['saved_at'] === 'number' ? version['saved_at'] : null,
      }; }),
    };
    return { content: [{ type: 'text', text: JSON.stringify(history) }], structuredContent: { history } };
  },
});