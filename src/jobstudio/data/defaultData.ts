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

export const SUSHMIT_PROFILE_TEXT = `NAME: Sushmit Surendran
TARGET ROLES: Business Operations | Product Operations | Implementation Operations | Process Improvement | Incident Management | Real-Time Operations SME | Operations Analyst | Service Delivery | AI Operations
LOCATION: Vadakara, Kerala, India (Open to Remote / Relocation)
CONTACT: +91 89214 09100 | Sushmits07@gmail.com | linkedin.com/in/sushmit-surendran

================================================================================
CANDIDATE INSTRUCTIONS FOR AI AGENT
================================================================================
1. This is the master career database containing verified experiences, metrics, and technical accomplishments.
2. When tailoring a resume or application for a specific job:
   - SELECT ONLY the bullet points, tags, and projects that directly match the target Job Description (JD).
   - OMIT bullet points that are irrelevant to the target role to maintain single-page or two-page conciseness.
   - DO NOT hallucinate, invent tools, or fabricate metrics beyond what is documented in this vault.
   - Adjust terminology to match the JD keywords (e.g., "Queue Balancing" vs. "Capacity Adherence", "RCA" vs. "Root Cause Analysis") while keeping underlying truths intact.

================================================================================
CORE TECHNICAL & OPERATIONAL TOOLKIT
================================================================================
- Operations & Workforce Tools: Real-Time Queue Monitoring, Service Level Adherence (SLA) Tracking, Real-Time Adherence (RTA), Queue Balancing, Shift Adherence Oversight, Exception & Allocation Management.
- Analytics & Querying: SQL (Jove querying platform), Metabase, Looker, Advanced Microsoft Excel (VLOOKUP, Pivot Tables, Complex Formulas), Google Sheets.
- Incident & Workflow Systems: Jira, Jira Service Management, Confluence, Slack Workflow Builder, Zapier, Duplicate Message Suppression Controls.
- AI & Automation: Gemini AI, Google AI Studio, Prompt Engineering, Structured JSON Outputs, No-Code/Low-Code Rapid Prototyping.
- Project & Product Operations: Requirements Gathering, Business Requirements Document (BRD) Scoping, Statement of Work (SOW), User Journey Mapping, Feature Prioritization, Agile/Sprint Coordination, Cross-Functional Bridge Management.
- Financial & Domain Knowledge: Fintech Service Ops, Card Disputes & Chargebacks (Visa/Mastercard schemes), Multi-Currency Billing Reconciliations (INR, USD, AED, EUR), Credit Card Reward Economics (MCCs, Multipliers, Transfer Partners, Points Optimization), Crypto & Trading Service Operations.

================================================================================
PROFESSIONAL EXPERIENCE: REVOLUT
================================================================================

ROLE 1: Real-Time Analyst / SME, Real-Time Operations
Tenure: October 2023 - Present
Domain: Global Fintech Operations & Service Delivery

A. Real-Time Operations & Queue Management
- Monitored live service operations across 1,000+ frontline agents and 300+ dynamic queues simultaneously across EEA/UK, the Americas, and APAC regions.
- Tracked incoming chat volumes, handle times, occupancy rates, and agent states in real time to preempt service level agreement (SLA) failures.
- Balanced queues dynamically during volume surges by redirecting frontline agent allocations across multiple operational tiers and channels.
- Acted as the frontline-to-leadership bridge, delivering live operational updates, queue health reporting, and strategic staffing recommendations to senior leaders during high-demand windows.
- Monitored real-time performance metrics across distinct fintech product verticals to guarantee optimal routing and scheduling compliance.

B. SQL Investigation & Queue Ping-Pong Elimination (Key Achievement)
- Detected a critical recurring operational defect where customer support chats were ping-ponging indefinitely between different team queues without reaching resolution.
- Wrote and executed SQL queries via the Jove platform to investigate root causes, isolate query patterns, and quantify the daily volume of affected chats.
- Proved with data that this loop occurred daily and created severe handle time inflation and user dissatisfaction.
- Liaised directly with functional queue owners and operational stakeholders to engineer an escalation pathway.
- Built a standardized operational workflow routing these looping cases directly to advanced tier agents who assumed full case ownership, eliminating repeat transfers and accelerating resolution times.

C. Incident Management POC (Subject Matter Expert & Point of Contact)
- Led operational incident response and bridge triage during live platform outages, major system failures, and sudden chat surges of 1,000 to 2,000 concurrent chats.
- Acted as the primary operational point of contact for the Crypto and Wealth & Trading product verticals during technical incidents and outages.
- Coordinated cross-functional alignment between Engineering, Tech, Product Managers, and Frontline Leadership to track system fixes, isolate impacted customer cohorts, and mitigate blast radius.
- Designed and built geo-targeted and product-isolated customer communication banners within internal tools to notify affected users during incidents.
- Built isolated audience targeting files based on customer location and active product vertical, preventing banner noise and confusion for unaffected users in other countries.
- Engineered automated Slack workflows for incident alerts, automatically notifying frontline agents and leadership of emerging incidents, bridge links, and triage status updates.
- Authored the definitive operational standard operating procedures (SOPs) for Real-Time Monitoring (RTM) analysts on handling day-to-day incident management tasks.
- Trained and mentored onboarding analysts: conducted shadowing sessions demonstrating banner configuration, audience segment builds, and incident bridge protocols.

D. Documentation POC (Knowledge Management & Confluence Governance)
- Owned the operational knowledge architecture for the RTM team, managing Confluence documentation hygiene.
- Executed comprehensive quarterly reviews of all Confluence team pages, auditing content for accuracy and deprecating outdated workflows.
- Authored new Confluence documentation whenever procedures evolved, policies changed, or new internal tools were launched.
- Archived decommissioned processes and obsolete documents to prevent adherence drift and ensure frontline agents followed only active SOPs.

E. Process Automation & Tooling Improvements
- Designed and deployed a Gemini-assisted breach reporting workflow that automated the collation and synthesis of incident metrics, reducing a manual 15-minute reporting cycle to under 3 minutes.
- Built workflow automations using Jira, Slack, and Zapier to automate incident escalations and operational alert handoffs.
- Engineered duplicate-message suppression tracking controls across communication channels to eliminate redundant escalations and reduce operational confusion during crisis states.
- Collaborated on dashboard redesigns and metric alert triggers across Looker and Metabase, improving visibility into real-time operational bottlenecks.
- Mentored incoming analysts on real-time triage practices, SOP compliance, and internal tool usage.

---

ROLE 2: Support Specialist, Chargebacks & Disputes
Tenure: October 2022 - September 2023
Domain: Payment Disputes, Card Schemes & Fraud Operations

- Handled and adjudicated complex payment disputes and cardholder chargeback escalations within a strictly regulated fintech environment.
- Maintained a consistent first-contact resolution (FCR) rate above 95% based on official team performance metrics.
- Conducted root-cause investigations on recurring chargeback categories, merchant dispute friction points, and recurring transaction dispute types.
- Collaborated cross-functionally with dispute risk leads and technical teams to design and introduce 3 key chargeback handling workflow improvements that streamlined evidence gathering and case management.

================================================================================
PROFESSIONAL EXPERIENCE: TORC INFOTECH PVT. LTD.
================================================================================

ROLE: Customer Success / Account Management
Tenure: September 2020 - September 2022
Domain: B2B Technology Services & Client Delivery Operations

- Managed an end-to-end B2B account portfolio of 8 international enterprise client accounts across diverse industries.
- Led the complete customer engagement lifecycle: discovery calls, business requirements gathering, technical scoping, delivery tracking, billing coordination, and account renewal/expansion.
- Expanded an initial European pilot project into 4 consecutive delivered project scopes within 8 months, successfully converting the relationship into an ongoing technical retainer.
- Co-led technical discovery and solution scoping for a large-scale healthcare technology platform proposal estimated at 32 person-months across a 28-week delivery timeline.
- Authored statements of work (SOWs), mapped operational requirements into technical specifications, and established delivery boundary conditions for software engineering teams.
- Coordinated multi-currency recurring international billing operations spanning INR, USD, AED, and EUR, reconciling project milestone completions with contractual billing schedules.
- Identified commercial expansion opportunities, successfully upselling active accounts on supplemental digital solutions, product enhancements, and support packages.

================================================================================
PROOF OF WORK / AI & PRODUCT PROJECTS
================================================================================

PROJECT 1: Credit Pilot | Personal Finance & Credit Optimization Engine
Target Alignment: Fintech, Product Operations, Logic Design, System Architecture, Operations Analyst

Description & Problem Statement:
- Developed "Credit Pilot," a fintech logic and decision-support platform designed to solve credit card earn-side and burn-side fragmentation in the Indian credit card ecosystem.
- Solves the earn-side problem where users miss out on accelerated reward points because they do not know which card in their portfolio maximizes returns for specific merchant category codes (MCCs) or bank multiplier portals.
- Solves the burn-side problem where accumulated bank reward points are redeemed for low-yield catalog gift cards or direct statement credit instead of high-yield travel partner conversions.

Core Technical & Algorithmic Features:
- Spend SmartRouter (Earn Side): Evaluates user purchases (merchant, category, transaction value) against the user's owned card portfolio to determine the optimal card for maximum net effective reward rate.
- Multiplier & Portal Engine: Factors in bank-specific accelerated portals (HDFC SmartBuy, Axis GrabDeals/Travel Edge, Amex Reward Multiplier), dynamically evaluating when a purchase should be routed through partner portals.
- Exclusion & Milestone Awareness: Incorporates logic for category spend exclusions (fuel, utilities, rent, government/taxes, wallet loads) and tracks incremental spend toward annual fee waivers and milestone reward tiers.
- Redemption Maximizer (Burn Side): Evaluates point balances (e.g., 10,000 points) and models transfer partner ratios (Accor ALL, Singapore Airlines KrisFlyer, Qatar Airways Avios, Marriott Bonvoy) to compute net Value Per Point (VPP) in Indian Rupees (INR).
- Optimization Yield: Demonstrates how converting 10,000 points to hotel/airline partners yields up to ₹18,000–₹36,000 in redemption value compared to standard ₹2,000–₹3,000 catalog cashback.
- Data Modeling: Formulated relational data tables mapping card rules, annual fees, reward caps, multiplier tiers, and transfer ratios across major Indian issuers (HDFC, Axis, Amex, SBI, ICICI).

---

PROJECT 2: LazyTrip | AI-Driven Algorithmic Travel Planner
Target Alignment: AI Product Engineering, Prompt Architecture, Structured Outputs, Travel Tech, Process Design

Description & Problem Statement:
- Built "LazyTrip," an intelligent trip planning platform that transforms open-ended user preferences into complete, geographically sequenced 7-day travel blueprints without manual itinerary compilation.
- Solves the issue of generic LLM itinerary generation, which routinely outputs geographically illogical schedules, chaotic transit times, and disregard for budget constraints.

Core Technical & Algorithmic Features:
- Input Optimization Engine: Requires only 3 core user inputs: trip duration, destination, and key personal interests.
- Multi-Tier Budget Constraints: Enforces strict logic filters for Budget, Mid-Range, and Luxury tiers, constraining accommodation, dining, and transit suggestions to matching partners (e.g., hostels/scooters vs. boutique hotels/cabs vs. luxury resorts/chauffeurs).
- Spatial Routing & Backtrack Elimination: Utilizes prompt logic and spatial clustering to group daily activities by geographical proximity, ensuring realistic travel times and preventing inefficient cross-city transit.
- Comprehensive Daily Itineraries: Produces structured morning, afternoon, evening, and night breakdowns covering stays, iconic unmissable landmarks, offbeat hidden spots, regionally authentic food stops, and specific transit modes.
- Structured AI Output: Utilized structured JSON output schemas and strict system instructions to eliminate model hallucinations and ensure clean UI data binding.

================================================================================
EDUCATION & ACADEMIC BACKGROUND
================================================================================
- Bachelor of Commerce (Travel & Tourism) | Sri Sri University (2017 - 2020)
- Advanced Executive Program in Cybersecurity | NIT Rourkela x Edureka (2020 - 2021)
  - Focus: Information security fundamentals, identity & access management (IAM), data security compliance, risk mitigation.

================================================================================
PROFESSIONAL CERTIFICATIONS & CREDENTIALS
================================================================================
- Building AI Agents | Zapier
  - Core Competency: Autonomous workflows, tool integration, AI agent design.
- Google AI Essentials Specialization | Google
  - Core Competency: Generative AI workflows, prompt engineering, productivity automation.
- Finance Foundations: Risk Management | LinkedIn
  - Core Competency: Financial Risk Management, operational exposure mitigation.
- Analyzing and Visualizing Data in Looker | Google Cloud Community India
  - Core Competency: Looker software, dashboard architecture, BI reporting, data exploration.
- Microsoft Certified: Security, Compliance, and Identity Fundamentals | Microsoft
  - Core Competency: Access management (IAM), cloud security, regulatory compliance controls.
`;

