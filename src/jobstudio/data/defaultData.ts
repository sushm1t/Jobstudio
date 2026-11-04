// @ts-nocheck -- ported verbatim from the original project
export interface WorkExperience {
  title: string;
  company: string;
  date_range: string;
  location: string;
  bullets: string[];
}

export interface CandidateInfo {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio?: string;
}

export interface ProjectExperience {
  name: string;
  role?: string;
  target_alignment?: string;
  description: string;
  bullets: string[];
}

export const VAULT_PROJECTS: ProjectExperience[] = [
  {
    name: 'Credit Pilot',
    role: 'Fintech Logic & Decision Engine',
    target_alignment: 'Fintech & Product Operations',
    description: 'Fintech decision-support platform optimizing card reward routing and transfer partner conversion yields.',
    bullets: [
      'Engineered Spend SmartRouter evaluating purchase categories against card portfolios to optimize net reward rates.',
      'Built Redemption Maximizer modeling transfer partner ratios (Accor, Singapore Airlines, Qatar Airways, Marriott) yielding up to INR 18,000–36,000 vs. standard INR 2,000 catalog cashback.',
    ],
  },
  {
    name: 'LazyTrip',
    role: 'AI Travel Itinerary Generator',
    target_alignment: 'AI Product & Autonomous Workflow Design',
    description: 'Autonomous itinerary generation platform utilizing LLM-based constraint optimization.',
    bullets: [
      'Architected end-to-end multi-city trip planner integrating map APIs and real-time transit schedule heuristics.',
      'Designed structured prompting pipeline ensuring budget-constrained route adherence and point-of-interest clustering.',
    ],
  },
];

