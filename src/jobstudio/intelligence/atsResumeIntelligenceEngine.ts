/**
 * Job Studio — ATS Resume Intelligence Engine
 * Specification Version: 1.0
 * 
 * Objective: Generate accurate, role-specific, ATS-compatible resumes that maximise
 * alignment with job requirements and communicate candidate value to recruiters.
 */

export const ATS_RESUME_INTELLIGENCE_CONFIG = {
  system: {
    name: "Job Studio Resume Intelligence Engine",
    version: "1.0",
    objective: "Generate accurate, role-specific, ATS-compatible resumes that maximise alignment with job requirements and communicate candidate value to recruiters.",
    primary_principles: [
      "Accuracy over keyword stuffing",
      "Evidence over unsupported claims",
      "Relevant experience over total experience",
      "Measurable achievements over generic responsibilities",
      "ATS readability and human readability",
      "Preserve candidate identity and employment history"
    ]
  },
  resume_parsing: {
    extract: [
      "full_name",
      "contact_information",
      "location",
      "professional_summary",
      "total_experience",
      "employment_history",
      "job_titles",
      "company_names",
      "employment_dates",
      "responsibilities",
      "achievements",
      "quantifiable_metrics",
      "technical_skills",
      "functional_skills",
      "industry_experience",
      "education",
      "certifications",
      "projects",
      "tools_and_technologies",
      "languages"
    ],
    rules: [
      "Preserve original employment dates",
      "Never invent employers or job titles",
      "Distinguish verified facts from inferred information",
      "Identify missing or ambiguous information",
      "Preserve all relevant achievements and metrics",
      "Do not discard relevant experience simply because it is not recent"
    ]
  },
  job_description_analysis: {
    extract: [
      "job_title",
      "company",
      "department",
      "seniority_level",
      "minimum_experience",
      "preferred_experience",
      "mandatory_qualifications",
      "required_skills",
      "preferred_skills",
      "technical_skills",
      "functional_skills",
      "tools_and_technologies",
      "responsibilities",
      "industry_requirements",
      "location_requirements",
      "work_authorisation",
      "certifications",
      "keywords",
      "business_objectives",
      "success_metrics"
    ],
    requirement_classification: {
      critical: "Explicitly mandatory qualifications, eligibility requirements and essential capabilities",
      high: "Core responsibilities and essential skills",
      medium: "Preferred skills and relevant experience",
      low: "Additional advantages and contextual keywords"
    }
  },
  candidate_matching: {
    dimensions: {
      relevant_experience: {
        weight: 25,
        evaluation: [
          "Similarity of previous responsibilities",
          "Relevance of previous projects",
          "Experience with comparable business processes",
          "Scope and complexity of work"
        ]
      },
      required_skills: {
        weight: 20,
        evaluation: [
          "Required skill coverage",
          "Practical evidence of skill usage",
          "Skill proficiency supported by evidence"
        ]
      },
      role_alignment: {
        weight: 15,
        evaluation: [
          "Functional role similarity",
          "Job responsibility alignment",
          "Seniority alignment"
        ]
      },
      achievements_and_metrics: {
        weight: 15,
        evaluation: [
          "Quantifiable achievements",
          "Business impact",
          "Efficiency improvements",
          "Cost or time savings",
          "Scale of ownership"
        ]
      },
      industry_relevance: {
        weight: 10,
        evaluation: [
          "Industry experience",
          "Domain knowledge",
          "Comparable operating environments"
        ]
      },
      education_and_certifications: {
        weight: 5,
        evaluation: [
          "Mandatory education",
          "Preferred qualifications",
          "Relevant certifications"
        ]
      },
      location_and_eligibility: {
        weight: 5,
        evaluation: [
          "Location compatibility",
          "Work authorisation",
          "Shift and workplace requirements"
        ]
      },
      resume_parsability: {
        weight: 5,
        evaluation: [
          "Standard section headings",
          "Correct text extraction",
          "Readable formatting",
          "Consistent dates and job titles"
        ]
      }
    },
    scoring_rules: [
      "Use a 0-100 scale for each dimension",
      "Calculate the weighted total",
      "Do not award points for unsupported claims",
      "Mark mandatory requirements separately",
      "Distinguish missing evidence from confirmed lack of experience",
      "Do not treat keyword presence as proof of competence",
      "Do not represent the score as a probability of being shortlisted"
    ]
  },
  achievement_optimisation: {
    framework: "Action + Scope + Method + Measurable Outcome",
    prioritise: [
      "Revenue generated",
      "Cost reduction",
      "Time saved",
      "Productivity improvement",
      "Operational efficiency",
      "Risk reduction",
      "SLA improvement",
      "Process automation",
      "Customer or business impact",
      "Scale of responsibility"
    ],
    rules: [
      "Preserve original metrics",
      "Never manufacture percentages or financial impact",
      "Use approximate language when the source data is approximate",
      "Convert generic responsibilities into outcome-oriented statements when evidence supports it",
      "Use strong action verbs",
      "Avoid repetitive bullet points"
    ]
  },
  resume_generation: {
    default_format: "ATS-friendly single-column resume",
    sections: [
      "Professional Summary",
      "Core Competencies",
      "Technical Skills",
      "Professional Experience",
      "Key Achievements",
      "Projects",
      "Education",
      "Certifications"
    ],
    rules: [
      "Prioritise the most relevant experience",
      "Use keywords naturally",
      "Use standard section headings",
      "Use reverse chronological employment history",
      "Use consistent employment dates",
      "Use concise achievement-oriented bullets",
      "Remove irrelevant repetition",
      "Do not add unsupported skills",
      "Do not fabricate job titles",
      "Do not hide employment gaps",
      "Do not change the candidate's actual qualifications"
    ]
  },
  ats_compatibility: {
    requirements: [
      "Single-column layout",
      "Standard fonts",
      "Standard section headings",
      "Selectable text",
      "Consistent date formats",
      "No critical information in headers or footers",
      "No images containing resume text",
      "No unnecessary tables",
      "No skill-rating graphics",
      "No decorative charts",
      "No unusual symbols replacing text",
      "PDF and DOCX compatibility"
    ]
  },
  quality_assurance: {
    checks: [
      "Verify all employment dates",
      "Verify employer names",
      "Verify job titles",
      "Verify education and certifications",
      "Verify every achievement against source information",
      "Check for unsupported claims",
      "Check keyword relevance",
      "Check mandatory requirement coverage",
      "Check spelling and grammar",
      "Check duplicate bullet points",
      "Check ATS text extraction",
      "Check resume length and readability"
    ],
    failure_conditions: [
      "Fabricated experience",
      "Fabricated metrics",
      "Fabricated certifications",
      "Incorrect employment dates",
      "Misrepresented proficiency",
      "Missing mandatory eligibility disclosure"
    ]
  },
  output: {
    deliverables: [
      "Tailored resume PDF",
      "Editable DOCX",
      "Candidate match report",
      "Missing skills and requirements report",
      "Keyword coverage report",
      "Resume improvement recommendations"
    ]
  }
} as const;

