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
} from 'lucide-react';
import { TailoredResumeData, WorkExperience, VERIFIED_CREDENTIALS, VAULT_PROJECTS } from '../data/defaultData';
import { downloadResumeAsPdf, printResumeVector, generatePlainTextResume } from '../utils/pdfExport';

interface ResumeDocumentProps {
  resume: TailoredResumeData;
  setResume: React.Dispatch<React.SetStateAction<TailoredResumeData>>;
  jobTitle?: string;
  companyName?: string;
  onRegenerateWithAi?: () => void;
  isAiGenerating?: boolean;
}

/**
 * Ensures date ranges are strictly pure dates (e.g. "Oct 2023 – Present", "Oct 2022 – Sep 2023")
 * and strips any trailing operational tags (e.g. "· Remote / Regulated Fintech") or location tags.
 */
export function formatTimelineDate(rawDate: string): string {
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
  jobTitle = 'Senior Associate – Resource Management',
  companyName = 'Weaver',
  onRegenerateWithAi,
  isAiGenerating,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newCert, setNewCert] = useState('');

  // Page layout & density controls
  const [fitSinglePage, setFitSinglePage] = useState(true);
  const [spacingDensity, setSpacingDensity] = useState<'compact' | 'standard' | 'roomy'>('compact');

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    const safeTitle = (companyName + '_' + jobTitle).replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${safeTitle}_${resume.full_name.replace(/\s+/g, '_')}_Resume.pdf`;
    const success = await downloadResumeAsPdf(
      'printable-resume-container',
      fileName,
      fitSinglePage
    );
    setIsDownloading(false);
    if (success) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }
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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Action and Control Bar */}
      <div className="no-print bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span>ATS-Optimized Resume Document</span>
              <span className="text-xs font-normal text-slate-500 font-mono">
                [Single-Column Standard]
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Tailored for <span className="font-semibold text-slate-800">{jobTitle}</span> at{' '}
              <span className="font-semibold text-slate-800">{companyName}</span>
            </p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {/* 1-Page Fit Toggle */}
          <button
            onClick={() => setFitSinglePage(!fitSinglePage)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              fitSinglePage
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title="Ensures document scales and fits exactly onto 1 pristine page without mid-line splitting"
          >
            {fitSinglePage ? <Minimize2 className="w-3.5 h-3.5 text-emerald-600" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{fitSinglePage ? '1-Page Fit: ON' : '1-Page Fit: OFF'}</span>
          </button>

          {/* Density Selector */}
          <div className="inline-flex items-center rounded-lg bg-slate-100 p-0.5 text-xs font-medium text-slate-600">
            <button
              onClick={() => setSpacingDensity('compact')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                spacingDensity === 'compact'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'hover:text-slate-900'
              }`}
              title="Compact density: Ideal for fitting comprehensive experience onto 1 page"
            >
              Compact (1-Page)
            </button>
            <button
              onClick={() => setSpacingDensity('standard')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                spacingDensity === 'standard'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              Standard
            </button>
          </div>

          {/* Edit / Preview Toggle */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              isEditing
                ? 'bg-indigo-100 text-indigo-900 border border-indigo-200 font-semibold'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {isEditing ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditing ? 'Preview Mode' : 'Edit Bullets'}</span>
          </button>

          {/* PM Projects (Credit Pilot / LazyTrip) Toggle */}
          <button
            onClick={toggleProductProjects}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              hasProjects
                ? 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold hover:bg-amber-200'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title={
              hasProjects
                ? 'Click to Chuck Product Projects (Credit Pilot / LazyTrip) — recommended for Ops/WFM roles to keep 1 page'
                : 'Click to Add Product Projects (Credit Pilot & LazyTrip) — only needed for PM / Product Management roles'
            }
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{hasProjects ? 'PM Projects: ON (Chuck)' : 'PM Projects: Chucked'}</span>
          </button>

          <button
            onClick={handleCopyPlainText}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            {copiedText ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Plaintext</span>
              </>
            )}
          </button>

          <button
            onClick={printResumeVector}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Opens system print dialog to save as pure vector PDF with automatic page-break preservation"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Vector PDF</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors shadow-xs cursor-pointer disabled:opacity-60 ${
              downloadSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white'
            }`}
          >
            {downloadSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>PDF Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>{isDownloading ? 'Exporting...' : 'Download PDF'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Printable / Renderable ATS Document Container */}
      <div className="flex justify-center">
        <div
          id="printable-resume-container"
          className={`w-full max-w-[816px] bg-white border border-slate-200 shadow-sm rounded-none sm:rounded-sm text-slate-900 font-sans ${densityStyles.containerPadding}`}
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
              <header className={`resume-header border-b-2 border-slate-900 text-center sm:text-left ${densityStyles.headerMargin}`}>
                <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 uppercase">
                  {resume.full_name}
                </h1>
                <div className="mt-1 text-xs sm:text-[13px] text-slate-700 flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-0.5">
                  <a
                    href={`mailto:${resume.email}`}
                    className="text-slate-800 hover:text-indigo-600 hover:underline transition-colors"
                    data-pdf-link={`mailto:${resume.email}`}
                    title="Send Email"
                  >
                    {resume.email}
                  </a>
                  <span className="text-slate-400">|</span>
                  <a
                    href={`tel:${resume.phone.replace(/[^0-9+]/g, '')}`}
                    className="text-slate-800 hover:text-indigo-600 hover:underline transition-colors"
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
                      <span className="text-slate-400">|</span>
                      <span>{resume.location}</span>
                    </>
                  )}
                  <span className="text-slate-400">|</span>
                  <a
                    id="resume-linkedin-link"
                    href={normalizedLinkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 font-semibold underline decoration-indigo-400 underline-offset-2 transition-colors inline-flex items-center gap-0.5"
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
            <h2 className={`resume-heading text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 ${densityStyles.sectionHeadingMargin}`}>
              Professional Summary
            </h2>
            {isEditing ? (
              <textarea
                value={resume.tailored_summary}
                onChange={(e) => updateSummary(e.target.value)}
                rows={4}
                className="w-full p-2 text-xs sm:text-sm border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 font-sans leading-relaxed"
              />
            ) : (
              <p className={`text-slate-800 text-justify ${densityStyles.summaryText}`}>
                {resume.tailored_summary}
              </p>
            )}
          </section>

          {/* Section: Core Competencies */}
          <section className={`resume-section break-inside-avoid ${densityStyles.sectionMargin}`}>
            <h2 className={`resume-heading text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 ${densityStyles.sectionHeadingMargin}`}>
              Core Competencies & Key Technical Stack
            </h2>
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {resume.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-slate-100 border border-slate-200 rounded text-slate-800"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => removeSkill(index)}
                        className="text-slate-400 hover:text-red-600 cursor-pointer"
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
                    className="text-xs px-2.5 py-1 border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 flex-1"
                  />
                  <button
                    onClick={addSkill}
                    className="px-3 py-1 text-xs bg-slate-900 text-white rounded hover:bg-slate-800 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>
            ) : (
              <p className={`text-slate-800 ${densityStyles.skillsText}`}>
                {resume.skills.join('  •  ')}
              </p>
            )}
          </section>

          {/* Section: Work Experience */}
          <section className={`resume-section break-inside-avoid ${densityStyles.sectionMargin}`}>
            <h2 className={`resume-heading text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 ${densityStyles.sectionHeadingMargin}`}>
              Professional Experience
            </h2>
            <div className={densityStyles.expSpacing}>
              {resume.experiences.map((exp, expIdx) => {
                const cleanDate = formatTimelineDate(exp.date_range);

                return (
                  <div key={expIdx} className="exp-block experience-item space-y-0.5 break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-0.5">
                      <div className={densityStyles.expTitle}>
                        <strong className="font-bold text-slate-950">{exp.title}</strong>{' '}
                        <span className="text-slate-400">|</span>{' '}
                        <span className="font-semibold text-slate-800">{exp.company}</span>
                      </div>
                      <div className={`text-slate-600 tabular-nums font-mono ${densityStyles.expMeta}`}>
                        {cleanDate}
                      </div>
                    </div>

                  {/* Bullet points */}
                  <ul className={`list-disc pl-4 sm:pl-5 text-slate-800 text-justify ${densityStyles.bulletSpacing} ${densityStyles.bulletText}`}>
                    {exp.bullets.map((bullet, bulletIdx) => (
                      <li key={bulletIdx} className="resume-bullet group break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
                        {isEditing ? (
                          <div className="flex items-start gap-1 py-0.5">
                            <textarea
                              value={bullet}
                              onChange={(e) => updateBullet(expIdx, bulletIdx, e.target.value)}
                              rows={2}
                              className="w-full text-xs p-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500"
                            />
                            <button
                              onClick={() => removeBullet(expIdx, bulletIdx)}
                              className="text-slate-400 hover:text-red-600 p-1 shrink-0 cursor-pointer"
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
                      className="mt-1 inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
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
              <div className={`flex items-center justify-between border-b border-slate-300 ${densityStyles.sectionHeadingMargin}`}>
                <h2 className="resume-heading text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-900">
                  Selected Proof of Work & AI/Product Projects
                </h2>
                {isEditing && (
                  <button
                    type="button"
                    onClick={chuckProjects}
                    className="no-print text-[11px] text-amber-700 hover:text-amber-900 font-semibold cursor-pointer underline decoration-amber-400"
                    title="Omit projects for operations / resource management / WFM roles"
                  >
                    Chuck All Projects (Omit for Ops/WFM)
                  </button>
                )}
              </div>
              <div className={densityStyles.expSpacing}>
                {resume.projects?.map((proj, pIdx) => (
                  <div key={pIdx} className="exp-block project-item space-y-0.5 break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-0.5">
                      <div className={densityStyles.expTitle}>
                        <strong className="font-bold text-slate-950">{proj.name}</strong>{' '}
                        {proj.role && (
                          <>
                            <span className="text-slate-400">|</span>{' '}
                            <span className="font-semibold text-slate-800">{proj.role}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {proj.target_alignment && (
                          <div className={`text-indigo-600 font-medium ${densityStyles.expMeta}`}>
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
                            className="no-print text-slate-400 hover:text-red-600 p-0.5 cursor-pointer"
                            title="Delete this project"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    {proj.description && (
                      <p className={`text-slate-700 italic text-[11px] sm:text-xs leading-snug`}>
                        {proj.description}
                      </p>
                    )}
                    <ul className={`list-disc pl-4 sm:pl-5 text-slate-800 text-justify ${densityStyles.bulletSpacing} ${densityStyles.bulletText}`}>
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
              <div className="no-print p-3 mb-3 bg-slate-50 border border-dashed border-slate-300 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-slate-900">Proof of Work / Product Projects:</span>{' '}
                  <span className="text-slate-600">
                    Currently chucked / omitted. (Recommended: Keep omitted for Operations, Resource Management, & WFM to guarantee clean 1-page fit).
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleProductProjects}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium cursor-pointer shrink-0"
                >
                  + Include Credit Pilot & LazyTrip (PM Roles)
                </button>
              </div>
            )
          )}

          {/* Section: Education & Certifications */}
          <section className={`resume-section education-section break-inside-avoid ${densityStyles.sectionMargin}`} style={{ pageBreakInside: 'avoid' }}>
            <h2 className={`resume-heading text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 ${densityStyles.sectionHeadingMargin}`}>
              Education & Certifications
            </h2>
            <div className={`${densityStyles.eduSpacing} ${densityStyles.eduText} text-slate-800`}>
              {resume.education.map((edu, idx) => (
                <div key={idx} className="education-item flex justify-between items-baseline break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
                  <div>
                    <strong>{edu.degree}</strong> – <span>{edu.institution}</span>
                  </div>
                  <div className="text-slate-600 font-mono tabular-nums text-[11px] sm:text-xs">
                    {edu.year}
                  </div>
                </div>
              ))}

              {/* Certifications Display & Edit Mode */}
              {isEditing ? (
                <div className="pt-2 space-y-2.5 border-t border-slate-200 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      Verified Professional Credentials (Toggle Top 3 for Resume):
                    </span>
                    <span className="text-[11px] text-indigo-700 font-semibold font-mono">
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
                          className={`text-left p-2 rounded-lg border transition-all flex items-start justify-between gap-2 cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-50/80 border-indigo-300 text-indigo-950 font-medium'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-semibold flex items-center gap-1.5">
                              <span className={isSelected ? 'text-indigo-600' : 'text-slate-400'}>
                                {isSelected ? '✓' : '+'}
                              </span>
                              <span>{cred.fullBadge}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 pl-4 mt-0.5">
                              {cred.coreCompetency}
                            </div>
                          </div>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-500'
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
                      <div className="text-[11px] font-semibold text-slate-700 mb-1">
                        Active Certifications on Resume:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {resume.certifications.map((cert, cIdx) => (
                          <span
                            key={cIdx}
                            className="inline-flex items-center gap-1.5 text-xs bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-slate-800"
                          >
                            <span>{cert}</span>
                            <button
                              type="button"
                              onClick={() => removeCertification(cIdx)}
                              className="text-slate-400 hover:text-red-600 cursor-pointer"
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
                      className="text-xs px-2.5 py-1 border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 flex-1"
                    />
                    <button
                      type="button"
                      onClick={addCustomCert}
                      className="px-3 py-1 text-xs bg-slate-900 text-white rounded hover:bg-slate-800 cursor-pointer"
                    >
                      Add Custom
                    </button>
                  </div>
                </div>
              ) : (
                resume.certifications.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 mt-2 space-y-1.5">
                    <div className="text-[10.5px] sm:text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                      Professional Certifications & Credentials
                    </div>
                    <div className="space-y-1">
                      {resume.certifications.slice(0, 3).map((cert, cIdx) => {
                        const parts = cert.split(/\s*[|–—]\s*/);
                        const title = parts[0]?.trim() || cert;
                        const issuer = parts.length > 1 ? parts.slice(1).join(' · ').trim() : '';

                        return (
                          <div
                            key={cIdx}
                            className="education-item flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-[11px] sm:text-[11.5px] text-slate-800 break-inside-avoid"
                            style={{ pageBreakInside: 'avoid' }}
                          >
                            <div className="flex items-baseline gap-1.5 font-medium text-slate-900">
                              <span className="text-slate-400 font-bold">•</span>
                              <span>{title}</span>
                            </div>
                            {issuer && (
                              <div className="text-slate-600 font-mono text-[10.5px] sm:text-[11px] shrink-0 text-left sm:text-right">
                                {issuer}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