export interface TailoredResumeData {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  tailored_summary: string;
  skills: string[];
  experiences: WorkExperience[];
  projects?: ProjectExperience[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  certifications: string[];
}

export interface SkillRoadmapStep {
  skill: string;
  action_plan: string;
  recommended_certification: string;
  certification_provider?: string;
  timeline?: string;
  importance?: 'CRITICAL' | 'RECOMMENDED' | 'NICE_TO_HAVE' | string;
  practical_project?: string;
}

export interface RecommendedCertification {
  name: string;
  issuer: string;
  target_skill: string;
  estimated_time: string;
  why_it_helps: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | string;
}

export interface QualificationGap {
  missing: string;
  where_to_work: string;
  severity?: 'CRITICAL' | 'MODERATE' | 'NICE_TO_HAVE' | string;
}

export interface JobEvaluationData {
  job_title: string;
  company_name: string;
  match_score: number;
  should_apply: boolean;
  verdict: 'STRONG_APPLY' | 'APPLY' | 'CONSIDER' | 'SKIP' | string;
  key_matching_factors: string[];
  missing_critical_skills: string[];
  gaps?: QualificationGap[];
  tailoring_recommendations: string[];
  location_info?: string;
  executive_summary?: string;
  skill_roadmap?: SkillRoadmapStep[];
  recommended_certifications?: RecommendedCertification[];
  isEvaluated?: boolean;
}

export interface CoverLetterData {
  recipient: string;
  subject: string;
  body_paragraphs: string[];
  signoff: string;
}

export interface ScreeningAnswer {
  question: string;
  suggested_answer: string;
  category?: string;
  keywords?: string[];
  key_points?: string[];
  word_count?: number;
}

export interface InterviewPrepQuestion {
  question: string;
  category: 'Portal Reported' | 'Technical & Operational' | 'Behavioral (STAR)' | 'Situational Case' | string;
  source: string; // e.g. "Glassdoor Candidate Report", "AmbitionBox", "Role Competency Model"
  isFromPortal?: boolean;
  why_asked: string;
  key_talking_points: string[];
  suggested_answer: string;
}

export type ApplicationStatus =
  | 'Applied'
  | 'Under Review'
  | 'Interviewing'
  | 'Offer Received'
  | 'Rejected'
  | 'Archived';

export interface ResumeVersionSnapshot {
  id: string;
  label: string; // "v1", "v2", ...
  saved_at: number;
  match_score?: number;
  resume: TailoredResumeData;
}

export interface ApplicationEvent {
  id: string;
  at: number;
  type: 'created' | 'status_changed' | 'details_updated' | 'resume_version_saved';
  from_status?: ApplicationStatus;
  to_status?: ApplicationStatus;
  detail: string;
}

export interface AppliedJobRecord {
  id: string;
  job_title: string;
  company_name: string;
  location?: string;
  platform?: string;
  apply_url?: string;
  applied_date: string; // YYYY-MM-DD or formatted date
  match_score?: number;
  status: ApplicationStatus;
  salary?: string;
  notes?: string;
  interview_date?: string;
  resume_versions?: ResumeVersionSnapshot[];
  events?: ApplicationEvent[];
  tailored_resume_summary?: string;
  created_at: number;
}

export type ATSPlatform = 'Greenhouse' | 'Lever' | 'Ashby' | 'SmartRecruiters' | 'Workable' | 'Oracle Cloud HCM' | 'Direct Portal';

export type SeniorityFilter = 'All' | 'Early / Junior' | 'Mid-Level' | 'Senior' | 'Lead / Staff / Director';
export type WorkplaceFilter = 'All' | 'Remote' | 'Hybrid' | 'On-site';

export interface ATSJobListing {
  id: string;
  originalId?: string;
  slug?: string;
  title: string;
  company: string;
  location: string;
  department?: string;
  platform: ATSPlatform | string;
  applyUrl: string;
  publishedAt?: string;
  descriptionSnippet?: string;
  rawDescription?: string;
  isRemote?: boolean;
  workplaceType?: 'Remote' | 'Hybrid' | 'On-site';
  seniority?: 'Early / Junior' | 'Mid-Level' | 'Senior' | 'Lead / Staff / Director';
  salarySnippet?: string;
  skills?: string[];
  matchScore?: number;
  matchHighlight?: string;
}

export interface ATSCompanyEntry {
  name: string;
  slug: string;
  ats: 'greenhouse' | 'lever' | 'ashby' | 'smartrecruiters' | 'workable';
  category: string;
}

export const DEMO_PROFILE_TEXT = `NAME: Alex Morgan
TARGET ROLES: Operations Specialist | Technical Systems Analyst | Resource Manager | Process Optimization Lead
LOCATION: San Francisco, CA (Open to Remote / Relocation)
CONTACT: alex.morgan@example.com | +1 (555) 019-2834 | linkedin.com/in/alexmorgan-tech

================================================================================
CANDIDATE INSTRUCTIONS FOR AI AGENT
================================================================================
1. This is the master career database containing verified experiences, metrics, and technical accomplishments.
2. When tailoring a resume or application for a specific job:
   - SELECT ONLY the bullet points, tags, and projects that directly match the target Job Description (JD).
   - OMIT bullet points that are irrelevant to the target role to maintain single-page or two-page conciseness.
   - DO NOT hallucinate, invent tools, or fabricate metrics beyond what is documented in this vault.
   - Adjust terminology to match the JD keywords while keeping underlying truths intact.

================================================================================
CORE TECHNICAL & OPERATIONAL TOOLKIT
================================================================================
- Operations & Systems: Resource Scheduling, Workflow Optimization, Service Level Agreements (SLA), Process Governance, Standard Operating Procedures (SOPs).
- Analytics & Querying: SQL, Metabase, Looker, Advanced Microsoft Excel (VLOOKUP, Pivot Tables, Complex Formulas), Google Sheets.
- Collaboration & Systems: Jira, Jira Service Management, Confluence, Slack Workflows, Zapier.
- Project & Product Operations: Requirements Gathering, Scope Documentation, Agile/Sprint Coordination, Cross-Functional Execution.

================================================================================
PROFESSIONAL EXPERIENCE: APEX TECHNOLOGIES
================================================================================

ROLE 1: Senior Operations & Systems Specialist
Tenure: January 2022 – Present
Domain: Cloud Systems & Enterprise Operations

- Monitored and balanced operational capacity across distributed multi-regional teams.
- Built automated SQL data pipelines and real-time KPI dashboards, decreasing manual reporting overhead by 70%.
- Partnered with engineering and product leads to establish standard operating procedures and eliminate operational bottlenecks.
- Spearheaded quality improvement initiatives that increased SLA adherence from 88% to 99.2% across key deliverables.

================================================================================
PROFESSIONAL EXPERIENCE: NEXUS GLOBAL SOLUTIONS
================================================================================

ROLE 2: Operations Analyst
Tenure: June 2019 – December 2021
Domain: Professional Services & Analytics

- Analyzed cross-functional workflow metrics and operational performance data to identify productivity bottlenecks.
- Created interactive reporting dashboards in Looker and Excel, providing leadership with real-time operational visibility.
- Supported capacity planning and resource allocation models across enterprise client accounts.

================================================================================
EDUCATION & CERTIFICATIONS
================================================================================
- B.S. in Business Information Systems | University of California (2015 – 2019)
- Professional Scrum Master (PSM I)
- SQL for Data Analysis & Business Intelligence
- Google Data Analytics Professional Certificate
`;

export const DEMO_USER_INFO: CandidateInfo = {
  first_name: 'Alex',
  last_name: 'Morgan',
  email: 'alex.morgan@example.com',
  phone: '+1 (555) 019-2834',
  location: 'San Francisco, CA',
  linkedin: 'https://linkedin.com/in/alexmorgan-tech',
};

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  platform: 'Greenhouse' | 'Lever' | 'LinkedIn' | 'Ashby' | 'UltiPro' | 'Workable' | string;
  applyUrl: string;
  category: 'Resource & Capacity Planning' | 'Real-Time Operations & WFM' | 'Incident & Service Ops' | 'Business Operations & Analytics' | 'Implementation Operations' | string;
  matchScore: number;
  matchHighlight: string;
  description: string;
  isLive?: boolean;
  isEvaluated?: boolean;
}