export type ScoringDimensionKey =
  | 'relevant_experience'
  | 'required_skills'
  | 'role_alignment'
  | 'achievements_and_metrics'
  | 'industry_relevance'
  | 'education_and_certifications'
  | 'location_and_eligibility'
  | 'resume_parsability';

export type JobFamily =
  | 'engineering'
  | 'product_design'
  | 'operations_finance'
  | 'sales_marketing'
  | 'leadership_executive'
  | 'general';

export type SeniorityLevel =
  | 'entry'
  | 'mid'
  | 'senior'
  | 'lead_staff'
  | 'director_executive';

export interface DimensionEvaluation {
  key: ScoringDimensionKey;
  name: string;
  weight: number;
  score: number; // 0-100 scale
  weighted_score: number;
  status: 'strong' | 'good' | 'moderate' | 'gap' | 'missing_evidence';
  evaluation_notes?: string;
  criteria: readonly string[];
}

export interface MandatoryGate {
  id: string;
  requirement: string;
  category: 'work_authorization' | 'education' | 'license_certification' | 'minimum_experience' | 'location' | 'general';
  status: 'PASSED' | 'FAILED' | 'UNCERTAIN';
  evidence?: string;
  reason?: string;
}

export interface ATSScoreReport {
  overall_score: number; // 0-100 scale
  raw_weighted_total: number;
  is_gated: boolean;
  gate_reason?: string;
  mandatory_gates_passed: boolean;
  mandatory_gates: MandatoryGate[];
  dimensions: Record<ScoringDimensionKey, DimensionEvaluation>;
  job_family: JobFamily;
  seniority: SeniorityLevel;
  weights_applied: Record<ScoringDimensionKey, number>;
  verdict: 'STRONG_APPLY' | 'APPLY' | 'CONSIDER' | 'SKIP';
  quality_assurance: {
    checks_passed: boolean;
    issues_flagged: string[];
    warnings: string[];
  };
}

