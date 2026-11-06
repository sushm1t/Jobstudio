import { defineTool } from '@lovable.dev/mcp-js';
import { array, readSavedRecord, record, strings, text } from '../records';

export default defineTool({
  name: 'get_master_profile',
  title: 'Read my Master Profile',
  description: 'Read your saved career headline, summary, skills, experience, education and certifications; excludes contact information.',
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_args, ctx) => {
    const saved = await readSavedRecord(ctx, 'jobstudio_master_profile_');
    if (!saved) return { content: [{ type: 'text', text: 'No saved Master Profile. Create and save it in the app first.' }] };
    const profile = record(saved);
    const projected = {
      headline: text(profile['headline']), summary: text(profile['summary']), skills: strings(profile['skills']),
      experiences: array(profile['experiences']).map(value => { const exp = record(value); return {
        title: text(exp['title']), company: text(exp['company']), date_range: text(exp['date_range']), bullets: strings(exp['bullets']),
      }; }),
      education: array(profile['education']).map(value => { const edu = record(value); return { degree: text(edu['degree']), institution: text(edu['institution']), year: text(edu['year']) }; }),
      certifications: strings(profile['certifications']),
    };
    return { content: [{ type: 'text', text: JSON.stringify(projected) }], structuredContent: { profile: projected } };
  },
});