export const PRESET_JOBS: JobOpportunity[] = [
  {
    id: 'weaver-senior-associate',
    title: 'Senior Associate – Resource Management',
    company: 'Weaver (Weaver and Tidwell, LLP)',
    location: 'Kochi (Cyber Green) / Bengaluru / Hyderabad / Remote Hybrid',
    platform: 'UltiPro',
    category: 'Resource & Capacity Planning',
    matchScore: 92,
    matchHighlight: 'Direct match for workforce scheduling, utilization variance tracking, and US-India engagement coordination.',
    applyUrl:
      'https://recruiting2.ultipro.com/WEA1003WEAV/JobBoard/c4b626ed-a455-433e-9e34-c877b04aedb4/OpportunityDetail?opportunityId=bb20800c-9524-4e3a-be6d-4dd86a8b83e4&source=LinkedIn',
    description: `Company: Weaver (Weaver and Tidwell, LLP)
Requisition: SENIO003186
Role: Senior Associate - Resource Management
Locations: Kochi (Kerala), Bengaluru, Chennai, Hyderabad, Coimbatore (India)

Position Summary:
The Senior Associate in Resource Management will support operational workforce planning, scheduling, capacity analysis, and resource balancing for Weaver's India Tax team in close coordination with US Tax practice leaders.

Key Responsibilities:
- Facilitate resource scheduling, allocations, and workload balancing across a team of 100+ tax and accounting professionals.
- Track, audit, and analyze staff capacity, utilization benchmarks, and scheduling variances using advanced spreadsheet models and workforce tools.
- Coordinate with US engagement managers and India leadership to identify staffing shortages, reallocate resources during peak tax seasons, and mitigate project delays.
- Support onboarding, team roster maintenance, skills inventory, and tracking of planned time off (PTO) and training schedules.
- Generate weekly and monthly utilization and operational metrics reports for executive leadership.
- Participate in workflow process improvement initiatives and system data hygiene audits.

Required Qualifications:
- Bachelor's degree in Business, Human Resources, Operations, or related field.
- 2-4 years of experience in resource management, workforce management, capacity planning, or operations coordination.
- Strong proficiency in Microsoft Excel (Pivot tables, VLOOKUP/XLOOKUP, formulas) and reporting tools.
- Excellent communication and cross-functional stakeholder coordination skills across US and India time zones.`,
    isLive: true,
  },
  {
    id: 'honeywell-integrity-compliance',
    title: 'Integrity & Compliance Specialist II',
    company: 'Honeywell Aerospace',
    location: 'India / Bengaluru / Remote Hybrid',
    platform: 'Oracle Cloud HCM',
    category: 'Incident & Service Ops',
    matchScore: 94,
    matchHighlight:
      'Direct match for third-party compliance reviews (pre-L1/L1), regulatory screenings, data analytics (SQL/Looker), and IAM compliance controls.',
    applyUrl:
      'https://icfcjb.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/en/sites/Aerospace/job/99122261?utm_medium=jobboard&utm_source=linkedin',
    description: `Company: Honeywell Aerospace
Requisition ID: 99122261
Role: Integrity & Compliance Specialist II
Location: India (Bengaluru / Hybrid)
Platform: Oracle Cloud HCM

Role Description:
As an Integrity & Compliance Specialist II at Honeywell Aerospace, you will conduct due diligence investigations on third parties with whom Honeywell Aerospace does business, ensuring that all operations and transactions are conducted in accordance with legal and ethical standards. You will contribute to our efforts to drive data analytics and integration in our compliance operations. Additionally, you will develop training programs to educate employees on integrity and compliance, promoting a strong culture of ethics and compliance throughout the organization.

Key Responsibilities:
- Conduct pre-L1 and L1 reviews on third parties during compliance screenings.
- Coordinate escalations and partner with other compliance professionals as appropriate.
- Ensure compliance with all applicable laws, regulations, and company policies.
- Develop training programs to educate employees on integrity and compliance.
- Monitor and assess the effectiveness of our screening systems and recommend improvements.
- Collaborate with cross-functional teams to ensure integrity and compliance in business operations.
- Drive data analytics and insights for the Third Party Risk & Digital Compliance Team.

Qualifications & Requirements:
- 2+ years of experience in compliance, operational risk, or regulatory screening.
- Knowledge of laws, regulations, and industry standards related to integrity and compliance.
- Proven experience operating within integrity and compliance programs.
- Strong analytical skills, attention to detail, and problem-solving abilities.`,
    isLive: true,
  },
];