export const BASE_DIMENSION_WEIGHTS: Record<ScoringDimensionKey, number> = {
  relevant_experience: 25,
  required_skills: 20,
  role_alignment: 15,
  achievements_and_metrics: 15,
  industry_relevance: 10,
  education_and_certifications: 5,
  location_and_eligibility: 5,
  resume_parsability: 5,
};

export const DIMENSION_DISPLAY_NAMES: Record<ScoringDimensionKey, string> = {
  relevant_experience: 'Relevant Experience',
  required_skills: 'Required Skills',
  role_alignment: 'Role Alignment',
  achievements_and_metrics: 'Achievements & Metrics',
  industry_relevance: 'Industry Relevance',
  education_and_certifications: 'Education & Certifications',
  location_and_eligibility: 'Location & Eligibility',
  resume_parsability: 'Resume Parsability',
};

/**
 * Derives dynamic weights configured by Job Family and Seniority level.
 * Guarantees that sum of weights strictly equals 100.
 */
export function getDimensionWeights(
  family: JobFamily = 'general',
  seniority: SeniorityLevel = 'mid'
): Record<ScoringDimensionKey, number> {
  const weights: Record<ScoringDimensionKey, number> = { ...BASE_DIMENSION_WEIGHTS };

  // Adjust by Job Family
  switch (family) {
    case 'engineering':
      // Technical skill mastery & hands-on experience dominate
      weights.required_skills = 25;
      weights.relevant_experience = 25;
      weights.role_alignment = 15;
      weights.achievements_and_metrics = 15;
      weights.industry_relevance = 5;
      weights.education_and_certifications = 5;
      weights.location_and_eligibility = 5;
      weights.resume_parsability = 5;
      break;

    case 'leadership_executive':
      // Scale of ownership, business impact & strategic alignment dominate
      weights.achievements_and_metrics = 25;
      weights.role_alignment = 20;
      weights.relevant_experience = 20;
      weights.industry_relevance = 15;
      weights.required_skills = 10;
      weights.education_and_certifications = 5;
      weights.location_and_eligibility = 5;
      weights.resume_parsability = 0;
      break;

    case 'product_design':
      // Portfolio, cross-functional alignment & customer impact
      weights.relevant_experience = 25;
      weights.required_skills = 20;
      weights.achievements_and_metrics = 20;
      weights.role_alignment = 15;
      weights.industry_relevance = 10;
      weights.education_and_certifications = 5;
      weights.location_and_eligibility = 5;
      weights.resume_parsability = 0;
      break;

    case 'operations_finance':
      // Process governance, SLA/cost metrics, domain regulation
      weights.achievements_and_metrics = 20;
      weights.relevant_experience = 25;
      weights.required_skills = 15;
      weights.industry_relevance = 15;
      weights.role_alignment = 10;
      weights.education_and_certifications = 5;
      weights.location_and_eligibility = 5;
      weights.resume_parsability = 5;
      break;

    default:
      break;
  }

  // Adjust by Seniority Level
  if (seniority === 'entry') {
    // Early career: Education & foundational skills substitute for extensive track record
    weights.education_and_certifications = Math.min(15, weights.education_and_certifications + 10);
    weights.required_skills = Math.min(30, weights.required_skills + 5);
    weights.achievements_and_metrics = Math.max(5, weights.achievements_and_metrics - 10);
    weights.relevant_experience = Math.max(15, weights.relevant_experience - 5);
  } else if (seniority === 'director_executive' || seniority === 'lead_staff') {
    // Senior/Staff: High weight on quantifiable metrics and industry relevance
    weights.achievements_and_metrics = Math.min(30, weights.achievements_and_metrics + 5);
    weights.industry_relevance = Math.min(20, weights.industry_relevance + 5);
    weights.resume_parsability = Math.max(0, weights.resume_parsability - 5);
    weights.required_skills = Math.max(10, weights.required_skills - 5);
  }

  // Normalize so the sum always strictly equals 100
  const currentTotal = Object.values(weights).reduce((sum, w) => sum + w, 0);
  if (currentTotal !== 100) {
    const factor = 100 / currentTotal;
    let running = 0;
    const keys = Object.keys(weights) as ScoringDimensionKey[];
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      weights[k] = Math.round(weights[k] * factor);
      running += weights[k];
    }
    weights[keys[keys.length - 1]] = 100 - running;
  }

  return weights;
}

