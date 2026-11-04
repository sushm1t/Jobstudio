// @ts-nocheck -- ported verbatim from the original project
import React, { useState } from 'react';
import { Copy, CheckCircle2, Download, FileText } from 'lucide-react';
import { CoverLetterData } from '../data/defaultData';
import { generatePlainTextCoverLetter } from '../utils/pdfExport';

interface CoverLetterViewProps {
  coverLetter: CoverLetterData;
  candidateName: string;
  companyName: string;
  jobTitle: string;
}

export const CoverLetterView: React.FC<CoverLetterViewProps> = ({
  coverLetter,
  candidateName,
  companyName,
  jobTitle,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = generatePlainTextCoverLetter(coverLetter, candidateName);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const text = generatePlainTextCoverLetter(coverLetter, candidateName);
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Cover_Letter_${companyName.replace(/\s+/g, '_')}_${candidateName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!coverLetter || !coverLetter.body_paragraphs || coverLetter.body_paragraphs.length === 0) {
    return (
      <div className="workspace-empty space-y-4 max-w-xl">
        <div className="w-14 h-14 rounded-full bg-surface flex items-center justify-center mx-auto">
          <FileText className="w-6 h-6 text-subtle" />
        </div>
        <div className="space-y-1.5">
          <h1 className="font-display text-xl font-semibold text-foreground">Cover Letter</h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
            Select an opportunity in Job Evaluator or evaluate a job description to automatically generate a tailored cover letter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="workspace-letter space-y-6 max-w-4xl mx-auto">
      {/* Action Bar */}
      <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div>
          <div className="flex items-center gap-2.5">
            <span className="bg-[rgba(120,120,128,0.12)] text-muted-foreground text-[11px] font-semibold rounded-md px-2 py-0.5 uppercase tracking-wide">Cover Letter</span>
            <h2 className="font-display text-base sm:text-lg font-semibold text-foreground">
              Tailored Cover Letter
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-1" style={{ fontFamily: 'var(--font-body)' }}>
            Addressed to <span className="font-semibold text-foreground">{companyName}</span> · {jobTitle}
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto text-xs">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-4 py-2 font-medium text-foreground bg-surface hover:bg-surface-2 border border-border rounded-full transition-all duration-200 cursor-pointer"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-subtle" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadTxt}
            className="inline-flex items-center gap-1.5 px-4 py-2 font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-full transition-all duration-200 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-primary-foreground" />
            <span>Export .txt</span>
          </button>
        </div>
      </div>

      {/* Styled Printable Letter Paper */}
      <div className="workspace-letter-paper paper p-8 sm:p-14 leading-relaxed">
        {/* Recipient */}
        <div className="text-xs sm:text-sm text-muted-foreground whitespace-pre-line mb-6 pb-4 border-b border-border/60">
          {coverLetter.recipient}
        </div>

        {/* Subject */}
        <div className="font-display text-base sm:text-lg font-semibold text-foreground mb-6">
          {coverLetter.subject}
        </div>

        {/* Paragraphs */}
        <div className="space-y-4 text-xs sm:text-sm text-foreground/80 leading-relaxed text-justify">
          {coverLetter.body_paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>

        {/* Signoff */}
        <div className="mt-8 pt-4 border-t border-border/60 text-xs sm:text-sm text-foreground whitespace-pre-line font-medium font-display">
          {coverLetter.signoff}
        </div>
      </div>
    </div>
  );
};