// Initial empty / plain evaluation for reload state
export const EMPTY_EVALUATION: JobEvaluationData = {
  job_title: '',
  company_name: '',
  match_score: 0,
  should_apply: false,
  verdict: 'PENDING',
  location_info: '',
  executive_summary: '',
  key_matching_factors: [],
  missing_critical_skills: [],
  gaps: [],
  tailoring_recommendations: [],
  skill_roadmap: [],
  recommended_certifications: [],
  isEvaluated: false,
};

// Initial empty cover letter
export const EMPTY_COVER_LETTER: CoverLetterData = {
  recipient: '',
  subject: '',
  body_paragraphs: [],
  signoff: '',
};

// Initial clean blank resume for privacy-first, single-user profile isolation
export const EMPTY_RESUME: TailoredResumeData = {
  full_name: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  tailored_summary: '',
  skills: [],
  experiences: [],
  projects: [],
  education: [],
  certifications: [],
};

// Master Untailored Resume Baseline (Loaded when no specific job is targeted)
export const MASTER_BASE_RESUME: TailoredResumeData = {
  full_name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  phone: '+1 (555) 019-2834',
  location: 'San Francisco, CA',
  linkedin: 'https://linkedin.com/in/alexmorgan-tech',
  tailored_summary:
    'Results-driven professional with 5+ years of experience across technical systems, process automation, data-driven optimization, and cross-functional execution. Proven track record leading high-impact initiatives, deploying automated reporting pipelines, and partnering with engineering and leadership teams to scale operational quality.',
  skills: [
    'Workflow & Systems Optimization',
    'SQL Querying & Relational Databases',
    'Looker & Metabase Analytics Dashboards',
    'Cross-Functional Project Coordination',
    'Process Automation & Scripting',
    'Advanced Excel & Data Modeling',
    'SLA Monitoring & KPI Governance',
    'Agile & Sprint Coordination (Jira)',
    'Stakeholder Management & Scoping',
    'Continuous Quality Improvement',
  ],
  experiences: [
    {
      title: 'Senior Operations & Systems Specialist',
      company: 'Apex Technologies',
      date_range: 'Jan 2022 – Present',
      location: 'San Francisco, CA (Remote)',
      bullets: [
        'Led operational systems optimization and workflow automation across distributed multi-region teams.',
        'Developed automated SQL data pipelines and real-time KPI dashboards, decreasing manual reporting overhead by 70%.',
        'Partnered with engineering and product leads to establish standard operating procedures and eliminate operational bottlenecks.',
        'Spearheaded quality improvement initiatives that increased SLA adherence from 88% to 99.2% across key deliverables.',
      ],
    },
    {
      title: 'Operations Analyst',
      company: 'Nexus Global Solutions',
      date_range: 'Jun 2019 – Dec 2021',
      location: 'San Francisco, CA',
      bullets: [
        'Analyzed cross-functional workflow metrics and operational performance data to identify productivity bottlenecks.',
        'Created interactive reporting dashboards in Looker and Excel, providing leadership with real-time operational visibility.',
        'Supported capacity planning and resource allocation models across enterprise client accounts.',
      ],
    },
  ],
  projects: [],
  education: [
    {
      degree: 'B.S. in Business Information Systems',
      institution: 'University of California',
      year: '2015 – 2019',
    },
  ],
  certifications: [
    'Professional Scrum Master (PSM I)',
    'SQL for Data Analysis & Business Intelligence',
    'Google Data Analytics Professional Certificate',
  ],
};

