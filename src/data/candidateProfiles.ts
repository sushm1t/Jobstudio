import { CandidateInfo, TailoredResumeData, MASTER_BASE_RESUME, SUSHMIT_PROFILE_TEXT, SUSHMIT_USER_INFO } from './defaultData';

export interface CandidateProfileRecord {
  id: string;
  isPreset?: boolean;
  name: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  skills: string[];
  experiences: Array<{
    title: string;
    company: string;
    date_range: string;
    location: string;
    bullets: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  certifications: string[];
  masterProfileText: string;
  createdAt: number;
  updatedAt: number;
}

export const SUSHMIT_PROFILE_RECORD: CandidateProfileRecord = {
  id: 'preset-sushmit',
  isPreset: true,
  name: 'Sushmit Surendran',
  headline: 'Operations Specialist & Real-Time Analytics SME',
  email: SUSHMIT_USER_INFO.email,
  phone: SUSHMIT_USER_INFO.phone,
  location: SUSHMIT_USER_INFO.location,
  linkedin: SUSHMIT_USER_INFO.linkedin,
  summary: MASTER_BASE_RESUME.tailored_summary,
  skills: MASTER_BASE_RESUME.skills,
  experiences: MASTER_BASE_RESUME.experiences,
  education: MASTER_BASE_RESUME.education,
  certifications: MASTER_BASE_RESUME.certifications,
  masterProfileText: SUSHMIT_PROFILE_TEXT,
  createdAt: 1700000000000,
  updatedAt: 1700000000000,
};

export const SARAH_CHEN_PROFILE_RECORD: CandidateProfileRecord = {
  id: 'preset-sarah-chen',
  isPreset: true,
  name: 'Sarah Chen',
  headline: 'Senior Full-Stack Software Engineer (React, TypeScript, AWS)',
  email: 'sarah.chen.tech@gmail.com',
  phone: '+1 (415) 890-4421',
  location: 'San Francisco, CA (Open to Remote)',
  linkedin: 'https://linkedin.com/in/sarah-chen-swe',
  summary:
    'Full-Stack Software Engineer with 6 years of experience architecting resilient cloud systems, real-time web applications, and developer platforms. At Veloce Cloud, built event-driven microservices on Node.js/TypeScript and AWS ECS handling 1.5M daily active users with 99.99% availability. Deep expertise across TypeScript, React, Next.js, PostgreSQL, Docker, and distributed systems architecture.',
  skills: [
    'TypeScript & JavaScript (ESNext)',
    'React & Next.js (App Router)',
    'Node.js & Express / NestJS',
    'PostgreSQL & Prisma / Drizzle ORM',
    'Redis Caching & PubSub',
    'Docker & Container Orchestration',
    'AWS (ECS, Lambda, S3, RDS)',
    'REST & GraphQL API Architecture',
    'TailwindCSS & Component Systems',
    'CI/CD Pipelines (GitHub Actions)',
    'Automated Testing (Jest, Playwright)',
    'Distributed Systems & Microservices',
  ],
  experiences: [
    {
      title: 'Senior Full-Stack Engineer',
      company: 'Veloce Cloud Platforms',
      date_range: 'Jan 2022 – Present',
      location: 'San Francisco, CA (Remote)',
      bullets: [
        'Architected and delivered core collaborative workspace platform serving 1.5M daily users, reducing average page load latency from 2.1s to 640ms.',
        'Engineered an asynchronous task queuing pipeline using Redis and AWS SQS, handling 25,000 background jobs/minute with zero message loss.',
        'Pioneered the frontend migration from legacy Webpack single-page architecture to Next.js 14, improving Core Web Vitals (LCP) by 45%.',
        'Standardized automated end-to-end testing with Playwright and GitHub Actions, catching 90+ deployment defects pre-production.',
      ],
    },
    {
      title: 'Full-Stack Software Engineer',
      company: 'Nexa Financial Technologies',
      date_range: 'Aug 2019 – Dec 2021',
      location: 'San Francisco, CA',
      bullets: [
        'Built real-time transaction ledger and merchant payment analytics dashboard in React, TypeScript, and Node.js.',
        'Designed idempotent webhook processing service processing $40M+ in quarterly transaction volumes with PCI-DSS compliance.',
        'Implemented database index optimizations and query caching across PostgreSQL, decreasing median API query response times by 55%.',
      ],
    },
  ],
  education: [
    {
      degree: 'B.S. in Computer Science',
      institution: 'University of California, Berkeley',
      year: '2015 – 2019',
    },
  ],
  certifications: [
    'AWS Certified Solutions Architect – Associate',
    'Meta Certified Senior Frontend Developer',
    'Docker Certified Associate (DCA)',
  ],
  masterProfileText: `### CANDIDATE: Sarah Chen
**Target Roles:** Senior Full-Stack Engineer, Staff Engineer, Frontend Architect
**Contact:** sarah.chen.tech@gmail.com | +1 (415) 890-4421 | San Francisco, CA | https://linkedin.com/in/sarah-chen-swe

### EXECUTIVE SUMMARY
Senior Full-Stack Software Engineer with 6 years of experience architecting resilient cloud systems, real-time web applications, and developer platforms. Built event-driven microservices on Node.js/TypeScript and AWS ECS handling 1.5M daily active users with 99.99% availability. Deep expertise across TypeScript, React, Next.js, PostgreSQL, Docker, and distributed systems architecture.

### CORE TECHNICAL SKILLS
- Languages: TypeScript, JavaScript, Python, SQL, HTML5/CSS3
- Frontend: React 18, Next.js (App Router), TailwindCSS, Redux Toolkit, WebSockets
- Backend & Cloud: Node.js, Express, NestJS, AWS (ECS, Lambda, RDS, S3), Docker, Redis
- Databases & Tools: PostgreSQL, Prisma, GitHub Actions, Jest, Playwright, Linux

### VERIFIED PROFESSIONAL EXPERIENCE
**Veloce Cloud Platforms** | Senior Full-Stack Engineer | Jan 2022 – Present
- Architected and delivered core collaborative workspace platform serving 1.5M daily users, reducing average page load latency from 2.1s to 640ms.
- Engineered an asynchronous task queuing pipeline using Redis and AWS SQS, handling 25,000 background jobs/minute with zero message loss.
- Pioneered the frontend migration from legacy Webpack single-page architecture to Next.js 14, improving Core Web Vitals (LCP) by 45%.

**Nexa Financial Technologies** | Full-Stack Software Engineer | Aug 2019 – Dec 2021
- Built real-time transaction ledger and merchant payment analytics dashboard in React, TypeScript, and Node.js.
- Designed idempotent webhook processing service processing $40M+ in quarterly transaction volumes with PCI-DSS compliance.
`,
  createdAt: 1705000000000,
  updatedAt: 1705000000000,
};

export const MARCUS_VANCE_PROFILE_RECORD: CandidateProfileRecord = {
  id: 'preset-marcus-vance',
  isPreset: true,
  name: 'Marcus Vance',
  headline: 'Lead Product Manager — Growth & B2B SaaS',
  email: 'marcus.vance.pm@gmail.com',
  phone: '+1 (206) 555-0182',
  location: 'Seattle, WA (Remote)',
  linkedin: 'https://linkedin.com/in/marcus-vance-pm',
  summary:
    'Customer-obsessed Lead Product Manager with 6+ years of experience scaling B2B SaaS products from early product-market fit to $15M ARR. Expert in translating complex user workflows into high-impact product roadmaps, running data-driven feature experimentation in SQL and Mixpanel, and orchestrating cross-functional engineering, design, and marketing squads to deliver 30%+ activation and retention gains.',
  skills: [
    'Product Strategy & Vision',
    'B2B SaaS Growth & Self-Serve Funnels',
    'Product Telemetry & Cohort Analytics',
    'SQL & Data Exploration (Looker/Mixpanel)',
    'Agile Scrum & Backlog Prioritization',
    'A/B Testing & Multivariate Experiments',
    'User Research & Customer Discovery',
    'PRD & Technical Requirements Authoring',
    'Enterprise SLA & Compliance Workflows',
    'Go-To-Market (GTM) Orchestration',
  ],
  experiences: [
    {
      title: 'Lead Product Manager, Growth & Retention',
      company: 'PulseMetrics SaaS',
      date_range: 'Mar 2021 – Present',
      location: 'Seattle, WA (Remote)',
      bullets: [
        'Led growth product squad of 8 engineers and 2 product designers, driving end-to-end self-serve onboarding redesign that raised Day-30 user retention from 18% to 31%.',
        'Launched multi-tier pricing and self-serve team seat upgrade flow that increased self-serve expansion ARR by 44% ($2.8M annual run-rate).',
        'Instrumented comprehensive product telemetry tracking funnel event drops in Mixpanel, isolating friction points and cutting account setup abandonment by 26%.',
        'Managed bi-weekly sprint planning, backlog grooming, and executive stakeholder reviews using Jira and Linear.',
      ],
    },
    {
      title: 'Product Manager, Platform & Analytics',
      company: 'CloudScale Intelligence',
      date_range: 'Jan 2018 – Feb 2021',
      location: 'Seattle, WA',
      bullets: [
        'Shipped enterprise reporting dashboard and customizable executive export suite adopted by 70+ Fortune 500 accounts.',
        'Conducted 60+ in-depth user interviews with VP of Operations stakeholders to define PRD requirements for automated compliance logging.',
        'Partnered with customer success to reduce churn by 14% through proactive in-app health scoring and guided onboarding checklists.',
      ],
    },
  ],
  education: [
    {
      degree: 'B.A. in Informatics & Business Administration',
      institution: 'University of Washington',
      year: '2014 – 2018',
    },
  ],
  certifications: [
    'Certified Scrum Product Owner (CSPO) — Scrum Alliance',
    'Pragmatic Institute Certified (PMC-III)',
    'Reforge Product Strategy & Growth Series',
  ],
  masterProfileText: `### CANDIDATE: Marcus Vance
**Target Roles:** Lead Product Manager, Principal PM, Director of Product
**Contact:** marcus.vance.pm@gmail.com | +1 (206) 555-0182 | Seattle, WA | https://linkedin.com/in/marcus-vance-pm

### EXECUTIVE SUMMARY
Customer-obsessed Lead Product Manager with 6+ years of experience scaling B2B SaaS products from early product-market fit to $15M ARR. Expert in translating complex user workflows into high-impact product roadmaps, running data-driven feature experimentation in SQL and Mixpanel, and orchestrating cross-functional engineering, design, and marketing squads to deliver 30%+ activation and retention gains.

### CORE EXPERTISE
- Product Strategy, Discovery, and Roadmap Execution
- Self-Serve Growth, PLG Funnels, and Churn Reduction
- Data Analysis: SQL, Mixpanel, Amplitude, Looker
- Agile Scrum Leadership, PRD Documentation, Stakeholder Alignment

### PROFESSIONAL EXPERIENCE
**PulseMetrics SaaS** | Lead Product Manager, Growth | Mar 2021 – Present
- Led growth squad of 8 engineers and 2 designers, raising Day-30 retention from 18% to 31%.
- Launched self-serve team seat upgrade flow yielding +44% expansion ARR ($2.8M run-rate).

**CloudScale Intelligence** | Product Manager | Jan 2018 – Feb 2021
- Shipped enterprise analytics reporting suite adopted by 70+ Fortune 500 accounts.
- Reduced enterprise churn by 14% through proactive in-app customer health scoring.
`,
  createdAt: 1702000000000,
  updatedAt: 1702000000000,
};

export const INITIAL_PRESET_PROFILES: CandidateProfileRecord[] = [
  SUSHMIT_PROFILE_RECORD,
  SARAH_CHEN_PROFILE_RECORD,
  MARCUS_VANCE_PROFILE_RECORD,
];

export const STORAGE_KEY_PROFILES = 'jobstudio_candidate_profiles_v1';
export const STORAGE_KEY_ACTIVE_ID = 'jobstudio_active_profile_id_v1';
export const STORAGE_KEY_USER_PROFILE = 'jobstudio_master_profile';

/**
 * Storage key helper for 1 User = 1 Master Profile isolation.
 * Every user account has its own isolated profile stored under `jobstudio_master_profile_<clean_email>`.
 */
export function getUserProfileKey(email?: string): string {
  const cleanEmail = (email || '').toLowerCase().trim();
  if (!cleanEmail) return 'jobstudio_master_profile_demo';
  return `jobstudio_master_profile_${cleanEmail}`;
}

/**
 * Creates a pristine, unpopulated master profile for a newly registered user account.
 * Awaiting their authentic resume PDF upload or manual entry.
 */
export function createFreshUserProfile(email: string, name?: string): CandidateProfileRecord {
  const cleanEmail = (email || '').toLowerCase().trim();
  const cleanName = (name && name.trim()) ? name.trim() : (cleanEmail.split('@')[0] || 'Candidate');
  return {
    id: `profile-${cleanEmail}-${Date.now()}`,
    isPreset: false,
    name: cleanName,
    headline: 'Target Role / Professional Headline',
    email: cleanEmail,
    phone: '',
    location: '',
    linkedin: '',
    summary: '',
    skills: [],
    experiences: [],
    education: [],
    certifications: [],
    masterProfileText: `### CANDIDATE: ${cleanName}\n**Email:** ${cleanEmail}\n\nNo resume uploaded yet. Upload your resume PDF or paste your work history to auto-populate your authentic Master Profile.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/**
 * Single-User Master Profile: 1 User Account = 1 Master Profile
 * Strictly isolated per user email to eliminate cross-account profile contamination.
 */
export function getUserMasterProfile(email?: string, name?: string): CandidateProfileRecord {
  if (typeof window === 'undefined') return createFreshUserProfile('', 'Candidate');
  try {
    const userEmail = (email || localStorage.getItem('jobstudio_user_email') || '').toLowerCase().trim();
    const storedName = (name || localStorage.getItem('jobstudio_user_name') || '').trim();

    // 1. If not logged in and no email provided, return fresh blank guest profile (never leak demo or other user)
    if (!userEmail) {
      return createFreshUserProfile('', storedName || 'Candidate');
    }

    // 2. Demo User check (explicitly signed in as Sushmit demo account)
    const isDemoAccount =
      userEmail === SUSHMIT_USER_INFO.email.toLowerCase() ||
      storedName.toLowerCase().includes('sushmit');

    if (isDemoAccount) {
      const demoKey = getUserProfileKey(SUSHMIT_USER_INFO.email);
      const demoRaw = localStorage.getItem(demoKey);
      if (demoRaw) {
        try {
          return JSON.parse(demoRaw);
        } catch {
          return SUSHMIT_PROFILE_RECORD;
        }
      }
      return SUSHMIT_PROFILE_RECORD;
    }

    // 3. User Account: strictly keyed by userEmail
    const specificKey = getUserProfileKey(userEmail);
    const raw = localStorage.getItem(specificKey);

    if (raw) {
      try {
        const parsed = JSON.parse(raw);

        // Anti-contamination check:
        // If an old buggy run stored another candidate's profile (e.g. Praveen PP, pravenpp619@gmail.com)
        // inside a different user's account (e.g. Harish Kumar), detect and purge it immediately.
        const parsedEmail = (parsed.email || '').toLowerCase().trim();
        const parsedName = (parsed.name || '').toLowerCase().trim();
        const expectedName = storedName.toLowerCase().trim();

        const isCorrupted =
          (parsedEmail && parsedEmail !== userEmail && !parsedName.includes(expectedName) && !expectedName.includes(parsedName)) ||
          (parsedName.includes('praveen') && !expectedName.includes('praveen'));

        if (!isCorrupted) {
          return parsed;
        }

        console.warn(
          `[JobStudio] Detected cross-contaminated profile (${parsed.name}) in account (${storedName} / ${userEmail}). Purging and resetting to clean user profile.`
        );
        localStorage.removeItem(specificKey);
      } catch (err) {
        console.error('Failed to parse stored profile JSON', err);
        localStorage.removeItem(specificKey);
      }
    }

    // Purge legacy unscoped keys if they still exist so they never leak into any account
    localStorage.removeItem(STORAGE_KEY_USER_PROFILE);
    localStorage.removeItem('jobstudio_candidate_profiles_v1');

    // 3. Provision a clean, fresh profile specifically for this user
    const fresh = createFreshUserProfile(userEmail, storedName);
    saveUserMasterProfile(fresh, userEmail);
    return fresh;
  } catch (e) {
    console.error('Failed to read user master profile from localStorage', e);
    return SUSHMIT_PROFILE_RECORD;
  }
}

export function saveUserMasterProfile(profile: CandidateProfileRecord, email?: string) {
  if (typeof window === 'undefined') return;
  try {
    const userEmail = (email || profile.email || localStorage.getItem('jobstudio_user_email') || '').toLowerCase().trim();
    if (!userEmail) return;

    const specificKey = getUserProfileKey(userEmail);
    const json = JSON.stringify(profile);
    localStorage.setItem(specificKey, json);

    // Clean up any unscoped legacy key
    localStorage.removeItem(STORAGE_KEY_USER_PROFILE);
  } catch (e) {
    console.error('Failed to save master profile to localStorage', e);
  }
}

export function getStoredProfiles(): CandidateProfileRecord[] {
  return [getUserMasterProfile()];
}

export function saveStoredProfiles(profiles: CandidateProfileRecord[]) {
  if (profiles.length > 0) {
    saveUserMasterProfile(profiles[0]);
  }
}

export function getActiveProfileId(): string {
  return getUserMasterProfile().id;
}

export function setActiveProfileId(id: string) {
  // Single profile mode: active profile is always current user profile
}

export function profileRecordToResume(profile: CandidateProfileRecord): TailoredResumeData {
  return {
    full_name: profile.name,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    linkedin: profile.linkedin,
    tailored_summary: profile.summary,
    skills: profile.skills,
    experiences: profile.experiences,
    education: profile.education,
    certifications: profile.certifications,
  };
}

export function profileRecordToCandidateInfo(profile: CandidateProfileRecord): CandidateInfo {
  const parts = profile.name.trim().split(' ');
  const firstName = parts[0] || 'Candidate';
  const lastName = parts.slice(1).join(' ') || '';
  return {
    first_name: firstName,
    last_name: lastName,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    linkedin: profile.linkedin,
  };
}

