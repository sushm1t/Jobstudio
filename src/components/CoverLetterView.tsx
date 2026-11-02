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
      <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] p-10 text-center space-y-4 max-w-xl mx-auto" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div className="w-14 h-14 rounded-full bg-[#F5F5F7] flex items-center justify-center mx-auto">
          <FileText className="w-6 h-6 text-[#86868B]" />
        </div>
        <div className="space-y-1.5">
          <h3 className="font-display text-xl font-semibold text-[#1D1D1F]">
            No Cover Letter Generated Yet
          </h3>
          <p className="text-sm text-[#6E6E73] max-w-md mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
            Select an opportunity in Job Evaluator or evaluate a job description to automatically generate a tailored cover letter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Action Bar */}
      <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div>
          <div className="flex items-center gap-2.5">
            <span className="bg-[rgba(120,120,128,0.12)] text-[#6E6E73] text-[11px] font-semibold rounded-md px-2 py-0.5 uppercase tracking-wide">Cover Letter</span>
            <h2 className="font-display text-base sm:text-lg font-semibold text-[#1D1D1F]">
              Tailored Cover Letter
            </h2>
          </div>
          <p className="text-xs text-[#6E6E73] mt-1" style={{ fontFamily: 'var(--font-body)' }}>
            Addressed to <span className="font-semibold text-[#1D1D1F]">{companyName}</span> · {jobTitle}
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto text-xs">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-4 py-2 font-medium text-[#1D1D1F] bg-[#F5F5F7] hover:bg-[#E8E8ED] border border-[rgba(0,0,0,0.06)] rounded-full transition-all duration-200 cursor-pointer"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34C759]" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#86868B]" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadTxt}
            className="inline-flex items-center gap-1.5 px-4 py-2 font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-full transition-all duration-200 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>Export .txt</span>
          </button>
        </div>
      </div>

      {/* Styled Printable Letter Paper */}
      <div className="bg-white border border-[rgba(0,0,0,0.06)] rounded-none sm:rounded-2xl p-8 sm:p-14 text-[#1D1D1F] leading-relaxed" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)', fontFamily: 'var(--font-body)' }}>
        {/* Recipient */}
        <div className="text-xs sm:text-sm text-[#6E6E73] whitespace-pre-line mb-6 pb-4 border-b border-[#D2D2D7]/60">
          {coverLetter.recipient}
        </div>

        {/* Subject */}
        <div className="font-display text-base sm:text-lg font-semibold text-[#1D1D1F] mb-6">
          {coverLetter.subject}
        </div>

        {/* Paragraphs */}
        <div className="space-y-4 text-xs sm:text-sm text-[#1D1D1F]/80 leading-relaxed text-justify">
          {coverLetter.body_paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>

        {/* Signoff */}
        <div className="mt-8 pt-4 border-t border-[#D2D2D7]/60 text-xs sm:text-sm text-[#1D1D1F] whitespace-pre-line font-medium font-display">
          {coverLetter.signoff}
        </div>
      </div>
    </div>
  );
};