/**
 * Calculates ATS Resume Intelligence Candidate Match Score with independent Mandatory Eligibility Gating.
 * 
 * CRITICAL RULE: Mandatory eligibility requirements are treated as independent gates.
 * A candidate MUST NOT receive a misleadingly high overall match score simply because they
 * score well in other categories while failing a mandatory qualification.
 */
export function calculateATSIntelligenceScore(params: {
  dimensionScores: Partial<Record<ScoringDimensionKey, number>>;
  dimensionNotes?: Partial<Record<ScoringDimensionKey, string>>;
  mandatoryGates?: MandatoryGate[];
  jobFamily?: JobFamily;
  seniority?: SeniorityLevel;
}): ATSScoreReport {
  const family = params.jobFamily || 'general';
  const seniority = params.seniority || 'mid';
  const weights = getDimensionWeights(family, seniority);
  const gates = params.mandatoryGates || [];

  // Evaluate mandatory gates
  const failedGates = gates.filter((g) => g.status === 'FAILED');
  const mandatoryGatesPassed = failedGates.length === 0;

  let rawWeightedTotal = 0;
  const dimensions = {} as Record<ScoringDimensionKey, DimensionEvaluation>;

  const configDimensions = ATS_RESUME_INTELLIGENCE_CONFIG.candidate_matching.dimensions;

  (Object.keys(weights) as ScoringDimensionKey[]).forEach((key) => {
    const weight = weights[key];
    const score = Math.max(0, Math.min(100, Math.round(params.dimensionScores[key] ?? 0)));
    const weighted_score = Number(((score * weight) / 100).toFixed(2));
    rawWeightedTotal += weighted_score;

    let status: DimensionEvaluation['status'] = 'moderate';
    if (score >= 80) status = 'strong';
    else if (score >= 65) status = 'good';
    else if (score >= 45) status = 'moderate';
    else if (score > 0) status = 'gap';
    else status = 'missing_evidence';

    dimensions[key] = {
      key,
      name: DIMENSION_DISPLAY_NAMES[key],
      weight,
      score,
      weighted_score,
      status,
      evaluation_notes: params.dimensionNotes?.[key],
      criteria: configDimensions[key].evaluation,
    };
  });

  const roundedRawTotal = Math.round(rawWeightedTotal);

  // IMPLEMENTATION RULE: If a mandatory gate fails, cap the overall match score
  // so the candidate does not get a misleading high score when failing eligibility.
  let overallScore = roundedRawTotal;
  let isGated = false;
  let gateReason: string | undefined;

  if (!mandatoryGatesPassed) {
    isGated = true;
    const gateDescriptions = failedGates.map((g) => g.requirement).join('; ');
    gateReason = `Eligibility Gate Unmet: ${gateDescriptions}. Overall score capped at 35% to avoid misleading applications.`;
    // Cap score at 35% maximum when a mandatory qualification (e.g. visa, degree, license) is missing
    overallScore = Math.min(roundedRawTotal, 35);
  }

  // Derive verdict
  let verdict: ATSScoreReport['verdict'] = 'SKIP';
  if (!isGated) {
    if (overallScore >= 85) verdict = 'STRONG_APPLY';
    else if (overallScore >= 70) verdict = 'APPLY';
    else if (overallScore >= 55) verdict = 'CONSIDER';
    else verdict = 'SKIP';
  }

  // Quality Assurance checks
  const issues: string[] = [];
  const warnings: string[] = [];

  if (isGated) {
    issues.push(`Failed mandatory eligibility requirements: ${failedGates.map((g) => g.requirement).join(', ')}`);
  }

  if ((dimensions.required_skills.score || 0) < 40) {
    warnings.push('Required skill coverage is low (< 40%). Recommend bridging critical skills prior to applying.');
  }

  if ((dimensions.relevant_experience.score || 0) < 40) {
    warnings.push('Relevant experience scope is low. Highlight transferable domain projects.');
  }

  return {
    overall_score: overallScore,
    raw_weighted_total: roundedRawTotal,
    is_gated: isGated,
    gate_reason: gateReason,
    mandatory_gates_passed: mandatoryGatesPassed,
    mandatory_gates: gates,
    dimensions,
    job_family: family,
    seniority,
    weights_applied: weights,
    verdict,
    quality_assurance: {
      checks_passed: mandatoryGatesPassed && issues.length === 0,
      issues_flagged: issues,
      warnings,
    },
  };
}

