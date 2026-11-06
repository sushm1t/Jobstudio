import { test, expect } from 'vitest';
import { deriveLeveragePoints } from '@/jobstudio/utils/leveragePoints';

test('leverage points come from the user profile, not generic defaults', () => {
  const text = `### CANDIDATE: Alex Morgan\n**Email:** candidate@example.com\n- Managed tour operations for 1,200+ travellers per season across 15 destinations\n- Grew B2B agency partnerships by 30% in one year\n- IATA Travel and Tourism certification holder with vendor negotiation focus`;
  const out = deriveLeveragePoints(text);
  expect(out).toContain('30%');
  expect(out).toContain('IATA');
  expect(out).not.toMatch(/SC-900|SLA downtime/);
});

test('empty profile gives empty leverage points', () => {
  expect(deriveLeveragePoints('')).toBe('');
});

test('contact details are never used as leverage points', () => {
  const text = `Alex Morgan\nContact: candidate@example.com | +91 9876543210 | Bangalore, India | https://linkedin.com/in/samplecandidate\nOperations Leader with 8+ years across travel and tourism\n- Grew B2B agency partnerships by 30% in one year\n- Managed tour operations for 1,200+ travellers per season`;
  const out = deriveLeveragePoints(text);
  expect(out).not.toMatch(/@|linkedin|9876543210|Contact:/i);
  expect(out).toContain('30%');
});