export const SUSHMIT_USER_INFO: CandidateInfo = {
  first_name: 'Sushmit',
  last_name: 'Surendran',
  email: 'Sushmits07@gmail.com',
  phone: '+91 89214 09100',
  location: 'Vadakara, Kerala, India',
  linkedin: 'https://linkedin.com/in/sushmit-surendran',
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
};

// Initial empty cover letter
export const EMPTY_COVER_LETTER: CoverLetterData = {
  recipient: '',
  subject: '',
  body_paragraphs: [],
  signoff: '',
};

// Master Untailored Resume Baseline (Loaded when no specific job is targeted)
export const MASTER_BASE_RESUME: TailoredResumeData = {
  full_name: 'Sushmit Surendran',
  email: 'Sushmits07@gmail.com',
  phone: '+91 89214 09100',
  location: '',
  linkedin: 'https://linkedin.com/in/sushmit-surendran',
  tailored_summary:
    'Operations and Real-Time Analytics professional with 6 years of experience across fintech service operations, dynamic queue balancing, incident bridge leadership, and process automation. At Revolut, monitor and balance live capacity across 1,000+ frontline agents and 300+ dynamic queues globally. Proven track record executing Jove SQL investigations to eliminate cross-queue transfer loops, leading operational incident bridges during platform outages, and engineering automated reporting workflows.',
  skills: [
    'Real-Time Queue Monitoring & WFM',
    'Service Level Adherence (SLA) Oversight',
    'SQL Investigation (Jove Platform)',
    'Looker & Metabase Analytics',
    'Incident Bridge & Triage Leadership',
    'Advanced Excel (Pivot Tables, XLOOKUP)',
    'Confluence SOP & Knowledge Governance',
    'Duplicate Message Suppression Controls',
    'B2B Client Delivery & Scoping',
    'AI-Assisted Workflow Automation',
    'Cross-Functional Stakeholder Alignment',
    'Payment Disputes & Chargebacks',
  ],
  experiences: [
    {
      title: 'Real-Time Analyst / SME, Real-Time Operations',
      company: 'Revolut',
      date_range: 'Oct 2023 – Present',
      location: '',
      bullets: [
        'Supervise live service operations across 1,000+ frontline agents and 300+ dynamic queues simultaneously across EEA/UK, Americas, and APAC, balancing agent allocations to preempt SLA breaches.',
        'Wrote and executed SQL queries via the Jove platform to investigate recurring chat ping-pong loops across queues; engineered a standardized escalation pathway that eliminated repeat transfers.',
        'Led operational incident response and bridge triage during live platform outages and surges of 1,000–2,000 chats; built geo-targeted communication banners and automated Slack incident workflows.',
        'Designed and deployed a Gemini-assisted breach reporting workflow that automated collation of incident metrics, reducing a 15-minute manual reporting cycle to under 3 minutes.',
        'Managed Confluence operational knowledge architecture, executing quarterly reviews and authoring definitive SOPs for onboarding analysts on incident bridge protocols.',
      ],
    },
    {
      title: 'Support Specialist, Chargebacks & Disputes',
      company: 'Revolut',
      date_range: 'Oct 2022 – Sep 2023',
      location: '',
      bullets: [
        'Handled and adjudicated complex payment disputes and cardholder chargeback escalations in a regulated fintech environment; maintained a consistent first-contact resolution (FCR) rate above 95%.',
        'Investigated recurring dispute friction points and partnered cross-functionally to design and introduce 3 key chargeback handling workflow improvements that streamlined evidence gathering.',
      ],
    },
    {
      title: 'Customer Success / Account Management',
      company: 'Torc Infotech Pvt. Ltd.',
      date_range: 'Sep 2020 – Sep 2022',
      location: '',
      bullets: [
        'Managed an end-to-end B2B account portfolio of 8 international enterprise client accounts across full lifecycles from discovery, technical scoping, and delivery tracking to billing and retention.',
        'Expanded an initial European pilot project into 4 consecutive delivered project scopes within 8 months, successfully converting the client relationship into an ongoing technical retainer.',
        'Co-led technical discovery and solution scoping for a large-scale healthcare platform proposal estimated at 32 person-months across 28 weeks, authoring SOWs and boundary conditions.',
        'Coordinated multi-currency recurring international billing across INR, USD, AED, and EUR, reconciling project milestone completions with contractual billing schedules.',
      ],
    },
  ],
  projects: VAULT_PROJECTS,
  education: [
    {
      degree: 'Bachelor of Commerce (Travel & Tourism)',
      institution: 'Sri Sri University',
      year: '2017 – 2020',
    },
    {
      degree: 'Advanced Executive Program in Cybersecurity',
      institution: 'NIT Rourkela x Edureka',
      year: '2020 – 2021',
    },
  ],
  certifications: [
    'Analyzing and Visualizing Data in Looker | Google Cloud Community India',
    'Microsoft Certified: Security, Compliance, and Identity Fundamentals (SC-900)',
    'SQL for Data Science | Coursera / UC Davis',
    'Generative AI Fundamentals | Google Cloud Skills Boost',
  ],
};