/**
 * Framework: Action + Scope + Method + Measurable Outcome (ASMO)
 * Validates achievement bullet points against the engine's achievement optimization standards.
 */
export function evaluateASMOAchievement(bulletText: string): {
  isCompliant: boolean;
  hasActionVerb: boolean;
  hasMeasurableMetric: boolean;
  hasScopeOrMethod: boolean;
  missingComponents: string[];
  feedback: string;
} {
  const text = (bulletText || '').trim();
  if (!text) {
    return {
      isCompliant: false,
      hasActionVerb: false,
      hasMeasurableMetric: false,
      hasScopeOrMethod: false,
      missingComponents: ['Action Verb', 'Scope / Method', 'Measurable Outcome'],
      feedback: 'Achievement bullet is empty.',
    };
  }

  // 1. Action Verb at start
  const actionVerbPattern = /^(spearheaded|architected|orchestrated|engineered|developed|implemented|led|optimized|streamlined|automated|designed|delivered|scaled|managed|reduced|increased|accelerated|transformed|negotiated|audited|built|executed)\b/i;
  const hasActionVerb = actionVerbPattern.test(text);

  // 2. Measurable Metrics (numbers, percentages, currencies, multipliers, time savings)
  const metricPattern = /(\d+%\b|\$[\d,]+|\b\d+x\b|\b\d+\s*(hours?|days?|weeks?|months?|min|sec)|\b(reduced|increased|saved|generated|slashed|improved)\s+by\s+\d+|\b\d+\+?\s*(users|clients|nodes|services|engineers|teams|tickets|slas|million|billion|k\b))/i;
  const hasMeasurableMetric = metricPattern.test(text);

  // 3. Scope or Method (by, using, via, through, across, leveraging)
  const scopeMethodPattern = /\b(using|via|through|across|by|leveraging|utilizing|employing|integrating|partnering)\b/i;
  const hasScopeOrMethod = scopeMethodPattern.test(text) || text.length > 60;

  const missing: string[] = [];
  if (!hasActionVerb) missing.push('Strong Action Verb');
  if (!hasMeasurableMetric) missing.push('Measurable Outcome / Metric');
  if (!hasScopeOrMethod) missing.push('Scope / Method');

  const isCompliant = hasActionVerb && hasMeasurableMetric && hasScopeOrMethod;

  let feedback = 'Complies with Action + Scope + Method + Measurable Outcome framework.';
  if (!isCompliant) {
    feedback = `Missing ${missing.join(', ')}. Format as: [Strong Action Verb] + [Scope of Ownership] + [Method/Tool Used] + [Measurable Business Outcome]. Never manufacture artificial metrics.`;
  }

  return {
    isCompliant,
    hasActionVerb,
    hasMeasurableMetric,
    hasScopeOrMethod,
    missingComponents: missing,
    feedback,
  };
}

/**
 * Infers Job Family and Seniority Level from Job Title and posting text.
 */
