// @ts-nocheck -- ported verbatim from the original project
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WorkspaceNavigation } from './components/WorkspaceNavigation';
import { HomeView } from './components/HomeView';
import { AuthView } from './components/AuthView';
import { supabase } from '@/integrations/supabase/client';
import { installCloudSync, startCloudSession, endCloudSession } from './utils/cloudSync';
import { CinematicHome } from './components/CinematicHome';
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
  DEMO_PROFILE_TEXT,
  DEMO_USER_INFO,
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
import { applyJobUpdate, withCreatedEvent, withNewResumeVersion } from './data/applicationHistory';
import { downloadResumeAsPdf } from './utils/pdfExport';

const getAppliedJobsKey = (email?: string): string => {
  const clean = (email || '').toLowerCase().trim();
  if (!clean) {
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
      return localStorage.getItem('jobstudio_logged_in') === 'true';
    }
    return false;
  });

  const [userName, setUserName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jobstudio_user_name') || '';
    }
    return '';
  });

  const [userEmail, setUserEmail] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jobstudio_user_email') || '';
    }
    return '';
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
    const userPro = localStorage.getItem(getProUserKey(cleanEmail));
    setIsProUser(userPro === 'true');
    const userTailored = localStorage.getItem(getTailoredCountKey(cleanEmail));
    setTailoredCount(userTailored ? parseInt(userTailored, 10) : 0);
  };

  const handleLogout = () => {
    void endCloudSession().then(() => supabase.auth.signOut());
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

  // Real accounts (Lovable Cloud): restore saved data on sign-in, keep browser state in sync with the session.
  const handleLoginRef = React.useRef(handleLogin);
  handleLoginRef.current = handleLogin;

  // Returning to the Job Evaluator from the tailored resume lands on the evaluation
  // card (match, gaps, Recruiter Panel Review / View Resume) instead of the top of the tab.
  const prevTabRef = React.useRef(activeTab);
  React.useEffect(() => {
    const prev = prevTabRef.current;
    prevTabRef.current = activeTab;
    if (activeTab === 'evaluator' && prev === 'resume' && evaluation.match_score > 0) {
      requestAnimationFrame(() => {
        document.getElementById('evaluation-summary')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [activeTab]);
  useEffect(() => {
    installCloudSync();
    let lastUserId: string | null = null;
    const apply = async (session: any) => {
      const user = session?.user;
      if (!user) {
        if (lastUserId !== null || localStorage.getItem('jobstudio_logged_in') === 'true') {
          lastUserId = null;
          await endCloudSession();
          setIsLoggedIn(false);
          localStorage.setItem('jobstudio_logged_in', 'false');
          localStorage.removeItem('jobstudio_user_name');
          localStorage.removeItem('jobstudio_user_email');
        }
        return;
      }
      if (user.id === lastUserId) return;
      lastUserId = user.id;
      await startCloudSession(user.id);
      const name = user.user_metadata?.full_name || user.user_metadata?.name || (user.email || '').split('@')[0];
      handleLoginRef.current(name, user.email || '');
    };
    supabase.auth.getSession().then(({ data }) => apply(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        setTimeout(() => apply(session), 0);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

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
      const userPro = localStorage.getItem(getProUserKey(cleanEmail));
      setIsProUser(userPro === 'true');

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
      if (activeTab !== 'home' && activeTab !== 'auth') {
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
    const newRecord: AppliedJobRecord = withCreatedEvent({
      ...jobData,
      id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: Date.now(),
    });
    setAppliedJobs((prev) => [newRecord, ...prev]);
  };

  const handleUpdateAppliedJob = (id: string, updates: Partial<AppliedJobRecord>) => {
    setAppliedJobs((prev) => prev.map((j) => (j.id === id ? applyJobUpdate(j, updates) : j)));
  };

  // Save the current tailored resume as an immutable, labelled version on an application
  const handleSaveResumeVersion = (jobId: string, resumeSnapshot: TailoredResumeData) => {
    setAppliedJobs((prev) =>
      prev.map((j) => (j.id === jobId ? withNewResumeVersion(j, resumeSnapshot, j.match_score) : j))
    );
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
      updated[existingIndex] = applyJobUpdate(updated[existingIndex], {
        status: 'Applied',
        applied_date: new Date().toISOString().split('T')[0],
        apply_url: customData?.apply_url || customUrl || updated[existingIndex].apply_url,
      });
      setAppliedJobs(updated);
    } else {
      const newRecord: AppliedJobRecord = withCreatedEvent({
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
      });
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
  const handleSelectPreset = (jobId: string, jobOverride?: JobOpportunity) => {
    // If clicking the currently selected job or clearing, return to plain state
    if (!jobId || (jobId === selectedJobId && !jobOverride)) {
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
    const found = jobOverride ?? opportunities.find((j) => j.id === jobId);
    if (!found) return;

    if (jobId === 'weaver-senior-associate') {
      setCustomJobText(found.description);
      setCustomUrl(found.applyUrl);
      setEvaluation(INITIAL_WEAVER_EVALUATION);
      setResume(INITIAL_WEAVER_RESUME);
      setCoverLetter(INITIAL_WEAVER_COVER_LETTER);
      setScreeningAnswers(INITIAL_SCREENING_ANSWERS);
      setInterviewQuestions(INITIAL_INTERVIEW_PREP_QUESTIONS);
    } else {
      setCustomJobText(found.description);
      setCustomUrl(found.applyUrl);
      const score = found.matchScore || 85;
      const verdict = score >= 80 ? 'STRONG_APPLY' : score >= 65 ? 'MODERATE_APPLY' : 'CONSIDER_CAREFULLY';
      setEvaluation({
        job_title: found.title,
        company_name: found.company,
        match_score: score,
        should_apply: score >= 65,
        verdict: verdict,
        key_matching_factors: [
          `Strong background alignment with ${found.title} core responsibilities.`,
          `Demonstrated track record in high-impact execution and team leadership.`,
          `Analytical problem solving and process optimization relevant to ${found.company}.`,
          `Clear domain knowledge and technical toolset match for key job requirements.`,
        ],
        missing_critical_skills: score < 85 ? [
          `Specialized domain tooling or platform certifications specific to ${found.company}.`
        ] : [],
        gaps: [
          {
            missing: `Advanced ${found.title} industry benchmarks and tooling`,
            where_to_work: `Highlight relevant transferable accomplishments, metrics, and quantitative achievements in your tailored resume.`,
            severity: score < 75 ? 'CRITICAL' : 'MODERATE',
          },
        ],
        tailoring_recommendations: [
          `Directly mirror key keywords from the ${found.title} description into your experience bullets.`,
          `Emphasize quantifiable business outcomes, efficiencies gained, and metric-backed results.`,
          `Structure career highlights using the STAR methodology (Situation, Task, Action, Result).`,
        ],
        location_info: found.location,
        executive_summary: `${found.matchHighlight || `Candidate profile represents an estimated ${score}% qualification match for ${found.title} at ${found.company}.`}`,
        skill_roadmap: [
          {
            skill: `${found.title} Core Domain & Methodologies`,
            action_plan: `Deepen expertise in enterprise workflows, industry standards, and tooling relevant to ${found.company}.`,
            recommended_certification: `Professional Certification in ${found.category || found.title}`,
            certification_provider: 'Industry Accredited Institute',
            timeline: '2–3 weeks',
            importance: 'RECOMMENDED',
            practical_project: `Build a portfolio project demonstrating hands-on proficiency in core requirements for ${found.title}.`,
          },
        ],
        recommended_certifications: [
          {
            name: `Professional Certificate in ${found.category || 'Operations & Systems'}`,
            issuer: 'Industry Recognized Board',
            target_skill: 'Process optimization, domain leadership, and data analysis',
            estimated_time: '2–3 weeks',
            why_it_helps: `Validates professional mastery for ${found.company} hiring managers.`,
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

      // Stay on the Job Evaluator after tailoring — the user opens the tailored resume
      // themselves via "View Resume".
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
    <div className={`min-h-screen text-foreground flex flex-col font-sans ${activeTab !== 'home' && activeTab !== 'auth' ? 'job-workspace' : ''}`}>
      {/* Top Bar Navigation: only on the auth screen; the signed-in landing page stays clean */}
      {isLoggedIn && activeTab === 'auth' && (
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
      {isLoggedIn && activeTab === 'home' && (
        <div className="fixed top-4 right-4 z-50 no-print">
          <button type="button" onClick={() => setActiveTab('evaluator')} aria-label="Back to workspace" className="rounded-full border border-border bg-card/80 backdrop-blur px-4 py-2 text-sm text-foreground hover:bg-card transition-colors">
            Back to workspace
          </button>
        </div>
      )}

      {isLoggedIn && activeTab !== 'home' && activeTab !== 'auth' && <WorkspaceNavigation
        activeTab={activeTab} setActiveTab={setActiveTab} appliedCount={appliedJobs.length}
        userName={userName} isProUser={isProUser} tailoredCount={tailoredCount}
        onLogout={handleLogout} onDownloadPdf={handleDownloadPdf}
        isDownloading={isDownloadingPdf} downloadSuccess={downloadSuccess}
      />}

      {/* Main Content Area */}
      <main className={`flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 ${activeTab !== 'home' && activeTab !== 'auth' ? 'workspace-main' : ''}`}>
        {activeTab === 'auth' && (
          <>
            <button type="button" onClick={() => { setActiveTab('home'); window.scrollTo(0, 0); }} className="cine-link">Back to Job Studio</button>
            <AuthView onLogin={() => setActiveTab('auth')} onNavigateToTab={setActiveTab} />
          </>
        )}

        {activeTab === 'home' && (
          <>
          <CinematicHome onNavigateToTab={(tab) => { setActiveTab(tab); window.scrollTo(0, 0); }} />
          <HomeView
            onNavigateToTab={setActiveTab}
            isProUser={isProUser}
            onUpgradeToPro={handleUpgradeToPro}
            tailoredCount={tailoredCount}
            isLoggedIn={isLoggedIn}
            userName={userName}
            userEmail={userEmail}
            onLogin={() => setActiveTab('auth')}
            onLogout={handleLogout}
          />
          </>
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
            masterProfileText={masterProfileText}
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
            currentResume={resume}
            onSaveResumeVersion={handleSaveResumeVersion}
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
            onLogin={() => setActiveTab('auth')}
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
      <footer className="no-print bg-card border-t border-border mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          {isLoggedIn && activeTab !== 'home' && (candidateInfo.first_name || userName) ? (
            <>
              <div className="flex items-center gap-2">
                <span className="pill-pixel text-xs py-0.5 px-2">MASTER PROFILE</span>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="font-bold text-foreground hover:text-brand transition-colors cursor-pointer underline decoration-brand/40"
                  title="Click to View or Edit Master Profile"
                >
                  {candidateInfo.first_name || userName.split(' ')[0]} {candidateInfo.last_name || userName.split(' ').slice(1).join(' ')}
                </button>
                <span>· {candidateInfo.location || 'Remote'} · {evaluation.job_title || 'Active Profile'}</span>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <button
                  onClick={() => setActiveTab('profile')}
                  className="hover:text-brand transition-colors cursor-pointer font-medium text-foreground"
                >
                  View / Edit Master Profile
                </button>
                <span aria-hidden="true" className="text-[#D4CDC0]">·</span>
                <span className="font-display italic text-warning">Job Studio</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-xs text-subtle">
                <span className="font-semibold text-foreground">Job Studio</span>
                <span>· Autonomous Career Workspace &amp; Ground-Truth ATS Optimization</span>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="font-display italic text-warning">Job Studio</span>
              </div>
            </>
          )}
        </div>
      </footer>
    </div>
  );
}