// Initial tailored Weaver package (ready on selection)
export const INITIAL_WEAVER_RESUME: TailoredResumeData = {
  full_name: 'Sushmit Surendran',
  email: 'Sushmits07@gmail.com',
  phone: '+91 89214 09100',
  location: '',
  linkedin: 'https://linkedin.com/in/sushmit-surendran',
  tailored_summary:
    'Operations and Workforce Management professional with 6 years of experience across fintech operations, real-time resource allocation, B2B account delivery, and process improvement. At Revolut, monitor and balance real-time capacity across 1,000+ frontline agents and 300+ dynamic queues globally. Proven track record in Jove SQL investigation, eliminating queue ping-pong cycles, stakeholder coordination across US and international teams, and deploying AI-assisted reporting workflows that reduced manual cycles from 15 minutes to under 3 minutes.',
  skills: [
    'Resource Scheduling & Queue Balancing',
    'Capacity Planning & Forecast Balancing',
    'Workforce Utilization Tracking (RTA)',
    'SQL Investigation (Jove Querying)',
    'US–India Stakeholder Coordination',
    'Advanced Excel (Pivot Tables, XLOOKUP)',
    'Looker & Metabase Analytics',
    'Incident & Escalation Management',
    'Confluence SOP & Knowledge Governance',
    'Duplicate Message Suppression Controls',
    'SLA & KPI Governance',
    'AI-Assisted Workflow Automation',
  ],
  experiences: [
    {
      title: 'Real-Time Analyst / SME, Real-Time Operations',
      company: 'Revolut',
      date_range: 'Oct 2023 – Present',
      location: '',
      bullets: [
        'Supervise live service operations across 1,000+ frontline agents and 300+ dynamic queues simultaneously across EEA/UK, Americas, and APAC, balancing agent allocations to preempt SLA breaches.',
        'Wrote and executed SQL queries via the Jove platform to investigate recurring chat ping-pong loops across queues; engineered a standardized escalation pathway that eliminated repeat transfers.',
        'Led operational incident response and bridge triage during live platform outages and surges of 1,000–2,000 chats; built geo-targeted communication banners and automated Slack incident workflows.',
        'Designed and deployed a Gemini-assisted breach reporting workflow that automated collation of incident metrics, reducing a 15-minute manual reporting cycle to under 3 minutes.',
        'Managed Confluence operational knowledge architecture, executing quarterly reviews and authoring definitive SOPs for onboarding analysts on incident bridge protocols.',
      ],
    },
    {
      title: 'Support Specialist, Chargebacks & Disputes',
      company: 'Revolut',
      date_range: 'Oct 2022 – Sep 2023',
      location: '',
      bullets: [
        'Handled and adjudicated complex payment disputes and cardholder chargeback escalations in a regulated fintech environment; maintained a consistent first-contact resolution (FCR) rate above 95%.',
        'Investigated recurring dispute friction points and partnered cross-functionally to design and introduce 3 key chargeback handling workflow improvements that streamlined evidence gathering.',
      ],
    },
    {
      title: 'Customer Success / Account Management',
      company: 'Torc Infotech Pvt. Ltd.',
      date_range: 'Sep 2020 – Sep 2022',
      location: '',
      bullets: [
        'Managed an end-to-end B2B account portfolio of 8 international enterprise client accounts across full lifecycles from discovery, technical scoping, and delivery tracking to billing and retention.',
        'Expanded an initial European pilot project into 4 consecutive delivered project scopes within 8 months, successfully converting the client relationship into an ongoing technical retainer.',
        'Co-led technical discovery and solution scoping for a large-scale healthcare platform proposal estimated at 32 person-months across 28 weeks, authoring SOWs and boundary conditions.',
        'Coordinated multi-currency recurring international billing across INR, USD, AED, and EUR, reconciling project milestone completions with contractual billing schedules.',
      ],
    },
  ],
  projects: [],
  education: [
    {
      degree: 'Bachelor of Commerce (Travel & Tourism)',
      institution: 'Sri Sri University',
      year: '2017 – 2020',
    },
    {
      degree: 'Advanced Executive Program in Cybersecurity',
      institution: 'NIT Rourkela x Edureka',
      year: '2020 – 2021',
    },
  ],
  certifications: [
    'Analyzing and Visualizing Data in Looker | Google Cloud Community India',
    'Building AI Agents | Zapier',
    'Google AI Essentials Specialization | Google',
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
    'Outstanding match. The candidate brings 6 years of operational experience with real-time capacity and staffing balancing across 1,000+ agents at Revolut, matching Weaver’s need for 100+ professional resource scheduling.',
  key_matching_factors: [
    'Direct operational scale: Managed staffing, queue adherence, and workload balancing for 1,000+ agents & 150+ queues at Revolut.',
    'Workforce analytics & tooling: Daily usage of advanced Excel (Pivot tables), Looker, Metabase, and SQL (Jove) for capacity tracking.',
    'Cross-border coordination: Deep experience aligning US, UK/EEA, and APAC operational teams across shifting time zones.',
    'Executive stakeholder reporting: Automated real-time incident and capacity workflows reducing reporting latency.',
  ],
  missing_critical_skills: [
    'Direct CPA/Tax firm background (mitigated by B2B client account management and regulated fintech compliance experience).',
  ],
  gaps: [
    {
      missing: 'Direct Public Accounting / CPA Tax Firm Background',
      where_to_work: 'Frame B2B account delivery at Torc Infotech and high-volume fintech operations at Revolut as proof of fast-paced stakeholder rigor. Review US tax season utilization variance metrics and multi-tier scheduling models.',
      severity: 'MODERATE',
    },
    {
      missing: 'Workday / UltiPro Enterprise Resource Scheduling Software',
      where_to_work: 'Highlight advanced Excel capacity modeling (Pivot Tables, XLOOKUP), Jove SQL querying, and proven track record of mastering proprietary workforce management tools within 2 weeks.',
      severity: 'NICE_TO_HAVE',
    },
  ],
  tailoring_recommendations: [
    'Emphasize capacity tracking, scheduling variance, and intraday reallocations performed at Revolut.',
    'Highlight the automated Gemini reporting workflow that reduced 15-minute manual reporting to under 3 minutes.',
    'Feature Torc Infotech person-month capacity estimation (32 person-months) as proof of resource budgeting experience.',
    'Focus on workforce utilization metrics, roster management, and cross-functional alignment.',
  ],
  skill_roadmap: [
    {
      skill: 'Professional Services WIP & Utilization Economics',
      action_plan: 'Master billable hour variance models, realization rate computation, and engagement margin optimization used in public accounting/consulting firms.',
      recommended_certification: 'AICPA Professional Services Operations Certificate',
      certification_provider: 'AICPA & CIMA',
      timeline: '2–3 weeks',
      importance: 'RECOMMENDED',
      practical_project: 'Build an Excel utilization tracker modeling 100+ audit/tax staff across busy-season capacity constraints.',
    },
    {
      skill: 'Enterprise Resource Management & PSA Software',
      action_plan: 'Familiarize with professional services automation (PSA) suites (Kantata/Mavenlink, Workday Resource Management, BigTime) for multi-tiered staff scheduling.',
      recommended_certification: 'Kantata Product Certified Specialist / Workday Pro',
      certification_provider: 'Workday / Kantata',
      timeline: '1–2 weeks',
      importance: 'RECOMMENDED',
      practical_project: 'Create a comparative workflow map linking Revolut real-time scheduling heuristics to accounting firm engagement rosters.',
    },
    {
      skill: 'Cross-Border Capacity Governance & Offshore Team Leadership',
      action_plan: 'Formalize stakeholder alignment techniques for managing offshore India delivery pods supporting US partner engagements.',
      recommended_certification: 'Certified Associate in Project Management (CAPM)',
      certification_provider: 'Project Management Institute (PMI)',
      timeline: '3–4 weeks',
      importance: 'NICE_TO_HAVE',
      practical_project: 'Document an SOP for US-India scheduling conflict resolution and utilization variance escalations.',
    },
  ],
  recommended_certifications: [
    {
      name: 'Certified Associate in Project Management (CAPM)',
      issuer: 'Project Management Institute (PMI)',
      target_skill: 'Resource planning, schedule management, cross-functional project governance',
      estimated_time: '3–4 weeks',
      why_it_helps: 'Validates formal capacity management and project delivery skills for Weaver engagement leaders.',
      difficulty: 'Intermediate',
    },
    {
      name: 'AICPA Professional Services Fundamentals',
      issuer: 'AICPA & CIMA',
      target_skill: 'Accounting firm operational rhythms, billable realization, tax practice busy-season dynamics',
      estimated_time: '2 weeks',
      why_it_helps: 'Directly bridges the CPA/Tax firm domain gap, showing immediate operational literacy for Weaver partners.',
      difficulty: 'Beginner',
    },
    {
      name: 'Alteryx Designer Core / Advanced Excel Financial Modeling',
      issuer: 'Alteryx / Corporate Finance Institute',
      target_skill: 'Automated staff allocation reconciliations, utilization forecasting algorithms',
      estimated_time: '2–3 weeks',
      why_it_helps: 'Enables instant automation of complex staffing models, reducing weekly scheduling cycle times.',
      difficulty: 'Intermediate',
    },
  ],
};

export const INITIAL_WEAVER_COVER_LETTER: CoverLetterData = {
  recipient: 'Talent Optimization & Resource Management Hiring Team\nWeaver India (Weaver and Tidwell, LLP)',
  subject: 'Application for Senior Associate - Resource Management (Requisition: SENIO003186)',
  body_paragraphs: [
    'I am writing to express my strong enthusiasm for the Senior Associate – Resource Management position with Weaver’s India Tax practice. With 6 years of experience across real-time workforce monitoring, capacity balancing, and B2B account delivery, I have focused my career on optimizing resource utilization and ensuring skilled talent is deployed seamlessly against dynamic operational demands.',
    'In my current role as Real-Time Analyst and SME at Revolut, I monitor and coordinate operational capacity across 1,000+ customer operations agents and 150+ queues globally across Americas, UK/EEA, and APAC time zones. My responsibilities require identifying intraday capacity bottlenecks, executing staffing reallocations, and auditing workforce utilization data using Looker, Metabase, advanced Excel models, and SQL. Additionally, I spearheaded an AI-assisted reporting automation that reduced our queue breach logging workflow from 15 minutes to under 3 minutes, significantly improving cross-functional leadership visibility during volume surges.',
    'Earlier at Torc Infotech, I managed delivery coordination for 8 international client accounts, translating operational needs into resource requirements—including scoping a 32-person-month healthcare technology engagement over 28 weeks and reconciling international billing hours. Weaver’s emphasis on proactive collaboration between U.S. engagement leaders and India delivery teams directly matches my background. I am excited about the opportunity to join Weaver and contribute immediately to your capacity planning, utilization analytics, and scheduling integrity.',
  ],
  signoff: 'Sincerely,\nSushmit Surendran\n+91 89214 09100 | Sushmits07@gmail.com | linkedin.com/in/sushmit-surendran',
};

export const INITIAL_SCREENING_ANSWERS: ScreeningAnswer[] = [
  {
    question: 'Why are you interested in this Resource Management role at Weaver?',
    suggested_answer:
      'Weaver’s collaborative model between US and India Tax teams offers the ideal environment for my background. Over 6 years in operations and account coordination, I have specialized in balancing workforce capacity, resolving scheduling variances, and building automated reporting workflows. Joining Weaver allows me to apply these resource optimization skills in an established, high-growth professional services firm.',
  },
  {
    question: 'Describe your experience with capacity planning, scheduling, and Excel.',
    suggested_answer:
      'At Revolut, I supervise real-time operational capacity and staffing adherence across 1,000+ agents and 150+ queues spanning Americas, UK/EEA, and APAC regions. I utilize advanced Excel (Pivot Tables, XLOOKUP), Looker, and SQL to analyze utilization trends and coordinate staffing mitigations. At Torc Infotech, I supported capacity scoping for enterprise engagements (up to 32 person-months) and tracked billable utilization across international project roadmaps.',
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
    why_asked: 'Evaluates prioritization frameworks, capacity balancing, and conflict mitigation when multiple client deliverables peak simultaneously.',
    key_talking_points: [
      'Rank projects by client criticality, SLA penalties, and statutory tax deadlines.',
      'Use Looker/Excel utilization dashboards to isolate unallocated or under-utilized capacity.',
      'Proactively communicate schedule variances to US engagement partners with alternative staffing plans.',
    ],
    suggested_answer:
      'At Torc Infotech and Revolut, I managed resource scheduling across multiple overlapping deliverables under strict deadlines. My framework starts with objective triage: ranking engagements by deadline rigidity and statutory milestones. In high-demand periods, I monitored real-time queue adherence across 150+ queues to identify teams with surplus capacity and dynamically shifted workloads without compromising primary SLAs. For Weaver, I would establish weekly utilization forecasting models so engagement managers receive early warning of capacity shortfalls 2–3 weeks before busy-season crunches.',
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
      'Deliver compromise solutions (e.g., hybrid pairing of senior SME with junior analyst).',
    ],
    suggested_answer:
      'At Revolut, product managers often requested dedicated senior analysts during technical releases, which risked leaving ongoing operations exposed. Rather than simply rejecting the request, I used Jove SQL query logs and occupancy data to demonstrate that dedicating full-time staff would cause queue wait times to spike by 35%. Instead, I proposed a tiered support model: a designated senior SME was available for escalation bridges while frontline volume was handled by core staff with pre-configured routing. The release succeeded with zero SLA breaches, and the partner commended the data-driven compromise.',
  },
  {
    question: 'Walk me through how you use data analytics or SQL to investigate operational bottlenecks and eliminate inefficiencies.',
    category: 'Technical & Operational',
    source: 'Role Architecture Analysis',
    isFromPortal: false,
    why_asked: 'Verifies technical data analytics proficiency, SQL querying ability, and root-cause problem solving in workforce operations.',
    key_talking_points: [
      'Identified chat transfer loop defect via SQL on Jove platform.',
      'Quantified daily volume impact and handle time inflation.',
      'Designed structured escalation pathway to senior tier, permanently eliminating loops.',
    ],
    suggested_answer:
      'At Revolut, I noticed customer support interactions were frequently ping-ponging between different functional queues without reaching resolution. I wrote and executed SQL queries via our Jove database platform to track interaction paths, isolating repeated transfer patterns and proving this defect affected hundreds of chats daily with severe handle time inflation. Presenting this data to queue owners, I engineered an automated routing SOP that directed looping cases immediately to advanced tier agents who assumed full case ownership. This eliminated repeat transfers and accelerated resolution times by over 40%.',
  },
  {
    question: 'How do you handle real-time resource re-allocation during sudden operational volatility or volume surges?',
    category: 'Technical & Operational',
    source: 'Role Architecture Analysis',
    isFromPortal: false,
    why_asked: 'Assesses crisis management, real-time tactical agility, and cross-functional communication during unforeseen demand spikes.',
    key_talking_points: [
      'Pre-configured trigger thresholds based on SLA drop rates.',
      'Rapid intraday reallocation across tiers.',
      'Executive communication bridge to maintain leadership visibility.',
    ],
    suggested_answer:
      'As Incident Management POC at Revolut, I oversaw operational triage during sudden spikes of 1,000 to 2,000 concurrent chats. When volatility hit, I utilized real-time queue dashboards to execute pre-approved deflection workflows: pausing non-essential offline activities, redirecting cross-skilled agents from low-demand queues, and deploying geo-targeted user banners to curb redundant inquiries. I also created an AI-assisted incident reporting automation that cut leadership reporting time from 15 minutes to under 3 minutes, giving executive leadership immediate visibility during crisis windows.',
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
      'I would first review the engagement’s current burn rate and time-entry breakdown against the contractual SOW, as I did when managing multi-currency billing reconciliation at Torc Infotech. Often, requests for more hours stem from senior professionals spending time on administrative or data-prep tasks that can be delegated to junior staff or automated via standardized templates. If the scope has genuinely expanded, I would partner with the engagement lead to prepare a formal scope change justification for the client, ensuring the firm does not absorb unbudgeted costs that erode realization margins.',
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