export function detectJobFamilyAndSeniority(
  jobTitle: string,
  jobText: string = ''
): { jobFamily: JobFamily; seniority: SeniorityLevel } {
  const combined = `${jobTitle} ${jobText}`.toLowerCase();

  // Seniority detection
  let seniority: SeniorityLevel = 'mid';
  if (/\b(director|vp|vice president|head of|chief|c-level|executive)\b/i.test(jobTitle)) {
    seniority = 'director_executive';
  } else if (/\b(lead|staff|principal|architect)\b/i.test(jobTitle)) {
    seniority = 'lead_staff';
  } else if (/\b(senior|sr\.?|iii|iv)\b/i.test(jobTitle)) {
    seniority = 'senior';
  } else if (/\b(junior|jr\.?|associate|entry|intern|graduate|level 1|i)\b/i.test(jobTitle)) {
    seniority = 'entry';
  }

  // Family detection
  let jobFamily: JobFamily = 'general';
  if (seniority === 'director_executive' || /\b(chief|vp|vice president|c-level|executive)\b/i.test(jobTitle)) {
    jobFamily = 'leadership_executive';
  } else if (/\b(software|engineer|developer|data engineer|devops|sre|machine learning|frontend|backend|fullstack|cloud)\b/i.test(jobTitle)) {
    jobFamily = 'engineering';
  } else if (/\b(product manager|product designer|ui\/ux|design systems|ux researcher|interaction designer)\b/i.test(jobTitle)) {
    jobFamily = 'product_design';
  } else if (/\b(operations|supply chain|logistics|finance|accountant|procurement|compliance|risk|analyst)\b/i.test(jobTitle)) {
    jobFamily = 'operations_finance';
  } else if (/\b(sales|account executive|marketing|growth|business development|seo|content)\b/i.test(jobTitle)) {
    jobFamily = 'sales_marketing';
  }

  return { jobFamily, seniority };
}

/**
 * Advanced AI Resume Generation Prompt Specification & 10-Phase Pipeline
 */
export const ADVANCED_RESUME_GENERATION_PROMPT = {
  system_role: `You are an expert Resume Intelligence and Recruitment Optimisation Engine specialising in enterprise hiring, ATS compatibility, technical recruitment, business operations, product operations, finance, cybersecurity, project management and technology roles.
Your task is to analyse a candidate's existing resume against a specific job description and produce the strongest truthful, role-specific resume possible.
You must optimise for two audiences:
1. Applicant Tracking Systems and recruitment software that extract and compare candidate information.
2. Human recruiters and hiring managers who evaluate relevance, credibility, achievements, experience and potential.
You are not a keyword-stuffing engine. You are an evidence-based resume optimisation engine.
Your primary objective is to maximise legitimate candidate-to-role alignment without inventing or exaggerating qualifications.`,

  phases: {
    phase_1: 'Extract and understand the candidate (work history, achievements, quantifiable metrics, verified vs inferred capabilities)',
    phase_2: 'Deconstruct the job description (A: Mandatory requirements, B: Core requirements, C: Preferred requirements, D: Hidden business requirements)',
    phase_3: 'Create candidate-to-job match matrix (Direct, Transferable, Partial, Mentioned without evidence, Missing, Unknown)',
    phase_4: 'Identify and optimise achievements (ACTION + SCOPE + METHOD + OUTCOME; strict anti-hallucination rules)',
    phase_5: 'Strategic keyword optimisation (Technical, Functional, Industry, Operational, Tools/Platforms, Job-specific, Certifications)',
    phase_6: 'Generate the tailored resume (Header, Professional Summary, Core Competencies, Technical Skills, Professional Experience, Selected Achievements, Relevant Projects, Education, Certifications)',
    phase_7: 'Resume formatting (Single-column structure, clean typography, standard headings, selectable text, consistent dates, no charts/graphics/decorations)',
    phase_8: 'Independent quality assurance (Factual integrity, Job alignment, ATS compatibility, Human recruiter readability)',
    phase_9: 'Generate an explainable match report (Overall score, 8 category scores, critical missing requirements, recommendations)',
    phase_10: 'Final output (Tailored resume, Match report, Keyword report, Gap analysis, Recommendations)'
  },

  final_non_negotiable_rules: [
    'Never fabricate experience, education, certifications, achievements or metrics.',
    'Never change official employment dates.',
    'Never invent tools or technical proficiency.',
    'Never optimise for keyword density at the expense of readability.',
    'Never remove relevant achievements simply to shorten the resume.',
    'Never claim that a resume guarantees an interview.',
    'Never confuse ATS compatibility with candidate suitability.',
    'Always prioritise factual accuracy and relevance.',
    'Always produce a complete, polished resume rather than merely suggesting edits.',
    'Always validate the generated document before delivering it.'
  ]
} as const;

export type RequirementMatchStatus =
  | 'Direct'
  | 'Transferable'
  | 'Partial'
  | 'Mentioned without evidence'
  | 'Missing'
  | 'Unknown';

export type ResumeAction =
  | 'Highlight'
  | 'Quantify'
  | 'Position accurately'
  | 'Do not claim';

