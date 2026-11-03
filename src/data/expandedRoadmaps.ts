import { CareerRoadmap } from './roadmapData';

export const EXPANDED_ROADMAPS: CareerRoadmap[] = [
  // 8. PRODUCT MANAGEMENT
  {
    id: 'product-management',
    slug: 'product-management',
    title: 'Product Management',
    category: 'Product & Project',
    badge: 'HIGH DEMAND',
    subtitle: 'Technical & Growth Product Manager',
    description:
      'A 2026 path to mastering customer discovery, quantitative telemetry funnels, PRD specification rigor, RICE roadmap prioritization, and cross-functional engineering alignment.',
    coreStack: [
      { name: 'PRDs', tag: 'DOCS' },
      { name: 'Amplitude', tag: 'TELEMETRY' },
      { name: 'SQL', tag: 'QUERY' },
      { name: 'Figma', tag: 'DESIGN' },
      { name: 'Linear', tag: 'TRACK' },
    ],
    stagesCount: 5,
    skillsCount: 15,
    resourcesCount: 30,
    stages: [
      {
        id: 'pm-s1',
        stageNumber: 1,
        stageLabel: 'STAGE 01',
        title: 'Stage 1, Customer Discovery & Problem Validation',
        description:
          'Before defining solutions, uncover true underlying customer problems through user research, JTBD frameworks, and hypothesis testing.',
        skills: [
          {
            id: 'pm-discovery-jtbd',
            name: 'Jobs-to-be-Done (JTBD) & Problem Framing',
            level: 'ESSENTIAL',
            description:
              'Structuring user interviews around customer intent, functional/emotional jobs, switching triggers, and pain severity.',
            whyItMatters:
              'Building products nobody wants is the #1 startup failure mode. Top PMs validate problems before writing a single line of spec.',
            resources: [
              {
                type: 'DOCS',
                title: 'The Jobs-to-be-Done Playbook',
                provider: 'Strategyn / Tony Ulwick',
                url: 'https://strategyn.com/jobs-to-be-done/',
                isFree: true,
              },
              {
                type: 'COURSE',
                title: 'Customer Discovery Fundamentals',
                provider: 'Y Combinator Startup School',
                url: 'https://www.startupschool.org',
                isFree: true,
              },
            ],
          },
          {
            id: 'pm-user-interviews',
            name: 'Unbiased User Interviewing (The Mom Test)',
            level: 'ESSENTIAL',
            description:
              'Asking questions about past actions rather than future promises to avoid false validation and biased survey results.',
            whyItMatters:
              'Customers will politely say yes to hypothetical feature pitches. Grounded interviewing extracts genuine willingness to pay.',
            resources: [
              {
                type: 'DOCS',
                title: 'The Mom Test Summary Guide',
                provider: 'Rob Fitzpatrick',
                url: 'https://www.momtestbook.com',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'pm-s2',
        stageNumber: 2,
        stageLabel: 'STAGE 02',
        title: 'Stage 2, Quantitative Telemetry & Retention Funnels',
        description:
          'Measure how users navigate your product. Master retention curves, funnel drop-off analysis, and A/B experimentation statistics.',
        skills: [
          {
            id: 'pm-funnels-cohorts',
            name: 'Cohort Retention & Funnel Drop-off Analysis',
            level: 'ESSENTIAL',
            description:
              'Tracking N-day retention curves, identifying activation drop-off steps, and calculating time-to-value (TTV).',
            whyItMatters:
              'A leaking bucket cannot be fixed with acquisition marketing. Great PMs find and seal leaky activation milestones first.',
            resources: [
              {
                type: 'DOCS',
                title: 'The Product Analytics Playbook: Retention',
                provider: 'Amplitude',
                url: 'https://amplitude.com/retention-playbook',
                isFree: true,
              },
            ],
          },
          {
            id: 'pm-ab-testing-stats',
            name: 'A/B Testing & Statistical Significance',
            level: 'RECOMMENDED',
            description:
              'Sample size calculation, p-values, minimum detectable effect (MDE), and avoiding peeking bias in product experiments.',
            whyItMatters:
              'Shipping changes without statistical rigor creates regression loops. Product teams need confident, unskewed signal.',
            resources: [
              {
                type: 'COURSE',
                title: 'A/B Testing by Google',
                provider: 'Udacity / Google',
                url: 'https://www.udacity.com/course/ab-testing--ud257',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'pm-s3',
        stageNumber: 3,
        stageLabel: 'STAGE 03',
        title: 'Stage 3, Technical Fluency & PRD Rigor',
        description:
          'Write specifications that engineers love: clearly defined problem scopes, data schemas, API contracts, edge cases, and acceptance criteria.',
        skills: [
          {
            id: 'pm-prd-authoring',
            name: 'Product Requirement Document (PRD) Authoring',
            level: 'ESSENTIAL',
            description:
              'Writing lean, actionable PRDs including background, non-goals, user stories, edge cases, metrics, and launch criteria.',
            whyItMatters:
              'Ambiguous specs lead to re-work and frustrated engineers. Clear PRDs align design, engineering, and QA on the exact definition of done.',
            resources: [
              {
                type: 'DOCS',
                title: 'Figma & Linear Lean PRD Templates',
                provider: 'Linear Method',
                url: 'https://linear.app/method',
                isFree: true,
              },
            ],
          },
          {
            id: 'pm-tech-architecture',
            name: 'Technical Architecture Fluency (APIs, Schemas, Latency)',
            level: 'RECOMMENDED',
            description:
              'Understanding REST/GraphQL contracts, database relational constraints, asynchronous background jobs, and caching trade-offs.',
            whyItMatters:
              'PMs who understand technical constraints build credible relationships with engineering and anticipate operational bottlenecks early.',
            resources: [
              {
                type: 'DOCS',
                title: 'System Design for Product Managers',
                provider: 'Reforge',
                url: 'https://www.reforge.com/blog',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'pm-s4',
        stageNumber: 4,
        stageLabel: 'STAGE 04',
        title: 'Stage 4, Agile Execution & Roadmap Prioritization',
        description:
          'Balance tech debt, customer commitments, and strategic bets using structured prioritization frameworks.',
        skills: [
          {
            id: 'pm-rice-prioritization',
            name: 'RICE Framework & Opportunity Scoring',
            level: 'ESSENTIAL',
            description:
              'Calculating Reach, Impact, Confidence, and Effort to eliminate subjective bias from roadmap prioritization.',
            whyItMatters:
              'Every executive has pet ideas. RICE provides an objective, transparent scorecard that protects engineering velocity.',
            resources: [
              {
                type: 'DOCS',
                title: 'The RICE Prioritization Guide',
                provider: 'Intercom',
                url: 'https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'pm-s5',
        stageNumber: 5,
        stageLabel: 'STAGE 05',
        title: 'Stage 5, Go-To-Market & Product-Led Growth (PLG)',
        description:
          'Turn shipping code into revenue: collaborate with sales, marketing, and support to ensure seamless user onboarding and high adoption.',
        skills: [
          {
            id: 'pm-plg-onboarding',
            name: 'Product-Led Growth & Onboarding Optimization',
            level: 'ESSENTIAL',
            description:
              'Designing self-serve onboarding flows, reducing friction to the initial "Aha!" moment, and managing paywall triggers.',
            whyItMatters:
              'Modern B2B software is bought, not sold. Seamless self-serve experiences determine whether users stay or churn.',
            resources: [
              {
                type: 'DOCS',
                title: 'Product-Led Growth Playbook',
                provider: 'OpenView',
                url: 'https://openviewpartners.com/product-led-growth/',
                isFree: true,
              },
            ],
          },
        ],
      },
    ],
  },

  // 9. PROJECT MANAGEMENT & TPM
  {
    id: 'project-management-tpm',
    slug: 'project-management-tpm',
    title: 'Project Management & TPM',
    category: 'Product & Project',
    subtitle: 'Technical Program & Project Delivery Manager',
    description:
      'Orchestrate complex cross-functional programs: build work breakdown structures (WBS), resolve critical path dependencies, manage technical risk registers, and steer on-time delivery.',
    coreStack: [
      { name: 'Jira', tag: 'AGILE' },
      { name: 'Critical Path', tag: 'GANTT' },
      { name: 'Confluence', tag: 'SPECS' },
      { name: 'Risk Matrix', tag: 'GOV' },
    ],
    stagesCount: 5,
    skillsCount: 14,
    resourcesCount: 26,
    stages: [
      {
        id: 'tpm-s1',
        stageNumber: 1,
        stageLabel: 'STAGE 01',
        title: 'Stage 1, Program Scoping & Work Breakdown Structure (WBS)',
        description:
          'Deconstruct large, ambiguous strategic mandates into concrete, actionable engineering epics, milestones, and RACI matrices.',
        skills: [
          {
            id: 'tpm-wbs-scoping',
            name: 'Work Breakdown Structure (WBS) & Scope Definition',
            level: 'ESSENTIAL',
            description:
              'Hierarchical decomposition of project deliverables down to the work-package level, defining explicit in-scope and out-of-scope boundaries.',
            whyItMatters:
              'Scope creep is the primary killer of engineering schedules. Strict WBS hygiene prevents unspoken expectations from blowing deadlines.',
            resources: [
              {
                type: 'DOCS',
                title: 'Work Breakdown Structure Standard Practice',
                provider: 'PMI Standards',
                url: 'https://www.pmi.org/learning/library/work-breakdown-structure-project-planning-6395',
                isFree: true,
              },
            ],
          },
          {
            id: 'tpm-raci-accountability',
            name: 'RACI Matrix Governance (Responsible, Accountable, Consulted, Informed)',
            level: 'ESSENTIAL',
            description:
              'Mapping every milestone to single point of accountability (Accountable vs Responsible) across engineering, design, legal, and ops.',
            whyItMatters:
              'When everyone owns an initiative, nobody owns it. RACI ensures clear ownership and eliminates cross-functional confusion.',
            resources: [
              {
                type: 'DOCS',
                title: 'RACI Matrix Guide for Engineering Leads',
                provider: 'Atlassian Agile Coach',
                url: 'https://www.atlassian.com/work-management/project-management/raci-chart',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'tpm-s2',
        stageNumber: 2,
        stageLabel: 'STAGE 02',
        title: 'Stage 2, Critical Path & Dependency Management',
        description:
          'Identify the exact sequence of dependent engineering tasks that dictates overall project completion date.',
        skills: [
          {
            id: 'tpm-critical-path',
            name: 'Critical Path Method (CPM) & Float Calculation',
            level: 'ESSENTIAL',
            description:
              'Calculating forward/backward passes, early/late start dates, and total float to pinpoint zero-slack bottleneck tasks.',
            whyItMatters:
              'A delay on the critical path delays the entire project launch date dollar-for-dollar. TPMs focus their daily attention on critical tasks.',
            resources: [
              {
                type: 'DOCS',
                title: 'Critical Path Analysis in Modern Software',
                provider: 'Coursera / UC Irvine',
                url: 'https://www.coursera.org/learn/project-management-planning',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'tpm-s3',
        stageNumber: 3,
        stageLabel: 'STAGE 03',
        title: 'Stage 3, Technical Risk Mitigation & Incident War Rooms',
        description:
          'Identify failure modes before they happen: probability-impact scoring, contingency budgets, and blocker escalation frameworks.',
        skills: [
          {
            id: 'tpm-risk-register',
            name: 'Risk Register & Pre-Mortem Facilitation',
            level: 'ESSENTIAL',
            description:
              'Maintaining active risk logs with mitigation owners, conducting pre-mortems, and calculating expected monetary value of blockers.',
            whyItMatters:
              'Great technical program managers are paranoid planners who solve blockers weeks before they impact production.',
            resources: [
              {
                type: 'DOCS',
                title: 'How to Run a Project Pre-Mortem',
                provider: 'Harvard Business Review',
                url: 'https://hbr.org/2007/09/performing-a-project-premortem',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'tpm-s4',
        stageNumber: 4,
        stageLabel: 'STAGE 04',
        title: 'Stage 4, Executive Dashboards & Stakeholder Syncs',
        description:
          'Communicate status with radical transparency: Red/Amber/Green (RAG) metrics, OKR tracking, and VP-level blocker summaries.',
        skills: [
          {
            id: 'tpm-exec-reporting',
            name: 'Executive RAG Dashboards & Blocker Escalation',
            level: 'ESSENTIAL',
            description:
              'Authoring concise weekly steering committee memos, tracking milestone slippage, and escalating cross-org trade-offs.',
            whyItMatters:
              'Leadership needs honest early warnings, not surprise delays. High-caliber TPMs build trust through proactive, objective updates.',
            resources: [
              {
                type: 'DOCS',
                title: 'High-Impact Executive Status Reporting',
                provider: 'GitLab Handbook (TPM Practices)',
                url: 'https://about.gitlab.com/handbook/',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'tpm-s5',
        stageNumber: 5,
        stageLabel: 'STAGE 05',
        title: 'Stage 5, Cutover Planning & Production Change Management',
        description:
          'Orchestrate zero-downtime release weekends: minute-by-minute cutover runbooks, rollback criteria, and compliance auditing.',
        skills: [
          {
            id: 'tpm-cutover-playbook',
            name: 'Cutover Runbooks, Go/No-Go Decision Gates & Rollback Criteria',
            level: 'ESSENTIAL',
            description:
              'Creating synchronized release checklists with explicit rollback thresholds, dry runs, and post-cutover verification steps.',
            whyItMatters:
              'Enterprise transitions involve databases, payments, and client integrations. Flawless cutover playbooks safeguard revenue.',
            resources: [
              {
                type: 'DOCS',
                title: 'Production Cutover & Change Management Frameworks',
                provider: 'AWS Well-Architected Operational Excellence',
                url: 'https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/welcome.html',
                isFree: true,
              },
            ],
          },
        ],
      },
    ],
  },

  // 10. AI ENGINEERING & FORWARD DEPLOYED AI (FDE)
  {
    id: 'ai-engineering-fde',
    slug: 'ai-engineering-fde',
    title: 'AI Engineering & FDE',
    category: 'AI & Data',
    badge: 'TRENDING 2026',
    subtitle: 'Forward Deployed AI & Production LLM Systems',
    description:
      'Build and forward-deploy enterprise AI: structured function calling, vector search & hybrid retrieval, multimodal RAG, autonomous LangGraph agent workflows, and client VPC integration.',
    coreStack: [
      { name: 'Python', tag: 'LANG' },
      { name: 'LangGraph', tag: 'AGENTS' },
      { name: 'Qdrant / PGVector', tag: 'VECTOR' },
      { name: 'vLLM', tag: 'SERVE' },
      { name: 'Docker', tag: 'DEPLOY' },
    ],
    stagesCount: 6,
    skillsCount: 18,
    resourcesCount: 36,
    stages: [
      {
        id: 'aie-s1',
        stageNumber: 1,
        stageLabel: 'STAGE 01',
        title: 'Stage 1, Structured LLM APIs & Function Calling',
        description:
          'Move beyond simple chat completions: enforce strict JSON schemas, invoke external tools, and orchestrate function pipelines.',
        skills: [
          {
            id: 'aie-function-calling',
            name: 'Tool Calling & Strict JSON Schema Enforcement',
            level: 'ESSENTIAL',
            description:
              'Using Pydantic and JSON Schema to guarantee deterministically parseable structured outputs from Gemini, Anthropic, and OpenAI models.',
            whyItMatters:
              'Production applications cannot break when an LLM returns markdown formatting. Schema enforcement ensures type-safe software interop.',
            resources: [
              {
                type: 'DOCS',
                title: 'Structured Outputs Guide',
                provider: 'Google Gemini API Docs',
                url: 'https://ai.google.dev/gemini-api/docs/structured-output',
                isFree: true,
              },
              {
                type: 'COURSE',
                title: 'Functions, Tools and Agents with LangChain',
                provider: 'DeepLearning.AI',
                url: 'https://www.deeplearning.ai/short-courses/',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'aie-s2',
        stageNumber: 2,
        stageLabel: 'STAGE 02',
        title: 'Stage 2, Vector Search & Hybrid Retrieval Architectures',
        description:
          'Index enterprise data with dense embeddings and sparse BM25 indices to achieve high precision and recall.',
        skills: [
          {
            id: 'aie-hybrid-search',
            name: 'Dense Embeddings, Sparse BM25 & Reciprocal Rank Fusion (RRF)',
            level: 'ESSENTIAL',
            description:
              'Combining semantic cosine similarity with lexical keyword search (BM25), then reranking candidates with Cohere/BGE cross-encoders.',
            whyItMatters:
              'Vector-only search struggles with exact IDs, product codes, and acronyms. Hybrid retrieval delivers enterprise-grade search accuracy.',
            resources: [
              {
                type: 'DOCS',
                title: 'Vector Search & Hybrid Retrieval',
                provider: 'Qdrant Documentation',
                url: 'https://qdrant.tech/documentation/concepts/hybrid-queries/',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'aie-s3',
        stageNumber: 3,
        stageLabel: 'STAGE 03',
        title: 'Stage 3, Production RAG & Document Intelligence',
        description:
          'Build end-to-end retrieval-augmented generation systems that ingest complex PDFs, handle hierarchical tables, and synthesize citations.',
        skills: [
          {
            id: 'aie-advanced-rag',
            name: 'Contextual Chunking & Parent-Document Retrieval',
            level: 'ESSENTIAL',
            description:
              'Splitting large documents into small embeddings for retrieval while passing larger parent context windows to the LLM to preserve continuity.',
            whyItMatters:
              'Naive fixed-size chunking severs tables and paragraph logic, causing hallucinations. Hierarchical chunking keeps answers grounded.',
            resources: [
              {
                type: 'COURSE',
                title: 'Building High-Performance RAG Systems',
                provider: 'DeepLearning.AI',
                url: 'https://www.deeplearning.ai/short-courses/',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'aie-s4',
        stageNumber: 4,
        stageLabel: 'STAGE 04',
        title: 'Stage 4, Autonomous Agents & Stateful Workflows',
        description:
          'Implement multi-turn autonomous agents with state machines, tool delegation, error recovery, and human-in-the-loop approvals.',
        skills: [
          {
            id: 'aie-langgraph-agents',
            name: 'Stateful Agent Graphs with LangGraph',
            level: 'ESSENTIAL',
            description:
              'Designing cyclic computational graphs where LLM agents update state, branch conditionally, recover from runtime errors, and persist sessions.',
            whyItMatters:
              'Linear chains fail on complex real-world workflows. Cyclic state graphs give agents the memory and flexibility needed for autonomous execution.',
            resources: [
              {
                type: 'DOCS',
                title: 'LangGraph Concepts & Tutorials',
                provider: 'LangChain / LangGraph Docs',
                url: 'https://langchain-ai.github.io/langgraph/',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'aie-s5',
        stageNumber: 5,
        stageLabel: 'STAGE 05',
        title: 'Stage 5, Forward Deployed Enterprise Integrations',
        description:
          'Forward deployed engineers (FDEs) take cutting-edge AI directly into enterprise client environments (private VPCs, legacy databases, SAP/Salesforce).',
        skills: [
          {
            id: 'aie-fde-integration',
            name: 'Private VPC Deployment, Data Pipelines & Security Compliance',
            level: 'ESSENTIAL',
            description:
              'Containerizing AI workloads with Docker, securing zero-data-retention agreements, building OAuth connectors to enterprise CRMs, and ensuring SOC 2 conformance.',
            whyItMatters:
              'Fortune 500 companies refuse to send sensitive PII to public endpoints. FDEs bring the model to the data, unlocking high-ACV enterprise contracts.',
            resources: [
              {
                type: 'DOCS',
                title: 'Deploying Enterprise AI in Private Clouds',
                provider: 'Google Cloud Architecture Center',
                url: 'https://cloud.google.com/architecture',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'aie-s6',
        stageNumber: 6,
        stageLabel: 'STAGE 06',
        title: 'Stage 6, Evaluation, Latency Optimization & Guardrails',
        description:
          'Measure hallucination rates, optimize token throughput with vLLM, and enforce safety guardrails.',
        skills: [
          {
            id: 'aie-eval-guardrails',
            name: 'Ragas Evaluation Metrics & NeMo Safety Guardrails',
            level: 'ESSENTIAL',
            description:
              'Scoring faithfulness, answer relevancy, context precision, and preventing prompt injections via guardrail validation layers.',
            whyItMatters:
              'You cannot improve what you cannot measure. Quantitative benchmark evaluations prevent silent model regressions before release.',
            resources: [
              {
                type: 'DOCS',
                title: 'Ragas: Automated Evaluation for RAG',
                provider: 'Ragas Documentation',
                url: 'https://docs.ragas.io',
                isFree: true,
              },
            ],
          },
        ],
      },
    ],
  },

  // 11. SECURITY ENGINEERING & APPSEC
  {
    id: 'security-engineering',
    slug: 'security-engineering',
    title: 'Security Engineering',
    category: 'Engineering',
    subtitle: 'Application Security & Cloud Defense Engineer',
    description:
      'Protect modern software from exploitation: master STRIDE threat modeling, OWASP Top 10 vulnerabilities, identity/OAuth2, cryptography, and cloud infrastructure defense.',
    coreStack: [
      { name: 'Linux', tag: 'SYS' },
      { name: 'Burp Suite', tag: 'SEC' },
      { name: 'OWASP', tag: 'AUDIT' },
      { name: 'Semgrep', tag: 'SAST' },
      { name: 'Vault', tag: 'IAM' },
    ],
    stagesCount: 5,
    skillsCount: 15,
    resourcesCount: 28,
    stages: [
      {
        id: 'sec-s1',
        stageNumber: 1,
        stageLabel: 'STAGE 01',
        title: 'Stage 1, Threat Modeling & Defensive Fundamentals',
        description:
          'Map system architecture against potential adversary vectors before code is written using STRIDE and zero-trust principles.',
        skills: [
          {
            id: 'sec-stride-modeling',
            name: 'STRIDE Threat Modeling & Attack Trees',
            level: 'ESSENTIAL',
            description:
              'Evaluating Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege across architectural data flow diagrams.',
            whyItMatters:
              'Fixing security vulnerabilities in production costs 30x more than catching design flaws during initial architecture threat modeling.',
            resources: [
              {
                type: 'DOCS',
                title: 'OWASP Threat Modeling Cheat Sheet',
                provider: 'OWASP Foundation',
                url: 'https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'sec-s2',
        stageNumber: 2,
        stageLabel: 'STAGE 02',
        title: 'Stage 2, Web & API Security (OWASP Top 10)',
        description:
          'Hands-on auditing and remediation of modern web exploits: SQLi, SSRF, IDOR, Broken Object Level Auth (BOLA), and Cross-Site Scripting (XSS).',
        skills: [
          {
            id: 'sec-owasp-exploits',
            name: 'OWASP Top 10 & API Security Testing with Burp Suite',
            level: 'ESSENTIAL',
            description:
              'Intercepting HTTP payloads, identifying Insecure Direct Object References (IDOR), SSRF in cloud metadata services, and enforcing CSP headers.',
            whyItMatters:
              'Web and API vulnerabilities account for over 70% of initial enterprise breaches. Hands-on offensive testing is vital for effective defense.',
            resources: [
              {
                type: 'PRACTICE',
                title: 'PortSwigger Web Security Academy',
                provider: 'PortSwigger (Burp Suite)',
                url: 'https://portswigger.net/web-security',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'sec-s3',
        stageNumber: 3,
        stageLabel: 'STAGE 03',
        title: 'Stage 3, Identity, Cryptography & Access Control',
        description:
          'Design robust authentication and authorization architectures: OAuth 2.1, OpenID Connect, mTLS, PKI, and least-privilege IAM policies.',
        skills: [
          {
            id: 'sec-oauth-iam',
            name: 'OAuth 2.1, JWT Validation & Least-Privilege IAM',
            level: 'ESSENTIAL',
            description:
              'Implementing PKCE auth flows, cryptographic token signature verification, rotating JWKS keys, and fine-grained attribute-based access control (ABAC).',
            whyItMatters:
              'Compromised credentials and misconfigured token validation remain the top cause of unauthorized data exfiltration.',
            resources: [
              {
                type: 'DOCS',
                title: 'OAuth 2.0 Simplified',
                provider: 'Aaron Parecki / OAuth.net',
                url: 'https://www.oauth.com',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'sec-s4',
        stageNumber: 4,
        stageLabel: 'STAGE 04',
        title: 'Stage 4, DevSecOps & Automated Code Auditing',
        description:
          'Integrate continuous security gates into CI/CD pipelines: static analysis (SAST), software composition analysis (SCA), and secret scanning.',
        skills: [
          {
            id: 'sec-devsecops-pipeline',
            name: 'SAST with Semgrep & Container Vulnerability Scanning',
            level: 'ESSENTIAL',
            description:
              'Writing custom Semgrep rules to detect insecure coding patterns, scanning Docker images with Trivy, and blocking secrets with GitGuardian.',
            whyItMatters:
              'Automated pipeline gates stop vulnerable code and leaked API keys from ever merging to the main branch.',
            resources: [
              {
                type: 'COURSE',
                title: 'Semgrep Security Rules & SAST Training',
                provider: 'Semgrep Academy',
                url: 'https://semgrep.dev/learn',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'sec-s5',
        stageNumber: 5,
        stageLabel: 'STAGE 05',
        title: 'Stage 5, Cloud Hardening & Incident Response',
        description:
          'Harden cloud infrastructure against lateral movement: CIS benchmarks, Kubernetes network policies, VPC isolation, and SIEM incident triage.',
        skills: [
          {
            id: 'sec-cloud-hardening',
            name: 'Cloud Security Posture Management & Incident Response',
            level: 'ESSENTIAL',
            description:
              'Enforcing CIS AWS/GCP benchmarks, configuring audit logging (CloudTrail), managing secrets via HashiCorp Vault, and executing incident containment runbooks.',
            whyItMatters:
              'When breaches occur, fast containment and immutable audit trails prevent catastrophe and ensure regulatory compliance.',
            resources: [
              {
                type: 'DOCS',
                title: 'CIS Benchmarks for Cloud Security',
                provider: 'Center for Internet Security (CIS)',
                url: 'https://www.cisecurity.org/cis-benchmarks',
                isFree: true,
              },
            ],
          },
        ],
      },
    ],
  },

  // 12. SOLUTIONS CONSULTANT / ARCHITECT
  {
    id: 'solutions-consultant',
    slug: 'solutions-consultant',
    title: 'Solutions Consultant',
    category: 'Solutions & GTM',
    subtitle: 'Pre-Sales Engineering & Enterprise Solutions Architect',
    description:
      'Bridge technical engineering and commercial revenue: design multi-cloud architectures, deliver high-impact executive demos, and guide enterprise RFP evaluations.',
    coreStack: [
      { name: 'System Architecture', tag: 'ARCH' },
      { name: 'APIs & Webhooks', tag: 'INT' },
      { name: 'Security & Compliance', tag: 'SOC2' },
      { name: 'Executive Demos', tag: 'GTM' },
    ],
    stagesCount: 5,
    skillsCount: 13,
    resourcesCount: 25,
    stages: [
      {
        id: 'sc-s1',
        stageNumber: 1,
        stageLabel: 'STAGE 01',
        title: 'Stage 1, Technical Discovery & Requirement Qualification',
        description:
          'Uncover technical pain points and architectural constraints using the MEDDPICC discovery framework to qualify enterprise software deals.',
        skills: [
          {
            id: 'sc-technical-discovery',
            name: 'Deep Technical Discovery & Pain Point Mapping',
            level: 'ESSENTIAL',
            description:
              'Auditing the prospect’s current tech stack, cloud providers, authentication infrastructure, and data flows to map business problems to technical solutions.',
            whyItMatters:
              'Pre-sales engineers who jump into demos without thorough discovery risk pitching irrelevant features and failing technical qualification.',
            resources: [
              {
                type: 'DOCS',
                title: 'The Pre-Sales Technical Discovery Playbook',
                provider: 'Consensus / PreSales Collective',
                url: 'https://www.presalescollective.com',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'sc-s2',
        stageNumber: 2,
        stageLabel: 'STAGE 02',
        title: 'Stage 2, Architecture Whiteboarding & Custom Proof-of-Concepts',
        description:
          'Design bespoke integration diagrams and build working POC prototypes that de-risk the technical evaluation for enterprise buyers.',
        skills: [
          {
            id: 'sc-poc-architecture',
            name: 'Solution Whiteboarding & Proof of Concept (POC) Delivery',
            level: 'ESSENTIAL',
            description:
              'Designing C4 architecture diagrams, connecting client staging APIs with webhooks, and establishing measurable success criteria for POC sign-off.',
            whyItMatters:
              'A winning POC proves technical feasibility and establishes the vendor as the trusted architectural authority in the client’s evaluation.',
            resources: [
              {
                type: 'DOCS',
                title: 'The C4 Model for Visualizing Software Architecture',
                provider: 'Simon Brown / C4 Model',
                url: 'https://c4model.com',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'sc-s3',
        stageNumber: 3,
        stageLabel: 'STAGE 03',
        title: 'Stage 3, Enterprise Security, RFP & Compliance Reviews',
        description:
          'Navigate complex procurement reviews: answer hundreds of technical RFP questions, explain encryption at rest/transit, and satisfy InfoSec teams.',
        skills: [
          {
            id: 'sc-rfp-infosec',
            name: 'RFP Navigation, SOC 2 Reports & Privacy Compliance',
            level: 'ESSENTIAL',
            description:
              'Drafting technical RFP responses, explaining TLS/KMS cryptographic guarantees, GDPR/CCPA data residency compliance, and resolving InfoSec objections.',
            whyItMatters:
              'Over 80% of enterprise B2B sales stall in InfoSec review. Solutions Consultants who navigate compliance close deals weeks faster.',
            resources: [
              {
                type: 'DOCS',
                title: 'Enterprise InfoSec Review & Vendor Due Diligence Guide',
                provider: 'Vanta Compliance Guides',
                url: 'https://www.vanta.com',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'sc-s4',
        stageNumber: 4,
        stageLabel: 'STAGE 04',
        title: 'Stage 4, Executive Demonstrations & Value Engineering',
        description:
          'Deliver compelling tailored product presentations to CTOs and VP-level executives that translate technical capabilities into quantifiable ROI.',
        skills: [
          {
            id: 'sc-demo-storytelling',
            name: 'Executive Technical Demos & Value Storytelling',
            level: 'ESSENTIAL',
            description:
              'Structuring demos around "Day in the Life" workflows, customizing dummy data to match the prospect’s brand, and answering surprise objections calmly.',
            whyItMatters:
              'Generic product click-throughs bore executives. Tailored value-based storytelling secures executive sponsor buy-in.',
            resources: [
              {
                type: 'DOCS',
                title: 'Great Demo! Method Fundamentals',
                provider: 'Peter Cohan / Second Derivative',
                url: 'https://greatdemo.com',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'sc-s5',
        stageNumber: 5,
        stageLabel: 'STAGE 05',
        title: 'Stage 5, Implementation Handshake & Scoping Statements (SOW)',
        description:
          'Ensure seamless post-sale transition: document technical scoping statements, assumptions, and hand off implementation designs to professional services.',
        skills: [
          {
            id: 'sc-sow-handshake',
            name: 'Statement of Work (SOW) Authoring & Delivery Handshake',
            level: 'ESSENTIAL',
            description:
              'Drafting technical SOWs with clear milestones, integration boundaries, data retention specifications, and post-sale handoff briefings.',
            whyItMatters:
              'A sloppy pre-sales to post-sales handoff causes client churn during onboarding. Thorough scoping sets up delivery teams for success.',
            resources: [
              {
                type: 'DOCS',
                title: 'Pre-Sales to Customer Success Handshake Best Practices',
                provider: 'Gainsight Guides',
                url: 'https://www.gainsight.com',
                isFree: true,
              },
            ],
          },
        ],
      },
    ],
  },

  // 13. IMPLEMENTATION & PROFESSIONAL SERVICES ENGINEER
  {
    id: 'implementation-engineer',
    slug: 'implementation-engineer',
    title: 'Implementation Engineer',
    category: 'Solutions & GTM',
    subtitle: 'Professional Services & Technical Implementation',
    description:
      'Lead end-to-end enterprise software rollouts: custom ETL pipelines, API webhook orchestration, sandbox testing, and production cutover.',
    coreStack: [
      { name: 'REST APIs', tag: 'HTTP' },
      { name: 'SQL & ETL', tag: 'DATA' },
      { name: 'Webhooks', tag: 'EVENT' },
      { name: 'Python / JS', tag: 'CODE' },
    ],
    stagesCount: 5,
    skillsCount: 13,
    resourcesCount: 24,
    stages: [
      {
        id: 'imp-s1',
        stageNumber: 1,
        stageLabel: 'STAGE 01',
        title: 'Stage 1, Kickoff Alignment & Statement of Work Verification',
        description:
          'Align customer technical stakeholders, confirm milestones, and establish sandbox access and authentication credentials.',
        skills: [
          {
            id: 'imp-kickoff-alignment',
            name: 'Technical Scoping Verification & Environment Provisioning',
            level: 'ESSENTIAL',
            description:
              'Validating customer technical requirements against the SOW, provisioning tenant sandboxes, and establishing OAuth/API service credentials.',
            whyItMatters:
              'Clear onboarding milestones set client expectations and prevent multi-month implementation delays.',
            resources: [
              {
                type: 'DOCS',
                title: 'Enterprise Software Onboarding & Implementation Guide',
                provider: 'Setuply / Implementation Collective',
                url: 'https://www.setuply.com',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'imp-s2',
        stageNumber: 2,
        stageLabel: 'STAGE 02',
        title: 'Stage 2, Legacy Data Migration & Schema Normalization',
        description:
          'Extract, transform, and load historical records from legacy client databases into target application schemas.',
        skills: [
          {
            id: 'imp-etl-migration',
            name: 'Data Extraction, Transformation & Validation Scripts',
            level: 'ESSENTIAL',
            description:
              'Writing Python/SQL migration scripts to clean CSV/SQL dumps, map custom enum fields, handle foreign-key constraints, and reconcile record counts.',
            whyItMatters:
              'Dirty legacy data corrupts customer production instances. Rigorous automated data validation scripts guarantee zero lost records.',
            resources: [
              {
                type: 'COURSE',
                title: 'Data Engineering & ETL Fundamentals',
                provider: 'freeCodeCamp',
                url: 'https://www.freecodecamp.org/news/tag/data-engineering/',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'imp-s3',
        stageNumber: 3,
        stageLabel: 'STAGE 03',
        title: 'Stage 3, Custom API Integration & Event Middleware',
        description:
          'Wire up real-time bidirectional data flows: build webhook receivers, integrate middleware (Zapier/Workato or custom AWS Lambdas), and configure retries.',
        skills: [
          {
            id: 'imp-webhook-middleware',
            name: 'Webhook Event Handling, Idempotency & Rate Limiting',
            level: 'ESSENTIAL',
            description:
              'Building resilient webhook endpoints that handle out-of-order delivery, verify HMAC signatures, enforce idempotency keys, and respect API rate limits.',
            whyItMatters:
              'Enterprise systems frequently drop connections or send burst traffic. Resilient retry queues prevent failed transactions.',
            resources: [
              {
                type: 'DOCS',
                title: 'Webhook Design & Security Best Practices',
                provider: 'Svix Webhook Documentation',
                url: 'https://docs.svix.com',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'imp-s4',
        stageNumber: 4,
        stageLabel: 'STAGE 04',
        title: 'Stage 4, User Acceptance Testing (UAT) & Sandbox Hardening',
        description:
          'Guide customer IT teams through comprehensive UAT test suites, edge case validation, and formal sign-off.',
        skills: [
          {
            id: 'imp-uat-testing',
            name: 'User Acceptance Testing (UAT) Test Plan Execution',
            level: 'ESSENTIAL',
            description:
              'Authoring scenario-based test matrices, simulating failed payment/inventory syncs, and documenting resolution tickets with engineering.',
            whyItMatters:
              'Formal UAT sign-off establishes mutual legal acceptance and ensures customer teams are confident prior to cutover.',
            resources: [
              {
                type: 'DOCS',
                title: 'User Acceptance Testing (UAT) Master Guide',
                provider: 'Guru99 / Software Testing Help',
                url: 'https://www.guru99.com/user-acceptance-testing.html',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'imp-s5',
        stageNumber: 5,
        stageLabel: 'STAGE 05',
        title: 'Stage 5, Production Cutover & Hypercare Support',
        description:
          'Execute live system cutover playbooks, train customer administrators, and provide 30-day hypercare operational support.',
        skills: [
          {
            id: 'imp-cutover-hypercare',
            name: 'Production Cutover Execution, Admin Enablement & Hypercare',
            level: 'ESSENTIAL',
            description:
              'Executing minute-by-minute cutover checklists, holding daily hypercare standups, and transitioning mature accounts to Customer Success.',
            whyItMatters:
              'Smooth go-live experiences turn skeptical clients into lifetime advocates and prevent early contract cancellations.',
            resources: [
              {
                type: 'DOCS',
                title: 'Go-Live Execution & Hypercare Best Practices',
                provider: 'Implementation Hub',
                url: 'https://www.setuply.com/blog',
                isFree: true,
              },
            ],
          },
        ],
      },
    ],
  },

  // 14. TECH SALES & GTM ENGINEERING
  {
    id: 'tech-sales-gtm',
    slug: 'tech-sales-gtm',
    title: 'Tech Sales & GTM',
    category: 'Solutions & GTM',
    subtitle: 'B2B SaaS Account Executive & GTM Strategist',
    description:
      'Master the enterprise software sales motion: inbound/outbound pipeline generation, multi-threaded discovery, commercial negotiations, and net-retention expansion.',
    coreStack: [
      { name: 'Salesforce', tag: 'CRM' },
      { name: 'Gong', tag: 'INTEL' },
      { name: 'MEDDPICC', tag: 'METHOD' },
      { name: 'Apollo / Outreach', tag: 'OUTBOUND' },
    ],
    stagesCount: 5,
    skillsCount: 13,
    resourcesCount: 22,
    stages: [
      {
        id: 'sales-s1',
        stageNumber: 1,
        stageLabel: 'STAGE 01',
        title: 'Stage 1, Outbound Prospecting & Account Multi-Threading',
        description:
          'Identify high-probability accounts: Ideal Customer Profile (ICP) definition, Boolean search on Sales Navigator, and personalized multi-channel outreach.',
        skills: [
          {
            id: 'sales-prospecting-icp',
            name: 'ICP Definition & Account Multi-Threading',
            level: 'ESSENTIAL',
            description:
              'Targeting decision makers across multiple departments (VP Engineering, Head of Ops, CFO) to insulate deals from single-threaded failure.',
            whyItMatters:
              'Single-threaded deals die when a contact leaves. Multi-threading across champions and economic buyers guarantees deal continuity.',
            resources: [
              {
                type: 'DOCS',
                title: 'B2B Outbound Prospecting Handbook',
                provider: 'Sales Hacker / Gong Labs',
                url: 'https://www.gong.io/blog/',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'sales-s2',
        stageNumber: 2,
        stageLabel: 'STAGE 02',
        title: 'Stage 2, Consultative Discovery & Pain Quantification',
        description:
          'Run discovery calls that uncover high-priority business problems, quantify cost of inaction, and identify the Economic Buyer.',
        skills: [
          {
            id: 'sales-spin-discovery',
            name: 'SPIN Selling & Quantifying the Cost of Inaction (COI)',
            level: 'ESSENTIAL',
            description:
              'Asking Situation, Problem, Implication, and Need-payoff questions to help the buyer articulate the financial cost of doing nothing.',
            whyItMatters:
              'The biggest competitor in B2B sales is not other vendors—it is the status quo. Quantifying pain unlocks executive budget.',
            resources: [
              {
                type: 'DOCS',
                title: 'SPIN Selling Quick Reference Guide',
                provider: 'Neil Rackham / Huthwaite Research',
                url: 'https://www.huthwaite.co.uk',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'sales-s3',
        stageNumber: 3,
        stageLabel: 'STAGE 03',
        title: 'Stage 3, Collaborative Evaluation & Mutual Action Plans (MAP)',
        description:
          'Co-create evaluation roadmaps with prospective champions that outline key technical proof milestones and legal sign-off deadlines.',
        skills: [
          {
            id: 'sales-mutual-action-plan',
            name: 'Mutual Action Plan (MAP) Execution',
            level: 'ESSENTIAL',
            description:
              'Building shared project plans with buyers covering technical validation, security review, pricing alignment, and signature targets.',
            whyItMatters:
              'Without a Mutual Action Plan, enterprise deals slip past quarterly forecast deadlines. MAPs keep both sides accountable.',
            resources: [
              {
                type: 'DOCS',
                title: 'How to Build Winning Mutual Action Plans',
                provider: 'Accord / Modern Sales Pros',
                url: 'https://inaccord.com',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'sales-s4',
        stageNumber: 4,
        stageLabel: 'STAGE 04',
        title: 'Stage 4, Commercial Negotiation, Procurement & Closing',
        description:
          'Structure multi-year agreements, navigate vendor procurement negotiations, and protect software gross margins.',
        skills: [
          {
            id: 'sales-negotiation-procurement',
            name: 'Enterprise Contract Negotiation & MSA Redlining',
            level: 'ESSENTIAL',
            description:
              'Trading pricing concessions for multi-year commitments or upfront payment terms, while navigating procurement payment terms.',
            whyItMatters:
              'Discounting without trade-offs erodes deal value. Skilled negotiators protect margins while satisfying procurement demands.',
            resources: [
              {
                type: 'DOCS',
                title: 'Never Split the Difference Negotiation Principles',
                provider: 'Chris Voss / The Black Swan Group',
                url: 'https://www.blackswanltd.com',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'sales-s5',
        stageNumber: 5,
        stageLabel: 'STAGE 05',
        title: 'Stage 5, Account Expansion & Net Revenue Retention (NRR)',
        description:
          'Partner with Customer Success to uncover cross-sell opportunities, run Quarterly Business Reviews (QBRs), and drive 120%+ NRR.',
        skills: [
          {
            id: 'sales-account-expansion',
            name: 'Quarterly Business Reviews (QBR) & Seat Expansion Strategy',
            level: 'ESSENTIAL',
            description:
              'Reviewing customer adoption metrics, demonstrating realized ROI, and pitching adjacent product modules to new departments.',
            whyItMatters:
              'Top SaaS companies drive the majority of annual revenue growth through expanding existing customer accounts.',
            resources: [
              {
                type: 'DOCS',
                title: 'Mastering Net Revenue Retention & Account Expansion',
                provider: 'SaaStr / Jason Lemkin Guides',
                url: 'https://www.saastr.com',
                isFree: true,
              },
            ],
          },
        ],
      },
    ],
  },

  // 15. NETWORK ENGINEERING & INFRASTRUCTURE
  {
    id: 'network-engineering',
    slug: 'network-engineering',
    title: 'Network Engineering',
    category: 'Cloud & DevOps',
    subtitle: 'Cloud Networking & Edge Systems Engineer',
    description:
      'Master physical and cloud network plumbing: TCP/IP packet flows, BGP peering, AWS VPC topologies, edge CDNs, and programmatic network automation.',
    coreStack: [
      { name: 'Wireshark', tag: 'PACKET' },
      { name: 'BGP / OSPF', tag: 'ROUTING' },
      { name: 'AWS VPC / Transit', tag: 'CLOUD' },
      { name: 'Ansible', tag: 'AUTO' },
    ],
    stagesCount: 5,
    skillsCount: 14,
    resourcesCount: 26,
    stages: [
      {
        id: 'net-s1',
        stageNumber: 1,
        stageLabel: 'STAGE 01',
        title: 'Stage 1, Packet Fundamentals & IP Subnetting',
        description:
          'Deep dive into the OSI 7-layer stack: analyze TCP 3-way handshakes, calculate CIDR subnet masks, and debug DNS/DHCP resolution.',
        skills: [
          {
            id: 'net-tcp-subnetting',
            name: 'TCP/IP Handshake, CIDR Subnetting & Packet Analysis',
            level: 'ESSENTIAL',
            description:
              'Analyzing Wireshark packet captures, calculating IPv4/IPv6 VLSM subnets, understanding window sizing, MTU fragmentation, and SYN flood defense.',
            whyItMatters:
              'Every cloud system, database connection, and API call relies on TCP/IP. Packet-level literacy makes complex latency issues trivial to diagnose.',
            resources: [
              {
                type: 'COURSE',
                title: 'Computer Networking: A Top-Down Approach',
                provider: 'Stanford / Kurose & Ross',
                url: 'https://gaia.cs.umass.edu/kurose_ross/',
                isFree: true,
              },
              {
                type: 'PRACTICE',
                title: 'Wireshark Packet Analysis Training',
                provider: 'Wireshark Foundation',
                url: 'https://www.wireshark.org/docs/',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'net-s2',
        stageNumber: 2,
        stageLabel: 'STAGE 02',
        title: 'Stage 2, Routing Protocols & Data Center Switching',
        description:
          'Master dynamic routing and switching topologies: BGP Autonomous Systems, OSPF areas, VLANs, 802.1Q trunking, and leaf-spine architectures.',
        skills: [
          {
            id: 'net-bgp-routing',
            name: 'Border Gateway Protocol (BGP) & Leaf-Spine Topologies',
            level: 'ESSENTIAL',
            description:
              'Configuring external BGP peering, route advertisements, prefix filtering, and non-blocking Clos leaf-spine modern data center architectures.',
            whyItMatters:
              'BGP routes traffic across the global internet and modern hyperscale cloud data centers. Understanding path attributes is required for infra scale.',
            resources: [
              {
                type: 'DOCS',
                title: 'BGP Routing Fundamentals',
                provider: 'Cloudflare Learning Center',
                url: 'https://www.cloudflare.com/learning/network-layer/what-is-bgp/',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'net-s3',
        stageNumber: 3,
        stageLabel: 'STAGE 03',
        title: 'Stage 3, Cloud Networking & Hybrid VPC Transit',
        description:
          'Architect multi-VPC and multi-region network topologies in AWS and GCP: Transit Gateway, VPC peering, Direct Connect, and NAT gateways.',
        skills: [
          {
            id: 'net-cloud-vpc-transit',
            name: 'AWS Transit Gateway, PrivateLink & Direct Connect',
            level: 'ESSENTIAL',
            description:
              'Building hub-and-spoke multi-account network architectures with AWS Transit Gateway, securing VPC endpoints with PrivateLink, and configuring IPSec VPN failover.',
            whyItMatters:
              'Enterprise cloud architectures require secure isolation between development, staging, and production networks with centralized egress routing.',
            resources: [
              {
                type: 'DOCS',
                title: 'AWS Advanced Networking Best Practices',
                provider: 'AWS Architecture Center',
                url: 'https://docs.aws.amazon.com/whitepapers/latest/building-scalable-secure-multi-vpc-network-infrastructure/welcome.html',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'net-s4',
        stageNumber: 4,
        stageLabel: 'STAGE 04',
        title: 'Stage 4, Edge Networks, Anycast & DDoS Protection',
        description:
          'Accelerate global content delivery and mitigate DDoS attacks: Anycast routing, Cloudflare edge workers, TLS 1.3 termination, and Web Application Firewalls (WAF).',
        skills: [
          {
            id: 'net-anycast-edge',
            name: 'Anycast Routing, CDN Caching & Edge WAF Rules',
            level: 'ESSENTIAL',
            description:
              'Configuring BGP Anycast to route clients to nearest edge PoPs, designing cache keys and stale-while-revalidate policies, and mitigating volumetric L3/L4 attacks.',
            whyItMatters:
              'Global applications must deliver sub-50ms latencies worldwide while withstanding sustained multi-terabit volumetric cyberattacks.',
            resources: [
              {
                type: 'DOCS',
                title: 'How Anycast Works & CDN Architecture',
                provider: 'Cloudflare Documentation',
                url: 'https://www.cloudflare.com/learning/cdn/what-is-anycast-routing/',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'net-s5',
        stageNumber: 5,
        stageLabel: 'STAGE 05',
        title: 'Stage 5, Programmatic Network Automation & Telemetry',
        description:
          'Replace manual CLI configuration with Infrastructure-as-Code: Python Netmiko/NAPALM, Ansible playbooks, and gNMI streaming telemetry.',
        skills: [
          {
            id: 'net-automation-ansible',
            name: 'Network-as-Code with Python (Netmiko) & Ansible',
            level: 'ESSENTIAL',
            description:
              'Automating switch/router configurations, pushing declarative firewall rules via CI/CD, and collecting gNMI/SNMP metrics with Prometheus.',
            whyItMatters:
              'Manual CLI configuration leads to fat-finger outages. Automated GitOps pipelines ensure repeatable, version-controlled network deployments.',
            resources: [
              {
                type: 'COURSE',
                title: 'Python for Network Engineers (Netmiko & NAPALM)',
                provider: 'Kirk Byers / PyNet Training',
                url: 'https://pynet.twb-tech.com',
                isFree: true,
              },
            ],
          },
        ],
      },
    ],
  },

  // 16. DATA SCIENCE & PREDICTIVE MODELING
  {
    id: 'data-science',
    slug: 'data-science',
    title: 'Data Science',
    category: 'AI & Data',
    subtitle: 'Applied Data Scientist & ML Researcher',
    description:
      'Turn complex data into predictive intelligence: rigorous statistics, exploratory data analysis, tabular gradient boosting, deep learning, and production model validation.',
    coreStack: [
      { name: 'Python', tag: 'LANG' },
      { name: 'Pandas', tag: 'DATA' },
      { name: 'Scikit-learn', tag: 'ML' },
      { name: 'PyTorch', tag: 'DL' },
      { name: 'MLflow', tag: 'OPS' },
    ],
    stagesCount: 5,
    skillsCount: 15,
    resourcesCount: 30,
    stages: [
      {
        id: 'ds-s1',
        stageNumber: 1,
        stageLabel: 'STAGE 01',
        title: 'Stage 1, Exploratory Data Analysis & Statistical Inference',
        description:
          'Establish rigorous mathematical grounding: hypothesis testing, probability distributions, variance analysis, and data hygiene.',
        skills: [
          {
            id: 'ds-stats-eda',
            name: 'Statistical Hypothesis Testing & Distribution Analysis',
            level: 'ESSENTIAL',
            description:
              'Applying t-tests, Mann-Whitney U, ANOVA, Central Limit Theorem, bootstrapping, and addressing class imbalance via SMOTE/stratification.',
            whyItMatters:
              'Feeding dirty, unvalidated data into ML models produces misleading conclusions. Statistical rigor separates real signals from random noise.',
            resources: [
              {
                type: 'COURSE',
                title: 'StatQuest: Statistics & Machine Learning Fundamentals',
                provider: 'Josh Starmer / StatQuest',
                url: 'https://statquest.org',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'ds-s2',
        stageNumber: 2,
        stageLabel: 'STAGE 02',
        title: 'Stage 2, Feature Engineering & Tabular Machine Learning',
        description:
          'Dominate tabular benchmarks: target encoding, polynomial interactions, missing value imputation, and XGBoost/LightGBM hyperparameter optimization.',
        skills: [
          {
            id: 'ds-xgboost-tabular',
            name: 'Gradient Boosting (XGBoost, LightGBM, CatBoost)',
            level: 'ESSENTIAL',
            description:
              'Feature importance analysis with SHAP values, nested cross-validation, regularization against overfitting, and Bayesian optimization via Optuna.',
            whyItMatters:
              'Gradient boosted decision trees remain the state-of-the-art workhorse for tabular business problems (churn, fraud, risk scoring).',
            resources: [
              {
                type: 'COURSE',
                title: 'Kaggle Machine Learning Courses',
                provider: 'Kaggle Learn',
                url: 'https://www.kaggle.com/learn',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'ds-s3',
        stageNumber: 3,
        stageLabel: 'STAGE 03',
        title: 'Stage 3, Deep Learning Architectures & PyTorch Foundations',
        description:
          'Construct custom neural network architectures using PyTorch tensors, autograd, and modular training loops.',
        skills: [
          {
            id: 'ds-pytorch-foundations',
            name: 'PyTorch Tensors, Backpropagation & Custom Architectures',
            level: 'ESSENTIAL',
            description:
              'Building custom nn.Module classes, implementing learning rate schedulers, handling gradient clipping, and training feedforward/recurrent networks.',
            whyItMatters:
              'PyTorch is the undisputed lingua franca of cutting-edge AI and machine learning research. Fluency is non-negotiable for modern data scientists.',
            resources: [
              {
                type: 'COURSE',
                title: 'Deep Learning with PyTorch: A 60 Minute Blitz',
                provider: 'Official PyTorch Documentation',
                url: 'https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'ds-s4',
        stageNumber: 4,
        stageLabel: 'STAGE 04',
        title: 'Stage 4, Experiment Tracking, Model Registry & ONNX',
        description:
          'Manage reproducible data science experiments: log parameters and metrics with MLflow, track dataset artifacts, and export models to ONNX.',
        skills: [
          {
            id: 'ds-mlflow-tracking',
            name: 'Experiment Tracking with MLflow & Weights & Biases',
            level: 'ESSENTIAL',
            description:
              'Logging training loss curves, ROC-AUC metrics, model checkpoints, and packaging artifacts into portable, versioned registry entries.',
            whyItMatters:
              'Jupyter notebooks without versioning create reproducibility nightmares. Experiment tracking ensures every model metric can be audited.',
            resources: [
              {
                type: 'DOCS',
                title: 'MLflow Tracking & Model Registry Guides',
                provider: 'MLflow Open Source',
                url: 'https://mlflow.org/docs/latest/tracking.html',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'ds-s5',
        stageNumber: 5,
        stageLabel: 'STAGE 05',
        title: 'Stage 5, Model Serving & Concept Drift Monitoring',
        description:
          'Deploy models as production microservices: FastAPI endpoints, batch inference jobs, and automated data drift monitoring with Evidently AI.',
        skills: [
          {
            id: 'ds-serving-drift',
            name: 'FastAPI Model Serving, Docker Packaging & Drift Detection',
            level: 'ESSENTIAL',
            description:
              'Containerizing inference pipelines, calculating Kolmogorov-Smirnov drift metrics on input features, and alerting when model accuracy degrades.',
            whyItMatters:
              'Real-world customer behavior shifts over time. Unmonitored models quietly decay in production, leading to catastrophic business errors.',
            resources: [
              {
                type: 'DOCS',
                title: 'Monitoring Machine Learning in Production',
                provider: 'Evidently AI Documentation',
                url: 'https://docs.evidentlyai.com',
                isFree: true,
              },
            ],
          },
        ],
      },
    ],
  },

  // 17. DATA ANALYST & BUSINESS INTELLIGENCE (BI)
  {
    id: 'data-analyst-bi',
    slug: 'data-analyst-bi',
    title: 'Data Analyst & BI',
    category: 'AI & Data',
    subtitle: 'Business Intelligence & Analytics Engineer',
    description:
      'Transform raw operational data into boardroom clarity: advanced window SQL, dimensional star-schema modeling with dbt, and executive interactive dashboards.',
    coreStack: [
      { name: 'Advanced SQL', tag: 'QUERY' },
      { name: 'dbt', tag: 'TRANSFORM' },
      { name: 'Tableau / Power BI', tag: 'VIZ' },
      { name: 'BigQuery / Snowflake', tag: 'WAREHOUSE' },
    ],
    stagesCount: 5,
    skillsCount: 14,
    resourcesCount: 26,
    stages: [
      {
        id: 'da-s1',
        stageNumber: 1,
        stageLabel: 'STAGE 01',
        title: 'Stage 1, Advanced SQL & Analytical Query Patterns',
        description:
          'Master professional SQL: window functions (PARTITION BY, ROW_NUMBER, LAG/LEAD), recursive CTEs, and cohort retention matrices.',
        skills: [
          {
            id: 'da-advanced-sql',
            name: 'SQL Window Functions, CTEs & Cohort Calculations',
            level: 'ESSENTIAL',
            description:
              'Computing running totals, moving 7-day averages, ranking categories within partitions, and writing cohort retention matrices without self-joins.',
            whyItMatters:
              'SQL is the universal language of data. Analysts who master window functions write queries 10x faster and answer complex business queries cleanly.',
            resources: [
              {
                type: 'COURSE',
                title: 'Advanced SQL for Analytics',
                provider: 'Mode Analytics SQL Tutorial',
                url: 'https://mode.com/sql-tutorial/',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'da-s2',
        stageNumber: 2,
        stageLabel: 'STAGE 02',
        title: 'Stage 2, Dimensional Modeling & Star Schemas with dbt',
        description:
          'Structure raw tables into clean dimensional models: Fact tables, Dimension tables, surrogate keys, and automated dbt tests.',
        skills: [
          {
            id: 'da-dbt-star-schema',
            name: 'Kimball Dimensional Modeling & dbt Transformations',
            level: 'ESSENTIAL',
            description:
              'Designing star and snowflake schemas, handling Slowly Changing Dimensions (SCD Type 2), writing modular dbt models, and setting up lineage graphs.',
            whyItMatters:
              'Writing queries directly on raw production replicas is brittle and slow. Dimensional models provide clean, pre-aggregated analytics tables.',
            resources: [
              {
                type: 'COURSE',
                title: 'dbt Fundamentals Course',
                provider: 'dbt Labs',
                url: 'https://courses.getdbt.com',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'da-s3',
        stageNumber: 3,
        stageLabel: 'STAGE 03',
        title: 'Stage 3, Executive BI Dashboards & Visual Storytelling',
        description:
          'Design dashboards that executives actually use: visual hierarchy, drill-down parameters, and action-oriented metric cards in Tableau/Power BI.',
        skills: [
          {
            id: 'da-dashboard-design',
            name: 'Tableau / Power BI Dashboard UX & Storytelling',
            level: 'ESSENTIAL',
            description:
              'Applying color psychology, eliminating chart junk, building interactive filter parameters, and designing responsive mobile dashboard views.',
            whyItMatters:
              'Cluttered dashboards with 50 filters confuse stakeholders. Great BI engineers design intuitive views that answer executive questions in seconds.',
            resources: [
              {
                type: 'DOCS',
                title: 'Visual Display of Quantitative Information',
                provider: 'Edward Tufte / Tableau Whitepapers',
                url: 'https://www.tableau.com/learn/whitepapers',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'da-s4',
        stageNumber: 4,
        stageLabel: 'STAGE 04',
        title: 'Stage 4, Business Unit Economics & SaaS Metric Decomposition',
        description:
          'Calculate and interpret essential SaaS economics: LTV, CAC, payback period, net revenue retention (NRR), and gross margin breakdown.',
        skills: [
          {
            id: 'da-unit-economics',
            name: 'SaaS Metrics & Revenue Waterfall Analysis',
            level: 'ESSENTIAL',
            description:
              'Decomposing Monthly Recurring Revenue (MRR) into New, Expansion, Contraction, and Churn components; calculating LTV/CAC ratios.',
            whyItMatters:
              'Data analysts who understand financial unit economics participate directly in board meetings and strategic capital allocation.',
            resources: [
              {
                type: 'DOCS',
                title: 'SaaS Metrics 2.0 – A Guide to Measuring What Matters',
                provider: 'David Skok / For Entrepreneurs',
                url: 'https://www.forentrepreneurs.com/saas-metrics-2/',
                isFree: true,
              },
            ],
          },
        ],
      },
      {
        id: 'da-s5',
        stageNumber: 5,
        stageLabel: 'STAGE 05',
        title: 'Stage 5, Automated Reporting & Stakeholder Presentation',
        description:
          'Automate recurring analytical pipelines and deliver compelling verbal data presentations to executive leadership.',
        skills: [
          {
            id: 'da-presentation-automation',
            name: 'Scheduled Data Pipelines & Executive Stakeholder Briefings',
            level: 'ESSENTIAL',
            description:
              'Automating daily Slack/email report alerts via Python scripts, translating complex data discrepancies into plain English, and defending conclusions.',
            whyItMatters:
              'The best analysis is useless if stakeholders don’t understand or act on it. Clear communication turns data into commercial decisions.',
            resources: [
              {
                type: 'DOCS',
                title: 'Storytelling with Data Guide',
                provider: 'Cole Nussbaumer Knaflic',
                url: 'https://www.storytellingwithdata.com',
                isFree: true,
              },
            ],
          },
        ],
      },
    ],
  },
];

