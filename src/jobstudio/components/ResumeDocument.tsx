// @ts-nocheck -- ported verbatim from the original project
import React, { useState } from 'react';
import {
  Download,
  Printer,
  Copy,
  CheckCircle2,
  Edit3,
  Eye,
  Plus,
  Trash2,
  FileCheck,
  Maximize2,
  Minimize2,
  Sliders,
  FileText,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import { TailoredResumeData, WorkExperience, VERIFIED_CREDENTIALS, VAULT_PROJECTS } from '../data/defaultData';
import { downloadResumeAsPdf, printResumeVector, generatePlainTextResume } from '../utils/pdfExport';
import { downloadResumeAsDocx, downloadResumeAsPlainText } from '../utils/docxExport';

interface ResumeDocumentProps {
  resume: TailoredResumeData;
  setResume: React.Dispatch<React.SetStateAction<TailoredResumeData>>;
  jobTitle?: string;
  companyName?: string;
  onRegenerateWithAi?: () => void;
  isAiGenerating?: boolean;
  onOpenRecruiterReview?: () => void;
  isProUser?: boolean;
}

/**
 * Ensures date ranges are strictly pure dates (e.g. "Oct 2023 – Present", "Oct 2022 – Sep 2023")
 * and strips any trailing operational tags (e.g. "· Remote / Regulated Fintech") or location tags.
 */
function formatTimelineDate(rawDate: string): string {
  if (!rawDate) return '';
  // 1. Try matching pure timeline pattern: e.g. "Oct 2023 – Present", "Oct 2022 — Sep 2023", "Sep 2020 - Sep 2022"
  const match = rawDate.match(
    /^([A-Za-z]{3,9}\s+\d{4}|\d{4})\s*[\u2013\u2014\-–—to\s]+\s*([A-Za-z]{3,9}\s+\d{4}|\d{4}|Present|Current)/i
  );
  if (match) {
    return `${match[1]} – ${match[2]}`;
  }
  // 2. Fallback: Strip middle dots, bullets, and descriptors like (Remote / Regulated Fintech), India, etc.
  return rawDate
    .replace(/\s*[·•|/,-]\s*(remote|global operations|regulated fintech|kochi|hyderabad|india|onsite|hybrid).*$/gi, '')
    .replace(/\s*\((remote|global operations|regulated fintech|kochi|hyderabad|india|onsite|hybrid).*\)$/gi, '')
    .replace(/\s*[·•].*$/gi, '')
    .trim();
}

export const ResumeDocument: React.FC<ResumeDocumentProps> = ({
  resume,
  setResume,
  jobTitle = '',
  companyName = '',
  onRegenerateWithAi,
  isAiGenerating,
  onOpenRecruiterReview,
  isProUser = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDocxDownloading, setIsDocxDownloading] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [docxSuccess, setDocxSuccess] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newCert, setNewCert] = useState('');

  // Page layout & density controls
  const [fitSinglePage, setFitSinglePage] = useState(true);
  const [spacingDensity, setSpacingDensity] = useState<'compact' | 'standard' | 'roomy'>('compact');

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    const safeTitle = (companyName && jobTitle)
      ? (companyName + '_' + jobTitle).replace(/[^a-zA-Z0-9_-]/g, '_')
      : 'Master';
    const fileName = `${safeTitle}_${resume.full_name.replace(/\s+/g, '_')}_Resume.pdf`;
    const success = await downloadResumeAsPdf(
      'printable-resume-container',
      fileName,
      fitSinglePage,
      resume
    );
    setIsDownloading(false);
    if (success) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }
  };

  const handleDownloadDocx = () => {
    setIsDocxDownloading(true);
    const safeTitle = (companyName && jobTitle)
      ? (companyName + '_' + jobTitle).replace(/[^a-zA-Z0-9_-]/g, '_')
      : 'Master';
    const fileName = `${safeTitle}_${resume.full_name.replace(/\s+/g, '_')}_Resume.docx`;
    downloadResumeAsDocx(resume, fileName);
    setTimeout(() => {
      setIsDocxDownloading(false);
      setDocxSuccess(true);
      setTimeout(() => setDocxSuccess(false), 2500);
    }, 400);
  };

  const handleDownloadPlainText = () => {
    const safeTitle = (companyName && jobTitle)
      ? (companyName + '_' + jobTitle).replace(/[^a-zA-Z0-9_-]/g, '_')
      : 'Master';
    const fileName = `${safeTitle}_${resume.full_name.replace(/\s+/g, '_')}_Resume.txt`;
    downloadResumeAsPlainText(resume, fileName);
  };

  const handleCopyPlainText = () => {
    const text = generatePlainTextResume(resume);
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const updateSummary = (newVal: string) => {
    setResume((prev) => ({ ...prev, tailored_summary: newVal }));
  };

  const updateBullet = (expIndex: number, bulletIndex: number, newVal: string) => {
    setResume((prev) => {
      const exps = [...prev.experiences];
      const bullets = [...exps[expIndex].bullets];
      bullets[bulletIndex] = newVal;
      exps[expIndex] = { ...exps[expIndex], bullets };
      return { ...prev, experiences: exps };
    });
  };

  const addBullet = (expIndex: number) => {
    setResume((prev) => {
      const exps = [...prev.experiences];
      const bullets = [...exps[expIndex].bullets, 'New quantifiable accomplishment highlight'];
      exps[expIndex] = { ...exps[expIndex], bullets };
      return { ...prev, experiences: exps };
    });
  };

  const removeBullet = (expIndex: number, bulletIndex: number) => {
    setResume((prev) => {
      const exps = [...prev.experiences];
      const bullets = exps[expIndex].bullets.filter((_, idx) => idx !== bulletIndex);
      exps[expIndex] = { ...exps[expIndex], bullets };
      return { ...prev, experiences: exps };
    });
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    setResume((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill.trim()],
    }));
    setNewSkill('');
  };

  const removeSkill = (index: number) => {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, idx) => idx !== index),
    }));
  };

  const toggleCertification = (certBadge: string) => {
    setResume((prev) => {
      const exists = prev.certifications.some((c) => c.toLowerCase() === certBadge.toLowerCase());
      if (exists) {
        return {
          ...prev,
          certifications: prev.certifications.filter((c) => c.toLowerCase() !== certBadge.toLowerCase()),
        };
      } else {
        return {
          ...prev,
          certifications: [...prev.certifications, certBadge],
        };
      }
    });
  };

  const removeCertification = (index: number) => {
    setResume((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, idx) => idx !== index),
    }));
  };

  const addCustomCert = () => {
    if (!newCert.trim()) return;
    setResume((prev) => ({
      ...prev,
      certifications: [...prev.certifications, newCert.trim()],
    }));
    setNewCert('');
  };

  const hasProjects = Boolean(resume.projects && resume.projects.length > 0);

  const toggleProductProjects = () => {
    if (hasProjects) {
      setResume((prev) => ({
        ...prev,
        projects: [],
      }));
    } else {
      setResume((prev) => ({
        ...prev,
        projects: [...VAULT_PROJECTS],
      }));
    }
  };

  const chuckProjects = () => {
    setResume((prev) => ({
      ...prev,
      projects: [],
    }));
  };

  // Density-specific layout classes
  const densityStyles = {
    compact: {
      containerPadding: 'p-6 sm:px-10 sm:py-7',
      headerMargin: 'pb-2 mb-3',
      sectionMargin: 'mb-3',
      sectionHeadingMargin: 'pb-1 mb-1.5',
      summaryText: 'text-[12px] sm:text-[12.5px] leading-snug',
      skillsText: 'text-[11.5px] sm:text-[12px] leading-snug',
      expTitle: 'text-[12.5px] sm:text-[13px]',
      expMeta: 'text-[11px] sm:text-[11.5px]',
      expSpacing: 'space-y-2.5',
      bulletSpacing: 'space-y-0.5',
      bulletText: 'text-[11.5px] sm:text-[12px] leading-tight',
      eduSpacing: 'space-y-1',
      eduText: 'text-[11.5px] sm:text-[12px]',
    },
    standard: {
      containerPadding: 'p-8 sm:px-11 sm:py-9',
      headerMargin: 'pb-2.5 mb-4',
      sectionMargin: 'mb-4',
      sectionHeadingMargin: 'pb-1 mb-2',
      summaryText: 'text-xs sm:text-sm leading-relaxed',
      skillsText: 'text-xs sm:text-[13px] leading-relaxed',
      expTitle: 'text-xs sm:text-sm',
      expMeta: 'text-xs',
      expSpacing: 'space-y-3.5',
      bulletSpacing: 'space-y-1',
      bulletText: 'text-xs sm:text-[13px] leading-snug',
      eduSpacing: 'space-y-1.5',
      eduText: 'text-xs sm:text-[13px]',
    },
    roomy: {
      containerPadding: 'p-8 sm:p-12',
      headerMargin: 'pb-3 mb-5',
      sectionMargin: 'mb-5',
      sectionHeadingMargin: 'pb-1 mb-2.5',
      summaryText: 'text-sm leading-relaxed',
      skillsText: 'text-sm leading-relaxed',
      expTitle: 'text-sm',
      expMeta: 'text-xs',
      expSpacing: 'space-y-4',
      bulletSpacing: 'space-y-1.5',
      bulletText: 'text-sm leading-relaxed',
      eduSpacing: 'space-y-2',
      eduText: 'text-sm',
    },
  }[spacingDensity];

  return (
    <div className="workspace-resume space-y-5 max-w-5xl mx-auto">
      {/* Apple-style Control Bar */}
      <div className="workspace-document-toolbar no-print p-5 sm:p-6 flex flex-col items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-[var(--font-display)] text-base sm:text-lg font-semibold text-foreground">
              {jobTitle ? 'Tailored ATS Resume' : 'Master Career Resume'}
            </h2>
            <span
              className={`text-[11px] font-semibold rounded-md px-2 py-0.5 ${
                jobTitle
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-[rgba(120,120,128,0.12)] text-muted-foreground'
              }`}
            >
              {jobTitle ? 'Single-Column ATS' : 'Master Baseline'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {jobTitle && companyName ? (
              <>
                Optimized for <span className="font-semibold text-foreground">{jobTitle}</span> at{' '}
                <span className="font-semibold text-foreground">{companyName}</span>
              </>
            ) : (
              'Untailored master career baseline · Select a job in Job Evaluator to generate targeted tailoring'
            )}
          </p>
        </div>

        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-start md:justify-end text-xs">
          {/* Apple-style Segmented Density Switcher */}
          <div className="inline-flex items-center rounded-full bg-surface border border-border p-1 text-xs font-medium text-muted-foreground">
            <button
              onClick={() => setSpacingDensity('compact')}
              className={`px-3 py-1 rounded-full transition-all duration-200 cursor-pointer ${
                spacingDensity === 'compact'
                  ? 'bg-card text-foreground font-semibold shadow-elevated'
                  : 'hover:text-foreground'
              }`}
            >
              1-Page Fit
            </button>
            <button
              onClick={() => setSpacingDensity('standard')}
              className={`px-3 py-1 rounded-full transition-all duration-200 cursor-pointer ${
                spacingDensity === 'standard'
                  ? 'bg-card text-foreground font-semibold shadow-elevated'
                  : 'hover:text-foreground'
              }`}
            >
              Standard
            </button>
          </div>

          {/* Edit Toggle */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
              isEditing
                ? 'bg-primary border-brand text-primary-foreground font-semibold'
                : 'bg-surface border-border text-foreground hover:bg-surface-2'
            }`}
          >
            {isEditing ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditing ? 'Preview' : 'Edit Bullets'}</span>
          </button>

          {/* PM Projects Toggle */}
          <button
            onClick={toggleProductProjects}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
              hasProjects
                ? 'bg-primary text-primary-foreground border-brand font-semibold'
                : 'bg-surface border-border text-muted-foreground hover:text-foreground hover:bg-surface-2'
            }`}
            title="Toggle Product Projects (Credit Pilot & LazyTrip)"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{hasProjects ? 'Projects: ON' : '+ Add Projects'}</span>
          </button>

          {/* Recruiter Panel Multi-Persona Review */}
          {onOpenRecruiterReview && (
            <button
              onClick={onOpenRecruiterReview}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-info/10 hover:bg-info/10 border border-info/25 text-info font-semibold text-xs transition-all duration-200 cursor-pointer shadow-xs"
              title="Simulate 3-Person Hiring Panel Review (Senior Recruiter, Hiring Manager, Technical Lead)"
            >
              <UserCheck className="w-3.5 h-3.5 text-info" />
              <span>Recruiter Panel Review</span>
            </button>
          )}

          {/* Copy Plaintext */}
          <button
            onClick={handleCopyPlainText}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface border border-border hover:bg-surface-2 text-foreground transition-all duration-200 cursor-pointer"
          >
            {copiedText ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-subtle" />
                <span>Copy Text</span>
              </>
            )}
          </button>

          {/* Export Clean DOCX Button */}
          <button
            onClick={handleDownloadDocx}
            disabled={isDocxDownloading}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-semibold transition-all duration-200 cursor-pointer border ${
              docxSuccess
                ? 'bg-success text-primary-foreground border-success'
                : 'bg-card hover:bg-brand/10/60 text-brand border-brand/25 shadow-xs'
            }`}
            title="Download clean ATS-compliant Word document (.docx)"
          >
            {docxSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />
                <span>Saved DOCX</span>
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5 text-brand" />
                <span>{isDocxDownloading ? 'Generating...' : 'Export DOCX'}</span>
              </>
            )}
          </button>

          {/* Print / System Dialog */}
          <button
            onClick={printResumeVector}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface border border-border hover:bg-surface-2 text-foreground transition-all duration-200 cursor-pointer"
            title="Opens system print dialog to save as pure vector PDF"
          >
            <Printer className="w-3.5 h-3.5 text-subtle" />
            <span>Print</span>
          </button>

          {/* Download ATS PDF Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 ${
              downloadSuccess
                ? 'bg-success text-primary-foreground'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs'
            }`}
            title="Download ATS-compliant PDF with 100% selectable vector text"
          >
            {downloadSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />
                <span>Saved PDF</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-primary-foreground" />
                <span>{isDownloading ? 'Generating...' : 'Download ATS PDF'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Printable / Renderable ATS Document Container */}
      <div className="flex justify-center">
        <div
          id="printable-resume-container"
          className={`w-full max-w-[816px] bg-white border border-border shadow-[0_4px_24px_rgba(0,0,0,0.06)] rounded-none sm:rounded-2xl text-[#1D1D1F] font-sans ${densityStyles.containerPadding}`}
          style={{
            boxSizing: 'border-box',
          }}
        >
          {/* Header Contact Block */}
          {(() => {
            const normalizedLinkedIn = resume.linkedin.startsWith('http')
              ? resume.linkedin
              : `https://${resume.linkedin}`;
            const displayLinkedIn = resume.linkedin
              .replace(/^https?:\/\/(www\.)?/, '')
              .replace(/\/$/, '');

            return (
              <header className={`resume-header border-b-2 border-[#1D1D1F] text-center sm:text-left ${densityStyles.headerMargin}`}>
                <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-[#1D1D1F] uppercase">
                  {resume.full_name}
                </h1>
                <div className="mt-1 text-xs sm:text-[13px] text-[#6E6E73] flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-0.5">
                  <a
                    href={`mailto:${resume.email}`}
                    className="text-[#1D1D1F] hover:text-[#0071E3] hover:underline transition-colors duration-200"
                    data-pdf-link={`mailto:${resume.email}`}
                    title="Send Email"
                  >
                    {resume.email}
                  </a>
                  <span className="text-[#D2D2D7]">|</span>
                  <a
                    href={`tel:${resume.phone.replace(/[^0-9+]/g, '')}`}
                    className="text-[#1D1D1F] hover:text-[#0071E3] hover:underline transition-colors duration-200"
                    data-pdf-link={`tel:${resume.phone.replace(/[^0-9+]/g, '')}`}
                    title="Call Phone Number"
                  >
                    {resume.phone}
                  </a>
                  {resume.location &&
                   resume.location.trim().length > 0 &&
                   !resume.location.toLowerCase().includes('kochi') &&
                   !resume.location.toLowerCase().includes('hyderabad') && (
                    <>
                      <span className="text-[#D2D2D7]">|</span>
                      <span>{resume.location}</span>
                    </>
                  )}
                  <span className="text-[#D2D2D7]">|</span>
                  <a
                    id="resume-linkedin-link"
                    href={normalizedLinkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0071E3] hover:text-[#0077ED] font-semibold underline decoration-brand/40 underline-offset-2 transition-colors duration-200 inline-flex items-center gap-0.5"
                    data-pdf-link={normalizedLinkedIn}
                    title="Open LinkedIn Profile"
                  >
                    <span>{displayLinkedIn}</span>
                  </a>
                </div>
              </header>
            );
          })()}

          {/* Section: Professional Summary */}
          <section className={`resume-section break-inside-avoid ${densityStyles.sectionMargin}`}>
            <h2 className={`resume-heading text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#1D1D1F] border-b border-[#D2D2D7] ${densityStyles.sectionHeadingMargin}`}>
              Professional Summary
            </h2>
            {isEditing ? (
              <textarea
                value={resume.tailored_summary}
                onChange={(e) => updateSummary(e.target.value)}
                rows={4}
                className="w-full p-2 text-xs sm:text-sm border border-[#D2D2D7] rounded-xl focus:ring-1 focus:ring-[#0071E3] focus:border-[#0071E3] font-sans leading-relaxed outline-none transition-all duration-200"
              />
            ) : (
              <p className={`text-[#1D1D1F] text-justify ${densityStyles.summaryText}`}>
                {resume.tailored_summary}
              </p>
            )}
          </section>

          {/* Section: Core Competencies */}
          <section className={`resume-section break-inside-avoid ${densityStyles.sectionMargin}`}>
            <h2 className={`resume-heading text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#1D1D1F] border-b border-[#D2D2D7] ${densityStyles.sectionHeadingMargin}`}>
              Core Competencies & Key Technical Stack
            </h2>
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {resume.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-[#F5F5F7] border border-border rounded-lg text-[#1D1D1F]"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => removeSkill(index)}
                        className="text-[#86868B] hover:text-red-500 cursor-pointer transition-colors duration-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                    placeholder="Add skill (e.g. Looker, Resource Planning)..."
                    className="text-xs px-2.5 py-1.5 border border-[#D2D2D7] rounded-xl focus:ring-1 focus:ring-[#0071E3] focus:border-[#0071E3] flex-1 outline-none transition-all duration-200"
                  />
                  <button
                    onClick={addSkill}
                    className="px-3.5 py-1.5 text-xs bg-[#0071E3] text-white rounded-full hover:bg-[#0077ED] cursor-pointer transition-all duration-200 font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>
            ) : (
              <p className={`text-[#1D1D1F] ${densityStyles.skillsText}`}>
                {resume.skills.join('  •  ')}
              </p>
            )}
          </section>

          {/* Section: Work Experience */}
          <section className={`resume-section break-inside-avoid ${densityStyles.sectionMargin}`}>
            <h2 className={`resume-heading text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#1D1D1F] border-b border-[#D2D2D7] ${densityStyles.sectionHeadingMargin}`}>
              Professional Experience
            </h2>
            <div className={densityStyles.expSpacing}>
              {resume.experiences.map((exp, expIdx) => {
                const cleanDate = formatTimelineDate(exp.date_range);

                return (
                  <div key={expIdx} className="exp-block experience-item space-y-0.5 break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-0.5">
                      <div className={densityStyles.expTitle}>
                        <strong className="font-bold text-[#1D1D1F]">{exp.title}</strong>{' '}
                        <span className="text-[#D2D2D7]">|</span>{' '}
                        <span className="font-semibold text-[#1D1D1F]">{exp.company}</span>
                      </div>
                      <div className={`text-[#6E6E73] tabular-nums font-mono ${densityStyles.expMeta}`}>
                        {cleanDate}
                      </div>
                    </div>

                  {/* Bullet points */}
                  <ul className={`list-disc pl-4 sm:pl-5 text-[#1D1D1F] text-justify ${densityStyles.bulletSpacing} ${densityStyles.bulletText}`}>
                    {exp.bullets.map((bullet, bulletIdx) => (
                      <li key={bulletIdx} className="resume-bullet group break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
                        {isEditing ? (
                          <div className="flex items-start gap-1 py-0.5">
                            <textarea
                              value={bullet}
                              onChange={(e) => updateBullet(expIdx, bulletIdx, e.target.value)}
                              rows={2}
                              className="w-full text-xs p-1.5 border border-[#D2D2D7] rounded-xl focus:ring-1 focus:ring-[#0071E3] focus:border-[#0071E3] outline-none transition-all duration-200"
                            />
                            <button
                              onClick={() => removeBullet(expIdx, bulletIdx)}
                              className="text-[#86868B] hover:text-red-500 p-1 shrink-0 cursor-pointer transition-colors duration-200"
                              title="Delete bullet"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span>{bullet}</span>
                        )}
                      </li>
                    ))}
                  </ul>

                  {isEditing && (
                    <button
                      onClick={() => addBullet(expIdx)}
                      className="mt-1 inline-flex items-center gap-1 text-xs text-[#0071E3] hover:text-[#0077ED] font-medium cursor-pointer transition-colors duration-200"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Bullet Point</span>
                    </button>
                  )}
                </div>
              );
            })}
            </div>
          </section>

          {/* Section: Selected Projects & Proof of Work (Only included for PM roles) */}
          {hasProjects ? (
            <section className={`resume-section break-inside-avoid ${densityStyles.sectionMargin}`} style={{ pageBreakInside: 'avoid' }}>
              <div className={`flex items-center justify-between border-b border-[#D2D2D7] ${densityStyles.sectionHeadingMargin}`}>
                <h2 className="resume-heading text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#1D1D1F]">
                  Selected Proof of Work & AI/Product Projects
                </h2>
                {isEditing && (
                  <button
                    type="button"
                    onClick={chuckProjects}
                    className="no-print text-[11px] text-[#0071E3] hover:text-[#0077ED] font-semibold cursor-pointer underline decoration-brand/40 transition-colors duration-200"
                    title="Omit projects for operations / resource management / WFM roles"
                  >
                    Remove All Projects (Omit for Ops/WFM)
                  </button>
                )}
              </div>
              <div className={densityStyles.expSpacing}>
                {resume.projects?.map((proj, pIdx) => (
                  <div key={pIdx} className="exp-block project-item space-y-0.5 break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-0.5">
                      <div className={densityStyles.expTitle}>
                        <strong className="font-bold text-[#1D1D1F]">{proj.name}</strong>{' '}
                        {proj.role && (
                          <>
                            <span className="text-[#D2D2D7]">|</span>{' '}
                            <span className="font-semibold text-[#1D1D1F]">{proj.role}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {proj.target_alignment && (
                          <div className={`text-[#0071E3] font-medium ${densityStyles.expMeta}`}>
                            {proj.target_alignment}
                          </div>
                        )}
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() =>
                              setResume((prev) => ({
                                ...prev,
                                projects: (prev.projects || []).filter((_, idx) => idx !== pIdx),
                              }))
                            }
                            className="no-print text-[#86868B] hover:text-red-500 p-0.5 cursor-pointer transition-colors duration-200"
                            title="Delete this project"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    {proj.description && (
                      <p className={`text-[#6E6E73] italic text-[11px] sm:text-xs leading-snug`}>
                        {proj.description}
                      </p>
                    )}
                    <ul className={`list-disc pl-4 sm:pl-5 text-[#1D1D1F] text-justify ${densityStyles.bulletSpacing} ${densityStyles.bulletText}`}>
                      {proj.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="resume-bullet break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            isEditing && (
              <div className="no-print p-4 mb-3 bg-[#F5F5F7] border border-dashed border-[#D2D2D7] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-semibold text-[#1D1D1F]">Proof of Work / Product Projects:</span>{' '}
                  <span className="text-[#6E6E73]">
                    Currently omitted. (Recommended: Keep omitted for Operations, Resource Management, & WFM to guarantee clean 1-page fit).
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleProductProjects}
                  className="px-3.5 py-1.5 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full font-medium cursor-pointer shrink-0 transition-all duration-200"
                >
                  + Include Credit Pilot & LazyTrip (PM Roles)
                </button>
              </div>
            )
          )}

          {/* Section: Education */}
          <section className={`resume-section education-section break-inside-avoid ${densityStyles.sectionMargin}`} style={{ pageBreakInside: 'avoid' }}>
            <h2 className={`resume-heading text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#1D1D1F] border-b border-[#D2D2D7] ${densityStyles.sectionHeadingMargin}`}>
              Education
            </h2>
            <div className={`${densityStyles.eduSpacing} ${densityStyles.eduText} text-[#1D1D1F]`}>
              {resume.education.map((edu, idx) => (
                <div key={idx} className="education-item flex justify-between items-baseline break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
                  <div>
                    <strong>{edu.degree}</strong> – <span>{edu.institution}</span>
                  </div>
                  <div className="text-[#6E6E73] font-mono tabular-nums text-[11px] sm:text-xs">
                    {edu.year}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Certifications & Credentials (Cleanly separated) */}
          {(resume.certifications.length > 0 || isEditing) && (
            <section className={`resume-section certifications-section break-inside-avoid ${densityStyles.sectionMargin}`} style={{ pageBreakInside: 'avoid' }}>
              <h2 className={`resume-heading text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#1D1D1F] border-b border-[#D2D2D7] ${densityStyles.sectionHeadingMargin}`}>
                Certifications & Credentials
              </h2>
              <div className={`${densityStyles.eduSpacing} ${densityStyles.eduText} text-[#1D1D1F]`}>
                {isEditing ? (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#1D1D1F]">
                        Verified Professional Credentials (Toggle Top 3 for Resume):
                      </span>
                      <span className="text-[11px] text-[#0071E3] font-semibold font-mono">
                        {Math.min(resume.certifications.length, 3)} of 3 displayed
                      </span>
                    </div>

                    {/* Quick-toggle from Master Vault 5 verified credentials */}
                    <div className="grid grid-cols-1 gap-1.5">
                      {VERIFIED_CREDENTIALS.map((cred, cIdx) => {
                        const isSelected = resume.certifications.some(
                          (c) => c.toLowerCase() === cred.fullBadge.toLowerCase()
                        );
                        return (
                          <button
                            key={cIdx}
                            type="button"
                            onClick={() => toggleCertification(cred.fullBadge)}
                            className={`text-left p-2.5 rounded-xl border transition-all duration-200 flex items-start justify-between gap-2 cursor-pointer ${
                              isSelected
                                ? 'bg-[#0071E3]/5 border-[#0071E3]/30 text-[#1D1D1F] font-medium'
                                : 'bg-white border-border text-[#6E6E73] hover:border-[#D2D2D7]'
                            }`}
                          >
                            <div>
                              <div className="text-xs font-semibold flex items-center gap-1.5">
                                <span className={isSelected ? 'text-[#0071E3]' : 'text-[#86868B]'}>
                                  {isSelected ? '✓' : '+'}
                                </span>
                                <span>{cred.fullBadge}</span>
                              </div>
                              <div className="text-[11px] text-[#86868B] pl-4 mt-0.5">
                                {cred.coreCompetency}
                              </div>
                            </div>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                                isSelected
                                  ? 'bg-[#0071E3] text-white'
                                  : 'bg-[#F5F5F7] text-[#86868B]'
                              }`}
                            >
                              {isSelected ? 'Active' : 'Off'}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Active List with remove option */}
                    {resume.certifications.length > 0 && (
                      <div className="pt-1.5">
                        <div className="text-[11px] font-semibold text-[#6E6E73] mb-1">
                          Active Certifications on Resume:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {resume.certifications.map((cert, cIdx) => (
                            <span
                              key={cIdx}
                              className="inline-flex items-center gap-1.5 text-xs bg-[#F5F5F7] border border-border px-2.5 py-1 rounded-lg text-[#1D1D1F]"
                            >
                              <span>{cert}</span>
                              <button
                                type="button"
                                onClick={() => removeCertification(cIdx)}
                                className="text-[#86868B] hover:text-red-500 cursor-pointer transition-colors duration-200"
                                title="Remove certification"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add Custom Certification */}
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={newCert}
                        onChange={(e) => setNewCert(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addCustomCert()}
                        placeholder="Add custom certification..."
                        className="text-xs px-2.5 py-1.5 border border-[#D2D2D7] rounded-xl focus:ring-1 focus:ring-[#0071E3] focus:border-[#0071E3] flex-1 outline-none transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={addCustomCert}
                        className="px-3.5 py-1.5 text-xs bg-[#0071E3] text-white rounded-full hover:bg-[#0077ED] cursor-pointer transition-all duration-200 font-medium"
                      >
                        Add Custom
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {resume.certifications.slice(0, 4).map((cert, cIdx) => {
                      const parts = cert.split(/\s*[|–—]\s*/);
                      const title = parts[0]?.trim() || cert;
                      const issuer = parts.length > 1 ? parts.slice(1).join(' · ').trim() : '';

                      return (
                        <div
                          key={cIdx}
                          className="education-item flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-[11px] sm:text-[11.5px] text-[#1D1D1F] break-inside-avoid"
                          style={{ pageBreakInside: 'avoid' }}
                        >
                          <div className="flex items-baseline gap-1.5 font-medium text-[#1D1D1F]">
                            <span className="text-[#86868B] font-bold">•</span>
                            <span className="font-semibold">{title}</span>
                          </div>
                          {issuer && (
                            <div className="text-[#6E6E73] font-mono text-[10.5px] sm:text-[11px] shrink-0 text-left sm:text-right">
                              {issuer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