// Initial tailored Weaver package (ready on selection)
export const INITIAL_WEAVER_RESUME: TailoredResumeData = {
  full_name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  phone: '+1 (555) 019-2834',
  location: 'San Francisco, CA',
  linkedin: 'https://linkedin.com/in/alexmorgan-tech',
  tailored_summary:
    'Resource Management and Operations professional with 5+ years of experience in capacity allocation, data analytics, and stakeholder coordination. Proven track record in workflow optimization, dynamic resource planning across multi-timezone teams, and automating reporting pipelines to ensure high SLA attainment and operational excellence.',
  skills: [
    'Resource Scheduling & Allocation',
    'Capacity Planning & Forecast Modeling',
    'Workforce Utilization Analytics',
    'SQL Querying & Data Modeling',
    'Cross-Functional Stakeholder Coordination',
    'Advanced Excel (Pivot Tables, XLOOKUP)',
    'Looker & Metabase Dashboards',
    'Process & Quality Governance',
    'Standard Operating Procedures (SOPs)',
    'SLA & Milestone Tracking',
  ],
  experiences: [
    {
      title: 'Senior Resource Management Specialist',
      company: 'Apex Technologies',
      date_range: 'Jan 2022 – Present',
      location: 'San Francisco, CA (Remote)',
      bullets: [
        'Managed resource scheduling, workload balancing, and capacity forecasts across multi-regional professional teams.',
        'Designed real-time utilization dashboards linking SQL databases and analytics sheets to identify staffing bottlenecks proactively.',
        'Collaborated with department directors to establish quarterly allocation roadmaps and optimize project staffing budgets.',
        'Reduced scheduling turnaround time by 35% through standardized allocation runbooks and automated notifications.',
      ],
    },
    {
      title: 'Operations Analyst',
      company: 'Nexus Global Solutions',
      date_range: 'Jun 2019 – Dec 2021',
      location: 'San Francisco, CA',
      bullets: [
        'Analyzed utilization metrics and resource capacity across international engagement teams.',
        'Built automated scheduling trackers and variance reports in Excel and Metabase for senior leadership reviews.',
        'Assisted engagement managers in balancing conflicting project timelines and delivery priorities.',
      ],
    },
  ],
  projects: [],
  education: [
    {
      degree: 'B.S. in Business Information Systems',
      institution: 'University of California',
      year: '2015 – 2019',
    },
  ],
  certifications: [
    'Certified Associate in Project Management (CAPM)',
    'SQL for Data Analysis & Business Intelligence',
    'Google Data Analytics Professional Certificate',
  ],
};

