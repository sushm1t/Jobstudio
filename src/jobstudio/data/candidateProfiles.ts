// @ts-nocheck -- ported verbatim from the original project
import { CandidateInfo, TailoredResumeData, MASTER_BASE_RESUME, DEMO_PROFILE_TEXT, DEMO_USER_INFO } from './defaultData';

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

export const DEMO_PROFILE_RECORD: CandidateProfileRecord = {
  id: 'preset-alex-morgan',
  isPreset: true,
  name: 'Alex Morgan',
  headline: 'Operations Specialist & Technical Systems Analyst',
  email: DEMO_USER_INFO.email,
  phone: DEMO_USER_INFO.phone,
  location: DEMO_USER_INFO.location,
  linkedin: DEMO_USER_INFO.linkedin,
  summary: MASTER_BASE_RESUME.tailored_summary,
  skills: MASTER_BASE_RESUME.skills,
  experiences: MASTER_BASE_RESUME.experiences,
  education: MASTER_BASE_RESUME.education,
  certifications: MASTER_BASE_RESUME.certifications,
  masterProfileText: DEMO_PROFILE_TEXT,
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

export const SUSHMIT_SURENDRAN_PROFILE_RECORD: CandidateProfileRecord = {
  id: 'preset-sushmit-surendran',
  isPreset: false,
  name: 'Sushmit Surendran',
  headline: 'Business & Product Operations | Process Improvement | Implementation Operations',
  email: 'Sushmits07@gmail.com',
  phone: '+91 89214 09100',
  location: 'Vadakara, Kerala, India',
  linkedin: 'https://linkedin.com/in/sushmit-surendran',
  summary:
    'Operations professional with 6 years of experience across fintech operations, B2B account management, service delivery, incident response and process improvement. At Revolut, support real-time operations spanning 1,000+ agents and 150+ queues globally; earlier managed an eight-account B2B portfolio at Torc Infotech. Experience in cross-functional coordination, requirements discovery, operational analysis, workflow improvements and AI-assisted reporting. Seeking Business Operations, Product Operations, Implementation Operations and Process Improvement roles.',
  skills: [
    'Business Operations',
    'Product Operations',
    'Process Improvement',
    'Incident & Escalation Management',
    'SLA Monitoring',
    'Operational Reporting',
    'Root Cause Analysis',
    'Risk Monitoring',
    'Stakeholder Coordination',
    'Requirements Gathering',
    'Solution Scoping',
    'Project & Delivery Coordination',
    'Process Documentation',
    'Cross-functional Collaboration',
    'Excel',
    'Google Sheets',
    'Looker',
    'Metabase',
    'Jove (SQL-based reporting)',
    'Basic SQL',
    'Confluence',
    'Jira',
    'Gemini AI',
  ],
  experiences: [
    {
      title: 'Real-Time Analyst / SME, Real-Time Monitoring',
      company: 'Revolut',
      date_range: 'Oct 2023 – Present',
      location: 'Remote',
      bullets: [
        'Monitor real-time fintech service operations across 1,000+ agents and 150+ queues in EEA/UK, Americas and APAC; identify SLA risks and coordinate mitigation during volume spikes.',
        'Coordinate operational response to outages, queue breaches and high-volume incidents, including surges of 1,000-2,000 chats; align communications, case isolation, staffing actions and escalation.',
        'Serve as an operational point of contact for Wealth & Trading and Crypto incidents, collaborating with product-related and operations stakeholders on investigation, updates and resolution tracking.',
        'Built a Gemini-assisted queue breach reporting workflow that reduced a roughly 15-minute manual process to a few minutes; introduced duplicate-message tracking controls to reduce communication risk.',
        'Created 35+ targeted communication audiences and coordinated 10+ incident banners, including approvals, deployment coordination and process documentation.',
        'Use Jove, Metabase, Looker and Excel to investigate queue performance, surface trends and support service recovery decisions.',
      ],
    },
    {
      title: 'Support Specialist, Chargebacks',
      company: 'Revolut',
      date_range: 'Oct 2022 – Sep 2023',
      location: 'Remote',
      bullets: [
        'Resolved complex payment disputes and escalations in a regulated fintech environment; achieved over 95% first-contact resolution according to team reporting.',
        'Investigated recurring issues and partnered with internal stakeholders on three chargeback-handling workflow improvements.',
      ],
    },
    {
      title: 'Customer Success / Account Management',
      company: 'Torc Infotech Pvt. Ltd.',
      date_range: 'Sep 2020 – Sep 2022',
      location: 'India',
      bullets: [
        'Managed eight B2B accounts from discovery and requirements discussions through delivery coordination, billing and expansion across multiple industries.',
        'Expanded a European pilot into four consecutive project deliveries within eight months and an ongoing retainer by coordinating delivery and follow-on scope.',
        'Supported solution scoping for a healthcare technology proposal estimated at 32 person-months across 28 weeks, translating operational needs into requirements and scope boundaries.',
        'Coordinated recurring international billing across INR, USD, AED and EUR and identified opportunities to extend account engagements into additional digital services.',
      ],
    },
  ],
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
  certifications: ['Google AI Essentials'],
  masterProfileText: `### CANDIDATE: SUSHMIT SURENDRAN
**Target Roles:** Business & Product Operations | Process Improvement | Implementation Operations
**Contact:** Vadakara, Kerala, India | +91 89214 09100 | Sushmits07@gmail.com | linkedin.com/in/sushmit-surendran

### PROFESSIONAL SUMMARY
Operations professional with 6 years of experience across fintech operations, B2B account management, service delivery, incident response and process improvement. At Revolut, support real-time operations spanning 1,000+ agents and 150+ queues globally; earlier managed an eight-account B2B portfolio at Torc Infotech. Experience in cross-functional coordination, requirements discovery, operational analysis, workflow improvements and AI-assisted reporting. Seeking Business Operations, Product Operations, Implementation Operations and Process Improvement roles.

### CORE SKILLS
- **Operations:** Business Operations, Incident & Escalation Management, SLA Monitoring, Process Improvement, Operational Reporting, Root Cause Analysis, Risk Monitoring
- **Delivery:** Stakeholder Coordination, Requirements Gathering, Solution Scoping, Project & Delivery Coordination, Process Documentation, Cross-functional Collaboration
- **Tools:** Excel, Google Sheets, Looker, Metabase, Jove (SQL-based reporting), Basic SQL, Confluence, Jira, Gemini AI

### PROFESSIONAL EXPERIENCE
**Revolut** | Real-Time Analyst / SME, Real-Time Monitoring | Oct 2023 – Present
- Monitor real-time fintech service operations across 1,000+ agents and 150+ queues in EEA/UK, Americas and APAC; identify SLA risks and coordinate mitigation during volume spikes.
- Coordinate operational response to outages, queue breaches and high-volume incidents, including surges of 1,000-2,000 chats; align communications, case isolation, staffing actions and escalation.
- Serve as an operational point of contact for Wealth & Trading and Crypto incidents, collaborating with product-related and operations stakeholders on investigation, updates and resolution tracking.
- Built a Gemini-assisted queue breach reporting workflow that reduced a roughly 15-minute manual process to a few minutes; introduced duplicate-message tracking controls to reduce communication risk.
- Created 35+ targeted communication audiences and coordinated 10+ incident banners, including approvals, deployment coordination and process documentation.
- Use Jove, Metabase, Looker and Excel to investigate queue performance, surface trends and support service recovery decisions.

**Revolut** | Support Specialist, Chargebacks | Oct 2022 – Sep 2023
- Resolved complex payment disputes and escalations in a regulated fintech environment; achieved over 95% first-contact resolution according to team reporting.
- Investigated recurring issues and partnered with internal stakeholders on three chargeback-handling workflow improvements.

**Torc Infotech Pvt. Ltd.** | Customer Success / Account Management | Sep 2020 – Sep 2022
- Managed eight B2B accounts from discovery and requirements discussions through delivery coordination, billing and expansion across multiple industries.
- Expanded a European pilot into four consecutive project deliveries within eight months and an ongoing retainer by coordinating delivery and follow-on scope.
- Supported solution scoping for a healthcare technology proposal estimated at 32 person-months across 28 weeks, translating operational needs into requirements and scope boundaries.
- Coordinated recurring international billing across INR, USD, AED and EUR and identified opportunities to extend account engagements into additional digital services.

### INDEPENDENT PROJECT
**CreditPilot** | Product Prototype - Rewards & Travel Technology
- Built a working prototype for a credit card rewards and travel discovery concept using AI-assisted no-code tools; explored user journeys, feature prioritization and interface iterations.
- Designed concepts for loyalty program organization, award travel discovery and cash-versus-points comparisons; prototype stage, not a production service.

### EDUCATION & PROFESSIONAL DEVELOPMENT
- Bachelor of Commerce (Travel & Tourism) | Sri Sri University | 2017 – 2020
- Advanced Executive Program in Cybersecurity | NIT Rourkela x Edureka | 2020 – 2021
- Google AI Essentials | Completed
`,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export const PRACHI_KERKETTA_PROFILE_RECORD: CandidateProfileRecord = {
  id: 'preset-prachi-kerketta',
  isPreset: true,
  name: 'Prachi Kerketta',
  headline: 'Operation Manager | Travel & Tour Consultant',
  email: 'prachikerketta03@gmail.com',
  phone: '+91 8847814701',
  location: 'Goa, India',
  linkedin: 'https://linkedin.com/in/prachikerketta',
  summary:
    'Operations Leader with 4+ years of experience in the travel domain, bringing a strong focus on operational efficiency, cost optimization, commercial awareness, technology adoption, and business growth. Proven ability to manage end-to-end travel programs across Asia, Europe, Africa, and the Middle East. Expertise includes daily business operations, ticketing, and supplier coordination with 20+ partners, ensuring cost efficiency and service excellence. Skilled in driving process improvement by standardizing SOPs and implementing workflow automation using tools (SAP Concur, Travefy, and Rezdy), resulting in 10%+ YoY growth, 15%+ cost savings, and a 60%+ reduction in manual effort. Strong capabilities in planning strategies, KPIs performance, managing budgets, financial reporting, risk management, and building client, vendor, and supplier relations.',
  skills: [
    'Operations Management',
    'Data Analysis & Reporting',
    'Vendor Management & Contracting',
    'Supplier & DMC Coordination',
    'Itinerary Planning',
    'Visa & Travel Documentation',
    'Travel Research & Planning',
    'KPI Tracking',
    'Client Relationship Management',
    'Process Improvement',
    'Air Ticketing',
    'Holiday & Tour Packages',
    'Cost Control',
    'Compliance',
    'SOP & Travel Policy',
    'B2B SaaS & B2C',
    'Budgeting',
    'SAP Concur',
    'Travefy',
    'WeTravel',
    'Rezdy',
    'Amadeus (GDS)',
    'Salesforce',
    'Zoho CRM',
    'HubSpot',
    'Power BI',
    'Microsoft Office (Excel, PowerPoint, Word)',
    'SQL',
  ],
  experiences: [
    {
      title: 'Travel Operations Consultant (Contract)',
      company: 'Voyagio (B2C Premium & Luxury Tours)',
      date_range: 'Mar 2026 – Present',
      location: 'Goa, India',
      bullets: [
        'Retained to provide operational guidance to existing customers, addressing process gaps, improving service continuity, and strengthening retention and business value.',
        'Build and optimize 10+ domestic and international tours and lead 6+ premium ongoing tours, balancing feasibility, cost, service standards, and business objectives.',
        'Review ticketing options, fare rules, routing, and availability to support cost-effective planning and informed bookings.',
        'Researched 5+ destinations and identified 20+ supplier networks across hotels, DMCs, logistics, and local partners to support competitive travel solutions.',
        'Review customer feedback and market trends to address recurring issues, improve processes, and enhance service quality.',
        'Working closely with cross-functional teams to assess market opportunities and recommend travel and tour offerings based on customer demand and business priorities.',
      ],
    },
    {
      title: 'Operations Manager',
      company: 'Voyagio (B2C Premium & Luxury Tours)',
      date_range: 'Oct 2024 – Mar 2026',
      location: 'Goa, India',
      bullets: [
        'Led end-to-end operations for 30+ premium tours across Asia, Europe, Africa, and the Middle East, ensuring timely execution and high delivery standards.',
        'Managed 35+ itinerary planning, airline ticketing, fares, and routing in coordination with DMCs, vendors, local partners, and logistics teams to ensure efficient, cost-effective travel arrangements.',
        'Maintained 20+ hotel and destination supplier partnerships, securing better rates and 10–15% cost savings.',
        'Introduced & implemented centralized budgeting and cost tracking through Excel/Google Sheets and Power BI to monitor expenses, margins, and trip profitability.',
        'Led the adoption of technologies (Travefy, Rezdy, and Trip Planner) to automate workflows, reducing manual tasks with more structure and improving turnaround time by 40%.',
        'Built a centralised tracking system for bookings, payments, supplier follow-ups, trip status, and guest requirements, enabling real-time team visibility.',
        'Managed 50+ visas, travel insurance, and regulatory requirements across international programs to ensure compliance and traveler readiness.',
        'Collaborated and supervised the marketing team to promote premium and luxury travel offerings and strengthen market positioning.',
        'Established SOPs and travel policies, track KPIs, and contribute to 10% YoY booking growth through improved cost efficiency, customer satisfaction, and repeat bookings.',
        'Successfully resolved 90+% operational escalations and booking discrepancies through timely coordination with suppliers and internal teams, minimizing customer impact.',
      ],
    },
    {
      title: 'Assistant Manager (Business Development & Marketing)',
      company: 'TravelSpends (B2B SaaS)',
      date_range: 'Jul 2022 – Aug 2024',
      location: 'Goa, India',
      bullets: [
        'Onboarded 20+ corporate and MNC accounts through prospecting, cold outreach, client follow-ups, and lead management, contributing to ₹70L+ revenue growth.',
        'Implemented advanced SaaS travel management tools to corporate accounts, demonstrating ROI and optimization strategies to secure long-term partnerships.',
        'Built 30+ relationships with corporate decision-makers and key accounts, supporting 70% contract retention and 90% client satisfaction.',
        'Developed RFPs, pitch decks, and commercial proposals for individual client accounts to support corporate client acquisition and strengthen the sales pipeline.',
        'Developed corporate travel policies, SLAs, and contracts to streamline account onboarding and maintain service standards.',
        'Managed client invoicing and payment reconciliation, ensuring 100% payment accuracy and timely financial operations.',
        'Analyzed market and competitor trends to understand evolving corporate travel requirements, track industry shifts, and identify opportunities for new offerings.',
        'Designed and strategised LinkedIn and email campaigns targeting corporate prospects, customer satisfaction forms, and campaign assets to support brand visibility and lead generation.',
        'Built the company’s online presence increasing 500+ followers in two months through content planning, audience engagement, and consistent publishing.',
      ],
    },
  ],
  education: [
    {
      degree: 'Master of Tourism & Travel Management',
      institution: 'Christ University',
      year: '2020 – 2022',
    },
    {
      degree: 'Post Graduate Diploma in Computer Applications',
      institution: 'Sun Tech Institute',
      year: '2018 – 2019',
    },
    {
      degree: 'Bachelor of Commerce',
      institution: 'Ravenshaw University',
      year: '2017 – 2020',
    },
  ],
  certifications: [
    'Travel Consultant Business | TBO Academy',
    'Visa Management | TBO Academy',
    'Introduction to Sabre Business Course | TBO Academy',
    'AI for Travel Business Growth | TBO Academy',
    'Air Ticketing Business | TBO Academy',
    'Travel Insurance Essentials | TBO Academy',
  ],
  masterProfileText: `### CANDIDATE: PRACHI KERKETTA
**Target Roles:** Operation Manager | Travel & Tour Consultant | Operations Specialist
**Contact:** Goa, India | +91 8847814701 | prachikerketta03@gmail.com | linkedin.com/in/prachikerketta

### PROFESSIONAL SUMMARY
Operations Leader with 4+ years of experience in the travel domain, bringing a strong focus on operational efficiency, cost optimization, commercial awareness, technology adoption, and business growth. Proven ability to manage end-to-end travel programs across Asia, Europe, Africa, and the Middle East. Expertise includes daily business operations, ticketing, and supplier coordination with 20+ partners, ensuring cost efficiency and service excellence. Skilled in driving process improvement by standardizing SOPs and implementing workflow automation using tools (SAP Concur, Travefy, and Rezdy), resulting in 10%+ YoY growth, 15%+ cost savings, and a 60%+ reduction in manual effort. Strong capabilities in planning strategies, KPIs performance, managing budgets, financial reporting, risk management, and building client, vendor, and supplier relations.

### CORE SKILLS
- Operations Management, Vendor Management & Contracting, Supplier & DMC Coordination, Itinerary Planning, Visa & Travel Documentation, Travel Research & Planning
- KPI Tracking, Client Relationship Management, Issue Resolution, Process Improvement, Air Ticketing, Bookings, Holiday & Tour Packages, Cost Control, Compliance, SOP & Travel Policy
- Tools & Tech: SAP Concur, Travefy, Rezdy, WeTravel, Amadeus (GDS), Salesforce, Zoho CRM, HubSpot, Power BI, Excel, SQL

### PROFESSIONAL EXPERIENCE
**Voyagio (B2C Premium & Luxury Tours)** | Travel Operations Consultant (Contract) | Mar 2026 – Present
- Retained to provide operational guidance to existing customers, addressing process gaps, improving service continuity, and strengthening retention and business value.
- Build and optimize 10+ domestic and international tours and lead 6+ premium ongoing tours, balancing feasibility, cost, service standards, and business objectives.
- Review ticketing options, fare rules, routing, and availability to support cost-effective planning and informed bookings.
- Researched 5+ destinations and identified 20+ supplier networks across hotels, DMCs, logistics, and local partners to support competitive travel solutions.
- Review customer feedback and market trends to address recurring issues, improve processes, and enhance service quality.
- Working closely with cross-functional teams to assess market opportunities and recommend travel and tour offerings based on customer demand and business priorities.

**Voyagio (B2C Premium & Luxury Tours)** | Operations Manager | Oct 2024 – Mar 2026
- Led end-to-end operations for 30+ premium tours across Asia, Europe, Africa, and the Middle East, ensuring timely execution and high delivery standards.
- Managed 35+ itinerary planning, airline ticketing, fares, and routing in coordination with DMCs, vendors, local partners, and logistics teams to ensure efficient, cost-effective travel arrangements.
- Maintained 20+ hotel and destination supplier partnerships, securing better rates and 10–15% cost savings.
- Introduced & implemented centralized budgeting and cost tracking through Excel/Google Sheets and Power BI to monitor expenses, margins, and trip profitability.
- Led the adoption of technologies (Travefy, Rezdy, and Trip Planner) to automate workflows, reducing manual tasks with more structure and improving turnaround time by 40%.
- Built a centralised tracking system for bookings, payments, supplier follow-ups, trip status, and guest requirements, enabling real-time team visibility.
- Managed 50+ visas, travel insurance, and regulatory requirements across international programs to ensure compliance and traveler readiness.
- Collaborated and supervised the marketing team to promote premium and luxury travel offerings and strengthen market positioning.
- Established SOPs and travel policies, track KPIs, and contribute to 10% YoY booking growth through improved cost efficiency, customer satisfaction, and repeat bookings.
- Successfully resolved 90+% operational escalations and booking discrepancies through timely coordination with suppliers and internal teams, minimizing customer impact.

**TravelSpends (B2B SaaS)** | Assistant Manager (Business Development & Marketing) | Jul 2022 – Aug 2024
- Onboarded 20+ corporate and MNC accounts through prospecting, cold outreach, client follow-ups, and lead management, contributing to ₹70L+ revenue growth.
- Implemented advanced SaaS travel management tools to corporate accounts, demonstrating ROI and optimization strategies to secure long-term partnerships.
- Built 30+ relationships with corporate decision-makers and key accounts, supporting 70% contract retention and 90% client satisfaction.
- Developed RFPs, pitch decks, and commercial proposals for individual client accounts to support corporate client acquisition and strengthen the sales pipeline.
- Developed corporate travel policies, SLAs, and contracts to streamline account onboarding and maintain service standards.
- Managed client invoicing and payment reconciliation, ensuring 100% payment accuracy and timely financial operations.
- Analyzed market and competitor trends to understand evolving corporate travel requirements, track industry shifts, and identify opportunities for new offerings.
- Designed and strategised LinkedIn and email campaigns targeting corporate prospects, customer satisfaction forms, and campaign assets to support brand visibility and lead generation.
- Built the company’s online presence increasing 500+ followers in two months through content planning, audience engagement, and consistent publishing.

### EDUCATION
- Master of Tourism & Travel Management | Christ University | 2020 – 2022
- Post Graduate Diploma in Computer Applications | Sun Tech Institute | 2018 – 2019
- Bachelor of Commerce | Ravenshaw University | 2017 – 2020

### CERTIFICATIONS
- Travel Consultant Business | TBO Academy
- Visa Management | TBO Academy
- Introduction to Sabre Business Course | TBO Academy
- AI for Travel Business Growth | TBO Academy
- Air Ticketing Business | TBO Academy
- Travel Insurance Essentials | TBO Academy
`,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export const INITIAL_PRESET_PROFILES: CandidateProfileRecord[] = [
  DEMO_PROFILE_RECORD,
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
  if (!cleanEmail) return 'jobstudio_master_profile_guest';
  return `jobstudio_master_profile_${cleanEmail}`;
}

/**
 * Strict PII & Anti-Hallucination Sanitizer:
 * Scrubs any bracket placeholders or dummy template strings out of candidate profiles,
 * ensuring zero contamination or cross-user data leakage.
 */
export function sanitizeCandidateProfile(profile: any, fallbackEmail?: string, fallbackName?: string): CandidateProfileRecord {
  const assignedEmail = (fallbackEmail || profile?.email || '').toLowerCase().trim();
  const assignedName = (profile?.name && typeof profile.name === 'string' && profile.name.trim() !== 'Candidate' && !profile.name.includes('['))
    ? profile.name.trim()
    : (fallbackName || (assignedEmail ? assignedEmail.split('@')[0] : 'Candidate'));

  const cleanStr = (s?: any) => {
    if (!s || typeof s !== 'string') return '';
    const trimmed = s.trim();
    if (
      (trimmed.startsWith('[') && trimmed.endsWith(']')) ||
      trimmed.includes('[Job Title]') ||
      trimmed.includes('[Company Name]') ||
      trimmed.includes('[Candidate') ||
      trimmed.includes('[Extracted') ||
      trimmed.includes('[Degree Name]') ||
      trimmed.includes('[University Name]') ||
      trimmed.includes('Software Engineer with 4+ years of experience specializing in full-stack development') ||
      trimmed.includes('Software Engineer with X years of experience')
    ) {
      return '';
    }
    return trimmed;
  };

  const cleanBullets = (bullets: any[]) => {
    if (!Array.isArray(bullets)) return [];
    return bullets
      .map((b) => (typeof b === 'string' ? cleanStr(b) : ''))
      .filter((b) => b && !b.includes('[feature]') && !b.includes('[technology]') && !b.includes('[metric]%') && !b.includes('[number]'));
  };

  const cleanExperiences = Array.isArray(profile?.experiences)
    ? profile.experiences
        .filter((exp: any) => exp && typeof exp === 'object')
        .map((exp: any) => ({
          title: cleanStr(exp.title),
          company: cleanStr(exp.company),
          date_range: cleanStr(exp.date_range),
          location: cleanStr(exp.location),
          bullets: cleanBullets(exp.bullets),
        }))
        .filter((exp: any) => exp.title && exp.company) // Remove dummy or unpopulated cards
    : [];

  const cleanEducation = Array.isArray(profile?.education)
    ? profile.education
        .filter((edu: any) => edu && typeof edu === 'object')
        .map((edu: any) => ({
          degree: cleanStr(edu.degree),
          institution: cleanStr(edu.institution),
          year: cleanStr(edu.year),
        }))
        .filter((edu: any) => edu.degree && edu.institution)
    : [];

  const cleanSkills = Array.isArray(profile?.skills)
    ? profile.skills
        .map((s: any) => cleanStr(typeof s === 'string' ? s : s?.name))
        .filter((s: string) => s && !s.includes('[') && !s.includes(']'))
    : [];

  const cleanCertifications = Array.isArray(profile?.certifications)
    ? profile.certifications
        .map((c: any) => cleanStr(typeof c === 'string' ? c : c?.name))
        .filter(Boolean)
    : [];

  return {
    id: profile?.id || `profile-${assignedEmail || 'user'}-${Date.now()}`,
    isPreset: false,
    name: assignedName,
    headline: cleanStr(profile?.headline),
    email: assignedEmail,
    phone: cleanStr(profile?.phone),
    location: cleanStr(profile?.location),
    linkedin: cleanStr(profile?.linkedin),
    summary: cleanStr(profile?.summary),
    skills: cleanSkills,
    experiences: cleanExperiences,
    education: cleanEducation,
    certifications: cleanCertifications,
    masterProfileText: cleanStr(profile?.masterProfileText) || '',
    createdAt: profile?.createdAt || Date.now(),
    updatedAt: Date.now(),
  };
}

/**
 * Creates a pristine, unpopulated master profile for a newly registered user account.
 * Every user gets their OWN clean slate awaiting their authentic resume PDF upload or manual entry.
 */
export function createFreshUserProfile(email: string, name?: string): CandidateProfileRecord {
  const cleanEmail = (email || '').toLowerCase().trim();
  const cleanName = (name && name.trim()) ? name.trim() : (cleanEmail.split('@')[0] || 'Candidate');

  return {
    id: `profile-${cleanEmail || 'user'}-${Date.now()}`,
    isPreset: false,
    name: cleanName,
    headline: '',
    email: cleanEmail,
    phone: '',
    location: '',
    linkedin: '',
    summary: '',
    skills: [],
    experiences: [],
    education: [],
    certifications: [],
    masterProfileText: cleanName !== 'Candidate'
      ? `### CANDIDATE: ${cleanName}\n**Email:** ${cleanEmail}\n\nUpload your resume PDF or enter your work history in the Master Profile tab to populate your authentic career profile.`
      : '',
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

    // 1. If not logged in and no email provided, return fresh blank guest profile
    if (!userEmail) {
      return createFreshUserProfile('', storedName || 'Candidate');
    }

    // 2. User Account: strictly keyed by userEmail
    const specificKey = getUserProfileKey(userEmail);
    const raw = localStorage.getItem(specificKey);

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          const sanitized = sanitizeCandidateProfile(parsed, userEmail, storedName);
          // If sanitization cleaned any corrupt placeholders, persist the clean version
          if (JSON.stringify(sanitized) !== raw) {
            saveUserMasterProfile(sanitized, userEmail);
          }
          return sanitized;
        }
      } catch (err) {
        console.error('Failed to parse stored profile JSON', err);
      }
    }

    // Purge legacy unscoped keys so they never leak into any account
    localStorage.removeItem(STORAGE_KEY_USER_PROFILE);
    localStorage.removeItem('jobstudio_candidate_profiles_v1');

    // 3. Provision a clean, fresh profile specifically for this user
    const fresh = createFreshUserProfile(userEmail, storedName);
    saveUserMasterProfile(fresh, userEmail);
    return fresh;
  } catch (e) {
    console.error('Failed to read user master profile from localStorage', e);
    return createFreshUserProfile(userEmail || '', storedName || 'Candidate');
  }
}

export function saveUserMasterProfile(profile: CandidateProfileRecord, email?: string) {
  if (typeof window === 'undefined') return;
  try {
    const sessionEmail = (localStorage.getItem('jobstudio_user_email') || '').toLowerCase().trim();
    const userEmail = (email || sessionEmail || profile.email || '').toLowerCase().trim();
    if (!userEmail) return;

    // Sanitize before saving to guarantee zero placeholder leakage
    const sanitized = sanitizeCandidateProfile(profile, userEmail, profile.name);
    const specificKey = getUserProfileKey(userEmail);
    const json = JSON.stringify(sanitized);
    localStorage.setItem(specificKey, json);

    // Also mirror to sessionEmail if different so current logged in session finds it
    if (sessionEmail && sessionEmail !== userEmail) {
      localStorage.setItem(getUserProfileKey(sessionEmail), json);
    }

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

