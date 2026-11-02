import React from 'react';
import { Download, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onDownloadPdf: () => void;
  isDownloading: boolean;
  downloadSuccess?: boolean;
  score?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onDownloadPdf,
  isDownloading,
  downloadSuccess = false,
  score = 92,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Universal Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Wordmark Brand Title (Single line, no subtitle pill) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
            JS
          </div>
          <button
            onClick={() => setActiveTab('evaluator')}
            className="text-left group cursor-pointer"
          >
            <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors whitespace-nowrap">
              Job Studio
            </span>
          </button>
        </div>

        {/* Zone 2: 4-5 concise single-line text navigation links with hover states */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('evaluator')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'evaluator'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                : 'hover:text-slate-900'
            }`}
          >
            Job Evaluator
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'resume'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                : 'hover:text-slate-900'
            }`}
          >
            Tailored Resume
          </button>
          <button
            onClick={() => setActiveTab('cover-letter')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'cover-letter'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                : 'hover:text-slate-900'
            }`}
          >
            Cover Letter
          </button>
          <button
            onClick={() => setActiveTab('screening')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'screening'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                : 'hover:text-slate-900'
            }`}
          >
            ATS Answers
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onDownloadPdf}
            disabled={isDownloading}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shadow-xs disabled:opacity-60 cursor-pointer ${
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
                <span>{isDownloading ? 'Exporting PDF...' : 'Download ATS PDF'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