export const INITIAL_WEAVER_EVALUATION: JobEvaluationData = {
  job_title: 'Senior Associate – Resource Management',
  company_name: 'Weaver (Weaver and Tidwell, LLP)',
  match_score: 92,
  should_apply: true,
  verdict: 'STRONG_APPLY',
  location_info: 'Senior Associate Professional Role',
  executive_summary:
    'Strong match. The candidate brings 5+ years of operational experience with capacity planning, staffing allocation, and data-driven workflow optimization matching Weaver’s resource management needs.',
  key_matching_factors: [
    'Direct operational experience in resource scheduling, staffing adherence, and workload balancing across multi-timezone teams.',
    'Workforce analytics & tooling: Daily proficiency in advanced Excel (Pivot Tables, XLOOKUP), Looker, Metabase, and SQL for capacity tracking.',
    'Cross-functional coordination: Proven track record aligning engagement leaders and delivery pods across shifting deadlines.',
    'Stakeholder reporting: Experience building automated reporting workflows that reduce manual latency.',
  ],
  missing_critical_skills: [
    'Public accounting/CPA firm specific operational software (PSA/Kantata/Workday Resource Management).',
  ],
  gaps: [
    {
      missing: 'Public Accounting / Professional Services Firm Experience',
      where_to_work: 'Familiarize with billable utilization metrics, realization rates, and tax busy-season scheduling dynamics.',
      severity: 'MODERATE',
    },
  ],
  tailoring_recommendations: [
    'Emphasize capacity tracking, scheduling variance, and proactive reallocation strategies.',
    'Highlight automated reporting workflows and metrics-driven utilization tracking.',
    'Focus on stakeholder communication and conflict resolution across competing deadlines.',
  ],
  skill_roadmap: [
    {
      skill: 'Professional Services WIP & Utilization Economics',
      action_plan: 'Master billable hour variance models, realization rate computation, and engagement margin optimization.',
      recommended_certification: 'Professional Services Operations Certificate',
      certification_provider: 'Industry Association',
      timeline: '2–3 weeks',
      importance: 'RECOMMENDED',
      practical_project: 'Build an Excel utilization tracker modeling staff across busy-season capacity constraints.',
    },
  ],
  recommended_certifications: [
    {
      name: 'Certified Associate in Project Management (CAPM)',
      issuer: 'Project Management Institute (PMI)',
      target_skill: 'Resource planning, schedule management, cross-functional governance',
      estimated_time: '3–4 weeks',
      why_it_helps: 'Validates formal capacity management and project delivery skills for engagement leaders.',
      difficulty: 'Intermediate',
    },
  ],
};

export const INITIAL_WEAVER_COVER_LETTER: CoverLetterData = {
  recipient: 'Talent Optimization & Resource Management Hiring Team\nWeaver India (Weaver and Tidwell, LLP)',
  subject: 'Application for Senior Associate - Resource Management (Requisition: SENIO003186)',
  body_paragraphs: [
    'I am writing to express my strong enthusiasm for the Senior Associate – Resource Management position with Weaver’s professional team. With 5+ years of experience across workforce monitoring, capacity planning, and project delivery, I have focused my career on optimizing resource utilization and ensuring skilled talent is deployed seamlessly against dynamic operational demands.',
    'In my role at Apex Technologies, I managed operational capacity and workload balancing across distributed multi-region teams. My responsibilities centered on identifying capacity bottlenecks, executing staffing reallocations, and auditing utilization data using Looker, Metabase, advanced Excel models, and SQL. Additionally, I spearheaded an automated reporting workflow that reduced recurring reporting turnaround time by 70%, significantly improving leadership visibility during peak windows.',
    'Earlier at Nexus Global Solutions, I coordinated delivery support across international client accounts, translating operational milestones into resource requirements and tracking project utilization. Weaver’s emphasis on proactive collaboration between leadership and delivery teams directly matches my background. I am excited about the opportunity to join Weaver and contribute immediately to your capacity planning, utilization analytics, and scheduling integrity.',
  ],
  signoff: 'Sincerely,\nAlex Morgan\nalex.morgan@example.com | +1 (555) 019-2834 | linkedin.com/in/alexmorgan-tech',
};

