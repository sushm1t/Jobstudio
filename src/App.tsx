/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { JobEvaluatorView } from './components/JobEvaluatorView';
import { ResumeDocument } from './components/ResumeDocument';
import { CoverLetterView } from './components/CoverLetterView';
import { ScreeningAnswersView } from './components/ScreeningAnswersView';
import { CandidateProfileModal } from './components/CandidateProfileModal';
import {
  PRESET_JOBS,
  SUSHMIT_PROFILE_TEXT,
  SUSHMIT_USER_INFO,
  MASTER_BASE_RESUME,
  EMPTY_EVALUATION,
  EMPTY_COVER_LETTER,
  INITIAL_WEAVER_EVALUATION,
  INITIAL_WEAVER_RESUME,
  INITIAL_WEAVER_COVER_LETTER,
  INITIAL_SCREENING_ANSWERS,
  INITIAL_INTERVIEW_PREP_QUESTIONS,
  JobEvaluationData,
  TailoredResumeData,
  CoverLetterData,
  ScreeningAnswer,
  InterviewPrepQuestion,
  CandidateInfo,
  JobOpportunity,
} from './data/defaultData';
import { downloadResumeAsPdf } from './utils/pdfExport';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('evaluator');
  const [opportunities, setOpportunities] = useState<JobOpportunity[]>(PRESET_JOBS);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [customJobText, setCustomJobText] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<string>('');

  const [evaluation, setEvaluation] = useState<JobEvaluationData>(EMPTY_EVALUATION);
  const [resume, setResume] = useState<TailoredResumeData>(MASTER_BASE_RESUME);
  const [coverLetter, setCoverLetter] = useState<CoverLetterData>(EMPTY_COVER_LETTER);
  const [screeningAnswers, setScreeningAnswers] = useState<ScreeningAnswer[]>([]);
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewPrepQuestion[]>([]);
  const [isFetchingInterviewPrep, setIsFetchingInterviewPrep] = useState<boolean>(false);

  const [masterProfileText, setMasterProfileText] = useState<string>(SUSHMIT_PROFILE_TEXT);
  const [candidateInfo, setCandidateInfo] = useState<CandidateInfo>(SUSHMIT_USER_INFO);

  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Sync active resume to global window for seamless export across tabs
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__JOBSTUDIO_ACTIVE_RESUME__ = resume;
    }
  }, [resume]);

  // Download PDF handler
  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    const safeTitle = (evaluation.company_name && evaluation.job_title)
      ? (evaluation.company_name + '_' + evaluation.job_title).replace(/[^a-zA-Z0-9_-]/g, '_')
      : 'Master';
    const fileName = `${safeTitle}_${resume.full_name.replace(/\s+/g, '_')}_Resume.pdf`;
    const success = await downloadResumeAsPdf('printable-resume-container', fileName, true, resume);
    setIsDownloadingPdf(false);
    if (success) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }
  };

  // Switch preset or live discovered target opportunity
  const handleSelectPreset = (jobId: string) => {
    // If clicking the currently selected job or clearing, return to plain state
    if (!jobId || jobId === selectedJobId) {
      setSelectedJobId('');
      setCustomJobText('');
      setCustomUrl('');
      setEvaluation(EMPTY_EVALUATION);
      setResume(MASTER_BASE_RESUME);
      setCoverLetter(EMPTY_COVER_LETTER);
      setScreeningAnswers([]);
      setInterviewQuestions([]);
      return;
    }

    setSelectedJobId(jobId);
    const found = opportunities.find((j) => j.id === jobId);
    if (!found) return;

    if (jobId === 'weaver-senior-associate') {
      setCustomJobText(found.description);
      setCustomUrl(found.applyUrl);
      setEvaluation(INITIAL_WEAVER_EVALUATION);
      setResume(INITIAL_WEAVER_RESUME);
      setCoverLetter(INITIAL_WEAVER_COVER_LETTER);
      setScreeningAnswers(INITIAL_SCREENING_ANSWERS);
      setInterviewQuestions(INITIAL_INTERVIEW_PREP_QUESTIONS);
    } else if (jobId === 'honeywell-integrity-compliance') {
      setCustomJobText(found.description);
      setCustomUrl(found.applyUrl);
      setEvaluation({
        job_title: found.title,
        company_name: found.company,
        match_score: 94,
        should_apply: true,
        verdict: 'STRONG_APPLY',
        key_matching_factors: [
          'Direct match for pre-L1 and L1 third-party risk due diligence and compliance screenings.',
          'Revolut financial operations expertise in payment disputes, fraud risk escalation, and cross-functional incident response.',
          'Microsoft Certified: Security, Compliance, and Identity Fundamentals (SC-900) & NIT Rourkela compliance credentials.',
          'Advanced data analytics proficiency in SQL, Looker, and Metabase to drive digital compliance insights.',
        ],
        missing_critical_skills: [
          'Aerospace defense procurement frameworks (ITAR, EAR, FAR) and formal ISO 9001 quality audits.',
        ],
        tailoring_recommendations: [
          'Highlight third-party vendor review workflows and regulatory adherence.',
          'Emphasize data-driven screening metrics and cross-functional incident mitigation.',
        ],
        location_info: found.location,
        executive_summary: `${found.matchHighlight} Candidate profile represents an estimated 94% qualification overlap for digital compliance operations.`,
        skill_roadmap: [
          {
            skill: 'Defense & Aerospace Trade Compliance (ITAR / EAR)',
            action_plan: 'Review Export Administration Regulations (EAR) and International Traffic in Arms Regulations (ITAR) compliance checkpoints for dual-use technologies.',
            recommended_certification: 'Certified U.S. Export Compliance Officer (CUSECO)',
            certification_provider: 'Export Compliance Training Institute',
            timeline: '2–3 weeks',
            importance: 'RECOMMENDED',
            practical_project: 'Develop a third-party vendor screening checklist incorporating denied-party screening (DPS) and sanctioned-entity flags.',
          },
          {
            skill: 'Regulatory Audit Trail & ISO 9001/AS9100 Governance',
            action_plan: 'Study AS9100 Quality Management System standards for aerospace manufacturing supply chains and digital compliance logging.',
            recommended_certification: 'ASQ Certified Quality Auditor (CQA) / Lead Auditor',
            certification_provider: 'American Society for Quality (ASQ)',
            timeline: '3–4 weeks',
            importance: 'NICE_TO_HAVE',
            practical_project: 'Create an automated audit reconciliation dashboard linking access control logs to compliance certification renewals.',
          },
        ],
        recommended_certifications: [
          {
            name: 'Certified Compliance & Ethics Professional (CCEP)',
            issuer: 'Compliance Certification Board (CCB)',
            target_skill: 'Corporate ethics, compliance risk assessments, internal investigation standards',
            estimated_time: '3–4 weeks',
            why_it_helps: 'Establishes gold-standard compliance credentials for Fortune 500 aerospace & defense recruiters.',
            difficulty: 'Intermediate',
          },
          {
            name: 'ASQ Quality Auditor / Risk Governance',
            issuer: 'ASQ',
            target_skill: 'Internal control testing, regulatory gap analysis, supply chain auditing',
            estimated_time: '3 weeks',
            why_it_helps: 'Directly mitigates the lack of formal aerospace plant inspection background.',
            difficulty: 'Intermediate',
          },
        ],
      });
    } else {
      setCustomJobText(found.description);
      setCustomUrl(found.applyUrl);
      
      const isIncident = found.category?.includes('Incident') || found.title?.toLowerCase().includes('incident');
      const isWfm = found.category?.includes('Real-Time') || found.title?.toLowerCase().includes('workforce') || found.title?.toLowerCase().includes('wfm');
      const isProdOps = found.category?.includes('Product') || found.title?.toLowerCase().includes('product');
      
      // Pre-populate evaluation preview based on verified eligibility score
      setEvaluation({
        job_title: found.title,
        company_name: found.company,
        match_score: found.matchScore,
        should_apply: found.matchScore >= 70,
        verdict: found.matchScore >= 85 ? 'STRONG_APPLY' : 'APPLY',
        key_matching_factors: [
          found.matchHighlight,
          'Direct experience monitoring dynamic queues and balancing frontline capacity.',
          'Advanced analytics proficiency using SQL (Jove), Looker, Metabase, and Excel.',
        ],
        missing_critical_skills: [
          isIncident
            ? 'Enterprise ITIL 4 Service Value System certification and major outage post-mortem RCA documentation.'
            : isWfm
            ? 'Long-range Erlang-C capacity modeling and telephonic ACD routing integration.'
            : isProdOps
            ? 'Deep telemetry instrumentation (Datadog/Snowflake) and sprint-level engineering defect triage.'
            : 'Enterprise ERP software specialization (SAP/Workday) and complex financial realization models.',
        ],
        tailoring_recommendations: [
          'Align accomplishment metrics with the specific product domain and scale.',
          'Emphasize cross-functional incident mitigation and process automation workflows.',
        ],
        location_info: found.location,
        executive_summary: `${found.matchHighlight} Candidate profile represents an estimated ${found.matchScore}% qualification overlap.`,
        skill_roadmap: isIncident
          ? [
              {
                skill: 'ITIL 4 Service Management & Incident Bridge Command',
                action_plan: 'Master ITIL 4 Foundation practices focusing on Incident Management, Problem Management (RCA), and Change Enablement.',
                recommended_certification: 'ITIL 4 Foundation / Managing Professional',
                certification_provider: 'AXELOS / PeopleCert',
                timeline: '2 weeks',
                importance: 'CRITICAL',
                practical_project: 'Design a Severity-1 incident response playbook complete with SLA breach thresholds and automated stakeholder bridge communications.',
              },
              {
                skill: 'ServiceNow ITSM & Enterprise Incident Metrics',
                action_plan: 'Gain hands-on familiarity with ServiceNow Incident Management modules, SLA timers, and automated assignment groups.',
                recommended_certification: 'ServiceNow Certified System Administrator (CSA)',
                certification_provider: 'ServiceNow',
                timeline: '3–4 weeks',
                importance: 'RECOMMENDED',
                practical_project: 'Configure an incident lifecycle schema mapping MTTR, MTTD, and escalation matrix hierarchies.',
              },
            ]
          : isWfm
          ? [
              {
                skill: 'Erlang-C & Omnichannel Capacity Forecasting',
                action_plan: 'Learn multi-skill contact center staffing algorithms, shrinkage modeling, and occupancy smoothing heuristics.',
                recommended_certification: 'Certified Workforce Planning Professional (CWPP)',
                certification_provider: 'The Quality Assurance & Training Connection (QATC)',
                timeline: '3–4 weeks',
                importance: 'CRITICAL',
                practical_project: 'Build an Erlang-C staffing calculator in Excel calculating interval staffing requirements across 300+ chat queues.',
              },
              {
                skill: 'Workforce Optimization (WFO) Suites (NICE, Verint, Teleopti)',
                action_plan: 'Explore workforce management scheduling engines, intraday flex rules, and real-time adherence tracking interfaces.',
                recommended_certification: 'NICE WFM Certified Professional',
                certification_provider: 'NICE Systems',
                timeline: '2–3 weeks',
                importance: 'RECOMMENDED',
                practical_project: 'Simulate a sudden 40% intraday surge and document multi-tier re-allocation rules to preserve 90% SLA.',
              },
            ]
          : isProdOps
          ? [
              {
                skill: 'Product Telemetry & Observability (Datadog, Mixpanel, Snowflake)',
                action_plan: 'Learn to track user funnel drops, technical exceptions, and telemetry metrics directly in Snowflake and Mixpanel.',
                recommended_certification: 'Snowflake SnowPro Core / Datadog Fundamentals',
                certification_provider: 'Snowflake / Datadog',
                timeline: '3 weeks',
                importance: 'RECOMMENDED',
                practical_project: 'Construct an operational telemetry dashboard isolating KYC friction drop-offs across onboarding funnels.',
              },
              {
                skill: 'Agile Product Operations & Jira Advanced Roadmaps',
                action_plan: 'Master feature launch checklists, operational readiness reviews (ORR), and cross-functional feedback loops.',
                recommended_certification: 'Certified Scrum Product Owner (CSPO) / Pragmatic Institute',
                certification_provider: 'Scrum Alliance',
                timeline: '2 weeks',
                importance: 'RECOMMENDED',
                practical_project: 'Draft a Product Operations Launch Readiness template covering support training, escalation routing, and feature rollback triggers.',
              },
            ]
          : [
              {
                skill: 'Power BI & Advanced Data Modeling (DAX)',
                action_plan: 'Expand from Looker/Metabase to Power BI, mastering star schemas, DAX measures, and automated executive dashboards.',
                recommended_certification: 'PL-300: Microsoft Power BI Data Analyst',
                certification_provider: 'Microsoft',
                timeline: '2–3 weeks',
                importance: 'RECOMMENDED',
                practical_project: 'Build an operational KPI dashboard tracking volume variances, cost-to-serve, and SLA compliance metrics.',
              },
              {
                skill: 'Lean Six Sigma Process Optimization',
                action_plan: 'Apply DMAIC framework to identify process bottlenecks, reduce operational cycle times, and eliminate defects.',
                recommended_certification: 'Lean Six Sigma Green Belt (LSSGB)',
                certification_provider: 'ASQ / IASSC',
                timeline: '4 weeks',
                importance: 'RECOMMENDED',
                practical_project: 'Conduct an RCA on support chat transfer loops and map a streamlined resolution workflow with quantifiable cycle-time savings.',
              },
            ],
        recommended_certifications: isIncident
          ? [
              {
                name: 'ITIL 4 Foundation in IT Service Management',
                issuer: 'AXELOS / PeopleCert',
                target_skill: 'Incident command, problem management, ITIL service governance',
                estimated_time: '2 weeks',
                why_it_helps: 'The universal benchmark for major incident command and enterprise service management roles.',
                difficulty: 'Beginner',
              },
              {
                name: 'ServiceNow Certified System Administrator (ITSM)',
                issuer: 'ServiceNow',
                target_skill: 'Enterprise ticketing workflow automation, SLA alerting, incident triage',
                estimated_time: '3–4 weeks',
                why_it_helps: 'High demand across BETSOL and IT service employers looking for platform-certified incident leads.',
                difficulty: 'Intermediate',
              },
            ]
          : isWfm
          ? [
              {
                name: 'Certified Workforce Planning Professional (CWPP)',
                issuer: 'The Workforce Management Institute (SWPP)',
                target_skill: 'Capacity forecasting, intraday variance steering, Erlang modeling',
                estimated_time: '3–4 weeks',
                why_it_helps: 'Proves formal mastery of global workforce management theory alongside candidate practical Revolut SME experience.',
                difficulty: 'Intermediate',
              },
              {
                name: 'Advanced Excel Financial & Capacity Modeling',
                issuer: 'Corporate Finance Institute (CFI)',
                target_skill: 'Dynamic sensitivity analysis, shift optimization formulas, roster forecasting',
                estimated_time: '2 weeks',
                why_it_helps: 'Demonstrates deep analytical rigor for command center lead positions at companies like Wise.',
                difficulty: 'Intermediate',
              },
            ]
          : [
              {
                name: 'PL-300: Microsoft Power BI Data Analyst',
                issuer: 'Microsoft',
                target_skill: 'Data visualization, DAX modeling, automated ETL reporting',
                estimated_time: '3 weeks',
                why_it_helps: 'Complements candidate Looker & SQL skills to cover Microsoft-centric enterprise tech stacks.',
                difficulty: 'Intermediate',
              },
              {
                name: 'Lean Six Sigma Green Belt',
                issuer: 'ASQ / IASSC',
                target_skill: 'Root-cause analysis, defect reduction, DMAIC process re-engineering',
                estimated_time: '4 weeks',
                why_it_helps: 'Offers strong proof of candidate process improvement and defect elimination capability.',
                difficulty: 'Intermediate',
              },
            ],
      });
    }
  };

  // Call Gemini backend to evaluate & tailor
  const handleRunEvaluation = async () => {
    let jobDescription = customJobText;
    if (!jobDescription) {
      const preset = PRESET_JOBS.find((j) => j.id === selectedJobId);
      jobDescription = preset?.description || '';
    }

    if (!jobDescription) {
      alert('Please select a preset job or paste a job description.');
      return;
    }

    setIsEvaluating(true);
    try {
      // 1. Evaluate Job
      const evalRes = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobText: jobDescription,
          masterProfile: masterProfileText,
          minScore: 70,
        }),
      });

      if (!evalRes.ok) {
        throw new Error('Evaluation request failed');
      }

      const evalData: JobEvaluationData = await evalRes.json();
      setEvaluation(evalData);

      // 2. Generate Tailored Resume and Materials
      const tailorRes = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobText: jobDescription,
          masterProfile: masterProfileText,
          recommendations: evalData.tailoring_recommendations,
          candidateInfo: candidateInfo,
        }),
      });

      if (!tailorRes.ok) {
        throw new Error('Tailoring request failed');
      }

      const tailorData = await tailorRes.json();

      // Update resume state
      setResume({
        full_name: `${candidateInfo.first_name} ${candidateInfo.last_name}`,
        email: candidateInfo.email,
        phone: candidateInfo.phone,
        location: '',
        linkedin: candidateInfo.linkedin,
        tailored_summary: tailorData.tailored_summary,
        skills: tailorData.skills,
        experiences: tailorData.experiences,
        projects: Array.isArray(tailorData.projects) ? tailorData.projects : [],
        education: INITIAL_WEAVER_RESUME.education,
        certifications:
          tailorData.certifications && tailorData.certifications.length > 0
            ? tailorData.certifications
            : INITIAL_WEAVER_RESUME.certifications,
      });

      // Update cover letter
      if (tailorData.cover_letter) {
        setCoverLetter(tailorData.cover_letter);
      }

      // Update screening answers
      if (tailorData.screening_answers) {
        setScreeningAnswers(tailorData.screening_answers);
      }

      // Concurrently fetch interview questions & portal intelligence for the evaluated role
      handleFetchInterviewPrep(evalData.company_name, evalData.job_title, jobDescription);

      setActiveTab('resume');
    } catch (err: any) {
      console.error('Error running evaluation:', err);
      alert('Failed to evaluate with Gemini API. Please check server logs or API key.');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Fetch interview prep questions & answers from portals or role generation
  const handleFetchInterviewPrep = async (company?: string, role?: string, jd?: string) => {
    setIsFetchingInterviewPrep(true);
    try {
      const targetCompany = company || evaluation.company_name;
      const targetRole = role || evaluation.job_title;
      const targetJd = jd || customJobText || `${targetRole} at ${targetCompany}`;

      const res = await fetch('/api/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: targetCompany,
          jobTitle: targetRole,
          company: targetCompany,
          role: targetRole,
          jobDescription: targetJd,
          masterProfile: masterProfileText,
          candidateProfile: masterProfileText,
        }),
      });

      if (!res.ok) {
        throw new Error('Interview prep request failed');
      }

      const data = await res.json();
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        setInterviewQuestions(data.questions);
      }
    } catch (err: any) {
      console.error('Error fetching interview prep:', err);
      alert('Failed to fetch interview questions. Please check server logs or API key.');
    } finally {
      setIsFetchingInterviewPrep(false);
    }
  };

  const currentPreset = PRESET_JOBS.find((j) => j.id === selectedJobId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Universal Top Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownloadPdf={handleDownloadPdf}
        isDownloading={isDownloadingPdf}
        downloadSuccess={downloadSuccess}
        score={evaluation.match_score}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'evaluator' && (
          <JobEvaluatorView
            evaluation={evaluation}
            opportunities={opportunities}
            onAddOpportunities={(newJobs) => setOpportunities((prev) => [...newJobs, ...prev])}
            onSelectPreset={handleSelectPreset}
            selectedJobId={selectedJobId}
            customJobText={customJobText}
            setCustomJobText={setCustomJobText}
            customUrl={customUrl}
            setCustomUrl={setCustomUrl}
            onEvaluate={handleRunEvaluation}
            isLoading={isEvaluating}
            onProceedToResume={() => setActiveTab('resume')}
          />
        )}

        {activeTab === 'resume' && (
          <ResumeDocument
            resume={resume}
            setResume={setResume}
            jobTitle={evaluation.job_title}
            companyName={evaluation.company_name}
            onRegenerateWithAi={handleRunEvaluation}
            isAiGenerating={isEvaluating}
          />
        )}

        {activeTab === 'cover-letter' && (
          <CoverLetterView
            coverLetter={coverLetter}
            candidateName={resume.full_name}
            companyName={evaluation.company_name}
            jobTitle={evaluation.job_title}
          />
        )}

        {activeTab === 'screening' && (
          <ScreeningAnswersView
            screeningAnswers={screeningAnswers}
            candidateInfo={candidateInfo}
            applyUrl={currentPreset?.applyUrl || customUrl}
            companyName={evaluation.company_name}
            jobTitle={evaluation.job_title}
            interviewQuestions={interviewQuestions}
            onFetchInterviewPrep={() => handleFetchInterviewPrep()}
            isFetchingInterviewPrep={isFetchingInterviewPrep}
          />
        )}
      </main>

      {/* Candidate Profile Editor Modal */}
      <CandidateProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        masterProfileText={masterProfileText}
        setMasterProfileText={setMasterProfileText}
        candidateInfo={candidateInfo}
        setCandidateInfo={setCandidateInfo}
      />

      {/* GTM God Styled Footer */}
      <footer className="no-print bg-[#F3F0E9]/80 border-t border-[#D4CDC0] mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5D5A63]">
          <div className="flex items-center gap-2">
            <span className="pill-pixel text-xs py-0.5 px-2">CANDIDATE</span>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="font-bold text-[#141416] hover:text-[#B9831F] cursor-pointer underline decoration-[#B9831F]/40"
            >
              {candidateInfo.first_name} {candidateInfo.last_name}
            </button>
            <span>· Vadakara, Kerala · Revolut Real-Time SME</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="hover:text-[#141416] transition-colors cursor-pointer font-medium"
            >
              Edit Master Profile
            </button>
            <span aria-hidden="true" className="text-[#D4CDC0]">·</span>
            <span className="font-display italic text-[#8E6A24]">Job Studio</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
