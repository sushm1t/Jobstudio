import { describe, expect, it } from 'vitest';
import { generatePlainTextResume, generateVectorResumePdf } from '@/jobstudio/utils/pdfExport';
import { MASTER_BASE_RESUME } from '@/jobstudio/data/defaultData';

const resume = {
  ...MASTER_BASE_RESUME,
  projects: [{
    name: 'LendLoop', role: 'Full-Stack Developer',
    target_alignment: 'Demonstrates Fluence take-home specification proficiency across Next.js, Clerk, Convex, and n8n.',
    description: 'Neighborhood tool-lending platform.',
    bullets: ['Built authenticated lending workflows using Next.js.'],
  }],
};

describe('resume project content', () => {
  it('exports factual project content without internal alignment commentary as text', () => {
    const text = generatePlainTextResume(resume);
    expect(text).toContain('LENDLOOP | Full-Stack Developer');
    expect(text).toContain('Built authenticated lending workflows using Next.js.');
    expect(text).not.toContain('Demonstrates Fluence');
  });
  it('excludes the same internal commentary from the PDF', () => {
    const pdf = generateVectorResumePdf(resume).output();
    expect(pdf).toContain('LendLoop');
    expect(pdf).not.toContain('Demonstrates Fluence');
  });
});