export const INITIAL_SCREENING_ANSWERS: ScreeningAnswer[] = [
  {
    question: 'Why are you interested in this Resource Management role at Weaver?',
    suggested_answer:
      'Weaver’s collaborative model across distributed professional teams offers an ideal environment for my background. Over 5 years in operations and resource coordination, I have specialized in balancing workforce capacity, resolving scheduling variances, and building automated reporting workflows. Joining Weaver allows me to apply these resource optimization skills in an established, high-growth professional services firm.',
  },
  {
    question: 'Describe your experience with capacity planning, scheduling, and Excel.',
    suggested_answer:
      'At Apex Technologies, I managed operational capacity and resource scheduling across distributed teams spanning multiple time zones. I utilize advanced Excel (Pivot Tables, XLOOKUP), Looker, and SQL to analyze utilization trends and coordinate staffing reallocations. At Nexus Global Solutions, I supported capacity scoping across enterprise project roadmaps and built automated utilization trackers.',
  },
  {
    question: 'What is your current notice period / availability?',
    suggested_answer:
      'My notice period is standard, and I am available to begin upon mutual agreement.',
  },
];

export const INITIAL_INTERVIEW_PREP_QUESTIONS: InterviewPrepQuestion[] = [
  {
    question: 'How do you prioritize resource allocation across multiple engagements with competing deadlines?',
    category: 'Portal Reported',
    source: 'Glassdoor Candidate Report',
    isFromPortal: true,
    why_asked: 'Evaluates prioritization frameworks, capacity balancing, and conflict mitigation when multiple deliverables peak simultaneously.',
    key_talking_points: [
      'Rank projects by client criticality, SLA commitments, and delivery deadlines.',
      'Use Looker/Excel utilization dashboards to isolate unallocated or under-utilized capacity.',
      'Proactively communicate schedule variances to engagement partners with alternative staffing plans.',
    ],
    suggested_answer:
      'In my experience managing resource scheduling across overlapping deliverables under strict deadlines, my framework starts with objective triage: ranking engagements by deadline rigidity and key milestones. In high-demand periods, I monitor real-time utilization to identify teams with surplus capacity and dynamically shift workloads without compromising primary SLAs. For Weaver, I would establish weekly utilization forecasting models so engagement managers receive early warning of capacity shortfalls weeks before peak crunches.',
  },
  {
    question: 'Tell me about a time you faced pushback from project leaders regarding resource assignments; how did you resolve it?',
    category: 'Portal Reported',
    source: 'Glassdoor Candidate Report',
    isFromPortal: true,
    why_asked: 'Tests stakeholder management, data-backed negotiation, and emotional intelligence when partner demands exceed available staff.',
    key_talking_points: [
      'Acknowledge partner urgency without making unachievable commitments.',
      'Present objective workload data (billable utilization, overtime thresholds).',
      'Deliver compromise solutions (e.g., hybrid pairing of senior specialists with junior staff).',
    ],
    suggested_answer:
      'At Apex Technologies, project managers frequently requested dedicated senior specialists during major project releases, which risked leaving ongoing operations exposed. Rather than simply rejecting the request, I used utilization logs and occupancy data to demonstrate that dedicating full-time staff would cause queue wait times to increase significantly. Instead, I proposed a tiered support model: a designated senior specialist was available for escalations while standard volume was handled by core staff with pre-configured routing. The release succeeded with zero SLA breaches, and leadership commended the data-driven compromise.',
  },
  {
    question: 'Walk me through how you use data analytics or SQL to investigate operational bottlenecks and eliminate inefficiencies.',
    category: 'Technical & Operational',
    source: 'Role Architecture Analysis',
    isFromPortal: false,
    why_asked: 'Verifies technical data analytics proficiency, SQL querying ability, and root-cause problem solving in workforce operations.',
    key_talking_points: [
      'Identified repetitive workflow bottlenecks via SQL querying.',
      'Quantified daily volume impact and cycle time inflation.',
      'Designed structured escalation pathway to senior tier, permanently eliminating loops.',
    ],
    suggested_answer:
      'In a previous role, I noticed team tasks were frequently bouncing between different queues without reaching resolution. I wrote and executed SQL queries against our database to track task paths, isolating repeated transfer patterns and proving this defect affected dozens of workflows daily. Presenting this data to team leads, I engineered an automated routing SOP that directed recurring cases immediately to advanced specialists who assumed full ownership. This eliminated repeat handoffs and accelerated resolution times by over 40%.',
  },
  {
    question: 'How do you handle real-time resource re-allocation during sudden operational volatility or volume surges?',
    category: 'Technical & Operational',
    source: 'Role Architecture Analysis',
    isFromPortal: false,
    why_asked: 'Assesses agility, operational triage, and cross-functional communication during unforeseen demand spikes.',
    key_talking_points: [
      'Pre-configured trigger thresholds based on SLA drop rates.',
      'Rapid intraday reallocation across tiers.',
      'Transparent communication to maintain leadership visibility.',
    ],
    suggested_answer:
      'When sudden operational volatility hit our workflows, I utilized real-time capacity dashboards to execute pre-approved mitigation workflows: pausing non-essential offline activities and redirecting cross-skilled team members from lower-demand areas. I also created an automated reporting summary that cut leadership briefing time from 15 minutes to under 3 minutes, giving executive leadership immediate visibility during critical windows.',
  },
  {
    question: 'If an engagement manager requests additional person-hours for a project with zero budget variance, how would you evaluate and resolve it?',
    category: 'Situational Case',
    source: 'Role Architecture Analysis',
    isFromPortal: false,
    why_asked: 'Evaluates financial awareness, billing realization understanding, and protecting engagement margin profitability.',
    key_talking_points: [
      'Analyze billable utilization vs non-billable administrative hours.',
      'Audit current task distribution to identify automatable or junior-delegable tasks.',
      'Present margin impact analysis before approving scope expansions.',
    ],
    suggested_answer:
      'I would first review the engagement’s current burn rate and time-entry breakdown against the contractual statement of work. Often, requests for more hours stem from senior professionals spending time on administrative or data-prep tasks that can be delegated to junior staff or automated via standardized templates. If the scope has genuinely expanded, I would partner with the engagement lead to prepare a formal scope change justification for the client, ensuring the firm does not absorb unbudgeted costs that erode realization margins.',
  },
];

