/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { CareerRoadmapsView } from './components/CareerRoadmapsView';
import { JobEvaluatorView } from './components/JobEvaluatorView';
import { ResumeDocument } from './components/ResumeDocument';
import { CoverLetterView } from './components/CoverLetterView';
import { ScreeningAnswersView } from './components/ScreeningAnswersView';
import { CandidateProfileModal } from './components/CandidateProfileModal';
import { AppliedJobsView } from './components/AppliedJobsView';
import { PricingView } from './components/PricingView';
import { ProfileBuilderView } from './components/ProfileBuilderView';
import { RecruiterReviewModal, RecruiterPanelData } from './components/RecruiterReviewModal';
import { generatePlainTextResume } from './utils/pdfExport';
import {
  getUserMasterProfile,
  saveUserMasterProfile,
  profileRecordToResume,
  profileRecordToCandidateInfo,
} from './data/candidateProfiles';
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
  AppliedJobRecord,
} from './data/defaultData';
import { downloadResumeAsPdf } from './utils/pdfExport';

const getAppliedJobsKey = (email?: string): string => {
  const clean = (email || '').toLowerCase().trim();
  if (!clean || clean === SUSHMIT_USER_INFO.email.toLowerCase()) {
    return 'jobstudio_applied_jobs_demo';
  }
  return `jobstudio_applied_jobs_${clean}`;
};

const loadUserAppliedJobs = (email?: string): AppliedJobRecord[] => {
  if (typeof window === 'undefined') return [];
  try {
    const key = getAppliedJobsKey(email);
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse applied jobs from localStorage', e);
  }
  return [];
};

const getProUserKey = (email?: string): string => {
  const clean = (email || '').toLowerCase().trim();
  return `jobstudio_is_pro_${clean}`;
};

