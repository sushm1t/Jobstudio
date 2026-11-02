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

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Action Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Tailored Executive Cover Letter
            </h2>
            <p className="text-xs text-slate-500">
              Addressed to <span className="font-semibold text-slate-800">{companyName}</span> for{' '}
              <span className="font-semibold text-slate-800">{jobTitle}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Cover Letter</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadTxt}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .txt</span>
          </button>
        </div>
      </div>

      {/* Styled Printable Letter Paper */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-none sm:rounded-sm p-8 sm:p-12 text-slate-900 font-sans leading-relaxed">
        {/* Recipient */}
        <div className="text-xs sm:text-sm text-slate-800 font-mono whitespace-pre-line mb-6 pb-4 border-b border-slate-200">
          {coverLetter.recipient}
        </div>

        {/* Subject */}
        <div className="text-sm sm:text-base font-bold text-slate-900 mb-6">
          {coverLetter.subject}
        </div>

        {/* Paragraphs */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed text-justify">
          {coverLetter.body_paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>

        {/* Signoff */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-xs sm:text-sm text-slate-900 whitespace-pre-line font-medium">
          {coverLetter.signoff}
        </div>
      </div>
    </div>
  );
};
