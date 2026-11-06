import { describe, it, expect } from 'vitest';
import { buildProfileTerms, scoreJobAgainstProfile } from '../jobstudio/utils/profileMatch';

describe('quick fit on full job descriptions', () => {
  const profile = buildProfileTerms('Full stack developer React TypeScript Node.js AWS backend api');

  it('scores lower when the full posting requires skills the profile lacks', () => {
    const job = { title: 'Full-Stack Developer', skills: ['api', 'AWS', 'backend'], descriptionSnippet: 'Build api backend on AWS with React and TypeScript. '.repeat(10) };
    const short = scoreJobAgainstProfile(job, profile);
    const full = scoreJobAgainstProfile(
      { ...job, rawDescription: 'Ruby Rails Ruby Rails PostgreSQL Kafka Ruby Rails Elixir Elixir Golang Golang microservices microservices Kafka PostgreSQL '.repeat(5) },
      profile
    );
    expect(full).toBeLessThan(short);
  });
});

describe('quick fit without a job description', () => {
  it('never rates a title-only listing above Possible fit', async () => {
    const { quickFitTier } = await import('../jobstudio/utils/profileMatch');
    const profile = buildProfileTerms('Research integration engineer software engineering python javascript');
    const score = scoreJobAgainstProfile({ title: 'Research Integration Engineer', department: 'software_engineering' }, profile);
    expect(quickFitTier(score).label).toBe('Possible fit');
  });
});
