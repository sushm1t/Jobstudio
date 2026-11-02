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
  INITIAL_WEAVER_EVALUATION,
  INITIAL_WEAVER_RESUME,
  INITIAL_WEAVER_COVER_LETTER,
  INITIAL_SCREENING_ANSWERS,
  JobEvaluationData,
  TailoredResumeData,
  CoverLetterData,
  ScreeningAnswer,
  CandidateInfo,
  JobOpportunity,
} from './data/defaultData';
import { downloadResumeAsPdf } from './utils/pdfExport';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('resume');
  const [opportunities, setOpportunities] = useState<JobOpportunity[]>(PRESET_JOBS);
  const [selectedJobId, setSelectedJobId] = useState<string>('weaver-senior-associate');
  const [customJobText, setCustomJobText] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<string>(
    'https://recruiting2.ultipro.com/WEA1003WEAV/JobBoard/c4b626ed-a455-433e-9e34-c877b04aedb4/OpportunityDetail?opportunityId=bb20800c-9524-4e3a-be6d-4dd86a8b83e4'
  );

  const [evaluation, setEvaluation] = useState<JobEvaluationData>(INITIAL_WEAVER_EVALUATION);
  const [resume, setResume] = useState<TailoredResumeData>(INITIAL_WEAVER_RESUME);
  const [coverLetter, setCoverLetter] = useState<CoverLetterData>(INITIAL_WEAVER_COVER_LETTER);
  const [screeningAnswers, setScreeningAnswers] = useState<ScreeningAnswer[]>(INITIAL_SCREENING_ANSWERS);

  const [masterProfileText, setMasterProfileText] = useState<string>(SUSHMIT_PROFILE_TEXT);
  const [candidateInfo, setCandidateInfo] = useState<CandidateInfo>(SUSHMIT_USER_INFO);

  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Download PDF handler
  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    const safeTitle = (evaluation.company_name + '_' + evaluation.job_title).replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${safeTitle}_${resume.full_name.replace(/\s+/g, '_')}_Resume.pdf`;
    const success = await downloadResumeAsPdf('printable-resume-container', fileName);
    setIsDownloadingPdf(false);
    if (success) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }
  };

  // Switch preset or live discovered target opportunity
  const handleSelectPreset = (jobId: string) => {
    setSelectedJobId(jobId);
    const found = opportunities.find((j) => j.id === jobId);
    if (!found) return;

    if (jobId === 'weaver-senior-associate') {
      setEvaluation(INITIAL_WEAVER_EVALUATION);
      setResume(INITIAL_WEAVER_RESUME);
      setCoverLetter(INITIAL_WEAVER_COVER_LETTER);
      setScreeningAnswers(INITIAL_SCREENING_ANSWERS);
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
        missing_critical_skills: [],
        tailoring_recommendations: [
          'Highlight third-party vendor review workflows and regulatory adherence.',
          'Emphasize data-driven screening metrics and cross-functional incident mitigation.',
        ],
        location_info: found.location,
        executive_summary: `${found.matchHighlight} Candidate profile represents an estimated 94% qualification overlap for digital compliance operations.`,
      });
    } else {
      setCustomJobText(found.description);
      setCustomUrl(found.applyUrl);
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
        missing_critical_skills: [],
        tailoring_recommendations: [
          'Align accomplishment metrics with the specific product domain and scale.',
          'Emphasize cross-functional incident mitigation and process automation workflows.',
        ],
        location_info: found.location,
        executive_summary: `${found.matchHighlight} Candidate profile represents an estimated ${found.matchScore}% qualification overlap.`,
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

      setActiveTab('resume');
    } catch (err: any) {
      console.error('Error running evaluation:', err);
      alert('Failed to evaluate with Gemini API. Please check server logs or API key.');
    } finally {
      setIsEvaluating(false);
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

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            Candidate:{' '}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="font-semibold text-slate-800 hover:text-indigo-600 cursor-pointer underline decoration-dotted"
            >
              {candidateInfo.first_name} {candidateInfo.last_name}
            </button>{' '}
            · Vadakara, Kerala, India · Revolut Real-Time Analyst / SME
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              Edit Master Profile
            </button>
            <span aria-hidden="true">·</span>
            <span>Job Studio</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
