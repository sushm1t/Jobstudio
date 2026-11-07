import { describe, expect, it } from 'vitest';
import {
  ATS_RESUME_INTELLIGENCE_CONFIG,
  ADVANCED_RESUME_GENERATION_PROMPT,
  BASE_DIMENSION_WEIGHTS,
  DIMENSION_DISPLAY_NAMES,
  getDimensionWeights,
  calculateATSIntelligenceScore,
  evaluateASMOAchievement,
  detectJobFamilyAndSeniority,
  generateCandidateJobMatchMatrix,
  categorizeKeywords,
  validateResumeFactualIntegrity,
  type ScoringDimensionKey,
  type MandatoryGate,
} from '@/jobstudio/intelligence/atsResumeIntelligenceEngine';

describe('Job Studio — ATS Resume Intelligence Engine', () => {
  describe('1. Configuration & Standards Specification', () => {
    it('verifies system configuration parameters and primary principles', () => {
      const { system } = ATS_RESUME_INTELLIGENCE_CONFIG;
      expect(system.name).toBe('Job Studio Resume Intelligence Engine');
      expect(system.version).toBe('1.0');
      expect(system.objective).toContain('ATS-compatible resumes that maximise alignment');
      expect(system.primary_principles).toContain('Accuracy over keyword stuffing');
      expect(system.primary_principles).toContain('Evidence over unsupported claims');
      expect(system.primary_principles).toContain('Relevant experience over total experience');
      expect(system.primary_principles).toContain('Measurable achievements over generic responsibilities');
      expect(system.primary_principles).toContain('ATS readability and human readability');
      expect(system.primary_principles).toContain('Preserve candidate identity and employment history');
    });

    it('verifies baseline candidate matching dimensions and weights sum strictly to 100', () => {
      const dimensions = ATS_RESUME_INTELLIGENCE_CONFIG.candidate_matching.dimensions;
      const keys = Object.keys(dimensions) as ScoringDimensionKey[];
      expect(keys).toHaveLength(8);

      const totalWeight = keys.reduce((sum, key) => sum + dimensions[key].weight, 0);
      expect(totalWeight).toBe(100);

      expect(dimensions.relevant_experience.weight).toBe(25);
      expect(dimensions.required_skills.weight).toBe(20);
      expect(dimensions.role_alignment.weight).toBe(15);
      expect(dimensions.achievements_and_metrics.weight).toBe(15);
      expect(dimensions.industry_relevance.weight).toBe(10);
      expect(dimensions.education_and_certifications.weight).toBe(5);
      expect(dimensions.location_and_eligibility.weight).toBe(5);
      expect(dimensions.resume_parsability.weight).toBe(5);
    });

    it('verifies requirement classification tiers in job description analysis', () => {
      const { requirement_classification } = ATS_RESUME_INTELLIGENCE_CONFIG.job_description_analysis;
      expect(requirement_classification.critical).toContain('Explicitly mandatory qualifications');
      expect(requirement_classification.high).toContain('Core responsibilities and essential skills');
      expect(requirement_classification.medium).toContain('Preferred skills and relevant experience');
      expect(requirement_classification.low).toContain('Additional advantages and contextual keywords');
    });

    it('verifies achievement optimisation framework and anti-hallucination rules', () => {
      const { achievement_optimisation } = ATS_RESUME_INTELLIGENCE_CONFIG;
      expect(achievement_optimisation.framework).toBe('Action + Scope + Method + Measurable Outcome');
      expect(achievement_optimisation.rules).toContain('Preserve original metrics');
      expect(achievement_optimisation.rules).toContain('Never manufacture percentages or financial impact');
    });
  });

  describe('2. Dynamic & Configurable Dimension Weights', () => {
    it('provides standard weights for general mid-level roles summing to 100', () => {
      const weights = getDimensionWeights('general', 'mid');
      const sum = Object.values(weights).reduce((a, b) => a + b, 0);
      expect(sum).toBe(100);
      expect(weights.relevant_experience).toBe(25);
      expect(weights.required_skills).toBe(20);
    });

    it('adjusts weights dynamically for engineering family to prioritize required technical skills', () => {
      const weights = getDimensionWeights('engineering', 'senior');
      const sum = Object.values(weights).reduce((a, b) => a + b, 0);
      expect(sum).toBe(100);
      // Engineering elevates required skills to at least 25
      expect(weights.required_skills).toBeGreaterThanOrEqual(20);
      expect(weights.relevant_experience).toBeGreaterThanOrEqual(20);
    });

    it('adjusts weights dynamically for leadership & executive family to prioritize achievements & scope', () => {
      const weights = getDimensionWeights('leadership_executive', 'director_executive');
      const sum = Object.values(weights).reduce((a, b) => a + b, 0);
      expect(sum).toBe(100);
      // Leadership elevates achievements & metrics to 25+
      expect(weights.achievements_and_metrics).toBeGreaterThanOrEqual(25);
      expect(weights.role_alignment).toBeGreaterThanOrEqual(15);
    });

    it('adjusts weights dynamically for entry-level candidates to accommodate foundational education and skills', () => {
      const weights = getDimensionWeights('general', 'entry');
      const sum = Object.values(weights).reduce((a, b) => a + b, 0);
      expect(sum).toBe(100);
      // Entry level weights education & skills higher and reduces achievement expectations
      expect(weights.education_and_certifications).toBeGreaterThan(BASE_DIMENSION_WEIGHTS.education_and_certifications);
      expect(weights.achievements_and_metrics).toBeLessThan(BASE_DIMENSION_WEIGHTS.achievements_and_metrics);
    });
  });

  describe('3. Independent Mandatory Eligibility Gating', () => {
    it('calculates full weighted score when all mandatory gates pass', () => {
      const report = calculateATSIntelligenceScore({
        dimensionScores: {
          relevant_experience: 90,
          required_skills: 85,
          role_alignment: 80,
          achievements_and_metrics: 85,
          industry_relevance: 75,
          education_and_certifications: 80,
          location_and_eligibility: 90,
          resume_parsability: 95,
        },
        mandatoryGates: [
          {
            id: 'gate-1',
            requirement: 'Active US Work Authorization',
            category: 'work_authorization',
            status: 'PASSED',
          },
          {
            id: 'gate-2',
            requirement: 'Bachelors in Computer Science or Equivalent Practical Experience',
            category: 'education',
            status: 'PASSED',
          },
        ],
        jobFamily: 'engineering',
        seniority: 'senior',
      });

      expect(report.mandatory_gates_passed).toBe(true);
      expect(report.is_gated).toBe(false);
      expect(report.overall_score).toBeGreaterThanOrEqual(80);
      expect(report.verdict).toBe('STRONG_APPLY');
      expect(report.quality_assurance.checks_passed).toBe(true);
    });

    it('STRICT GATE RULE: Capping score and preventing high match illusion when a mandatory gate fails', () => {
      // Candidate scores 100% on experience, skills, metrics, and role alignment
      // but lacks mandatory Top Secret Clearance or required Medical License
      const report = calculateATSIntelligenceScore({
        dimensionScores: {
          relevant_experience: 100,
          required_skills: 100,
          role_alignment: 100,
          achievements_and_metrics: 100,
          industry_relevance: 100,
          education_and_certifications: 100,
          location_and_eligibility: 0,
          resume_parsability: 100,
        },
        mandatoryGates: [
          {
            id: 'gate-clearance',
            requirement: 'Active Top Secret / SCI Polygraph Security Clearance',
            category: 'license_certification',
            status: 'FAILED',
            reason: 'Candidate does not hold mandatory active TS/SCI clearance required for facility access.',
          },
        ],
        jobFamily: 'engineering',
        seniority: 'senior',
      });

      expect(report.mandatory_gates_passed).toBe(false);
      expect(report.is_gated).toBe(true);
      // Raw weighted total would be 95%, but overall score MUST be capped to prevent misleading applications
      expect(report.raw_weighted_total).toBeGreaterThanOrEqual(90);
      expect(report.overall_score).toBeLessThanOrEqual(35);
      expect(report.verdict).toBe('SKIP');
      expect(report.gate_reason).toContain('Eligibility Gate Unmet');
      expect(report.gate_reason).toContain('Top Secret / SCI');
      expect(report.quality_assurance.checks_passed).toBe(false);
      expect(report.quality_assurance.issues_flagged.length).toBeGreaterThan(0);
    });
  });

  describe('4. Achievement Optimization Framework (Action + Scope + Method + Measurable Outcome)', () => {
    it('validates a compliant bullet adhering to ASMO framework', () => {
      const compliantBullet =
        'Spearheaded global payment gateway migration across 14 European markets using Go and Kafka, reducing transaction latency by 42% and saving $1.2M annually.';
      const result = evaluateASMOAchievement(compliantBullet);

      expect(result.isCompliant).toBe(true);
      expect(result.hasActionVerb).toBe(true);
      expect(result.hasMeasurableMetric).toBe(true);
      expect(result.hasScopeOrMethod).toBe(true);
      expect(result.missingComponents).toHaveLength(0);
    });

    it('identifies missing metrics and generic responsibilities in weak bullets', () => {
      const weakBullet = 'Responsible for managing database backups and helping developers with bugs.';
      const result = evaluateASMOAchievement(weakBullet);

      expect(result.isCompliant).toBe(false);
      expect(result.hasActionVerb).toBe(false); // Does not begin with strong action verb
      expect(result.hasMeasurableMetric).toBe(false); // No metrics, percentage, or currency
      expect(result.missingComponents).toContain('Strong Action Verb');
      expect(result.missingComponents).toContain('Measurable Outcome / Metric');
      expect(result.feedback).toContain('Format as: [Strong Action Verb]');
      expect(result.feedback).toContain('Never manufacture artificial metrics');
    });
  });

  describe('5. Job Family & Seniority Detection', () => {
    it('detects engineering family and senior level from title', () => {
      const res = detectJobFamilyAndSeniority('Senior Distributed Systems Engineer', 'Kubernetes, Go, Microservices');
      expect(res.jobFamily).toBe('engineering');
      expect(res.seniority).toBe('senior');
    });

    it('detects leadership executive family and director level from title', () => {
      const res = detectJobFamilyAndSeniority('Director of Global Operations', 'Lead multinational fulfillment centers');
      expect(res.jobFamily).toBe('leadership_executive');
      expect(res.seniority).toBe('director_executive');
    });

    it('detects entry level for associate roles', () => {
      const res = detectJobFamilyAndSeniority('Associate Operations Analyst', 'Entry level analytical role');
      expect(res.jobFamily).toBe('operations_finance');
      expect(res.seniority).toBe('entry');
    });
  });

  describe('6. Advanced AI Resume Generation Prompt & 10-Phase Pipeline', () => {
    it('verifies 10-phase pipeline and system role definitions', () => {
      const { system_role, phases, final_non_negotiable_rules } = ADVANCED_RESUME_GENERATION_PROMPT;
      expect(system_role).toContain('Resume Intelligence and Recruitment Optimisation Engine');
      expect(system_role).toContain('You are not a keyword-stuffing engine');
      expect(system_role).toContain('evidence-based resume optimisation engine');

      expect(Object.keys(phases)).toHaveLength(10);
      expect(phases.phase_1).toContain('Extract and understand the candidate');
      expect(phases.phase_2).toContain('Deconstruct the job description');
      expect(phases.phase_3).toContain('Create candidate-to-job match matrix');
      expect(phases.phase_4).toContain('Identify and optimise achievements');
      expect(phases.phase_5).toContain('Strategic keyword optimisation');
      expect(phases.phase_6).toContain('Generate the tailored resume');
      expect(phases.phase_7).toContain('Resume formatting');
      expect(phases.phase_8).toContain('Independent quality assurance');
      expect(phases.phase_9).toContain('Generate an explainable match report');
      expect(phases.phase_10).toContain('Final output');

      expect(final_non_negotiable_rules).toContain('Never fabricate experience, education, certifications, achievements or metrics.');
      expect(final_non_negotiable_rules).toContain('Never change official employment dates.');
      expect(final_non_negotiable_rules).toContain('Never invent tools or technical proficiency.');
    });
  });

  describe('7. Candidate-to-Job Match Matrix (Phase 3)', () => {
    const sampleProfile = `
      Senior Operations Manager at FinTech Global (Oct 2021 – Present).
      Led payment gateway operations across 500+ merchants using SQL, Jira, and Python.
      Managed team of 15 analysts, improving SLA compliance by 28%.
      Previous: Process Coordinator at Logistics Corp (2018 – 2021).
      Education: BS in Business Administration.
    `;

    it('classifies direct, transferable, and missing requirements with appropriate actions', () => {
      const requirements = [
        'SQL', // Direct + Metrics in profile
        'Payment gateway operations', // Direct
        'Cross-functional team leadership', // Transferable (led team of 15)
        'Kubernetes cluster administration', // Missing
      ];

      const matrix = generateCandidateJobMatchMatrix(requirements, sampleProfile);
      expect(matrix).toHaveLength(4);

      // SQL -> Direct, Highlight / Quantify
      const sqlMatch = matrix.find((m) => m.requirement === 'SQL')!;
      expect(sqlMatch.match_status).toBe('Direct');
      expect(['Highlight', 'Quantify']).toContain(sqlMatch.resume_action);

      // Payment gateway operations -> Direct
      const paymentMatch = matrix.find((m) => m.requirement === 'Payment gateway operations')!;
      expect(paymentMatch.match_status).toBe('Direct');

      // Cross-functional team leadership -> Transferable or Mentioned without evidence
      const leadershipMatch = matrix.find((m) => m.requirement === 'Cross-functional team leadership')!;
      expect(['Transferable', 'Direct', 'Mentioned without evidence']).toContain(leadershipMatch.match_status);

      // Kubernetes -> Missing, Do not claim
      const k8sMatch = matrix.find((m) => m.requirement === 'Kubernetes cluster administration')!;
      expect(k8sMatch.match_status).toBe('Missing');
      expect(k8sMatch.resume_action).toBe('Do not claim');
    });
  });

  describe('8. Strategic Keyword Categorization & Coverage (Phase 5)', () => {
    const sampleProfile = 'Staff Engineer with Python, SQL, Docker, AWS, Datadog, Jira, Agile, and FinTech domain experience.';

    it('categorizes keywords into technical, tools, operational, and separates matched vs unsupported', () => {
      const jdKeywords = [
        'Python', // Technical, Matched
        'SQL', // Technical, Matched
        'Datadog', // Tools, Matched
        'FinTech', // Industry, Matched
        'Kubernetes', // Technical, Missing -> Excluded
        'Salesforce', // Tools, Missing -> Excluded
        'PMP', // Certifications, Missing -> Excluded
      ];

      const report = categorizeKeywords(jdKeywords, sampleProfile);

      expect(report.matched).toContain('Python');
      expect(report.matched).toContain('SQL');
      expect(report.matched).toContain('Datadog');
      expect(report.matched).toContain('FinTech');

      expect(report.missing).toContain('Kubernetes');
      expect(report.missing).toContain('Salesforce');
      expect(report.missing).toContain('PMP');

      // Excluded unsupported keywords to protect anti-hallucination rules
      expect(report.excluded_unsupported).toContain('Kubernetes');
      expect(report.excluded_unsupported).toContain('Salesforce');

      // By category verification
      expect(report.by_category.technical).toContain('Python');
      expect(report.by_category.technical).toContain('Kubernetes');
      expect(report.by_category.tools_and_technologies).toContain('Datadog');
      expect(report.by_category.tools_and_technologies).toContain('Salesforce');
      expect(report.by_category.certifications).toContain('PMP');
    });
  });

  describe('9. Independent Quality Assurance & Factual Integrity (Phase 8)', () => {
    const masterProfile = `
      Senior Site Reliability Engineer at CloudScale LLC (Jan 2022 – Present).
      DevOps Specialist at DataCorp (Jun 2019 – Dec 2021).
      Automated CI/CD pipelines using Terraform and GitHub Actions, reducing deployment time by 45%.
    `;

    it('passes QA when employers and dates match master profile faithfully', () => {
      const validExperiences = [
        {
          company: 'CloudScale LLC',
          title: 'Senior Site Reliability Engineer',
          date_range: 'Jan 2022 – Present',
          bullets: ['Orchestrated cloud infrastructure across AWS reducing deployment latency by 45%.'],
        },
        {
          company: 'DataCorp',
          title: 'DevOps Specialist',
          date_range: 'Jun 2019 – Dec 2021',
          bullets: ['Automated CI/CD pipelines using Terraform supporting 40+ engineering services.'],
        },
      ];

      const report = validateResumeFactualIntegrity(masterProfile, validExperiences);
      expect(report.factual_integrity_passed).toBe(true);
      expect(report.issues).toHaveLength(0);
    });

    it('fails QA when unverified employers or broken chronology are introduced', () => {
      const invalidExperiences = [
        {
          company: 'Unknown Enterprise Hallucinated Ltd', // Unverified employer
          title: 'VP of Engineering',
          date_range: 'Jan 2018 – Dec 2019', // Chronology: 2018-2019 placed above 2022!
          bullets: ['Managed global team.'],
        },
        {
          company: 'CloudScale LLC',
          title: 'Senior Site Reliability Engineer',
          date_range: 'Jan 2022 – Present',
          bullets: ['Orchestrated cloud infrastructure.'],
        },
      ];

      const report = validateResumeFactualIntegrity(masterProfile, invalidExperiences);
      expect(report.factual_integrity_passed).toBe(false);
      expect(report.issues.some((i) => i.includes('Unknown Enterprise Hallucinated Ltd'))).toBe(true);
      expect(report.issues.some((i) => i.includes('Chronology violation'))).toBe(true);
    });
  });
});