const getTailoredCountKey = (email?: string): string => {
  const clean = (email || '').toLowerCase().trim();
  return `jobstudio_tailored_count_${clean}`;
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [opportunities, setOpportunities] = useState<JobOpportunity[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [customJobText, setCustomJobText] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<string>('');

  // Authentication & Account State (1 User Account = 1 Master Profile)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jobstudio_logged_in') !== 'false';
    }
    return true;
  });

  const [userName, setUserName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jobstudio_user_name') || 'Sushmit Surendran';
    }
    return 'Sushmit Surendran';
  });

  const [userEmail, setUserEmail] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jobstudio_user_email') || 'sushmit.surendran@revolut.com';
    }
    return 'sushmit.surendran@revolut.com';
  });

  const handleLogin = (name: string, email: string) => {
    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name.trim();
    setIsLoggedIn(true);
    setUserName(cleanName);
    setUserEmail(cleanEmail);
    if (typeof window !== 'undefined') {
      localStorage.setItem('jobstudio_logged_in', 'true');
      localStorage.setItem('jobstudio_user_name', cleanName);
      localStorage.setItem('jobstudio_user_email', cleanEmail);
      // Clean up legacy unscoped key so it never leaks
      localStorage.removeItem('jobstudio_applied_jobs');
    }
    const userProfile = getUserMasterProfile(cleanEmail, cleanName);
    setMasterProfileText(userProfile.masterProfileText);
    setCandidateInfo(profileRecordToCandidateInfo(userProfile));
    setResume(profileRecordToResume(userProfile));

    // Load user-scoped applied jobs
    const userJobs = loadUserAppliedJobs(cleanEmail);
    setAppliedJobs(userJobs);

    // Load user-scoped Pro status & tailored count
    if (cleanEmail === SUSHMIT_USER_INFO.email.toLowerCase()) {
      setIsProUser(true);
    } else {
      const userPro = localStorage.getItem(getProUserKey(cleanEmail));
      setIsProUser(userPro === 'true');
    }
    const userTailored = localStorage.getItem(getTailoredCountKey(cleanEmail));
    setTailoredCount(userTailored ? parseInt(userTailored, 10) : 0);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('jobstudio_logged_in', 'false');
      localStorage.removeItem('jobstudio_user_name');
      localStorage.removeItem('jobstudio_user_email');
      localStorage.removeItem('jobstudio_applied_jobs');
    }
    setUserName('');
    setUserEmail('');
    setAppliedJobs([]);
    setTailoredCount(0);
    setIsProUser(false);
    setCandidateInfo({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
    });
    setMasterProfileText('');
    setResume(INITIAL_WEAVER_RESUME);
    setActiveTab('home');
  };

  const [evaluation, setEvaluation] = useState<JobEvaluationData>(EMPTY_EVALUATION);
  const [resume, setResume] = useState<TailoredResumeData>(() => {
    if (typeof window !== 'undefined') {
      const isLogged = localStorage.getItem('jobstudio_logged_in') === 'true';
      const email = localStorage.getItem('jobstudio_user_email') || '';
      const name = localStorage.getItem('jobstudio_user_name') || '';
      if (isLogged && email) {
        const p = getUserMasterProfile(email, name);
        if (p) return profileRecordToResume(p);
      }
    }
    return INITIAL_WEAVER_RESUME;
  });
  const [coverLetter, setCoverLetter] = useState<CoverLetterData>(EMPTY_COVER_LETTER);
  const [screeningAnswers, setScreeningAnswers] = useState<ScreeningAnswer[]>([]);
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewPrepQuestion[]>([]);
  const [isFetchingInterviewPrep, setIsFetchingInterviewPrep] = useState<boolean>(false);

  const [masterProfileText, setMasterProfileText] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const isLogged = localStorage.getItem('jobstudio_logged_in') === 'true';
      const email = localStorage.getItem('jobstudio_user_email') || '';
      const name = localStorage.getItem('jobstudio_user_name') || '';
      if (isLogged && email) {
        const p = getUserMasterProfile(email, name);
        if (p?.masterProfileText) return p.masterProfileText;
      }
    }
    return '';
  });
  const [candidateInfo, setCandidateInfo] = useState<CandidateInfo>(() => {
    if (typeof window !== 'undefined') {
      const isLogged = localStorage.getItem('jobstudio_logged_in') === 'true';
      const email = localStorage.getItem('jobstudio_user_email') || '';
      const name = localStorage.getItem('jobstudio_user_name') || '';
      if (isLogged && email) {
        const p = getUserMasterProfile(email, name);
        if (p) return profileRecordToCandidateInfo(p);
      }
    }
    return {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
    };
  });

  // Re-sync master profile and user-scoped data across application whenever user account changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Purge legacy unscoped key so it never leaks across accounts
      localStorage.removeItem('jobstudio_applied_jobs');
    }

    if (isLoggedIn && userEmail) {
      const cleanEmail = userEmail.toLowerCase().trim();

      // 1. Master profile sync
      const p = getUserMasterProfile(cleanEmail, userName);
      if (p) {
        setMasterProfileText(p.masterProfileText);
        setCandidateInfo(profileRecordToCandidateInfo(p));
        setResume(profileRecordToResume(p));
      }

      // 2. Applied jobs isolation (strictly scoped to this user)
      const userJobs = loadUserAppliedJobs(cleanEmail);
      setAppliedJobs(userJobs);

      // 3. Pro status & quota isolation
      if (cleanEmail === SUSHMIT_USER_INFO.email.toLowerCase()) {
        setIsProUser(true);
      } else {
        const userPro = localStorage.getItem(getProUserKey(cleanEmail));
        setIsProUser(userPro === 'true');
      }

      const userTailored = localStorage.getItem(getTailoredCountKey(cleanEmail));
      setTailoredCount(userTailored ? parseInt(userTailored, 10) : 0);
    } else if (!isLoggedIn) {
      setAppliedJobs([]);
      setTailoredCount(0);
      setIsProUser(false);
      setCandidateInfo({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
      });
      setMasterProfileText('');
      if (activeTab !== 'home') {
        setActiveTab('home');
      }
    }
  }, [isLoggedIn, userEmail, userName, activeTab]);

  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Pro Subscription & Free Tailoring Quota State (strictly user-scoped)
  const [isProUser, setIsProUser] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const email = (localStorage.getItem('jobstudio_user_email') || '').toLowerCase().trim();
        if (email === SUSHMIT_USER_INFO.email.toLowerCase()) return true;
        return localStorage.getItem(getProUserKey(email)) === 'true';
      } catch {
        return false;
      }
    }
    return false;
  });

  const [tailoredCount, setTailoredCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const email = (localStorage.getItem('jobstudio_user_email') || '').toLowerCase().trim();
        const val = localStorage.getItem(getTailoredCountKey(email));
        return val ? parseInt(val, 10) : 0;
      } catch {
        return 0;
      }
    }
    return 0;
  });

  // Recruiter-Panel Multi-Persona Review State
  const [isRecruiterModalOpen, setIsRecruiterModalOpen] = useState<boolean>(false);
  const [recruiterReviewData, setRecruiterReviewData] = useState<RecruiterPanelData | null>(null);
  const [isLoadingRecruiterReview, setIsLoadingRecruiterReview] = useState<boolean>(false);

  const handleRunRecruiterReview = async () => {
    setIsLoadingRecruiterReview(true);
    try {
      const resumeText = generatePlainTextResume(resume);
      const response = await fetch('/api/recruiter-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobTitle: evaluation.job_title || currentPreset?.title || 'Target Role',
          companyName: evaluation.company_name || currentPreset?.company || 'Target Employer',
          jobDescription: customJobText || currentPreset?.description || '',
        }),
      });
      const data = await response.json();
      if (data.success) {
        setRecruiterReviewData(data);
      }
    } catch (err) {
      console.error('Error running recruiter review:', err);
    } finally {
      setIsLoadingRecruiterReview(false);
    }
  };

  const handleUpgradeToPro = () => {
    setIsProUser(true);
    if (typeof window !== 'undefined' && userEmail) {
      try {
        localStorage.setItem(getProUserKey(userEmail), 'true');
      } catch {}
    }
  };

  const handleDowngradeToFree = () => {
    setIsProUser(false);
    if (typeof window !== 'undefined' && userEmail) {
      try {
        localStorage.setItem(getProUserKey(userEmail), 'false');
      } catch {}
    }
  };

  // Applied Jobs Tracking State with localStorage Persistence (strictly user-scoped)
  const [appliedJobs, setAppliedJobs] = useState<AppliedJobRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('jobstudio_user_email') || '';
      return loadUserAppliedJobs(email);
    }
    return [];
  });

  // Sync applied jobs to user-scoped localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && userEmail) {
      try {
        const key = getAppliedJobsKey(userEmail);
        localStorage.setItem(key, JSON.stringify(appliedJobs));
        // Ensure legacy global key is wiped
        localStorage.removeItem('jobstudio_applied_jobs');
      } catch (e) {
        console.error('Failed to save applied jobs to localStorage', e);
      }
    }
  }, [appliedJobs, userEmail]);

  const handleAddAppliedJob = (jobData: Omit<AppliedJobRecord, 'id' | 'created_at'>) => {
    const newRecord: AppliedJobRecord = {
      ...jobData,
      id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: Date.now(),
    };
    setAppliedJobs((prev) => [newRecord, ...prev]);
  };

  const handleUpdateAppliedJob = (id: string, updates: Partial<AppliedJobRecord>) => {
    setAppliedJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...updates } : j)));
  };

  const handleDeleteAppliedJob = (id: string) => {
    setAppliedJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const handleClearAllAppliedJobs = () => {
    setAppliedJobs([]);
  };

  const isCurrentJobTracked = Boolean(
    evaluation.company_name &&
    evaluation.job_title &&
    appliedJobs.some(
      (j) =>
        j.company_name.toLowerCase() === evaluation.company_name.toLowerCase() &&
        j.job_title.toLowerCase() === evaluation.job_title.toLowerCase()
    )
  );

  const handleTrackCurrentJob = (customData?: {
    company_name?: string;
    job_title?: string;
    location?: string;
    platform?: string;
    apply_url?: string;
    match_score?: number;
  }) => {
    const company = customData?.company_name || evaluation.company_name;
    const title = customData?.job_title || evaluation.job_title;
    if (!company || !title) return;

    const existingIndex = appliedJobs.findIndex(
      (j) =>
        j.company_name.toLowerCase() === company.toLowerCase() &&
        j.job_title.toLowerCase() === title.toLowerCase()
    );

    if (existingIndex >= 0) {
      const updated = [...appliedJobs];
      updated[existingIndex] = {
        ...updated[existingIndex],
        status: 'Applied',
        applied_date: new Date().toISOString().split('T')[0],
        apply_url: customData?.apply_url || customUrl || updated[existingIndex].apply_url,
      };
      setAppliedJobs(updated);
    } else {
      const newRecord: AppliedJobRecord = {
        id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        company_name: company,
        job_title: title,
        location: customData?.location || evaluation.location_info || 'Remote / Hybrid',
        platform: customData?.platform || 'Direct Portal',
        apply_url: customData?.apply_url || customUrl || undefined,
        applied_date: new Date().toISOString().split('T')[0],
        match_score: customData?.match_score || evaluation.match_score || 90,
        status: 'Applied',
        created_at: Date.now(),
      };
      setAppliedJobs((prev) => [newRecord, ...prev]);
    }
  };

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
        gaps: [
          {
            missing: 'Aerospace Defense Procurement Frameworks (ITAR, EAR, FAR)',
            where_to_work: 'Review Export Administration Regulations (EAR) and ITAR checkpoints for third-party screening. Frame Revolut fraud mitigation and dispute escalation as equivalent high-consequence compliance adherence.',
            severity: 'CRITICAL',
          },
          {
            missing: 'Formal ISO 9001 / AS9100 Quality Audits',
            where_to_work: 'Position Revolut quarterly Confluence SOP audits, defect elimination, and Jove SQL investigation as direct evidence of quality governance.',
            severity: 'MODERATE',
          },
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
      
      const titleLow = (found.title || '').toLowerCase();
      const catLow = (found.category || '').toLowerCase();
      const descLow = (found.description || '').toLowerCase();
      const combined = `${titleLow} ${catLow} ${descLow}`;

      const isB2B = combined.includes('merchant') || combined.includes('b2b') || combined.includes('payment') || combined.includes('acquiring') || combined.includes('client delivery');
      const isFinCrime = combined.includes('fincrime') || combined.includes('financial crime') || combined.includes('dispute') || combined.includes('fraud') || combined.includes('aml');
      const isIncident = catLow.includes('incident') || titleLow.includes('incident') || combined.includes('incident');
      const isWfm = catLow.includes('real-time') || titleLow.includes('workforce') || titleLow.includes('wfm') || combined.includes('queue balancing');
      const isProdOps = catLow.includes('product') || titleLow.includes('product') || combined.includes('product ops');
      const isLowMatch = (found.matchScore || 0) < 60;

      // Calibrate Revolut Merchant role to 88% so preliminary score matches deep AI evaluation exactly
      const calibratedMatchScore =
        titleLow.includes('merchant') && (found.company?.toLowerCase().includes('revolut') || combined.includes('revolut'))
          ? 88
          : (found.matchScore || 85);

      const verdictFinal =
        calibratedMatchScore >= 85
          ? 'STRONG_APPLY'
          : calibratedMatchScore >= 70
          ? 'APPLY'
          : calibratedMatchScore >= 55
          ? 'CONSIDER'
          : 'SKIP';
      
      // Pre-populate evaluation preview dynamically based on role's true domain
      setEvaluation({
        job_title: found.title,
        company_name: found.company,
        match_score: calibratedMatchScore,
        should_apply: calibratedMatchScore >= 70,
        verdict: verdictFinal,
        key_matching_factors: isLowMatch
          ? [
              'Core business analysis skills, process mapping capability, and analytical problem-solving foundation.',
              'Experience in cross-functional stakeholder communication and documentation.',
            ]
          : isB2B
          ? [
              'Internal candidate currently at Revolut with hands-on expertise in SLA management and operational incident triage.',
              'Proven experience managing enterprise B2B client lifecycles, SOWs, and delivery operations at Torc Infotech.',
              'Direct experience in multi-currency billing reconciliations across INR, USD, AED, and EUR.',
              'Strong technical background in SQL (Jove platform), Looker, Metabase, and payment dispute resolution logic.',
            ]
          : isFinCrime
          ? [
              'Revolut financial operations expertise in dispute resolutions, fraud risk mitigation, and compliance audit trails.',
              'Certified in SC-900 compliance with deep experience in operational audit trails and governance.',
              'Proven ability to investigate transactional anomalies using SQL and Looker dashboards.',
            ]
          : [
              found.matchHighlight,
              'Direct experience monitoring dynamic queues and balancing frontline capacity.',
              'Advanced analytics proficiency using SQL (Jove), Looker, Metabase, and Excel.',
            ],
        missing_critical_skills: [
          isLowMatch
            ? (found.matchHighlight || 'Target role requires specialized software systems, domain certifications, or years of dedicated tooling outside verified profile.')
            : isB2B
            ? 'Revolut Business payment gateway integration specs, merchant acquiring operational workflows, and commercial API checkout testing.'
            : isFinCrime
            ? 'Card scheme dispute reason codes (Visa/Mastercard) and formal regulatory AML investigation documentation.'
            : isIncident
            ? 'Enterprise ITIL 4 Service Value System certification and major outage post-mortem RCA documentation.'
            : isWfm
            ? 'Long-range Erlang-C capacity modeling and telephonic ACD routing integration.'
            : isProdOps
            ? 'Deep telemetry instrumentation (Datadog/Snowflake) and sprint-level engineering defect triage.'
            : 'Operational process modeling, cross-functional SLA governance, and automated workflow monitoring.',
        ],
        gaps: [
          {
            missing: isLowMatch
              ? 'Specialized Domain Tooling / Dedicated Implementation Credentials'
              : isB2B
              ? 'Revolut Business Payment Gateway & Merchant Acquiring Workflows'
              : isFinCrime
              ? 'AML Transaction Monitoring & Card Scheme Dispute Arbitration'
              : isIncident
              ? 'Enterprise ITIL 4 Service Value System & Outage Post-Mortems'
              : isWfm
              ? 'Long-Range Erlang-C Workforce Capacity Modeling'
              : isProdOps
              ? 'Deep Telemetry Instrumentation (Datadog/Snowflake)'
              : 'Continuous Process Optimization & SLA Governance',
            where_to_work: isLowMatch
              ? (found.matchHighlight || 'Evaluate whether your core skills transfer, or focus on roles directly matching your operations, WFM, and compliance background.')
              : isB2B
              ? 'Review internal Revolut Business API docs, gateway checkout flows, and merchant onboarding SOPs via internal knowledge bases.'
              : isFinCrime
              ? 'Study anti-money laundering red flag topologies, chargeback reason codes, and compliance investigation audit trails.'
              : isIncident
              ? 'Study ITIL 4 incident lifecycle fundamentals and emphasize Revolut incident bridge leadership and Slack workflow automation.'
              : isWfm
              ? 'Build spreadsheet models for Erlang-C staffing variance and emphasize Revolut live queue balancing across 1,000+ agents.'
              : isProdOps
              ? 'Build a sample telemetry tracking dashboard and highlight Jove SQL queue loop elimination.'
              : 'Highlight Torc Infotech 32-person-month capacity scoping and structured process improvement models.',
            severity: isLowMatch ? 'CRITICAL' : 'MODERATE',
          },
        ],
        tailoring_recommendations: isB2B
          ? [
              'Highlight B2B client account management experience from Torc Infotech, specifically pointing out multi-currency billing reconciliations.',
              'Emphasize current Revolut internal knowledge, SLA tracking metrics, and Real-Time queue monitoring operational successes.',
              'Detail your chargebacks and card scheme dispute resolution background to demonstrate payment domain authority.',
              'Position your SQL and analytics skills as tools for identifying B2B merchant transaction defects and automated reconciliation.',
            ]
          : isFinCrime
          ? [
              'Emphasize fraud anomaly detection, chargeback arbitration, and compliance controls.',
              'Highlight SC-900 compliance certification and regulatory investigation experience.',
              'Detail data-driven reporting in SQL, Looker, and Metabase.',
            ]
          : [
              'Align accomplishment metrics with the specific product domain and scale.',
              'Emphasize cross-functional incident mitigation and process automation workflows.',
            ],
        location_info: found.location,
        executive_summary: isB2B
          ? `Sushmit is an ideal internal applicant for the Merchant & B2B Operations Specialist role at Revolut. He combines current Revolut operational mastery (SLA monitoring, SQL analysis, incident triage) with previous B2B client delivery and multi-currency billing experience from Torc Infotech. Candidate profile represents an estimated ${calibratedMatchScore}% qualification overlap.`
          : `${found.matchHighlight} Candidate profile represents an estimated ${calibratedMatchScore}% qualification overlap.`,
        skill_roadmap: isB2B
          ? [
              {
                skill: 'B2B Payment Gateway Integration & Merchant Operations',
                action_plan: 'Master merchant onboarding workflows, API webhook testing, and multi-currency settlement reconciliations.',
                recommended_certification: 'Certified Payments Professional (CPP)',
                certification_provider: 'Electronic Transactions Association (ETA)',
                timeline: '2–3 weeks',
                importance: 'RECOMMENDED',
                practical_project: 'Map an end-to-end B2B merchant acquiring workflow documenting dispute handling and settlement timing.',
              },
              {
                skill: 'Enterprise Client Account Management & SLA Governance',
                action_plan: 'Structure multi-currency variance reconciliations and establish high-value SLA reporting cadence.',
                recommended_certification: 'Certified Client Success Manager (CCSM)',
                certification_provider: 'SuccessHACKER',
                timeline: '2 weeks',
                importance: 'RECOMMENDED',
                practical_project: 'Draft an enterprise client escalation playbook covering multi-currency reconciliations across USD, EUR, GBP, and INR.',
              },
            ]
          : isFinCrime
          ? [
              {
                skill: 'AML Regulatory Investigation & Transaction Monitoring',
                action_plan: 'Master AML typologies, suspicious activity report (SAR) filing logic, and sanctions screening frameworks.',
                recommended_certification: 'Certified Anti-Money Laundering Specialist (CAMS)',
                certification_provider: 'ACAMS',
                timeline: '3–4 weeks',
                importance: 'RECOMMENDED',
                practical_project: 'Construct an anomaly detection rule-set for flagging high-velocity peer-to-peer card transactions.',
              },
              {
                skill: 'Card Payment Scheme Dispute Arbitration (Visa/Mastercard)',
                action_plan: 'Learn chargeback dispute reason codes, pre-arbitration evidence submission, and fraud mitigation SOPs.',
                recommended_certification: 'Card Schemes Dispute Management Certification',
                certification_provider: 'Mastercard Academy / Visa School',
                timeline: '2 weeks',
                importance: 'RECOMMENDED',
                practical_project: 'Build a fraud dispute decision-tree mapping evidence requirements for unauthorized transaction claims.',
              },
            ]
          : isIncident
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
                skill: 'Lean Six Sigma Process Optimization & DMAIC',
                action_plan: 'Apply DMAIC framework to identify process bottlenecks, reduce operational cycle times, and eliminate defects.',
                recommended_certification: 'Lean Six Sigma Green Belt (LSSGB)',
                certification_provider: 'ASQ / IASSC',
                timeline: '3–4 weeks',
                importance: 'RECOMMENDED',
                practical_project: 'Map an operational workflow with quantifiable cycle-time savings and automated variance alerts.',
              },
              {
                skill: 'Operational Governance & Requirements Engineering',
                action_plan: 'Master business analysis documentation, SLA governance metrics, and cross-functional exception handling.',
                recommended_certification: 'Certified Business Analysis Professional (CBAP)',
                certification_provider: 'IIBA',
                timeline: '3–4 weeks',
                importance: 'RECOMMENDED',
                practical_project: 'Draft an operational SLA matrix with root cause analysis guidelines and escalation triggers.',
              },
            ],
        recommended_certifications: isB2B
          ? [
              {
                name: 'Certified Payments Professional (CPP)',
                issuer: 'Electronic Transactions Association (ETA)',
                target_skill: 'Merchant operations, acquiring workflows & payment gateway API specs',
                estimated_time: '2–3 weeks',
                why_it_helps: 'High-value ATS qualification for fintech merchant and B2B operational scaling.',
                difficulty: 'Intermediate',
              },
              {
                name: 'B2B Client Relationship & Account Governance',
                issuer: 'SuccessHACKER',
                target_skill: 'Multi-currency account management, SLA metrics & delivery integrity',
                estimated_time: '2 weeks',
                why_it_helps: 'Proves client lifecycle ownership and revenue retention capabilities.',
                difficulty: 'Beginner',
              },
            ]
          : isFinCrime
          ? [
              {
                name: 'Certified Anti-Money Laundering Specialist (CAMS)',
                issuer: 'ACAMS',
                target_skill: 'Regulatory screening, AML red flags & dispute investigation',
                estimated_time: '3–4 weeks',
                why_it_helps: 'Industry benchmark for financial crime operations and dispute integrity.',
                difficulty: 'Intermediate',
              },
              {
                name: 'SC-900: Security, Compliance, and Identity Fundamentals',
                issuer: 'Microsoft',
                target_skill: 'Access control, audit trails & digital regulatory compliance',
                estimated_time: '1–2 weeks',
                why_it_helps: 'Direct proof of compliance controls and access governance.',
                difficulty: 'Beginner',
              },
            ]
          : isIncident
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
                name: 'Lean Six Sigma Green Belt (LSSGB)',
                issuer: 'ASQ / IASSC',
                target_skill: 'Root-cause analysis, defect reduction, DMAIC process re-engineering',
                estimated_time: '3–4 weeks',
                why_it_helps: 'Offers strong proof of candidate process improvement and defect elimination capability.',
                difficulty: 'Intermediate',
              },
              {
                name: 'Certified Business Analysis Professional (CBAP)',
                issuer: 'IIBA',
                target_skill: 'Requirements analysis, operational mapping, process governance',
                estimated_time: '3–4 weeks',
                why_it_helps: 'Validates business analysis capability across complex enterprise environments.',
                difficulty: 'Intermediate',
              },
            ],
      });
    }
  };

  // Remove a specific opportunity from active view
  const handleRemoveOpportunity = (jobId: string) => {
    setOpportunities((prev) => prev.filter((j) => j.id !== jobId));
    if (selectedJobId === jobId) {
      setSelectedJobId('');
      setCustomJobText('');
      setCustomUrl('');
      setEvaluation(EMPTY_EVALUATION);
      setResume(MASTER_BASE_RESUME);
      setCoverLetter(EMPTY_COVER_LETTER);
      setScreeningAnswers([]);
      setInterviewQuestions([]);
    }
  };

  // Clear all opportunities to start completely clean
  const handleClearAllOpportunities = () => {
    setOpportunities([]);
    setSelectedJobId('');
    setCustomJobText('');
    setCustomUrl('');
    setEvaluation(EMPTY_EVALUATION);
    setResume(MASTER_BASE_RESUME);
    setCoverLetter(EMPTY_COVER_LETTER);
    setScreeningAnswers([]);
    setInterviewQuestions([]);
  };

  // Call Gemini backend to evaluate & tailor
  const handleRunEvaluation = async (overrideJobText?: string) => {
    let jobDescription = typeof overrideJobText === 'string' && overrideJobText.trim()
      ? overrideJobText.trim()
      : customJobText;
    if (!jobDescription) {
      const preset = PRESET_JOBS.find((j) => j.id === selectedJobId);
      jobDescription = preset?.description || '';
    }

    if (!jobDescription) {
      alert('Please select a preset job or paste a job description.');
      return;
    }

    // Enforce 2 free tailored resumes limit for Free tier
    if (!isProUser && tailoredCount >= 2) {
      if (
        confirm(
          'You have reached your monthly limit of 2 free tailored resumes.\n\nUpgrade to Pro for $9.99/mo to unlock unlimited AI resume tailoring, full interview prep intelligence, and clean PDF exports.\n\nWould you like to view plans?'
        )
      ) {
        setActiveTab('pricing');
      }
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

      // Immediately synchronize the evaluated score & summary back to the saved opportunity card
      if (selectedJobId) {
        setOpportunities((prev) =>
          prev.map((opp) =>
            opp.id === selectedJobId
              ? {
                  ...opp,
                  matchScore: evalData.match_score,
                  matchHighlight:
                    evalData.executive_summary?.slice(0, 160) ||
                    (evalData.key_matching_factors?.[0] ? `Assessment: ${evalData.key_matching_factors[0]}` : opp.matchHighlight),
                }
              : opp
          )
        );
      }

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

      // Increment tailored resume count for free users
      if (!isProUser) {
        setTailoredCount((prev) => {
          const next = prev + 1;
          if (typeof window !== 'undefined' && userEmail) {
            try {
              localStorage.setItem(getTailoredCountKey(userEmail), next.toString());
            } catch {}
          }
          return next;
        });
      }

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
      {/* Top Bar Navigation: Only visible when user logs in */}
      {isLoggedIn && (
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onDownloadPdf={handleDownloadPdf}
          isDownloading={isDownloadingPdf}
          downloadSuccess={downloadSuccess}
          score={evaluation.match_score}
          appliedCount={appliedJobs.length}
          isProUser={isProUser}
          tailoredCount={tailoredCount}
          isLoggedIn={isLoggedIn}
          userName={userName}
          onOpenAuthModal={() => setActiveTab('home')}
          onLogout={handleLogout}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(activeTab === 'home' || activeTab === 'auth') && (
          <HomeView
            onNavigateToTab={setActiveTab}
            isProUser={isProUser}
            onUpgradeToPro={handleUpgradeToPro}
            tailoredCount={tailoredCount}
            isLoggedIn={isLoggedIn}
            userName={userName}
            userEmail={userEmail}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        )}

        {activeTab === 'roadmaps' && (
          <CareerRoadmapsView
            userEmail={userEmail}
            onSelectRoleForJobs={(roleTitle) => {
              setCustomJobText(`Target Role: ${roleTitle}`);
              setActiveTab('evaluator');
            }}
            onSelectRoleForResume={(roleTitle) => {
              setEvaluation((prev) => ({
                ...prev,
                job_title: roleTitle,
              }));
              setActiveTab('resume');
            }}
            masterProfileText={masterProfileText}
            isProUser={isProUser}
            onNavigateToPricing={() => setActiveTab('pricing')}
          />
        )}

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
            onRemoveOpportunity={handleRemoveOpportunity}
            onClearOpportunities={handleClearAllOpportunities}
            onTrackApplication={handleTrackCurrentJob}
            isTracked={isCurrentJobTracked}
            isProUser={isProUser}
            tailoredCount={tailoredCount}
            onNavigateToPricing={() => setActiveTab('pricing')}
            onOpenRecruiterReview={() => {
              setIsRecruiterModalOpen(true);
              if (!recruiterReviewData) {
                handleRunRecruiterReview();
              }
            }}
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
            onOpenRecruiterReview={() => {
              setIsRecruiterModalOpen(true);
              if (!recruiterReviewData) {
                handleRunRecruiterReview();
              }
            }}
            isProUser={isProUser}
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
            jobDescription={customJobText || currentPreset?.description || ''}
            masterProfileText={masterProfileText}
            interviewQuestions={interviewQuestions}
            onFetchInterviewPrep={() => handleFetchInterviewPrep()}
            isFetchingInterviewPrep={isFetchingInterviewPrep}
            onTrackApplication={() => handleTrackCurrentJob()}
            isTracked={isCurrentJobTracked}
            onAddScreeningAnswer={(newAns) => setScreeningAnswers((prev) => [newAns, ...prev])}
            onRemoveScreeningAnswer={(idx) =>
              setScreeningAnswers((prev) => prev.filter((_, i) => i !== idx))
            }
            isProUser={isProUser}
            onNavigateToPricing={() => setActiveTab('pricing')}
          />
        )}

        {activeTab === 'applied' && (
          <AppliedJobsView
            appliedJobs={appliedJobs}
            onAddJob={handleAddAppliedJob}
            onUpdateJob={handleUpdateAppliedJob}
            onDeleteJob={handleDeleteAppliedJob}
            onClearAllJobs={handleClearAllAppliedJobs}
            onSelectForTailoring={(job) => {
              setEvaluation((prev) => ({
                ...prev,
                job_title: job.job_title,
                company_name: job.company_name,
                match_score: job.match_score || 90,
                location_info: job.location,
              }));
              setActiveTab('resume');
            }}
            onViewScreening={(job) => {
              setEvaluation((prev) => ({
                ...prev,
                job_title: job.job_title,
                company_name: job.company_name,
                match_score: job.match_score || 90,
                location_info: job.location,
              }));
              if (job.apply_url) setCustomUrl(job.apply_url);
              setActiveTab('screening');
            }}
          />
        )}

        {activeTab === 'pricing' && (
          <PricingView
            isProUser={isProUser}
            onUpgradeToPro={handleUpgradeToPro}
            onDowngradeToFree={handleDowngradeToFree}
            tailoredCount={tailoredCount}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileBuilderView
            currentProfileText={masterProfileText}
            setMasterProfileText={setMasterProfileText}
            candidateInfo={candidateInfo}
            setCandidateInfo={setCandidateInfo}
            resume={resume}
            setResume={setResume}
            userName={userName}
            setUserName={setUserName}
            userEmail={userEmail}
            setUserEmail={setUserEmail}
            isLoggedIn={isLoggedIn}
            onLogin={handleLogin}
            onNavigateToTab={setActiveTab}
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

      {/* Recruiter-Panel Multi-Persona Review Modal */}
      <RecruiterReviewModal
        isOpen={isRecruiterModalOpen}
        onClose={() => setIsRecruiterModalOpen(false)}
        reviewData={recruiterReviewData}
        isLoading={isLoadingRecruiterReview}
        onRunReview={handleRunRecruiterReview}
        jobTitle={evaluation.job_title || currentPreset?.title || 'Target Role'}
        companyName={evaluation.company_name || currentPreset?.company || 'Target Employer'}
        isProUser={isProUser}
        onNavigateToPricing={() => setActiveTab('pricing')}
      />

      {/* Footer */}
      <footer className="no-print bg-[#F3F0E9]/80 border-t border-[#D4CDC0] mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5D5A63]">
          {isLoggedIn && (candidateInfo.first_name || userName) ? (
            <>
              <div className="flex items-center gap-2">
                <span className="pill-pixel text-xs py-0.5 px-2">MASTER PROFILE</span>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="font-bold text-[#141416] hover:text-[#0071E3] transition-colors cursor-pointer underline decoration-[#0071E3]/40"
                  title="Click to View or Edit Master Profile"
                >
                  {candidateInfo.first_name || userName.split(' ')[0]} {candidateInfo.last_name || userName.split(' ').slice(1).join(' ')}
                </button>
                <span>· {candidateInfo.location || 'Remote'} · {evaluation.job_title || 'Active Profile'}</span>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <button
                  onClick={() => setActiveTab('profile')}
                  className="hover:text-[#0071E3] transition-colors cursor-pointer font-medium text-[#1D1D1F]"
                >
                  View / Edit Master Profile
                </button>
                <span aria-hidden="true" className="text-[#D4CDC0]">·</span>
                <span className="font-display italic text-[#8E6A24]">Job Studio</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-xs text-[#86868B]">
                <span className="font-semibold text-[#1D1D1F]">Job Studio</span>
                <span>· Autonomous Career Workspace &amp; Ground-Truth ATS Optimization</span>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="font-display italic text-[#8E6A24]">Job Studio</span>
              </div>
            </>
          )}
        </div>
      </footer>
    </div>
  );
}