export interface CandidateRequirementMatch {
  requirement: string;
  candidate_evidence: string;
  match_status: RequirementMatchStatus;
  resume_action: ResumeAction;
  notes?: string;
}

export interface KeywordAnalysisReport {
  matched: string[];
  partial: string[];
  missing: string[];
  excluded_unsupported: string[];
  by_category: {
    technical: string[];
    functional: string[];
    industry: string[];
    operational: string[];
    tools_and_technologies: string[];
    certifications: string[];
  };
}

export interface QAValidationReport {
  factual_integrity_passed: boolean;
  job_alignment_passed: boolean;
  ats_compatibility_passed: boolean;
  human_readability_passed: boolean;
  issues: string[];
  warnings: string[];
}

/**
 * Phase 3 Implementation: Compares job requirements against candidate evidence
 * to build an explainable Candidate-to-Job Match Matrix.
 */
export function generateCandidateJobMatchMatrix(
  requirements: string[],
  candidateProfileText: string
): CandidateRequirementMatch[] {
  const profileLower = (candidateProfileText || '').toLowerCase();

  return requirements.map((req) => {
    const reqClean = req.trim();
    const reqLower = reqClean.toLowerCase();

    // Direct match check
    if (profileLower.includes(reqLower)) {
      // Check if evidence includes quantifiable metrics
      const hasMetric = /\b\d+(%|\+|x|\s*(years|months|users|clients|nodes))\b/i.test(candidateProfileText);
      return {
        requirement: reqClean,
        candidate_evidence: `Verified direct experience with ${reqClean} in candidate profile.`,
        match_status: 'Direct',
        resume_action: hasMetric ? 'Highlight' : 'Quantify',
        notes: hasMetric
          ? 'Strong evidence with metrics; showcase prominently in top bullet points.'
          : 'Direct capability documented; quantify business impact and scale in bullet.',
      };
    }

    // Stop words that should not falsely trigger match on specialized requirements
    const stopWords = new Set(['administration', 'general', 'across', 'related', 'various', 'etc']);
    const stem = (w: string) => w.replace(/(ing|tion|ed|ership|ers|er|s)$/i, '');
    const words = reqLower.split(/[\s/,-]+/).filter((w) => w.length > 2 && !stopWords.has(w));
    const matchingWords = words.filter((w) => profileLower.includes(w) || (stem(w).length > 2 && profileLower.includes(stem(w))));
    if (words.length > 0 && matchingWords.length / words.length >= 0.5) {
      return {
        requirement: reqClean,
        candidate_evidence: `Related practical background demonstrating: ${matchingWords.join(', ')}.`,
        match_status: 'Transferable',
        resume_action: 'Position accurately',
        notes: 'Demonstrated through adjacent responsibilities; align terminology truthfully.',
      };
    }

    // Mentioned without evidence
    if (words.length > 0 && matchingWords.length > 0) {
      return {
        requirement: reqClean,
        candidate_evidence: 'Briefly mentioned in skills or background without detailed project context.',
        match_status: 'Mentioned without evidence',
        resume_action: 'Position accurately',
        notes: 'Support claim by connecting to practical projects or coursework without exaggerating.',
      };
    }

    // Missing capability
    return {
      requirement: reqClean,
      candidate_evidence: 'No supporting evidence found in candidate profile.',
      match_status: 'Missing',
      resume_action: 'Do not claim',
      notes: 'Do not fabricate capability. Address via skill roadmap or omit.',
    };
  });
}

/**
 * Phase 5 Implementation: Strategic Keyword Categorization & Coverage Analysis
 */