export interface VerifiedCredential {
  title: string;
  issuer: string;
  fullBadge: string;
  coreCompetency: string;
}

export const VERIFIED_CREDENTIALS: VerifiedCredential[] = [
  {
    title: 'Building AI Agents',
    issuer: 'Zapier',
    fullBadge: 'Building AI Agents | Zapier',
    coreCompetency: 'Autonomous workflows, tool integration, AI agent design.',
  },
  {
    title: 'Google AI Essentials Specialization',
    issuer: 'Google',
    fullBadge: 'Google AI Essentials Specialization | Google',
    coreCompetency: 'Generative AI workflows, prompt engineering, productivity automation.',
  },
  {
    title: 'Finance Foundations: Risk Management',
    issuer: 'LinkedIn',
    fullBadge: 'Finance Foundations: Risk Management | LinkedIn',
    coreCompetency: 'Financial Risk Management, operational exposure mitigation.',
  },
  {
    title: 'Analyzing and Visualizing Data in Looker',
    issuer: 'Google Cloud Community India',
    fullBadge: 'Analyzing and Visualizing Data in Looker | Google Cloud Community India',
    coreCompetency: 'Looker software, dashboard architecture, BI reporting, data exploration.',
  },
  {
    title: 'Microsoft Certified: Security, Compliance, and Identity Fundamentals',
    issuer: 'Microsoft',
    fullBadge: 'Microsoft Certified: Security, Compliance, and Identity Fundamentals | Microsoft',
    coreCompetency: 'Access management (IAM), cloud security, regulatory compliance controls.',
  },
];

