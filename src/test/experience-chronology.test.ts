import { describe, it, expect } from 'vitest';
import {
  parseDateRangeEndAndStart,
  sortExperiencesReverseChronological,
} from '@/jobstudio/utils/chronology';
import {
  profileRecordToResume,
  saveUserMasterProfile,
  getUserMasterProfile,
  CandidateProfileRecord,
} from '@/jobstudio/data/candidateProfiles';

describe('Experience Chronology Enforcement', () => {
  describe('parseDateRangeEndAndStart', () => {
    it('parses "Oct 2023 – Present" with en-dash as ongoing', () => {
      const res = parseDateRangeEndAndStart('Oct 2023 – Present');
      expect(res.startYear).toBe(2023);
      expect(res.startMonth).toBe(10);
      expect(res.endYear).toBe(9999);
      expect(res.endMonth).toBe(12);
    });

    it('parses "Oct 2022 – Sep 2023"', () => {
      const res = parseDateRangeEndAndStart('Oct 2022 – Sep 2023');
      expect(res.startYear).toBe(2022);
      expect(res.startMonth).toBe(10);
      expect(res.endYear).toBe(2023);
      expect(res.endMonth).toBe(9);
    });

    it('parses "Sep 2020 – Sep 2022"', () => {
      const res = parseDateRangeEndAndStart('Sep 2020 – Sep 2022');
      expect(res.startYear).toBe(2020);
      expect(res.startMonth).toBe(9);
      expect(res.endYear).toBe(2022);
      expect(res.endMonth).toBe(9);
    });

    it('handles "to", em-dash, and hyphens gracefully', () => {
      const res1 = parseDateRangeEndAndStart('Jan 2019 to Dec 2020');
      expect(res1.startYear).toBe(2019);
      expect(res1.endYear).toBe(2020);

      const res2 = parseDateRangeEndAndStart('2018 — 2021');
      expect(res2.startYear).toBe(2018);
      expect(res2.endYear).toBe(2021);
    });

    it('handles empty or malformed strings without throwing', () => {
      const res = parseDateRangeEndAndStart('');
      expect(res.startYear).toBe(0);
      expect(res.endYear).toBe(0);
    });
  });

  describe('sortExperiencesReverseChronological', () => {
    it('fixes the AI relevance scramble: orders Revolut 2022-2023 before Torc Infotech 2020-2022', () => {
      const scrambledExperiences = [
        {
          title: 'Real-Time Analyst / SME',
          company: 'Revolut Technologies',
          date_range: 'Oct 2023 – Present',
          bullets: ['Operations incident coordination'],
        },
        {
          title: 'Customer Success / Account Management',
          company: 'Torc Infotech Pvt. Ltd.',
          date_range: 'Sep 2020 – Sep 2022',
          bullets: ['SOW authoring and platform proposal'],
        },
        {
          title: 'Support Specialist',
          company: 'Revolut Technologies',
          date_range: 'Oct 2022 – Sep 2023',
          bullets: ['Disputes and chargebacks resolution'],
        },
      ];

      const sorted = sortExperiencesReverseChronological(scrambledExperiences);

      expect(sorted).toHaveLength(3);
      // 1st: Revolut (Oct 2023 - Present)
      expect(sorted[0]!.company).toBe('Revolut Technologies');
      expect(sorted[0]!.date_range).toBe('Oct 2023 – Present');

      // 2nd: Revolut (Oct 2022 - Sep 2023) MUST be above Torc Infotech
      expect(sorted[1]!.company).toBe('Revolut Technologies');
      expect(sorted[1]!.title).toBe('Support Specialist');
      expect(sorted[1]!.date_range).toBe('Oct 2022 – Sep 2023');

      // 3rd: Torc Infotech (Sep 2020 - Sep 2022) MUST be last
      expect(sorted[2]!.company).toBe('Torc Infotech Pvt. Ltd.');
      expect(sorted[2]!.date_range).toBe('Sep 2020 – Sep 2022');
    });

    it('handles single item or empty arrays safely', () => {
      expect(sortExperiencesReverseChronological([])).toEqual([]);
      const single = [{ title: 'CEO', company: 'Self', date_range: '2024 – Present' }];
      expect(sortExperiencesReverseChronological(single)).toEqual(single);
    });
  });

  describe('Integration with profile record transformation', () => {
    it('ensures profileRecordToResume returns reverse-chronological experiences', () => {
      const mockProfile: CandidateProfileRecord = {
        id: 'test-1',
        name: 'Alex Morgan',
        headline: 'Business Analyst',
        email: 'test@example.com',
        phone: '1234567890',
        location: 'Remote',
        linkedin: 'linkedin.com/in/test',
        summary: 'Experienced analyst',
        skills: ['SQL', 'GenAI'],
        masterProfileText: 'Mock profile text',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        experiences: [
          {
            title: 'Customer Success',
            company: 'Torc Infotech',
            date_range: 'Sep 2020 – Sep 2022',
            location: '',
            bullets: ['Client deliverables'],
          },
          {
            title: 'Support Specialist',
            company: 'Revolut',
            date_range: 'Oct 2022 – Sep 2023',
            location: '',
            bullets: ['Card payments'],
          },
        ],
        education: [],
        certifications: [],
      };

      const resume = profileRecordToResume(mockProfile);

      expect(resume.experiences[0]!.company).toBe('Revolut');
      expect(resume.experiences[1]!.company).toBe('Torc Infotech');
    });

    it('ensures saveUserMasterProfile stores experiences in reverse chronological order', () => {
      const email = 'chronology-test@example.com';
      const mockProfile: CandidateProfileRecord = {
        id: 'test-2',
        name: 'Alex Morgan',
        headline: 'Business Analyst',
        email,
        phone: '1234567890',
        location: 'Remote',
        linkedin: 'linkedin.com/in/test',
        summary: 'Experienced analyst',
        skills: ['SQL'],
        masterProfileText: 'Mock profile text',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        experiences: [
          {
            title: 'Customer Success',
            company: 'Torc Infotech',
            date_range: 'Sep 2020 – Sep 2022',
            location: '',
            bullets: ['Client deliverables'],
          },
          {
            title: 'Analyst',
            company: 'Revolut',
            date_range: 'Oct 2023 – Present',
            location: '',
            bullets: ['Real-time ops'],
          },
        ],
        education: [],
        certifications: [],
      };

      saveUserMasterProfile(mockProfile, email);
      const loaded = getUserMasterProfile(email);

      expect(loaded.experiences[0]!.company).toBe('Revolut');
      expect(loaded.experiences[1]!.company).toBe('Torc Infotech');
    });
  });
});