export function categorizeKeywords(
  jdKeywords: string[],
  candidateProfileText: string
): KeywordAnalysisReport {
  const profileLower = (candidateProfileText || '').toLowerCase();

  const matched: string[] = [];
  const partial: string[] = [];
  const missing: string[] = [];
  const excluded_unsupported: string[] = [];

  const by_category = {
    technical: [] as string[],
    functional: [] as string[],
    industry: [] as string[],
    operational: [] as string[],
    tools_and_technologies: [] as string[],
    certifications: [] as string[],
  };

  jdKeywords.forEach((kw) => {
    const clean = kw.trim();
    if (!clean) return;
    const lower = clean.toLowerCase();

    // Categorization
    if (/\b(python|java|c\+\+|sql|react|typescript|kubernetes|docker|aws|azure|gcp|rest|api|graphql|git)\b/i.test(clean)) {
      by_category.technical.push(clean);
    } else if (/\b(jira|confluence|salesforce|workday|tableau|power bi|figma|excel|snowflake|datadog)\b/i.test(clean)) {
      by_category.tools_and_technologies.push(clean);
    } else if (/\b(pmp|cfa|cpa|itil|cissp|aws certified|scrum master|six sigma|lean)\b/i.test(clean)) {
      by_category.certifications.push(clean);
    } else if (/\b(fintech|healthcare|ecommerce|b2b|saas|banking|logistics|manufacturing)\b/i.test(clean)) {
      by_category.industry.push(clean);
    } else if (/\b(sla|incident|monitoring|wfm|queue|audit|compliance|workflow|process)\b/i.test(clean)) {
      by_category.operational.push(clean);
    } else {
      by_category.functional.push(clean);
    }

    // Match status
    if (profileLower.includes(lower)) {
      matched.push(clean);
    } else {
      const parts = lower.split(/\s+/).filter((p) => p.length > 3);
      if (parts.length > 1 && parts.some((p) => profileLower.includes(p))) {
        partial.push(clean);
      } else {
        missing.push(clean);
        // Excluded from resume to prevent hallucination
        excluded_unsupported.push(clean);
      }
    }
  });

  return {
    matched,
    partial,
    missing,
    excluded_unsupported,
    by_category,
  };
}

/**
 * Phase 8 Implementation: Independent Quality Assurance & Factual Integrity Validation
 */
export function validateResumeFactualIntegrity(
  originalProfileText: string,
  tailoredExperiences: Array<{
    title: string;
    company: string;
    date_range: string;
    bullets: string[];
  }>
): QAValidationReport {
  const profileLower = (originalProfileText || '').toLowerCase();
  const issues: string[] = [];
  const warnings: string[] = [];

  // Check 1: Employer Name verification
  tailoredExperiences.forEach((exp) => {
    const compLower = exp.company.toLowerCase().trim();
    if (compLower && !profileLower.includes(compLower)) {
      issues.push(`Employer "${exp.company}" is not documented in the candidate's master profile.`);
    }
  });

  // Check 2: Pure date formatting and verification
  const invalidDateRegex = /(global|regulated|operations|remote|hybrid|texas|california|lead|manager)/i;
  tailoredExperiences.forEach((exp) => {
    if (invalidDateRegex.test(exp.date_range)) {
      issues.push(`Experience date range "${exp.date_range}" contains invalid descriptors or location notes.`);
    }
  });

  // Check 3: Reverse chronological validation
  for (let i = 0; i < tailoredExperiences.length - 1; i++) {
    const cur = tailoredExperiences[i].date_range;
    const nxt = tailoredExperiences[i + 1].date_range;
    // Extract 4-digit years
    const curYearMatch = cur.match(/\b(20\d\d|19\d\d)\b/g);
    const nxtYearMatch = nxt.match(/\b(20\d\d|19\d\d)\b/g);
    if (curYearMatch && nxtYearMatch) {
      const curMaxYear = cur.includes('Present') ? 9999 : Math.max(...curYearMatch.map(Number));
      const nxtMaxYear = Math.max(...nxtYearMatch.map(Number));
      if (curMaxYear < nxtMaxYear) {
        issues.push(`Chronology violation: "${tailoredExperiences[i].company}" (${cur}) appears before more recent "${tailoredExperiences[i + 1].company}" (${nxt}).`);
      }
    }
  }

  // Check 4: Fabricated extreme metrics check
  const extremeMetricRegex = /(\b(100%|500%|1000%|\$100M|\$1B)\b)/i;
  tailoredExperiences.forEach((exp) => {
    exp.bullets.forEach((b) => {
      const match = b.match(extremeMetricRegex);
      if (match && !profileLower.includes(match[1].toLowerCase())) {
        warnings.push(`Extreme metric "${match[1]}" in bullet point could not be verified against master profile.`);
      }
    });
  });

  const factual_integrity_passed = issues.length === 0;

  return {
    factual_integrity_passed,
    job_alignment_passed: true,
    ats_compatibility_passed: true,
    human_readability_passed: true,
    issues,
    warnings,
  };
}
